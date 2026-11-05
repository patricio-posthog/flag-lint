import * as core from "@actions/core";
import * as github from "@actions/github";
import { runChecks } from "./checks";
import { extractReferences, languageFor, type FlagReference } from "./extract";
import { fetchFlags } from "./posthog";
import { annotations, COMMENT_MARKER, renderMarkdown } from "./report";
import fs from "fs";
import path from "path";
import { listFiles, removedReferences, scan } from "./scan";
import { addedLines, buildSuggestions, diffSuggestions } from "./suggestions";

async function run() {
  const apiKey = core.getInput("api-key", { required: true });
  const projectId = core.getInput("project-id", { required: true });
  const host = core.getInput("host") || "https://us.posthog.com";
  const wrappers = core.getInput("wrappers").split(",").map((w) => w.trim()).filter(Boolean);
  const failOnError = core.getBooleanInput("fail-on-error");
  const shouldComment = core.getBooleanInput("comment");
  const shouldAnnotate = core.getBooleanInput("annotations");
  const shouldSuggest = core.getBooleanInput("suggestions");
  const token = core.getInput("github-token");
  core.setSecret(apiKey);

  const dir = process.env.GITHUB_WORKSPACE ?? process.cwd();
  const pr = github.context.payload.pull_request;
  const octokit = github.getOctokit(token);
  const { owner, repo } = github.context.repo;

  // Ask the API for the PR's files instead of `git diff`, so a shallow checkout is enough.
  const allPrFiles = pr
    ? (await octokit.paginate(octokit.rest.pulls.listFiles, { owner, repo, pull_number: pr.number, per_page: 100 })).filter(
        (f) => languageFor(f.filename) || (f.previous_filename && languageFor(f.previous_filename)),
      )
    : [];
  const prFiles = allPrFiles.filter((f) => f.status !== "removed" && languageFor(f.filename));
  const files = pr ? prFiles.map((f) => f.filename) : listFiles(dir);
  core.info(`Scanning ${files.length} file(s)`);

  const references = await scan(dir, files, wrappers);
  const flags = await fetchFlags({ host, projectId, apiKey });
  const removed = pr ? await findRemovedReferences(octokit, owner, repo, pr.base.sha, allPrFiles, references, dir, wrappers) : [];
  const findings = runChecks(references, flags, removed);
  const sha = pr?.head.sha ?? github.context.sha;
  const blobUrl = `${github.context.serverUrl}/${owner}/${repo}/blob/${sha}`;
  // Re-running this run re-reads PostHog, so a flag fixed there turns the check green without a push.
  const rerunUrl = `${github.context.serverUrl}/${owner}/${repo}/actions/runs/${github.context.runId}`;
  const baseBlobUrl = pr ? `${github.context.serverUrl}/${owner}/${repo}/blob/${pr.base.sha}` : undefined;
  const body = renderMarkdown(findings, references, { host, projectId, blobUrl, baseBlobUrl, sha, rerunUrl });

  await core.summary.addRaw(body).write();
  if (pr && shouldComment) await upsertComment(octokit, owner, repo, pr.number, body);
  if (pr && shouldSuggest) {
    const changed = new Map(prFiles.map((f) => [f.filename, addedLines(f.patch)]));
    const lineOf = (file: string, line: number) => fs.readFileSync(path.join(dir, file), "utf8").split("\n")[line - 1];
    await syncSuggestions(octokit, owner, repo, pr.number, pr.head.sha, buildSuggestions(findings, lineOf, changed));
  }
  if (shouldAnnotate) {
    for (const a of annotations(findings)) {
      const props = { title: a.title, file: a.file, startLine: a.line, startColumn: a.column };
      a.severity === "error" ? core.error(a.message, props) : core.warning(a.message, props);
    }
  }

  const errors = findings.filter((f) => f.severity === "error").length;
  if (errors > 0 && failOnError) core.setFailed(`flag-lint found ${errors} problem(s) with feature flags`);
}

async function upsertComment(
  octokit: ReturnType<typeof github.getOctokit>,
  owner: string,
  repo: string,
  issueNumber: number,
  body: string,
) {
  const comments = await octokit.paginate(octokit.rest.issues.listComments, { owner, repo, issue_number: issueNumber, per_page: 100 });
  const existing = comments.find((c) => c.body?.includes(COMMENT_MARKER));
  if (existing) {
    await octokit.rest.issues.updateComment({ owner, repo, comment_id: existing.id, body });
  } else {
    await octokit.rest.issues.createComment({ owner, repo, issue_number: issueNumber, body });
  }
}

// Compares each changed file with its version on the base branch, read through the API so a
// shallow checkout is enough. Renamed files are compared with their previous path.
async function findRemovedReferences(
  octokit: ReturnType<typeof github.getOctokit>,
  owner: string,
  repo: string,
  baseSha: string,
  files: { filename: string; previous_filename?: string; status: string }[],
  references: FlagReference[],
  dir: string,
  wrappers: string[],
): Promise<FlagReference[]> {
  const removed: FlagReference[] = [];
  for (const file of files) {
    if (file.status === "added") continue;
    const basePath = file.previous_filename ?? file.filename;
    const baseSource = await fileAt(octokit, owner, repo, basePath, baseSha);
    if (baseSource === null) continue;
    const headSource = file.status === "removed" ? null : fs.readFileSync(path.join(dir, file.filename), "utf8");
    const baseRefs = await extractReferences(baseSource, basePath, { wrappers });
    const headRefs = references.filter((r) => r.file === file.filename);
    removed.push(...removedReferences(baseRefs, baseSource, headRefs, headSource));
  }
  return removed;
}

async function fileAt(octokit: ReturnType<typeof github.getOctokit>, owner: string, repo: string, filePath: string, ref: string): Promise<string | null> {
  try {
    const { data } = await octokit.rest.repos.getContent({ owner, repo, path: filePath, ref });
    return "content" in data && typeof data.content === "string" ? Buffer.from(data.content, "base64").toString("utf8") : null;
  } catch {
    return null;
  }
}

async function syncSuggestions(
  octokit: ReturnType<typeof github.getOctokit>,
  owner: string,
  repo: string,
  pullNumber: number,
  commitId: string,
  wanted: ReturnType<typeof buildSuggestions>,
) {
  const existing = await octokit.paginate(octokit.rest.pulls.listReviewComments, { owner, repo, pull_number: pullNumber, per_page: 100 });
  const { create, remove } = diffSuggestions(
    wanted,
    existing.map((c) => ({ id: c.id, path: c.path, line: c.line ?? null, body: c.body })),
  );
  for (const id of remove) await octokit.rest.pulls.deleteReviewComment({ owner, repo, comment_id: id });
  if (create.length > 0) {
    await octokit.rest.pulls.createReview({
      owner,
      repo,
      pull_number: pullNumber,
      commit_id: commitId,
      event: "COMMENT",
      comments: create.map((s) => ({ path: s.path, line: s.line, side: "RIGHT" as const, body: s.body })),
    });
  }
}

run().catch((error) => core.setFailed(error instanceof Error ? error.message : String(error)));

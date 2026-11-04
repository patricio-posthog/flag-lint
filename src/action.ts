import * as core from "@actions/core";
import * as github from "@actions/github";
import { runChecks } from "./checks";
import { languageFor } from "./extract";
import { fetchFlags } from "./posthog";
import { annotations, COMMENT_MARKER, renderMarkdown } from "./report";
import { listFiles, scan } from "./scan";

async function run() {
  const apiKey = core.getInput("api-key", { required: true });
  const projectId = core.getInput("project-id", { required: true });
  const host = core.getInput("host") || "https://us.posthog.com";
  const wrappers = core.getInput("wrappers").split(",").map((w) => w.trim()).filter(Boolean);
  const failOnError = core.getBooleanInput("fail-on-error");
  const shouldComment = core.getBooleanInput("comment");
  const shouldAnnotate = core.getBooleanInput("annotations");
  const token = core.getInput("github-token");
  core.setSecret(apiKey);

  const dir = process.env.GITHUB_WORKSPACE ?? process.cwd();
  const pr = github.context.payload.pull_request;
  const octokit = github.getOctokit(token);
  const { owner, repo } = github.context.repo;

  // Ask the API for the PR's files instead of `git diff`, so a shallow checkout is enough.
  const files = pr
    ? (await octokit.paginate(octokit.rest.pulls.listFiles, { owner, repo, pull_number: pr.number, per_page: 100 }))
        .filter((f) => f.status !== "removed" && languageFor(f.filename))
        .map((f) => f.filename)
    : listFiles(dir);
  core.info(`Scanning ${files.length} file(s)`);

  const references = await scan(dir, files, wrappers);
  const flags = await fetchFlags({ host, projectId, apiKey });
  const findings = runChecks(references, flags);
  const sha = pr?.head.sha ?? github.context.sha;
  const blobUrl = `${github.context.serverUrl}/${owner}/${repo}/blob/${sha}`;
  const body = renderMarkdown(findings, references, { host, projectId, blobUrl, sha, flags });

  await core.summary.addRaw(body).write();
  if (pr && shouldComment) await upsertComment(octokit, owner, repo, pr.number, body);
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

run().catch((error) => core.setFailed(error instanceof Error ? error.message : String(error)));

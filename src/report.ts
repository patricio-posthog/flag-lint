import type { Finding } from "./checks";
import type { FlagReference } from "./extract";
import type { Reach } from "./posthog";

export const COMMENT_MARKER = "<!-- flag-lint -->";

export interface ReportContext {
  host: string;
  projectId: string;
  // Used to link file:line references in a PR comment, e.g. https://github.com/o/r/blob/<sha>
  blobUrl?: string;
  sha?: string;
  // Base version of the PR, for calls the PR removed.
  baseBlobUrl?: string;
  // Last-7-day reach of every flag the PR touches that exists in PostHog.
  reach?: (Reach & { key: string; flagId: number })[];
  // The CI run, whose "Re-run" re-checks the PR against PostHog's current flags.
  rerunUrl?: string;
}

export function renderMarkdown(findings: Finding[], references: FlagReference[], context: ReportContext): string {
  const host = context.host.replace(/\/+$/, "");
  const flagsUrl = `${host}/project/${context.projectId}/feature_flags`;
  const errors = findings.filter((f) => f.severity === "error");
  const warnings = findings.filter((f) => f.severity === "warning");
  const files = new Set(references.map((r) => r.file)).size;
  const scope = `${plural(references.length, "flag reference")} across ${plural(files, "file")}`;
  const footer = `<sub>flag-lint · hackathon project${context.sha ? ` · updated for commit \`${context.sha.slice(0, 7)}\`` : ""}</sub>`;
  const lines = [COMMENT_MARKER, "### 🚩 PostHog feature flags", ""];

  if (references.length === 0) {
    lines.push("No feature flag references in the changed files.", "", footer);
    return lines.join("\n") + "\n";
  }
  if (findings.length === 0) {
    lines.push(`✅ ${references.length === 1 ? "The flag reference matches" : `All ${scope} match`} your PostHog project.`, "", ...reachSection(context, flagsUrl), footer);
    return lines.join("\n") + "\n";
  }

  const counts = [errors.length && `**${plural(errors.length, "problem")}**`, warnings.length && plural(warnings.length, "warning")];
  lines.push(`${counts.filter(Boolean).join(", ")} in ${scope}`, "", "| | Flag | Problem | Where |", "|---|---|---|---|");
  for (const finding of [...errors, ...warnings]) {
    const icon = finding.severity === "error" ? "❌" : "⚠️";
    const name = code(finding.key ?? finding.references[0].expression);
    const flag = finding.flagId === undefined ? name : `[${name}](${flagsUrl}/${finding.flagId})`;
    const where = finding.references.map((r) => location(r, context)).join(", ");
    const projectUrl = `${host}/project/${context.projectId}`;
    const links = [
      ...(finding.create && finding.key ? [`[Create it →](${createUrl(flagsUrl, finding.key, finding.create.variants)})`] : []),
      ...(finding.links ?? []).map((l) => `[${cell(l.label)} →](${projectUrl}/${l.path})`),
    ];
    lines.push(`| ${icon} | ${flag} | ${cell([finding.message, ...links].join(" · "))} | ${where} |`);
  }

  const recheck = context.rerunUrl ? [`[🔄 Re-check](${context.rerunUrl}) after fixing flags in PostHog`] : [];
  lines.push("", [`[View flags](${flagsUrl})`, ...recheck].join(" · "), "", ...mcpSection(findings, context.projectId), ...reachSection(context, flagsUrl), footer);
  return lines.join("\n") + "\n";
}

// The same fixes as the "Create it" links, written as one prompt for the PostHog MCP server.
// Only fixes that clearly belong in PostHog: typos and archived flags are fixed in code instead.
export function mcpPrompt(findings: Finding[], projectId: string): string | null {
  const steps: string[] = [];
  for (const f of findings) {
    if (!f.key) continue;
    if (f.kind === "missing" && f.create) {
      steps.push(
        f.create.variants
          ? `Create a multivariate feature flag with key \`${f.key}\` and the variants ${list(f.create.variants)}, split evenly. Leave it disabled.`
          : `Create a boolean feature flag with key \`${f.key}\`. Leave it disabled.`,
      );
    } else if (f.kind === "runtime") {
      steps.push(`Change the evaluation runtime of the feature flag \`${f.key}\` so it evaluates in both client and server SDKs.`);
    }
  }
  if (steps.length === 0) return null;
  return [`In my PostHog project ${projectId}, please:`, ...steps.map((s, i) => `${i + 1}. ${s}`)].join("\n");
}

function mcpSection(findings: Finding[], projectId: string): string[] {
  const prompt = mcpPrompt(findings, projectId);
  if (!prompt) return [];
  return ["#### 🤖 Or ask the PostHog MCP", "Paste this into an assistant connected to the PostHog MCP server:", "", "```text", prompt, "```", ""];
}

function list(items: string[]): string {
  const quoted = items.map((i) => `\`${i}\``);
  return quoted.length === 1 ? quoted[0] : `${quoted.slice(0, -1).join(", ")} and ${quoted[quoted.length - 1]}`;
}

// Who this change can affect: how many users each flag in the PR reached in production lately.
function reachSection(context: ReportContext, flagsUrl: string): string[] {
  if (!context.reach || context.reach.length === 0) return [];
  const rows = [...context.reach].sort((a, b) => b.users - a.users || a.key.localeCompare(b.key));
  return [
    "#### 👥 Who this PR can affect",
    "Users who saw each flag in the last 7 days.",
    "",
    "| Flag | Users |",
    "|---|---:|",
    ...rows.map((r) => `| [${code(r.key)}](${flagsUrl}/${r.flagId}) | ${compact(r.users)} |`),
    "",
  ];
}

function compact(n: number): string {
  if (n >= 1_000_000) return `${+(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${+(n / 1_000).toFixed(1)}k`;
  return String(n);
}

export function renderText(findings: Finding[], scannedReferences: number): string {
  if (findings.length === 0) return `flag-lint: ${plural(scannedReferences, "reference")} checked, no problems found.\n`;
  return (
    findings
      .map((f) => {
        const head = `${f.severity.toUpperCase()} ${f.key ?? f.references[0].expression}: ${f.message.replace(/`/g, "")}`;
        return [head, ...f.references.map((r) => `    ${r.file}:${r.line}`)].join("\n");
      })
      .join("\n") + "\n"
  );
}

export interface Annotation {
  severity: "error" | "warning";
  title: string;
  message: string;
  file: string;
  line: number;
  column: number;
}

// One annotation per reference, so each call site gets marked in the PR's "Files changed" tab.
// Removed calls have no line in the PR's version of the file to annotate.
export function annotations(findings: Finding[]): Annotation[] {
  return findings.flatMap((f) =>
    f.references.filter((r) => !r.removed).map((r) => ({
      severity: f.severity,
      title: `PostHog flag: ${f.key ?? r.expression}`,
      message: f.message.replace(/`/g, ""),
      file: r.file,
      line: r.line,
      column: r.column,
    })),
  );
}

// Prefills PostHog's new-flag form. The full /project/<id>/ path avoids a redirect, which would
// re-encode the query and turn keys like `1e3` into numbers.
export function createUrl(flagsUrl: string, key: string, variants: string[] | null): string {
  const params = new URLSearchParams({ key });
  if (variants) {
    params.set("type", "multivariate");
    params.set("variants", variants.join(","));
  }
  return `${flagsUrl}/new?${params.toString().replace(/%2C/g, ",")}`;
}

function plural(count: number, noun: string): string {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

// Inline code that survives backticks in the content (e.g. template literals).
function code(text: string): string {
  return cell(text.includes("`") ? `\`\` ${text} \`\`` : `\`${text}\``);
}

function cell(text: string): string {
  return text.replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function location(ref: FlagReference, context: ReportContext): string {
  const label = `\`${ref.file}:${ref.line}\`${ref.removed ? " (removed)" : ""}`;
  const blob = ref.removed ? context.baseBlobUrl : context.blobUrl;
  return blob ? `[${label}](${blob}/${ref.file}#L${ref.line})` : label;
}

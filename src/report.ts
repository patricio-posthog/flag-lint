import type { Finding } from "./checks";
import type { FlagReference } from "./extract";

export const COMMENT_MARKER = "<!-- flag-lint -->";

export interface ReportContext {
  host: string;
  projectId: string;
  // Used to link file:line references in a PR comment, e.g. https://github.com/o/r/blob/<sha>
  blobUrl?: string;
  sha?: string;
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
    lines.push(`✅ ${references.length === 1 ? "The flag reference matches" : `All ${scope} match`} your PostHog project.`, "", footer);
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

  lines.push("", `[View flags](${flagsUrl})`, "", footer);
  return lines.join("\n") + "\n";
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
export function annotations(findings: Finding[]): Annotation[] {
  return findings.flatMap((f) =>
    f.references.map((r) => ({
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
  const label = `\`${ref.file}:${ref.line}\``;
  return context.blobUrl ? `[${label}](${context.blobUrl}/${ref.file}#L${ref.line})` : label;
}

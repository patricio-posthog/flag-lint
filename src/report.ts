import type { Finding } from "./checks";
import type { FlagReference } from "./extract";

export const COMMENT_MARKER = "<!-- flag-lint -->";

export interface ReportContext {
  host: string;
  projectId: string;
  // Used to link file:line references in a PR comment, e.g. https://github.com/o/r/blob/<sha>
  blobUrl?: string;
}

export function renderMarkdown(findings: Finding[], scannedReferences: number, context: ReportContext): string {
  const lines = [COMMENT_MARKER, "### flag-lint", ""];
  const errors = findings.filter((f) => f.severity === "error");
  const warnings = findings.filter((f) => f.severity === "warning");

  if (findings.length === 0) {
    lines.push(
      scannedReferences === 0
        ? "No feature flag references in the changed files."
        : `All ${scannedReferences} feature flag reference${scannedReferences === 1 ? "" : "s"} match your PostHog project. ✅`,
    );
    return lines.join("\n") + "\n";
  }

  for (const finding of [...errors, ...warnings]) {
    const icon = finding.severity === "error" ? "❌" : "⚠️";
    const subject = finding.key === null ? "Dynamic flag key:" : `\`${finding.key}\``;
    lines.push(`${icon} ${subject} ${finding.message}`);
    for (const ref of finding.references) lines.push(`  - ${location(ref, context)}`);
  }

  const missing = errors.filter((f) => f.kind === "missing" && f.key);
  if (missing.length > 0) {
    const host = context.host.replace(/\/+$/, "");
    lines.push("", `[Create a feature flag in PostHog](${host}/project/${context.projectId}/feature_flags/new)`);
  }
  return lines.join("\n") + "\n";
}

export function renderText(findings: Finding[], scannedReferences: number): string {
  if (findings.length === 0) return `flag-lint: ${scannedReferences} reference(s) checked, no problems found.\n`;
  return (
    findings
      .map((f) => {
        const head = `${f.severity.toUpperCase()} ${f.key ?? "(dynamic)"}: ${f.message.replace(/`/g, "")}`;
        return [head, ...f.references.map((r) => `    ${r.file}:${r.line}`)].join("\n");
      })
      .join("\n") + "\n"
  );
}

function location(ref: FlagReference, context: ReportContext): string {
  const label = `${ref.file}:${ref.line}`;
  return context.blobUrl ? `[\`${label}\`](${context.blobUrl}/${ref.file}#L${ref.line})` : `\`${label}\``;
}

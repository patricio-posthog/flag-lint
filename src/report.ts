import type { Finding } from "./checks";
import type { FlagReference } from "./extract";
import type { Flag } from "./posthog";

export const COMMENT_MARKER = "<!-- flag-lint -->";

export interface ReportContext {
  host: string;
  projectId: string;
  // Used to link file:line references in a PR comment, e.g. https://github.com/o/r/blob/<sha>
  blobUrl?: string;
  sha?: string;
  // The project's flags, for the summary of every flag the PR touches.
  flags?: Flag[];
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
  const summary = flagSummary(references, context, flagsUrl, findings.length === 0);
  if (findings.length === 0) {
    lines.push(`✅ ${references.length === 1 ? "The flag reference matches" : `All ${scope} match`} your PostHog project.`, "", ...summary, footer);
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

  lines.push("", `[View flags](${flagsUrl})`, "", ...summary, footer);
  return lines.join("\n") + "\n";
}

// Every flag the PR touches and its current state, so a reviewer sees what the change affects
// even when nothing is wrong. Flags that need attention sort first.
const STATUSES = [
  { id: "missing", label: "❔ Not in PostHog", icon: "❔" },
  { id: "archived", label: "📦 Archived", icon: "📦" },
  { id: "off", label: "⚪ Off", icon: "⚪" },
  { id: "on", label: "🟢 On", icon: "🟢" },
] as const;

function flagSummary(references: FlagReference[], context: ReportContext, flagsUrl: string, open: boolean): string[] {
  if (!context.flags) return [];
  const refsByKey = new Map<string, FlagReference[]>();
  for (const ref of references) if (ref.key !== null) refsByKey.set(ref.key, [...(refsByKey.get(ref.key) ?? []), ref]);
  if (refsByKey.size === 0) return [];

  const byKey = new Map(context.flags.map((f) => [f.key, f]));
  const rows = [...refsByKey].map(([key, refs]) => {
    const flag = byKey.get(key);
    const status = !flag ? STATUSES[0] : flag.archived ? STATUSES[1] : flag.active ? STATUSES[3] : STATUSES[2];
    return { key, refs, flag, status };
  });
  rows.sort((a, b) => STATUSES.indexOf(a.status) - STATUSES.indexOf(b.status) || a.key.localeCompare(b.key));

  const counts = STATUSES.map((st) => [st, rows.filter((r) => r.status === st).length] as const)
    .filter(([, n]) => n > 0)
    .map(([st, n]) => `${st.icon} ${n}`);

  const lines = rows.map(({ key, refs, flag, status }) => {
    const shown = refs.slice(0, 2).map((r) => location(r, context));
    const usedIn = [...shown, ...(refs.length > 2 ? [`+${refs.length - 2} more`] : [])].join("<br>");
    if (!flag) return `| ${status.label} | ${code(key)} | – | ${usedIn} |`;

    const statusCell = [status.label, ...(flag.runningExperiments.length ? ["🧪 Experiment running"] : [])].join("<br>");
    const variants = flag.variants?.length ? `<br><sub>${flag.variants.map((v) => code(v)).join(" · ")}</sub>` : "";
    const runtime = flag.evaluationRuntime === "server" ? "🖥️ Server only" : flag.evaluationRuntime === "client" ? "🌐 Client only" : null;
    const rollout = [flag.variants ? `${plural(flag.variants.length, "variant")} · ${flag.release}` : flag.release, ...(runtime ? [`<sub>${runtime}</sub>`] : [])].join("<br>");
    return `| ${statusCell} | [${code(key)}](${flagsUrl}/${flag.id})${variants} | ${rollout} | ${usedIn} |`;
  });

  return [
    open ? "<details open>" : "<details>",
    `<summary><b>Flags in this PR</b> · ${plural(rows.length, "flag")} · ${counts.join(" · ")}</summary>`,
    "",
    "| Status | Flag | Rollout | Used in |",
    "|---|---|---|---|",
    ...lines,
    "",
    "</details>",
    "",
  ];
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

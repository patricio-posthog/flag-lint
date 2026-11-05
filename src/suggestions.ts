import type { Finding } from "./checks";

export const SUGGESTION_MARKER = "<!-- flag-lint-suggestion -->";

export interface Suggestion {
  path: string;
  line: number;
  body: string;
}

// Line numbers on the new side of a unified diff patch that the PR added or changed.
// GitHub only accepts review comments (and so suggestions) on lines inside the diff.
export function addedLines(patch: string | undefined): Set<number> {
  const lines = new Set<number>();
  let line = 0;
  for (const row of (patch ?? "").split("\n")) {
    const hunk = row.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
    if (hunk) {
      line = Number(hunk[1]);
    } else if (row.startsWith("+")) {
      lines.add(line++);
    } else if (!row.startsWith("-") && !row.startsWith("\\")) {
      line++;
    }
  }
  return lines;
}

// One suggestion per typo'd string literal on a line the PR touched, replacing just the quoted
// value so the rest of the line stays as written.
export function buildSuggestions(
  findings: Finding[],
  lineOf: (path: string, line: number) => string | undefined,
  changed: Map<string, Set<number>>,
): Suggestion[] {
  const suggestions: Suggestion[] = [];
  for (const finding of findings) {
    if (!finding.fix) continue;
    const { from, to } = finding.fix;
    for (const ref of finding.references) {
      if (!changed.get(ref.file)?.has(ref.line)) continue;
      const original = lineOf(ref.file, ref.line);
      if (original === undefined) continue;
      const quoted = new RegExp(`(["'\`])${escapeRegExp(from)}\\1`);
      const fixed = original.replace(quoted, (_, quote: string) => `${quote}${to}${quote}`);
      if (fixed === original) continue;
      suggestions.push({
        path: ref.file,
        line: ref.line,
        body: [SUGGESTION_MARKER, `**flag-lint:** \`${from}\` looks like a typo for \`${to}\`.`, "", "```suggestion", fixed, "```"].join("\n"),
      });
    }
  }
  return suggestions;
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// What to post and what to delete so the PR's flag-lint suggestions match the current findings,
// without re-posting identical ones on every run.
export function diffSuggestions(
  wanted: Suggestion[],
  existing: { id: number; path: string; line: number | null; body: string }[],
): { create: Suggestion[]; remove: number[] } {
  const ours = existing.filter((c) => c.body.includes(SUGGESTION_MARKER));
  const same = (a: Suggestion, b: (typeof ours)[number]) => a.path === b.path && a.line === b.line && a.body === b.body;
  return {
    create: wanted.filter((w) => !ours.some((c) => same(w, c))),
    remove: ours.filter((c) => !wanted.some((w) => same(w, c))).map((c) => c.id),
  };
}

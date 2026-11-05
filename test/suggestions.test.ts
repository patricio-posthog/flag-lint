import { describe, expect, it } from "vitest";
import { runChecks } from "../src/checks";
import type { FlagReference } from "../src/extract";
import { addedLines, buildSuggestions, diffSuggestions, SUGGESTION_MARKER } from "../src/suggestions";

const ref = (key: string, line: number, variants: { value: string; line: number }[] = []): FlagReference => ({
  key,
  expression: `"${key}"`,
  method: "getFeatureFlag",
  file: "src/a.ts",
  line,
  column: 1,
  variants: variants.map((v) => ({ ...v, column: 1 })),
  runtime: null,
});
const flag = (key: string, variants: string[] | null = null) => ({
  id: 1,
  key,
  active: true,
  archived: false,
  stale: false,
  variants,
  evaluationRuntime: null,
  runningExperiments: [], rolledOut: false,
});

describe("addedLines", () => {
  it("returns new-side line numbers of added lines only", () => {
    const patch = ["@@ -1,3 +1,4 @@", " keep", "-gone", "+new one", "+new two", " keep", "@@ -10,2 +11,3 @@", " ctx", "+later", "\\ No newline at end of file"].join("\n");
    expect([...addedLines(patch)]).toEqual([2, 3, 12]);
  });
});

describe("buildSuggestions", () => {
  const source: Record<number, string> = {
    3: '  const on = posthog.isFeatureEnabled("nuevo-buscdor");',
    4: "  if (layout === 'expandida') {",
    5: '  const untouched = posthog.isFeatureEnabled("nuevo-buscdor");',
  };
  const lineOf = (_: string, line: number) => source[line];
  const changed = new Map([["src/a.ts", new Set([3, 4])]]);
  const findings = runChecks(
    [ref("nuevo-buscdor", 3), ref("nuevo-buscdor", 5), ref("layout", 2, [{ value: "expandida", line: 4 }])],
    [flag("nuevo-buscador"), flag("layout", ["control", "expandido"])],
  );

  it("replaces only the typo'd literal, keeping its quotes, on lines the PR changed", () => {
    const suggestions = buildSuggestions(findings, lineOf, changed);
    expect(suggestions.map((s) => [s.line, s.body.split("\n").slice(-2, -1)[0]])).toEqual([
      [3, '  const on = posthog.isFeatureEnabled("nuevo-buscador");'],
      [4, "  if (layout === 'expandido') {"],
    ]);
    expect(suggestions[0].body).toContain("```suggestion");
  });

  it("skips findings without a likely fix", () => {
    const missing = runChecks([ref("brand-new", 3)], [flag("unrelated")]);
    expect(buildSuggestions(missing, lineOf, changed)).toEqual([]);
  });
});

describe("diffSuggestions", () => {
  const wanted = { path: "a.ts", line: 3, body: `${SUGGESTION_MARKER}\nfix` };

  it("keeps identical suggestions, deletes stale ones and ignores other comments", () => {
    const existing = [
      { id: 1, path: "a.ts", line: 3, body: wanted.body },
      { id: 2, path: "a.ts", line: 9, body: `${SUGGESTION_MARKER}\nold` },
      { id: 3, path: "a.ts", line: 9, body: "a human comment" },
    ];
    expect(diffSuggestions([wanted], existing)).toEqual({ create: [], remove: [2] });
    expect(diffSuggestions([wanted], [])).toEqual({ create: [wanted], remove: [] });
  });
});

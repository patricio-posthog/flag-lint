import { describe, expect, it } from "vitest";
import { runChecks } from "../src/checks";
import { extractReferences } from "../src/extract";
import { buildCleanups } from "../src/suggestions";

const flag = (key: string, rolledOut: boolean) => ({
  id: 1, key, active: true, archived: false, stale: false, variants: null, evaluationRuntime: null, runningExperiments: [], rolledOut,
});

const TS = [
  "function f() {",
  '  if (posthog.isFeatureEnabled("done")) {',
  "    renderNew();",
  "    track();",
  "  }",
  '  if (posthog.isFeatureEnabled("done")) {',
  "    a();",
  "  } else {",
  "    b();",
  "  }",
  '  if (posthog.isFeatureEnabled("done") && admin) {',
  "    c();",
  "  }",
  "}",
].join("\n");

const PY = ["def f():", '    if posthog.feature_enabled("done", uid):', "        render_new()", "", "        track()", "    return 1"].join("\n");

describe("if guards", () => {
  it("marks only an if whose whole condition is the flag call and that has no else (TS)", async () => {
    const refs = await extractReferences(TS, "a.ts");
    expect(refs.map((r) => r.guard ?? null)).toEqual([{ startLine: 2, endLine: 5, bodyStartLine: 3, bodyEndLine: 4 }, null, null]);
  });

  it("marks a Python if block", async () => {
    const refs = await extractReferences(PY, "a.py");
    expect(refs[0].guard).toEqual({ startLine: 2, endLine: 5, bodyStartLine: 3, bodyEndLine: 5 });
  });
});

describe("rolled-out cleanup", () => {
  const all = (source: string) => new Set(source.split("\n").map((_, i) => i + 1));
  const lineOf = (source: string) => (_: string, n: number) => source.split("\n")[n - 1];

  it("suggests unwrapping the if body one level out, for flags on for everyone", async () => {
    const refs = await extractReferences(TS, "a.ts");
    const findings = runChecks(refs, [flag("done", true)]);
    expect(findings).toMatchObject([{ kind: "rolled-out", severity: "warning" }]);
    const [cleanup] = buildCleanups(findings, lineOf(TS), new Map([["a.ts", all(TS)]]));
    expect(cleanup).toMatchObject({ startLine: 2, line: 5 });
    expect(cleanup.body.split("\n").slice(3)).toEqual(["```suggestion", "  renderNew();", "  track();", "```"]);
  });

  it("keeps blank lines when unwrapping Python", async () => {
    const refs = await extractReferences(PY, "a.py");
    const [cleanup] = buildCleanups(runChecks(refs, [flag("done", true)]), lineOf(PY), new Map([["a.py", all(PY)]]));
    expect(cleanup.body.split("\n").slice(3)).toEqual(["```suggestion", "    render_new()", "", "    track()", "```"]);
  });

  it("does nothing for flags that aren't rolled out, or when the if isn't in the diff", async () => {
    const refs = await extractReferences(TS, "a.ts");
    expect(runChecks(refs, [flag("done", false)])).toEqual([]);
    const findings = runChecks(refs, [flag("done", true)]);
    expect(buildCleanups(findings, lineOf(TS), new Map([["a.ts", new Set([2, 3])]]))).toEqual([]);
  });
});

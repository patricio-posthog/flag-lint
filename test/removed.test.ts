import { describe, expect, it } from "vitest";
import { runChecks } from "../src/checks";
import { extractReferences } from "../src/extract";
import { annotations, renderMarkdown } from "../src/report";
import { removedReferences } from "../src/scan";

const removedBetween = async (base: string, head: string | null) =>
  removedReferences(await extractReferences(base, "a.ts"), base, head === null ? [] : await extractReferences(head, "a.ts"), head);

describe("removedReferences", () => {
  const base = ['if (posthog.isFeatureEnabled("exp")) a()', 'if (posthog.isFeatureEnabled("exp")) b()', 'posthog.isFeatureEnabled("other")'].join("\n");

  it("returns calls whose line is gone and whose flag lost uses", async () => {
    const head = ['if (posthog.isFeatureEnabled("exp")) a()', 'posthog.isFeatureEnabled("other")'].join("\n");
    expect((await removedBetween(base, head)).map((r) => [r.key, r.line, r.removed])).toEqual([["exp", 2, true]]);
  });

  it("ignores moved or reformatted calls", async () => {
    const moved = ['posthog.isFeatureEnabled("other")', 'if (posthog.isFeatureEnabled("exp")) b()', 'if (posthog.isFeatureEnabled("exp"))  a()'].join("\n");
    expect(await removedBetween(base, moved)).toEqual([]);
  });

  it("returns every call of a deleted file", async () => {
    expect((await removedBetween(base, null)).map((r) => r.key)).toEqual(["exp", "exp", "other"]);
  });
});

describe("experiment-removed check", () => {
  const flag = (key: string, runningExperiments: { id: number; name: string }[] = []) => ({
    id: 7, key, active: true, archived: false, stale: false, variants: null, evaluationRuntime: null, runningExperiments,
  });
  const removedRef = { key: "exp", expression: '"exp"', method: "isFeatureEnabled", file: "a.ts", line: 2, column: 1, variants: [], runtime: null, removed: true };
  const keptRef = { ...removedRef, line: 1, removed: undefined };

  it("errors when a PR removes code for a flag with a running experiment, instead of the touch warning", () => {
    const findings = runChecks([keptRef], [flag("exp", [{ id: 3, name: "Home" }])], [removedRef]);
    expect(findings).toMatchObject([{ kind: "experiment-removed", severity: "error", links: [{ path: "experiments/3" }] }]);
  });

  it("stays quiet for flags without a running experiment", () => {
    expect(runChecks([], [flag("exp")], [removedRef])).toEqual([]);
  });

  it("links removed calls to the base version and doesn't annotate them", () => {
    const findings = runChecks([], [flag("exp", [{ id: 3, name: "Home" }])], [removedRef]);
    const markdown = renderMarkdown(findings, [keptRef], {
      host: "https://us.posthog.com", projectId: "1", blobUrl: "https://github.com/o/r/blob/head", baseBlobUrl: "https://github.com/o/r/blob/base",
    });
    expect(markdown).toContain("[`a.ts:2` (removed)](https://github.com/o/r/blob/base/a.ts#L2)");
    expect(annotations(findings)).toEqual([]);
  });
});

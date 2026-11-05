import { describe, expect, it } from "vitest";
import { runChecks } from "../src/checks";
import type { FlagReference } from "../src/extract";
import { annotations, renderMarkdown } from "../src/report";

const ref = (key: string | null, file: string, line: number, expression = `"${key}"`): FlagReference => ({
  key,
  expression,
  method: "isFeatureEnabled",
  file,
  line,
  column: 1,
  variants: [],
  runtime: null,
});
const context = { host: "https://us.posthog.com/", projectId: "1", blobUrl: "https://github.com/o/r/blob/abc1234def", sha: "abc1234def" };

describe("renderMarkdown", () => {
  it("renders a table of problems", () => {
    const references = [
      ref("new-chekout", "src/Checkout.tsx", 42),
      ref("old-banner", "src/Home.tsx", 17),
      ref("old-banner", "src/Nav.tsx", 8),
      ref(null, "src/exp.ts", 3, "`exp-${x}`"),
    ];
    const flags = [
      { id: 1, key: "new-checkout", active: true, archived: false, stale: false, variants: null, evaluationRuntime: null, runningExperiments: [] },
      { id: 2, key: "old-banner", active: true, archived: true, stale: false, variants: null, evaluationRuntime: null, runningExperiments: [] },
    ];
    expect(renderMarkdown(runChecks(references, flags), references, context)).toMatchInlineSnapshot(`
      "<!-- flag-lint -->
      ### 🚩 PostHog feature flags

      **2 problems**, 1 warning in 4 flag references across 4 files

      | | Flag | Problem | Where |
      |---|---|---|---|
      | ❌ | \`new-chekout\` | Doesn't exist. Did you mean \`new-checkout\`? | [\`src/Checkout.tsx:42\`](https://github.com/o/r/blob/abc1234def/src/Checkout.tsx#L42) |
      | ❌ | [\`old-banner\`](https://us.posthog.com/project/1/feature_flags/2) | Archived, but still used | [\`src/Home.tsx:17\`](https://github.com/o/r/blob/abc1234def/src/Home.tsx#L17), [\`src/Nav.tsx:8\`](https://github.com/o/r/blob/abc1234def/src/Nav.tsx#L8) |
      | ⚠️ | \`\` \`exp-\${x}\` \`\` | Dynamic key, can't be checked | [\`src/exp.ts:3\`](https://github.com/o/r/blob/abc1234def/src/exp.ts#L3) |

      [View flags](https://us.posthog.com/project/1/feature_flags)

      <sub>flag-lint · hackathon project · updated for commit \`abc1234\`</sub>
      "
    `);
  });

  it("uses one line when everything matches", () => {
    const one = renderMarkdown([], [ref("ok", "a.py", 1)], context);
    expect(one).toContain("✅ The flag reference matches your PostHog project.");
    const many = renderMarkdown([], [ref("ok", "a.py", 1), ref("ok", "b.py", 2), ref("x", "b.py", 5)], context);
    expect(many).toContain("✅ All 3 flag references across 2 files match your PostHog project.");
  });

  it("says so when the PR has no flag references", () => {
    expect(renderMarkdown([], [], context)).toContain("No feature flag references in the changed files.");
  });
});

describe("annotations", () => {
  it("marks every reference with plain-text messages", () => {
    const references = [ref("old", "src/a.ts", 3), ref("old", "src/b.ts", 7), ref(null, "src/c.ts", 1, "flagName")];
    const flags = [{ id: 1, key: "old", active: true, archived: true, stale: false, variants: null, evaluationRuntime: null, runningExperiments: [] }];
    expect(annotations(runChecks(references, flags))).toEqual([
      { severity: "error", title: "PostHog flag: old", message: "Archived, but still used", file: "src/a.ts", line: 3, column: 1 },
      { severity: "error", title: "PostHog flag: old", message: "Archived, but still used", file: "src/b.ts", line: 7, column: 1 },
      { severity: "warning", title: "PostHog flag: flagName", message: "Dynamic key, can't be checked", file: "src/c.ts", line: 1, column: 1 },
    ]);
  });
});

describe("create links", () => {
  const withVariants = (key: string, values: string[]): FlagReference => ({
    ...ref(key, "src/a.ts", 1),
    variants: values.map((value, i) => ({ value, line: 2 + i, column: 1 })),
  });
  const rowFor = (key: string, markdown: string) => markdown.split("\n").find((l) => l.includes(`\`${key}\``))!;

  it("links missing flags to a prefilled form, as multivariate when the code compares variants", () => {
    const references = [ref("new-banner", "src/a.ts", 1), withVariants("layout", ["compact", "wide"]), withVariants("ab", ["control", "b"])];
    const markdown = renderMarkdown(runChecks(references, []), references, context);
    const base = "https://us.posthog.com/project/1/feature_flags/new";
    expect(rowFor("new-banner", markdown)).toContain(`[Create it →](${base}?key=new-banner)`);
    expect(rowFor("layout", markdown)).toContain(`[Create it →](${base}?key=layout&type=multivariate&variants=control,compact,wide)`);
    expect(rowFor("ab", markdown)).toContain(`[Create it →](${base}?key=ab&type=multivariate&variants=control,b)`);
  });

  it("doesn't offer to create a likely typo", () => {
    const references = [ref("new-chekout", "src/a.ts", 1)];
    const flags = [{ id: 1, key: "new-checkout", active: true, archived: false, stale: false, variants: null, evaluationRuntime: null, runningExperiments: [] }];
    expect(renderMarkdown(runChecks(references, flags), references, context)).not.toContain("Create it");
  });
});

describe("finding links", () => {
  it("renders extra links next to the problem", () => {
    const references = [ref("exp", "src/a.ts", 1)];
    const flags = [{ id: 3, key: "exp", active: true, archived: false, stale: false, variants: null, evaluationRuntime: null, runningExperiments: [{ id: 12, name: "New checkout" }] }];
    expect(renderMarkdown(runChecks(references, flags), references, context)).toContain(
      '| ⚠️ | [`exp`](https://us.posthog.com/project/1/feature_flags/3) | Drives the running experiment "New checkout". Changing this code can skew the results · [View New checkout →](https://us.posthog.com/project/1/experiments/12) |',
    );
  });
});

describe("re-check link", () => {
  it("links to the CI run next to the problems", () => {
    const references = [ref("nope", "a.ts", 1)];
    const markdown = renderMarkdown(runChecks(references, []), references, { ...context, rerunUrl: "https://github.com/o/r/actions/runs/42" });
    expect(markdown).toContain("· [🔄 Re-check](https://github.com/o/r/actions/runs/42) after fixing flags in PostHog");
  });
});

import { describe, expect, it } from "vitest";
import { runChecks } from "../src/checks";
import type { FlagReference } from "../src/extract";
import { renderMarkdown } from "../src/report";

const ref = (key: string | null, file: string, line: number, expression = `"${key}"`): FlagReference => ({
  key,
  expression,
  method: "isFeatureEnabled",
  file,
  line,
  column: 1,
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
      { id: 1, key: "new-checkout", active: true, archived: false, stale: false },
      { id: 2, key: "old-banner", active: true, archived: true, stale: false },
    ];
    expect(renderMarkdown(runChecks(references, flags), references, context)).toMatchInlineSnapshot(`
      "<!-- flag-lint -->
      ### 🚩 PostHog feature flags

      **2 problems**, 1 warning in 4 flag references across 4 files

      | | Flag | Problem | Where |
      |---|---|---|---|
      | ❌ | \`new-chekout\` | Doesn't exist. Did you mean \`new-checkout\`? | [\`src/Checkout.tsx:42\`](https://github.com/o/r/blob/abc1234def/src/Checkout.tsx#L42) |
      | ❌ | \`old-banner\` | Archived, but still used | [\`src/Home.tsx:17\`](https://github.com/o/r/blob/abc1234def/src/Home.tsx#L17), [\`src/Nav.tsx:8\`](https://github.com/o/r/blob/abc1234def/src/Nav.tsx#L8) |
      | ⚠️ | \`\` \`exp-\${x}\` \`\` | Dynamic key, can't be checked | [\`src/exp.ts:3\`](https://github.com/o/r/blob/abc1234def/src/exp.ts#L3) |

      [Create missing flags in PostHog](https://us.posthog.com/project/1/feature_flags/new) · [View flags](https://us.posthog.com/project/1/feature_flags)

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

import { describe, expect, it } from "vitest";
import { runChecks } from "../src/checks";
import type { FlagReference } from "../src/extract";
import { mcpPrompt, renderMarkdown } from "../src/report";

const ref = (key: string, extra: Partial<FlagReference> = {}): FlagReference => ({
  key, expression: `"${key}"`, method: "isFeatureEnabled", file: "a.ts", line: 1, column: 1, variants: [], runtime: null, ...extra,
});
const flag = (key: string, extra: Record<string, unknown> = {}) => ({
  id: 1, key, active: true, archived: false, stale: false, variants: null, evaluationRuntime: null, runningExperiments: [], rolledOut: false, ...extra,
});

describe("MCP prompt", () => {
  it("turns missing flags and runtime mismatches into one numbered prompt", () => {
    const findings = runChecks(
      [
        ref("new-banner"),
        ref("layout", { method: "getFeatureFlag", variants: [{ value: "compact", line: 2, column: 1 }, { value: "wide", line: 3, column: 1 }] }),
        ref("srv", { runtime: "client" }),
      ],
      [flag("srv", { evaluationRuntime: "server" })],
    );
    expect(mcpPrompt(findings, "42")).toBe(
      [
        "In my PostHog project 42, please:",
        "1. Create a boolean feature flag with key `new-banner`. Leave it disabled.",
        "2. Create a multivariate feature flag with key `layout` and the variants `control`, `compact` and `wide`, split evenly. Leave it disabled.",
        "3. Change the evaluation runtime of the feature flag `srv` so it evaluates in both client and server SDKs.",
      ].join("\n"),
    );
  });

  it("leaves out typos and archived flags, and the section with them", () => {
    const references = [ref("new-chekout"), ref("old")];
    const findings = runChecks(references, [flag("new-checkout"), flag("old", { archived: true })]);
    expect(mcpPrompt(findings, "42")).toBeNull();
    expect(renderMarkdown(findings, references, { host: "https://us.posthog.com", projectId: "42" })).not.toContain("PostHog MCP");
  });

  it("renders the prompt as a copyable block", () => {
    const references = [ref("new-banner")];
    const markdown = renderMarkdown(runChecks(references, []), references, { host: "https://us.posthog.com", projectId: "42" });
    expect(markdown).toContain(
      "#### 🤖 Or ask the PostHog MCP\nPaste this into an assistant connected to the PostHog MCP server:\n\n```text\nIn my PostHog project 42, please:\n1. Create a boolean feature flag with key `new-banner`. Leave it disabled.\n```",
    );
  });
});

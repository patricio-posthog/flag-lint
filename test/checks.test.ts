import { describe, expect, it } from "vitest";
import { closestKey, runChecks } from "../src/checks";
import type { FlagReference } from "../src/extract";
import type { Flag } from "../src/posthog";

const ref = (key: string | null, line = 1): FlagReference => ({
  key,
  expression: key === null ? "someVar" : `"${key}"`,
  method: "isFeatureEnabled",
  file: "src/app.ts",
  line,
  column: 1,
});
const flag = (key: string, archived = false, extra: Partial<Flag> = {}): Flag => ({ id: 1, key, active: true, archived, stale: false, ...extra });

describe("runChecks", () => {
  it("reports missing flags once per key with every reference", () => {
    const findings = runChecks([ref("nope", 1), ref("nope", 9)], [flag("other")]);
    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({ kind: "missing", severity: "error", key: "nope" });
    expect(findings[0].references.map((r) => r.line)).toEqual([1, 9]);
  });

  it("suggests the closest existing key for typos", () => {
    const [finding] = runChecks([ref("new-chekout")], [flag("new-checkout"), flag("dark-mode")]);
    expect(finding.message).toContain("Did you mean `new-checkout`?");
  });

  it("doesn't suggest archived flags", () => {
    const [finding] = runChecks([ref("new-chekout")], [flag("new-checkout", true)]);
    expect(finding.message).not.toContain("Did you mean");
  });

  it("reports archived flags", () => {
    expect(runChecks([ref("old")], [flag("old", true)])).toMatchObject([{ kind: "archived", severity: "error" }]);
  });

  it("warns about disabled and stale flags without failing", () => {
    const findings = runChecks([ref("off"), ref("old")], [flag("off", false, { active: false }), flag("old", false, { stale: true })]);
    expect(findings).toMatchObject([
      { kind: "disabled", severity: "warning", key: "off" },
      { kind: "stale", severity: "warning", key: "old" },
    ]);
  });

  it("passes flags that exist", () => {
    expect(runChecks([ref("ok")], [flag("ok")])).toEqual([]);
  });

  it("warns about dynamic keys without failing", () => {
    expect(runChecks([ref(null)], [])).toMatchObject([{ kind: "dynamic", severity: "warning" }]);
  });
});

describe("closestKey", () => {
  it("ignores keys that are too different", () => {
    expect(closestKey("checkout", ["dark-mode", "beta"])).toBeNull();
  });
});

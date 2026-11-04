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
  variants: [],
  runtime: null,
});
const flag = (key: string, archived = false, extra: Partial<Flag> = {}): Flag => ({ id: 1, key, active: true, archived, stale: false, variants: null, evaluationRuntime: null, runningExperiments: [], ...extra });

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

describe("variant checks", () => {
  const withVariants = (key: string, uses: string[]): FlagReference => ({
    ...ref(key),
    variants: uses.map((value, i) => ({ value, line: 10 + i, column: 5 })),
  });

  it("flags variants that don't exist, pointing at the comparison", () => {
    const findings = runChecks([withVariants("layout", ["compacto", "expandida", "lista"])], [
      flag("layout", false, { variants: ["control", "compacto", "expandido"] }),
    ]);
    expect(findings.map((f) => [f.severity, f.message, f.references[0].line])).toEqual([
      ["error", "Variant `expandida` doesn't exist. Did you mean `expandido`?", 11],
      ["error", "Variant `lista` doesn't exist. Variants: `control`, `compacto`, `expandido`", 12],
    ]);
  });

  it("warns when a boolean flag is compared to a string", () => {
    expect(runChecks([withVariants("bool", ["v2"])], [flag("bool")])).toMatchObject([
      { severity: "warning", kind: "variant", message: "Boolean flag compared to `v2`, which never matches" },
    ]);
  });

  it("skips variant checks for missing flags", () => {
    expect(runChecks([withVariants("nope", ["a"])], []).map((f) => f.kind)).toEqual(["missing"]);
  });
});

describe("runtime and experiment checks", () => {
  const at = (key: string, runtime: "client" | "server" | null, line = 1): FlagReference => ({ ...ref(key, line), runtime });

  it("flags calls from the runtime a flag doesn't evaluate in", () => {
    const findings = runChecks([at("srv", "client", 3), at("srv", "server", 4), at("srv", null, 5)], [flag("srv", false, { evaluationRuntime: "server" })]);
    expect(findings).toMatchObject([{ kind: "runtime", severity: "error", message: "Set to evaluate on the server only, so it's always off in client code" }]);
    expect(findings[0].references.map((r) => r.line)).toEqual([3]);
  });

  it("ignores flags that evaluate everywhere", () => {
    expect(runChecks([at("all", "client")], [flag("all", false, { evaluationRuntime: "all" })])).toEqual([]);
  });

  it("warns when a flag drives a running experiment, linking to it", () => {
    const findings = runChecks([ref("exp")], [flag("exp", false, { runningExperiments: [{ id: 12, name: "New checkout" }] })]);
    expect(findings).toMatchObject([
      {
        kind: "experiment",
        severity: "warning",
        message: 'Drives the running experiment "New checkout". Changing this code can skew the results',
        links: [{ label: "View New checkout", path: "experiments/12" }],
      },
    ]);
  });
});

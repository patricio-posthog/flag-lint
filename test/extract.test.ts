import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { extractReferences } from "../src/extract";

const fixture = (name: string) => fs.readFileSync(path.join(__dirname, "fixtures", name), "utf8");
const summarize = async (name: string, wrappers?: string[]) =>
  (await extractReferences(fixture(name), name, { wrappers })).map((r) => [r.key ?? `<dynamic ${r.expression}>`, r.method, r.line]);

describe("extractReferences", () => {
  it("finds browser and React calls", async () => {
    expect(await summarize("app.tsx", ["useFlag"])).toEqual([
      ["new-checkout", "useFeatureFlagEnabled", 5],
      ["checkout-layout", "useFeatureFlagVariantKey", 6],
      ["promo-banner", "isFeatureEnabled", 7],
      ["checkout-config", "getFeatureFlagPayload", 10],
      ["<dynamic `exp-${variant}`>", "getFeatureFlag", 11],
      ["<dynamic FLAG_NAME>", "isFeatureEnabled", 12],
      ["custom-wrapper-flag", "useFlag", 13],
      ["beta-dashboard", "PostHogFeature", 16],
    ]);
  });

  it("ignores wrappers that aren't configured", async () => {
    const keys = (await summarize("app.tsx")).map(([key]) => key);
    expect(keys).not.toContain("custom-wrapper-flag");
  });

  it("finds Node legacy and snapshot calls", async () => {
    expect(await summarize("server.ts")).toEqual([
      ["server-legacy", "isFeatureEnabled", 6],
      ["server-snapshot", "isEnabled", 8],
      ["server-variant", "getFlag", 8],
    ]);
  });

  it("finds Python legacy, keyword and snapshot calls", async () => {
    expect(await summarize("views.py")).toEqual([
      ["py-legacy", "feature_enabled", 7],
      ["py-variant", "get_feature_flag", 9],
      ["py-payload", "get_feature_flag_payload", 10],
      ["py-snapshot", "is_enabled", 12],
      ['<dynamic f"exp-{variant}">', "feature_enabled", 14],
      ["<dynamic FLAG_KEY>", "feature_enabled", 15],
    ]);
  });

  it("skips unsupported files", async () => {
    expect(await extractReferences('isFeatureEnabled("x")', "README.md")).toEqual([]);
  });
});

describe("variant comparisons", () => {
  const variants = async (name: string) =>
    Object.fromEntries(
      (await extractReferences(fixture(name), name))
        .filter((r) => r.variants.length > 0)
        .map((r) => [r.key, r.variants.map((v) => `${v.value}@${v.line}`)]),
    );

  it("follows comparisons, switch and PostHogFeature match in TS", async () => {
    expect(await variants("variants.tsx")).toEqual({
      layout: ["compact@3", "wide@4", "grid@6", "list@8"],
      direct: ["a@11"],
      tema: ["retro@14"],
      snapshot: ["on@19"],
    });
  });

  it("follows comparisons, `in` and match/case in Python", async () => {
    expect(await variants("variants.py")).toEqual({
      layout: ["compact@3", "wide@5", "grid@5"],
      tema: ["retro@9", "moderna@11", "clasica@11"],
    });
  });
});

describe("runtime", () => {
  const runtimes = async (source: string, file: string) =>
    (await extractReferences(source, file)).map((r) => [r.key, r.runtime]);

  it("uses the file's imports for calls both SDKs share", async () => {
    expect(await runtimes(fixture("app.tsx"), "app.tsx")).toContainEqual(["promo-banner", "client"]);
    expect(await runtimes(fixture("server.ts"), "server.ts")).toEqual([
      ["server-legacy", "server"],
      ["server-snapshot", "server"],
      ["server-variant", "server"],
    ]);
  });

  it("treats React bindings as client and Python as server", async () => {
    expect(await runtimes('useFeatureFlagEnabled("a"); posthog.isFeatureEnabled("b")', "x.ts")).toEqual([
      ["a", "client"],
      ["b", null],
    ]);
    expect(await runtimes('posthog.feature_enabled("c", "u")', "x.py")).toEqual([["c", "server"]]);
  });

  it("stays unknown when a file imports both SDKs", async () => {
    const source = 'import posthog from "posthog-js"\nimport { PostHog } from "posthog-node"\nposthog.isFeatureEnabled("d")';
    expect(await runtimes(source, "x.ts")).toEqual([["d", null]]);
  });
});

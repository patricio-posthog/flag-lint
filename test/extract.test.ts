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

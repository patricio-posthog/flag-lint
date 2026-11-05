import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchReach } from "../src/posthog";
import { renderMarkdown } from "../src/report";

const config = { host: "https://us.posthog.com/", projectId: "1", apiKey: "phx_test" };

describe("fetchReach", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("queries $feature_flag_called for the last 7 days, only for keys with a safe charset", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ results: [["on", 3400, 12000]] }) });
    vi.stubGlobal("fetch", fetchMock);

    const reach = await fetchReach(config, ["on", "other", "bad'key"]);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://us.posthog.com/api/projects/1/query/");
    const query: string = JSON.parse(init.body).query.query;
    expect(query).toContain("event = '$feature_flag_called'");
    expect(query).toContain("INTERVAL 7 DAY");
    expect(query).toContain("IN ('on', 'other')");
    expect(query).not.toContain("bad'key");
    expect([...reach]).toEqual([["on", { users: 3400, evaluations: 12000 }]]);
  });

  it("throws on API errors so the action can skip the section", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 403, text: async () => "missing scope query:read" }));
    await expect(fetchReach(config, ["on"])).rejects.toThrow("403");
  });
});

describe("reach section", () => {
  const ref = { key: "on", expression: '"on"', method: "isFeatureEnabled", file: "a.ts", line: 1, column: 1, variants: [], runtime: null };
  const context = { host: "https://us.posthog.com", projectId: "1" };

  it("lists every flag's reach in its own section, busiest first", () => {
    const reach = [
      { key: "quiet", flagId: 2, users: 0, evaluations: 0 },
      { key: "on", flagId: 1, users: 3400, evaluations: 1_250_000 },
    ];
    const markdown = renderMarkdown([], [ref], { ...context, reach });
    const section = markdown.slice(markdown.indexOf("#### 👥"), markdown.indexOf("<sub>"));
    expect(section.split("\n")).toEqual([
      "#### 👥 Who this PR can affect",
      "Users and evaluations in the last 7 days, for every flag this PR touches.",
      "",
      "| Flag | Users | Evaluations |",
      "|---|---:|---:|",
      "| [`on`](https://us.posthog.com/project/1/feature_flags/1) | 3.4k | 1.3M |",
      "| [`quiet`](https://us.posthog.com/project/1/feature_flags/2) | 0 | 0 |",
      "",
      "",
    ]);
  });

  it("leaves the section out without reach data", () => {
    expect(renderMarkdown([], [ref], context)).not.toContain("Who this PR can affect");
  });
});

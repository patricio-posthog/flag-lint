export interface Flag {
  id: number;
  key: string;
  active: boolean;
  archived: boolean;
  stale: boolean;
}

export interface PostHogConfig {
  host: string;
  projectId: string;
  apiKey: string;
}

// The list endpoint hides archived flags unless `archived` is passed, so fetch both sets.
// Staleness comes from PostHog's own `active=STALE` filter rather than being recomputed here.
export async function fetchFlags(config: PostHogConfig): Promise<Flag[]> {
  const [live, archived, stale] = await Promise.all([
    fetchAll(config, ""),
    fetchAll(config, "&archived=true"),
    fetchAll(config, "&active=STALE"),
  ]);
  const staleKeys = new Set(stale.map((f) => f.key));
  const byKey = new Map<string, Flag>();
  for (const flag of [...live, ...archived]) byKey.set(flag.key, { ...flag, stale: staleKeys.has(flag.key) });
  return [...byKey.values()];
}

async function fetchAll(config: PostHogConfig, extraQuery: string): Promise<Flag[]> {
  const host = config.host.replace(/\/+$/, "");
  let url: string | null = `${host}/api/projects/${encodeURIComponent(config.projectId)}/feature_flags/?limit=200${extraQuery}`;
  const flags: Flag[] = [];
  while (url) {
    const response = await fetch(url, { headers: { Authorization: `Bearer ${config.apiKey}` } });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`PostHog API ${response.status} for ${url}: ${body.slice(0, 300)}`);
    }
    const page = (await response.json()) as { results: any[]; next: string | null };
    for (const f of page.results) {
      flags.push({ id: f.id, key: f.key, active: Boolean(f.active), archived: Boolean(f.archived), stale: false });
    }
    url = page.next;
  }
  return flags;
}

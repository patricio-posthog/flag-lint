export interface Flag {
  id: number;
  key: string;
  active: boolean;
  archived: boolean;
  stale: boolean;
  // Variant keys for multivariate flags, null for boolean ones.
  variants: string[] | null;
  // "client" or "server" when the flag is limited to one kind of SDK; "all" or null otherwise.
  evaluationRuntime: string | null;
  runningExperiments: { id: number; name: string }[];
  // On, boolean, person-based and with a release condition that matches everyone at 100%,
  // so every boolean check of it returns true.
  rolledOut: boolean;
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
      const variants = f.filters?.multivariate?.variants;
      flags.push({
        id: f.id,
        key: f.key,
        active: Boolean(f.active),
        archived: Boolean(f.archived),
        stale: false,
        variants: Array.isArray(variants) ? variants.map((v: { key: string }) => v.key) : null,
        evaluationRuntime: f.evaluation_runtime ?? null,
        runningExperiments: (f.experiment_set_metadata ?? [])
          .filter((e: { is_running: boolean }) => e.is_running)
          .map((e: { id: number; name: string }) => ({ id: e.id, name: e.name })),
        rolledOut: isRolledOut(f),
      });
    }
    url = page.next;
  }
  return flags;
}

function isRolledOut(f: any): boolean {
  const groups: { properties?: unknown[]; rollout_percentage?: number | null }[] = f.filters?.groups ?? [];
  return (
    Boolean(f.active) &&
    !f.archived &&
    !f.filters?.multivariate &&
    f.filters?.aggregation_group_type_index == null &&
    groups.some((g) => !g.properties?.length && (g.rollout_percentage ?? 100) === 100)
  );
}

export interface Reach {
  users: number;
}

// Distinct users per flag over the last 7 days, from `$feature_flag_called` events. Event counts
// aren't reported: ingestion dedupes these events per user, flag and response for an hour.
// Keys come from the project's own flag list, but are still checked against the flag key charset
// before going into the query.
export async function fetchReach(config: PostHogConfig, keys: string[]): Promise<Map<string, Reach>> {
  const safe = keys.filter((k) => /^[a-zA-Z0-9_-]+$/.test(k));
  const reach = new Map<string, Reach>();
  if (safe.length === 0) return reach;
  const query = `
    SELECT properties.$feature_flag AS flag, count(DISTINCT person_id) AS users
    FROM events
    WHERE event = '$feature_flag_called'
      AND timestamp > now() - INTERVAL 7 DAY
      AND properties.$feature_flag IN (${safe.map((k) => `'${k}'`).join(", ")})
    GROUP BY flag`;
  const host = config.host.replace(/\/+$/, "");
  const response = await fetch(`${host}/api/projects/${encodeURIComponent(config.projectId)}/query/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${config.apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query: { kind: "HogQLQuery", query } }),
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`PostHog query API ${response.status}: ${body.slice(0, 300)}`);
  }
  const data = (await response.json()) as { results: [string, number][] };
  for (const [flag, users] of data.results) reach.set(flag, { users });
  return reach;
}

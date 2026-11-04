import type { FlagReference } from "./extract";
import type { Flag } from "./posthog";

export type Severity = "error" | "warning";

export interface Finding {
  severity: Severity;
  kind: "missing" | "archived" | "disabled" | "stale" | "dynamic";
  key: string | null;
  message: string;
  references: FlagReference[];
}

export function runChecks(references: FlagReference[], flags: Flag[]): Finding[] {
  const byKey = new Map(flags.map((f) => [f.key, f]));
  const findings: Finding[] = [];

  for (const [key, refs] of groupByKey(references)) {
    const flag = byKey.get(key);
    if (!flag) {
      const suggestion = closestKey(key, flags.filter((f) => !f.archived).map((f) => f.key));
      findings.push({
        severity: "error",
        kind: "missing",
        key,
        message: suggestion ? `Doesn't exist. Did you mean \`${suggestion}\`?` : "Doesn't exist in this project",
        references: refs,
      });
    } else if (flag.archived) {
      findings.push({ severity: "error", kind: "archived", key, message: "Archived, but still used", references: refs });
    } else if (!flag.active) {
      findings.push({ severity: "warning", kind: "disabled", key, message: "Disabled, so it always evaluates to false", references: refs });
    } else if (flag.stale) {
      findings.push({
        severity: "warning",
        kind: "stale",
        key,
        message: "Looks stale (fully rolled out or not evaluated in 30+ days). Consider removing it",
        references: refs,
      });
    }
  }

  for (const ref of references.filter((r) => r.key === null)) {
    findings.push({
      severity: "warning",
      kind: "dynamic",
      key: null,
      message: "Dynamic key, can't be checked",
      references: [ref],
    });
  }
  return findings;
}

function groupByKey(references: FlagReference[]): Map<string, FlagReference[]> {
  const groups = new Map<string, FlagReference[]>();
  for (const ref of references) {
    if (ref.key === null) continue;
    groups.set(ref.key, [...(groups.get(ref.key) ?? []), ref]);
  }
  return groups;
}

export function closestKey(key: string, candidates: string[]): string | null {
  // Allow roughly one typo per 4 characters, capped at 3.
  const maxDistance = Math.min(3, Math.max(1, Math.floor(key.length / 4)));
  let best: string | null = null;
  let bestDistance = Infinity;
  for (const candidate of candidates) {
    const distance = levenshtein(key, candidate);
    if (distance <= maxDistance && distance < bestDistance) {
      best = candidate;
      bestDistance = distance;
    }
  }
  return best;
}

function levenshtein(a: string, b: string): number {
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++) {
      current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    previous = current;
  }
  return previous[b.length];
}

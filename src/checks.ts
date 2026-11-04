import type { FlagReference } from "./extract";
import type { Flag } from "./posthog";

export type Severity = "error" | "warning";

export interface Finding {
  severity: Severity;
  kind: "missing" | "archived" | "disabled" | "stale" | "variant" | "runtime" | "experiment" | "dynamic";
  key: string | null;
  // Set when the flag exists in PostHog, to link to it.
  flagId?: number;
  // Set for missing flags that aren't a likely typo: what a "create it" link should prefill.
  create?: { variants: string[] | null };
  // Extra links, relative to the project (e.g. `experiments/12`).
  links?: { label: string; path: string }[];
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
        create: suggestion ? undefined : { variants: inferVariants(refs) },
        references: refs,
      });
    } else if (flag.archived) {
      findings.push({ severity: "error", kind: "archived", key, flagId: flag.id, message: "Archived, but still used", references: refs });
    } else if (!flag.active) {
      findings.push({ severity: "warning", kind: "disabled", key, flagId: flag.id, message: "Disabled, so it always evaluates to false", references: refs });
    } else if (flag.stale) {
      findings.push({
        severity: "warning",
        kind: "stale",
        key,
        flagId: flag.id,
        message: "Looks stale (fully rolled out or not evaluated in 30+ days). Consider removing it",
        references: refs,
      });
    }
    if (flag && !flag.archived) {
      findings.push(...variantFindings(flag, refs), ...runtimeFindings(flag, refs), ...experimentFindings(flag, refs));
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

// Compares the variant names used in code with the flag's real variants. Each finding points at
// the comparison itself, not the call, so the annotation lands on the line with the wrong name.
function variantFindings(flag: Flag, refs: FlagReference[]): Finding[] {
  const unknown = new Map<string, FlagReference[]>();
  for (const ref of refs) {
    for (const use of ref.variants) {
      if (flag.variants?.includes(use.value)) continue;
      const at = { ...ref, line: use.line, column: use.column };
      unknown.set(use.value, [...(unknown.get(use.value) ?? []), at]);
    }
  }
  return [...unknown].map(([value, at]): Finding => {
    if (flag.variants === null) {
      return {
        severity: "warning",
        kind: "variant",
        key: flag.key,
        flagId: flag.id,
        message: `Boolean flag compared to \`${value}\`, which never matches`,
        references: at,
      };
    }
    const suggestion = closestKey(value, flag.variants);
    return {
      severity: "error",
      kind: "variant",
      key: flag.key,
      flagId: flag.id,
      message: suggestion
        ? `Variant \`${value}\` doesn't exist. Did you mean \`${suggestion}\`?`
        : `Variant \`${value}\` doesn't exist. Variants: ${flag.variants.map((v) => `\`${v}\``).join(", ")}`,
      references: at,
    };
  });
}

// A flag limited to one evaluation runtime is never served to the other kind of SDK, so the
// call silently returns undefined/false there.
function runtimeFindings(flag: Flag, refs: FlagReference[]): Finding[] {
  const limitedTo = flag.evaluationRuntime;
  if (limitedTo !== "client" && limitedTo !== "server") return [];
  const wrong = refs.filter((r) => r.runtime !== null && r.runtime !== limitedTo);
  if (wrong.length === 0) return [];
  const message =
    limitedTo === "server"
      ? "Set to evaluate on the server only, so it's always off in client code"
      : "Set to evaluate in client SDKs only, so it's always off in server code";
  return [{ severity: "error", kind: "runtime", key: flag.key, flagId: flag.id, message, references: wrong }];
}

// Only says the PR touches files that use the flag: removed call sites aren't visible from the head commit.
function experimentFindings(flag: Flag, refs: FlagReference[]): Finding[] {
  if (flag.runningExperiments.length === 0) return [];
  const names = flag.runningExperiments.map((e) => `"${e.name}"`).join(", ");
  return [
    {
      severity: "warning",
      kind: "experiment",
      key: flag.key,
      flagId: flag.id,
      message: `Drives the running experiment${flag.runningExperiments.length > 1 ? "s" : ""} ${names}. Changing this code can skew the results`,
      links: flag.runningExperiments.map((e) => ({ label: `View ${e.name}`, path: `experiments/${e.id}` })),
      references: refs,
    },
  ];
}

// Variant names the code compares against, with `control` first since PostHog and experiments expect it.
// null when the code never compares the value, so the flag is created as a boolean.
function inferVariants(refs: FlagReference[]): string[] | null {
  const used = [...new Set(refs.flatMap((r) => r.variants.map((v) => v.value)))];
  if (used.length === 0) return null;
  return used.includes("control") ? used : ["control", ...used];
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

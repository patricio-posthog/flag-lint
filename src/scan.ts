import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";
import { extractReferences, languageFor, type FlagReference } from "./extract";

const IGNORED_DIRS = new Set(["node_modules", ".git", "dist", "build", "venv", ".venv", "__pycache__", "site-packages"]);

// Files changed between `base` and HEAD (added/modified/renamed only), or every supported file.
export function listFiles(dir: string, base?: string): string[] {
  if (base) {
    const out = execFileSync("git", ["diff", "--name-only", "--diff-filter=AMR", `${base}...HEAD`], { cwd: dir, encoding: "utf8" });
    return out.split("\n").filter((f) => f && languageFor(f) && !f.split("/").some((p) => IGNORED_DIRS.has(p)));
  }
  const files: string[] = [];
  const walk = (rel: string) => {
    for (const entry of fs.readdirSync(path.join(dir, rel), { withFileTypes: true })) {
      const child = rel ? `${rel}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        if (!IGNORED_DIRS.has(entry.name)) walk(child);
      } else if (languageFor(entry.name)) {
        files.push(child);
      }
    }
  };
  walk("");
  return files;
}

export async function scan(dir: string, files: string[], wrappers: string[] = []): Promise<FlagReference[]> {
  const references: FlagReference[] = [];
  for (const file of files) {
    const source = fs.readFileSync(path.join(dir, file), "utf8");
    references.push(...(await extractReferences(source, file, { wrappers })));
  }
  return references;
}

// Flag calls the PR removed from one file: present in the base version, with their line no longer
// in the new version, capped by how many uses of that flag the file lost. Moving or reformatting a
// call therefore doesn't count as removing it. Returned references point at the base version.
export function removedReferences(
  baseRefs: FlagReference[],
  baseSource: string,
  headRefs: FlagReference[],
  headSource: string | null,
): FlagReference[] {
  const headLines = new Set((headSource ?? "").split("\n").map((l) => l.trim()));
  const baseLines = baseSource.split("\n");
  const removed: FlagReference[] = [];
  const keys = new Set(baseRefs.flatMap((r) => (r.key === null ? [] : [r.key])));
  for (const key of keys) {
    const before = baseRefs.filter((r) => r.key === key);
    const lost = before.length - headRefs.filter((r) => r.key === key).length;
    if (lost <= 0) continue;
    const gone = before.filter((r) => !headLines.has((baseLines[r.line - 1] ?? "").trim()));
    removed.push(...gone.slice(0, lost).map((r) => ({ ...r, removed: true })));
  }
  return removed;
}

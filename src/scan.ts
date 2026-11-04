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

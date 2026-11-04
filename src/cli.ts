import path from "path";
import { parseArgs } from "util";
import { runChecks } from "./checks";
import { fetchFlags } from "./posthog";
import { renderMarkdown, renderText } from "./report";
import { listFiles, scan } from "./scan";

const USAGE = `Usage: flag-lint --project-id <id> [--dir .] [--host https://us.posthog.com] [--base <git ref>] [--wrappers useFlag,isOn] [--format text|markdown]

Reads the personal API key from POSTHOG_API_KEY. Without --base, scans every supported file.`;

async function main() {
  const { values } = parseArgs({
    options: {
      dir: { type: "string", default: "." },
      "project-id": { type: "string" },
      host: { type: "string", default: "https://us.posthog.com" },
      base: { type: "string" },
      wrappers: { type: "string", default: "" },
      format: { type: "string", default: "text" },
      help: { type: "boolean", default: false },
    },
  });
  const apiKey = process.env.POSTHOG_API_KEY;
  if (values.help || !values["project-id"] || !apiKey) {
    console.error(USAGE);
    process.exit(values.help ? 0 : 2);
  }

  const dir = path.resolve(values.dir!);
  const wrappers = values.wrappers!.split(",").map((w) => w.trim()).filter(Boolean);
  const files = listFiles(dir, values.base);
  const references = await scan(dir, files, wrappers);
  const flags = await fetchFlags({ host: values.host!, projectId: values["project-id"]!, apiKey });
  const findings = runChecks(references, flags);

  process.stdout.write(
    values.format === "markdown"
      ? renderMarkdown(findings, references, { host: values.host!, projectId: values["project-id"]!, flags })
      : renderText(findings, references.length),
  );
  process.exit(findings.some((f) => f.severity === "error") ? 1 : 0);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(2);
});

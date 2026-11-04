import fs from "fs";
import { createRequire } from "module";
import path from "path";
import Parser = require("web-tree-sitter");

export type Language = "typescript" | "tsx" | "javascript" | "python";

export interface FlagReference {
  // null when the key isn't a string literal (variable, template, f-string...)
  key: string | null;
  expression: string;
  method: string;
  file: string;
  line: number;
  column: number;
}

const JS_METHODS = [
  "isFeatureEnabled",
  "getFeatureFlag",
  "getFeatureFlagPayload",
  "getFeatureFlagResult",
  "useFeatureFlagEnabled",
  "useFeatureFlagVariantKey",
  "useFeatureFlagPayload",
];
const PY_METHODS = [
  "feature_enabled",
  "is_feature_enabled",
  "get_feature_flag",
  "get_feature_flag_payload",
  "get_feature_flag_result",
];
// Snapshot API from evaluateFlags(). The names are generic, so only match them as method calls.
const JS_SNAPSHOT_METHODS = ["isEnabled", "getFlag", "getPayload"];
const PY_SNAPSHOT_METHODS = ["is_enabled", "get_flag", "get_payload"];

const EXTENSIONS: Record<string, Language> = {
  ".ts": "typescript",
  ".mts": "typescript",
  ".cts": "typescript",
  ".tsx": "tsx",
  ".js": "javascript",
  ".jsx": "javascript",
  ".mjs": "javascript",
  ".cjs": "javascript",
  ".py": "python",
};

export function languageFor(file: string): Language | null {
  return EXTENSIONS[path.extname(file)] ?? null;
}

// Bundled: dist/<entry>/wasm (see scripts/copy-wasm.js). From source (tests): node_modules.
// The resolve goes through createRequire with a computed path so ncc doesn't try to bundle the .wasm.
function wasmPath(name: string): string {
  const bundled = path.join(__dirname, "wasm", name);
  if (fs.existsSync(bundled)) return bundled;
  const pkg = name === "tree-sitter.wasm" ? "web-tree-sitter" : "tree-sitter-wasms/out";
  return createRequire(__filename).resolve([pkg, name].join("/"));
}

let initialized: Promise<void> | null = null;
const languages = new Map<Language, Promise<Parser.Language>>();

async function parserFor(language: Language): Promise<Parser> {
  initialized ??= Parser.init({ locateFile: () => wasmPath("tree-sitter.wasm") });
  await initialized;
  if (!languages.has(language)) {
    languages.set(language, Parser.Language.load(wasmPath(`tree-sitter-${language}.wasm`)));
  }
  const parser = new Parser();
  parser.setLanguage(await languages.get(language)!);
  return parser;
}

export interface ExtractOptions {
  // Extra function names (e.g. a team's own `useFlag` wrapper) whose first argument is a flag key.
  wrappers?: string[];
}

export async function extractReferences(
  source: string,
  file: string,
  options: ExtractOptions = {},
): Promise<FlagReference[]> {
  const language = languageFor(file);
  if (!language) return [];

  const parser = await parserFor(language);
  const tree = parser.parse(source);
  const isPython = language === "python";
  const methods = new Set([...(isPython ? PY_METHODS : JS_METHODS), ...(options.wrappers ?? [])]);
  const snapshotMethods = new Set(isPython ? PY_SNAPSHOT_METHODS : JS_SNAPSHOT_METHODS);

  const references: FlagReference[] = [];
  const visit = (node: Parser.SyntaxNode) => {
    if (node.type === (isPython ? "call" : "call_expression")) {
      const ref = isPython
        ? pythonCall(node, methods, snapshotMethods)
        : jsCall(node, methods, snapshotMethods);
      if (ref) references.push({ ...ref, file, line: node.startPosition.row + 1, column: node.startPosition.column + 1 });
    } else if (!isPython && (node.type === "jsx_opening_element" || node.type === "jsx_self_closing_element")) {
      const ref = jsxFeature(node);
      if (ref) references.push({ ...ref, file, line: node.startPosition.row + 1, column: node.startPosition.column + 1 });
    }
    for (const child of node.namedChildren) visit(child);
  };
  visit(tree.rootNode);
  tree.delete();
  parser.delete();
  return references;
}

type CallMatch = Pick<FlagReference, "key" | "expression" | "method">;

function jsCall(node: Parser.SyntaxNode, methods: Set<string>, snapshotMethods: Set<string>): CallMatch | null {
  const fn = node.childForFieldName("function");
  if (!fn) return null;
  let method: string | null = null;
  if (fn.type === "identifier") {
    method = methods.has(fn.text) ? fn.text : null;
  } else if (fn.type === "member_expression") {
    const name = fn.childForFieldName("property")?.text ?? "";
    method = methods.has(name) || snapshotMethods.has(name) ? name : null;
  }
  if (!method) return null;

  const arg = node.childForFieldName("arguments")?.namedChildren[0];
  if (!arg) return null;
  return { method, key: jsStringValue(arg), expression: arg.text };
}

function jsStringValue(node: Parser.SyntaxNode): string | null {
  if (node.type === "string") return node.text.slice(1, -1);
  if (node.type === "template_string" && !node.namedChildren.some((c) => c.type === "template_substitution")) {
    return node.text.slice(1, -1);
  }
  return null;
}

function jsxFeature(node: Parser.SyntaxNode): CallMatch | null {
  if (node.childForFieldName("name")?.text !== "PostHogFeature") return null;
  for (const attr of node.namedChildren) {
    if (attr.type !== "jsx_attribute") continue;
    const [name, value] = attr.namedChildren;
    if (name?.text !== "flag" || !value) continue;
    // flag="key" or flag={"key"}
    const inner = value.type === "jsx_expression" ? value.namedChildren[0] : value;
    return { method: "PostHogFeature", key: inner ? jsStringValue(inner) : null, expression: value.text };
  }
  return null;
}

function pythonCall(node: Parser.SyntaxNode, methods: Set<string>, snapshotMethods: Set<string>): CallMatch | null {
  const fn = node.childForFieldName("function");
  if (!fn) return null;
  let method: string | null = null;
  if (fn.type === "identifier") {
    method = methods.has(fn.text) ? fn.text : null;
  } else if (fn.type === "attribute") {
    const name = fn.childForFieldName("attribute")?.text ?? "";
    method = methods.has(name) || snapshotMethods.has(name) ? name : null;
  }
  if (!method) return null;

  const args = node.childForFieldName("arguments")?.namedChildren ?? [];
  // feature_enabled("key", ...) or feature_enabled(key="key", ...)
  const keyword = args.find((a) => a.type === "keyword_argument" && a.childForFieldName("name")?.text === "key");
  const arg = keyword ? keyword.childForFieldName("value") : args.find((a) => a.type !== "keyword_argument");
  if (!arg) return null;
  return { method, key: pythonStringValue(arg), expression: arg.text };
}

function pythonStringValue(node: Parser.SyntaxNode): string | null {
  if (node.type !== "string" || node.namedChildren.some((c) => c.type === "interpolation")) return null;
  const match = node.text.match(/^[rRbBuU]*("""|'''|"|')([\s\S]*)\1$/);
  return match ? match[2] : null;
}

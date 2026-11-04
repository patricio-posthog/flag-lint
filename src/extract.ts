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
  // Variant names the code compares the flag's value against.
  variants: VariantUse[];
}

export interface VariantUse {
  value: string;
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
// Calls whose return value is the variant name, so comparisons against them are worth checking.
const VARIANT_METHODS = new Set(["getFeatureFlag", "useFeatureFlagVariantKey", "getFlag", "get_feature_flag", "get_flag"]);

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
      if (ref) {
        const variants = VARIANT_METHODS.has(ref.method) ? variantUses(node, isPython) : [];
        references.push({ ...ref, variants, file, line: node.startPosition.row + 1, column: node.startPosition.column + 1 });
      }
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
type JsxMatch = CallMatch & Pick<FlagReference, "variants">;

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

function jsxFeature(node: Parser.SyntaxNode): JsxMatch | null {
  if (node.childForFieldName("name")?.text !== "PostHogFeature") return null;
  let match: JsxMatch | null = null;
  const variants: VariantUse[] = [];
  for (const attr of node.namedChildren) {
    if (attr.type !== "jsx_attribute") continue;
    const [name, value] = attr.namedChildren;
    if (!value) continue;
    // flag="key" or flag={"key"}; same for match="variant" (match={true} is the boolean form)
    const inner = value.type === "jsx_expression" ? value.namedChildren[0] : value;
    const literal = inner ? jsStringValue(inner) : null;
    if (name?.text === "flag") match = { method: "PostHogFeature", key: literal, expression: value.text, variants };
    if (name?.text === "match" && literal !== null) variants.push(variantUse(literal, inner!));
  }
  return match;
}

function variantUse(value: string, node: Parser.SyntaxNode): VariantUse {
  return { value, line: node.startPosition.row + 1, column: node.startPosition.column + 1 };
}

const sameNode = (a: Parser.SyntaxNode | null, b: Parser.SyntaxNode) =>
  !!a && a.startIndex === b.startIndex && a.endIndex === b.endIndex && a.type === b.type;

// Strings the flag's value gets compared to, either directly (`getFeatureFlag("k") === "a"`,
// `switch`/`match` on the call) or through a variable assigned from the call in the same function.
function variantUses(call: Parser.SyntaxNode, isPython: boolean): VariantUse[] {
  const value = unwrap(call);
  const uses = comparisons(value, isPython);

  const parent = value.parent;
  let name: Parser.SyntaxNode | null = null;
  if (parent?.type === "variable_declarator" && sameNode(parent.childForFieldName("value"), value)) {
    name = parent.childForFieldName("name");
  } else if ((parent?.type === "assignment" || parent?.type === "assignment_expression") && sameNode(parent.childForFieldName("right"), value)) {
    name = parent.childForFieldName("left");
  }
  if (name?.type === "identifier") {
    const scope = enclosingScope(value, isPython);
    const visit = (node: Parser.SyntaxNode) => {
      if (node.type === "identifier" && node.text === name!.text && !sameNode(node, name!)) {
        uses.push(...comparisons(unwrap(node), isPython));
      }
      for (const child of node.namedChildren) visit(child);
    };
    visit(scope);
  }

  const seen = new Set<string>();
  return uses.filter((u) => {
    const id = `${u.value}:${u.line}:${u.column}`;
    return seen.has(id) ? false : (seen.add(id), true);
  });
}

// Climb through wrappers that don't change the value: `await x`, `(x)`, `x!`.
function unwrap(node: Parser.SyntaxNode): Parser.SyntaxNode {
  let current = node;
  while (
    current.parent &&
    ["await_expression", "await", "parenthesized_expression", "non_null_expression"].includes(current.parent.type)
  ) {
    current = current.parent;
  }
  return current;
}

function enclosingScope(node: Parser.SyntaxNode, isPython: boolean): Parser.SyntaxNode {
  const scopes = isPython
    ? ["function_definition", "module"]
    : ["function_declaration", "function_expression", "function", "arrow_function", "method_definition", "program"];
  let current: Parser.SyntaxNode | null = node.parent;
  while (current && !scopes.includes(current.type)) current = current.parent;
  return current ?? node.tree.rootNode;
}

function comparisons(value: Parser.SyntaxNode, isPython: boolean): VariantUse[] {
  const parent = value.parent;
  if (!parent) return [];
  const strings = (nodes: (Parser.SyntaxNode | null)[]) =>
    nodes.flatMap((n) => {
      const literal = n ? (isPython ? pythonStringValue(n) : jsStringValue(n)) : null;
      return literal === null ? [] : [variantUse(literal, n!)];
    });

  if (!isPython) {
    if (parent.type === "binary_expression" && ["===", "==", "!==", "!="].includes(parent.childForFieldName("operator")?.text ?? "")) {
      const other = sameNode(parent.childForFieldName("left"), value) ? parent.childForFieldName("right") : parent.childForFieldName("left");
      return strings([other]);
    }
    // switch (x) parses as switch_statement > parenthesized_expression > x, which unwrap() already climbed.
    if (parent.type === "switch_statement" && sameNode(parent.childForFieldName("value"), value)) {
      const cases = parent.childForFieldName("body")?.namedChildren.filter((c) => c.type === "switch_case") ?? [];
      return strings(cases.map((c) => c.childForFieldName("value")));
    }
    return [];
  }

  if (parent.type === "comparison_operator") {
    const operators = parent.children.filter((c) => !c.isNamed()).map((c) => c.text);
    if (!operators.some((op) => ["==", "!=", "in", "not in", "not"].includes(op))) return [];
    return parent.namedChildren
      .filter((c) => !sameNode(c, value))
      .flatMap((c) => (["tuple", "list", "set"].includes(c.type) ? strings(c.namedChildren) : strings([c])));
  }
  if (parent.type === "match_statement" && sameNode(parent.childForFieldName("subject"), value)) {
    const patterns = parent.descendantsOfType("case_pattern").filter((p) => sameNode(enclosingMatch(p), parent));
    return patterns.flatMap((p) =>
      strings(p.namedChildren.flatMap((c) => (c.type === "union_pattern" ? c.namedChildren : [c]))),
    );
  }
  return [];
}

function enclosingMatch(node: Parser.SyntaxNode): Parser.SyntaxNode | null {
  let current = node.parent;
  while (current && current.type !== "match_statement") current = current.parent;
  return current;
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

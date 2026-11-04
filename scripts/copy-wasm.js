// ncc can't bundle .wasm files, so copy the grammars next to each entry point.
const fs = require("fs");
const path = require("path");

const files = [
  require.resolve("web-tree-sitter/tree-sitter.wasm"),
  ...["typescript", "tsx", "javascript", "python"].map((lang) =>
    require.resolve(`tree-sitter-wasms/out/tree-sitter-${lang}.wasm`),
  ),
];

for (const entry of ["action", "cli"]) {
  const dir = path.join(__dirname, "..", "dist", entry, "wasm");
  fs.mkdirSync(dir, { recursive: true });
  for (const file of files) fs.copyFileSync(file, path.join(dir, path.basename(file)));
}

// Replaces straight quotes in JSX text with typographic ones.
//
// react/no-unescaped-entities fires on a bare ' or " in a JSX text node,
// and next build treats ESLint errors as fatal. So a batch of articles
// carrying them does not just lint badly, it fails the production build
// and every article in that deploy 404s.
//
// Fixing them as curly quotes rather than as &apos;/&quot; entities
// because that is what the rest of the catalogue uses, it reads better
// in prose, and the source stays legible.
//
// Driven off ESLint's own JSON output rather than a blind find and
// replace, so only genuine JSX text nodes are touched. A quote inside a
// string literal, a className or an href is left alone.
//
// Usage: npx eslint <paths> --ext .tsx --format json -o /tmp/lint.json
//        node scripts/fix-jsx-entities.mjs /tmp/lint.json

import { readFileSync, writeFileSync } from "node:fs";

const report = JSON.parse(readFileSync(process.argv[2] ?? "/tmp/gs_lint.json", "utf8"));

let fixed = 0;
let files = 0;

for (const file of report) {
  const targets = file.messages.filter(
    (m) => m.ruleId === "react/no-unescaped-entities",
  );
  if (targets.length === 0) continue;

  const lines = readFileSync(file.filePath, "utf8").split("\n");

  // Apply from the bottom right upwards so each replacement cannot move
  // the coordinates of one not yet applied. Curly quotes are the same
  // length as straight ones in JS string terms, but ordering this way
  // keeps it correct regardless.
  targets.sort((a, b) => b.line - a.line || b.column - a.column);

  for (const m of targets) {
    const idx = m.line - 1;
    const line = lines[idx];
    if (line === undefined) continue;

    const at = m.column - 1;
    const ch = line[at];

    let replacement;
    if (ch === "'") {
      // Always the right single quote. Every instance in this catalogue
      // is a contraction or a possessive, never an opening quotation.
      replacement = "\u2019";
    } else if (ch === '"') {
      // Opening if it follows whitespace or starts the line's content,
      // closing otherwise.
      const before = line.slice(0, at).trimEnd();
      replacement = before === "" || /\s$/.test(line.slice(0, at))
        ? "\u201c"
        : "\u201d";
    } else {
      // Position did not land on a quote. Skip rather than corrupt.
      continue;
    }

    lines[idx] = line.slice(0, at) + replacement + line.slice(at + 1);
    fixed += 1;
  }

  writeFileSync(file.filePath, lines.join("\n"));
  files += 1;
}

console.log(`fixed ${fixed} entities across ${files} files`);

// Sanity checks for the insights catalogue. Run after adding articles:
//   node scripts/check-insights.mjs
//
// Catches the three mistakes that are invisible at build time because
// article bodies are opaque JSX: an internal /insights link pointing at
// a slug that does not exist, a slug that disagrees with its filename,
// and an article that never got added to the registry (compiles fine,
// unreachable at every route).
//
// Also flags em and en dashes, which are house style violations.

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const DIR = "src/app/(marketing)/insights/posts";
const files = readdirSync(DIR).filter(
  (f) => f.endsWith(".tsx") && !f.startsWith("_"),
);
const slugs = new Set(files.map((f) => f.replace(/\.tsx$/, "")));
const registry = readFileSync(join(DIR, "index.ts"), "utf8");

const problems = [];

for (const file of files) {
  const src = readFileSync(join(DIR, file), "utf8");
  const slug = file.replace(/\.tsx$/, "");

  const declared = src.match(/slug:\s*"([^"]+)"/)?.[1];
  if (declared !== slug) {
    problems.push(`${file}: meta.slug is "${declared}", filename says "${slug}"`);
  }

  if (!registry.includes(`./${slug}"`)) {
    problems.push(`${file}: not imported in index.ts, so it is unreachable`);
  }

  for (const m of src.matchAll(/href="\/insights\/([a-z0-9-]+)"/g)) {
    if (!slugs.has(m[1])) {
      problems.push(`${file}: links to /insights/${m[1]}, which does not exist`);
    }
  }

  // Only the prose matters, but scanning the whole file is fine: no
  // legitimate use of these characters exists in an article.
  for (const dash of ["\u2014", "\u2013"]) {
    if (src.includes(dash)) {
      const name = dash === "\u2014" ? "em dash" : "en dash";
      problems.push(`${file}: contains an ${name}`);
    }
  }
}

const dupes = files.length - slugs.size;
if (dupes > 0) problems.push(`${dupes} duplicate slug(s)`);

console.log(`Checked ${files.length} articles.`);
if (problems.length === 0) {
  console.log("No problems found.");
} else {
  console.log(`\n${problems.length} problem(s):`);
  for (const p of problems) console.log(`  - ${p}`);
  process.exitCode = 1;
}

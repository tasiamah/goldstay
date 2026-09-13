// Sanity checks for the insights catalogue. Run after adding articles:
//   node scripts/check-insights.mjs
//
// Catches the three mistakes that are invisible at build time because
// article bodies are opaque JSX: an internal /insights link pointing at
// a slug that does not exist, a slug that disagrees with its filename,
// and an article that never got added to the registry (compiles fine,
// unreachable at every route).
//
// Also flags em and en dashes, which are house style violations, and a
// heroImage with no file behind it. That last one shipped on three coast
// articles for months: the path was plausible, nothing resolves it at
// build time, and since the route reuses heroImage as the OpenGraph
// image the pages had a broken hero and unfurled a 404 when shared.

import { existsSync, readdirSync, readFileSync } from "node:fs";
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

  const heroImage = src.match(/heroImage:\s*"([^"]+)"/)?.[1];
  if (heroImage && !existsSync(join("public", heroImage))) {
    problems.push(`${file}: heroImage ${heroImage} is not in public/`);
  }

  // Only the prose matters, but scanning the whole file is fine: no
  // legitimate use of these characters exists in an article.
  for (const dash of ["\u2014", "\u2013"]) {
    if (src.includes(dash)) {
      const name = dash === "\u2014" ? "em dash" : "en dash";
      problems.push(`${file}: contains an ${name}`);
    }
  }

  // A KeySummary exists to be lifted off the page and quoted whole, by
  // a search result or an AI answer. That only works if it stands up
  // with the article deleted from around it, so anything pointing back
  // at surrounding copy defeats the block entirely. Cheap to write by
  // accident, invisible on the rendered page, and the failure mode is
  // a quotation that begins mid-thought.
  const summary = src.match(/<KeySummary[\s\S]*?\/>/);
  if (summary) {
    const answer = summary[0].match(/answer="([^"]*)"/);
    if (!answer) {
      problems.push(`${file}: KeySummary has no single-line answer prop`);
    } else {
      const text = answer[1];
      if (text.length < 200) {
        problems.push(
          `${file}: KeySummary answer is ${text.length} chars, too thin to quote`,
        );
      }
      for (const phrase of [
        "as we saw",
        "as above",
        "described above",
        "this guide",
        "this article",
        "read on",
      ]) {
        if (text.toLowerCase().includes(phrase)) {
          problems.push(
            `${file}: KeySummary answer says "${phrase}", so it cannot stand alone`,
          );
        }
      }
    }
  }

  // FAQPage schema is the one piece of structured data that is actively
  // penalised when it does not match the page, because the whole point
  // of it is to tell a search engine "this answer is here" — and a
  // reader arriving from an AI Overview on a promise the page does not
  // keep is the abuse Google withdrew the rich result over.
  //
  // So every question must also be a heading in the body. The headings
  // in these articles are often numbered ("3. Where does my rent
  // sit..."), which the reader sees and the schema should not repeat,
  // so the comparison ignores a leading number.
  //
  // Answers get the KeySummary treatment for the same reason it exists:
  // they are quoted with the article deleted from around them.
  const faq = src.match(/faq:\s*\[[\s\S]*?\n  \],/);
  if (faq) {
    const headings = [...src.matchAll(/<H3[^>]*>([\s\S]*?)<\/H3>/g)].map((m) =>
      normaliseHeading(m[1]),
    );

    for (const pair of faq[0].matchAll(/\bq:\s*"((?:[^"\\]|\\.)*)"/g)) {
      const question = normaliseHeading(pair[1]);
      if (!headings.includes(question)) {
        problems.push(
          `${file}: faq asks "${pair[1]}", which is not an H3 in the body`,
        );
      }
    }

    for (const pair of faq[0].matchAll(/\ba:\s*"((?:[^"\\]|\\.)*)"/g)) {
      const answer = pair[1];
      if (answer.length < 80) {
        problems.push(
          `${file}: faq answer is ${answer.length} chars, too thin to quote`,
        );
      }
      for (const phrase of ["as above", "described above", "read on"]) {
        if (answer.toLowerCase().includes(phrase)) {
          problems.push(
            `${file}: faq answer says "${phrase}", so it cannot stand alone`,
          );
        }
      }
    }
  }
}

// Headings carry entities, markup and a number the schema drops, so
// both sides are reduced to their words before being compared.
function normaliseHeading(raw) {
  return raw
    .replace(/<[^>]*>/g, " ")
    .replace(/&rsquo;|&#8217;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/\{"\s*"\}/g, " ")
    .replace(/^\s*\d+\.\s*/, "")
    .replace(/[^a-z0-9]+/gi, " ")
    .trim()
    .toLowerCase();
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

// Where each commercial phrase we care about actually appears.
//
// Ranking follows what a page *claims to be about*, and the strongest
// claims are the title and the H1. A phrase that only shows up in body
// prose is not being targeted, it is being mentioned. This script sorts
// the candidate phrases into those buckets against the built HTML, so
// the gap list is derived from what we ship rather than from memory.
//
// Usage: npx next build && node scripts/keyword-coverage.mjs [--all]
//
// Reads .next/server/app/**/*.html. Article pages are collapsed into a
// single "articles" bucket: 350 of them will match almost anything and
// they are not what we would rank for a commercial query anyway.

import { readFileSync } from "node:fs";
import { globSync } from "node:fs";
import path from "node:path";

const CANDIDATES = [
  // Core service + place. The plural "managers" and the "companies"
  // variants are how somebody shopping for a firm phrases it, which is
  // a different query from the singular abstract noun.
  "property management nairobi",
  "property managers nairobi",
  "property management companies",
  "property management company",
  "property management services",
  "property management kenya",
  "managing agent",
  "estate management",
  "letting agent",
  "letting agency",
  "landlord services",
  "rent collection",
  "caretaker",

  // Short-stay. "co-host" is the term Airbnb itself uses and that hosts
  // therefore use about themselves.
  "airbnb management nairobi",
  "airbnb management kenya",
  "airbnb management company",
  "airbnb co-host",
  "co-hosting",
  "cohost",
  "airbnb property management",
  "short let management",
  "short-let management",
  "short stay management",
  "short-stay management",
  "serviced apartment management",
  "holiday home management",
  "vacation rental management",
  "furnished apartment management",
  "airbnb setup",
  "superhost",

  // Long-term
  "long-term rental management",
  "rental management nairobi",
  "rental management",

  // Tenant side, as a landlord searches for it
  "tenant finding",
  "tenant vetting",
  "tenant screening",
  "tenant placement",

  // Fees and comparison. Highest commercial intent in the whole list:
  // somebody asking the price is shopping, not researching.
  "property management fees",
  "management fees kenya",
  "how much do property managers charge",
  "property management cost",
  "best property management",
  "airbnb management fees",

  // Diaspora / remote owner
  "manage my property from abroad",
  "manage my property in kenya",
  "diaspora landlord",
  "absentee landlord",
];

const files = globSync(".next/server/app/**/*.html");
if (files.length === 0) {
  console.error("No built HTML found. Run `npx next build` first.");
  process.exit(1);
}

const strip = (s) => s.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#x2F;/g, "/")
    .replace(/&nbsp;/g, " ");

const pages = [];
for (const file of files) {
  const html = readFileSync(file, "utf8");
  const route =
    "/" +
    path
      .relative(".next/server/app", file)
      .replace(/\.html$/, "")
      .replace(/^index$/, "");
  const title = decode(
    (html.match(/<title[^>]*>([^<]*)<\/title>/) ?? [, ""])[1],
  ).toLowerCase();
  const h1 = decode(strip((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) ?? [, ""])[1]))
    .toLowerCase();
  const body = decode(strip(html)).toLowerCase();
  pages.push({ route, title, h1, body, isArticle: route.startsWith("/insights/") });
}

const commercial = pages.filter((p) => !p.isArticle);
const articles = pages.filter((p) => p.isArticle);

const rows = CANDIDATES.map((phrase) => {
  const inTitle = commercial.filter((p) => p.title.includes(phrase));
  const inH1 = commercial.filter((p) => p.h1.includes(phrase));
  const inBody = commercial.filter((p) => p.body.includes(phrase));
  const inArticles = articles.filter((p) => p.body.includes(phrase)).length;

  let status;
  if (inTitle.length) status = "TITLE";
  else if (inH1.length) status = "H1";
  else if (inBody.length) status = "body";
  else if (inArticles) status = "articles";
  else status = "ABSENT";

  return { phrase, status, inTitle, inH1, inBody: inBody.length, inArticles };
});

const label = {
  TITLE: "targeted (title)",
  H1: "targeted (h1 only)",
  body: "mentioned only",
  articles: "articles only",
  ABSENT: "absent",
};

console.log(
  `\n${commercial.length} commercial pages, ${articles.length} articles\n`,
);

for (const key of ["ABSENT", "articles", "body", "H1", "TITLE"]) {
  const group = rows.filter((r) => r.status === key);
  if (!group.length) continue;
  console.log(`--- ${label[key]} (${group.length}) ---`);
  for (const r of group) {
    const where =
      r.status === "TITLE"
        ? r.inTitle.map((p) => p.route || "/").slice(0, 3).join(", ")
        : r.status === "H1"
          ? r.inH1.map((p) => p.route || "/").slice(0, 3).join(", ")
          : r.status === "body"
            ? `${r.inBody} page(s)`
            : r.status === "articles"
              ? `${r.inArticles} article(s)`
              : "";
    console.log(`  ${r.phrase.padEnd(38)} ${where}`);
  }
  console.log("");
}

const gaps = rows.filter((r) => r.status === "ABSENT" || r.status === "articles");
console.log(
  `${gaps.length} of ${CANDIDATES.length} candidate phrases have no commercial page targeting them.\n`,
);

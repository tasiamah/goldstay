// Where each commercial phrase we care about actually appears.
//
// Ranking follows what a page *claims to be about*, and the strongest
// claims are the title and the H1. A phrase that only shows up in body
// prose is not being targeted, it is being mentioned. This script sorts
// the candidate phrases into those buckets against the built HTML, so
// the gap list is derived from what we ship rather than from memory.
//
// Usage:
//   npx next build && node scripts/keyword-coverage.mjs
//   node scripts/keyword-coverage.mjs --cluster="Switching"
//   node scripts/keyword-coverage.mjs --gaps
//
// Reads .next/server/app/**/*.html. Article pages are collapsed into a
// single bucket: 350 of them will match almost anything, and an article
// is not what we would rank for a commercial query anyway.

import { readFileSync, globSync } from "node:fs";
import path from "node:path";

// Grouped by search intent rather than by service, because the intent
// is what decides whether a phrase deserves a page, a title, or
// nothing. Within a cluster the phrases are near-synonyms competing for
// the same page; across clusters they are different readers.
const CLUSTERS = {
  // Somebody looking for a firm to hire. Note how many of these are
  // plural or contain "company": that is a different query from the
  // singular abstract noun and it is the one with a buyer behind it.
  "Agency-seeking": [
    "property management nairobi",
    "property managers nairobi",
    "property managers in nairobi",
    "property management companies in nairobi",
    "property management companies kenya",
    "property management company nairobi",
    "property management services nairobi",
    "property management firms",
    "property management agency",
    "residential property management",
    "real estate management company",
    "best property management company",
    "top property management companies",
    "landlord agent",
    "managing agent",
    "estate management",
    "letting agent",
    "letting agency",
    "landlord services",
  ],

  // Short-stay. "co-host" is Airbnb's own word, so it is what hosts use
  // about themselves and what they search when they want one.
  "Short-stay": [
    "airbnb management nairobi",
    "airbnb management kenya",
    "airbnb management company",
    "airbnb property management",
    "airbnb co-host",
    "co-hosting",
    "cohost",
    "airbnb management service",
    "airbnb listing management",
    "airbnb setup",
    "superhost",
    "short let management",
    "short-let management",
    "short stay management",
    "short-stay management",
    "serviced apartment management",
    "holiday home management",
    "vacation rental management",
    "furnished apartment management",
    "holiday let management",
  ],

  "Long-term": [
    "long-term rental management",
    "rental management nairobi",
    "rental property management",
    "rent collection",
    "rent collection service",
    "caretaker",
    "caretaker services",
    "house management service",
  ],

  Tenant: [
    "tenant finding",
    "tenant vetting",
    "tenant screening",
    "tenant placement",
    "find tenants",
    "find a tenant",
  ],

  // Highest commercial intent in the whole list: asking the price means
  // the decision to buy is already made.
  "Fees and comparison": [
    "property management fees",
    "property management cost",
    "management fees kenya",
    "how much do property managers charge",
    "airbnb management fees",
    "property management commission",
    "best property management",
    "cheapest property manager",
  ],

  Diaspora: [
    "manage my property from abroad",
    "manage my property in kenya",
    "property management for kenyans abroad",
    "diaspora property management",
    "diaspora landlord",
    "absentee landlord",
    "who can manage my house",
    "rent out my house while abroad",
    "overseas landlord",
  ],

  // Somebody already using a manager and unhappy with them. Almost
  // nobody writes for these, the intent could not be hotter, and the
  // reader is by definition already a landlord with a managed property.
  Switching: [
    "agent not paying rent",
    "agent stole my rent",
    "change property manager",
    "switch property manager",
    "remove a property manager",
    "bad property manager",
    "property agent fraud",
    "agent not remitting rent",
    "sack my property agent",
  ],

  "Property type": [
    "apartment management",
    "villa management",
    "townhouse management",
    "bedsitter management",
    "commercial property management",
  ],
};

const args = process.argv.slice(2);
const onlyCluster = (args.find((a) => a.startsWith("--cluster=")) ?? "")
  .replace("--cluster=", "")
  .toLowerCase();
const gapsOnly = args.includes("--gaps");

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

// Matching is token-subsequence, not substring.
//
// Substring matching was the first version and it lied in both
// directions. "change property manager" scored as a miss against the
// title "Change Your Property Manager in Nairobi" because of the
// intervening "Your", and "agent not paying rent" scored as a miss
// against the FAQ question "My agent is not paying me rent", which is
// the query verbatim apart from two filler words. Google is not
// matching literal strings, so a tool that does will send you off to
// write pages you already have.
//
// So: every word of the phrase must appear, in order, allowing gaps.
// That accepts the filler words a real heading contains and still
// rejects a page that merely uses the same vocabulary in a different
// order.
function tokens(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function targets(haystack, phraseTokens) {
  const hay = tokens(haystack);
  let i = 0;
  for (const word of hay) {
    // Treat "co-host", "cohost" and "co host" as the same word, since
    // the hyphenation of this one varies by writer and by platform.
    const a = word.replace(/-/g, "");
    const b = phraseTokens[i]?.replace(/-/g, "");
    if (b !== undefined && a === b) i++;
    if (i === phraseTokens.length) return true;
  }
  return i === phraseTokens.length;
}

const pages = [];
for (const file of files) {
  const html = readFileSync(file, "utf8");
  const route =
    "/" +
    path
      .relative(".next/server/app", file)
      .replace(/\.html$/, "")
      .replace(/^index$/, "");
  // H2 and H3 matter because that is where an FAQ question renders, and
  // an FAQ question is often the query typed back verbatim. It is a
  // weaker signal than the title and a much stronger one than prose.
  const subheads = [...html.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/g)]
    .map((m) => decode(strip(m[1])))
    .join(" | ");
  pages.push({
    route,
    title: decode((html.match(/<title[^>]*>([^<]*)<\/title>/) ?? [, ""])[1]),
    h1: decode(strip((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) ?? [, ""])[1])),
    subheads,
    body: decode(strip(html)),
    isArticle: route.startsWith("/insights/"),
  });
}

const commercial = pages.filter((p) => !p.isArticle);
const articles = pages.filter((p) => p.isArticle);

function classify(phrase) {
  const t = tokens(phrase);
  // Gap-tolerant matching only on the short fields. Applied to a body
  // it is meaningless: across three thousand words the tokens of almost
  // any phrase appear in order somewhere, which is how the first pass
  // came to report "property agent fraud" as covered by 13 articles.
  // Long fields get literal substring matching instead, so a hit means
  // the words are actually adjacent.
  const loose = phrase.toLowerCase();
  const inTitle = commercial.filter((p) => targets(p.title, t));
  const inH1 = commercial.filter((p) => targets(p.h1, t));
  const inSub = commercial.filter((p) => targets(p.subheads, t));
  const inBody = commercial.filter((p) => p.body.toLowerCase().includes(loose));
  const inArticles = articles.filter((p) =>
    p.body.toLowerCase().includes(loose),
  ).length;

  if (inTitle.length)
    return { status: "TITLE", where: inTitle.map((p) => p.route || "/") };
  if (inH1.length) return { status: "H1", where: inH1.map((p) => p.route || "/") };
  if (inSub.length)
    return { status: "H2/H3", where: inSub.map((p) => p.route || "/") };
  if (inBody.length) return { status: "body", where: [`${inBody.length} page(s)`] };
  if (inArticles) return { status: "articles", where: [`${inArticles} article(s)`] };
  return { status: "ABSENT", where: [] };
}

const mark = {
  TITLE: "[title]  ",
  H1: "[h1]     ",
  "H2/H3": "[h2]     ",
  body: "[body]   ",
  articles: "[article]",
  ABSENT: "[ABSENT] ",
};

console.log(`\n${commercial.length} commercial pages, ${articles.length} articles`);

let total = 0;
let gaps = 0;
const clusterSummary = [];

for (const [cluster, phrases] of Object.entries(CLUSTERS)) {
  if (onlyCluster && !cluster.toLowerCase().includes(onlyCluster)) continue;

  const rows = phrases.map((p) => ({ phrase: p, ...classify(p) }));
  const claimed = new Set(["TITLE", "H1", "H2/H3"]);
  const clusterGaps = rows.filter((r) => !claimed.has(r.status)).length;
  total += rows.length;
  gaps += clusterGaps;
  clusterSummary.push({ cluster, gaps: clusterGaps, of: rows.length });

  const shown = gapsOnly ? rows.filter((r) => !claimed.has(r.status)) : rows;
  if (!shown.length) continue;

  console.log(`\n=== ${cluster} (${clusterGaps}/${rows.length} unclaimed) ===`);
  for (const r of shown) {
    console.log(
      `  ${mark[r.status]} ${r.phrase.padEnd(38)} ${r.where.slice(0, 3).join(", ")}`,
    );
  }
}

console.log(`\n--- unclaimed by cluster ---`);
for (const c of clusterSummary.sort((a, b) => b.gaps / b.of - a.gaps / a.of)) {
  const pct = Math.round((c.gaps / c.of) * 100);
  console.log(`  ${String(pct).padStart(3)}%  ${c.cluster} (${c.gaps}/${c.of})`);
}
console.log(
  `\n${gaps} of ${total} candidate phrases have no commercial page targeting them.\n`,
);

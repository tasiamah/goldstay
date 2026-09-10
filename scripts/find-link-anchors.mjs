#!/usr/bin/env node
// Finds places where one article already talks about the subject of
// another without linking to it.
//
// Why this exists. 90 of 381 articles have no editorial link pointing
// at them. The related-articles block gives every article three
// algorithmic inbound links so nothing is unreachable, but a link in a
// footer block is not the same signal as a link inside a sentence, and
// it does not tell a reader anything about why they should follow it.
//
// The naive fix is to append "related reading" lines, which is just the
// related block again in worse handwriting. This does the opposite: it
// looks for prose that is already on the subject and reports it as a
// candidate anchor, so the link goes where a reader would want one
// anyway and the sentence around it does not have to be invented.
//
// Reports candidates. Deliberately does not edit anything: choosing
// the anchor phrase is the part that needs judgement.
//
//   node scripts/find-link-anchors.mjs            # top candidates
//   node scripts/find-link-anchors.mjs --all      # every orphan

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const DIR = "src/app/(marketing)/insights/posts";

// Words too common in this catalogue to indicate that a sentence is
// actually about the linked subject. "Property" and "Nairobi" appear
// in most of 381 articles about Nairobi property.
const STOP = new Set([
  "the", "a", "an", "and", "or", "of", "in", "to", "for", "on", "at",
  "is", "are", "what", "how", "why", "when", "your", "you", "it", "its",
  "with", "from", "that", "this", "do", "does", "can", "should", "i",
  "my", "we", "our", "be", "as", "by", "not", "no", "if", "so", "but",
  "property", "nairobi", "kenya", "kenyan", "guide", "explained", "2026",
  "2025", "2027", "complete",
]);

const files = readdirSync(DIR).filter(
  (f) => f.endsWith(".tsx") && !f.startsWith("_"),
);
const slugs = new Set(files.map((f) => f.replace(/\.tsx$/, "")));

const articles = new Map();
for (const f of files) {
  const slug = f.replace(/\.tsx$/, "");
  const src = readFileSync(join(DIR, f), "utf8");
  const title = (src.match(/\n\s*title:\s*\n?\s*"([^"]+)"/) || [])[1] || slug;
  const tags = [...src.matchAll(/^\s{4}"([^"]+)",$/gm)].map((m) => m[1]);
  const links = new Set();
  for (const m of src.matchAll(/\/insights\/([a-z0-9-]+)/g)) {
    if (m[1] !== slug && slugs.has(m[1])) links.add(m[1]);
  }
  articles.set(slug, { slug, src, title, tags, links });
}

// Inbound editorial link counts.
const inbound = new Map([...slugs].map((s) => [s, 0]));
for (const a of articles.values()) {
  for (const t of a.links) inbound.set(t, inbound.get(t) + 1);
}
const orphans = [...inbound]
  .filter(([, c]) => c === 0)
  .map(([s]) => articles.get(s));

// Distinctive terms from a title: the words that would make a sentence
// elsewhere recognisably about this article.
function terms(article) {
  return [
    ...new Set(
      article.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 3 && !STOP.has(w)),
    ),
  ];
}

// Prose only. Matching inside meta would point the link at the header
// of the file rather than at a sentence a reader is going to read.
function prose(src) {
  const start = src.indexOf("export default function");
  return start === -1 ? "" : src.slice(start);
}

const report = [];
for (const orphan of orphans) {
  const want = terms(orphan);
  if (want.length === 0) continue;

  const candidates = [];
  for (const source of articles.values()) {
    if (source.slug === orphan.slug) continue;
    if (source.links.has(orphan.slug)) continue;

    const body = prose(source.src);
    const hits = want.filter((t) => body.toLowerCase().includes(t));
    if (hits.length < 2) continue;

    const sharedTags = source.tags.filter((t) =>
      orphan.tags.includes(t),
    ).length;

    // Sentence containing the most distinctive matched term, as the
    // suggested anchor site.
    const rare = hits.sort(
      (a, b) => body.split(a).length - body.split(b).length,
    )[0];
    const idx = body.toLowerCase().indexOf(rare);
    const snippet = body
      .slice(Math.max(0, idx - 90), idx + 110)
      .replace(/\s+/g, " ")
      .trim();

    // The H2 following the match, as a unique insertion target. An id
    // is unique within a file by construction, so it gives an exact
    // anchor to place a paragraph before without reading the file.
    const after = body.slice(idx);
    const nextH2 = (after.match(/<H2 id="([a-z0-9-]+)"/) || [])[1] || null;

    candidates.push({
      slug: source.slug,
      score: hits.length * 2 + sharedTags,
      hits,
      outbound: source.links.size,
      snippet,
      nextH2,
    });
  }

  candidates.sort((a, b) => b.score - a.score);
  report.push({ orphan, candidates: candidates.slice(0, 3) });
}

// Compact mode: one line per orphan, best candidate only, with the
// H2 to insert before. Built for working through the backlog quickly.
if (process.argv.includes("--pairs")) {
  for (const { orphan, candidates } of report) {
    const c = candidates.find((x) => x.nextH2) || candidates[0];
    if (!c) {
      console.log(`SKIP\t${orphan.slug}\t(no candidate)`);
      continue;
    }
    console.log(
      [orphan.slug, orphan.title, c.slug, c.nextH2 || "-"].join("\t"),
    );
  }
  process.exit(0);
}

const all = process.argv.includes("--all");
report.sort((a, b) => (b.candidates[0]?.score || 0) - (a.candidates[0]?.score || 0));

console.log(`${orphans.length} articles with no editorial inbound link.\n`);
for (const { orphan, candidates } of all ? report : report.slice(0, 25)) {
  console.log(`ORPHAN  ${orphan.slug}`);
  console.log(`        "${orphan.title}"`);
  if (candidates.length === 0) {
    console.log("        no candidate found, needs a hand-written link\n");
    continue;
  }
  for (const c of candidates) {
    console.log(`  <- ${c.slug}  [score ${c.score}, matched: ${c.hits.join(", ")}]`);
    console.log(`     ...${c.snippet}...`);
  }
  console.log("");
}

const none = report.filter((r) => r.candidates.length === 0).length;
console.log(`${report.length - none} have a candidate anchor. ${none} need one written.`);

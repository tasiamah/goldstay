// Asserts that every article's search-result title and description fit
// in the space Google gives them.
//
// Character counts are the usual shorthand but they are a proxy for
// what actually decides it, which is pixel width. "Illinois Wisconsin
// Minnesota" and "million iii lll" are the same 20-odd characters and
// nowhere near the same width, so a 60-character rule passes titles
// that get cut and fails titles that would have fitted. This measures
// width with a per-character advance table for Arial, which is what
// Google renders results in.
//
// Measures the effective values — metaTitle ?? title and
// metaDescription ?? description — because those are what reach the
// document head. See PostMeta for why the pairs are separate.
//
// Run bare for a report, --strict to exit non-zero on any overflow
// (which is how the test suite runs it), --csv for the full table.

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { argv } from "node:process";
import { fileURLToPath } from "node:url";

const POSTS = "src/app/(marketing)/insights/posts";

// Where Google's ellipsis lands. Titles render at 20px, descriptions at
// 14px, both in Arial.
const TITLE_PX = 600;
const DESC_PX = 960;

// Below this a description is not truncated but is leaving most of the
// snippet unused, which invites Google to write its own from the page
// instead. A warning, not a failure.
const DESC_THIN_PX = 500;

// Relative advance widths for Arial at font size 1. Anything unlisted
// falls back to an average lowercase width.
const W = {
  " ": 0.278,
  "!": 0.278,
  '"': 0.355,
  "#": 0.556,
  $: 0.556,
  "%": 0.889,
  "&": 0.667,
  "'": 0.191,
  "(": 0.333,
  ")": 0.333,
  "*": 0.389,
  "+": 0.584,
  ",": 0.278,
  "-": 0.333,
  ".": 0.278,
  "/": 0.278,
  0: 0.556,
  1: 0.556,
  2: 0.556,
  3: 0.556,
  4: 0.556,
  5: 0.556,
  6: 0.556,
  7: 0.556,
  8: 0.556,
  9: 0.556,
  ":": 0.278,
  ";": 0.278,
  "<": 0.584,
  "=": 0.584,
  ">": 0.584,
  "?": 0.556,
  "@": 1.015,
  A: 0.667,
  B: 0.667,
  C: 0.722,
  D: 0.722,
  E: 0.667,
  F: 0.611,
  G: 0.778,
  H: 0.722,
  I: 0.278,
  J: 0.5,
  K: 0.667,
  L: 0.556,
  M: 0.833,
  N: 0.722,
  O: 0.778,
  P: 0.667,
  Q: 0.778,
  R: 0.722,
  S: 0.667,
  T: 0.611,
  U: 0.722,
  V: 0.667,
  W: 0.944,
  X: 0.667,
  Y: 0.667,
  Z: 0.611,
  "[": 0.278,
  "]": 0.278,
  "^": 0.469,
  _: 0.556,
  a: 0.556,
  b: 0.556,
  c: 0.5,
  d: 0.556,
  e: 0.556,
  f: 0.278,
  g: 0.556,
  h: 0.556,
  i: 0.222,
  j: 0.222,
  k: 0.5,
  l: 0.222,
  m: 0.833,
  n: 0.556,
  o: 0.556,
  p: 0.556,
  q: 0.556,
  r: 0.333,
  s: 0.5,
  t: 0.278,
  u: 0.556,
  v: 0.5,
  w: 0.722,
  x: 0.5,
  y: 0.5,
  z: 0.5,
  "{": 0.334,
  "|": 0.26,
  "}": 0.334,
  "~": 0.584,
  "\u2019": 0.191,
  "\u2018": 0.191,
  "\u201c": 0.333,
  "\u201d": 0.333,
  "\u2014": 1.0,
  "\u2013": 0.556,
  "\u00a0": 0.278,
  "\u00d7": 0.584,
};
const FALLBACK = 0.55;

export function widthPx(text, fontSize) {
  let total = 0;
  for (const ch of text) total += W[ch] ?? FALLBACK;
  return Math.round(total * fontSize);
}

const titlePx = (t) => widthPx(t, 20);
const descPx = (d) => widthPx(d, 14);

// Pulls a double-quoted string off a top-level meta key, whether the
// value sits on the same line or is wrapped onto the next.
function field(src, key) {
  const re = new RegExp(
    `^  ${key}:\\s*(?:\\n\\s*)?"((?:[^"\\\\]|\\\\.)*)"`,
    "m",
  );
  const m = re.exec(src);
  return m ? m[1].replace(/\\"/g, '"').replace(/\\\\/g, "\\") : null;
}

// Exported so the proposal scripts can measure with the same table
// rather than keeping a second copy of it that drifts.
export function readArticles() {
  const rows = [];
  const unparsed = [];
  for (const file of readdirSync(POSTS).sort()) {
    if (!file.endsWith(".tsx") || file.startsWith("_")) continue;
    const src = readFileSync(join(POSTS, file), "utf8");
    const title = field(src, "title");
    const description = field(src, "description");
    if (!title || !description) {
      unparsed.push(file);
      continue;
    }
    const metaTitle = field(src, "metaTitle");
    const metaDescription = field(src, "metaDescription");
    const effectiveTitle = metaTitle ?? title;
    const effectiveDesc = metaDescription ?? description;
    rows.push({
      slug: file.replace(/\.tsx$/, ""),
      title,
      description,
      effectiveTitle,
      effectiveDesc,
      hasTitleOverride: metaTitle !== null,
      hasDescOverride: metaDescription !== null,
      titlePx: titlePx(effectiveTitle),
      descPx: descPx(effectiveDesc),
    });
  }
  return { rows, unparsed };
}

function main() {
  const { rows, unparsed } = readArticles();

  if (process.argv.includes("--csv")) {
    console.log(
      "slug,title_px,desc_px,title_override,desc_override,title,description",
    );
    const csv = (s) => `"${s.replace(/"/g, '""')}"`;
    for (const r of rows) {
      console.log(
        [
          r.slug,
          r.titlePx,
          r.descPx,
          r.hasTitleOverride,
          r.hasDescOverride,
          csv(r.effectiveTitle),
          csv(r.effectiveDesc),
        ].join(","),
      );
    }
    process.exit(0);
  }

  const wideTitles = rows.filter((r) => r.titlePx > TITLE_PX);
  const wideDescs = rows.filter((r) => r.descPx > DESC_PX);
  const thinDescs = rows.filter((r) => r.descPx < DESC_THIN_PX);

  console.log(`Checked ${rows.length} articles.`);
  if (unparsed.length) {
    console.log(`\nCould not parse meta in ${unparsed.length} file(s):`);
    for (const f of unparsed) console.log(`  ${f}`);
  }

  if (wideTitles.length) {
    console.log(`\n${wideTitles.length} title(s) over ${TITLE_PX}px:`);
    for (const r of wideTitles.sort((a, b) => b.titlePx - a.titlePx)) {
      console.log(`  ${String(r.titlePx).padStart(4)}px  ${r.slug}`);
      console.log(`          ${r.effectiveTitle}`);
    }
  }

  if (wideDescs.length) {
    console.log(`\n${wideDescs.length} description(s) over ${DESC_PX}px:`);
    for (const r of wideDescs.sort((a, b) => b.descPx - a.descPx)) {
      console.log(`  ${String(r.descPx).padStart(4)}px  ${r.slug}`);
    }
  }

  if (thinDescs.length) {
    console.log(
      `\n${thinDescs.length} description(s) under ${DESC_THIN_PX}px — not truncated, but leaving the snippet mostly empty:`,
    );
    for (const r of thinDescs.sort((a, b) => a.descPx - b.descPx)) {
      console.log(`  ${String(r.descPx).padStart(4)}px  ${r.slug}`);
    }
  }

  const failed = unparsed.length + wideTitles.length + wideDescs.length;
  if (failed === 0) {
    console.log(
      `\nNo problems found. Overrides in use: ${rows.filter((r) => r.hasTitleOverride).length} titles, ${rows.filter((r) => r.hasDescOverride).length} descriptions.`,
    );
  } else if (process.argv.includes("--strict")) {
    console.log(`\n${failed} problem(s).`);
    process.exitCode = 1;
  }
}

// Importing this module for widthPx or readArticles must not run the
// report, so only the process actually invoked on this file does.
if (argv[1] && fileURLToPath(import.meta.url) === argv[1]) main();

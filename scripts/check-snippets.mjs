// Asserts that every search-result title and description on the site
// fits in the space Google gives them.
//
// Covers both the article catalogue and the routes under src/app. It
// read only the catalogue until v1.62.0, which meant it measured 387
// articles and none of the pages that sell the service — and 14 of
// those were overflowing the whole time. Scope it with --articles or
// --routes; the default is both.
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

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { argv } from "node:process";
import { fileURLToPath } from "node:url";

const POSTS = "src/app/(marketing)/insights/posts";
const APP = "src/app";

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

// ---------------------------------------------------------------------
// Routes
//
// Articles keep their copy in a flat PostMeta object, so a regex on the
// key is enough. Route metadata is code: a generateMetadata() that
// branches on the host city and interpolates a phrase into a template
// literal. Measuring the source text would count "${cityPhrase}" as
// fourteen characters of punctuation instead of the seven that "Nairobi"
// renders as, so the literals are resolved to their widest real value
// first and every branch of a ternary is measured, not just the first.

// Calls and member expressions, which have no local declaration to read
// a value out of.
//
// launchedCityPhrase() resolves to "Nairobi" today because Ghana is not
// launched, and this deliberately measures it as the wider "Nairobi and
// Accra" it becomes the day the flag flips. Measuring what it renders
// today would pass copy that overflows on the neutral domain the moment
// Ghana opens, with no code change to fail on — the same shape of
// problem as a rating claim with no verified date. It costs 67px of
// budget on the pages that use it, which is cheap.
const WIDEST_CITY_PHRASE = "Nairobi and Accra";

// tradingName() from site.ts, which is the full name as set on the
// Google Business Profile. Worth knowing about because it was the
// homepage title for twelve versions at 826px, and a checker that only
// reads string literals cannot see a title that is a function call —
// which is exactly how a title 1.4x over budget passed this script
// every time it ran.
const TRADING_NAME = `Goldstay | Property Management, Airbnb Co-Hosting & Short Let Consultancy ${WIDEST_CITY_PHRASE}`;

const RENDERED = [
  [/\$\{launchedCityPhrase\(\)\}/g, WIDEST_CITY_PHRASE],
  [/\$\{tradingName\([^)]*\)\}/g, TRADING_NAME],
  [/\$\{site\.name\}/g, "Goldstay"],
  [/\$\{site\.domain\}/g, "goldstay.co.ke"],
];

// Helpers that return display copy rather than a literal. A value that
// is only ever a call reaches the head all the same, so the script has
// to know what it produces or it silently measures nothing at all.
const CALL_VALUES = [
  [/\btradingName\s*\(/, TRADING_NAME],
  [/\blaunchedCityPhrase\s*\(/, WIDEST_CITY_PHRASE],
];

// Everything else is a local const, so read it rather than keeping a
// list of names here that goes stale the moment a page renames one.
// Takes the widest branch of a ternary, since that is the one that
// decides whether the snippet overflows. A count read off an array
// length cannot be known statically, so it stands in as two digits —
// the widest a suburb or bedroom count is going to be.
function constValues(src) {
  const values = new Map();
  for (const m of src.matchAll(
    /\bconst\s+([A-Za-z_$][\w$]*)\s*=([^;]*);/g,
  )) {
    const [, name, expression] = m;
    if (/\.length\b/.test(expression)) {
      values.set(name, "00");
      continue;
    }
    const literals = [...expression.matchAll(/"((?:[^"\\]|\\.)*)"|`([^`]*)`/g)]
      .map((lit) => lit[1] ?? lit[2])
      .filter(Boolean);
    // The usual shape is `city === "nairobi" ? "Nairobi" : city ===
    // "accra" ? "Accra" : launchedCityPhrase()`. The last branch is a
    // call rather than a literal and is the widest of the three, so
    // without this the neutral domain goes unmeasured.
    if (/launchedCityPhrase\(/.test(expression)) {
      literals.push(WIDEST_CITY_PHRASE);
    }
    if (!literals.length) continue;
    values.set(
      name,
      literals.reduce((a, b) => (widthPx(b, 14) > widthPx(a, 14) ? b : a)),
    );
  }
  return values;
}

function render(raw, consts) {
  let text = RENDERED.reduce((acc, [re, value]) => acc.replace(re, value), raw);

  // Consts can hold consts, so resolve until it settles. Bounded rather
  // than while(true) because a self-referential const would not.
  for (let pass = 0; pass < 4 && text.includes("${"); pass += 1) {
    text = text.replace(/\$\{\s*([A-Za-z_$][\w$]*)\s*\}/g, (whole, name) =>
      consts.has(name) ? consts.get(name) : whole,
    );
  }

  text = text
    .replace(/\\"/g, '"')
    .replace(/\s+/g, " ")
    .trim();

  // An interpolation nothing could resolve would be measured as literal
  // punctuation and quietly pass. Say so instead of guessing.
  return { text, unresolved: /\$\{/.test(text) };
}

// The metadata export, brace-matched rather than regexed to a closing
// line, because the bodies contain comments and nested objects. Tracks
// string and comment state so a brace inside either does not count.
function metaSource(src) {
  const signature =
    /export\s+(?:async\s+)?function\s+generateMetadata\s*\(|export\s+const\s+metadata\b[^=]*=/.exec(
      src,
    );
  if (!signature) return null;

  // For a function, the brace that opens the body is the one after the
  // parameter list closes — not the first brace, which may be a
  // destructuring pattern in the parameters. /insights takes
  // { searchParams }, and reading that as the body found no copy at all.
  let cursor = signature.index + signature[0].length;
  if (signature[0].endsWith("(")) {
    let parens = 1;
    while (cursor < src.length && parens > 0) {
      if (src[cursor] === "(") parens += 1;
      else if (src[cursor] === ")") parens -= 1;
      cursor += 1;
    }
  }

  const open = src.indexOf("{", cursor);
  if (open === -1) return null;

  let depth = 0;
  let quote = "";
  for (let i = open; i < src.length; i += 1) {
    const ch = src[i];
    if (quote) {
      if (ch === "\\") i += 1;
      else if (ch === quote) quote = "";
      continue;
    }
    if (ch === "/" && src[i + 1] === "/") {
      i = src.indexOf("\n", i);
      if (i === -1) break;
      continue;
    }
    if (ch === "/" && src[i + 1] === "*") {
      i = src.indexOf("*/", i) + 1;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      quote = ch;
      continue;
    }
    if (ch === "{") depth += 1;
    else if (ch === "}") {
      depth -= 1;
      if (depth === 0) return src.slice(open, i + 1);
    }
  }
  return null;
}

// Every string a key could resolve to, whether it is written inline on
// the key or assigned to a const above the return, and whether it is one
// literal or the branches of a ternary. All of them are measured; the
// widest is the one that decides whether the page overflows.
function candidates(block, key, consts) {
  const re = new RegExp(
    `\\b(?:const\\s+${key}\\s*=|${key}:)([\\s\\S]*?)` +
      `(?=\\n\\s*(?:[a-zA-Z_$][\\w$]*\\s*:|\\}|const\\s|return\\s))`,
    "g",
  );
  const out = [];
  for (const match of block.matchAll(re)) {
    for (const lit of match[1].matchAll(
      /"((?:[^"\\]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g,
    )) {
      const raw = lit[1] ?? lit[2];
      // Skips the fragments that are plainly not snippet copy: a
      // canonical path, a type string, an icon name.
      if (!raw || raw.length < 12 || raw.startsWith("/")) continue;
      out.push(render(raw, consts));
    }
    // A value assigned straight from a helper, with no literal to find.
    for (const [pattern, value] of CALL_VALUES) {
      if (pattern.test(match[1])) out.push({ text: value, unresolved: false });
    }
  }
  return out;
}

// openGraph and twitter mirror the title and description for social
// cards, where the limits are different and nothing truncates at 600px.
// Measuring them as page titles double-counted /about, whose card title
// is `${title} | ${site.name}` and so appeared to say Goldstay twice.
function withoutSocialBlocks(block) {
  return block.replace(
    /\b(?:openGraph|twitter)\s*:\s*\{[\s\S]*?\n(\s*)\},?/g,
    "",
  );
}

// Routes crawlers are told not to fetch, mirroring the disallow list in
// src/app/robots.ts. These are behind auth or gated by a token, so they
// have no search result to overflow. Kept as prefixes here rather than
// imported because robots.ts is TSX that reads request headers.
const NOT_PUBLIC = [
  "/admin",
  "/client",
  "/auth",
  "/login",
  "/account",
  "/api",
  "/go",
  "/agreements",
  "/statements",
  "/apply",
  "/start",
];

const isPublic = (route) =>
  !NOT_PUBLIC.some((p) => route === p || route.startsWith(`${p}/`));

// Walks src/app for directories holding a page.tsx, which is what makes
// a route in the App Router. Route groups are parentheses in the path
// and contribute no segment.
function routePaths() {
  const found = [];
  const walk = (dir, segments) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const next = join(dir, entry.name);
      const grouped =
        (entry.name.startsWith("(") && entry.name.endsWith(")")) ||
        entry.name.startsWith("_");
      const path = grouped ? segments : [...segments, entry.name];
      if (existsSync(join(next, "page.tsx"))) {
        found.push({ route: `/${path.join("/")}`, file: join(next, "page.tsx") });
      }
      walk(next, path);
    }
  };
  walk(APP, []);
  return found;
}

// A page with no metadata export inherits its layout's, which for the
// marketing group is the homepage — the most valuable title on the site
// and the one this script could not see until v1.63.0, by which point
// it had been shipping a 826px title against a 600px budget for twelve
// releases. The page loop skips anything with no metadata export, so
// the default had to be read from the layout itself.
function layoutDefaults() {
  const rows = [];
  const walk = (dir, segments) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const next = join(dir, entry.name);
      const grouped =
        (entry.name.startsWith("(") && entry.name.endsWith(")")) ||
        entry.name.startsWith("_");
      const path = grouped ? segments : [...segments, entry.name];
      const file = join(next, "layout.tsx");
      if (existsSync(file)) {
        const route = `/${path.join("/")}`;
        const src = readFileSync(file, "utf8");
        const block = metaSource(src);
        // A layout that sets no title default supplies nothing a search
        // result displays, and one covering noindex routes has no
        // result to display it in.
        if (
          block &&
          isPublic(route) &&
          !/robots:[\s\S]{0,120}?index:\s*false/.test(block)
        ) {
          const consts = constValues(src);
          const copy = withoutSocialBlocks(block);
          // `default` rather than `title`, because a layout's title is
          // an object holding both the default and the "%s | Goldstay"
          // template, and the template is not a title anybody sees.
          const titles = candidates(copy, "default", consts);
          const descriptions = candidates(copy, "description", consts);
          if (titles.length || descriptions.length) {
            rows.push({ route, titles, descriptions });
          }
        }
      }
      walk(next, path);
    }
  };
  walk(APP, []);
  return rows;
}

export function readRoutes() {
  const rows = [];
  const unparsed = [];

  const measured = [];

  for (const { route, file } of routePaths().sort((a, b) =>
    a.route.localeCompare(b.route),
  )) {
    // Dynamic routes carry no static copy to measure — the article
    // detail page reads its title from the catalogue, which the
    // article pass already covers.
    if (route.includes("[")) continue;
    if (!isPublic(route)) continue;

    const src = readFileSync(file, "utf8");
    const block = metaSource(src);

    // A page with no metadata export inherits its layout's, which
    // layoutDefaults() measures once rather than 40 times.
    if (!block) continue;

    // Only pages Google is allowed to index can overflow a search
    // result. The rest are embed and intake routes.
    if (/robots:[\s\S]{0,120}?index:\s*false/.test(block)) continue;

    const consts = constValues(src);
    const copy = withoutSocialBlocks(block);

    // The marketing layout sets a "%s | Goldstay" template, so a page
    // title reaches the head with the brand appended unless it opts out
    // with title.absolute. Measure what the head will actually carry.
    const absolute = /title:\s*\{[\s\S]{0,80}?absolute/.test(block);

    measured.push({
      route,
      titles: candidates(copy, "title", consts),
      descriptions: candidates(copy, "description", consts),
      // A layout's default is the title; no template applies to it.
      suffix: absolute ? "" : " | Goldstay",
    });
  }

  // A layout default is already the finished title — the template it
  // sits beside applies to child pages, not to itself — so no suffix.
  for (const layout of layoutDefaults()) {
    measured.push({ ...layout, suffix: "" });
  }

  for (const { route, titles, descriptions, suffix } of measured) {
    if (!titles.length && !descriptions.length) {
      unparsed.push(route);
      continue;
    }

    const widest = (list) =>
      list.length
        ? list.reduce((a, b) => (b.px > a.px ? b : a))
        : null;

    const title = widest(
      titles.map((t) => ({ ...t, text: t.text + suffix, px: titlePx(t.text + suffix) })),
    );
    const description = widest(
      descriptions.map((d) => ({ ...d, px: descPx(d.text) })),
    );

    rows.push({
      slug: route,
      effectiveTitle: title?.text ?? null,
      effectiveDesc: description?.text ?? null,
      titlePx: title?.px ?? 0,
      descPx: description?.px ?? 0,
      branches: Math.max(titles.length, descriptions.length),
      unresolved: Boolean(title?.unresolved || description?.unresolved),
      // The brand appearing twice is not a truncation problem, but it
      // wastes the widest words in the snippet on a word already there.
      // Only meaningful where a suffix is being appended at all.
      brandRepeated: Boolean(
        suffix &&
          /Goldstay/.test((title?.text ?? "").slice(0, -suffix.length)),
      ),
    });
  }

  return { rows, unparsed };
}

// Reports one scope and returns how many problems it found. Thin
// descriptions and a repeated brand are printed but not counted: both
// are worth fixing and neither is Google cutting the snippet off.
function report(label, { rows, unparsed }) {
  const wideTitles = rows.filter((r) => r.titlePx > TITLE_PX);
  const wideDescs = rows.filter((r) => r.descPx > DESC_PX);
  const thinDescs = rows.filter((r) => r.descPx < DESC_THIN_PX);
  const unresolved = rows.filter((r) => r.unresolved);
  const brandRepeated = rows.filter((r) => r.brandRepeated);

  console.log(`Checked ${rows.length} ${label}.`);

  if (unparsed.length) {
    console.log(`\nCould not parse meta in ${unparsed.length} ${label}:`);
    for (const f of unparsed) console.log(`  ${f}`);
  }

  if (unresolved.length) {
    console.log(
      `\n${unresolved.length} ${label} interpolate something this script cannot resolve, so the width below is a guess — teach RENDERED about it:`,
    );
    for (const r of unresolved) console.log(`  ${r.slug}`);
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

  if (brandRepeated.length) {
    console.log(
      `\n${brandRepeated.length} title(s) already say Goldstay before the layout appends it:`,
    );
    for (const r of brandRepeated) {
      console.log(`  ${r.slug}\n          ${r.effectiveTitle}`);
    }
  }

  return unparsed.length + wideTitles.length + wideDescs.length;
}

function main() {
  const scope = argv.includes("--routes")
    ? "routes"
    : argv.includes("--articles")
      ? "articles"
      : "all";

  if (argv.includes("--csv")) {
    const { rows } = scope === "routes" ? readRoutes() : readArticles();
    console.log(
      "slug,title_px,desc_px,title_override,desc_override,title,description",
    );
    const csv = (s) => `"${String(s ?? "").replace(/"/g, '""')}"`;
    for (const r of rows) {
      console.log(
        [
          r.slug,
          r.titlePx,
          r.descPx,
          r.hasTitleOverride ?? "",
          r.hasDescOverride ?? "",
          csv(r.effectiveTitle),
          csv(r.effectiveDesc),
        ].join(","),
      );
    }
    process.exit(0);
  }

  let failed = 0;
  if (scope !== "routes") {
    failed += report("articles", readArticles());
  }
  if (scope !== "articles") {
    if (scope === "all") console.log("");
    failed += report("indexable routes", readRoutes());
  }

  if (failed === 0) {
    console.log("\nNo problems found.");
  } else if (argv.includes("--strict")) {
    console.log(`\n${failed} problem(s).`);
    process.exitCode = 1;
  }
}

// Importing this module for widthPx or readArticles must not run the
// report, so only the process actually invoked on this file does.
if (argv[1] && fileURLToPath(import.meta.url) === argv[1]) main();

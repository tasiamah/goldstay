// One-off: give /airbnb-management inbound internal links from the
// Airbnb article cluster.
//
// The catalogue had 983 article-to-article links and exactly one
// pointing at the service page we want ranking for "airbnb management
// nairobi". A hundred-odd Airbnb articles linked only to each other, so
// the cluster's authority circulated among the posts and never reached
// the page that converts.
//
// Inserts one sentence at the end of each article's "How Goldstay
// handles it" section, which is the spot where the reader has just been
// told we operate this for owners and where a link to the service is
// genuinely useful rather than an interruption.
//
// Anchor text rotates. Forty-four identical anchors read as a template
// to a search engine and pass far less topical signal than varied
// in-content phrasing does, and it looks like boilerplate to a reader
// working through several articles.
//
// Idempotent: skips any file that already links to the service page.
// Kept in the repo as a record of how these links got there.

import { readFileSync, writeFileSync } from "node:fs";
import { readdirSync } from "node:fs";
import { join } from "node:path";

const POSTS = "src/app/(marketing)/insights/posts";
const TARGET = "/airbnb-management";
const LINK_CLASS =
  "underline decoration-gold-500 underline-offset-4 hover:text-gold-700";

// Each entry is [before the link, anchor text, after the link]. Written
// out longhand rather than templated so each one reads like a sentence
// somebody wrote.
//
// No leading or trailing spaces on the fragments. JSX strips whitespace
// at the start and end of a line and drops newlines adjacent to a tag,
// so a literal space before <Link> vanishes and renders "ourAirbnb".
// The spacing is reinserted below as an explicit {" "} expression, which
// is what the rest of these articles already do.
const SENTENCES = [
  [
    "If you would rather not run any of this yourself, it is what our",
    "Airbnb management service in Nairobi",
    "exists to do.",
  ],
  [
    "All of it is included in",
    "full Airbnb management in Nairobi",
    ", if you would rather hand the property over.",
  ],
  [
    "Owners who would rather not think about it at all use our",
    "Airbnb and short-stay management",
    "instead.",
  ],
  [
    "It is one of the standing items in our",
    "short-stay management service in Nairobi",
    ".",
  ],
  [
    "See what else is covered under",
    // Curly apostrophe deliberately. A straight one in JSX text trips
    // react/no-unescaped-entities, which next build treats as fatal.
    "Goldstay\u2019s Airbnb management in Nairobi",
    ".",
  ],
  [
    "If you want the whole operation handled end to end, that is",
    "Airbnb management in Nairobi",
    ".",
  ],
  [
    "This is standard on every unit under",
    "our Airbnb management",
    ", rather than something an owner has to ask for.",
  ],
  [
    "Handing the operation over is the other option: here is",
    "how our Nairobi short-stay management works",
    ".",
  ],
];

const files = readdirSync(POSTS).filter(
  (f) => f.endsWith(".tsx") && !f.startsWith("_"),
);

let changed = 0;
let skipped = 0;
let rotation = 0;

for (const file of files.sort()) {
  const path = join(POSTS, file);
  const src = readFileSync(path, "utf8");

  // Only the Kenyan Airbnb cluster. A Ghana article must not invite the
  // reader to a Nairobi service page, and a pure long-let or tax piece
  // has no business pitching short-stay management.
  if (!src.includes('"Airbnb"')) continue;
  if (!src.includes('country: "kenya"')) continue;
  if (!src.includes('id="how-goldstay-handles-it"')) continue;

  if (src.includes(`href="${TARGET}`)) {
    skipped += 1;
    continue;
  }

  // Anchor on the "Related reading" paragraph, which closes the section.
  const marker = src.indexOf("        Related reading:");
  if (marker === -1) {
    skipped += 1;
    continue;
  }

  // Walk back to the opening <P> of that paragraph so the new one lands
  // before it rather than inside it.
  const openTag = src.lastIndexOf("      <P>", marker);
  if (openTag === -1) {
    skipped += 1;
    continue;
  }

  const [before, anchor, after] = SENTENCES[rotation % SENTENCES.length];
  rotation += 1;

  // A closing fragment that opens with punctuation butts straight up
  // against the anchor; anything else needs a space put back.
  const tail = /^[.,;:!?]/.test(after) ? `</Link>` : `</Link>{" "}`;

  const block =
    `      <P>\n` +
    `        ${before}{" "}\n` +
    `        <Link\n` +
    `          href="${TARGET}"\n` +
    `          className="${LINK_CLASS}"\n` +
    `        >\n` +
    `          ${anchor}\n` +
    `        ${tail}\n` +
    `        ${after}\n` +
    `      </P>\n\n`;

  writeFileSync(path, src.slice(0, openTag) + block + src.slice(openTag));
  changed += 1;
}

console.log(`linked: ${changed}`);
console.log(`skipped: ${skipped}`);

// One-off: give every remaining article an inbound link to whichever
// service page it is actually about.
//
// Two earlier passes did this for the Airbnb cluster
// (link-service-page.mjs) and for hand-picked long-let and tenant
// articles (link-management-pages.mjs). Between them they covered 108
// of 350 articles, which left 242 with no link to anything a reader
// could buy — the corpus held 982 article-to-article links against 126
// pointing at a page that converts.
//
// That ratio is the problem. A search engine distributes a page's
// authority across its outbound links, so a cluster that links almost
// entirely to itself recirculates its own standing and passes very
// little to the pages that need to rank. It also means a reader who
// finishes an article about, say, vacancy has nowhere to go except
// another article about vacancy.
//
// Rather than curate 242 slugs by hand, this routes on the slug and
// tags, taking the first rule that matches. The rules are ordered
// most-specific-first, so an Airbnb piece goes to Airbnb management
// even though it would also match the broader management rule. Any
// article that matches nothing is left alone: a link that does not fit
// the paragraph it sits in is worse than no link, both for the reader
// and as a relevance signal.
//
// Insertion mechanics, anchor rotation and the guards are the same as
// link-management-pages.mjs, deliberately — see the comments there.
//
// Idempotent: skips any article already linking to a service page.
// Dry run by default; pass --apply to write.

import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { argv } from "node:process";

const APPLY = argv.includes("--apply");
const POSTS = "src/app/(marketing)/insights/posts";
const LINK_CLASS =
  "underline decoration-gold-500 underline-offset-4 hover:text-gold-700";

// Every page a link here may point at. An article already linking to
// any of these is left alone, so no article ends up with two service
// links from these passes.
const SERVICE_HREFS = [
  "/airbnb-management",
  "/long-term-management",
  "/tenant-finding",
  "/property-sourcing",
  "/yield-calculator",
  "/diaspora-payouts",
  "/list-your-property",
];

// Ordered. First match wins, so the narrow patterns sit above the
// broad ones.
//
// The order also decides where the links pool, and that is a choice
// rather than a side effect. An earlier draft put sourcing third with a
// wide pattern and it took 140 of 176 links, because most of the
// catalogue touches buying somewhere. That would have poured the
// corpus's authority into the one service that earns nothing — sourcing
// is free to the buyer — while long-term and tenant finding, which are
// 10% and a month's rent, got two links and nine.
//
// So the two revenue services are matched first and broadly, sourcing
// last and narrowly. Relevance still gates everything: ops, tax and
// compliance pieces genuinely belong with long-term management, since
// filing MRI and running maintenance is what the 10% buys.
const ROUTES = [
  {
    target: "/airbnb-management",
    slug: /airbnb|short-stay|short-let|guest|occupancy|nightly|host|serviced-apartment|co-living|welcome-basket|hospitality/,
    tag: /Airbnb|Short Stay|Short Let|Guest|Hospitality|Occupancy/i,
  },
  {
    target: "/tenant-finding",
    slug: /tenant|vacan|evict|deposit|how-to-rent|negotiate-rent|rent-negotiat|lease|arrears|how-much-rent/,
    tag: /Tenant|Vacancy|Lease|Eviction|Letting/i,
  },
  {
    // Area guides land here rather than with sourcing. The page carries
    // a "what a managed home earns, area by area" grid for exactly
    // these neighbourhoods, so a reader finishing a Kileleshwa guide is
    // being sent to the section that prices Kileleshwa — not to a
    // generic pitch.
    target: "/long-term-management",
    slug: /management|maintenance|service-charge|landlord|rental|insurance|paybill|solar|smart-home|furnish|caretaker|repair|utilit|water|power|security|snagging|handover|mri|tax|kra|withholding|compliance|levy|land-rates|complete-guide|gated-communit|compound|suburb|corridor|neighbourhood|estates/,
    tag: /Property Management|Landlord|Maintenance|Operations|Service Charge|Rental|Tax|MRI|Withholding|Compliance|Neighbourhood/i,
  },
  {
    target: "/diaspora-payouts",
    slug: /usd|fx|remit|send-money|sending-money|payout|paid-usd|forex|wise|swift/,
    tag: /USD|FX|Remittance|Payments|Diaspora Payouts/i,
  },
  {
    target: "/yield-calculator",
    slug: /yield|roi|return|best-neighbourhood|best-places|best-suburb|cheapest|rental-income|cash-flow|appreciation|capital-growth/,
    tag: /Yield|Returns|Investment|ROI/i,
  },
  {
    target: "/property-sourcing",
    slug: /buying|buyer|buy|first-time|off-plan|developer|sale-agreement|offer-letter|stamp-duty|negotiate-price|distressed|auction|conveyanc|due-diligence|transfer-process|title-fraud|fake-title|verify-kenyan-title|cartel|valuation|review-2026|mortgage|sacco|kmrc|plot|affordable-housing|boma-yangu|ardhisasa|freehold|leasehold|succession|power-of-attorney/,
    tag: /Buying|Buyer|Off-Plan|Developer|Sale Agreement|Diligence|Mortgage|Finance|Title|Legal/i,
  },
];

// [before, anchor, after]. No leading or trailing spaces on the
// fragments; JSX drops whitespace next to a tag and the spacing is
// reinserted as {" "} below. Curly apostrophes only — a straight one in
// JSX text trips react/no-unescaped-entities, which next build treats
// as fatal.
const SENTENCES = {
  "/airbnb-management": [
    ["Owners who would rather not run any of this themselves hand it to our", "Airbnb management service in Nairobi", "."],
    ["It is part of what is covered by", "full short-stay management in Nairobi", "."],
    ["We run this side of it for owners under", "Goldstay\u2019s Airbnb management", "."],
    ["If you would rather the unit were simply operated for you, that is", "short-stay management in Nairobi", "."],
    ["This is one of the standing items in", "our Nairobi Airbnb management", "."],
    ["Handing the whole operation over is the other route:", "how our Airbnb management works", "."],
  ],
  "/tenant-finding": [
    ["If you only need the tenant found and referenced, that is", "our tenant finding service in Nairobi", "."],
    ["We take this stage on its own for landlords who keep the rest:", "tenant finding in Nairobi", "."],
    ["Vetting at this level is what", "our tenant finding and vetting", "is built around."],
    ["If the unit is sitting empty and you want it let properly, that is", "tenant finding", "."],
    ["See how we work through it under", "Goldstay\u2019s tenant finding service", "."],
    ["Landlords who manage their own property still come to us for", "tenant finding and referencing", "."],
  ],
  "/property-sourcing": [
    ["We run this diligence for buyers as part of", "our property sourcing service", ", which is free to the buyer."],
    ["Buyers who would rather have it done on the ground for them use", "Goldstay\u2019s property sourcing", "."],
    ["This is one of the checks we run under", "property sourcing in Nairobi", "."],
    ["If you would rather not do this from abroad, that is what", "our buying service", "exists for."],
    ["It is standard on every purchase we source: see", "how property sourcing works", "."],
    ["We do this work for sourcing clients before a shilling changes hands. See", "our property sourcing", "."],
    ["None of it needs doing twice if you buy through", "our sourcing service", "."],
    ["We do the legwork on this for buying clients under", "property sourcing", "."],
    ["If you want somebody in Nairobi doing this on your behalf, that is", "what we source for", "."],
    ["Buying through", "Goldstay\u2019s sourcing", "means this is checked before you are asked to commit."],
    ["It is the sort of thing", "our buy-side sourcing", "is meant to catch early."],
    ["We shortlist and verify on your brief. See", "buying property with Goldstay", "."],
    ["This is exactly the stage where", "an on-the-ground sourcing agent", "earns their keep."],
    ["Have somebody check it in person for you:", "our Nairobi property sourcing", "is free to the buyer."],
  ],
  "/long-term-management": [
    ["All of it sits with us under", "full long-term management in Nairobi", ", if you would rather hand the tenancy over."],
    ["Landlords who would rather not field any of it use our", "long-term property management", "instead."],
    ["It is one of the standing items in our", "long-term management service in Nairobi", "."],
    ["If you want the tenancy run end to end, that is", "long-term rental management", "."],
    ["This is standard on every property under", "our long-term management", ", rather than something a landlord has to ask for."],
    ["See what else is covered by", "Goldstay\u2019s long-term management in Nairobi", "."],
    // Written for the area guides that route here: the service page
    // carries a per-neighbourhood earnings grid, so point at it.
    ["What a managed home here actually earns is set out under", "our long-term management", "."],
    ["We publish the rent bands we achieve area by area on", "the long-term management page", "."],
    ["If you already own here, this is what", "letting it through Goldstay", "would involve."],
    ["We manage across this part of the city. See", "long-term management in Nairobi", "."],
  ],
  "/diaspora-payouts": [
    ["How the money actually reaches you is set out in", "our guide to diaspora payouts", "."],
    ["We wire the balance out monthly, and the rails and spreads are compared in", "diaspora payouts", "."],
    ["If you want to see which route costs least, we break it down in", "receiving Kenyan rent in USD", "."],
    ["This is the mechanism behind", "our monthly USD payouts", "."],
    ["The FX side of it is covered separately in", "how diaspora landlords get paid", "."],
  ],
  "/yield-calculator": [
    ["You can run your own numbers on this in", "our yield calculator", "."],
    ["If you want the figure for your own property, the", "Nairobi yield calculator", "shows every assumption."],
    ["It is worth modelling before you commit. The", "yield calculator", "will do it with your numbers."],
    ["We built a", "yield calculator", "so you can check this against your own rent rather than ours."],
    ["Put your own rent through", "the yield calculator", "to see where this lands."],
    ["The arithmetic is easier to see with your own figures in", "the yield calculator", "."],
    ["Rather than take our word for the numbers, run them:", "yield calculator", "."],
    ["Every assumption behind a figure like this is shown in", "our yield calculator", "."],
  ],
};

const problems = [];
const skipped = { alreadyLinked: 0, noSection: 0, noRoute: 0, notKenya: 0, noImport: 0 };
const perTarget = {};
let applied = 0;

const files = readdirSync(POSTS)
  .filter((f) => f.endsWith(".tsx") && !f.includes(".test."))
  .sort();

const rotation = {};

for (const file of files) {
  const path = join(POSTS, file);
  if (!existsSync(path)) continue;
  const slug = file.replace(/\.tsx$/, "");
  const src = readFileSync(path, "utf8");

  if (SERVICE_HREFS.some((h) => src.includes(`href="${h}"`))) {
    skipped.alreadyLinked += 1;
    continue;
  }
  if (!src.includes('country: "kenya"')) {
    skipped.notKenya += 1;
    continue;
  }
  if (!src.includes('id="how-goldstay-handles-it"')) {
    skipped.noSection += 1;
    continue;
  }
  if (!/^import Link from "next\/link";$/m.test(src)) {
    skipped.noImport += 1;
    continue;
  }

  // Tags come from the meta block, which is the top of the file.
  const tagsRaw = /tags:\s*\[([^\]]*)\]/.exec(src);
  const tags = tagsRaw
    ? [...tagsRaw[1].matchAll(/"([^"]+)"/g)].map((m) => m[1])
    : [];

  const route = ROUTES.find(
    (r) => r.slug.test(slug) || tags.some((t) => r.tag.test(t)),
  );
  if (!route) {
    skipped.noRoute += 1;
    continue;
  }

  const { target } = route;
  const set = SENTENCES[target];
  rotation[target] = (rotation[target] ?? 0) + 1;
  const [before, anchor, after] = set[(rotation[target] - 1) % set.length];

  const marker = src.indexOf("        Related reading:");
  const insertAt =
    marker === -1
      ? src.lastIndexOf("    </>")
      : src.lastIndexOf("      <P>", marker);
  if (insertAt === -1) {
    problems.push(`${slug}: could not find an insertion point`);
    continue;
  }

  const tail = /^[.,;:!?]/.test(after) ? `</Link>` : `</Link>{" "}`;
  const block =
    `      <P>\n` +
    `        ${before}{" "}\n` +
    `        <Link\n` +
    `          href="${target}"\n` +
    `          className="${LINK_CLASS}"\n` +
    `        >\n` +
    `          ${anchor}\n` +
    `        ${tail}\n` +
    `        ${after}\n` +
    `      </P>\n` +
    (marker === -1 ? `` : `\n`);

  if (APPLY) writeFileSync(path, src.slice(0, insertAt) + block + src.slice(insertAt));
  perTarget[target] = (perTarget[target] ?? 0) + 1;
  applied += 1;
}

console.log(`${APPLY ? "Applied" : "Would apply"}: ${applied} links\n`);
for (const [t, n] of Object.entries(perTarget).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(n).padStart(3)}  ${t}`);
}
console.log(`\nSkipped:`);
for (const [k, n] of Object.entries(skipped)) {
  if (n) console.log(`  ${String(n).padStart(3)}  ${k}`);
}
if (problems.length) {
  console.log(`\nProblems (${problems.length}):`);
  for (const p of problems) console.log(`  ! ${p}`);
  process.exitCode = 1;
}

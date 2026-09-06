// One-off: give /long-term-management and /tenant-finding inbound
// internal links from the articles that are actually about them.
//
// Sibling of link-service-page.mjs, which did this for
// /airbnb-management. That one worked: 49 files now link to the Airbnb
// service page. These two had three inbound links each, all from the
// nav and footer, and none at all from the 350 articles. Every long-let
// article linked only to other articles, so the cluster's authority
// circulated among the posts and never reached the two pages a landlord
// converts on.
//
// The target lists below are written out by hand rather than matched
// with a regex. A pattern loose enough to catch the arrears and
// vetting pieces also catches two hundred articles about mortgages,
// title deeds and which suburb to buy in, and a service link dropped
// into a piece about stamp duty is the wrong offer in the wrong place.
// Curating them is slower but every link here fits the sentence it
// sits in.
//
// The split: articles about getting a tenant into an empty unit go to
// /tenant-finding, articles about running an occupied one go to
// /long-term-management. Tenant-facing pieces (how to negotiate your
// rent, what to do if your landlord walks in) are deliberately absent
// from both — the reader is a renter, not a landlord, and pitching
// either service to them is a mismatch.
//
// Inserts one sentence at the end of the "How Goldstay handles it"
// section, where the reader has just been told we run this for
// landlords and a link to the service is useful rather than an
// interruption. One link per article, never two.
//
// Anchor text rotates. Identical anchors across twenty articles read as
// a template to a search engine and pass far less topical signal than
// varied in-content phrasing, and look like boilerplate to a reader
// working through several pieces.
//
// Idempotent: skips any file already linking to either target. Dry run
// unless --apply. Kept in the repo as a record of how these links got
// there.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const POSTS = "src/app/(marketing)/insights/posts";
const APPLY = process.argv.includes("--apply");
const LINK_CLASS =
  "underline decoration-gold-500 underline-offset-4 hover:text-gold-700";

// Running an occupied property: rent, arrears, incidents, compliance,
// and the multi-unit pieces where the whole question is who operates it.
const LONG_TERM = [
  "property-management-nairobi-what-you-actually-get-2026",
  "why-most-nairobi-landlords-dont-make-money",
  "mpesa-paybill-rent-collection-nairobi-landlords",
  "what-to-do-if-tenant-refuses-to-pay-rent",
  "how-to-evict-tenant-kenya-legally",
  "tenant-deposit-disputes-nairobi",
  "tenant-rights-kenya-complete-guide",
  "insurance-kenya-rental-property-diaspora-landlords",
  "hoa-and-management-company-fees-nairobi-explained",
  "solar-and-backup-power-nairobi-rental-property",
  "smart-home-features-that-drive-rent-premiums-nairobi",
  "why-amenities-matter-nairobi-rental-property",
  "btl-portfolio-building-nairobi",
  "multi-unit-property-investment-nairobi",
  "eastleigh-rental-machine-investor-guide",
  "student-housing-investment-nairobi",
  "co-living-nairobi-emerging-investor-segment",
  "house-hacking-nairobi-strategy",
  "villa-vs-apartment-nairobi-which-rents-better",
  "total-cost-ownership-nairobi-apartment-2026",
  "why-senior-corporate-nairobians-buying-multi-unit",
];

// Getting a tenant into an empty unit: vacancy, pricing to let, who
// the tenant pool is, and what an agent charges to find one.
const TENANT_FINDING = [
  "why-your-nairobi-rental-keeps-going-vacant",
  "diplomatic-tenant-market-gigiri-rosslyn-runda-un-embassy-rent",
  "estate-agent-commission-kenya-explained",
  "nairobi-rent-prices-2026-by-neighbourhood-actual-numbers",
  "where-gen-z-renting-nairobi-2026",
  "international-schools-nairobi-rent-premium-isk-brookhouse-banda",
  "nairobi-neighbourhoods-rents-dropping-2026",
  "nairobi-handover-wave-2026-what-it-means-for-rents",
];

const SENTENCES = {
  "/long-term-management": [
    [
      "If you would rather not run any of this from six time zones away, it is what our",
      "long-term property management in Nairobi",
      "is for.",
    ],
    [
      "All of it sits with us under",
      "full long-term management in Nairobi",
      ", if you would rather hand the tenancy over.",
    ],
    [
      "Landlords who would rather not field any of it use our",
      "long-term property management",
      "instead.",
    ],
    [
      "It is one of the standing items in our",
      "long-term management service in Nairobi",
      ".",
    ],
    [
      "See what else is covered by",
      // Curly apostrophe deliberately. A straight one in JSX text trips
      // react/no-unescaped-entities, which next build treats as fatal.
      "Goldstay\u2019s long-term management in Nairobi",
      ".",
    ],
    [
      "If you want the tenancy run end to end, that is",
      "long-term property management",
      ".",
    ],
    [
      "This is standard on every property under",
      "our long-term management",
      ", rather than something a landlord has to ask for.",
    ],
    [
      "Handing the tenancy over is the other route: here is",
      "how our Nairobi long-term management works",
      ".",
    ],
  ],
  "/tenant-finding": [
    [
      "If you only need the tenant found and referenced, that is what",
      "our tenant finding service in Nairobi",
      "does.",
    ],
    [
      "We also run this as a standalone piece of work:",
      "tenant finding in Nairobi",
      ".",
    ],
    [
      "Landlords who manage their own property still come to us for",
      "tenant finding and vetting",
      ".",
    ],
    [
      "This is the stage we handle under",
      "tenant finding in Nairobi",
      ", for landlords who want to keep the rest themselves.",
    ],
    [
      "See how we work through it under",
      "Goldstay\u2019s tenant finding service",
      ".",
    ],
    [
      "If the unit is sitting empty and you want it let properly, that is",
      "tenant finding",
      ".",
    ],
    [
      "Referencing at this level is what",
      "our tenant finding service",
      "is built around.",
    ],
    [
      "We can take just this stage: here is",
      "how tenant finding in Nairobi works",
      ".",
    ],
  ],
};

const problems = [];
let applied = 0;

for (const [target, slugs] of Object.entries({
  "/long-term-management": LONG_TERM,
  "/tenant-finding": TENANT_FINDING,
})) {
  const set = SENTENCES[target];
  let rotation = 0;
  console.log(`\n${target}`);

  for (const slug of slugs) {
    const path = join(POSTS, `${slug}.tsx`);
    if (!existsSync(path)) {
      problems.push(`${slug}: no such article`);
      continue;
    }
    const src = readFileSync(path, "utf8");

    // Guard the assumptions the curated list is resting on, rather
    // than trusting that they still hold.
    if (!src.includes('country: "kenya"')) {
      problems.push(`${slug}: not a Kenya article`);
      continue;
    }
    if (!src.includes('id="how-goldstay-handles-it"')) {
      problems.push(`${slug}: no "How Goldstay handles it" section`);
      continue;
    }
    if (!/^import Link from "next\/link";$/m.test(src)) {
      problems.push(`${slug}: does not import Link`);
      continue;
    }
    if (
      src.includes('href="/tenant-finding') ||
      src.includes('href="/long-term-management')
    ) {
      console.log(`  = ${slug} (already linked)`);
      continue;
    }

    // The section is the last one in every article that has it, so the
    // end of the article is the end of the section. Where a closing
    // "Related reading" paragraph exists, go in above it so the piece
    // still ends on the related links, matching the Airbnb cluster.
    const marker = src.indexOf("        Related reading:");
    const insertAt =
      marker === -1
        ? src.lastIndexOf("    </>")
        : src.lastIndexOf("      <P>", marker);
    if (insertAt === -1) {
      problems.push(`${slug}: could not find an insertion point`);
      continue;
    }

    const [before, anchor, after] = set[rotation % set.length];
    rotation += 1;

    // A closing fragment opening with punctuation butts straight up
    // against the anchor; anything else needs the space put back, since
    // JSX drops whitespace adjacent to a tag.
    const tail = /^[.,;:!?]/.test(after) ? `</Link>` : `</Link>{" "}`;

    // A blank line after the paragraph separates it from the next one,
    // but going in as the last paragraph there is nothing to separate
    // from and the blank line would sit against the closing fragment.
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

    console.log(`  + ${slug}  ->  "${anchor}"`);
    if (APPLY) {
      writeFileSync(path, src.slice(0, insertAt) + block + src.slice(insertAt));
    }
    applied += 1;
  }
}

if (problems.length) {
  console.log(`\nProblems (${problems.length}):`);
  for (const p of problems) console.log(`  ! ${p}`);
}
console.log(`\n${APPLY ? "Applied" : "Would apply"}: ${applied} links`);
if (problems.length) process.exitCode = 1;

// Postgres mirror for the outbound acquisition scrape.
//
// The scraper already mirrors every surfaced listing into Airtable
// for ops to action. We *also* write the actionable subset (those
// with a name + phone) into the same `Lead` table the inbound form
// uses, so /admin/leads becomes the single pane of glass instead of
// "remember to also check Airtable".
//
// Dedupe key is the canonical listing URL — re-scraping the same
// Airbnb / BuyRentKenya page night after night must collapse onto
// the original row, not pile up. We override the default
// email+phone+name dedupe inside createLead() with sha1(url).
//
// Skip rules — keep the call list clean:
//   * No listerName → no human to ask for
//   * No listerPhone → no callback channel (email is rare on these
//     sources and "go message via the listing" is not a workflow we
//     want ops to do at scale)
//   * Already classified Likely agent → wouldn't have been surfaced
//     anyway, but defence-in-depth
//
// The function returns "inserted" / "deduped" / "skipped" so the
// scrape orchestrator can put real numbers in the workflow log.

import { createHash } from "node:crypto";
import { createLead } from "@/lib/leads";
import type { ClassifiedListing } from "./types";

export type ScrapedLeadResult = "inserted" | "deduped" | "skipped";

// Stable dedupe key for a listing URL. Independent of email/phone
// so a lister who changes their displayed phone between scrapes
// still maps to the same Lead row. Exported for tests.
export function leadHashForUrl(url: string): string {
  return createHash("sha1")
    .update(`scrape:${url.trim().toLowerCase()}`)
    .digest("hex")
    .slice(0, 32);
}

// Map the scraper's "Nairobi" / "Accra" city string onto the
// Country enum the Lead table uses. Anything else lands as null
// and the row is still created — ops triage from notes.
export function inferCountryFromCity(
  city: ClassifiedListing["city"],
): "KE" | "GH" | null {
  if (city === "Nairobi") return "KE";
  if (city === "Accra") return "GH";
  return null;
}

// "Can we action this listing?" gate — pure, no DB. The scrape
// orchestrator uses the same predicate the persistScrapedLead path
// relies on, so the count of leadsSkipped in the workflow log
// reflects the same rule.
export function shouldPersistScrapedLead(
  listing: ClassifiedListing,
): boolean {
  if (!listing.listerName?.trim()) return false;
  if (!listing.listerPhone?.trim()) return false;
  if (listing.listerType === "Likely agent") return false;
  return true;
}

// Pack the classifier's reasoning into a single notes blob so the
// admin lead detail page shows *why* this row appeared — score,
// source, link back to the original listing, and any free-text
// notes the scraper attached. Ops needs the URL especially: it's
// what you click during the callback so you can talk about the
// actual unit.
export function composeScrapedLeadNotes(listing: ClassifiedListing): string {
  const lines: string[] = [];
  lines.push(`Source: ${listing.source} (${listing.city})`);
  lines.push(`Listing: ${listing.url}`);
  lines.push(
    `Owner score ${listing.ownerScore} · Pain score ${listing.painScore} · ${listing.listerType}`,
  );
  if (listing.daysOnMarket !== undefined) {
    lines.push(`Days on market: ${listing.daysOnMarket}`);
  }
  if (listing.askingPriceUsd !== undefined) {
    lines.push(`Asking: USD ${listing.askingPriceUsd}/mo`);
  }
  if (listing.title) lines.push(`Title: ${listing.title}`);
  if (listing.notes) lines.push(`Notes: ${listing.notes}`);
  return lines.join("\n");
}

export async function persistScrapedLead(
  listing: ClassifiedListing,
): Promise<ScrapedLeadResult> {
  if (!shouldPersistScrapedLead(listing)) return "skipped";

  const name = listing.listerName!.trim();
  const phone = listing.listerPhone!.trim();
  const submissionHash = leadHashForUrl(listing.url);

  // createLead handles the unique-index collision path internally
  // — a second call with the same submissionHash returns the
  // existing row instead of throwing. We disambiguate "fresh row"
  // from "already had it" by comparing createdAt to now.
  const lead = await createLead({
    source: "OUTBOUND_SCRAPE",
    fullName: name,
    phone,
    country: inferCountryFromCity(listing.city),
    city: listing.city === "Other" ? undefined : listing.city,
    neighbourhood: listing.neighbourhood ?? null,
    bedrooms:
      listing.bedrooms !== undefined ? String(listing.bedrooms) : null,
    notes: composeScrapedLeadNotes(listing),
    submissionHash,
    actor: null,
  });

  // 2 second tolerance: createLead → Postgres round-trip on Vercel
  // is well under that, and a clock skew of a few hundred ms
  // shouldn't get us false positives on the "deduped" branch.
  return Date.now() - lead.createdAt.getTime() < 2_000
    ? "inserted"
    : "deduped";
}

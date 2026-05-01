// Airtable adapter for the Acquisition Targets table.
//
// Dedupe key is the listing URL: scrapers run nightly and naively
// re-emit every listing they find, so we either insert a brand-new
// row or PATCH last-seen / score fields on the existing one. This
// keeps ops reading one row per real-world listing instead of an
// ever-growing log.

import {
  airtableTables,
  createAirtableRecord,
  escapeFormulaValue,
  findFirstAirtableRecord,
  isAirtableConfigured,
  patchAirtableRecord,
} from "@/lib/airtable";
import type { ClassifiedListing } from "./types";

type ExistingFields = {
  Status?: string;
  "First seen"?: string;
};

function toFields(listing: ClassifiedListing): Record<string, unknown> {
  return {
    "Listing URL": listing.url,
    Source: listing.source,
    City: listing.city,
    Neighbourhood: listing.neighbourhood,
    Title: listing.title,
    Bedrooms: listing.bedrooms,
    "Asking price USD": listing.askingPriceUsd,
    "Listed on": listing.listedOn?.toISOString().slice(0, 10),
    "Days on market": listing.daysOnMarket,
    "Lister name": listing.listerName,
    "Lister phone": listing.listerPhone,
    "Lister type": listing.listerType,
    "Owner score": listing.ownerScore,
    "Pain score": listing.painScore,
    Notes: listing.notes,
  };
}

export type UpsertResult = "inserted" | "updated" | "skipped" | "no-airtable";

// Insert-or-update by Listing URL. Existing rows have their score
// fields refreshed and "Last seen" bumped; Status is *not* touched on
// update so an ops disposition (Contacted, Pitched, …) sticks.
export async function upsertAcquisitionTarget(
  listing: ClassifiedListing,
): Promise<UpsertResult> {
  if (!isAirtableConfigured()) return "no-airtable";

  const now = new Date().toISOString();
  const formula = `{Listing URL}='${escapeFormulaValue(listing.url)}'`;
  const existing = await findFirstAirtableRecord<ExistingFields>(
    airtableTables.acquisition,
    formula,
    ["Status", "First seen"],
  );

  if (existing) {
    const ok = await patchAirtableRecord(
      airtableTables.acquisition,
      existing.id,
      {
        ...toFields(listing),
        "Last seen": now,
        // Don't overwrite a manually-set status. Only nudge a row
        // back to "New" if it was somehow blank.
        ...(existing.fields.Status ? {} : { Status: "New" }),
      },
    );
    return ok ? "updated" : "skipped";
  }

  await createAirtableRecord(airtableTables.acquisition, {
    ...toFields(listing),
    "First seen": now,
    "Last seen": now,
    Status: "New",
  });
  return "inserted";
}

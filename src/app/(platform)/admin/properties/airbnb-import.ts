"use server";

import { requireAdmin } from "@/lib/auth";
import {
  EXTRACT_FAILURE_MESSAGE,
  fetchAirbnbListing,
} from "@/lib/airbnb/listing";
import { mapListingToProperty, type ImportMapping } from "@/lib/airbnb/to-property";

export type AirbnbImportResult =
  | { ok: true; mapping: ImportMapping }
  | { ok: false; error: string };

// Reads a public Airbnb listing and returns form defaults. Nothing is
// written: the operator gets a filled-in form they still have to check
// and submit, because the import cannot supply the address and gets
// the property name wrong by design (see to-property.ts).
//
// requireAdmin is not ceremony here. This makes our server fetch a URL
// chosen by the caller, which is the shape of an SSRF, so it is worth
// saying where the teeth are: fetchAirbnbListing never requests the
// string it is given. It parses a numeric room id out of it, rejects
// any host that is not airbnb under a public suffix, and rebuilds the
// URL from that id. An attacker who can reach this action still cannot
// point it at 169.254.169.254 or an internal service.
export async function importFromAirbnbAction(
  url: string,
): Promise<AirbnbImportResult> {
  await requireAdmin();

  const result = await fetchAirbnbListing(url);
  if (result.kind === "error") {
    return { ok: false, error: EXTRACT_FAILURE_MESSAGE[result.reason] };
  }

  return { ok: true, mapping: mapListingToProperty(result.listing) };
}

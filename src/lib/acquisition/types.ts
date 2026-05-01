// Outbound acquisition pipeline types.
//
// A RawListing is whatever a scraper extracts from a single listing
// page on a public source (Airbnb, BuyRentKenya, etc.) before any of
// our classification has been applied. An AcquisitionTarget is the
// post-classified row we mirror to Airtable for ops to action.

export type AcquisitionSource =
  | "Airbnb"
  | "BuyRentKenya"
  | "Property24"
  | "Jiji"
  | "Hauzisha"
  | "Facebook group"
  | "Manual";

// All scraper modules normalise their output to this shape. Anything
// the scraper can't extract should be left undefined; the classifier
// scores using only what is present.
export type RawListing = {
  source: AcquisitionSource;
  // Canonical, deduplicable URL. We use this as the Airtable primary
  // key, so it must be normalised (no tracking params, no fragments).
  url: string;
  city: "Nairobi" | "Accra" | "Other";
  neighbourhood?: string;
  title?: string;
  bedrooms?: number;
  // Asking *monthly rent* in USD. Sale prices are not interesting for
  // acquisition; this pipeline targets owners who want their unit let.
  askingPriceUsd?: number;
  listedOn?: Date;
  daysOnMarket?: number;
  listerName?: string;
  // International format with a leading +, no spaces. Empty string and
  // null are both treated as "no phone known".
  listerPhone?: string;
  // How many *other* listings the same lister has currently active on
  // the same source. Required for the owner-vs-agent classifier; the
  // scraper computes this in a second pass after pulling all results.
  listerListingCount?: number;
  // Free-text description / blurb — fed into the language-based
  // owner-vs-agent heuristic ("my apartment" vs "our agency").
  description?: string;
  // Any extra context worth surfacing to ops in the Notes column.
  notes?: string;
};

export type ListerType = "Likely owner" | "Likely agent" | "Unknown";

export type ClassifiedListing = RawListing & {
  ownerScore: number; // 0..100, higher = more likely owner
  painScore: number; // 0..100, higher = more in vacancy pain
  listerType: ListerType;
};

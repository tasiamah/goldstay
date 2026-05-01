// Airbnb scraper for the Acquisition Targets pipeline.
//
// Goal is *not* to mirror inventory — it's to surface tired hosts:
// owners with 1–3 listings whose occupancy or rating suggests they
// are exhausted by self-management and would sign with us in a heartbeat.
//
// Airbnb renders search results client-side, but their SSR HTML
// includes a large embedded JSON payload (`__NEXT_DATA__` and the
// `niobeMinimalClientData` block) that contains everything we need:
// listing url, lister name, listing count per host, price-per-night,
// review count and rating.
//
// What we extract is intentionally minimal and defensive: if the
// embedded JSON shape changes (it does, every quarter), every parse
// step short-circuits to undefined and we emit fewer or no rows
// rather than crashing the cron. Pure parsing functions are tested
// against synthetic fixtures in airbnb.test.ts to keep the regression
// surface small.

import { fetchHtml, FetchBlockedError, politeDelay } from "../fetch";
import type { RawListing } from "../types";

const SEARCH_URL_BY_CITY: Record<"nairobi" | "accra", string> = {
  nairobi: "https://www.airbnb.com/s/Nairobi--Kenya/homes",
  accra: "https://www.airbnb.com/s/Accra--Ghana/homes",
};

// Pulls the first <script id="__NEXT_DATA__" type="application/json">
// block out of an HTML string. Airbnb embeds the SSR state there.
// Returns null on any miss; callers treat that as "no listings".
export function extractNextData(html: string): unknown | null {
  const match = html.match(
    /<script[^>]+id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/,
  );
  if (!match || !match[1]) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

// Walks the (deeply nested, frequently-changing) Airbnb data tree
// looking for objects that look like a listing. Generic rather than
// path-specific so a structural rename of one wrapper key doesn't
// break us. Listings are recognised by having both a `listing` object
// with an `id` and a `pricingQuote` object with a price string.
type AirbnbListingShape = {
  listing: {
    id?: string;
    name?: string;
    user?: {
      id?: string;
      firstName?: string;
      smartName?: string;
      // Listings count for this host. Airbnb has used both
      // `listingsCount` and `numberOfListings` historically.
      listingsCount?: number;
      numberOfListings?: number;
    };
    bedrooms?: number;
    avgRatingLocalized?: string;
    reviewsCount?: number;
    publicAddress?: string;
    city?: string;
    neighborhood?: string;
    pdpUrlType?: string;
  };
  pricingQuote?: {
    rate?: { amount?: number; currency?: string };
    price?: { total?: { amount?: number; currency?: string } };
    structuredStayDisplayPrice?: {
      primaryLine?: { price?: string };
    };
  };
};

function looksLikeAirbnbListing(node: unknown): node is AirbnbListingShape {
  if (!node || typeof node !== "object") return false;
  const n = node as Record<string, unknown>;
  if (!n.listing || typeof n.listing !== "object") return false;
  const listing = n.listing as Record<string, unknown>;
  return typeof listing.id === "string" || typeof listing.id === "number";
}

export function findAirbnbListings(root: unknown): AirbnbListingShape[] {
  const out: AirbnbListingShape[] = [];
  const stack: unknown[] = [root];
  // Cap traversal to avoid a pathological blob eating the function
  // budget. ~100k nodes is plenty for one search page.
  let visited = 0;
  while (stack.length && visited < 100_000) {
    visited++;
    const node = stack.pop();
    if (!node || typeof node !== "object") continue;
    if (looksLikeAirbnbListing(node)) {
      out.push(node);
      continue;
    }
    if (Array.isArray(node)) {
      for (const child of node) stack.push(child);
    } else {
      for (const v of Object.values(node as Record<string, unknown>)) {
        stack.push(v);
      }
    }
  }
  return out;
}

function listerListingCount(l: AirbnbListingShape): number | undefined {
  const u = l.listing.user;
  if (!u) return undefined;
  if (typeof u.listingsCount === "number") return u.listingsCount;
  if (typeof u.numberOfListings === "number") return u.numberOfListings;
  return undefined;
}

// Best-effort price extraction. Airbnb shows nightly rates; we
// approximate "monthly USD asking" as nightly × 30 × 0.6 (occupancy)
// to keep the scoring axis comparable with long-term listings. The
// value is purely directional.
function approxMonthlyUsd(l: AirbnbListingShape): number | undefined {
  const rate = l.pricingQuote?.rate?.amount;
  const cur = l.pricingQuote?.rate?.currency ?? "USD";
  if (typeof rate !== "number" || rate <= 0) return undefined;
  if (cur !== "USD") {
    // We only accept native USD prices to avoid baking a stale FX
    // rate into the pipeline. Non-USD listings simply land without
    // an asking price; the classifier handles that gracefully.
    return undefined;
  }
  return Math.round(rate * 30 * 0.6);
}

export function toRawListing(
  l: AirbnbListingShape,
  city: "Nairobi" | "Accra",
): RawListing | null {
  const id = l.listing.id;
  if (id === undefined || id === null) return null;
  const url = `https://www.airbnb.com/rooms/${String(id)}`;
  const listerName = l.listing.user?.smartName || l.listing.user?.firstName;
  return {
    source: "Airbnb",
    url,
    city,
    neighbourhood: l.listing.neighborhood,
    title: l.listing.name,
    bedrooms: l.listing.bedrooms,
    askingPriceUsd: approxMonthlyUsd(l),
    listerName,
    listerListingCount: listerListingCount(l),
    description: l.listing.publicAddress,
    notes: [
      l.listing.avgRatingLocalized
        ? `Rating ${l.listing.avgRatingLocalized}`
        : null,
      typeof l.listing.reviewsCount === "number"
        ? `${l.listing.reviewsCount} reviews`
        : null,
    ]
      .filter(Boolean)
      .join(" · ") || undefined,
  };
}

export type AirbnbScrapeResult = {
  listings: RawListing[];
  pagesFetched: number;
  blocked: boolean;
  notes: string[];
};

export async function scrapeAirbnb(
  city: "nairobi" | "accra",
  opts: { maxPages?: number } = {},
): Promise<AirbnbScrapeResult> {
  const maxPages = Math.max(1, Math.min(5, opts.maxPages ?? 1));
  const cityName: "Nairobi" | "Accra" =
    city === "nairobi" ? "Nairobi" : "Accra";
  const notes: string[] = [];
  const seen = new Set<string>();
  const listings: RawListing[] = [];
  let pagesFetched = 0;
  let blocked = false;

  for (let page = 0; page < maxPages; page++) {
    const url =
      page === 0
        ? SEARCH_URL_BY_CITY[city]
        : `${SEARCH_URL_BY_CITY[city]}?items_offset=${page * 18}`;

    let html: string;
    try {
      html = await fetchHtml(url);
      pagesFetched++;
    } catch (e) {
      if (e instanceof FetchBlockedError) {
        blocked = true;
        notes.push(
          `Blocked at page ${page + 1} (HTTP ${e.status}); add ACQUISITION_PROXY_URL to recover.`,
        );
        break;
      }
      notes.push(`Fetch error at page ${page + 1}: ${(e as Error).message}`);
      break;
    }

    const data = extractNextData(html);
    if (!data) {
      notes.push(
        `No __NEXT_DATA__ blob on page ${page + 1}; Airbnb shape may have changed.`,
      );
      break;
    }

    const found = findAirbnbListings(data);
    let added = 0;
    for (const f of found) {
      const raw = toRawListing(f, cityName);
      if (!raw) continue;
      if (seen.has(raw.url)) continue;
      seen.add(raw.url);
      listings.push(raw);
      added++;
    }

    if (added === 0) {
      notes.push(`Page ${page + 1} yielded 0 new listings; stopping early.`);
      break;
    }

    if (page < maxPages - 1) await politeDelay();
  }

  return { listings, pagesFetched, blocked, notes };
}

// BuyRentKenya scraper.
//
// BRK is *agent-heavy* — most listings on the site are posted by
// estate agencies, not the actual owner. The classifier in classify.ts
// is what turns this firehose into a useful pipe; the scraper itself
// is intentionally generous (capture everything that parses) and
// hands the filtering downstream to ops + the owner-vs-agent score.
//
// BRK uses Next.js with a `<script id="__NEXT_DATA__">` blob, same as
// Airbnb. We reuse the same extraction trick. The exact path varies
// across listing-detail and search pages; we walk the tree generically
// for objects that look like a listing record.

import { fetchHtml, FetchBlockedError, politeDelay } from "../fetch";
import { extractNextData } from "./airbnb";
import type { RawListing } from "../types";

// Only Kenya is meaningful here, but parameterising the city in the
// URL keeps the orchestrator code uniform across sources.
const SEARCH_URL = (city: "nairobi") =>
  `https://www.buyrentkenya.com/houses-for-rent/${city}`;

// Shape we look for inside the BRK Next.js blob. Field names below
// reflect what BRK has historically exposed; missing keys degrade
// gracefully via the optionals.
type BrkListingShape = {
  id?: number | string;
  url?: string;
  slug?: string;
  title?: string;
  bedrooms?: number;
  price?: number | { amount?: number; currency?: string };
  currency?: string;
  rentFrequency?: string; // "month" / "monthly"
  location?: { area?: string; subarea?: string };
  area?: { name?: string };
  subarea?: { name?: string };
  description?: string;
  agent?: {
    name?: string;
    phone?: string;
    listingsCount?: number;
    type?: string; // "Agent" | "Owner" — when BRK provides it
  };
  contact?: {
    name?: string;
    phone?: string;
  };
  publishedAt?: string;
  createdAt?: string;
};

function looksLikeBrkListing(node: unknown): node is BrkListingShape {
  if (!node || typeof node !== "object") return false;
  const n = node as Record<string, unknown>;
  // We require a url-or-slug AND a price-or-bedrooms to avoid matching
  // every random object in the page state.
  const hasUrl = typeof n.url === "string" || typeof n.slug === "string";
  const hasContent =
    typeof n.bedrooms === "number" || n.price !== undefined;
  if (!hasUrl || !hasContent) return false;
  // Avoid matching nav links, related-content cards, etc.
  if (typeof n.title !== "string") return false;
  return true;
}

export function findBrkListings(root: unknown): BrkListingShape[] {
  const out: BrkListingShape[] = [];
  const stack: unknown[] = [root];
  let visited = 0;
  while (stack.length && visited < 100_000) {
    visited++;
    const node = stack.pop();
    if (!node || typeof node !== "object") continue;
    if (looksLikeBrkListing(node)) {
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

function extractPriceUsd(l: BrkListingShape): number | undefined {
  // BRK lists in KES by default. We only emit a USD figure when we
  // can be confident; otherwise leave it undefined so the classifier
  // doesn't conflate KES millions with USD thousands.
  let amount: number | undefined;
  let currency: string | undefined;
  if (typeof l.price === "number") {
    amount = l.price;
    currency = l.currency ?? "KES";
  } else if (l.price && typeof l.price === "object") {
    amount = l.price.amount;
    currency = l.price.currency ?? l.currency ?? "KES";
  }
  if (typeof amount !== "number" || amount <= 0) return undefined;

  const isMonthly =
    !l.rentFrequency || /month/i.test(l.rentFrequency);
  if (!isMonthly) return undefined;

  if (currency === "USD") return Math.round(amount);
  if (currency === "KES") {
    // Indicative 130 KES/USD. Used only for ranking, never displayed.
    // The classifier just needs to know "is this mid-market or not".
    return Math.round(amount / 130);
  }
  return undefined;
}

function extractListedOn(l: BrkListingShape): Date | undefined {
  const raw = l.publishedAt ?? l.createdAt;
  if (!raw) return undefined;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function daysSince(d: Date | undefined, now: Date): number | undefined {
  if (!d) return undefined;
  const ms = now.getTime() - d.getTime();
  if (ms <= 0) return 0;
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

export function toRawListing(
  l: BrkListingShape,
  now: Date = new Date(),
): RawListing | null {
  const path = l.url || l.slug;
  if (!path) return null;
  const url = path.startsWith("http")
    ? path
    : `https://www.buyrentkenya.com${path.startsWith("/") ? "" : "/"}${path}`;

  const listed = extractListedOn(l);
  const lister = l.agent ?? l.contact ?? {};
  // BRK's `agent.type === "Owner"` is rare but worth honouring as a
  // strong override to "1 listing only" in the classifier downstream.
  // We pass it through as a description hint so the existing scoring
  // path picks it up without needing a new signal.
  const description = [
    l.description,
    l.agent?.type === "Owner" ? "Owner direct" : null,
  ]
    .filter(Boolean)
    .join("\n\n") || undefined;

  return {
    source: "BuyRentKenya",
    url,
    city: "Nairobi",
    neighbourhood: l.location?.area || l.area?.name,
    title: l.title,
    bedrooms: l.bedrooms,
    askingPriceUsd: extractPriceUsd(l),
    listedOn: listed,
    daysOnMarket: daysSince(listed, now),
    listerName: (lister as { name?: string }).name,
    listerPhone: (lister as { phone?: string }).phone,
    listerListingCount: l.agent?.listingsCount,
    description,
  };
}

export type BrkScrapeResult = {
  listings: RawListing[];
  pagesFetched: number;
  blocked: boolean;
  notes: string[];
};

export async function scrapeBuyRentKenya(
  opts: { maxPages?: number } = {},
): Promise<BrkScrapeResult> {
  const maxPages = Math.max(1, Math.min(5, opts.maxPages ?? 2));
  const notes: string[] = [];
  const seen = new Set<string>();
  const listings: RawListing[] = [];
  let pagesFetched = 0;
  let blocked = false;
  const now = new Date();

  for (let page = 1; page <= maxPages; page++) {
    const url = page === 1 ? SEARCH_URL("nairobi") : `${SEARCH_URL("nairobi")}?page=${page}`;
    let html: string;
    try {
      html = await fetchHtml(url);
      pagesFetched++;
    } catch (e) {
      if (e instanceof FetchBlockedError) {
        blocked = true;
        notes.push(
          `Blocked at page ${page} (HTTP ${e.status}); add ACQUISITION_PROXY_URL to recover.`,
        );
        break;
      }
      notes.push(`Fetch error at page ${page}: ${(e as Error).message}`);
      break;
    }

    const data = extractNextData(html);
    if (!data) {
      notes.push(
        `No __NEXT_DATA__ blob on page ${page}; BRK shape may have changed.`,
      );
      break;
    }

    const found = findBrkListings(data);
    let added = 0;
    for (const f of found) {
      const raw = toRawListing(f, now);
      if (!raw) continue;
      if (seen.has(raw.url)) continue;
      seen.add(raw.url);
      listings.push(raw);
      added++;
    }

    if (added === 0) {
      notes.push(`Page ${page} yielded 0 new listings; stopping early.`);
      break;
    }

    if (page < maxPages) await politeDelay();
  }

  // Second-pass count enrichment: lister phones that appear N times
  // across the result set get listerListingCount = N. This is the
  // single most powerful agent signal and we have to compute it
  // ourselves because BRK rarely surfaces it directly. We *prefer*
  // an explicit per-listing count when present.
  const phoneCounts = new Map<string, number>();
  for (const l of listings) {
    if (l.listerPhone) {
      const key = l.listerPhone.replace(/\D/g, "");
      phoneCounts.set(key, (phoneCounts.get(key) ?? 0) + 1);
    }
  }
  for (const l of listings) {
    if (l.listerListingCount !== undefined) continue;
    if (!l.listerPhone) continue;
    const key = l.listerPhone.replace(/\D/g, "");
    const n = phoneCounts.get(key);
    if (n !== undefined) l.listerListingCount = n;
  }

  return { listings, pagesFetched, blocked, notes };
}

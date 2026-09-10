// Reads a public Airbnb listing page and pulls out the fields we would
// otherwise retype into the property form.
//
// Why this parses JSON-LD rather than scraping the page. Airbnb renders
// the listing in React and the class names change without notice, so
// anything keyed off markup breaks silently and we find out when an
// admin reports empty fields. The listing page also carries two
// schema.org blocks, VacationRental and Product, which exist so that
// Google can build a rich result and are therefore the most stable
// thing on the page: Airbnb has a commercial reason not to change their
// shape. Everything below comes from those two blocks, with one
// exception noted at bedroomsFromOgTitle.
//
// What this deliberately does not do. It does not touch pricing or
// availability. Nightly rates on Airbnb are dynamic and are not
// published in the structured data, and availability already arrives
// through the iCal feed on PropertyIcalFeed, which is a supported
// integration rather than a page read. Anything claiming to import a
// rate from a listing page is reading one night for one occupancy on
// one date and calling it "the price".
//
// On the legal position: this reads a page any logged-out visitor can
// see, and robots.txt permits /rooms/<id> while disallowing the
// /photos, /amenities and /description subpaths, which is why only the
// main URL is ever requested. It is still Airbnb's data about a
// listing, so this is built for importing your own listings during
// onboarding and nothing else.

export type AirbnbListing = {
  roomId: string;
  url: string;
  name: string | null;
  description: string | null;
  images: string[];
  maxOccupancy: number | null;
  bedrooms: number | null;
  beds: number | null;
  bathrooms: number | null;
  latitude: number | null;
  longitude: number | null;
  locality: string | null;
  rating: number | null;
  reviewCount: number | null;
};

export type ExtractResult =
  | { kind: "ok"; listing: AirbnbListing }
  | { kind: "error"; reason: ExtractFailure; detail?: string };

export type ExtractFailure =
  | "not_an_airbnb_url"
  | "no_room_id"
  | "no_structured_data"
  | "blocked"
  | "fetch_failed";

// Human-readable versions, for the admin UI. Kept beside the codes so a
// new failure mode cannot be added without someone writing the sentence
// an operator will read at 9pm.
export const EXTRACT_FAILURE_MESSAGE: Record<ExtractFailure, string> = {
  not_an_airbnb_url:
    "That is not an Airbnb link. Paste the listing URL, the one with /rooms/ in it.",
  no_room_id:
    "No listing id in that link. If you copied it from the Airbnb app, open the listing in a browser and copy the address bar instead.",
  no_structured_data:
    "Airbnb returned a page without listing data on it. This usually means the listing is unlisted, paused or deleted.",
  blocked:
    "Airbnb refused the request. Their bot protection blocks our server sometimes; fill the form in by hand this time.",
  fetch_failed: "Could not reach Airbnb. Try again in a moment.",
};

// Accepts what people actually paste. The app's share sheet produces
// abnb.me short links and URLs with a ?source_impression_id= tail
// longer than the address itself; /rooms/plus/<id> and /rooms/<id> are
// both live; and some locales prefix a language path.
//
// Short links are rejected rather than followed. Resolving one means a
// second request to a redirector, and the failure is confusing enough
// that telling someone to open the listing and copy the address bar is
// the better trade.
export function parseAirbnbRoomId(input: string): string | null {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }

  // Anchored on both ends, and "airbnb" has to be its own label sitting
  // directly under a public suffix. A startsWith("airbnb.") check reads
  // as equivalent and accepts airbnb.com.evil.co, which is how a
  // lookalike domain gets treated as trusted and fetched by our server.
  // Covers airbnb.com, the country domains (airbnb.co.uk, airbnb.fr)
  // and subdomains such as fr.airbnb.com.
  const host = url.hostname.toLowerCase();
  if (!/^(?:[a-z0-9-]+\.)*airbnb\.[a-z]{2,3}(?:\.[a-z]{2})?$/.test(host)) {
    return null;
  }

  // /rooms/123, /rooms/plus/123, /fr/rooms/123, /rooms/123/whatever
  const m = url.pathname.match(/\/rooms\/(?:plus\/)?(\d+)/);
  return m ? m[1] : null;
}

export function airbnbListingUrl(roomId: string): string {
  return `https://www.airbnb.com/rooms/${roomId}`;
}

type JsonLdish = Record<string, unknown>;

function jsonLdBlocks(html: string): JsonLdish[] {
  const out: JsonLdish[] = [];
  const re =
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  for (const m of html.matchAll(re)) {
    try {
      const parsed: unknown = JSON.parse(m[1]);
      // A page may ship a single object or an array of them.
      if (Array.isArray(parsed)) {
        for (const p of parsed) {
          if (p && typeof p === "object") out.push(p as JsonLdish);
        }
      } else if (parsed && typeof parsed === "object") {
        out.push(parsed as JsonLdish);
      }
    } catch {
      // A malformed block is not a reason to abandon the others.
    }
  }
  return out;
}

function byType(blocks: JsonLdish[], type: string): JsonLdish | null {
  return blocks.find((b) => b["@type"] === type) ?? null;
}

function metaContent(html: string, property: string): string | null {
  // Attribute order is not guaranteed, so match either way round
  // rather than assuming Airbnb keeps property before content.
  const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const a = html.match(
    new RegExp(
      `<meta[^>]+property=["']${escaped}["'][^>]+content=["']([^"']*)["']`,
      "i",
    ),
  );
  if (a) return decodeEntities(a[1]);
  const b = html.match(
    new RegExp(
      `<meta[^>]+content=["']([^"']*)["'][^>]+property=["']${escaped}["']`,
      "i",
    ),
  );
  return b ? decodeEntities(b[1]) : null;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, d: string) => String.fromCharCode(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h: string) =>
      String.fromCharCode(parseInt(h, 16)),
    );
}

// The room counts are the one thing not in the JSON-LD. They are in
// og:title, in a format Airbnb uses consistently across locales:
//
//   Treehouse in Aptos · ★4.91 · 3 bedrooms · 3 beds · 1 bath
//   Rental unit in Nairobi · ★New · Studio · 1 bed · 1 bath
//
// Parsed defensively: a missing segment yields null rather than a
// wrong number, because a wrong bedroom count on a management
// agreement is worse than an empty field somebody has to fill.
export function roomCountsFromOgTitle(title: string | null): {
  bedrooms: number | null;
  beds: number | null;
  bathrooms: number | null;
} {
  const empty = { bedrooms: null, beds: null, bathrooms: null };
  if (!title) return empty;

  const segments = title.split("·").map((s) => s.trim().toLowerCase());

  const num = (re: RegExp): number | null => {
    for (const s of segments) {
      const m = s.match(re);
      if (m) {
        const v = Number(m[1]);
        return Number.isFinite(v) ? v : null;
      }
    }
    return null;
  };

  // "Studio" is a bedroom count of zero, not a missing value, and the
  // distinction matters: zero renders as "studio" in the listing and
  // null renders as "to be confirmed" in a contract.
  const isStudio = segments.some((s) => s === "studio");

  return {
    bedrooms: isStudio ? 0 : num(/^(\d+(?:\.\d+)?)\s+bedrooms?$/),
    beds: num(/^(\d+(?:\.\d+)?)\s+beds?$/),
    // Covers "1 bath", "1.5 baths", "2 shared baths", "1 private bath".
    bathrooms: num(/^(\d+(?:\.\d+)?)\s+(?:shared\s+|private\s+)?baths?$/),
  };
}

function asNumber(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function asString(v: unknown): string | null {
  return typeof v === "string" && v.trim() !== "" ? v.trim() : null;
}

// Pulls the listing out of already-fetched HTML. Separated from the
// network so it can be tested against a fixture, which is the only way
// to have tests for this at all: hitting Airbnb from CI would be both
// unreliable and rude.
export function extractListing(html: string, roomId: string): ExtractResult {
  // Airbnb serves the bot wall with a 200, so the status code alone
  // does not tell us whether we got a listing. Checked before the
  // structured-data lookup so the operator gets "blocked" rather than
  // "this listing does not exist", which would send them looking for
  // a problem with the listing.
  if (
    /px-captcha|<title>[^<]*Access Denied|Please verify you are a human/i.test(
      html,
    )
  ) {
    return { kind: "error", reason: "blocked" };
  }

  const blocks = jsonLdBlocks(html);
  const rental = byType(blocks, "VacationRental");
  const product = byType(blocks, "Product");
  const primary = rental ?? product;

  if (!primary) return { kind: "error", reason: "no_structured_data" };

  const images = Array.isArray(primary.image)
    ? primary.image.filter((i): i is string => typeof i === "string")
    : [];

  const containsPlace = (rental?.containsPlace ?? null) as JsonLdish | null;
  const occupancy = (containsPlace?.occupancy ?? null) as JsonLdish | null;
  const address = (rental?.address ?? null) as JsonLdish | null;
  const rating = (primary.aggregateRating ?? null) as JsonLdish | null;

  const counts = roomCountsFromOgTitle(metaContent(html, "og:title"));

  return {
    kind: "ok",
    listing: {
      roomId,
      url: airbnbListingUrl(roomId),
      name: asString(primary.name),
      description: asString(primary.description),
      images,
      maxOccupancy: occupancy ? asNumber(occupancy.value) : null,
      bedrooms: counts.bedrooms,
      beds: counts.beds,
      bathrooms: counts.bathrooms,
      latitude: asNumber(rental?.latitude),
      longitude: asNumber(rental?.longitude),
      locality: address ? asString(address.addressLocality) : null,
      rating: rating ? asNumber(rating.ratingValue) : null,
      reviewCount: rating ? asNumber(rating.ratingCount) : null,
    },
  };
}

// Network wrapper. Kept thin so the interesting logic stays testable.
//
// The User-Agent is a real browser string on purpose. A serverless
// function identifying itself honestly gets a bot wall, and the point
// here is to read a public page on behalf of the person who owns the
// listing, at the moment they ask for it, once. There is no crawl and
// no schedule.
export async function fetchAirbnbListing(
  input: string,
  fetcher: typeof fetch = fetch,
): Promise<ExtractResult> {
  const roomId = parseAirbnbRoomId(input);
  if (!roomId) {
    return {
      kind: "error",
      reason: input.includes("airbnb") ? "no_room_id" : "not_an_airbnb_url",
    };
  }

  let html: string;
  try {
    const res = await fetcher(airbnbListingUrl(roomId), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      // A listing page is ~600KB and Airbnb is not always quick. The
      // admin is watching a spinner, so fail rather than hang.
      signal: AbortSignal.timeout(15_000),
    });

    if (res.status === 403 || res.status === 429) {
      return { kind: "error", reason: "blocked" };
    }
    if (!res.ok) {
      return {
        kind: "error",
        reason: "fetch_failed",
        detail: `HTTP ${res.status}`,
      };
    }
    html = await res.text();
  } catch (err) {
    return {
      kind: "error",
      reason: "fetch_failed",
      detail: err instanceof Error ? err.message : String(err),
    };
  }

  return extractListing(html, roomId);
}

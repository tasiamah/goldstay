// Where a lead came from.
//
// The question "which search brought this landlord to us" was asked in
// September 2026 about clients who had said they found Goldstay at the
// top of Google, and it could not be answered from anything we held:
// Search Console was days old and does not backfill, Analytics had
// never been switched on, and the form recorded nothing about origin.
// The customers themselves were the last surviving copy.
//
// This module is the pure half of the fix. No DOM, no storage calls,
// no fetch — just the parsing and classification, so it can be tested
// in a runner with none of those.
//
// ---------------------------------------------------------------
// What this can and cannot tell you
// ---------------------------------------------------------------
//
// It cannot tell you the search term. Google has sent organic traffic
// with a bare `https://www.google.com/` referrer since 2011; the query
// is stripped before the browser ever sees it. Nothing implemented on
// this side of the wire changes that, and any code here that claimed
// to recover a keyword would be lying.
//
// So the split is:
//
//   - referrer and landing path      → which channel, which page
//   - utm_* params                    → campaigns we tag ourselves,
//                                       and the keyword on paid search
//   - the "how did you find us" answer → the only route to an organic
//                                       keyword, because a human types
//                                       it in
//
// That last one is why the form asks. It is the cheap question that
// the expensive analytics cannot answer.

// First touch, not last. Somebody arrives on an article from Google,
// reads two more pages, then fills the form. Last-touch attribution
// records that as a visit to /list-your-property referred by our own
// site, which is exactly the useless answer we already had. The first
// referrer and the first landing path are the ones worth keeping, so
// capture refuses to overwrite itself for the life of the session.
export const FIRST_TOUCH_KEY = "gs_first_touch";

export type FirstTouch = {
  // Path only, no host: every one of these is our own site.
  landingPath: string;
  // Origin and path of the referrer, query dropped. The query on an
  // inbound referrer is somebody else's tracking, occasionally carries
  // personal data, and has never once been useful here.
  referrer: string | null;
  channel: Channel;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
  // When the session started, so a lead that arrives four days later
  // is not silently attributed to a visit nobody remembers.
  landedAt: string;
};

// Deliberately coarse. The purpose is answering "is the SEO working"
// at a glance on the lead list, and a long tail of one-off referrer
// hosts defeats that. Anything unrecognised keeps its host in
// `referrer` for a human to read.
export type Channel =
  | "organic_search"
  | "paid_search"
  | "social"
  | "referral"
  | "direct"
  | "internal";

export const CHANNELS: readonly Channel[] = [
  "organic_search",
  "paid_search",
  "social",
  "referral",
  "direct",
  "internal",
];

export const CHANNEL_LABEL: Record<Channel, string> = {
  organic_search: "Organic search",
  paid_search: "Paid search",
  social: "Social",
  referral: "Referral",
  direct: "Direct",
  internal: "Internal",
};

// The column is a String, so anything read back out of Postgres is
// only a Channel by convention. This is the guard that lets a reader
// label it, and lets an unrecognised value fall through and be shown
// raw rather than crashing a lookup.
export function isChannel(value: string): value is Channel {
  return CHANNELS.includes(value as Channel);
}

const SEARCH_HOSTS = [
  "google.",
  "bing.",
  "duckduckgo.",
  "yahoo.",
  "ecosia.",
  "brave.",
  "yandex.",
];

const SOCIAL_HOSTS = [
  "instagram.",
  "facebook.",
  "fb.",
  "l.facebook.",
  "linkedin.",
  "lnkd.in",
  "twitter.",
  "x.com",
  "t.co",
  "tiktok.",
  "youtube.",
  "pinterest.",
  "reddit.",
  "whatsapp.",
  "wa.me",
  "telegram.",
  "t.me",
];

function hostMatches(host: string, needles: readonly string[]): boolean {
  const h = host.toLowerCase().replace(/^www\./, "");
  return needles.some((n) => h === n || h.startsWith(n) || h.includes(`.${n}`));
}

// `ownHost` is passed rather than read from a constant because the site
// serves goldstay.co.ke, goldstay.africa and Vercel preview hosts, and
// a preview treating its own navigation as a referral would poison the
// numbers we look at.
export function classifyReferrer(
  referrer: string | null,
  ownHost: string,
  utm?: { source?: string | null; medium?: string | null },
): Channel {
  // A paid click is a search referrer plus a medium we set ourselves,
  // so the medium has to be checked before the host. Google Ads sends
  // `gclid` and a google.com referrer exactly like an organic click.
  const medium = utm?.medium?.toLowerCase().trim();
  if (medium === "cpc" || medium === "ppc" || medium === "paid") {
    return "paid_search";
  }
  if (medium === "social" || medium === "paid_social") return "social";
  if (medium === "email" || medium === "referral") return "referral";

  if (!referrer) return "direct";

  let host: string;
  try {
    host = new URL(referrer).host;
  } catch {
    return "direct";
  }
  if (!host) return "direct";

  const own = ownHost.toLowerCase().replace(/^www\./, "");
  const bare = host.toLowerCase().replace(/^www\./, "");
  if (own && (bare === own || bare.endsWith(`.${own}`))) return "internal";

  if (hostMatches(host, SEARCH_HOSTS)) return "organic_search";
  if (hostMatches(host, SOCIAL_HOSTS)) return "social";
  return "referral";
}

// Trims to origin + pathname. Long referrer strings get truncated
// rather than rejected: a value we cannot fully store is still worth
// more than a null, and the host is at the front.
export function sanitiseReferrer(referrer: string | null): string | null {
  if (!referrer) return null;
  const raw = referrer.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    const path = url.pathname === "/" ? "" : url.pathname.replace(/\/$/, "");
    return `${url.origin}${path}`.slice(0, 300);
  } catch {
    return null;
  }
}

const UTM_MAX = 200;

function utm(params: URLSearchParams, key: string): string | null {
  const v = params.get(key);
  if (v === null) return null;
  const trimmed = v.trim().slice(0, UTM_MAX);
  return trimmed.length ? trimmed : null;
}

export function parseUtm(search: string): {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
} {
  let params: URLSearchParams;
  try {
    params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  } catch {
    params = new URLSearchParams();
  }
  return {
    utmSource: utm(params, "utm_source"),
    utmMedium: utm(params, "utm_medium"),
    utmCampaign: utm(params, "utm_campaign"),
    // On paid search this is the keyword — the one case where a machine
    // can see the query, because we put it in the URL ourselves.
    utmTerm: utm(params, "utm_term"),
    utmContent: utm(params, "utm_content"),
  };
}

// Builds the record to store on first arrival. Returns null when there
// is already one for this session, which is what makes it first-touch.
export function captureFirstTouch(
  location: { host: string; pathname: string; search: string },
  referrer: string | null,
  existing: string | null,
  now: Date = new Date(),
): FirstTouch | null {
  if (existing) return null;

  const parsed = parseUtm(location.search);
  const clean = sanitiseReferrer(referrer);
  const channel = classifyReferrer(clean, location.host, {
    source: parsed.utmSource,
    medium: parsed.utmMedium,
  });

  return {
    landingPath: location.pathname.slice(0, 300) || "/",
    // An internal referrer on a first touch means the session began on
    // a page we did not instrument, or the store was cleared mid-visit.
    // Recording our own URL as the source would read as if the landlord
    // came from us, so it is dropped and the channel carries the truth.
    referrer: channel === "internal" ? null : clean,
    channel,
    ...parsed,
    landedAt: now.toISOString(),
  };
}

export function parseFirstTouch(raw: string | null): FirstTouch | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as unknown;
    if (!v || typeof v !== "object") return null;
    const o = v as Record<string, unknown>;
    if (typeof o.landingPath !== "string") return null;
    const str = (k: string) => (typeof o[k] === "string" ? (o[k] as string) : null);
    return {
      landingPath: o.landingPath,
      referrer: str("referrer"),
      channel: CHANNELS.includes(o.channel as Channel)
        ? (o.channel as Channel)
        : "direct",
      utmSource: str("utmSource"),
      utmMedium: str("utmMedium"),
      utmCampaign: str("utmCampaign"),
      utmTerm: str("utmTerm"),
      utmContent: str("utmContent"),
      landedAt: str("landedAt") ?? new Date(0).toISOString(),
    };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------
// "How did you find us?"
// ---------------------------------------------------------------

// One tap on a select, and the Google option opens a text box. That
// text box is the only place an organic search term can come from,
// which is the entire reason any of this exists.
//
// Kept short on purpose. Every option added is another line a landlord
// reads before deciding the form is too long, and the four that matter
// are: search, word of mouth, social, and already-knew-us.
export const FOUND_VIA_OPTIONS = [
  "Google search",
  "Recommended by someone",
  "Instagram or Facebook",
  "Saw a Goldstay property",
  "Other",
] as const;

export type FoundVia = (typeof FOUND_VIA_OPTIONS)[number];

// Only the search answer earns the follow-up question. Asking someone
// who ticked "recommended by someone" what they typed into Google is
// how a form starts feeling like an interrogation.
export function asksForSearchTerm(foundVia: string | null | undefined): boolean {
  return foundVia === "Google search";
}

export function parseFoundVia(value: unknown): FoundVia | null {
  if (typeof value !== "string") return null;
  const v = value.trim();
  return FOUND_VIA_OPTIONS.find((o) => o === v) ?? null;
}

// The free-text answer. Capped and trimmed; a keyword is a handful of
// words and anything longer is either a paste or a bot.
export function normaliseSearchTerm(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const v = value.trim().replace(/\s+/g, " ").slice(0, 200);
  return v.length ? v : null;
}

// ---------------------------------------------------------------
// Server side
// ---------------------------------------------------------------

// /api/lead is a public endpoint, so everything arriving in the
// attribution block is attacker-controlled. Each field is type-checked
// and length-capped here rather than trusted from the client, and an
// unrecognised channel is dropped instead of being stored: these
// columns get read as evidence about what marketing works, and a
// forged value is worse than a null because a null is visibly absent.
export type ParsedAttribution = {
  foundVia: string | null;
  searchTerm: string | null;
  channel: Channel | null;
  landingPath: string | null;
  referrer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
  landedAt: Date | null;
};

function cappedString(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim().slice(0, max);
  return t.length ? t : null;
}

// One line for the ops email, because that is where a human actually
// looks at a new lead. Written as a sentence rather than a key dump:
// the operator ringing this landlord back in the next two hours wants
// "found us on Google, searched X, landed on Y", not five more fields
// to skim past.
//
// Returns null when there is nothing worth saying, so the caller can
// leave the line out entirely instead of printing "unknown".
export function describeAttribution(a: ParsedAttribution): string | null {
  const parts: string[] = [];

  if (a.foundVia) parts.push(`Says: ${a.foundVia}`);
  // The most valuable field on the whole record, so it goes in quotes
  // and near the front where it will not be missed.
  if (a.searchTerm) parts.push(`searched "${a.searchTerm}"`);
  if (a.channel) parts.push(CHANNEL_LABEL[a.channel].toLowerCase());
  if (a.landingPath) parts.push(`landed on ${a.landingPath}`);
  if (a.referrer) parts.push(`via ${a.referrer}`);

  const campaign = [a.utmSource, a.utmMedium, a.utmCampaign]
    .filter(Boolean)
    .join("/");
  if (campaign) parts.push(`campaign ${campaign}`);
  if (a.utmTerm) parts.push(`utm_term "${a.utmTerm}"`);

  if (!parts.length) return null;
  return parts.join(" · ");
}

export function parseAttributionPayload(input: unknown): ParsedAttribution {
  const o =
    input && typeof input === "object" ? (input as Record<string, unknown>) : {};

  const channelRaw = cappedString(o.channel, 40);
  const landedAtRaw = cappedString(o.landedAt, 40);
  let landedAt: Date | null = null;
  if (landedAtRaw) {
    const d = new Date(landedAtRaw);
    // A future timestamp or an unparseable one means a broken or
    // tampered client; drop it rather than store a date that would
    // make the land-to-submit gap read as negative.
    if (!Number.isNaN(d.getTime()) && d.getTime() <= Date.now() + 60_000) {
      landedAt = d;
    }
  }

  return {
    // Only the options the form actually offers, so this column stays
    // groupable instead of turning into free text.
    foundVia: parseFoundVia(o.foundVia),
    searchTerm: normaliseSearchTerm(o.searchTerm),
    channel: CHANNELS.includes(channelRaw as Channel)
      ? (channelRaw as Channel)
      : null,
    // Path only. A full URL here would mean the client sent a host we
    // did not verify, and the host is never in question — it is us.
    landingPath: (() => {
      const p = cappedString(o.landingPath, 300);
      return p && p.startsWith("/") ? p : null;
    })(),
    referrer: sanitiseReferrer(cappedString(o.referrer, 300)),
    utmSource: cappedString(o.utmSource, UTM_MAX),
    utmMedium: cappedString(o.utmMedium, UTM_MAX),
    utmCampaign: cappedString(o.utmCampaign, UTM_MAX),
    utmTerm: cappedString(o.utmTerm, UTM_MAX),
    utmContent: cappedString(o.utmContent, UTM_MAX),
    landedAt,
  };
}

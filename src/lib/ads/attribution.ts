// Google Ads click attribution.
//
// Why this exists separately from lead-attribution.ts, which already
// captures utm_* into sessionStorage: neither of the two things a paid
// campaign needs is available there.
//
// The first is classification. Google Ads auto-tagging appends `gclid`
// and nothing else. It does not set utm_medium, so `classifyReferrer`,
// which decides "paid" from utm_medium=cpc, files every ad click as
// organic search unless the tracking template is manually configured.
// The click id is the one signal that is always present.
//
// The second is the join back to Google Ads. The funnel here ends in
// WhatsApp, so the event Google can see is a button click, not a
// signed client. Optimising a campaign on button clicks buys expensive
// button clicks. The only way to tell Google which clicks became real
// business is to upload the conversion against its `gclid`, which
// means the gclid has to survive from the ad click through to the day
// somebody signs, weeks later.
//
// Hence a cookie rather than sessionStorage: it has to outlive the
// session, and it has to be readable on the server by /go/whatsapp and
// /api/lead without depending on the page's JavaScript having run.
//
// This module is the pure half. No cookies() call, no DOM, no request
// object, so it can be tested directly.

// Also captured: wbraid and gbraid. Google sends these instead of
// gclid when a click comes from an iOS app or Safari with restricted
// tracking, which for a diaspora audience on iPhones is a meaningful
// slice rather than an edge case. They are uploaded the same way.

export const ADS_COOKIE = "gs_ads";

// 90 days, which is the longest click-through conversion window
// Google Ads will accept for an offline upload. A conversion recorded
// against a click older than its window is rejected, so storing it
// longer would only produce uploads that silently fail.
export const ADS_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 90;

// Click ids are opaque and Google has lengthened them before, so the
// cap is generous. Anything longer is not a click id.
const ID_MAX = 200;
const UTM_MAX = 200;
const PATH_MAX = 300;

export type AdsClick = {
  // At least one of these three is set, or the record is not stored.
  gclid: string | null;
  wbraid: string | null;
  gbraid: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
  // Where the ad landed them, which is the creative's own destination
  // and worth keeping separately from the page the WhatsApp button was
  // eventually pressed on.
  landingPath: string | null;
  clickedAt: string;
};

function capped(value: string | null | undefined, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().slice(0, max);
  return trimmed.length ? trimmed : null;
}

// A click id is base64-ish and occasionally contains dots and dashes.
// Rejecting anything outside that keeps a crafted cookie or a scraper's
// cache-buster out of a column that gets uploaded to Google.
const ID_SHAPE = /^[A-Za-z0-9._-]+$/;

function clickId(value: string | null | undefined): string | null {
  const v = capped(value, ID_MAX);
  if (!v) return null;
  return ID_SHAPE.test(v) ? v : null;
}

export function hasClickId(click: {
  gclid: string | null;
  wbraid: string | null;
  gbraid: string | null;
}): boolean {
  return Boolean(click.gclid || click.wbraid || click.gbraid);
}

// Reads an inbound URL. Returns null when there is nothing campaign
// related on it, which is the overwhelmingly common case and the
// signal middleware uses to skip setting a cookie at all.
//
// Skipping matters more than it looks: a Set-Cookie on every marketing
// request would take all several hundred static routes out of the edge
// cache. Same reasoning as the ?ref= pass in middleware.ts.
export function parseAdsParams(
  search: string,
  pathname: string,
  now: Date = new Date(),
): AdsClick | null {
  let params: URLSearchParams;
  try {
    params = new URLSearchParams(
      search.startsWith("?") ? search.slice(1) : search,
    );
  } catch {
    return null;
  }

  const gclid = clickId(params.get("gclid"));
  const wbraid = clickId(params.get("wbraid"));
  const gbraid = clickId(params.get("gbraid"));

  const utmSource = capped(params.get("utm_source"), UTM_MAX);
  const utmMedium = capped(params.get("utm_medium"), UTM_MAX);
  const utmCampaign = capped(params.get("utm_campaign"), UTM_MAX);
  const utmTerm = capped(params.get("utm_term"), UTM_MAX);
  const utmContent = capped(params.get("utm_content"), UTM_MAX);

  const anyUtm =
    utmSource || utmMedium || utmCampaign || utmTerm || utmContent;
  if (!hasClickId({ gclid, wbraid, gbraid }) && !anyUtm) return null;

  return {
    gclid,
    wbraid,
    gbraid,
    utmSource,
    utmMedium,
    utmCampaign,
    utmTerm,
    utmContent,
    landingPath: capped(pathname, PATH_MAX) ?? "/",
    clickedAt: now.toISOString(),
  };
}

// Serialised as a query string rather than JSON so the cookie stays
// small and survives a round trip through anything that re-encodes it.
const FIELDS: ReadonlyArray<[string, keyof AdsClick]> = [
  ["g", "gclid"],
  ["w", "wbraid"],
  ["b", "gbraid"],
  ["s", "utmSource"],
  ["m", "utmMedium"],
  ["c", "utmCampaign"],
  ["t", "utmTerm"],
  ["n", "utmContent"],
  ["p", "landingPath"],
  ["d", "clickedAt"],
];

export function encodeAdsCookie(click: AdsClick): string {
  const params = new URLSearchParams();
  for (const [key, field] of FIELDS) {
    const value = click[field];
    if (value) params.set(key, value);
  }
  return params.toString();
}

// Everything here is attacker-controlled: a cookie is whatever the
// client says it is. Click ids are shape-checked on the way back out
// as well as in, because this value ends up in an upload to Google and
// in a column an operator reads as evidence.
export function decodeAdsCookie(raw: string | null | undefined): AdsClick | null {
  if (!raw) return null;
  let params: URLSearchParams;
  try {
    params = new URLSearchParams(raw);
  } catch {
    return null;
  }

  const gclid = clickId(params.get("g"));
  const wbraid = clickId(params.get("w"));
  const gbraid = clickId(params.get("b"));
  const utmSource = capped(params.get("s"), UTM_MAX);
  const utmMedium = capped(params.get("m"), UTM_MAX);
  const utmCampaign = capped(params.get("c"), UTM_MAX);
  const utmTerm = capped(params.get("t"), UTM_MAX);
  const utmContent = capped(params.get("n"), UTM_MAX);

  const anyUtm =
    utmSource || utmMedium || utmCampaign || utmTerm || utmContent;
  if (!hasClickId({ gclid, wbraid, gbraid }) && !anyUtm) return null;

  const landingRaw = capped(params.get("p"), PATH_MAX);
  const clickedRaw = capped(params.get("d"), 40);
  const parsedDate = clickedRaw ? new Date(clickedRaw) : null;
  const clickedAt =
    parsedDate && !Number.isNaN(parsedDate.getTime())
      ? parsedDate.toISOString()
      : new Date(0).toISOString();

  return {
    gclid,
    wbraid,
    gbraid,
    utmSource,
    utmMedium,
    utmCampaign,
    utmTerm,
    utmContent,
    // A cookie claiming an absolute URL is claiming a host we never
    // verified, and the host is never in question. Path only.
    landingPath: landingRaw && landingRaw.startsWith("/") ? landingRaw : null,
    clickedAt,
  };
}

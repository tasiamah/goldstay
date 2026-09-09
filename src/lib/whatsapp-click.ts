// The /go/whatsapp hop: what gets recorded, and where the visitor
// lands.
//
// Pure by design. The route handler does the cookie reading, the
// database write and the redirect; everything decidable from strings
// alone lives here so it can be tested without a request.

import { whatsapp } from "@/lib/site";

// Prefilled messages are chosen from this map by key rather than
// accepted as text on the query string.
//
// That is a deliberate refusal of a feature. An endpoint that echoed
// an arbitrary `text` param into a wa.me link would let anyone publish
// goldstay.co.ke/go/whatsapp?text=<whatever> and have it read, in the
// URL bar and in the recipient's thread, as something Goldstay wrote.
// A fixed set of intents costs one line to extend and removes that
// entirely.
export const WA_INTENTS = {
  manage:
    "Hi Goldstay, I would like help managing my property. Could you tell me what you would charge and what is included?",
  airbnb:
    "Hi Goldstay, I have a furnished place in Nairobi and I am looking for someone to manage it as a short stay. Could we discuss?",
  longterm:
    "Hi Goldstay, I would like help managing a long-term rental in Nairobi, including finding and vetting a tenant.",
  cohost:
    "Hi Goldstay, I am looking for a co-host for my Nairobi Airbnb. Could you tell me how you work and what you charge?",
  switching:
    "Hi Goldstay, I already have a managing agent and I am thinking of moving. Could we talk about taking over?",
  quote:
    "Hi Goldstay, could you send me a quote for managing my property?",
} as const;

export type WaIntent = keyof typeof WA_INTENTS;

export const DEFAULT_INTENT: WaIntent = "manage";

// hasOwnProperty and not `in`. With `in`, "toString" and "constructor"
// are both truthy against any object literal, so ?i=toString would
// have resolved to Object.prototype.toString and put "function
// toString() { [native code] }" into the visitor's prefilled message.
export function isWaIntent(value: string | null | undefined): value is WaIntent {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(WA_INTENTS, value)
  );
}

// Unknown keys fall back rather than 404. This link is the last step
// before a lead reaches us; a typo in a campaign URL should cost the
// prefilled wording, not the enquiry.
export function resolveIntent(value: string | null | undefined): WaIntent {
  return isWaIntent(value) ? value : DEFAULT_INTENT;
}

const SOURCE_MAX = 60;
const PATH_MAX = 300;

// Where the click came from, for grouping in reports. Free-form but
// normalised, so a new CTA does not need a code change to be counted,
// and a scraper appending junk cannot fill the column with noise.
export function sanitiseSource(value: string | null | undefined): string {
  if (typeof value !== "string") return "unknown";
  const clean = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9:_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, SOURCE_MAX);
  return clean.length ? clean : "unknown";
}

// The page the button was pressed on. Passed by the caller because the
// referer header is missing or trimmed on plenty of browsers, but
// verified here: a path, never a URL, so nothing that arrives can
// assert a host.
export function sanitisePagePath(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null;
  const raw = value.trim();
  if (!raw.startsWith("/") || raw.startsWith("//")) return null;
  const path = raw.split(/[?#]/)[0].slice(0, PATH_MAX);
  return path.length > 1 ? path.replace(/\/$/, "") : "/";
}

// Coarse on purpose. "Was this a phone" answers the question a
// campaign report asks, and it does so without keeping a full user
// agent string, which is a fingerprint we have no use for.
export function deviceFromUserAgent(
  ua: string | null | undefined,
): "mobile" | "desktop" | "unknown" {
  if (!ua) return "unknown";
  return /android|iphone|ipad|ipod|mobile|windows phone/i.test(ua)
    ? "mobile"
    : "desktop";
}

// Builds the wa.me destination, including the same readable "(Sent
// from ...)" footnote the on-page CTAs append, so an enquiry that
// arrived through an ad is indistinguishable in the thread from one
// that did not. Ops reads one format.
//
// The source is written in as well when it is a campaign, because on
// a paid click the question ops will be asked is "did the ads work",
// and the thread is the only place the answer survives.
export function buildWhatsAppDestination(input: {
  intent: WaIntent;
  number: string;
  host: string;
  pagePath: string | null;
  campaign?: string | null;
}): string {
  const message = WA_INTENTS[input.intent];
  const path = input.pagePath ?? "/";
  const where = `${input.host}${path === "/" ? "/" : path}`;
  const campaign = input.campaign?.trim();
  const ref = campaign
    ? `(Sent from ${where} via ${campaign})`
    : `(Sent from ${where})`;

  const url = new URL(`https://wa.me/${input.number}`);
  url.searchParams.set("text", `${message}\n\n${ref}`);
  return url.toString();
}

// Nairobi is the only launched market, and the campaign is Kenyan, so
// the number is not a query parameter. Reading it from config keeps
// the env-var override working the same way waLink() does.
export function campaignWhatsAppNumber(): string {
  return whatsapp.nairobi;
}

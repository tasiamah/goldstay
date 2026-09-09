// Attribution for WhatsApp enquiries.
//
// Every WhatsApp CTA on the site is a plain wa.me deep link built by
// waLink() in site.ts, so the conversation happens off-platform and
// nothing about its origin survives the jump. A landlord messages "Hi
// Goldstay, I'd like to discuss managing my property" and ops have no
// idea whether that came from the homepage, an article, or the Kilimani
// page — which is why we cannot say what any of the SEO work produced.
//
// Two separate problems, and they need different fixes:
//
//   1. Which CTA gets clicked. A GA event answers this, and the click
//      is the only part of it a browser can see.
//   2. Which page produced an enquiry that was actually *sent*. A click
//      on wa.me only opens the compose screen; plenty of people never
//      press send, so click counts overstate real enquiries and no
//      amount of analytics can close that gap. The only signal that
//      crosses into WhatsApp is the prefilled message itself, so the
//      page has to be written into the text.
//
// This module is the pure half of both: the URL rewriting, with no DOM
// and no gtag, so it can be tested in a runner that has neither.
//
// Why client-side. Deriving the current path server-side inside waLink
// would need headers(), and reading headers() in the marketing tree
// opts all 417 static routes out of CDN caching — the exact regression
// getServerCity/soleLiveDomain exists to avoid. So the ref is appended
// at click time, where location.pathname is free.

// Marker that opens the appended line. Also how we detect our own work,
// so a second pass cannot append twice.
const REF_PREFIX = "(Sent from ";

export function isWhatsAppHref(href: string | null | undefined): boolean {
  if (!href) return false;
  return href.startsWith("https://wa.me/") || href.startsWith("http://wa.me/");
}

// The tracked hop at /go/whatsapp, which records the click server-side
// and then redirects to wa.me. See src/app/go/whatsapp/route.ts.
//
// It needs recognising here for one reason: it is still a WhatsApp CTA
// as far as analytics is concerned, and the GA `generate_lead` event is
// what Google Ads imports as the campaign's conversion. A CTA that
// routed through the hop and was not matched by this listener would
// stop reporting conversions to the campaign paying for the click.
//
// It does not get the href rewrite. The prefilled message and the
// "(Sent from ...)" footnote are built server-side in the route, where
// the campaign is also known, so rewriting here would either duplicate
// the footnote or fight with it.
export function isWhatsAppHop(href: string | null | undefined): boolean {
  if (!href) return false;
  // Relative in practice, but an absolute same-origin href is a
  // perfectly ordinary thing for a CMS or a copied link to produce.
  const path = href.startsWith("/")
    ? href
    : (() => {
        try {
          return new URL(href).pathname;
        } catch {
          return "";
        }
      })();
  return path === "/go/whatsapp" || path.startsWith("/go/whatsapp?");
}

// Either kind of WhatsApp CTA, for the analytics half of the listener.
export function isWhatsAppCta(href: string | null | undefined): boolean {
  return isWhatsAppHref(href) || isWhatsAppHop(href);
}

// Adds "(Sent from goldstay.co.ke/airbnb-management)" to the prefilled
// message, so the page is visible in the thread ops actually reads.
//
// Deliberately a readable sentence rather than a tracking code. A
// landlord who sees "Ref: KIL-HERO-2A" at the top of their own message
// is being shown plumbing and may well delete it or lose confidence in
// the message; one that says where it came from reads like a normal
// business reference and survives being read.
//
// Returns `href` untouched when it is not a wa.me link, when the ref is
// already there, or when anything about the URL fails to parse. This
// runs inside a click handler on the only path a lead has to reach us,
// so every failure mode has to end in "send them to WhatsApp anyway".
export function appendSourceRef(
  href: string,
  location: { host: string; pathname: string },
): string {
  if (!isWhatsAppHref(href)) return href;

  try {
    const url = new URL(href);
    const existing = url.searchParams.get("text") ?? "";
    if (existing.includes(REF_PREFIX)) return href;

    // Trailing slashes read as a typo in a sentence; the root keeps one
    // so the line says "goldstay.co.ke/" rather than bare host.
    const path =
      location.pathname.length > 1
        ? location.pathname.replace(/\/$/, "")
        : "/";
    const ref = `${REF_PREFIX}${location.host}${path})`;

    // Blank line so the ref reads as a footnote and not as part of the
    // landlord's own sentence.
    url.searchParams.set("text", existing ? `${existing}\n\n${ref}` : ref);
    return url.toString();
  } catch {
    return href;
  }
}

// Where on the page the click happened, for the GA event only. Kept out
// of the message, which stays clean.
//
// Falls back through explicit annotation, then the enclosing section's
// id, then "unknown". The fallback is what makes this worth having: the
// 27 files that call waLink did not need editing to get page-and-section
// attribution, and the handful of global CTAs that carry
// data-wa-source are the ones where "which button" is a real question.
export function surfaceLabel(input: {
  explicit?: string | null;
  sectionId?: string | null;
}): string {
  const explicit = input.explicit?.trim();
  if (explicit) return explicit;
  const section = input.sectionId?.trim();
  if (section) return `section:${section}`;
  return "unknown";
}

// GET /go/whatsapp — record the click, then send the visitor to WhatsApp.
//
// The hop exists because the funnel leaves our property at this point.
// Once the browser is on wa.me nothing we control can observe anything,
// so this is the last request where the click can be attributed, and
// it is the only one that can be attributed server-side.
//
// Why not rely on the GA event that already fires on these links.
// Because a paid campaign makes the shortfall matter: ad blockers, iOS
// Safari and Instagram's in-app browser drop client-side analytics at
// a rate nobody can measure, and an underreported campaign is
// indistinguishable from one that is not working. A row written here
// cannot be blocked, so the two numbers read together bound the gap.
// The GA event still fires from the button, so both exist.
//
// A note for whoever wires the Google Ads campaign: this URL must not
// be the ad's final URL. Google requires the final URL's domain to
// match the display domain, and a redirect straight out to wa.me is a
// destination mismatch that gets the ad disapproved. The ad points at
// a landing page; the button on that page points here.

import { NextResponse, type NextRequest } from "next/server";
import { cookies, headers } from "next/headers";
import { ADS_COOKIE, decodeAdsCookie } from "@/lib/ads/attribution";
import { classifyReferrer, sanitiseReferrer } from "@/lib/lead-attribution";
import { prisma } from "@/lib/db";
import {
  buildWhatsAppDestination,
  campaignWhatsAppNumber,
  deviceFromUserAgent,
  resolveIntent,
  sanitisePagePath,
  sanitiseSource,
} from "@/lib/whatsapp-click";
import { fallbackDomain } from "@/lib/site";

// Every request has to be recorded, so nothing about this may be
// cached or prerendered.
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const intent = resolveIntent(params.get("i"));
  const source = sanitiseSource(params.get("s"));
  const pagePath = sanitisePagePath(params.get("p"));

  const headerList = headers();
  const host = (headerList.get("host") ?? fallbackDomain()).toLowerCase();
  const referrer = sanitiseReferrer(headerList.get("referer"));
  const device = deviceFromUserAgent(headerList.get("user-agent"));
  const ipCountry = headerList.get("x-vercel-ip-country");

  // Read from the cookie rather than the query string. Middleware sets
  // it on the ad click, so it survives the visitor reading two articles
  // before pressing the button, and it cannot be forged into a
  // different campaign by editing the link they were given.
  const ads = decodeAdsCookie(cookies().get(ADS_COOKIE)?.value);

  const channel = classifyReferrer(referrer, host, {
    source: ads?.utmSource ?? null,
    medium: ads?.utmMedium ?? null,
    gclid: ads?.gclid ?? ads?.wbraid ?? ads?.gbraid ?? null,
  });

  const destination = buildWhatsAppDestination({
    intent,
    number: campaignWhatsAppNumber(),
    host,
    pagePath,
    campaign: ads?.utmCampaign ?? null,
  });

  // Awaited, not fired and forgotten: a serverless function can be
  // frozen the moment the response is returned, and an unawaited insert
  // is then lost. It is a single indexed insert, so the added latency
  // is small, and the whole thing is wrapped because a lead reaching
  // WhatsApp matters more than our record of it.
  try {
    await prisma.whatsAppClick.create({
      data: {
        source,
        intent,
        pagePath,
        gclid: ads?.gclid ?? null,
        wbraid: ads?.wbraid ?? null,
        gbraid: ads?.gbraid ?? null,
        utmSource: ads?.utmSource ?? null,
        utmMedium: ads?.utmMedium ?? null,
        utmCampaign: ads?.utmCampaign ?? null,
        utmTerm: ads?.utmTerm ?? null,
        utmContent: ads?.utmContent ?? null,
        landingPath: ads?.landingPath ?? null,
        referrer,
        channel,
        ipCountry: ipCountry ? ipCountry.slice(0, 2).toUpperCase() : null,
        device,
      },
    });
  } catch (e) {
    console.error("[goldstay wa-click] persist failed", e);
  }

  // 302 rather than 307 or 308: this is a tracked hop and not a
  // permanent home for the destination, and a cached 308 in a
  // visitor's browser would silently stop recording their next click.
  const response = NextResponse.redirect(destination, 302);
  response.headers.set("Cache-Control", "no-store, max-age=0");
  // A tracking hop has nothing to say to a crawler that reaches it.
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

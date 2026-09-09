import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { fallbackDomain, site } from "@/lib/site";

// Host-aware robots. Each country domain points crawlers at its own
// sitemap so Search Console picks up each property cleanly. Pointing
// every domain at one shared sitemap starves the others of indexing
// signal and lets Google guess which host owns which URL.
//
// Unknown hosts fall back to a domain that is actually live rather than
// to goldstay.com, which we do not own.
export default function robots(): MetadataRoute.Robots {
  const host = (headers().get("host") ?? fallbackDomain()).toLowerCase();
  const isNairobi = host.endsWith(site.domains.nairobi);
  const isAccra = host.endsWith(site.domains.accra);
  const base = `https://${isNairobi ? site.domains.nairobi : isAccra ? site.domains.accra : fallbackDomain()}`;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/apply",
          "/apply/",
          // Private intake link shared in WhatsApp threads. Kept out of
          // search so it doesn't compete with /list-your-property for
          // landlord intent.
          "/start",
          "/start/",
          "/api/",
          // Tracked redirect hops. They record a click and 302 out to
          // wa.me, so there is no page here for a crawler to index,
          // and a crawler following one would log a click nobody made.
          "/go/",
          "/auth/",
          "/login",
          "/client",
          "/client/",
          "/admin",
          "/admin/",
          // Read-only agreement copies shared with a client's advocate.
          // The token in the URL is the only credential, so a crawler
          // that found one and published it would put a client's
          // commercial terms in front of anybody who searched. The
          // route is also noindex via its layout; this stops a
          // well-behaved crawler fetching it in the first place.
          "/agreements/",
          // An observer's unsubscribe link. Same reasoning: the token
          // is the only credential, and the page names the client
          // whose statements the visitor was copied on, so an indexed
          // copy would put "X owns a rental managed by Goldstay" into
          // public search results. Noindex via the layout as well.
          "/statements/",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}

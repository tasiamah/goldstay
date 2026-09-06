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
          "/auth/",
          "/login",
          "/client",
          "/client/",
          "/admin",
          "/admin/",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}

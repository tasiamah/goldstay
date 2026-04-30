import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { site } from "@/lib/site";

// Host-aware robots. Each country domain points crawlers at its own
// sitemap so Search Console picks up all three properties cleanly.
// Pointing every domain at goldstay.com's sitemap (the previous
// behaviour) starves .co.ke and .com.gh of indexing signal and lets
// Google guess which host owns which URL.
export default function robots(): MetadataRoute.Robots {
  const host = (headers().get("host") ?? site.domains.main).toLowerCase();
  const isNairobi = host.endsWith(site.domains.nairobi);
  const isAccra = host.endsWith(site.domains.accra);
  const base = `https://${isNairobi ? site.domains.nairobi : isAccra ? site.domains.accra : site.domains.main}`;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/apply",
          "/apply/",
          "/api/",
          "/auth/",
          "/login",
          "/owner",
          "/owner/",
          "/admin",
          "/admin/",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}

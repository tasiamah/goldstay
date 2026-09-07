import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { site, fallbackDomain } from "@/lib/site";
import {
  marketsServedBy,
  sitemapPaths,
  type Market,
} from "@/lib/sitemap-routes";
import { postsForCountry } from "./(marketing)/insights/posts";
import { categories, postsForCategory } from "./(marketing)/insights/categories";

// Host-aware sitemap. Each domain advertises the routes it actually
// serves, which is not the same as the routes we intend it to serve one
// day — see marketsServedBy in lib/sitemap-routes.ts for why that
// distinction cost us 28 unlisted URLs.
//
// The route-selection rule lives in that module so it can be tested
// without importing this file, which reaches the whole 350-article
// catalogue and so cannot be loaded by a JSX-free test runner. This
// function is just the wiring: read the host, supply the catalogue,
// stamp the metadata.
export default function sitemap(): MetadataRoute.Sitemap {
  const host = (headers().get("host") ?? fallbackDomain()).toLowerCase();
  const isNairobi = host.endsWith(site.domains.nairobi);
  const isAccra = host.endsWith(site.domains.accra);
  const base = `https://${isNairobi ? site.domains.nairobi : isAccra ? site.domains.accra : fallbackDomain()}`;

  const markets = marketsServedBy(host);
  const byMarket = <T,>(fn: (m: Market) => T[]) =>
    ({
      kenya: markets.includes("kenya") ? fn("kenya") : [],
      ghana: markets.includes("ghana") ? fn("ghana") : [],
    }) satisfies Record<Market, T[]>;

  const paths = sitemapPaths({
    host,
    postSlugs: byMarket((m) => postsForCountry(m).map((p) => p.meta.slug)),
    // Only advertise category pages that actually contain articles this
    // host serves. Empty categories stay out until they have content.
    categorySlugs: byMarket((m) =>
      categories
        .filter((c) => postsForCategory(c.slug, m).length > 0)
        .map((c) => c.slug),
    ),
  });

  const now = new Date();
  return paths.map((r) => ({
    url: `${base}${r}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: r === "" ? 1 : 0.8,
  }));
}

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
    // Noindexed articles are excluded. Listing a URL in the sitemap
    // is a request to crawl and index it, and the page itself carries
    // a noindex — sending both is a contradiction, and the one Google
    // reports back as "indexed, though blocked" or simply as wasted
    // crawl. See PostMeta.noindex.
    postSlugs: byMarket((m) =>
      postsForCountry(m)
        .filter((p) => !p.meta.noindex)
        .map((p) => p.meta.slug),
    ),
    // Only advertise category pages that actually contain articles this
    // host serves. Empty categories stay out until they have content.
    categorySlugs: byMarket((m) =>
      categories
        .filter((c) => postsForCategory(c.slug, m).length > 0)
        .map((c) => c.slug),
    ),
  });

  // Real modification dates, per article.
  //
  // Every URL used to carry `lastModified: now`, so all 377 claimed to
  // have changed at the moment the sitemap was requested — and changed
  // again on the next deploy, and the one after. Google's guidance is
  // that it uses lastmod only where the value is "consistently and
  // verifiably accurate", and ignores it otherwise. A sitemap that
  // says everything changed today, every day, is the textbook case for
  // being ignored: it gives no way to tell a genuinely revised article
  // from one untouched since April, which is exactly the signal that
  // decides what gets recrawled first.
  //
  // Articles have honest dates already, so use them. Everything else
  // omits lastmod, which the spec allows and which is better than a
  // number we would be making up.
  const articleDates = new Map<string, string>();
  for (const m of markets) {
    for (const p of postsForCountry(m)) {
      const when = p.meta.updatedAt ?? p.meta.publishedAt;
      if (when) articleDates.set(`/insights/${p.meta.slug}`, when);
    }
  }

  return paths.map((r) => {
    const when = articleDates.get(r);
    const parsed = when ? new Date(when) : undefined;
    return {
      url: `${base}${r}`,
      ...(parsed && !Number.isNaN(parsed.getTime())
        ? { lastModified: parsed }
        : {}),
      changeFrequency: "monthly" as const,
      priority: r === "" ? 1 : 0.8,
    };
  });
}

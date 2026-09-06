import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import {
  site,
  cities,
  neighbourhoodSlug,
  countryForHost,
  fallbackDomain,
  shortLetNeighbourhoods,
} from "@/lib/site";
import { DIASPORA_ORIGINS } from "@/lib/diaspora-origins";
import { postsForCountry } from "./(marketing)/insights/posts";
import {
  categories,
  postsForCategory,
} from "./(marketing)/insights/categories";

// Host-aware sitemap. Each country domain advertises only the routes
// that actually live on it: goldstay.co.ke skips /accra* and
// goldstay.com.gh skips /nairobi*. Unknown hosts fall back to the live
// domain rather than to goldstay.com, which we do not own. The
// /insights catalogue is also country-scoped, so a Ghana sitemap only
// lists the Ghana articles that survive the cross-domain redirect, and
// vice versa for Kenya. This keeps Google from crawling cross-market
// URLs that 200 elsewhere but don't represent that domain's offering.
export default function sitemap(): MetadataRoute.Sitemap {
  const host = (headers().get("host") ?? fallbackDomain()).toLowerCase();
  const isNairobi = host.endsWith(site.domains.nairobi);
  const isAccra = host.endsWith(site.domains.accra);
  const base = `https://${isNairobi ? site.domains.nairobi : isAccra ? site.domains.accra : fallbackDomain()}`;

  const insightsCountry = countryForHost(host);
  const insightSlugs = postsForCountry(insightsCountry).map(
    (p) => `/insights/${p.meta.slug}`,
  );

  // Only advertise category pages that actually contain articles for
  // this host's country. Empty categories on the .com.gh surface stay
  // out of the sitemap until they have content.
  const categoryRoutes = categories
    .filter((c) => postsForCategory(c.slug, insightsCountry).length > 0)
    .map((c) => `/insights/category/${c.slug}`);

  // Programmatic diaspora-origin landing pages. Every supported
  // origin × city combination is statically generated, so we list
  // every URL on every host that serves the corresponding city.
  // The Nairobi and Accra origin pages are split below so the
  // /from/uk/accra URL only appears on goldstay.com and .com.gh,
  // not on the .co.ke sitemap.
  const fromHubAndOrigins = ["/from"];
  const fromNairobi = DIASPORA_ORIGINS.map((o) => `/from/${o.code}/nairobi`);
  const fromAccra = DIASPORA_ORIGINS.map((o) => `/from/${o.code}/accra`);

  const neutral = [
    "",
    "/airbnb-management",
    "/long-term-management",
    "/tenant-finding",
    "/property-sourcing",
    "/diaspora-payouts",
    "/yield-calculator",
    "/refer",
    "/refer/signup",
    "/list-your-property",
    "/find-a-home",
    "/about",
    "/insights",
    ...categoryRoutes,
    ...insightSlugs,
    ...fromHubAndOrigins,
    "/privacy",
    "/terms",
  ];

  const nairobiRoutes = [
    // On .co.ke the root *is* this page (next.config.mjs rewrites "/"
    // to /nairobi), so "" in `neutral` above already covers it and
    // /nairobi 301s there. Listing both would submit two URLs for one
    // page, one of which canonicalises away — the contradiction that
    // makes Google pick for you. The neutral .com serves a dual-market
    // homepage, so there /nairobi is a page in its own right.
    ...(isNairobi ? [] : ["/nairobi"]),
    "/nairobi/buy",
    ...cities.nairobi.neighbourhoods.map(
      (n) => `/nairobi/${neighbourhoodSlug(n.name)}`,
    ),
    // Service-plus-location pages. Only the neighbourhoods carrying
    // real short-stay data have one, so this is deliberately shorter
    // than the neighbourhood list above.
    ...shortLetNeighbourhoods("nairobi").map(
      (n) => `/nairobi/${neighbourhoodSlug(n.name)}/airbnb-management`,
    ),
    ...fromNairobi,
  ];

  const accraRoutes = [
    // Same as /nairobi above, for the Ghana domain's root.
    ...(isAccra ? [] : ["/accra"]),
    "/accra/buy",
    ...cities.accra.neighbourhoods.map(
      (n) => `/accra/${neighbourhoodSlug(n.name)}`,
    ),
    ...fromAccra,
  ];

  const routes = isNairobi
    ? [...neutral, ...nairobiRoutes]
    : isAccra
      ? [...neutral, ...accraRoutes]
      : [...neutral, ...nairobiRoutes, ...accraRoutes];

  const now = new Date();
  return routes.map((r) => ({
    url: `${base}${r}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: r === "" ? 1 : 0.8,
  }));
}

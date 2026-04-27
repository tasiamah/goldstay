import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { site, cities, neighbourhoodSlug, countryForHost } from "@/lib/site";
import { postsForCountry } from "./insights/posts";

// Host-aware sitemap. Each country domain advertises only the routes
// that actually live on it: goldstay.co.ke skips /accra*, goldstay.com.gh
// skips /nairobi*, and the neutral goldstay.com lists everything. The
// /insights catalogue is also country-scoped, so a Ghana sitemap only
// lists the Ghana articles that survive the cross-domain redirect, and
// vice versa for Kenya. This keeps Google from crawling cross-market
// URLs that 200 elsewhere but don't represent that domain's offering.
export default function sitemap(): MetadataRoute.Sitemap {
  const host = (headers().get("host") ?? site.domains.main).toLowerCase();
  const isNairobi = host.endsWith(site.domains.nairobi);
  const isAccra = host.endsWith(site.domains.accra);
  const base = `https://${isNairobi ? site.domains.nairobi : isAccra ? site.domains.accra : site.domains.main}`;

  const insightsCountry = countryForHost(host);
  const insightSlugs = postsForCountry(insightsCountry).map(
    (p) => `/insights/${p.meta.slug}`,
  );

  const neutral = [
    "",
    "/airbnb-management",
    "/property-sourcing",
    "/yield-calculator",
    "/list-your-property",
    "/find-a-home",
    "/about",
    "/insights",
    ...insightSlugs,
    "/privacy",
    "/terms",
  ];

  const nairobiRoutes = [
    "/nairobi",
    "/nairobi/buy",
    ...cities.nairobi.neighbourhoods.map(
      (n) => `/nairobi/${neighbourhoodSlug(n.name)}`,
    ),
  ];

  const accraRoutes = [
    "/accra",
    "/accra/buy",
    ...cities.accra.neighbourhoods.map(
      (n) => `/accra/${neighbourhoodSlug(n.name)}`,
    ),
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

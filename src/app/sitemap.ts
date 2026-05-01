import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { site, cities, neighbourhoodSlug, countryForHost } from "@/lib/site";
import { DIASPORA_ORIGINS } from "@/lib/diaspora-origins";
import { postsForCountry } from "./(marketing)/insights/posts";
import { categories, postsForCategory } from "./(marketing)/insights/categories";

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
    "/nairobi",
    "/nairobi/buy",
    ...cities.nairobi.neighbourhoods.map(
      (n) => `/nairobi/${neighbourhoodSlug(n.name)}`,
    ),
    ...fromNairobi,
  ];

  const accraRoutes = [
    "/accra",
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

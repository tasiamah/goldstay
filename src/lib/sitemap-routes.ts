import {
  cities,
  isLiveDomain,
  neighbourhoodSlug,
  shortLetNeighbourhoods,
  site,
} from "./site";
import { DIASPORA_ORIGINS } from "./diaspora-origins";

export type Market = "kenya" | "ghana";

// Which markets a given host is responsible for advertising.
//
// Scoping the sitemap by hostname alone was right for the three-domain
// plan and wrong for the present. goldstay.com.gh does not resolve, so
// every Ghana route is served from .co.ke, is self-canonical there and
// carries "index, follow" — while appearing in no sitemap at all. That
// was 28 URLs the site asked Google to index and never mentioned.
//
// The rule: a host advertises a market when it is that market's domain,
// or when that market's domain is not live and this host is standing in
// for it. Identical to what liveDomainOr already does for canonicals —
// the sitemap simply had not caught up.
//
// Nothing here needs changing when .com.gh goes live. Adding it to
// site.liveDomains makes `servesGhana` false on .co.ke and the Ghana
// routes move to their own sitemap on their own domain.
export function marketsServedBy(host: string): Market[] {
  const lower = host.toLowerCase();
  const isNairobi = lower.endsWith(site.domains.nairobi);
  const isAccra = lower.endsWith(site.domains.accra);

  const servesKenya = isNairobi || !isLiveDomain(site.domains.nairobi);
  const servesGhana = isAccra || !isLiveDomain(site.domains.accra);

  return [
    servesKenya ? ("kenya" as const) : null,
    servesGhana ? ("ghana" as const) : null,
  ].filter((m): m is Market => m !== null);
}

// Paths, host-relative and without the origin, in the order they should
// appear. Article and category slugs are passed in rather than imported
// so this stays a pure function: importing the catalogue would pull 350
// .tsx files into a test runner that is deliberately JSX-free.
export function sitemapPaths(input: {
  host: string;
  // Article slugs (bare, no /insights prefix) per market.
  postSlugs: Record<Market, readonly string[]>;
  // Category slugs that have at least one article, per market.
  categorySlugs: Record<Market, readonly string[]>;
}): string[] {
  const { host, postSlugs, categorySlugs } = input;
  const lower = host.toLowerCase();
  const markets = marketsServedBy(lower);
  const isNairobi = lower.endsWith(site.domains.nairobi);
  const isAccra = lower.endsWith(site.domains.accra);

  const uniq = (values: string[]) => [...new Set(values)];

  const insightRoutes = uniq(
    markets.flatMap((m) => [...postSlugs[m]]),
  ).map((slug) => `/insights/${slug}`);

  const categoryRoutes = uniq(
    markets.flatMap((m) => [...categorySlugs[m]]),
  ).map((slug) => `/insights/category/${slug}`);

  const neutral = [
    "",
    "/airbnb-management",
    "/airbnb-arbitrage-management",
    "/long-term-management",
    "/tenant-finding",
    "/property-sourcing",
    "/pricing",
    "/change-property-manager",
    "/diaspora-payouts",
    "/yield-calculator",
    "/refer",
    "/refer/signup",
    "/list-your-property",
    "/find-a-home",
    "/about",
    "/insights",
    ...categoryRoutes,
    ...insightRoutes,
    "/from",
    "/privacy",
    "/terms",
  ];

  const nairobiRoutes = [
    // On .co.ke the root *is* this page (next.config.mjs rewrites "/"
    // to /nairobi), so "" above already covers it and /nairobi 301s
    // there. Listing both would submit two URLs for one page, one of
    // which canonicalises away — the contradiction that makes Google
    // pick for you. On any other host /nairobi is a page in its own
    // right.
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
    ...DIASPORA_ORIGINS.map((o) => `/from/${o.code}/nairobi`),
  ];

  const accraRoutes = [
    // Same as /nairobi above, for the Ghana domain's root.
    ...(isAccra ? [] : ["/accra"]),
    "/accra/buy",
    ...cities.accra.neighbourhoods.map(
      (n) => `/accra/${neighbourhoodSlug(n.name)}`,
    ),
    ...DIASPORA_ORIGINS.map((o) => `/from/${o.code}/accra`),
  ];

  return uniq([
    ...neutral,
    ...(markets.includes("kenya") ? nairobiRoutes : []),
    ...(markets.includes("ghana") ? accraRoutes : []),
  ]);
}

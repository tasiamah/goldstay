import type { ComponentType } from "react";

import KenyaMriTax, {
  meta as kenyaMriTaxMeta,
} from "./kenya-mri-tax-diaspora-landlords";
import WhyViewingsMatter, {
  meta as whyViewingsMatterMeta,
} from "./why-property-viewings-matter-buying-remotely";
import WhyPropertyManagementMatters, {
  meta as whyPropertyManagementMattersMeta,
} from "./why-property-management-matters-diaspora-landlords";

import CostOfPropertyManagementKenya, {
  meta as costOfPropertyManagementKenyaMeta,
} from "./cost-of-property-management-kenya-2026";
import AirbnbVsLongTerm, {
  meta as airbnbVsLongTermMeta,
} from "./airbnb-vs-long-term-rental-nairobi";
import HowDiasporaLandlordsGetPaidUsd, {
  meta as howDiasporaLandlordsGetPaidUsdMeta,
} from "./how-diaspora-landlords-get-paid-usd-from-kenyan-rent";
import GhanaWithholdingTax, {
  meta as ghanaWithholdingTaxMeta,
} from "./ghana-8-percent-withholding-tax-landlords";
import BestNeighbourhoodsNairobi, {
  meta as bestNeighbourhoodsNairobiMeta,
} from "./best-neighbourhoods-nairobi-rental-yield-2026";
import HowToEvictTenantKenya, {
  meta as howToEvictTenantKenyaMeta,
} from "./how-to-evict-tenant-kenya-legally";
import ServiceChargeNairobi, {
  meta as serviceChargeNairobiMeta,
} from "./service-charge-nairobi-apartments-explained";
import HowToVerifyKenyanTitle, {
  meta as howToVerifyKenyanTitleMeta,
} from "./how-to-verify-kenyan-title-deed-from-abroad";
import BuyingOffPlanNairobi, {
  meta as buyingOffPlanNairobiMeta,
} from "./buying-off-plan-nairobi-risks-red-flags";
import CapitalGainsTaxKenya, {
  meta as capitalGainsTaxKenyaMeta,
} from "./capital-gains-tax-kenya-property-sellers";
import FurnishedOrUnfurnished, {
  meta as furnishedOrUnfurnishedMeta,
} from "./furnished-or-unfurnished-rental-nairobi";
import TenantScreeningNairobi, {
  meta as tenantScreeningNairobiMeta,
} from "./tenant-screening-nairobi-how-we-do-it";
import MaintenanceHandbook, {
  meta as maintenanceHandbookMeta,
} from "./maintenance-handbook-diaspora-landlords";
import HowToPriceNairobiRental, {
  meta as howToPriceNairobiRentalMeta,
} from "./how-to-price-nairobi-rental";
import BuyingPropertyAccra, {
  meta as buyingPropertyAccraMeta,
} from "./buying-property-accra-diaspora-2026-guide";

export type { Author, Country, PostMeta } from "./_shared";
export { authors } from "./_shared";

import type { Country, PostMeta } from "./_shared";

export type Post = {
  meta: PostMeta;
  Component: ComponentType;
};

// Ordered newest-first by `publishedAt`. Adding a post means dropping
// a new file in this directory exporting `meta` and a default React
// component, then adding a line below. The /insights index, the
// dynamic [slug] route, the related-posts row and the sitemap all
// pick up the new entry automatically.
export const posts: readonly Post[] = [
  { meta: kenyaMriTaxMeta, Component: KenyaMriTax },
  { meta: whyViewingsMatterMeta, Component: WhyViewingsMatter },
  {
    meta: whyPropertyManagementMattersMeta,
    Component: WhyPropertyManagementMatters,
  },
  {
    meta: costOfPropertyManagementKenyaMeta,
    Component: CostOfPropertyManagementKenya,
  },
  { meta: airbnbVsLongTermMeta, Component: AirbnbVsLongTerm },
  {
    meta: howDiasporaLandlordsGetPaidUsdMeta,
    Component: HowDiasporaLandlordsGetPaidUsd,
  },
  { meta: ghanaWithholdingTaxMeta, Component: GhanaWithholdingTax },
  {
    meta: bestNeighbourhoodsNairobiMeta,
    Component: BestNeighbourhoodsNairobi,
  },
  { meta: howToEvictTenantKenyaMeta, Component: HowToEvictTenantKenya },
  { meta: serviceChargeNairobiMeta, Component: ServiceChargeNairobi },
  {
    meta: howToVerifyKenyanTitleMeta,
    Component: HowToVerifyKenyanTitle,
  },
  { meta: buyingOffPlanNairobiMeta, Component: BuyingOffPlanNairobi },
  { meta: capitalGainsTaxKenyaMeta, Component: CapitalGainsTaxKenya },
  { meta: furnishedOrUnfurnishedMeta, Component: FurnishedOrUnfurnished },
  { meta: tenantScreeningNairobiMeta, Component: TenantScreeningNairobi },
  { meta: maintenanceHandbookMeta, Component: MaintenanceHandbook },
  {
    meta: howToPriceNairobiRentalMeta,
    Component: HowToPriceNairobiRental,
  },
  { meta: buyingPropertyAccraMeta, Component: BuyingPropertyAccra },
];

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.meta.slug === slug);
}

// Filter the catalogue down to one country. Used by the listing page,
// the sitemap and related-posts logic so each domain (.com / .co.ke
// for Kenya, .com.gh for Ghana) only ever surfaces articles that
// belong to it.
export function postsForCountry(country: Country): Post[] {
  return posts.filter((p) => p.meta.country === country);
}

// Pick related posts by tag overlap with the current article. Falls
// back to recency when no tag overlap is available. We constrain the
// pool to the same country so a Nairobi reader never lands on an
// Accra-only follow-up, and vice versa.
export function relatedPosts(slug: string, limit = 2): Post[] {
  const current = getPostBySlug(slug);
  if (!current) return posts.slice(0, limit);

  const currentTags = new Set(current.meta.tags);
  const sameCountry = posts.filter(
    (p) => p.meta.country === current.meta.country,
  );

  return sameCountry
    .filter((p) => p.meta.slug !== slug)
    .map((p) => {
      const overlap = p.meta.tags.filter((t) => currentTags.has(t)).length;
      return { post: p, overlap, ts: new Date(p.meta.publishedAt).getTime() };
    })
    .sort((a, b) => (b.overlap - a.overlap) || (b.ts - a.ts))
    .slice(0, limit)
    .map((entry) => entry.post);
}

import type { Country, PostMeta } from "./posts/_shared";
import { posts, type Post } from "./posts";

// Category definitions for the /insights hub. Each category is a real,
// indexable URL (/insights/category/<slug>) that aggregates every
// article matching its slug and tag rules. Categories are not exclusive:
// a single article can land in multiple categories (eg a diaspora tax
// piece sits under both "Tax & Legal" and "Diaspora"). Order below is
// the order shown in the category strip on /insights.

export type Category = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  intro: string;
  matches: (meta: PostMeta) => boolean;
};

const tagMatch = (tags: readonly string[], needles: RegExp) =>
  tags.some((t) => needles.test(t));

const slugMatch = (slug: string, needles: RegExp) => needles.test(slug);

export const categories: Category[] = [
  {
    slug: "buying",
    name: "Buying",
    shortName: "Buying",
    description:
      "Everything you need to buy property in Kenya without getting burned: process, diligence, finance, off-plan vs ready, negotiation, viewings and the diaspora playbook.",
    intro:
      "Buying property in Kenya looks straightforward and rarely is. The articles in this category cover the actual sequence of buying a home or investment property in Nairobi or upcountry: how the offer letter, sale agreement and transfer process work, what to negotiate, where the hidden costs land, the differences between ready and off-plan stock, and how to do all of it from abroad without losing money.",
    matches: ({ slug, tags }) =>
      slugMatch(
        slug,
        /buying|buyer|first-time|negotiate|hidden-costs-buying|offer-letter|sale-agreement|stamp-duty|viewing|off-plan|ready-vs|how-long-buying|best-time-of-year|how-to-buy-plot|distressed|auctions|sacco-vs-bank|developers-ranked|verify-developer|verify-kenyan-title|fake-title|title-fraud|cartels|spousal-consent|land-control-board|valuation|transfer-process/,
      ) ||
      tagMatch(
        tags,
        /^Buying$|Buyer|Negotiation|Viewing|Off-Plan|Stamp Duty|Sale Agreement|Offer Letter|Diligence|Title|Title Fraud|Land Fraud|Auction/i,
      ),
  },
  {
    slug: "renting-and-management",
    name: "Renting and Management",
    shortName: "Renting",
    description:
      "Running a Nairobi rental: tenants, leases, maintenance, vacancy, Airbnb, service charges, eviction and how to make a property pay.",
    intro:
      "Once a property is bought, the day to day of running it is what determines whether the investment actually returns. The articles here cover the operational reality of being a Nairobi landlord: tenant screening and eviction, lease structures, service charge governance, maintenance, Airbnb vs long term, vacancy diagnostics and how diaspora landlords get paid in USD.",
    matches: ({ slug, tags }) =>
      slugMatch(
        slug,
        /tenant|landlord|rental|airbnb|short-stay|service-charge|management|maintenance|vacancy|evict|paybill|insurance|how-to-price|amenities|furnished|hospitality|smart-home|solar/,
      ) ||
      tagMatch(
        tags,
        /Tenant|Landlord|Rental|Property Management|Airbnb|Maintenance|Vacancy|Service Charge|Operations|Short Stay/i,
      ),
  },
  {
    slug: "tax-and-legal",
    name: "Tax and Legal",
    shortName: "Tax & Legal",
    description:
      "Kenyan property tax, KRA, MRI, capital gains, stamp duty, succession, title fraud, land law and the legal framework you actually have to know.",
    intro:
      "Tax and legal exposure is where most property regret in Kenya is born. The pieces in this category cover the real legal and tax framework around Kenyan property: MRI tax, capital gains tax, stamp duty, succession, sectional properties, land control board consent, spousal consent, freehold and leasehold rules, title fraud, fake titles, land cartels and the lawyer-driven defences that work.",
    matches: ({ slug, tags }) =>
      slugMatch(
        slug,
        /tax|kra|mri|capital-gains|stamp-duty|succession|estate-planning|legal|sale-agreement|offer-letter|caveats|wayleaves|easements|spousal-consent|land-control-board|sectional-properties|freehold|fraud|cartels|fake-title|power-of-attorney|policy-debate|housing-levy|county-building-approvals|architects-quantity-surveyors|land-rates-council/,
      ) ||
      tagMatch(
        tags,
        /Tax|Legal|Stamp Duty|Succession|Title|Title Fraud|Land Fraud|MRI|Withholding|Compliance|Permits|Estate Planning/i,
      ),
  },
  {
    slug: "diaspora",
    name: "Diaspora",
    shortName: "Diaspora",
    description:
      "Buying, owning and managing Kenyan property from abroad: FX, USD, KMRC, returnee playbooks, scams, family pressure and the diaspora reality.",
    intro:
      "Most of our clients buy and run Kenyan property from abroad, and the diaspora situation has its own rules. The articles in this category cover sending money to Kenya, getting paid USD, building for parents in shags, returning home, the British buyer playbook, family pressure, scams that target diaspora specifically and the long form move-back planning that rarely makes it into mainstream property writing.",
    matches: ({ slug, tags }) =>
      slugMatch(
        slug,
        /diaspora|returnee|return-to|abroad|usd|fx|send-money|british-buyers|black-tax|building-for-your-parents|relative-kenya-scamming|how-diaspora|trip-checklist|move-back|kmrc|pension-backed|foreign-companies|citizenship-by-investment/,
      ) ||
      tagMatch(
        tags,
        /Diaspora|Returnees|British|Foreign|USD|FX|Move Back/i,
      ),
  },
  {
    slug: "neighbourhoods",
    name: "Neighbourhoods",
    shortName: "Neighbourhoods",
    description:
      "Honest deep dives on Nairobi neighbourhoods: Karen, Lavington, Westlands, Kilimani, Spring Valley, Riverside, Eastleigh, Kitisuru, Loresho, Parklands, Kitengela and more.",
    intro:
      "Where you buy in Nairobi is more consequential than what you buy. The articles in this category are honest, written-from-the-ground deep dives on individual Nairobi neighbourhoods: who lives there, what property costs, what rents look like, the genuine trade offs and where each suburb sits in the wider city map.",
    matches: ({ slug, tags }) =>
      slugMatch(
        slug,
        /neighbourhood|suburb|karen|runda|lavington|westlands|kilimani|spring-valley|riverside|gigiri|rosslyn|kitisuru|nyari|loresho|mountain-view|parklands|highridge|ngong-road|eastleigh|kitengela|south-b|south-c|emerging-suburbs|gated-communities|richest-neighbourhoods|cheapest|rent-by-neighbourhood/,
      ) ||
      tagMatch(
        tags,
        /Suburb|Neighbourhood|Karen|Lavington|Westlands|Kilimani|Premium/i,
      ),
  },
  {
    slug: "building-and-construction",
    name: "Building and Construction",
    shortName: "Building",
    description:
      "Building a house in Kenya in 2026: cost per square metre, materials, contractors, architects, county approvals, NEMA, NCA and how to avoid the build that stalls.",
    intro:
      "Building in Kenya is most owners' biggest single expense and the place most owners lose the most money. The articles in this category cover the real economics and process of building in Kenya in 2026: cost per square metre, cement and steel pricing, how contractors price, architects and quantity surveyors, county building approvals, NEMA, NCA, hidden costs and how to recover a stalled site.",
    matches: ({ slug, tags }) =>
      slugMatch(
        slug,
        /build|construction|cost-of-building|cement-steel|hidden-costs-building|architects|quantity-surveyors|county-building-approvals|stalled-construction|nca|nema|construction-cost-per-square-metre|buying-vs-building|building-for-your-parents/,
      ) ||
      tagMatch(
        tags,
        /Build|Construction|Materials|Architects|Quantity Surveyors|Cement|Steel|Self Build|Permits/i,
      ),
  },
  {
    slug: "market-and-macro",
    name: "Market and Macro",
    shortName: "Market",
    description:
      "Where the Nairobi property market is going: prices, rents, oversupply, the shilling, mortgages, KMRC, the expressway, election cycles and macro forecasts.",
    intro:
      "The market matters as much as the property. The articles in this category cover Nairobi market dynamics, oversupply zones, the shilling outlook, mortgage rates, KMRC, the expressway effect, election cycles, REITs, smart cities and the macro forces shaping Kenyan property values into 2026 and beyond.",
    matches: ({ slug, tags }) =>
      slugMatch(
        slug,
        /market|prices|rates|trends|outlook|crash|shilling|policy-debate|cycle|oversupply|expressway|sgr|adani|reits|smart-cities|emerging-market|kenya-vs-mauritius|cost-of-living|valuation|mortgage|housing-levy|review-2026/,
      ) ||
      tagMatch(
        tags,
        /Market|Prices|Rates|Trends|Macro|Outlook|Mortgage|Yield|Investment|Research/i,
      ),
  },
  {
    slug: "selling",
    name: "Selling",
    shortName: "Selling",
    description:
      "Selling your Kenyan property: what to do when it does not sell, how to sell in 30 days, capital gains, selling from abroad and the realistic seller playbook.",
    intro:
      "Selling Kenyan property is the part of the property cycle most articles ignore and most owners eventually face. The articles in this category cover the realistic seller playbook in Kenya: why properties do not sell, how to sell in 30 days, capital gains tax, selling from abroad and the diligence that makes sale completions actually complete.",
    matches: ({ slug, tags }) =>
      slugMatch(
        slug,
        /sell|seller|why-your-kenyan-property-is-not-selling|how-to-sell|selling-from-abroad|capital-gains/,
      ) ||
      tagMatch(tags, /Sell|Seller|Selling|Capital Gains/i),
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

// Filter posts down to a specific category, scoped to a country so the
// .com.gh surface never lists Kenya articles and vice versa.
export function postsForCategory(
  categorySlug: string,
  country: Country,
): Post[] {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return [];
  return posts.filter(
    (p) => p.meta.country === country && category.matches(p.meta),
  );
}

// Categories an individual post lives in. Used by the article footer to
// link back into the category hubs (internal linking is one of the
// reasons we built the categories in the first place).
export function categoriesForPost(meta: PostMeta): Category[] {
  return categories.filter((c) => c.matches(meta));
}

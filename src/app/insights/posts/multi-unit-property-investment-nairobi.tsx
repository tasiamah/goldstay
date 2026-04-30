import Link from "next/link";
import { authors, type PostMeta } from "./_shared";
import {
  Callout,
  H2,
  LI,
  Lede,
  P,
  Pullquote,
  UL,
} from "@/components/ArticleProse";

export const meta: PostMeta = {
  slug: "multi-unit-property-investment-nairobi",
  title:
    "Multi-unit property investment in Nairobi: the 2026 strategy",
  description:
    "Multi-unit residences (small apartment blocks of 2 to 12 units) are one of the most resilient property investment categories in Nairobi. Here is the honest 2026 guide on the strategy, the numbers, the suburbs and the operational requirements.",
  publishedAt: "2025-12-13",
  readingMinutes: 6,
  author: authors.research,
  tags: [
    "Multi-Unit",
    "Investment",
    "Nairobi",
    "Apartment Block",
    "Yield",
    "Property",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Multi-unit property investment Nairobi 2026 strategy",
};

export default function Article() {
  return (
    <>
      <Lede>
        Multi-unit residences, small apartment
        blocks of 2 to 12 units, are one of
        the most resilient property investment
        categories in Nairobi. Steady cash
        flow, diversified tenant risk, scalable
        management. Here is the honest 2026
        guide.
      </Lede>

      <H2 id="model">The model</H2>

      <UL>
        <LI>
          Acquire a small block of 2 to 12
          residential units
        </LI>
        <LI>
          Hold and rent
        </LI>
        <LI>
          Manage as a single property with
          professional management
        </LI>
        <LI>
          Compound is owned freehold or on a
          long lease in one title
        </LI>
      </UL>

      <H2 id="numbers">The 2026 numbers</H2>

      <UL>
        <LI>
          Mid-market 4-unit residence in
          Donholm or Kasarani: KES 25m to
          KES 45m
        </LI>
        <LI>
          Mid-market 6-unit residence in
          Embakasi or South B: KES 35m to
          KES 65m
        </LI>
        <LI>
          Mid-market 8 to 12-unit residence
          in Kasarani or Pipeline: KES 50m
          to KES 120m
        </LI>
        <LI>
          Gross yield: 9 to 14 percent in
          mid-market suburbs
        </LI>
        <LI>
          Net yield after management,
          maintenance, insurance and tax:
          6 to 9 percent
        </LI>
      </UL>

      <H2 id="suburbs">Where it works</H2>

      <UL>
        <LI>
          Kasarani, Roysambu, Pipeline:
          mass-market yield
        </LI>
        <LI>
          Donholm, Embakasi: mid-market
          yield
        </LI>
        <LI>
          South B, South C: mid-market
          stable
        </LI>
        <LI>
          Buruburu and adjacent: established
          market
        </LI>
        <LI>
          Kahawa Sukari fringe:
          family-anchored mid-market
        </LI>
      </UL>

      <H2 id="advantages">Advantages over single-unit investment</H2>

      <UL>
        <LI>
          Diversified tenant risk; void in
          one unit does not zero rental
          income
        </LI>
        <LI>
          Scale economies in management
        </LI>
        <LI>
          Single title and single
          structuring decision
        </LI>
        <LI>
          Stronger lender treatment as
          investment property
        </LI>
        <LI>
          Easier to recover the property
          and reset rent on a single
          building
        </LI>
      </UL>

      <H2 id="risks">Risks</H2>

      <UL>
        <LI>
          Operational complexity (tenants,
          repairs, common areas)
        </LI>
        <LI>
          Compound governance is the
          owner’s responsibility
        </LI>
        <LI>
          Resale liquidity slower than
          single units
        </LI>
        <LI>
          Title and structure diligence
          critical
        </LI>
        <LI>
          Concentration risk if all units
          target the same tenant cohort
        </LI>
      </UL>

      <H2 id="finance">Finance</H2>

      <UL>
        <LI>
          Bank mortgage available; treated
          as investment property
        </LI>
        <LI>
          Loan-to-value typically 60 to 70
          percent
        </LI>
        <LI>
          Rate slightly higher than
          owner-occupied
        </LI>
        <LI>
          Some private credit options for
          experienced investors
        </LI>
      </UL>

      <Callout title="The multi-unit rule">
        Multi-unit residences are the most
        resilient cash-flow asset in
        Nairobi mid-market property. Pair
        with professional management. Keep
        a maintenance reserve. Diversify
        tenant cohort.
      </Callout>

      <Pullquote>
        Most large Kenyan family property
        portfolios were built on
        multi-unit residences. The
        category remains the most durable
        cash-flow proposition in the
        Nairobi market.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For multi-unit investors we run
        sourcing and end-to-end management.
        Read also our pieces on{" "}
        <Link
          href="/insights/best-neighbourhoods-nairobi-rental-yield-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          best neighbourhoods rental yield
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/house-hacking-nairobi-strategy"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          house hacking Nairobi
        </Link>
        .
      </P>
    </>
  );
}

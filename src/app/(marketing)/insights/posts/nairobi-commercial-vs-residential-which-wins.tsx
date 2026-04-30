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
  slug: "nairobi-commercial-vs-residential-which-wins",
  title:
    "Nairobi commercial vs residential property: which actually wins in 2026",
  description:
    "Commercial and residential property in Nairobi follow different cycles, deliver different yields and suit different investors. Here is the honest 2026 comparison: who wins on cash flow, capital growth, ease of operation, exit liquidity and resilience through downturns.",
  publishedAt: "2026-03-18",
  readingMinutes: 5,
  author: authors.research,
  tags: [
    "Commercial",
    "Residential",
    "Nairobi",
    "Investor",
    "Strategy",
    "Property",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Nairobi commercial vs residential property which wins 2026",
};

export default function Article() {
  return (
    <>
      <Lede>
        Commercial and residential property
        in Nairobi follow different cycles,
        deliver different yields and suit
        different investors. Here is the
        honest 2026 comparison.
      </Lede>

      <H2 id="yield">Yield</H2>

      <UL>
        <LI>
          Mid-market residential: 9 to 13
          percent gross
        </LI>
        <LI>
          Premium residential: 4 to 7
          percent gross
        </LI>
        <LI>
          Anchored retail commercial: 8 to
          12 percent gross
        </LI>
        <LI>
          Office (CBD, Upper Hill,
          Westlands): 7 to 10 percent
          gross
        </LI>
        <LI>
          Industrial and warehousing: 9 to
          14 percent gross
        </LI>
        <LI>
          Mixed-use (retail/residential): 8
          to 11 percent
        </LI>
      </UL>

      <H2 id="capital-growth">Capital growth</H2>

      <UL>
        <LI>
          Residential premium: 5 to 8
          percent annual
        </LI>
        <LI>
          Mid-market residential: 5 to 7
          percent
        </LI>
        <LI>
          Commercial retail (anchored): 4
          to 6 percent
        </LI>
        <LI>
          Office: 3 to 5 percent (segment
          challenged in some clusters)
        </LI>
        <LI>
          Industrial: 4 to 7 percent
          (resilient demand)
        </LI>
      </UL>

      <H2 id="cycle">Cycle behaviour</H2>

      <UL>
        <LI>
          Residential rental demand
          relatively resilient through
          cycles
        </LI>
        <LI>
          Commercial demand more cyclical;
          tied to corporate health and
          economic cycle
        </LI>
        <LI>
          Office segment particularly
          challenged by hybrid work
        </LI>
        <LI>
          Anchored retail has held up
          better than office
        </LI>
        <LI>
          Industrial has been the most
          resilient
        </LI>
      </UL>

      <H2 id="operations">Ease of operation</H2>

      <UL>
        <LI>
          Residential: high churn (12 to
          24 month leases standard);
          intensive management
        </LI>
        <LI>
          Commercial: low churn (5 to 10
          year leases standard); lower
          management intensity per shilling
          of rent
        </LI>
        <LI>
          Industrial: low churn; minimal
          management
        </LI>
      </UL>

      <H2 id="ticket">Ticket size</H2>

      <UL>
        <LI>
          Residential entry: KES 5m to KES
          15m for first apartment
        </LI>
        <LI>
          Commercial retail entry: KES 30m
          to KES 100m for small standalone
          or strata unit
        </LI>
        <LI>
          Office strata: KES 10m to KES
          50m
        </LI>
        <LI>
          Industrial: KES 30m to KES 200m
        </LI>
      </UL>

      <H2 id="exit">Exit liquidity</H2>

      <UL>
        <LI>
          Residential: faster exit (3 to
          12 months on quality stock)
        </LI>
        <LI>
          Commercial: slower (12 to 36
          months); buyer pool smaller
        </LI>
        <LI>
          Industrial: slower; institutional
          buyer pool
        </LI>
      </UL>

      <H2 id="who-wins">Which wins for whom</H2>

      <UL>
        <LI>
          <strong>Yield-focused individual
          investor</strong>: residential
          mid-market multi-unit wins
        </LI>
        <LI>
          <strong>Cash flow + low-touch</strong>:
          anchored retail commercial wins
          (long lease, low management)
        </LI>
        <LI>
          <strong>Capital growth +
          diaspora-friendly</strong>:
          residential premium wins
        </LI>
        <LI>
          <strong>Institutional and
          family office</strong>: balanced
          portfolio of both wins
        </LI>
        <LI>
          <strong>First-time investor</strong>:
          residential first; commercial
          later
        </LI>
      </UL>

      <Callout title="The commercial vs residential rule">
        Most individual Nairobi investors
        should start residential, build
        scale, then add commercial when
        ticket size permits. Sophisticated
        investors run both. The honest
        choice depends on yield priority,
        management appetite and capital
        scale.
      </Callout>

      <Pullquote>
        Residential is the gateway to
        Nairobi property investment.
        Commercial is the destination for
        the patient, scaled investor.
        Both work; sequence matters.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        We focus on residential sourcing
        and management. For commercial we
        coordinate with specialised
        partners. Read also our pieces on{" "}
        <Link
          href="/insights/multi-unit-residence-strategy-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          multi-unit residence strategy
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/best-neighbourhoods-nairobi-rental-yield-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          best neighbourhoods rental yield
        </Link>
        .
      </P>
    </>
  );
}

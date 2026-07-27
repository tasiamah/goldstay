import Link from "next/link";
import { authors, type PostMeta } from "./_shared";
import {
  Callout,
  H2,
  H3,
  LI,
  Lede,
  P,
  Pullquote,
  UL,
} from "@/components/ArticleProse";

export const meta: PostMeta = {
  slug: "best-accra-neighbourhoods-usd-yield-2026",
  title:
    "Best Accra neighbourhoods for USD yield in 2026",
  description:
    "Ranking Accra neighbourhoods on the metric that actually matters for a diaspora landlord: USD-denominated net yield after tax and management. Which pockets stack up, which do not, and why the answer is not what most agents will tell you.",
  publishedAt: "2026-07-03",
  updatedAt: "2026-07-27",
  readingMinutes: 8,
  author: authors.research,
  tags: [
    "Ghana",
    "Accra",
    "Yield",
    "USD",
    "Neighbourhood",
    "Diaspora",
  ],
  country: "ghana",
  heroImage: "/images/locations/accra.jpg",
  heroAlt:
    "Best Accra neighbourhoods for USD yield 2026, diaspora landlord ranking",
};

export default function Article() {
  return (
    <>
      <Lede>
        Yield rankings on Accra property tend to be
        published in gross cedi terms, which is the
        metric a diaspora landlord cares about
        least. What actually matters is USD net
        yield after tax and management, because
        that is the number that lands in the
        overseas account. On that basis the
        ranking of Accra neighbourhoods is not the
        one you usually see, and the top of the
        table is not what most agents pitch.
      </Lede>

      <H2 id="the-methodology">How this ranking is built</H2>

      <P>
        For each neighbourhood we take a
        representative two bedroom apartment at
        the market median price, apply the
        realistic gross rent for a
        well-let unit, subtract the 8 per cent GRA
        withholding tax, subtract typical management
        fees of 10 per cent, subtract typical
        service charge (net of pass-through),
        subtract insurance and property tax, and
        arrive at a net USD yield on original
        purchase price. Every input is 2026
        data. Every conversion is at the current
        Bank of Ghana reference rate.
      </P>

      <Callout title="What this ranking deliberately excludes">
        Capital appreciation, tenant covenant
        strength, void period risk, and exit
        liquidity. All of those matter, none of
        them are yield. A high-yield pocket with
        high void risk can produce a lower
        realised income than a moderate-yield
        pocket with excellent covenants. Read
        this alongside the tenant analysis in the
        individual neighbourhood pieces.
      </Callout>

      <H2 id="ranking">The 2026 ranking</H2>

      <H3 id="one-airport-residential">1. Airport Residential (aviation-facing stock)</H3>
      <P>
        Best-in-class serviced two bedroom stock,
        aviation and airline tenant base, holds
        occupancy through the year. Median
        purchase price USD 260,000, median USD
        rent USD 2,400 per month, gross yield
        11.1 per cent. Net USD yield after tax,
        management and running costs: 7.4 to
        8.1 per cent. Highest realised yield in
        the city on a well-let unit.
      </P>

      <H3 id="two-east-legon-okponglo">2. East Legon (Okponglo side)</H3>
      <P>
        Adjacent to the University of Ghana,
        NGO and academic tenant base, materially
        cheaper than the core East Legon
        pockets. Median purchase price USD
        195,000, median rent USD 1,650 per
        month, gross yield 10.2 per cent. Net
        USD yield: 6.5 to 7.2 per cent. The
        yield-per-dollar champion in Accra for
        buyers who accept a different tenant
        profile.
      </P>

      <H3 id="three-dzorwulu">3. Dzorwulu</H3>
      <P>
        Quieter mid-tier residential, mixed
        expat and local corporate tenant base.
        Median purchase price USD 240,000,
        median rent USD 1,900 per month, gross
        yield 9.5 per cent. Net USD yield: 6.1
        to 6.8 per cent. Depth of stock is thin,
        but where a unit is available the
        arithmetic works.
      </P>

      <H3 id="four-east-legon-core">4. East Legon (core, American House / A&C)</H3>
      <P>
        The core diaspora buying market. Median
        purchase price USD 270,000, median rent
        USD 2,050 per month, gross yield 9.1
        per cent. Net USD yield: 5.8 to 6.4
        per cent. Deepest resale market of any
        Accra pocket, which is worth 30 to 50
        basis points on realised yield through
        the holding period.
      </P>

      <H3 id="five-adjiringanor">5. Adjiringanor and Trasacco</H3>
      <P>
        Gated family estates, strong tenant
        stability, longer commutes. Median
        purchase price USD 310,000 for
        equivalent two bedroom, median rent
        USD 2,200 per month, gross yield 8.5
        per cent. Net USD yield: 5.4 to 6.0
        per cent.
      </P>

      <H3 id="six-labone">6. Labone and Osu (short-stay adjusted)</H3>
      <P>
        On a pure long-let underwriting the
        numbers do not stack. On a short-stay
        underwriting they can, but 2026's
        softer short-stay demand has pulled
        blended annualised yield down. Median
        purchase price USD 260,000, blended
        annualised USD rent equivalent
        USD 2,100 per month, gross yield 9.7
        per cent. Net USD yield after
        short-stay operating costs: 5.0 to
        6.0 per cent, wider dispersion than
        any other pocket in this ranking.
      </P>

      <H3 id="seven-cantonments">7. Cantonments</H3>
      <P>
        Highest per-square-metre pricing in
        Accra, embassy and diplomatic tenant
        base, USD rents. Median purchase price
        USD 380,000, median rent USD 2,600 per
        month, gross yield 8.2 per cent. Net
        USD yield: 5.0 to 5.6 per cent. Yield
        is not why you buy Cantonments; capital
        preservation and tenant covenant are.
      </P>

      <Pullquote>
        The USD net yield champion in Accra in
        2026 is Airport Residential, not East
        Legon core. This is not what agents
        pitch, but it is what the arithmetic
        says.
      </Pullquote>

      <H2 id="what-this-ranking-does-not-say">
        What this ranking does not say
      </H2>

      <UL>
        <LI>
          <strong>Higher yield does not mean
          better investment.</strong> A 7.5 per
          cent net yield with 8 weeks of void
          per year is a 6.4 per cent realised
          yield. Read the ranking alongside
          void-risk analysis for each pocket.
        </LI>
        <LI>
          <strong>Capital growth is a separate
          question.</strong> Cantonments and
          core East Legon standalone product
          have historically appreciated
          strongest. If your objective is total
          return over a ten year hold, yield
          is one lens; capital growth is the
          other.
        </LI>
        <LI>
          <strong>Currency risk is asymmetric.</strong>{" "}
          A cedi-denominated tenancy in a
          neighbourhood where USD tenants are
          rare is a different asset from a USD
          tenancy in an embassy pocket. Two
          identical apartments can have very
          different realised USD returns.
        </LI>
        <LI>
          <strong>Depth of resale
          market.</strong> Selling a
          Cantonments townhouse in a soft
          market takes three months. Selling
          an Okponglo two bedroom takes
          nine. Liquidity is a real cost
          in the total-return calculation.
        </LI>
      </UL>

      <H2 id="how-we-help">Where this leaves a diaspora buyer</H2>

      <P>
        The ranking above is a starting point,
        not an answer. The right neighbourhood
        for a specific buyer depends on the
        holding horizon, the tenant strategy,
        the currency preference and the exit
        expectation. For long-hold, income-first
        buyers who can accept a slightly less
        prestigious tenant profile,
        Airport Residential aviation stock and
        East Legon Okponglo are the strongest
        yield propositions in 2026. For
        capital-preservation buyers with a ten
        year horizon and a preference for
        embassy or corporate covenants,
        Cantonments and East Legon core remain
        the anchors.
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/accra-property-market-review-2026-h1"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the H1 2026 market review
        </Link>
        ,{" "}
        <Link
          href="/insights/cantonments-accra-diplomatic-premium-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Cantonments in 2026
        </Link>
        ,{" "}
        <Link
          href="/insights/airport-residential-accra-2026-buyer-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Airport Residential buyer guide
        </Link>
        , and{" "}
        <Link
          href="/insights/buying-property-east-legon-diaspora-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          East Legon in 2026
        </Link>
        .
      </P>
    </>
  );
}

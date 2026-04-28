import Link from "next/link";
import { authors, type PostMeta } from "./_shared";
import {
  Callout,
  H2,
  H3,
  LI,
  Lede,
  OL,
  P,
  Pullquote,
  UL,
} from "@/components/ArticleProse";

export const meta: PostMeta = {
  slug: "property-valuation-kenya-how-it-works-bank-vs-market",
  title:
    "Property valuation in Kenya: how it actually works, and why your number differs from the bank&rsquo;s",
  description:
    "Why a Kenyan bank&rsquo;s mortgage valuation lands 10 to 20 percent below the price you agreed to pay, what the three valuation methods are, when each is used, what an Open Market Value report should include, and how to use a valuation properly when buying or selling.",
  publishedAt: "2025-12-31",
  readingMinutes: 7,
  author: authors.research,
  tags: ["Kenya", "Valuation", "Mortgage", "Buying", "Selling", "Diligence"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Property valuation Kenya, bank mortgage valuation versus open market value for Nairobi property",
};

export default function Article() {
  return (
    <>
      <Lede>
        Almost every diaspora buyer running a Kenyan
        mortgage application meets the same surprise. The
        seller wants KES 14m. The buyer agreed KES 13.5m.
        The bank&rsquo;s valuer comes back at KES 11.8m.
        Suddenly the loan-to-value calculation shifts, the
        deposit gets larger, and the deal looks less
        attractive. Understanding why valuations land where
        they do, and how Kenyan valuation actually works,
        is one of the more useful pieces of process literacy
        a buyer can have.
      </Lede>

      <H2 id="who-values">Who is qualified to value</H2>

      <P>
        Property valuations in Kenya are produced by
        valuers registered with the Valuers Registration
        Board and members of the Institution of Surveyors
        of Kenya. A bank will only accept a valuation from
        their own panel of approved valuers. A valuation
        from a non-approved valuer, even from a registered
        professional, will not be accepted for mortgage
        purposes. Always confirm with the bank which
        panellist they want before instructing.
      </P>

      <H2 id="three-methods">The three valuation methods</H2>

      <H3 id="comparable">Comparable sales (the residential default)</H3>

      <P>
        For a typical apartment or townhouse, the valuer
        identifies recent sales of broadly comparable
        properties in the same compound or neighbourhood,
        adjusts for size, finish, floor and other
        differences, and lands on a per-square-metre
        equivalent for the subject property.
      </P>

      <P>
        The challenge in Kenya is that recorded sale prices
        are not always reliable. Stamp duty incentives mean
        sale prices declared at the lands office sometimes
        understate true paid prices. Good Kenyan valuers
        cross-check declared prices against private market
        intelligence, agent feedback, and listing data.
        Less rigorous valuers rely entirely on stamp duty
        records and consequently undervalue.
      </P>

      <H3 id="investment-method">Investment method (income capitalisation)</H3>

      <P>
        For income-producing property (rented apartments,
        commercial, multi-let), the valuer estimates net
        rental income, applies a market yield (capitalisation
        rate), and produces an income-based value. For a
        Nairobi prime apartment yielding KES 80,000 a month
        net (KES 960,000 a year) at a 7.5% market yield, the
        income-based value is KES 12.8m.
      </P>

      <P>
        Most residential mortgage valuations use comparable
        as primary and reference investment method as a
        cross check.
      </P>

      <H3 id="cost-method">Replacement cost method</H3>

      <P>
        Estimates land value plus the depreciated cost of
        replacing the buildings. Mostly used for unique
        properties without good comparables, owner-occupied
        homes for insurance valuation, or new builds where
        comparables are limited.
      </P>

      <H2 id="why-bank-lower">Why the bank&rsquo;s number is lower</H2>

      <P>
        Bank mortgage valuations land below the agreed
        purchase price for several recurring reasons:
      </P>

      <OL>
        <LI>
          <strong>Forced sale value, not open market value.</strong>{" "}
          For mortgage security purposes the bank often
          asks the valuer to indicate both Open Market
          Value (OMV) and Forced Sale Value (FSV). FSV is
          typically 75 to 85% of OMV, reflecting the
          discount the bank would face if it had to sell
          the property quickly to recover the loan. Some
          banks lend against FSV directly. The applicant
          sees that lower number and assumes the valuer
          underpriced the asset.
        </LI>
        <LI>
          <strong>Conservative comparables.</strong> Bank
          valuers default to the more conservative end of
          the comparable range to protect the bank&rsquo;s
          downside.
        </LI>
        <LI>
          <strong>Off-plan and pre-completion adjustment.</strong>{" "}
          For off-plan properties, valuers often discount
          to a current-stage value rather than completed
          value, even when the loan is for the completed
          property.
        </LI>
        <LI>
          <strong>Market segment differences.</strong> The
          bank valuer may use comparables from a slightly
          different segment than the agent priced the
          property in. A premium compound in Kilimani is
          not comparable to a generic Kilimani apartment.
        </LI>
        <LI>
          <strong>Genuinely overpriced agreed prices.</strong>{" "}
          Sometimes the simplest answer. The buyer agreed
          a price above market. The valuation reveals it.
        </LI>
      </OL>

      <Callout title="OMV vs FSV in one line">
        Open Market Value is what the property is worth in
        a normal sale. Forced Sale Value is what the bank
        thinks it could fetch in a fast sale to recover
        debt. Both can be true. The bank&rsquo;s loan
        decision usually rests on FSV, which is naturally
        lower.
      </Callout>

      <H2 id="what-good-report">What a proper valuation report contains</H2>

      <UL>
        <LI>
          Property address, legal description, title number
          and tenure
        </LI>
        <LI>
          Site description (size, topography, services,
          access)
        </LI>
        <LI>
          Building description (construction, age,
          condition, floor area)
        </LI>
        <LI>
          Photographs of the property and immediate
          surroundings
        </LI>
        <LI>
          Market commentary (sales activity, rental
          environment, demand drivers)
        </LI>
        <LI>
          Comparable sales used, with adjustments shown
        </LI>
        <LI>
          The valuation method or methods applied
        </LI>
        <LI>
          The arrived OMV, FSV (if requested) and any
          insurance reinstatement value
        </LI>
        <LI>
          Statement of assumptions and limitations
        </LI>
        <LI>
          Valuer&rsquo;s registration number and signature
        </LI>
      </UL>

      <P>
        A two-page valuation that gives only a number with
        no comparables, no description and no method
        statement is not a proper valuation. Most banks
        will reject it. As a buyer, you should also reject
        it.
      </P>

      <H2 id="how-to-use">How to use valuations properly</H2>

      <H3 id="buying">As a buyer</H3>

      <OL>
        <LI>
          Get an independent valuation alongside the bank
          valuation when stakes are high. Costs KES 25,000
          to KES 80,000. Helps you triangulate whether the
          agreed price is genuinely market or above.
        </LI>
        <LI>
          Use a low bank valuation as a renegotiation
          lever. Sellers under pressure often agree to
          renegotiate when a credible bank valuation says
          the price is 10 to 15% above market. Sellers
          confident in the price will typically refuse;
          that itself is information.
        </LI>
        <LI>
          Do not assume the lowest valuation is right. A
          bank valuation deliberately conservative for
          security purposes is not the open market price.
        </LI>
      </OL>

      <H3 id="selling">As a seller</H3>

      <OL>
        <LI>
          Pre-list valuation by an established valuer is
          worth doing for properties above KES 20m. It
          anchors discussions with buyers and agents.
        </LI>
        <LI>
          Be ready for buyers&rsquo; bank valuations to
          come in below your asking price. That is normal.
          Decide in advance how much room you have to
          negotiate if it does.
        </LI>
        <LI>
          A wide gap between asking price and several
          independent valuations is information about your
          asking price, not about the valuers.
        </LI>
      </OL>

      <H2 id="diaspora-specific">Diaspora-specific considerations</H2>

      <UL>
        <LI>
          For non-resident buyers, the bank valuation is
          part of the loan approval pack. Allow KES 30,000
          to KES 80,000 and 7 to 14 days lead time.
        </LI>
        <LI>
          For inherited property and probate work, an
          independent valuation is needed for the estate
          and may be needed for capital gains computation
          on subsequent sale. Use a registered valuer and
          retain the report.
        </LI>
        <LI>
          For insurance, request the insurance reinstatement
          value alongside the OMV. The two are often
          different and your insurance cover should match
          reinstatement, not OMV.
        </LI>
      </UL>

      <Pullquote>
        A good Kenyan valuation is a market opinion backed
        by comparables, photographs and a method
        statement. Anything less is a number on a page.
        For high-value diaspora transactions, pay the fee
        for the proper one.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For sourcing clients we coordinate independent
        valuations alongside any required bank valuations,
        using valuers we have worked with for years and
        trust to call markets honestly. For sellers
        engaging us we do a pre-marketing valuation
        triangulation so the asking price is anchored in
        evidence.
      </P>

      <P>
        Read our pieces on{" "}
        <Link
          href="/insights/kenya-mortgage-rates-2026-diaspora-buyer-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Kenyan mortgage rates in 2026
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/sale-agreement-stage-buying-property-kenya"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the sale agreement stage
        </Link>{" "}
        for where valuation fits inside the wider
        purchase process.
      </P>
    </>
  );
}

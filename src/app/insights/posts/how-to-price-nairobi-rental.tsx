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
  slug: "how-to-price-nairobi-rental",
  title:
    "How to price a Nairobi rental from scratch (without guessing)",
  description:
    "The methodology we use to price every property we manage in Nairobi: comparable analysis, the four building features that move rent more than location, the pricing mistakes that cost more than they save, and how to test a number before committing to it.",
  publishedAt: "2025-01-02",
  readingMinutes: 7,
  author: authors.research,
  tags: ["Nairobi", "Pricing", "Strategy", "Comps"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt: "Pricing a Nairobi rental, comparable analysis methodology",
};

export default function Article() {
  return (
    <>
      <Lede>
        Most Nairobi rents are set in one of two wrong
        ways. Either the previous owner&rsquo;s rent is
        increased by some round number (10%, 15%) without
        reference to the actual market, or the agent
        pulls a number from a competing listing of
        questionable comparability. Both produce rents
        that are routinely 10 to 20% off correct, in
        either direction. Here is the comparable analysis
        we run on every property we manage, the
        adjustments that matter, and how to test a
        candidate price before you commit.
      </Lede>

      <H2 id="comparable-analysis">The basics of comparable analysis</H2>

      <P>
        Pricing a rental properly means finding
        comparable units (&ldquo;comps&rdquo;) currently
        let or recently let, adjusting for the
        differences between the comp and your unit, and
        landing on a defensible figure. Three rules:
      </P>

      <OL>
        <LI>
          Comps must be currently let, not currently
          listed. A listing at KES 250,000 that has been
          on the market for four months is not a comp.
          It is a price that has been rejected by the
          market.
        </LI>
        <LI>
          Comps must be similar in core attributes:
          building type, age, finish quality, floor,
          orientation, parking. Surface comparability
          (same neighbourhood, same beds) is necessary
          but not sufficient.
        </LI>
        <LI>
          Adjust, do not average. Take three to five
          good comps, then add or subtract for each
          relevant difference between the comp and your
          unit, and arrive at an adjusted number. The
          mean of unadjusted comps tells you very
          little.
        </LI>
      </OL>

      <H2 id="data-sources">Where the data actually comes from</H2>

      <UL>
        <LI>
          <strong>Live tenancies.</strong> The most
          reliable source. Other landlords and managers
          in the same building or block. Goldstay shares
          anonymised rent data within our portfolio for
          this purpose, and we exchange comparable data
          with three other reputable Nairobi managers.
        </LI>
        <LI>
          <strong>Recent re-lets.</strong> Units in your
          neighbourhood that have re-let in the last 90
          days. Listing platforms (BuyRentKenya,
          Property24, JiJi Premium) show date listed and
          date taken down.
        </LI>
        <LI>
          <strong>Currently listed comps with caution.</strong>
          Useful as a ceiling indicator. The quickest
          rule of thumb: a listing more than 30 days old
          is priced too high.
        </LI>
        <LI>
          <strong>Building-level rates.</strong> The
          management committee chair or the building
          security usually know what units in the
          building are letting at. A direct conversation
          is faster than research.
        </LI>
      </UL>

      <H2 id="four-features">
        Four building features that move rent more than location
      </H2>

      <H3 id="feature-1">1. Reliable backup power</H3>

      <P>
        A working generator that automatically kicks in
        on power loss is worth roughly 5 to 10% of rent
        in Nairobi. Power outages still happen often
        enough that tenants who can afford to choose,
        do choose. A non-functional or absent backup is
        a hard no for many corporate tenants regardless
        of location.
      </P>

      <H3 id="feature-2">2. Reliable water</H3>

      <P>
        Water reliability varies dramatically across
        Nairobi neighbourhoods. A building with reliable
        mains supply, a working borehole, and a large
        tank reserve commands 5 to 8% above otherwise
        identical buildings with intermittent supply.
      </P>

      <H3 id="feature-3">3. Manned security</H3>

      <P>
        24-hour manned security with proper visitor
        logs is worth 5 to 10% of rent compared to
        contractor security on call.
      </P>

      <H3 id="feature-4">4. Building amenities that work</H3>

      <P>
        A swimming pool that is open 50 weeks a year,
        a gym with maintained equipment, and clean
        common areas: each of these matters. A pool
        that is shut for maintenance four months a year
        is worse than no pool at all, because it
        reminds the tenant of the gap between brochure
        and reality. We have seen pricing premia of 8
        to 12% for buildings where amenities genuinely
        function relative to identical-spec buildings
        where they do not.
      </P>

      <Pullquote>
        A pool that is shut for maintenance four months
        a year is worse than no pool at all. It reminds
        the tenant of the gap between brochure and
        reality.
      </Pullquote>

      <H2 id="adjustments">The adjustments that matter</H2>

      <UL>
        <LI>
          <strong>Floor.</strong> Higher floors with
          views in Nairobi command 5 to 10% over ground
          and first floor in the same building. The
          exception is buildings without working lifts,
          where the relationship inverts.
        </LI>
        <LI>
          <strong>Orientation.</strong> South or
          west-facing units in Nairobi typically command
          a small premium for daylight. North-facing
          units behind trees can be 5% below the
          building average for the same spec.
        </LI>
        <LI>
          <strong>Parking.</strong> Each parking bay is
          worth roughly KES 5,000 to KES 10,000 a month
          in Nairobi for long-term lets in central
          neighbourhoods. Two bays plus visitor parking
          in Westlands is a meaningful differentiator.
        </LI>
        <LI>
          <strong>Furnishing quality.</strong> Read the
          piece on{" "}
          <Link
            href="/insights/furnished-or-unfurnished-rental-nairobi"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            furnished vs unfurnished
          </Link>
          . The premium varies by neighbourhood from
          near-zero to 40%.
        </LI>
        <LI>
          <strong>Age and finish.</strong> A 2018-build
          with original kitchen and bathrooms typically
          rents 8 to 15% below a 2024-build of the same
          size in the same neighbourhood. A
          well-renovated older unit can match the new
          build, but not exceed it.
        </LI>
      </UL>

      <H2 id="testing-a-price">Testing a price before you commit</H2>

      <P>
        Once you have a candidate price, two practical
        tests:
      </P>

      <OL>
        <LI>
          <strong>Listing test.</strong> Run the unit
          live for 14 days at the candidate price. If
          inquiries come at a healthy rate (5 to 10
          serious inquiries in 14 days for a Nairobi 2
          bed in a good neighbourhood), the price is
          right. If only one or two inquiries reach you
          and none progress to viewing, the price is
          15% too high. Adjust down and re-run.
        </LI>
        <LI>
          <strong>Days-to-let test.</strong> Comparable
          well-priced 2 beds in Kilimani let in 18 to
          35 days. If your unit is still on the market
          past 45 days, the market is telling you
          something. Most landlords take three months to
          accept the message and then drop too far.
          Better to drop 10% at week 5 than 25% at
          month 4.
        </LI>
      </OL>

      <Callout title="The 5% rule">
        For a property struggling to let, the right
        first price drop is 5%. Not 10, not 15. Five
        percent attracts a wider pool of inquiries
        without alarming the existing pipeline. Only if
        the second 14 days of marketing also fail to
        produce a strong tenant should you drop again.
      </Callout>

      <H2 id="annual-rent-reviews">Annual rent reviews</H2>

      <P>
        For tenants on rolling or annual leases, the
        annual rent review is its own art. Some rules we
        follow:
      </P>

      <UL>
        <LI>
          Match Nairobi inflation as a baseline. CPI is
          typically 6 to 9%; rent at that pace keeps the
          unit at roughly real-rent parity.
        </LI>
        <LI>
          Look at the gap between current rent and
          re-let rent. If the unit would let to a new
          tenant at significantly above current rent, a
          larger increase is justified. If not,
          inflation-only is the right call.
        </LI>
        <LI>
          Never raise to the new-tenant ceiling on a
          renewal. Existing tenants represent zero
          vacancy risk and zero re-let cost. The right
          renewal is below the ceiling, with the
          discount being the tenant&rsquo;s reward for
          staying.
        </LI>
      </UL>

      <H2 id="how-we-handle-it">How we handle it</H2>

      <P>
        For every Goldstay-managed property, we run a
        new comparable analysis at onboarding, after
        any significant building change, and at every
        renewal. We share the analysis with the
        landlord, recommend a number, and the landlord
        approves before we list. For ongoing rent
        reviews, the analysis is part of the renewal
        proposal sent 60 days before lease end.
      </P>

      <P>
        Run a quick read of your own property on the{" "}
        <Link
          href="/yield-calculator"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          yield calculator
        </Link>
        . Or send the address on{" "}
        <Link
          href="/list-your-property"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          this form
        </Link>{" "}
        for a written rent recommendation based on
        actual comps from our portfolio and the wider
        market.
      </P>
    </>
  );
}

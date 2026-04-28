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
  slug: "service-charge-nairobi-apartments-explained",
  title:
    "Service charge in Nairobi apartments: what you're really paying for",
  description:
    "What service charge actually covers, why two identical-looking buildings in Kilimani charge KES 12,000 and KES 38,000 a month, the four red flags that mean the management committee is mismanaged, and how to read a service charge ledger.",
  publishedAt: "2025-03-07",
  readingMinutes: 7,
  author: authors.poonam,
  tags: ["Nairobi", "Service Charge", "Apartments", "Costs"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt: "Nairobi apartment building, service charge breakdown explained",
};

export default function Article() {
  return (
    <>
      <Lede>
        Service charge is the single most opaque cost in
        Nairobi apartment ownership. Two identical-looking 2
        bed apartments in Kilimani can have monthly service
        charges of KES 12,000 and KES 38,000 with no
        explanation that ever reaches the diaspora owner.
        Both numbers can be reasonable. Both can also hide
        problems. Here is what service charge actually covers,
        what to look for in the ledger, and the four red
        flags that mean the building&rsquo;s management
        committee is in trouble.
      </Lede>

      <H2 id="what-it-pays-for">What service charge actually pays for</H2>

      <P>
        Service charge is the apartment-by-apartment
        contribution to the running of the building&rsquo;s
        common areas, services, and reserve fund. A typical
        Nairobi mid-tier apartment service charge breaks down
        roughly like this:
      </P>

      <UL>
        <LI>
          <strong>Security:</strong> 30 to 40% of total. Manned
          guards, gate operations, CCTV, alarm response.
        </LI>
        <LI>
          <strong>Cleaning and gardens:</strong> 10 to 15%.
          Common area cleaning, lift cleaning, landscaping,
          drainage clearing.
        </LI>
        <LI>
          <strong>Utilities for common areas:</strong> 8 to
          12%. Common area lighting, water for gardens and
          pools, generator fuel for backups.
        </LI>
        <LI>
          <strong>Maintenance and repairs:</strong> 10 to 15%.
          Lift servicing, water pump servicing, generator
          servicing, painting, plumbing in common areas.
        </LI>
        <LI>
          <strong>Pool and gym (if any):</strong> 5 to 10%.
          Chemicals, equipment servicing, pool attendant.
        </LI>
        <LI>
          <strong>Insurance:</strong> 3 to 6%. Building cover,
          public liability, common area assets.
        </LI>
        <LI>
          <strong>Management committee or managing agent
          fee:</strong> 5 to 10%. The cost of running the
          governance and finances of the building itself.
        </LI>
        <LI>
          <strong>Reserve fund:</strong> 5 to 15%. The pot for
          major works (lift replacement, pump replacement,
          structural repairs). The most under-funded line in
          most Nairobi buildings.
        </LI>
      </UL>

      <H2 id="why-two-buildings-differ">
        Why two similar buildings differ by 3x
      </H2>

      <P>
        The single biggest driver of service charge variance
        is amenity load. A building with a swimming pool,
        rooftop garden, gym, generator, manned reception, and
        full landscaping will run KES 30,000 to KES 50,000 a
        month for a 2 bed. A no-frills building with a guard,
        a basic generator, no pool, and no gym will run KES
        8,000 to KES 15,000.
      </P>

      <P>
        After amenity load, the next biggest factor is
        whether the management committee runs a real reserve
        fund or not. Buildings that consistently underfund
        the reserve have artificially low service charge for
        years, until the lift fails or the roof leaks. Then
        residents face a special assessment of KES 100,000
        to KES 500,000 per unit, which is the worst-case
        version of cheap service charge in disguise.
      </P>

      <Pullquote>
        Cheap service charge is sometimes a bargain and
        sometimes a bill being deferred to the day the lift
        fails.
      </Pullquote>

      <H2 id="how-to-read-the-ledger">
        How to read a service charge ledger
      </H2>

      <P>
        Every apartment should have an annual service charge
        budget approved by the AGM and a quarterly or
        half-yearly statement of actuals. Both documents are
        the landlord&rsquo;s right to request, and the
        landlord should ask for both before buying or before
        signing on for management.
      </P>

      <P>
        What to check:
      </P>

      <OL>
        <LI>
          Does total income match total expenditure roughly,
          with reserve contribution as the residual? If income
          and expenditure match exactly with no reserve
          contribution, the building is hand-to-mouth.
        </LI>
        <LI>
          Are arrears (other unit owners not paying) flagged
          separately? In a well-run building, arrears are
          listed by unit and chased actively. In a badly-run
          building, the management committee just charges the
          paying owners more to cover the gap.
        </LI>
        <LI>
          Is the reserve fund a real bank balance or an
          accounting fiction? Ask for the bank statement of
          the reserve account. A real reserve fund has cash;
          a paper reserve has only entries in a spreadsheet.
        </LI>
        <LI>
          Is the management committee or managing agent fee
          listed separately? Bundling it into &ldquo;admin&rdquo;
          obscures what the governance is actually costing.
        </LI>
      </OL>

      <H2 id="red-flags">Four red flags that mean trouble</H2>

      <H3 id="red-1">1. Service charge unchanged for three or more years</H3>

      <P>
        Costs in Nairobi (security, fuel, parts, labour) have
        risen materially every year for a decade. A
        management committee that has not raised service
        charge in three years is either operating an unusually
        well-run building or, far more commonly, is deferring
        decisions and burning the reserve.
      </P>

      <H3 id="red-2">2. No AGM in the last 18 months</H3>

      <P>
        AGMs are the only mechanism by which residents
        approve budgets and elect the committee. A building
        without recent AGM minutes is a building without
        functional governance. Decisions are being made by
        whoever is loudest, not by majority.
      </P>

      <H3 id="red-3">3. Special assessments more than once in two years</H3>

      <P>
        Special assessments (one-off levies for major works)
        are normal and sometimes necessary. Multiple special
        assessments in quick succession suggest chronic
        underfunding of the reserve, and you should expect
        more.
      </P>

      <H3 id="red-4">4. Persistent arrears above 15% of billable</H3>

      <P>
        If 15% or more of unit owners are not paying their
        service charge and the committee has not taken legal
        action, the paying owners are subsidising the
        non-paying ones. This is often the start of a slow
        building decline.
      </P>

      <Callout title="Before you buy">
        For any Nairobi apartment we source for a diaspora
        buyer, our pre-purchase checklist explicitly pulls
        the last three years of service charge ledgers, the
        last two AGM minutes, and the bank statement of the
        reserve fund. Half of buyers we work with have never
        thought to ask. The information is decisive.
      </Callout>

      <H2 id="how-managers-handle-it">
        How a manager handles service charge for you
      </H2>

      <P>
        Goldstay pays service charge from collected rent
        each month, on time, and itemises every payment on
        the monthly statement. Where the management committee
        proposes a special assessment, we flag it to you, get
        your approval, and pay from collected rent (or top
        up if needed). We attend AGMs as your proxy by
        default, vote in your interest, and minute the
        outcomes for you.
      </P>

      <P>
        For new purchases, the service charge ledger and AGM
        minutes are part of the standard pre-purchase report
        we run on every property we source. Read more in the
        piece on{" "}
        <Link
          href="/insights/why-property-viewings-matter-buying-remotely"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          why a physical property viewing still matters
        </Link>
        .
      </P>
    </>
  );
}

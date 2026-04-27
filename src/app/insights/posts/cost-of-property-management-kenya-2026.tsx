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
  slug: "cost-of-property-management-kenya-2026",
  title:
    "How much does property management actually cost in Kenya in 2026?",
  description:
    "Real numbers on what Kenyan property managers charge in 2026, what's quoted vs what's actually deducted, and the eight hidden line items that determine whether a 10% fee is cheap or expensive.",
  publishedAt: "2026-04-01",
  readingMinutes: 8,
  author: authors.poonam,
  tags: ["Kenya", "Costs", "Fees", "Management", "Diaspora"],
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Nairobi apartment building, what property management costs in Kenya in 2026",
};

export default function Article() {
  return (
    <>
      <Lede>
        Every diaspora landlord asks the same question on the first
        call, and almost nobody gets a straight answer. So here is the
        straight answer. In Kenya in 2026, residential property
        management costs between 8% and 12% of rent collected for a
        long-term let, between 18% and 25% of revenue for a
        short-stay or Airbnb, and roughly one month&rsquo;s rent for
        tenant-finding only. Anything outside those bands is either
        a bargain you should be suspicious of or a premium you
        should ask hard questions about.
      </Lede>

      <P>
        Below is what each fee actually buys, what shows up on the
        statement, and the eight smaller line items that decide
        whether a quoted 10% is genuinely 10% or 14% by the time
        the year is over.
      </P>

      <H2 id="long-term">Long-term residential management</H2>

      <P>
        The headline number for Nairobi is 10%. It is the rate
        Goldstay charges, the rate most established competitors
        charge, and the rate the diaspora landlords we onboard most
        often migrate from. Some smaller agents quote 8%. A few
        boutique operators quote 12% and make the case that they do
        more.
      </P>

      <H3 id="what-10-percent-buys">What 10% should buy</H3>

      <UL>
        <LI>Tenant sourcing, screening, lease drafting, key handover.</LI>
        <LI>
          Monthly rent collection, including chasing on day one
          past due, escalation on day five, legal notice on day
          fifteen.
        </LI>
        <LI>
          Monthly KRA filing of MRI at 7.5% of gross rent. (Read
          the{" "}
          <Link
            href="/insights/kenya-mri-tax-diaspora-landlords"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            full MRI guide
          </Link>{" "}
          for what that involves.)
        </LI>
        <LI>
          Annual land rates, service charge to the management
          committee, SRA levies where applicable, paid from
          collected rent and itemised on the statement.
        </LI>
        <LI>
          Routine maintenance triage and vendor management, with a
          held float for fixes under USD 50 so a leaking tap does
          not need three WhatsApps to authorise.
        </LI>
        <LI>
          A real PDF statement on the 5th of every month with every
          shilling collected and spent, every receipt attached.
        </LI>
        <LI>USD or GBP wire to your foreign bank, FX rate disclosed.</LI>
      </UL>

      <P>
        If a manager quoting 10% does not include all seven of those
        items, the percentage is misleading. You are paying for a
        narrower service and you will pay separately for the rest.
      </P>

      <H3 id="why-cheaper-is-not-cheaper">
        Why 8% is rarely actually cheaper
      </H3>

      <P>
        Smaller agents at 8% almost always exclude tax filing,
        statements, and FX remittance. The landlord finds out at
        year-end that no MRI returns have been filed, no statements
        exist for any month, and rent has been sitting in a Kenyan
        shillings account for nine months while the currency
        depreciated. The 2% saved on the headline fee gets eaten by
        a single penalty assessment from KRA and a single year of
        unhedged FX drift. We have unwound enough of these
        situations to know the math is rarely in the landlord&rsquo;s
        favour.
      </P>

      <Pullquote>
        Two percent saved on the headline fee gets eaten by a
        single penalty assessment from KRA.
      </Pullquote>

      <H2 id="airbnb">Airbnb and short-stay management</H2>

      <P>
        Short-stay management costs more because it is a fundamentally
        different operation. There is no monthly rent payment to
        collect. There are 30 to 70 individual guests a year, each
        of whom needs check-in, cleaning, restocking, response to a
        broken kettle at 11 PM, review management, and dynamic
        pricing tuned weekly. The going rate in Nairobi for full
        Airbnb management is 20% of revenue, with a few operators
        going as low as 18% and a few aggressive premium players
        charging 25%.
      </P>

      <H3 id="what-airbnb-fee-buys">What 20% should buy</H3>

      <UL>
        <LI>
          Listing setup and optimisation across Airbnb, Booking.com,
          and direct.
        </LI>
        <LI>Professional photography and copy, refreshed yearly.</LI>
        <LI>
          Dynamic pricing managed weekly, not a flat nightly rate
          set once.
        </LI>
        <LI>Guest screening, ID verification, and house rules enforcement.</LI>
        <LI>
          24/7 guest response with on-the-ground turnaround within
          the city.
        </LI>
        <LI>Cleaning and linen between every stay, restocked consumables.</LI>
        <LI>
          Tax handling: VAT registration if turnover crosses the KES
          5 million annual threshold, plus the 1.5% Tourism Levy on
          gross revenue.
        </LI>
        <LI>Monthly statement and USD remittance, same as long-term.</LI>
      </UL>

      <Callout title="The 20 vs 10 trap">
        Owners often compare 20% Airbnb against 10% long-term and
        conclude the long-term is half the cost. It is not. Airbnb
        in a good Nairobi neighbourhood typically grosses 1.6 to
        2.2 times what the same unit would earn long-term, after
        the higher fee. The right comparison is net of all fees
        and after vacancy. Run the numbers on the{" "}
        <Link
          href="/yield-calculator"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          yield calculator
        </Link>{" "}
        and the answer flips per property.
      </Callout>

      <H2 id="tenant-finding">Tenant-finding only</H2>

      <P>
        For owners who genuinely want to manage themselves but need
        a tenant in the door, the standard Kenyan rate is one
        month&rsquo;s rent as a one-off finder&rsquo;s fee. That
        should include marketing, viewings, screening, lease
        drafting, and handover. It should not include any ongoing
        management. The tenant becomes your direct relationship
        from move-in day forward.
      </P>

      <P>
        It is a clean structure when the landlord is in the same
        timezone and willing to handle calls, repairs, rent
        collection, and tax filing. For diaspora landlords it is
        almost always a false economy. The cost of one missed
        repair, one late rent, one unfiled MRI return, will exceed
        the management fee saved.
      </P>

      <H2 id="hidden-line-items">
        The eight smaller line items that change the real cost
      </H2>

      <P>
        Two managers at the same headline percentage can produce
        wildly different annual bills. Watch for these:
      </P>

      <OL>
        <LI>
          <strong>FX spread.</strong> If you are paid in USD or GBP,
          the rate at which collected KES is converted matters
          enormously. A 2% retail spread on a year of rent is
          double the difference between an 8% and 10% management
          fee.
        </LI>
        <LI>
          <strong>Setup or onboarding fee.</strong> Some agents charge
          a one-off USD 200 to USD 500 to take on a property.
          Goldstay does not.
        </LI>
        <LI>
          <strong>Repair markup.</strong> Some operators add 10 to
          15% on top of contractor invoices for &ldquo;coordination&rdquo;.
          On a year with two real repairs it can add a percentage
          point to the total cost.
        </LI>
        <LI>
          <strong>Vacancy-period fee.</strong> Reputable managers
          charge zero in months the property is vacant. Some charge
          a half-fee or a flat KES 5,000 standing charge.
        </LI>
        <LI>
          <strong>Statement frequency.</strong> Some operators charge
          extra for monthly statements vs quarterly. The right
          answer is monthly, included.
        </LI>
        <LI>
          <strong>Inspection fees.</strong> Quarterly property
          inspections should be in the 10%, not a separate charge.
        </LI>
        <LI>
          <strong>Renewal fees.</strong> Some agents charge a half
          month&rsquo;s rent every time a tenant renews. We do
          not.
        </LI>
        <LI>
          <strong>Exit fees.</strong> The contract should let you
          leave on 30 days&rsquo; notice with no clawback. If
          there is a notice period longer than 60 days, ask why.
        </LI>
      </OL>

      <H2 id="how-goldstay-prices">How Goldstay prices</H2>

      <P>
        Flat and disclosed. 10% of rent collected for long-term,
        20% of revenue for Airbnb, one month&rsquo;s rent for
        tenant-finding only. No setup fee. No repair markup. No
        vacancy fee. No renewal fee. No exit clawback. FX at
        wholesale interbank rate with the spread shown on every
        statement.
      </P>

      <P>
        If you want a real number for a real property, send the
        address on{" "}
        <Link
          href="/list-your-property"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          this form
        </Link>{" "}
        or on WhatsApp. We will quote in writing and put it on the
        contract. You do not need to switch to get the quote.
      </P>
    </>
  );
}

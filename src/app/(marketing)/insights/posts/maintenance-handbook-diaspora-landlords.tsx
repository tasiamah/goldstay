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
  slug: "maintenance-handbook-diaspora-landlords",
  title: "The diaspora landlord's maintenance handbook",
  description:
    "How to keep a Nairobi or Accra apartment in good repair from 6,000 miles away. The four-tier authority structure, the items that should be on planned maintenance, the failures we see most often, and how to budget realistically.",
  publishedAt: "2024-12-03",
  readingMinutes: 7,
  author: authors.poonam,
  tags: ["Maintenance", "Operations", "Diaspora", "Budget"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Maintenance handbook for diaspora landlords managing property remotely",
};

export default function Article() {
  return (
    <>
      <Lede>
        Most of the day-to-day cost of property happens
        below the rent line. Geyser failures, drain
        blockages, kitchen taps, balcony tile lifting,
        intermittent generator failures, and the small
        steady bills that nobody photographs for the
        listing. Get this layer wrong and a 9% gross
        yield becomes a 5% net yield. Get it right and
        the same property earns you a quiet additional
        2% a year by avoiding the damage that follows
        delayed repairs. Here is how we run it.
      </Lede>

      <H2 id="four-tier">The four-tier authority structure</H2>

      <P>
        The biggest single mistake in remote-managed
        property is requiring landlord authorisation for
        every repair. The right structure tiers
        decisions by cost so the small ones happen
        instantly and only the meaningful ones reach the
        owner.
      </P>

      <UL>
        <LI>
          <strong>Tier 1: Up to USD 50.</strong> Light
          bulbs, washers, drain plungers, fuse
          replacements, basic plumbing supplies, paint
          touch-ups. No authorisation. Done same-day,
          appears on next monthly statement.
        </LI>
        <LI>
          <strong>Tier 2: USD 50 to 250.</strong> Geyser
          element, tap replacement, single-room paint,
          minor electrical, basic appliance repairs.
          Photograph and quote sent to the landlord on
          WhatsApp; no formal sign-off needed unless the
          landlord disagrees.
        </LI>
        <LI>
          <strong>Tier 3: USD 250 to 1,000.</strong>
          Geyser replacement, large appliance, full
          bathroom regrout, balcony waterproofing,
          significant electrical or plumbing work.
          Quote, scope of work, and timeline shared.
          Written approval required before work starts.
        </LI>
        <LI>
          <strong>Tier 4: Above USD 1,000.</strong>
          Full-room renovation, structural work,
          appliance package replacement. Multiple quotes,
          scope, and a phased payment schedule.
          Approval required, typically with a scheduled
          call.
        </LI>
      </UL>

      <P>
        The crucial detail is that Tier 1 and Tier 2 are
        funded from a held maintenance float, not from
        the next month’s collected rent. The float
        is typically one month of rent, replenished from
        rent as it depletes. Without a float, even Tier 1
        repairs sit in WhatsApp for hours waiting for
        payment authorisation, and the tenant’s
        experience deteriorates.
      </P>

      <Pullquote>
        Without a maintenance float, even a fifty-dollar
        repair sits in WhatsApp waiting for payment
        authorisation, and the tenant’s experience
        quietly deteriorates.
      </Pullquote>

      <H2 id="planned">Planned maintenance, not just reactive</H2>

      <P>
        Reactive maintenance handles failures as they
        happen. Planned maintenance is the cheaper half:
        scheduled inspections and small interventions
        that prevent failures from happening in the
        first place.
      </P>

      <H3 id="quarterly">Quarterly</H3>

      <UL>
        <LI>Whole-property inspection: photo report on every room, every wet area, every electrical fitting.</LI>
        <LI>Drain test on every wet area.</LI>
        <LI>Geyser anode and pressure check.</LI>
        <LI>HVAC filter replacement (if applicable).</LI>
        <LI>Sealant inspection on showers, kitchens, balconies.</LI>
      </UL>

      <H3 id="annually">Annually</H3>

      <UL>
        <LI>Full electrical safety inspection.</LI>
        <LI>Plumbing safety inspection.</LI>
        <LI>Repaint of high-traffic areas (kitchens, hallways) every two to three years.</LI>
        <LI>Appliance servicing (fridge, washing machine, oven).</LI>
        <LI>Pest control (preventive, not reactive).</LI>
      </UL>

      <H3 id="five-year">Every five to seven years</H3>

      <UL>
        <LI>Full repaint, exterior and interior.</LI>
        <LI>Geyser replacement (most cylinder geysers in Nairobi do not exceed seven years of useful life on hard water).</LI>
        <LI>Major appliance replacement.</LI>
        <LI>Full re-grouting of bathrooms.</LI>
        <LI>Window seal replacement.</LI>
      </UL>

      <H2 id="budget">How to budget</H2>

      <P>
        A defensible long-term maintenance budget for a
        Nairobi 1 or 2 bed apartment is roughly 8 to 10%
        of gross rent annually, smoothed across years.
        Less in a brand-new building (perhaps 4 to 5%
        for the first three years), more in a building
        over 15 years old (12 to 15%).
      </P>

      <P>
        The cost is not evenly distributed. A typical
        ten-year cycle sees light maintenance for years
        one to four, an inflection in years five to
        seven (geyser, repaint, sealant), and another
        inflection at year nine or ten when finishes
        start to need refresh.
      </P>

      <Callout title="The maintenance budget conversation">
        Most diaspora owners, presented with a
        well-itemised maintenance budget upfront, are
        relieved. Most owners who first encounter
        maintenance budgeting in a year-end statement
        feel ambushed. We discuss the budget on
        onboarding so the maintenance line on every
        statement is expected, not surprising.
      </Callout>

      <H2 id="vendors">Vendors: build a real bench</H2>

      <P>
        The single biggest operational asset in property
        management is a vetted vendor bench. A good
        plumber for the Kilimani-Westlands axis, a good
        electrician, a tile setter, a painter, a fridge
        technician, an appliance specialist, a security
        contractor for entry-system upgrades.
      </P>

      <P>
        The Goldstay vendor bench has roughly 40
        regularly-used contractors across our coverage
        areas in Nairobi and Accra. We have direct
        accounts with each, fixed callout fees, and
        same-day turnaround commitments on critical
        repairs (water, electrical, security). For most
        diaspora landlords trying to build their own
        bench remotely, the friction is the
        single-biggest reason they end up with chronic
        maintenance backlog.
      </P>

      <H2 id="failures">The maintenance failures we see most</H2>

      <H3 id="failure-1">1. Roof and balcony water ingress</H3>

      <P>
        The most expensive single failure pattern in
        Nairobi residential. Small leaks become
        structural over months, often invisible to the
        tenant until the bedroom ceiling cracks. The
        defence is annual sealant inspection and prompt
        action on any visible discoloration.
      </P>

      <H3 id="failure-2">2. Geyser leaks</H3>

      <P>
        Cylinder geysers fail on hard water schedules
        that are well-understood. The five-year
        replacement is reliable. Skipping it routinely
        leads to a failure mid-tenancy, water damage to
        the floor below, and a five-figure repair bill
        that should have been a four-figure planned
        replacement.
      </P>

      <H3 id="failure-3">3. Drain blockages from cooking grease</H3>

      <P>
        Standard for any tenancy more than 12 months.
        Annual chemical drain treatment plus a kitchen
        plumb-rod every 18 to 24 months prevents the
        majority. Reactive treatment after the kitchen
        sink fails is materially more expensive and
        ruins a Sunday.
      </P>

      <H3 id="failure-4">4. Appliance service neglect</H3>

      <P>
        Fridges, washing machines, and ovens fail
        cleanly when serviced annually and badly when
        not. A 12-year-old serviced washing machine
        often outperforms a 4-year-old neglected one.
      </P>

      <H2 id="ghana-note">A note for Accra landlords</H2>

      <P>
        Almost the same playbook works in Accra, with
        two specific additions. First, dust ingress is
        materially worse during the harmattan and
        affects HVAC, electronics, and surface finishes.
        Quarterly inspection in Accra catches dust-driven
        problems that quarterly inspection in Nairobi
        does not. Second, the cedi-denominated cost of
        imported parts (electronics, HVAC components)
        moves with FX, so budgets should be reviewed
        annually rather than locked at onboarding.
      </P>

      <H2 id="how-we-handle-it">How we handle it</H2>

      <P>
        Goldstay-managed properties run on the four-tier
        authority structure, with a held maintenance
        float, a vendor bench, quarterly inspections,
        and an annual planned-maintenance schedule. Every
        repair appears on the monthly statement with a
        photo and a vendor invoice. Every quarterly
        inspection produces a PDF report.
      </P>

      <P>
        If your current property has a maintenance
        backlog and you want a diagnostic, send the
        details on{" "}
        <Link
          href="/list-your-property"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          this form
        </Link>
        . We run a full inspection and produce a
        prioritised remediation plan, with the buyer
        deciding whether to use our vendors or their
        own.
      </P>
    </>
  );
}

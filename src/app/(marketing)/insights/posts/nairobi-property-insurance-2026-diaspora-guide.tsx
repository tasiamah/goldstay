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
  UL,
} from "@/components/ArticleProse";

export const meta: PostMeta = {
  slug: "nairobi-property-insurance-2026-diaspora-guide",
  title:
    "Nairobi property insurance for diaspora landlords: an honest 2026 guide",
  description:
    "What to insure, what not to bother with, what a fair premium looks like, and the four claim scenarios that actually matter for a diaspora landlord. Written after fifteen years of processing claims for owners abroad.",
  publishedAt: "2026-07-25",
  readingMinutes: 8,
  author: authors.poonam,
  tags: [
    "Nairobi",
    "Insurance",
    "Diaspora",
    "Risk",
    "Landlord",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Nairobi apartment insurance policy paperwork for a diaspora landlord",
};

export default function Article() {
  return (
    <>
      <Lede>
        Almost every diaspora landlord we onboard is
        underinsured, overinsured, or both simultaneously. The
        broker sold them the wrong policy years ago and nobody
        has revisited it. Here is what actually matters for a
        Nairobi property owned from abroad, with honest
        numbers on cost and honest views on which insurers
        pay claims and which do not.
      </Lede>

      <Callout title="A note on scope">
        Nothing in this piece is a personal recommendation.
        Insurance is situation-dependent and the right policy
        for you turns on the property, the tenant, the
        mortgage and your risk appetite. Take this as an
        orientation, then talk to an independent broker (not
        one tied to a single insurer). The insurer ranking at
        the bottom of this piece is empirical, based on many
        years of running claims for owner clients; it is not
        an endorsement and it is not sponsored.
      </Callout>

      <H2 id="what-to-insure">What you actually need to insure</H2>

      <P>
        There are four things worth insuring on a residential
        Nairobi property, listed in the order of how badly you
        will regret not having them.
      </P>

      <H3 id="one">1. Buildings insurance (structure)</H3>

      <P>
        Covers fire, storm damage, structural collapse,
        earthquake, malicious damage. This is the
        non-negotiable one. If the building burns down and you
        do not have this, the loss is total and uninsured.
        The sum insured should be the cost to rebuild in
        current KES, not the market value of the property.
        Rebuilding a 2-bed apartment in Kilimani in 2026 costs
        roughly KES 6 to 9 million depending on finishing.
        Rebuilding a 4-bed Karen villa costs KES 25 to 45
        million depending on plot and specification. Ask a
        quantity surveyor for a rebuild estimate; do not
        guess.
      </P>

      <H3 id="two">2. Public liability</H3>

      <P>
        Covers you if someone is injured on your property (a
        contractor falls off a ladder, a guest is scalded by
        a faulty geyser, a child is injured in the compound).
        Kenya is not a litigation-heavy market by US
        standards, but injury claims against landlords have
        risen materially since 2020. Standard sums insured
        of KES 5 to 20 million are typical. Add this to your
        buildings policy for a few thousand shillings a year;
        it is very cheap for the exposure it covers.
      </P>

      <H3 id="three">3. Loss of rent</H3>

      <P>
        Covers the rental income you lose if the property
        becomes uninhabitable due to an insured event (usually
        fire or flood). Typically covers 12 to 24 months of
        rent. Cheap, useful, and often overlooked because
        the broker does not push it. If your property is your
        income, add it.
      </P>

      <H3 id="four">4. Contents (only sometimes)</H3>

      <P>
        Covers furniture, appliances, fittings owned by you.
        Only relevant if you let furnished. For unfurnished
        long lets, contents insurance is the tenant&apos;s
        responsibility, and pushing it into your policy is
        just adding premium for no benefit. For furnished
        short-lets and serviced apartments, contents cover is
        essential and should be at replacement value.
      </P>

      <H2 id="what-not-to-insure">What is usually not worth insuring</H2>

      <UL>
        <LI>
          <strong>Landlord legal expenses / eviction cover.</strong>
          Nairobi tenant disputes rarely justify the annual
          premium; when they do, you want a real advocate,
          not an insurance-panel one.
        </LI>
        <LI>
          <strong>Emergency callout / boiler-and-plumbing bundles.</strong>
          These are consumer-market products designed for UK
          semi-detached houses. In Nairobi the marginal cost
          of a plumber is small and the callout cover you pay
          for annually exceeds what you would ever call.
        </LI>
        <LI>
          <strong>Rent guarantee.</strong> A different product
          from loss-of-rent, sold as &quot;we guarantee your
          rent if the tenant defaults&quot;. Read the fine
          print: excess periods are long, exclusions are
          extensive, and premiums are usually 3 to 5 percent
          of gross rent, which is a bad trade against good
          tenant screening.
        </LI>
        <LI>
          <strong>Domestic staff cover as an add-on.</strong>
          If you employ a caretaker or gardener directly,
          WIBA (Work Injury Benefits Act) cover is legally
          required and separately quoted; if they are on your
          manager&apos;s payroll, it is their responsibility.
          The blended add-ons offered by property insurers are
          usually mispriced.
        </LI>
      </UL>

      <H2 id="what-it-costs">What a fair premium looks like</H2>

      <P>
        Rough annual premium bands we see for well-shopped
        Nairobi residential policies in 2026, on a
        buildings-plus-liability-plus-loss-of-rent structure:
      </P>

      <UL>
        <LI>
          2-bed apartment, KES 8m rebuild: KES 12,000 to 20,000
          per year.
        </LI>
        <LI>
          3-bed apartment, KES 12m rebuild: KES 18,000 to
          28,000 per year.
        </LI>
        <LI>
          4-bed villa, KES 30m rebuild: KES 45,000 to 75,000
          per year.
        </LI>
        <LI>
          5-bed villa in a gated compound, KES 60m rebuild:
          KES 90,000 to 150,000 per year.
        </LI>
      </UL>

      <P>
        If your current premium is more than 30 percent above
        these ranges, you are overpaying. If it is more than
        30 percent below, check what is excluded — either you
        have a great deal or you are only nominally insured.
        Either way, worth asking your broker to open the
        policy schedule with you.
      </P>

      <H2 id="claims">The four claims that actually happen</H2>

      <P>
        In fifteen years of processing claims on behalf of
        owner clients, the vast majority fall into one of
        four scenarios. Design your policy around these, not
        around the theoretical exotic risks.
      </P>

      <H3 id="claim-one">Water damage from an upstairs unit</H3>

      <P>
        By a distance the most common apartment claim. An
        upstairs neighbour&apos;s washing machine hose bursts,
        a bathroom silicone seal fails, a rooftop water tank
        overflows. Your ceiling comes down. Standard
        buildings cover picks this up; the practical
        headache is coordinating with the upstairs owner&apos;s
        insurer and the building management. This is where
        having a manager on the ground pays for itself in one
        claim.
      </P>

      <H3 id="claim-two">Fire from an electrical fault</H3>

      <P>
        Second most common. Old wiring, cheap
        after-market fittings, overloaded sockets. Damages
        range from a scorched kitchen wall to total loss.
        Buildings cover handles it; make sure the sum insured
        actually reflects current rebuild costs, which have
        drifted upward with construction inflation.
      </P>

      <H3 id="claim-three">Burglary during a tenant gap</H3>

      <P>
        Vacant Nairobi properties get targeted quickly. If
        the property is empty for more than 30 to 60 days
        (varies by insurer), most policies exclude burglary
        cover unless you have declared the vacancy in
        advance. Practical rule: if you are between tenants,
        tell your insurer. Do not assume.
      </P>

      <H3 id="claim-four">Storm and flood damage</H3>

      <P>
        Nairobi&apos;s long rains have been more intense
        the past three seasons. Karen, Runda, Lang&apos;ata
        and the wider Ngong Road catchment have seen surface
        flooding claims rise. Check that your policy&apos;s
        flood definition includes surface water, not just
        river flooding. Many older policies do not.
      </P>

      <H2 id="insurer-honesty">Which insurers actually pay</H2>

      <P>
        Based on years of running claims on behalf of owner
        clients, here is the honest ranking on
        pay-without-a-fight, in three tiers. This is not a
        sponsored ranking and it is not a legal opinion. It
        is one operator&apos;s experience.
      </P>

      <UL>
        <LI>
          <strong>Pay reliably:</strong> Jubilee, ICEA Lion,
          APA on straightforward buildings claims. Loss
          adjuster attends, settlement typically inside eight
          weeks of full documentation.
        </LI>
        <LI>
          <strong>Pay but grind:</strong> Britam, CIC, AAR.
          Claims are ultimately honoured but the process is
          slower, more documentation is requested, and
          negotiation on settlement value is normal. Budget
          twelve to sixteen weeks.
        </LI>
        <LI>
          <strong>Case by case:</strong> A handful of smaller
          insurers we now steer clients away from. Not naming
          because it becomes a defamation risk, but happy to
          share directly on request.
        </LI>
      </UL>

      <P>
        Above all: your broker matters as much as your
        insurer. A good independent broker with real
        relationships makes claims settle faster. A tied
        agent from one carrier is often not on your side when
        it counts.
      </P>

      <H2 id="checklist">Six-item checklist</H2>

      <OL>
        <LI>
          Get a rebuild valuation from a quantity surveyor
          (not the property market value).
        </LI>
        <LI>
          Insure to that rebuild value, not to purchase price.
        </LI>
        <LI>
          Add public liability (KES 10m plus is typical).
        </LI>
        <LI>
          Add loss of rent if the property is your income.
        </LI>
        <LI>
          Declare any vacancy over 30 days in writing to your
          insurer.
        </LI>
        <LI>
          Review annually. Rebuild costs and rental values
          both move; the policy schedule should too.
        </LI>
      </OL>

      <H2 id="closing">Closing</H2>

      <P>
        Insurance is one of those areas where the boring,
        by-the-numbers approach beats every clever workaround.
        Get the rebuild right, cover the four scenarios that
        actually happen, and pick an insurer that pays. That
        is it.
      </P>

      <P>
        We manage insurance renewals for owner clients as
        part of the standard service (independent broker, no
        commission clawback to us). If you would like us to
        review your existing policy against these guidelines,{" "}
        <Link
          href="/list-your-property"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          get in touch here
        </Link>
        . Related reading:{" "}
        <Link
          href="/insights/maintenance-handbook-diaspora-landlords"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the diaspora maintenance handbook
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/insurance-kenya-rental-property-diaspora-landlords"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the earlier insurance primer
        </Link>
        .
      </P>
    </>
  );
}

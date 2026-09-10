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
  slug: "property-management-nairobi-what-you-actually-get-2026",
  title: "Property management in Nairobi: what you actually get for the fee",
  description:
    "A plain account of what Nairobi property management companies do, what they charge in 2026, what is usually excluded, and the questions that separate a real manager from a rent collector with a WhatsApp number.",
  metaDescription:
    "What Nairobi property managers actually do, what they charge in 2026, what is excluded, and the questions that separate a manager from a rent collector.",
  publishedAt: "2026-07-27",
  readingMinutes: 10,
  author: authors.editors,
  tags: [
    "Property Management",
    "Nairobi",
    "Kenya",
    "Landlord",
    "Diaspora",
    "Fees",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt: "Property management Nairobi what you get for the fee 2026",
};

export default function Article() {
  return (
    <>
      <Lede>
        Most Nairobi landlords who are unhappy with their property manager are
        not being cheated. They are paying for one thing and expecting another,
        because nobody ever wrote down what the fee actually covers. Here is
        what a competent Nairobi manager does in 2026, what it costs, what sits
        outside the fee, and how to tell the difference before you sign.
      </Lede>

      <H2 id="two-jobs">There are two different jobs called the same thing</H2>

      <P>
        Almost every disappointment in this market comes from confusing these
        two. They are priced differently, staffed differently and suited to
        different owners.
      </P>

      <H3>Rent collection</H3>

      <P>
        Someone banks the rent, chases it when it is late, and calls you when
        something breaks. Cheap, and appropriate if you live in Nairobi, know
        your tenant, and can drive over yourself.
      </P>

      <H3>Full management</H3>

      <P>
        Someone is accountable for the asset performing: pricing it, letting it,
        vetting who moves in, maintaining it before things fail, handling
        arrears, and reporting in a way you can audit. This is what most
        diaspora owners think they are buying and frequently are not.
      </P>

      <Pullquote>
        If the only time you hear from your manager is when money arrives or
        something has already broken, you are paying management rates for rent
        collection.
      </Pullquote>

      <H2 id="scope">What full management should include</H2>

      <UL>
        <LI>
          <strong>Pricing.</strong> An evidenced view of what the unit should
          let for, revisited at each renewal rather than rolled forward
        </LI>
        <LI>
          <strong>Marketing and letting.</strong> Photographs, listing,
          viewings, and a tenant in place without a three month void
        </LI>
        <LI>
          <strong>Tenant vetting.</strong> Identity, income or employment, and
          previous landlord references. Actually checked, not collected
        </LI>
        <LI>
          <strong>Lease and onboarding.</strong> A tenancy that reflects Kenyan
          law, a deposit handled properly, and an inventory with photographs
        </LI>
        <LI>
          <strong>Rent collection and arrears.</strong> Not just banking it, but
          a defined escalation when it stops arriving
        </LI>
        <LI>
          <strong>Maintenance.</strong> Vendor coordination, supervision,
          receipts, and small things fixed before they become large things
        </LI>
        <LI>
          <strong>Reporting.</strong> A monthly statement showing gross rent,
          each expense, the fee and your net, with receipts available
        </LI>
        <LI>
          <strong>Compliance.</strong> Land rates, service charge and statutory
          deductions tracked rather than discovered
        </LI>
      </UL>

      <H2 id="cost">What it costs in 2026</H2>

      <P>
        The Nairobi market has settled into a fairly narrow band, and the
        outliers in both directions are worth understanding.
      </P>

      <UL>
        <LI>
          Long term residential management sits around 8 to 12 percent of
          collected rent for most managers, with 10 percent the common midpoint
        </LI>
        <LI>
          Tenant finding is typically charged separately as a one off, commonly
          around one month of rent
        </LI>
        <LI>
          Short let and serviced management is materially higher, usually 15 to
          25 percent, because the operational load is a different order of
          magnitude
        </LI>
        <LI>
          Anyone quoting 4 or 5 percent for full management is selling rent
          collection, or intends to make the margin somewhere you cannot see
        </LI>
      </UL>

      <Callout title="On percentage of collected rent">
        Insist the fee is charged on rent actually collected, not on rent
        invoiced. It sounds like a technicality. It is the difference between a
        manager whose incentive is to keep the unit occupied and paying, and one
        who is indifferent to arrears because the fee accrues anyway.
      </Callout>

      <P>
        Our fuller breakdown is in{" "}
        <Link
          href="/insights/cost-of-property-management-kenya-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the cost of property management in Kenya
        </Link>
        .
      </P>

      <H2 id="excluded">What is normally outside the fee</H2>

      <P>
        Reasonably so, in most cases. The problem is when it is not said out
        loud until the invoice arrives.
      </P>

      <UL>
        <LI>
          Capital works, refurbishment and major replacement. A new roof is not
          maintenance
        </LI>
        <LI>
          Legal proceedings, eviction and debt collection. Standard notices
          normally sit inside the fee, court does not
        </LI>
        <LI>Furnishing and interior work, and project managing contractors</LI>
        <LI>
          Insurance broking, valuation, tax filing and licensing applications
        </LI>
        <LI>
          Third party costs themselves. The manager coordinates the plumber, you
          pay the plumber
        </LI>
      </UL>

      <P>
        The fair test is whether the exclusion is written down before you sign.
        An exclusion in the agreement is a scope decision. The same exclusion
        first mentioned in month four is a surprise, and surprises are what end
        these relationships.
      </P>

      <H2 id="questions">The questions that actually separate managers</H2>

      <P>
        Everyone answers yes to “do you vet tenants” and “do you send
        statements”. These are harder to fake, and the answers vary by the
        kind of firm you are asking. See{" "}
        <Link
          href="/property-management-companies-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          property management companies in Nairobi
        </Link>{" "}
        for how the types differ before you ask them.
      </P>

      <OL>
        <LI>
          Show me a real monthly statement, with the owner details removed. If
          there is not a standard one, there is not standard reporting
        </LI>
        <LI>
          What is your expense threshold before you need my approval, and what
          is the threshold for a receipt? A manager without numbers here has no
          controls
        </LI>
        <LI>
          How many properties does one person manage? Past a certain point,
          attention is arithmetic
        </LI>
        <LI>
          What happens in month one of arrears, and in month three? Listen for a
          process, not reassurance
        </LI>
        <LI>
          How do I get paid, in what currency, and on which day of the month? A
          vague answer here is a real risk for diaspora owners
        </LI>
        <LI>
          What is your notice period and what happens to my deposit, my tenant
          relationship and my records if I leave? The answer tells you how they
          think about the relationship
        </LI>
        <LI>
          Who inspects the property, how often, and do I get photographs?
        </LI>
      </OL>

      <P>
        If you already have a manager and are unsure whether the frustration is
        fair, work through{" "}
        <Link
          href="/insights/should-i-fire-my-nairobi-property-manager-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          should I fire my Nairobi property manager
        </Link>
        .
      </P>

      <H2 id="diaspora">Why this matters more from abroad</H2>

      <P>
        A resident landlord with a bad manager loses money slowly and notices. A
        diaspora landlord with a bad manager can lose a year. The failure modes
        are specific:
      </P>

      <UL>
        <LI>
          Rent collected and not remitted, discovered late because there is no
          statement to compare against
        </LI>
        <LI>
          A tenant in place with no vetting and no written lease, which only
          surfaces when you need to remove them
        </LI>
        <LI>
          Deferred maintenance presented as prudence, until the deferred item
          becomes a capital cost
        </LI>
        <LI>
          Land rates and service charge unpaid, accruing penalties in your name
        </LI>
      </UL>

      <P>
        The defence is boring and effective: a written agreement, a monthly
        statement you actually read, and payouts on a fixed date to an account
        you control. See{" "}
        <Link
          href="/insights/how-diaspora-landlords-get-paid-usd-from-kenyan-rent"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how diaspora landlords get paid in USD
        </Link>
        .
      </P>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        We charge 10 percent of collected rent for long term management, and
        nothing on rent we have not collected or on months the unit stands
        empty. Tenant finding is a separate one off. Every owner gets a live
        dashboard and a monthly statement showing collections, expenses, fees
        and the payout, settled on the 5th.
      </P>

      <P>
        Expenses over USD 50 come with a receipt and anything above USD 250 is
        pre approved by you in writing. You can leave on 30 days notice with no
        exit fee, and your deposit, tenant relationship and records come with
        you. We put that in writing because it is the part most owners have been
        burned on.
      </P>

      <P>
        If you would rather not run any of this from six time zones away, it is what our{" "}
        <Link
          href="/long-term-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          long-term property management in Nairobi
        </Link>{" "}
        is for.
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/tenant-screening-nairobi-how-we-do-it"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          tenant screening in Nairobi
        </Link>
        ,{" "}
        <Link
          href="/insights/maintenance-handbook-diaspora-landlords"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the maintenance handbook for diaspora landlords
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/why-your-nairobi-rental-keeps-going-vacant"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          why your Nairobi rental keeps going vacant
        </Link>
        . On the paperwork side, see{" "}
        <Link
          href="/insights/property-management-agreement-kenya-clause-by-clause"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the management agreement clause by clause
        </Link>
        .
      </P>
    </>
  );
}

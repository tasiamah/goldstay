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
  slug: "why-property-management-matters-diaspora-landlords",
  title:
    "Why property management matters when you live 6,000 miles from your apartment",
  description:
    "We have taken over enough self-managed diaspora properties to spot the same five failure modes every time. A frank look at what real management does, when self-management is genuinely fine, and the five questions to ask any manager before you sign.",
  publishedAt: "2025-07-08",
  readingMinutes: 10,
  author: authors.poonam,
  tags: ["Management", "Diaspora", "Operations", "Tenants", "USD remittance"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Nairobi residential building exterior, the case for professional property management for diaspora landlords",
};

export default function Article() {
  return (
    <>
      <Lede>
        Most diaspora landlords do not start with a property manager.
        They start with a cousin, a school friend, a former neighbour
        or the broker who sold them the apartment. It works for a
        while, sometimes for years. Then something breaks, and the
        landlord discovers from 6,000 miles away that nobody was
        actually managing anything. We have taken over enough of
        these properties to recognise the failure pattern from the
        first WhatsApp message. Here is what we see, and what real
        management does differently.
      </Lede>

      <H2 id="the-trust-tax">The hidden cost of “trusting your cousin”</H2>

      <P>
        Hiring family or a friend feels free. It is not. The cost
        shows up later, in five quiet places. None of them are about
        the friend being dishonest. Most of the time the friend is
        well-meaning, untrained, and quietly overwhelmed.
      </P>

      <H3 id="failure-one">1. Rent collection drift</H3>

      <P>
        The tenant is “a friend of a friend”. Rent is
        always paid. Until it is not. The friend managing the
        property doesn’t want the awkwardness of chasing on day
        five, so it slides to day fifteen, then day thirty. When the
        landlord finally hears about it, three months are owed and
        the tenant is preparing a sob story instead of a payment.
        The original problem, one missed rent, is manageable. The compounded problem of three months arrears
        and a tenant who has now figured out that nobody is going to
        evict them is the thing that takes a year to unwind in court.
      </P>

      <H3 id="failure-two">2. No maintenance budget, no maintenance</H3>

      <P>
        Without a held float, every repair becomes a question:
        “Can you wire 18,000 shillings for the geyser?”
        The diaspora landlord, working in another timezone, does not
        respond for four hours. The tenant takes a cold shower for
        the second day. The friend doesn’t want to keep
        nagging. The geyser does not get fixed. The tenant does not
        renew. The unit goes vacant. Lost rent for two months is
        many multiples of the geyser bill, but the friction of
        approving small expenses one at a time makes the original
        bill harder to authorise than the eventual loss.
      </P>

      <H3 id="failure-three">3. No statements, ever</H3>

      <P>
        At year-end the landlord asks for a summary. The friend
        sends a series of WhatsApp messages with running totals
        that nobody can audit. There is no record of which months
        had which expenses, no receipts, no reconciliation. If KRA
        ever asks, there is nothing to show. If the landlord ever
        wants to sell, there is no operating history to present to
        a buyer. The property has been earning income for five
        years and has zero financial paper trail.
      </P>

      <H3 id="failure-four">4. Tax compliance, or the absence of it</H3>

      <P>
        We covered this in detail in{" "}
        <Link
          href="/insights/kenya-mri-tax-diaspora-landlords"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the MRI tax piece
        </Link>
        . The short version: KRA expects 7.5% of gross rent every
        month, filed by the 20th, in the landlord’s name on
        their KRA PIN. Most informal arrangements never file at all.
        Penalties accrue silently in the background and surface, with
        interest, the day the landlord tries to sell or transfer
        title.
      </P>

      <H3 id="failure-five">5. Tenant turnover and the listing void</H3>

      <P>
        The bigger and quieter cost. When a long-term tenant gives
        notice, an informally-managed property typically sits vacant
        for three to five months. There is no listing pipeline, no
        photographer on call, no relationships with corporate
        relocation agencies. By the time the unit is re-let, the
        landlord has lost more in vacant rent than a full year of
        professional management would have cost.
      </P>

      <Pullquote>
        Hiring family or a friend feels free. It is not. The cost
        shows up later, in five quiet places.
      </Pullquote>

      <H2 id="what-real-management-does">What real management does differently</H2>

      <P>
        Property management as a category is not magic. It is the
        boring discipline of doing five things on a fixed cadence,
        every month, for every property, regardless of whether
        anything is wrong:
      </P>

      <OL>
        <LI>
          <strong>Rent collection on a calendar, not a relationship.</strong>{" "}
          Day one is reminder. Day three is escalation. Day five is
          legal notice. The tenant knows this from week one of the
          lease and so does the landlord.
        </LI>
        <LI>
          <strong>A held float for maintenance.</strong> Anything
          under USD 50 is fixed without disturbing the landlord.
          Anything from 50 to 250 lands on the next statement with a
          photo receipt. Anything over 250 is pre-approved in
          writing. The geyser is fixed before the tenant has to
          mention it twice.
        </LI>
        <LI>
          <strong>A real monthly statement.</strong> Every shilling
          collected, every cedi spent, every receipt attached, every
          tax filing referenced. PDF in your inbox by the 5th. The
          same shape every month so you can read it in 90 seconds.
        </LI>
        <LI>
          <strong>Tax handled at source.</strong> 7.5% MRI in Kenya
          or 8% withholding in Ghana withheld from collection,
          remitted to KRA or GRA the same week, e-slip on the
          statement. No separate ask, no surprise.
        </LI>
        <LI>
          <strong>Listings ready before notice is given.</strong>
          Photography, listing copy, comparable pricing and tenant
          pipeline are kept warm so the day a tenant gives notice,
          the unit goes live within 72 hours and re-lets in a
          fraction of the void a cold start incurs.
        </LI>
      </OL>

      <Callout title="The economics nobody calculates">
        Diaspora landlords almost always think about management fees
        as a cost. The right frame is what the fee buys back. A 10%
        fee on a Nairobi long-let typically saves the landlord one to
        two months of vacant rent per turnover, prevents one to
        three small tax penalties a year, and avoids one large
        repair-vs-replace decision that would cost 15 to 30% of
        annual rent. On honest accounting, a competent manager pays
        for themselves in year one and is net-positive every year
        after.
      </Callout>

      <H2 id="when-self-managing-is-fine">
        When self-management is actually fine
      </H2>

      <P>
        We do not believe every diaspora landlord needs a manager. A
        few situations where self-management is genuinely the right
        call:
      </P>

      <UL>
        <LI>
          You are in the same timezone as the property and visit
          monthly. Most of the failure modes above are about
          distance, not principle.
        </LI>
        <LI>
          You have one stable, long-term tenant on a multi-year
          lease, paying reliably, and the property is in a building
          with strong management committee. Maintenance and tax are
          the only meaningful work, and you are willing to file
          MRI yourself.
        </LI>
        <LI>
          You enjoy the work. Some landlords genuinely do, and a
          well-run self-managed portfolio is a real thing. We have
          friends who run theirs better than we do.
        </LI>
      </UL>

      <P>
        Outside those three cases, the question is not whether to
        hire a manager but which one.
      </P>

      <H2 id="five-questions">
        Five questions to ask any manager before signing
      </H2>

      <P>
        We would ask these of ourselves before signing too. If a
        manager cannot answer all five with specifics, keep
        looking.
      </P>

      <H3 id="question-one">1. Show me a real monthly statement.</H3>

      <P>
        Anonymise the landlord and the address, but show me the
        actual format. If the answer is “we do them on
        request” or “we send a WhatsApp summary”,
        you do not have a managed property. You have a paid
        intermediary.
      </P>

      <H3 id="question-two">
        2. How do you handle MRI / withholding tax?
      </H3>

      <P>
        The right answer is specific. “We file in your name on
        your KRA PIN by the 20th of each month, withhold 7.5% from
        collection, attach the e-slip to the statement.” In
        Ghana: “We deduct 8% at source, remit to GRA by the
        15th, attach the GRA acknowledgement to the statement.”
        Anything vaguer is a future penalty waiting to surface.
      </P>

      <H3 id="question-three">3. What is your maintenance authority threshold?</H3>

      <P>
        How much can your team spend on a repair without asking me
        first? The answer should be a real number that exists in
        the contract. Zero is a red flag (you will be approving
        every light bulb at 3 AM your time). No cap is a different
        red flag (the manager is spending your money without
        accountability). The honest range for a residential unit is
        roughly USD 50 for routine, USD 50 to 250 for itemised,
        anything above with prior written approval.
      </P>

      <H3 id="question-four">
        4. How do you remit funds to my foreign account?
      </H3>

      <P>
        Currency, frequency, FX rate basis, and disclosed spread.
        “We collect in KES and wire USD on the 5th at
        wholesale interbank rate with the spread on the
        statement” is a complete answer. “We’ll
        figure that out when the time comes” means the
        landlord will be paying retail FX and unflagged spreads
        for years.
      </P>

      <H3 id="question-five">
        5. What happens to my property if you close?
      </H3>

      <P>
        A serious manager has a serious answer. Tenant
        relationships are yours, not the manager’s. Bank
        details are on your accounts, not theirs. Lease, statements,
        vendor list and keys are deliverable on 14 days’
        notice. There is no lock-in, no clawback, no “our
        tenants” framing. If the manager treats your tenant
        relationships as their asset, you are not a client. You are
        a supplier.
      </P>

      <Pullquote>
        Tenant relationships are yours, not the manager’s. If
        a manager treats your tenants as their asset, you are not a
        client. You are a supplier.
      </Pullquote>

      <H2 id="how-goldstay-fits">Where Goldstay fits</H2>

      <P>
        We are biased about this, obviously. We built Goldstay
        specifically because there was no company a diaspora friend
        could send another diaspora friend to, with a straight face,
        for residential property in Nairobi or Accra. We are not the
        cheapest. We are intentionally boring: we file the tax,
        send the statement, wire USD on the 5th, and tell the truth
        when something goes wrong. Our fees are flat and disclosed:
        10% of rent collected for long-term, 20% of revenue for
        Airbnb, one month’s rent for tenant-finding only. No
        setup fees, no hidden deductions.
      </P>

      <P>
        If your property is currently self-managed and you want a
        diagnostic of what is actually happening, tax filing
        history, statement quality, tenant lease enforceability,
        send us the address on{" "}
        <Link
          href="/list-your-property"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          this form
        </Link>{" "}
        or on WhatsApp. The diagnostic is free, the report is
        yours regardless of whether you switch managers, and we
        will say so plainly if your current arrangement is fine.
      </P>

      <P>
        And if you have not bought yet,{" "}
        <Link
          href="/property-sourcing"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          our buy-side service
        </Link>{" "}
        ensures the property arrives at completion already set up
        for clean management from day one. The earlier the
        management thinking starts, the cheaper everything that
        follows is.
      </P>
    </>
  );
}

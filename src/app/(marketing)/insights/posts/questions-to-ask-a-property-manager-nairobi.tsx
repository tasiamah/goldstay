import Link from "next/link";
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
import { authors, type PostMeta } from "./_shared";

export const meta: PostMeta = {
  slug: "questions-to-ask-a-property-manager-nairobi",
  title:
    "The questions to ask a property manager before you sign",
  description:
    "Most question lists are written for a market that is not this one. These are the twelve where Nairobi answers genuinely differ, what a good answer sounds like, and our own answers on the record so you can hold us to the same standard as everyone else.",
  metaTitle: "Questions to Ask a Property Manager Before You Sign",
  metaDescription:
    "Twelve questions to ask a property management company in Nairobi, what a good answer sounds like, and the answers we give on the record.",
  publishedAt: "2026-09-09",
  readingMinutes: 11,
  author: authors.editors,
  tags: [
    "Property Management",
    "Landlord",
    "Nairobi",
    "Choosing an Agent",
    "Diaspora",
    "Kenya",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt: "Interviewing a property management company in Nairobi",
};

export default function Article() {
  return (
    <>
      <Lede>
        There is no shortage of question lists for interviewing a property
        manager, and almost all of them were written for the American market,
        where licensing, trust accounting and eviction timelines are settled
        and the answers are largely predictable. In Nairobi the answers are not
        predictable, which is what makes asking worthwhile. These are the twelve
        questions where the answers actually diverge, and we have put ours next
        to them.
      </Lede>

      <P>
        A note on what this is not. If you already have a manager and are
        wondering whether to leave, the questions are different and they are
        in{" "}
        <Link
          href="/insights/should-i-fire-my-nairobi-property-manager-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          should I fire my Nairobi property manager
        </Link>
        . This piece is for interviewing someone you have not appointed yet.
      </P>

      <H2 id="money">On money</H2>

      <H3 id="q1">1. Is your fee charged on rent collected or rent due?</H3>

      <P>
        The most useful question on the list, and the one most likely to
        produce a pause. A fee on rent due is payable whether or not the tenant
        paid, which means a month where you receive nothing still costs you.
        It also removes the manager&rsquo;s financial reason to chase arrears.
        A fee on rent collected means they do not get paid until you do.
      </P>

      <P>
        <strong>What good sounds like:</strong> &quot;Collected.&quot; One
        word, no qualification.
      </P>

      <H3 id="q2">2. What else is charged, over a full year?</H3>

      <P>
        Ask for the total, not the percentage. The four additions that turn a
        low headline into a high cost are a setup or onboarding fee, a markup
        on maintenance, a letting fee charged again when the sitting tenant
        renews, and a fee to leave. A 10 percent quote carrying all four is
        more expensive than a 13 percent quote carrying none.
      </P>

      <P>
        <strong>What good sounds like:</strong> a specific answer to each of
        the four, and a willingness to put the answer in the agreement.
      </P>

      <H3 id="q3">
        3. Where does my rent sit between the tenant paying and me receiving?
      </H3>

      <P>
        The clause that decides what happens if the firm fails while holding
        two months of your money. Rent held in a designated client account,
        separate from the company&rsquo;s trading account, is identifiably
        yours. Rent paid into the operating account is a debt owed by a company
        that may not have it.
      </P>

      <H3 id="q4">4. When am I paid, and what happens if you are late?</H3>

      <P>
        Every manager has a date. Far fewer have a consequence. The presence of
        an agreed consequence is the difference between a term and an
        intention, and it is the cheapest possible test of whether the firm
        expects to be held to anything.
      </P>

      <Pullquote>
        Ask what happens when they get it wrong. Every firm can describe what
        happens when things go right.
      </Pullquote>

      <H2 id="compliance">On tax, and on getting out</H2>

      <H3 id="q5">5. Who calculates and files the MRI, and do I get the receipt?</H3>

      <P>
        Kenyan residential rental income attracts Monthly Rental Income tax at
        7.5 percent. Somebody has to withhold it and file it, and if that
        somebody is nominally you while the manager holds the money, you are
        carrying a KRA obligation on funds you never touched. The receipt
        reference is the part to insist on: withholding it and filing it are
        different acts, and only one of them leaves a trace.
      </P>

      <H3 id="q6">
        6. What is the notice period, and is anything payable if I leave?
      </H3>

      <P>
        Ask before you sign, not when you want out. You are looking for notice
        that runs both ways, no minimum term you have to serve before you may
        give notice at all, and nothing payable on exit. A firm with an exit
        fee has a financial interest in making leaving unpleasant, and you will
        only discover how much of one at the worst possible moment.
      </P>

      <P>
        <strong>What good sounds like:</strong> a short, mutual notice period
        and a flat no to the exit fee. What that process looks like in practice
        is in{" "}
        <Link
          href="/insights/terminate-property-management-agreement-kenya"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how to terminate a management agreement
        </Link>
        .
      </P>

      <H2 id="operations">On how the work actually gets done</H2>

      <H3 id="q7">7. How much can you spend on a repair without asking me?</H3>

      <P>
        There should be a number, in shillings, per incident. Without one you
        are choosing between a manager who cannot act on a burst pipe until you
        wake up, and one who has replaced the water heater and sent the
        invoice. Both are bad, and the second is expensive.
      </P>

      <H3 id="q8">8. Who physically visits the property, and how often?</H3>

      <P>
        Ask for a name and a frequency, then ask what the last visit found.
        This is where remote landlords are most often quietly failed: the rent
        arrives, the statements arrive, and nobody has been inside the flat for
        a year. A manager who inspects quarterly and writes it up can tell you
        what condition your asset is in. One who does not is administering a
        payment, not managing a property.
      </P>

      <H3 id="q9">9. What is your response time, and what if you miss it?</H3>

      <P>
        Again, the consequence is the substance. A published response time with
        nothing attached is a marketing claim.
      </P>

      <H3 id="q10">10. How many properties does one manager carry?</H3>

      <P>
        Rarely asked and highly predictive. There is no correct number, but
        there is a number beyond which the inspection in question eight cannot
        physically happen, and a firm that has never counted is telling you
        that nobody is accountable for a specific list of homes.
      </P>

      <H2 id="tenants">On tenants</H2>

      <H3 id="q11">11. Walk me through how you vetted your last tenant.</H3>

      <P>
        Phrased as a specific past event rather than a policy, because policies
        are easy and recall is not. You are listening for employer
        verification, bank statements or pay slips actually seen, a previous
        landlord actually telephoned, and identity documents checked against
        the person who turned up. &quot;We are very thorough&quot; is not an
        answer to this question.
      </P>

      <H3 id="q12">12. What happens if the tenant you place defaults?</H3>

      <P>
        The honest range runs from &quot;we will help you pursue it&quot;
        through to replacing the tenant at the manager&rsquo;s own cost. What
        matters is that the answer is specific and in the agreement, because
        default is the scenario where a landlord abroad is least able to act
        and most dependent on someone else caring.
      </P>

      <Callout title="One question to close on">
        Ask to speak to two landlords they currently act for, and ask for one
        whose tenancy went wrong. Any firm can supply a happy client. A firm
        that can hand you someone whose tenant defaulted, and who still speaks
        well of how it was handled, is telling you something a testimonial
        cannot.
      </Callout>

      <H2 id="our-answers">Our answers, on the record</H2>

      <P>
        Publishing these is the point of the article. If we are going to
        suggest you interrogate a manager, it would be poor form to leave our
        own answers to a sales call.
      </P>

      <UL>
        <LI>
          <strong>Fee basis.</strong> Collected. 10 percent of collected rent
          for long-term management, 20 percent of revenue for Airbnb and
          short-stay, one month&rsquo;s rent one-off if you only want a tenant
          found.
        </LI>
        <LI>
          <strong>Everything else.</strong> No setup fee, no commission taken
          from contractors, no letting fee at renewal, nothing payable to
          leave. All four, in writing.
        </LI>
        <LI>
          <strong>Payout.</strong> Net rent clears to your overseas account on
          the fifth, and we cover the delay charges if a bank holiday pushes
          the wire.
        </LI>
        <LI>
          <strong>Response time.</strong> 48 hours on any request. Miss it and
          we waive that property&rsquo;s management fee for that month.
        </LI>
        <LI>
          <strong>Tax.</strong> The 7.5 percent MRI is calculated, withheld and
          remitted to KRA by the twentieth, with the receipt reference on your
          statement.
        </LI>
        <LI>
          <strong>Default.</strong> A long-term tenant we placed who defaults
          inside six months is replaced at our cost.
        </LI>
      </UL>

      <P>
        On the headline percentage we are unremarkable and would rather say so:
        Nairobi long-term management generally runs 8 to 15 percent and
        short-stay 15 to 25 percent, and we sit inside both bands. The full
        breakdown is on{" "}
        <Link
          href="/pricing"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the pricing page
        </Link>
        , and what management actually covers is in{" "}
        <Link
          href="/insights/property-management-nairobi-what-you-actually-get-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          what you actually get
        </Link>
        .
      </P>

      <Callout title="Ask us these, in writing">
        Send the twelve questions to us and to whoever else you are
        considering, and compare the replies side by side. We would rather be
        chosen on a written comparison than on a phone call, and if someone
        else answers them better on the things that matter to your property, you
        should appoint them.
      </Callout>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/property-management-agreement-kenya-clause-by-clause"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the agreement clause by clause
        </Link>
        {", "}
        <Link
          href="/insights/do-i-need-a-property-manager-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          whether you need a manager at all
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/cost-of-property-management-kenya-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          what management costs in Kenya
        </Link>
        . If you have not assembled a shortlist yet, start with{" "}
        <Link
          href="/insights/how-to-find-a-property-manager-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how to find a property manager in Nairobi
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/top-property-management-companies-kenya"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how to read the top ten lists
        </Link>
        .
      </P>
    </>
  );
}

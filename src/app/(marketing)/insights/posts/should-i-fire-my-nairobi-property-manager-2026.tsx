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
  slug: "should-i-fire-my-nairobi-property-manager-2026",
  title:
    "Should I fire my Nairobi property manager? A calm checklist",
  description:
    "Ten questions to test whether the manager you have is worth keeping, and the quiet way to switch without breaking your tenants, your cashflow, or your reputation with your building.",
  publishedAt: "2026-07-25",
  readingMinutes: 8,
  author: authors.editors,
  tags: [
    "Nairobi",
    "Property management",
    "Owners",
    "Switching",
    "Diaspora",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Diaspora owner reviewing Nairobi property manager statements",
};

export default function Article() {
  return (
    <>
      <Lede>
        Half the enquiries we take these days are from owners
        who already have a property manager, and are not sure
        whether their frustration is fair. The market has
        matured; the bar for what a manager should be doing has
        risen; and a lot of managers who were fine in 2020 are
        visibly behind in 2026. Here is the calm, unromantic
        way to test whether the manager you have is worth
        keeping.
      </Lede>

      <H2 id="reframe">Reframe the question first</H2>

      <P>
        The right question is not &quot;is my manager bad&quot;
        (they usually are not comprehensively bad). It is
        &quot;is my manager still the best return on the fee I
        pay them&quot;. A manager who was good enough in a
        rising rental market is often not good enough in a
        market where tenants are more selective and yields are
        thinner. That is not a moral failing on the
        manager&apos;s part; it is a fit problem. Reframing
        this way keeps you from getting emotional about the
        decision, which is what most owners do wrong.
      </P>

      <Pullquote>
        The question is not whether your manager is bad. It is
        whether your manager is still the best return on the
        fee you pay them.
      </Pullquote>

      <H2 id="ten-questions">Ten questions, honestly</H2>

      <P>
        Score each one out of two. Zero if the answer is a
        clear no, one if partial or slow, two if a clear yes.
        Twenty is perfect. We will tell you the cut-off at the
        bottom.
      </P>

      <H3 id="q1">1. Do you receive a monthly statement without asking</H3>

      <P>
        Not on request, not &quot;by the end of the quarter&quot;.
        A PDF statement, in your inbox, within the first five
        business days of every month, showing gross rent
        collected, deductions itemised, and the amount paid to
        you with the FX rate used if applicable.
      </P>

      <H3 id="q2">2. Is the rent paid to you monthly, on a fixed date</H3>

      <P>
        Not &quot;when they get around to it&quot;. Not
        quarterly. A calendar date every month, honoured
        consistently, ideally in your home currency at
        wholesale rate. See our{" "}
        <Link
          href="/insights/how-diaspora-landlords-get-paid-usd-from-kenyan-rent"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          USD payout piece
        </Link>{" "}
        for what good looks like.
      </P>

      <H3 id="q3">3. Do you know exactly who your tenant is</H3>

      <P>
        Full legal name, ID or passport number, employer, next
        of kin. If your manager cannot produce this on
        one hour&apos;s notice, they do not have it. Which
        means if there is ever a dispute, you have nothing.
      </P>

      <H3 id="q4">4. Is MRI (7.5 percent rental income tax) being withheld and remitted for you</H3>

      <P>
        If you do not know the answer, the answer is almost
        certainly no. Unremitted MRI accrues penalties and
        interest at KRA rates that will eventually eat a year
        of net rent. Your manager should be handling this at
        source, showing it on the statement, and giving you the
        e-slip.
      </P>

      <H3 id="q5">5. When something breaks, do you get a photo and a quote before spending</H3>

      <P>
        Not an invoice after the fact. A photo of the problem,
        two contractor quotes, a recommendation, and your
        written approval before any money is spent above a
        pre-agreed threshold. Any manager still operating on
        &quot;we fixed it, please refund us&quot; is running
        1990s ops.
      </P>

      <H3 id="q6">6. Is your service charge, land rates, insurance visibly current</H3>

      <P>
        Your manager should hold digital copies of the last
        payment receipts and know the next due dates. If your
        service charge is in arrears and you find out via a
        letter from the SRA or a lock-out threat, you have
        already been failed.
      </P>

      <H3 id="q7">7. Can you get an update on your property in under one working day</H3>

      <P>
        A WhatsApp or email that gets a substantive reply, not
        &quot;I&apos;ll check and revert&quot; that then never
        reverts. Response time is the single strongest leading
        indicator of overall service quality across every
        management firm we benchmark.
      </P>

      <H3 id="q8">8. When was your property last physically inspected</H3>

      <P>
        A property that has not been walked by the manager in
        six months is a property whose condition is unknown.
        Inspection cadence should be at least quarterly, with
        photos and a short written note. Owners who go a year
        without an inspection often discover surprises the
        hard way.
      </P>

      <H3 id="q9">9. Do you have a rent review discussion at lease renewal</H3>

      <P>
        Not a rent increase pushed through unilaterally. A
        proper discussion two to three months before renewal,
        with comparable evidence for the current market, the
        current tenant&apos;s payment history and property
        care, and a recommended position. If your manager auto-
        renews at flat rent without ever benchmarking, you are
        losing 2 to 4 percent a year in unclaimed uplift.
      </P>

      <H3 id="q10">10. Would you recommend them to another diaspora owner without caveats</H3>

      <P>
        Without the &quot;they are okay but you have to chase
        them&quot; footnote. Without the &quot;fine for what I
        pay&quot; hedge. If you would need to caveat the
        recommendation, you already have your answer.
      </P>

      <Callout title="Scoring">
        <strong>17 to 20:</strong> Keep them. This is a good
        manager and switching would be a lateral move.
        <br />
        <strong>13 to 16:</strong> Have the honest conversation
        first. Most managers can lift their game if the owner
        asks explicitly for the missing items. Give them one
        lease cycle.
        <br />
        <strong>8 to 12:</strong> Switch. You are paying a
        market fee for below-market service and the
        opportunity cost is real.
        <br />
        <strong>0 to 7:</strong> Switch quickly. There is
        almost certainly hidden operational risk on your
        property that has not surfaced yet.
      </Callout>

      <H2 id="how-to-switch">How to switch without breaking anything</H2>

      <P>
        The reason owners hesitate to switch is not usually
        loyalty, it is fear of the transition. In practice, a
        clean switch is easier than owners expect, provided
        you do these five things in this order.
      </P>

      <OL>
        <LI>
          Line up the new manager first. Sign the new
          management agreement, agree the start date, and get
          their bank details in place before you notify the
          incumbent. Doing it the other way around leaves you
          in a gap.
        </LI>
        <LI>
          Give notice in writing (email is fine unless the
          agreement specifies otherwise). Most Nairobi
          management agreements have a thirty-day notice period.
          Diarise the last day and the first day of the new
          manager.
        </LI>
        <LI>
          Request a full handover pack from the outgoing
          manager. Tenant lease, tenant ID, deposit
          confirmation, last twelve months of statements, MRI
          receipts, service charge receipts, land rates
          receipts, insurance certificate, keys, contractor
          list. Set a two-week deadline. Almost every outgoing
          manager will be behind on at least one of these; the
          request is what forces the housekeeping.
        </LI>
        <LI>
          Notify the tenant in writing. Short, warm, no drama.
          &quot;From the first of next month, please make rent
          payments to the account below. New manager contact
          is Poonam at Goldstay, WhatsApp +254...&quot;
          Tenants care about clarity, not company politics.
        </LI>
        <LI>
          Notify the building management company or SRA.
          Update the point of contact for service charge
          correspondence, security escalations, and building
          notices. This is the step most owners skip and it
          causes the most friction down the line.
        </LI>
      </OL>

      <H2 id="what-you-will-hear">What the incumbent will say</H2>

      <P>
        In our experience, three predictable responses from
        the incumbent. It helps to see them coming.
      </P>

      <UL>
        <LI>
          <strong>&quot;We can improve.&quot;</strong> Sometimes true.
          Ask specifically which of the ten items above they
          are going to fix, and by when. If they cannot answer
          specifically, the offer to improve is not real.
        </LI>
        <LI>
          <strong>&quot;The tenant will be confused.&quot;</strong>
          Almost never true. Tenants adjust to a new bank
          account line in a WhatsApp message. What confuses
          tenants is inconsistent communication, which is
          usually what triggered the switch in the first place.
        </LI>
        <LI>
          <strong>&quot;There will be a big handover cost.&quot;</strong>
          There is not. A proper handover is documents plus
          keys. Anyone quoting you a handover fee is trying to
          disincentivise the switch.
        </LI>
      </UL>

      <H2 id="what-good-looks-like">What good looks like</H2>

      <P>
        Since we run a property management firm, we should say
        what our default looks like so you have a benchmark to
        compare against your incumbent, whether or not the
        answer ends up being us.
      </P>

      <UL>
        <LI>
          Monthly statement in your inbox by the 5th, with FX
          rate, MRI e-slip and receipts attached.
        </LI>
        <LI>
          USD or GBP payout on the 5th of every month at
          interbank rate.
        </LI>
        <LI>
          Full tenant KYC pack on file from day one, accessible
          via your Goldstay portal.
        </LI>
        <LI>
          Photo-and-quote workflow for any spend above KES
          10,000. Auto-approved below.
        </LI>
        <LI>
          Quarterly physical inspection with photos.
        </LI>
        <LI>
          Rent-review recommendation with comparables two
          months before every lease renewal.
        </LI>
        <LI>
          WhatsApp or email response within one working day,
          business hours Nairobi.
        </LI>
        <LI>
          A live portal at{" "}
          <Link
            href="/owner"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            goldstay.co.ke/owner
          </Link>{" "}
          where you can pull any of the above on your own at
          any hour.
        </LI>
      </UL>

      <H2 id="closing">Closing</H2>

      <P>
        The switching cost of a Nairobi property manager, done
        properly, is one weekend of email admin and one
        polite conversation with your tenant. The cost of not
        switching from a mediocre manager is roughly 1 to 3
        percent of gross rent per year, plus an unknown
        overhang of hidden operational and tax risk. If your
        score above is under thirteen, run the process this
        month.
      </P>

      <P>
        If you want us to be the alternative, the
        conversation starts{" "}
        <Link
          href="/list-your-property"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          here
        </Link>
        . If you would rather see what the owner portal looks
        like before deciding anything, take a look at{" "}
        <Link
          href="/diaspora-payouts"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          our payouts page
        </Link>
        .
      </P>
    </>
  );
}

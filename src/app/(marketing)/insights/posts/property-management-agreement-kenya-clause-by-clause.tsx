import Link from "next/link";
import { authors, type PostMeta } from "./_shared";
import {
  Callout,
  H2,
  LI,
  Lede,
  OL,
  P,
  Pullquote,
  UL,
} from "@/components/ArticleProse";

export const meta: PostMeta = {
  slug: "property-management-agreement-kenya-clause-by-clause",
  title:
    "The property management agreement in Kenya, clause by clause",
  description:
    "The contract between a landlord and a managing agent is the one document that decides what happens when something goes wrong, and most of them are two pages of service description with nothing enforceable in them. What each clause has to say, and the five that quietly cost you money.",
  metaTitle: "Property Management Agreement Kenya: Clause by Clause",
  metaDescription:
    "What a property management agreement between a landlord and agent in Kenya must contain, the five clauses that cost you money, and how to fix them.",
  publishedAt: "2026-09-09",
  readingMinutes: 11,
  author: authors.legal,
  tags: [
    "Property Management",
    "Legal",
    "Contracts",
    "Nairobi",
    "Landlord",
    "Kenya",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Signing a property management agreement with a Nairobi managing agent",
};

export default function Article() {
  return (
    <>
      <Lede>
        Almost every landlord we take on arrives with an agreement from their
        last agent, and almost none of them can answer the two questions that
        matter about it: how much can the agent spend without asking you, and
        how do you get out. The document is usually two pages, mostly a list of
        services, and the parts that would decide a dispute are simply absent.
        This is what those parts should say.
      </Lede>

      <H2 id="what-is-it">What is a property management agreement?</H2>

      <P>
        It is the contract appointing someone as your agent over a property:
        what they may do in your name, what they are paid for doing it, whose
        money is whose while it passes through their hands, and how the
        arrangement ends. In Kenya it has no prescribed form and no statutory
        template, which is why the quality varies so wildly. Two agents in the
        same Nairobi building will hand you documents with nothing in common
        beyond the parties.
      </P>

      <P>
        It is worth being clear about what it is not. It is not the lease. The
        lease is between you and your tenant and governs their occupation; the
        management agreement is between you and your agent and governs their
        authority. They are different documents with different parties, and an
        agent who conflates them, or who asks you to sign one document covering
        both, is telling you something about how the rest of it will go. If the
        tenancy side is what you actually need, that is covered separately in{" "}
        <Link
          href="/insights/tenancy-agreement-kenya-landlord-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the tenancy agreement guide
        </Link>
        .
      </P>

      <Pullquote>
        A management agreement that only describes services is not a contract.
        It is a brochure that both parties have signed.
      </Pullquote>

      <H2 id="the-clauses">The clauses, in order of how much they matter</H2>

      <P>
        Not in the order they usually appear. Agreements tend to lead with the
        service list, which is the least contentious part of the document and
        the part nobody ever argues about afterwards.
      </P>

      <OL>
        <LI>
          <strong>Spending authority.</strong> The single most important number
          in the document, and the one most often missing. What can the agent
          spend on a repair without your written approval? There should be a
          figure, per incident, in shillings. Without one you are choosing
          between an agent who cannot fix a burst pipe at 9pm because they are
          waiting for you to wake up in Dallas, and an agent who has replaced
          the entire water heater and sent you the invoice. A sensible clause
          sets a modest per-incident limit for genuine emergencies, a lower one
          for everything else, and requires quotes above it.
        </LI>
        <LI>
          <strong>Client money.</strong> Where does the rent sit between the
          tenant paying it and you receiving it, and whose name is on that
          account? This is the clause that decides what happens if the agent
          becomes insolvent while holding two months of your rent. Money held
          in a designated client account, separate from the agent&rsquo;s own
          trading account, is recoverable. Money paid into the agent&rsquo;s
          operating account is a debt owed to you by a company that may not
          have it. Ask, and get the answer in the document.
        </LI>
        <LI>
          <strong>The payout date, and what happens when it slips.</strong> A
          date alone is a hope. A date with a consequence attached is a term.
          &quot;Net rent is remitted by the fifth of the following month&quot;
          is worth having; the same sentence with an agreed consequence if it
          is late is worth considerably more, because it is the only version
          you could actually enforce without suing over a small sum.
        </LI>
        <LI>
          <strong>The fee, and what it is charged on.</strong> Ten percent of
          what? Rent collected, or rent due? The distinction decides who
          carries a defaulting tenant. An agent paid on rent due has been paid
          for a month in which you received nothing, and has no particular
          reason to chase. An agent paid on rent collected does not eat until
          you do. This is covered in more depth in{" "}
          <Link
            href="/insights/cost-of-property-management-kenya-2026"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            the piece on management costs
          </Link>
          , because the arithmetic deserves its own space.
        </LI>
        <LI>
          <strong>Termination.</strong> How long is the notice, does it run both
          ways, is there anything payable on exit, and is there a minimum term
          before you may give notice at all? Three months is common and
          tolerable. A twelve month lock-in on a service contract is not, and
          neither is a fee for leaving. The whole of{" "}
          <Link
            href="/insights/terminate-property-management-agreement-kenya"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            terminating a management agreement
          </Link>{" "}
          is worth reading before you sign one, not after.
        </LI>
        <LI>
          <strong>The deposit.</strong> Who holds the tenant&rsquo;s deposit,
          in what account, and how is it reconciled at the end of the tenancy?
          Deposits are the most commonly lost money in Kenyan letting, and they
          are usually lost at the handover between one agent and the next.
        </LI>
        <LI>
          <strong>Tax.</strong> Kenyan residential rental income attracts
          Monthly Rental Income tax at 7.5 percent, and somebody has to
          calculate it, withhold it and file it. The agreement should say who,
          by when, and that the filing reference reaches you. An agent who
          leaves this to you while collecting your rent has left you exposed
          to a KRA obligation on money you never touched.
        </LI>
        <LI>
          <strong>Reporting.</strong> What you receive, how often, and at what
          level of detail. &quot;Monthly statements&quot; can mean a figure in
          a WhatsApp message. A statement worth the name shows gross rent, each
          deduction itemised with what it was for, the tax withheld with its
          reference, and the net wired.
        </LI>
        <LI>
          <strong>Maintenance markup.</strong> Does the agent take anything on
          top of what the contractor charges, and if so, is it disclosed? An
          undisclosed markup is the most reliable hidden cost in the industry,
          because it converts your agent&rsquo;s incentive from keeping the
          property cheap to run into keeping it expensive to run.
        </LI>
        <LI>
          <strong>Re-letting.</strong> Is a letting fee charged again when the
          existing tenant renews? A renewal is a signature, not a letting, and
          being charged a month&rsquo;s rent for it every year is one of the
          quieter ways a headline percentage becomes untrue.
        </LI>
      </OL>

      <Callout title="The question that tells you the most">
        Ask what the agreement says happens if they miss the payout date. Not
        what they would do, what the document says. An agent whose contract has
        an answer has thought about being held to it. An agent who says
        &quot;that has never happened&quot; has answered a different question,
        and you now know the document has nothing in it.
      </Callout>

      <H2 id="red-flags">The five clauses that quietly cost you money</H2>

      <P>
        These are all common, all legal, and all worth striking out or pricing
        in before you sign.
      </P>

      <UL>
        <LI>
          <strong>Automatic renewal with a long notice window.</strong> An
          agreement that renews for another year unless you give notice ninety
          days before the anniversary is designed to be missed. Diarise it or
          refuse it.
        </LI>
        <LI>
          <strong>Sole and irrevocable authority.</strong> Language appointing
          the agent as your attorney over the property, or as sole agent
          irrevocably, goes far beyond what managing a flat requires. Authority
          should be specific and revocable.
        </LI>
        <LI>
          <strong>Fees charged on rent due rather than collected.</strong>
          Covered above, and worth repeating because it reads as a technicality
          and behaves as a transfer of risk.
        </LI>
        <LI>
          <strong>Indemnities running one way.</strong> A clause where you
          indemnify the agent against everything, including their own
          negligence, and they indemnify you against nothing. Negligence should
          never be indemnified away.
        </LI>
        <LI>
          <strong>Silence on the deposit.</strong> Not a clause, an absence,
          and the most expensive one on the list.
        </LI>
      </UL>

      <H2 id="airbnb-version">The short-stay version is a different document</H2>

      <P>
        A management agreement for a unit on Airbnb or Booking.com has to
        answer questions the long-let version does not, and a template borrowed
        from long-term management will be silent on all of them. Who holds the
        platform account and therefore the review history. Who sets the nightly
        price and whether you can override it. Who is named as the host for
        the purposes of the platform&rsquo;s own guarantees. What happens to
        confirmed forward bookings if either side terminates, because those are
        commitments to third parties that outlive your contract.
      </P>

      <P>
        The last of those is the one that causes real damage. If the agreement
        ends in March and there are guests booked for July, somebody has to
        honour or refund them, and if the document does not say who, you will
        find out during an argument. The account-ownership question is dealt
        with at length in{" "}
        <Link
          href="/insights/airbnb-co-host-nairobi-what-they-do"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          what an Airbnb co-host actually does
        </Link>
        , because it decides whether you keep two years of reviews or start
        again at zero.
      </P>

      <H2 id="what-ours-says">What ours says</H2>

      <P>
        We publish our fee rather than quoting on a call: 10 percent of
        collected rent for long-term management, 20 percent of revenue for
        Airbnb and short-stay, and a one-time fee of one month&rsquo;s rent if
        you only want a tenant found. Collected, not due. There is no setup
        fee, no commission taken from contractors, no letting fee charged again
        at renewal and nothing payable if you leave.
      </P>

      <P>
        The parts we would point a sceptical landlord at are the ones with
        consequences attached rather than promises. Miss a 48 hour response on
        a request and we waive that property&rsquo;s management fee for that
        month. The net payout clears on the fifth and we cover the bank charges
        if a holiday pushes the wire. A long-term tenant we placed who defaults
        inside six months is replaced at our cost. The 7.5 percent MRI is
        calculated, withheld and remitted by the twentieth with the receipt
        reference on your statement.
      </P>

      <P>
        We would rather be compared on those than on the percentage, because
        the percentage is unremarkable and we say so on{" "}
        <Link
          href="/pricing"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the pricing page
        </Link>
        . Nairobi long-term management runs roughly 8 to 15 percent and
        short-stay 15 to 25 percent. We sit in the middle of both bands. What
        differs is what sits underneath the number.
      </P>

      <Callout title="Send us the agreement you have been given">
        If you are holding a management agreement from another agent and want a
        straight read on it, send it over. We will tell you which clauses we
        would strike and which are ordinary, including where the answer is that
        it looks fine. It costs you nothing and there is no expectation you
        move.
      </Callout>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/questions-to-ask-a-property-manager-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the questions to ask before you sign
        </Link>
        {", "}
        <Link
          href="/insights/terminate-property-management-agreement-kenya"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how to terminate an agreement you already have
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/property-management-nairobi-what-you-actually-get-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          what management in Nairobi actually gets you
        </Link>
        .
      </P>
    </>
  );
}

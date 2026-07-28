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
  slug: "ghana-land-title-chain-diligence-lands-commission",
  title:
    "Ghana property title chain: how to verify at the Lands Commission before you wire",
  description:
    "The single most expensive mistake a diaspora buyer makes in Ghana is trusting the document the seller is holding. This is the step-by-step of what an actual Lands Commission title-chain diligence looks like in 2026.",
  publishedAt: "2026-06-02",
  updatedAt: "2026-07-27",
  readingMinutes: 8,
  author: authors.legal,
  tags: [
    "Ghana",
    "Legal",
    "Land Title",
    "Lands Commission",
    "Diligence",
    "Diaspora",
  ],
  country: "ghana",
  heroImage: "/images/locations/accra.jpg",
  heroAlt:
    "Ghana Lands Commission title chain diligence for diaspora buyers 2026",
};

export default function Article() {
  return (
    <>
      <Lede>
        Almost every diaspora Ghanaian who has bought
        badly in Accra tells the same story. The
        documents looked correct. The seller had a
        lease. The stamp was clear. The lawyer glanced
        at the file. Money moved. The problem, when it
        surfaced, was in the chain of assignments
        before the seller ever took title. This piece
        walks through the actual Lands Commission
        title-chain diligence that catches that
        problem, using the process our partner
        advocates run for us in 2026.
      </Lede>

      <H2 id="why-a-search-alone-is-not-enough">Why a “Lands Commission search” is not enough</H2>

      <P>
        Most casual diligence stops at what advocates
        call the basic search: a Lands Commission
        confirmation that the property is registered
        in the seller’s name and that no obvious
        caveats or encumbrances are recorded. That
        search is necessary but nowhere near
        sufficient. It confirms the current position;
        it does not confirm the position was arrived
        at cleanly.
      </P>

      <P>
        The title-chain diligence goes back through
        every assignment, sub-lease, deed of gift and
        succession event that connects today’s
        registered position back to the original
        grant. It confirms that each of those transfers
        was properly executed, properly stamped,
        properly registered, and (in the case of stool
        land) that each successive grantor had the
        authority to grant. A break anywhere in that
        chain is a title defect that can and does
        surface years after purchase.
      </P>

      <H2 id="the-actual-process">The actual title-chain process</H2>

      <OL>
        <LI>
          <strong>Obtain the current registered
          indenture from the seller.</strong> This is
          the document showing them as the current
          lessee. Confirm the recital of the chain of
          title on the face of it.
        </LI>
        <LI>
          <strong>Order a certified true copy of the
          root of title.</strong> The root is usually
          the original grant (stool grant or state
          allocation). The Lands Commission holds the
          record; obtaining a certified true copy
          costs between GHS 300 and GHS 800 depending
          on the region.
        </LI>
        <LI>
          <strong>Reconcile the chain document by
          document.</strong> Every assignment between
          the root and today’s registered position
          should appear both on the seller’s chain
          recital and in the Lands Commission
          register. Any assignment that appears on one
          and not the other is a flag.
        </LI>
        <LI>
          <strong>Confirm stamping on each
          assignment.</strong> Unstamped assignments
          are not registrable in Ghana. A chain that
          contains an unstamped intermediate step is
          a chain with a broken link, and the buyer
          taking title today inherits the exposure.
        </LI>
        <LI>
          <strong>Verify the grantor’s authority at
          each step.</strong> For stool land, this
          means confirming that the granting chief
          held authority at the date of grant. Stool
          disputes and dethronements can retroactively
          weaken grants that looked clean at the time.
        </LI>
        <LI>
          <strong>Physical site verification against
          the registered coordinates.</strong> A
          cadastral survey run against the Lands
          Commission plan confirms that the plot on
          the ground and the plot on paper are the
          same plot. Boundary discrepancy is one of
          the two most common defects we see.
        </LI>
        <LI>
          <strong>Neighbour and community
          confirmation.</strong> Speak to the
          immediate neighbours and, where the plot is
          stool land, to a member of the stool council
          who is not the seller’s introducer. Parallel
          grants and dual sales sometimes only surface
          in this conversation.
        </LI>
      </OL>

      <Pullquote>
        The Lands Commission search confirms today.
        The title chain confirms yesterday. You need
        both.
      </Pullquote>

      <H2 id="red-flags">Red flags that should stop a transaction</H2>

      <UL>
        <LI>
          <strong>Missing intermediate assignments.</strong>{" "}
          If the recital jumps from a 1998 grant to
          today’s owner without documenting the
          transfers in between, the chain is
          incomplete on its face.
        </LI>
        <LI>
          <strong>Unstamped documents.</strong> Any
          assignment in the chain that was never
          stamped, or that was stamped years after
          execution, weakens registrability.
        </LI>
        <LI>
          <strong>Family or succession event with no
          probate.</strong> A property that passed
          through an intestate estate without a
          grant of letters of administration has a
          chain break that requires unwinding before
          resale.
        </LI>
        <LI>
          <strong>Grant by a disputed or dethroned
          chief.</strong> A stool grant made by a
          chief later found not to have authority at
          the date of grant is vulnerable.
        </LI>
        <LI>
          <strong>Boundary error greater than 2 per
          cent.</strong> Small survey drift is
          normal. Beyond about 2 per cent of plot
          area, you are looking at an active boundary
          overlap that needs Lands Commission
          rectification before you take title.
        </LI>
        <LI>
          <strong>Multiple registrations under different
          plot numbers.</strong> Rare but seen.
          Occurs when a plot has been re-numbered
          during a survey update and the two numbers
          both remained in use. Resolvable but not
          before completion.
        </LI>
      </UL>

      <Callout title="What this costs in 2026">
        A full title-chain diligence for an Accra
        apartment or plot, including certified copies,
        cadastral survey, neighbour confirmation and
        the advocate’s opinion, runs USD 800 to USD
        1,600. On a USD 250,000 to USD 500,000
        purchase, this is under 0.5 per cent. It is
        the single cheapest line item on the
        transaction stack and the one that saves the
        most.
      </Callout>

      <H2 id="what-happens-when-the-chain-breaks">What happens when the chain breaks</H2>

      <P>
        If the chain breaks and the seller is
        cooperative, the fix is a deed of rectification
        registered with the Lands Commission and, where
        stool authority is at issue, a fresh grant
        obtained from the current recognised stool.
        This can be arranged and takes three to six
        months, during which the buyer’s deposit sits
        in escrow. If the seller is not cooperative,
        the buyer walks and forfeits any non-refundable
        deposit paid outside escrow. This is the reason
        we insist on lawyer’s escrow and on refundable
        deposit structures for every diaspora client.
      </P>

      <H2 id="how-we-help">How Goldstay runs this</H2>

      <P>
        For every property we source in Accra, our
        partner law firm runs the full title-chain
        diligence before any deposit is committed. The
        buyer sees the advocate’s opinion in writing
        before signing the sale agreement. Where the
        chain shows any weakness, we either negotiate
        the seller into rectification (with the deposit
        held in escrow) or we walk. The one thing we
        will not do is take on a chain defect and hope.
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/buying-property-accra-diaspora-2026-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the full Accra buying guide
        </Link>
        ,{" "}
        <Link
          href="/insights/ghana-stool-land-diaspora-buyer-trap"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the stool-land specific piece
        </Link>
        , and, for the Kenyan equivalent of this
        exercise,{" "}
        <Link
          href="/insights/how-to-verify-kenyan-title-deed-from-abroad"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          our Kenyan title-verification guide
        </Link>
        . To start a diligence brief on a specific
        Ghana property, use{" "}
        <Link
          href="/list-your-property"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          this form
        </Link>
        .
      </P>
    </>
  );
}

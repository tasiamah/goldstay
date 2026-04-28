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
  slug: "offer-letter-stage-buying-property-kenya",
  title:
    "The offer letter stage in Kenya: what to include, what to avoid, what it costs you to skip",
  description:
    "The offer letter is the cheapest place to win or lose a Nairobi property deal. Most diaspora buyers either skip it or sign whatever the agent puts in front of them. Here is what a strong offer letter actually contains, what binds you and what does not, and why a properly written offer protects 10 to 15 percent of the price.",
  publishedAt: "2026-02-04",
  readingMinutes: 7,
  author: authors.legal,
  tags: ["Kenya", "Buying", "Offer Letter", "Negotiation", "Diaspora", "Nairobi"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Diaspora buyer drafting an offer letter for a Nairobi apartment, Kenya property purchase",
};

export default function Article() {
  return (
    <>
      <Lede>
        Most Nairobi property purchases live or die at the offer
        letter stage, before any lawyer is involved and long
        before money moves. The offer letter is where price,
        timeline, conditions, and the structure of the deposit
        are actually decided. It is also where 90% of the
        leverage you will ever have over the seller exists.
        Once you sign a sale agreement those terms are largely
        locked in, so the offer letter is the moment to be
        precise.
      </Lede>

      <P>
        Diaspora buyers tend to make one of two mistakes here.
        Either they skip the offer letter entirely (verbal
        agreement, jump straight to sale agreement) and lose
        every conditional protection, or they sign whatever
        the agent emails them, which is usually a one paragraph
        note that binds the buyer and barely mentions the
        seller. Both are expensive.
      </P>

      <H2 id="what-it-is">What an offer letter is and is not</H2>

      <P>
        An offer letter is a written, dated, signed document
        from the buyer (or buyer&rsquo;s agent) to the seller
        proposing the headline terms of the purchase. In Kenya
        it is conventionally subject to contract, which means
        it is not yet a binding agreement to buy. It is a
        commercial agreement on the terms that will be carried
        forward into the sale agreement.
      </P>

      <P>
        Two things an offer letter is not:
      </P>

      <UL>
        <LI>
          It is not the sale agreement. The sale agreement,
          drawn up by the lawyers and exchanged at deposit,
          is the legally binding document.
        </LI>
        <LI>
          It is not optional. Skipping it means the seller
          and the agent get to define the terms when the
          lawyers draft the sale agreement, and you spend the
          next month reverse-engineering negotiations you
          could have settled in a single email.
        </LI>
      </UL>

      <H2 id="what-to-include">What every offer letter should contain</H2>

      <OL>
        <LI>
          <strong>Buyer details.</strong> Full legal name as it
          will appear on the title, passport or ID number,
          residential address, and email. If buying through a
          company, include the company registration number and
          a CR12 reference.
        </LI>
        <LI>
          <strong>Property identification.</strong> Plot/title
          number, full address, apartment number if applicable,
          and any reference number the developer or agent
          uses.
        </LI>
        <LI>
          <strong>Offer price in numbers and words.</strong>{" "}
          Always specify the currency. KES is standard for
          Kenya transactions even when the parties think in
          USD; if you intend to settle in USD, say so
          explicitly with an FX reference.
        </LI>
        <LI>
          <strong>Deposit terms.</strong> Amount (typically
          10%), when payable (on signing the sale agreement,
          not on signing the offer), and crucially, where it
          will be held. The only acceptable answer is in the
          buyer&rsquo;s lawyer&rsquo;s client account or a
          formal escrow account. Never in the seller&rsquo;s
          account.
        </LI>
        <LI>
          <strong>Completion date.</strong> A real date, not
          &ldquo;upon completion of works&rdquo;. For ready
          properties, 60 to 90 days from sale agreement is
          standard. For off-plan, the completion date should
          align with the developer&rsquo;s programme with a
          long-stop date and remedy if it slips.
        </LI>
        <LI>
          <strong>Conditions precedent.</strong> The list of
          things that must be true before you complete. Title
          search clean, KRA capital gains tax clearance from
          the seller, valuation matching the price, building
          approvals confirmed, no outstanding service charge
          arrears. If any condition fails, the deposit is
          refunded in full.
        </LI>
        <LI>
          <strong>Inclusions and exclusions.</strong>{" "}
          Especially for furnished or partially fitted
          properties. Specify what conveys with the sale
          (white goods, fitted wardrobes, AC units, generator
          share, water tank). The default in Kenya is &ldquo;if
          not listed, it does not transfer&rdquo;.
        </LI>
        <LI>
          <strong>Subject to contract clause.</strong> A line
          confirming the offer is subject to a sale agreement
          drawn up by the buyer&rsquo;s lawyers. This keeps
          the offer non-binding while the diligence runs.
        </LI>
      </OL>

      <H2 id="what-to-avoid">What to avoid putting in an offer letter</H2>

      <P>
        Three things buyers commonly include that they should
        not:
      </P>

      <UL>
        <LI>
          <strong>Anything you have not actually agreed.</strong>{" "}
          If you have not negotiated a fixture or a discount,
          do not bake it in unilaterally. The seller will
          reject and the rest of your terms get watered down
          in the rebuttal.
        </LI>
        <LI>
          <strong>Open-ended deadlines.</strong> &ldquo;On or
          before completion&rdquo; is meaningless. Use real
          dates, even if you adjust them later.
        </LI>
        <LI>
          <strong>Personal narrative.</strong> No paragraphs
          about why you love the property or how you grew up
          in the area. The agent will use it against you in
          the next round of negotiations.
        </LI>
      </UL>

      <H2 id="leverage">Where the leverage actually sits</H2>

      <P>
        The day you submit the offer letter is the day your
        leverage peaks. The seller has decided to sell, the
        property is on the market, and there is a real buyer
        in front of them with money. Every day after that,
        leverage shifts to the seller, because each hour of
        diligence makes you more committed and harder to walk
        away.
      </P>

      <P>
        Use that day. Push the price down five to seven
        percent below ask, set the deposit at 5% rather than
        10%, ask for a 90 day completion rather than 60, and
        list every fitting you want included. The seller will
        counter and you will land in a reasonable middle. If
        you go in at full ask with a clean offer, you have
        wasted the only piece of pricing power you ever had.
      </P>

      <Pullquote>
        The day you submit the offer letter is the day your
        leverage peaks. Every day after that, leverage shifts
        to the seller.
      </Pullquote>

      <H2 id="off-plan">Off-plan offer letters are different</H2>

      <P>
        With developer-direct off-plan deals, the offer letter
        is often called a Reservation Form or Expression of
        Interest. It is short, it usually requires a small
        reservation fee (KES 50,000 to KES 200,000), and it
        commits the buyer to enter into the developer&rsquo;s
        sale agreement within a defined window (often 14 to
        30 days).
      </P>

      <P>
        Two things to insist on at this stage:
      </P>

      <OL>
        <LI>
          A draft of the sale agreement attached to the
          reservation form. If the developer refuses, the
          terms are still being decided and you are committing
          to a document you have not seen. That is
          unacceptable.
        </LI>
        <LI>
          A refund clause: if the sale agreement materially
          differs from what was discussed, or if the buyer
          declines to sign within the window, the reservation
          fee is refunded. Most reputable developers will
          agree to this in writing if asked. Most non-reputable
          developers will not.
        </LI>
      </OL>

      <Callout title="The rule of one document">
        Never sign the second document (sale agreement) without
        first agreeing the first (offer letter). Never wire the
        second payment (deposit) without first lodging the
        first (reservation fee in escrow). The whole purchase
        process protects you only if you treat each stage as
        a gate, not a formality.
      </Callout>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For every property we source, we draft the offer letter
        on your behalf using the framework above, send it to
        you for sign-off, and then submit to the seller or
        developer. We negotiate price, timeline, deposit
        structure and conditions before any document goes to
        the lawyers. By the time the sale agreement is drafted,
        every commercial point is settled and the lawyers
        focus on title and legal protections, not on rerunning
        commercial negotiation by email.
      </P>

      <P>
        See the next stage in this series:{" "}
        <Link
          href="/insights/sale-agreement-stage-buying-property-kenya"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the sale agreement stage in Kenya
        </Link>
        , and our piece on{" "}
        <Link
          href="/insights/why-have-a-lawyer-read-your-kenyan-sale-agreement"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          why a property lawyer should read your sale agreement
        </Link>
        .
      </P>
    </>
  );
}

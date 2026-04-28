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
  slug: "sale-agreement-stage-buying-property-kenya",
  title:
    "The sale agreement stage in Kenya: a step-by-step guide for diaspora buyers",
  description:
    "From offer letter accepted to title in your name. The exact sequence of the sale agreement stage in Kenya, the documents that must change hands, the typical timelines, the KRA tax clearance step everybody underestimates, and where diaspora buyers most commonly get stuck.",
  publishedAt: "2026-02-24",
  readingMinutes: 9,
  author: authors.legal,
  tags: ["Kenya", "Buying", "Sale Agreement", "Diaspora", "Conveyancing", "KRA"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Nairobi conveyancing process, sale agreement signing for Kenyan property purchase",
};

export default function Article() {
  return (
    <>
      <Lede>
        Once the offer letter is accepted, the sale agreement
        stage begins. This is the part that takes 6 to 14
        weeks for most Nairobi residential transactions, and
        it is where most diaspora purchases either glide to
        completion or stall in a back-and-forth that no one
        warned the buyer about. Here is the entire sequence,
        in order, with the realistic timeline against each
        step and the moment a typical purchase tends to
        wobble.
      </Lede>

      <H2 id="who-does-what">Who is doing what</H2>

      <P>
        Three professionals do most of the work in this stage:
      </P>

      <UL>
        <LI>
          <strong>Buyer&rsquo;s lawyer (your conveyancer).</strong>{" "}
          Drafts or marks up the sale agreement, runs title
          searches, prepares the transfer documents, and
          ultimately registers the property in your name.
        </LI>
        <LI>
          <strong>Seller&rsquo;s lawyer.</strong> Provides
          original title and supporting documents, obtains
          capital gains tax clearance from KRA, and signs off
          on the transfer.
        </LI>
        <LI>
          <strong>Valuer.</strong> Produces a current market
          valuation, primarily for stamp duty assessment but
          also for the buyer&rsquo;s sanity check.
        </LI>
      </UL>

      <P>
        If you are buying off-plan from a developer, the
        developer&rsquo;s in-house counsel often plays the
        seller&rsquo;s lawyer role and the developer&rsquo;s
        own valuer is sometimes used. Insist on an
        independent valuer for stamp duty in any event.
      </P>

      <H2 id="step-by-step">The eight steps from offer to title</H2>

      <H3 id="step-1">Step 1: Buyer engages a conveyancer (week 1)</H3>

      <P>
        Pick a Law Society of Kenya member with conveyancing
        experience and no relationship to the seller, agent
        or developer. Send them the accepted offer letter and
        the property details. The lawyer will issue a fee
        quote and a list of documents they need from you (KYC,
        KRA PIN, source of funds, passport scan).
      </P>

      <H3 id="step-2">Step 2: Title search and seller diligence (week 1 to 2)</H3>

      <P>
        Your lawyer pulls an official title search at Ardhi
        House. The search confirms the registered proprietor,
        any encumbrances (charges, caveats, restrictions, court
        orders), and the title type (freehold, leasehold,
        sectional). At the same time, the lawyer verifies the
        seller&rsquo;s capacity (CR12 if a company, grant of
        probate if an estate, spousal consent if married).
      </P>

      <H3 id="step-3">Step 3: Sale agreement drafted and exchanged (week 2 to 4)</H3>

      <P>
        Either side can draft. Standard practice in Kenya is
        for the seller&rsquo;s lawyer to draft and the
        buyer&rsquo;s lawyer to mark up. This is the moment
        every clause from the{" "}
        <Link
          href="/insights/why-have-a-lawyer-read-your-kenyan-sale-agreement"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          buyer-hostile clause list
        </Link>{" "}
        gets renegotiated. Expect 2 to 4 rounds of mark-ups
        before the document is acceptable to both sides.
      </P>

      <P>
        On exchange (signing) the buyer pays the deposit,
        usually 10%, into the buyer&rsquo;s lawyer&rsquo;s
        client account or a formal escrow account. The
        deposit is not released to the seller until completion.
      </P>

      <H3 id="step-4">Step 4: Stamp duty valuation (week 3 to 6)</H3>

      <P>
        A government valuer (or a private valuer the Lands
        registry will accept) values the property to determine
        the stamp duty payable. For urban properties (most of
        Nairobi) stamp duty is 4% of the assessed value; for
        agricultural land outside municipalities it is 2%. The
        valuation is done after exchange, paid by the buyer,
        and typically takes 2 to 4 weeks to come back from the
        Lands office.
      </P>

      <H3 id="step-5">Step 5: KRA capital gains tax clearance (week 4 to 8)</H3>

      <P>
        The seller must obtain CGT clearance from KRA before
        title can transfer. CGT is currently 15% on the
        seller&rsquo;s gain (sale price less acquisition cost
        less allowable expenses). The seller files iTax,
        pays, and obtains a clearance certificate. This is the
        single step most diaspora buyers underestimate. KRA
        clearance commonly takes 3 to 6 weeks even when the
        return is straightforward, longer if the seller has
        outstanding tax issues.
      </P>

      <Callout title="The KRA bottleneck">
        If the deal is going to slip, it usually slips here.
        Build a 6 to 8 week KRA window into your completion
        date from the start, and require the seller in the
        sale agreement to file CGT within 14 days of exchange.
        Without that clause you have no leverage.
      </Callout>

      <H3 id="step-6">Step 6: Stamp duty paid and transfer lodged (week 6 to 10)</H3>

      <P>
        Once stamp duty assessment is back and KRA clearance
        is in hand, the buyer pays stamp duty (4% of valuation
        for urban property) and the buyer&rsquo;s lawyer
        lodges the transfer documents at Ardhi House. Required
        documents include the executed sale agreement, the
        transfer instrument, valuation report, stamp duty
        receipt, KRA CGT clearance, original title, and KYC
        for both sides.
      </P>

      <H3 id="step-7">Step 7: Completion and balance payment (week 8 to 12)</H3>

      <P>
        Completion is the moment the balance of the purchase
        price moves from the buyer&rsquo;s lawyer to the
        seller&rsquo;s lawyer, the original title and keys
        change hands, and possession transfers. For a clean
        diligence, this is choreographed in a single day. For
        contested purchases, it can stretch to multiple
        sessions.
      </P>

      <H3 id="step-8">Step 8: Registration of new title (week 10 to 14)</H3>

      <P>
        After completion, the lodgement at Ardhi House is
        processed and the new title is issued in the
        buyer&rsquo;s name. This currently takes 4 to 8 weeks.
        Until you hold the new title in your name, the
        purchase is technically not yet complete from a
        registration perspective, but the property is yours
        from the moment of completion (Step 7).
      </P>

      <H2 id="costs">The total cost stack on a USD 200,000 purchase</H2>

      <P>
        For a typical Nairobi residential purchase at USD
        200,000 (KES roughly 26m at current FX), the buyer
        side cost stack looks like this:
      </P>

      <UL>
        <LI>
          Stamp duty (4% urban): roughly KES 1,040,000
        </LI>
        <LI>
          Conveyancing legal fee: KES 50,000 to KES 80,000
        </LI>
        <LI>
          Valuation fee: KES 25,000 to KES 40,000
        </LI>
        <LI>
          Registration fees and disbursements: KES 10,000 to
          KES 25,000
        </LI>
        <LI>
          Bank wire and FX cost on incoming USD: typically
          0.5 to 1.5% of the wire amount depending on bank
        </LI>
      </UL>

      <P>
        Total transaction cost on the buyer side: roughly 4.5
        to 5% of the purchase price for a clean residential
        deal. Higher for commercial or if title issues
        require extra work.
      </P>

      <H2 id="diaspora-specific">What diaspora buyers should set up before they start</H2>

      <OL>
        <LI>
          A KRA PIN (Personal Identification Number).
          Mandatory for any property registration, takes a
          week to obtain remotely with passport and proof of
          ownership.
        </LI>
        <LI>
          A signed Power of Attorney (PoA) for the
          buyer&rsquo;s lawyer or a trusted local agent. This
          enables the lawyer to lodge documents, sign forms
          and represent you at Ardhi House without you flying
          in. The PoA must be properly notarised in your
          country of residence and authenticated.
        </LI>
        <LI>
          A clear FX path. International wires from a UK, US
          or UAE bank to a Kenyan client account take 24 to
          72 hours and can require pre-approval for large
          amounts. Test with a small wire first.
        </LI>
      </OL>

      <Pullquote>
        The single highest-value item a diaspora buyer
        prepares before they start is a properly notarised
        Power of Attorney. Everything else moves around
        that document.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        Our property sourcing service runs the entire
        sale agreement stage on your behalf: lawyer
        engagement, title diligence, valuation, KRA pursuit,
        stamp duty payment, and registration follow-through.
        You see the documents, approve the key decisions, and
        sign electronically (or via PoA) from wherever you
        are. We do not take a fee from any of the
        professionals. Their bills go directly to you.
      </P>

      <P>
        If you are mid-purchase and stuck somewhere between
        Step 4 and Step 7 with a slow seller or a slow KRA,
        send us the file via{" "}
        <Link
          href="/property-sourcing"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          our property sourcing page
        </Link>{" "}
        and we will tell you exactly where the bottleneck
        is and how to break it.
      </P>
    </>
  );
}

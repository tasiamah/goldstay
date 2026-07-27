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
  slug: "sending-money-to-ghana-property-closing-2026",
  title:
    "Sending money to Ghana to close a property deal: FX, wire routes, and what the lawyer really needs",
  description:
    "The mechanics of moving USD, GBP or EUR into Ghana for a property closing are simpler than they used to be, but expensive if you take the wrong route. This is the honest 2026 breakdown of the wire options, the Bank of Ghana rules, and what documentation the receiving advocate genuinely needs.",
  publishedAt: "2026-07-10",
  updatedAt: "2026-07-27",
  readingMinutes: 8,
  author: authors.editors,
  tags: [
    "Ghana",
    "Diaspora",
    "FX",
    "Wire Transfer",
    "Closing",
    "Property Purchase",
  ],
  country: "ghana",
  heroImage: "/images/locations/accra.jpg",
  heroAlt:
    "Sending money to Ghana property closing 2026 diaspora buyer FX guide",
};

export default function Article() {
  return (
    <>
      <Lede>
        You have signed the sale agreement. The
        advocate's escrow account is waiting. Now
        you need to move USD 200,000, USD 400,000
        or more from your foreign account into
        Ghana without losing 2 to 4 per cent to
        FX, without triggering a compliance query
        that stalls completion for six weeks, and
        without a wire hanging in a correspondent
        bank because a document is missing. This
        piece is the 2026 operating manual for
        that step, based on the transfers we
        coordinate every week for diaspora
        buyers.
      </Lede>

      <H2 id="the-three-things-that-decide-cost">
        The three things that decide the cost
      </H2>

      <P>
        The all-in cost of moving USD 300,000 to
        an Accra advocate's escrow, from a
        London or New York account, ranges from
        roughly 0.5 per cent (best case) to
        roughly 3 per cent (worst case). The
        difference is decided by three things:
        the FX spread, the wire fees, and the
        speed at which the funds are converted
        into cedis (if at all).
      </P>

      <OL>
        <LI>
          <strong>FX spread.</strong> The gap
          between the mid-market rate and the
          rate your bank actually uses. High
          street banks in the UK and US
          typically charge 1.5 to 3 per cent
          spread on USD to cedi conversions;
          currency specialists charge 0.4 to
          0.9 per cent. This is by far the
          biggest lever.
        </LI>
        <LI>
          <strong>Wire fees.</strong> Outbound
          international wire from a UK or US
          bank: GBP 25 to GBP 40 or USD 30 to
          USD 50. Incoming wire fee at the
          Ghanaian receiving bank: GHS 50 to
          GHS 300. Correspondent bank fees
          along the SWIFT route: USD 15 to
          USD 45. Small numbers relative to
          the FX spread but they add up on
          multiple transfers.
        </LI>
        <LI>
          <strong>Currency of receipt.</strong>{" "}
          Whether the advocate's escrow
          receives USD or cedis. Sending USD
          and letting the advocate hold it in
          a foreign-currency account until
          completion avoids a second FX
          conversion. Most Accra property
          transactions can and should be
          structured this way.
        </LI>
      </OL>

      <H2 id="the-wire-routes">The realistic 2026 wire routes</H2>

      <H2 id="high-street-bank">High-street bank to Ghanaian bank (worst)</H2>
      <P>
        Direct outbound wire from your regular
        current account to the advocate's
        escrow. Slow (three to five business
        days), expensive on FX (typically 2 to
        3 per cent all-in), and increasingly
        subject to compliance holds because the
        purpose code and the supporting
        documentation for a property purchase
        are outside the normal profile of a
        current-account customer. Avoid unless
        no other option is available.
      </P>

      <H2 id="currency-specialist">Currency specialist to Ghanaian bank (best routine)</H2>
      <P>
        Wise, OFX, Currencies Direct or one of
        the tier-one FX specialists. Booked at
        a defined rate, executed within one to
        two business days, all-in cost typically
        0.5 to 1.2 per cent depending on the
        specialist and the transfer size. This
        is the route we recommend for the
        majority of diaspora buyers and it
        works for transfers up to roughly USD
        500,000 without additional friction.
      </P>

      <H2 id="usd-forex-account">USD forex account to USD forex account (cleanest)</H2>
      <P>
        For buyers with a USD-denominated
        account at their home bank, and where
        the receiving advocate holds a USD
        forex account at a Ghanaian bank, a
        direct USD-to-USD wire avoids the FX
        conversion entirely at the outbound
        stage. Conversion to cedis happens in
        Ghana at the reference rate on the
        completion date, and only for the
        portion actually paid to the seller in
        cedis. This is the cleanest structure
        for larger transactions and the one we
        default to on completions above USD
        400,000.
      </P>

      <H2 id="private-bank">Private bank or wealth manager</H2>
      <P>
        For buyers with a private banking
        relationship, direct international wire
        at institutional FX rates is often
        available. All-in cost typically 0.3
        to 0.7 per cent, execution same day
        for most transfers. If this is
        available to you, use it.
      </P>

      <Pullquote>
        Two things move the money efficiently
        into Ghana: a currency specialist for
        the FX, and a USD-denominated
        advocate's escrow to hold it until
        completion. Skip either and you pay a
        3 per cent tax on your own transaction.
      </Pullquote>

      <H2 id="bank-of-ghana-rules">The Bank of Ghana rules that actually matter</H2>

      <P>
        Ghana operates a set of foreign
        exchange controls administered by the
        Bank of Ghana. For diaspora property
        purchases three provisions matter in
        practice.
      </P>

      <UL>
        <LI>
          <strong>Inward transfer for
          property purchase is permitted</strong>{" "}
          and does not require prior approval.
          The declaration to the receiving bank
          identifies the purpose as "real
          estate purchase" and the supporting
          documentation (sale agreement, Lands
          Commission search) is retained by
          the receiving bank.
        </LI>
        <LI>
          <strong>Later repatriation of sale
          proceeds is permitted</strong>{" "}
          provided the original inward
          transfer was properly recorded and
          the sale is documented. Without a
          clean inward-transfer record, later
          repatriation faces friction. This
          is why proper documentation on the
          inbound wire matters even though
          the money is coming in.
        </LI>
        <LI>
          <strong>Rental income repatriation
          is permitted</strong>{" "}
          after the GRA withholding tax has
          been paid, up to the amount of
          rental income earned. Monthly USD
          remittances of net rent are
          standard for Goldstay diaspora
          clients and operate through this
          provision.
        </LI>
      </UL>

      <H2 id="what-the-advocate-actually-needs">What the receiving advocate actually needs</H2>

      <OL>
        <LI>
          <strong>Written wire instruction from
          the advocate</strong>{" "}
          on the advocate's letterhead,
          identifying the escrow account name,
          account number, SWIFT/BIC code,
          receiving bank, and the property
          reference. This document is what you
          hand to your sending bank.
        </LI>
        <LI>
          <strong>Copy of the sale agreement.</strong>{" "}
          The receiving bank in Ghana will
          require it for the purpose declaration.
          Send in advance so the advocate can
          file it before the wire lands.
        </LI>
        <LI>
          <strong>Source of funds
          declaration.</strong> Most Ghanaian
          receiving banks require a brief
          source-of-funds letter from the buyer
          identifying salary, investment
          income, business proceeds, sale of a
          prior property, or other legitimate
          source. Templates are standard; the
          advocate will provide one.
        </LI>
        <LI>
          <strong>Ghana Tax Identification
          Number (TIN).</strong> Required for
          registration of the assignment. Not
          strictly required for the inward wire
          itself but you will need it at
          completion; get it in place at the
          start of the process, not the end.
        </LI>
        <LI>
          <strong>Buyer identification.</strong>{" "}
          Passport and proof of address, in
          copy, retained by the advocate for
          the anti-money-laundering file.
        </LI>
      </OL>

      <Callout title="The wire fraud discipline">
        Once you have the advocate's written
        wire instruction, confirm the account
        details by voice call to a phone
        number you already had on file, not
        the number in the instruction email.
        This one habit prevents almost every
        wire-fraud loss in the diaspora
        buying market.
      </Callout>

      <H2 id="how-we-run-it">How Goldstay runs the funds transfer</H2>

      <P>
        For diaspora buyers we coordinate
        directly with the receiving advocate
        to produce the written wire
        instruction, confirm it to the buyer
        by voice, and stand by while the wire
        is executed to catch and resolve any
        correspondent-bank hold before it
        becomes a problem. On USD-denominated
        holdings, we set up the receiving
        forex account structure at the start
        of the process so the cedi conversion
        only happens on the amount that
        genuinely needs to convert at
        completion. Buyers routinely save 1
        to 2 per cent of the transaction
        value on this step alone.
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/buying-accra-property-from-abroad-remote-diligence"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the remote-diligence playbook
        </Link>
        ,{" "}
        <Link
          href="/insights/buying-property-accra-diaspora-2026-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the Accra buying guide
        </Link>
        , and, for the Kenyan equivalent,{" "}
        <Link
          href="/insights/how-diaspora-landlords-get-paid-usd-from-kenyan-rent"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the USD-remittance mechanics
        </Link>
        .
      </P>
    </>
  );
}

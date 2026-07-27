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
  slug: "capital-gains-tax-kenya-property-sale-diaspora-2026",
  title:
    "Capital gains tax on Kenyan property sales: the diaspora seller guide",
  description:
    "Kenya's 15 per cent capital gains tax on property sales is the single biggest tax line most diaspora sellers face. This is the honest 2026 guide to how the gain is calculated, what is deductible, and what non-residency does and does not change.",
  publishedAt: "2026-06-14",
  updatedAt: "2026-07-27",
  readingMinutes: 8,
  author: authors.legal,
  tags: [
    "Kenya",
    "CGT",
    "Capital Gains",
    "Tax",
    "Selling",
    "Diaspora",
    "KRA",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Capital gains tax Kenya property sale diaspora seller guide 2026",
};

export default function Article() {
  return (
    <>
      <Lede>
        Kenya's capital gains tax on property is
        currently 15 per cent of the gain,
        payable within 30 days of transfer
        registration. It is the single largest
        tax line most diaspora sellers face. The
        headline is simple, but the details
        around what is deductible, how the gain
        is computed, and what non-residency
        changes (which is less than most sellers
        assume) matter enough to justify getting
        the calculation right the first time.
      </Lede>

      <H2 id="the-headline">The current 2026 headline</H2>

      <UL>
        <LI>
          <strong>Rate:</strong> 15 per cent on
          the net gain from the sale of
          immovable property in Kenya.
        </LI>
        <LI>
          <strong>Payable by:</strong> the
          seller (transferor), regardless of
          residency status.
        </LI>
        <LI>
          <strong>Due date:</strong> within 30
          days of the transfer registration at
          Ardhi House.
        </LI>
        <LI>
          <strong>Filing mechanism:</strong>{" "}
          through the seller's iTax account, on
          the standard CGT return, with
          supporting documentation uploaded.
        </LI>
        <LI>
          <strong>Indexation:</strong> Kenya
          does not currently apply indexation
          to the acquisition cost for CGT
          purposes. The gain is calculated in
          nominal shilling terms, which
          understates the real-terms cost of
          holding the asset.
        </LI>
      </UL>

      <H2 id="how-the-gain-is-calculated">
        How the gain is calculated
      </H2>

      <P>
        The gain on which CGT is charged is:
        gross sale proceeds, less allowable
        acquisition cost, less allowable
        incidental costs of acquisition, less
        allowable incidental costs of transfer,
        less allowable expenditure on
        improvements.
      </P>

      <H3 id="sale-proceeds">Sale proceeds</H3>
      <P>
        The headline sale price in the transfer
        instrument. Where the price stated in
        the transfer differs materially from
        market value, KRA can substitute its
        own valuation. This has become more
        common on high-value transactions since
        2024.
      </P>

      <H3 id="acquisition-cost">Acquisition cost</H3>
      <P>
        The price actually paid to acquire the
        property, evidenced by the historical
        transfer instrument, historical bank
        statements showing the payment, and
        the historical stamp duty receipt. A
        property acquired ten or fifteen years
        ago with imperfect documentation is a
        property with a weaker CGT position.
        Start pulling the paperwork now, before
        the sale.
      </P>

      <H3 id="incidental-costs">Incidental costs of acquisition and transfer</H3>
      <P>
        Legal fees, stamp duty and valuation
        costs incurred on both the original
        acquisition and the current sale. All
        deductible provided they are
        documented. Estate agent commission on
        the current sale is deductible; the
        original acquisition agent fee is
        deductible if it was paid by the
        acquirer.
      </P>

      <H3 id="improvements">Allowable improvements</H3>
      <P>
        Capital improvements to the property
        during the holding period. Not repairs,
        not maintenance, not redecoration.
        Structural additions, extensions, major
        renovation that changes the character
        or value of the property. Documented
        with contractor invoices, KRA-compliant
        receipts, and (where relevant) the
        approvals for the works. The most
        under-claimed CGT deduction in
        practice.
      </P>

      <Pullquote>
        The most common diaspora CGT error is
        undocumented improvement expenditure.
        Real work that materially increased
        the property value, with no supporting
        paperwork, does not reduce the gain.
      </Pullquote>

      <H2 id="worked-example">Worked example</H2>

      <P>
        A Kilimani apartment acquired in 2016
        for KES 12m (with KES 480,000 of stamp
        duty and KES 240,000 of legal fees).
        A KES 1.8m documented kitchen and
        bathroom renovation in 2020.
        Sold in 2026 for KES 24m, with KES
        720,000 of agent commission and KES
        360,000 of legal fees on the sale.
      </P>

      <UL>
        <LI>Gross proceeds: KES 24,000,000.</LI>
        <LI>Less acquisition cost: KES 12,000,000.</LI>
        <LI>Less original stamp duty: KES 480,000.</LI>
        <LI>Less original legal fees: KES 240,000.</LI>
        <LI>Less documented improvements: KES 1,800,000.</LI>
        <LI>Less sale agent commission: KES 720,000.</LI>
        <LI>Less sale legal fees: KES 360,000.</LI>
      </UL>

      <P>
        <strong>Chargeable gain:</strong> KES
        8,400,000.
      </P>

      <P>
        <strong>CGT at 15 per cent:</strong> KES
        1,260,000, payable within 30 days of
        transfer registration.
      </P>

      <H2 id="what-non-residency-changes">
        What non-residency changes (and does not)
      </H2>

      <P>
        Kenyan CGT applies to gains from the
        disposal of Kenyan immovable property
        regardless of the seller's residency
        status. Living in London, New York,
        Dubai or Sydney does not exempt a
        diaspora seller from CGT. Two things
        that non-residency does change:
      </P>

      <UL>
        <LI>
          <strong>Filing mechanics.</strong>{" "}
          Non-resident sellers file through
          iTax on their Kenyan PIN
          (registration is a prerequisite to
          any property sale by a non-resident;
          if you do not have a PIN, obtain one
          before listing).
        </LI>
        <LI>
          <strong>Double tax treaty
          interaction.</strong> Where the
          seller is tax-resident in a
          jurisdiction with which Kenya has a
          double tax treaty (the UK, several
          EU jurisdictions and others), the
          treaty may affect the treatment of
          the same gain in the residence
          country. It generally does not
          exempt the Kenyan CGT charge.
        </LI>
      </UL>

      <H2 id="cgt-and-transfer">The interaction between CGT and transfer registration</H2>

      <P>
        As a practical matter, Ardhi House will
        not complete transfer registration
        without the KRA CGT clearance
        (typically issued once the CGT return
        has been filed and the amount paid,
        or where a legitimate exemption
        applies). This means the CGT
        computation, the return, and the
        payment happen in parallel with the
        transfer completion, and the sale
        proceeds released to the seller are
        the proceeds net of the CGT that is
        settled from the escrow.
      </P>

      <Callout title="Two exemptions worth knowing">
        CGT does not apply to transfers between
        spouses, transfers to a former spouse
        on separation, transfers between
        siblings under specific inheritance
        arrangements, or property with a value
        of less than the exemption threshold
        (currently KES 3m). It also does not
        apply to a property that qualifies as
        the seller's principal residence at
        the time of sale (which is not
        typically available to a diaspora
        seller whose principal residence is
        overseas).
      </Callout>

      <H2 id="filing-the-return">Filing the CGT return in practice</H2>

      <OL>
        <LI>
          <strong>Reconcile the acquisition
          documentation.</strong> Historical
          transfer instrument, stamp duty
          receipt, legal fee receipts,
          improvement invoices.
        </LI>
        <LI>
          <strong>Reconcile the sale
          documentation.</strong> Sale
          agreement, transfer instrument,
          agent commission invoice, legal fee
          invoice.
        </LI>
        <LI>
          <strong>Complete the CGT return on
          iTax.</strong> Enter the gain and
          upload supporting documents. The
          system generates a payment reference
          slip.
        </LI>
        <LI>
          <strong>Pay via bank transfer or
          mobile money.</strong> KRA
          acknowledges within one to three
          business days.
        </LI>
        <LI>
          <strong>Obtain the KRA CGT
          clearance certificate.</strong>{" "}
          Required by the advocate to
          complete the transfer registration.
        </LI>
      </OL>

      <H2 id="how-we-help">How Goldstay handles CGT for diaspora sellers</H2>

      <P>
        For every diaspora sale we compute the
        anticipated CGT liability during the
        pricing stage, so the seller knows the
        net proceeds before agreeing to a
        listing price. On completion, our tax
        partner files the CGT return through
        iTax, coordinates payment from escrow,
        and delivers the KRA clearance to the
        advocate for the transfer registration.
        Nothing about the CGT process should
        stall a well-managed diaspora sale.
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/selling-nairobi-apartment-from-abroad-2026-playbook"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the diaspora sale playbook
        </Link>
        ,{" "}
        <Link
          href="/insights/kenya-property-sale-cost-breakdown-2026-seller"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the full sale cost breakdown
        </Link>
        ,{" "}
        <Link
          href="/insights/kenya-mri-tax-diaspora-landlords"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the MRI tax guide
        </Link>
        , and{" "}
        <Link
          href="/insights/capital-gains-tax-kenya-property-sellers"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          our original CGT primer
        </Link>
        .
      </P>
    </>
  );
}

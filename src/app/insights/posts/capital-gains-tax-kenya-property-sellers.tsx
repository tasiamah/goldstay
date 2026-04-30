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
  slug: "capital-gains-tax-kenya-property-sellers",
  title:
    "Capital Gains Tax in Kenya: what diaspora property sellers actually pay",
  description:
    "What CGT in Kenya is, who pays it, the four exemptions that actually apply, the cost base mistakes that inflate your bill by 30%, and the planning moves that cleanly reduce CGT before you sell.",
  publishedAt: "2025-01-20",
  readingMinutes: 8,
  author: authors.editors,
  tags: ["Kenya", "Tax", "CGT", "Selling", "Diaspora"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Nairobi property sale, capital gains tax for diaspora sellers explained",
};

export default function Article() {
  return (
    <>
      <Lede>
        When you sell residential property in Kenya, the
        Kenya Revenue Authority takes 15% of the gain.
        That sentence sounds simple. The reality has enough
        moving parts that diaspora sellers routinely
        over-pay by 20 to 40% because they did not document
        the cost base, missed an exemption, or did not
        plan the disposal year. Here is what CGT in Kenya
        actually is, what reduces it, and what most sellers
        get wrong.
      </Lede>

      <H2 id="what-cgt-is">What CGT actually is</H2>

      <P>
        The Capital Gains Tax in Kenya was reintroduced in
        2015 at 5% and increased to 15% with effect from 1
        January 2023. It applies to the disposal of
        chargeable property, including land and buildings,
        and is charged on the net gain (sale price minus
        cost base minus allowable expenses). It is paid by
        the seller, due on or before transfer of the title.
      </P>

      <P>
        Two practical points. First, the tax is final. There
        is no further income tax on the gain. Second, the
        15% rate is a flat rate, not a marginal rate, so the
        tax calculation is straightforward: ((sale price)
        minus (cost base + allowable expenses)) multiplied
        by 0.15.
      </P>

      <H2 id="cost-base">What the cost base actually includes</H2>

      <P>
        The cost base is where most diaspora sellers leave
        money on the table. It is not just what you paid for
        the property. It includes:
      </P>

      <UL>
        <LI>
          The original purchase price, including stamp duty
          and legal fees on acquisition.
        </LI>
        <LI>
          Capital improvements: extensions, full kitchen or
          bathroom replacement, swimming pool installation,
          structural changes. (Routine repairs do not
          count.)
        </LI>
        <LI>
          Selling costs: agent commission (if any), legal
          fees on disposal, advertising costs.
        </LI>
        <LI>
          Costs of obtaining clean title: any payments made
          to clear historical encumbrances on the title
          before sale.
        </LI>
      </UL>

      <P>
        The diaspora seller’s problem is that capital
        improvements often happened five, ten, fifteen years
        ago, with receipts long lost. KRA accepts
        bank-statement evidence of payment, contractor
        invoices, and even sworn affidavits in some cases,
        but the burden of proof sits with the seller. If
        you have ever upgraded a property and intend to sell,
        keep digital copies of every contractor invoice and
        the corresponding bank transfer.
      </P>

      <Pullquote>
        The diaspora seller’s problem is rarely the
        15% rate. It is that they cannot prove the cost
        base and end up paying CGT on gains they did not
        actually make.
      </Pullquote>

      <H2 id="exemptions">The four exemptions that actually apply</H2>

      <H3 id="exempt-1">1. Principal place of residence</H3>

      <P>
        Disposal of a property that has been the seller’s
        principal place of residence for at least three of
        the five years preceding the sale is exempt. For most
        diaspora sellers this does not apply, because the
        property has been a let property, not a residence.
        For sellers who lived in the property before moving
        abroad, this exemption can entirely eliminate CGT.
      </P>

      <H3 id="exempt-2">2. Transfers in restructuring</H3>

      <P>
        Transfers between members of the same group of
        companies for genuine restructuring purposes are
        exempt, subject to specific KRA approval. Largely
        relevant for property held in corporate structures.
      </P>

      <H3 id="exempt-3">3. Transfer of property valued under KES 3 million</H3>

      <P>
        Property where the transfer value is below KES 3
        million is exempt. Limited application in Nairobi
        residential at current price levels.
      </P>

      <H3 id="exempt-4">4. Death and inheritance</H3>

      <P>
        Transfers on the death of the registered owner to
        the estate, and from the estate to beneficiaries,
        are not subject to CGT. The recipient takes the
        property at market value at the date of death as
        their cost base, which can substantially reduce CGT
        on a future sale.
      </P>

      <H2 id="filing-and-payment">Filing and payment</H2>

      <OL>
        <LI>
          The seller’s lawyer files a CGT return on
          iTax before submitting transfer documents to the
          registry.
        </LI>
        <LI>
          The 15% CGT is paid via the iTax payment slip,
          typically through M-Pesa or bank transfer.
        </LI>
        <LI>
          The KRA-issued CGT certificate is then attached to
          the transfer documents at the registry.
        </LI>
        <LI>
          Without the CGT certificate, the registry will not
          process the transfer. CGT is therefore effectively
          collected at source, on every disposal.
        </LI>
      </OL>

      <H2 id="planning-moves">Planning moves that work</H2>

      <H3 id="plan-1">1. Document the cost base now</H3>

      <P>
        If you have improved a property since you bought
        it, gather every contractor invoice and matching
        bank transfer now. Store digital copies. The
        difference at sale can be material. On a property
        bought for KES 12 million and sold for KES 22
        million, KES 2 million of documented improvements
        cuts CGT from KES 1.5 million to KES 1.2 million.
      </P>

      <H3 id="plan-2">2. Use the principal residence exemption when applicable</H3>

      <P>
        If you lived in the property for any three of the
        five years before sale, you may qualify. For
        diaspora owners this sometimes means timing the
        sale to fall within the five year window after a
        period of residence. The qualifying test is fact-
        based; involve a Kenyan tax adviser early.
      </P>

      <H3 id="plan-3">3. Time the disposal year</H3>

      <P>
        Kenya does not currently allow loss carry-forward
        on personal CGT, but the rate has changed twice in
        the last decade. If a rate change is announced for
        the following financial year (Finance Bill is
        published in April or May), some sellers may
        legitimately accelerate or delay completion. Speak
        to a tax adviser about timing the disposal.
      </P>

      <H3 id="plan-4">4. Hold in the right structure</H3>

      <P>
        Property held in a Kenyan limited company is
        treated differently from property held personally.
        Company disposals are subject to CGT but the cost
        base treatment, allowable expenses, and ability to
        offset gains against losses can be more flexible.
        For larger portfolios, a corporate structure is
        often more efficient. For a single residential
        unit it rarely justifies the overhead.
      </P>

      <Callout title="Double-tax relief">
        If you are tax-resident in a country with a Double
        Taxation Agreement with Kenya (UK, UAE, India,
        Germany, Canada among others), you may be able to
        claim relief against your home-country tax for
        the Kenyan CGT paid. This depends on the specific
        treaty and your home-country rules. A
        cross-border tax adviser is the right person to
        get this right.
      </Callout>

      <H2 id="practical-checklist">Practical checklist before you sell</H2>

      <OL>
        <LI>
          Pull together every cost-base document: original
          purchase, stamp duty, legal fees, capital
          improvements with bank evidence.
        </LI>
        <LI>
          Confirm any principal residence claim with a tax
          adviser before listing.
        </LI>
        <LI>
          Get a current valuation. The KRA reference
          minimum value (the “assessed value”)
          is increasingly used as a floor for CGT
          calculation. If your sale price is below it, KRA
          can re-assess.
        </LI>
        <LI>
          File MRI tax returns up to date through the
          period of ownership. KRA will check.
        </LI>
        <LI>
          Engage a Kenyan property lawyer experienced in
          disposals to handle the iTax filing alongside
          the conveyancing.
        </LI>
      </OL>

      <H2 id="how-we-help">How we help</H2>

      <P>
        For Goldstay-managed properties, we maintain a
        full digital record of MRI filings, capital
        improvements, and operating costs from day one of
        management. When the time comes to sell, the
        cost-base documentation is already organised. We
        also coordinate the lawyer, the valuer, and the
        tax adviser if needed.
      </P>

      <P>
        For ongoing rental tax, see the{" "}
        <Link
          href="/insights/kenya-mri-tax-diaspora-landlords"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          MRI tax guide
        </Link>
        . If you are considering a sale and want to
        structure the disposal cleanly, send us the
        details on{" "}
        <Link
          href="/list-your-property"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          this form
        </Link>{" "}
        and we will help you find the right adviser and
        coordinate the process.
      </P>
    </>
  );
}

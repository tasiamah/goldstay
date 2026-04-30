import Link from "next/link";
import { authors, type PostMeta } from "./_shared";
import {
  Callout,
  H2,
  LI,
  Lede,
  P,
  Pullquote,
  UL,
} from "@/components/ArticleProse";

export const meta: PostMeta = {
  slug: "cgt-calculator-kenya-property-2026",
  title:
    "Capital Gains Tax calculator Kenya 2026: worked examples",
  description:
    "Capital Gains Tax (CGT) on property in Kenya is 15 percent of the gain on disposal. Calculation depends on adjusted cost base, allowable improvements and sale costs. Here are the honest 2026 worked examples for sellers in Nairobi.",
  publishedAt: "2025-11-16",
  readingMinutes: 4,
  author: authors.legal,
  tags: [
    "Capital Gains Tax",
    "CGT",
    "Calculator",
    "Kenya",
    "Seller",
    "Tax",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Capital Gains Tax calculator Kenya property 2026 examples",
};

export default function Article() {
  return (
    <>
      <Lede>
        Capital Gains Tax (CGT) on property
        in Kenya is 15 percent of the gain
        on disposal. Calculation depends on
        adjusted cost base, allowable
        improvements and sale costs. Here
        are the honest 2026 worked examples
        for sellers in Nairobi.
      </Lede>

      <H2 id="formula">The formula</H2>

      <P>
        Gain = Sale Price - Adjusted Cost
        Base - Disposal Costs
      </P>

      <P>
        CGT = 15 percent x Gain
      </P>

      <H2 id="adjusted-cost-base">Adjusted cost base components</H2>

      <UL>
        <LI>
          Original purchase price
        </LI>
        <LI>
          Stamp duty paid on purchase
        </LI>
        <LI>
          Legal fees on purchase
        </LI>
        <LI>
          Capital improvements (proven and
          documented)
        </LI>
        <LI>
          Other allowable acquisition costs
        </LI>
      </UL>

      <H2 id="disposal-costs">Allowable disposal costs</H2>

      <UL>
        <LI>
          Estate agent commission
        </LI>
        <LI>
          Legal fees on sale
        </LI>
        <LI>
          Marketing costs (if applicable)
        </LI>
        <LI>
          Valuation fees
        </LI>
      </UL>

      <H2 id="examples">Worked examples</H2>

      <P>
        <strong>Example 1: Apartment held 5
        years with capital gain</strong>
      </P>

      <UL>
        <LI>
          Purchase price 2021: KES
          12,000,000
        </LI>
        <LI>
          Stamp duty paid: KES 480,000
        </LI>
        <LI>
          Purchase legal fees: KES 80,000
        </LI>
        <LI>
          Capital improvements: KES
          400,000
        </LI>
        <LI>
          Adjusted cost base: KES
          12,960,000
        </LI>
        <LI>
          Sale 2026: KES 18,500,000
        </LI>
        <LI>
          Estate agent commission 3
          percent: KES 555,000
        </LI>
        <LI>
          Sale legal fees: KES 100,000
        </LI>
        <LI>
          Disposal costs: KES 655,000
        </LI>
        <LI>
          Gain: KES 18,500,000 - KES
          12,960,000 - KES 655,000 = KES
          4,885,000
        </LI>
        <LI>
          CGT at 15 percent: KES 732,750
        </LI>
      </UL>

      <P>
        <strong>Example 2: Standalone house
        held 12 years</strong>
      </P>

      <UL>
        <LI>
          Purchase price 2014: KES
          25,000,000
        </LI>
        <LI>
          Stamp duty paid: KES 1,000,000
        </LI>
        <LI>
          Purchase legal fees: KES 150,000
        </LI>
        <LI>
          Capital improvements over years:
          KES 4,000,000
        </LI>
        <LI>
          Adjusted cost base: KES
          30,150,000
        </LI>
        <LI>
          Sale 2026: KES 65,000,000
        </LI>
        <LI>
          Estate agent commission 3
          percent: KES 1,950,000
        </LI>
        <LI>
          Sale legal fees: KES 200,000
        </LI>
        <LI>
          Disposal costs: KES 2,150,000
        </LI>
        <LI>
          Gain: KES 65,000,000 - KES
          30,150,000 - KES 2,150,000 =
          KES 32,700,000
        </LI>
        <LI>
          CGT at 15 percent: KES
          4,905,000
        </LI>
      </UL>

      <H2 id="exemptions">Exemptions and reliefs</H2>

      <UL>
        <LI>
          Transfer between spouses (not a
          taxable disposal)
        </LI>
        <LI>
          Transfer to a trust for the
          benefit of a spouse or family
          member (subject to specific
          rules)
        </LI>
        <LI>
          Compulsory acquisition by
          government
        </LI>
        <LI>
          Some restructuring transactions
          (specific rules apply)
        </LI>
      </UL>

      <H2 id="when">When CGT is paid</H2>

      <UL>
        <LI>
          Paid by the seller before
          completion of transfer
        </LI>
        <LI>
          KRA must clear before lands
          registry will register the
          transfer
        </LI>
        <LI>
          Paid via iTax
        </LI>
      </UL>

      <Callout title="The CGT rule">
        Document everything that goes into
        the adjusted cost base from day one
        of ownership. Stamp duty receipts,
        legal fees, capital improvement
        invoices. The seller who has the
        records pays CGT on the real gain;
        the seller without records often
        pays on the gross spread.
      </Callout>

      <Pullquote>
        Most Kenyan CGT overpayments are
        not made by sellers who pay too
        much; they are made by sellers
        who could not document the
        adjusted cost base.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For seller clients we coordinate
        with tax advisors on CGT
        computation. Read also our pieces
        on{" "}
        <Link
          href="/insights/sellers-guide-nairobi-property-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          sellers guide Nairobi 2026
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/property-taxes-kenya-explained-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          property taxes Kenya 2026
        </Link>
        .
      </P>
    </>
  );
}

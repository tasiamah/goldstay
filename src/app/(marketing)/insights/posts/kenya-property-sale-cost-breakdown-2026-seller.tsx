import Link from "next/link";
import { authors, type PostMeta } from "./_shared";
import {
  Callout,
  H2,
  H3,
  LI,
  Lede,
  P,
  Pullquote,
  UL,
} from "@/components/ArticleProse";

export const meta: PostMeta = {
  slug: "kenya-property-sale-cost-breakdown-2026-seller",
  title:
    "How much will you actually walk away with? Kenya property sale cost breakdown 2026",
  description:
    "Sellers routinely misread how much of the headline sale price they will actually receive. This is the 2026 line-by-line breakdown of every cost on a Kenya property sale, worked through a realistic example.",
  publishedAt: "2026-06-07",
  updatedAt: "2026-07-27",
  readingMinutes: 7,
  author: authors.legal,
  tags: [
    "Kenya",
    "Selling",
    "Cost Breakdown",
    "Diaspora",
    "Tax",
    "Sale Costs",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Kenya property sale cost breakdown 2026 seller diaspora net proceeds",
};

export default function Article() {
  return (
    <>
      <Lede>
        Sellers focus on the headline sale price.
        Buyers focus on the same number. The number
        that actually matters, the amount that
        lands in your account after every
        professional, tax, statutory and bank fee
        has been deducted, is roughly 10 to 13 per
        cent below the headline for a diaspora
        seller in 2026. Knowing the exact
        arithmetic before you list stops the
        surprises at completion and helps you
        price the sale to hit the walk-away number
        that actually matters to you.
      </Lede>

      <H2 id="the-full-list">The full cost list on a Kenya property sale</H2>

      <H3 id="professional-fees">Professional fees</H3>
      <UL>
        <LI>
          <strong>Estate agent commission:</strong>{" "}
          typically 3 per cent of sale price
          inclusive of VAT for a standard mandate.
          Negotiable on higher-value transactions
          and on shorter mandates.
        </LI>
        <LI>
          <strong>Advocate legal fees:</strong> 1
          to 2 per cent of sale price on the
          Advocates Remuneration Order scale, plus
          disbursements. On a KES 25m sale this
          typically lands at KES 300,000 to KES
          500,000.
        </LI>
        <LI>
          <strong>Valuation:</strong> KES 25,000
          to KES 60,000 depending on property
          size. One-off cost, paid at listing.
        </LI>
        <LI>
          <strong>Presentation cost:</strong>{" "}
          professional photography KES 25,000 to
          KES 45,000; light refresh (paint,
          repairs, deep clean) typically KES
          150,000 to KES 300,000.
        </LI>
      </UL>

      <H3 id="tax">Tax</H3>
      <UL>
        <LI>
          <strong>Capital gains tax:</strong> 15
          per cent of the gain (sale proceeds less
          acquisition cost less allowable
          improvements). Due within 30 days of
          transfer registration. The most material
          single line item after commission on
          most sales.
        </LI>
        <LI>
          <strong>Rental income tax on any
          collected rent up to sale date:</strong>{" "}
          the standard MRI or ordinary regime
          continues to apply through the sale
          period, and any outstanding rental
          income tax is expected to be settled at
          the point of transfer.
        </LI>
      </UL>

      <H3 id="statutory">Statutory and administrative</H3>
      <UL>
        <LI>
          <strong>Ardhi House transfer registration
          fees:</strong> nominal for the seller,
          typically KES 5,000 to KES 12,000.
        </LI>
        <LI>
          <strong>Land Control Board consent (for
          agricultural land):</strong> KES 1,000
          to KES 5,000 plus attendance if
          required.
        </LI>
        <LI>
          <strong>Sectional or management company
          consent:</strong> where the property is
          in a managed complex, the sectional or
          management company typically levies a
          transfer administration fee of KES
          10,000 to KES 40,000.
        </LI>
        <LI>
          <strong>Land rates clearance:</strong>{" "}
          all outstanding county land rates must
          be cleared to date before transfer. If
          arrears have accumulated, this can be
          material.
        </LI>
        <LI>
          <strong>Service charge clearance:</strong>{" "}
          all outstanding building service charge
          must be cleared to date.
        </LI>
      </UL>

      <H3 id="bank-and-fx">Bank and FX (for diaspora repatriation)</H3>
      <UL>
        <LI>
          <strong>Outbound wire fee:</strong> KES
          1,500 to KES 5,000 from a Kenya bank.
        </LI>
        <LI>
          <strong>FX spread on shilling-to-USD
          conversion:</strong> depending on the
          bank and the transaction size, 0.5 to
          2.5 per cent of the transaction. On a
          KES 25m repatriation this can range
          from USD 900 to USD 4,500.
        </LI>
        <LI>
          <strong>Receiving bank fee:</strong>{" "}
          USD 15 to USD 50 in the destination
          jurisdiction.
        </LI>
      </UL>

      <H2 id="worked-example">Worked example: KES 25m Kilimani apartment</H2>

      <P>
        Diaspora seller in London, apartment
        originally bought for KES 15m in 2018, no
        significant improvements, sold in 2026
        for KES 25m headline.
      </P>

      <UL>
        <LI>Headline sale price: KES 25,000,000.</LI>
        <LI>Estate agent commission (3 per cent): KES 750,000.</LI>
        <LI>Legal fees (1.5 per cent): KES 375,000.</LI>
        <LI>Valuation, photography, cosmetic refresh: KES 300,000.</LI>
        <LI>Capital gains tax (15 per cent of KES 10m gain): KES 1,500,000.</LI>
        <LI>Sectional register transfer administration: KES 25,000.</LI>
        <LI>Land rates clearance (assume KES 30,000 arrears): KES 30,000.</LI>
        <LI>Ardhi House transfer registration: KES 10,000.</LI>
        <LI>Outbound wire and FX (1.5 per cent on KES 22m repatriation): KES 330,000.</LI>
      </UL>

      <P>
        <strong>Total costs:</strong> KES 3,320,000.
      </P>

      <P>
        <strong>Net proceeds to the seller's
        overseas account:</strong> approximately
        KES 21,680,000, or roughly 86.7 per cent
        of the headline sale price.
      </P>

      <Pullquote>
        Sellers who did not model the full cost
        stack routinely find they receive 12 to
        15 per cent less than they were mentally
        planning for. The cure is the model, not
        surprise.
      </Pullquote>

      <H2 id="the-levers">Where the levers actually are</H2>

      <P>
        Of the roughly 13 per cent cost stack in
        the example above, three items are
        genuinely negotiable and one is largely
        fixed.
      </P>

      <UL>
        <LI>
          <strong>Agent commission.</strong>{" "}
          Materially negotiable on higher-value
          transactions and on exclusive mandates.
          A KES 100m sale should not pay a full 3
          per cent; 2 to 2.25 per cent is more
          realistic. On a KES 15m sale, agent
          commission is roughly at market and
          less negotiable.
        </LI>
        <LI>
          <strong>Legal fees.</strong> Modestly
          negotiable within the Advocates
          Remuneration Order framework. On
          large transactions, discounted from
          scale is common.
        </LI>
        <LI>
          <strong>FX spread on repatriation.</strong>{" "}
          The single most under-negotiated line
          item. A Kenya-side FX conversion at 2
          per cent versus an offshore
          currency-specialist wire at 0.6 per
          cent is worth roughly KES 350,000 on a
          KES 25m repatriation.
        </LI>
        <LI>
          <strong>Capital gains tax.</strong>{" "}
          Not negotiable. Legitimate reduction
          exists only where the seller has
          documented improvements that are
          properly claimable and where the
          acquisition cost is fully documented
          (indexation is not currently applied
          to Kenyan CGT).
        </LI>
      </UL>

      <Callout title="One forgotten line item">
        On sales where the property is being sold
        with the tenant in place, the deposit
        currently held by the seller (or the
        managing agent) must be transferred to
        the buyer at completion, not repaid to
        the tenant. This is a KES 100,000 to KES
        400,000 line depending on the deposit
        that most sellers forget to model.
      </Callout>

      <H2 id="how-we-help">How Goldstay handles the cost stack</H2>

      <P>
        For diaspora sellers on Goldstay we produce
        a written net-proceeds model before the
        property is listed. Every line is
        itemised, every estimate is defensible
        against 2026 rates, and the seller signs
        off on the walk-away number that
        corresponds to a defensible listing price.
        Nothing about the cost stack should
        surprise a seller at completion. On our
        book, it does not.
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
          href="/insights/capital-gains-tax-kenya-property-sale-diaspora-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the diaspora CGT guide
        </Link>
        , and{" "}
        <Link
          href="/insights/how-diaspora-landlords-get-paid-usd-from-kenyan-rent"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the USD-repatriation mechanics
        </Link>
        .
      </P>
    </>
  );
}

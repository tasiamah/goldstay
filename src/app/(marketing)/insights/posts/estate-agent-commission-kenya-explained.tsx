import Link from "next/link";
import { authors, type PostMeta } from "./_shared";
import {
  Callout,
  H2,
  H3,
  KeySummary,
  LI,
  Lede,
  P,
  Pullquote,
  UL,
} from "@/components/ArticleProse";

export const meta: PostMeta = {
  slug: "estate-agent-commission-kenya-explained",
  title:
    "Estate agent commission in Kenya: what is normal and what is not in 2026",
  metaTitle: "Estate agent commission in Kenya 2026: rates and who pays",
  description:
    "Estate agent commission in Kenya is one of the least transparent line items in property transactions. Here is the honest 2026 guide on the standard rates, who pays what, who is allowed to charge what, and how to avoid the common commission disputes that derail deals.",
  metaDescription:
    "Agents charge 1.25% to 3% on a sale and 7.5% of annual rent on a letting. The 1987 statutory scale, who pays it, and where VAT applies.",
  publishedAt: "2026-01-22",
  readingMinutes: 6,
  author: authors.editors,
  tags: [
    "Kenya",
    "Agents",
    "Commission",
    "Buying",
    "Selling",
    "Property",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Estate agent commission Kenya 2026 honest guide rates and rules",
  faq: [
    {
      q: "What is the standard commission for a real estate agent in Kenya?",
      a: "On a residential sale, 1.25 to 3 percent of the sale price, with sole agencies at the lower end and multiple agencies at the upper. On a letting, the statutory scale is 7.5 percent of the annual gross rent for a lease of up to a year, or one month's rent for anything longer, though most Nairobi agents ask for one month either way. Commercial lettings run 7.5 percent on a sole agency and 10 percent on a general agency. These come from the 1987 scale under the Estate Agents Act, which is guidance rather than a cap, so the rate is negotiable and the quoted figure is an opening position.",
    },
    {
      q: "How much commission do rental agents take in Kenya?",
      a: "For finding a tenant, expect one month's rent or 7.5 percent of the annual rent, which on a twelve month tenancy are close to the same number. Where the agent also manages the property, the scale sets a floor of half the letting commission rather than a second full fee, because an agent collecting the rent already earns from the same tenancy twice. That clause is the one almost no quote mentions. If you are quoted a full month's rent to let plus a full management percentage on top, ask which part of the scale that is drawn from.",
    },
    {
      q: "How much do house agents get paid in Kenya?",
      a: "A house agent's income is almost entirely commission on completed transactions rather than a salary, which is what drives the behaviour owners complain about. On a KES 15m sale at 2 percent the agent's firm earns KES 300,000, usually split with the salesperson. On a KES 80,000 a month letting the fee is one month, so KES 80,000 for work that might take two weeks. Because nothing is earned until a deal closes, agents push for completion and resist exclusivity periods expiring, and an agent asking for money before any tenant or buyer appears is charging something the scale does not recognise.",
    },
  ],
};

export default function Article() {
  return (
    <>
      <Lede>
        Estate agent commission in Kenya is one of
        the least transparent line items in property
        transactions. Different agents quote
        different rates, the same property gets
        listed by multiple agents at different
        commission terms, and disputes about who
        introduced the buyer derail deals every week.
        Here is the honest 2026 guide.
      </Lede>

      <KeySummary
        question="How much commission do estate agents charge in Kenya?"
        answer="On a residential sale, agents in practice charge 1.25 to 3 percent of the price, and the seller pays. The published scale behind that is the Estate Agents (Remuneration) Rules, 1987, as amended in 2002: 10 percent of the first KES 100,000, 6 percent of the next KES 900,000 and 3 percent of the balance, which on a KES 10 million sale works out at KES 334,000. On lettings the scale turns on the lease: 7.5 percent of the annual gross rent for a lease up to a year, or one month's rent for anything longer, paid by the landlord. Where the agent also manages the property the letting fee is negotiable but cannot fall below half scale. The scale is a published reference rather than a fixed price, so any of these can be varied by written agreement, and most are."
        facts={[
          { label: "Residential sale, practice", value: "1.25% to 3%" },
          {
            label: "Residential sale, scale",
            value: "10% / 6% / 3% on the first 100k, next 900k, balance",
          },
          {
            label: "Letting up to one year",
            value: "7.5% of annual gross rent",
          },
          { label: "Letting over one year", value: "One month's rent" },
          { label: "Letting plus management", value: "Not below half scale" },
          { label: "Who pays", value: "Seller on sales, landlord on lettings" },
        ]}
      />

      <H2 id="rates">Standard rates</H2>

      <UL>
        <LI>
          <strong>Sales (residential)</strong>: 1.25
          to 3 percent of the sale price
          (negotiable; the EAR Act provides
          guidance but actual practice varies)
        </LI>
        <LI>
          <strong>Sales (commercial and
          land)</strong>: 1 to 3 percent
        </LI>
        <LI>
          <strong>Lettings (residential)</strong>:
          the scale turns on the length of the
          lease. Up to one year it is 7.5 percent
          of the annual gross rent; longer than a
          year it is one month rent. In practice
          most Nairobi agents ask for one month
          whichever it is
        </LI>
        <LI>
          <strong>Lettings (commercial)</strong>:
          7.5 percent of annual gross rent on a
          sole agency, 10 percent on a general
          agency
        </LI>
        <LI>
          <strong>Letting plus management</strong>:
          by negotiation, but the rules set a
          floor of half the letting scale. The
          clause exists because an agent who also
          collects the rent earns twice from the
          same tenancy, and it is the one almost
          no quote mentions
        </LI>
        <LI>
          <strong>Sole agency</strong>: lower
          rate (typically 1.25 to 2 percent)
        </LI>
        <LI>
          <strong>Multiple agency</strong>: higher
          rate (typically 2 to 3 percent)
        </LI>
        <LI>
          <strong>Off-plan referral</strong>:
          paid by developer, ranges 3 to 6
          percent
        </LI>
      </UL>

      <H3 id="standard-commission">
        What is the standard commission for a real
        estate agent in Kenya?
      </H3>

      <P>
        On a residential sale, 1.25 to 3 percent,
        with sole agencies at the lower end and
        multiple agencies at the upper. On a
        letting, 7.5 percent of annual gross rent
        for a lease of up to a year, or one
        month rent for anything longer. The
        figures come from the 1987 scale under
        the Estate Agents Act, which is guidance
        rather than a cap. The rate is
        negotiable, and the quoted figure is an
        opening position rather than a tariff.
      </P>

      <H3 id="rental-agent-commission">
        How much commission do rental agents take
        in Kenya?
      </H3>

      <P>
        For finding a tenant, expect one month
        rent or 7.5 percent of the annual rent,
        which on a twelve month tenancy come to
        much the same number. Where the agent
        also manages the property, the scale sets
        a floor of half the letting commission
        rather than a second full fee, because an
        agent collecting the rent already earns
        from the same tenancy twice.
      </P>

      <P>
        If you are quoted a full month rent to
        let plus a full management percentage on
        top, ask which part of the scale that is
        drawn from. The answer is usually that it
        is not.
      </P>

      <H3 id="what-agents-earn">
        How much do house agents get paid in
        Kenya?
      </H3>

      <P>
        Almost entirely commission on completed
        transactions rather than salary, which is
        what drives the behaviour owners
        complain about. On a KES 15m sale at 2
        percent the firm earns KES 300,000,
        usually split with the salesperson. On a
        KES 80,000 a month letting the fee is one
        month, so KES 80,000 for work that might
        take a fortnight.
      </P>

      <P>
        Because nothing is earned until a deal
        closes, agents push hard for completion
        and resist letting an exclusivity period
        lapse. It also means an agent asking for
        money before any tenant or buyer has
        appeared is charging for something the
        scale does not recognise.
      </P>

      <H2 id="who-pays">Who actually pays</H2>

      <UL>
        <LI>
          <strong>Sales</strong>: typically the
          seller pays the agent commission. The
          buyer should never pay both sides
          unless an explicit buyer-side
          representation agreement is in place
        </LI>
        <LI>
          <strong>Buyer-side representation</strong>:
          retainer paid by the buyer (typically
          0.5 to 2 percent of the eventual
          purchase price); the buyer pays
          their own representative. Goldstay
          works on this model
        </LI>
        <LI>
          <strong>Lettings</strong>: typically
          the landlord pays. Tenant-paid finder
          fees do exist but should be negotiated
          explicitly
        </LI>
      </UL>

      <H2 id="rules">Regulatory framework</H2>

      <UL>
        <LI>
          Estate Agents Registration Board (EARB)
          regulates licensed agents under the EAR
          Act
        </LI>
        <LI>
          The scale itself is the Estate Agents
          (Remuneration) Rules, 1987, amended by
          Legal Notice 198 of 2002. It is a
          published schedule, not a trade custom,
          so a quote can be checked against it
        </LI>
        <LI>
          The scale is a reference rather than a
          ceiling or a floor in ordinary
          practice: parties vary it by agreement,
          and most do
        </LI>
        <LI>
          Many practitioners in the market are
          unregistered; this is illegal but
          common
        </LI>
        <LI>
          Buyers and sellers should verify EARB
          registration before paying commission
        </LI>
      </UL>

      <H2 id="disputes">Common commission disputes</H2>

      <UL>
        <LI>
          Multiple agents claiming the same buyer
          introduction. The seller pays only the
          actual introducer. Document the
          introduction in writing
        </LI>
        <LI>
          Agent demanding payment from both
          sides. Decline politely and pay only
          the side that is contractually owed
        </LI>
        <LI>
          Off-plan agents claiming commission on
          deals the developer’s direct
          sales team closed. Confirm with the
          developer before paying
        </LI>
        <LI>
          Lettings commissions on lease renewals.
          Check the listing agreement; renewals
          are not always commissionable
        </LI>
        <LI>
          Verbal commission agreements that turn
          out to differ from each side’s
          recollection. Always paper the deal
        </LI>
      </UL>

      <H2 id="practical">Practical advice</H2>

      <UL>
        <LI>
          Negotiate the commission rate before
          listing or viewing
        </LI>
        <LI>
          Document the agency relationship
          (sole, multiple, exclusive) in writing
        </LI>
        <LI>
          Confirm EARB registration of the agent
        </LI>
        <LI>
          Pay through the lawyer’s
          completion statement, not separately
        </LI>
        <LI>
          Insist on receipts and proper invoices
        </LI>
        <LI>
          Ensure VAT treatment is correct (16
          percent applies to VAT-registered
          agents on services rendered)
        </LI>
      </UL>

      <Callout title="The commission rule">
        Negotiate the commission rate before
        engagement. Document the agency
        relationship in writing. Verify EARB
        registration. Pay through the
        lawyer’s completion statement.
        Most commission disputes disappear when
        these four boxes are ticked.
      </Callout>

      <Pullquote>
        Commission is not a hidden cost. It is a
        documented professional fee for a
        properly structured service. The
        transactions that go wrong on commission
        are the ones where nobody documented the
        relationship at the start.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For sourcing and management clients we
        run a buyer-side representation model
        with documented retainer and clear
        deliverables. Read also our pieces on{" "}
        <Link
          href="/insights/property-transfer-process-step-by-step-kenya"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          property transfer process
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/why-have-a-lawyer-read-your-kenyan-sale-agreement"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          why a lawyer should read your sale
          agreement
        </Link>
        .
      </P>
      <P>
        Landlords who manage their own property still come to us for{" "}
        <Link
          href="/tenant-finding"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          tenant finding and vetting
        </Link>
        .
      </P>
      <P>
        If you would rather hand the whole thing over, the two standing
        arrangements and what each costs are set out under{" "}
        <Link
          href="/long-term-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          long term management
        </Link>{" "}
        at 10 percent of rent collected, and{" "}
        <Link
          href="/airbnb-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Airbnb management
        </Link>{" "}
        at 20 percent of revenue collected for a furnished unit let nightly.
      </P>
    </>
  );
}

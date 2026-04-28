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
  slug: "estate-agent-commission-kenya-explained",
  title:
    "Estate agent commission in Kenya: what is normal and what is not in 2026",
  description:
    "Estate agent commission in Kenya is one of the least transparent line items in property transactions. Here is the honest 2026 guide on the standard rates, who pays what, who is allowed to charge what, and how to avoid the common commission disputes that derail deals.",
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
          one month rent finder fee, sometimes 8
          to 10 percent of annual rent
        </LI>
        <LI>
          <strong>Lettings (commercial)</strong>:
          variable; often 10 to 15 percent of
          annual rent
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
          The Act provides scale fees as guidance
          (Schedule)
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
          deals the developer&rsquo;s direct
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
          out to differ from each side&rsquo;s
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
          Pay through the lawyer&rsquo;s
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
        lawyer&rsquo;s completion statement.
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
    </>
  );
}

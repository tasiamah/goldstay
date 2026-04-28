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
  slug: "stamp-duty-nairobi-calculator-examples-2026",
  title:
    "Nairobi stamp duty calculator: worked examples for 2026",
  description:
    "Stamp duty in Nairobi is 4 percent of the higher of purchase price or government valuation, payable by the buyer. Here are the honest 2026 worked examples across price points, including KMRC-eligible affordable housing exemptions.",
  publishedAt: "2025-11-28",
  readingMinutes: 4,
  author: authors.legal,
  tags: [
    "Stamp Duty",
    "Calculator",
    "Nairobi",
    "Tax",
    "Buyer Guide",
    "Property",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Nairobi stamp duty calculator 2026 worked examples",
};

export default function Article() {
  return (
    <>
      <Lede>
        Stamp duty in Nairobi is 4 percent of
        the higher of purchase price or
        government valuation, payable by the
        buyer. Buyers regularly underestimate
        the line item. Here are the honest
        2026 worked examples across price
        points.
      </Lede>

      <H2 id="rates">2026 stamp duty rates</H2>

      <UL>
        <LI>
          Urban property (Nairobi metro):
          4 percent of the higher of
          purchase price or government
          valuation
        </LI>
        <LI>
          Rural and agricultural property:
          2 percent (outside Nairobi metro)
        </LI>
        <LI>
          Affordable housing under AHP:
          exempt up to defined cap
        </LI>
        <LI>
          First-time buyer through Affordable
          Mortgage Programme: stamp duty
          relief where qualifying
        </LI>
      </UL>

      <H2 id="examples">Worked examples</H2>

      <P>
        <strong>Example 1: Kasarani 2-bed
        apartment</strong>
      </P>

      <UL>
        <LI>
          Purchase price: KES 5,500,000
        </LI>
        <LI>
          Stamp duty: 4 percent x KES
          5,500,000 = KES 220,000
        </LI>
      </UL>

      <P>
        <strong>Example 2: Kilimani 2-bed
        apartment</strong>
      </P>

      <UL>
        <LI>
          Purchase price: KES 13,500,000
        </LI>
        <LI>
          Stamp duty: 4 percent x KES
          13,500,000 = KES 540,000
        </LI>
      </UL>

      <P>
        <strong>Example 3: Lavington 3-bed
        apartment</strong>
      </P>

      <UL>
        <LI>
          Purchase price: KES 28,000,000
        </LI>
        <LI>
          Stamp duty: 4 percent x KES
          28,000,000 = KES 1,120,000
        </LI>
      </UL>

      <P>
        <strong>Example 4: Karen 4-bed
        standalone</strong>
      </P>

      <UL>
        <LI>
          Purchase price: KES 85,000,000
        </LI>
        <LI>
          Stamp duty: 4 percent x KES
          85,000,000 = KES 3,400,000
        </LI>
      </UL>

      <P>
        <strong>Example 5: Runda premium
        standalone</strong>
      </P>

      <UL>
        <LI>
          Purchase price: KES 180,000,000
        </LI>
        <LI>
          Stamp duty: 4 percent x KES
          180,000,000 = KES 7,200,000
        </LI>
      </UL>

      <P>
        <strong>Example 6: AHP-eligible 1-bed
        in Park Road / Boma Yangu</strong>
      </P>

      <UL>
        <LI>
          Purchase price: KES 3,500,000
        </LI>
        <LI>
          Stamp duty: exempt under AHP
          where qualifying
        </LI>
      </UL>

      <H2 id="when">When stamp duty is paid</H2>

      <UL>
        <LI>
          Within 30 days of execution of
          transfer
        </LI>
        <LI>
          Paid via KRA iTax
        </LI>
        <LI>
          Late payment attracts penalty and
          interest
        </LI>
      </UL>

      <H2 id="who">Who actually pays</H2>

      <UL>
        <LI>
          Statutory: buyer
        </LI>
        <LI>
          Some negotiated transactions split
          (rare)
        </LI>
        <LI>
          For new build off-plan: stamp
          duty paid at completion, not
          deposit
        </LI>
      </UL>

      <Callout title="The stamp duty rule">
        Budget 4 percent on top of the
        purchase price for stamp duty in
        Nairobi. On a KES 20m purchase,
        that is KES 800,000. Buyers who
        treat it as a surprise often
        delay closing.
      </Callout>

      <Pullquote>
        Stamp duty is the line item
        Nairobi buyers underestimate most
        often. Build it into the budget
        from day one.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For sourcing clients we model the
        full transaction cost including
        stamp duty before offer. Read
        also our pieces on{" "}
        <Link
          href="/insights/kenya-stamp-duty-2026-buyer-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Kenya stamp duty 2026
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/total-cost-buying-property-kenya-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          total cost buying property
          Kenya
        </Link>
        .
      </P>
    </>
  );
}

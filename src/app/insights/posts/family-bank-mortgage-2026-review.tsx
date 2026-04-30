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
  slug: "family-bank-mortgage-2026-review",
  title:
    "Family Bank mortgage 2026: the honest review",
  description:
    "Family Bank is a mid-sized Kenyan retail bank with a small but credible mortgage product. Here is the honest 2026 review of Family Bank mortgages.",
  publishedAt: "2026-02-26",
  readingMinutes: 4,
  author: authors.legal,
  tags: [
    "Family Bank",
    "Mortgage",
    "Kenya",
    "Lending",
    "Buyer Guide",
    "Finance",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Family Bank Kenya mortgage 2026 honest review",
};

export default function Article() {
  return (
    <>
      <Lede>
        Family Bank is a mid-sized Kenyan retail
        bank with a small but credible mortgage
        product. Less prominent in the
        residential mortgage conversation than
        the top tier banks, but worth a quote
        for the right borrower. Here is the
        honest 2026 review.
      </Lede>

      <H2 id="rates">Rates and tenure</H2>

      <UL>
        <LI>
          Rate range: typically CBR plus 3 to
          4.5 percent margin
        </LI>
        <LI>
          Tenure: up to 20 to 25 years
        </LI>
        <LI>
          Loan-to-value: typically 70 to 85
          percent
        </LI>
      </UL>

      <H2 id="products">Main products</H2>

      <UL>
        <LI>
          <strong>Home Mortgage</strong>
        </LI>
        <LI>
          <strong>Construction Loan</strong>
        </LI>
        <LI>
          <strong>Diaspora Mortgage</strong>
        </LI>
      </UL>

      <H2 id="strengths">Where Family Bank wins</H2>

      <UL>
        <LI>
          Existing Family Bank relationship
          customers get strong relationship
          pricing
        </LI>
        <LI>
          Smaller book means individual
          customer attention
        </LI>
      </UL>

      <H2 id="trade-offs">Trade-offs</H2>

      <UL>
        <LI>
          Smaller branch network than top
          tier banks
        </LI>
        <LI>
          Less aggressive on premium
          residential
        </LI>
      </UL>

      <Callout title="The Family Bank rule">
        For existing Family Bank relationship
        customers, the bank is worth a
        quote in the shopping process. Most
        borrowers will get more aggressive
        pricing from the larger lenders.
      </Callout>

      <Pullquote>
        Family Bank’s mortgage book is
        small but the relationship pricing
        for existing customers is real.
        Always quote your home bank before
        going elsewhere.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For mortgage clients with existing
        Family Bank relationship we include
        Family Bank in the comparison. Read
        also our pieces on{" "}
        <Link
          href="/insights/equity-bank-mortgage-2026-review"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Equity Bank mortgage 2026
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/co-op-bank-mortgage-2026-review"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Co-op Bank mortgage 2026
        </Link>
        .
      </P>
    </>
  );
}

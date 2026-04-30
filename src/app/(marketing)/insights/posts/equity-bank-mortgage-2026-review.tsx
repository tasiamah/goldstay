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
  slug: "equity-bank-mortgage-2026-review",
  title:
    "Equity Bank mortgage 2026: the honest review",
  description:
    "Equity Bank is the largest bank in Kenya by customer base and one of the most accessible mortgage lenders, with a focus on the mass-market and mid-market borrower. Here is the honest 2026 review of Equity Bank mortgages.",
  publishedAt: "2026-03-01",
  readingMinutes: 5,
  author: authors.legal,
  tags: [
    "Equity Bank",
    "Mortgage",
    "Kenya",
    "Lending",
    "Buyer Guide",
    "Finance",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Equity Bank Kenya mortgage 2026 honest review",
};

export default function Article() {
  return (
    <>
      <Lede>
        Equity Bank is the largest bank in Kenya
        by customer base and one of the most
        accessible mortgage lenders, with a
        focus on the mass-market and mid-market
        borrower. Here is the honest 2026
        review.
      </Lede>

      <H2 id="rates">Rates and tenure</H2>

      <UL>
        <LI>
          Rate range: typically CBR plus 3 to
          5 percent margin
        </LI>
        <LI>
          Tenure: up to 25 years
        </LI>
        <LI>
          Loan-to-value: typically 70 to 90
          percent
        </LI>
      </UL>

      <H2 id="products">Main products</H2>

      <UL>
        <LI>
          <strong>Equity Mortgage</strong>:
          flagship variable rate
        </LI>
        <LI>
          <strong>Diaspora Mortgage</strong>
        </LI>
        <LI>
          <strong>Construction Loan</strong>
        </LI>
        <LI>
          <strong>Affordable Housing
          Programme support</strong>: KMRC-aligned
          products
        </LI>
      </UL>

      <H2 id="strengths">Where Equity wins</H2>

      <UL>
        <LI>
          Volume and reach; large branch
          network
        </LI>
        <LI>
          Strong on first-time buyer products
        </LI>
        <LI>
          Affordable Housing Programme
          alignment via KMRC
        </LI>
        <LI>
          Existing Equity customers get
          relationship pricing
        </LI>
      </UL>

      <H2 id="trade-offs">Trade-offs</H2>

      <UL>
        <LI>
          Headline rate sometimes higher than
          KCB or NCBA
        </LI>
        <LI>
          Premium residential is not the
          bank’s primary focus
        </LI>
        <LI>
          Process can be slower on complex
          transactions
        </LI>
      </UL>

      <Callout title="The Equity rule">
        For mass-market and first-time
        buyers with existing Equity banking
        relationship, the bank is an
        accessible choice with good reach.
        For premium clients KCB, NCBA or
        Stanbic typically compete more
        aggressively on rate.
      </Callout>

      <Pullquote>
        Equity’s strength is volume
        and reach. The bank approves more
        first-time buyer mortgages than any
        other lender in Kenya.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For mortgage clients with existing
        Equity relationship or first-time
        buyer profile, Equity is included
        in the comparison. Read also our
        pieces on{" "}
        <Link
          href="/insights/first-time-home-buyer-kenya-complete-guide-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          first-time home buyer Kenya
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/kmrc-affordable-mortgage-explained"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          KMRC explained
        </Link>
        .
      </P>
    </>
  );
}

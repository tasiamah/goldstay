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
  slug: "kcb-mortgage-2026-complete-review",
  title:
    "KCB mortgage 2026: the complete review",
  description:
    "KCB Bank is the largest commercial mortgage lender in Kenya by book size, with a long history of residential and developer financing. Here is the honest 2026 review of KCB mortgages: rates, processing, eligibility, repayment terms and how to get a yes.",
  publishedAt: "2025-08-09",
  readingMinutes: 6,
  author: authors.legal,
  tags: [
    "KCB",
    "Mortgage",
    "Kenya",
    "Lending",
    "Buyer Guide",
    "Finance",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "KCB mortgage 2026 complete review Kenya home loan",
};

export default function Article() {
  return (
    <>
      <Lede>
        KCB Bank is the largest commercial
        mortgage lender in Kenya by book size,
        with a long history of residential and
        developer financing. Here is the honest
        2026 review of KCB mortgages, including
        rates, processing, eligibility,
        repayment terms and how to get a yes.
      </Lede>

      <H2 id="rates">Rates and tenure (2026)</H2>

      <UL>
        <LI>
          Mortgage rate range: typically CBR
          plus 2 to 4 percent margin (variable)
        </LI>
        <LI>
          Tenure: up to 25 years on
          residential mortgages
        </LI>
        <LI>
          Loan-to-value: typically 70 to 90
          percent depending on profile
        </LI>
        <LI>
          Maximum repayment age: 65 to 70
          depending on product
        </LI>
      </UL>

      <H2 id="products">Main products</H2>

      <UL>
        <LI>
          <strong>KCB Mortgage Plus</strong>:
          flagship variable rate residential
        </LI>
        <LI>
          <strong>Diaspora Mortgage</strong>:
          for Kenyans living abroad, with
          income verification process tuned
          for foreign payslips
        </LI>
        <LI>
          <strong>Construction Loan</strong>:
          for self-build with disbursement in
          tranches
        </LI>
        <LI>
          <strong>Equity Release</strong>:
          for owners borrowing against
          existing equity
        </LI>
      </UL>

      <H2 id="eligibility">Eligibility</H2>

      <UL>
        <LI>
          Stable income (employment or
          consistent self-employment)
        </LI>
        <LI>
          Debt service ratio typically capped
          around 50 percent of net income
        </LI>
        <LI>
          KRA tax compliance certificate
        </LI>
        <LI>
          Identity, residency and bank
          statements (typically 6 to 12
          months)
        </LI>
        <LI>
          Property valuation by a panel
          valuer
        </LI>
      </UL>

      <H2 id="costs">Total costs</H2>

      <UL>
        <LI>
          Arrangement fee: typically 1
          percent
        </LI>
        <LI>
          Valuation: KES 25,000 to KES
          80,000+
        </LI>
        <LI>
          Legal fees: scale fee on the loan
          amount
        </LI>
        <LI>
          Insurance: mortgage protection,
          building insurance
        </LI>
        <LI>
          Stamp duty on the loan
        </LI>
      </UL>

      <H2 id="diaspora">Diaspora mortgage notes</H2>

      <UL>
        <LI>
          KCB has the longest established
          diaspora desk
        </LI>
        <LI>
          Income verification accepts foreign
          payslips, employer letters, tax
          returns
        </LI>
        <LI>
          Some clients use a Kenyan
          guarantor or co-borrower
        </LI>
        <LI>
          Repayment in KES; foreign exchange
          risk on USD or GBP earners
        </LI>
      </UL>

      <H2 id="how-to-get-yes">How to get a yes</H2>

      <UL>
        <LI>
          Bank with KCB for at least 6 months
          before applying (improves the
          relationship pricing)
        </LI>
        <LI>
          Clean credit reference bureau
          report
        </LI>
        <LI>
          Strong debt service ratio after the
          loan
        </LI>
        <LI>
          Property in a credible market with
          clean title
        </LI>
        <LI>
          Documentation pack complete on day
          one
        </LI>
      </UL>

      <Callout title="The KCB rule">
        KCB is the most established
        residential lender in Kenya. The
        diaspora desk is the most experienced
        in the market. Rates are competitive
        but not the cheapest; the strength
        is process reliability and product
        breadth.
      </Callout>

      <Pullquote>
        The lender that approves is better
        than the lender with the lowest
        advertised rate. KCB&rsquo;s
        residential approval discipline is
        the reason it sits at the top of the
        market.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For mortgage clients we work with
        KCB and other lenders to compare
        offers. Read also our pieces on{" "}
        <Link
          href="/insights/ncba-mortgage-2026-complete-review"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          NCBA mortgage 2026
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/kcb-vs-ncba-mortgage-comparison-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          KCB vs NCBA comparison
        </Link>
        .
      </P>
    </>
  );
}

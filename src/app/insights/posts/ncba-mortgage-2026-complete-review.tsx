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
  slug: "ncba-mortgage-2026-complete-review",
  title:
    "NCBA mortgage 2026: the complete review",
  description:
    "NCBA emerged from the merger of CBA and NIC and has built a distinct premium and SME residential mortgage book. Here is the honest 2026 review of NCBA mortgages including rates, processing, eligibility and how to get a yes.",
  publishedAt: "2025-12-02",
  readingMinutes: 5,
  author: authors.legal,
  tags: [
    "NCBA",
    "Mortgage",
    "Kenya",
    "Lending",
    "Buyer Guide",
    "Finance",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "NCBA mortgage 2026 complete review Kenya home loan",
};

export default function Article() {
  return (
    <>
      <Lede>
        NCBA emerged from the merger of CBA and
        NIC and has built a distinct premium and
        SME residential mortgage book. Here is
        the honest 2026 review of NCBA
        mortgages.
      </Lede>

      <H2 id="rates">Rates and tenure (2026)</H2>

      <UL>
        <LI>
          Rate range: typically CBR plus 2.5
          to 4 percent margin (variable)
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
          Maximum repayment age: typically 65
          to 70
        </LI>
      </UL>

      <H2 id="products">Main products</H2>

      <UL>
        <LI>
          <strong>Premium Residential
          Mortgage</strong>: flagship
          variable rate
        </LI>
        <LI>
          <strong>Diaspora Mortgage</strong>:
          for Kenyans living abroad
        </LI>
        <LI>
          <strong>Construction Loan</strong>:
          tranche-based for self-build
        </LI>
        <LI>
          <strong>SME Owner-occupier</strong>:
          for small business owners with
          alternative income verification
        </LI>
      </UL>

      <H2 id="eligibility">Eligibility</H2>

      <UL>
        <LI>
          Stable income; SME owner profiles
          considered with strong financials
        </LI>
        <LI>
          Debt service ratio typically capped
          around 50 percent of net income
        </LI>
        <LI>
          KRA tax compliance certificate
        </LI>
        <LI>
          Identity, residency, bank
          statements (typically 12 months)
        </LI>
        <LI>
          Property valuation by panel
          valuer
        </LI>
      </UL>

      <H2 id="diaspora">Diaspora notes</H2>

      <UL>
        <LI>
          NCBA has built a credible diaspora
          mortgage process
        </LI>
        <LI>
          Foreign payslip and tax return
          acceptance
        </LI>
        <LI>
          Some clients use a Kenyan
          co-borrower or guarantor
        </LI>
        <LI>
          Repayment in KES; foreign exchange
          risk on USD/GBP earners
        </LI>
      </UL>

      <H2 id="how-to-get-yes">How to get a yes</H2>

      <UL>
        <LI>
          Existing NCBA banking relationship
          helps materially
        </LI>
        <LI>
          Strong CRB report
        </LI>
        <LI>
          Clean debt service ratio after the
          loan
        </LI>
        <LI>
          Documentation pack complete on
          day one
        </LI>
      </UL>

      <Callout title="The NCBA rule">
        NCBA tends to perform best on
        premium residential and SME
        owner-occupier business. Rates are
        competitive; relationship pricing
        meaningful. The strength is the
        SME alternative income process,
        which other lenders handle less
        well.
      </Callout>

      <Pullquote>
        Some banks lend to payslips. NCBA
        has built a real process for
        lending to small business owners
        whose income looks different on
        paper. That matters.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For mortgage clients we compare
        NCBA against KCB, Stanbic and
        others. Read also our pieces on{" "}
        <Link
          href="/insights/kcb-mortgage-2026-complete-review"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          KCB mortgage 2026
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

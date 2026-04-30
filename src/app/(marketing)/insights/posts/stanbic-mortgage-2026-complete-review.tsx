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
  slug: "stanbic-mortgage-2026-complete-review",
  title:
    "Stanbic mortgage 2026: the complete review",
  description:
    "Stanbic Bank Kenya has a long-established residential mortgage book and a particularly strong diaspora mortgage process via the Africa-China Banking platform and parent Standard Bank Group. Here is the honest 2026 review.",
  publishedAt: "2026-01-31",
  readingMinutes: 5,
  author: authors.legal,
  tags: [
    "Stanbic",
    "Mortgage",
    "Kenya",
    "Lending",
    "Diaspora",
    "Finance",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Stanbic mortgage 2026 complete review Kenya home loan",
};

export default function Article() {
  return (
    <>
      <Lede>
        Stanbic Bank Kenya has a long-established
        residential mortgage book and a
        particularly strong diaspora mortgage
        process via the parent Standard Bank
        Group. Here is the honest 2026 review.
      </Lede>

      <H2 id="rates">Rates and tenure (2026)</H2>

      <UL>
        <LI>
          Rate range: typically CBR plus 2 to
          3.5 percent margin (variable)
        </LI>
        <LI>
          Tenure: up to 25 years
        </LI>
        <LI>
          Loan-to-value: typically 70 to 90
          percent
        </LI>
        <LI>
          Maximum repayment age: 65 to 70
        </LI>
      </UL>

      <H2 id="products">Main products</H2>

      <UL>
        <LI>
          <strong>Owner-occupied Residential
          Mortgage</strong>
        </LI>
        <LI>
          <strong>Buy-to-let Mortgage</strong>
        </LI>
        <LI>
          <strong>Diaspora Mortgage</strong>:
          one of the strongest diaspora
          processes in the market
        </LI>
        <LI>
          <strong>Construction Loan</strong>:
          tranche disbursement for self-build
        </LI>
      </UL>

      <H2 id="diaspora">Diaspora process</H2>

      <UL>
        <LI>
          Application accepted from abroad
          via Standard Bank Group offices
        </LI>
        <LI>
          Foreign payslip and tax return
          acceptance
        </LI>
        <LI>
          Strong process for South
          African-resident Kenyans via
          Standard Bank
        </LI>
        <LI>
          Repayment in KES; foreign exchange
          risk on USD/GBP/ZAR earners
        </LI>
      </UL>

      <H2 id="eligibility">Eligibility</H2>

      <UL>
        <LI>
          Stable income
        </LI>
        <LI>
          Debt service ratio typically capped
          around 50 percent
        </LI>
        <LI>
          KRA tax compliance certificate
        </LI>
        <LI>
          Bank statements (typically 12
          months)
        </LI>
        <LI>
          Property valuation by panel
          valuer
        </LI>
      </UL>

      <H2 id="how-to-get-yes">How to get a yes</H2>

      <UL>
        <LI>
          Stanbic banking relationship helps
        </LI>
        <LI>
          Clean CRB report
        </LI>
        <LI>
          Strong DSR
        </LI>
        <LI>
          Documentation pack complete on
          day one
        </LI>
      </UL>

      <Callout title="The Stanbic rule">
        Stanbic is among the most credible
        diaspora mortgage processes in the
        market, particularly for South
        African resident Kenyans and
        Standard Bank Group account
        holders. Rates are competitive;
        process discipline strong.
      </Callout>

      <Pullquote>
        For diaspora Kenyans in
        Standard Bank Group jurisdictions,
        Stanbic Kenya is often the most
        seamless mortgage process available.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For mortgage clients we compare
        Stanbic against KCB, NCBA and
        others. Read also our pieces on{" "}
        <Link
          href="/insights/kcb-mortgage-2026-complete-review"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          KCB mortgage 2026
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/hfc-mortgage-2026-review"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          HFC mortgage 2026
        </Link>
        .
      </P>
    </>
  );
}

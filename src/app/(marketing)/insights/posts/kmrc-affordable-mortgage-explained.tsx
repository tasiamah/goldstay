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
  slug: "kmrc-affordable-mortgage-explained",
  title:
    "KMRC and Kenya’s affordable mortgage explained: the 2026 guide",
  description:
    "Kenya Mortgage Refinance Company (KMRC) is the government-backed institution behind the country’s lower-rate Affordable Housing Programme mortgages. Here is the honest 2026 guide on what KMRC actually does, who qualifies and which banks offer KMRC-backed products.",
  publishedAt: "2026-02-23",
  readingMinutes: 5,
  author: authors.legal,
  tags: [
    "KMRC",
    "Affordable Housing",
    "Mortgage",
    "Kenya",
    "First-Time Buyer",
    "Finance",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "KMRC Kenya affordable mortgage 2026 explained guide",
};

export default function Article() {
  return (
    <>
      <Lede>
        Kenya Mortgage Refinance Company (KMRC)
        is the government-backed institution
        behind the country’s lower-rate
        Affordable Housing Programme mortgages.
        Misunderstood by most borrowers and
        sometimes confused with a separate
        bank. Here is the honest 2026 guide on
        what KMRC actually does and how to
        access KMRC-backed mortgages.
      </Lede>

      <H2 id="what">What KMRC is</H2>

      <UL>
        <LI>
          A central refinancing company that
          provides long-term funding to
          commercial banks and SACCOs at
          below-market rates
        </LI>
        <LI>
          Backed by the National Treasury,
          World Bank and African Development
          Bank
        </LI>
        <LI>
          Does not lend directly to
          consumers; lending is through
          partner banks and SACCOs
        </LI>
      </UL>

      <H2 id="rates">KMRC-backed mortgage rates</H2>

      <UL>
        <LI>
          Typically 9.5 to 11.5 percent fixed
          for the lower-tier (versus 13 to
          16 percent variable on commercial
          mortgages)
        </LI>
        <LI>
          Tenure: up to 25 years
        </LI>
        <LI>
          Loan size cap: KES 10.5m for
          Nairobi metro at the time of
          writing (verify with the lender)
        </LI>
      </UL>

      <H2 id="eligibility">Eligibility</H2>

      <UL>
        <LI>
          First-time home buyer
        </LI>
        <LI>
          Income within the affordable housing
          band (verify the current threshold)
        </LI>
        <LI>
          Property within KMRC-eligible price
          cap
        </LI>
        <LI>
          KRA tax compliance
        </LI>
        <LI>
          Standard mortgage diligence
          (employment, DSR, CRB)
        </LI>
      </UL>

      <H2 id="banks">Partner banks and SACCOs</H2>

      <UL>
        <LI>
          KCB, Stanbic, NCBA, Co-op, Equity,
          HFC, Family Bank, ABSA among the
          commercial banks
        </LI>
        <LI>
          Mwalimu SACCO, Stima SACCO, Imarisha
          SACCO and several others
        </LI>
        <LI>
          Apply to one of these institutions,
          not to KMRC directly
        </LI>
      </UL>

      <H2 id="trade-offs">Trade-offs</H2>

      <UL>
        <LI>
          Property price cap restricts
          eligibility to lower mid-market
          stock; premium suburbs out of scope
        </LI>
        <LI>
          Process can be slower while
          lender confirms KMRC eligibility
        </LI>
        <LI>
          Documentation is more rigorous
        </LI>
      </UL>

      <Callout title="The KMRC rule">
        For first-time buyers within the
        KMRC eligibility band, the
        difference between a 10 percent
        KMRC-backed mortgage and a 14
        percent commercial one is enormous
        over 25 years. Always check
        eligibility before settling for a
        commercial-rate mortgage.
      </Callout>

      <Pullquote>
        KMRC is one of the more meaningful
        property finance innovations of the
        last decade in Kenya. Most
        first-time buyers do not know it
        exists.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For first-time buyer clients we
        check KMRC eligibility before
        settling on a commercial mortgage
        path. Read also our pieces on{" "}
        <Link
          href="/insights/first-time-home-buyer-kenya-complete-guide-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          first-time home buyer Kenya
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/boma-yangu-affordable-housing-programme-diaspora"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Boma Yangu
        </Link>
        .
      </P>
    </>
  );
}

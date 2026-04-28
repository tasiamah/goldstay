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
  slug: "hfc-mortgage-2026-review",
  title:
    "HFC mortgage 2026: the honest review",
  description:
    "HFC (Housing Finance Company) is Kenya&rsquo;s longest-established dedicated mortgage lender, now a wholly owned subsidiary of HF Group. Here is the honest 2026 review of HFC mortgages: rates, products, processing and where they win.",
  publishedAt: "2025-09-26",
  readingMinutes: 5,
  author: authors.legal,
  tags: [
    "HFC",
    "Mortgage",
    "Kenya",
    "Lending",
    "Buyer Guide",
    "Finance",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "HFC mortgage 2026 honest review Kenya home loan",
};

export default function Article() {
  return (
    <>
      <Lede>
        HFC, formerly Housing Finance Company,
        is Kenya&rsquo;s longest-established
        dedicated mortgage lender, now a wholly
        owned subsidiary of HF Group. Here is
        the honest 2026 review.
      </Lede>

      <H2 id="rates">Rates and tenure</H2>

      <UL>
        <LI>
          Rate range: typically CBR plus 2.5
          to 4 percent margin
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
          <strong>Vyumba Mortgage</strong>:
          flagship residential
        </LI>
        <LI>
          <strong>Diaspora Mortgage</strong>
        </LI>
        <LI>
          <strong>Construction Loan</strong>
        </LI>
        <LI>
          <strong>HF Whitebox</strong>:
          mortgage on HF-developed properties
          (some processing advantages)
        </LI>
      </UL>

      <H2 id="strengths">Where HFC wins</H2>

      <UL>
        <LI>
          Specialist mortgage focus, longer
          history than most competitors
        </LI>
        <LI>
          Some HF-developed properties have
          structured financing already in
          place
        </LI>
        <LI>
          Construction loan process tuned to
          self-build clients
        </LI>
      </UL>

      <H2 id="trade-offs">Trade-offs</H2>

      <UL>
        <LI>
          Branch network smaller than KCB or
          NCBA
        </LI>
        <LI>
          Diaspora process less active than
          KCB or Stanbic at scale
        </LI>
        <LI>
          Some clients report longer
          processing
        </LI>
      </UL>

      <Callout title="The HFC rule">
        For self-build clients and buyers
        of HF-developed properties, HFC is
        worth a serious quote. For broad
        residential mortgages, the larger
        commercial banks generally compete
        more aggressively on rate and
        processing.
      </Callout>

      <Pullquote>
        Specialist mortgage lenders have
        their place. HFC&rsquo;s
        construction finance and HF-built
        property linkage are real
        advantages in the right scenario.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For mortgage clients we include HFC
        in the comparison where the
        scenario fits. Read also our pieces
        on{" "}
        <Link
          href="/insights/kcb-mortgage-2026-complete-review"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          KCB mortgage 2026
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/stanbic-mortgage-2026-complete-review"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Stanbic mortgage 2026
        </Link>
        .
      </P>
    </>
  );
}

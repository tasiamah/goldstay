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
  slug: "absa-mortgage-2026-review",
  title:
    "ABSA Bank Kenya mortgage 2026: the honest review",
  description:
    "ABSA Bank Kenya, formerly Barclays, has rebuilt its residential mortgage book under the Absa Group with credible product and process. Here is the honest 2026 review of ABSA mortgages.",
  publishedAt: "2026-03-07",
  readingMinutes: 5,
  author: authors.legal,
  tags: [
    "ABSA",
    "Mortgage",
    "Kenya",
    "Lending",
    "Buyer Guide",
    "Finance",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "ABSA Bank Kenya mortgage 2026 honest review",
};

export default function Article() {
  return (
    <>
      <Lede>
        ABSA Bank Kenya, formerly Barclays Bank
        of Kenya, has rebuilt its residential
        mortgage book under the Absa Group with
        credible product and process. Here is
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
          <strong>Home Loan</strong>: flagship
          residential
        </LI>
        <LI>
          <strong>Diaspora Mortgage</strong>:
          credible process leveraging Absa
          Group offices
        </LI>
        <LI>
          <strong>Construction Loan</strong>:
          tranche disbursement
        </LI>
        <LI>
          <strong>Buy-to-Let</strong>
        </LI>
      </UL>

      <H2 id="strengths">Where ABSA wins</H2>

      <UL>
        <LI>
          Premium Banking clients get
          relationship pricing
        </LI>
        <LI>
          Diaspora process via Absa Group
          offices in South Africa and
          elsewhere
        </LI>
        <LI>
          Strong corporate lending
          relationship discipline carries
          into residential
        </LI>
      </UL>

      <H2 id="trade-offs">Trade-offs</H2>

      <UL>
        <LI>
          Smaller residential book than KCB
          or NCBA; processing pipelines vary
        </LI>
        <LI>
          Less aggressive on mass-market
          mortgages
        </LI>
      </UL>

      <Callout title="The ABSA rule">
        ABSA is a credible second or third
        quote in the mortgage shopping
        process. For Absa Group banking
        clients in South Africa or other
        Group jurisdictions, the diaspora
        process is meaningfully smoother.
      </Callout>

      <Pullquote>
        Always run more than one bank in
        parallel. ABSA has surprised on
        rate for premium clients more than
        once.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For mortgage clients we include ABSA
        in the comparison where the profile
        fits. Read also our pieces on{" "}
        <Link
          href="/insights/standard-chartered-mortgage-2026-review"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Standard Chartered mortgage 2026
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

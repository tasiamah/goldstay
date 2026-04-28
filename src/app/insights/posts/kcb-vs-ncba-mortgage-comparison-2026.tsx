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
  slug: "kcb-vs-ncba-mortgage-comparison-2026",
  title:
    "KCB vs NCBA mortgage 2026: the honest comparison",
  description:
    "KCB and NCBA are two of the largest residential mortgage lenders in Kenya, and the choice between them depends on borrower profile and product fit. Here is the honest 2026 comparison on rates, eligibility, diaspora process and total cost.",
  publishedAt: "2026-03-21",
  readingMinutes: 5,
  author: authors.legal,
  tags: [
    "KCB",
    "NCBA",
    "Mortgage",
    "Comparison",
    "Kenya",
    "Finance",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "KCB vs NCBA mortgage 2026 honest comparison Kenya home loan",
};

export default function Article() {
  return (
    <>
      <Lede>
        KCB and NCBA are two of the largest
        residential mortgage lenders in Kenya
        and the choice between them depends on
        borrower profile and product fit. Here
        is the honest 2026 comparison.
      </Lede>

      <H2 id="rates">Rates</H2>

      <UL>
        <LI>
          KCB: CBR plus 2 to 4 percent
          margin
        </LI>
        <LI>
          NCBA: CBR plus 2.5 to 4 percent
          margin
        </LI>
      </UL>

      <P>
        Headline rates are similar.
        Relationship pricing meaningfully
        affects both. Existing customers tend
        to receive 50 to 150 basis points
        better.
      </P>

      <H2 id="eligibility">Eligibility</H2>

      <UL>
        <LI>
          KCB: stronger on payslip-based
          employed borrowers
        </LI>
        <LI>
          NCBA: stronger on SME owner and
          self-employed borrowers with
          credible financials
        </LI>
      </UL>

      <H2 id="diaspora">Diaspora process</H2>

      <UL>
        <LI>
          KCB: largest diaspora desk, most
          processed transactions
        </LI>
        <LI>
          NCBA: credible diaspora process,
          smaller volume
        </LI>
      </UL>

      <H2 id="construction">Construction loans</H2>

      <UL>
        <LI>
          KCB: well-established tranche
          process
        </LI>
        <LI>
          NCBA: similar product; some
          clients prefer the relationship
          team approach
        </LI>
      </UL>

      <H2 id="processing">Processing time</H2>

      <UL>
        <LI>
          KCB: 30 to 60 days typical
        </LI>
        <LI>
          NCBA: 25 to 50 days typical
        </LI>
      </UL>

      <H2 id="who-suits">Who suits which</H2>

      <UL>
        <LI>
          <strong>KCB</strong>: employed
          borrowers, diaspora at scale,
          first-time buyers
        </LI>
        <LI>
          <strong>NCBA</strong>: SME owners,
          premium residential, existing
          relationship customers
        </LI>
      </UL>

      <Callout title="The selection rule">
        Apply to both. Headline rates are
        close enough that relationship
        pricing and process fit decide the
        better offer for any specific
        borrower. The bank that approves on
        the cleanest terms wins, not the
        one with the lowest advertised
        rate.
      </Callout>

      <Pullquote>
        The mortgage market in Kenya is more
        competitive than it looks from the
        rate cards. The actual offers vary
        by borrower; running both
        applications in parallel is usually
        worth the extra effort.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For mortgage clients we run KCB and
        NCBA in parallel where it makes
        sense. Read also our pieces on{" "}
        <Link
          href="/insights/kcb-mortgage-2026-complete-review"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          KCB mortgage 2026
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/ncba-mortgage-2026-complete-review"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          NCBA mortgage 2026
        </Link>
        .
      </P>
    </>
  );
}

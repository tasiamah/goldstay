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
  slug: "salary-needed-buy-karen-home-2026",
  title:
    "How much salary do you need to buy a Karen home in 2026?",
  description:
    "Buying a Karen home is one of the most aspirational property goals in Kenya, and the salary maths is more demanding than most buyers realise. Here is the honest 2026 calculator for buying in Karen, with worked examples at three price points.",
  publishedAt: "2025-12-12",
  readingMinutes: 6,
  author: authors.research,
  tags: [
    "Salary Calculator",
    "Karen",
    "Mortgage",
    "Premium",
    "Affordability",
    "Buyer Guide",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Salary needed to buy Karen home Nairobi 2026 affordability calculator",
};

export default function Article() {
  return (
    <>
      <Lede>
        Buying a Karen home is one of the most
        aspirational property goals in Kenya, and
        the salary maths is more demanding than
        most buyers realise. Here is the honest
        2026 calculator with worked examples at
        three price points.
      </Lede>

      <H2 id="rules">Assumptions</H2>

      <UL>
        <LI>
          DSR cap: 50 percent of net income
        </LI>
        <LI>
          Premium prime LTV: typically 70 to
          80 percent
        </LI>
        <LI>
          Mortgage rate around 14 percent
          variable
        </LI>
        <LI>
          Tenure: 20 to 25 years
        </LI>
        <LI>
          Up-front deposit, stamp duty, legal,
          transfer: around 25 to 30 percent
          of property price
        </LI>
      </UL>

      <H2 id="karen-mid">Karen mid-spec home at KES 80m</H2>

      <UL>
        <LI>
          Loan amount (75 percent LTV): KES
          60m
        </LI>
        <LI>
          Monthly repayment at 14 percent, 25
          years: approximately KES 722,000
        </LI>
        <LI>
          Net monthly income required (50
          percent DSR): approximately KES
          1.44m
        </LI>
        <LI>
          Implied gross income: approximately
          KES 2.1m+ per month
        </LI>
        <LI>
          Up-front cash needed: around KES
          24m to KES 26m
        </LI>
      </UL>

      <H2 id="karen-good">Karen good home at KES 130m</H2>

      <UL>
        <LI>
          Loan amount (70 percent LTV): KES
          91m
        </LI>
        <LI>
          Monthly repayment at 14 percent, 25
          years: approximately KES 1.10m
        </LI>
        <LI>
          Net monthly income required:
          approximately KES 2.20m
        </LI>
        <LI>
          Implied gross income: approximately
          KES 3.2m+ per month
        </LI>
        <LI>
          Up-front cash needed: around KES
          43m to KES 47m
        </LI>
      </UL>

      <H2 id="karen-premium">Karen premium home at KES 250m</H2>

      <UL>
        <LI>
          Most premium Karen homes at this
          price are bought with significant
          equity (own funds, business sale,
          land swap)
        </LI>
        <LI>
          A 50 percent LTV mortgage of KES
          125m would require approximately KES
          1.5m monthly repayment
        </LI>
        <LI>
          Net income required around KES 3m
          per month
        </LI>
        <LI>
          Most buyers in this segment are at
          least partly cash and use the
          mortgage selectively
        </LI>
      </UL>

      <H2 id="ownership">Total cost of ownership</H2>

      <UL>
        <LI>
          Service charge or compound dues:
          KES 50,000 to KES 200,000+ per
          month depending on compound
        </LI>
        <LI>
          Council rates: typically
          significant on larger plots
        </LI>
        <LI>
          Maintenance: 1 to 2 percent of
          property value per year
        </LI>
        <LI>
          Security: KES 30,000 to KES
          150,000+ per month
        </LI>
        <LI>
          Garden, pool and house staff
        </LI>
        <LI>
          Insurance and mortgage protection
        </LI>
      </UL>

      <Callout title="The Karen rule">
        Karen homes at KES 80m and above
        require significant equity and
        durable income. Most realistic buyers
        bring 30 to 50 percent equity and
        leverage selectively. The total cost
        of ownership beyond the mortgage is
        substantial; budget for it
        explicitly.
      </Callout>

      <Pullquote>
        Karen is aspirational for a reason
        and demanding for the same reason.
        The buyers who get there durably do
        so with patient equity build, not
        stretched mortgages.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For Karen sourcing clients we run
        the affordability and ongoing-cost
        conversation honestly before
        recommending purchase. Read also
        our pieces on{" "}
        <Link
          href="/insights/karen-vs-runda-honest-comparison"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Karen vs Runda
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/salary-needed-buy-nairobi-apartment-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          salary for a Nairobi apartment
        </Link>
        .
      </P>
    </>
  );
}

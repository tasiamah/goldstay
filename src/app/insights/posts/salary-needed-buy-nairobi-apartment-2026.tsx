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
  slug: "salary-needed-buy-nairobi-apartment-2026",
  title:
    "How much salary do you need to buy a Nairobi apartment in 2026?",
  description:
    "Working out the actual salary needed to buy a Nairobi apartment requires honest mortgage maths, deposit reality and the total cost of ownership most buyers ignore. Here is the honest 2026 calculator with worked examples for Kilimani, Kileleshwa, Westlands and Lavington.",
  publishedAt: "2026-01-23",
  readingMinutes: 6,
  author: authors.research,
  tags: [
    "Salary Calculator",
    "Nairobi",
    "Mortgage",
    "Buyer Guide",
    "Affordability",
    "First-Time Buyer",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Salary needed to buy Nairobi apartment 2026 affordability calculator",
};

export default function Article() {
  return (
    <>
      <Lede>
        Working out the actual salary needed to
        buy a Nairobi apartment requires honest
        mortgage maths, deposit reality and the
        total cost of ownership most buyers
        ignore. Here is the honest 2026
        calculator with worked examples for
        Kilimani, Kileleshwa, Westlands and
        Lavington.
      </Lede>

      <H2 id="rules">The rules of thumb</H2>

      <UL>
        <LI>
          Most Kenyan banks cap your monthly
          mortgage repayment at around 50
          percent of net (post-tax) income
        </LI>
        <LI>
          Loan-to-value typically 80 to 90
          percent for prime borrowers
        </LI>
        <LI>
          Mortgage rate around CBR plus 2 to 4
          percent margin (variable)
        </LI>
        <LI>
          Tenure typically 20 to 25 years
        </LI>
        <LI>
          Deposit, stamp duty, legal fees and
          transfer costs together typically 13
          to 18 percent of property price up
          front
        </LI>
      </UL>

      <H2 id="kilimani">Kilimani 2-bed at KES 11m</H2>

      <UL>
        <LI>
          Loan amount (90 percent LTV): KES
          9.9m
        </LI>
        <LI>
          Monthly repayment at 14 percent
          variable, 25 years: approximately
          KES 119,000
        </LI>
        <LI>
          Net monthly income required (50
          percent DSR): approximately KES
          238,000
        </LI>
        <LI>
          Implied gross monthly income:
          approximately KES 350,000+
        </LI>
        <LI>
          Up-front cash needed (deposit, stamp
          duty, legal): around KES 1.6m to
          KES 1.9m
        </LI>
      </UL>

      <H2 id="kileleshwa">Kileleshwa 2-bed at KES 16m</H2>

      <UL>
        <LI>
          Loan amount (90 percent LTV): KES
          14.4m
        </LI>
        <LI>
          Monthly repayment at 14 percent, 25
          years: approximately KES 173,000
        </LI>
        <LI>
          Net monthly income required:
          approximately KES 346,000
        </LI>
        <LI>
          Implied gross income: approximately
          KES 510,000+
        </LI>
        <LI>
          Up-front cash needed: around KES
          2.4m to KES 2.8m
        </LI>
      </UL>

      <H2 id="westlands">Westlands 3-bed at KES 28m</H2>

      <UL>
        <LI>
          Loan amount (80 percent LTV): KES
          22.4m
        </LI>
        <LI>
          Monthly repayment at 14 percent, 25
          years: approximately KES 269,000
        </LI>
        <LI>
          Net monthly income required:
          approximately KES 538,000
        </LI>
        <LI>
          Implied gross income: approximately
          KES 800,000+
        </LI>
        <LI>
          Up-front cash needed: around KES
          7.5m to KES 8m (deposit higher at 20
          percent LTV cap on premium prime)
        </LI>
      </UL>

      <H2 id="lavington">Lavington 3-bed at KES 32m</H2>

      <UL>
        <LI>
          Loan amount (80 percent LTV): KES
          25.6m
        </LI>
        <LI>
          Monthly repayment at 14 percent, 25
          years: approximately KES 308,000
        </LI>
        <LI>
          Net monthly income required:
          approximately KES 615,000
        </LI>
        <LI>
          Implied gross income: approximately
          KES 920,000+
        </LI>
        <LI>
          Up-front cash needed: around KES
          8.5m to KES 9m
        </LI>
      </UL>

      <H2 id="ownership">Total cost of ownership</H2>

      <P>
        The mortgage repayment is not the full
        story. Add service charge, council
        rates, building insurance, mortgage
        protection, ongoing maintenance and
        the inevitable surprise costs.
        Conservatively, total monthly cost is
        the mortgage payment plus another 25 to
        40 percent for ongoing costs.
      </P>

      <Callout title="The salary rule">
        For a comfortable Nairobi apartment
        purchase, plan on a household net
        income at least double the mortgage
        payment, and aim for a deposit of
        at least 15 to 20 percent of property
        price plus 5 to 7 percent extra for
        stamp duty, legal and transfer
        costs.
      </Callout>

      <Pullquote>
        Many first-time buyers get the
        mortgage approved and forget the
        service charge, the council rates
        and the maintenance budget. The
        affordability conversation is
        bigger than the mortgage payment.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For sourcing clients we run the
        actual affordability and total cost
        of ownership before recommending
        purchase. Read also our pieces on{" "}
        <Link
          href="/insights/kcb-vs-ncba-mortgage-comparison-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          KCB vs NCBA
        </Link>{" "}
        and our{" "}
        <Link
          href="/yield-calculator"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          yield calculator
        </Link>
        .
      </P>
    </>
  );
}

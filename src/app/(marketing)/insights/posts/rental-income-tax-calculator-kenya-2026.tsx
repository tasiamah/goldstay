import Link from "next/link";
import { authors, type PostMeta } from "./_shared";
import {
  Callout,
  H2,
  KeySummary,
  LI,
  Lede,
  P,
  Pullquote,
  UL,
} from "@/components/ArticleProse";

export const meta: PostMeta = {
  slug: "rental-income-tax-calculator-kenya-2026",
  title:
    "Rental income tax calculator Kenya 2026: worked examples",
  description:
    "Rental income in Kenya is taxed under either Monthly Rental Income (MRI) at 7.5 percent or normal income tax at progressive rates with deductions. Here are the honest 2026 worked examples to help you choose and file.",
  metaDescription:
    "Rental income in Kenya is taxed under either Monthly Rental Income (MRI) at 7.5 percent or normal income tax at progressive rates with deductions.",
  publishedAt: "2025-11-19",
  readingMinutes: 4,
  author: authors.legal,
  tags: [
    "Rental Income",
    "Tax",
    "Calculator",
    "MRI",
    "Kenya",
    "Landlord",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Rental income tax calculator Kenya 2026 worked examples",
};

export default function Article() {
  return (
    <>
      <Lede>
        Rental income in Kenya is taxed under
        either Monthly Rental Income (MRI) at
        7.5 percent of gross rent, or normal
        income tax at progressive rates with
        legitimate deductions. Most landlords
        default to MRI; sometimes normal
        regime is better. Here are the honest
        2026 worked examples.
      </Lede>

      <KeySummary
        question="How is rental income taxed in Kenya in 2026?"
        answer="Two regimes are available to a residential landlord. Monthly Rental Income tax is 7.5 percent of gross rent with no deductions allowed, so on KES 1,200,000 of annual rent the bill is KES 90,000 whatever your costs were. The normal income tax regime instead taxes profit at progressive rates and lets you deduct legitimate expenses, including mortgage interest, which is why a geared landlord often pays less under it: on that same KES 1,200,000 with KES 700,000 of mortgage interest, the taxable figure collapses. Most landlords default to MRI because it is simpler, and for an unmortgaged property that is usually right. The regime is a choice worth working out rather than accepting, and the arithmetic turns mainly on whether you carry debt on the property."
        facts={[
          { label: "MRI rate", value: "7.5% of gross rent, no deductions" },
          {
            label: "Normal regime",
            value: "Progressive rates on profit, deductions allowed",
          },
          { label: "MRI on KES 1.2m rent", value: "KES 90,000" },
          { label: "MRI on KES 600k rent", value: "KES 45,000" },
          {
            label: "What tips the choice",
            value: "Mortgage interest and real costs",
          },
          { label: "Whose liability", value: "The landlord's, not the agent's" },
        ]}
      />

      <H2 id="mri">MRI in summary</H2>

      <UL>
        <LI>
          Applies to residential property
          with annual gross rent below
          defined threshold (KES 15m at
          time of writing; verify current)
        </LI>
        <LI>
          Tax: 7.5 percent of gross rental
          income
        </LI>
        <LI>
          No deductions allowed
        </LI>
        <LI>
          Filed monthly via iTax
        </LI>
        <LI>
          Simple and predictable
        </LI>
      </UL>

      <H2 id="normal">Normal regime in summary</H2>

      <UL>
        <LI>
          Apply if landlord opts in or
          gross rent exceeds threshold
        </LI>
        <LI>
          Tax on net rental income (gross
          rent less allowable deductions)
        </LI>
        <LI>
          Allowable deductions: mortgage
          interest, repairs, insurance,
          property management fees,
          depreciation
        </LI>
        <LI>
          Filed annually
        </LI>
        <LI>
          Better for landlords with
          significant expenses or mortgage
          interest
        </LI>
      </UL>

      <H2 id="examples">Worked examples</H2>

      <P>
        <strong>Example 1: Single
        unit, low expenses</strong>
      </P>

      <UL>
        <LI>
          Gross annual rent: KES 600,000
        </LI>
        <LI>
          MRI: 7.5 percent x KES 600,000
          = KES 45,000
        </LI>
        <LI>
          Allowable expenses if normal
          regime: KES 80,000
        </LI>
        <LI>
          Net income normal regime: KES
          520,000 (taxed at progressive
          rates within personal income
          band)
        </LI>
        <LI>
          MRI is normally simpler and
          competitive for low-expense
          residential rental
        </LI>
      </UL>

      <P>
        <strong>Example 2: Mortgage-financed
        unit, high interest</strong>
      </P>

      <UL>
        <LI>
          Gross annual rent: KES 1,200,000
        </LI>
        <LI>
          MRI: 7.5 percent x KES
          1,200,000 = KES 90,000
        </LI>
        <LI>
          Mortgage interest: KES 700,000
        </LI>
        <LI>
          Other deductible expenses: KES
          120,000
        </LI>
        <LI>
          Net income normal regime: KES
          380,000 (taxed at progressive
          rates)
        </LI>
        <LI>
          Normal regime usually preferable
          where mortgage interest is
          high
        </LI>
      </UL>

      <P>
        <strong>Example 3: Small portfolio,
        no mortgage</strong>
      </P>

      <UL>
        <LI>
          Gross annual rent (3 units):
          KES 2,400,000
        </LI>
        <LI>
          MRI: 7.5 percent x KES
          2,400,000 = KES 180,000
        </LI>
        <LI>
          Allowable expenses normal regime:
          KES 350,000
        </LI>
        <LI>
          Net income normal regime: KES
          2,050,000 (taxed at top personal
          rate)
        </LI>
        <LI>
          Personal income tax on KES
          2,050,000 at marginal rates
          would typically exceed MRI
        </LI>
      </UL>

      <H2 id="company">Company ownership</H2>

      <UL>
        <LI>
          Property held in company: corporate
          income tax 30 percent on net
          income (25 percent for
          qualifying SME)
        </LI>
        <LI>
          Cannot use MRI; normal regime
          applies
        </LI>
        <LI>
          Dividend distribution to
          shareholders subject to 5
          percent withholding
        </LI>
      </UL>

      <H2 id="filing">Filing discipline</H2>

      <UL>
        <LI>
          Register the rental income on
          KRA iTax
        </LI>
        <LI>
          File MRI monthly or normal
          regime annually per opt-in
        </LI>
        <LI>
          Keep records of all rent received
          and expenses
        </LI>
        <LI>
          Tenant withholding under specific
          circumstances
        </LI>
      </UL>

      <Callout title="The rental tax rule">
        For most Nairobi residential
        landlords with no significant
        mortgage interest, MRI at 7.5
        percent is simpler and
        competitive. For mortgage-financed
        units or larger portfolios,
        normal regime can be meaningfully
        cheaper. Run the maths annually.
      </Callout>

      <Pullquote>
        Most landlords pay MRI without
        comparing to normal regime. A
        small minority would save real
        money by switching. Worth the
        annual review.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For landlord clients we coordinate
        with tax advisors on annual
        regime review. Read also our
        pieces on{" "}
        <Link
          href="/insights/property-tax-changes-kenya-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          property taxes Kenya 2026
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/personal-name-vs-company-buying-property-kenya"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          personal name vs company
        </Link>
        .
      </P>
      <P>
        What a managed home here actually earns is set out under{" "}
        <Link
          href="/long-term-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          our long-term management
        </Link>
        .
      </P>
    </>
  );
}

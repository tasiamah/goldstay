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
  slug: "why-most-nairobi-landlords-dont-make-money",
  title:
    "Why most Nairobi landlords don’t actually make money (the honest maths)",
  description:
    "Many Nairobi landlords think they are profitable but are not, once vacancy, management, tax, maintenance, financing and opportunity cost are honestly counted. Here is the honest 2026 explanation of where landlords actually lose money and what separates the profitable ones.",
  publishedAt: "2026-02-28",
  readingMinutes: 5,
  author: authors.research,
  tags: [
    "Landlord",
    "Profit",
    "Nairobi",
    "Honest Maths",
    "Investor",
    "Property",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Why most Nairobi landlords don’t actually make money 2026",
};

export default function Article() {
  return (
    <>
      <Lede>
        Many Nairobi landlords think they
        are profitable but are not, once
        vacancy, management, tax, maintenance,
        financing and opportunity cost are
        honestly counted. Here is the
        honest 2026 explanation.
      </Lede>

      <H2 id="hidden-leaks">Hidden cash flow leaks</H2>

      <UL>
        <LI>
          <strong>Vacancy</strong>: average
          Nairobi rental sits empty 4 to 8
          weeks per turnover; multi-month
          gaps are common in mass-market
        </LI>
        <LI>
          <strong>Tenant default</strong>:
          even with screening, 1 in 8 to
          1 in 12 tenants defaults at
          some stage; the recovery is
          slow
        </LI>
        <LI>
          <strong>Service charge
          arrears</strong>: paid by
          landlord even when tenant
          covers them
        </LI>
        <LI>
          <strong>Repairs and
          maintenance</strong>: average 1
          to 2 percent of property value
          annually
        </LI>
        <LI>
          <strong>Management cost</strong>:
          6 to 10 percent of rent if
          professionally managed; lost in
          time and stress if
          self-managed
        </LI>
        <LI>
          <strong>Tax</strong>: 7.5 percent
          MRI or up to 30 percent
          corporate
        </LI>
        <LI>
          <strong>Insurance, rates,
          land rent</strong>
        </LI>
      </UL>

      <H2 id="leverage">The leverage trap</H2>

      <UL>
        <LI>
          Mortgage interest rate 11 to 14
          percent
        </LI>
        <LI>
          Quality mid-market gross yield 9
          to 13 percent
        </LI>
        <LI>
          Net yield after operating cost 6
          to 9 percent
        </LI>
        <LI>
          Net yield below mortgage rate
          means leveraged landlord pays
          out of pocket monthly
        </LI>
        <LI>
          Capital appreciation has to do
          the heavy lifting; vulnerable
          to soft market
        </LI>
      </UL>

      <H2 id="opportunity-cost">Opportunity cost</H2>

      <UL>
        <LI>
          Money tied in property could
          have been in REITs at 8 to 11
          percent yield with no
          management
        </LI>
        <LI>
          Could have been in T-Bills at
          10 to 13 percent yield with
          zero risk
        </LI>
        <LI>
          The honest comparison is the
          property total return versus
          alternative
        </LI>
      </UL>

      <H2 id="who-makes">Who actually makes money</H2>

      <UL>
        <LI>
          Cash buyers (no leverage drag)
          on quality stock
        </LI>
        <LI>
          Professionally managed multi-unit
          (scale economics)
        </LI>
        <LI>
          Landlords who pick the right
          compound and tenant pool
        </LI>
        <LI>
          Long-tenure owners who let
          appreciation compound
        </LI>
        <LI>
          Landlords who actually file tax
          properly (avoid penalty
          surprise)
        </LI>
      </UL>

      <H2 id="who-doesnt">Who does not make money</H2>

      <UL>
        <LI>
          Single-unit, leveraged, weak
          compound, self-managed,
          undeclared tenant defaults
        </LI>
        <LI>
          Speculative plot holders waiting
          for marketing-driven
          appreciation
        </LI>
        <LI>
          Off-plan buyers in delivered
          oversupplied tower clusters
        </LI>
        <LI>
          Diaspora landlords without
          professional management who
          watch tenants overstay and
          default
        </LI>
      </UL>

      <H2 id="discipline">Discipline that turns it around</H2>

      <UL>
        <LI>
          Professional management
        </LI>
        <LI>
          Honest accounting (full P&L
          quarterly)
        </LI>
        <LI>
          Tenant screening discipline
        </LI>
        <LI>
          Property in quality compound
        </LI>
        <LI>
          Tax filed properly (penalty
          avoidance)
        </LI>
        <LI>
          Sinking fund for major repairs
        </LI>
        <LI>
          Long-tenure horizon
        </LI>
      </UL>

      <Callout title="The landlord profit rule">
        Most Nairobi landlords are
        profitable on paper and unprofitable
        on honest accounting. The
        discipline that turns it around
        is professional management,
        honest accounting, quality
        compound and long-tenure
        horizon. The shortcuts almost
        always cost more than the savings.
      </Callout>

      <Pullquote>
        Property is one of the few
        businesses where the people
        running it think they are
        profitable until they actually
        do the maths.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For landlord clients we run
        professional management with
        quarterly honest reporting. Read
        also our pieces on{" "}
        <Link
          href="/insights/cost-of-property-management-kenya-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          cost of property management
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/why-property-management-matters-diaspora-landlords"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          why management matters
        </Link>
        .
      </P>
    </>
  );
}

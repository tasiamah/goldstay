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
  slug: "total-cost-ownership-nairobi-apartment-2026",
  title:
    "The total cost of owning a Nairobi apartment in 2026",
  description:
    "Most Nairobi apartment buyers focus on the mortgage payment and ignore everything else. The total cost of ownership runs 30 to 50 percent above the mortgage on a typical compound. Here is the honest 2026 breakdown of what owning an apartment in Nairobi actually costs each year.",
  publishedAt: "2025-11-06",
  readingMinutes: 6,
  author: authors.research,
  tags: [
    "Total Cost",
    "Ownership",
    "Apartment",
    "Nairobi",
    "Buyer Guide",
    "Affordability",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Total cost of owning Nairobi apartment 2026 buyer affordability",
};

export default function Article() {
  return (
    <>
      <Lede>
        Most Nairobi apartment buyers focus on the
        mortgage payment and ignore everything
        else. The total cost of ownership runs 30
        to 50 percent above the mortgage on a
        typical compound. Here is the honest
        2026 breakdown of what an apartment in
        Nairobi actually costs each year.
      </Lede>

      <H2 id="example">Worked example: KES 12m 2-bed in Kilimani</H2>

      <UL>
        <LI>
          Mortgage (90 percent LTV, 14
          percent, 25 years): approximately
          KES 130,000 per month
        </LI>
        <LI>
          Service charge: KES 12,000 to KES
          25,000 per month
        </LI>
        <LI>
          Council rates: KES 8,000 to KES
          15,000 per year
        </LI>
        <LI>
          Building insurance: KES 8,000 to
          KES 15,000 per year
        </LI>
        <LI>
          Mortgage protection: typically
          included with mortgage
        </LI>
        <LI>
          Backup power and water (where
          relevant): KES 5,000 to KES 12,000
          per month
        </LI>
        <LI>
          Maintenance reserve: KES 5,000 to
          KES 10,000 per month
        </LI>
        <LI>
          Internet, DStv: KES 5,000 to KES
          10,000 per month
        </LI>
      </UL>

      <H2 id="annual">Annual total</H2>

      <UL>
        <LI>
          Mortgage: KES 1.56m
        </LI>
        <LI>
          Service charge: KES 200,000+
        </LI>
        <LI>
          Council rates and insurance: KES
          25,000 to KES 35,000
        </LI>
        <LI>
          Backup, internet, maintenance: KES
          200,000 to KES 350,000
        </LI>
        <LI>
          <strong>Total typical annual cost:
          KES 2.0m to KES 2.2m</strong>
        </LI>
        <LI>
          Mortgage payment is 70 to 80
          percent of total
        </LI>
      </UL>

      <H2 id="hidden">The hidden costs</H2>

      <UL>
        <LI>
          Special levies (when the compound
          fixes something major)
        </LI>
        <LI>
          Major appliance replacement
          (fridge, water heater)
        </LI>
        <LI>
          Surface and pool maintenance
          assessments
        </LI>
        <LI>
          KRA monthly residential income tax
          (if rented out)
        </LI>
        <LI>
          Vacancy void if you have to find
          a new tenant
        </LI>
      </UL>

      <H2 id="rented">If rented out</H2>

      <UL>
        <LI>
          Property management: 8 to 12
          percent of rent
        </LI>
        <LI>
          MRI (Monthly Rental Income tax):
          7.5 percent of gross rent
        </LI>
        <LI>
          Tenant agency commission on new
          tenants: 1 month rent
        </LI>
        <LI>
          Allowance for vacancy and
          turnover: 5 to 10 percent of
          potential rent annually
        </LI>
      </UL>

      <Callout title="The total cost rule">
        Plan for total annual cost of 1.7
        to 1.9 times the mortgage payment.
        For a KES 12m apartment with KES
        130,000 monthly mortgage, expect KES
        2m to KES 2.2m total annual cost
        when self-occupied, before
        considering opportunity cost on the
        deposit.
      </Callout>

      <Pullquote>
        The mortgage payment is the most
        visible cost of homeownership and
        not the largest in percentage
        terms. The buyers who plan for the
        full picture sleep better.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For sourcing and management
        clients we run the full cost
        breakdown before purchase. Read
        also our pieces on{" "}
        <Link
          href="/insights/service-charge-nairobi-apartments-explained"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          service charge explained
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/salary-needed-buy-nairobi-apartment-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          salary needed
        </Link>
        .
      </P>
    </>
  );
}

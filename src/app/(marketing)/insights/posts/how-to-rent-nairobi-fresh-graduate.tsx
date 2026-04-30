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
  slug: "how-to-rent-nairobi-fresh-graduate",
  title:
    "How to rent in Nairobi as a fresh graduate",
  description:
    "Fresh graduates in Nairobi face specific challenges renting their first apartment. First-job income, no rental history, agent fees and the specific suburbs that match a graduate budget. Here is the honest 2026 step-by-step guide.",
  publishedAt: "2025-12-19",
  readingMinutes: 5,
  author: authors.editors,
  tags: [
    "Fresh Graduate",
    "Renting",
    "Nairobi",
    "First Apartment",
    "Tenant",
    "Property",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "How to rent Nairobi fresh graduate 2026 first apartment guide",
};

export default function Article() {
  return (
    <>
      <Lede>
        Fresh graduates in Nairobi face specific
        challenges renting their first
        apartment. First-job income, no rental
        history, agent fees and the specific
        suburbs that match a graduate budget.
        Here is the honest 2026 step-by-step
        guide.
      </Lede>

      <H2 id="budget">2026 graduate budget reality</H2>

      <UL>
        <LI>
          Entry-level salary in Nairobi:
          KES 35,000 to KES 90,000 per
          month
        </LI>
        <LI>
          Senior entry (top consulting,
          banking, tech): KES 80,000 to
          KES 200,000+
        </LI>
        <LI>
          Rule of thumb: rent at 25 to 33
          percent of net pay
        </LI>
        <LI>
          So entry: KES 8,000 to KES 30,000
          rent
        </LI>
        <LI>
          Senior entry: KES 25,000 to KES
          70,000 rent
        </LI>
      </UL>

      <H2 id="suburbs">Where graduates rent</H2>

      <UL>
        <LI>
          <strong>Kilimani fringe and Yaya
          area</strong>: KES 30,000 to KES
          50,000 (1-bed)
        </LI>
        <LI>
          <strong>Kileleshwa and
          Hurlingham fringe</strong>: KES
          35,000 to KES 60,000 (1-bed)
        </LI>
        <LI>
          <strong>South B and South C</strong>:
          KES 18,000 to KES 32,000 (1-bed)
        </LI>
        <LI>
          <strong>Kasarani and Roysambu</strong>:
          KES 10,000 to KES 22,000 (1-bed)
        </LI>
        <LI>
          <strong>Pipeline and Embakasi</strong>:
          KES 7,000 to KES 18,000 (bedsitter
          to 1-bed)
        </LI>
        <LI>
          <strong>Donholm and Kahawa Sukari</strong>:
          KES 12,000 to KES 25,000 (1-bed)
        </LI>
      </UL>

      <H2 id="documents">Documents typically needed</H2>

      <UL>
        <LI>
          National ID
        </LI>
        <LI>
          Employer letter or contract
          (probationary contracts are fine)
        </LI>
        <LI>
          Recent payslip (one or two
          months)
        </LI>
        <LI>
          KRA PIN (often requested)
        </LI>
        <LI>
          Reference contact (a family
          member or previous landlord)
        </LI>
      </UL>

      <H2 id="costs">Move-in costs to budget for</H2>

      <UL>
        <LI>
          1 month rent in advance
        </LI>
        <LI>
          1 to 2 months security deposit
        </LI>
        <LI>
          Agent fee (often 1
          month’s rent)
        </LI>
        <LI>
          Service charge (if separate)
        </LI>
        <LI>
          Cooking gas refundable cylinder
          deposit
        </LI>
        <LI>
          Internet installation
        </LI>
        <LI>
          Basic furnishing (bed, mattress,
          fridge, cooker, basic kitchen)
        </LI>
      </UL>

      <H2 id="house-share">House-share option</H2>

      <UL>
        <LI>
          Shared 2 or 3-bed in Kilimani,
          Lavington fringe, Westlands fringe
          works for many graduates
        </LI>
        <LI>
          Cuts cost in half; better suburb
          access
        </LI>
        <LI>
          Pick housemates carefully;
          friendship and house-share are
          different relationships
        </LI>
        <LI>
          Document the cost-share in
          writing
        </LI>
      </UL>

      <H2 id="mistakes">Common graduate mistakes</H2>

      <UL>
        <LI>
          Stretching to a suburb beyond
          honest budget
        </LI>
        <LI>
          Skipping deposit documentation
        </LI>
        <LI>
          Paying cash without receipt
        </LI>
        <LI>
          Picking the unit on Instagram
          without compound diligence
        </LI>
        <LI>
          Underestimating service charge
          and total cost
        </LI>
      </UL>

      <Callout title="The graduate rule">
        Pick the suburb that matches your
        honest budget. Rent at 25 to 33
        percent of net pay. Document
        everything. Build credit and
        savings before stretching to a
        better suburb. The first apartment
        is the foundation; do not turn it
        into a financial trap.
      </Callout>

      <Pullquote>
        The graduates who control rent in
        the first three years build the
        savings to buy by their early
        thirties. The ones who stretch
        on rent rarely do.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For first-time renters we run honest
        budget and suburb advice. Read also
        our pieces on{" "}
        <Link
          href="/insights/cheapest-decent-suburbs-nairobi-2026-buyer-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          cheapest decent suburbs Nairobi
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/how-to-negotiate-rent-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how to negotiate rent Nairobi
        </Link>
        .
      </P>
    </>
  );
}

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
  slug: "co-living-nairobi-emerging-investor-segment",
  title:
    "Co-living in Nairobi: the emerging investor segment",
  description:
    "Co-living, the model of multiple unrelated tenants sharing a residence with private rooms and common amenity, is a small but growing investor segment in Nairobi. Here is the honest 2026 guide on the model, the numbers and the risks.",
  publishedAt: "2025-12-07",
  readingMinutes: 5,
  author: authors.research,
  tags: [
    "Co-Living",
    "Nairobi",
    "Investor",
    "Rental",
    "Property",
    "Investment",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Co-living Nairobi 2026 emerging investor segment guide",
};

export default function Article() {
  return (
    <>
      <Lede>
        Co-living, the model of multiple
        unrelated tenants sharing a residence
        with private rooms and common amenity,
        is a small but growing investor segment
        in Nairobi. Younger working
        professionals, recently relocated
        graduates, digital nomads. Here is the
        honest 2026 guide.
      </Lede>

      <H2 id="model">The model</H2>

      <UL>
        <LI>
          Acquire a 4 to 6-bed townhouse or
          standalone home
        </LI>
        <LI>
          Refurbish: en-suite each room,
          common kitchen, common lounge,
          fast Wi-Fi, work areas
        </LI>
        <LI>
          Let on a per-room basis with
          inclusive bills
        </LI>
        <LI>
          Operate professionally with
          cleaning, dispute resolution and
          tenant placement
        </LI>
      </UL>

      <H2 id="numbers">The 2026 numbers</H2>

      <UL>
        <LI>
          5-bed townhouse, Lavington fringe:
          KES 35m to KES 65m
        </LI>
        <LI>
          Refurb to co-living standard: KES
          1.5m to KES 4m
        </LI>
        <LI>
          Per-room rent inclusive: KES
          45,000 to KES 80,000
        </LI>
        <LI>
          5 rooms occupied: KES 225,000 to
          KES 400,000 monthly gross
        </LI>
        <LI>
          Net yield after operations and
          vacancy: 9 to 13 percent
        </LI>
      </UL>

      <H2 id="suburbs">Where it works</H2>

      <UL>
        <LI>
          Kilimani: tech and digital
          nomad cohort
        </LI>
        <LI>
          Lavington fringe: working
          professionals
        </LI>
        <LI>
          Westlands fringe: corporate
          short-stay
        </LI>
        <LI>
          Kileleshwa: mid-career
          professionals
        </LI>
        <LI>
          Hurlingham: medical and
          professional
        </LI>
      </UL>

      <H2 id="advantages">Advantages</H2>

      <UL>
        <LI>
          Higher gross yield per square
          metre than conventional rental
        </LI>
        <LI>
          Diversified tenant risk
        </LI>
        <LI>
          Premium positioning where the
          quality of fit-out is high
        </LI>
        <LI>
          Captures younger working
          professional cohort under-served
          by traditional residential
        </LI>
      </UL>

      <H2 id="risks">Risks</H2>

      <UL>
        <LI>
          Operational complexity
        </LI>
        <LI>
          Compound rules may restrict
          shared occupancy; verify before
          purchase
        </LI>
        <LI>
          Higher tenant turnover
        </LI>
        <LI>
          Conflict resolution between
          unrelated tenants
        </LI>
        <LI>
          Tax: rental income across all
          rooms is taxable
        </LI>
      </UL>

      <H2 id="finance">Finance</H2>

      <UL>
        <LI>
          Bank mortgage available; treated
          as investment property if not
          owner-occupied
        </LI>
        <LI>
          Refurb cost typically self-funded
          or via short-term facility
        </LI>
      </UL>

      <Callout title="The co-living rule">
        Co-living works in Nairobi for
        investors with operational appetite
        and the right property selection.
        Compound rules and tenant
        management are the central skills.
        Done well, gross yields beat
        conventional rental.
      </Callout>

      <Pullquote>
        Co-living in Nairobi is small
        today and growing. The investors
        entering at scale today are
        building the brand recognition the
        wider market will pay a premium
        for in five years.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For co-living investors we run
        sourcing, refurb coordination and
        operations. Read also our pieces
        on{" "}
        <Link
          href="/insights/student-housing-investment-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          student housing investment
          Nairobi
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/multi-unit-property-investment-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          multi-unit property investment
          Nairobi
        </Link>
        .
      </P>
    </>
  );
}

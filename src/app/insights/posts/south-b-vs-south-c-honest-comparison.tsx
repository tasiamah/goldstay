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
  slug: "south-b-vs-south-c-honest-comparison",
  title:
    "South B vs South C: the honest 2026 comparison",
  description:
    "South B and South C are two of the most active mid-market residential pockets in Nairobi, and the differences between them matter more than the names suggest. Here is the honest 2026 comparison on price, lifestyle, schools and rental dynamics.",
  publishedAt: "2025-06-07",
  readingMinutes: 5,
  author: authors.editors,
  tags: [
    "South B",
    "South C",
    "Nairobi",
    "Comparison",
    "Mid-Market",
    "Property",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "South B vs South C Nairobi 2026 honest mid-market comparison",
};

export default function Article() {
  return (
    <>
      <Lede>
        South B and South C are two of the most
        active mid-market residential pockets in
        Nairobi. They are often grouped together
        but the differences are real, and they
        matter for buyers and tenants. Here is
        the honest 2026 comparison.
      </Lede>

      <H2 id="character">Character</H2>

      <UL>
        <LI>
          <strong>South B</strong>: closer to
          the city centre and the Industrial
          Area; mostly older mid-market and
          some apartment supply
        </LI>
        <LI>
          <strong>South C</strong>: established
          residential with a stronger
          family-home base; closer to
          Mombasa Road and the airport route
        </LI>
      </UL>

      <H2 id="prices">Prices in 2026</H2>

      <UL>
        <LI>
          South B 2-bed: KES 5m to KES 9m
        </LI>
        <LI>
          South C 2-bed: KES 6m to KES 11m
        </LI>
        <LI>
          South B 3-bed: KES 8m to KES 14m
        </LI>
        <LI>
          South C 3-bed: KES 10m to KES 18m
        </LI>
        <LI>
          South C family standalone: KES 18m
          to KES 50m
        </LI>
      </UL>

      <H2 id="rents">Rents</H2>

      <UL>
        <LI>
          South B 2-bed: KES 28,000 to KES
          50,000
        </LI>
        <LI>
          South C 2-bed: KES 32,000 to KES
          60,000
        </LI>
        <LI>
          South B 3-bed: KES 42,000 to KES
          75,000
        </LI>
        <LI>
          South C 3-bed: KES 50,000 to KES
          90,000
        </LI>
      </UL>

      <H2 id="who">Who lives where</H2>

      <UL>
        <LI>
          <strong>South B</strong>: working
          professionals, civil servants,
          industrial-area workers, students
        </LI>
        <LI>
          <strong>South C</strong>: families,
          senior professionals, airport-route
          workers, longer-tenure residents
        </LI>
      </UL>

      <H2 id="risks">Risks</H2>

      <UL>
        <LI>
          Both can be affected by industrial
          adjacency; verify the specific
          compound
        </LI>
        <LI>
          South B oversupply in pockets is
          real
        </LI>
        <LI>
          Some 2010s-era compounds are
          ageing faster than expected
        </LI>
        <LI>
          Service charge governance varies
        </LI>
      </UL>

      <Callout title="The South B vs South C rule">
        South C generally commands a 15 to
        25 percent premium for similar
        space, with stronger residential
        character and longer tenant
        tenures. South B works better for
        yield-focused investors at lower
        ticket sizes.
      </Callout>

      <Pullquote>
        Many Nairobi buyers treat South B
        and South C as one market. The
        renters know better. The two
        suburbs serve different audiences
        and produce different outcomes.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For sourcing clients targeting
        either, we run compound diligence
        and tenant-profile mapping. Read
        also our pieces on{" "}
        <Link
          href="/insights/cheapest-decent-suburbs-nairobi-2026-buyer-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          cheapest decent suburbs Nairobi
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/best-neighbourhoods-nairobi-rental-yield-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          best neighbourhoods for rental yield
        </Link>
        .
      </P>
    </>
  );
}

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
  slug: "hurlingham-complete-guide-2026",
  title:
    "Hurlingham: the complete 2026 guide",
  description:
    "Hurlingham sits between Kilimani and Yaya, with strong walkability, the Aga Khan Hospital nearby and a mid-premium apartment market. Here is the honest 2026 guide on Hurlingham property and how the market actually works.",
  publishedAt: "2025-05-21",
  readingMinutes: 5,
  author: authors.editors,
  tags: [
    "Hurlingham",
    "Nairobi",
    "Buyer Guide",
    "Apartment",
    "Property",
    "Mid-Premium",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Hurlingham Nairobi 2026 complete property guide apartment",
};

export default function Article() {
  return (
    <>
      <Lede>
        Hurlingham sits between Kilimani and Yaya
        Centre, anchored by the Aga Khan University
        Hospital, the Yaya Centre retail cluster
        and a mid-premium apartment market with
        strong walkability. Here is the honest
        2026 guide.
      </Lede>

      <H2 id="character">Character</H2>

      <P>
        Hurlingham is one of the most walkable
        residential clusters in Nairobi.
        Restaurants, cafes, the hospital, retail
        and offices all within a 10 minute walk
        from most addresses. The apartment stock
        is mostly mid-premium, with some older
        townhouses and standalone homes still
        scattered through.
      </P>

      <H2 id="prices">Prices in 2026</H2>

      <UL>
        <LI>
          1-bed apartment: KES 6.5m to KES 11m
        </LI>
        <LI>
          2-bed apartment: KES 10m to KES 20m
        </LI>
        <LI>
          3-bed apartment: KES 15m to KES 30m
        </LI>
        <LI>
          Townhouse: KES 25m to KES 60m
        </LI>
      </UL>

      <H2 id="rents">Rents</H2>

      <UL>
        <LI>
          1-bed apartment: KES 50,000 to KES
          85,000
        </LI>
        <LI>
          2-bed apartment: KES 75,000 to KES
          135,000
        </LI>
        <LI>
          3-bed apartment: KES 110,000 to KES
          200,000
        </LI>
      </UL>

      <H2 id="who">Who buys here</H2>

      <UL>
        <LI>
          Aga Khan medical professionals
        </LI>
        <LI>
          Senior corporate professionals
          valuing walkability
        </LI>
        <LI>
          Yield-focused investors
        </LI>
        <LI>
          Diplomatic families (rental)
        </LI>
        <LI>
          Singles and couples without
          children
        </LI>
      </UL>

      <H2 id="risks">Risks</H2>

      <UL>
        <LI>
          Density is high; choose compounds
          with good amenity-to-unit ratios
        </LI>
        <LI>
          Service charge discipline varies
        </LI>
        <LI>
          Some 2010s-era compounds are
          ageing faster than expected
        </LI>
        <LI>
          Limited family-sized housing
          inventory
        </LI>
      </UL>

      <Callout title="The Hurlingham rule">
        Hurlingham is among the most
        walkable Nairobi addresses. For
        professionals, medical staff and
        couples without children, it works
        well. Family buyers usually do
        better in Lavington or Kilimani
        adjacencies.
      </Callout>

      <Pullquote>
        Walkability is undervalued in
        Nairobi’s pricing. Hurlingham
        is one of the few addresses where
        you can actually walk to dinner and
        the hospital both, and the rental
        market reflects that.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For Hurlingham sourcing clients we
        run compound diligence and
        walkability scoring. Read also our
        pieces on{" "}
        <Link
          href="/insights/kileleshwa-complete-guide-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Kileleshwa
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/lavington-complete-guide-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Lavington
        </Link>
        .
      </P>
    </>
  );
}

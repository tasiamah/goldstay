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
  slug: "kilimani-vs-hurlingham-professionals",
  title:
    "Kilimani vs Hurlingham: which suits Nairobi professionals?",
  description:
    "Kilimani and Hurlingham sit next to each other in Nairobi but they serve different professional buyer profiles. Here is the honest 2026 comparison on price, walkability, healthcare adjacency and rental yield for working professionals.",
  publishedAt: "2026-03-25",
  readingMinutes: 5,
  author: authors.editors,
  tags: [
    "Kilimani",
    "Hurlingham",
    "Nairobi",
    "Comparison",
    "Professionals",
    "Buyer Guide",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Kilimani vs Hurlingham Nairobi 2026 honest professionals comparison",
};

export default function Article() {
  return (
    <>
      <Lede>
        Kilimani and Hurlingham sit next to each
        other in Nairobi but they serve
        different professional buyer profiles.
        Both walkable, both apartment-led, both
        adjacent to major hospitals. The
        differences are real and consequential.
        Here is the honest 2026 comparison.
      </Lede>

      <H2 id="character">Character</H2>

      <UL>
        <LI>
          <strong>Kilimani</strong>: tower-led
          with a mix of mid-premium and
          premium apartment supply, more
          commercial fringe, denser feel
        </LI>
        <LI>
          <strong>Hurlingham</strong>: more
          compact, more walkable, hospital-
          adjacent, residential edge feel
        </LI>
      </UL>

      <H2 id="prices">Prices (2-bed apartment)</H2>

      <UL>
        <LI>
          Kilimani: KES 9m to KES 18m
        </LI>
        <LI>
          Hurlingham: KES 10m to KES 20m
        </LI>
      </UL>

      <H2 id="rents">Rents (2-bed apartment)</H2>

      <UL>
        <LI>
          Kilimani: KES 60,000 to KES 110,000
        </LI>
        <LI>
          Hurlingham: KES 75,000 to KES
          135,000
        </LI>
      </UL>

      <H2 id="walkability">Walkability and amenities</H2>

      <UL>
        <LI>
          Kilimani: Yaya, Adams Arcade,
          restaurants, gym chains
        </LI>
        <LI>
          Hurlingham: Yaya Centre, Aga Khan
          Hospital, restaurants, more
          residential street feel
        </LI>
      </UL>

      <H2 id="hospitals">Healthcare adjacency</H2>

      <UL>
        <LI>
          Kilimani: Aga Khan reachable, Nairobi
          Hospital reachable
        </LI>
        <LI>
          Hurlingham: Aga Khan walkable
          (huge advantage for medical
          professionals); Nairobi Hospital
          reachable
        </LI>
      </UL>

      <H2 id="who-suits">Who suits which</H2>

      <UL>
        <LI>
          <strong>Medical professionals</strong>:
          Hurlingham (Aga Khan walkability)
        </LI>
        <LI>
          <strong>Tech and corporate
          professionals</strong>: Either; Kilimani
          for the tower amenity, Hurlingham for
          the calmer residential feel
        </LI>
        <LI>
          <strong>Yield investor</strong>:
          Kilimani (more inventory, broader
          tenant pool)
        </LI>
        <LI>
          <strong>Family with children</strong>:
          Neither is ideal; consider Lavington
          or Kileleshwa standalone instead
        </LI>
      </UL>

      <Callout title="The selection rule">
        Hurlingham for medical professionals
        and tenants who want walkability and
        residential calm. Kilimani for
        corporate professionals who want
        tower amenity and slightly cheaper
        comparable inventory. Both work; the
        choice should match the buyer’s
        honest profile.
      </Callout>

      <Pullquote>
        Two adjacent suburbs, two different
        markets. The walkability advantage
        of Hurlingham is undervalued in the
        wider conversation.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For sourcing clients targeting either,
        we run compound and walkability
        scoring. Read also our pieces on{" "}
        <Link
          href="/insights/kilimani-apartment-market-changing-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Kilimani in 2026
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/hurlingham-complete-guide-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Hurlingham
        </Link>
        .
      </P>
    </>
  );
}

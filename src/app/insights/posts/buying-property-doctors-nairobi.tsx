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
  slug: "buying-property-doctors-nairobi",
  title:
    "Buying property as a doctor in Nairobi: the honest 2026 guide",
  description:
    "Doctors and senior medical professionals in Nairobi face a particular set of property buying considerations: hospital adjacency, on-call commute, mortgage on consultancy income, and the long career arc. Here is the honest 2026 guide for doctors buying property in Nairobi.",
  publishedAt: "2025-07-21",
  readingMinutes: 6,
  author: authors.editors,
  tags: [
    "Doctor",
    "Medical",
    "Nairobi",
    "Buyer Guide",
    "Hospital",
    "Property",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Buying property as a doctor Nairobi 2026 hospital adjacency guide",
};

export default function Article() {
  return (
    <>
      <Lede>
        Doctors and senior medical professionals
        in Nairobi face a particular set of
        property buying considerations: hospital
        adjacency, on-call commute, mortgage on
        consultancy income and the long career
        arc. Here is the honest 2026 guide.
      </Lede>

      <H2 id="hospital">Hospital adjacency</H2>

      <UL>
        <LI>
          Aga Khan University Hospital,
          Hurlingham: Hurlingham, Westlands,
          Kileleshwa, Lavington
        </LI>
        <LI>
          Nairobi Hospital, Upper Hill:
          Upper Hill, Kilimani, Hurlingham
        </LI>
        <LI>
          Karen Hospital: Karen,
          Lang’ata, Karen-Langata
          fringe
        </LI>
        <LI>
          MP Shah, Parklands: Parklands,
          Westlands, Highridge
        </LI>
        <LI>
          Kenyatta National Hospital, Upper
          Hill: Upper Hill, Kilimani,
          Hurlingham
        </LI>
        <LI>
          Mater Hospital, South B: South B,
          South C, Lang’ata
        </LI>
      </UL>

      <H2 id="commute">On-call commute</H2>

      <UL>
        <LI>
          Senior consultants on regular
          on-call benefit from
          15-minute hospital adjacency
        </LI>
        <LI>
          GP and elective practice has more
          flexibility
        </LI>
        <LI>
          Avoid Mombasa Road and Lang’ata
          Road traffic if doing late-night
          on-call commutes
        </LI>
      </UL>

      <H2 id="mortgage">Mortgage on consultancy income</H2>

      <UL>
        <LI>
          Consultant doctors with split
          private and salaried income
          typically use NCBA or Stanbic
        </LI>
        <LI>
          Banks accept clean records of
          private practice income with
          credible book of patients
        </LI>
        <LI>
          KRA tax compliance is essential;
          irregular tax filings disqualify
          some applications
        </LI>
        <LI>
          Some doctors use a 50/50 split
          between salaried base and private
          consultancy as the bankable
          income
        </LI>
      </UL>

      <H2 id="suburbs">Suburbs that work</H2>

      <UL>
        <LI>
          Hurlingham (multi-hospital adjacency
          and walkability)
        </LI>
        <LI>
          Lavington (premium family,
          hospital reachable)
        </LI>
        <LI>
          Westlands towers (apartment with
          Aga Khan adjacency)
        </LI>
        <LI>
          Kilimani (mid-premium, hospital
          adjacent)
        </LI>
        <LI>
          Karen (premium space, Karen
          Hospital adjacent)
        </LI>
      </UL>

      <H2 id="career">The long career arc</H2>

      <UL>
        <LI>
          Early career: rented apartment
          near training hospital
        </LI>
        <LI>
          Mid career: first apartment
          purchase, often in Hurlingham,
          Kilimani or Westlands
        </LI>
        <LI>
          Established consultant: family
          home in Lavington, Karen,
          Kileleshwa or premium
          neighbourhood near practice
        </LI>
        <LI>
          Senior consultant: family home
          plus rental investment property
        </LI>
      </UL>

      <Callout title="The doctor rule">
        Hospital adjacency and on-call
        commute are the central practical
        considerations. Bankable income
        often combines salary and private
        practice; align tax compliance
        early to support clean mortgage
        applications. The career arc is
        long; build the property base
        deliberately.
      </Callout>

      <Pullquote>
        For senior medical professionals,
        the property near the hospital is
        not a luxury. It is the difference
        between sleeping at home or
        sleeping at the hospital after a
        late on-call.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For medical professional sourcing
        clients we run the hospital
        adjacency and consultancy income
        diligence. Read also our pieces on{" "}
        <Link
          href="/insights/hurlingham-complete-guide-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Hurlingham
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/karen-vs-runda-honest-comparison"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Karen vs Runda
        </Link>
        .
      </P>
    </>
  );
}

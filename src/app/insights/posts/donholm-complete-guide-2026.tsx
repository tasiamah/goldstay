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
  slug: "donholm-complete-guide-2026",
  title:
    "Donholm: the complete 2026 guide",
  description:
    "Donholm sits on Outer Ring Road in eastern Nairobi, a planned mid-market estate with deep multigenerational roots, established schools and a substantial residential and rental market. Here is the honest 2026 guide on Donholm property and how the market actually works.",
  publishedAt: "2026-03-31",
  readingMinutes: 5,
  author: authors.editors,
  tags: [
    "Donholm",
    "Nairobi",
    "Mid-Market",
    "Family",
    "Eastern Nairobi",
    "Buyer Guide",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Donholm Nairobi 2026 mid-market family property guide",
};

export default function Article() {
  return (
    <>
      <Lede>
        Donholm sits on Outer Ring Road in
        eastern Nairobi, a planned mid-market
        estate with deep multigenerational roots,
        established schools and a substantial
        residential and rental market. Less
        talked about than Westlands but
        consistently active among Nairobi’s
        mid-market buyers and tenants. Here is
        the honest 2026 guide.
      </Lede>

      <H2 id="character">Character</H2>

      <P>
        Donholm was developed as a planned
        residential estate in the 1970s and 80s
        and the original character still
        dominates the core. Maisonettes,
        community schools, established mid-market
        feel. Newer apartment supply sits at the
        edges and along Outer Ring Road.
      </P>

      <H2 id="prices">Prices in 2026</H2>

      <UL>
        <LI>
          Original Donholm maisonette: KES 6m
          to KES 14m
        </LI>
        <LI>
          Renovated Donholm maisonette: KES
          12m to KES 22m
        </LI>
        <LI>
          New apartment 2-bed: KES 4m to KES
          7m
        </LI>
        <LI>
          New apartment 3-bed: KES 6m to KES
          10m
        </LI>
      </UL>

      <H2 id="rents">Rents</H2>

      <UL>
        <LI>
          Maisonette: KES 35,000 to KES 65,000
        </LI>
        <LI>
          2-bed apartment: KES 18,000 to KES
          32,000
        </LI>
        <LI>
          3-bed apartment: KES 28,000 to KES
          50,000
        </LI>
      </UL>

      <H2 id="who">Who lives here</H2>

      <UL>
        <LI>
          Multigenerational Nairobi families
        </LI>
        <LI>
          Working professionals
        </LI>
        <LI>
          First-time buyers
        </LI>
        <LI>
          Yield-focused investors targeting
          mass-market rental
        </LI>
      </UL>

      <H2 id="risks">Risks</H2>

      <UL>
        <LI>
          Original-stock houses often need
          modernisation budget
        </LI>
        <LI>
          Some apartment compounds at the
          edges have weaker governance
        </LI>
        <LI>
          Outer Ring Road traffic at peak
        </LI>
        <LI>
          Title diligence on subdivisions
        </LI>
      </UL>

      <Callout title="The Donholm rule">
        Donholm is a stable mid-market family
        suburb with strong community fabric.
        For multigenerational families,
        first-time buyers and yield-focused
        investors with disciplined diligence,
        the proposition holds.
      </Callout>

      <Pullquote>
        Donholm is the eastern Nairobi suburb
        that has held its character longer
        than most. The buyers who know it
        well rarely leave.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For Donholm sourcing clients we run
        modernisation budget and compound
        diligence. Read also our pieces on{" "}
        <Link
          href="/insights/embakasi-massive-market-explained"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Embakasi
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/buruburu-legacy-estates-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Buruburu
        </Link>
        .
      </P>
    </>
  );
}

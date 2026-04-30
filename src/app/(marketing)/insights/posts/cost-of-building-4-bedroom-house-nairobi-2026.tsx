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
  slug: "cost-of-building-4-bedroom-house-nairobi-2026",
  title:
    "Cost of building a 4-bedroom house in Nairobi 2026",
  description:
    "Building a 4-bedroom house in Nairobi in 2026 typically costs between KES 8m and KES 25m all-in, depending on specification and finishing standard. Here is the honest 2026 breakdown for owner-builders and family clients.",
  publishedAt: "2025-11-22",
  readingMinutes: 4,
  author: authors.editors,
  tags: [
    "Construction",
    "Cost",
    "4-Bedroom",
    "Nairobi",
    "Calculator",
    "Property",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Cost of building 4-bedroom house Nairobi 2026 calculator",
};

export default function Article() {
  return (
    <>
      <Lede>
        Building a 4-bedroom house in Nairobi
        in 2026 typically costs between KES
        8m and KES 25m all-in, depending on
        specification, location and finishing
        standard. Here is the honest 2026
        breakdown for family clients and
        owner-builders.
      </Lede>

      <H2 id="size">Typical size assumptions</H2>

      <UL>
        <LI>
          Compact 4-bedroom: 180 to 220
          sqm
        </LI>
        <LI>
          Standard 4-bedroom with master
          en-suite: 220 to 280 sqm
        </LI>
        <LI>
          Comfortable 4-bedroom with all
          en-suite, family room, study:
          280 to 380 sqm
        </LI>
      </UL>

      <H2 id="cost-bands">Cost per square metre, 2026</H2>

      <UL>
        <LI>
          Basic specification: KES 35,000
          to KES 45,000 per sqm
        </LI>
        <LI>
          Mid specification: KES 50,000 to
          KES 65,000 per sqm
        </LI>
        <LI>
          Premium specification: KES 70,000
          to KES 100,000+ per sqm
        </LI>
        <LI>
          Ultra premium: KES 110,000 to
          KES 200,000+ per sqm
        </LI>
      </UL>

      <H2 id="examples">Worked examples</H2>

      <P>
        <strong>Example 1: Compact mid-spec
        4-bedroom (200 sqm)</strong>
      </P>

      <UL>
        <LI>
          200 sqm x KES 55,000 = KES
          11,000,000
        </LI>
        <LI>
          Plus contingency 10 percent: KES
          1,100,000
        </LI>
        <LI>
          Build cost: KES 12,100,000
        </LI>
      </UL>

      <P>
        <strong>Example 2: Standard premium
        4-bedroom (280 sqm)</strong>
      </P>

      <UL>
        <LI>
          280 sqm x KES 80,000 = KES
          22,400,000
        </LI>
        <LI>
          Plus contingency 12 percent: KES
          2,688,000
        </LI>
        <LI>
          Build cost: KES 25,088,000
        </LI>
      </UL>

      <P>
        <strong>Example 3: Comfortable
        ultra-premium 4-bedroom (350
        sqm)</strong>
      </P>

      <UL>
        <LI>
          350 sqm x KES 130,000 = KES
          45,500,000
        </LI>
        <LI>
          Plus contingency 12 percent: KES
          5,460,000
        </LI>
        <LI>
          Build cost: KES 50,960,000
        </LI>
      </UL>

      <H2 id="excluded">What these numbers exclude</H2>

      <UL>
        <LI>
          Plot cost (often the largest
          single line in mid-premium and
          premium suburbs)
        </LI>
        <LI>
          Professional fees (architect,
          structural engineer, MEP, QS,
          interior designer): typically 10
          to 14 percent of build cost
        </LI>
        <LI>
          County approvals and NEMA
        </LI>
        <LI>
          Connection fees
        </LI>
        <LI>
          Site works (perimeter wall,
          gate, driveway, landscaping,
          pool if any)
        </LI>
        <LI>
          Furnishing and fittings outside
          base spec
        </LI>
      </UL>

      <H2 id="all-in">All-in budget</H2>

      <UL>
        <LI>
          Compact mid-spec + plot in
          mid-market suburb: KES 25m to
          KES 45m all-in
        </LI>
        <LI>
          Standard premium + plot in
          mid-premium suburb (Lavington
          fringe, Spring Valley fringe):
          KES 65m to KES 110m all-in
        </LI>
        <LI>
          Comfortable ultra-premium + plot
          in Karen, Runda, Muthaiga: KES
          120m to KES 250m+ all-in
        </LI>
      </UL>

      <Callout title="The 4-bed rule">
        Plot is often the biggest line
        item in mid-premium and premium
        suburbs. Build budget discipline
        applies to the entire stack:
        plot, professional fees,
        construction, finishes, site works
        and furnishing.
      </Callout>

      <Pullquote>
        Most family self-build projects in
        Nairobi finish 18 to 24 months
        late and 25 to 40 percent over
        budget. Pick a contractor with
        track record and a quantity
        surveyor before breaking ground.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For self-build family clients we
        coordinate professional team and
        budget discipline. Read also our
        pieces on{" "}
        <Link
          href="/insights/cost-of-building-3-bedroom-house-kenya-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          cost of building 3-bedroom Kenya
          2026
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/cement-steel-finishing-prices-kenya-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          cement steel finishing prices
          Kenya 2026
        </Link>
        .
      </P>
    </>
  );
}

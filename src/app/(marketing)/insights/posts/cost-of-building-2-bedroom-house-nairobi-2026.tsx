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
  slug: "cost-of-building-2-bedroom-house-nairobi-2026",
  title:
    "Cost of building a 2-bedroom house in Nairobi 2026",
  description:
    "Building a 2-bedroom house in Nairobi in 2026 typically costs between KES 2.5m and KES 6m all-in, depending on specification, location and finishing standard. Here is the honest 2026 breakdown.",
  publishedAt: "2025-11-25",
  readingMinutes: 4,
  author: authors.editors,
  tags: [
    "Construction",
    "Cost",
    "2-Bedroom",
    "Nairobi",
    "Calculator",
    "Property",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Cost of building 2-bedroom house Nairobi 2026 calculator",
};

export default function Article() {
  return (
    <>
      <Lede>
        Building a 2-bedroom house in Nairobi
        in 2026 typically costs between KES
        2.5m and KES 6m all-in, depending on
        specification, location and finishing
        standard. Here is the honest 2026
        breakdown.
      </Lede>

      <H2 id="size">Typical size assumptions</H2>

      <UL>
        <LI>
          Compact: 60 to 80 sqm
        </LI>
        <LI>
          Standard: 80 to 100 sqm
        </LI>
        <LI>
          Comfortable: 100 to 120 sqm
        </LI>
      </UL>

      <H2 id="cost-bands">Cost per square metre, 2026</H2>

      <UL>
        <LI>
          Basic specification (single storey,
          basic finishes): KES 30,000 to
          KES 40,000 per sqm
        </LI>
        <LI>
          Mid specification (better
          finishes, gypsum, tile floors):
          KES 40,000 to KES 55,000 per sqm
        </LI>
        <LI>
          Premium specification (porcelain,
          imported fittings, prefab
          elements): KES 60,000 to KES
          90,000+ per sqm
        </LI>
      </UL>

      <H2 id="examples">Worked examples</H2>

      <P>
        <strong>Example 1: Compact basic
        2-bedroom (70 sqm)</strong>
      </P>

      <UL>
        <LI>
          70 sqm x KES 35,000 = KES
          2,450,000
        </LI>
        <LI>
          Plus contingency 10 percent: KES
          245,000
        </LI>
        <LI>
          All-in build: KES 2,695,000
        </LI>
      </UL>

      <P>
        <strong>Example 2: Standard mid-spec
        2-bedroom (90 sqm)</strong>
      </P>

      <UL>
        <LI>
          90 sqm x KES 50,000 = KES
          4,500,000
        </LI>
        <LI>
          Plus contingency 10 percent: KES
          450,000
        </LI>
        <LI>
          All-in build: KES 4,950,000
        </LI>
      </UL>

      <P>
        <strong>Example 3: Comfortable premium
        2-bedroom (110 sqm)</strong>
      </P>

      <UL>
        <LI>
          110 sqm x KES 75,000 = KES
          8,250,000
        </LI>
        <LI>
          Plus contingency 12 percent: KES
          990,000
        </LI>
        <LI>
          All-in build: KES 9,240,000
        </LI>
      </UL>

      <H2 id="excluded">What these numbers exclude</H2>

      <UL>
        <LI>
          Plot cost
        </LI>
        <LI>
          Architect, structural engineer,
          QS fees (typically 8 to 12
          percent of build cost)
        </LI>
        <LI>
          County approvals, NEMA where
          required
        </LI>
        <LI>
          Connection fees (water, power,
          sewer)
        </LI>
        <LI>
          Site works (perimeter wall,
          driveway, landscaping)
        </LI>
        <LI>
          Furnishing
        </LI>
      </UL>

      <H2 id="all-in">All-in cost including these</H2>

      <UL>
        <LI>
          Compact basic + plot small in
          mass-market suburb: KES 4m to
          KES 6m all-in
        </LI>
        <LI>
          Standard mid-spec + plot mid-market:
          KES 8m to KES 14m all-in
        </LI>
        <LI>
          Premium comfortable + plot in
          mid-premium suburb: KES 18m to
          KES 35m all-in
        </LI>
      </UL>

      <Callout title="The construction rule">
        Build the contingency in. Build
        the professional fees in. Pick
        the contractor with track record.
        The 2026 honest budget is rarely
        the spreadsheet’s first
        number.
      </Callout>

      <Pullquote>
        Most Kenyan self-build budgets
        miss by 20 to 35 percent. The
        builders who finish on budget
        had honest numbers from the
        start.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For self-build clients we
        coordinate professional team and
        cost discipline. Read also our
        pieces on{" "}
        <Link
          href="/insights/cost-of-building-3-bedroom-house-kenya-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          cost of building 3-bedroom Kenya 2026
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/buying-vs-building-house-kenya-honest-numbers"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          buying vs building Kenya
        </Link>
        .
      </P>
    </>
  );
}

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
  slug: "kenya-construction-cost-per-square-metre-2026",
  title:
    "Kenya construction cost per square metre 2026: the honest builder’s view",
  description:
    "Construction cost per square metre in Kenya is the single most asked question by anyone planning to build. The honest answer depends on spec, location and contractor, and the wide answer that floats around is misleading. Here is the honest 2026 builder’s view.",
  publishedAt: "2025-09-04",
  readingMinutes: 7,
  author: authors.research,
  tags: [
    "Kenya",
    "Construction Cost",
    "Per Square Metre",
    "Building",
    "2026",
    "Property",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Kenya construction cost per square metre 2026 builder honest view",
};

export default function Article() {
  return (
    <>
      <Lede>
        Construction cost per square metre in
        Kenya is the single most asked question by
        anyone planning to build. The honest
        answer depends on spec, location and
        contractor, and the broad answer that
        floats around is misleading. Here is the
        honest 2026 builder’s view, with
        ranges for each spec tier and the
        questions that determine where in the
        range your build sits.
      </Lede>

      <H2 id="ranges">2026 ranges by spec tier</H2>

      <UL>
        <LI>
          <strong>Budget spec residential
          standalone (Nairobi)</strong>: KES
          35,000 to KES 45,000 per square metre
        </LI>
        <LI>
          <strong>Mid spec residential
          standalone (Nairobi)</strong>: KES
          45,000 to KES 65,000 per square metre
        </LI>
        <LI>
          <strong>High spec residential
          standalone (Nairobi)</strong>: KES
          70,000 to KES 100,000 per square metre
        </LI>
        <LI>
          <strong>Premium spec custom build
          (Nairobi)</strong>: KES 100,000 to
          KES 180,000+ per square metre
        </LI>
        <LI>
          <strong>Apartment block (mid spec,
          per net saleable square metre)</strong>:
          KES 55,000 to KES 80,000
        </LI>
        <LI>
          <strong>Coastal villa (mid to high
          spec)</strong>: KES 60,000 to KES
          110,000 per square metre (logistics,
          salt-air spec)
        </LI>
      </UL>

      <H2 id="varies">What drives the variance</H2>

      <UL>
        <LI>
          <strong>Spec level</strong>: tiles,
          sanitaryware, kitchen, finishes,
          ironmongery
        </LI>
        <LI>
          <strong>Site conditions</strong>: slope,
          ground conditions, access for
          construction trucks
        </LI>
        <LI>
          <strong>Location</strong>: Nairobi
          baseline; coastal premium; remote
          locations premium for logistics
        </LI>
        <LI>
          <strong>Design complexity</strong>:
          double-height spaces, glazing extent,
          structural complexity
        </LI>
        <LI>
          <strong>Mechanical and electrical</strong>:
          standard fit-out vs smart-home
          integration, solar PV, battery
          backup
        </LI>
        <LI>
          <strong>Contractor</strong>: NCA tier,
          experience, supply chain access,
          overhead structure
        </LI>
        <LI>
          <strong>Programme</strong>: rushed
          builds cost more; well-planned
          programmes cost less
        </LI>
        <LI>
          <strong>External works</strong>:
          driveway, paving, landscaping,
          perimeter wall, gate, servant
          quarters
        </LI>
      </UL>

      <H2 id="what-includes">What the per-square-metre figure usually does and does not include</H2>

      <UL>
        <LI>
          <strong>Includes</strong>: building
          superstructure, finishes per spec,
          internal services
        </LI>
        <LI>
          <strong>Often excludes</strong>:
          land, professional fees (architect,
          QS, engineer), approvals, utility
          connections, external works, solar
          and resilience systems, landscaping,
          furniture
        </LI>
      </UL>

      <P>
        Detail in our{" "}
        <Link
          href="/insights/hidden-costs-building-house-kenya-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          hidden costs of building piece
        </Link>
        .
      </P>

      <H2 id="example">Worked example</H2>

      <P>
        For a 250 square metre 4-bed standalone
        home in Nairobi at mid-to-high spec:
      </P>

      <UL>
        <LI>
          Construction (250 sqm at KES 70,000):
          KES 17.5m
        </LI>
        <LI>
          Architect (8 percent): KES 1.4m
        </LI>
        <LI>
          QS (1.5 percent): KES 263,000
        </LI>
        <LI>
          Structural and engineering (2.5
          percent): KES 437,500
        </LI>
        <LI>
          Approvals: KES 350,000
        </LI>
        <LI>
          Utility connections: KES 250,000
        </LI>
        <LI>
          External works (driveway, paving,
          landscaping, perimeter): KES 2.5m
        </LI>
        <LI>
          Solar PV and battery: KES 1.8m
        </LI>
        <LI>
          Servant quarters: KES 2.5m
        </LI>
        <LI>
          Contingency (12 percent on
          construction): KES 2.1m
        </LI>
        <LI>
          <strong>All-in</strong>: KES 29.1m
          excluding land
        </LI>
        <LI>
          <strong>Effective per square
          metre</strong>: KES 116,500 all in
        </LI>
      </UL>

      <P>
        The naked construction quote was 60
        percent of the actual all-in cost.
        That gap is the gap that catches most
        owners.
      </P>

      <H2 id="benchmarks">Benchmarks vs other markets</H2>

      <UL>
        <LI>
          South Africa equivalent: roughly 40
          to 60 percent more expensive per
          sqm
        </LI>
        <LI>
          UK self-build equivalent: 4 to 6 x
          more expensive per sqm
        </LI>
        <LI>
          Within Kenya: coastal +15 to +25
          percent over Nairobi; remote upcountry
          can be cheaper or more expensive
          depending on logistics
        </LI>
      </UL>

      <Callout title="The cost per sqm rule">
        Use 2026 ranges as a starting point,
        not as a quote. The build is what the
        QS prices for your specific design,
        site and spec. Anyone quoting you a
        single number per square metre without
        running through your design has not
        priced your build; they have priced
        someone else’s.
      </Callout>

      <Pullquote>
        Per-square-metre figures are useful as
        a sanity check and dangerous as a
        budget. The discipline that produces
        on-budget builds is the QS pricing
        the actual design, not the broker
        repeating a market average.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For build clients we work with QS
        partners to price the actual design
        before contracts are signed. Read also
        our pieces on{" "}
        <Link
          href="/insights/cost-of-building-3-bedroom-house-kenya-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          cost of building a 3-bed house
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/cement-steel-finishing-prices-kenya-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          cement and steel prices
        </Link>
        .
      </P>
    </>
  );
}

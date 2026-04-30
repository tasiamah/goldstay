import Link from "next/link";
import { authors, type PostMeta } from "./_shared";
import {
  Callout,
  H2,
  H3,
  LI,
  Lede,
  OL,
  P,
  Pullquote,
  UL,
} from "@/components/ArticleProse";

export const meta: PostMeta = {
  slug: "hoa-and-management-company-fees-nairobi-explained",
  title:
    "HOA and management company fees in Nairobi: what you actually pay and what you actually get",
  description:
    "Apartment service charge gets most of the airtime, but the second layer of fees that gated communities and townhouse compounds in Nairobi charge through their HOA or management company is just as material. Here is what each layer covers, what good governance looks like, and how to read building accounts before you buy.",
  publishedAt: "2026-01-17",
  readingMinutes: 7,
  author: authors.poonam,
  tags: ["Nairobi", "HOA", "Management Company", "Service Charge", "Compounds", "Costs"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Gated community in Nairobi with HOA and management company fees displayed on landlord statement",
};

export default function Article() {
  return (
    <>
      <Lede>
        Almost every Kenyan diaspora landlord understands
        apartment service charge. Far fewer fully understand
        the second layer of fees that townhouse compounds and
        gated estates run on top, often called the HOA fee or
        the management company fee. The two layers serve
        different functions, are governed by different
        documents, and behave differently when they are run
        well versus run badly. Before you buy, you should know
        which layers your prospective property has, what each
        one is for, and how to read the underlying accounts.
      </Lede>

      <H2 id="three-layers">The three fee layers in Nairobi residential property</H2>

      <H3 id="layer-1">Layer 1: Apartment service charge</H3>

      <P>
        Charged by the apartment management committee or the
        appointed managing agent of a stand-alone apartment
        block. Covers the running of the building itself:
        common-area cleaning, security, lift maintenance,
        bulk water, generator fuel, common-area electricity,
        external repairs, gardening, and a contribution to
        the reserve fund. Typical Nairobi number for a quality
        2 bed: KES 12,000 to KES 25,000 a month, depending
        on the compound and amenity load. We have a longer
        piece on{" "}
        <Link
          href="/insights/service-charge-nairobi-apartments-explained"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          apartment service charge in Nairobi
        </Link>{" "}
        if you want the detail on this layer.
      </P>

      <H3 id="layer-2">Layer 2: HOA or estate management fee</H3>

      <P>
        If your apartment block sits inside a larger gated
        estate (Garden City, Two Rivers, Tatu City, Migaa,
        and many newer Karen and Runda developments), there
        is usually a second fee paid to the estate’s
        Home Owners Association or estate management company.
        This covers shared infrastructure outside your
        building: estate roads, perimeter security, gatehouse
        operations, communal sewer and water mains, common
        landscaping, club facilities (if any), and shared
        utility infrastructure.
      </P>

      <P>
        Typical numbers: KES 4,000 to KES 15,000 per unit per
        month, depending on amenity scope and estate size.
        Premium estates with golf courses, club houses or
        full perimeter electric fencing land at the top of
        that range.
      </P>

      <H3 id="layer-3">Layer 3: Sectional title management company</H3>

      <P>
        Under the Sectional Properties Act 2020, every newly
        registered apartment block must have a corporation
        (the management company) that owns the common areas
        and is governed by all unit owners through bye-laws
        and an AGM. In practice, in Nairobi, the management
        company often is the apartment management committee,
        and the service charge collected at Layer 1 funds it.
        For older buildings under the Sectional Properties Act
        1987, the structure is similar but the legal
        wrapping is different.
      </P>

      <P>
        For a diaspora buyer, the practical implication of
        Layer 3 is that you become a member of the management
        company on completion and your voice at the AGM is
        proportional to your unit size. If you buy two units,
        you have two votes. If service charge governance is
        an issue in the building, votes matter.
      </P>

      <H2 id="what-good-looks-like">What good governance looks like</H2>

      <P>
        Read the last two years of management accounts before
        you buy. You are looking for five things:
      </P>

      <OL>
        <LI>
          <strong>Service charge collection rate above 85
          percent.</strong> Below that, the building is
          quietly accumulating a deficit. The remaining
          paying owners eventually pick up the bill through
          a special levy or deferred maintenance. Common
          buildings in Westlands, Kilimani and Lavington run
          92 to 98 percent collection rates.
        </LI>
        <LI>
          <strong>A reserve fund of at least 6 months of
          operating expense.</strong> Any less and the
          building is one major repair away from a special
          levy. Mature compounds run 9 to 12 months of
          reserves.
        </LI>
        <LI>
          <strong>Audited accounts, signed off by a
          recognised firm.</strong> Not a cousin of the
          chairperson with a calculator. Look for accounts
          prepared by a registered audit firm, even if the
          firm is small.
        </LI>
        <LI>
          <strong>AGM minutes from the last two years.</strong>{" "}
          Look for substantive items (capex projects, service
          charge revisions, vendor changes, governance
          disputes) rather than three pages of formalities.
          Healthy compounds have boring, well-documented AGMs.
        </LI>
        <LI>
          <strong>An updated bye-law document.</strong> Not the
          original developer template, but a version
          explicitly amended at AGM to reflect actual building
          rules (short-stay restrictions, pet rules, parking
          allocation, noise hours).
        </LI>
      </OL>

      <Callout title="Red flags in the accounts">
        Persistent receivables (owners owing six months or
        more), large “sundry” expense lines that
        are not explained in notes, no reserve fund line,
        and management agent fees that exceed 15 percent of
        operating expenses. Each of those alone is a yellow
        flag. Two together and you walk.
      </Callout>

      <H2 id="estate-fees">When estate fees become the bigger issue</H2>

      <P>
        In larger gated estates, the estate management fee
        can over time become the more important number than
        the apartment service charge. Reasons:
      </P>

      <UL>
        <LI>
          Estate roads, perimeter security and shared utilities
          are expensive infrastructure with long maintenance
          cycles. A 10 year old estate often hits a moment
          where the original infrastructure needs significant
          renewal, funded by a special levy on every unit.
        </LI>
        <LI>
          HOA governance is harder to discipline than building
          governance because the constituency is much larger
          and more dispersed. Diaspora owners who never attend
          AGMs can end up paying special levies they did not
          vote on.
        </LI>
        <LI>
          The HOA fee can rise faster than rent. Estates with
          weak governance routinely raise the HOA fee 15 to
          30 percent year on year while rents in the same
          estate are flat. Net yield erodes silently.
        </LI>
      </UL>

      <P>
        Before buying inside a gated estate, ask for the HOA
        fee history for the last 5 years and the projected
        capex over the next 5 years. If both are not
        available, the HOA is not well run and you should
        price that into the offer.
      </P>

      <H2 id="diaspora-realities">Diaspora-specific realities</H2>

      <UL>
        <LI>
          You will not attend AGMs in person. Appoint a proxy
          (your manager, your lawyer, a trusted owner in the
          building). Without a proxy you have no voice on
          service charge revisions, capex decisions, or
          governance disputes.
        </LI>
        <LI>
          Service charge is paid from your collected rent and
          appears on your monthly statement. At Goldstay we
          set up auto-payments at onboarding so the building
          never sees you on the receivables list.
        </LI>
        <LI>
          Special levies happen. Even in well-run buildings,
          a one-off levy of 1 to 3 months service charge
          appears once every few years for a major project
          (lift replacement, exterior repaint, generator
          overhaul). Build a small contingency into your
          rental cash flow assumptions for this.
        </LI>
      </UL>

      <Pullquote>
        For a diaspora landlord, the difference between a
        well-run building and a badly run one shows up in
        net yield and resale price. The diligence is on the
        building first, the unit second.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For every property we manage, we audit the building
        and estate accounts at onboarding, attend AGMs by
        proxy on your behalf, and report material governance
        issues on your monthly statement. For every property
        we source, we pull the management accounts before the
        offer letter and refuse properties in compounds with
        weak governance. The compound shapes the unit’s
        long-term performance more than the unit itself does.
      </P>

      <P>
        See the related pieces on{" "}
        <Link
          href="/insights/service-charge-nairobi-apartments-explained"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          service charge in Nairobi apartments
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/why-amenities-matter-nairobi-rental-property"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          why amenities matter for Nairobi rentals
        </Link>
        .
      </P>
    </>
  );
}

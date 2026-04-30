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
  slug: "sectional-properties-act-2020-kenya-apartment-owners",
  title:
    "The Sectional Properties Act 2020 explained: what every apartment owner in Kenya needs to know",
  description:
    "Almost every apartment in Nairobi is now governed by the Sectional Properties Act 2020. This is the practical 2026 guide to what it changed, how sectional titles work, what a corporation is, what your unit factor means, what management companies can and cannot do, and the questions every apartment buyer should ask.",
  publishedAt: "2025-04-19",
  readingMinutes: 9,
  author: authors.legal,
  tags: [
    "Kenya",
    "Sectional Properties",
    "Apartments",
    "Title",
    "Management Company",
    "Law",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Sectional Properties Act 2020 Kenya, apartment owner guide, sectional title and corporation explained",
};

export default function Article() {
  return (
    <>
      <Lede>
        Most apartment owners in Kenya hold their unit
        under a regime almost none of them have ever read.
        The Sectional Properties Act 2020 came into force
        in December 2020 and replaced the Sectional
        Properties Act 1987. It is the law that defines
        what an apartment owner actually owns, what they
        share with their neighbours, who governs the
        building and how decisions get made. Reading the
        Act in full is dry. Knowing the parts that affect
        your daily life as an owner is genuinely useful.
        Here is the practical 2026 explainer for diaspora
        owners and Nairobi apartment buyers.
      </Lede>

      <H2 id="what-changed">What the 2020 Act changed</H2>

      <P>
        The 2020 Act modernised and tightened the regime
        in several ways:
      </P>

      <OL>
        <LI>
          All long term sub leases that were previously
          used to deliver apartment ownership had to be
          converted into sectional titles within a
          transition period
        </LI>
        <LI>
          Each unit gets a separate sectional title,
          registered at the Lands Registry, which the
          owner can sell, mortgage and transfer just like
          any other immovable property
        </LI>
        <LI>
          Common areas (lobbies, lifts, corridors,
          rooftops, gardens, parking) are owned in
          undivided shares by all unit owners through a
          legal entity known as a corporation
        </LI>
        <LI>
          The corporation is automatically formed on
          registration of the sectional plan and replaces
          the old style management company in many
          buildings
        </LI>
        <LI>
          Stricter rules on by laws, meetings, financial
          management and reserves apply
        </LI>
      </OL>

      <H2 id="what-you-own">What you actually own as an apartment buyer</H2>

      <P>
        Under the Act, a sectional title gives you:
      </P>

      <UL>
        <LI>
          <strong>The unit</strong>. The space inside the
          inside surface of the bounding walls, floor and
          ceiling of your apartment. The walls themselves
          are common property in most cases.
        </LI>
        <LI>
          <strong>Accessory units</strong>. Parking
          spaces, store rooms, balconies and other
          designated extras allocated to your apartment.
        </LI>
        <LI>
          <strong>An undivided share in the common
          property</strong>. Calculated by your unit
          factor (sometimes called participation quota),
          which is set in the registered sectional plan.
        </LI>
        <LI>
          <strong>A vote in the corporation</strong>{" "}
          weighted by your unit factor.
        </LI>
        <LI>
          <strong>An obligation</strong>. Service charge
          and reserve fund contributions, by laws,
          insurance levies and any special levies the
          corporation properly resolves.
        </LI>
      </UL>

      <H2 id="unit-factor">What your unit factor actually means</H2>

      <P>
        The unit factor is the number that quantifies
        each unit’s share in the common property
        and the common expenses. It is set in the
        registered sectional plan and it determines:
      </P>

      <UL>
        <LI>
          What share of the service charge your unit
          pays
        </LI>
        <LI>
          What share of any special levy applies to your
          unit
        </LI>
        <LI>
          What weight your vote carries in corporation
          meetings
        </LI>
        <LI>
          What share of the proceeds you receive if the
          building is ever wound up
        </LI>
      </UL>

      <P>
        Unit factors are typically calculated based on
        floor area, sometimes adjusted for unit type or
        floor level. Once registered they are very hard to
        change. Buyers should confirm their unit factor
        before purchase, not after.
      </P>

      <H2 id="corporation">The corporation and what it does</H2>

      <P>
        The corporation is the legal entity formed
        automatically when the sectional plan is
        registered. Its members are all the unit owners
        in the building. Its job is to manage the common
        property, collect contributions, insure the
        building, enforce the by laws and represent the
        owners as a body.
      </P>

      <UL>
        <LI>
          <strong>Executive Committee</strong>. The
          corporation elects a committee (usually three
          to seven members) to handle day to day
          governance.
        </LI>
        <LI>
          <strong>Annual General Meeting</strong>. Held
          once a year. Approves budget, accounts,
          committee, and any major decisions requiring an
          ordinary or special resolution.
        </LI>
        <LI>
          <strong>Special General Meeting</strong>.
          Called for specific matters between AGMs.
        </LI>
        <LI>
          <strong>Resolutions</strong>. Ordinary
          resolutions for routine matters; special
          resolutions (75 percent of unit factors) for
          major decisions; unanimous resolutions for the
          rare items the Act reserves for full owner
          consent.
        </LI>
      </UL>

      <H2 id="management-company">Corporation vs management company</H2>

      <P>
        Older Kenyan apartment buildings were typically
        delivered through a management company structure,
        where each apartment had a sub lease and the
        common property was held by a management company
        whose shares the unit owners owned. The 2020 Act
        replaced this in most cases with the corporation
        model.
      </P>

      <P>
        For older buildings:
      </P>

      <UL>
        <LI>
          The transition to sectional titles was supposed
          to be completed within two years of the Act
          (with extensions). Many buildings have completed
          this. Some have not, and still operate under the
          old structure.
        </LI>
        <LI>
          Buyers in older buildings should specifically
          ask whether the building has converted, what
          stage the conversion is at, and what the
          implications are for their title.
        </LI>
        <LI>
          Many corporations contract a property
          management company to handle day to day
          management on their behalf. The corporation is
          the principal; the management company is the
          agent.
        </LI>
      </UL>

      <P>
        We cover the management company side in detail in
        our{" "}
        <Link
          href="/insights/hoa-and-management-company-fees-nairobi-explained"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          HOA and management company fees piece
        </Link>
        .
      </P>

      <H2 id="service-charge">Service charge and reserve fund</H2>

      <P>
        The Act requires the corporation to maintain:
      </P>

      <OL>
        <LI>
          A service charge fund for ordinary running
          costs (security, cleaning, gardening, lift
          maintenance, generator fuel, water, insurance,
          management fees)
        </LI>
        <LI>
          A reserve fund for major repairs and
          replacements (lift overhaul, generator
          replacement, roof refurbishment, painting cycle,
          road resurface)
        </LI>
      </OL>

      <P>
        The service charge is approved annually at the
        AGM based on a budget. The reserve fund must be
        topped up over time so the building can pay for
        big ticket items without surprise levies. We cover
        the practicalities in our{" "}
        <Link
          href="/insights/service-charge-nairobi-apartments-explained"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          service charge piece
        </Link>
        .
      </P>

      <H2 id="bylaws">By laws: the rules of your building</H2>

      <P>
        The Act provides default by laws for sectional
        property. Each corporation can adopt its own by
        laws by special resolution, within the framework
        the Act allows. Common by law topics:
      </P>

      <UL>
        <LI>
          Use of units (residential only, short stay
          allowed or not, commercial use restrictions)
        </LI>
        <LI>
          Pet policy
        </LI>
        <LI>
          Renovation rules and approvals
        </LI>
        <LI>
          Noise hours
        </LI>
        <LI>
          Parking allocation and guest parking
        </LI>
        <LI>
          Use of common areas (pool hours, gym rules,
          rooftop bookings)
        </LI>
        <LI>
          Procedure for collecting service charge arrears
        </LI>
      </UL>

      <P>
        For Airbnb and short stay use specifically, by
        laws are increasingly restrictive in many
        compounds. Buyers planning short stay rental
        should read the by laws before purchase and
        understand the restrictions that apply.
      </P>

      <H2 id="dispute">When things go wrong</H2>

      <P>
        The Act gives owners several routes when the
        corporation, the committee or another owner is
        not behaving properly:
      </P>

      <OL>
        <LI>
          Internal complaint to the corporation and
          enforcement of by laws
        </LI>
        <LI>
          Mediation through the Land Registrar or the
          Tribunal
        </LI>
        <LI>
          Land and Environment Court for serious disputes
          (governance, large arrears, structural issues)
        </LI>
        <LI>
          Owner action to set aside resolutions improperly
          passed
        </LI>
      </OL>

      <H2 id="buyer-questions">Questions every apartment buyer should ask</H2>

      <OL>
        <LI>
          Has the building completed conversion to
          sectional titles under the 2020 Act
        </LI>
        <LI>
          What is the unit factor for this unit
        </LI>
        <LI>
          What is the current service charge per square
          metre and what is the trajectory over the last
          five years
        </LI>
        <LI>
          What is the reserve fund balance and what major
          works are forecast in the next five to ten
          years
        </LI>
        <LI>
          Are there any active special levies or any
          planned in the near term
        </LI>
        <LI>
          What is the service charge collection rate (the
          single best signal of building health)
        </LI>
        <LI>
          What are the by laws on short stay use and
          renovations
        </LI>
        <LI>
          Are the audited accounts of the corporation
          available for the last three years
        </LI>
        <LI>
          What insurance is in place at corporation level
          (buildings, public liability) and at owner
          level (contents, owner’s liability)
        </LI>
        <LI>
          Are there any pending disputes or court matters
        </LI>
      </OL>

      <Callout title="The buyer’s shortcut">
        The Sectional Properties Act 2020 turns every
        apartment purchase into the purchase of two
        things: the unit and a share of the corporation.
        A great unit in a poorly run corporation is a
        compromised investment. Always diligence the
        corporation as carefully as you diligence the
        unit.
      </Callout>

      <Pullquote>
        The unit is what you live in. The corporation is
        what makes the building work. Both matter.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For sourcing clients we run corporation level
        diligence (audited accounts, service charge
        history, reserve fund position, collection rate,
        active disputes) before we recommend a unit. For
        management clients we represent the owner’s
        interests in corporation matters, attend AGMs by
        proxy where helpful, and flag any governance
        issues before they affect the owner’s
        position.
      </P>

      <P>
        Read also our pieces on{" "}
        <Link
          href="/insights/service-charge-nairobi-apartments-explained"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          service charge in Nairobi apartments
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/hoa-and-management-company-fees-nairobi-explained"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          HOA and management company fees
        </Link>{" "}
        for the operational and financial picture that
        sits inside the legal framework above.
      </P>
    </>
  );
}

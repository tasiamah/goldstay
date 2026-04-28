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
  slug: "easements-and-wayleaves-kenyan-property",
  title:
    "Easements and wayleaves on Kenyan property: what they are and what they mean for value",
  description:
    "Easements and wayleaves are the most ignored line items in a Kenyan title search. They affect what you can build, where you can build, and what your land is actually worth. Here is the honest 2026 guide on how easements and wayleaves work in Kenya, the common types and how to deal with them.",
  publishedAt: "2024-07-22",
  readingMinutes: 6,
  author: authors.legal,
  tags: [
    "Kenya",
    "Easements",
    "Wayleaves",
    "Land Law",
    "Land",
    "Diligence",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Easements and wayleaves Kenyan property 2026 guide",
};

export default function Article() {
  return (
    <>
      <Lede>
        Easements and wayleaves are the most ignored
        line items in a Kenyan title search. They
        affect what you can build, where you can
        build, and what your land is actually worth.
        Here is the honest 2026 guide on how they
        work in Kenya, the common types, and how
        prepared buyers deal with them.
      </Lede>

      <H2 id="what">What they are</H2>

      <H3 id="easement">Easement</H3>

      <P>
        An easement is a right that one piece of
        land has over another. The classic example
        is a right of way: the owner of plot A has
        the right to cross plot B to reach the
        public road. Plot A is the dominant tenement;
        plot B is the servient tenement.
      </P>

      <P>
        Easements run with the land. They survive
        sale of either property and bind successive
        owners.
      </P>

      <H3 id="wayleave">Wayleave</H3>

      <P>
        A wayleave is a specific kind of easement
        granted to a utility provider (Kenya Power,
        KenGen, KETRACO, NWSC, telecoms operators)
        for the purpose of running infrastructure
        across land. Power lines, pipelines, fibre
        cables. The utility provider has the right
        to access, install and maintain the
        infrastructure.
      </P>

      <H2 id="types">Common types in Kenya</H2>

      <UL>
        <LI>
          <strong>Right of way</strong>: access from
          a parcel to a road or other infrastructure
        </LI>
        <LI>
          <strong>Power line wayleave</strong>:
          high-voltage power lines crossing the
          land. Often visible from the title plan
        </LI>
        <LI>
          <strong>Pipeline wayleave</strong>: water,
          sewer or fuel pipelines. Less visible but
          equally restrictive
        </LI>
        <LI>
          <strong>Telecoms wayleave</strong>: fibre
          and fixed line infrastructure
        </LI>
        <LI>
          <strong>Drainage easement</strong>: storm
          water drainage and natural watercourse
          rights
        </LI>
        <LI>
          <strong>Light and air easement</strong>:
          less common but exists in dense urban
          settings
        </LI>
        <LI>
          <strong>Support easement</strong>: where
          your structure depends on a neighbour&rsquo;s
          structure for support (party wall
          situations)
        </LI>
      </UL>

      <H2 id="implications">Implications for owners</H2>

      <H3 id="build-restriction">Build restrictions</H3>

      <P>
        Wayleaves and easements typically come with
        a defined corridor or distance restriction.
        You cannot build within the wayleave
        corridor, plant deep-rooted trees, install
        deep-foundation structures, or store heavy
        materials.
      </P>

      <P>
        Power line wayleave: usually 6 to 30 metres
        on either side of the line depending on
        voltage. Pipeline wayleaves: 6 to 15 metres.
        These corridors are functionally unbuildable
        and limit your usable plot.
      </P>

      <H3 id="access">Access rights</H3>

      <P>
        The utility has access rights. Workers can
        enter for maintenance and repair. You
        cannot fence them out. In some cases the
        utility can clear vegetation or remove
        obstructions.
      </P>

      <H3 id="value">Value</H3>

      <P>
        Plots with significant wayleaves trade at
        material discounts to comparable plots
        without them. The discount reflects the
        reduced buildable area and the practical
        nuisance.
      </P>

      <H3 id="resale">Resale</H3>

      <P>
        Easements run with the land. The next
        buyer&rsquo;s lawyer will spot them in the
        same way you should have. Material
        easements affect both your enjoyment and
        your eventual resale.
      </P>

      <H2 id="discover">How to discover easements and wayleaves</H2>

      <OL>
        <LI>
          Official title search through the
          buyer&rsquo;s lawyer
        </LI>
        <LI>
          Survey plan review (the title plan
          usually marks wayleave corridors and
          easements)
        </LI>
        <LI>
          Site visit (overhead power lines,
          visible markers, manhole covers
          indicating buried services)
        </LI>
        <LI>
          Conversation with neighbours and the
          local Land Office
        </LI>
        <LI>
          Survey by a licensed surveyor where the
          plan is not clear
        </LI>
      </OL>

      <H2 id="dealing">Dealing with them</H2>

      <H3 id="confirm">Confirm the corridor</H3>

      <P>
        Establish exactly where the corridor runs,
        how wide it is, and what restrictions
        apply within it. Pay a surveyor to mark
        the corridor on the ground.
      </P>

      <H3 id="design">Design around them</H3>

      <P>
        Position the building outside the corridor.
        Use the corridor for parking, garden,
        approach drive, ancillary structures. A
        well-designed plot can incorporate the
        wayleave without significant compromise.
      </P>

      <H3 id="negotiate">Negotiate compensation if appropriate</H3>

      <P>
        Where a new wayleave is being imposed (a
        new power line, a new pipeline), the
        utility provider is required to compensate
        the land owner. The compensation is
        defined by statute and through the National
        Lands Commission. Owners can negotiate the
        actual award.
      </P>

      <H3 id="discount-bid">Discount the purchase price</H3>

      <P>
        For new purchases, the easement or
        wayleave should be reflected in the price.
        Acquire at a discount that reflects the
        usable area, not the gross plot area.
      </P>

      <H3 id="release">Pursue release in rare cases</H3>

      <P>
        Some easements can be released or
        re-routed by agreement with the
        beneficiary. This is rare for utility
        wayleaves but more common for
        neighbour-on-neighbour easements
        (rights of way, drainage). Engage a
        lawyer early.
      </P>

      <H2 id="ignore">What happens if you ignore them</H2>

      <UL>
        <LI>
          You build within the corridor and the
          utility forces you to demolish at your
          cost
        </LI>
        <LI>
          You complete the build and discover
          access requirements you did not plan
          for (utility workers entering through
          your gardens)
        </LI>
        <LI>
          You sell and the next buyer&rsquo;s
          lawyer demands a price reduction at
          completion
        </LI>
        <LI>
          You install structures that have to be
          removed during a maintenance event
        </LI>
        <LI>
          Liability for any damage caused by
          ignoring posted setbacks
        </LI>
      </UL>

      <Callout title="The diligence rule">
        Easements and wayleaves are not optional
        details. They are part of the title and
        they bind the land. Confirm them, design
        around them, and price them into the
        acquisition. The discount they command in
        the market is generally fair.
      </Callout>

      <Pullquote>
        Most owners who run into wayleave
        surprises did so because the line item
        was visible on the title from day one and
        no one read it carefully. The five
        minute conversation with your lawyer
        about the survey plan saves the years of
        regret about the structure you cannot
        build.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For sourcing clients we walk through the
        title plan and any easement or wayleave
        markings before recommending an
        acquisition. For development clients we
        coordinate the survey to mark every
        constraint on the ground before any
        design work begins.
      </P>

      <P>
        Read also our pieces on{" "}
        <Link
          href="/insights/how-to-buy-plot-of-land-kenya-step-by-step"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how to buy a plot of land
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/property-valuation-kenya-how-it-works-bank-vs-market"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          property valuation
        </Link>
        .
      </P>
    </>
  );
}

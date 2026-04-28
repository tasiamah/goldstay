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
  slug: "why-amenities-matter-nairobi-rental-property",
  title:
    "Why amenities matter for Nairobi rental property: gym, pool, backup power, fibre",
  description:
    "Two identical apartments at the same price in the same neighbourhood can let in 14 days versus 90 days entirely on the basis of amenities. Here is what the Nairobi tenant of 2026 actually expects, what they ignore, and how to value an amenity package when comparing buildings.",
  publishedAt: "2026-02-01",
  readingMinutes: 7,
  author: authors.poonam,
  tags: ["Nairobi", "Amenities", "Rental Strategy", "Tenants", "Yield"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Nairobi apartment building amenities including pool, gym and backup power for rental property",
};

export default function Article() {
  return (
    <>
      <Lede>
        Walk a prospective Nairobi tenant through two
        apartments at the same rent on the same street and
        watch where their attention goes. Almost never to the
        kitchen finish. Almost never to the wardrobe doors.
        Their eye lands on the lift, the gym, the rooftop,
        the parking, the perimeter wall, and the fibre cable
        on the wall. Amenities decide the let. We have
        watched this happen a thousand times across Westlands,
        Kilimani, Lavington and Kileleshwa. As a diaspora
        buyer choosing between two compounds, the amenity
        package is the single most under-priced variable in
        almost every comparison.
      </Lede>

      <H2 id="what-tenants-expect">The 2026 Nairobi tenant baseline</H2>

      <P>
        The expectation set has shifted significantly since
        2020. What used to be a premium amenity is now a
        baseline expectation for any tenant willing to pay
        USD 1,200 a month or more.
      </P>

      <H3 id="baseline">Baseline (must-have to compete)</H3>

      <UL>
        <LI>
          <strong>24 hour security with manned gate.</strong>{" "}
          Non-negotiable. Two layers of security (estate gate
          plus building reception) is now standard in
          Westlands and Kilimani.
        </LI>
        <LI>
          <strong>Backup power, automatic, whole-building.</strong>{" "}
          Generator that switches in within 30 seconds of a
          KPLC outage and runs the entire building including
          lifts and air conditioning. Partial backup (only
          common areas, lifts and a few sockets) is a yellow
          flag in 2026.
        </LI>
        <LI>
          <strong>Borehole or reliable bulk water with
          storage.</strong> The municipal water supply in
          Nairobi is unreliable; tenants will not put up with
          dry taps for a USD 1,500 a month apartment.
        </LI>
        <LI>
          <strong>High-speed fibre.</strong> At least Safaricom
          Home Fibre or Faiba in the building, ideally two
          providers for redundancy. Remote-working tenants
          will walk away from a flat without confirmed fibre.
        </LI>
        <LI>
          <strong>Reserved parking, secure.</strong> Minimum
          one bay per 1 bed, two bays per 2 bed in the upper
          tier neighbourhoods.
        </LI>
        <LI>
          <strong>Lift, well-maintained.</strong> Anything
          above the third floor without a working lift loses
          a third of its tenant pool.
        </LI>
      </UL>

      <H3 id="differentiators">Differentiators (where you actually compete)</H3>

      <UL>
        <LI>
          <strong>Gym.</strong> Worth roughly USD 50 to USD
          100 a month in tenant willingness to pay if the
          equipment is current and the room is clean. The
          difference between a useful gym and a token room
          with a broken treadmill is enormous.
        </LI>
        <LI>
          <strong>Swimming pool.</strong> Roughly USD 80 to
          USD 150 a month in tenant willingness to pay,
          higher in Lavington and Kileleshwa families
          submarkets.
        </LI>
        <LI>
          <strong>Rooftop social space.</strong> Newer to
          Nairobi, increasingly important. Younger
          professional tenants and Airbnb guests both
          consistently rate rooftop terraces as a major
          factor in choosing one building over another.
        </LI>
        <LI>
          <strong>Pet-friendly policy.</strong> Most Nairobi
          buildings still ban dogs. The minority that allow
          (with rules) command a 5 to 10 percent rent premium
          and the lowest void rate in our managed portfolio.
        </LI>
        <LI>
          <strong>Coworking / business lounge.</strong>{" "}
          Emerging amenity, especially in Kilimani and
          Westlands new builds. Strong appeal to digital
          nomad and remote-work tenants who would otherwise
          pay for a Nairobi Garage membership.
        </LI>
      </UL>

      <H3 id="overrated">Overrated amenities</H3>

      <UL>
        <LI>
          <strong>Concierge.</strong> Sounds premium, almost
          never used by Nairobi tenants the way a London
          equivalent would be. Nice to have, not a price
          driver.
        </LI>
        <LI>
          <strong>Sauna and steam room.</strong> Used twice
          a year by 80 percent of residents. Not a price
          driver, and an ongoing service charge cost.
        </LI>
        <LI>
          <strong>Children&rsquo;s play area in
          professional-only buildings.</strong> If the
          tenant base is single professionals and couples
          without children, this is space the gym or
          coworking lounge could have used.
        </LI>
      </UL>

      <H2 id="time-to-let">How amenities show up in time to let</H2>

      <P>
        From our managed portfolio across Westlands, Kilimani,
        Lavington and Kileleshwa, the time-to-let pattern by
        amenity package is consistent.
      </P>

      <UL>
        <LI>
          Building with full baseline plus pool, gym and
          rooftop: average time to let 14 to 30 days at the
          neighbourhood top of the rental band
        </LI>
        <LI>
          Building with full baseline only (security, backup,
          borehole, fibre, parking, lift): average time to
          let 30 to 60 days at the neighbourhood mid band
        </LI>
        <LI>
          Building missing one or more baseline elements
          (no automatic generator, no fibre, lift breaks
          weekly): average time to let 60 to 120 days, often
          at a 10 to 15 percent rent discount to neighbours
        </LI>
      </UL>

      <Callout title="The 30 day void rule">
        A building that consistently lets in 30 days or less
        produces meaningfully better net yield than a
        comparable building at the same rent that lets in
        60 days, even if the better building has higher
        service charge. Amenities are how you compress
        time to let.
      </Callout>

      <H2 id="airbnb">Amenities for short-stay (Airbnb)</H2>

      <P>
        For short-stay, the amenity weighting changes. The
        guest of 2026 looking at Nairobi listings cares
        about, in roughly this order:
      </P>

      <OL>
        <LI>
          Reliable, fast wi-fi (their work depends on it)
        </LI>
        <LI>
          Backup power that runs everything during outages
        </LI>
        <LI>
          Well-equipped kitchen
        </LI>
        <LI>
          Pool and rooftop social space
        </LI>
        <LI>
          Gym
        </LI>
        <LI>
          Secure parking
        </LI>
      </OL>

      <P>
        For short-stay specifically, fibre quality and
        backup power redundancy are worth a measurable nightly
        rate premium. A dropped Zoom call costs the guest a
        meeting; they will pay USD 20 to USD 40 a night more
        for a listing that genuinely runs through outages.
      </P>

      <H2 id="how-to-value">How to value an amenity package when buying</H2>

      <P>
        A practical heuristic for diaspora buyers:
      </P>

      <UL>
        <LI>
          Two otherwise identical 2 bed apartments at the
          same price in Kilimani: one with full baseline
          plus pool and gym, one with baseline only. The
          first will rent for roughly 8 to 12 percent more
          and let twice as fast. Net yield difference over
          a 5 year hold is typically 0.6 to 1.0 percentage
          points.
        </LI>
        <LI>
          Building with concerning amenity gaps (unreliable
          generator, no fibre, weak security): adjust the
          purchase price you would pay down by 10 to 15
          percent versus a fully amenitised comparable.
          Otherwise the rent and the void will quietly
          recover the gap from your yield.
        </LI>
        <LI>
          Buying off-plan: confirm in writing what amenities
          are included and at what specification. Pool tile
          quality, gym equipment brand, fibre provider,
          generator size, lift brand and warranty. We have
          seen brochures promise &ldquo;rooftop terrace and
          gym&rdquo; and deliver an empty rooftop and a room
          with a single secondhand treadmill.
        </LI>
      </UL>

      <Pullquote>
        Amenities decide time to let, time to let decides
        net yield, and net yield is the number that
        ultimately compounds into your return. Buy the
        building first, the unit second.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For every property we source, we run an amenity audit
        before recommending a unit. Generator size and
        autonomy, water storage capacity, fibre providers
        actually live in the building, lift brand and last
        major service date, gym equipment age, pool plant
        condition, security manning and gatehouse layout. We
        compare against the neighbourhood baseline so your
        unit is not the one that quietly under-lets in five
        years because the building stopped keeping up. See
        the deeper{" "}
        <Link
          href="/insights/best-neighbourhoods-nairobi-rental-yield-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          neighbourhood yield analysis
        </Link>{" "}
        and the related piece on{" "}
        <Link
          href="/insights/villa-vs-apartment-nairobi-which-rents-better"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          villas versus apartments in Nairobi
        </Link>
        .
      </P>
    </>
  );
}

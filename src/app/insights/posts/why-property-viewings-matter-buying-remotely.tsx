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
  slug: "why-property-viewings-matter-buying-remotely",
  title:
    "Why a property viewing still matters when you are buying from abroad",
  description:
    "Video walk-throughs feel thorough. They are not. Eight things only a person physically standing in the unit can see, the 14-point inspection checklist we run on every diaspora purchase, and a real example of what we caught.",
  publishedAt: "2025-08-06",
  readingMinutes: 8,
  author: authors.editors,
  tags: ["Buying", "Diaspora", "Property Sourcing", "Inspection", "Due Diligence"],
  country: "kenya",
  heroImage: "/images/locations/accra.jpg",
  heroAlt: "Apartment interior, why diaspora buyers still need an in-person property viewing",
};

export default function Article() {
  return (
    <>
      <Lede>
        A diaspora client recently sent us a video walk-through of a
        Lavington apartment they were about to wire 18 million shillings
        for. The video looked clean. The valuation looked clean. The
        title looked clean. The unit was, on paper, exactly what they
        wanted. We sent someone to stand inside it for an hour and
        walked away with a list that took the deal off the table.
      </Lede>

      <P>
        This piece is about why that hour matters and what we look for
        in it. It is also a quiet argument against the most common
        diaspora-buyer mistake we see: confusing &ldquo;I have seen the
        property on video&rdquo; with &ldquo;I have inspected the
        property&rdquo;. They are not the same activity.
      </P>

      <H2 id="what-video-actually-shows">What a video actually shows</H2>

      <P>
        Modern listing video is good. It captures geometry, finish at a
        glance, light at the moment of filming, and gives you a feel
        for whether you can imagine yourself in the rooms. For
        ruling a property{" "}
        <em>out</em>, it is excellent. If the kitchen layout is
        wrong on video, it is wrong in person.
      </P>

      <P>
        Where video fails is the long tail of things that show up only
        when a body is in the room. Eight categories specifically.
      </P>

      <H3 id="water-pressure">1. Water pressure and supply reliability</H3>

      <P>
        Most Nairobi and Accra apartments are on a tank-and-pump system
        with mains top-up. Pressure varies enormously between buildings
        and even between floors of the same building. The only way to
        know is to turn every tap on simultaneously, run the shower at
        the highest floor and watch what happens to the kitchen tap on
        the same line. Video skips this entirely.
      </P>

      <H3 id="smell">2. Smell</H3>

      <P>
        Damp, mould, sewer gas leaking from a dry trap, paint covering
        a fire-damage smell. None of it photographs and none of it
        films. We have seen luxury-finished apartments in
        Cantonments with clear flood damage history that looked
        immaculate on video. The smell told the truth in 30 seconds.
      </P>

      <H3 id="noise">3. Noise floor</H3>

      <P>
        Traffic from the road below at 6 PM. The mosque or church on
        the next street at 5 AM. The neighbours&rsquo; sound system on
        Saturday night. The lift motor on the floor above. The
        air-conditioning compressor outside the bedroom window.
        Listings are filmed mid-morning on a quiet weekday. The unit
        you are actually buying lives in a different acoustic
        environment.
      </P>

      <Pullquote>
        Listings are filmed mid-morning on a quiet weekday. The unit
        you are actually buying lives in a different acoustic
        environment.
      </Pullquote>

      <H3 id="daylight-angle">4. Daylight angle</H3>

      <P>
        A south-facing apartment in Nairobi looks bright in any video.
        A north-facing apartment with a tree against the window will
        also look bright in a noon video. Six months later the new
        owner is wondering why the living room is dim by 4 PM. The
        only fix is to be there at the times of day that matter for
        the use you have planned.
      </P>

      <H3 id="finish-quality">5. Finish quality up close</H3>

      <P>
        High-resolution listing photography rewards the seller and
        punishes the buyer. The grout that looks crisp at f/2.8 is
        actually patchy. The veneer kitchen unit photographs as solid
        wood. The marble counter is engineered stone with a chip
        repair near the sink. None of this is dishonest on the
        seller&rsquo;s side; it is what cameras do. It only shows up at
        20 centimetres.
      </P>

      <H3 id="snags">6. Snags and unfinished work</H3>

      <P>
        On new-build handover, the snag list is where the project
        actually finishes, and it is the buyer&rsquo;s responsibility
        to compile it. Hairline cracks, doors out of
        plumb, sockets installed but not energised, balcony tiles
        with hollow patches under them, sealant gaps along the
        kitchen splash-back. We typically generate a snag list of 20
        to 60 items on a remote-bought new-build. None of it is on
        the listing video.
      </P>

      <H3 id="building-amenities">7. Building amenities reality vs brochure</H3>

      <P>
        The brochure shows a swimming pool, a rooftop garden, a gym,
        a concierge desk and a back-up generator. The actual building
        delivers two of those things. The pool is shut for
        maintenance four months a year, the rooftop is locked, the
        gym has one broken treadmill, and the &ldquo;24-hour
        security&rdquo; is one guard with a torch. Video marketing
        rarely lies on this; it just photographs the moments where
        every amenity is operational.
      </P>

      <H3 id="neighbourhood-fit">8. The neighbourhood at street level</H3>

      <P>
        Walking out of the lobby and turning left tells you in five
        minutes whether the address you bought is the address you
        thought you were buying. Drainage on the access road, traffic
        ingress at peak, what the next property over looks like, what
        is being built across the street, and how the security on
        the block reads from the pavement. Listings are flown in by
        car or filmed from the unit; the walk-out experience is your
        tenant&rsquo;s real experience.
      </P>

      <H2 id="our-checklist">The 14-point checklist we run</H2>

      <P>
        Every property we shortlist for a diaspora buyer gets a
        physical inspection by our team before any offer is made. We
        run it against a fixed checklist so the report is the same
        shape on every unit and the buyer can compare apples to
        apples. The checklist:
      </P>

      <OL>
        <LI>Walk-up from the access road to the front door, photographed.</LI>
        <LI>Building exterior, common areas, lift and stairwell condition.</LI>
        <LI>
          Service charge ledger and arrears history, pulled from the
          management committee.
        </LI>
        <LI>
          Reserve fund balance, last AGM minutes, planned major works.
        </LI>
        <LI>Water pressure on every tap, simultaneous-load test.</LI>
        <LI>Hot water recovery time and geyser condition.</LI>
        <LI>Electrical safety: socket loads, breaker labelling, generator failover test.</LI>
        <LI>Drainage in every wet area, slope test, sewer gas check.</LI>
        <LI>Window seals, balcony waterproofing, evidence of past leaks.</LI>
        <LI>Daylight angle at three times of day if the timeline allows.</LI>
        <LI>Acoustic test against road, neighbours and building plant.</LI>
        <LI>Finish quality at 20cm: kitchens, bathrooms, joinery, flooring.</LI>
        <LI>Comparable rent and recent sales in the same building or block.</LI>
        <LI>
          Snag list of every defect, with photos, suitable for handing
          to the seller for resolution before completion.
        </LI>
      </OL>

      <Callout title="What the buyer receives">
        A single PDF report per property. Photos, video, written
        commentary against each of the 14 points, the snag list, and
        a one-page recommendation: proceed at asking, proceed at a
        revised price, or walk away. We do this on every property we
        sourced for the buyer, and we do it whether or not we end up
        managing the property afterwards.
      </Callout>

      <H2 id="real-example">
        What we caught on the Lavington apartment
      </H2>

      <P>
        Back to the example we opened with. The video showed a clean,
        recently refurbished 3-bed in Lavington at KES 18 million.
        The numbers worked. The title pulled clean at the Ministry of
        Lands. The valuation came in at asking.
      </P>

      <P>
        What the inspection caught:
      </P>

      <UL>
        <LI>
          Water pressure on the master bathroom dropped to a trickle
          when the kitchen tap and second bathroom were also running.
          The building&rsquo;s booster pump had been failing for six
          months and the management committee&rsquo;s reserve fund
          could not cover replacement.
        </LI>
        <LI>
          The kitchen veneer was lifting on three units. None of
          it was visible at the wide-angle filming distance. Quoted repair
          was KES 320,000.
        </LI>
        <LI>
          Drainage from the guest bathroom backed into the corridor
          floor drain on a load test. A blocked stack on the floor
          below.
        </LI>
        <LI>
          A hairline diagonal crack in the master bedroom that on
          inspection followed a structural beam line. Survey
          recommended a structural engineer&rsquo;s sign-off before
          completion.
        </LI>
      </UL>

      <P>
        The buyer renegotiated to KES 16.4 million conditional on the
        booster pump being replaced and the structural sign-off. The
        seller declined and the property went back on the market.
        Six months on, that unit is still listed.
      </P>

      <H2 id="cost-of-skipping">The cost of skipping the inspection</H2>

      <P>
        We have also onboarded the post-purchase clean-up. Diaspora
        buyers who skip the in-person inspection and discover the
        problems three months in, after the wire has cleared,
        typically spend the equivalent of a year of rent absorbing
        them, in repairs, lost rent during fix periods, and legal
        fees if the seller misrepresented the unit. None of
        that is recoverable in any market we operate in once the
        title has transferred.
      </P>

      <Pullquote>
        The right time to discover a building has a failing booster
        pump is the day before you wire the funds, not the week
        after.
      </Pullquote>

      <H2 id="if-buying-remotely">If you are buying remotely</H2>

      <P>
        Three things to insist on regardless of who is sourcing the
        property for you:
      </P>

      <OL>
        <LI>
          A physical inspection by a named individual you can
          identify, with a photo report and a snag list. Not a
          videographer, not a marketing tour.
        </LI>
        <LI>
          A service charge ledger and AGM minutes from the management
          committee, not just the seller&rsquo;s representation that
          &ldquo;all charges are up to date&rdquo;.
        </LI>
        <LI>
          A title check at the relevant registry done by your own
          property lawyer, paid by you, with the search receipt
          attached.
        </LI>
      </OL>

      <P>
        If you are buying with us through{" "}
        <Link
          href="/property-sourcing"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          property sourcing
        </Link>
        , all three are part of the service and the service is free
        for the buyer. If you are not buying with us, the same three
        are still the right things to insist on. The fastest way to
        protect a remote purchase is to assume the seller&rsquo;s
        video is a marketing artefact, not a survey.
      </P>
    </>
  );
}

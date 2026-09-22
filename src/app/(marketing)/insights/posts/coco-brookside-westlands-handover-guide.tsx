import Link from "next/link";
import { authors, type PostMeta } from "./_shared";
import {
  Callout,
  H2,
  KeySummary,
  LI,
  Lede,
  OL,
  P,
  Pullquote,
  UL,
} from "@/components/ArticleProse";

export const meta: PostMeta = {
  slug: "coco-brookside-westlands-handover-guide",
  title: "Coco Brookside: what to do before your handover",
  description:
    "Coco in Brookside, Westlands is HassConsult’s eighteen storey development of one and two bedroom apartments, published for completion in the first quarter of 2027. What to check before you take keys, why Westlands makes this a short-stay building before it is a long-let one, and how to weigh the letting offer your developer will make you.",
  metaDescription:
    "Coco in Brookside, Westlands completes in early 2027. What to check before keys, what the amenities cost you monthly, and who should let the unit.",
  publishedAt: "2026-09-13",
  readingMinutes: 11,
  author: authors.editors,
  tags: [
    "Coco",
    "Westlands",
    "Brookside",
    "Handover",
    "Nairobi",
    "Property Management",
    "Kenya",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Coco Brookside Westlands handover guide for owners taking keys in 2027",
};

export default function Article() {
  return (
    <>
      <Lede>
        Coco is an eighteen storey development of one and two bedroom
        apartments in Brookside, Westlands, conceptualised by HassConsult and
        priced from KES 8.9 million. If you bought one, the months before you
        take keys are the ones that decide what the unit earns in its first
        year, and almost all of the work that matters happens before the keys
        are in your hand rather than after.
      </Lede>

      <Callout title="Where these numbers come from">
        Drawn from HassConsult’s published material for the project, as at
        September 2026, and from our own letting data for Westlands. We have
        not inspected the building and we are not acting for the developer.
        Confirm anything that affects money against your own sale agreement,
        including the completion date and the payment schedule.
      </Callout>

      <KeySummary
        question="What should a Coco Brookside owner do before handover?"
        answer="Coco is an eighteen storey HassConsult development of one and two bedroom apartments in Brookside, Westlands, priced from KES 8.9 million, with completion published as the first quarter of 2027. Owners should treat that date as a forecast rather than a commitment and sign no tenant and accept no booking until keys are physically in hand, because a tenant with a signed lease and nowhere to live is the single most expensive mistake at this stage. Before handover, book a professional snagging inspection for handover day itself, get the defects liability period and its start date in writing, and ask for the service charge per square metre, which matters more than usual here because a heated infinity pool, a gym, a residents lounge and manned security are being funded by a building made entirely of one and two bedroom units. Westlands is the strongest short-stay market in Nairobi, earning USD 100 to 150 a night at 65 to 75 percent occupancy on corporate, UN and NGO demand that holds midweek, so the furnishing decision should be made before handover rather than after."
        facts={[
          { label: "Developer", value: "HassConsult" },
          { label: "Location", value: "Brookside, Westlands" },
          { label: "Scale", value: "18 floors, 1 and 2 bed" },
          { label: "Prices from", value: "KES 8.9m" },
          { label: "Published completion", value: "Q1 2027" },
          { label: "Westlands short stay", value: "USD 100 to 150 a night" },
          { label: "Realistic occupancy", value: "65% to 75%" },
        ]}
      />

      <H2 id="what-it-is">What Coco is</H2>

      <UL>
        <LI>
          <strong>Location:</strong> Brookside, Westlands, within reach of
          Sarit Centre, Westlands’ office cluster and Waiyaki Way, and close
          enough to Parklands, Lavington and Spring Valley to draw tenants
          from all three
        </LI>
        <LI>
          <strong>Scale:</strong> eighteen floors of one and two bedroom
          apartments. A total unit count has not been published that we can
          find, which is itself worth asking about, because it determines both
          your service charge share and how many neighbours list against you
        </LI>
        <LI>
          <strong>Pricing:</strong> published from KES 8.9 million
        </LI>
        <LI>
          <strong>Developer:</strong> HassConsult, one of the longest
          established property firms in Kenya and the publisher of the
          property index most of the market quotes
        </LI>
        <LI>
          <strong>Amenities:</strong> heated infinity pool, rooftop terrace,
          outdoor deck and forested lounge, fire pits, indoor residents
          lounge, fully fitted gym, video intercom, access control and manned
          security
        </LI>
        <LI>
          <strong>Published completion:</strong> the first quarter of 2027
        </LI>
      </UL>

      <P>
        On the developer question this is a more comfortable position than
        most Nairobi off plan buyers are in. There is no dispute about who is
        building it and no ambiguity about whether the firm will still exist
        next year, which is not something you can say about every project in{" "}
        <Link
          href="/insights/nairobi-upcoming-developments-2027-watchlist"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the current pipeline
        </Link>
        .
      </P>

      <H2 id="the-date">The date, and why it is worth pinning down</H2>

      <P>
        HassConsult’s own page for Coco publishes completion as the first
        quarter of 2027. If you have been told the fourth quarter of 2026,
        whether by an agent, a sales consultant or another buyer, do not treat
        the two as interchangeable. Get the date you are planning around
        confirmed in writing, against your sale agreement, by someone who will
        still be contactable in a year.
      </P>

      <P>
        We flag this not because either date is implausible but because the
        gap between them is exactly the size that costs owners money. A
        quarter is long enough to have furnished a unit, agreed a tenancy and
        started paying a service charge on an empty apartment. The published
        payment schedule is worth the same treatment: it has appeared on
        HassConsult’s own page as both five months and twelve, so confirm
        which applies to your unit rather than assuming.
      </P>

      <P>
        What either date should change about your planning is the same thing,
        and it is the one rule worth taking from this whole piece:
      </P>

      <Pullquote>
        Do not sign a tenant, accept a booking or promise anyone a move-in
        date until the keys are physically in your hand. A handover date is a
        forecast. A tenant with a signed lease and nowhere to live is a
        liability.
      </Pullquote>

      <P>
        Owners lose real money at this exact point every year, usually by
        agreeing a lease start in good faith off a projected date and then
        having to house the tenant somewhere else, refund them, or pay to
        store their furniture when the date slips by six weeks. Large
        residential projects in Nairobi routinely run past their original
        programme, and that is a fact about the market rather than a mark
        against any particular builder.
      </P>

      <H2 id="developer-agent">Your developer is also an estate agent</H2>

      <P>
        HassConsult is not only the developer here. It is one of the largest
        estate agencies in the country, with its own letting and management
        arm. There is a very good chance that at or shortly after handover you
        will be offered a letting or management service by the same firm that
        sold you the apartment, and it will be a convenient offer, made at the
        exact moment you are holding a set of keys and no tenant.
      </P>

      <P>
        That offer may well be a good one. It is not automatically the right
        one, and it deserves the same scrutiny as any other. Convenience at
        the handover desk is not the same thing as the best net return over
        three years. Things worth establishing in writing before you agree to
        anything:
      </P>

      <UL>
        <LI>
          <strong>The fee, and what is inside it.</strong> A letting fee and
          an ongoing management fee are different money. Ask which you are
          being quoted, and what is billed separately on top
        </LI>
        <LI>
          <strong>Whether the mandate is exclusive, and for how long.</strong>{" "}
          An exclusive letting mandate that runs for months means you cannot
          bring in anyone else while the unit sits empty
        </LI>
        <LI>
          <strong>
            How many units in this same building they will be letting.
          </strong>{" "}
          If one agent holds the mandate on many apartments in one
          development, your unit competes with their other listings for the
          same tenant, and you have no way of knowing which one they show
          first
        </LI>
        <LI>
          <strong>What happens if you want to leave.</strong> Notice period,
          exit fee, who holds the deposit, and how quickly keys and records
          come back
        </LI>
      </UL>

      <Callout title="The question that gets the most honest answer">
        Ask what the last three comparable units they let in Westlands
        actually achieved, how long each sat empty first, and whether those
        were furnished or unfurnished. Achieved rents and void periods
        together tell you something. An asking rent on its own tells you
        nothing.
      </Callout>

      <P>
        The same firm is handing over{" "}
        <Link
          href="/insights/enrogue-kileleshwa-handover-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Enrogue in Kileleshwa
        </Link>{" "}
        on a similar footprint, so if you own in both, expect the same
        conversation twice.
      </P>

      <H2 id="short-stay">Westlands makes this a short-stay building first</H2>

      <P>
        This is where Coco differs from most new stock, and it is the decision
        worth making before you furnish rather than after you have failed to
        let.
      </P>

      <P>
        Westlands is the strongest short-stay market in Nairobi, and not by a
        small margin. It is the only part of the city where a guest can walk
        to offices, Sarit Centre and Village Market without touching a car.
        Our own letting data for the area puts a well presented one or two bed
        at USD 100 to 150 a night at 65 to 75 percent occupancy across a full
        year, on demand that is corporate, UN and NGO rather than tourist.
        That distinction is the whole point: corporate demand holds midweek
        and through the low season, which is what makes occupancy here
        steadier than anywhere else in Nairobi.
      </P>

      <P>
        HassConsult has also, quite openly, built for this. The marketing
        leads on hotel-like interiors and an amenity deck, and it is pitched
        at investors as much as at occupiers. That is useful information about
        the building and about who your neighbours will be.
      </P>

      <P>
        The long let case is still perfectly sound and considerably less work.
        Westlands has deep professional tenant demand, and a one or two bed
        here lets without heroics. It is lower effort, lower return and far
        more predictable. The arithmetic on both sits in{" "}
        <Link
          href="/insights/airbnb-vs-long-term-rental-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          short let against long-term rental
        </Link>
        , and what Westlands specifically does as a short stay market is in{" "}
        <Link
          href="/insights/airbnb-westlands-2026-host-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the Westlands host guide
        </Link>
        .
      </P>

      <Callout title="Confirm the short stay position before you furnish">
        Get the position on short letting in writing from the management
        company or the by-laws before you spend anything on furniture. A new
        building with a residents’ association that has not met yet can change
        its mind in month four, and a furnished unit in a building that has
        just banned nightly guests is an expensive way to learn this. In a
        development marketed this heavily to investors, the association’s
        first vote on short lets is worth attending.
      </Callout>

      <H2 id="service-charge">The amenities are a monthly bill</H2>

      <P>
        A heated infinity pool, a rooftop terrace, fire pits, a residents
        lounge, a fully fitted gym, access control and a manned security
        entrance are the reason the brochure is attractive. They are also a
        running cost, and somebody pays it every month whether or not your
        unit is let.
      </P>

      <P>
        What makes this sharper at Coco than at a typical amenity heavy
        development is the unit mix. There are no three or four bedroom
        apartments here to carry a larger share. Eighteen floors of one and
        two bedroom units are funding a heated pool, and the cost per square
        metre of doing that is higher than it would be in a building with
        bigger homes in it.
      </P>

      <P>
        So ask for the service charge figure per square metre, what it assumes
        about the collection rate, and what happens when investor owners do
        not pay. A scheme that budgets on full collection in a building where
        most owners are landlords rather than residents is budgeting on
        something that does not happen. Heated water is the line item to ask
        about specifically, because it is the one that moves with the fuel
        price rather than staying where the budget put it.
      </P>

      <H2 id="supply">The thing nobody at the handover desk will mention</H2>

      <P>
        Eighteen floors of one and two bedroom apartments complete at once,
        and a meaningful share of them were bought by investors rather than
        occupiers. Those owners all receive keys in the same few weeks, and a
        large number of them will list within the same month.
      </P>

      <P>
        Your competition in the first quarter is not Westlands. It is the
        other apartments in your own building, several of which have the
        identical layout, the identical finish and an owner under the same
        pressure to get someone in. Westlands is also where most of Nairobi’s
        new apartment supply has landed, so a unit with generic furniture and
        phone photography discounts hard against a hundred near-identical
        neighbours. The ones that let first are furnished properly,
        photographed properly, and priced against what is actually being
        achieved rather than what the brochure projected.
      </P>

      <P>
        Our wider read on what simultaneous completions do to rents is in{" "}
        <Link
          href="/insights/nairobi-handover-wave-2026-what-it-means-for-rents"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the 2026 handover wave
        </Link>
        , the supply picture by suburb is in{" "}
        <Link
          href="/insights/nairobi-apartment-oversupply-2026-suburbs-to-avoid"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          where the oversupply actually is
        </Link>
        , and the neighbourhood itself is covered in{" "}
        <Link
          href="/insights/westlands-complete-guide-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the Westlands guide
        </Link>
        .
      </P>

      <H2 id="before-keys">What to do in the months before you take keys</H2>

      <OL>
        <LI>
          <strong>
            Book your snagging inspection for handover day itself,
          </strong>{" "}
          not for a fortnight later. Bring somebody who does this for a
          living. Defects you record on the day are the developer’s problem;
          defects you find in month two become an argument
        </LI>
        <LI>
          <strong>Get the defects liability period in writing,</strong> with
          its start date and what it covers. This is the window in which the
          builder fixes things at their cost, and it starts running whether or
          not you use it
        </LI>
        <LI>
          <strong>Ask for the service charge figure per square metre,</strong>{" "}
          what it assumes about collection rates, and what the amenity deck
          costs to run. In a building of this kind it is the most reliable
          source of unpleasant surprises
        </LI>
        <LI>
          <strong>Decide furnished or unfurnished now,</strong> because the
          answer changes what you order, what you photograph and which market
          you are letting into. In Westlands the furnished case is stronger
          than in most of Nairobi, which is exactly why more of your
          neighbours will also furnish
        </LI>
        <LI>
          <strong>Sort the utilities and the meter transfer early.</strong> A
          unit that cannot be shown because the power is not connected loses
          weeks at exactly the moment every other owner is also trying to let
        </LI>
        <LI>
          <strong>
            Register for rental income tax before the first shilling arrives.
          </strong>{" "}
          It is far easier to start correctly than to regularise later
        </LI>
        <LI>
          <strong>Order furniture on a lead time, not on a hope.</strong>{" "}
          Nairobi lead times run to weeks, and an empty furnished unit waiting
          on a sofa is a void you chose
        </LI>
      </OL>

      <P>
        The tax position, including what is deductible and when the
        simplified regime applies, is in{" "}
        <Link
          href="/insights/airbnb-tax-kenya-2026-host-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the Kenyan short-let tax guide
        </Link>
        .
      </P>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        We let and manage units in Westlands, long term and short stay, and we
        are independent of any developer, which means we have no interest in
        telling you the building is better or worse than it is. We charge 10
        percent of rent collected on a long let and 20 percent of revenue on a
        short stay, with no setup fee and no exit fee, and we will tell you
        before you commit which of the two your specific unit is actually
        suited to. What the short stay side looks like on this side of
        Westlands is set out under{" "}
        <Link
          href="/nairobi/brookside/airbnb-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Airbnb management in Brookside
        </Link>
        .
      </P>

      <P>
        Because completion is still some way off, there is more you can do
        here than at a building already handing over. A unit that is furnished,
        photographed and listed the week it is released lets at a better rate
        than one that starts competing in month three, and that only happens
        if the decisions are made now.
      </P>

      <P>
        If you are taking keys at Coco,{" "}
        <Link
          href="/list-your-property"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          list your property
        </Link>{" "}
        and we will give you an achievable rent and an honest view on how long
        it will take, rather than the number that wins the instruction. If you
        are still deciding who should run it,{" "}
        <Link
          href="/airbnb-management-companies-kenya"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how to tell the firms apart
        </Link>{" "}
        sets out the questions worth asking every one of us.
      </P>

      <P>
        For the same developer&rsquo;s larger Westlands tower, which hands over
        sold out in the fourth quarter of 2026 after slipping a year, and where
        the letting arrangement is the thing to read before anything else, see{" "}
        <Link
          href="/insights/1870-west-westlands-handover-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          1870 West
        </Link>
        .
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/how-to-find-a-property-manager-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how to find a property manager in Nairobi
        </Link>
        ,{" "}
        <Link
          href="/insights/brookside-oak-off-plan-review-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Brookside Oak reviewed
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/why-your-nairobi-rental-keeps-going-vacant"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          why your Nairobi rental keeps going vacant
        </Link>
        .
      </P>
    </>
  );
}

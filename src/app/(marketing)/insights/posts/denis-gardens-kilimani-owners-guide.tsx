import Link from "next/link";
import { authors, type PostMeta } from "./_shared";
import {
  Callout,
  H2,
  H3,
  KeySummary,
  LI,
  Lede,
  OL,
  P,
  Pullquote,
  UL,
} from "@/components/ArticleProse";

export const meta: PostMeta = {
  slug: "denis-gardens-kilimani-owners-guide",
  title:
    "Denis Gardens, Kilimani: the building where the nightly rate wins at 31 percent occupancy",
  metaTitle: "Denis Gardens Kilimani: an owner's guide to letting",
  description:
    "A two bedroom here lets at KES 65,000 a month unfurnished and KES 7,000 a night furnished. Nine nights pays the month. That ratio is the most favourable we have found in Nairobi, and it points the opposite way to Riverside.",
  metaDescription:
    "Denis Gardens Kilimani lets at KES 65,000 a month or KES 7,000 a night. Why the short let wins decisively here.",
  publishedAt: "2026-10-29",
  readingMinutes: 11,
  author: authors.editors,
  tags: [
    "Denis Gardens",
    "Kilimani",
    "Short Let",
    "Nairobi",
    "Property Management",
    "Kenya",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Denis Gardens Kilimani owners guide to letting a two or three bedroom apartment",
  faq: [
    {
      q: "What does an apartment at Denis Gardens rent for?",
      a: "Unfurnished, published listings put a studio at KES 40,000 a month, a two bedroom with master en suite and two balconies of 110 square metres at KES 65,000, a three bedroom of 120 square metres at KES 75,000 to 80,000, and a three bedroom with two en suite plus DSQ at 150 square metres at KES 80,000 to 90,000. Furnished and let nightly, the same building advertises a studio at KES 3,500 to 4,000 a night, a two bedroom at KES 7,000, a three bedroom at KES 9,000 and the three bedroom plus DSQ at KES 10,000. Sale prices run from KES 8.5 million for a 100 square metre two bedroom to KES 12.5 million for the three bedroom with DSQ.",
    },
    {
      q: "Is a short let better than a long let at Denis Gardens?",
      a: "On these published rates, clearly yes, and by a wider margin than almost anywhere else in Nairobi. A two bedroom lets unfurnished at KES 65,000 a month and furnished at KES 7,000 a night, so a little over nine nights covers the entire monthly rent. That is a gross crossover of about 31 percent occupancy, and even after platform commission, cleaning between stays and short stay management at double the long let fee, the real crossover sits in the mid forties. Our Kilimani data puts a well presented short let at 62 to 74 percent occupancy across a full year, so there is genuine headroom here rather than a theoretical case. You still have to fund the furnishing and manage the unit properly.",
    },
    {
      q: "Why did the studios and one bedrooms sell out first?",
      a: "Because they earn the most per square metre and the investors buying here did the arithmetic. A studio lets at KES 40,000 a month and a 110 square metre two bedroom lets at KES 65,000, so the studio produces far more rent per square metre of floor area bought. The same holds nightly, where a studio at KES 3,500 to 4,000 against a two bedroom at KES 7,000 means two studios beat one two bedroom on the same footprint. If you own a two or three bedroom here, that is not a reason for regret, but it does tell you that your unit competes on space and family suitability rather than on yield, and it should be marketed that way.",
    },
  ],
};

export default function Article() {
  return (
    <>
      <Lede>
        Denis Gardens publishes something most Nairobi buildings do not: a
        monthly rent and a nightly rate for every single layout. Put the two
        beside each other for a two bedroom and you get KES 65,000 a month
        against KES 7,000 a night. Nine nights pays the month. That is the most
        favourable ratio we have found in this city.
      </Lede>

      <Callout title="Where these numbers come from">
        Published agent listings for Denis Gardens on Denis Pritt Road,
        Kilimani, read in October 2026, together with our own letting and short
        stay data for Kilimani. Rates are asking rates and the agents disagree
        with each other on the three bedrooms, which we have shown as ranges.
        The nightly figures are the building&rsquo;s own furnished rate card
        and assume a furnished unit, which the monthly figures do not. We
        manage in Kilimani; we sold nothing in this development.
      </Callout>

      <KeySummary
        question="What does an apartment at Denis Gardens rent for?"
        answer="Unfurnished, published listings put a studio at KES 40,000 a month, a two bedroom with master en suite and two balconies of 110 square metres at KES 65,000, a three bedroom of 120 square metres at KES 75,000 to 80,000, and a three bedroom with two en suite plus DSQ at 150 square metres at KES 80,000 to 90,000. Furnished and let nightly, the same building advertises a studio at KES 3,500 to 4,000 a night, a two bedroom at KES 7,000, a three bedroom at KES 9,000 and the three bedroom plus DSQ at KES 10,000. Sale prices run from KES 8.5 million for a 100 square metre two bedroom to KES 12.5 million for the three bedroom with DSQ."
        facts={[
          { label: "Location", value: "Denis Pritt Road, Kilimani" },
          { label: "Studio", value: "KES 40,000 a month" },
          { label: "2 bed, 110 sq m", value: "KES 65,000 a month" },
          { label: "3 bed plus DSQ, 150 sq m", value: "KES 80,000 to 90,000" },
          { label: "2 bed nightly", value: "KES 7,000 furnished" },
          { label: "3 bed nightly", value: "KES 9,000 furnished" },
          { label: "Sale prices", value: "KES 8.5M to 12.5M" },
          { label: "Yaya Centre", value: "Five minutes" },
        ]}
      />

      <H2 id="what-it-is">What the building actually is</H2>

      <P>
        A completed high rise on Denis Pritt Road in Kilimani, one of the
        established residential streets in that part of Nairobi, ready for
        occupation. Studios through to three bedrooms with a domestic staff
        quarter, most layouts with two private balconies, open plan living
        rooms, fitted kitchens with granite countertops opening onto a laundry
        area, built in wardrobes and en suite master bedrooms.
      </P>

      <P>
        The services are a strong set: high speed lifts in every block, a fully
        equipped gym, a rooftop terrace with city views, solar water heating, a
        standby generator, a borehole, DSTV and internet readiness, one
        designated parking space per unit with ample visitor parking, and
        security around the clock with CCTV, access control, patrol guards and
        electric fencing. It is also wheelchair accessible and pet friendly,
        which is rarer in Nairobi than it should be and worth saying in a
        listing.
      </P>

      <P>
        Position is five minutes from Yaya Centre, ten from the Junction Mall,
        with Valley Arcade nearby, Makini and Precious Blood schools close, and
        Nairobi Hospital, the Aga Khan and Nairobi Women&rsquo;s Hospital all
        within reach. Lavington, Kileleshwa and Upper Hill are the working
        destinations.
      </P>

      <H3 id="what-it-rents-for">
        What does an apartment at Denis Gardens rent for?
      </H3>

      <P>Unfurnished, by the month:</P>

      <UL>
        <LI>
          <strong>Studio.</strong> KES 40,000
        </LI>
        <LI>
          <strong>Two bedroom, master en suite, two balconies, 110 sq m.</strong>{" "}
          KES 65,000
        </LI>
        <LI>
          <strong>Three bedroom, two balconies, 120 sq m.</strong> KES 75,000 to
          80,000
        </LI>
        <LI>
          <strong>Three bedroom, two en suite, DSQ, 150 sq m.</strong> KES
          80,000 to 90,000
        </LI>
      </UL>

      <P>Furnished, by the night, from the same building&rsquo;s rate card:</P>

      <UL>
        <LI>
          <strong>Studio.</strong> KES 3,500 to 4,000
        </LI>
        <LI>
          <strong>Two bedroom.</strong> KES 7,000
        </LI>
        <LI>
          <strong>Three bedroom.</strong> KES 9,000
        </LI>
        <LI>
          <strong>Three bedroom plus DSQ.</strong> KES 10,000
        </LI>
      </UL>

      <P>
        Sale prices are quoted at KES 8.5 million for the 100 square metre two
        bedroom, KES 9 million with two balconies, KES 10 million for the three
        bedroom and KES 12.5 million for the three bedroom with DSQ. Against
        the rents those give gross yields between roughly 7.7 and 8.7 percent,
        which is a believable range rather than a promotional one. It is a
        useful benchmark to carry: when a newer tower advertises 15 percent,
        this is what honest Kilimani stock actually looks like.
      </P>

      <H2 id="the-crossover">Nine nights pays the month</H2>

      <H3 id="is-a-short-let-better">
        Is a short let better than a long let at Denis Gardens?
      </H3>

      <P>
        Divide the monthly rent by the nightly rate for each layout and the
        picture is startling.
      </P>

      <UL>
        <LI>
          <strong>Two bedroom.</strong> KES 65,000 divided by KES 7,000 is 9.3
          nights, about 31 percent occupancy
        </LI>
        <LI>
          <strong>Three bedroom.</strong> KES 75,000 divided by KES 9,000 is 8.3
          nights, about 28 percent
        </LI>
        <LI>
          <strong>Three bedroom plus DSQ.</strong> KES 80,000 divided by KES
          10,000 is 8 nights, about 27 percent
        </LI>
        <LI>
          <strong>Studio.</strong> KES 40,000 divided by KES 3,500 is 11.4
          nights, about 38 percent
        </LI>
      </UL>

      <Pullquote>
        At Winchester Gardens on Riverside Drive the nightly route only starts
        to pay above about 70 percent occupancy. Here it starts to pay above
        31. Same city, opposite answer.
      </Pullquote>

      <P>
        Be honest about what that comparison leaves out. The monthly figures
        are unfurnished and the nightly ones are not, so the nightly route
        requires you to furnish the apartment first, and that capital has to be
        recovered. Nightly letting also carries costs a tenancy does not:
        platform commission on every reservation, a full turnover clean after
        every departure, and short stay management at roughly double the long
        let fee because it is roughly double the work.
      </P>

      <P>
        Put those in and the crossover moves from the low thirties into the mid
        forties. That is still comfortably below our Kilimani band of 62 to 74
        percent occupancy for a well presented, actively managed short let. The
        headroom here is real, not theoretical.
      </P>

      <P>
        The reason it differs so sharply from Riverside is worth understanding
        rather than just exploiting. On Riverside Drive the monthly rate is held
        up by diplomatic and corporate tenants whose housing is employer paid,
        so a furnished monthly let already captures a premium rent and the
        nightly route has little left to add. Denis Pritt Road has no such
        floor: its monthly rents are set by the ordinary Kilimani rental market
        at KES 65,000, while its nightly rates are set by the Kilimani visitor
        market. The gap between those two markets is the opportunity.
      </P>

      <Callout title="Before you furnish, settle the rule">
        Get the management company&rsquo;s position on nightly guests in
        writing. This building advertises a furnished nightly rate card itself,
        which is a good sign, but good signs are not permissions. Kilimani
        blocks differ and some cap how many units may operate a short let, so
        confirm your unit is inside the cap before the furniture arrives.
      </Callout>

      <P>
        The arithmetic both ways is in{" "}
        <Link
          href="/insights/airbnb-vs-long-term-rental-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          short let against long term rental
        </Link>
        , what Kilimani does as a nightly market is in{" "}
        <Link
          href="/insights/airbnb-kilimani-2026-host-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the Kilimani host guide
        </Link>
        , and the furnishing budget is in{" "}
        <Link
          href="/insights/cost-furnish-nairobi-apartment-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the cost to furnish a Nairobi apartment
        </Link>
        .
      </P>

      <H2 id="small-units">What the sold out studios tell you</H2>

      <H3 id="why-studios-sold-out">
        Why did the studios and one bedrooms sell out first?
      </H3>

      <P>
        The marketing for this building notes that studios and one bedrooms are
        sold out while two and three bedrooms remain available. That is not an
        accident of timing. A studio lets at KES 40,000 a month and a 110 square
        metre two bedroom lets at KES 65,000, so per square metre of floor area
        purchased the studio earns dramatically more. Nightly the same holds: a
        studio at KES 3,500 to 4,000 against a two bedroom at KES 7,000 means
        two studios on one two bedroom footprint earn more than the two
        bedroom.
      </P>

      <P>
        Investors work this out, which is why the small units go first in almost
        every Nairobi development. If you own a two or three bedroom here, the
        conclusion is not regret but positioning. Your unit does not win on
        yield per square metre and it should not be marketed as though it did.
        It wins on space, on the second balcony, on the DSQ, and on being
        suitable for a family or a group of four rather than one person, and
        there is far less competition at that end of the building.
      </P>

      <H2 id="what-to-do">What to do if yours is sitting empty</H2>

      <OL>
        <LI>
          <strong>Run the crossover for your own layout.</strong> Monthly rent
          divided by nightly rate. If the answer is under twelve nights, the
          nightly route deserves a serious look
        </LI>
        <LI>
          <strong>Photograph the rooftop terrace and the city view.</strong> It
          is the thing this building has that the next one on Denis Pritt Road
          does not, and the listings mention it without showing it
        </LI>
        <LI>
          <strong>Market the second balcony and the DSQ.</strong> For the larger
          units these are the differentiators, and a DSQ reads better as a home
          office or guest room than as staff space
        </LI>
        <LI>
          <strong>Say that it is pet friendly.</strong> It genuinely narrows a
          tenant&rsquo;s options in Nairobi and almost no listing leads with it
        </LI>
        <LI>
          <strong>Check the service charge collection rate.</strong> A borehole,
          a generator, solar water heating and lifts in every block are only an
          advantage while the levy funds them
        </LI>
      </OL>

      <P>
        The general diagnosis is in{" "}
        <Link
          href="/insights/why-your-nairobi-rental-keeps-going-vacant"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          why your Nairobi rental keeps going vacant
        </Link>
        , and what the levy should cover is in{" "}
        <Link
          href="/insights/service-charge-nairobi-apartments-explained"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          service charge explained
        </Link>
        .
      </P>

      <H2 id="tenants">If you are looking to rent here</H2>

      <P>
        Denis Gardens is good value for Kilimani, particularly in the larger
        layouts. A 150 square metre three bedroom with two en suite bathrooms,
        a staff quarter and two balconies at KES 80,000 to 90,000 is a lot of
        apartment for the money by the standards of this neighbourhood, and the
        generator, borehole and solar water heating mean the basics are covered.
      </P>

      <P>
        For a stay of a week or a month, ask for the long stay rate rather than
        taking the nightly one. The building publishes nightly rates and an
        owner holding empty midweek nights will usually go a long way past the
        rate card for a month. If you want us to tell you what is genuinely
        available,{" "}
        <Link
          href="/find-a-home"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          find a home
        </Link>{" "}
        is where to start.
      </P>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        We manage short stay and long lets in Kilimani, including on this road,
        and we sold nothing in this development, so there is no projection of
        ours to defend. We charge 10 percent of rent collected on a long let
        and 20 percent of revenue on a short stay, with no setup fee and no
        exit fee. At Denis Gardens the honest answer usually favours the short
        let, which is also the service we are paid more for, so the thing to
        hold us to is the arithmetic rather than the recommendation. Ask us for
        the crossover on your specific unit and check it yourself.
      </P>

      <P>
        If your apartment is empty,{" "}
        <Link
          href="/list-your-property"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          send it to us
        </Link>{" "}
        with the floor and the layout and we will come back with an achievable
        rate both ways. What{" "}
        <Link
          href="/airbnb-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Airbnb management
        </Link>{" "}
        and{" "}
        <Link
          href="/long-term-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          long term management
        </Link>{" "}
        each cover is set out in full.
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/winchester-gardens-riverside-owners-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Winchester Gardens, where the same sum points the other way
        </Link>
        ,{" "}
        <Link
          href="/insights/kilimani-apartment-market-changing-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how the Kilimani apartment market is changing
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/how-to-price-nairobi-rental"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          pricing a Nairobi rental
        </Link>
        .
      </P>
    </>
  );
}

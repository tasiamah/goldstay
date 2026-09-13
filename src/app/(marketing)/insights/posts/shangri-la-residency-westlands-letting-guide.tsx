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
  slug: "shangri-la-residency-westlands-letting-guide",
  title: "Shangri-La Residency, Westlands: letting a unit that is sitting empty",
  // The editorial title renders at 597px against the roughly 600 Google
  // allows, which is inside the budget only by accident. This one keeps
  // the building name and the question the owner is actually typing.
  metaTitle: "Shangri-La Residency Westlands: why your unit is empty",
  description:
    "Shangri-La Residency on 25 Westlands Road handed over with around eighty apartments, most of them studios and one beds bought by investors. They came to market in the same few weeks. Why the empty ones are empty, what the units actually rent for, and what to do about a void that has run on.",
  metaDescription:
    "Around eighty units at Shangri-La Residency came to market at once. Why yours is empty, what Westlands actually pays, and how to fix a long void.",
  publishedAt: "2026-09-13",
  readingMinutes: 11,
  author: authors.editors,
  tags: [
    "Shangri-La Residency",
    "Westlands",
    "Letting",
    "Nairobi",
    "Property Management",
    "Kenya",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Shangri-La Residency Westlands letting guide for owners with empty apartments",
};

export default function Article() {
  return (
    <>
      <Lede>
        Shangri-La Residency, on 25 Westlands Road, is a high rise of studios,
        one and two bedroom apartments that has now handed over. It was sold
        out off plan, a large share of it to investors rather than occupiers,
        and those owners took keys within a few weeks of each other. If yours
        has been advertised for a while without a tenant, the reason is
        probably not the one you have been given, and it is almost certainly
        not that Westlands rents have fallen.
      </Lede>

      <Callout title="Where these numbers come from">
        Published agent listings and off plan sales material for the
        development, and our own letting data for Westlands, as at September
        2026. The building is variously marketed as Shangri-La Residency and
        Shangri-La Residences. We have not inspected it, we did not sell
        anything in it, and the figures agents published for it disagree with
        each other in places, which we have flagged where it matters.
      </Callout>

      <KeySummary
        question="Why is my Shangri-La Residency apartment in Westlands not letting?"
        answer="Shangri-La Residency on 25 Westlands Road is a high rise of around eighty studios, one and two bedroom apartments that sold out off plan, largely to investors, and handed over within a few weeks. That means a large number of near-identical units reached the letting market simultaneously, in the part of Nairobi where more new apartments have been delivered than anywhere comparable. A unit sitting empty here is usually losing to the other apartments in its own building rather than to the wider market, because a tenant viewing four units with the same layout and the same finish on the same afternoon decides on presentation, natural light and parking rather than on a small rent difference. Published sales material quoted monthly rents of around KES 85,000 to 90,000 for a 950 square foot two bedroom and KES 110,000 for a 1,150 square foot unit, which are achievable for a well presented apartment and optimistic for an undifferentiated one. For the 500 square foot studios and one beds, short letting in Westlands at USD 100 to 150 a night and 65 to 75 percent occupancy is frequently the better business, because a small unit cannot differentiate itself on a long let but can on a nightly one."
        facts={[
          { label: "Location", value: "25 Westlands Road, Westlands" },
          { label: "Scale", value: "About 80 units, studio to 2 bed" },
          { label: "Status", value: "Handed over, sold out off plan" },
          { label: "Studio and 1 bed", value: "500 sq ft, sold from KES 5.5m" },
          { label: "2 bed", value: "950 to 1,150 sq ft, KES 9m to 11m" },
          { label: "Quoted rents", value: "KES 85,000 to 110,000 a month" },
          { label: "Westlands short stay", value: "USD 100 to 150 a night" },
        ]}
      />

      <H2 id="what-it-is">What the building is</H2>

      <UL>
        <LI>
          <strong>Location:</strong> 25 Westlands Road, off Westlands Road.
          Agents publish it at roughly 400m from GTC, 600m from the Westlands
          Naivas and 850m from Sarit Centre, with Westgate about five minutes
          away by car
        </LI>
        <LI>
          <strong>Scale:</strong> published as seventeen floors and around
          eighty units, although at least one agent&rsquo;s price list runs to
          a twentieth floor with a KES 500,000 premium on the top three levels.
          Worth establishing which is right for your own block before you
          price against a neighbour
        </LI>
        <LI>
          <strong>Unit mix:</strong> studios and one bedrooms at about 500
          square feet, two bedrooms at 950 and 1,150 square feet
        </LI>
        <LI>
          <strong>Off plan pricing:</strong> studios and one beds from KES 5.5
          million, both reported sold out early; two beds from around KES 9
          million at 950 square feet and KES 10.2 to 11 million at 1,150
        </LI>
        <LI>
          <strong>Amenities:</strong> borehole and water storage, standby
          generator, fully equipped gym, lift, access control and CCTV,
          parking, internet and intercom provision, with a rooftop lounge in
          the marketing
        </LI>
        <LI>
          <strong>Status:</strong> completion was published variously as
          August, September and December 2025, and units have been advertised
          as immediately available through 2026. It is handed over
        </LI>
      </UL>

      <P>
        The developer is listed in third party project data as Oxford Gate Real
        Estate, marketed through several agencies rather than one. That is
        worth knowing for a different reason than usual, which we come to
        below.
      </P>

      <H2 id="why-empty">Why your unit is empty</H2>

      <P>
        Start with the thing the sales process had no reason to tell you.
        Around eighty apartments completed at once. Most of the small units
        sold to investors, because a 500 square foot studio at KES 5.5 million
        is an investment product rather than a home somebody buys to live in.
        Every one of those owners received keys in the same short window, and
        a large number of them listed for rent in the same month.
      </P>

      <Pullquote>
        Your competition is not Westlands. It is the eleventh floor. Several
        apartments in your own building have the identical layout, the
        identical finish and an owner under exactly the same pressure to get
        somebody in.
      </Pullquote>

      <P>
        This matters because of how a tenant actually decides. Someone looking
        for a one bed near Sarit will see four of them in an afternoon, and
        three of those four may be in your building. Faced with the same
        floor plan four times, they do not choose on rent. A difference of KES
        5,000 a month is not what separates the units, and dropping your
        asking rent by that much mostly signals that you will drop it again.
      </P>

      <P>
        Our own read on the wider submarket is blunt about this. More
        apartments have been delivered in Westlands than in any comparable part
        of Nairobi, and the practical effect is that a unit which is merely
        adequate sits empty while a well presented one on the same street lets
        in a fortnight. Void periods in Westlands are a presentation problem
        far more often than a pricing problem. The rents have not collapsed.
        What has widened is the gap between the top and the bottom of the same
        rent band, and an averagely finished unit now sits at the bottom of it.
      </P>

      <P>
        The detail is in{" "}
        <Link
          href="/insights/nairobi-apartment-oversupply-2026-suburbs-to-avoid"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          where the oversupply actually is
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/nairobi-handover-wave-2026-what-it-means-for-rents"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          what the 2026 handover wave does to rents
        </Link>
        .
      </P>

      <H2 id="the-agent-problem">Several agencies sold it, and that follows through</H2>

      <P>
        Shangri-La was marketed through more than one agency. Those same firms
        are a natural first call for an owner who now needs a tenant, and
        several of them are likely holding letting instructions on multiple
        units in the building at the same time.
      </P>

      <P>
        Think about what that means from the agent&rsquo;s side. If they hold
        six one beds in one block, they have no particular reason to care which
        one lets, and every reason to show whichever is easiest. You have no
        way of knowing whether yours was shown first, fourth or not at all.
        Worth asking directly:
      </P>

      <UL>
        <LI>
          <strong>How many units in this building are you letting?</strong>{" "}
          Not how many they have on their books overall
        </LI>
        <LI>
          <strong>Is my instruction exclusive, and for how long?</strong> An
          exclusive mandate that runs for months while the unit sits empty is
          the worst of both positions
        </LI>
        <LI>
          <strong>
            What did the last three units you let in this building actually
            achieve, and how long was each empty first?
          </strong>{" "}
          Achieved rent and void period together tell you something. An asking
          rent on its own tells you nothing
        </LI>
        <LI>
          <strong>How many viewings has my unit had, and by whom?</strong> A
          unit with no viewings has a marketing problem. A unit with ten
          viewings and no offer has a presentation or a pricing problem, and
          those are fixed differently
        </LI>
      </UL>

      <Callout title="The question that separates the two problems">
        Ask for the viewing count before you touch the rent. Owners cut the
        asking rent when the real fault is that the listing has four dark
        phone photographs and no floor plan, and then they have a cheaper unit
        that still nobody views.
      </Callout>

      <H2 id="what-it-rents-for">What the units actually rent for</H2>

      <P>
        The off plan material quoted monthly rents of roughly KES 85,000 to
        90,000 for a 950 square foot two bedroom and KES 110,000 for the 1,150
        square foot layout. Those are not fantasy numbers. They are achievable
        in Westlands for an apartment that is genuinely well presented in a
        well run block, and they are optimistic for one that is not.
      </P>

      <P>
        That is the honest position, and it is more useful than either
        reassurance or alarm. A projected rent in a sales brochure is the top
        of the band, quoted by somebody selling you the unit, and it assumed a
        standard of finish, furnishing and marketing that is now entirely your
        responsibility. It was never a floor.
      </P>

      <P>
        Two things follow. The first is that the two bedroom units have the
        better long let case here, because at 950 and 1,150 square feet they
        can actually differentiate on space, light and layout against the rest
        of the building. The second is that the studios and one beds, at 500
        square feet with the same plan repeated dozens of times, mostly cannot.
      </P>

      <P>
        How to price against real comparables rather than the brochure is in{" "}
        <Link
          href="/insights/how-to-price-nairobi-rental"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          pricing a Nairobi rental
        </Link>
        , and the furnishing decision is in{" "}
        <Link
          href="/insights/furnished-or-unfurnished-rental-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          furnished against unfurnished
        </Link>
        .
      </P>

      <H2 id="short-stay">The escape route for a small unit</H2>

      <P>
        If you own one of the 500 square foot units and it has been empty for
        weeks, this is the section worth reading twice.
      </P>

      <P>
        Westlands is the strongest short stay market in Nairobi, and not
        narrowly. It is the only part of the city where a guest can walk to
        offices, Sarit Centre and Village Market without touching a car. Our
        letting data for the area puts a well presented small unit at USD 100
        to 150 a night at 65 to 75 percent occupancy across a full year, on
        demand that is corporate, UN and NGO rather than tourist. Because that
        demand is business travel, it holds midweek and through the low season,
        which is why occupancy here is steadier than anywhere else in Nairobi.
      </P>

      <P>
        The reason this suits your unit specifically is the thing that hurts it
        on a long let. A 500 square foot apartment cannot win a long tenancy on
        space, so it is stuck competing on rent against dozens of identical
        neighbours. On a nightly basis, size matters much less and presentation
        matters much more, and a corporate guest on a two week assignment is
        choosing between your furnished unit and a hotel room rather than
        between your unit and the one upstairs. Shangri-La has the borehole,
        the generator, the lift, the gym and the access control that guests
        care about, and it is walkable to the offices they are visiting.
      </P>

      <Callout title="Confirm the building allows it before you furnish">
        Get the position on short letting in writing from the management
        company or the by-laws first. A building this heavily investor owned
        will have a residents&rsquo; association that either embraces short
        lets or moves to ban them, and a furnished unit in a building that has
        just voted against nightly guests is an expensive way to find out.
        Some Nairobi blocks also cap how many units may operate one.
      </Callout>

      <P>
        The arithmetic on both routes is in{" "}
        <Link
          href="/insights/airbnb-vs-long-term-rental-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          short let against long term rental
        </Link>
        , and what Westlands does specifically as a short stay market, area by
        area, is in{" "}
        <Link
          href="/insights/airbnb-westlands-2026-host-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the Westlands host guide
        </Link>
        .
      </P>

      <H2 id="what-to-do">What to do about a void that has run on</H2>

      <OL>
        <LI>
          <strong>Get the viewing count first.</strong> No viewings is a
          marketing fault, viewings without offers is a presentation or pricing
          fault, and the two have different fixes. Do not cut the rent until
          you know which one you have
        </LI>
        <LI>
          <strong>Photograph it properly, in daylight.</strong> This is the
          single highest return thing available to you and it costs less than
          one week of the void. A high floor unit off Westlands Road has a view
          worth photographing, and most of the listings in the building do not
          show it
        </LI>
        <LI>
          <strong>Publish a floor plan and the real service charge.</strong>{" "}
          Tenants filter on total monthly cost. A listing that hides the
          service charge gets fewer, worse qualified viewings
        </LI>
        <LI>
          <strong>Decide furnished or unfurnished, then commit.</strong> In
          Westlands both work, because corporate and allowance backed tenants
          and long stay unfurnished tenants are both present in volume. A unit
          that is half furnished appeals to neither
        </LI>
        <LI>
          <strong>Check the service charge collection rate in the block.</strong>{" "}
          In a heavily investor owned building, owners who are not receiving
          rent often stop paying the levy, and deferred maintenance in the
          common areas shows up in every viewing you host
        </LI>
        <LI>
          <strong>Stop competing on rent alone.</strong> Against dozens of
          identical units a rent cut is matched within a week, and you have
          reset the building&rsquo;s achievable rent for everyone including
          yourself
        </LI>
        <LI>
          <strong>If it is a small unit and three months have gone,</strong>{" "}
          price the short stay option properly rather than waiting for the long
          let market to improve. It is not going to improve while the other
          seventy owners are still trying
        </LI>
      </OL>

      <P>
        The general version of this diagnosis, for units outside this
        building, is in{" "}
        <Link
          href="/insights/why-your-nairobi-rental-keeps-going-vacant"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          why your Nairobi rental keeps going vacant
        </Link>
        .
      </P>

      <H2 id="tenants">If you are looking to rent here rather than let</H2>

      <P>
        Worth saying, because a good share of the people searching this
        building are tenants rather than owners. Shangri-La is a sensible place
        to rent if you work in Westlands and want to walk to it. You get a
        borehole, a generator, a lift, a gym and controlled access, which
        together remove most of the day to day irritations of Nairobi apartment
        living, and you are inside 900 metres of Sarit.
      </P>

      <P>
        The thing to use to your advantage is the one above: there are a lot of
        near identical units and several of them have been empty for a while.
        Ask how long the specific unit has been vacant, view more than one in
        the building, and negotiate on the things that cost the owner nothing
        to give, which are the deposit structure, the lease length and whether
        the unit comes furnished. An owner three months into a void will move
        on terms before they move on rent.
      </P>

      <P>
        If you want us to tell you what is genuinely available in the building
        and in the blocks around it,{" "}
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
        We let and manage units in Westlands, long term and short stay, and we
        did not sell anything in this building, which means we have no interest
        in defending a rent projection somebody else published. We charge 10
        percent of rent collected on a long let and 20 percent of revenue on a
        short stay, with no setup fee and no exit fee, and we will tell you
        before you commit which of the two your specific unit is actually
        suited to. For a 500 square foot unit in this building, that answer is
        often not the long let.
      </P>

      <P>
        We will also tell you if we think you should stay with your current
        agent. A unit that has had thirty viewings and no offer does not need a
        different agent, it needs different photographs and a floor plan, and
        you do not have to pay anyone to work that out.
      </P>

      <P>
        If your unit at Shangri-La is empty,{" "}
        <Link
          href="/list-your-property"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          send it to us
        </Link>{" "}
        with the floor and the layout and we will give you an achievable rent,
        an honest estimate of how long it will take, and a view on whether
        short letting earns more. What{" "}
        <Link
          href="/tenant-finding"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          tenant finding
        </Link>{" "}
        and{" "}
        <Link
          href="/long-term-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          long term management
        </Link>{" "}
        each cover is set out in full, and if the answer is short stay, that is{" "}
        <Link
          href="/airbnb-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Airbnb management
        </Link>
        .
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/westlands-complete-guide-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the Westlands guide
        </Link>
        ,{" "}
        <Link
          href="/insights/tenant-screening-nairobi-how-we-do-it"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how we screen tenants
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/coco-brookside-westlands-handover-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the Coco Brookside handover guide
        </Link>
        , for owners about to be in the same position. For the other end of the
        same submarket, where the nightly rate is the highest in Nairobi
        because a five star hotel shares the gate, see{" "}
        <Link
          href="/insights/gtc-residences-pan-pacific-westlands-owners-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          GTC Residences and the Pan Pacific
        </Link>
        . For the building in the same submarket that earns the most on a
        nightly basis, and what separates it from an average listing, see{" "}
        <Link
          href="/insights/skynest-residences-westlands-owners-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Skynest Residences
        </Link>
        .
      </P>
    </>
  );
}

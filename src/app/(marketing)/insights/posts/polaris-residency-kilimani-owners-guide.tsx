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
  slug: "polaris-residency-kilimani-owners-guide",
  title:
    "Polaris Residency, Kindaruma Road: what a unit here earns furnished and unfurnished",
  metaTitle: "Polaris Residency Kilimani: owner's guide to letting a unit",
  description:
    "Polaris Residency is a completed twin tower on Kindaruma Road with a large number of near identical one and two bedroom apartments. The same one bedroom is advertised at KES 60,000 unfurnished and KES 100,000 to 140,000 furnished. That gap is the whole decision, and this is how to work out which side of it your unit belongs on.",
  metaDescription:
    "The same one bed at Polaris Residency lets for KES 60,000 unfurnished or KES 100,000 plus furnished. How to decide which your unit should be.",
  publishedAt: "2026-10-28",
  readingMinutes: 11,
  author: authors.editors,
  tags: [
    "Polaris Residency",
    "Kilimani",
    "Letting",
    "Nairobi",
    "Property Management",
    "Kenya",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Polaris Residency Kindaruma Road Kilimani owners guide to letting an apartment",
  faq: [
    {
      q: "What does an apartment at Polaris Residency rent for?",
      a: "Agents advertise unfurnished units at Polaris Residency on Kindaruma Road at about KES 60,000 a month for a 650 square foot one bedroom, KES 70,000 for a one bedroom with study at 670 to 750 square feet, and KES 85,000 for a two bedroom at 970 to 1,150 square feet. The same stock furnished is advertised far higher, from around KES 100,000 to 140,000 for a one bedroom and about KES 180,000 for a two bedroom, with at least one agent quoting KES 5,000 a night. Treat the furnished figures as asking rents rather than achieved ones: they assume a standard of furnishing, photography and management that is the owner's responsibility, and the building contains enough near identical units that an averagely presented one sits at the bottom of the band rather than the top.",
    },
    {
      q: "Should I furnish my Polaris Residency apartment?",
      a: "Probably yes if it is a one bedroom, and it is a genuine question if it is a two bedroom. Polaris has a large number of one bedroom and one bedroom plus study units with the same layout repeated up the building, which means an unfurnished one cannot differentiate itself on anything except rent, and competing on rent against dozens of identical neighbours is a race the owner loses. A furnished unit competes on presentation instead, which an owner can actually control. The two bedrooms at 970 to 1,150 square feet have more room to win a long unfurnished tenancy on space and layout, so the furnished premium matters less to them. Confirm the building's position on nightly letting in writing before furnishing for short stay.",
    },
    {
      q: "Is Polaris Residency a good building to own in?",
      a: "It is a sound building with the services that matter in Nairobi, which is not the same as an easy letting proposition. Published material lists a borehole and water storage, a backup generator, high speed lifts, a gym, landscaped garden and children's play area, electric perimeter fencing, CCTV and ample parking, on Kindaruma Road within a short walk of Carrefour and a couple of minutes of Yaya Centre. The difficulty is scale and sameness rather than quality: this is twin towers of around sixteen or seventeen storeys with one source putting the development at 289 units, most of them one bedrooms, so an owner's real competition is the rest of the building rather than Kilimani.",
    },
  ],
};

export default function Article() {
  return (
    <>
      <Lede>
        Polaris Residency sits on Kindaruma Road in Kilimani, twin towers,
        complete and letting. If you own here, the single most consequential
        number you will see is not the asking rent. It is the distance between
        two asking rents for the identical apartment: about KES 60,000 a month
        unfurnished, and KES 100,000 to 140,000 furnished. Everything else in
        this guide is really about which side of that gap your specific unit
        belongs on, and what it costs you to get there.
      </Lede>

      <Callout title="Where these numbers come from">
        Published agent listings and developer sales material for the
        development, read in October 2026, together with our own letting and
        short stay data for Kilimani. We have not inspected the building, we
        sold nothing in it, and the published figures disagree with each other
        in places, which we have flagged rather than smoothed over. Where a
        number is an asking rent rather than an achieved one, we say so.
      </Callout>

      <KeySummary
        question="What does an apartment at Polaris Residency rent for?"
        answer="Agents advertise unfurnished units at Polaris Residency on Kindaruma Road at about KES 60,000 a month for a 650 square foot one bedroom, KES 70,000 for a one bedroom with study at 670 to 750 square feet, and KES 85,000 for a two bedroom at 970 to 1,150 square feet. The same stock furnished is advertised far higher, from around KES 100,000 to 140,000 for a one bedroom and about KES 180,000 for a two bedroom, with at least one agent quoting KES 5,000 a night. Treat the furnished figures as asking rents rather than achieved ones: they assume a standard of furnishing, photography and management that is the owner's responsibility, and the building contains enough near identical units that an averagely presented one sits at the bottom of the band rather than the top."
        facts={[
          { label: "Location", value: "Kindaruma Road, Kilimani" },
          { label: "Form", value: "Twin towers, about 16 to 17 storeys" },
          { label: "Status", value: "Complete, ready for occupation" },
          { label: "1 bed", value: "650 sq ft, KES 60,000 unfurnished" },
          { label: "1 bed plus study", value: "670 to 750 sq ft, KES 70,000" },
          { label: "2 bed", value: "970 to 1,150 sq ft, KES 85,000" },
          { label: "Furnished 1 bed", value: "KES 100,000 to 140,000" },
          { label: "Kilimani short stay", value: "USD 90 to 130 a night" },
        ]}
      />

      <H2 id="what-it-is">What the building is</H2>

      <UL>
        <LI>
          <strong>Location:</strong> Kindaruma Road, Kilimani, with onward
          access to Argwings Kodhek Road and Ngong Road. Agents publish it at
          about a minute from Carrefour Kilimani and two minutes from Yaya
          Centre
        </LI>
        <LI>
          <strong>Form:</strong> twin towers. Height is published as both
          sixteen and seventeen storeys depending on the agent, and the block
          layouts differ, with one listing describing seven units per floor in
          one block and ten in the other
        </LI>
        <LI>
          <strong>Scale:</strong> one agent puts the development at 289 units.
          No other listing we read repeats that figure, so treat it as
          indicative rather than established, but the order of magnitude
          matters more than the digit and every source agrees this is a lot of
          apartments
        </LI>
        <LI>
          <strong>Unit mix:</strong> one bedroom at about 650 square feet or 60
          square metres, one bedroom plus study at 670 to 750 square feet, two
          bedroom at 970 to 1,150 square feet
        </LI>
        <LI>
          <strong>Sale prices:</strong> published from KES 6 million for a one
          bedroom, KES 7.2 to 7.7 million for a one bedroom plus study, and KES
          9.2 to 9.7 million for a two bedroom
        </LI>
        <LI>
          <strong>Amenities:</strong> borehole and water storage, backup
          generator, fully equipped gym, landscaped garden and children&rsquo;s
          play area, high speed lifts, ample parking, access control, CCTV and
          electric perimeter fencing, with internet and DSTV provision. One
          listing also claims a swimming pool and a rooftop terrace, which the
          others do not mention
        </LI>
      </UL>

      <P>
        That last disagreement is worth settling before you price anything. A
        pool is a real differentiator in a Kilimani short let listing and an
        expensive thing to imply if the building does not have one.
      </P>

      <H2 id="the-gap">The gap between the two asking rents</H2>

      <H3 id="what-it-rents-for">
        What does an apartment at Polaris Residency rent for?
      </H3>

      <P>
        Here is the thing that should shape your decision. The same 650 square
        foot one bedroom appears in the market at KES 60,000 a month
        unfurnished and, at various agents, KES 100,000, KES 140,000, or KES
        5,000 a night furnished. Even taking the lowest furnished figure, the
        spread is two thirds of the unfurnished rent.
      </P>

      <Pullquote>
        A furnishing budget that would be reckless against a KES 5,000 rent
        difference is trivial against a KES 40,000 one. The gap is large enough
        to change what you should spend, not just what you should ask.
      </Pullquote>

      <P>
        Be careful about what those furnished numbers are. They are asking
        rents published by agents with units to let, and they assume a standard
        of furnishing, photography and day to day management that becomes
        entirely your problem the moment you commit. They were never a floor.
        What they do establish is that the market in this building rewards
        presentation far more than it rewards a keen unfurnished price, and
        that is the useful part.
      </P>

      <P>
        How to price against comparables rather than against a brochure is in{" "}
        <Link
          href="/insights/how-to-price-nairobi-rental"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          pricing a Nairobi rental
        </Link>
        , and the decision itself is in{" "}
        <Link
          href="/insights/furnished-or-unfurnished-rental-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          furnished against unfurnished
        </Link>
        .
      </P>

      <H2 id="competition">Your competition is the rest of the building</H2>

      <P>
        Two towers of predominantly one bedroom apartments, completed together,
        a large share of them bought by investors at KES 6 million rather than
        by people intending to live in them. Those owners took keys in the same
        window and a lot of them listed for rent in the same months.
      </P>

      <P>
        This changes how a tenant decides. Somebody looking for a one bed near
        Yaya will see three or four in an afternoon and several of them will be
        in your building, with the same floor plan and the same finish. Shown
        the same apartment four times, they do not choose on rent. A difference
        of KES 3,000 a month is not what separates those units, and cutting
        your asking rent by that much mostly signals that you will cut it
        again.
      </P>

      <P>
        Our wider read on this submarket, and on which parts of Nairobi have
        absorbed the most new stock, is in{" "}
        <Link
          href="/insights/nairobi-apartment-oversupply-2026-suburbs-to-avoid"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          where the oversupply actually is
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/kilimani-apartment-market-changing-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how the Kilimani apartment market is changing
        </Link>
        .
      </P>

      <H2 id="which-route">Furnished or unfurnished, nightly or yearly</H2>

      <H3 id="should-i-furnish">
        Should I furnish my Polaris Residency apartment?
      </H3>

      <P>
        For a one bedroom here, the case is strong, and the reason is the thing
        that hurts the unit on a long unfurnished let. A 650 square foot
        apartment with a layout repeated dozens of times up the same two towers
        cannot win a tenancy on space, so unfurnished it is stuck competing on
        price against its own neighbours. Furnished, it competes on
        presentation, and presentation is the one variable an owner fully
        controls.
      </P>

      <P>
        For a two bedroom at 970 to 1,150 square feet the question is genuinely
        open. Those units have enough room to differentiate on layout and light
        against the rest of the building, which is exactly what a long
        unfurnished tenancy rewards, and KES 85,000 from a tenant on a one year
        lease with two months deposit is a quieter business than a furnished
        unit with turnover.
      </P>

      <Callout title="Get the building's position in writing first">
        Before furnishing for nightly letting, get the management
        company&rsquo;s or the by-laws&rsquo; position on short stays in
        writing. A development this heavily investor owned will have a
        residents&rsquo; association that either accepts nightly guests or
        moves to ban them, and some Nairobi blocks cap how many units may
        operate one. Furnishing a unit and then discovering the block has voted
        against it is an expensive sequence.
      </Callout>

      <P>
        What furnishing a Nairobi apartment actually costs, package by package,
        is in{" "}
        <Link
          href="/insights/apartment-furnishing-packages-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          apartment furnishing packages
        </Link>
        .
      </P>

      <H3 id="short-stay">The short stay case, and its honest limits</H3>

      <P>
        Kilimani is a real short stay market. Our own letting data for the area
        puts a well presented unit at USD 90 to 130 a night at 62 to 74 percent
        occupancy across a full year, on demand that is a mix of corporate,
        NGO, regional business travel and medical visitors drawn by the
        hospitals and clinics around Argwings Kodhek. Polaris has the borehole,
        the generator, the lifts, the parking and the access control that
        guests notice, and it is walkable to Yaya and Carrefour.
      </P>

      <P>
        Two honest limits. The first is that those bands describe a well
        presented and well managed unit, not an average one, and in a building
        with this many identical apartments the distance between the two is
        wide. The second is that a one bedroom at KES 100,000 furnished on a
        long let is a perfectly good outcome that requires no guest
        communication, no cleaning turnover and no nightly pricing, and a
        number of owners here will be better served by it than by a short let
        they manage badly.
      </P>

      <P>
        The arithmetic on both routes is in{" "}
        <Link
          href="/insights/airbnb-vs-long-term-rental-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          short let against long term rental
        </Link>
        , and what Kilimani does specifically, street by street, is in{" "}
        <Link
          href="/insights/airbnb-kilimani-2026-host-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the Kilimani host guide
        </Link>
        .
      </P>

      <H2 id="owning-here">Owning here over the long run</H2>

      <H3 id="is-it-good">Is Polaris Residency a good building to own in?</H3>

      <P>
        On services, yes, and that is not a small thing in Nairobi. A borehole
        and real water storage, a generator that actually runs the lifts, and
        controlled access remove most of the recurring irritations of apartment
        living here, and they are the things a tenant or a guest notices in the
        first week rather than at the viewing.
      </P>

      <P>
        The difficulty is not quality. It is scale and sameness. Owning one of
        a great many near identical one bedrooms means the market sets your
        rent and your job is to be in the top quarter of your own building
        rather than to beat Kilimani. Owners who understand that do well here.
        Owners who expect the sales brochure rent to arrive on its own do not.
      </P>

      <P>
        Also check the service charge collection rate in the block before you
        budget. In a heavily investor owned building, owners who are not
        receiving rent often stop paying the levy, and deferred maintenance in
        the common areas turns up in every viewing you host. What the charge
        should cover, and what it should not, is in{" "}
        <Link
          href="/insights/service-charge-nairobi-apartments-explained"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          service charge explained
        </Link>
        .
      </P>

      <H2 id="what-to-do">What to do if yours is empty</H2>

      <OL>
        <LI>
          <strong>Ask for the viewing count before you touch the rent.</strong>{" "}
          No viewings is a marketing fault, viewings without offers is a
          presentation or pricing fault, and the two have different fixes
        </LI>
        <LI>
          <strong>Find out how many units your agent holds here.</strong> An
          agent letting six one beds in these towers has no reason to care
          which one lets, and you have no way of knowing whether yours was
          shown first or not at all
        </LI>
        <LI>
          <strong>Photograph it in daylight and publish a floor plan.</strong>{" "}
          It costs less than a week of the void and it is the highest return
          thing available to you in a building where most listings are dark
          phone photographs of the same layout
        </LI>
        <LI>
          <strong>Publish the real service charge.</strong> Tenants filter on
          total monthly cost, so hiding it buys you fewer and worse qualified
          viewings
        </LI>
        <LI>
          <strong>Price the furnished route properly rather than drifting.</strong>{" "}
          Given the published spread, a half furnished unit is the one outcome
          that appeals to nobody
        </LI>
        <LI>
          <strong>Stop competing on rent alone.</strong> Against dozens of
          identical apartments a cut is matched within a week, and you have
          reset the achievable rent for the whole building including yourself
        </LI>
      </OL>

      <P>
        The general version of this diagnosis is in{" "}
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
        A fair share of people searching this building are tenants. Polaris is
        a sensible place to rent if you want to be inside walking distance of
        Yaya and Carrefour with a borehole, a generator, a lift and controlled
        access, which together remove most of what makes Nairobi apartment
        living tiresome.
      </P>

      <P>
        Use the building&rsquo;s own arithmetic. There are a lot of near
        identical units and some of them have been empty a while. Ask how long
        the specific apartment has been vacant, view more than one, and
        negotiate on what costs the owner nothing to give, which is the deposit
        structure, the lease length and whether it comes furnished. Published
        terms here run to one month upfront and two months deposit on a one
        year lease, and an owner three months into a void will move on terms
        before they move on rent. If you want us to tell you what is genuinely
        available here and in the blocks around it,{" "}
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
        We let and manage in Kilimani, long term and short stay, and we sold
        nothing in this building, so we have no rent projection of our own to
        defend. We charge 10 percent of rent collected on a long let and 20
        percent of revenue on a short stay, with no setup fee and no exit fee,
        and we will tell you before you commit which of the two your unit is
        actually suited to. For a one bedroom here that answer is usually
        furnished, and it is not always short stay.
      </P>

      <P>
        We will also tell you to stay where you are if that is the right
        answer. A unit with thirty viewings and no offer does not need a
        different agent, it needs different photographs and a floor plan, and
        nobody should be paid a commission for saying so.
      </P>

      <P>
        If your apartment at Polaris is empty,{" "}
        <Link
          href="/list-your-property"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          send it to us
        </Link>{" "}
        with the floor, the block and the layout, and we will come back with an
        achievable rent, an honest view of how long it will take, and whether
        furnishing earns its cost on your specific unit. What{" "}
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
        cover is set out in full, and if the answer is nightly, that is{" "}
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
          href="/insights/kilimani-vs-hurlingham-professionals"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Kilimani against Hurlingham
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
          href="/insights/nairobi-handover-wave-2026-what-it-means-for-rents"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          what the 2026 handover wave does to rents
        </Link>
        . For the same problem in the other submarket where a great many
        identical units completed at once, see{" "}
        <Link
          href="/insights/shangri-la-residency-westlands-letting-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Shangri-La Residency
        </Link>
        .
      </P>
    </>
  );
}

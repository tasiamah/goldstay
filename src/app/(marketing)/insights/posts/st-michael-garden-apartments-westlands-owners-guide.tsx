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
  slug: "st-michael-garden-apartments-westlands-owners-guide",
  title:
    "St Michael Garden Apartments, Westlands: 1,640 square feet that rents for less than 1,000",
  metaTitle: "St Michael Garden Apartments Westlands: owner's guide",
  description:
    "A two bedroom plus DSQ of 1,640 square feet here asks KES 100,000 a month. A two bedroom of 970 square feet a kilometre away asks KES 150,000. If you own the big one, that gap is the most important thing to understand about your asset.",
  metaDescription:
    "St Michael Garden Apartments rents at KES 100,000 to 110,000 a month for 1,640 sq ft. Why size does not price in Westlands.",
  publishedAt: "2026-10-28",
  readingMinutes: 10,
  author: authors.editors,
  tags: [
    "St Michael Garden Apartments",
    "Westlands",
    "Long Term Rental",
    "Nairobi",
    "Property Management",
    "Kenya",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "St Michael Garden Apartments Westlands owners guide to letting a two bedroom",
  faq: [
    {
      q: "What does an apartment at St Michael Garden Apartments rent for?",
      a: "Published listings put a two bedroom plus self contained DSQ of about 1,640 square feet at KES 100,000 a month furnished, with a service charge of KES 12,000 a month quoted on top, and a second listing on the same road advertises a sixth floor two bedroom at KES 110,000. The same stock has been marketed for sale at KES 17.5 million unfurnished. Against that sale price, KES 100,000 a month is a gross yield of about 6.9 percent and roughly 6 percent after the levy, which is a realistic Nairobi number rather than a marketing one.",
    },
    {
      q: "Why does a larger apartment here rent for less than a smaller one in Westlands?",
      a: "Because Westlands tenants pay for location and amenity, not for floor area. A 1,640 square foot two bedroom plus DSQ on St Michael Road asks KES 100,000, while a 970 square foot two bedroom in a new tower on Westlands Road asks KES 150,000 to 180,000. The tower is a short walk from the Global Trade Centre and has a rooftop pool and a gym; this building is quieter, further from the commercial core, and offers space instead. A separate dining room and a domestic staff quarter are genuinely useful to a family, and almost worthless to the corporate or expatriate tenant who sets the top of the Westlands market. Price the unit for the tenant who wants the space, not for the tower's headline.",
    },
    {
      q: "Who pays the service charge at St Michael Garden Apartments?",
      a: "The published listing quotes rent of KES 100,000 plus a service charge of KES 12,000 a month, which means the tenant is being asked to pay the levy on top of the rent. That is common in Nairobi and it matters more than owners realise, because a tenant comparing your unit against one advertised at KES 110,000 all in is comparing KES 112,000 against KES 110,000 and will read yours as the more expensive of the two. If your unit is sitting empty, quoting a single inclusive figure is often worth more than the KES 12,000 it appears to cost you.",
    },
  ],
};

export default function Article() {
  return (
    <>
      <Lede>
        A two bedroom plus staff quarter at St Michael Garden Apartments runs to
        1,640 square feet and asks KES 100,000 a month. A two bedroom of 970
        square feet in a new tower a kilometre away asks KES 150,000. Nothing
        is wrong with either listing. The gap between them is the single most
        useful thing an owner here can understand.
      </Lede>

      <Callout title="Where these numbers come from">
        Published agent listings for St Michael Garden Apartments and for St
        Michael Road, Westlands, read in October 2026, together with our own
        letting data for Westlands. Rates quoted are asking rates. Several of
        the listings for this building have since been withdrawn or marked
        sold, which is itself worth knowing before you benchmark against them.
        We manage in Westlands; we sold nothing in this building.
      </Callout>

      <KeySummary
        question="What does an apartment at St Michael Garden Apartments rent for?"
        answer="Published listings put a two bedroom plus self contained DSQ of about 1,640 square feet at KES 100,000 a month furnished, with a service charge of KES 12,000 a month quoted on top, and a second listing on the same road advertises a sixth floor two bedroom at KES 110,000. The same stock has been marketed for sale at KES 17.5 million unfurnished. Against that sale price, KES 100,000 a month is a gross yield of about 6.9 percent and roughly 6 percent after the levy, which is a realistic Nairobi number rather than a marketing one."
        facts={[
          { label: "Location", value: "St Michael Road, off Church Road" },
          { label: "Layout", value: "2 bed, master en suite, plus DSQ" },
          { label: "Size", value: "1,640 sq ft, about 158 sq m" },
          { label: "Rent", value: "KES 100,000 to 110,000 a month" },
          { label: "Service charge", value: "KES 12,000 a month, quoted on top" },
          { label: "Marketed sale price", value: "KES 17.5M unfurnished" },
          { label: "Implied gross yield", value: "About 6.9 percent" },
          { label: "Parking", value: "One reserved space per unit" },
        ]}
      />

      <H2 id="what-it-is">What the building actually is</H2>

      <P>
        A small, low key development on St Michael Road, off Church Road in
        Westlands, of two bedroom apartments with the master en suite and a
        self contained domestic staff quarter. Units run to 1,640 square feet
        with a spacious living room, a separate dining area, built in
        wardrobes, a kitchen with granite tops opening onto a utility area, a
        balcony and one reserved parking space.
      </P>

      <P>
        The services are the solid, unglamorous set that actually matters in
        Nairobi: two lifts, a full backup generator, a borehole with water
        storage tanks, solar water heating, CCTV, intercom, an electric fenced
        boundary wall and manned security around the clock. There is no
        rooftop pool and no gym, and for a certain tenant that is a feature
        rather than an omission.
      </P>

      <P>
        Position is quiet residential Westlands rather than the commercial
        core: close to ABC Place, Nairobi School, Kenya High School, Westgate
        and Lavington Mall. Good for a family. A longer commute for someone
        whose office is in a Westlands tower.
      </P>

      <H3 id="what-it-rents-for">
        What does an apartment at St Michael Garden Apartments rent for?
      </H3>

      <P>
        Published listings put the two bedroom plus DSQ at KES 100,000 a month
        furnished with the KES 12,000 monthly service charge quoted on top, and
        a sixth floor two bedroom on the same road at KES 110,000. The same
        stock has been marketed for sale at KES 17.5 million unfurnished.
      </P>

      <P>
        That pairing is worth pausing on, because it is honest in a way much
        new build material is not. KES 100,000 a month against KES 17.5 million
        is a gross yield of about 6.9 percent, and about 6 percent once the
        levy comes out. That is what good Nairobi apartment stock actually
        produces. When you next see a tower advertising 15 percent, this is the
        number to hold it against.
      </P>

      <H2 id="size-does-not-price">Size does not price in Westlands</H2>

      <H3 id="why-larger-rents-for-less">
        Why does a larger apartment here rent for less than a smaller one in
        Westlands?
      </H3>

      <P>
        Set the two side by side. Here: 1,640 square feet, two bedrooms, a
        separate dining room, a staff quarter, KES 100,000. In a new tower on
        Westlands Road: 970 square feet, two bedrooms, a rooftop heated pool, a
        gym, face scan entry, a five minute walk to the Global Trade Centre,
        KES 150,000 to 180,000. Nearly 70 percent more floor area for 40
        percent less rent.
      </P>

      <Pullquote>
        The Westlands tenant who sets the top of the market is not buying
        square feet. They are buying the walk to the office and the things
        they can photograph.
      </Pullquote>

      <P>
        This is not an argument that the tower is better. It is an argument
        about who your tenant is. The corporate arrival, the expatriate on a
        two year posting and the regional executive drive the upper end of
        Westlands rents, and they want a short commute, a secure lobby and
        amenity they will mention to colleagues. A separate dining room is not
        on their list, and a domestic staff quarter is of no use to them at
        all.
      </P>

      <P>
        For a family with children at Nairobi School or Kenya High, both are on
        the list, the quiet road is an advantage, and the staff quarter is one
        of the few in modern Westlands stock. That is your tenant. The mistake
        owners here make is to benchmark against the towers, conclude the unit
        is underpriced, hold out, and lose three months of rent waiting for a
        tenant who was never looking at this building.
      </P>

      <Callout title="The honest way to read your own comparables">
        A comparable is not an apartment with the same number of bedrooms. It
        is an apartment the same tenant would actually consider. Before you
        accept an agent&rsquo;s benchmark, ask which specific buildings it came
        from and whether a family looking at yours would genuinely view those
        too. Half the time the answer makes the benchmark disappear.
      </Callout>

      <H2 id="service-charge">The levy is quoted on top, and that costs you</H2>

      <H3 id="who-pays-the-service-charge">
        Who pays the service charge at St Michael Garden Apartments?
      </H3>

      <P>
        The listing reads &ldquo;rent KES 100,000 plus service charge KES
        12,000&rdquo;, so the tenant pays the levy on top. That is normal in
        Nairobi. It is also, in a soft letting month, quietly expensive.
      </P>

      <P>
        A tenant scrolling listings sees KES 100,000 and a second number, and
        most of them do the addition. Your unit reads as KES 112,000 against a
        neighbouring listing that reads KES 110,000 all in, and you have lost
        the comparison before anyone has seen the apartment. Two things follow:
      </P>

      <UL>
        <LI>
          <strong>Quote one inclusive figure when the unit is empty.</strong>{" "}
          Advertising KES 112,000 inclusive beats advertising KES 100,000 plus
          KES 12,000, even though they are the same money, because one of them
          is a single number a tenant can compare
        </LI>
        <LI>
          <strong>Know what the KES 12,000 buys.</strong> On 1,640 square feet
          that is roughly KES 88 per square foot a year, and it is funding a
          generator, a borehole, two lifts and manned security. That is a
          reasonable levy for that list, which is a better position than most
        </LI>
        <LI>
          <strong>Ask for the collection rate, not the budget.</strong> A levy
          nobody is paying buys nothing, whatever the schedule says
        </LI>
      </UL>

      <P>
        What a levy should cover and how to read a bad one is in{" "}
        <Link
          href="/insights/service-charge-nairobi-apartments-explained"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          service charge explained
        </Link>
        .
      </P>

      <H2 id="short-let">Is this a short let building?</H2>

      <P>
        Mostly not, and that is worth saying plainly because the instinct in
        Westlands is to furnish everything and list it nightly. Our Westlands
        data puts a well presented short let at 64 to 76 percent occupancy
        across a full year, but the demand behind that number is corporate and
        it wants to be near the towers. A large family apartment on a quiet
        road off Church Road is not what that guest is searching for.
      </P>

      <P>
        Where this building does work for furnished letting is the monthly
        route: relocating families, diplomatic and NGO postings, and people
        between houses who need three bedrooms worth of space for six months.
        That tenant pays well, stays long, and needs almost nothing from you,
        which is the opposite of the nightly business. The comparison in full
        is in{" "}
        <Link
          href="/insights/furnished-or-unfurnished-rental-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          furnished or unfurnished
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/airbnb-vs-long-term-rental-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          short let against long term rental
        </Link>
        .
      </P>

      <H2 id="what-to-do">What to do if yours is sitting empty</H2>

      <OL>
        <LI>
          <strong>Market the DSQ and the dining room as the headline.</strong>{" "}
          They are what you have that the towers do not, and most listings for
          this stock bury them in a feature list
        </LI>
        <LI>
          <strong>Quote one inclusive monthly figure.</strong> Rent plus levy
          loses to a single number on a search page
        </LI>
        <LI>
          <strong>Target schools, not offices.</strong> Nairobi School, Kenya
          High and the international schools are the demand driver for a unit
          this size, and nobody advertises to them
        </LI>
        <LI>
          <strong>Stop benchmarking against Westlands Road towers.</strong> A
          different tenant, a different product, and an expensive comparison to
          hold out for
        </LI>
        <LI>
          <strong>Ask your agent for the viewing count.</strong> No viewings is
          a marketing fault, viewings without offers is a pricing or
          presentation fault, and they are fixed differently
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
        , and how to set the number is in{" "}
        <Link
          href="/insights/how-to-price-nairobi-rental"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          pricing a Nairobi rental
        </Link>
        .
      </P>

      <H2 id="tenants">If you are looking to rent here</H2>

      <P>
        This is one of the better value family lets in Westlands, and the
        reason is unglamorous: you are paying for space in a quiet building
        rather than for a pool and a lobby. A borehole, a full generator and a
        staff quarter at KES 110,000 or so is a strong offer if your life
        involves children and school runs rather than a walk to a tower.
      </P>

      <P>
        Ask two questions before you sign. First, whether the quoted rent
        includes the service charge, because here it usually does not. Second,
        what the water situation actually is, since a borehole on the amenity
        list and a borehole that runs are different things, and the people in
        the building will tell you straight. If you want us to tell you what is
        genuinely available,{" "}
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
        We manage long lets and short stays in Westlands, including in this
        building, and we sold nothing here, so there is no sales projection of
        ours to defend. We charge 10 percent of rent collected on a long let
        and 20 percent of revenue on a short stay, with no setup fee and no
        exit fee. At St Michael Garden Apartments the advice is usually the
        unfashionable one: let it long, let it to a family, and stop comparing
        it to buildings its tenants are not looking at.
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
        rate and a straight view on the route. What{" "}
        <Link
          href="/long-term-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          long term management
        </Link>{" "}
        and{" "}
        <Link
          href="/airbnb-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Airbnb management
        </Link>{" "}
        each cover is set out in full.
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/westlands-complete-guide-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the complete guide to Westlands
        </Link>
        ,{" "}
        <Link
          href="/insights/misty-springs-westlands-owners-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Misty Springs, the tower this building is compared against
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/best-neighbourhoods-nairobi-rental-yield-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the best neighbourhoods for rental yield
        </Link>
        .
      </P>
    </>
  );
}

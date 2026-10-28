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
  slug: "heartland-homes-kilimani-owners-guide",
  title:
    "Heartland Homes, Kilimani: the same two bedroom at KES 80,000, KES 200,000 and KES 8,500 a night",
  metaTitle: "Heartland Homes Kilimani: an owner's guide to letting",
  description:
    "One building on Kindaruma Road publishes all three rates for the same apartment. Put them side by side and the best route is the one almost nobody asks about, because it beats nightly letting without the work.",
  metaDescription:
    "Heartland Homes Kilimani lets at KES 80,000 unfurnished, KES 200,000 furnished or KES 8,500 a night. Which route actually wins.",
  publishedAt: "2026-10-29",
  readingMinutes: 11,
  author: authors.editors,
  tags: [
    "Heartland Homes",
    "Kilimani",
    "Short Let",
    "Nairobi",
    "Property Management",
    "Kenya",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Heartland Homes Kilimani owners guide to letting a one or two bedroom apartment",
  faq: [
    {
      q: "What does an apartment at Heartland Homes rent for?",
      a: "Published listings put a one bedroom at KES 55,000 a month and a two bedroom at KES 75,000 to 80,000 a month unfurnished, on terms of one month's rent plus two months' deposit. The same two bedroom, furnished and on the eleventh floor, is advertised at KES 200,000 a month or KES 8,500 a night. Having all three figures for one layout in one building is rare in Nairobi and it makes the letting decision unusually easy to check rather than guess.",
    },
    {
      q: "Should I furnish and let monthly or nightly at Heartland Homes?",
      a: "Furnish and let monthly. The furnished monthly rate of KES 200,000 against a nightly rate of KES 8,500 means nightly letting has to fill about 23.5 nights a month, roughly 78 percent occupancy, simply to match it, and that is before platform commission, turnover cleaning and short stay management at double the long let fee. Our Kilimani band for a well run short let is 62 to 74 percent across a full year, which sits below that crossover. Meanwhile the furnished monthly let earns two and a half times the unfurnished rent with none of the void risk and none of the operational work.",
    },
    {
      q: "Why is the furnished rate two and a half times the unfurnished one?",
      a: "Because the two rates are set by two different markets. The unfurnished rate of KES 80,000 is set by the ordinary Kilimani rental market, where a tenant has their own furniture and compares your flat against every other two bedroom in the neighbourhood. The furnished rate of KES 200,000 is set by corporate arrivals, relocations and extended business stays, who are frequently spending an employer's housing allowance and who need an apartment that works from the first night. Your competition in the second market is a serviced apartment or a hotel, not the flat downstairs, and that is why the number is so different.",
    },
  ],
};

export default function Article() {
  return (
    <>
      <Lede>
        Heartland Homes on Kindaruma Road does something useful by accident. The
        same two bedroom apartment is publicly advertised three ways: KES 80,000
        a month unfurnished, KES 200,000 a month furnished, and KES 8,500 a
        night. Most owners in Nairobi are guessing between those options.
        Here you can simply check.
      </Lede>

      <Callout title="Where these numbers come from">
        Published agent and platform listings for Heartland Homes and Heartland
        Garden on Kindaruma Road, Kilimani, read in October 2026, together with
        our own letting and short stay data for Kilimani. Rates are asking
        rates, and the furnished figures belong to a specific eleventh floor
        unit with skyline views rather than to every apartment in the building.
        We manage in Kilimani, including on this road; we sold nothing in this
        development.
      </Callout>

      <KeySummary
        question="What does an apartment at Heartland Homes rent for?"
        answer="Published listings put a one bedroom at KES 55,000 a month and a two bedroom at KES 75,000 to 80,000 a month unfurnished, on terms of one month's rent plus two months' deposit. The same two bedroom, furnished and on the eleventh floor, is advertised at KES 200,000 a month or KES 8,500 a night. Having all three figures for one layout in one building is rare in Nairobi and it makes the letting decision unusually easy to check rather than guess."
        facts={[
          { label: "Location", value: "Kindaruma Road, Kilimani" },
          { label: "1 bed unfurnished", value: "KES 55,000 a month" },
          { label: "2 bed unfurnished", value: "KES 75,000 to 80,000" },
          { label: "2 bed furnished", value: "KES 200,000 a month" },
          { label: "2 bed nightly", value: "KES 8,500" },
          { label: "Deposit terms", value: "One month rent, two months deposit" },
          { label: "Lifts", value: "Four high speed" },
          { label: "Kilimani occupancy", value: "62 to 74 percent" },
        ]}
      />

      <H2 id="what-it-is">What the building actually is</H2>

      <P>
        A completed residential tower on Kindaruma Road in Kilimani, with one
        and two bedroom apartments. Master bedrooms en suite, contemporary
        fitted kitchens, generous laundry areas, wardrobes with sliding doors,
        balconies, and on the higher floors genuine panoramic views over the
        Nairobi skyline.
      </P>

      <P>
        Shared facilities are a borehole, a backup generator covering the common
        areas and the lifts, four high speed lifts, a fully equipped gym, a
        children&rsquo;s outdoor play area, a maintained garden, an intercom
        system, CCTV around the clock and ample parking. Four lifts for a single
        development is more than most Kilimani blocks of this size provide, and
        on a high floor it is the difference between living on the eleventh
        floor and regretting it.
      </P>

      <P>
        Position is minutes from Yaya Centre, Nairobi Hospital and Prestige
        Plaza, with access via Ngong Road and Argwings Kodhek. This is the same
        road we wrote about in{" "}
        <Link
          href="/insights/kindaruma-homes-apartments-kilimani-owners-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the Kindaruma Road guide
        </Link>
        , where the recurring problem is that listings advertise the street and
        not the building. Heartland is one of the few here that markets itself
        by name, which is a quiet advantage worth using.
      </P>

      <H3 id="what-it-rents-for">
        What does an apartment at Heartland Homes rent for?
      </H3>

      <P>
        Unfurnished, a one bedroom is quoted at KES 55,000 a month and a two
        bedroom at KES 75,000 to 80,000, on terms of one month&rsquo;s rent
        plus two months&rsquo; deposit. Furnished, an eleventh floor two bedroom
        with skyline views, a smart television, reliable wifi and a washing
        machine is advertised at KES 200,000 a month or KES 8,500 a night.
      </P>

      <P>
        Note what the furnished listing is and is not. It is one specific unit,
        high up, with a view, furnished properly. It is not what a middle floor
        two bedroom with a partial outlook and adequate furniture will achieve.
        Treat KES 200,000 as the top of the furnished range rather than its
        middle.
      </P>

      <H2 id="three-routes">Three rates, one decision</H2>

      <H3 id="monthly-or-nightly">
        Should I furnish and let monthly or nightly at Heartland Homes?
      </H3>

      <P>
        Start with the comparison owners usually skip, between the two furnished
        options. KES 200,000 a month against KES 8,500 a night means nightly
        letting must fill about 23.5 nights every month just to draw level.
        That is roughly 78 percent occupancy, before a single cost is
        subtracted.
      </P>

      <Pullquote>
        Seventy eight percent occupancy to match a number you can have by
        signing one tenant. That is not a close decision.
      </Pullquote>

      <P>
        Our Kilimani band for a genuinely well presented and actively managed
        short let is 62 to 74 percent across a full year. The crossover sits
        above the top of that band. And the nightly route then has to absorb
        platform commission on every booking, a full turnover clean after every
        departure, and short stay management at roughly double the long let fee
        because it is roughly double the work.
      </P>

      <P>
        So the ranking at Heartland Homes, on published rates, runs: furnished
        monthly first, nightly second, unfurnished monthly a distant third.
      </P>

      <UL>
        <LI>
          <strong>Unfurnished monthly, KES 80,000.</strong> No furnishing
          outlay, no operational work, and you are leaving well over half the
          achievable rent on the table
        </LI>
        <LI>
          <strong>Furnished monthly, KES 200,000.</strong> One furnishing
          outlay, one tenant, no void risk between guests, and two and a half
          times the rent
        </LI>
        <LI>
          <strong>Furnished nightly, KES 8,500.</strong> The same furnishing
          outlay plus continuous work, and it only wins above about 78 percent
          occupancy
        </LI>
      </UL>

      <Callout title="The general lesson, not just this building">
        Before concluding that nightly letting is the answer anywhere, ask what
        a furnished monthly let would achieve in your building. Many owners
        compare nightly against the unfurnished rent, which flatters nightly
        enormously, and never price the middle option at all. At Heartland
        Homes that middle option is the best of the three.
      </Callout>

      <P>
        The contrast with{" "}
        <Link
          href="/insights/denis-gardens-kilimani-owners-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Denis Gardens
        </Link>{" "}
        is instructive. There, no furnished monthly rate is published and the
        nightly rate sits high against the unfurnished rent, so nightly letting
        wins from about 31 percent occupancy. Same neighbourhood, opposite
        conclusion, and the difference is entirely in which rates the building
        publishes. The arithmetic both ways is in{" "}
        <Link
          href="/insights/airbnb-vs-long-term-rental-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          short let against long term rental
        </Link>
        .
      </P>

      <H2 id="why-the-gap">Why the gap is this wide</H2>

      <H3 id="why-two-and-a-half-times">
        Why is the furnished rate two and a half times the unfurnished one?
      </H3>

      <P>
        Because the two rates are set by two different markets that happen to
        share a staircase.
      </P>

      <P>
        The unfurnished KES 80,000 is set by the ordinary Kilimani rental
        market. Your tenant owns a sofa, has a year to look, and is comparing
        your flat against every other two bedroom within a kilometre. You
        compete on price and condition and there is a lot of competition.
      </P>

      <P>
        The furnished KES 200,000 is set by corporate arrivals, relocations,
        extended business stays and the medical traffic drawn by Nairobi
        Hospital just up the road. That tenant is frequently spending an
        employer&rsquo;s housing allowance, needs the apartment to work from
        the first night, and is comparing you against a serviced apartment or a
        hotel room rather than the flat downstairs. Against a hotel at KES
        200,000 a month, a furnished two bedroom with a kitchen and a washing
        machine is cheap.
      </P>

      <P>
        That is the whole explanation, and it generalises. Across the buildings
        we manage in, the furnished premium tracks almost perfectly with
        whether an employer is paying. Where it is a salary, furnishing adds a
        third. Where it is an allowance, furnishing doubles the rent. What the
        furniture itself costs is in{" "}
        <Link
          href="/insights/cost-furnish-nairobi-apartment-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the cost to furnish a Nairobi apartment
        </Link>
        .
      </P>

      <H2 id="what-to-do">What to do if yours is sitting empty</H2>

      <OL>
        <LI>
          <strong>Price the furnished monthly route before anything else.</strong>{" "}
          It is the option most owners here never cost, and at this building it
          wins
        </LI>
        <LI>
          <strong>Publish the floor and photograph the view.</strong> The
          furnished KES 200,000 listing is an eleventh floor unit and it leads
          with the skyline. On Kindaruma Road, where every listing claims the
          same amenities, outlook is the differentiator
        </LI>
        <LI>
          <strong>Name the building.</strong> Most listings on this road sell
          the street. Heartland markets itself by name and you should too
        </LI>
        <LI>
          <strong>Market to employers and the hospitals.</strong> Relocation
          agents, corporate housing desks and Nairobi Hospital are where the
          KES 200,000 tenant comes from, and portals are where they are not
        </LI>
        <LI>
          <strong>Review the deposit terms.</strong> One month plus two months
          deposit is three months up front, which is normal here but does
          narrow your tenant pool. Know whether you are willing to flex it
          before a good applicant asks
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
        Unfurnished, Heartland Homes is good value: KES 55,000 for a one bedroom
        or KES 75,000 to 80,000 for a two bedroom in walking reach of Yaya
        Centre, with four lifts, a borehole and a generator, is a sound deal by
        Kilimani standards. Budget for three months up front, since one
        month&rsquo;s rent plus two months&rsquo; deposit is the advertised
        term.
      </P>

      <P>
        If you are looking at the furnished units, know that the same apartments
        let unfurnished at a quarter to a third of the furnished rate. That
        exchange is fair for a six month assignment and poor for a three year
        stay. For anything over a month, ask for the monthly rate rather than
        thirty times the nightly one, and ask what it includes. If you want us
        to tell you what is genuinely available,{" "}
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
        We manage short stay and long lets in Kilimani, including on Kindaruma
        Road, and we sold nothing in this development, so there is no projection
        of ours to defend. We charge 10 percent of rent collected on a long let
        and 20 percent of revenue on a short stay, with no setup fee and no exit
        fee. At Heartland Homes we will usually recommend furnishing and letting
        monthly, which pays us the lower of our two fees, because on the
        building&rsquo;s own published rates that is plainly the better business
        for the owner.
      </P>

      <P>
        If your apartment is empty,{" "}
        <Link
          href="/list-your-property"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          send it to us
        </Link>{" "}
        with the floor and the layout and we will come back with all three rates
        for your specific unit so you can see the comparison yourself. What{" "}
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
          href="/insights/kindaruma-homes-apartments-kilimani-owners-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Kindaruma Road, the same street
        </Link>
        ,{" "}
        <Link
          href="/insights/furnished-or-unfurnished-rental-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          furnished or unfurnished
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/airbnb-kilimani-2026-host-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the Kilimani host guide
        </Link>
        .
      </P>
    </>
  );
}

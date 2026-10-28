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
  slug: "serenity-residency-kilimani-owners-guide",
  title:
    "Serenity Residency, Kilimani: a building of nothing but two bedrooms, and the tenant nobody markets to",
  metaTitle: "Serenity Residency Kilimani: an owner's guide to letting",
  description:
    "Every apartment here is a two bedroom at KES 85,000 to 90,000 with the service charge inside the rent. When a building has one layout, you cannot compete on product, so the only question left is who you are selling it to.",
  metaDescription:
    "Serenity Residency Kilimani lets at KES 85,000 to 90,000 including service charge. Who an owner should be marketing to.",
  publishedAt: "2026-10-29",
  readingMinutes: 10,
  author: authors.editors,
  tags: [
    "Serenity Residency",
    "Kilimani",
    "Long Term Rental",
    "Nairobi",
    "Property Management",
    "Kenya",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Serenity Residency Kilimani owners guide to letting a two bedroom apartment",
  faq: [
    {
      q: "What does an apartment at Serenity Residency rent for?",
      a: "Two bedrooms let from KES 85,000 to KES 90,000 a month with the service charge included in the quoted rent, so there is no separate bill for building upkeep or common area costs. Three layouts are offered at 95, 100 and 108 square metres, and the rent varies with size and floor within that narrow band. The development completed in August 2025 and is ready for immediate occupation, which means these are early asking rates rather than a long letting history.",
    },
    {
      q: "Why does a 108 square metre apartment cost nearly the same as a 95?",
      a: "Because the rent band here is only KES 5,000 wide while the floor area range is 13 square metres, which compresses the ladder almost flat. A tenant comparing a 95 square metre unit at KES 85,000 against a 108 square metre unit at KES 90,000 will take the larger one nearly every time, since 14 percent more space costs 6 percent more rent. That makes the smallest layout the hardest to let in the building. If you own a 95 square metre unit, you need either a better floor, a better outlook or a lower number than the band suggests, because on paper you are the weakest offer in your own development.",
    },
    {
      q: "Is Serenity Residency a good short let building?",
      a: "No, and the design tells you so. A building composed entirely of two bedroom apartments at the Adams Arcade end of Ngong Road is not positioned for nightly guests, who cluster around the embassies, the Westlands offices and the Riverside hotels rather than the Junction Mall. What it is positioned for is the tenant almost nobody in Nairobi markets to: two working professionals sharing. At KES 90,000 inclusive of service charge, with a pool, a gym and four levels of secure parking, a shared two bedroom works out at KES 45,000 each for a well serviced Kilimani apartment, which is a genuinely strong proposition.",
    },
  ],
};

export default function Article() {
  return (
    <>
      <Lede>
        Serenity Residency is a building of two bedroom apartments. Not mostly
        two bedrooms: only two bedrooms, in three sizes within 13 square metres
        of each other, at rents within KES 5,000 of each other. When every
        owner in a development holds the same product, competing on product is
        not available, and the interesting question becomes who you are selling
        it to.
      </Lede>

      <Callout title="Where these numbers come from">
        Published agent listings for Serenity Residency on Ngong Road near
        Adams Arcade, Kilimani, read in October 2026, together with our own
        letting data for Kilimani. The development completed in August 2025, so
        the rates below are early asking rates rather than an established
        letting record. We manage in Kilimani; we sold nothing in this
        development.
      </Callout>

      <KeySummary
        question="What does an apartment at Serenity Residency rent for?"
        answer="Two bedrooms let from KES 85,000 to KES 90,000 a month with the service charge included in the quoted rent, so there is no separate bill for building upkeep or common area costs. Three layouts are offered at 95, 100 and 108 square metres, and the rent varies with size and floor within that narrow band. The development completed in August 2025 and is ready for immediate occupation, which means these are early asking rates rather than a long letting history."
        facts={[
          { label: "Location", value: "Ngong Road, near Adams Arcade" },
          { label: "Completed", value: "August 2025" },
          { label: "Layouts", value: "95, 100 and 108 sq m, all two bed" },
          { label: "Rent", value: "KES 85,000 to 90,000 a month" },
          { label: "Service charge", value: "Included in the quoted rent" },
          { label: "Junction Mall", value: "Five minute walk" },
          { label: "Parking", value: "Four levels, secure" },
          { label: "Shared between two", value: "About KES 45,000 each" },
        ]}
      />

      <H2 id="what-it-is">What the building actually is</H2>

      <P>
        A completed development on Ngong Road beside Adams Arcade, finished in
        August 2025 and ready for occupation, made up of two bedroom apartments
        at 95, 100 and 108 square metres.
      </P>

      <P>
        The facilities are a genuinely full set rather than a token one: a
        swimming pool, a fully equipped gym, a children&rsquo;s play area,
        secure parking across four levels, high speed lifts, a backup
        generator, a borehole, manned security around the clock with CCTV, a
        perimeter wall and street lighting, and fibre ready connectivity. Four
        levels of parking for a building of two bedroom flats is notably
        generous and matters more than it sounds for the tenant group this
        building suits.
      </P>

      <P>
        Position is the Junction Mall end of Kilimani, five minutes&rsquo; walk
        from the Junction, which is a different neighbourhood in practice from
        the Denis Pritt and Kindaruma end even though the postcode agrees. It
        is more local, more mid market and more residential, with less of the
        diplomatic and corporate traffic that sets rents further north. How the
        area as a whole is shifting is in{" "}
        <Link
          href="/insights/kilimani-apartment-market-changing-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how the Kilimani apartment market is changing
        </Link>
        .
      </P>

      <H3 id="what-it-rents-for">
        What does an apartment at Serenity Residency rent for?
      </H3>

      <P>
        KES 85,000 to KES 90,000 a month, with the service charge inside that
        figure. No separate bill for building upkeep, common area maintenance or
        shared facility costs, which in a building with a pool, a gym and four
        parking levels is not a small thing to have absorbed.
      </P>

      <P>
        For an owner that cuts two ways and both are worth understanding. On a
        search page it is a real advantage, because a single inclusive number
        beats a lower number with a levy attached that the reader has to guess
        at. Across the tenancy it removes the most common argument of the first
        quarter. But it also means that if the levy rises, it rises against
        your return rather than your tenant&rsquo;s, so read the budget and ask
        for the collection rate with more care than an owner elsewhere would.
        What a levy should cover is in{" "}
        <Link
          href="/insights/service-charge-nairobi-apartments-explained"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          service charge explained
        </Link>
        .
      </P>

      <H2 id="flat-ladder">The rate ladder is almost flat</H2>

      <H3 id="why-108-costs-the-same">
        Why does a 108 square metre apartment cost nearly the same as a 95?
      </H3>

      <P>
        Set the ends of the range against each other. Ninety five square metres
        at KES 85,000. One hundred and eight square metres at KES 90,000.
        Fourteen percent more apartment for six percent more rent.
      </P>

      <Pullquote>
        A tenant shown both will take the larger one. Which makes the smallest
        layout the hardest unit to let in a building where every unit is
        otherwise identical.
      </Pullquote>

      <P>
        If you own a 95 square metre unit, that is your situation and it is
        better to know it than to discover it over three empty months. You
        cannot differentiate on layout, because there is no layout variation.
        You cannot differentiate on amenity, because it is shared. What is left
        is floor, outlook and price, and only one of those three is under your
        control after purchase.
      </P>

      <P>
        The practical response is to price into the gap rather than against the
        band. A 95 square metre unit advertised at KES 80,000 inclusive is a
        clearly better offer than a 108 at KES 90,000, and it lets. Advertised
        at KES 85,000 it is a slightly worse offer than the larger unit at a
        marginally higher rent, and it sits. The difference between those two
        strategies is KES 60,000 a year against potentially two empty months at
        KES 170,000.
      </P>

      <H2 id="sharers">The tenant nobody markets to</H2>

      <H3 id="is-it-a-good-short-let">
        Is Serenity Residency a good short let building?
      </H3>

      <P>
        No. Nightly demand in Nairobi follows embassies, corporate offices,
        hospitals and tourism, and it concentrates in Westlands, Riverside and
        the northern end of Kilimani. The Adams Arcade stretch of Ngong Road is
        not where that guest books, and a building composed entirely of two
        bedroom family flats is not what they book.
      </P>

      <P>
        What this building is unusually well suited to is a tenant the Nairobi
        market barely acknowledges: two working professionals sharing. The
        listings themselves mention sharers, which is rare, and the product fits
        exactly.
      </P>

      <UL>
        <LI>
          <strong>Two bedrooms and two bathrooms.</strong> The basic
          requirement for sharing, and the whole building has it
        </LI>
        <LI>
          <strong>KES 45,000 each.</strong> Ninety thousand split two ways, with
          the service charge already inside it, for a flat with a pool, a gym
          and secure parking
        </LI>
        <LI>
          <strong>Four levels of parking.</strong> Two sharers arrive with two
          cars, which is precisely where most Nairobi buildings, allocating one
          bay per unit, fall down
        </LI>
        <LI>
          <strong>One inclusive number.</strong> Sharers split a bill. A rent
          with a separate variable levy is genuinely harder for two people to
          agree on than one fixed figure
        </LI>
        <LI>
          <strong>Ngong Road.</strong> Workable commutes in several directions
          rather than one, which matters when two people work in different
          places
        </LI>
      </UL>

      <Callout title="Where sharers actually look">
        Not where families look. Sharers find flats through employer
        noticeboards, university and professional networks, and word of mouth,
        and they decide fast when something fits. An owner here who tells three
        local employers that a two bedroom with two bathrooms and two parking
        bays is available at KES 90,000 all in will usually let it before the
        portal listing has been seen.
      </Callout>

      <P>
        The second natural tenant is a small family wanting the Junction, and
        good schools within reach, on a budget that will not stretch to Denis
        Pritt Road. Both groups want the same thing from you: a clear inclusive
        number and a quick, straightforward tenancy.
      </P>

      <H2 id="what-to-do">What to do if yours is sitting empty</H2>

      <OL>
        <LI>
          <strong>Advertise to sharers explicitly.</strong> Say two bedrooms,
          two bathrooms, two parking bays, KES 90,000 all in. Almost no Nairobi
          listing says this and it is exactly what the tenant is looking for
        </LI>
        <LI>
          <strong>Lead with the inclusive rent.</strong> The service charge
          being inside the figure is your advantage and a reader cannot see it
          unless you say so
        </LI>
        <LI>
          <strong>If you own 95 square metres, price under the band.</strong>{" "}
          You are the weakest offer in a building of identical offers and the
          only lever you hold is the number
        </LI>
        <LI>
          <strong>Publish the floor and the aspect.</strong> In a single layout
          building these are the only facts that distinguish your unit
        </LI>
        <LI>
          <strong>Ask how many units are currently empty.</strong> The building
          is a year old, so this is knowable, and it changes what your rent
          should be
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
        , and how to set the figure is in{" "}
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
        This is one of the better sharing propositions in Kilimani. Two
        bedrooms, two bathrooms, a pool, a gym, four levels of parking and a
        five minute walk to the Junction, at KES 85,000 to 90,000 with the
        service charge already in it, works out around KES 45,000 each for two
        people. Very little in this neighbourhood competes with that.
      </P>

      <P>
        Two things to do. Ask for the 108 square metre layout rather than the
        95, because the price difference is small and the space difference is
        not. And ask how many units are empty, since in a building of identical
        apartments completed a year ago there is usually more than one owner
        willing to negotiate. If you want us to tell you what is genuinely
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
        We manage long lets and short stays in Kilimani, including in this
        building, and we sold nothing here, so there is no projection of ours to
        defend. We charge 10 percent of rent collected on a long let and 20
        percent of revenue on a short stay, with no setup fee and no exit fee.
        At Serenity Residency we will tell you to let it long and to market it
        to sharers, which is the cheaper of our two services, because the
        nightly demand that would justify the other one is not on this stretch
        of Ngong Road.
      </P>

      <P>
        If your apartment is empty,{" "}
        <Link
          href="/list-your-property"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          send it to us
        </Link>{" "}
        with the floor and the square metres and we will come back with an
        achievable rate and a straight view on who to target. What{" "}
        <Link
          href="/long-term-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          long term management
        </Link>{" "}
        covers is set out in full.
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/kilimani-apartment-market-changing-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how the Kilimani apartment market is changing
        </Link>
        ,{" "}
        <Link
          href="/insights/denis-gardens-kilimani-owners-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Denis Gardens at the other end of Kilimani
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

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
  slug: "winchester-gardens-riverside-owners-guide",
  title:
    "Winchester Gardens, Riverside Drive: the clearest furnished premium in Nairobi, and the breakeven hidden in it",
  metaTitle: "Winchester Gardens Riverside: an owner's guide to letting",
  description:
    "The same two bedroom lets at KES 110,000 unfurnished and KES 210,000 to 270,000 furnished. That is the widest furnishing premium published in Nairobi, and the building's own nightly rate tells you exactly when to stop chasing it.",
  metaDescription:
    "Winchester Gardens Riverside lets at KES 110,000 unfurnished and up to KES 270,000 furnished. What an owner should actually do.",
  publishedAt: "2026-10-28",
  readingMinutes: 12,
  author: authors.editors,
  tags: [
    "Winchester Gardens",
    "Riverside",
    "Short Let",
    "Nairobi",
    "Property Management",
    "Kenya",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Winchester Gardens Riverside Drive owners guide to letting a furnished apartment",
  faq: [
    {
      q: "What does an apartment at Winchester Gardens rent for?",
      a: "Unfurnished, published listings put a two bedroom of 100 to 115 square metres at KES 110,000 a month, with the two bedroom range running to KES 135,000 and a three bedroom at about KES 135,000. Furnished, the same building advertises a studio at KES 5,500 a night, a one bedroom at KES 150,000 to 160,000 a month or KES 6,500 to 7,500 a night, a two bedroom at KES 210,000 to 270,000 a month or KES 10,000 to 12,000 a night, and a three bedroom at KES 270,000 to 300,000 a month or from KES 15,000 a night. The furnished rates generally include internet, water and cleaning twice a week, and exclude electricity.",
    },
    {
      q: "Is it worth furnishing an apartment at Winchester Gardens?",
      a: "On these numbers, yes, and it is one of the few Nairobi buildings where that is unambiguous. A two bedroom that lets unfurnished at KES 110,000 a month lets furnished at KES 210,000 to 270,000, so the furniture roughly doubles the rent and in the best case more than doubles it. The reason is the address rather than the furniture: Riverside Drive sits among the embassies, Villa Rosa Kempinski and Dusit D2, the International School of Kenya and the Aga Khan hospital, which is the deepest pool of diplomatic, corporate and relocation tenants in Nairobi, and they arrive expecting a furnished serviced flat. The caveat is that this premium belongs to the monthly furnished let, not automatically to nightly letting.",
    },
    {
      q: "Should I let nightly or monthly at Winchester Gardens?",
      a: "Monthly, unless you can hold occupancy close to full. The building's own rate card gives you the answer: a furnished two bedroom is advertised at KES 11,500 to 12,000 a night and KES 250,000 a month, and KES 250,000 divided by KES 11,500 is about 22 nights, so nightly letting only beats the monthly rate above roughly 70 percent occupancy before any costs at all. Once you add platform commission, cleaning between every stay and the higher management fee that nightly letting carries, the real crossover sits far above that. A furnished monthly tenant at KES 250,000 who needs cleaning twice a week and nothing else is the better business for most owners here.",
    },
  ],
};

export default function Article() {
  return (
    <>
      <Lede>
        A two bedroom at Winchester Gardens lets unfurnished at KES 110,000 a
        month. The same apartment, furnished, is advertised between KES 210,000
        and KES 270,000. Nairobi rarely publishes both halves of that
        comparison for one building, and when it does the conclusion is not
        quite the one owners reach for.
      </Lede>

      <Callout title="Where these numbers come from">
        Published agent and platform listings for Winchester Gardens on
        Riverside Drive, read in October 2026, together with our own letting
        and short stay data for Riverside. Rates quoted are asking rates and
        several of the listings differ from one another, which we have shown as
        ranges rather than averaging away. We manage on Riverside Drive,
        including in this building; we sold nothing in it.
      </Callout>

      <KeySummary
        question="What does an apartment at Winchester Gardens rent for?"
        answer="Unfurnished, published listings put a two bedroom of 100 to 115 square metres at KES 110,000 a month, with the two bedroom range running to KES 135,000 and a three bedroom at about KES 135,000. Furnished, the same building advertises a studio at KES 5,500 a night, a one bedroom at KES 150,000 to 160,000 a month or KES 6,500 to 7,500 a night, a two bedroom at KES 210,000 to 270,000 a month or KES 10,000 to 12,000 a night, and a three bedroom at KES 270,000 to 300,000 a month or from KES 15,000 a night. The furnished rates generally include internet, water and cleaning twice a week, and exclude electricity."
        facts={[
          { label: "Location", value: "Riverside Drive, Nairobi" },
          { label: "Unit types", value: "Studios, 1, 2 and 3 bed" },
          { label: "2 bed unfurnished", value: "KES 110,000 to 135,000" },
          { label: "2 bed furnished", value: "KES 210,000 to 270,000" },
          { label: "2 bed nightly", value: "KES 10,000 to 12,000" },
          { label: "1 bed furnished", value: "KES 150,000 to 160,000" },
          { label: "3 bed furnished", value: "KES 270,000 to 300,000" },
          { label: "Marketed sale price", value: "KES 9.5M to 14M, 2 bed" },
        ]}
      />

      <H2 id="what-it-is">What the building actually is</H2>

      <P>
        A contemporary high rise on Riverside Drive, complete and occupied, with
        studios, one, two and three bedroom apartments. Bedrooms en suite, open
        plan living and dining, fitted kitchens with appliances, balconies on
        most units, two bedroom layouts at 100 to 115 square metres and three
        bedrooms at about 120.
      </P>

      <P>
        Shared facilities are a gym, landscaped Zen gardens, a children&rsquo;s
        play area, high speed lifts, CCTV with intercom and controlled access,
        manned security, secure resident parking, a borehole with water storage
        and backup power covering both the common areas and the apartments
        themselves. That last detail is worth more than it sounds: generator
        cover for the units rather than just the corridors is not universal in
        Nairobi and a corporate tenant will ask.
      </P>

      <P>
        The address is the asset. Riverside Drive runs between Kileleshwa and
        Westlands and is walking distance to Riverside Square, with Villa Rosa
        Kempinski and Dusit D2 nearby, embassies and diplomatic missions all
        around, the International School of Kenya and Aga Khan Academy for
        schools, and MP Shah and the Aga Khan University Hospital close by. Why
        that corridor behaves the way it does is in{" "}
        <Link
          href="/insights/riverside-drive-nairobi-old-money-corridor"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Riverside Drive, the old money corridor
        </Link>
        .
      </P>

      <H3 id="what-it-rents-for">
        What does an apartment at Winchester Gardens rent for?
      </H3>

      <P>Unfurnished, from the sale and letting material for the building:</P>

      <UL>
        <LI>
          <strong>Two bedroom, 100 to 115 sq m, two balconies.</strong> KES
          110,000 a month, with the wider two bedroom range quoted to KES
          135,000
        </LI>
        <LI>
          <strong>Three bedroom, about 120 sq m.</strong> About KES 135,000 a
          month
        </LI>
      </UL>

      <P>Furnished, from the same building&rsquo;s own rate card:</P>

      <UL>
        <LI>
          <strong>Studio.</strong> KES 5,500 a night
        </LI>
        <LI>
          <strong>One bedroom.</strong> KES 150,000 to 160,000 a month, or KES
          6,500 to 7,500 a night
        </LI>
        <LI>
          <strong>Two bedroom.</strong> KES 210,000 to 270,000 a month, or KES
          10,000 to 12,000 a night
        </LI>
        <LI>
          <strong>Three bedroom.</strong> KES 270,000 to 300,000 a month, or
          from KES 15,000 a night
        </LI>
      </UL>

      <P>
        One furnished listing is explicit about what the money covers: KES
        270,000 a month exclusive of electricity, inclusive of internet, tap
        water and cleaning twice a week. That is a serviced let rather than a
        bare tenancy, and the inclusions are part of why the rate holds.
      </P>

      <H2 id="the-premium">The furnished premium, and why it is this large</H2>

      <H3 id="is-it-worth-furnishing">
        Is it worth furnishing an apartment at Winchester Gardens?
      </H3>

      <P>
        KES 110,000 unfurnished against KES 210,000 to 270,000 furnished. In
        most Nairobi buildings furnishing adds 30 to 60 percent. Here it
        roughly doubles the rent, and at the top of the range does rather more
        than that. That is the widest furnished premium we have seen published
        for a single Nairobi building.
      </P>

      <Pullquote>
        The premium is not being paid for your sofa. It is being paid for an
        address where a tenant arriving from abroad can put their suitcase down
        on the first night.
      </Pullquote>

      <P>
        Riverside Drive has the deepest concentration of diplomatic, NGO,
        corporate and medical demand in the city, and that tenant does not want
        to buy a fridge. They are arriving on a posting, a contract or a
        hospital stay, they want internet that works and someone cleaning
        twice a week, and their housing is frequently paid by an employer with
        a furnished allowance. An unfurnished apartment is invisible to them
        entirely.
      </P>

      <P>
        So the furnishing decision here is easier than almost anywhere else in
        Nairobi. What is less obvious is which furnished route to take.
      </P>

      <H2 id="the-breakeven">The breakeven the rate card gives away</H2>

      <H3 id="nightly-or-monthly">
        Should I let nightly or monthly at Winchester Gardens?
      </H3>

      <P>
        The building advertises the same furnished two bedroom two ways: KES
        11,500 to 12,000 a night, and KES 250,000 a month. Divide one by the
        other. KES 250,000 at KES 11,500 a night is about 22 nights. Twenty two
        nights out of thirty is roughly 72 percent occupancy.
      </P>

      <P>
        That is the gross crossover. Below about 70 percent occupancy the
        nightly route earns less than simply letting the flat monthly, before a
        single cost is counted. And the costs are not symmetric:
      </P>

      <UL>
        <LI>
          <strong>Platform commission.</strong> Booking sites take a share of
          every nightly reservation and nothing from a monthly tenant
        </LI>
        <LI>
          <strong>Cleaning between stays.</strong> A monthly let is cleaned
          twice a week on a known schedule. A nightly let is turned over
          completely after every departure
        </LI>
        <LI>
          <strong>Management.</strong> Short stay management costs roughly
          double long let management, ours included, because it is roughly
          double the work
        </LI>
        <LI>
          <strong>Your attention.</strong> Which is real even when it is unpaid
        </LI>
      </UL>

      <P>
        Put those in and the true crossover moves well above 70 percent, into
        territory that requires genuinely active management to reach and hold
        across a full year rather than across a good quarter. Riverside is also
        a market that rewards patience over volume: it carries a high rate and
        thinner traffic, so an owner here has to be able to absorb an empty
        fortnight without panic. That argument in full is in{" "}
        <Link
          href="/insights/airbnb-riverside-nairobi-premium-short-let"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Riverside as a premium short let market
        </Link>
        .
      </P>

      <Callout title="The route most owners here should take">
        Furnish the apartment, then let it monthly to a diplomatic, corporate or
        medical tenant at KES 210,000 to 270,000 with internet and twice weekly
        cleaning included. You capture almost the entire furnished premium,
        you carry none of the void risk, and you are not running a small hotel.
        Nightly letting is the right call here only if the unit is excellent,
        actively managed, and you have a reason to believe you will beat 70
        percent across the year rather than hope to.
      </Callout>

      <H2 id="the-sale-price">A note on the sale prices</H2>

      <P>
        The same material markets two bedrooms from KES 9.5 million to 12
        million, one listing at KES 14 million, and three bedrooms at about KES
        15 million. Against an unfurnished rent of KES 110,000 a month, KES 12
        million is a gross yield of about 11 percent, and KES 9.5 million is
        nearly 14 percent.
      </P>

      <P>
        Treat that with the same suspicion you should apply anywhere those two
        numbers do not reconcile. Good Nairobi stock produces a gross yield in
        the high single digits. If a building appears to produce 14 percent,
        either the sale price is a launch figure no longer on offer or the rent
        is an aspiration, and the way to find out is to ask for signed tenancy
        agreements at the quoted rent rather than a price list. Our workings
        for the city are in{" "}
        <Link
          href="/insights/best-neighbourhoods-nairobi-rental-yield-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the best neighbourhoods for rental yield
        </Link>
        .
      </P>

      <H2 id="what-to-do">What to do if yours is sitting empty</H2>

      <OL>
        <LI>
          <strong>Furnish it, if it is not already.</strong> This is one of the
          few Nairobi buildings where the premium clearly justifies the outlay,
          and an unfurnished unit here is invisible to the tenant the address
          attracts
        </LI>
        <LI>
          <strong>Market to employers, not individuals.</strong> Embassies,
          missions, NGOs, the hospitals and relocation agents place the tenants
          who pay these rates, and most listings wait for them to turn up
          instead
        </LI>
        <LI>
          <strong>Quote the inclusions explicitly.</strong> Internet, water,
          twice weekly cleaning, generator cover for the unit itself. These are
          what a relocating tenant is comparing, not the square metres
        </LI>
        <LI>
          <strong>Set a serious minimum stay if you do let nightly.</strong>{" "}
          Single nights do not pay for the turnover at this standard
        </LI>
        <LI>
          <strong>Check the service charge and its collection rate.</strong> A
          borehole, lifts and generator cover for the apartments are expensive,
          and they are the things your tenant is actually paying for
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
        , furnishing budgets are in{" "}
        <Link
          href="/insights/cost-furnish-nairobi-apartment-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the cost to furnish a Nairobi apartment
        </Link>
        , and the route comparison is in{" "}
        <Link
          href="/insights/airbnb-vs-long-term-rental-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          short let against long term rental
        </Link>
        .
      </P>

      <H2 id="tenants">If you are looking to rent here</H2>

      <P>
        Winchester Gardens is a sensible choice if you have arrived in Nairobi
        on a posting and want to be near the embassies, the Aga Khan and the
        International School of Kenya without living in Westlands itself. The
        thing to check is backup power, because generator cover for the
        apartment rather than only the common areas is advertised here and is
        genuinely unusual, so confirm it applies to your unit.
      </P>

      <P>
        On price, know that the same apartments let unfurnished at around KES
        110,000. You are paying for the furniture, the internet, the cleaning
        and the flexibility, which is a fair exchange for a one year posting
        and a poor one for a five year stay. For a long stay ask for the
        monthly rate rather than the nightly one, and ask what happens to it at
        three months and six. If you want us to tell you what is genuinely
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
        We manage short stay and long lets on Riverside Drive, including in
        this building, and we sold nothing here, so there is no projection of
        ours to defend. We charge 10 percent of rent collected on a long let
        and 20 percent of revenue on a short stay, with no setup fee and no
        exit fee. At Winchester Gardens we will usually tell you to furnish and
        then let monthly, which is the advice that earns us the smaller fee, and
        we will say so plainly when a particular unit is good enough to justify
        the nightly route instead.
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
        rate both ways and the breakeven for your specific unit. What{" "}
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
          href="/insights/riverside-drive-nairobi-old-money-corridor"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Riverside Drive, the old money corridor
        </Link>
        ,{" "}
        <Link
          href="/insights/riverside-one-residency-nairobi-owners-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Riverside One Residency
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/furnished-short-let-nairobi-what-to-expect"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          what to expect from a furnished short let
        </Link>
        .
      </P>
    </>
  );
}

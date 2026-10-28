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
  slug: "misty-springs-westlands-owners-guide",
  title:
    "Misty Springs, Westlands: a 23 storey tower, a doubled furnished rate and a yield claim worth checking",
  metaTitle: "Misty Springs Westlands: an owner's guide to letting",
  description:
    "One bedrooms advertise at KES 100,000 a month unfurnished and a furnished two bedroom asks KES 300,000. The gap between those two numbers is the whole decision, and the 8 to 10 percent yield in the sales material does not survive the arithmetic.",
  metaDescription:
    "Misty Springs Westlands rents at KES 100,000 to 180,000 a month, double that furnished. What an owner should actually expect.",
  publishedAt: "2026-10-28",
  readingMinutes: 11,
  author: authors.editors,
  tags: [
    "Misty Springs",
    "Westlands",
    "Short Let",
    "Nairobi",
    "Property Management",
    "Kenya",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Misty Springs Westlands owners guide to letting a one or two bedroom apartment",
  faq: [
    {
      q: "What does an apartment at Misty Springs rent for?",
      a: "Published listings put a one bedroom of about 58 square metres at KES 100,000 to 120,000 a month unfurnished and a two bedroom of 90 to 99 square metres at KES 150,000 to 180,000. Furnished, the same stock asks considerably more: a furnished one bedroom of 68 square metres is advertised at roughly KES 120,000 a month with utilities and weekly cleaning included, and a furnished higher floor two bedroom is advertised at KES 15,000 a night with a two night minimum, or KES 300,000 a month. Those are asking rates rather than achieved ones, and in a building completed in 2025 there is not yet enough letting history for anyone to claim otherwise honestly.",
    },
    {
      q: "Is the 8 to 10 percent yield at Misty Springs realistic?",
      a: "The figures in the sales material do not hang together, and an owner should know which half to distrust. A one bedroom quoted at KES 8 million against rent of KES 100,000 a month is a gross yield of 15 percent, roughly double what good Nairobi stock produces, and the two bedroom at KES 15 million against KES 180,000 works out near 14 percent. Either the sale price is a launch or off plan figure that is no longer available, or the rent is aspirational. Both cannot be true at once. Before you buy here, ask the agent for signed tenancies at the quoted rent rather than an asking price list, and deduct the service charge, the void allowance and management before calling anything a yield.",
    },
    {
      q: "Should I furnish my Misty Springs apartment for short stay?",
      a: "The furnishing premium advertised in this building is unusually wide, which makes it worth taking seriously rather than assuming. A two bedroom that lets unfurnished at KES 150,000 to 180,000 is advertised furnished at KES 300,000 a month, so the furniture is being asked to roughly double the rent. That spread is real in Westlands because of the corporate and relocation demand around GTC, but it is only collectable if the unit is genuinely well presented and actively managed. The rooftop heated pool, the gym and a high floor view over the expressway give you something specific to sell, and a furnished unit on a low floor with no view is competing on price alone.",
    },
  ],
};

export default function Article() {
  return (
    <>
      <Lede>
        Misty Springs went up on Westlands Road in 2025: 23 storeys, a rooftop
        heated pool, face scan entry, five minutes from GTC. The letting
        material around it quotes KES 100,000 a month for a one bedroom, KES
        300,000 for a furnished two bedroom, and a return of 8 to 10 percent.
        Two of those three numbers are useful. This is which, and why.
      </Lede>

      <Callout title="Where these numbers come from">
        Published agent and platform listings for Misty Springs on Westlands
        Road, read in October 2026, together with our own letting and short
        stay data for Westlands. The building completed in 2025, so almost
        everything published about it is an asking rate rather than an
        achieved one, and we have not dressed asking rates up as evidence. We
        manage in Westlands; we sold nothing in this building.
      </Callout>

      <KeySummary
        question="What does an apartment at Misty Springs rent for?"
        answer="Published listings put a one bedroom of about 58 square metres at KES 100,000 to 120,000 a month unfurnished and a two bedroom of 90 to 99 square metres at KES 150,000 to 180,000. Furnished, the same stock asks considerably more: a furnished one bedroom of 68 square metres is advertised at roughly KES 120,000 a month with utilities and weekly cleaning included, and a furnished higher floor two bedroom is advertised at KES 15,000 a night with a two night minimum, or KES 300,000 a month. Those are asking rates rather than achieved ones, and in a building completed in 2025 there is not yet enough letting history for anyone to claim otherwise honestly."
        facts={[
          { label: "Location", value: "24 Westlands Road, Nairobi" },
          { label: "Completed", value: "2025, 23 storeys" },
          { label: "1 bed", value: "58 sq m, KES 100,000 to 120,000" },
          { label: "2 bed", value: "90 to 99 sq m, KES 150,000 to 180,000" },
          { label: "Furnished 2 bed", value: "KES 300,000 a month asking" },
          { label: "Nightly asking", value: "KES 15,000, two night minimum" },
          { label: "Quoted sale price", value: "KES 8M one bed, 15M two bed" },
          { label: "Westlands occupancy", value: "64 to 76 percent" },
        ]}
      />

      <H2 id="what-it-is">What the building actually is</H2>

      <P>
        A 23 storey tower on Westlands Road, finished in 2025, with two high
        speed lifts per block, a rooftop heated swimming pool, a rooftop
        barbecue and lounge deck, a gym, a children&rsquo;s play area, an
        elegant reception, smart home features with facial recognition access,
        visitor parking and round the clock manned security with CCTV.
      </P>

      <P>
        The location is the strongest thing about it and is not exaggerated in
        the listings: a short walk to the Global Trade Centre and the
        Kempinski, about seven minutes to Westgate, a kilometre to Sarit
        Centre, and quick access to the expressway. For a corporate tenant or
        a relocating family who wants to walk to work in Westlands, that is a
        genuinely good address.
      </P>

      <H3 id="what-it-rents-for">
        What does an apartment at Misty Springs rent for?
      </H3>

      <P>
        Unfurnished, published listings put a one bedroom of about 58 square
        metres at KES 100,000 to 120,000 a month and a two bedroom of 90 to 99
        square metres at KES 150,000 to 180,000. Furnished, a 68 square metre
        one bedroom is advertised at roughly KES 120,000 a month with
        utilities and weekly cleaning included, aimed squarely at remote
        workers and relocations. A furnished higher floor two bedroom with
        both bedrooms en suite is advertised at KES 15,000 a night on a two
        night minimum, or KES 300,000 a month.
      </P>

      <P>
        Every one of those is an asking rate. The building is a year old. Nobody
        has a multi year letting record here, and an agent who tells you
        otherwise is describing the price list.
      </P>

      <H2 id="the-yield-claim">The yield claim, checked</H2>

      <H3 id="is-the-yield-realistic">
        Is the 8 to 10 percent yield at Misty Springs realistic?
      </H3>

      <P>
        The sales material pairs a one bedroom sale price of KES 8 million with
        rent of KES 100,000 to 120,000 a month. Do that division. KES 100,000 a
        month is KES 1.2 million a year, and KES 1.2 million against KES 8
        million is a gross yield of 15 percent. At the top of the rent band it
        is 18 percent. The two bedroom at KES 15 million against KES 180,000 a
        month lands near 14 percent.
      </P>

      <Pullquote>
        A building advertising a 15 percent gross yield and an 8 to 10 percent
        return in the same brochure is telling you that it has not checked its
        own numbers.
      </Pullquote>

      <P>
        Good Nairobi apartment stock produces a gross yield in the high single
        digits. A genuine 15 percent would make this the best performing
        residential block in the city by a distance, and it would not need to
        advertise. So one of the two figures is doing marketing work. Either
        the KES 8 million is a launch or off plan price that is no longer
        available to you, or the KES 100,000 rent is what the vendor hopes
        rather than what tenants are signing.
      </P>

      <P>
        Which it is matters enormously and is easy to establish. Ask for signed
        tenancy agreements at the quoted rent, not a price list and not a
        projection. Then take the gross figure and remove the service charge,
        a realistic void allowance for a tower where many units came to market
        in the same year, and management. What is left is the yield. Our
        workings for the city as a whole are in{" "}
        <Link
          href="/insights/best-neighbourhoods-nairobi-rental-yield-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the best neighbourhoods for rental yield
        </Link>
        .
      </P>

      <Callout title="The new tower problem">
        When a 23 storey building completes, a large number of near identical
        units reach the letting market within months of each other. That is
        the one period in a building&rsquo;s life when supply is genuinely
        against you, and it is exactly when the launch projections are quoted
        most confidently. Price for it rather than holding out, because an
        empty month is unrecoverable and a slightly low rent is not.
      </Callout>

      <H2 id="furnishing">The furnishing spread is unusually wide here</H2>

      <H3 id="should-i-furnish">
        Should I furnish my Misty Springs apartment for short stay?
      </H3>

      <P>
        Set the two advertised rates for a two bedroom beside each other: KES
        150,000 to 180,000 unfurnished, KES 300,000 furnished. The furniture is
        being asked to roughly double the rent. In most Nairobi buildings the
        furnished premium is 30 to 60 percent, so a claimed doubling deserves
        scrutiny, but in this particular location it is not absurd.
      </P>

      <P>
        Westlands has the deepest corporate, NGO and relocation demand in
        Nairobi, and this building sits inside walking distance of the
        Global Trade Centre and the Kempinski. Our Westlands data puts a well
        presented short let at 64 to 76 percent occupancy across a full year.
        The demand is there.
      </P>

      <P>What it depends on is narrower than owners like to hear:</P>

      <UL>
        <LI>
          <strong>Floor and outlook.</strong> The nightly listings in this
          building lead with the fourteenth floor and unobstructed skyline
          views over GTC and the expressway. On a low floor with no view you
          are selling the same amenity list as everyone else at a lower price
        </LI>
        <LI>
          <strong>Presentation, not furnishing.</strong> Adequately furnished
          and passively listed loses to a KES 170,000 unfurnished tenant who
          needs nothing from you
        </LI>
        <LI>
          <strong>Active management.</strong> The KES 300,000 figure assumes
          near full occupancy, nightly repricing and someone answering guests.
          Without that it is a number on a page
        </LI>
        <LI>
          <strong>The long stay route.</strong> The furnished one bedroom here
          is let monthly with utilities and cleaning included to remote workers
          and corporate arrivals. That is lower risk than nightly letting and
          often the better business for a single unit
        </LI>
      </UL>

      <P>
        The arithmetic both ways is in{" "}
        <Link
          href="/insights/airbnb-vs-long-term-rental-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          short let against long term rental
        </Link>
        , what it costs to furnish is in{" "}
        <Link
          href="/insights/cost-furnish-nairobi-apartment-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the cost to furnish a Nairobi apartment
        </Link>
        , and what Westlands does as a short stay market is in{" "}
        <Link
          href="/insights/airbnb-westlands-2026-host-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the Westlands host guide
        </Link>
        .
      </P>

      <H2 id="what-to-do">What to do if you own here</H2>

      <OL>
        <LI>
          <strong>Publish the floor.</strong> In a 23 storey tower it is the
          single fact that separates your unit from the forty others like it,
          and most listings omit it
        </LI>
        <LI>
          <strong>Decide furnished or unfurnished on honest presentation.</strong>{" "}
          Not on the KES 300,000 headline, which belongs to a high floor en
          suite unit that is actively run
        </LI>
        <LI>
          <strong>Check the service charge and its collection rate.</strong> A
          heated rooftop pool, two lifts per block and a generator are only an
          asset while the levy is actually being collected to run them, and in
          a new building the first full year is when that gets tested
        </LI>
        <LI>
          <strong>Get the position on nightly letting in writing.</strong>{" "}
          Before you furnish, not after
        </LI>
        <LI>
          <strong>Ask your agent for viewing counts.</strong> No viewings is a
          marketing fault, viewings without offers is a pricing or presentation
          fault, and they are fixed differently
        </LI>
      </OL>

      <P>
        If it is sitting empty, the general diagnosis is in{" "}
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
        It is a good building to rent in if you work in Westlands, and the walk
        to GTC is the real selling point rather than the pool. Ask for the
        floor and the aspect before you view, because the difference between a
        low floor and a high one here is the difference between a city view and
        a view of the building next door at the same rent.
      </P>

      <P>
        For a furnished stay of a month or more, ask explicitly what the long
        stay rate is and what it includes. Published furnished lets in this
        building already bundle utilities and weekly cleaning, and an owner
        holding empty nights in a new tower will usually go further than the
        listing. If you want us to tell you what is genuinely available,{" "}
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
        We manage short stay and long lets in Westlands, including in this
        building, and we sold nothing here, so there is no sales projection of
        ours to defend. We charge 10 percent of rent collected on a long let
        and 20 percent of revenue on a short stay, with no setup fee and no
        exit fee. At Misty Springs the first thing we will tell you is what
        your specific floor and layout can actually achieve, which is usually
        not the brochure number and occasionally better than the agent&rsquo;s.
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
        rate both ways and a straight view on which to take. What{" "}
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
          href="/insights/westlands-complete-guide-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the complete guide to Westlands
        </Link>
        ,{" "}
        <Link
          href="/insights/westlands-transformation-nairobi-vertical-revolution"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how Westlands went vertical
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

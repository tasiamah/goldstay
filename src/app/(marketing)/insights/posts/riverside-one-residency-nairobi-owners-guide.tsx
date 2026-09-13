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
  slug: "riverside-one-residency-nairobi-owners-guide",
  title: "Riverside One Residency: what your unit should be earning",
  metaTitle: "Riverside One Residency: rents, furnishing and letting",
  description:
    "Riverside One Residency on Riverside Drive lets unfurnished at KES 140,000 to 150,000 for a two bedroom and KES 270,000 to 290,000 furnished. Why furnishing nearly doubles the rent in this building specifically, why the medium stay tenant beats the nightly guest here, and why a void on Riverside is a different problem from a void in Westlands.",
  metaDescription:
    "Furnishing a Riverside One two bed takes it from KES 145,000 to KES 280,000 a month. Why that works here, and why nightly letting is not the answer.",
  publishedAt: "2026-09-13",
  readingMinutes: 12,
  author: authors.editors,
  tags: [
    "Riverside One",
    "Riverside Drive",
    "Letting",
    "Nairobi",
    "Property Management",
    "Kenya",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Riverside One Residency, Riverside Drive, Nairobi, guide for apartment owners",
};

export default function Article() {
  return (
    <>
      <Lede>
        Riverside One Residency is a completed fifteen floor building on
        Riverside Drive, two and three bedroom units only, by Oasis Development
        Company. The published letting figures for it contain something most
        owners there have not acted on: a two bedroom lets unfurnished at
        around KES 140,000 to 150,000 a month, and the same apartment furnished
        lets at KES 270,000 to 290,000. Furnishing it does not improve the rent
        by a margin. It very nearly doubles it. That is unusual, it is specific
        to this address and this tenant pool, and it is the most valuable thing
        an owner in the building can understand.
      </Lede>

      <Callout title="Where these numbers come from">
        Published agent listings and developer material for Riverside One
        current to mid 2026, and our own Riverside letting data, as at
        September 2026. We manage in this building, which is why we are
        confident about the tenant profile, but nothing here describes any
        individual owner&rsquo;s unit or their returns. Asking rents are not
        achieved rents, and the sale prices quoted by different agents for the
        same layouts disagree by a few million, which we have noted where it
        matters.
      </Callout>

      <KeySummary
        question="What does an apartment at Riverside One Residency let for?"
        answer="Riverside One Residency is a fifteen floor completed development by Oasis Development Company on Riverside Drive, within walking distance of Riverside Square, comprising two and three bedroom apartments only, from 101 to 187 square metres. Agents publish two bedrooms at 101 to 116 square metres selling between about KES 12 million and 18 million and three bedrooms with domestic staff quarters at 163 to 187 square metres between about KES 19.5 million and 28 million. On letting, the published figures are the interesting part: a two bedroom lets unfurnished at roughly KES 140,000 to 150,000 a month but furnished at KES 270,000 to 290,000, and a three bedroom unfurnished at KES 200,000 to 250,000 against KES 370,000 to 390,000 furnished. Nightly rates are quoted at KES 14,000 to 16,000 for a two bedroom and KES 19,000 to 21,000 for a three bedroom. Run those against the 60 to 70 percent occupancy we record for the Riverside corridor and furnished monthly letting produces roughly the same gross as nightly letting while costing far less to run and carrying a lower management fee, which makes the furnished medium stay tenant, typically diplomatic, NGO or consultant staff on a three to twelve month posting, the strongest route in this building. The constraint to plan for is not competition but a thin tenant pool: Riverside has the highest rent band of any area we cover and the smallest number of people looking at any one time, so a void here runs longer than in Westlands and is solved by reaching the right institution rather than by cutting the rent."
        facts={[
          { label: "Developer", value: "Oasis Development Company" },
          { label: "Location", value: "Riverside Drive, by Riverside Square" },
          { label: "Scale", value: "15 floors, 2 and 3 bed only" },
          { label: "Sizes", value: "101 to 187 sqm" },
          { label: "2 bed unfurnished", value: "KES 140k to 150k a month" },
          { label: "2 bed furnished", value: "KES 270k to 290k a month" },
          { label: "3 bed furnished", value: "KES 370k to 390k a month" },
          { label: "Riverside occupancy", value: "60% to 70%" },
        ]}
      />

      <H2 id="what-it-is">What the building is</H2>

      <UL>
        <LI>
          <strong>Location:</strong> Riverside Drive, within walking distance
          of Riverside Square. That last point matters more than it sounds and
          we come back to it
        </LI>
        <LI>
          <strong>Developer and status:</strong> Oasis Development Company,
          fifteen floors, completed and ready for occupation. Completion was
          published variously as mid 2025, December 2025 and 2026, and agents
          now list only a couple of units still available, so it is effectively
          sold
        </LI>
        <LI>
          <strong>Unit mix:</strong> two and three bedrooms only. No studios
          and no one beds, which is the single most important structural fact
          about the building and the reason it behaves differently from the
          Westlands towers
        </LI>
        <LI>
          <strong>Two bedrooms:</strong> roughly 101 square metres with a
          master en-suite, and 114 to 116 square metres with all bedrooms
          en-suite. Published between about KES 12 million and 18 million
          depending on the agent and the configuration
        </LI>
        <LI>
          <strong>Three bedrooms:</strong> 163, 168 and 187 square metres, all
          en-suite, most with domestic staff quarters. Published between about
          KES 19.5 million and 28 million
        </LI>
        <LI>
          <strong>Amenities:</strong> swimming pool, fully equipped gym,
          borehole, backup generator, two high speed lifts per block, access
          control, CCTV and intercom, ample parking, large balconies, floor to
          ceiling windows and an indoor children&rsquo;s play area
        </LI>
      </UL>

      <H2 id="the-furnishing-gap">Why furnishing nearly doubles the rent here</H2>

      <P>
        In most of Nairobi, furnishing a flat adds something to the rent and
        buys you a faster let. The premium is real but it is a premium, and it
        rarely justifies itself on the arithmetic alone. At Riverside One the
        published figures say something much stronger.
      </P>

      <UL>
        <LI>
          <strong>Two bedroom:</strong> KES 140,000 to 150,000 unfurnished
          against KES 270,000 to 290,000 furnished. Call it an extra KES
          135,000 a month
        </LI>
        <LI>
          <strong>Three bedroom:</strong> KES 200,000 to 250,000 unfurnished
          against KES 370,000 to 390,000 furnished. An extra KES 140,000 or so
        </LI>
      </UL>

      <P>
        Furnishing a 114 square metre apartment to the standard this address
        expects is not cheap, and it is not a weekend of shopping. But against
        an extra KES 135,000 a month, even a generous budget pays itself back
        inside about eighteen months and then keeps paying. There is very
        little else available to an owner of a completed apartment that returns
        at that rate.
      </P>

      <Pullquote>
        The reason it works is the tenant, not the furniture. Riverside is a
        diplomatic and NGO corridor, and those tenants arrive on a posting with
        a shipping allowance that does not stretch to a household, or with no
        intention of buying a sofa for eighteen months.
      </Pullquote>

      <P>
        Our own reading of the corridor explains why the ceiling is so high.
        Riverside carries the highest rent band of any area we cover, above
        Westlands for a comparable apartment, at USD 1,500 to 2,100 a month for
        a two bedroom. The reason is scarcity and tenant mix: there are only so
        many apartments on Riverside Drive, several embassies and international
        organisations sit on or immediately off it, and their staff and the
        consultants who work with them make up most of the tenant base. These
        are allowance backed tenancies as a rule, which means the tenant
        negotiates less on rent and stays for the length of the posting.
      </P>

      <P>
        A furnished two bedroom at KES 270,000 to 290,000 sits at the very top
        of that band. An unfurnished one at KES 145,000 sits well below it. You
        are not choosing between two rents. You are choosing between two tenant
        pools, and only one of them is the pool that makes Riverside worth
        owning.
      </P>

      <P>
        The general version of this decision is in{" "}
        <Link
          href="/insights/furnished-or-unfurnished-rental-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          furnished against unfurnished
        </Link>
        , though we would say the case here is stronger than the general one.
      </P>

      <H2 id="not-nightly">Why the answer is not nightly letting</H2>

      <P>
        Agents quote Riverside One furnished units at KES 14,000 to 16,000 a
        night for a two bedroom and KES 19,000 to 21,000 for a three bedroom,
        so the obvious next thought is that nightly letting must beat a monthly
        tenant. On these numbers it does not, and it is worth seeing why.
      </P>

      <P>
        We record the Riverside corridor at 60 to 70 percent occupancy across a
        full year. Take a two bedroom at KES 15,000 a night and 65 percent
        occupancy and you gross around KES 296,000 a month. The furnished
        monthly rate of KES 280,000 is almost the same figure. Then look at
        what sits underneath each.
      </P>

      <UL>
        <LI>
          <strong>Nightly:</strong> KES 296,000 gross, less a 20 percent
          management fee leaves about KES 237,000, and out of that the owner
          funds electricity, water, internet, cleaning between every stay,
          consumables and replacement linen, plus the void weeks that the 65
          percent already assumes
        </LI>
        <LI>
          <strong>Furnished monthly:</strong> KES 280,000, less a 10 percent
          fee leaves about KES 252,000, the tenant pays the utilities, there is
          no turnover cost, and the income arrives on a contract rather than a
          calendar
        </LI>
      </UL>

      <P>
        So the furnished medium stay tenant wins on net, and wins by more than
        the numbers suggest once you count the work. It also suits what
        Riverside actually is. This is a quiet, contained, heavily secured
        corridor with almost no retail or nightlife within walking distance,
        which is exactly why its tenants chose it and exactly the wrong profile
        for a guest booking three nights. The demand here is consultants,
        diplomatic and NGO visitors and senior corporate arrivals on postings
        of three to twelve months, and that is a medium stay business rather
        than a nightly one.
      </P>

      <Callout title="The permission worth knowing you have">
        A good number of buildings along Riverside Drive do not permit short or
        serviced letting at all, which is the main caveat we give anyone
        thinking of buying in the corridor to let furnished. Riverside
        One&rsquo;s own agents advertise nightly and furnished monthly rates
        openly, which suggests it is one of the buildings where this is
        available. Confirm your own position with the management company in
        writing before you furnish, because in a corridor where most of the
        stock cannot do this, being able to is a genuine scarcity advantage and
        worth being certain of.
      </Callout>

      <P>
        What the premium short let market on Riverside does look like, for the
        owners it does suit, is in{" "}
        <Link
          href="/insights/airbnb-riverside-nairobi-premium-short-let"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Riverside as a premium short let
        </Link>
        . How the two routes compare in general, and in buildings where the
        answer flips, is in{" "}
        <Link
          href="/insights/airbnb-vs-long-term-rental-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          short let against long term rental
        </Link>
        , with worked examples at{" "}
        <Link
          href="/insights/skynest-residences-westlands-owners-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Skynest
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/gtc-residences-pan-pacific-westlands-owners-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          GTC Residences
        </Link>
        .
      </P>

      <H2 id="the-void">A void here is a different problem</H2>

      <P>
        This is where owners who have let elsewhere in Nairobi get caught out,
        and it is the opposite of the problem we describe at{" "}
        <Link
          href="/insights/shangri-la-residency-westlands-letting-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Shangri-La Residency
        </Link>{" "}
        in Westlands.
      </P>

      <P>
        In Westlands, a unit sits empty because a hundred near identical flats
        are competing for the same tenant. On Riverside there is almost no
        competing stock. Your unit sits empty because at any given moment very
        few people are looking for an apartment on Riverside Drive. It is a
        thin pool rather than a crowded one.
      </P>

      <P>
        That changes the remedy completely. Cutting the rent in Westlands at
        least gets you seen. Cutting the rent on Riverside mostly does nothing,
        because the three people who want a Riverside two bedroom this quarter
        are not comparing you against a cheaper Riverside two bedroom. They are
        being placed by an employer, a relocation agent or an embassy housing
        officer. If those channels do not know your unit exists, the rent is
        irrelevant.
      </P>

      <P>
        So the honest expectation, and we say this to anyone buying in the
        corridor before they buy: a Riverside unit takes longer to let than a
        Kilimani one and often longer than a Westlands one. That is the trade
        for a higher rent and a longer tenancy once it lands. If you need
        occupancy next month, for instance because a mortgage starts
        immediately, Riverside is the wrong address to have bought and you
        should plan around that rather than discount into it.
      </P>

      <H2 id="advantages">Two things this building has that the corridor does not</H2>

      <OL>
        <LI>
          <strong>You can walk to Riverside Square.</strong> The standing
          weakness of the Riverside corridor is that there is essentially no
          retail within walking distance, so a tenant without a car finds the
          address impractical however good the apartment. Riverside One is
          within walking distance of Riverside Square, which removes that
          objection. It belongs in the first line of your listing, not the
          eighth, because it is the thing that separates this building from its
          neighbours for a tenant who has just arrived in Nairobi and has not
          yet got a car
        </LI>
        <LI>
          <strong>The three bedrooms have staff quarters.</strong> For the
          diplomatic and senior NGO tenant this building is aimed at, domestic
          staff quarters are not a nice extra, they are a requirement, and a
          three bedroom without them is a different and smaller market. If you
          own one of the 163 to 187 square metre units with a DSQ, that is a
          specific qualifying feature for the highest paying tenant pool in
          Nairobi and most listings bury it in a bullet list
        </LI>
      </OL>

      <P>
        Worth also knowing the constraint. Riverside Drive funnels into Chiromo
        Road, and at peak times that junction is the whole
        neighbourhood&rsquo;s route in and out, so the ten minute commute to
        town is a ten minute commute at some times of day and not others.
        Tenants at this level ask about security directly, and provisioning
        along the road was substantially upgraded after the attack at 14
        Riverside Drive in 2019, so know what your building actually provides
        rather than gesturing at the area.
      </P>

      <P>
        The area in full is in{" "}
        <Link
          href="/insights/riverside-drive-nairobi-old-money-corridor"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the Riverside Drive guide
        </Link>
        , and the service charge question is in{" "}
        <Link
          href="/insights/hoa-and-management-company-fees-nairobi-explained"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          management company fees explained
        </Link>
        .
      </P>

      <H2 id="what-to-do">What to do if you own a unit there</H2>

      <OL>
        <LI>
          <strong>Price the furnishing properly, once.</strong> Get a real
          quote for furnishing your specific layout to the standard the
          building&rsquo;s rent band assumes, then set it against an extra KES
          135,000 a month. If the payback is inside two years, the decision
          makes itself. Half furnishing it is the one outcome to avoid, because
          it appeals to neither pool
        </LI>
        <LI>
          <strong>Confirm in writing what the building permits.</strong>{" "}
          Furnished monthly letting, serviced letting and nightly letting are
          three different things and a management company may permit some and
          not others. Establish it before you spend on furniture
        </LI>
        <LI>
          <strong>Target the institution, not the portal.</strong> The tenants
          who pay Riverside rents are placed by employers, relocation agents
          and embassy housing officers. A listing on a public portal reaches
          almost none of them. This is the single biggest difference between a
          Riverside unit that lets in six weeks and one that sits for five
          months
        </LI>
        <LI>
          <strong>Lead with the walk to Riverside Square and the DSQ.</strong>{" "}
          They are the two qualifying facts for your tenant pool and they are
          usually buried
        </LI>
        <LI>
          <strong>Do not discount into a thin market.</strong> A rent cut does
          not create a tenant who was not already looking. Spend the same money
          on presentation and on reaching the right channel
        </LI>
        <LI>
          <strong>Expect and budget for a longer let.</strong> Plan on a
          vacancy measured in months rather than weeks, and treat anything
          faster as good news rather than the base case
        </LI>
      </OL>

      <P>
        Pricing against real comparables is in{" "}
        <Link
          href="/insights/how-to-price-nairobi-rental"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          pricing a Nairobi rental
        </Link>
        , and how we vet tenants at this level is in{" "}
        <Link
          href="/insights/tenant-screening-nairobi-how-we-do-it"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          tenant screening
        </Link>
        .
      </P>

      <H2 id="tenants">If you are looking to rent at Riverside One</H2>

      <P>
        A note for the other half of the people searching this building.
        Riverside One is a straightforward recommendation if you are arriving
        in Nairobi on a posting: it is quiet, it is in the most heavily secured
        corridor in the city, it has a borehole, a generator and two lifts per
        block, and unlike most of Riverside you can walk to a mall. The two and
        three bedroom units are generous by Nairobi standards at 101 to 187
        square metres, and the three bedrooms come with staff quarters.
      </P>

      <P>
        Two practical things. Furnished and unfurnished are very differently
        priced here, so be clear which you want before you view, and if your
        employer is paying, ask them to approach the building directly because
        institutional enquiries are treated differently from individual ones.
        And test the Chiromo Road junction at the hour you would actually
        commute rather than at the hour the viewing is scheduled.{" "}
        <Link
          href="/find-a-home"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Find a home
        </Link>{" "}
        is where to tell us what you need.
      </P>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        We manage in this building, which is the main reason we are writing
        about it with any confidence: we know what the tenants ask for here,
        which channels actually produce them and how long a genuine let takes
        rather than how long an agent says it will take. We have not published
        any owner&rsquo;s figures and will not.
      </P>

      <P>
        Ten percent of rent collected on a long or furnished let, twenty
        percent of revenue on a short stay, no setup fee and no exit fee. For
        Riverside One specifically we would usually steer you to a furnished
        medium stay tenancy at the lower fee rather than a nightly programme at
        the higher one, for the reasons set out above. If you want the nightly
        route anyway, because you use the apartment yourself for part of the
        year, we will run it, but we will show you both sets of numbers first.
      </P>

      <P>
        If your unit is empty and has been for a while, the question we would
        ask before anything else is not what rent you are asking. It is who has
        actually been told the unit exists.{" "}
        <Link
          href="/list-your-property"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Send us the unit
        </Link>{" "}
        with the layout, the floor and whether it is furnished, and we will come
        back with an achievable rent, a realistic time to let and the
        furnishing arithmetic for your specific apartment. What each service
        covers is on{" "}
        <Link
          href="/long-term-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          long term management
        </Link>
        ,{" "}
        <Link
          href="/tenant-finding"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          tenant finding
        </Link>{" "}
        and{" "}
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
          href="/insights/shangri-la-residency-westlands-letting-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Shangri-La Residency
        </Link>{" "}
        for the opposite kind of void,{" "}
        <Link
          href="/insights/1870-west-westlands-handover-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          1870 West
        </Link>{" "}
        for owners about to take keys, and{" "}
        <Link
          href="/insights/aura-riverside-review-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          our review of Aura Riverside
        </Link>
        , the other end of the same road.
      </P>
    </>
  );
}

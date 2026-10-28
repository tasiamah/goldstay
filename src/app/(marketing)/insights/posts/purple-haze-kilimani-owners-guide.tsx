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
  slug: "purple-haze-kilimani-owners-guide",
  title:
    "Purple Haze, Kilimani: the only building in Nairobi that puts a price on the view",
  metaTitle: "Purple Haze Kilimani: an owner's guide to letting",
  description:
    "A two bedroom with a limited view is USD 99 a night. The same apartment with a city view is USD 109, and a three bedroom with a pool view is USD 129. Every other building tells owners the view matters. This one proves it, and the margin is 30 percent.",
  metaDescription:
    "Purple Haze Kilimani lets from USD 1,250 unfurnished and USD 99 a night. What the published view premium tells owners.",
  publishedAt: "2026-10-29",
  readingMinutes: 11,
  author: authors.editors,
  tags: [
    "Purple Haze",
    "Kilimani",
    "Short Let",
    "Nairobi",
    "Property Management",
    "Kenya",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Purple Haze Kilimani owners guide to letting a serviced furnished apartment",
  faq: [
    {
      q: "What does an apartment at Purple Haze rent for?",
      a: "The development's own material puts unfurnished apartments from USD 1,250 a month and fully furnished ones from USD 2,000 a month. Nightly, a two bedroom starts at USD 99 with a limited view and USD 109 with a city view, while a three bedroom starts at USD 114 with a limited view and USD 129 with a pool or garden and city view. A furnished three bedroom off Kitale Lane has separately been advertised at KES 323,000 a month plus a service charge of KES 25,000. Rents here are quoted in dollars rather than shillings, which is itself significant for an owner.",
    },
    {
      q: "How much is a view actually worth at Purple Haze?",
      a: "About 30 percent, and this is the only Nairobi building we know of that publishes the figure rather than leaving owners to guess. A two bedroom with a limited view starts at USD 99 a night and the same apartment with a city view starts at USD 109, a premium of roughly 10 percent. A three bedroom runs from USD 114 with a limited view to USD 129 with a pool view or a garden and city view, about 13 percent. Across the full range, from a two bedroom with no outlook at USD 99 to a three bedroom with a view at USD 129, the spread is 30 percent for apartments in the same building with the same finishes.",
    },
    {
      q: "Is Purple Haze a serviced apartment business rather than a letting one?",
      a: "In substance, yes, and an owner should price accordingly. The on-site provision includes 24 hour reception and concierge, a restaurant offering in-residence dining, a professional launderette and dry cleaning, a convenience store, a business centre with a private boardroom, a wellness centre with sauna and steam rooms, a gym run by external trainers and a heated pool. That is hotel infrastructure, and it is what justifies USD 99 to 129 a night and USD 2,000 a month in a neighbourhood where an ordinary furnished two bedroom asks far less. The rate reflects the services as much as the apartment, which means an owner here is participating in an operating business rather than simply letting a flat.",
    },
  ],
};

export default function Article() {
  return (
    <>
      <Lede>
        Every article about letting a Nairobi apartment, including several of
        ours, tells owners that the floor and the outlook matter. Purple Haze is
        the only building in the city that publishes the number. A two bedroom
        with a limited view is USD 99 a night. With a city view it is USD 109.
        A three bedroom with a pool view is USD 129. Thirty percent, printed on
        the rate card.
      </Lede>

      <Callout title="Where these numbers come from">
        Purple Haze&rsquo;s own published material and agent listings for the
        development off Kitale Lane, Kilimani, read in October 2026, together
        with our own letting and short stay data for Kilimani. Rates are asking
        rates. One agent listing quotes a furnished three bedroom at figures we
        could not fully reconcile against the development&rsquo;s own rate
        card, so we have reported both rather than picking one. We manage in
        Kilimani, including in this building; we sold nothing in it.
      </Callout>

      <KeySummary
        question="What does an apartment at Purple Haze rent for?"
        answer="The development's own material puts unfurnished apartments from USD 1,250 a month and fully furnished ones from USD 2,000 a month. Nightly, a two bedroom starts at USD 99 with a limited view and USD 109 with a city view, while a three bedroom starts at USD 114 with a limited view and USD 129 with a pool or garden and city view. A furnished three bedroom off Kitale Lane has separately been advertised at KES 323,000 a month plus a service charge of KES 25,000. Rents here are quoted in dollars rather than shillings, which is itself significant for an owner."
        facts={[
          { label: "Location", value: "Off Kitale Lane, Kilimani" },
          { label: "Built", value: "2015 to 2019" },
          { label: "Unit types", value: "2 and 3 bed, all en suite" },
          { label: "Unfurnished", value: "From USD 1,250 a month" },
          { label: "Furnished", value: "From USD 2,000 a month" },
          { label: "2 bed nightly", value: "USD 99 limited, 109 city view" },
          { label: "3 bed nightly", value: "USD 114 limited, 129 pool view" },
          { label: "View premium", value: "About 30 percent across the range" },
        ]}
      />

      <H2 id="what-it-is">What the building actually is</H2>

      <P>
        A serviced and furnished apartment development off Kitale Lane, itself
        off Denis Pritt Road in Kilimani, built between 2015 and 2019, offering
        two and three bedroom apartments both furnished and unfurnished. The
        apartments themselves are specified well above the Nairobi norm:
        Spanish porcelain tiled floors, Italian designed kitchens with
        integrated AEG appliances, full wall windows, en suite bedrooms with
        built in wardrobes, guest cloakrooms, laundry areas, detached self
        contained staff quarters on the larger units, solar water heating and
        two reserved parking spaces.
      </P>

      <P>
        The shared provision is where it departs from being an apartment block
        altogether: a heated infinity pool and a separate children&rsquo;s
        pool, a wellness centre with sauna and steam rooms, a gym run by
        external trainers, a children&rsquo;s creche and play area, 24 hour
        reception and concierge, a guest arrival lounge and bar lounge, rooftop
        gardens with barbecue facilities, a business centre with meeting rooms
        and a private boardroom, a professional launderette and dry cleaning
        service, an on-site convenience store, an on-site restaurant with in
        residence dining, landscaped gardens, full backup generator, borehole,
        electric fenced boundary and CCTV with security around the clock.
      </P>

      <P>
        One listing also notes that it sits in a designated blue zone, the area
        within which United Nations staff security rules permit personnel to
        live. That is the same advantage we described at{" "}
        <Link
          href="/insights/108-riverside-nairobi-owners-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          108 Riverside
        </Link>
        , and it is worth confirming in writing for your own unit before
        advertising it, because the claim is checkable.
      </P>

      <H3 id="what-it-rents-for">
        What does an apartment at Purple Haze rent for?
      </H3>

      <P>
        Unfurnished from USD 1,250 a month, fully furnished from USD 2,000.
        Nightly, two bedrooms from USD 99 and three bedrooms from USD 114, both
        rising with the outlook. A furnished three bedroom has separately been
        advertised by an agent at KES 323,000 a month plus a KES 25,000 service
        charge.
      </P>

      <P>
        The furnished premium is therefore about 60 percent, from USD 1,250 to
        USD 2,000. That is a strong premium but not the near doubling seen in
        the Riverside buildings, and the reason is that the unfurnished rate
        here is already high: an unfurnished apartment at Purple Haze still
        comes with the concierge, the pool, the gym and the restaurant.
      </P>

      <H2 id="the-view">What a view is worth, in writing</H2>

      <H3 id="how-much-is-a-view-worth">
        How much is a view actually worth at Purple Haze?
      </H3>

      <P>
        The rate card is unusually honest and unusually useful:
      </P>

      <UL>
        <LI>
          <strong>Two bedroom, limited view.</strong> From USD 99 a night
        </LI>
        <LI>
          <strong>Two bedroom, city view.</strong> From USD 109 a night
        </LI>
        <LI>
          <strong>Three bedroom, limited view.</strong> From USD 114 a night
        </LI>
        <LI>
          <strong>Three bedroom, pool view.</strong> From USD 129 a night
        </LI>
        <LI>
          <strong>Three bedroom, garden and city view.</strong> From USD 129 a
          night
        </LI>
      </UL>

      <Pullquote>
        Ten percent for a city view on a two bedroom. Thirteen percent on a
        three. Thirty percent across the full range, for apartments in the same
        building with the same kitchens.
      </Pullquote>

      <P>
        Two things follow for any Nairobi owner, not just one here. First, if
        your apartment has an outlook, failing to photograph it and failing to
        state it in the listing is costing you something close to 10 percent of
        your rate, and that is now a measured figure rather than an assertion.
        Second, if you are buying, the premium for a higher floor or a better
        aspect is recoverable in rent, which is not true of every upgrade a
        developer will sell you.
      </P>

      <P>
        It also sets a discipline on the other side. If your unit genuinely has
        a limited view, pricing it as though it does not will produce viewings
        that end politely and no bookings. The honest move is to accept the
        lower band and compete on something you do have.
      </P>

      <H2 id="serviced">This is an operating business, not a flat</H2>

      <H3 id="is-it-a-serviced-apartment-business">
        Is Purple Haze a serviced apartment business rather than a letting one?
      </H3>

      <P>
        Read the amenity list again and ask what kind of enterprise needs it. A
        24 hour reception. A concierge handling packages and transport. A
        restaurant doing in-residence dining. A commercial launderette with dry
        cleaning. A convenience store. A business centre with a boardroom. A
        wellness centre with sauna and steam rooms. None of that is apartment
        infrastructure. All of it is hotel infrastructure.
      </P>

      <P>
        That is what the rate is buying, and it is why USD 2,000 a month holds
        in a neighbourhood where an ordinary furnished two bedroom asks
        considerably less. For an owner it has a specific consequence: your
        return depends on how well the operation is run as much as on your own
        apartment. A concierge desk that is unstaffed, a restaurant that
        closes or a pool that is cold removes the justification for the rate
        across the whole building, including your unit, regardless of how well
        you have furnished it.
      </P>

      <Callout title="Read the service charge as an operating budget">
        A KES 25,000 monthly service charge on a three bedroom is high by
        Nairobi standards and entirely rational for this list of services. The
        question to ask is not whether it is high but whether it is sufficient
        and whether it is being collected. A development that cannot fund its
        reception and its restaurant stops being a serviced apartment building
        and becomes an expensive ordinary one, and the rate card follows.
      </Callout>

      <P>
        On the nightly against monthly question, the published rates point the
        same way as the Riverside buildings. A furnished two bedroom at USD
        2,000 a month against USD 99 a night needs about 20 nights, or 67
        percent occupancy, simply to match the monthly rate before any costs.
        Add platform commission, turnover cleaning and short stay management
        and the real crossover moves above our Kilimani band of 62 to 74
        percent. The extended corporate stay, the relocation and the long
        assignment are what this building is built for, and its own material
        says as much. The arithmetic is in{" "}
        <Link
          href="/insights/airbnb-vs-long-term-rental-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          short let against long term rental
        </Link>
        .
      </P>

      <H2 id="dollars">A word about being paid in dollars</H2>

      <P>
        Rents here are quoted in United States dollars. For a Kenyan owner that
        is a meaningful structural feature and not merely presentational. Your
        income is dollar denominated while a good share of your costs, the
        service charge, local maintenance, management fees and staff, are
        shilling denominated.
      </P>

      <P>
        That is a favourable asymmetry when the shilling weakens and an
        unfavourable one when it strengthens, and either way it is worth holding
        deliberately rather than by accident. Confirm which currency your own
        lease is actually written in, since quoting in dollars and settling in
        shillings at a rate fixed on signing is a different position from being
        paid in dollars. The broader case for dollar linked rental income is in{" "}
        <Link
          href="/insights/kenya-emerging-market-property-investment-thesis-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the Kenya investment thesis
        </Link>
        .
      </P>

      <H2 id="what-to-do">What to do if yours is sitting empty</H2>

      <OL>
        <LI>
          <strong>State your view category and photograph it.</strong> The rate
          card prices it at about 10 percent, so a listing that omits it is
          discounting itself by roughly that much
        </LI>
        <LI>
          <strong>Target extended stays, not weekends.</strong> The economics
          here favour the month, and the business centre, creche and launderette
          exist for people staying rather than visiting
        </LI>
        <LI>
          <strong>Market to employers and missions.</strong> Corporate housing
          desks, relocation agents and agencies place the tenants who pay USD
          2,000 a month, and they do not browse portals
        </LI>
        <LI>
          <strong>Confirm the blue zone position in writing.</strong> It widens
          your tenant pool considerably and it is a claim you should be able to
          evidence
        </LI>
        <LI>
          <strong>Watch the operation, not just your flat.</strong> Attend the
          residents&rsquo; meetings and read the service charge accounts,
          because at this building the shared operation is most of what your
          rate rests on
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
        , and what tenants expect from serviced stock is in{" "}
        <Link
          href="/insights/furnished-short-let-nairobi-what-to-expect"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          what to expect from a furnished short let
        </Link>
        .
      </P>

      <H2 id="tenants">If you are looking to stay here</H2>

      <P>
        Purple Haze is among the strongest serviced options in Kilimani for a
        stay measured in months rather than nights, and the reason is the
        services rather than the apartments. A reception that is always staffed,
        a launderette, a restaurant, a creche and a boardroom make a
        relocation materially easier than a good furnished flat does.
      </P>

      <P>
        Two practical notes. Ask which view category your unit falls into before
        you agree a rate, because the difference between limited view and city
        view is published and negotiable. And for a long stay, ask for the
        monthly rate rather than thirty times the nightly one: the development
        states plainly that it is designed for long term living, and the gap
        between USD 2,000 a month and USD 99 a night is where that shows. If you
        want us to tell you what is genuinely available,{" "}
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
        We manage short stay and long lets in Kilimani, including in this
        building, and we sold nothing here, so there is no projection of ours to
        defend. We charge 10 percent of rent collected on a long let and 20
        percent of revenue on a short stay, with no setup fee and no exit fee.
        At Purple Haze we will usually point you at the extended corporate stay
        rather than the nightly market, and we will tell you plainly which view
        band your unit honestly sits in, because overpricing an apartment with a
        limited outlook is the fastest way to an empty quarter here.
      </P>

      <P>
        If your apartment is empty,{" "}
        <Link
          href="/list-your-property"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          send it to us
        </Link>{" "}
        with the floor, the layout and the aspect and we will come back with an
        achievable rate both ways. What{" "}
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
          href="/insights/108-riverside-nairobi-owners-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          108 Riverside, also in the blue zone
        </Link>
        ,{" "}
        <Link
          href="/insights/denis-gardens-kilimani-owners-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Denis Gardens, round the corner on Denis Pritt Road
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

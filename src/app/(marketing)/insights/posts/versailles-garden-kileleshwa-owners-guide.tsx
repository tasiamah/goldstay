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
  slug: "versailles-garden-kileleshwa-owners-guide",
  title:
    "Versailles Garden, Kileleshwa: 270 units finished in the same month, and what that does to your rent",
  metaTitle: "Versailles Garden Kileleshwa: an owner's guide to letting",
  description:
    "One bedrooms from KES 70,000, two bedrooms to KES 115,000, three bedrooms at KES 120,000. The rate card is not the problem. Two hundred and seventy units reaching the letting market within months of each other is.",
  metaDescription:
    "Versailles Garden Kileleshwa rents from KES 70,000 to 120,000 a month. What 270 units completing at once means for an owner.",
  publishedAt: "2026-10-28",
  readingMinutes: 11,
  author: authors.editors,
  tags: [
    "Versailles Garden",
    "Kileleshwa",
    "Long Term Rental",
    "Nairobi",
    "Property Management",
    "Kenya",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Versailles Garden Kileleshwa owners guide to letting a one, two or three bedroom apartment",
  faq: [
    {
      q: "What does an apartment at Versailles Garden rent for?",
      a: "Published listings put a one bedroom of 60 to 70 square metres at KES 70,000 to 75,000 a month, a two bedroom with master en suite of 103 square metres at KES 90,000 to 100,000, the same with a study at 110 square metres at KES 110,000, the same with a DSQ at 116 square metres at KES 115,000, and a three bedroom of 120 square metres with two en suite at KES 120,000. One furnished high floor one bedroom with views over the Arboretum is separately advertised at KES 148,000. Everything except that last figure is an unfurnished asking rate in a development that only completed in June 2026, so none of it is yet an achieved rent.",
    },
    {
      q: "Does 270 units completing at once hurt my rent?",
      a: "Yes, for the first year or so, and it is the single most important fact about letting here. Versailles Garden is 270 units across two blocks that all completed in June 2026, which means a large number of near identical apartments reached the letting market within months of each other. Your competition is not Kileleshwa; it is the forty other units in your own building with the same layout and the same finish, where the only variable a tenant can see is price and floor. The practical answer is to let early and slightly below the rate card rather than hold out, because an empty month is money you never recover while a rent KES 5,000 under the asking is recovered at the first renewal.",
    },
    {
      q: "Which layout at Versailles Garden lets most easily?",
      a: "The three bedroom, and the rate card explains why. At KES 120,000 for 120 square metres with two bedrooms en suite, it sits just KES 5,000 a month above the two bedroom with DSQ at 116 square metres and KES 10,000 above the two bedroom with study. A family comparing those three will take the three bedroom almost every time, which leaves the two bedroom plus DSQ as the hardest unit in the building to let: it costs nearly as much, offers a service room instead of a third bedroom, and appeals to a narrower tenant. If you own that layout, market the DSQ as a home office or a guest room rather than as staff space.",
    },
  ],
};

export default function Article() {
  return (
    <>
      <Lede>
        Versailles Garden completed off Githunguri Road in June 2026: 270
        apartments across two blocks, an indoor heated pool, a rooftop garden,
        a residents&rsquo; boardroom. The rate card runs from KES 70,000 to KES
        120,000 and is perfectly sensible. The number that will actually decide
        what you collect this year is 270.
      </Lede>

      <Callout title="Where these numbers come from">
        Published agent listings for Versailles Garden, off Githunguri Road in
        Kileleshwa, read in October 2026, together with our own letting data
        for Kileleshwa. The development completed in June 2026, so every rate
        below is an asking rate and none of them is yet an achieved rent. We
        have not quoted a short stay band for this building because we do not
        have enough Kileleshwa nightly data to publish one honestly. We manage
        in Kileleshwa; we sold nothing in this development.
      </Callout>

      <KeySummary
        question="What does an apartment at Versailles Garden rent for?"
        answer="Published listings put a one bedroom of 60 to 70 square metres at KES 70,000 to 75,000 a month, a two bedroom with master en suite of 103 square metres at KES 90,000 to 100,000, the same with a study at 110 square metres at KES 110,000, the same with a DSQ at 116 square metres at KES 115,000, and a three bedroom of 120 square metres with two en suite at KES 120,000. One furnished high floor one bedroom with views over the Arboretum is separately advertised at KES 148,000. Everything except that last figure is an unfurnished asking rate in a development that only completed in June 2026, so none of it is yet an achieved rent."
        facts={[
          { label: "Location", value: "Off Githunguri Road, Kileleshwa" },
          { label: "Completed", value: "June 2026, occupation ongoing" },
          { label: "Size", value: "270 units across Blocks A and B" },
          { label: "1 bed", value: "60 to 70 sq m, KES 70,000 to 75,000" },
          { label: "2 bed", value: "103 sq m, KES 90,000 to 100,000" },
          { label: "2 bed plus DSQ", value: "116 sq m, KES 115,000" },
          { label: "3 bed", value: "120 sq m, KES 120,000" },
          { label: "Furnished high floor", value: "KES 148,000 advertised" },
        ]}
      />

      <H2 id="what-it-is">What the development actually is</H2>

      <P>
        Two blocks off Githunguri Road in Kileleshwa, completed in June 2026,
        with 270 apartments between them. One, two and three bedroom layouts,
        masters en suite throughout, and optional study or domestic staff
        quarter variants on the two bedroom.
      </P>

      <P>
        The amenity list is unusually long even by current Nairobi standards:
        an indoor heated swimming pool, a fully equipped gym, a rooftop garden
        with a barbecue area, a children&rsquo;s play area, an indoor games
        area, a Zen garden and a residents&rsquo; boardroom for people working
        from home. Underneath it sits the set that matters more: a backup
        generator, a borehole with water storage, fibre internet and ample
        parking.
      </P>

      <P>
        Kileleshwa itself needs no defence. It is settled, green, central to
        Westlands, Lavington, Kilimani and the CBD, and reliably in demand.
        The wider picture is in{" "}
        <Link
          href="/insights/kileleshwa-complete-guide-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the complete guide to Kileleshwa
        </Link>
        .
      </P>

      <H3 id="what-it-rents-for">
        What does an apartment at Versailles Garden rent for?
      </H3>

      <P>The published ladder, unfurnished:</P>

      <UL>
        <LI>
          <strong>One bedroom, 60 to 70 sq m.</strong> KES 70,000 to 75,000 a
          month
        </LI>
        <LI>
          <strong>Two bedroom, master en suite, 103 sq m.</strong> KES 90,000
          to 100,000
        </LI>
        <LI>
          <strong>Two bedroom plus study, 110 sq m.</strong> KES 110,000
        </LI>
        <LI>
          <strong>Two bedroom plus DSQ, 116 sq m.</strong> KES 115,000
        </LI>
        <LI>
          <strong>Three bedroom, two en suite, 120 sq m.</strong> KES 120,000
        </LI>
      </UL>

      <P>
        Separately, a furnished one bedroom of 67 square metres on the
        eighteenth floor, with panoramic views over the city and the Arboretum,
        is advertised at KES 148,000. Hold that figure lightly: it is one unit,
        furnished, on a high floor with a genuine view, and it is roughly
        double the unfurnished rate for the same floor area.
      </P>

      <H2 id="the-supply-problem">The 270 unit problem</H2>

      <H3 id="does-270-units-hurt-my-rent">
        Does 270 units completing at once hurt my rent?
      </H3>

      <P>
        When a development of this size hands over in a single month, every
        owner in it goes looking for a tenant in the same quarter. For the
        first year your competition is not Kileleshwa at large. It is the other
        units in your own building with your layout, your finish and your
        amenity list, where the only things a tenant can tell apart are the
        floor and the price.
      </P>

      <Pullquote>
        An empty month is money you never get back. A rent KES 5,000 under the
        asking is money you get back at the first renewal.
      </Pullquote>

      <P>
        That asymmetry is the whole strategy. Owners who hold out for the rate
        card in a mass handover typically lose two or three months chasing an
        extra KES 5,000, which is a trade of KES 200,000 for KES 60,000 a year.
        Let early, let slightly under, and raise at renewal once the handover
        wave has cleared and the building has a reputation rather than a
        brochure.
      </P>

      <P>
        One genuine advantage to use: in the first year nobody has lived here
        long enough for the building to be reviewed, so your listing is
        competing on evidence you control. Photograph the actual unit in
        daylight, publish the floor and the aspect, and do not reuse the
        developer&rsquo;s renders, because every other listing in the building
        is using them and they all look identical as a result.
      </P>

      <Callout title="Ask what else in your stack is empty">
        Before you set a rent, ask the managing agent how many units of your
        layout are currently vacant and on which floors. In a building this new
        that is a knowable number and it changes the answer completely. If
        eleven identical two bedrooms are empty, you are not pricing against
        Kileleshwa, you are pricing against eleven near identical apartments
        with the same handover date.
      </Callout>

      <H2 id="layouts">The rate card compresses at the top, and it matters</H2>

      <H3 id="which-layout-lets-easiest">
        Which layout at Versailles Garden lets most easily?
      </H3>

      <P>
        Look at the top three rungs. Two bedroom plus study at 110 square
        metres, KES 110,000. Two bedroom plus DSQ at 116 square metres, KES
        115,000. Three bedroom with two en suite at 120 square metres, KES
        120,000. Ten thousand shillings a month separates a two bedroom from a
        three bedroom.
      </P>

      <P>
        A family comparing those three takes the three bedroom. It is barely
        more money, it is the same floor area, and a third bedroom is worth
        more to almost everyone than a service room. So the three bedroom will
        let fastest, and the two bedroom plus DSQ is the hardest unit in the
        building to place: it costs nearly as much as a three bedroom, offers
        less that a tenant values, and speaks to a narrower group.
      </P>

      <P>
        If you own that layout, the fix is positioning rather than price.
        Market the DSQ as a home office or a guest room, not as staff
        accommodation. A 116 square metre two bedroom with a separate, self
        contained room you can close the door on is an excellent flat for two
        people who both work from home, and nobody in Nairobi advertises it
        that way.
      </P>

      <P>
        If you own a one bedroom, you are at the other end of the same problem.
        It earns the most per square metre on this rate card, and it competes
        against the largest number of identical units. Presentation and floor
        are the only levers you have.
      </P>

      <H2 id="furnishing">The furnished question</H2>

      <P>
        The KES 148,000 furnished listing is tempting and should be read
        carefully. It is an eighteenth floor unit with real views over the
        Arboretum, furnished to a high standard, and it is roughly twice the
        unfurnished rate for the same size. The premium is attached to the
        floor and the view at least as much as to the furniture.
      </P>

      <P>
        On a low or middle floor without an outlook, a furnished one bedroom
        here is competing on price with every other furnished one bedroom in
        Kileleshwa and carrying the cost of the furniture, the cleaning and the
        management besides. Before you commit, get the position on nightly
        letting from the management company in writing, and read{" "}
        <Link
          href="/insights/cost-furnish-nairobi-apartment-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          what it costs to furnish a Nairobi apartment
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/airbnb-vs-long-term-rental-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          short let against long term rental
        </Link>{" "}
        before the furniture arrives rather than after. What Kileleshwa does as
        a nightly market is in{" "}
        <Link
          href="/insights/airbnb-kileleshwa-2026-host-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the Kileleshwa host guide
        </Link>
        .
      </P>

      <H2 id="what-to-do">What to do if yours is sitting empty</H2>

      <OL>
        <LI>
          <strong>Find out how many units like yours are vacant.</strong> In a
          building four months old this is the only comparable that matters
        </LI>
        <LI>
          <strong>Let early and slightly under the rate card.</strong> Then
          raise at renewal. Two empty months cost more than a year of KES 5,000
        </LI>
        <LI>
          <strong>Shoot your own photographs.</strong> Every listing in this
          building is using the same renders, so real daylight photographs of
          your actual unit are free differentiation
        </LI>
        <LI>
          <strong>Publish the floor and the aspect.</strong> In a 270 unit
          development they are the only facts that distinguish you
        </LI>
        <LI>
          <strong>Check the service charge and its collection rate.</strong> A
          heated indoor pool, a generator and a borehole are expensive to run,
          and the first full year after handover is when a new building finds
          out whether its levy is actually collectable
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
        , what the levy should cover is in{" "}
        <Link
          href="/insights/service-charge-nairobi-apartments-explained"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          service charge explained
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
        This is a good moment to be a tenant at Versailles Garden, and you
        should use it. A large number of identical units came to market
        together, which means owners are competing for you rather than the
        other way round. Ask for a rent below the advertised figure, ask for
        the first month free, or ask for both, and be willing to walk to the
        unit three floors up that is also empty.
      </P>

      <P>
        Two things to establish before signing. Ask what the service charge is
        and who pays it, because in a building with a heated pool and a
        generator it is not small. And view at the floor you would actually
        take, since the difference between a low floor and a high one here is
        the difference between looking at the next block and looking at the
        Arboretum. If you want us to tell you what is genuinely available,{" "}
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
        We manage long lets and short stays in Kileleshwa, including in this
        development, and we sold nothing here, so there is no launch projection
        of ours to defend. We charge 10 percent of rent collected on a long let
        and 20 percent of revenue on a short stay, with no setup fee and no
        exit fee. At Versailles Garden the advice in the first year is
        consistent and slightly unwelcome: take the tenant now, at a little
        under the brochure, and put the rent up when the handover wave has
        passed.
      </P>

      <P>
        If your apartment is empty,{" "}
        <Link
          href="/list-your-property"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          send it to us
        </Link>{" "}
        with the block, the floor and the layout and we will come back with an
        achievable rate and a straight view on the route. What{" "}
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
          href="/insights/kileleshwa-complete-guide-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the complete guide to Kileleshwa
        </Link>
        ,{" "}
        <Link
          href="/insights/lavington-vs-kileleshwa-comparison"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Lavington against Kileleshwa
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

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
  slug: "unity-east-tatu-city-owners-guide",
  title:
    "Unity East, Tatu City: a two bedroom at KES 55,000 with the service charge already in it",
  metaTitle: "Unity East Tatu City: an owner's guide to letting",
  description:
    "Two bedrooms here let from KES 52,500 to 62,500 a month, and almost uniquely in Kenya the quoted rent includes the service charge. That changes how you should advertise it, and it tells you plainly what kind of letting business this is.",
  metaDescription:
    "Unity East Tatu City lets at KES 52,500 to 62,500 a month including service charge. What an owner should expect.",
  publishedAt: "2026-10-28",
  readingMinutes: 10,
  author: authors.editors,
  tags: [
    "Unity East",
    "Tatu City",
    "Long Term Rental",
    "Nairobi",
    "Property Management",
    "Kenya",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Unity East Tatu City owners guide to letting a two bedroom apartment",
  faq: [
    {
      q: "What does an apartment at Unity East rent for?",
      a: "Published listings put a two bedroom with master en suite at KES 52,500 to 62,500 a month, with the most commonly advertised figures at KES 55,000 and KES 58,500, and in most cases the service charge is included in that rent. A furnished two bedroom is separately advertised at USD 600 a month, about KES 78,000, on a twelve month lease with utilities extra. That furnished premium of roughly 35 percent over the unfurnished rate is a normal Kenyan premium, and notably narrower than the near doubling seen in the Riverside and Westlands buildings where employers pay the rent.",
    },
    {
      q: "Is the service charge included in the rent at Unity East?",
      a: "In most of the published listings, yes, and it is unusual enough in Kenya to be worth advertising rather than burying. Two bedrooms are quoted at KES 55,000 and KES 58,500 inclusive of service charge, where a comparable Nairobi apartment would quote rent and then add a levy of KES 8,000 to 15,000 on top. For a tenant comparing listings on a search page that is the difference between a single number they can budget against and two numbers they have to add, and for an owner it removes the most common source of argument in the first three months of a tenancy. Confirm it applies to your specific unit before you advertise it, because inclusion is a scheme by scheme matter.",
    },
    {
      q: "Can I run a short let at Unity East, Tatu City?",
      a: "You can, and you almost certainly should not. Nightly demand in Nairobi follows business travel, embassies, hospitals and tourism, all of which sit in Westlands, Kilimani, Riverside and the city centre. Tatu City is about thirty minutes from the Nairobi CBD on a good run and the things that make it attractive, namely Crawford International School and Nova Pioneer a short walk away, reliable estate infrastructure, parks and a gated community, are the things a resident family values over years rather than a guest values over nights. The published furnished offer in this development is a twelve month lease at USD 600 a month, not a nightly rate, and that is the market telling you what it wants.",
    },
  ],
};

export default function Article() {
  return (
    <>
      <Lede>
        A two bedroom at Unity East lets for about KES 55,000 a month, and the
        service charge is already inside that figure. Both halves of that
        sentence are unusual in Kenya, and together they describe a letting
        business that works nothing like the Westlands and Riverside towers
        most Nairobi advice is written about.
      </Lede>

      <Callout title="Where these numbers come from">
        Published agent and platform listings for Unity East at Tatu City,
        Ruiru, read in October 2026, together with our own letting data. Rates
        are asking rates. We have not quoted a sale price or a yield for this
        development because the listings we read were lettings rather than
        sales, and we would rather leave a gap than estimate one. We manage at
        Tatu City; we sold nothing in this development.
      </Callout>

      <KeySummary
        question="What does an apartment at Unity East rent for?"
        answer="Published listings put a two bedroom with master en suite at KES 52,500 to 62,500 a month, with the most commonly advertised figures at KES 55,000 and KES 58,500, and in most cases the service charge is included in that rent. A furnished two bedroom is separately advertised at USD 600 a month, about KES 78,000, on a twelve month lease with utilities extra. That furnished premium of roughly 35 percent over the unfurnished rate is a normal Kenyan premium, and notably narrower than the near doubling seen in the Riverside and Westlands buildings where employers pay the rent."
        facts={[
          { label: "Location", value: "Unity East, Tatu City, Ruiru" },
          { label: "2 bed unfurnished", value: "KES 52,500 to 62,500" },
          { label: "Most quoted", value: "KES 55,000 and KES 58,500" },
          { label: "Service charge", value: "Included in most listings" },
          { label: "2 bed furnished", value: "USD 600, 12 month lease" },
          { label: "Furnished premium", value: "About 35 percent" },
          { label: "Crawford International", value: "About 1km" },
          { label: "Nairobi CBD", value: "About 30 minutes" },
        ]}
      />

      <H2 id="what-it-is">What the development actually is</H2>

      <P>
        Unity East is a residential estate inside Tatu City, the master planned
        development off Kiambu Road in Ruiru. Two bedroom apartments with the
        master en suite, open plan living and dining, modern kitchens with
        granite worktops and a breakfast counter, fitted wardrobes, large
        laundry areas, and balconies with glass railings and floor to ceiling
        sliding doors looking over the parkland.
      </P>

      <P>
        The shared facilities lean family rather than executive: a swimming
        pool, a gym, a coffee shop, secure parking, CCTV, landscaped common
        areas, and a recreation area with badminton and volleyball courts, a
        basketball pitch, a sand play pen and a bonfire area.
      </P>

      <P>
        What sits behind that matters more. Tatu City supplies its own power,
        water, waste and road infrastructure, street lighting and security, and
        it is a genuinely walkable community with schools, parks, shops and
        businesses inside it. Crawford International School is about a
        kilometre away, Nova Pioneer is close, and Kenyatta University Teaching
        and Referral Hospital is nearby. Access runs to the Nairobi CBD via the
        Thika Superhighway and the Northern Bypass, and to JKIA about 20
        kilometres away via the Eastern Bypass.
      </P>

      <H3 id="what-it-rents-for">
        What does an apartment at Unity East rent for?
      </H3>

      <P>
        Published listings put a two bedroom with master en suite between KES
        52,500 and KES 62,500 a month, with KES 55,000 and KES 58,500 the
        figures that appear most often, and in most cases the service charge is
        inside that rent. A furnished two bedroom is advertised separately at
        USD 600 a month, about KES 78,000, on a twelve month lease with
        utilities extra.
      </P>

      <P>
        That is a narrow spread for four different agents, which tells you the
        rate here is well established rather than aspirational. It is also the
        clearest contrast in our portfolio: the same money would not cover a
        fortnight in the furnished Riverside stock we manage.
      </P>

      <P>
        The wider case for the area is in{" "}
        <Link
          href="/insights/ruiru-tatu-city-and-beyond"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Ruiru, Tatu City and beyond
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/tatu-city-northlands-konza-investing-kenya-smart-cities"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          investing in Kenya&rsquo;s smart cities
        </Link>
        .
      </P>

      <H2 id="the-levy">The levy is inside the rent, and you should say so</H2>

      <H3 id="is-the-service-charge-included">
        Is the service charge included in the rent at Unity East?
      </H3>

      <P>
        Most of the published listings here quote a two bedroom at KES 55,000 or
        KES 58,500 inclusive of service charge. In Nairobi that is rare. The
        standard practice is to advertise the rent and then add a levy of KES
        8,000 to 15,000 a month, which the tenant discovers somewhere between
        the viewing and the lease.
      </P>

      <Pullquote>
        A single number a tenant can budget against beats a lower number with a
        second number attached to it, even when the second arrangement is
        cheaper.
      </Pullquote>

      <P>
        This is worth real money to an owner in two ways. On a search page, a
        tenant scrolling listings compares headline figures, and an inclusive
        KES 58,500 reads as better value than KES 50,000 plus a levy they
        cannot see. And across the tenancy itself, the single most common
        argument in the first quarter of a Kenyan lease is what the service
        charge covers and who is responsible for an increase in it. Including
        it removes that argument entirely.
      </P>

      <P>
        Two cautions. Confirm that inclusion actually applies to your unit and
        your lease rather than assuming it from a neighbour&rsquo;s listing,
        because it varies scheme by scheme. And understand that if the levy is
        inside your rent then an increase in it comes out of your return rather
        than your tenant&rsquo;s pocket, so read the budget and the collection
        rate with more attention than an owner elsewhere would. What a levy
        should cover is in{" "}
        <Link
          href="/insights/service-charge-nairobi-apartments-explained"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          service charge explained
        </Link>
        .
      </P>

      <H2 id="furnished-premium">
        The furnished premium here is normal, and that is the tell
      </H2>

      <P>
        A furnished two bedroom at Unity East is advertised at USD 600 a month,
        roughly KES 78,000, on a twelve month lease with utilities extra.
        Against an unfurnished KES 55,000 to 58,500 that is a premium of about
        35 percent, which is an ordinary Kenyan furnished premium.
      </P>

      <P>
        Hold that beside the buildings we manage in on Riverside Drive, where
        furnishing roughly doubles the rent, and the pattern becomes clear. The
        furnished premium in Nairobi is not really a function of the furniture.
        It tracks whether an employer is paying. Where the tenant is a
        diplomat, a UN officer or an executive on a posting with a housing
        allowance and a suitcase, furnishing transforms the rent. Where the
        tenant is a family paying out of a salary, furnishing adds a sensible
        third and no more, because they own a sofa already.
      </P>

      <P>
        Unity East is firmly the second case. Furnish it if you want to reach
        the smaller pool of people arriving without possessions, and expect a
        third more rent rather than double. Both sides of the decision are in{" "}
        <Link
          href="/insights/furnished-or-unfurnished-rental-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          furnished or unfurnished
        </Link>
        .
      </P>

      <H2 id="short-let">Why this is not a short let building</H2>

      <H3 id="can-i-run-a-short-let">
        Can I run a short let at Unity East, Tatu City?
      </H3>

      <P>
        Nightly demand in Nairobi is generated by business travel, embassies,
        hospitals, NGOs and tourism, and all of it clusters in Westlands,
        Kilimani, Riverside and the city centre. None of it is in Ruiru. Tatu
        City is about thirty minutes from the CBD on a good run, which is fine
        for a commute you make daily by choice and wrong for a guest booking
        three nights near a meeting.
      </P>

      <P>
        Look at what the development itself advertises. The furnished offer is
        a twelve month lease at USD 600 a month with a discount on the first
        month, not a nightly rate. Everything that makes Unity East attractive,
        the schools a short walk away, the parks, the estate infrastructure, the
        gated security, is valuable to a family over years. None of it is
        valuable to a guest over nights.
      </P>

      <Callout title="The honest version of the opportunity">
        A two bedroom at KES 55,000 inclusive, let to a family with children at
        Crawford or Nova Pioneer, who stay for the length of their
        children&rsquo;s schooling, is a quiet and genuinely good asset. It will
        never produce a headline number and it will also never produce an empty
        quarter. Owners get into trouble at Tatu City by reading Westlands
        advice and furnishing for a guest who is not coming.
      </Callout>

      <H2 id="what-to-do">What to do if yours is sitting empty</H2>

      <OL>
        <LI>
          <strong>Advertise to the schools.</strong> Crawford International is
          about a kilometre away and Nova Pioneer is close. A family choosing
          that school is choosing housing at the same time, and almost nobody
          markets to them directly
        </LI>
        <LI>
          <strong>Lead with the inclusive rent.</strong> Say &ldquo;KES 58,500
          including service charge&rdquo; rather than KES 58,500, because the
          inclusion is the advantage and a reader cannot see it otherwise
        </LI>
        <LI>
          <strong>Photograph the park view.</strong> Floor to ceiling balcony
          doors onto parkland is what this estate has that a Ruiru apartment
          block does not, and the listings describe it instead of showing it
        </LI>
        <LI>
          <strong>Sell the infrastructure plainly.</strong> Reliable water,
          power, waste and street lighting is the actual product Tatu City
          sells, and to a tenant who has lived through a dry borehole it is
          worth more than a gym
        </LI>
        <LI>
          <strong>Do not furnish for nightly letting.</strong> Furnish for a
          twelve month tenant if you furnish at all
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
        Unity East is one of the better value family lets within reach of
        Nairobi, and the reason is unglamorous: at KES 55,000 to 58,500 with the
        service charge inside it, you get a two bedroom with the master en
        suite, a pool, a gym, parkland and an estate where the water and the
        power actually work. In most of Nairobi that money buys considerably
        less certainty.
      </P>

      <P>
        Check two things. Confirm in writing that the quoted rent really does
        include the service charge for your specific unit, since not every
        listing in the estate is on the same basis. And be honest with yourself
        about the commute, because thirty minutes to the CBD is a good run and
        not every run is a good one. If you want us to tell you what is
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
        We manage long lets at Tatu City, including at Unity East, and we sold
        nothing here, so there is no projection of ours to defend. We charge 10
        percent of rent collected on a long let and 20 percent of revenue on a
        short stay, with no setup fee and no exit fee. At Unity East we will
        almost always recommend the long let, which is the cheaper of our two
        services, because the nightly demand that would justify the other one
        is thirty minutes away in Westlands.
      </P>

      <P>
        If your apartment is empty,{" "}
        <Link
          href="/list-your-property"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          send it to us
        </Link>{" "}
        with the block and the layout and we will come back with an achievable
        rate and a straight view on the route. What{" "}
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
          href="/insights/ruiru-tatu-city-and-beyond"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Ruiru, Tatu City and beyond
        </Link>
        ,{" "}
        <Link
          href="/insights/best-neighbourhoods-nairobi-rental-yield-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the best neighbourhoods for rental yield
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
    </>
  );
}

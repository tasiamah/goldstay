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
  slug: "108-riverside-nairobi-owners-guide",
  title:
    "108 Riverside: what the UN Blue Zone is actually worth to an owner",
  metaTitle: "108 Riverside Nairobi: an owner's guide to letting",
  description:
    "A 154 square metre three bedroom here lets unfurnished at KES 160,000 and furnished at KES 250,000 to 330,000. The gap is not about furniture. It is about which tenants are permitted to live in this part of Riverside at all.",
  metaDescription:
    "108 Riverside lets at KES 160,000 unfurnished and KES 250,000 to 330,000 furnished. What the UN Blue Zone means for an owner.",
  publishedAt: "2026-10-28",
  readingMinutes: 11,
  author: authors.editors,
  tags: [
    "108 Riverside",
    "Riverside",
    "Short Let",
    "Nairobi",
    "Property Management",
    "Kenya",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "108 Riverside Nairobi owners guide to letting a furnished apartment in the UN Blue Zone",
  faq: [
    {
      q: "What does an apartment at 108 Riverside rent for?",
      a: "Unfurnished, a three bedroom of about 154 square metres is quoted at KES 160,000 a month. Furnished, the building's own rate card lists a one bedroom at KES 200,000 a month or KES 10,000 a night, a two bedroom at KES 270,000 a month or KES 13,000 a night, and a three bedroom with two en suite at KES 300,000 a month or KES 17,000 a night, all exclusive of electricity. Individual furnished three bedrooms are separately advertised at KES 250,000, KES 270,000, KES 280,000 and KES 330,000 depending on floor, furnishing standard and what the rent includes, with one at KES 250,000 including the service charge and weekly cleaning.",
    },
    {
      q: "What is the UN Blue Zone and does it matter to an owner?",
      a: "The Blue Zone is the area of Nairobi within which United Nations staff security rules permit personnel to live, and 108 Riverside sits inside it. It matters a great deal, because it determines who may rent from you rather than who merely wants to. A building inside the zone has access to UN, diplomatic and agency staff whose housing is paid by an employer, who stay for the length of a posting rather than a year, and who need a furnished apartment from the first night. Listings for this building are categorised as UN approved furnished apartments, which is a tenant pool an identical building a kilometre outside the boundary simply cannot reach.",
    },
    {
      q: "Does furnishing change the yield at 108 Riverside?",
      a: "Substantially, and here the arithmetic is credible rather than promotional because the sale prices and the unfurnished rents actually reconcile. A three bedroom marketed at KES 22 million to 24 million against an unfurnished rent of KES 160,000 a month is a gross yield of about 8.3 percent, which is what good Nairobi stock genuinely produces. Furnished at KES 280,000 a month, the same apartment grosses about KES 3.36 million a year, or roughly 14.6 percent against the same purchase price. Furnishing a 154 square metre apartment to the standard this building's tenants expect is not cheap, but it is recovered in well under two years at that spread.",
    },
  ],
};

export default function Article() {
  return (
    <>
      <Lede>
        A three bedroom at 108 Riverside runs to 154 square metres and lets
        unfurnished at KES 160,000 a month. Furnished, the same apartment is
        advertised between KES 250,000 and KES 330,000. The usual explanation
        is the furniture. The real explanation is a line on a security map.
      </Lede>

      <Callout title="Where these numbers come from">
        Published agent listings for 108 Riverside on Riverside Lane West, read
        in October 2026, together with our own letting and short stay data for
        Riverside. Rates are asking rates, and the furnished three bedroom is
        advertised at four different figures by four different agents, which we
        have shown as a range rather than averaging into a single number. We
        manage on Riverside Drive, including in this building; we sold nothing
        in it.
      </Callout>

      <KeySummary
        question="What does an apartment at 108 Riverside rent for?"
        answer="Unfurnished, a three bedroom of about 154 square metres is quoted at KES 160,000 a month. Furnished, the building's own rate card lists a one bedroom at KES 200,000 a month or KES 10,000 a night, a two bedroom at KES 270,000 a month or KES 13,000 a night, and a three bedroom with two en suite at KES 300,000 a month or KES 17,000 a night, all exclusive of electricity. Individual furnished three bedrooms are separately advertised at KES 250,000, KES 270,000, KES 280,000 and KES 330,000 depending on floor, furnishing standard and what the rent includes, with one at KES 250,000 including the service charge and weekly cleaning."
        facts={[
          { label: "Location", value: "Riverside Lane West, Riverside" },
          { label: "Scale", value: "60 apartments, 12 floors, 0.75 acre" },
          { label: "2 bed", value: "106 sq m, sale KES 18M" },
          { label: "3 bed", value: "154 sq m, sale KES 22M to 24M" },
          { label: "3 bed unfurnished", value: "KES 160,000 a month" },
          { label: "3 bed furnished", value: "KES 250,000 to 330,000" },
          { label: "3 bed nightly", value: "KES 17,000" },
          { label: "Zone", value: "Inside the UN Blue Zone" },
        ]}
      />

      <H2 id="what-it-is">What the building actually is</H2>

      <P>
        Sixty apartments over twelve floors on three quarters of an acre on
        Riverside Lane West, complete and occupied. Two bedrooms with master en
        suite at 106 square metres and three bedrooms at 154, some with a
        detached staff quarter. Inbuilt wardrobes throughout, open plan
        kitchens with high cabinets, separate utility areas, balconies, and
        green outlooks over mature trees or the central garden.
      </P>

      <P>
        Shared facilities are a swimming pool, a fully equipped gym, a
        children&rsquo;s play area, a central garden, ample parking, high speed
        lifts, CCTV and intercom with security around the clock, a borehole and
        a backup generator.
      </P>

      <P>
        Sixty units across twelve floors is a deliberately low density for a
        Nairobi tower, and it is part of what this building sells. Where a 270
        unit development puts forty identical apartments on the letting market
        in the same quarter, a sixty unit building almost never has more than a
        handful available at once. That scarcity is worth real money to an
        owner and it is rarely mentioned in the marketing.
      </P>

      <H3 id="what-it-rents-for">
        What does an apartment at 108 Riverside rent for?
      </H3>

      <P>
        Unfurnished, the three bedroom at 154 square metres is quoted at KES
        160,000 a month. Furnished, the building&rsquo;s rate card runs a one
        bedroom at KES 200,000 a month or KES 10,000 a night, a two bedroom at
        KES 270,000 or KES 13,000 a night, and a three bedroom with two en
        suite at KES 300,000 or KES 17,000 a night, all excluding electricity.
      </P>

      <P>
        Individual agents advertise furnished three bedrooms at KES 250,000,
        270,000, 280,000 and 330,000. That spread is not noise. The KES 250,000
        listing includes the service charge and weekly cleaning and is marked
        negotiable; the KES 330,000 one is a high specification unit with
        designer furnishings, two parking spaces and a detached servant
        quarter. What the rent includes matters as much as the number, and an
        owner quoting KES 280,000 without saying what it covers is losing to a
        clearer listing at the same money.
      </P>

      <H2 id="blue-zone">The Blue Zone is the asset</H2>

      <H3 id="what-is-the-blue-zone">
        What is the UN Blue Zone and does it matter to an owner?
      </H3>

      <P>
        The Blue Zone is the area within which United Nations staff security
        rules permit personnel to live. 108 Riverside is inside it, and
        listings for the building are categorised explicitly as UN approved
        furnished apartments.
      </P>

      <Pullquote>
        Most buildings compete for tenants who want to live there. This one
        competes for tenants who are permitted to.
      </Pullquote>

      <P>
        That inverts the usual letting problem. An identical building a
        kilometre the wrong side of the boundary can match the pool, the
        generator, the finishes and the rent, and still cannot reach this
        tenant at all. What you have access to instead is:
      </P>

      <UL>
        <LI>
          <strong>Employer paid housing.</strong> The rent is settled against
          an allowance rather than a salary, which is why KES 280,000 a month
          is an unremarkable figure here and an impossible one elsewhere
        </LI>
        <LI>
          <strong>Posting length tenancies.</strong> A two or three year
          assignment, not a twelve month lease with a nervous renewal
        </LI>
        <LI>
          <strong>Furnished from day one.</strong> Someone arriving on a
          posting is not buying a fridge, so an unfurnished unit is invisible
          to them
        </LI>
        <LI>
          <strong>Reliable payment.</strong> Institutional tenants with a
          compliance department behind them are the best covenant available in
          the Nairobi market
        </LI>
        <LI>
          <strong>A shortlist you can get onto.</strong> Agencies, missions and
          relocation firms keep lists of approved furnished stock, and getting
          your unit onto them is worth more than any portal listing
        </LI>
      </UL>

      <P>
        The surrounding geography reinforces it: embassies and missions all
        around, Riverside Square within walking distance, Westlands close, and
        the hospitals and international schools that a relocating family needs.
        The corridor is described in full in{" "}
        <Link
          href="/insights/riverside-drive-nairobi-old-money-corridor"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Riverside Drive, the old money corridor
        </Link>
        .
      </P>

      <Callout title="Confirm your own unit's status before you market it">
        Being in the right postcode and being on an agency&rsquo;s approved
        list are different things, and the second usually requires specific
        checks on security, access control and backup power. Before you
        advertise a unit as UN approved, establish in writing what your
        building actually holds and what the current requirements are, because
        the claim is checkable and getting it wrong costs you the relationship.
      </Callout>

      <H2 id="the-yield">The furnishing decision, with honest arithmetic</H2>

      <H3 id="does-furnishing-change-the-yield">
        Does furnishing change the yield at 108 Riverside?
      </H3>

      <P>
        Start with the unfurnished case, which is the useful one because here
        the sale prices and rents reconcile. A three bedroom marketed at KES 22
        million to 24 million, let unfurnished at KES 160,000 a month, grosses
        KES 1.92 million a year. Against KES 23 million that is a gross yield of
        about 8.3 percent, which is a believable Nairobi number rather than a
        brochure one. When a different building claims 15 percent, this is what
        to hold it against.
      </P>

      <P>
        Now furnish it. At KES 280,000 a month the same apartment grosses about
        KES 3.36 million a year, roughly 14.6 percent against the same purchase
        price. The furnishing itself is not trivial, since 154 square metres to
        the standard these tenants expect is a serious outlay, but at an extra
        KES 120,000 a month it is recovered in well under two years and
        everything after that is margin. What that outlay actually comes to is
        in{" "}
        <Link
          href="/insights/cost-furnish-nairobi-apartment-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the cost to furnish a Nairobi apartment
        </Link>
        .
      </P>

      <P>
        The nightly question is closer here than in most of Riverside. A three
        bedroom at KES 17,000 a night against KES 300,000 a month breaks even
        at about eighteen nights, or 59 percent occupancy, before costs. But
        platform commission, a full turnover after every departure and short
        stay management at double the long let fee push the real crossover well
        above that, and Riverside is a high rate, thin traffic market that
        punishes an owner who cannot absorb an empty fortnight. For a UN or
        diplomatic tenant on a two year posting at KES 280,000, the monthly
        route is almost always the better business. The full comparison is in{" "}
        <Link
          href="/insights/airbnb-riverside-nairobi-premium-short-let"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Riverside as a premium short let market
        </Link>
        .
      </P>

      <H2 id="what-to-do">What to do if yours is sitting empty</H2>

      <OL>
        <LI>
          <strong>Get onto the agency and mission lists.</strong> This is the
          highest value thing an owner here can do and almost nobody does it,
          because it takes a week of phone calls rather than a portal upload
        </LI>
        <LI>
          <strong>Furnish it.</strong> Unfurnished, you are letting a good
          apartment into the ordinary Riverside market at KES 160,000 and
          ignoring the only advantage this address has
        </LI>
        <LI>
          <strong>State the inclusions.</strong> Service charge, cleaning,
          internet, generator cover, parking spaces. Four agents advertise this
          building at four prices and the differences are mostly inclusions
        </LI>
        <LI>
          <strong>Lead with the green outlook and the low density.</strong>{" "}
          Sixty units on three quarters of an acre with mature trees is the
          thing a relocating family responds to, and the listings bury it
        </LI>
        <LI>
          <strong>Price for a long tenancy, not a maximum one.</strong> A
          posting length tenant at KES 270,000 is worth more than a twelve
          month tenant at KES 300,000 and considerably more than two empty
          months at KES 330,000
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
        108 Riverside is one of the better furnished options in the Blue Zone,
        and the low density is the reason rather than the amenity list. Sixty
        apartments over twelve floors with a central garden is a quieter place
        to live than a tower of several hundred, and the mature trees around
        Riverside Lane West are not a marketing flourish.
      </P>

      <P>
        Two things to settle before signing. Ask exactly what the rent includes,
        because furnished units in this building are advertised anywhere from
        KES 250,000 to KES 330,000 and some include the service charge and
        weekly cleaning while others exclude both along with electricity. And
        ask for the floor and the aspect, since a balcony over the garden and a
        balcony over the car park are let at similar money. If you want us to
        tell you what is genuinely available,{" "}
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
        We manage long lets and short stays on Riverside Drive, including in
        this building, and we sold nothing here, so there is no sales
        projection of ours to defend. We charge 10 percent of rent collected on
        a long let and 20 percent of revenue on a short stay, with no setup fee
        and no exit fee. At 108 Riverside the advice is usually to furnish and
        let monthly to an institutional tenant, which earns us the smaller of
        our two fees, and we would rather tell you that than furnish a flat for
        a nightly market this address does not need.
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
          href="/insights/winchester-gardens-riverside-owners-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Winchester Gardens, further along Riverside Drive
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
          href="/insights/furnished-or-unfurnished-rental-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          furnished or unfurnished
        </Link>
        .
      </P>
    </>
  );
}

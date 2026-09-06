import Link from "next/link";
import { authors, type PostMeta } from "./_shared";
import {
  Callout,
  H2,
  LI,
  Lede,
  P,
  Pullquote,
  UL,
} from "@/components/ArticleProse";

export const meta: PostMeta = {
  slug: "aura-riverside-review-2026",
  title: "Aura Riverside: an honest look at the numbers behind the duplexes",
  description:
    "Aura Riverside by Canaan Developers is a 20 storey Riverside tower of one and two bedroom duplexes from around USD 95,000, marketed on yields of 9 to 13 percent. We test that yield claim against what Riverside rents actually are.",
  publishedAt: "2026-08-05",
  readingMinutes: 9,
  author: authors.research,
  tags: [
    "Aura Riverside",
    "Riverside",
    "Off-Plan",
    "Nairobi",
    "Yield",
    "Buyer Guide",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt: "Aura Riverside Nairobi honest buyer review 2026",
};

export default function Article() {
  return (
    <>
      <Lede>
        Aura Riverside is one of the more architecturally interesting things
        being built in Nairobi: a 20 storey tower of split level duplexes on
        Riverside Lane, with double height living rooms and a rooftop that
        includes an infinity pool and a cinema. The product is genuinely
        differentiated. The yield claim attached to it deserves a much closer
        look.
      </Lede>

      <Callout title="Where these numbers come from">
        Figures below are taken from the developer's own published materials and
        agent listings as at mid 2026. We have not inspected the building or
        audited the projections. Verify everything in writing before paying
        anything.
      </Callout>

      <H2 id="what-it-is">What is being sold</H2>

      <UL>
        <LI>
          <strong>Developer:</strong> Canaan Developers, who are also building
          Aura Peponi on the same duplex format
        </LI>
        <LI>
          <strong>Location:</strong> Riverside Lane, minutes from Westlands and
          close to the embassy cluster
        </LI>
        <LI>
          <strong>Format:</strong> 20 storeys of one and two bedroom split level
          duplexes, with double height ceilings and full height glazing
        </LI>
        <LI>
          <strong>Pricing:</strong> from around USD 95,000 for the entry
          duplex, with a two bedroom duplex of about 121 square metres listed
          around USD 200,000
        </LI>
        <LI>
          <strong>Amenities:</strong> rooftop infinity pool, gym, mini cinema,
          residents' sky lounge
        </LI>
        <LI>
          <strong>Status:</strong> structure reported complete with finishing
          works under way through 2025 and into 2026
        </LI>
      </UL>

      <H2 id="differentiation">The product genuinely is different</H2>

      <P>
        Nairobi has a great deal of tower stock and most of it is the same flat
        plate apartment repeated 20 times. A split level duplex with a double
        height living room is a different thing to live in, and there is very
        little of it in this part of the city.
      </P>

      <P>
        That matters commercially, not just aesthetically. Scarcity of format is
        a real defence against the oversupply problem that is compressing rents
        in the ordinary tower segment. A tenant who wants this cannot easily get
        it somewhere cheaper, which is the opposite of the position a standard
        one bed in Kilimani is in.
      </P>

      <P>
        The trade off is that double height volume is expensive to buy per
        usable square metre. You are paying for air. That is a perfectly
        reasonable thing to pay for if you are living there. It is a harder
        thing to justify if you are buying it to let, because a tenant pays for
        rooms.
      </P>

      <H2 id="yield">Testing the 9 to 13 percent yield claim</H2>

      <P>
        The marketing quotes yields averaging 9 to 13 percent and capital
        appreciation above 5 percent a year. Work backwards from the price and
        you can see what that requires.
      </P>

      <P>
        Take the entry duplex at roughly USD 95,000. In shillings that is around
        KES 12m to 12.5m depending on the rate you use. A 9 percent gross yield
        on that needs about KES 92,000 a month. Thirteen percent needs about KES
        135,000 a month, every month, all year.
      </P>

      <P>
        Now ask what a one bedroom actually lets for in Riverside. As an
        unfurnished long let to a professional tenant, a one bed in this
        corridor does not reach those numbers. You get there only on a
        furnished, serviced or short let basis, at high occupancy, before costs.
      </P>

      <Callout title="Gross is not net">
        A short let grossing KES 120,000 a month is not the same as a long let
        grossing KES 120,000 a month. Out of the short let figure comes
        cleaning, laundry, consumables, a higher utility bill, platform
        commission, replacement of soft goods, management, and the void nights.
        The honest comparison is net to net, and on that basis a 9 to 13 percent
        claim built on short let gross is not a yield, it is a turnover figure.
      </Callout>

      <P>
        None of which means the investment is bad. It means the yield range in
        the brochure is a short let gross number wearing the clothes of a rental
        yield. Model it yourself with the full cost stack from{" "}
        <Link
          href="/insights/how-much-can-you-earn-airbnb-nairobi-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how much you can actually earn from a Nairobi Airbnb
        </Link>{" "}
        and see what is left.
      </P>

      <Pullquote>
        Every Nairobi developer quoting double digit yields is quoting gross,
        usually on a short let basis, at an occupancy nobody guarantees. Ask
        which of those three assumptions they will put in writing.
      </Pullquote>

      <H2 id="tenant">Who actually rents this</H2>

      <P>
        The location is strong for exactly the tenant the format suits.
        Riverside sits next to the diplomatic and NGO cluster, and it draws
        expatriates, senior professionals and relocating executives. Those
        tenants pay well, stay longer, and care about the things this building
        is selling.
      </P>

      <UL>
        <LI>
          Strong fit: expatriate and diplomatic single tenants and couples,
          senior professionals, corporate relocations, and premium short lets
          where the unit itself is the draw
        </LI>
        <LI>
          Weak fit: families, who need bedrooms rather than volume, and price
          sensitive local tenants who will not pay a premium for a mezzanine
        </LI>
        <LI>
          Worth knowing: a two storey unit with a statement staircase is a
          harder sell to older tenants and to anyone with small children
        </LI>
      </UL>

      <P>
        Background on that tenant pool is in{" "}
        <Link
          href="/insights/diplomatic-tenant-market-gigiri-rosslyn-runda-un-embassy-rent"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the diplomatic tenant market
        </Link>
        .
      </P>

      <H2 id="diligence">What to check</H2>

      <UL>
        <LI>
          The developer's delivered record. Canaan's Aura format is recent, so
          ask specifically what they have completed and handed over, and go and
          look at it
        </LI>
        <LI>
          Service charge projection for a 20 storey tower with a pool, a gym and
          a cinema on the roof. Amenity heavy towers carry amenity heavy service
          charges, and this is the line that most often turns a good yield into
          a mediocre one
        </LI>
        <LI>
          Lift count and capacity against unit count. On 20 floors this is not a
          detail, it is the difference between a premium building and a
          frustrating one
        </LI>
        <LI>
          Water and full power backup specification, in writing
        </LI>
        <LI>
          Whether short lets are permitted, if that is your model. A building
          selling itself on rental yield should have a clear answer
        </LI>
        <LI>
          Cooling. Full height glazing on a west facing elevation gets hot, and
          whether that is your problem or the building's is worth knowing before
          you buy
        </LI>
        <LI>
          Currency. Pricing in dollars while your rent arrives in shillings is a
          real exposure. See{" "}
          <Link
            href="/insights/kenya-shilling-outlook-2026-property-investors"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            the shilling outlook
          </Link>
        </LI>
      </UL>

      <H2 id="verdict">The honest read</H2>

      <P>
        A differentiated product in a genuinely good location, aimed at a tenant
        pool that pays well, from a developer whose delivered record you should
        check rather than assume. As a home for someone who wants that format,
        it is one of the more interesting things available in Nairobi.
      </P>

      <P>
        As an investment, treat the quoted yield range as marketing and rebuild
        it yourself: realistic long let rent for a one bedroom in Riverside,
        then the short let case separately with every cost in it. If it still
        works at conservative occupancy, it is a good buy. If it only works at
        the brochure's numbers, you are buying the brochure.
      </P>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        We rebuild developer yield projections from actual achieved rents in the
        same corridor, and we tell sourcing clients when the gap is large. Often
        it is.
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/buying-off-plan-nairobi-risks-red-flags"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          buying off plan in Nairobi
        </Link>
        ,{" "}
        <Link
          href="/insights/best-nairobi-off-plans-2026-ranked"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the best Nairobi off plans ranked
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/riverside-drive-nairobi-old-money-corridor"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the Riverside Drive corridor
        </Link>
        .
      </P>
    </>
  );
}

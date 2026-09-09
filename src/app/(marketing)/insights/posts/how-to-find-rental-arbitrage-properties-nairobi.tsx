import Link from "next/link";
import { authors, type PostMeta } from "./_shared";
import {
  Callout,
  H2,
  LI,
  Lede,
  OL,
  P,
  Pullquote,
  UL,
} from "@/components/ArticleProse";

export const meta: PostMeta = {
  slug: "how-to-find-rental-arbitrage-properties-nairobi",
  title:
    "How to find units that work for rental arbitrage in Nairobi",
  description:
    "Finding an apartment is easy and finding one whose owner will consent is not. Where Nairobi units are actually listed, why an owner-listed unit is worth ten agent-listed ones, and the filters that rule most buildings out before you view.",
  metaTitle: "How to Find Rental Arbitrage Properties in Nairobi",
  metaDescription:
    "Where to find rent to rent deals in Nairobi, why owner-listed units matter more than the rent, and the filters that rule buildings out.",
  publishedAt: "2026-09-09",
  readingMinutes: 10,
  author: authors.poonam,
  tags: [
    "Airbnb Arbitrage",
    "Operator",
    "Nairobi",
    "Short Let",
    "Sourcing",
    "Kenya",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt: "Viewing a Nairobi apartment for a rental arbitrage deal",
};

export default function Article() {
  return (
    <>
      <Lede>
        Operators usually describe this as a search for a property. It is
        really a search for a landlord. Nairobi has no shortage of apartments
        available to let in the areas where short lets work, and almost none of
        those listings will end in a deal, because the person on the other end
        of the phone has neither the authority nor the interest to let you
        re-let the unit. Sorting for that, early, is the whole skill.
      </Lede>

      <H2 id="where-units-are-listed">Where Nairobi units are actually listed</H2>

      <P>
        In rough order of how useful they are to an operator rather than to a
        tenant.
      </P>

      <UL>
        <LI>
          <strong>BuyRentKenya and Property24.</strong> The largest inventory
          and the most agent-heavy. Useful for building a map of what rents
          where, less useful for finding a decision maker.
        </LI>
        <LI>
          <strong>Jiji and Facebook letting groups.</strong> Messier, and a much
          higher proportion of actual owners posting for themselves. This is
          where the workable deals disproportionately are.
        </LI>
        <LI>
          <strong>Caretakers and watchmen in buildings you already like.</strong>{" "}
          The most underrated source in Nairobi by a distance. They know which
          units are about to fall vacant before any listing appears, they know
          which owners live abroad, and they know which buildings already have
          short lets running.
        </LI>
        <LI>
          <strong>Building management committees.</strong> Worth approaching
          directly in blocks where short letting is already tolerated, because
          the hardest constraint is usually the building rather than the owner.
        </LI>
        <LI>
          <strong>Your own network.</strong> Diaspora owners with a unit sitting
          empty are the single best counterparty available, and they are almost
          never on a portal.
        </LI>
      </UL>

      <H2 id="owner-vs-agent">
        Why one owner-listed unit beats ten agent-listed ones
      </H2>

      <P>
        This is the filter that matters most and it is the one beginners ignore
        while chasing rent figures.
      </P>

      <P>
        An agent is paid a commission for placing a tenant on a standard lease.
        Asking their principal for permission to sublet creates work, delay and
        the risk of losing the instruction altogether, so most simply say no,
        and many say no without ever putting the question to the owner. You
        will never know which happened. An owner, by contrast, can weigh a
        genuinely better offer and decide on the spot.
      </P>

      <P>
        Signals that you are talking to an owner rather than an agent: one
        listing rather than forty from the same phone number, a description
        written in the first person about &ldquo;my apartment&rdquo;, a
        willingness to discuss lease terms rather than reciting them, and a
        phone number that does not appear against half the units in the
        neighbourhood.
      </P>

      <Pullquote>
        You are not looking for the cheapest rent. You are looking for the
        owner who is empowered to say yes, and who has a reason to.
      </Pullquote>

      <H2 id="the-pain-signal">Look for the unit that has a problem</H2>

      <P>
        An owner whose unit let instantly has no reason to entertain an unusual
        proposal. An owner whose unit has sat empty for three months has a very
        good one. Vacancy is your negotiating position, and it is visible if
        you look for it.
      </P>

      <OL>
        <LI>
          <strong>Days on market.</strong> A listing that has been up for weeks,
          or has been relisted, is an owner losing money every month.
        </LI>
        <LI>
          <strong>Price reductions.</strong> A rent that has come down once will
          come down again, or will move on terms instead.
        </LI>
        <LI>
          <strong>Awkward units.</strong> Ground floor, no lift in a mid-rise,
          an odd layout, a studio in a building of three-beds. Harder to let to
          a tenant, frequently fine for a guest who is staying nine nights.
        </LI>
        <LI>
          <strong>Furnished units struggling to let.</strong> The furniture is
          already there, which removes the largest single line of your startup
          cost. Why the unit keeps going vacant is worth reading about in{" "}
          <Link
            href="/insights/why-your-nairobi-rental-keeps-going-vacant"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            our piece on persistent vacancy
          </Link>
          .
        </LI>
      </OL>

      <H2 id="filters">The filters that rule a unit out before you view</H2>

      <P>
        Most of these cannot be fixed with money, which is why they are worth
        checking on the phone rather than after a viewing.
      </P>

      <UL>
        <LI>
          <strong>Does the building permit short lets?</strong> Ask before
          anything else. Many Nairobi blocks have a committee resolution
          against them, and a resolution beats your lease. This is the single
          most common reason an operation closes after launch.
        </LI>
        <LI>
          <strong>Water.</strong> Borehole or tank capacity, and how often the
          supply actually fails. Guests forgive a great deal and do not forgive
          no water.
        </LI>
        <LI>
          <strong>Power and backup.</strong> Whether the block has a generator
          or inverter, and whether it covers your unit or only the common areas.
        </LI>
        <LI>
          <strong>Service charge.</strong> Who pays it, how much it is, and
          whether it rises. It is a real cost against your margin and it is
          frequently omitted from beginner spreadsheets.
        </LI>
        <LI>
          <strong>Access and parking.</strong> Whether guests can be admitted at
          night without an argument at the gate, and whether they get a parking
          space.
        </LI>
        <LI>
          <strong>Internet.</strong> Which providers actually serve the
          building. This is not negotiable for the corporate and remote-working
          guest who pays the best rates.
        </LI>
      </UL>

      <Callout title="Ask about consent on the first call, not the third">
        Every hour spent viewing, measuring and modelling a unit you are not
        permitted to re-let is wasted, and operators routinely spend weeks that
        way because raising consent feels like it will kill the conversation.
        It will kill some conversations, which is the point: it kills them in
        minute two rather than in month two. How to raise it in a way that gets
        a yes is in{" "}
        <Link
          href="/insights/ask-landlord-permission-short-let-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how to convince a landlord to allow Airbnb
        </Link>
        .
      </Callout>

      <H2 id="where-to-look">Which Nairobi areas to look in</H2>

      <P>
        Short-let demand in Nairobi is concentrated rather than spread. The
        areas that work are the ones with a reason for someone to stay a week:
        proximity to offices, embassies, hospitals or the international schools.
        Westlands, Kilimani, Riverside, Kileleshwa and Gigiri carry most of the
        demand, for different reasons and at different rates.
      </P>

      <P>
        The trap is taking a cheap unit in an area with no short-let demand
        because the arbitrage spread looks wide on paper. A low rent against
        low occupancy is a worse business than a high rent against high
        occupancy, and the spread means nothing without the nights. Yield by
        area is covered in{" "}
        <Link
          href="/insights/highest-yielding-nairobi-short-let-suburbs-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the highest yielding Nairobi short-let suburbs
        </Link>
        , and realistic occupancy in{" "}
        <Link
          href="/insights/airbnb-nairobi-occupancy-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          our occupancy piece
        </Link>
        .
      </P>

      <H2 id="walk-away">What to walk away from</H2>

      <UL>
        <LI>
          A landlord who says yes verbally and will not put consent in writing.
          Verbal consent is worth nothing when the building complains.
        </LI>
        <LI>
          A lease shorter than about two years. You will not recover furnishing
          costs and you will be renegotiating from a position of having already
          invested.
        </LI>
        <LI>
          Any unit where the numbers only work above roughly 70 percent
          occupancy. That is not a plan, it is a hope.
        </LI>
        <LI>
          A building that already has several struggling short lets in it. The
          demand is being shared and you would be the newest listing with no
          reviews.
        </LI>
      </UL>

      <H2 id="how-goldstay-helps">Where we come in</H2>

      <P>
        We manage units on behalf of rent-to-rent operators who would rather
        source and structure deals than answer guests at midnight. You hold the
        lease and the margin, we run the rota, under our{" "}
        <Link
          href="/airbnb-arbitrage-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          arbitrage management service
        </Link>
        . We also look at Nairobi short-let numbers every week, so a second
        opinion on a deal costs you nothing.
      </P>

      <Callout title="Found a unit? Send us the numbers before you sign">
        The building, the bedroom count, the asking rent and the service charge.
        We will tell you what we think it can realistically earn and whether we
        would touch it. We say no frequently, which is the useful part.{" "}
        <Link
          href="/list-your-property"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Send it over
        </Link>
        .
      </Callout>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/airbnb-without-owning-property-kenya"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          running an Airbnb business without owning property
        </Link>
        ,{" "}
        <Link
          href="/insights/airbnb-arbitrage-nairobi-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          rental arbitrage in Nairobi and the honest numbers
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/airbnb-building-permission-nairobi-committee"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          getting past the building committee
        </Link>
        .
      </P>
    </>
  );
}

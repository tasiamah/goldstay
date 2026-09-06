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
  slug: "airbnb-host-kenya-first-90-days",
  title: "Becoming an Airbnb host in Kenya: the first 90 days",
  description:
    "A week by week plan for new Airbnb hosts in Kenya, from permits and furnishing to the first five reviews. What to do in what order, and the early decisions that are expensive to reverse.",
  publishedAt: "2026-07-28",
  readingMinutes: 9,
  author: authors.editors,
  tags: ["Airbnb", "Kenya", "Hosting", "Short Let", "Nairobi", "Getting Started"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt: "Airbnb host Kenya first 90 days plan",
};

export default function Article() {
  return (
    <>
      <Lede>
        The order you do things in matters more than most new hosts expect.
        Getting the listing live before the photographs are right, or taking the
        first booking before the water pressure is fixed, sets a trajectory that
        takes six months to recover from. This is the sequence we use, and the
        reasoning behind it.
      </Lede>

      <H2 id="before">Before you spend anything</H2>

      <P>
        Two questions, and if either answer is no then the honest move is to let
        the unit long term instead.
      </P>

      <OL>
        <LI>
          <strong>Does the building allow it?</strong> Check the sectional
          properties rules and the compound bylaws, and speak to the management
          committee. A hostile committee will win eventually, and you will have
          furnished a unit you cannot operate
        </LI>
        <LI>
          <strong>Do you have the right to do it?</strong> If you are not the
          owner, you need written permission to sublet on a short stay basis.
          Verbal permission from a landlord who later changes their mind is
          worth nothing
        </LI>
      </OL>

      <Callout title="The unglamorous filter">
        Reliable water and full power backup are not features, they are
        preconditions. If the building cannot deliver both, no amount of styling
        will save the reviews. Walk away from the short let plan rather than
        hoping guests will be understanding.
      </Callout>

      <H2 id="weeks-1-2">Weeks 1 and 2: paperwork and plumbing</H2>

      <P>
        Boring, and the two things that cause the most expensive problems later
        if skipped.
      </P>

      <UL>
        <LI>
          Register the activity and get the county single business permit. Short
          stay accommodation is a commercial use
        </LI>
        <LI>
          Sort the tax position before revenue starts. Short stay income is
          normally business income rather than residential rental income, and
          the filing is different
        </LI>
        <LI>
          Test the water at 6am and 9pm, not at 11am when the tank is full
        </LI>
        <LI>
          Test the power backup by actually cutting the power. Find out now
          whether the lights, the router, the water pump and the fridge stay on
        </LI>
        <LI>
          Test the internet with a video call, at the far corner of the unit
        </LI>
      </UL>

      <P>
        The current licensing position is covered in{" "}
        <Link
          href="/insights/nairobi-short-stay-licensing-2026-what-changed"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Nairobi short stay licensing: what changed
        </Link>
        .
      </P>

      <H2 id="weeks-3-5">Weeks 3 to 5: furnish for guests, not for yourself</H2>

      <P>
        The brief is durability, neutrality and photographing well. Your own
        taste is the wrong guide, because you are not going to live there and
        because the things that look best in a phone photo are frequently the
        things that fail fastest.
      </P>

      <UL>
        <LI>
          Spend disproportionately on the mattress, the pillows and the linen.
          Sleep quality drives reviews more than anything visual
        </LI>
        <LI>
          Buy a full kitchen rather than a decorative one. A guest who cannot
          boil water or cook an egg writes about it
        </LI>
        <LI>
          Blackout curtains, not decorative ones. Nairobi mornings are bright
          and early
        </LI>
        <LI>
          Buy three sets of linen and towels per bed, not one. Turnover
          laundry does not respect your schedule
        </LI>
        <LI>
          Avoid white sofas, glass tables, anything with a fabric that stains,
          and anything you would be upset to lose
        </LI>
      </UL>

      <P>
        Budgets and line items are in{" "}
        <Link
          href="/insights/cost-furnish-nairobi-apartment-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the cost to furnish a Nairobi apartment
        </Link>
        .
      </P>

      <H2 id="week-6">Week 6: photographs, then the listing</H2>

      <P>
        In that order, and this is the single highest return spend in the whole
        project. The photo set is your entire shop window. A guest decides in
        about four seconds from the first image whether to keep scrolling.
      </P>

      <UL>
        <LI>
          Shoot after the unit is fully finished, styled and spotless, never
          before
        </LI>
        <LI>
          Shoot in daylight, with lights on, and get a wide shot of every room
        </LI>
        <LI>
          Photograph the things guests worry about: the shower, the kitchen, the
          bed, the workspace, the view, the parking
        </LI>
        <LI>
          Do not photograph what you do not have. Overpromising in images is the
          most reliable way to earn a four star review
        </LI>
      </UL>

      <Pullquote>
        Professional photography is the cheapest thing on the list and the only
        one that changes how many people ever see the rest of your work.
      </Pullquote>

      <H2 id="weeks-7-9">Weeks 7 to 9: the first five reviews</H2>

      <P>
        This is the phase that decides your first year. With no review history,
        the platform has nothing to rank you on and guests have nothing to trust.
        The goal is not revenue yet. It is five genuine five star reviews as fast
        as possible.
      </P>

      <UL>
        <LI>
          Price below your target rate deliberately for the first few bookings,
          and say why in the listing if you like
        </LI>
        <LI>
          Accept shorter, simpler bookings while you learn where the unit fails
        </LI>
        <LI>
          Be present. Fast, warm replies get forgiven for a lot of small
          shortcomings
        </LI>
        <LI>
          Stay in the unit yourself for a night before the first guest. You will
          find four things
        </LI>
        <LI>
          Ask for the review, once, politely, after checkout
        </LI>
      </UL>

      <Callout title="Do not discount indefinitely">
        Low launch pricing is a tool for buying reviews, not a strategy. Once
        you have five strong ones, move to real pricing. Hosts who never stop
        discounting end up with a busy calendar, a tired unit and no margin.
      </Callout>

      <H2 id="weeks-10-13">Weeks 10 to 13: turn it into a system</H2>

      <P>
        Everything that is currently in your head needs to become a routine that
        survives you being busy, ill or on a plane.
      </P>

      <UL>
        <LI>
          A cleaning checklist, so standard does not depend on who turns up
        </LI>
        <LI>
          A consumables restock list with quantities, checked every turnover
        </LI>
        <LI>
          A house manual covering wifi, water, power, parking, rubbish and
          checkout
        </LI>
        <LI>
          A named contact for plumbing, electrical and internet who answers
        </LI>
        <LI>
          A pricing rhythm: review weekly, and lift for conference weeks and
          December rather than discovering them afterwards
        </LI>
        <LI>
          A monthly read of the numbers, including the void nights
        </LI>
      </UL>

      <H2 id="honest">The honest 90 day expectation</H2>

      <P>
        You will not be profitable in the first quarter. Furnishing, permits,
        photography and launch pricing all land before revenue stabilises. What
        you should have at day 90 is a working system, five or more strong
        reviews, and a clear read on whether this unit really suits short lets.
      </P>

      <P>
        A meaningful number of people reach day 90 and conclude the long let was
        the better answer. That is a successful outcome, not a failure, and it
        is cheaper to learn at day 90 than at day 500. The comparison is in{" "}
        <Link
          href="/insights/airbnb-vs-long-term-rental-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Airbnb versus long term rental in Nairobi
        </Link>
        .
      </P>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        We take units through this sequence regularly, and we also tell owners
        when their unit is wrong for short lets before they spend on furniture.
        If you want an honest read,{" "}
        <Link
          href="/list-your-property"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          list your property
        </Link>{" "}
        and we will give you one.
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/airbnb-nairobi-complete-host-guide-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the complete Airbnb Nairobi host guide
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/how-to-start-airbnb-business-kenya"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how to start an Airbnb business in Kenya
        </Link>
        .
      </P>
    </>
  );
}

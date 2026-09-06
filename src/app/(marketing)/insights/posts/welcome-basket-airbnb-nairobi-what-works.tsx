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
  slug: "welcome-basket-airbnb-nairobi-what-works",
  title: "What actually belongs in a Nairobi welcome basket",
  description:
    "Most welcome baskets are decoration that photographs well and helps nobody. What a guest landing at midnight genuinely needs, what to skip, and why the first fifteen minutes decide your review.",
  publishedAt: "2026-08-30",
  readingMinutes: 5,
  author: authors.editors,
  tags: ["Airbnb", "Nairobi", "Hospitality", "Short Let", "Tips", "Reviews"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt: "Welcome basket for a Nairobi Airbnb guest",
};

export default function Article() {
  return (
    <>
      <Lede>
        Most international flights land in Nairobi late at night. Your guest
        gets to the apartment somewhere between eleven and two, having been
        awake for a day, and everything is shut. What is in the apartment at
        that moment does more for your rating than anything else you provide,
        and a basket of decorative straw with three sweets in it is not it.
      </Lede>

      <H2 id="essentials">The things that matter at midnight</H2>

      <P>
        Judge every item by one test: would a tired person arriving at 1am be
        relieved to find it?
      </P>

      <UL>
        <LI>
          <strong>Drinking water,</strong> sealed, at least two large bottles.
          Nairobi tap water is not something a visitor will drink and there is
          nowhere open to buy it. This is the single most important item
        </LI>
        <LI>
          <strong>Tea, coffee, sugar and long life milk,</strong> enough for the
          first morning. The kettle is useless without them. See{" "}
          <Link
            href="/insights/kettle-and-kitchen-basics-airbnb-nairobi"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            the kitchen basics that matter
          </Link>
        </LI>
        <LI>
          <strong>Something to eat.</strong> Biscuits, fruit, nuts, anything.
          Arriving hungry with no food in a city you do not know is genuinely
          miserable
        </LI>
        <LI>
          <strong>Toilet paper, soap, shampoo,</strong> in quantities that last
          more than a day. Running out on day two is a small humiliation you
          inflicted on your guest
        </LI>
        <LI>
          <strong>A charging cable or two,</strong> common types, in a drawer.
          Costs almost nothing, rescues someone regularly
        </LI>
        <LI>
          <strong>The wifi password,</strong> printed, visible, before they have
          to ask
        </LI>
        <LI>
          <strong>A torch or rechargeable lamp,</strong> charged, somewhere
          findable. Nairobi outages happen and a guest in the dark on their
          first night will remember it
        </LI>
      </UL>

      <Pullquote>
        Judge every item by whether a tired person arriving at 1am would be
        relieved to find it. Straw and ribbon fail that test.
      </Pullquote>

      <H2 id="local">The local touch, done properly</H2>

      <P>
        A small Kenyan gesture works and is worth doing, provided it is real
        rather than a gift shop token.
      </P>

      <UL>
        <LI>
          <strong>Good Kenyan coffee or tea,</strong> a proper local bag rather
          than sachets. Cheap, distinctive, and it is exactly what visitors
          associate with here
        </LI>
        <LI>
          <strong>Fruit in season,</strong> which is inexpensive and looks
          generous
        </LI>
        <LI>
          <strong>A short handwritten note.</strong> Two lines, actually
          handwritten. Guests photograph these
        </LI>
        <LI>
          <strong>Three or four recommendations you actually rate,</strong> with
          walking times. A list of forty places is a directory. Three is advice
        </LI>
        <LI>
          Skip the branded merchandise, the plastic souvenir and anything a
          guest has to pack and carry home
        </LI>
      </UL>

      <Callout title="Longer stays need restocking, not a bigger basket">
        A month long guest does not need thirty days of coffee on arrival. They
        need a check in around day ten with fresh consumables, clean towels and
        someone asking whether anything needs fixing. Long stays are won in the
        middle, not at the door.
      </Callout>

      <H2 id="skip">What to skip</H2>

      <UL>
        <LI>
          <strong>Alcohol.</strong> Assumes something about your guest, costs
          more than the alternatives, and is not universally welcome
        </LI>
        <LI>
          <strong>The basket itself,</strong> if it is doing nothing but sitting
          there. A tray or a tidy shelf is fine and looks less staged
        </LI>
        <LI>
          <strong>Anything perishable that will not survive a delayed
          flight.</strong> Fresh milk on a booking that lands two days late is a
          smell rather than a welcome
        </LI>
        <LI>
          <strong>Elaborate presentation over quantity.</strong> Guests prefer
          enough toilet paper to a beautifully tied ribbon, every time
        </LI>
      </UL>

      <H2 id="cost">What it costs</H2>

      <P>
        Very little, and it is the highest return spend in short letting. The
        consumables for one stay cost a small fraction of one night, and they
        directly influence the first paragraph of the review, which is the part
        future guests actually read.
      </P>

      <P>
        Budget it per stay rather than per month, restock it as part of the
        turnover, and keep a standing supply so nobody is buying milk on the way
        to a check in.
      </P>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        Every managed unit is stocked to a fixed list before arrival: water,
        tea and coffee, milk, something to eat, full bathroom consumables and a
        charged lamp. It is on the turnover checklist rather than left to
        goodwill, and it is restocked mid stay on anything longer than a
        fortnight.
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/airbnb-reviews-nairobi-getting-to-4-9"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how to get from 4.6 to 4.9
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/self-check-in-smart-locks-airbnb-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          making self check in work
        </Link>
        .
      </P>
    </>
  );
}

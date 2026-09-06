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
  slug: "how-clean-is-clean-enough-airbnb-nairobi",
  title: "How clean is clean enough for a Nairobi Airbnb?",
  description:
    "Tidy is not clean, and guests check specific places. The eleven spots that decide your cleanliness score, why a checklist beats a good cleaner, and how to hold a standard you are not there to see.",
  publishedAt: "2026-08-25",
  readingMinutes: 7,
  author: authors.editors,
  tags: ["Airbnb", "Nairobi", "Cleaning", "Short Let", "Tips", "Standards"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt: "How clean is clean enough for a Nairobi Airbnb",
};

export default function Article() {
  return (
    <>
      <Lede>
        Cleanliness is the review category most hosts think they are doing well
        in and most frequently are not. The gap is that hosts assess a room by
        standing in the doorway and looking at it, and guests assess it by
        touching eleven specific things. One of those eleven becomes the entire
        review.
      </Lede>

      <H2 id="difference">Tidy and clean are different jobs</H2>

      <P>
        A tidy apartment has everything put away, the bed made and the surfaces
        clear. That is what most turnovers achieve and it photographs perfectly.
      </P>

      <P>
        A clean apartment has no hair anywhere, no limescale, no smears, no
        dust on the skirting, nothing sticky, and no smell. Guests do not
        consciously audit this. They notice one thing, and then they look for
        more, and having started looking they find it.
      </P>

      <Pullquote>
        A guest who finds one hair in the bathroom stops trusting the whole
        apartment. Then they check the mattress protector, and by then you have
        lost the review.
      </Pullquote>

      <H2 id="eleven">The eleven places guests actually check</H2>

      <OL>
        <LI>
          <strong>The shower drain and the corners of the shower tray.</strong>
          Hair here is the single most damaging discovery in a short let
        </LI>
        <LI>
          <strong>The toilet, including the base, the hinges and behind it.</strong>
          The bit that gets missed is exactly the bit that gets photographed
        </LI>
        <LI>
          <strong>Under the pillows and inside the pillowcases.</strong> Guests
          check, and a stained pillow protector is a hygiene complaint rather
          than a laundry one
        </LI>
        <LI>
          <strong>The mattress itself, under the sheet.</strong> Always use a
          mattress protector, always wash it, and replace it when it stains
        </LI>
        <LI>
          <strong>The kettle interior.</strong> Scale reads as filth
        </LI>
        <LI>
          <strong>The fridge, especially the seals and the salad drawer.</strong>
          Previous guests leave things behind and smells linger
        </LI>
        <LI>
          <strong>The microwave interior.</strong> Never opened during a normal
          clean, always opened by a guest
        </LI>
        <LI>
          <strong>Behind and under the sofa cushions.</strong> Crumbs, hair
          clips, coins, other people’s belongings
        </LI>
        <LI>
          <strong>The bin.</strong> Empty is not the same as clean. Wash it and
          replace the liner
        </LI>
        <LI>
          <strong>Window sills, skirting boards and the tops of door
          frames.</strong> Nairobi is dusty and this accumulates fast
        </LI>
        <LI>
          <strong>The smell on opening the door.</strong> The first sensory
          impression, and the hardest to fix retrospectively. A closed
          apartment in Nairobi goes stale in a week
        </LI>
      </OL>

      <H2 id="nairobi">The Nairobi specific problems</H2>

      <UL>
        <LI>
          <strong>Dust.</strong> In the dry season it settles daily. A unit
          cleaned four days ago and left empty is dusty again. Wipe surfaces
          before every check in, even if nobody has stayed
        </LI>
        <LI>
          <strong>Hard water.</strong> Limescale on taps, shower screens and
          kettles builds visibly. Descaling is a routine job, not an occasional
          one
        </LI>
        <LI>
          <strong>Staleness in closed units.</strong> Air the apartment before
          arrival. Open everything for an hour
        </LI>
        <LI>
          <strong>Damp during the rains.</strong> Check for mildew in bathrooms
          and behind wardrobes on outside walls. A musty smell is read as a
          serious hygiene problem
        </LI>
        <LI>
          <strong>Insects.</strong> Even a clean unit gets the occasional
          visitor. Keep drains covered, food sealed, and treat the kitchen
          periodically
        </LI>
      </UL>

      <H2 id="checklist">A checklist beats a good cleaner</H2>

      <P>
        The single most useful thing to understand about cleaning is that
        standards which depend on the person are not standards. Your excellent
        cleaner will one day be ill, and whoever covers has no idea what you
        expect.
      </P>

      <UL>
        <LI>
          <strong>Write it room by room,</strong> in the order the work should
          be done, including the eleven items above explicitly
        </LI>
        <LI>
          <strong>Make it specific.</strong> “Clean bathroom” is not an
          instruction. “Check shower drain for hair, descale taps and screen,
          wipe behind toilet base” is
        </LI>
        <LI>
          <strong>Require photographs.</strong> Four after every clean: bed,
          bathroom, kitchen counter, living area. It takes 90 seconds and it
          changes behaviour permanently because it is checkable
        </LI>
        <LI>
          <strong>Include the resets,</strong> which are not cleaning and are
          always forgotten: water heater on, electricity topped up, air
          conditioning default, wifi router on, consumables restocked
        </LI>
        <LI>
          <strong>Pay properly and pay on time.</strong> The cheapest cleaner in
          Nairobi is the most expensive decision in short let hosting, because
          the review costs more than the saving many times over
        </LI>
      </UL>

      <Callout title="Stay in your own unit">
        Once a quarter, sleep in your own apartment. Arrive in the evening,
        shower, make tea, sleep in the bed, use the bathroom in the morning. You
        will find things no inspection finds, because you will be using the
        property rather than looking at it. Every host who does this is
        surprised the first time.
      </Callout>

      <H2 id="deep">Turnover clean and deep clean are not the same</H2>

      <P>
        A turnover clean happens between guests and takes a couple of hours. A
        deep clean happens monthly or quarterly and covers what turnovers never
        reach.
      </P>

      <UL>
        <LI>Behind and under all furniture and appliances</LI>
        <LI>Inside the oven, the fridge seals, the extractor filter</LI>
        <LI>Curtains and soft furnishings washed or cleaned</LI>
        <LI>Mattress protectors and duvets laundered, not just the sheets</LI>
        <LI>Grout, silicone and shower screens descaled properly</LI>
        <LI>Windows inside and out where reachable</LI>
        <LI>Light fittings and shades, which collect dust and insects</LI>
      </UL>

      <P>
        Schedule these in the quiet months. April and May are the natural window
        in Nairobi, when the calendar is soft anyway. See{" "}
        <Link
          href="/insights/airbnb-nairobi-occupancy-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          occupancy month by month
        </Link>
        .
      </P>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        Every managed unit has a written room by room checklist including the
        resets, and every turnover produces photographs. Deep cleans are
        scheduled rather than requested. It is the least glamorous part of what
        we do and the part that most reliably protects a rating.
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/diaspora-airbnb-nairobi-remote-owner-playbook"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          holding standards from abroad
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/airbnb-reviews-nairobi-getting-to-4-9"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how to get from 4.6 to 4.9
        </Link>
        .
      </P>
    </>
  );
}

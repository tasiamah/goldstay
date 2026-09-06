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
  slug: "mattress-and-sleep-quality-airbnb-nairobi",
  title: "The mattress is the most expensive thing to get wrong",
  description:
    "A guest can forgive a lot and cannot forgive a bad night's sleep. Why the bed deserves the largest share of your furnishing budget, what to buy in Nairobi, and the cheap fixes that improve a bad one.",
  publishedAt: "2026-08-29",
  readingMinutes: 6,
  author: authors.editors,
  tags: ["Airbnb", "Nairobi", "Furnishing", "Short Let", "Tips", "Reviews"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt: "Mattress and sleep quality in a Nairobi Airbnb",
};

export default function Article() {
  return (
    <>
      <Lede>
        Everything else in a short let is negotiable. A guest will forgive a
        small kitchen, a slow lift, an awkward parking space and a shower that
        takes a moment to warm up. They will not forgive a bad night's sleep,
        because it is the one thing they cannot work around and the one thing
        they were fundamentally buying.
      </Lede>

      <H2 id="budget">Spend the money here first</H2>

      <P>
        The common furnishing mistake in Nairobi is a beautiful living room and
        a cheap bed. It photographs well and it rates badly, because photographs
        sell the first booking and sleep sells every one after it.
      </P>

      <UL>
        <LI>
          The bed should be the single largest line in your furnishing budget,
          ahead of the sofa and well ahead of decorative items
        </LI>
        <LI>
          A good mattress lasts years across many guests. Cost per guest night
          it is trivially cheap, and hosts still economise on it
        </LI>
        <LI>
          It is the one item where the upgrade is felt by every single guest,
          every single night, without exception
        </LI>
      </UL>

      <Pullquote>
        Guests forgive almost everything except a bad night's sleep, and the
        review will not say "the mattress". It will say the place was
        uncomfortable.
      </Pullquote>

      <H2 id="what-to-buy">What to buy</H2>

      <UL>
        <LI>
          <strong>Medium firm.</strong> Not soft, not orthopaedic. Medium firm
          suits the widest range of bodies, and you are furnishing for
          strangers rather than for yourself
        </LI>
        <LI>
          <strong>Bigger than you think.</strong> A king in the main bedroom
          wherever the room takes it. Couples on a long stay feel a small
          double keenly and mention it
        </LI>
        <LI>
          <strong>Buy from a manufacturer with a real warranty,</strong> and
          keep the paperwork. Kenya has good local mattress makers and also a
          lot of foam sold as something better
        </LI>
        <LI>
          <strong>Check the depth.</strong> A very deep mattress needs deep
          fitted sheets, and mismatched sheets ping off the corners all night
        </LI>
        <LI>
          <strong>A solid, silent bed frame.</strong> A creaking frame is
          reported as a bad mattress. Check every joint, and check it again
          after six months
        </LI>
        <LI>
          <strong>Protector on from day one,</strong> always, no exceptions. It
          is the difference between a mattress lasting five years and two
        </LI>
      </UL>

      <H2 id="rescue">Rescuing a bed you already have</H2>

      <P>
        If replacing is not immediately possible, several cheap interventions
        genuinely help.
      </P>

      <UL>
        <LI>
          <strong>A good mattress topper.</strong> The highest impact fix
          available, and a fraction of a new mattress. It will not save a sagging
          one, and it transforms a merely firm one
        </LI>
        <LI>
          <strong>Replace the pillows.</strong> Pillows compress faster than
          mattresses and hosts almost never replace them. Old pillows account
          for more sleep complaints than people realise
        </LI>
        <LI>
          <strong>Fix the frame.</strong> Tighten every bolt, add felt pads,
          eliminate the creak
        </LI>
        <LI>
          <strong>Check the slats.</strong> A broken or missing slat causes a
          dip that reads exactly like a failing mattress
        </LI>
        <LI>
          <strong>Rotate it,</strong> on a schedule, as part of the deep clean
        </LI>
      </UL>

      <Callout title="Sleep in it yourself for one night">
        Before listing, sleep in the apartment. You will discover the streetlight
        through the curtains, the fridge that hums, the lift shaft on the other
        side of the wall, the mosquito, and whether the bed is actually
        comfortable. It is the highest yielding hour of preparation available
        and virtually no host does it.
      </Callout>

      <H2 id="around">Everything else about sleeping</H2>

      <P>
        A perfect mattress in a bright, noisy room still produces a complaint
        about sleep. The bedroom is a system.
      </P>

      <UL>
        <LI>
          <strong>Blackout curtains,</strong> properly fitted, overlapping the
          window frame. Nairobi's sun arrives early and directly
        </LI>
        <LI>
          <strong>Noise.</strong> Generators, night clubs, the road, the lift.
          Some of it is fixable with heavier curtains and seals, some is not,
          and the honest answer is to describe it in the listing
        </LI>
        <LI>
          <strong>Mosquitoes.</strong> Screens on the bedroom windows are the
          real solution. One mosquito ruins a night as thoroughly as a bad
          mattress
        </LI>
        <LI>
          <strong>Temperature.</strong> A fan, cross ventilation, a lighter
          duvet. See{" "}
          <Link
            href="/insights/airbnb-air-conditioning-nairobi-worth-it"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            whether air conditioning is worth it
          </Link>
        </LI>
        <LI>
          <strong>Light discipline.</strong> Cover or dim the standby lights on
          the television, the router and the air conditioner
        </LI>
        <LI>
          <strong>A bedside socket and a bedside light</strong> on each side.
          Very cheap, constantly appreciated, and frequently missing
        </LI>
      </UL>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        We push owners to spend on the bed before the sofa, and we check the
        frame, slats and pillows at every deep clean rather than only when a
        guest raises it. Where a mattress cannot be replaced immediately, a
        topper and new pillows go in first.
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/linen-and-towels-airbnb-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          linen and towels
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/cost-furnish-nairobi-apartment-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          what it costs to furnish a Nairobi apartment
        </Link>
        .
      </P>
    </>
  );
}

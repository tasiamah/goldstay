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
  slug: "noise-and-blackout-curtains-airbnb-nairobi",
  title: "Light and noise are the two Nairobi complaints hosts never see coming",
  description:
    "You slept through the generator and the 6am sun because you do not live there. Guests do not. What to fix, what to disclose honestly, and why blackout curtains are the cheapest rating improvement available.",
  publishedAt: "2026-09-01",
  readingMinutes: 6,
  author: authors.editors,
  tags: ["Airbnb", "Nairobi", "Noise", "Short Let", "Tips", "Furnishing"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt: "Blackout curtains and noise control in a Nairobi Airbnb",
};

export default function Article() {
  return (
    <>
      <Lede>
        Hosts inspect their apartments at eleven in the morning on a weekday.
        Guests experience them at five in the morning on a Sunday. Almost every
        light and noise problem in a Nairobi short let is invisible at the hour
        the owner visits, which is why they end up being reported by a stranger
        in public.
      </Lede>

      <H2 id="light">The light problem</H2>

      <P>
        Nairobi sits on the equator. Sunrise is around the same early hour all
        year and it arrives without the long gradual dawn people from higher
        latitudes are used to. It is dark and then it is bright.
      </P>

      <UL>
        <LI>
          <strong>Blackout curtains in every bedroom,</strong> not blackout
          blinds with a gap round the edge. This is the fix and it is
          inexpensive
        </LI>
        <LI>
          <strong>Fit them wider and taller than the window,</strong> because
          light comes round the sides. A curtain the exact size of the frame
          leaves two bright vertical stripes across the bed
        </LI>
        <LI>
          <strong>Check the overlap in the middle,</strong> where the two panels
          meet. Overlap them properly
        </LI>
        <LI>
          <strong>Deal with the standby lights.</strong> The television, the
          router, the air conditioner and the extension lead all glow. Cover
          them or move them out of the bedroom
        </LI>
        <LI>
          <strong>Security lighting outside</strong> is often the real culprit
          and it runs all night. Heavy curtains, or in the worst cases a
          conversation with the building
        </LI>
      </UL>

      <Pullquote>
        Fitting the curtain to the window instead of the wall is the single most
        common furnishing mistake in Nairobi, and it puts two stripes of sunrise
        across the bed.
      </Pullquote>

      <H2 id="noise">The noise problem</H2>

      <P>
        Nairobi has a specific set of noises, and knowing which one you have
        determines whether it is fixable.
      </P>

      <UL>
        <LI>
          <strong>The building generator,</strong> which starts at every outage
          and is loud if your unit is near it. Not fixable from inside. Disclose
          it
        </LI>
        <LI>
          <strong>Construction,</strong> which starts early and is a genuine
          feature of the fast growing suburbs. Temporary in principle and often
          long lived in practice. Disclose it while it lasts
        </LI>
        <LI>
          <strong>Bars and clubs,</strong> which in parts of Kilimani and
          Westlands run until very late at weekends. Not fixable and highly
          location specific. Disclose it, and be honest about which nights
        </LI>
        <LI>
          <strong>Traffic and matatus</strong> on a main road. Partly fixable
          with heavier curtains and window seals
        </LI>
        <LI>
          <strong>The lift shaft, the water pump and the corridor,</strong> if
          your unit backs onto them. Worth knowing before you buy
        </LI>
        <LI>
          <strong>Other residents.</strong> Nothing to be done, and it is
          normal apartment living everywhere
        </LI>
      </UL>

      <H2 id="fixes">What actually helps</H2>

      <UL>
        <LI>
          <strong>Heavy lined curtains,</strong> which do useful work on both
          light and noise at once. The best value purchase in this article
        </LI>
        <LI>
          <strong>Seals on windows and under the door,</strong> cheap, and
          effective against the general wash of street noise
        </LI>
        <LI>
          <strong>Soft surfaces.</strong> Rugs, upholstery and curtains stop a
          tiled Nairobi apartment behaving like an echo chamber, which makes
          every internal sound worse
        </LI>
        <LI>
          <strong>A fan in the bedroom,</strong> which many guests use as white
          noise regardless of the temperature
        </LI>
        <LI>
          <strong>Earplugs in the bedside drawer.</strong> Slightly apologetic
          and genuinely appreciated where there is a known noise you cannot fix
        </LI>
        <LI>
          <strong>Choosing the quieter bedroom as the main one,</strong> if the
          layout allows. Free, and hosts rarely consider it
        </LI>
      </UL>

      <Callout title="Disclose the noise you cannot fix">
        A guest told in advance that the club opposite is loud on Friday and
        Saturday, who books anyway, does not complain about it. A guest who
        discovers it at midnight writes about it. Disclosure costs you a small
        number of bookings you would have lost in the review anyway, and it
        protects the rating that wins all the others.
      </Callout>

      <H2 id="test">Test it the way a guest experiences it</H2>

      <P>
        Spend a night in the apartment before you list it, and specifically a
        weekend night. You will learn more in one night than in ten daytime
        inspections.
      </P>

      <UL>
        <LI>What wakes you, and at what time</LI>
        <LI>Whether the bedroom is actually dark</LI>
        <LI>Whether there is a mosquito, which there usually is</LI>
        <LI>What the street sounds like after eleven</LI>
        <LI>Whether the fridge, the lift or the pump is audible from the bed</LI>
      </UL>

      <P>
        More on the bedroom as a whole in{" "}
        <Link
          href="/insights/mattress-and-sleep-quality-airbnb-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          why the mattress is the most expensive thing to get wrong
        </Link>
        .
      </P>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        We check light and noise before listing rather than after the first
        review, fit blackout curtains to the wall rather than the window, and
        state known noise in the listing. Where a building level noise cannot be
        solved, we price and describe the unit accordingly instead of hoping
        guests do not notice.
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
          href="/insights/airbnb-air-conditioning-nairobi-worth-it"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          whether air conditioning is worth it
        </Link>
        .
      </P>
    </>
  );
}

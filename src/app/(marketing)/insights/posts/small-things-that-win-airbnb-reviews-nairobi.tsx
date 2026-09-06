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
  slug: "small-things-that-win-airbnb-reviews-nairobi",
  title: "Nobody writes a five star review about the granite worktop",
  description:
    "Reviews are won by a topped up meter, hot water that arrives, a mosquito screen and enough toilet paper. The complete list of small things that decide a Nairobi rating, and why owners spend money everywhere else.",
  publishedAt: "2026-09-06",
  readingMinutes: 7,
  author: authors.editors,
  tags: ["Airbnb", "Nairobi", "Reviews", "Short Let", "Tips", "Hospitality"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt: "The small things that win Airbnb reviews in Nairobi",
};

export default function Article() {
  return (
    <>
      <Lede>
        Read a hundred Nairobi short let reviews and a pattern appears
        immediately. Nobody mentions the worktop, the light fittings or the
        feature wall. They mention that the water was hot, that the wifi held up
        through a call, that the place smelled clean, and that somebody answered
        the phone. Owners spend on the first list and are rated on the second.
      </Lede>

      <H2 id="cheap">The things that cost almost nothing</H2>

      <P>
        Every item here is inexpensive, and every one of them appears in reviews
        by name.
      </P>

      <UL>
        <LI>
          <strong>A topped up electricity meter.</strong> The most preventable
          failure in Nairobi hosting and the one that generates the angriest
          messages. See{" "}
          <Link
            href="/insights/prepaid-electricity-tokens-airbnb-nairobi"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            managing prepaid electricity
          </Link>
        </LI>
        <LI>
          <strong>Hot water that arrives when expected,</strong> with the switch
          explained. See{" "}
          <Link
            href="/insights/hot-water-airbnb-nairobi-guest-expectations"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            hot water and guest expectations
          </Link>
        </LI>
        <LI>
          <strong>Mosquito screens on the bedroom windows,</strong> which let
          guests sleep with the window open and solve two complaints at once.
          See{" "}
          <Link
            href="/insights/mosquitoes-and-pests-airbnb-nairobi"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            mosquitoes and pests
          </Link>
        </LI>
        <LI>
          <strong>Blackout curtains fitted to the wall, not the window.</strong>{" "}
          See{" "}
          <Link
            href="/insights/noise-and-blackout-curtains-airbnb-nairobi"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            light and noise
          </Link>
        </LI>
        <LI>
          <strong>A UPS on the router,</strong> so the internet survives an
          outage. See{" "}
          <Link
            href="/insights/backup-power-airbnb-nairobi-inverter-guide"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            backup power
          </Link>
        </LI>
        <LI>
          <strong>Enough toilet paper, soap and coffee.</strong> See{" "}
          <Link
            href="/insights/toiletries-and-consumables-airbnb-nairobi"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            consumables
          </Link>
        </LI>
        <LI>
          <strong>Sealed drinking water on arrival,</strong> because there is
          nowhere open at midnight
        </LI>
        <LI>
          <strong>A bedside light and a bedside socket on each side.</strong>{" "}
          Trivially cheap and constantly missing
        </LI>
        <LI>
          <strong>A working kettle and something to put in it.</strong> See{" "}
          <Link
            href="/insights/kettle-and-kitchen-basics-airbnb-nairobi"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            kitchen basics
          </Link>
        </LI>
        <LI>
          <strong>New pillows.</strong> They compress, hosts never replace them,
          and guests blame the mattress
        </LI>
      </UL>

      <Pullquote>
        Owners spend money on what photographs well and are rated on what
        functions at midnight. The two lists barely overlap.
      </Pullquote>

      <H2 id="worth">The things worth real money</H2>

      <UL>
        <LI>
          <strong>The bed.</strong> The largest line in the furnishing budget,
          ahead of the sofa, every time. See{" "}
          <Link
            href="/insights/mattress-and-sleep-quality-airbnb-nairobi"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            the mattress
          </Link>
        </LI>
        <LI>
          <strong>Three sets of white linen per bed,</strong> with protectors.
          See{" "}
          <Link
            href="/insights/linen-and-towels-airbnb-nairobi"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            linen and towels
          </Link>
        </LI>
        <LI>
          <strong>Fast, stable internet</strong> with the speed stated in the
          listing
        </LI>
        <LI>
          <strong>A professional photography session,</strong> shot accurately.
          See{" "}
          <Link
            href="/insights/listing-photos-vs-reality-airbnb-nairobi"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            photos versus reality
          </Link>
        </LI>
        <LI>
          <strong>Cleaning done to a written standard,</strong> which is the
          product itself. See{" "}
          <Link
            href="/insights/how-clean-is-clean-enough-airbnb-nairobi"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            how clean is clean enough
          </Link>
        </LI>
      </UL>

      <H2 id="behaviour">The things that are free and behavioural</H2>

      <P>
        These cost nothing at all and move ratings more than any purchase on
        either list.
      </P>

      <UL>
        <LI>
          <strong>Answer quickly.</strong> Speed of response is the strongest
          single predictor of a good review, and most complaints are about
          silence rather than about the problem
        </LI>
        <LI>
          <strong>Never argue with a guest,</strong> even when they are wrong.
          Acknowledge, act, follow up
        </LI>
        <LI>
          <strong>Fix things during the stay,</strong> not after it. A problem
          solved on the day frequently becomes a compliment. The same problem
          discovered in the review is permanent
        </LI>
        <LI>
          <strong>Check in mid stay on anything long,</strong> which is when
          quiet dissatisfaction is still fixable
        </LI>
        <LI>
          <strong>Disclose what you cannot fix,</strong> before they book.
          Expectation management is cheaper than every renovation
        </LI>
        <LI>
          <strong>Say sorry properly</strong> when it was your fault, without
          explaining why it was not
        </LI>
      </UL>

      <Callout title="Sleep in it for one night before you list it">
        The recommendation that appears in almost every article in this series,
        because it surfaces everything at once: the sunrise through the gap in
        the curtains, the mosquito, the humming fridge, the shower that runs
        cold, the bed you would not sleep on twice. One night tells you more
        than ten daytime inspections, and virtually no owner does it.
      </Callout>

      <H2 id="pattern">Why owners get this backwards</H2>

      <P>
        The mistake is understandable. An owner experiences the property as a
        possession and judges it by how it looks. A guest experiences it as
        infrastructure for a few days of their life and judges it by whether it
        works.
      </P>

      <UL>
        <LI>
          Visible improvements are satisfying and feel like progress. A UPS on
          the router does not
        </LI>
        <LI>
          Owners visit at eleven on a weekday and never meet the apartment at
          five on a Sunday morning
        </LI>
        <LI>
          Consumables and top ups feel like leaking costs rather than product,
          so they get squeezed
        </LI>
        <LI>
          Nobody photographs a screen or a topped up meter, so nothing rewards
          the spend except the rating, which is the only reward that pays
        </LI>
      </UL>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        Most of this list lives on our turnover checklist rather than in
        anybody’s memory: the meter, the hot water, the wifi, the consumables,
        the door code, the photographs at the end. The rest is response time,
        which is the part no checklist can cover and the part owners are
        actually buying.
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/turnover-checklist-airbnb-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the turnover checklist
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

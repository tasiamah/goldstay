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
  slug: "airbnb-reviews-nairobi-getting-to-4-9",
  title: "How to get a Nairobi Airbnb from 4.6 to 4.9",
  description:
    "A 4.6 rating looks fine to a host and reads as a warning to a guest. What actually moves a Nairobi short let rating, why the gap is almost never about the furniture, and how to recover from bad reviews.",
  publishedAt: "2026-08-14",
  readingMinutes: 8,
  author: authors.editors,
  tags: ["Airbnb", "Reviews", "Nairobi", "Short Let", "Hosting", "Kenya"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt: "How to improve a Nairobi Airbnb rating to 4.9",
};

export default function Article() {
  return (
    <>
      <Lede>
        Hosts see 4.6 and think it is a good score, because in every other part
        of life it would be. Guests see 4.6 next to the 4.9 across the road and
        read it as a risk. The gap between those two numbers is worth more to
        your income than any price change, and closing it is almost never about
        spending money on the apartment.
      </Lede>

      <H2 id="why">Why 4.6 is worse than it sounds</H2>

      <UL>
        <LI>
          <strong>Ranking.</strong> Rating feeds visibility, so a lower score
          means fewer people see you before price is even considered
        </LI>
        <LI>
          <strong>Comparison.</strong> Guests do not judge you against 5. They
          judge you against the other listings on the screen, most of which are
          above 4.8
        </LI>
        <LI>
          <strong>Pricing power.</strong> A 4.9 holds rate through quiet weeks.
          A 4.6 discounts to fill them, which attracts guests who lower it
          further
        </LI>
        <LI>
          <strong>Corporate bookers filter it out.</strong> The long stay
          segment frequently sets a rating floor, and 4.6 is below it
        </LI>
      </UL>

      <Pullquote>
        The difference between 4.6 and 4.9 is not three tenths of a point. It is
        whether you get to choose your price.
      </Pullquote>

      <H2 id="causes">What actually pulls a Nairobi rating down</H2>

      <P>
        Across the listings we have taken over, the causes cluster tightly, and
        the pattern is consistent. Almost none of it is about styling.
      </P>

      <OL>
        <LI>
          <strong>Water.</strong> No hot water, weak pressure, or water off at
          6am. The most common single cause of a Nairobi review below four
          stars, and the least forgivable to a guest
        </LI>
        <LI>
          <strong>Cleanliness on inspection.</strong> Not general untidiness.
          Hair in the bathroom, a stained pillow protector, a grubby kettle, dust
          on the skirting. Guests look, and one detail becomes the whole review
        </LI>
        <LI>
          <strong>Something not working.</strong> A dead bulb, a broken blind, a
          shower that leaks, a remote with no batteries. Individually trivial,
          and they read as neglect in aggregate
        </LI>
        <LI>
          <strong>Internet.</strong> Especially where the listing implied it was
          fast
        </LI>
        <LI>
          <strong>Check in friction.</strong> Waiting outside, a caretaker who
          cannot be found, unclear directions, a gate that will not let them in
        </LI>
        <LI>
          <strong>Noise.</strong> Construction, a nightclub, a generator under
          the bedroom window, thin walls
        </LI>
        <LI>
          <strong>Accuracy.</strong> The unit being smaller, darker or older
          than the photographs suggested. This is the one that produces the
          angriest reviews
        </LI>
        <LI>
          <strong>Slow responses</strong> during the stay, when something has
          gone wrong
        </LI>
      </OL>

      <P>
        Notice what is not on this list: furniture style, decor, artwork, the
        towel folding. Guests rate the experience of using the property, not
        your taste.
      </P>

      <H2 id="fixes">The fixes, in order of return</H2>

      <UL>
        <LI>
          <strong>Fix water first.</strong> Instant water heater, better shower
          head, a pump if pressure is the issue, and understand the building's
          storage. Nothing else on this list matters as much
        </LI>
        <LI>
          <strong>Raise the cleaning standard, then inspect it.</strong> A
          written checklist and someone checking against it. Standards that
          depend on who turned up are not standards
        </LI>
        <LI>
          <strong>Walk the unit as a guest, monthly.</strong> Arrive, unpack,
          shower, make tea, work at the desk, sleep in the bed. You will find
          four things every time
        </LI>
        <LI>
          <strong>Make check in idiot proof.</strong> Written directions with
          landmarks, a photograph of the gate, the code, and a name at the
          gate. Assume arrival at 11pm in the rain
        </LI>
        <LI>
          <strong>Reply within minutes during a stay.</strong> A problem solved
          in ten minutes usually does not appear in the review at all
        </LI>
        <LI>
          <strong>Make the listing slightly understate the unit.</strong> Then
          arrival is an upgrade, and the accuracy score looks after itself
        </LI>
      </UL>

      <Callout title="The recovery message">
        When something goes wrong mid stay, the review is decided by your
        response and not by the fault. Acknowledge it immediately, say what you
        are doing and by when, fix it, then follow up once. Guests routinely
        leave five stars after a genuine problem that was handled well, and one
        star after a small problem that was ignored for a day.
      </Callout>

      <H2 id="recovering">Recovering from bad reviews</H2>

      <P>
        You cannot remove a fair review, so the arithmetic is the only route:
        dilute it with volume of good ones.
      </P>

      <OL>
        <LI>
          Identify the specific complaint and fix it properly. If three reviews
          mention water, no amount of new reviews will help until the water
          works
        </LI>
        <LI>
          Respond publicly to the bad review, once, briefly, without arguing.
          Future guests read your response and are judging your temperament, not
          relitigating the stay. "You are right, the water heater was
          undersized. We have replaced it." is close to ideal
        </LI>
        <LI>
          Then drive volume: shorter minimum stays and a keener rate for a few
          weeks, executed at a genuinely high standard, to bury the average
        </LI>
        <LI>
          Ask every satisfied guest, once, politely, after checkout
        </LI>
        <LI>
          Never argue in a public response and never mention a guest's
          nationality, gender or anything personal. It ends conversations with
          future bookers instantly
        </LI>
      </OL>

      <H2 id="asking">On asking for reviews</H2>

      <P>
        Ask once, after checkout, in a short message that thanks them and makes
        it easy. Do not ask twice, do not ask for five stars specifically, and
        do not offer anything in exchange. Guests find it uncomfortable, and
        platforms take a dim view.
      </P>

      <P>
        The single best predictor of a good review is not the request. It is
        whether you replied quickly when they needed something.
      </P>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        When we take over an underperforming listing, we work the list above in
        that order: water, cleaning standard, snag list, check in, response
        time. The rating usually moves within a couple of months, and it moves
        without touching the furniture.
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/why-your-nairobi-airbnb-isnt-getting-bookings"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          why your Nairobi Airbnb is not getting bookings
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/airbnb-photography-nairobi-what-good-looks-like"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          what good Airbnb photography looks like
        </Link>
        .
      </P>
    </>
  );
}

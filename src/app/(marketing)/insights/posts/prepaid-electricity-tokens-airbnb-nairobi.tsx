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
  slug: "prepaid-electricity-tokens-airbnb-nairobi",
  title: "The prepaid electricity mistake that ruins Nairobi Airbnb reviews",
  description:
    "A meter running out at 9pm is one of the most damaging things that can happen to a Nairobi short let, and it is entirely preventable. How to manage prepaid tokens so a guest never sees the problem.",
  publishedAt: "2026-08-22",
  readingMinutes: 6,
  author: authors.editors,
  tags: ["Airbnb", "Nairobi", "Electricity", "Short Let", "Tips", "Kenya"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt: "Managing prepaid electricity tokens in a Nairobi Airbnb",
};

export default function Article() {
  return (
    <>
      <Lede>
        Of all the ways to lose a five star review in Nairobi, this is the most
        preventable and the most self inflicted. A guest sits down to dinner,
        the lights go out, and they discover the meter needs topping up. It
        takes four minutes to fix and it costs you a rating you will spend
        months rebuilding.
      </Lede>

      <H2 id="why-bad">Why it damages you more than an outage</H2>

      <P>
        Guests are surprisingly forgiving about a power cut. It is visibly not
        your fault, everyone has experienced one, and if your backup works they
        may barely notice. An empty prepaid meter is completely different.
      </P>

      <UL>
        <LI>
          It is unambiguously the host’s responsibility, and the guest knows it
        </LI>
        <LI>
          It happens in the evening, because that is when consumption peaks
        </LI>
        <LI>
          The guest has to solve it, in a foreign country, in the dark, possibly
          without a Kenyan mobile money account
        </LI>
        <LI>
          It reads as neglect rather than misfortune, which is the specific
          impression that produces a three star review
        </LI>
        <LI>
          It also kills the wifi, the fridge and frequently the water pump, so
          one failure becomes four complaints
        </LI>
      </UL>

      <Pullquote>
        A power cut is bad luck. An empty prepaid meter is a message to your
        guest that nobody is paying attention, and that is what they write
        about.
      </Pullquote>

      <H2 id="system">The system that prevents it</H2>

      <OL>
        <LI>
          <strong>Know your unit’s burn rate.</strong> Track how many units a
          week the apartment consumes with guests in it. Two or three weeks of
          data is enough, and everything else depends on this number
        </LI>
        <LI>
          <strong>Top up at every turnover, not when it runs low.</strong> Make
          it a line on the cleaning checklist so it happens by routine rather
          than by memory
        </LI>
        <LI>
          <strong>Hold a buffer of at least double the longest booking you
          accept.</strong> A guest booking three weeks should never come near
          the limit, and air conditioning changes the arithmetic considerably
        </LI>
        <LI>
          <strong>Check the balance before every check in.</strong> Thirty
          seconds, and it is the check that actually catches the problem
        </LI>
        <LI>
          <strong>Top up more before December, long weekends and holidays,</strong>
          when consumption rises and vendors and support are slower
        </LI>
        <LI>
          <strong>Never let a long booking run on the balance you left for a
          weekend.</strong> This is the classic failure
        </LI>
      </OL>

      <Callout title="Put it on the checklist">
        Every prevention system that depends on someone remembering will fail
        eventually. The one that works is a line item on the turnover checklist,
        with the balance written down and photographed alongside the cleaning
        photos. Then it is checkable, and you know it happened rather than
        hoping.
      </Callout>

      <H2 id="fallback">The fallback, for when it happens anyway</H2>

      <P>
        It will happen once. What decides the review is how fast it is resolved,
        and that depends on preparation rather than on speed of response.
      </P>

      <UL>
        <LI>
          <strong>Have the meter number saved</strong> somewhere you can reach it
          from your phone in seconds, wherever in the world you are. Not on a
          sticker in the apartment you cannot see
        </LI>
        <LI>
          <strong>Know how to buy tokens remotely</strong> and have done it
          before, in daylight, as a test. Learning the process during an
          emergency is how a four minute fix becomes forty
        </LI>
        <LI>
          <strong>Give your local contact the meter number and standing
          authority</strong> to top up without asking you
        </LI>
        <LI>
          <strong>Put the meter location in the house manual,</strong> with a
          photograph, so a guest who wants to help can read the balance to you
        </LI>
        <LI>
          <strong>Never ask a guest to pay for it.</strong> If they do, refund
          it immediately and thank them properly. A guest who is out of pocket
          writes about it
        </LI>
      </UL>

      <H2 id="postpaid">Postpaid, submetered and shared arrangements</H2>

      <UL>
        <LI>
          <strong>Postpaid is safer for short lets,</strong> because there is no
          cliff edge. If your building offers it, take it, even at slightly
          worse rates. You are buying the removal of a review risk
        </LI>
        <LI>
          <strong>Landlord submetered buildings</strong> can be worse, because
          the cut off is controlled by someone whose priority is not your
          guest’s evening. Understand the process and who to call
        </LI>
        <LI>
          <strong>Never pass electricity through to the guest.</strong> Some
          hosts ask short let guests to buy their own tokens. It is the fastest
          way to a bad review in this market. Absorb it in the nightly rate
        </LI>
        <LI>
          <strong>Check the water pump.</strong> In many Nairobi buildings the
          pump is on the building supply, but in some it is on the unit’s meter,
          which means an empty meter means no water either
        </LI>
      </UL>

      <H2 id="reduce">Reducing consumption without annoying anyone</H2>

      <UL>
        <LI>
          LED bulbs throughout. Cheap, immediate, nobody notices except your
          meter
        </LI>
        <LI>
          An instant shower heater rather than a large tank constantly heating
          water for guests who are out all day
        </LI>
        <LI>
          An inverter air conditioning unit if you have one at all
        </LI>
        <LI>
          A polite note asking guests to switch off the air conditioning and
          lights when they go out. Framed warmly, most guests comply
        </LI>
        <LI>
          Do not fit timers or restrictions on the shower or the sockets. It
          saves a little and costs a lot in reviews
        </LI>
      </UL>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        Topping up is a line on our turnover checklist with the balance recorded
        against every clean, and we hold a buffer sized to more than the longest
        booking. Our local team can top up any unit remotely without waiting for
        an owner to approve it, because a guest in the dark is not a moment for
        an approval workflow.
      </P>

      <P>
        Owners who would rather not think about it at all use our{" "}
        <Link
          href="/airbnb-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Airbnb and short-stay management
        </Link>{" "}
        instead.
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/solar-and-backup-power-nairobi-rental-property"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          solar and backup power for Nairobi rentals
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/how-clean-is-clean-enough-airbnb-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the turnover standard, including the resets
        </Link>
        .
      </P>
    </>
  );
}

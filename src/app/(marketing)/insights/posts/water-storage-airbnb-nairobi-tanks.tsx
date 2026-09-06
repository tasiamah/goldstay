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
  slug: "water-storage-airbnb-nairobi-tanks",
  title: "Water supply is the question to ask before you take a Nairobi unit",
  description:
    "Nairobi water is intermittent by design, and buildings manage it with tanks and boreholes of very different quality. The questions that reveal what you are really getting, and what to do about a weak supply.",
  publishedAt: "2026-08-27",
  readingMinutes: 6,
  author: authors.editors,
  tags: ["Airbnb", "Nairobi", "Water", "Short Let", "Tips", "Buildings"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt: "Water storage and supply for a Nairobi short let",
};

export default function Article() {
  return (
    <>
      <Lede>
        Nairobi’s mains supply is rationed in much of the city, which everybody
        who lives here knows and no visiting guest does. Buildings bridge the
        gap with storage tanks and boreholes, and the quality of that
        arrangement varies enormously. It is the most important thing to
        establish about a building and the thing least often asked about.
      </Lede>

      <H2 id="questions">The questions that reveal the truth</H2>

      <P>
        “Is there water?” gets a yes from every agent in Nairobi. These do not.
      </P>

      <OL>
        <LI>
          <strong>What is the total storage capacity, in litres, and how many
          units share it?</strong> Divide one by the other. That number tells
          you how many days the building can run without a delivery
        </LI>
        <LI>
          <strong>Is there a borehole, and is it currently working?</strong>
          Boreholes fail and are expensive to fix, so a building may have one
          that has been out of service for a year
        </LI>
        <LI>
          <strong>How often does the building buy water by tanker?</strong>
          Regular tanker purchases are not a disaster, they are a cost, and
          they tell you the mains supply is unreliable
        </LI>
        <LI>
          <strong>Has the building run out in the last twelve months?</strong>
          Ask a resident rather than the manager
        </LI>
        <LI>
          <strong>Is the borehole water treated, and is it soft or hard?</strong>
          Untreated borehole water can be very hard, which destroys kettles,
          heaters and shower screens, and leaves guests complaining about
          residue
        </LI>
        <LI>
          <strong>Is the pump on the building supply or my unit’s meter?</strong>
          If it is on your meter, an empty prepaid meter means no water. See{" "}
          <Link
            href="/insights/prepaid-electricity-tokens-airbnb-nairobi"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            managing prepaid electricity
          </Link>
        </LI>
        <LI>
          <strong>Who pays for water, and how is it charged?</strong> Some
          buildings submeter, others fold it into service charge. It changes
          your cost base for a short let, where consumption is high
        </LI>
      </OL>

      <Pullquote>
        Total storage divided by number of units is the single most useful
        number about a Nairobi building, and almost no buyer ever asks for it.
      </Pullquote>

      <H2 id="test">Test it rather than trusting it</H2>

      <UL>
        <LI>
          Run a tap and a shower at 6am and at 9pm on a weekday, when the whole
          building is using water. Midday tells you nothing
        </LI>
        <LI>
          If you can, test on the top floor of the building, where pressure is
          worst
        </LI>
        <LI>
          Look at the taps and shower screen in an existing unit. Heavy
          limescale tells you what the water is like more honestly than anyone
          will
        </LI>
        <LI>
          Ask a resident on your floor. They have no reason to sell you
          anything
        </LI>
        <LI>
          Visit during the dry season if you can, which is when the supply is
          under real pressure
        </LI>
      </UL>

      <H2 id="fix">What you can do about a weak supply</H2>

      <P>
        Some of this is fixable at unit level and some is not, and knowing which
        is which saves money.
      </P>

      <UL>
        <LI>
          <strong>Fixable: pressure.</strong> A booster pump and a decent shower
          head solve most complaints where water is arriving but weakly. See{" "}
          <Link
            href="/insights/hot-water-airbnb-nairobi-guest-expectations"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            hot water and pressure
          </Link>
        </LI>
        <LI>
          <strong>Fixable: hardness.</strong> An inline filter or softener on
          the incoming supply protects your heater and kettle and stops guests
          complaining about residue
        </LI>
        <LI>
          <strong>Sometimes fixable: unit level storage.</strong> A small tank
          for your own apartment, where the building permits it and there is
          space. Worth investigating
        </LI>
        <LI>
          <strong>Not fixable: the building running dry.</strong> If total
          storage is inadequate and there is no working borehole, that is a
          building level failure you cannot engineer around, and it caps your
          rating permanently
        </LI>
      </UL>

      <Callout title="This is a walk away signal">
        If a building cannot reliably deliver water and cannot reliably deliver
        power, do not run a short let there whatever the apartment looks like.
        Both failures land squarely in your reviews, neither can be fixed from
        inside your unit, and no amount of good hosting compensates. A long let
        tenant will tolerate what a paying guest will not, so let it long term
        instead.
      </Callout>

      <H2 id="guest">Managing the guest side</H2>

      <UL>
        <LI>
          Never ask guests to ration water. It is the wrong request to make of
          someone paying a nightly rate
        </LI>
        <LI>
          Do explain, briefly and without alarm, in the house manual how the
          building’s supply works, so an interruption is context rather than a
          crisis
        </LI>
        <LI>
          Keep a couple of large bottles of drinking water in the apartment.
          Nairobi tap water is not something an international guest will drink,
          and this small provision is noticed
        </LI>
        <LI>
          If an interruption happens during a stay, tell the guest before they
          discover it, say how long, and offer something. Most people are
          reasonable when informed and unreasonable when surprised
        </LI>
        <LI>
          On longer stays, check in mid stay. Water problems build up rather
          than arriving suddenly
        </LI>
      </UL>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        We ask for storage capacity, unit count and borehole status before
        taking on a Nairobi short let, and we test pressure at peak hours rather
        than accepting an assurance. Where the building cannot deliver, we
        recommend a long let, and we say why.
      </P>

      <P>
        If you would rather not run any of this yourself, it is what our{" "}
        <Link
          href="/airbnb-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Airbnb management service in Nairobi
        </Link>{" "}
        exists to do.
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/backup-power-airbnb-nairobi-inverter-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          backup power
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/maintenance-handbook-diaspora-landlords"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the maintenance handbook for diaspora landlords
        </Link>
        .
      </P>
    </>
  );
}

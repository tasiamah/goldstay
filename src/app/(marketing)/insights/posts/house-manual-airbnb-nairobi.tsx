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
  slug: "house-manual-airbnb-nairobi",
  title: "The house manual is the cheapest member of staff you will ever hire",
  description:
    "A good house manual answers the questions guests would otherwise message you about at midnight, and prevents most of the small problems that end up in reviews. What to put in a Nairobi one, and what to leave out.",
  publishedAt: "2026-09-04",
  readingMinutes: 6,
  author: authors.editors,
  tags: ["Airbnb", "Nairobi", "Operations", "Short Let", "Tips", "Hospitality"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt: "House manual for a Nairobi short let",
};

export default function Article() {
  return (
    <>
      <Lede>
        Every question a guest has to ask is a small failure of preparation, and
        in Nairobi the questions are specific: how the water heater works, what
        happens when the power goes, whether the tap water is drinkable, how to
        get a taxi, what the guard needs. A house manual that answers those
        before they are asked does the work of a concierge for the price of
        printing it.
      </Lede>

      <H2 id="format">Make it findable and short</H2>

      <UL>
        <LI>
          <strong>Printed and left on the counter,</strong> not only a link in
          the platform app. A guest with no data, a flat phone or an unfamiliar
          app will not find a digital manual
        </LI>
        <LI>
          <strong>A single page for the essentials,</strong> visible from where
          they drop their bags. The rest can be a folder
        </LI>
        <LI>
          <strong>Written plainly, in short lines.</strong> Nobody reads
          paragraphs at midnight
        </LI>
        <LI>
          <strong>Photographs for anything unusual,</strong> the water heater
          switch particularly. One photograph replaces four sentences
        </LI>
        <LI>
          <strong>Not laminated in twelve pages.</strong> A long manual is an
          unread manual and it makes the apartment feel governed
        </LI>
      </UL>

      <Pullquote>
        Every question a guest has to ask is a small failure of preparation, and
        the same six questions come up in every Nairobi apartment.
      </Pullquote>

      <H2 id="essentials">The page that matters</H2>

      <OL>
        <LI>
          <strong>Wifi name and password,</strong> in large type. The first
          thing anybody looks for
        </LI>
        <LI>
          <strong>How to get hot water,</strong> including where the switch is
          and how long it takes. The most common Nairobi question by a distance.
          See{" "}
          <Link
            href="/insights/hot-water-airbnb-nairobi-guest-expectations"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            hot water and guest expectations
          </Link>
        </LI>
        <LI>
          <strong>What happens in a power cut,</strong> what stays on, and where
          the lamp is. See{" "}
          <Link
            href="/insights/backup-power-airbnb-nairobi-inverter-guide"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            backup power
          </Link>
        </LI>
        <LI>
          <strong>Drinking water,</strong> stated plainly: do not drink the tap,
          bottled is provided, here is where to buy more
        </LI>
        <LI>
          <strong>Who to call,</strong> with a name and a number, and roughly
          how quickly they answer
        </LI>
        <LI>
          <strong>Checkout time and what to do,</strong> in three lines. Not a
          list of chores
        </LI>
      </OL>

      <H2 id="nairobi">The Nairobi specifics</H2>

      <UL>
        <LI>
          <strong>Getting around.</strong> Which ride hailing apps work, a
          trusted driver’s number, and rough costs to the airport, the city
          centre and the nearest mall. Guests have no idea what a fair price is
          and this saves them from a bad first experience
        </LI>
        <LI>
          <strong>The building.</strong> The guard’s number, how the visitor
          book works, where the bins go, whether the lift needs a fob, where to
          park
        </LI>
        <LI>
          <strong>Security, stated calmly.</strong> The habits any resident
          follows, without dramatising the city. Guests appreciate practical
          advice and resent being frightened
        </LI>
        <LI>
          <strong>Groceries and pharmacy,</strong> nearest and best, with
          walking or driving time
        </LI>
        <LI>
          <strong>Three or four places to eat</strong> you would actually
          recommend. Three is advice, forty is a directory
        </LI>
        <LI>
          <strong>What the weather does,</strong> because visitors are always
          surprised by how cold a Nairobi evening gets and where the extra
          blanket is
        </LI>
        <LI>
          <strong>Emergency numbers</strong> and the nearest hospital, which
          takes one line and matters enormously on the rare occasion it is
          needed
        </LI>
      </UL>

      <Callout title="Write the rules as few and as warm as possible">
        A manual that opens with fifteen prohibitions sets the tone for the
        stay. Most house rules exist because of one bad guest years ago and now
        insult everyone else. Keep the ones that genuinely matter, put them at
        the end, and phrase them as requests. See{" "}
        <Link
          href="/insights/airbnb-guest-vetting-nairobi-house-rules"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          guest vetting and house rules
        </Link>
        .
      </Callout>

      <H2 id="maintain">Keep it true</H2>

      <P>
        A manual that describes a router that was replaced or a restaurant that
        closed is worse than none, because it teaches the guest to stop trusting
        it.
      </P>

      <UL>
        <LI>Review it every few months, and after any change to the apartment</LI>
        <LI>
          Update it whenever a guest asks something it should have answered.
          That question is data
        </LI>
        <LI>Check the phone numbers still work, particularly the guard’s</LI>
        <LI>
          Keep one master version across your units and vary only the local
          section, so a change is made once
        </LI>
      </UL>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        Every managed unit has a printed single page on the counter and a fuller
        folder, both maintained from one master. When a guest asks something the
        manual should have answered, it goes into the manual, which is why the
        questions get rarer over time.
      </P>

      <P>
        Handing the operation over is the other option: here is{" "}
        <Link
          href="/airbnb-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how our Nairobi short-stay management works
        </Link>
        .
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/self-check-in-smart-locks-airbnb-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          making self check in work
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/toiletries-and-consumables-airbnb-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          consumables and what to leave
        </Link>
        .
      </P>
    </>
  );
}

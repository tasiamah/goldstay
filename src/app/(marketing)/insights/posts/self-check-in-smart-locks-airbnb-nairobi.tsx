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
  slug: "self-check-in-smart-locks-airbnb-nairobi",
  title: "Self check in works in Nairobi, but only if you solve the gate",
  description:
    "A smart lock on your door does nothing if the guest cannot get past security at midnight. How self check in actually works in a Nairobi gated building, and when a person at the door is still the right answer.",
  metaDescription:
    "A smart lock on your door does nothing if the guest cannot get past security at midnight.",
  publishedAt: "2026-08-30",
  readingMinutes: 7,
  author: authors.editors,
  tags: ["Airbnb", "Nairobi", "Check In", "Short Let", "Tips", "Security"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt: "Self check in and smart locks for a Nairobi short let",
};

export default function Article() {
  return (
    <>
      <Lede>
        Guests filter for self check in, late flights into Nairobi are the norm
        rather than the exception, and a keybox is cheap. So hosts install one,
        send a code, and then discover that the actual obstacle was never the
        apartment door. It was the guard at the gate who has no idea who this
        person is at half past midnight.
      </Lede>

      <H2 id="gate">The gate is the real problem</H2>

      <P>
        A Nairobi apartment building typically has a manned gate, a visitor
        book, sometimes a second door into the lobby, and a lift that may need a
        fob. Every one of those is a point where an unannounced guest gets
        stopped, and being stopped at 1am in an unfamiliar city is the worst
        possible first impression.
      </P>

      <OL>
        <LI>
          <strong>Register the guest with security in advance,</strong> by name,
          in writing, on the day. Not verbally, and not the week before
        </LI>
        <LI>
          <strong>Give the guest the guard’s number</strong> and tell them to
          call on arrival. A guest who can phone ahead from the taxi is never
          stranded
        </LI>
        <LI>
          <strong>Tell them what the building is called and what it looks
          like.</strong> Nairobi addresses are approximate and map pins are
          often thirty metres out, on the wrong side of a wall
        </LI>
        <LI>
          <strong>Explain the visitor book,</strong> because being asked for
          identification and a signature is normal here and alarming if
          unexpected
        </LI>
        <LI>
          <strong>Establish whether the lift needs a fob</strong> after hours,
          and how a guest gets one
        </LI>
        <LI>
          <strong>Check whether the building has a rule about short lets
          entirely.</strong> Some do. See{" "}
          <Link
            href="/insights/hoa-and-management-company-fees-nairobi-explained"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            how management companies govern Nairobi buildings
          </Link>
        </LI>
      </OL>

      <Pullquote>
        Solve the gate and the door solves itself. Solve only the door and you
        have automated the easy half of the problem.
      </Pullquote>

      <H2 id="lock">Choosing the lock</H2>

      <UL>
        <LI>
          <strong>A keybox</strong> is cheap, needs no power and no wifi, and
          works during an outage. The code is shared and rarely changed, which
          is its weakness. Perfectly adequate for many properties
        </LI>
        <LI>
          <strong>A keypad lock with a changeable code</strong> is the sweet
          spot for most Nairobi short lets. A unique code per guest, expiring at
          checkout, no key to lose. Runs on batteries, so it survives a power
          cut
        </LI>
        <LI>
          <strong>A connected smart lock</strong> lets you issue and revoke
          codes remotely and see when the door opened. Genuinely useful across
          several units, and it depends on power and internet, which in Nairobi
          means it needs a fallback
        </LI>
        <LI>
          <strong>Whatever you choose, keep a physical key</strong> with someone
          nearby who can reach the property in twenty minutes. Every electronic
          lock eventually fails and it will do so at night
        </LI>
      </UL>

      <Callout title="Change the code between guests, every time">
        The whole security case for a keypad collapses if the code is the same
        one the guest three months ago had. Make the change part of the turnover
        checklist rather than something you remember to do. If your lock cannot
        take a per guest code, at least rotate it monthly and note the date. See{" "}
        <Link
          href="/insights/how-clean-is-clean-enough-airbnb-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the turnover standard
        </Link>
        .
      </Callout>

      <H2 id="battery">The failures that actually happen</H2>

      <UL>
        <LI>
          <strong>Flat batteries.</strong> The commonest smart lock failure by
          a wide margin. Replace on a schedule, not on a warning, and keep spares
          in the apartment
        </LI>
        <LI>
          <strong>The lock loses its internet connection</strong> and the code
          you issued remotely never arrived. Always confirm a new code works
          before the guest lands, not after
        </LI>
        <LI>
          <strong>A power cut takes the router down</strong> and with it your
          ability to manage the lock. Another argument for a UPS. See{" "}
          <Link
            href="/insights/backup-power-airbnb-nairobi-inverter-guide"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            backup power
          </Link>
        </LI>
        <LI>
          <strong>The guest arrives at the wrong building.</strong> Very common
          in Kilimani and Kileleshwa, where three similarly named apartment
          blocks sit on the same lane
        </LI>
        <LI>
          <strong>The guard changed shift</strong> and the new one was not told.
          Register in writing, in the book, so it survives the handover
        </LI>
      </UL>

      <H2 id="instructions">Write the arrival instructions properly</H2>

      <P>
        Send them the day before, not on arrival, and write them as though the
        guest is tired, has no data and has never been to Nairobi.
      </P>

      <UL>
        <LI>The building name, road, and a landmark that a driver will know</LI>
        <LI>A photograph of the gate, taken from the road</LI>
        <LI>The guard’s number and what to say</LI>
        <LI>Which floor, which door, and how to work the lift</LI>
        <LI>The code, and what to do if it does not work, with a name and a number</LI>
        <LI>
          Roughly what a taxi from the airport should cost, which quietly
          prevents the first bad experience of the trip
        </LI>
      </UL>

      <H2 id="greeting">When a person is still better</H2>

      <P>
        Self check in is a filter and a convenience, not an ideal. There are
        cases where meeting the guest is the higher standard.
      </P>

      <UL>
        <LI>First stay in a newly listed unit, where you want to watch the arrival work</LI>
        <LI>Long stays and corporate relocations, where the relationship pays</LI>
        <LI>Complicated buildings, until the process is proven</LI>
        <LI>Any guest who says it is their first time in Nairobi</LI>
      </UL>

      <P>
        The best arrangement is usually both: self check in available and
        advertised, with someone reachable and nearby who can appear if
        anything goes wrong.
      </P>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        Managed units run keypad entry with a code per stay, guests registered
        with security in writing on the day, and arrival instructions sent
        ahead with a photograph of the gate. Someone local holds a physical key
        and can reach the property, because the lock will eventually fail at
        midnight.
      </P>

      <P>
        See what else is covered under{" "}
        <Link
          href="/airbnb-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Goldstay’s Airbnb management in Nairobi
        </Link>
        .
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/airbnb-guest-vetting-nairobi-house-rules"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          guest vetting
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/airbnb-kilimani-2026-host-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the Kilimani host guide
        </Link>
        .
      </P>
    </>
  );
}

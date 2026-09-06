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
  slug: "backup-power-airbnb-nairobi-inverter-guide",
  title: "Backup power for a Nairobi short let: what actually needs to stay on",
  description:
    "Most Nairobi buildings have partial backup, which is worse for a guest than none because they expected it to work. Which circuits matter, what a modest inverter covers, and how to test what you actually have.",
  publishedAt: "2026-08-26",
  readingMinutes: 7,
  author: authors.editors,
  tags: ["Airbnb", "Nairobi", "Backup Power", "Short Let", "Tips", "Inverter"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt: "Backup power and inverters for a Nairobi short let",
};

export default function Article() {
  return (
    <>
      <Lede>
        Almost every Nairobi building advertises backup power. Very few of them
        mean that your apartment keeps working. Usually it means the corridor
        lights, the lifts, the borehole pump and the gate stay on, and your
        guest sits in the dark wondering why the generator they can hear is not
        helping them.
      </Lede>

      <H2 id="find-out">Find out what you actually have</H2>

      <P>
        Do not ask the agent, and do not read the brochure. Test it, which takes
        twenty minutes and settles the question permanently.
      </P>

      <OL>
        <LI>
          Ask the building manager to tell you the next planned generator test,
          or simply wait for the next outage and be in the apartment
        </LI>
        <LI>
          When the power goes, walk the unit. Do the lights work? The sockets?
          Which ones?
        </LI>
        <LI>
          Check the fridge, the router, the water pump and the water heater
          specifically
        </LI>
        <LI>
          Note how long the changeover takes. Two seconds is fine, ninety
          seconds means every call drops and every router reboots
        </LI>
        <LI>
          Ask how long the generator can run and who fuels it. A generator that
          runs for two hours is a different proposition from one that runs all
          day
        </LI>
      </OL>

      <Pullquote>
        Partial backup is worse than none for a guest, because the sound of a
        working generator while their lights are off reads as somebody else
        being looked after.
      </Pullquote>

      <H2 id="priorities">What actually needs to stay on</H2>

      <P>
        You do not need to run the whole apartment. You need to run the five
        things whose absence generates a complaint, and that is a much smaller
        and cheaper problem.
      </P>

      <UL>
        <LI>
          <strong>The router and fibre terminal.</strong> The single highest
          priority. Working internet during an outage turns a crisis into a
          non event, and it draws almost nothing
        </LI>
        <LI>
          <strong>Lights in the living area, kitchen and bathroom.</strong> Not
          every light. Enough to move around safely and not feel stranded
        </LI>
        <LI>
          <strong>Phone and laptop charging.</strong> One or two sockets is
          sufficient
        </LI>
        <LI>
          <strong>The fridge.</strong> Matters more on long stays, when a guest
          has actually bought food
        </LI>
        <LI>
          <strong>The water pump,</strong> if it is on your unit's supply rather
          than the building's. Worth establishing, because no power meaning no
          water turns one problem into two
        </LI>
      </UL>

      <P>
        Notice what is not on the list: air conditioning, the water heater, the
        oven and the washing machine. Those are heavy loads, guests can wait for
        them, and trying to cover them is what makes a backup system expensive.
      </P>

      <H2 id="options">The options, cheapest first</H2>

      <UL>
        <LI>
          <strong>A small UPS on the router.</strong> Very cheap, keeps the
          internet alive for a couple of hours, and it is the best value item in
          this entire article. Do this even if you do nothing else
        </LI>
        <LI>
          <strong>Rechargeable lamps and a torch,</strong> kept charged and
          somewhere the guest can find them in the dark, mentioned in the house
          manual. A stopgap rather than a solution, and better than nothing
        </LI>
        <LI>
          <strong>A modest inverter with a battery,</strong> wired to a dedicated
          circuit covering lights, sockets, the router and the fridge. This is
          the sensible answer for most Nairobi apartments and it is not a large
          expense
        </LI>
        <LI>
          <strong>A larger inverter with more battery capacity,</strong> if
          outages in your area are long or frequent, or if you are running a
          premium unit where a dark evening is unacceptable
        </LI>
        <LI>
          <strong>Solar plus battery,</strong> which makes sense over a long
          horizon and for a property you intend to hold. Excellent in Nairobi's
          climate. See{" "}
          <Link
            href="/insights/solar-and-backup-power-nairobi-rental-property"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            solar and backup power for Nairobi rentals
          </Link>
        </LI>
      </UL>

      <Callout title="Get the wiring done properly">
        An inverter needs a dedicated circuit installed by a qualified
        electrician, with the changeover done correctly. This is not a job for
        an improvised extension lead arrangement, and a badly wired inverter in
        a let apartment is a genuine safety and insurance problem. Keep the
        certificate, because your insurer may want it. See{" "}
        <Link
          href="/insights/airbnb-nairobi-insurance-damage-liability"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          insurance and liability
        </Link>
        .
      </Callout>

      <H2 id="tell">Tell the guest before it happens</H2>

      <P>
        Half the value of a backup system is the communication around it. A
        guest who has been told what to expect handles an outage calmly. A guest
        who has not assumes the property is broken.
      </P>

      <UL>
        <LI>
          Say in the house manual that outages happen occasionally in Nairobi
          and what stays on when one does
        </LI>
        <LI>
          Say where the rechargeable lamp is
        </LI>
        <LI>
          Say what will not work, so a guest is not standing at a cold shower
          wondering whether to call you
        </LI>
        <LI>
          Say what to do if it lasts more than an hour, and give them a name
        </LI>
        <LI>
          Do not oversell it in the listing. "Backup power for lights, sockets
          and internet" is accurate and sufficient. "Uninterrupted power" is a
          promise you will break
        </LI>
      </UL>

      <H2 id="maintenance">The part everyone forgets</H2>

      <P>
        Inverter batteries degrade, and they do it invisibly. A system that ran
        for four hours when installed may run for twenty minutes three years
        later, and you will discover this through a guest.
      </P>

      <UL>
        <LI>Test the inverter under load every few months, deliberately</LI>
        <LI>Note the battery age and expect to replace it on a cycle</LI>
        <LI>Check the UPS on the router too, which fails just as quietly</LI>
        <LI>
          Add a power test to the turnover checklist at least monthly. See{" "}
          <Link
            href="/insights/how-clean-is-clean-enough-airbnb-nairobi"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            the turnover standard and its resets
          </Link>
        </LI>
      </UL>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        We establish what a building's backup actually covers before taking on a
        short let, put the router on a UPS as standard, and recommend a modest
        inverter where the building leaves apartments dark. We describe backup
        accurately in listings rather than generously, because an
        overpromise here is a guaranteed review.
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/wifi-speed-airbnb-nairobi-what-guests-expect"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          wifi expectations
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/airbnb-kileleshwa-2026-host-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          why the building matters more than the suburb
        </Link>
        .
      </P>
    </>
  );
}

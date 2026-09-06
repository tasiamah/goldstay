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
  slug: "hot-water-airbnb-nairobi-guest-expectations",
  title: "Hot water is the number one Nairobi Airbnb complaint",
  description:
    "More Nairobi short let reviews are lost to showers than to anything else. Why the problem is usually pressure rather than temperature, what guests actually expect, and how to fix it properly.",
  publishedAt: "2026-08-23",
  readingMinutes: 6,
  author: authors.editors,
  tags: ["Airbnb", "Nairobi", "Hot Water", "Short Let", "Tips", "Kenya"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt: "Hot water and showers in a Nairobi Airbnb",
};

export default function Article() {
  return (
    <>
      <Lede>
        If you fix one thing in a Nairobi short let, fix the shower. Across the
        underperforming listings we have taken over, water is the most frequent
        cause of a review below four stars, and it beats cleanliness, noise and
        internet combined. It is also the complaint guests find hardest to
        forgive, because a cold shower at 6am ruins a morning in a way a slow
        router does not.
      </Lede>

      <H2 id="pressure">It is usually pressure, not temperature</H2>

      <P>
        Hosts hear "the shower was terrible" and buy a bigger water heater. That
        is frequently the wrong fix, because the water was hot and there was
        simply not enough of it arriving.
      </P>

      <UL>
        <LI>
          <strong>Low pressure feels cold</strong> even when the water is warm,
          because a thin stream loses heat before it reaches you and cannot warm
          your skin
        </LI>
        <LI>
          <strong>Gravity fed systems on lower floors</strong> can be genuinely
          weak. On the top floor under a roof tank, worse
        </LI>
        <LI>
          <strong>An old or clogged shower head</strong> costs almost nothing to
          replace and frequently solves the entire complaint
        </LI>
        <LI>
          <strong>Building water pressure varies by hour.</strong> Test at 6am
          and at 9pm, when everyone in the building showers, not at 11am
        </LI>
        <LI>
          <strong>A booster pump</strong> is the real answer where the building
          cannot deliver, and it is a modest cost against the reviews it saves
        </LI>
      </UL>

      <Pullquote>
        Test your own shower at six in the morning. Not at eleven, when the tank
        is full and the building is empty. Six, when your guest will be using
        it.
      </Pullquote>

      <H2 id="expectations">What guests actually expect</H2>

      <P>
        The bar is not luxurious. It is boringly consistent, and consistency is
        what most Nairobi units fail on.
      </P>

      <OL>
        <LI>
          Hot water available at any hour without warning anyone in advance
        </LI>
        <LI>
          Enough of it for two people to shower consecutively
        </LI>
        <LI>
          Pressure sufficient to rinse shampoo out of hair without effort
        </LI>
        <LI>
          A temperature that does not swing while they are standing in it
        </LI>
        <LI>
          Hot water at the kitchen sink and the basin, not only the shower
        </LI>
      </OL>

      <Callout title="The instruction problem">
        A large share of hot water complaints are not faults at all. The guest
        did not know they had to switch on a heater and wait, because nobody
        told them. If your system needs any action from the guest, that
        instruction has to be in the check in message, in the house manual and
        on a small label by the switch itself. Once is not communication, and a
        guest who has a cold shower on the first morning has already formed
        their opinion.
      </Callout>

      <H2 id="systems">Which system to fit</H2>

      <UL>
        <LI>
          <strong>Instant shower heater.</strong> Cheap, no waiting, unlimited
          duration, and the pressure is usually reduced. Fine for a studio or
          one bed with decent incoming pressure. The commonest choice and often
          the right one
        </LI>
        <LI>
          <strong>Electric storage tank.</strong> Better pressure and
          temperature stability, and it runs out. Size it for the maximum
          occupancy you accept, not the typical one, and leave it on
          continuously rather than expecting guests to plan ahead
        </LI>
        <LI>
          <strong>Solar with an electric backup element.</strong> Excellent
          running cost in Nairobi's climate, and the backup element is not
          optional. Solar alone after three cloudy days is a cold shower and a
          bad review
        </LI>
        <LI>
          <strong>Instant gas heater.</strong> Strong performance and endless
          hot water, with the significant caveat that a gas appliance in a short
          let needs correct installation, ventilation and a carbon monoxide
          alarm. Do not improvise this
        </LI>
      </UL>

      <H2 id="rules">Two operating rules</H2>

      <P>
        <strong>Leave it on.</strong> The single most common self inflicted
        version of this problem is a host who switches the heater off between
        guests to save electricity and forgets to switch it back on. The saving
        is trivial. The cost is a review. If you have a storage tank, leave it
        on during any stay, and put switching it on at the top of the turnover
        checklist.
      </P>

      <P>
        <strong>Test it yourself.</strong> Every month, shower in your own unit
        at an inconvenient hour. It is the only test that reflects the guest
        experience, and it finds problems that no inspection does.
      </P>

      <H2 id="checklist">The five minute fix list</H2>

      <UL>
        <LI>Replace the shower head. Cheap, immediate, frequently sufficient</LI>
        <LI>Descale it if you are keeping it</LI>
        <LI>Check the heater thermostat is not set low</LI>
        <LI>
          Confirm the heater is switched on and label the switch clearly
        </LI>
        <LI>
          Put the instruction in the check in message and the house manual
        </LI>
        <LI>
          Test hot water at the kitchen sink, which hosts routinely forget
        </LI>
        <LI>
          Test at 6am and 9pm on a weekday
        </LI>
      </UL>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        We test water pressure and temperature at peak hours before agreeing to
        run a short let, and we turn units down where the building genuinely
        cannot deliver, because that caps the rating no matter how well the unit
        is run otherwise. Where it is fixable, it gets fixed before the listing
        goes live.
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/how-clean-is-clean-enough-airbnb-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the turnover standard
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

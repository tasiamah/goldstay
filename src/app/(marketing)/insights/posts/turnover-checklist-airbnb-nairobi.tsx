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
  slug: "turnover-checklist-airbnb-nairobi",
  title: "The turnover checklist is what separates a business from a hobby",
  description:
    "Consistency is the whole product in short letting, and consistency comes from a written checklist rather than from a good cleaner. What a Nairobi turnover should cover, including the checks that have nothing to do with cleaning.",
  publishedAt: "2026-09-05",
  readingMinutes: 7,
  author: authors.editors,
  tags: ["Airbnb", "Nairobi", "Operations", "Short Let", "Tips", "Cleaning"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt: "Turnover checklist for a Nairobi short let",
};

export default function Article() {
  return (
    <>
      <Lede>
        A guest is not buying a clean apartment. They are buying the same clean
        apartment that the last forty guests photographed and reviewed. That
        sameness is the entire product, and it does not come from hiring
        somebody conscientious. It comes from writing down what has to be true
        at the end of every turnover and checking it.
      </Lede>

      <H2 id="why">Why a written list beats a good cleaner</H2>

      <UL>
        <LI>
          <strong>People have bad days,</strong> get rushed, and skip the thing
          they did last time. A list survives all of that
        </LI>
        <LI>
          <strong>Cover is possible.</strong> When your usual cleaner is
          unavailable, a list means the substitute produces roughly the same
          result
        </LI>
        <LI>
          <strong>It makes standards discussable</strong> without it being
          personal. The list was not done, rather than you did a bad job
        </LI>
        <LI>
          <strong>It scales.</strong> One unit runs on memory, four do not. See{" "}
          <Link
            href="/insights/scaling-airbnb-nairobi-one-to-five-units"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            scaling to five units
          </Link>
        </LI>
        <LI>
          <strong>It catches the non cleaning failures,</strong> which are the
          ones that actually cost you money
        </LI>
      </UL>

      <Pullquote>
        Half the items on a good turnover checklist have nothing to do with
        cleaning, and those are the half that prevent the expensive failures.
      </Pullquote>

      <H2 id="cleaning">The cleaning half</H2>

      <P>
        Room by room, specific rather than general. "Clean the bathroom" is not
        an instruction, it is a hope.
      </P>

      <UL>
        <LI>
          <strong>Bathroom:</strong> shower screen and grout, behind the toilet,
          plugholes and the drain, mirror, taps, extractor grille
        </LI>
        <LI>
          <strong>Kitchen:</strong> inside the fridge, inside the microwave, the
          hob and behind it, the kettle descaled, the bin washed rather than
          just emptied, cupboards checked for the previous guest's food
        </LI>
        <LI>
          <strong>Bedroom:</strong> fresh linen, under the bed, behind the
          headboard, pillow protectors checked, wardrobe emptied of hangers with
          nothing on them and things left behind
        </LI>
        <LI>
          <strong>Living:</strong> under and behind the sofa cushions, skirting,
          balcony floor and railing, windows and sills
        </LI>
        <LI>
          <strong>Everywhere:</strong> floors, switches and handles, and the
          smell of the place, which is the first thing a guest registers
        </LI>
      </UL>

      <P>
        The standard and how to hold it are covered in{" "}
        <Link
          href="/insights/how-clean-is-clean-enough-airbnb-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how clean is clean enough
        </Link>
        .
      </P>

      <H2 id="checks">The half that is not cleaning</H2>

      <OL>
        <LI>
          <strong>Top up the electricity meter</strong> to a set floor, every
          single time. The most preventable failure in Nairobi hosting. See{" "}
          <Link
            href="/insights/prepaid-electricity-tokens-airbnb-nairobi"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            managing prepaid electricity
          </Link>
        </LI>
        <LI>
          <strong>Run the hot water</strong> and confirm it arrives, at the
          shower, not the basin
        </LI>
        <LI>
          <strong>Test the wifi on a phone,</strong> connected to the guest
          network, not by looking at the router lights
        </LI>
        <LI>
          <strong>Change the door code</strong> and confirm the new one works
        </LI>
        <LI>
          <strong>Restock consumables to counted quantities,</strong> not by
          judgement
        </LI>
        <LI>
          <strong>Run every tap and pour water down the floor drains,</strong>
          which prevents smells and drain flies in a unit that stood empty
        </LI>
        <LI>
          <strong>Check every light bulb,</strong> including the ones in lamps
          nobody uses
        </LI>
        <LI>
          <strong>Check the remotes and their batteries,</strong> television and
          air conditioner
        </LI>
        <LI>
          <strong>Test the lock batteries and the UPS</strong> on a schedule
        </LI>
        <LI>
          <strong>Inspect linen and towels in daylight</strong> and retire
          anything worn rather than folding it away
        </LI>
        <LI>
          <strong>Register the incoming guest with security</strong> and confirm
          parking if it was booked
        </LI>
        <LI>
          <strong>Walk in as a guest would,</strong> at the end, and look at the
          apartment from the doorway
        </LI>
      </OL>

      <Callout title="Photograph the finished unit, every turnover">
        Five or six photographs at the end of each turnover take two minutes and
        do three jobs: they prove the standard was met, they date any damage to
        a specific stay, and for an owner abroad they are the only real evidence
        of what their property looks like. Keep them somewhere retrievable
        rather than in a messaging thread.
      </Callout>

      <H2 id="cadence">Not everything belongs on every turnover</H2>

      <UL>
        <LI>
          <strong>Every turnover:</strong> the full clean, consumables, the
          meter, hot water, wifi, the code, the photographs
        </LI>
        <LI>
          <strong>Monthly:</strong> inverter and UPS test under load, window
          screens, deeper appliance clean, linen inspection
        </LI>
        <LI>
          <strong>Quarterly:</strong> pest treatment, mattress rotation,
          descaling, a proper look at the grout and the sealant
        </LI>
        <LI>
          <strong>Annually:</strong> repaint the marks, replace the tired soft
          goods, reshoot the photographs if the apartment has changed
        </LI>
      </UL>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        Every managed unit runs the same written turnover, with the non cleaning
        checks weighted as heavily as the cleaning, and photographs filed at the
        end of each one. Owners see the standard rather than being asked to
        trust it, which is the point of the arrangement.
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/house-manual-airbnb-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the house manual
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/choosing-airbnb-management-company-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          choosing a management company
        </Link>
        .
      </P>
    </>
  );
}

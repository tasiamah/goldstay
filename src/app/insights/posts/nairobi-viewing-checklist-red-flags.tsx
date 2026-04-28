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
  slug: "nairobi-viewing-checklist-red-flags",
  title:
    "The Nairobi viewing checklist: 30 red flags to look for before you buy",
  description:
    "Most Kenyan property regret could have been avoided with 60 minutes of disciplined viewing. Here is the honest 2026 viewing checklist of 30 red flags to look for in a Nairobi property before you put down a deposit, organised by what to check and where.",
  publishedAt: "2025-09-22",
  readingMinutes: 7,
  author: authors.editors,
  tags: [
    "Nairobi",
    "Viewing",
    "Checklist",
    "Diligence",
    "Buying",
    "Red Flags",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Nairobi property viewing checklist 30 red flags 2026",
};

export default function Article() {
  return (
    <>
      <Lede>
        Most Kenyan property regret could have been
        avoided with 60 minutes of disciplined
        viewing. The signals are there if you know
        where to look. Here is the honest 2026
        viewing checklist of 30 red flags to look
        for in a Nairobi property before you put
        down any deposit.
      </Lede>

      <H2 id="exterior">Compound exterior and grounds</H2>

      <OL>
        <LI>
          Common areas tired (peeling paint, dead
          plants, broken pavers): compound
          governance is failing
        </LI>
        <LI>
          Backup generator fuel running low or
          unmaintained
        </LI>
        <LI>
          Water tanks visibly small for the
          building size
        </LI>
        <LI>
          Perimeter wall in poor condition or
          incomplete
        </LI>
        <LI>
          Security gate operation slow or manned
          by tired guards
        </LI>
        <LI>
          Visitors&rsquo; book missing or chaotic
        </LI>
        <LI>
          Cars parked in unauthorised spaces
          (signal of weak management)
        </LI>
      </OL>

      <H2 id="building">Building structure</H2>

      <OL>
        <LI>
          Visible cracks in walls (especially
          diagonal cracks; structural concern)
        </LI>
        <LI>
          Damp patches on lower floors (water
          ingress, drainage)
        </LI>
        <LI>
          Stained ceilings on top floors (roof
          leak)
        </LI>
        <LI>
          Visible mould (humidity, ventilation)
        </LI>
        <LI>
          Tile spalling or warped flooring
        </LI>
        <LI>
          Doors that do not close cleanly
          (foundation movement)
        </LI>
        <LI>
          Window frames misaligned
        </LI>
      </OL>

      <H2 id="services">Services and systems</H2>

      <OL>
        <LI>
          Run every tap; check pressure and
          consistency
        </LI>
        <LI>
          Test every light fitting and
          electrical socket
        </LI>
        <LI>
          Run the toilet; check the flush
          mechanism
        </LI>
        <LI>
          Test the hot water (immersion or
          solar)
        </LI>
        <LI>
          Check the kitchen appliances
        </LI>
        <LI>
          Listen for noise from neighbouring
          units (poor sound insulation)
        </LI>
        <LI>
          Cell signal inside the unit
        </LI>
        <LI>
          Internet provider availability for
          the building
        </LI>
      </OL>

      <H2 id="paperwork">Paperwork on the unit</H2>

      <OL>
        <LI>
          Title in seller&rsquo;s name (not a
          relative or company)
        </LI>
        <LI>
          Service charge paid up to date (ask
          for the latest receipts)
        </LI>
        <LI>
          County rates paid up to date
        </LI>
        <LI>
          Sectional Properties consent in place
          where applicable
        </LI>
        <LI>
          By-laws of the body corporate
          (restrictions on short-stay,
          alterations)
        </LI>
        <LI>
          Reserve fund position (request
          AGM minutes, audited accounts)
        </LI>
      </OL>

      <H2 id="general">General signals</H2>

      <OL>
        <LI>
          Seller pushing for fast completion
          without good reason
        </LI>
        <LI>
          Asking price out of line with
          comparable units in the same compound
        </LI>
        <LI>
          Seller refusing access to original
          title document
        </LI>
        <LI>
          Tenant in occupation refusing to
          show the unit at reasonable times
        </LI>
      </OL>

      <H2 id="bonus">Bonus checks</H2>

      <UL>
        <LI>
          Visit on a weekday and a weekend
          (different traffic, noise patterns)
        </LI>
        <LI>
          Visit during rain if you can
          (drainage and waterproofing)
        </LI>
        <LI>
          Visit at night (security, lighting,
          neighbourhood)
        </LI>
        <LI>
          Talk to existing residents in the
          compound (the most honest source)
        </LI>
      </UL>

      <Callout title="The viewing rule">
        The 30 minute viewing is enough to
        catch most of the red flags above.
        Buyers who rushed past viewings often
        rushed past the signals that would
        have stopped them.
      </Callout>

      <Pullquote>
        The buildings tell you everything if
        you give them time. The signals are
        not subtle once you know what to look
        for. The buyers who walk through with
        their eyes open get the best deals;
        the buyers who walk through with their
        emotions in front buy the most
        expensive ones.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For sourcing clients we run the viewing
        checklist on every property we
        recommend. Read also our pieces on{" "}
        <Link
          href="/insights/why-property-viewings-matter-buying-remotely"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          why property viewings matter
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/top-mistakes-kenyans-make-buying-property"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          top mistakes Kenyans make buying
          property
        </Link>
        .
      </P>
    </>
  );
}

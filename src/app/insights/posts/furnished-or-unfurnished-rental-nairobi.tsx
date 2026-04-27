import Link from "next/link";
import { authors, type PostMeta } from "./_shared";
import {
  Callout,
  H2,
  H3,
  LI,
  Lede,
  OL,
  P,
  Pullquote,
  UL,
} from "@/components/ArticleProse";

export const meta: PostMeta = {
  slug: "furnished-or-unfurnished-rental-nairobi",
  title:
    "Furnished or unfurnished? What actually rents better in Nairobi",
  description:
    "Specific rent premiums for furnished apartments by neighbourhood, the four-year break-even on furnishing, the right way to spec a furnished unit on a budget, and when to leave a property unfurnished even if the headline rent is lower.",
  publishedAt: "2026-01-21",
  readingMinutes: 7,
  author: authors.poonam,
  tags: ["Nairobi", "Furnished", "Rental", "ROI", "Strategy"],
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Furnished Nairobi apartment, rental ROI vs unfurnished comparison",
};

export default function Article() {
  return (
    <>
      <Lede>
        Furnishing a Nairobi apartment is one of those
        decisions that looks like a small operational
        question and turns out to be a 30 to 50% swing in
        net yield. Done well, in the right neighbourhood,
        for the right tenant base, furnishing pays for
        itself in roughly four years and increases tenant
        quality permanently. Done badly, you spend KES 1.2
        million on furniture that depreciates faster than
        your rent premium recovers it, and you end up with
        a unit that no quality tenant wants. Here is how to
        decide and how to do it well.
      </Lede>

      <H2 id="the-numbers">The numbers</H2>

      <P>
        Rough rent premium for furnished vs unfurnished, by
        neighbourhood, on long-term lets in Nairobi in 2026:
      </P>

      <UL>
        <LI>
          <strong>Westlands, Kilimani, Riverside:</strong> 25
          to 40% premium. Strong corporate, NGO, and
          short-stay-but-not-Airbnb demand. Furnished is the
          default expectation for the higher-paying segment.
        </LI>
        <LI>
          <strong>Lavington, Parklands:</strong> 15 to 25%
          premium. Mixed market: corporate families want
          unfurnished, expat singles want furnished. Either
          works depending on layout.
        </LI>
        <LI>
          <strong>Kileleshwa, Loresho:</strong> 10 to 20%
          premium, mostly on smaller units. 3 bed family
          tenants typically prefer unfurnished.
        </LI>
        <LI>
          <strong>Karen, Runda, Muthaiga:</strong> 5 to 15%
          premium, often zero. Tenant base ships their own
          furniture, sometimes by container, and prefers a
          blank canvas.
        </LI>
        <LI>
          <strong>South C, South B, Ngong Road:</strong> Zero
          to 10% premium. Local tenant base prefers
          unfurnished and often arrives with full
          furniture.
        </LI>
      </UL>

      <H2 id="cost-of-furnishing">Cost of furnishing properly</H2>

      <P>
        A clean, mid-spec furnishing of a 2 bed Nairobi
        apartment in 2026, suitable for the
        Kilimani-Westlands corporate market:
      </P>

      <UL>
        <LI>Living room: sofa, two chairs, coffee table, TV unit, TV. Roughly KES 250,000 to KES 350,000.</LI>
        <LI>Dining: table, six chairs, sideboard. KES 80,000 to KES 130,000.</LI>
        <LI>Master bedroom: bed, mattress, nightstands, wardrobe (if not built-in). KES 120,000 to KES 180,000.</LI>
        <LI>Second bedroom: bed, mattress, nightstand, wardrobe. KES 80,000 to KES 130,000.</LI>
        <LI>Kitchen: full set of cookware, crockery, cutlery, microwave, kettle, toaster. KES 50,000 to KES 90,000.</LI>
        <LI>Linen, towels, curtains, bedside lamps. KES 80,000 to KES 120,000.</LI>
        <LI>Appliances if not already there (fridge, washing machine, hob, oven). KES 200,000 to KES 350,000.</LI>
        <LI>Décor (rugs, art, mirrors). KES 50,000 to KES 100,000.</LI>
      </UL>

      <P>
        Total: KES 910,000 to KES 1,450,000 (USD 7,000 to
        USD 11,000) for a properly-spec&rsquo;d 2 bed.
        Skimp by 30% and you get a unit that photographs
        well but feels cheap on inspection, which costs you
        more in slow letting than the savings ever recover.
      </P>

      <H2 id="break-even">The four-year break-even</H2>

      <P>
        Take a Kilimani 2 bed at KES 180,000 a month
        unfurnished. With a 30% furnished premium, the same
        unit lets at KES 234,000 a month. Annual rent
        differential: KES 648,000. Furnishing cost: KES 1.2
        million. Pure payback period: 22 months.
      </P>

      <P>
        Layer in furniture depreciation (5 to 8 years
        typical useful life) and amortise: full break-even
        comes at roughly 3 to 4 years. Past that, the
        furnished premium is largely net to the landlord,
        with periodic refresh costs.
      </P>

      <P>
        Three caveats. First, the premium is real only in
        the right neighbourhoods. Second, the premium
        depends on the furnishing being good. Third, the
        depreciation schedule assumes reasonable tenant
        care, which means proper screening (read the{" "}
        <Link
          href="/insights/tenant-screening-nairobi-how-we-do-it"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          tenant screening piece
        </Link>
        ).
      </P>

      <Pullquote>
        Skimp by 30% and you get a unit that photographs
        well but feels cheap on inspection, which costs
        you more in slow letting than the savings ever
        recover.
      </Pullquote>

      <H2 id="how-to-spec">How to spec a furnished unit on a budget</H2>

      <OL>
        <LI>
          <strong>Mid-tier, not bottom-tier.</strong> The
          worst ROI is bottom-tier furnishing. The
          difference between &ldquo;cheap&rdquo; and
          &ldquo;mid&rdquo; is roughly 25% of cost and 100%
          of perceived quality.
        </LI>
        <LI>
          <strong>Neutral palette.</strong> Greys, creams,
          warm woods. Strong colour and pattern date
          quickly and narrow the tenant pool.
        </LI>
        <LI>
          <strong>One or two statement pieces.</strong> A
          textured rug, a real art piece, a brass-finish
          floor lamp. The unit photographs as designed
          rather than catalogued.
        </LI>
        <LI>
          <strong>Pay for the mattress.</strong> The
          mattress is the single most-felt piece of
          furniture. A KES 60,000 mattress and a KES
          25,000 mattress make the same first impression
          and entirely different second-month impressions.
        </LI>
        <LI>
          <strong>Real linen.</strong> 300 thread count
          cotton, white. Two full sets per bed.
        </LI>
        <LI>
          <strong>Small kitchen kit.</strong> Six of
          everything. Avoid 12-piece sets that signal
          intended self-catering Airbnb use to long-term
          tenants who will never use them.
        </LI>
      </OL>

      <H2 id="when-to-leave-unfurnished">
        When to leave a property unfurnished even at lower rent
      </H2>

      <UL>
        <LI>
          Karen, Runda, Muthaiga family lets. The premium
          does not exist; the operational complexity does.
        </LI>
        <LI>
          Properties already let to a long-term tenant who
          plans to stay. Furnishing mid-tenancy adds
          friction without rent benefit.
        </LI>
        <LI>
          Older buildings with marginal finish quality.
          Furnishing accelerates the perceived decline of
          the unit and creates damage liability without
          adequate rent compensation.
        </LI>
        <LI>
          Owners who personally use the property
          intermittently. Owner&rsquo;s personal furniture
          generally does not survive tenant turnover well,
          and dual-use furnishing is a recipe for
          mid-tenancy disputes.
        </LI>
      </UL>

      <Callout title="Half-furnished is usually the worst">
        White goods (fridge, washing machine, hob, oven)
        in but no soft furniture is a common compromise
        that pleases nobody. Long-term tenants want either
        full furnished or full unfurnished, not the
        middle. Pick a side.
      </Callout>

      <H2 id="how-we-handle-it">How we handle it</H2>

      <P>
        For new acquisitions, we run a furnishing ROI
        analysis as part of onboarding: target tenant
        profile, comparable rents in both modes, expected
        rent premium, and total furnishing cost. If
        furnishing makes sense, we coordinate the project
        directly: trusted suppliers, fixed budget,
        delivery and installation typically inside three
        weeks, and the landlord pays suppliers direct (no
        Goldstay markup).
      </P>

      <P>
        Read more on getting your unit ready to let on{" "}
        <Link
          href="/list-your-property"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          /list-your-property
        </Link>
        , or run rent scenarios in both modes on the{" "}
        <Link
          href="/yield-calculator"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          yield calculator
        </Link>
        .
      </P>
    </>
  );
}

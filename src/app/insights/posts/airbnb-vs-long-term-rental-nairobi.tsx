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
  slug: "airbnb-vs-long-term-rental-nairobi",
  title: "Airbnb or long term let? What actually pays more in Nairobi",
  description:
    "A specific, numbers-driven answer to the question every Nairobi landlord asks. When Airbnb wins, when long term wins, and the four properties that should never go on Airbnb regardless of yield.",
  publishedAt: "2025-09-04",
  readingMinutes: 9,
  author: authors.research,
  tags: ["Nairobi", "Airbnb", "Rental Strategy", "Yield"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Nairobi apartment, Airbnb vs long term rental yield comparison",
};

export default function Article() {
  return (
    <>
      <Lede>
        We get this question on every onboarding call. The honest
        answer is that it depends on the property, but a 90 second
        answer is this: in 2026, a well-positioned 1 or 2 bed in
        Kilimani, Westlands or Lavington will gross roughly 1.7 to
        2.0 times the long-term equivalent on Airbnb, after fees.
        A standard 3 bed in Kileleshwa or Karen will earn about
        the same either way and is usually better long-term. A
        family compound in Runda or Muthaiga should never go on
        Airbnb at all. Read on for why.
      </Lede>

      <H2 id="numbers">Real numbers from the last twelve months</H2>

      <P>
        Below are anonymised but real cases from properties we
        manage in Nairobi between April 2025 and March 2026. All
        figures are after every fee, every tax, and every vacancy
        gap, in USD at the rate the landlord actually received.
      </P>

      <H3 id="case-one">
        Case 1: Two-bed in Kilimani, KES 180,000 long-term equivalent
      </H3>

      <P>
        On long-term, this unit grossed KES 2.16 million annually,
        netted USD 13,400 after the 10% management fee, MRI tax,
        and service charge.
      </P>

      <P>
        On Airbnb at an average daily rate of USD 95 and 71%
        occupancy, the same unit grossed USD 24,600. After the
        20% management fee, cleaning costs, the 1.5% Tourism Levy,
        VAT pass-through, and a 4% allowance for booking platform
        fees, the landlord netted USD 16,100. About 20% better
        than long-term, but with materially more operational
        complexity.
      </P>

      <H3 id="case-two">Case 2: Three-bed in Kileleshwa</H3>

      <P>
        Long-term: KES 280,000 a month, netted USD 21,000 a year.
      </P>

      <P>
        Airbnb attempt: average daily rate of USD 130, 52%
        occupancy. Three beds in Kileleshwa appeals to families
        and longer leisure stays, both of which are lower-volume
        and lower-rate per night than the corporate one and two
        beds in Kilimani. Net was USD 19,800. The landlord moved
        back to long-term after eight months.
      </P>

      <H3 id="case-three">Case 3: Four-bed compound in Runda</H3>

      <P>
        Long-term lease to a corporate diplomat tenant: USD 5,400
        a month, netted USD 56,000 a year over a three year lease.
      </P>

      <P>
        Airbnb potential, modelled but never executed, would have
        been roughly USD 38,000 a year and a major risk to the
        property condition and the neighbour relationships. Some
        properties are designed for long-term tenancy and lose
        money the moment they go onto a nightly platform.
      </P>

      <Pullquote>
        Some properties are designed for long-term tenancy and
        lose money the moment they go onto a nightly platform.
      </Pullquote>

      <H2 id="when-airbnb-wins">When Airbnb wins</H2>

      <P>
        Airbnb beats long-term consistently in Nairobi when these
        conditions hold:
      </P>

      <UL>
        <LI>
          One or two bed apartment in Kilimani, Westlands,
          Lavington, Riverside, or Parklands. These are the
          neighbourhoods with the strongest corporate, NGO, and
          medical-tourism short-stay demand.
        </LI>
        <LI>
          Within a 15 minute drive of a major hospital cluster
          (Aga Khan, MP Shah, Nairobi Hospital). Medical tourism
          is the single most underrated demand source in Nairobi
          short-stay.
        </LI>
        <LI>
          Building permits short-stay activity. A growing number of
          Nairobi apartment management committees have banned or
          restricted Airbnb. Confirm before listing.
        </LI>
        <LI>
          Light, modern interior, ideally with a balcony, fast
          WiFi, blackout curtains, full work-from-home setup.
        </LI>
        <LI>
          Owner is comfortable with a small but real risk profile:
          guest damage, neighbour complaints, the occasional
          difficult review.
        </LI>
      </UL>

      <H2 id="when-long-term-wins">When long-term wins</H2>

      <UL>
        <LI>
          Three-plus bed family unit. Demand is from corporate
          relocators on multi-year leases. Average daily rate on
          Airbnb is high but occupancy is low, so net rarely beats
          long-term.
        </LI>
        <LI>
          Karen, Runda, Muthaiga, Lower Kabete. Buildings and
          neighbourhoods are not set up for transient guests, and
          security culture often prohibits short-stay.
        </LI>
        <LI>
          Buildings without 24/7 reception or concierge. Airbnb
          economics depend on smooth check-in. Owner-managed key
          handovers from 6,000 miles away rarely work.
        </LI>
        <LI>
          Tenant pipeline already strong. If the unit re-lets in
          under 30 days every cycle, the long-term yield is hard
          to beat.
        </LI>
      </UL>

      <H2 id="the-four-never">The four properties that should never go on Airbnb</H2>

      <OL>
        <LI>
          Properties in compounds with shared common areas (pool,
          gym, security gate) where neighbours have established
          objections. The cost of escalating disputes vastly
          exceeds any additional revenue.
        </LI>
        <LI>
          Buildings with explicit short-stay bans in the
          management committee bylaws. The management committee
          can fine you, restrict access, and ultimately refuse to
          renew the unit&rsquo;s good standing.
        </LI>
        <LI>
          Heritage homes or properties with high-value finishes
          that cannot be replaced if damaged. The math always
          loses on a single broken object.
        </LI>
        <LI>
          Anything where the owner&rsquo;s personal use is part of
          the calculation. Mixed-use Airbnb almost always
          underperforms because the lockout periods break
          algorithm visibility.
        </LI>
      </OL>

      <Callout title="What actually swings the answer">
        Building rules. We routinely see owners assume their
        building permits short-stay, list, and get warned by the
        management committee within two weeks. Always pull the
        latest building bylaws before deciding. We do this as a
        first step in any onboarding.
      </Callout>

      <H2 id="hybrid">The hybrid model nobody talks about</H2>

      <P>
        For a small subset of properties, neither pure Airbnb nor
        pure long-term is correct. The hybrid is a 30 to 90 day
        corporate stay model: priced like Airbnb, contracted like
        long-term, sourced through corporate relocation channels
        (NGO, embassy, oil and gas rotations, tech consulting).
      </P>

      <P>
        Hybrid pricing tends to land at 1.3 to 1.5 times long-term
        rent, with much lower turnover than Airbnb and no platform
        fees. It works in Westlands, Kilimani, Lavington and
        select Karen properties. We run it on roughly 15% of the
        portfolio.
      </P>

      <H2 id="how-to-decide">How to actually decide</H2>

      <P>
        Three steps. First, verify your building rules. Second,
        run the property through the{" "}
        <Link
          href="/yield-calculator"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          yield calculator
        </Link>{" "}
        on both modes. The calculator uses live Nairobi short-stay
        comparables and live long-term rents per neighbourhood,
        and shows net after every fee. Third, talk to a manager
        who runs both. Numbers on paper are necessary but not
        sufficient. Operational fit is what determines whether
        the higher-yield model survives contact with reality.
      </P>

      <P>
        If you want our specific recommendation for your unit,
        send the address on{" "}
        <Link
          href="/list-your-property"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          this form
        </Link>{" "}
        and we will model both modes against the actual building,
        the actual neighbourhood, and the actual unit specifics.
        No charge for the analysis.
      </P>
    </>
  );
}

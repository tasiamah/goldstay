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
  slug: "how-much-can-you-earn-airbnb-nairobi-2026",
  title: "How much can you actually earn from an Airbnb in Nairobi?",
  description:
    "The arithmetic behind Nairobi short let income in 2026: occupancy, achieved rate, and the six costs that separate gross revenue from what reaches your account. Worked through on a real one bed.",
  publishedAt: "2026-07-29",
  readingMinutes: 9,
  author: authors.research,
  tags: ["Airbnb", "Nairobi", "Yield", "Short Let", "Returns", "Kenya"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt: "How much can you earn from Airbnb in Nairobi 2026",
};

export default function Article() {
  return (
    <>
      <Lede>
        Every Nairobi host quotes a nightly rate. Almost none of them can tell
        you their net per night after cleaning, consumables, commission, voids
        and replacement. The gap between those two numbers is where the
        disappointment lives, and it is usually 40 to 50 percent wide. Here is
        the honest arithmetic.
      </Lede>

      <H2 id="formula">The only formula that matters</H2>

      <P>
        Annual net equals nights booked, multiplied by achieved rate, minus
        variable cost per booking, minus fixed annual cost. Four terms, and
        hosts habitually get three of them wrong.
      </P>

      <UL>
        <LI>
          <strong>Nights booked</strong> is not your occupancy target. It is
          what the calendar actually filled, including the wet weeks
        </LI>
        <LI>
          <strong>Achieved rate</strong> is not your listed rate. It is what you
          received after discounts, long stay reductions and the nights you
          dropped the price to fill
        </LI>
        <LI>
          <strong>Variable cost</strong> scales with bookings, not with
          revenue. This is why a run of one night stays can be less profitable
          than a quieter month
        </LI>
        <LI>
          <strong>Fixed cost</strong> runs whether or not anyone books. Service
          charge, internet, subscriptions, insurance
        </LI>
      </UL>

      <Pullquote>
        Two hosts with the same nightly rate and the same occupancy can have net
        incomes that differ by half, purely on average length of stay.
      </Pullquote>

      <H2 id="occupancy">What occupancy to actually model</H2>

      <P>
        This is where most projections break. Hosts model the good months and
        then annualise them.
      </P>

      <UL>
        <LI>
          A well run, well located, well reviewed unit can hold a strong annual
          occupancy. That is the ceiling, not the plan
        </LI>
        <LI>
          A competent new unit in a competitive suburb, in its first year, with
          few reviews, will sit well below that
        </LI>
        <LI>
          Nairobi has genuine seasonality. December and conference weeks are
          strong, the long rains are not, and January is quieter than people
          expect
        </LI>
        <LI>
          Occupancy and rate trade against each other. You can fill any calendar
          at a low enough price, which is not the same as earning
        </LI>
      </UL>

      <Callout title="Model at 55 percent">
        Build your case at 55 percent occupancy. If the unit works there, the
        good years are upside. If it only works at 80 percent, you are betting
        on a market that has added supply every year since 2021, and the bet is
        against you.
      </Callout>

      <H2 id="costs">The six costs that eat the gross</H2>

      <H3>1. Cleaning and laundry</H3>

      <P>
        Charged per turnover, not per night. On short average stays this is
        frequently the largest single operating cost in the business, and it is
        the one hosts most often leave out of the spreadsheet entirely because
        the guest pays a cleaning fee. The cleaning fee rarely covers the real
        cost of a proper turnover plus laundry.
      </P>

      <H3>2. Consumables</H3>

      <P>
        Toiletries, tea, coffee, drinking water, cleaning products, bin liners,
        bulbs, batteries. Individually trivial, collectively a real line. Guests
        also take things, which is normal and should be budgeted rather than
        resented.
      </P>

      <H3>3. Utilities</H3>

      <P>
        Guests do not conserve. Air conditioning runs all night, hot water runs
        long, lights stay on in empty rooms. Budget meaningfully above a long
        term tenant's consumption for the same unit.
      </P>

      <H3>4. Channel commission</H3>

      <P>
        Airbnb and Booking.com take their share before anything reaches you, and
        Booking.com generally takes more. If you are on both, your blended
        commission is higher than the number you remember from signing up.
      </P>

      <H3>5. Replacement and wear</H3>

      <P>
        Hospitality wear is not residential wear. Linen greys, towels thin,
        glassware breaks, kettles die, remote controls disappear, the sofa takes
        a year of abuse in a year. Provision for it monthly or it arrives as a
        shock annually.
      </P>

      <H3>6. Void nights</H3>

      <P>
        The empty nights still carry service charge, internet and the standing
        cost of holding a furnished unit. This is the cost that makes the
        difference between a short let and a long let, because a long let has
        almost none of it.
      </P>

      <H2 id="worked">A worked example, structurally</H2>

      <P>
        Take a furnished one bed in a competitive Nairobi suburb, listed at a
        typical mid market nightly rate, in its second year with a solid review
        history. Walk it through in order:
      </P>

      <OL>
        <LI>
          Start from nights actually booked at 55 to 65 percent occupancy, not
          365
        </LI>
        <LI>
          Apply achieved rate, which after weekly discounts and fill nights is
          commonly 10 to 20 percent below the listed rate
        </LI>
        <LI>
          Deduct channel commission from that gross
        </LI>
        <LI>
          Deduct cleaning and laundry per turnover, using your real average stay
          length rather than a hoped for one
        </LI>
        <LI>
          Deduct consumables and the utility premium over a long let
        </LI>
        <LI>
          Deduct a monthly replacement provision
        </LI>
        <LI>
          Deduct fixed costs across all twelve months, including the empty ones
        </LI>
        <LI>
          Deduct management if someone else is running it, or price your own
          hours honestly if you are
        </LI>
      </OL>

      <P>
        Done properly, the typical outcome for a decent Nairobi one bed is a net
        that beats the equivalent long let, but by less than the headline
        suggests, and with materially more work and more variance. For a
        meaningful minority of units, it loses. Our{" "}
        <Link
          href="/yield-calculator"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          yield calculator
        </Link>{" "}
        runs this structure for your own numbers.
      </P>

      <H2 id="drivers">What actually moves the number</H2>

      <P>
        Ranked by how much difference they make, which is not the order hosts
        usually work in:
      </P>

      <OL>
        <LI>
          <strong>Location.</strong> Unfixable later, and it decides your
          demand floor
        </LI>
        <LI>
          <strong>Average length of stay.</strong> Longer stays cut cleaning
          cost per night and raise net dramatically. This is the most
          underrated lever in the business
        </LI>
        <LI>
          <strong>Reviews and rating.</strong> They drive ranking, ranking
          drives visibility, visibility lets you hold rate
        </LI>
        <LI>
          <strong>Photographs.</strong> Cheap, one off, and they gate whether
          anyone sees the rest
        </LI>
        <LI>
          <strong>Pricing discipline.</strong> Moving rate with demand rather
          than setting it once
        </LI>
        <LI>
          <strong>Reliability of water, power and internet.</strong> Not a
          revenue driver so much as a protection against the reviews that
          destroy one
        </LI>
      </OL>

      <Callout title="Chase length of stay">
        A unit averaging five night stays is a far better business than the same
        unit averaging two, at the same occupancy and rate. Fewer turnovers,
        less laundry, less wear, fewer check ins, fewer chances for something to
        go wrong. Relocation and corporate guests are worth courting for exactly
        this reason.
      </Callout>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        We model short lets at conservative occupancy and show owners the full
        cost stack rather than a gross revenue figure, because the gross figure
        is how people end up disappointed. Where the numbers do not support a
        short let, we say so and suggest the long let instead.
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/airbnb-nairobi-complete-host-guide-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the complete Airbnb Nairobi host guide
        </Link>
        ,{" "}
        <Link
          href="/insights/highest-yielding-nairobi-short-let-suburbs-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          highest yielding Nairobi short let suburbs
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/why-nairobi-airbnb-hosts-losing-money-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          why Nairobi Airbnb hosts are losing money
        </Link>
        .
      </P>
    </>
  );
}

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
  slug: "buying-vs-building-nairobi-which-makes-sense",
  title:
    "Buying versus building in Nairobi: which actually makes sense for a diaspora investor",
  description:
    "Self-build looks cheaper per square metre than buying ready, and on a clean spreadsheet it often is. The question is whether the spreadsheet survives contact with reality. Here is the honest comparison for diaspora investors weighing land plus build against simply buying a finished apartment or house in Nairobi.",
  publishedAt: "2026-04-25",
  readingMinutes: 9,
  author: authors.poonam,
  tags: ["Nairobi", "Buying", "Self Build", "Construction", "Diaspora", "Investment"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Construction site in Nairobi, comparing buying ready property versus building from land",
};

export default function Article() {
  return (
    <>
      <Lede>
        Every diaspora investor we meet in Karen, Runda or
        Lavington has, at some point, run the build-it-yourself
        spreadsheet. Buy a quarter-acre plot for KES 25m,
        spend KES 18m on a four-bedroom build, total spend
        KES 43m, market value at completion KES 60m. Instant
        equity of 30 to 40 percent. The numbers always look
        beautiful. The reason most of those plots sit half
        finished for three years is that the spreadsheet
        leaves out about a quarter of the actual cost and
        almost all of the time.
      </Lede>

      <P>
        This is the honest comparison: buying a finished
        property in Nairobi versus buying land and building.
        Both work. Neither is universally better. The right
        answer depends on your time, your tolerance for
        on-the-ground project management, and how much of
        your equity gain you actually capture once the project
        is live.
      </P>

      <H2 id="the-equity-argument">The equity argument and where it leaks</H2>

      <P>
        The case for self-build rests on a real phenomenon.
        Land plus construction in good Nairobi suburbs
        commonly costs 25 to 35 percent less than the same
        finished house at market price. On a clean,
        professionally-managed build with land secured at a
        fair price, that equity gap is real and bankable.
      </P>

      <P>
        It leaks in five places:
      </P>

      <OL>
        <LI>
          <strong>Land overpayment.</strong> Diaspora buyers
          consistently pay 10 to 20 percent above local
          comparable prices for plots, especially in Karen,
          Runda, Kitisuru and Rosslyn. Sellers with informal
          networks know who is bidding from London and Dubai
          and price accordingly. Half the equity advantage
          can disappear here before the foundation is poured.
        </LI>
        <LI>
          <strong>Construction cost overrun.</strong> A KES
          18m budget on a four-bedroom build commonly
          delivers at KES 21m to KES 24m. Not always due to
          mismanagement; concrete prices, steel prices, and
          finishing materials all moved sharply between 2023
          and 2026. Build a 15 to 20 percent contingency in
          from the start, or you will run out of money at
          finishing.
        </LI>
        <LI>
          <strong>Time cost.</strong> A typical four-bed
          build in Nairobi runs 14 to 22 months from
          ground-breaking. During that time you are
          collecting zero rent and paying loan interest if
          the build is financed. The ready alternative would
          have been earning all of it.
        </LI>
        <LI>
          <strong>Diaspora oversight tax.</strong> Without
          someone you trust on the ground checking the
          contractor weekly, the typical diaspora build loses
          5 to 10 percent of budget to skim, substitution of
          materials, and quietly inflated invoices. We have
          seen builds where the cement bag count on site did
          not match the cement bag count on the invoices by
          a margin of 30 percent.
        </LI>
        <LI>
          <strong>Resale liquidity.</strong> Custom-built
          homes are harder to sell at full valuation than
          standardised compound stock. The buyer pool is
          smaller and more particular about taste.
        </LI>
      </OL>

      <H2 id="when-build-wins">When self-build genuinely wins</H2>

      <UL>
        <LI>
          You have a trusted relative or business partner on
          the ground who can be at site three or more times a
          week.
        </LI>
        <LI>
          You are building a long-term family home, not an
          investment. The equity gap matters less, the
          customisation matters more.
        </LI>
        <LI>
          You are working with a known architect and a known
          contractor who has built two or more nearby homes
          recently. Reputation locally is the single biggest
          predictor of build quality.
        </LI>
        <LI>
          You can hold the property for at least 7 to 10
          years post-completion. The shorter the hold, the
          more the time cost dominates.
        </LI>
        <LI>
          You have access to capital that is not earning a
          meaningful return elsewhere. Tying up KES 40m for
          two years is much cheaper if the alternative is a
          1 to 2 percent USD deposit account.
        </LI>
      </UL>

      <H2 id="when-buying-wins">When buying ready is the right call</H2>

      <UL>
        <LI>
          You want the rental income within 60 to 90 days,
          not 18 to 22 months from now.
        </LI>
        <LI>
          You cannot or do not want to be at site weekly.
          Diaspora self-build without strong oversight is the
          single most expensive way to enter the Nairobi
          market.
        </LI>
        <LI>
          You are building a portfolio of three to ten
          investment units rather than a single legacy home.
          Standardised apartment stock is far easier to manage
          at scale.
        </LI>
        <LI>
          You want the option to sell within five years.
          Standard apartment compounds in Westlands, Kilimani,
          Lavington and Kileleshwa have well-developed
          comparable price trails and broader buyer pools than
          custom homes.
        </LI>
      </UL>

      <H2 id="cost-comparison">A direct cost comparison</H2>

      <P>
        Take a four-bed family home target in Karen.
      </P>

      <P>
        Self-build path:
      </P>

      <UL>
        <LI>
          Land: quarter acre plot, around KES 25m to 35m
          depending on micro-location and frontage
        </LI>
        <LI>
          Build cost: KES 18m to 22m for a 350 square metre
          four-bed home at decent finish
        </LI>
        <LI>
          Architect, structural, MEP fees: 7 to 10% of build
          cost, so KES 1.3m to 2.2m
        </LI>
        <LI>
          NCA, NEMA, Nairobi County permits and approvals:
          KES 250,000 to KES 600,000 plus 1 to 3 months of
          calendar time
        </LI>
        <LI>
          Contingency at 15 percent: roughly KES 3m
        </LI>
        <LI>
          Total: roughly KES 47m to KES 62m, calendar time 18
          to 26 months
        </LI>
      </UL>

      <P>
        Buy ready path:
      </P>

      <UL>
        <LI>
          Recently completed comparable four-bed in Karen:
          KES 60m to KES 75m
        </LI>
        <LI>
          Buyer transaction costs (stamp duty, legal,
          valuation): 4 to 5%, so KES 2.4m to 3.7m
        </LI>
        <LI>
          Total: roughly KES 62m to KES 79m, calendar time 8
          to 12 weeks
        </LI>
      </UL>

      <P>
        Real equity advantage of self-build, before time and
        oversight risk: roughly 15 to 25 percent. After
        realistic adjustments for diaspora oversight tax and
        the lost rental on the alternative: closer to 8 to
        15 percent. Meaningful, but not the 30 to 40 percent
        the napkin maths suggested.
      </P>

      <Callout title="The honest summary">
        For a single legacy family home with strong on-the-ground
        oversight, self-build can clear 10 to 15 percent of real
        equity advantage. For an investment portfolio, ready
        property wins on time, simplicity, and resale liquidity
        almost every time.
      </Callout>

      <H2 id="diaspora-failure-mode">The diaspora self-build failure mode</H2>

      <P>
        We are called in once or twice a year to a half-built
        home in Karen, Runda or Kitisuru where the diaspora
        owner has spent KES 25m, the contractor has gone
        quiet, the architect has not been paid in three
        months, and the structure has been standing under
        rain for half a year. It is recoverable. It is
        expensive. The single piece of advice that would have
        prevented every one of those calls: do not start a
        self-build remotely without a paid, contracted,
        independent project manager who reports to you weekly
        and has the authority to stop work if quality slips.
      </P>

      <Pullquote>
        The diaspora self-build that gets stuck for three
        years is almost always the one that started without
        a paid, contracted project manager separate from
        the contractor.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        Goldstay does not run construction projects directly.
        Where clients want to self-build, we make introductions
        to two architecture practices and three independent
        project management firms in Nairobi we have worked
        with on client homes. We are happy to provide the
        on-the-ground monitoring layer (weekly site visits,
        photo updates, payment authorisation against milestones)
        as a separate service.
      </P>

      <P>
        Where clients want to buy ready, our{" "}
        <Link
          href="/property-sourcing"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          property sourcing service
        </Link>{" "}
        runs the entire purchase from offer letter to
        registered title. See also our{" "}
        <Link
          href="/insights/ready-property-vs-off-plan-nairobi-which-to-buy"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          ready versus off-plan piece
        </Link>{" "}
        for the third option in this comparison.
      </P>
    </>
  );
}

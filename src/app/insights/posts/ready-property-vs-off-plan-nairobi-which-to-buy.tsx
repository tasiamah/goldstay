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
  slug: "ready-property-vs-off-plan-nairobi-which-to-buy",
  title:
    "Ready property versus off-plan in Nairobi: which to buy in 2026",
  description:
    "Off-plan in Nairobi often looks 15 to 25 percent cheaper on paper than ready stock, but the real cost gap is much narrower once delivery risk, opportunity cost of cash and finishing variance are priced in. Here is how to think about ready versus off-plan as a diaspora buyer.",
  publishedAt: "2026-04-24",
  readingMinutes: 8,
  author: authors.poonam,
  tags: ["Nairobi", "Buying", "Off Plan", "Ready Property", "Diaspora", "Investment"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Nairobi skyline showing ready apartments and off-plan developments under construction",
};

export default function Article() {
  return (
    <>
      <Lede>
        Almost every diaspora buyer we speak to in 2026 starts
        with the same instinct: off-plan is cheaper, so off-plan
        is better. The headline numbers reinforce that. Off-plan
        2 bed apartments in Kilimani or Westlands list for KES
        14m to 17m, ready and recently completed equivalents
        list for KES 17m to 22m. On paper, off-plan saves you
        15 to 25 percent. In practice, the real gap is much
        narrower once you price in delivery risk, the
        opportunity cost of locked-up deposits, and the
        variance in finishing quality at handover.
      </Lede>

      <P>
        This piece is not a blanket recommendation either
        way. Off-plan can be the right choice and ready can be
        the right choice. The question is when, and what to
        protect against.
      </P>

      <H2 id="ready-defined">What ready property actually means</H2>

      <P>
        Ready means the property is built, has a Certificate
        of Occupation (or sectional title), is connected to
        utilities, and can be inspected, valued and rented
        from the day of completion. The buyer takes possession
        within 60 to 90 days of signing the sale agreement. The
        title is in the seller&rsquo;s name today and transfers
        to yours through the standard{" "}
        <Link
          href="/insights/sale-agreement-stage-buying-property-kenya"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          conveyancing process
        </Link>
        .
      </P>

      <H2 id="off-plan-defined">What off-plan really means</H2>

      <P>
        Off-plan means you are buying a unit that does not yet
        exist or is partly built. You sign a sale agreement
        with the developer, pay an initial deposit (10 to 20
        percent), and pay the balance in milestone tranches as
        construction progresses (typically 5 to 10 tranches
        over 12 to 24 months). Title transfers on completion,
        which is anywhere between the developer&rsquo;s
        promised date and 6 to 18 months after.
      </P>

      <H2 id="financial-gap">The real financial gap, modelled</H2>

      <P>
        Take a Kilimani 2 bed at KES 17m off-plan, completing
        in 18 months, versus the equivalent ready unit at KES
        21m. The off-plan saves KES 4m on paper.
      </P>

      <P>
        Now adjust:
      </P>

      <UL>
        <LI>
          <strong>Lost rental during construction.</strong> The
          ready unit rents from month one at roughly KES
          150,000 per month gross. Over 18 months that is KES
          2.7m of rent you do not earn from the off-plan.
          Net of the 10% management fee, the 7.5% MRI tax,
          service charge and rates, the lost net is closer
          to KES 1.9m.
        </LI>
        <LI>
          <strong>Cost of capital.</strong> Your tranche
          payments to the developer are dead money for 18
          months. At a 5% opportunity cost (a conservative
          number for diaspora capital that could otherwise
          sit in a deposit), KES 17m for an average 9 months
          (since payments stagger) costs roughly KES 640,000.
        </LI>
        <LI>
          <strong>Finishing variance.</strong> Off-plan
          handovers in Nairobi commonly come with KES 200,000
          to KES 800,000 of snag work the developer either
          refuses or partly fixes. Build in KES 400,000 for
          this on average.
        </LI>
        <LI>
          <strong>Risk of delay or non-delivery.</strong>{" "}
          Hardest to put a number on, easiest to underestimate.
          Even with a reputable developer, an 18 month
          programme commonly delivers in 22 to 26 months.
          Each month of delay costs another KES 100,000 to
          KES 150,000 net.
        </LI>
      </UL>

      <P>
        Adjusted gap on this example: KES 4m headline saving
        becomes roughly KES 1m of real saving, before any
        delay or default risk.
      </P>

      <Callout title="Rule of thumb">
        Off-plan in Nairobi typically saves you 4 to 8
        percent of the price in real terms, not the 15 to 25
        percent the headline suggests. Anything tighter than
        that and the risk-adjusted return on ready is
        better.
      </Callout>

      <H2 id="when-off-plan-wins">When off-plan is the right call</H2>

      <OL>
        <LI>
          The developer has at least three previous projects
          delivered on or near time. Pull the names, find
          the buildings, and confirm with two or three actual
          owners how the handover went.
        </LI>
        <LI>
          The discount is genuinely meaningful, 12 percent or
          better in net terms after the adjustments above.
          Anything less is not worth the wait.
        </LI>
        <LI>
          Your capital is not earning anything else. If your
          alternative is leaving USD in a 1% account, the
          opportunity cost on tranche payments is small and
          off-plan looks better.
        </LI>
        <LI>
          You can absorb a 6 to 12 month delay without it
          breaking your plans. If you are buying for a
          specific move-in date or a tenant lined up, do not
          buy off-plan.
        </LI>
        <LI>
          The unit type, finish or layout you want is genuinely
          unavailable in the ready market. This happens with
          larger 3 and 4 bed units in newer compounds.
        </LI>
      </OL>

      <H2 id="when-ready-wins">When ready is the right call</H2>

      <UL>
        <LI>
          You want the income now. Ready stock in Westlands,
          Kilimani, Lavington and Kileleshwa rents within 30
          to 60 days of handover for any well-priced 1 or 2
          bed.
        </LI>
        <LI>
          You want certainty on quality. You can see the unit,
          stand on the balcony, run the taps, check the
          finishing, talk to existing tenants in the building.
        </LI>
        <LI>
          You are buying remotely with limited tolerance for
          risk. Ready property is operationally simpler, the
          legal process is cleaner, and there is no developer
          to chase if anything goes wrong six months after
          you wired your second tranche.
        </LI>
        <LI>
          Your time horizon is short. If you might sell in
          three to five years, ready compounds into a longer
          rental track record and a stronger comparable price
          when you exit.
        </LI>
      </UL>

      <Pullquote>
        Off-plan saves money on paper. Ready saves time. As
        a diaspora buyer with limited bandwidth, time is
        usually the more expensive resource.
      </Pullquote>

      <H2 id="hybrid">The hybrid: nearly-ready stock</H2>

      <P>
        The most overlooked option in Nairobi is buying off-plan
        stock that is 80 to 95 percent built. The unit can be
        inspected. The developer has already delivered most of
        the construction risk. The price is still 5 to 12
        percent below ready equivalents because the developer
        wants to clear remaining inventory before completion.
        Completion is 2 to 6 months out, so your capital is
        not idle for two years.
      </P>

      <P>
        For diaspora buyers, this is often the best
        risk-adjusted entry point. We track the nearly-ready
        list across roughly 30 active Nairobi projects and
        proactively bring it to clients on our sourcing
        service.
      </P>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For every property sourcing brief, we model both ready
        and off-plan options for the client&rsquo;s budget,
        with the full adjusted-cost analysis above. We pull
        the developer track record on every off-plan we
        consider, and we walk the nearly-ready compounds
        weekly. By the time you see a recommendation, the
        choice between ready, off-plan and nearly-ready is
        made on the numbers, not on whichever the agent is
        pushing this month.
      </P>

      <P>
        Read the companion piece on{" "}
        <Link
          href="/insights/buying-off-plan-nairobi-risks-red-flags"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          off-plan risks and red flags
        </Link>{" "}
        for the diligence side, or our{" "}
        <Link
          href="/insights/buying-vs-building-nairobi-which-makes-sense"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          buying versus building piece
        </Link>{" "}
        if you are also weighing self-build as an option.
      </P>
    </>
  );
}

import Link from "next/link";
import { authors, type PostMeta } from "./_shared";
import {
  Callout,
  H2,
  H3,
  LI,
  Lede,
  P,
  Pullquote,
  UL,
} from "@/components/ArticleProse";

export const meta: PostMeta = {
  slug: "rent-arrears-kenya-30-60-90-day-landlord-playbook",
  title:
    "Rent arrears in Kenya: 30/60/90-day landlord playbook",
  description:
    "How you handle the first thirty days of rent arrears in Kenya largely determines whether you recover the money at all. This is the exact 30/60/90 day playbook we run for diaspora landlords in 2026.",
  publishedAt: "2026-06-28",
  updatedAt: "2026-07-27",
  readingMinutes: 7,
  author: authors.poonam,
  tags: [
    "Kenya",
    "Rent Arrears",
    "Landlord",
    "Property Management",
    "Diaspora",
    "Nairobi",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Rent arrears Kenya 30 60 90 day landlord playbook 2026",
};

export default function Article() {
  return (
    <>
      <Lede>
        The most important thirty days in any
        rent-arrears situation in Kenya are the
        first thirty. What you do in that window
        largely determines whether the tenant
        pays up, stays on and gets back on
        track, or defaults further and ends up
        in a formal eviction process. This is
        the operating playbook we run for every
        diaspora landlord on the Goldstay book,
        day by day.
      </Lede>

      <H2 id="day-one-to-seven">Days 1 to 7: the calm first contact</H2>

      <P>
        The rent is due on the first of the
        month (or whatever your lease specifies).
        By day three at the latest, an unpaid
        rent is a flag; by day seven it is a
        situation.
      </P>

      <UL>
        <LI>
          <strong>Day 1 to 3:</strong> automated
          reminder to the tenant, delivered by
          SMS and email. Non-confrontational,
          simple, referencing the amount and the
          usual payment channel. Roughly 40 to
          50 per cent of the arrears we see are
          resolved at this stage; the tenant
          simply forgot or the payment failed.
        </LI>
        <LI>
          <strong>Day 4 to 7:</strong> personal
          contact by the managing agent or
          landlord. Voice call, not text.
          Confirms whether the delay is
          administrative (payment failed, tenant
          travelling, transfer stuck) or
          substantive (tenant cannot pay). The
          conversation determines everything
          that follows.
        </LI>
      </UL>

      <P>
        Where the delay is substantive, the
        first call is where the honest
        conversation happens. A tenant who has
        lost income, is between jobs, or has a
        one-off cashflow problem will often
        propose a partial payment plan. Take
        the conversation seriously; the
        alternative is 5 months of arrears and
        a formal eviction.
      </P>

      <H2 id="day-seven-to-thirty">Days 7 to 30: structured payment plan or escalation</H2>

      <H3 id="payment-plan">The payment plan</H3>
      <P>
        Where the tenant is engaging and has
        proposed a payment plan, formalise it in
        writing. Specify the outstanding amount,
        the schedule for catch-up (typically 60
        to 90 days), the ongoing current-month
        rent obligation, and the consequence if
        the plan is not met. Have the tenant
        sign. On our book, plans agreed and
        signed at day seven to fourteen produce
        full recovery in roughly 65 per cent of
        cases.
      </P>

      <H3 id="disengaged-tenant">The disengaged tenant</H3>
      <P>
        Where the tenant is not returning calls,
        is evasive, or is denying the arrears
        exist, escalate to written
        communication that becomes the
        evidentiary trail for later action.
      </P>

      <UL>
        <LI>
          Day 14 to 21: written notice of the
          arrears amount, delivered by hand
          with acknowledgement, or by
          registered post with return
          receipt.
        </LI>
        <LI>
          Day 21 to 30: second written notice,
          referencing the first, specifying
          the deadline for payment and the
          intended next step. This is the
          document that supports the formal
          demand at day 30.
        </LI>
      </UL>

      <Pullquote>
        A tenant who will not communicate at
        day 14 is a tenant who will not
        communicate at day 60. The
        documentation you build in weeks 2 to
        4 is the foundation for the formal
        action in weeks 5 onwards.
      </Pullquote>

      <H2 id="day-thirty-to-sixty">Days 30 to 60: formal demand and legal engagement</H2>

      <P>
        At day 30, an unresolved rent-arrears
        situation transitions from a
        management issue to a legal one. The
        formal written demand for rent
        arrears (see the sample in{" "}
        <Link
          href="/insights/eviction-kenya-2026-landlord-playbook"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          our eviction playbook
        </Link>
        ) is drafted and served on the
        tenant, typically by advocate or
        managing agent. This notice is not the
        eviction itself; it is the first step
        in the process that leads to the
        eviction if the arrears are not
        cleared.
      </P>

      <P>
        Between day 30 and day 60, the
        landlord should also (1) confirm
        with the advocate the classification
        of the tenancy (controlled or
        unregulated), (2) confirm the notice
        period required by the lease and by
        the relevant law, and (3) prepare
        for filing at the appropriate court
        or tribunal if the arrears remain
        outstanding at day 60.
      </P>

      <H2 id="day-sixty-plus">Day 60 onwards: filing, warrant, possession</H2>

      <P>
        Where the arrears remain outstanding
        at day 60 and no meaningful
        engagement has taken place from the
        tenant, the landlord instructs the
        advocate to file. From filing to
        vacant possession, realistic
        timelines are 12 to 22 weeks for an
        undefended unregulated tenancy, and
        materially longer for defended or
        controlled cases. Detail on the full
        litigation timeline is in{" "}
        <Link
          href="/insights/eviction-kenya-2026-landlord-playbook"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the eviction playbook
        </Link>
        .
      </P>

      <Callout title="What the deposit is for and is not for">
        The security deposit exists to cover
        end-of-tenancy damages and, where the
        lease permits, arrears at termination.
        It is not a legitimate substitute for
        current rent during the tenancy. A
        tenant who proposes to “use the
        deposit” as rent has already signalled
        the intention to leave on unfavourable
        terms. Treat that signal as
        information; do not accept the
        proposal.
      </Callout>

      <H2 id="signals-to-act-earlier">Signals that mean escalate earlier than the standard track</H2>

      <UL>
        <LI>
          <strong>Tenant has moved out but
          not vacated formally.</strong>{" "}
          Neighbours confirm the property is
          empty; utilities are being
          consumed at a low level; the
          tenant is not reachable. Move
          straight to formal demand and
          begin possession action.
        </LI>
        <LI>
          <strong>Second consecutive month
          of missed rent within six
          months.</strong> The pattern is
          not one-off. Move to formal
          demand at day 21 rather than day
          30.
        </LI>
        <LI>
          <strong>Change in tenant
          circumstances that materially
          affects their ability to
          pay.</strong> Job loss, business
          collapse, undisclosed additional
          occupants. Do not wait to see
          how it plays out.
        </LI>
        <LI>
          <strong>Damage or unauthorised
          use of the property.</strong>{" "}
          Where arrears coincide with
          material breach of the lease,
          the case for prompt formal
          action is stronger and the
          court view is more favourable
          to the landlord.
        </LI>
      </UL>

      <H2 id="how-we-help">How Goldstay handles arrears</H2>

      <P>
        For every diaspora landlord on
        Goldstay management, our system
        flags missed rent on day 1, initiates
        the first-contact sequence
        automatically, escalates to personal
        contact by day 7, and triggers
        formal demand at day 30 where
        arrears persist. Landlords receive a
        written arrears report at every
        stage. On our 2025 and H1 2026
        book, 78 per cent of arrears
        situations were resolved with full
        recovery before day 60. Of the
        remainder that proceeded to formal
        action, possession was achieved on
        94 per cent of cases within the
        landlord’s target timeline.
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/eviction-kenya-2026-landlord-playbook"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the eviction playbook
        </Link>
        ,{" "}
        <Link
          href="/insights/how-to-evict-tenant-kenya-legally"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          our original eviction guide
        </Link>
        ,{" "}
        <Link
          href="/insights/tenant-screening-nairobi-how-we-do-it"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the tenant screening piece
        </Link>
        , and{" "}
        <Link
          href="/insights/maintenance-handbook-diaspora-landlords"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the maintenance handbook
        </Link>
        .
      </P>
    </>
  );
}

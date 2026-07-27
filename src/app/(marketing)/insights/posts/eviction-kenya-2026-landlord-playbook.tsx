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
  slug: "eviction-kenya-2026-landlord-playbook",
  title:
    "Eviction in Kenya 2026: the honest landlord playbook (with sample notices)",
  description:
    "Eviction of a defaulting tenant in Kenya is legally clear but procedurally slow. This is the honest 2026 landlord playbook: which tenancies fall under which law, the exact notices required, realistic timelines, and where landlords usually break the process.",
  publishedAt: "2026-06-21",
  updatedAt: "2026-07-27",
  readingMinutes: 9,
  author: authors.legal,
  tags: [
    "Kenya",
    "Eviction",
    "Landlord",
    "Legal",
    "Rent Restriction Act",
    "Tribunal",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Eviction Kenya 2026 landlord playbook with sample notices",
};

export default function Article() {
  return (
    <>
      <Lede>
        Evicting a defaulting tenant in Kenya is
        legally straightforward and procedurally
        slow. A landlord who follows the correct
        process will get vacant possession, but
        rarely in less than three months and often
        in six to eight. A landlord who cuts
        procedural corners will lose the case,
        pay costs, and start again. This is the
        honest 2026 landlord playbook, with the
        sample notice language, realistic
        timelines, and the specific mistakes we
        see most often.
      </Lede>

      <H2 id="which-law-applies">Step one: which law applies to your tenancy</H2>

      <P>
        Not all Kenyan residential tenancies are
        governed by the same statute. Which one
        applies determines the tribunal or court
        you file in, the notice period you must
        give, and the arithmetic on realistic
        completion timeline.
      </P>

      <H3 id="controlled-tenancy">Controlled tenancy (Rent Restriction Act)</H3>
      <P>
        Applies to residential tenancies where
        the standard rent is at or below the
        threshold set by the Minister
        (historically low; still relevant to
        certain older lower-tier residential
        stock). Filed at the Rent Restriction
        Tribunal. Notice periods are prescribed
        by the Act. Timelines to vacant
        possession: typically 4 to 7 months.
      </P>

      <H3 id="business-premises">Business premises (Landlord and Tenant Shops, Hotels and Catering Establishments Act)</H3>
      <P>
        Not typically relevant to residential
        letting, but where a mixed-use property
        includes commercial premises, this Act
        governs. Filed at the Business Premises
        Rent Tribunal.
      </P>

      <H3 id="unregulated">Unregulated residential tenancy (common law and written lease)</H3>
      <P>
        The majority of modern residential
        letting in Nairobi is unregulated:
        rents above the Rent Restriction Act
        threshold, governed by the terms of
        the written lease and by ordinary
        common-law principles. Filed at the
        Magistrates Court (or higher court if
        the amount in dispute crosses the
        pecuniary jurisdiction). Notice
        periods are determined by the lease
        and by common law. Timelines to
        vacant possession: typically 3 to 6
        months when uncontested; 8 to 14
        months when contested and defended.
      </P>

      <Callout title="Confirm your tenancy classification before you serve any notice">
        The single most common landlord mistake
        is serving a notice under the wrong
        regime. A common-law notice to quit
        served on a controlled tenancy is
        invalid; a Rent Restriction Act notice
        served on an unregulated tenancy is
        procedurally excessive. Either error
        costs weeks. Confirm the classification
        with an advocate before drafting the
        notice.
      </Callout>

      <H2 id="the-notice-sequence">The notice sequence, step by step</H2>

      <H3 id="rent-arrears">For rent arrears (unregulated tenancy)</H3>
      <OL>
        <LI>
          <strong>Written demand for rent
          arrears.</strong> Delivered by hand
          with acknowledgement, or by
          registered post with return receipt.
          Specifies exact amount owing, the
          period of arrears, and the deadline
          for payment (typically 14 to 30 days
          depending on the lease).
        </LI>
        <LI>
          <strong>Notice of intention to
          determine the lease.</strong> Where
          the tenant has failed to pay within
          the demand period, this notice
          formally terminates the lease and
          demands vacant possession by a
          specified date (typically 30 days).
        </LI>
        <LI>
          <strong>Plaint filed at the
          Magistrates Court.</strong> Where the
          tenant has not vacated, the landlord
          files for judgment on possession and
          rent arrears. Court fees are
          proportionate to the amount claimed.
        </LI>
        <LI>
          <strong>Hearing, judgment, decree.</strong>{" "}
          If defended, this stage can extend
          the timeline materially. If
          undefended, judgment is typically
          granted within 60 to 90 days of
          filing.
        </LI>
        <LI>
          <strong>Warrant of possession.</strong>{" "}
          Enforced by the court process
          server, physically evicting the
          tenant. Typically executed within 2
          to 4 weeks of the decree.
        </LI>
      </OL>

      <H3 id="controlled-tenancy-arrears">For rent arrears (controlled tenancy)</H3>
      <P>
        The Rent Restriction Act sets its own
        notice periods and requires filing at
        the Rent Restriction Tribunal. The
        Tribunal has powers to make suspended
        orders (allowing the tenant additional
        time to pay), which can extend
        timelines beyond the unregulated
        route. Legal advice is not optional
        here.
      </P>

      <Pullquote>
        The notice is not the eviction. The
        notice is the paperwork that starts
        the process the court eventually
        completes. Landlords who conflate the
        two lose the case.
      </Pullquote>

      <H2 id="what-not-to-do">
        What Kenyan landlords must never do
      </H2>

      <UL>
        <LI>
          <strong>Change the locks.</strong>{" "}
          Self-help eviction (changing locks,
          disconnecting services, removing
          the tenant's possessions) is
          unlawful even where the tenant is
          in default. It exposes the landlord
          to damages, criminal complaints for
          forcible entry, and a court order
          reinstating the tenant.
        </LI>
        <LI>
          <strong>Disconnect utilities.</strong>{" "}
          Cutting off water or electricity
          to force a tenant to leave is
          treated as constructive eviction
          and gives rise to damages.
        </LI>
        <LI>
          <strong>Sell the tenant's
          possessions.</strong> A landlord's
          distress-for-rent process (formal
          seizure of tenant chattels for
          arrears) exists but is technically
          complex, requires a court warrant
          in many cases, and is not a
          practical remedy for most
          residential arrears.
        </LI>
        <LI>
          <strong>Rely on verbal
          notices.</strong> Every step in
          the eviction process must be
          documented. WhatsApp messages,
          phone calls, and undocumented
          site visits are not evidence at
          court.
        </LI>
      </UL>

      <H2 id="realistic-timelines">Realistic timelines by scenario</H2>

      <UL>
        <LI>
          <strong>Best case (unregulated,
          uncontested, tenant vacates on
          notice):</strong> 6 to 10 weeks
          from written demand to vacant
          possession.
        </LI>
        <LI>
          <strong>Typical case (unregulated,
          undefended court action, warrant
          executed):</strong> 14 to 22
          weeks.
        </LI>
        <LI>
          <strong>Difficult case (unregulated,
          defended, contested, appealed):</strong>{" "}
          10 to 18 months.
        </LI>
        <LI>
          <strong>Controlled tenancy, uncontested,
          Tribunal:</strong> 20 to 28 weeks.
        </LI>
        <LI>
          <strong>Controlled tenancy, contested,
          with suspended order:</strong> 40+
          weeks.
        </LI>
      </UL>

      <H2 id="sample-notice-language">Sample notice language (adapt with advocate)</H2>

      <Callout title="Written demand for rent arrears (unregulated tenancy)">
        Dear [Tenant Name], I refer to the
        Tenancy Agreement dated [date] for
        [property address]. As at [date], the
        sum of Kenya Shillings [amount]
        (representing rent for the months of
        [months]) is due and owing. This is
        formal demand that the sum be paid in
        full within fourteen (14) days of the
        date of this notice, failing which
        further action will be taken to
        recover the arrears and vacant
        possession of the premises. This
        notice is served pursuant to the
        terms of the Tenancy Agreement.
        Yours faithfully, [Landlord Name /
        Managing Agent].
      </Callout>

      <H2 id="prevention">The best eviction is the one you never file</H2>

      <P>
        For diaspora landlords the operational
        priority is not the eviction process
        itself but the earlier signals that
        avoid needing it. A monthly
        management workflow that catches
        arrears at day one, communicates
        clearly with the tenant, and
        escalates to formal demand at day
        thirty resolves the majority of
        arrears cases before they become
        eviction cases. Where the arrears
        continue past day sixty, the
        escalation to formal notice is what
        distinguishes a landlord who
        eventually gets possession from a
        landlord who is still owed six
        months later.
      </P>

      <H2 id="how-we-help">How Goldstay handles evictions</H2>

      <P>
        For diaspora landlords on Goldstay
        management, arrears are flagged on
        day one of the missed payment, a
        payment plan is offered by day
        seven, formal demand is served by
        day thirty, and instructions to the
        advocate to file are given by day
        sixty on residential tenancies where
        the tenant has not engaged. Rent
        recovery on our book has averaged
        68 per cent of the arrears amount
        across evictions closed in 2025 and
        H1 2026. Full recovery is rare;
        partial recovery is normal;
        possession is achieved on nearly
        every case that goes to filing.
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/rent-arrears-kenya-30-60-90-day-landlord-playbook"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the 30/60/90 day arrears playbook
        </Link>
        ,{" "}
        <Link
          href="/insights/how-to-evict-tenant-kenya-legally"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          our original eviction guide
        </Link>
        , and{" "}
        <Link
          href="/insights/tenant-screening-nairobi-how-we-do-it"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the tenant screening piece
        </Link>
        .
      </P>
    </>
  );
}

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
  slug: "residential-lease-agreement-kenya-clause-by-clause",
  title:
    "A Kenyan residential lease, clause by clause, and what each one costs you",
  metaTitle: "Residential Lease Agreement Kenya: Clause by Clause",
  description:
    "Template sites give you the form. They do not tell you what each clause does when it is tested. This is a read through a Kenyan residential lease from the landlord's side, with the wording that fails and the wording that holds.",
  metaDescription:
    "A clause by clause read of a Kenyan residential lease from the landlord's side: which wording holds when tested, and which quietly fails.",
  publishedAt: "2026-09-07",
  readingMinutes: 11,
  author: authors.legal,
  tags: ["Kenya", "Landlord", "Legal", "Lease", "Tenancy Agreement"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Reviewing a residential lease agreement for a Nairobi rental property",
};

export default function Article() {
  return (
    <>
      <Lede>
        There is no shortage of Kenyan lease
        templates. What there is a shortage of is
        any explanation of what the clauses do
        once somebody disputes them, which is the
        only moment a lease is ever read
        carefully. This is that read, in the order
        the clauses usually appear, from the
        landlord&rsquo;s side.
      </Lede>

      <P>
        A note before starting. Nothing here is
        advice on your particular lease, and a
        clause that works in one letting can be
        unenforceable in another because of the
        rent level, the property type or who the
        tenant is. Use this to know what to ask an
        advocate, not to replace one.
      </P>

      <H2 id="parties">The parties clause</H2>

      <P>
        Ordinary and easy to get wrong. Full legal
        names, identification numbers, and
        addresses for service of notices. The
        address matters more than people think:
        it is where every notice in the tenancy
        will be sent, and a notice served to an
        address the agreement does not name is
        arguable.
      </P>

      <P>
        Where the landlord is abroad, name a local
        address or an agent for service. A tenancy
        where the only address for the landlord is
        in Manchester creates a practical problem
        the first time anything has to be
        delivered.
      </P>

      <H3 id="joint-tenants">Where there is more than one tenant</H3>

      <P>
        Two sharers on one lease should be jointly
        and severally liable, and the clause should
        say so in those words. Joint and several
        liability means you can recover the whole
        rent from either of them rather than half
        from each. Without it, one tenant leaving
        can reduce your claim to their share of the
        arrears.
      </P>

      <H2 id="premises">The premises clause</H2>

      <P>
        Describe what is let and, just as
        importantly, what is not. Parking bays by
        number. Whether the store, the servants
        quarter, the roof terrace or the garden is
        included. Whether the furniture in the
        inventory is let with the unit or merely
        present.
      </P>

      <Callout title="The clause landlords most often omit here">
        A statement that the tenant takes the
        premises in the condition described in the
        attached schedule of condition, which they
        have inspected and accepted. Without it, a
        tenant can later argue the property was
        defective when they arrived, and you are
        the one proving otherwise about a state of
        affairs eighteen months old.
      </Callout>

      <H2 id="term">The term clause</H2>

      <P>
        A start date, an end date, and what
        happens next. The third part is the one
        that gets left out, and it produces the
        commonest structural problem in Kenyan
        letting: a fixed term that expires, a
        tenant who stays, rent that continues to be
        paid and accepted, and nobody quite sure
        what governs the arrangement now.
      </P>

      <P>
        What has usually happened is that a
        periodic tenancy has arisen by implication,
        running month to month on the old terms.
        That is survivable, but it is not what
        either party planned, and the notice
        position becomes a matter of general law
        rather than of the agreement. Write the
        holdover position in: either it renews for
        a further fixed term, or it continues month
        to month terminable on stated notice.
      </P>

      <H3 id="break-clause">Break rights</H3>

      <P>
        A fixed term binds you as much as the
        tenant. If there is any prospect you will
        want the property back, whether to sell,
        to occupy, or to refurbish, the break has
        to be negotiated before signature. Make it
        mutual or make it yours, state the notice
        required, and state any conditions, because
        a break exercisable only if the rent
        account is clear is worth considerably more
        than one that is not.
      </P>

      <H2 id="rent">The rent clause</H2>

      <UL>
        <LI>
          <strong>Amount and currency.</strong>{" "}
          Stated in figures and words. Where a
          diaspora landlord is paid in USD but the
          tenant pays in shillings, the lease
          should be in shillings and the conversion
          handled in the management arrangement,
          not imposed on the tenant.
        </LI>
        <LI>
          <strong>Due date and method.</strong> The
          day of the month, whether in advance, and
          the account or paybill. Name the account
          so that payment elsewhere is not
          discharge.
        </LI>
        <LI>
          <strong>Late payment.</strong> A grace
          period if you want one, then interest at
          a stated rate. Interest at a punitive
          rate risks being read as a penalty and
          struck down, so keep it defensible.
        </LI>
        <LI>
          <strong>Rent review.</strong> If the term
          is longer than a year, say how and when
          rent is reviewed and by reference to
          what. An open ended right to increase
          &ldquo;as the landlord sees fit&rdquo; is
          weak. A stated percentage, or a stated
          index, is not.
        </LI>
        <LI>
          <strong>No set off.</strong> A clause
          that the rent is payable without
          deduction or set off, so a tenant who
          believes they are owed for a repair
          cannot simply withhold. It does not stop
          them doing it, but it changes who is in
          breach when they do.
        </LI>
      </UL>

      <H2 id="deposit">The deposit clause</H2>

      <P>
        Covered at length in{" "}
        <Link
          href="/insights/tenancy-agreement-kenya-landlord-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the tenancy agreement guide
        </Link>
        , and the short version is that the clause
        needs a closed list of permitted deductions,
        an express statement that the deposit is not
        rent and may not be used as the final
        month&rsquo;s payment, and a refund period
        that runs from the date vacant possession is
        actually given.
      </P>

      <Pullquote>
        Every clause in a lease is an answer to a
        question somebody will eventually ask.
        Where the clause is silent, the general law
        answers instead, and it does not know what
        you intended.
      </Pullquote>

      <H2 id="tenant-covenants">The tenant covenants</H2>

      <P>
        The list of what the tenant promises to do.
        The ones that earn their place:
      </P>

      <UL>
        <LI>
          <strong>To pay rent and outgoings.</strong>{" "}
          Rent, and separately the utilities and
          service charge allocated to the tenant.
        </LI>
        <LI>
          <strong>To keep the interior in good
          repair.</strong> With the fair wear and
          tear exception stated, and defined.
        </LI>
        <LI>
          <strong>To report defects
          promptly.</strong> The clause that stops
          a small leak becoming a structural claim
          against you. Give it a timeframe.
        </LI>
        <LI>
          <strong>Not to alter without
          consent.</strong> Covering both structural
          alteration and the smaller things:
          repainting, mounting televisions,
          changing locks, installing air
          conditioning or a water tank.
        </LI>
        <LI>
          <strong>Not to assign, sublet or short
          let.</strong> Named specifically,
          including platform letting, for the
          reasons set out in the tenancy agreement
          guide.
        </LI>
        <LI>
          <strong>To permit access on
          notice.</strong> Because without it you
          have none.
        </LI>
        <LI>
          <strong>To comply with house
          rules.</strong> Attach them. A reference
          to rules the tenant has never seen is
          hard to enforce.
        </LI>
        <LI>
          <strong>To yield up.</strong> To return
          the property at the end in the condition
          required, with all keys, access cards and
          remotes, and with utility accounts
          settled.
        </LI>
      </UL>

      <H2 id="landlord-covenants">The landlord covenants</H2>

      <P>
        Shorter, and worth reading carefully
        because these are your obligations rather
        than your rights.
      </P>

      <UL>
        <LI>
          <strong>Quiet enjoyment.</strong> The
          promise not to interfere with the
          tenant&rsquo;s possession. It is implied
          in any event and breaching it is how
          landlords end up paying damages.
        </LI>
        <LI>
          <strong>Structural repair.</strong> Roof,
          walls, foundations, main services.
          Define the boundary against the
          tenant&rsquo;s obligation with a figure
          rather than an adjective.
        </LI>
        <LI>
          <strong>Insurance.</strong> Say who
          insures the building, who insures
          contents, and that the tenant must not do
          anything that invalidates the
          landlord&rsquo;s policy.
        </LI>
        <LI>
          <strong>Service charge.</strong> If the
          landlord pays it to the management
          company, say so, and say whether any part
          is recoverable from the tenant.
        </LI>
      </UL>

      <H2 id="termination">Termination and forfeiture</H2>

      <P>
        The clause that sets out when the lease can
        be brought to an end early: non payment of
        rent for a stated period, material breach
        not remedied after written notice,
        insolvency. It should require written
        notice and give a remedy period, both
        because that is fair and because a court
        looks harder at a forfeiture exercised
        without one.
      </P>

      <Callout title="Forfeiture is not self help">
        A right to forfeit written into the lease
        does not entitle a landlord to change the
        locks. Recovering possession still runs
        through notice and, if the tenant does not
        leave, through a court or tribunal. The
        clause gives you the ground. It does not
        give you the remedy.
      </Callout>

      <H2 id="notices-and-law">Notices, and the governing law</H2>

      <P>
        A notices clause stating how notice is
        validly given, to which address, and when
        it is deemed received. Hand delivery with
        acknowledgement, or registered post with a
        deemed receipt period. Email if you want it,
        but say so expressly, because a tenant can
        otherwise argue an emailed notice was never
        validly served.
      </P>

      <P>
        Then the governing law and dispute clause.
        Kenyan law, and the appropriate forum. Be
        careful with arbitration clauses in
        residential leases: arbitration is
        expensive relative to the sums in dispute,
        and where the tenancy is controlled you
        cannot oust the tribunal in any event.
      </P>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        The lease we use on{" "}
        <Link
          href="/long-term-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          long-term management
        </Link>{" "}
        contains every clause above, with the
        repair boundary set as a figure rather than
        a word, the holdover position stated, and
        the schedule of condition attached and
        initialled. Drafting it is included, and
        there is no separate legal fee for a
        property we manage.
      </P>

      <P>
        When we take on a property with a tenant
        already in place, we read the existing
        lease and give you a written note of what
        it does not cover. Some of those gaps can
        only be closed at renewal, so knowing about
        them a year early is the point.
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/lease-vs-licence-kenya-landlords"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          lease or licence
        </Link>
        ,{" "}
        <Link
          href="/insights/tenant-deposit-disputes-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          deposit disputes
        </Link>
        , and{" "}
        <Link
          href="/insights/rent-arrears-kenya-30-60-90-day-landlord-playbook"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the arrears playbook
        </Link>
        .
      </P>
    </>
  );
}

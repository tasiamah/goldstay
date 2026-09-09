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
  slug: "tenancy-agreement-kenya-landlord-guide",
  title:
    "The tenancy agreement a Nairobi landlord should actually sign",
  metaTitle: "Tenancy Agreement Kenya: A Landlord's Guide",
  description:
    "Most Kenyan tenancy agreements are a downloaded template with the names changed, and they fail in exactly the same four places. This is what a landlord's agreement needs to contain, clause by clause, and which omissions cost money.",
  metaDescription:
    "What a Kenyan tenancy agreement must contain to protect the landlord, and the four omissions that cost money when a tenancy goes wrong.",
  publishedAt: "2026-09-07",
  readingMinutes: 10,
  author: authors.legal,
  tags: [
    "Kenya",
    "Landlord",
    "Legal",
    "Tenancy Agreement",
    "Lease",
    "Compliance",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Tenancy agreement documents for a Nairobi rental property",
};

export default function Article() {
  return (
    <>
      <Lede>
        Almost every tenancy agreement we are
        handed when taking over a Nairobi
        property is the same document: a
        template downloaded from a stationery
        shop or a search result, with the names
        and the rent typed in. It is usually
        two pages, it is usually silent on the
        four things that decide who wins an
        argument, and its owner usually has no
        idea it is silent on them until the
        argument arrives.
      </Lede>

      <P>
        A tenancy agreement is not paperwork you
        complete in order to start collecting
        rent. It is the entire set of rules
        under which every future dispute about
        that property will be decided. When a
        tenant stops paying, damages a fitting,
        refuses access, sublets the spare room
        or leaves nine months into a twelve
        month term, the only question a tribunal
        or a court asks is what the agreement
        says. If it says nothing, the answer
        defaults to the general law, and the
        general law is more generous to the
        occupant than most landlords expect.
      </P>

      <H2 id="what-it-must-contain">What the agreement has to contain</H2>

      <P>
        Start with the parts that are not
        optional. Getting any of these wrong
        makes the rest of the document harder to
        enforce, because a court that finds the
        basics careless reads the whole
        agreement with less sympathy.
      </P>

      <OL>
        <LI>
          <strong>The parties, in full and
          correctly.</strong> Full legal names as
          they appear on identity documents, ID
          or passport numbers, and a postal and
          physical address for each. Where the
          landlord is a company, the registered
          name and company number, not the
          trading name. Where the property is
          jointly owned, every registered owner
          must be a party or must have given
          written authority to the one who signs.
        </LI>
        <LI>
          <strong>The property, described
          precisely.</strong> The physical
          address, the unit or house number, the
          land reference or title number where
          available, and an express statement of
          what is included: parking bays by
          number, a store, a servants quarter, a
          garden. A dispute about whether the
          second parking bay was part of the
          letting is entirely avoidable and
          entirely common.
        </LI>
        <LI>
          <strong>The term, with dates.</strong>{" "}
          A start date, an end date, and a clear
          statement of what happens at the end:
          whether it terminates, renews for a
          further fixed term, or continues month
          to month. Silence here is the single
          most frequent cause of a tenancy that
          nobody can cleanly end.
        </LI>
        <LI>
          <strong>The rent, and the mechanics of
          paying it.</strong> The amount, the
          currency, the day of the month it falls
          due, the account or paybill it is paid
          into, and whether it is payable in
          advance. Add what happens when it is
          late: the grace period, if any, and the
          interest or penalty rate.
        </LI>
        <LI>
          <strong>The deposit, and the terms for
          returning it.</strong> The amount, what
          it secures, the period within which it
          is refunded after vacating, and the
          categories of deduction permitted.
        </LI>
        <LI>
          <strong>Who pays what.</strong> Rent is
          the easy one. Set out separately who
          bears service charge, water,
          electricity, refuse, internet, security
          levy and any special levy the
          management company raises during the
          term.
        </LI>
      </OL>

      <H2 id="the-four-omissions">The four omissions that actually cost money</H2>

      <P>
        The list above is what a decent template
        already covers. What follows is what
        almost none of them do, and it is where
        the money is lost.
      </P>

      <H3 id="deposit-deductions">One: deposit deductions, defined in advance</H3>

      <P>
        Nearly every deposit dispute in Nairobi
        turns on the same disagreement. The
        landlord treats the deposit as covering
        anything the property needs on the way
        out. The tenant treats it as covering
        damage only, and argues that repainting a
        wall they lived in front of for two years
        is not damage but wear.
      </P>

      <P>
        Both readings are arguable when the
        agreement says only that the deposit
        covers damage. The fix is to define the
        categories in the document: rent arrears,
        unpaid utilities up to the date of
        vacating, the cost of making good damage
        beyond fair wear and tear, and the cost
        of removing anything left behind. Then
        state what fair wear and tear means for
        that property, because it is a legal
        standard with no fixed content and
        whoever defines it first has the
        advantage.
      </P>

      <Callout title="A deposit clause that survives a dispute">
        State the amount, that it is held as
        security and not as rent, that it may not
        be applied by the tenant to the final
        month, the closed list of permitted
        deductions, and a refund period running
        from the date vacant possession is given
        rather than from the end of the term. The
        distinction between those two dates
        matters when a tenant leaves late.
      </Callout>

      <H3 id="access">Two: access, and how much notice it takes</H3>

      <P>
        A landlord has no automatic right to
        enter a let property. That surprises
        people who own the building, but the
        tenant has exclusive possession for the
        term, and entering without a right to do
        so is a trespass no matter whose name is
        on the title.
      </P>

      <P>
        So the right has to be written in. A
        workable clause reserves access for
        inspection, repair, and showing the
        property to prospective tenants or buyers
        in the final months of the term, on
        stated written notice, at reasonable
        hours, with an exception for genuine
        emergency. Without it, a landlord who
        needs to inspect a suspected leak is
        dependent on the tenant agreeing.
      </P>

      <H3 id="repairs">Three: the repair split, in dates and numbers</H3>

      <P>
        The usual wording is that the landlord is
        responsible for structural repairs and the
        tenant for minor ones. Nobody agrees where
        the line falls. A blocked drain, a failed
        water heater, a gate motor: each of these
        is argued about monthly across Nairobi
        because the agreement did not say.
      </P>

      <P>
        Put a number on it. Below a stated figure
        the tenant handles and pays; above it the
        landlord does, on written notice within a
        stated number of days. Add a clause
        requiring the tenant to report any defect
        promptly, because a tenant who lets a
        small leak run for four months has
        converted a minor repair into a structural
        one, and you want the agreement to say who
        carries that.
      </P>

      <H3 id="subletting">Four: subletting, and short-letting in particular</H3>

      <P>
        Most templates prohibit assignment and
        subletting in general terms drafted long
        before anyone listed a spare room by the
        night. A general prohibition probably
        catches short-letting, but probably is not
        a word you want in the clause that stops
        your two bedroom apartment operating as an
        unlicensed hotel.
      </P>

      <P>
        Name it. Prohibit assignment, subletting,
        parting with possession, and the use of
        the premises for short-stay or holiday
        letting on any platform, without prior
        written consent. If the building itself
        restricts short lets, and a growing number
        of Nairobi buildings now do, reference
        those house rules and attach them.
      </P>

      <Pullquote>
        A tenancy agreement is not the document
        you sign to start the tenancy. It is the
        document that decides every argument you
        will have for the next two years, written
        before you know what the arguments will
        be.
      </Pullquote>

      <H2 id="the-inventory">The attachment that does more work than the agreement</H2>

      <P>
        A dated, photographed, signed inventory
        and schedule of condition, attached to the
        agreement and initialled by both parties,
        settles more disputes than any clause in
        the main document. It records what was in
        the property, what state it was in, and
        what the meters read on the day the tenant
        took possession.
      </P>

      <P>
        Without it, a deposit deduction is one
        person&rsquo;s recollection against
        another&rsquo;s two years later. With it,
        the deduction is arithmetic. It is the
        cheapest protection available to a
        landlord and the one most often skipped,
        usually because the tenant is keen and
        everyone wants to get the keys handed over.
      </P>

      <H2 id="which-law">Which law your agreement sits under</H2>

      <P>
        A Kenyan residential tenancy falls into one
        of two regimes, and which one applies
        changes the notice periods and the forum
        for a dispute. Where the rent is at or
        below the threshold under the Rent
        Restriction Act, the tenancy is
        controlled: the Act supplies notice
        periods and the Rent Restriction Tribunal
        hears disputes, and your agreement cannot
        contract out of either. Above that
        threshold, which covers most modern
        letting in the neighbourhoods we manage,
        the tenancy is governed by the agreement
        itself and by ordinary common law
        principles.
      </P>

      <P>
        The practical consequence is that in the
        unregulated majority, the agreement is
        doing nearly all of the work. There is no
        statute quietly filling the gaps in your
        favour. Whatever the document omits, the
        general law decides, and it decides
        without much regard for what you assumed.
      </P>

      <Callout title="Do not sign a fixed term you cannot end">
        A twelve month fixed term with no break
        clause binds the landlord as firmly as the
        tenant. If you may want to sell, move in,
        or take the unit back for refurbishment,
        the break has to be in the agreement
        before it is signed. It cannot be added
        afterwards without the tenant agreeing,
        and a tenant who is comfortable has no
        reason to agree.
      </Callout>

      <H2 id="signing">Signing, witnessing and stamping</H2>

      <UL>
        <LI>
          <strong>Both parties sign every
          page.</strong> Initialling each page
          closes off any later argument that a
          page was substituted.
        </LI>
        <LI>
          <strong>Witness the signatures.</strong>{" "}
          A witness for each party, with name, ID
          number and signature.
        </LI>
        <LI>
          <strong>Attach and initial the
          annexures.</strong> The inventory, the
          schedule of condition, the house rules,
          the meter readings.
        </LI>
        <LI>
          <strong>Keep an original each.</strong>{" "}
          Two originals executed, one held by each
          party. A photocopy in a drawer in another
          country is not a comfortable evidential
          position.
        </LI>
        <LI>
          <strong>Consider stamping.</strong>{" "}
          Stamp duty on a lease depends on the term
          and the rent. Longer leases attract duty
          and unstamped instruments can face
          admissibility problems in evidence. Ask
          an advocate whether yours needs it rather
          than assuming it does not.
        </LI>
      </UL>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        Every long term tenancy we place is
        written on our own agreement rather than
        on a template, and it carries all four of
        the clauses above as standard, along with
        a photographed inventory and schedule of
        condition signed on the day of handover.
        Meter readings go in the same document. We
        would rather spend an hour on the
        agreement than a year on a dispute it
        could have prevented, and the arithmetic
        is not close.
      </P>

      <P>
        Where we take over a property that already
        has a tenant on somebody else&rsquo;s
        agreement, we read it, tell you plainly
        what it does not cover, and put the gaps
        right at renewal. That is part of{" "}
        <Link
          href="/long-term-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          long-term management
        </Link>{" "}
        rather than an extra, and there is no fee
        for drafting the agreement on a property
        we manage.
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/tenant-screening-nairobi-how-we-do-it"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how we screen tenants before any of this
          matters
        </Link>
        ,{" "}
        <Link
          href="/insights/tenant-deposit-disputes-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          deposit disputes in Nairobi
        </Link>
        , and{" "}
        <Link
          href="/insights/eviction-kenya-2026-landlord-playbook"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the eviction playbook for when it fails
          anyway
        </Link>
        . If an agent will be collecting the rent
        under this tenancy, the separate contract
        appointing them is covered in{" "}
        <Link
          href="/insights/property-management-agreement-kenya-clause-by-clause"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the property management agreement, clause
          by clause
        </Link>
        .
      </P>
    </>
  );
}

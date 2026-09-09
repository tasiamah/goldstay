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
  slug: "sublease-agreement-kenya-operators",
  title:
    "Sublease agreements in Kenya: what an operator's paperwork must say",
  // Retargeted from "sublease agreement kenya" to "rent to rent
  // agreement", which the autocomplete harvest returned 285
  // suggestions for against 17 for the sublease phrasing. Same
  // document, and this article was already about it. The editorial H1
  // keeps the sublease wording because that is what the body argues
  // you mostly do not need.
  metaTitle: "Rent to Rent Agreement in Kenya: What It Must Say",
  description:
    "An operator who leases to re-let needs three documents, not one, and the head lease is the one that decides whether the business works. What each has to contain, and the clauses that ruin operations.",
  metaDescription:
    "What a rent to rent agreement must contain in Kenya: the three documents an operator needs, and the clauses that decide whether it works.",
  publishedAt: "2026-09-07",
  readingMinutes: 9,
  author: authors.legal,
  tags: ["Kenya", "Sublet", "Legal", "Operator", "Lease", "Short-Let"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Sublease and head lease documents for a Nairobi short-let operator",
};

export default function Article() {
  return (
    <>
      <Lede>
        Operators tend to go looking for a
        &ldquo;sublease agreement template&rdquo;
        and download the wrong document. If you
        lease a unit to re-let it on short stays,
        the sublease is the least important of the
        three pieces of paper you need, and the
        one you probably do not need at all.
      </Lede>

      <H2 id="what-is-a-rent-to-rent-agreement">
        What is a rent to rent agreement?
      </H2>

      <P>
        It is not a single named contract, which
        is why searching for one produces
        templates that do not fit. A rent to rent
        agreement, sometimes called a rental
        arbitrage contract, is a normal lease
        between the owner and the operator, with
        the added permission to re-let. The
        operator becomes the tenant and pays a
        fixed rent. The right to put paying guests
        in the unit comes from a consent clause
        inside that lease, or from a separate
        consent letter, rather than from a
        different species of document.
      </P>

      <P>
        Almost every downloadable template gets
        this wrong. UK rent to rent packs are
        built around assured shorthold tenancies
        and guaranteed rent structures that have
        no equivalent in Kenyan law, and American
        arbitrage contracts assume a landlord
        regime that does not exist here either. A
        Kenyan operator needs a Kenyan lease with
        the right permissions in it, not a
        translated form.
      </P>

      <H2 id="three-documents">The three documents, in order of importance</H2>

      <P>
        A short-let operation on a leased unit
        rests on three instruments, and people
        consistently attend to them in reverse
        order of how much they matter.
      </P>

      <H3 id="head-lease">One: the head lease, between you and the owner</H3>

      <P>
        This is the document that decides whether
        the business works. It sets your rent,
        your term, and above all what you are
        permitted to do with the unit. Every
        operator failure we have seen traces back
        to this document rather than to anything
        downstream.
      </P>

      <H3 id="consent">Two: the owner&rsquo;s written consent</H3>

      <P>
        Either a clause inside the head lease or a
        separate letter annexed to it. It has to
        name short-stay letting specifically,
        because a general permission to sublet may
        not authorise nightly occupation at all,
        for reasons set out in{" "}
        <Link
          href="/insights/lease-vs-licence-kenya-landlords"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          lease or licence
        </Link>
        .
      </P>

      <H3 id="guest-terms">Three: your terms with the guest, which are not a sublease</H3>

      <P>
        A guest staying four nights is a licensee,
        not a sub-tenant. They have no exclusive
        possession, you retain control of the
        unit, you enter to clean, and you can move
        them. So what you need with a guest is
        booking terms and house rules, which the
        platform largely supplies, not a sublease.
      </P>

      <P>
        You need an actual sublease only where you
        are granting somebody exclusive possession
        for a term: a corporate let of three
        months, a relocation tenant, a
        month-to-month arrangement. If your model
        is nightly bookings, the sublease template
        you were about to download is solving a
        problem you do not have.
      </P>

      <Callout title="The document most operators are missing">
        Nine times out of ten the gap is not the
        sublease. It is written consent from the
        owner that names short-stay letting, and a
        head lease long enough to earn back the
        furnishing. Fix those two and the guest
        paperwork mostly takes care of itself.
      </Callout>

      <H2 id="head-lease-clauses">What your head lease has to get right</H2>

      <P>
        Negotiate these before you sign. Every one
        of them is cheap to fix at the outset and
        expensive or impossible to fix later.
      </P>

      <UL>
        <LI>
          <strong>Permitted use, expressly
          including short-stay letting.</strong>{" "}
          Not silence, not a general subletting
          permission. The words &ldquo;including
          letting the Premises on a short-stay or
          nightly basis, whether directly or
          through a booking platform&rdquo; do the
          work. A use clause limiting occupation
          to &ldquo;a private dwelling for the
          Tenant and their family&rdquo; kills the
          model however permissive the subletting
          clause is.
        </LI>
        <LI>
          <strong>Permission to appoint a managing
          agent.</strong> Separate from permission
          to sublet, and frequently overlooked. If
          you intend a firm to run the unit, the
          lease has to allow it.
        </LI>
        <LI>
          <strong>A term long enough to amortise
          the furnishing.</strong> You are putting
          four to nine thousand dollars into
          somebody else&rsquo;s property. A twelve
          month term with no renewal right means
          you may not recover it. Two to three
          years, or one year with an option to
          renew at a rent capped by a formula
          rather than left to negotiation.
        </LI>
        <LI>
          <strong>A rent review formula, not a
          rent review discretion.</strong> An
          owner who watches your operation succeed
          and can set the renewal rent freely will
          capture your margin. Cap it: a fixed
          percentage, or a published index.
        </LI>
        <LI>
          <strong>What happens to the furniture on
          exit.</strong> Say that the furnishing
          remains yours and that you may remove it,
          or agree a price at which the owner takes
          it. Leases silent on this have produced
          arguments about fixtures at exactly the
          moment you have no leverage.
        </LI>
        <LI>
          <strong>Repair obligations split
          sensibly.</strong> Short-stay turnover
          generates more wear, so expect to carry
          more of the internal repair. What you
          should resist is structure, roof, and the
          building&rsquo;s own systems.
        </LI>
        <LI>
          <strong>Utilities and service
          charge.</strong> Short-stay consumption
          is materially higher than tenant
          consumption. Know whether service charge
          is included and whether it can be
          increased mid-term.
        </LI>
        <LI>
          <strong>Quiet enjoyment and access.</strong>{" "}
          An owner reserving unrestricted access
          is incompatible with paying guests in
          occupation. Notice provisions need to
          work around bookings.
        </LI>
        <LI>
          <strong>Insurance, and whose covers
          what.</strong> Name who insures the
          structure, who insures contents, and
          record that the occupation is
          commercial short-stay so the
          owner&rsquo;s insurer is not later told
          it was residential.
        </LI>
        <LI>
          <strong>House rules, identified.</strong>{" "}
          If the lease incorporates the
          building&rsquo;s rules by reference, get
          a copy and read them before signing. A
          committee resolution banning short-stay
          guests then becomes a term of your lease
          without anybody amending it.
        </LI>
      </UL>

      <Pullquote>
        The clause that ends most Nairobi
        short-let operations is not the subletting
        clause. It is the use clause, or the house
        rules the lease quietly incorporates.
      </Pullquote>

      <H2 id="consent-contents">What the consent letter should contain</H2>

      <P>
        Short, specific, signed and dated by the
        registered owner rather than by an agent
        without written authority.
      </P>

      <UL>
        <LI>
          The property, identified the way the
          lease identifies it
        </LI>
        <LI>
          Consent to sublet <em>and</em> to let on
          a short-stay or nightly basis, named
          separately
        </LI>
        <LI>
          Consent to appoint a named managing
          agent
        </LI>
        <LI>
          The conditions the owner is imposing:
          insurance, deposit, compliance with
          house rules
        </LI>
        <LI>
          Whether and how the consent can be
          withdrawn, and on what notice
        </LI>
        <LI>
          That it is given under the lease dated
          [date], so it is anchored to the
          instrument it varies
        </LI>
      </UL>

      <P>
        A one-line email saying &ldquo;that&rsquo;s
        fine&rdquo; is better than nothing and
        much worse than this. For how to get to a
        yes in the first place, and a letter you
        can adapt, see{" "}
        <Link
          href="/insights/ask-landlord-permission-short-let-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how to ask a landlord for permission to
          short-let
        </Link>
        .
      </P>

      <H2 id="if-you-do-need-a-sublease">If you genuinely do need a sublease</H2>

      <P>
        For a corporate let or any arrangement
        granting exclusive possession for a term,
        the sublease has to sit inside your head
        lease and not overreach it.
      </P>

      <UL>
        <LI>
          <strong>It cannot outlast your own
          term.</strong> A sublease granted for
          longer than the head lease has left is
          the classic drafting error, and you
          cannot grant what you do not hold.
        </LI>
        <LI>
          <strong>It should mirror the head
          lease&rsquo;s restrictions.</strong>{" "}
          Whatever you covenanted not to do, your
          sub-tenant should covenant not to do,
          because you remain liable upstream for
          their conduct.
        </LI>
        <LI>
          <strong>Mind the statutory
          overlay.</strong> A residential sublease
          may attract the protections of the Rent
          Restriction Act, and a let of shop,
          hotel or catering premises may create a
          controlled tenancy under the Landlord
          and Tenant Shops, Hotels and Catering
          Establishments Act, with its own
          tribunal and notice regime. Creating a
          security you then cannot end is worse
          than a vacancy.
        </LI>
        <LI>
          <strong>Stamp duty and registration.</strong>{" "}
          Longer subleases attract registration
          requirements and duty. Ignoring this
          does not make the document invalid
          between the parties but can matter when
          you need to rely on it.
        </LI>
      </UL>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        We read the head lease before we agree to
        manage a unit for an operator, and we say
        so when the lease will not support the
        model. That conversation is unwelcome
        roughly half the time and it is cheaper
        than the alternative, which is discovering
        the use clause in month four with the
        furnishing already installed.
      </P>

      <P>
        Our own management agreement carries a
        capacity written for this position. You
        sign as an authorised leaseholder rather
        than as an owner, warranting that you hold
        a valid lease, that the owner has
        permitted both the subletting and our
        appointment, and that the lease runs for
        at least our initial term. If that
        authority lapses or is withdrawn you are
        obliged to tell us in writing and we can
        end the arrangement immediately without an
        exit fee, because taking bookings for a
        unit you no longer control is the outcome
        neither of us survives.
      </P>

      <P>
        <Link
          href="/airbnb-arbitrage-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Management for operators
        </Link>{" "}
        sets out the whole service. This article is
        general information and not legal advice
        on your documents, which turn on wording
        we have not seen; on a head lease you are
        about to sign, take advice from an
        advocate.
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/is-airbnb-arbitrage-legal-kenya"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          whether Airbnb arbitrage is legal in
          Kenya
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/residential-lease-agreement-kenya-clause-by-clause"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          a residential lease clause by clause
        </Link>
        . Before the paperwork stage,{" "}
        <Link
          href="/insights/how-to-find-rental-arbitrage-properties-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how to find units that work for
          arbitrage in Nairobi
        </Link>{" "}
        covers finding an owner who will sign one
        at all.
      </P>
    </>
  );
}

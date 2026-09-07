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
  slug: "registering-a-lease-in-kenya",
  title:
    "When a lease has to be registered in Kenya, and what happens if it is not",
  metaTitle: "Registering a Lease in Kenya: When It Is Required",
  description:
    "Short lettings do not need registering. Longer ones do, and an unregistered long lease does not give the tenant the interest both parties think it does. Where the line falls, what registration involves, and the stamp duty nobody budgets for.",
  metaDescription:
    "Which Kenyan leases must be registered, what registration involves, and why an unregistered long lease does not do what both parties assume.",
  publishedAt: "2026-09-07",
  readingMinutes: 8,
  author: authors.legal,
  tags: ["Kenya", "Landlord", "Legal", "Lease", "Compliance", "Stamp Duty"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Land registry documents for registering a lease in Kenya",
};

export default function Article() {
  return (
    <>
      <Lede>
        Most Nairobi landlords will never need to
        register a lease, and it is worth saying
        so at the top. A one year residential
        tenancy does not go near the land
        registry. But the moment a term stretches
        past a certain length, the document stops
        being a private contract and becomes a
        dealing in land, and the rules change
        entirely.
      </Lede>

      <P>
        The problem is that nobody tells you where
        the line is until you have crossed it.
        Long leases turn up in ordinary situations:
        a tenant who wants ten years so they can
        fit out a ground floor unit, a corporate
        letting on a five year term with an option,
        a family arrangement written for twenty
        years. Each of those is a registrable
        dealing, and treating it like a tenancy
        agreement produces a document that does
        less than the parties intended.
      </P>

      <H2 id="where-the-line-falls">Where the line falls</H2>

      <P>
        Under the Land Registration Act, a lease
        for a term exceeding a short statutory
        period must be registered against the
        title to take effect as a registered
        interest in the land. Shorter leases, which
        includes essentially all ordinary
        residential letting, take effect without
        registration and are usually described as
        overriding interests: they bind a
        subsequent buyer even though nothing
        appears on the register.
      </P>

      <P>
        Because the exact threshold and the
        procedure attaching to it depend on the
        registration regime applying to the
        particular title, and Kenya has been
        through a consolidation of its land
        statutes, the length that triggers
        registration is the first thing to confirm
        with an advocate on any lease longer than a
        couple of years. It is not a detail to
        take from an article, including this one.
      </P>

      <Callout title="The practical rule of thumb">
        A residential letting of a year or two,
        renewable, does not need registering.
        Anything where the tenant is investing
        their own money in the property on the
        strength of a long term, or where a term of
        five years or more is contemplated, needs
        an advocate before it is signed. The cost
        of asking is trivial against the cost of
        finding out later.
      </Callout>

      <H2 id="what-goes-wrong">What actually goes wrong when a long lease is not registered</H2>

      <H3 id="against-a-buyer">It may not bind a buyer</H3>

      <P>
        This is the serious one, and it cuts both
        ways depending on which side you are on. A
        registrable lease that was never registered
        has not created the registered interest it
        was supposed to create. If the landlord
        sells, the tenant&rsquo;s position against
        the new owner is materially weaker than
        they believe, and the tenant who spent
        heavily fitting out the premises discovers
        this at the worst possible moment.
      </P>

      <P>
        For a landlord the exposure is different
        but real. A tenant who finds their long
        lease unenforceable against a buyer has a
        claim against the person who granted it,
        and that is you.
      </P>

      <H3 id="finance">Financing becomes difficult</H3>

      <P>
        A bank lending against a leasehold interest
        wants that interest registered. So does a
        bank lending to the landlord against a
        property with a long lease over it, because
        the lease affects the security. An
        unregistered long lease sitting behind an
        application is the kind of thing that
        surfaces in diligence and stops a
        transaction while it is fixed.
      </P>

      <H3 id="evidence">Evidential problems from unstamped instruments</H3>

      <P>
        Separate from registration but usually
        encountered at the same time. Stamp duty is
        payable on leases, calculated by reference
        to the rent and the length of the term,
        with longer terms attracting a higher rate.
        An instrument that should have been stamped
        and was not can face admissibility problems
        when you try to rely on it, and duty later
        paid attracts penalties.
      </P>

      <Pullquote>
        An unregistered long lease is not void. It
        is simply not the thing the parties thought
        they had, and the difference only becomes
        visible when the property is sold, charged
        or fought over.
      </Pullquote>

      <H2 id="what-registration-involves">What registration involves</H2>

      <UL>
        <LI>
          <strong>A lease in registrable
          form.</strong> Drawn by an advocate in
          the prescribed form, executed and
          attested as the regime requires. A
          two page tenancy agreement will not do.
        </LI>
        <LI>
          <strong>Consents where they
          apply.</strong> Depending on the tenure
          and the property, land control board
          consent, consent of the head lessor on
          leasehold land, or county consent may be
          needed first. Registering without a
          required consent is not possible, and
          discovering the requirement late is what
          creates most of the delay.
        </LI>
        <LI>
          <strong>Valuation and stamping.</strong>{" "}
          Assessment of duty, payment, and
          franking of the instrument.
        </LI>
        <LI>
          <strong>Lodgement and
          registration.</strong> The instrument is
          lodged at the relevant registry and
          registered against the title, after
          which the lease appears on a search.
        </LI>
      </UL>

      <P>
        Two things follow from that list. It takes
        weeks rather than days, and it costs real
        money in duty and fees. Both need to be in
        the deal before terms are agreed, because a
        tenant presented with a duty bill they did
        not expect will want to renegotiate the
        rent.
      </P>

      <H2 id="who-pays">Who pays</H2>

      <P>
        Negotiable and worth negotiating. The
        common position is that the tenant bears
        the stamp duty and registration costs on a
        lease granted for their benefit, and each
        party bears its own legal fees, but none of
        that is automatic. Whatever is agreed
        belongs in the lease rather than in an
        email, because it is the kind of term
        parties remember differently.
      </P>

      <H2 id="short-lets">Where this does not apply at all</H2>

      <P>
        Short stay and holiday letting sits outside
        this entirely. A guest occupies under a
        licence rather than a lease, no interest in
        land is created, and there is nothing to
        register. If you are running a furnished
        unit by the night, the questions that
        matter are the county permit and the tax
        position, not the land registry. The
        distinction is set out in{" "}
        <Link
          href="/insights/lease-vs-licence-kenya-landlords"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          lease or licence
        </Link>
        .
      </P>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        The great majority of what we manage is
        ordinary residential letting on terms that
        never approach the registration threshold,
        so for most of our landlords this is
        background rather than a task. Where a
        tenant asks for a long term, and corporate
        and diplomatic tenants sometimes do, we say
        plainly that it is an advocate&rsquo;s job
        and we instruct one rather than adapting a
        tenancy agreement and hoping.
      </P>

      <P>
        What we will not do is let a landlord sign
        a five year lease on a two page template
        because it was quicker. That is the
        transaction that produces a claim three
        years later, and by then the person who
        drafted it is not the one paying for it.
        Our{" "}
        <Link
          href="/long-term-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          long-term management
        </Link>{" "}
        service includes flagging this before it
        happens.
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/residential-lease-agreement-kenya-clause-by-clause"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the residential lease clause by clause
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/freehold-vs-leasehold-kenya-citizenship-rules"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          freehold and leasehold in Kenya
        </Link>
        .
      </P>
    </>
  );
}

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
  slug: "can-landlord-refuse-sublet-kenya",
  title:
    "Can a Kenyan landlord refuse permission to sublet?",
  metaTitle: "Can a Landlord Refuse Permission to Sublet in Kenya?",
  description:
    "Usually yes, and the room to challenge a refusal is narrower than tenants assume. It turns entirely on whether the covenant in your lease is absolute or qualified, and on what the landlord actually said.",
  metaDescription:
    "Can a landlord refuse permission to sublet in Kenya? It depends on whether your covenant is absolute or qualified. What each means.",
  publishedAt: "2026-09-07",
  readingMinutes: 7,
  author: authors.legal,
  tags: ["Kenya", "Sublet", "Legal", "Landlord", "Lease", "Tenant"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Nairobi apartment lease being reviewed for its subletting covenant",
};

export default function Article() {
  return (
    <>
      <Lede>
        Usually yes. The room to challenge a
        refusal exists but is much narrower than
        most tenants hope, and it turns on a
        distinction in your own lease that takes
        thirty seconds to check: whether the
        subletting covenant is absolute or
        qualified.
      </Lede>

      <H2 id="absolute">If the covenant is absolute</H2>

      <P>
        &ldquo;The Tenant shall not sublet, assign
        or part with possession.&rdquo; No
        reference to consent, no reference to
        reasonableness. Here the landlord is
        entitled to refuse for any reason, for a
        bad reason, or for no reason at all, and
        is not obliged to explain themselves.
      </P>

      <P>
        There is no implied requirement of
        reasonableness in an absolute covenant.
        Courts will not write one in, because the
        parties chose an absolute prohibition and
        the tenant took the lease on those terms.
        A tenant arguing that the refusal is
        unfair, or that the proposed sub-tenant is
        obviously respectable, is arguing about
        something the covenant does not make
        relevant.
      </P>

      <P>
        Your route here is negotiation, not
        challenge. A landlord can always agree to
        waive an absolute covenant, and{" "}
        <Link
          href="/insights/ask-landlord-permission-short-let-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how you ask
        </Link>{" "}
        matters far more than what the law says
        about it.
      </P>

      <H2 id="qualified">If the covenant is qualified</H2>

      <P>
        &ldquo;...not without the prior written
        consent of the Landlord.&rdquo; Now the
        lease contemplates the thing happening,
        and your position improves. Two versions
        of this exist and the difference is
        significant.
      </P>

      <H3 id="with-reasonableness">With an express reasonableness proviso</H3>

      <P>
        Where the lease says &ldquo;which consent
        shall not be unreasonably withheld&rdquo;,
        the landlord has a contractual obligation
        and a refusal can be challenged. The test
        is directed at the landlord&rsquo;s
        interest in the property and in the
        landlord and tenant relationship, not at
        whether the refusal was kind.
      </P>

      <P>
        Refusals that have generally been found
        reasonable include a proposed sub-tenant
        of doubtful financial standing, a proposed
        use that breaches another covenant in the
        lease or that the building&rsquo;s own
        head lease prohibits, a sub-tenant whose
        occupation would create a statutory
        security the landlord would then be stuck
        with, and a proposed arrangement the
        landlord&rsquo;s insurer will not cover.
      </P>

      <P>
        Refusals that look unreasonable include
        one motivated by a wish to force a
        surrender so the unit can be relet at a
        higher rent, one based on grounds wholly
        unconnected with the property, one based
        on a characteristic of the proposed
        sub-tenant that the law protects, and one
        used purely as leverage to extract a
        payment the lease does not provide for.
      </P>

      <H3 id="without-reasonableness">Without the proviso</H3>

      <P>
        A bare requirement for consent, with no
        reasonableness wording, sits between the
        two. The landlord has more latitude than
        under an express proviso, but a court is
        unlikely to read a bare consent
        requirement as conferring an unfettered
        veto identical to an absolute prohibition,
        since the parties could have written an
        absolute prohibition and did not. A
        refusal driven by something entirely
        extraneous remains vulnerable. This is the
        least predictable of the three positions
        and the one most worth taking advice on.
      </P>

      <Callout title="Check for the proviso before anything else">
        The words &ldquo;which consent shall not
        be unreasonably withheld&rdquo; are worth
        more to a tenant than any other eleven
        words in a lease. Their presence or
        absence decides whether you have a
        argument or only a request.
      </Callout>

      <H2 id="procedure">Procedure matters, and landlords lose on it</H2>

      <P>
        Even where the substance of a refusal
        would be defensible, how it was handled
        can undermine it.
      </P>

      <UL>
        <LI>
          <strong>Silence is not refusal, and it
          is not consent.</strong> A landlord who
          simply does not answer a properly made
          written request, for weeks, is not in a
          strong position. Nor is the tenant
          entitled to treat the silence as a yes:
          the safe course is a written follow-up
          recording the delay.
        </LI>
        <LI>
          <strong>Reasons given late are
          suspect.</strong> Where a landlord
          refuses without reasons and produces
          them only once challenged, the later
          reasons carry less weight, particularly
          if they have changed.
        </LI>
        <LI>
          <strong>Conditions can amount to
          refusal.</strong> Consent granted
          subject to a condition the tenant could
          never satisfy, or subject to a payment
          the lease does not authorise, may be
          treated as a refusal rather than a
          consent.
        </LI>
        <LI>
          <strong>Ask properly.</strong> A tenant
          who never made a clear written request
          identifying the proposed arrangement has
          not put the landlord in a position to
          consent, and cannot complain about the
          answer.
        </LI>
      </UL>

      <Pullquote>
        Make the request in writing, describe the
        arrangement precisely, and keep the reply.
        Most disputes about consent are really
        disputes about what was asked and when.
      </Pullquote>

      <H2 id="short-let">Short-letting sharpens all of it</H2>

      <P>
        Where the proposal is nightly letting
        rather than a conventional sublease, a
        landlord has considerably more that is
        reasonable to point to: additional wear
        from constant turnover, the
        building&rsquo;s house rules and
        management committee, insurance that does
        not cover commercial short-stay
        occupation, and neighbour complaints that
        land on the owner. A refusal grounded in
        any of those is likely to be reasonable
        even under an express proviso.
      </P>

      <P>
        Note also that a nightly guest occupies
        under a licence rather than a sublease, so
        a consent to sublet may not authorise
        short-letting at all, and a clause aimed
        only at subletting may not prohibit it.
        See{" "}
        <Link
          href="/insights/lease-vs-licence-kenya-landlords"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          lease or licence
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/landlord-permission-to-sublet-kenya"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          whether you need permission to sublet
        </Link>
        .
      </P>

      <H2 id="landlords">If you are the landlord</H2>

      <P>
        You are entitled to refuse, and under an
        absolute covenant you need not explain.
        But consider whether you want to. A tenant
        who intends to run a short-let operation
        has both the means and the strong motive
        to pay rent on time, and consent on
        conditions you set is often worth more
        than a refusal that leads to them doing it
        quietly anyway.
      </P>

      <P>
        If you do consent, set the terms: a longer
        term, a larger deposit, evidence of
        appropriate insurance with your interest
        noted, a named managing agent accountable
        for the unit, and a right to withdraw the
        consent on notice. If you refuse, do it in
        writing, promptly, with your reasons, and
        keep them consistent.
      </P>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        We sit on both sides of this. We manage
        long-term property for owners, and we
        manage short-let units for operators who
        lease rather than own, which means we are
        often the party a landlord is being asked
        to accept. That is deliberate: an owner
        weighing a short-let proposal is far more
        comfortable when a managing agent is
        accountable for the unit, and being able
        to name one is frequently what turns a
        refusal into a conditional yes.
      </P>

      <P>
        We will not manage a unit without the
        owner&rsquo;s written consent, whatever
        the covenant says.{" "}
        <Link
          href="/airbnb-arbitrage-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Management for operators
        </Link>{" "}
        sets out how we handle the consent
        conversation. This article is general
        information and not legal advice on your
        lease, which turns on wording and
        correspondence we have not seen.
      </P>
    </>
  );
}

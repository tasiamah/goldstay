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
  slug: "landlord-permission-to-sublet-kenya",
  title:
    "Do you need your landlord's permission to sublet in Kenya?",
  metaTitle: "Landlord Permission to Sublet in Kenya: The Rules",
  description:
    "Whether you need consent to sublet depends on what your lease says, and most Kenyan residential leases either prohibit it or require written permission. Silence is not consent, and short-letting makes the question sharper.",
  metaDescription:
    "Do you need your landlord's permission to sublet in Kenya? What your lease has to say, why silence is not consent, and how to ask.",
  publishedAt: "2026-09-07",
  readingMinutes: 8,
  author: authors.legal,
  tags: ["Kenya", "Sublet", "Legal", "Lease", "Operator", "Short-Let"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Nairobi apartment block where subletting requires the landlord's written consent",
};

export default function Article() {
  return (
    <>
      <Lede>
        The question arrives in two very different
        moods. Sometimes it is a tenant who wants
        to cover the rent for four months abroad.
        Increasingly it is somebody who intends to
        lease a unit and re-let it on nightly
        bookings, and wants to know how much of a
        problem the landlord is going to be.
      </Lede>

      <P>
        The legal answer is the same in both
        cases, and it is short. Whether you need
        permission depends on what your lease
        says, and in Kenya the overwhelming
        majority of residential leases either
        prohibit subletting outright or allow it
        only with the landlord&rsquo;s prior
        written consent.
      </P>

      <H2 id="start-with-the-lease">Start with the lease, not with the law</H2>

      <P>
        There is no general statutory right to
        sublet a residential property in Kenya and
        no general statutory prohibition either.
        The right to sublet is a matter of
        contract. Your lease creates it, limits it
        or removes it, so the document in your
        drawer is the answer and everything below
        is only about how to read it.
      </P>

      <P>
        Leases fall into four rough categories.
      </P>

      <H3 id="absolute-prohibition">An absolute prohibition</H3>

      <P>
        &ldquo;The Tenant shall not sublet, assign
        or part with possession of the Premises or
        any part thereof.&rdquo; This is the most
        common wording in Nairobi residential
        leases and it means what it says. There is
        no implied reasonableness requirement
        attached to an absolute covenant: the
        landlord can refuse for any reason or for
        none, and is not obliged to explain.
      </P>

      <P>
        A landlord can still waive it. If you ask
        and they agree in writing, the agreement
        varies the lease for that arrangement.
        What you cannot do is treat their silence,
        or a friendly conversation at the gate, as
        the waiver.
      </P>

      <H3 id="qualified">A qualified covenant</H3>

      <P>
        &ldquo;...not without the prior written
        consent of the Landlord.&rdquo; This is
        the second most common form and it is
        considerably better for you, because it
        contemplates the thing happening. Some
        leases add &ldquo;which consent shall not
        be unreasonably withheld&rdquo;, which
        changes your position materially. Without
        those words the landlord has more room,
        though a refusal driven by something
        wholly extraneous to the tenancy is still
        vulnerable.
      </P>

      <H3 id="short-let-specific">A short-let specific clause</H3>

      <P>
        Newer leases, and especially leases in
        managed apartment blocks, now name the
        thing directly: no Airbnb, no short-stay
        letting, no daily or weekly occupation, no
        listing on booking platforms. Owners and
        management committees have caught up, and
        drafting has followed. Where a lease says
        this, a general permission to sublet
        obtained years ago does not help you,
        because the specific clause governs.
      </P>

      <H3 id="silence">Silence</H3>

      <P>
        A lease that says nothing about subletting
        is the case operators hope for and the one
        that gets over-read. At common law a
        tenant with a lease that is genuinely
        silent may sublet, because a tenant may do
        what the lease does not forbid. That is a
        real principle and it is narrower than it
        sounds.
      </P>

      <UL>
        <LI>
          <strong>Silence is uncommon.</strong>{" "}
          Most leases that appear silent turn out
          to contain a use clause, a
          &ldquo;private residence only&rdquo;
          covenant, or a prohibition on parting
          with possession, any of which can bite.
        </LI>
        <LI>
          <strong>A use covenant does the same
          work.</strong> &ldquo;The Premises shall
          be used as a private dwelling for the
          Tenant and their family only&rdquo;
          prohibits short-letting perfectly
          effectively without using the word
          sublet.
        </LI>
        <LI>
          <strong>Short-letting is not
          subletting.</strong> This cuts both
          ways. A nightly guest occupies under a
          licence rather than a sublease, which
          means a clause aimed only at subletting
          may not catch it, and equally means
          consent to sublet may not authorise it.
          See{" "}
          <Link
            href="/insights/lease-vs-licence-kenya-landlords"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            lease or licence
          </Link>{" "}
          for why the distinction matters.
        </LI>
        <LI>
          <strong>House rules can bind you.</strong>{" "}
          Where the lease incorporates the
          building&rsquo;s rules by reference, and
          most apartment leases do, a management
          committee resolution banning short-stay
          guests becomes a term of your tenancy
          without your lease being amended.
        </LI>
      </UL>

      <Callout title="Read the whole lease, not the subletting clause">
        The clause that stops most Nairobi
        short-let plans is not the subletting
        clause. It is the use clause, the
        parting-with-possession clause, or the
        incorporated house rules. Somebody who
        checks only for the word
        &ldquo;sublet&rdquo; and finds nothing has
        not established that they are free to
        proceed.
      </Callout>

      <H2 id="why-it-matters">What is actually at risk</H2>

      <P>
        Subletting in breach of the lease is a
        breach of covenant, and the consequences
        are not administrative.
      </P>

      <UL>
        <LI>
          <strong>Termination.</strong> The
          landlord can treat the breach as
          grounds to end the tenancy, and a
          deliberate, continuing, revenue
          generating breach is about the least
          sympathetic position a tenant can
          occupy.
        </LI>
        <LI>
          <strong>Your deposit.</strong> Expect
          it to be applied against the breach and
          to be argued about afterwards.
        </LI>
        <LI>
          <strong>The furnishing.</strong> This is
          the one that hurts an operator. You have
          put four to nine thousand dollars into a
          unit you now have to leave, usually at
          short notice and with bookings on the
          calendar you cannot honour.
        </LI>
        <LI>
          <strong>Your guests.</strong> Confirmed
          bookings you have to cancel become
          platform penalties, refunds and a
          damaged account, on top of everything
          else.
        </LI>
        <LI>
          <strong>The sub-tenant.</strong> An
          unauthorised sublease is not void
          between you and your sub-tenant. You
          still owe them what you promised, which
          means you can be liable to them for a
          failure caused by your own breach
          upstream.
        </LI>
      </UL>

      <Pullquote>
        The risk in subletting without permission
        is not that you get a warning letter. It
        is that you lose a furnished unit you paid
        to furnish, in the middle of a booking
        calendar you cannot honour.
      </Pullquote>

      <H2 id="how-to-ask">How to ask, and what to ask for</H2>

      <P>
        Ask before you commit to the rent, not
        afterwards. An operator who has already
        signed a twelve month lease has no
        leverage and every incentive to proceed
        regardless, which landlords can smell.
      </P>

      <P>
        Get the permission in writing and make it
        specific. A one-line email saying
        &ldquo;fine by me&rdquo; is better than
        nothing and worse than useless in a
        dispute about what exactly was agreed.
        Permission should name the arrangement,
        say who is responsible for the unit and
        for guests, deal with insurance, and say
        what happens if it goes wrong. We have set
        out how to put that to an owner, with a
        letter you can adapt, in{" "}
        <Link
          href="/insights/ask-landlord-permission-short-let-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how to ask a landlord for permission to
          short-let
        </Link>
        .
      </P>

      <P>
        And if the answer is no, take it
        seriously rather than as an opening bid.
        Where the covenant is absolute the
        landlord is entitled to refuse, and{" "}
        <Link
          href="/insights/can-landlord-refuse-sublet-kenya"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the circumstances in which a refusal can
          be challenged
        </Link>{" "}
        are narrower than most people assume.
      </P>

      <H2 id="landlords">If you are the landlord reading this</H2>

      <P>
        You are probably here because you suspect
        a tenant is letting your unit on nightly
        bookings. Check the lease first for the
        same four clause types, because your
        remedy depends on which one you have, and
        a use covenant is often a stronger basis
        than a subletting covenant. Then decide
        what you actually want: consent on terms
        can be worth more than a fight, since a
        tenant running a short-let operation
        generally has both the means and the
        motive to keep paying rent on time.
      </P>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        We manage short-let units for operators
        who lease rather than own, and we ask to
        see the owner&rsquo;s written consent
        before we take one on. Our management
        agreement carries a capacity written for
        exactly this position: you warrant that
        you hold the head lease and that the owner
        has permitted both the subletting and our
        appointment. We ask because we would be
        the visible party in any dispute, and
        because half of what we do is act for
        landlords.
      </P>

      <P>
        We are also well placed to help you get
        the consent, since we already manage
        long-term property for owners in the same
        buildings.{" "}
        <Link
          href="/airbnb-arbitrage-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Management for operators
        </Link>{" "}
        sets out how that works and what it costs.
        This article is general information and
        not legal advice on your particular lease,
        which turns on wording we have not seen.
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
          href="/insights/sublease-agreement-kenya-operators"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          what a sublease has to contain
        </Link>
        .
      </P>
    </>
  );
}

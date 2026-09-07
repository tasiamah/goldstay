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
  slug: "terminating-a-tenancy-agreement-kenya",
  title: "Ending a tenancy in Kenya lawfully, without going to court",
  metaTitle: "Terminating a Tenancy Agreement in Kenya",
  description:
    "Most tenancies end without a dispute, and the ones that turn into evictions usually did not have to. This is the clean exit: which notice, how long, served how, and the handover that stops a deposit argument becoming a claim.",
  metaDescription:
    "How to end a Kenyan tenancy lawfully: which notice applies, how long it must be, how to serve it, and the handover that prevents a deposit dispute.",
  publishedAt: "2026-09-07",
  readingMinutes: 9,
  author: authors.legal,
  tags: ["Kenya", "Landlord", "Legal", "Tenancy Agreement", "Notice"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Handover of keys at the end of a Nairobi tenancy",
};

export default function Article() {
  return (
    <>
      <Lede>
        We publish a good deal about eviction,
        because when it goes wrong it goes very
        wrong. What gets written about far less is
        the ordinary case, which is most cases: a
        tenancy that simply needs to end, on time,
        without anybody instructing an advocate.
        Doing that properly is mostly a matter of
        serving the right notice and running a
        disciplined handover.
      </Lede>

      <P>
        Termination and eviction are different
        things and conflating them is the source of
        a lot of unnecessary cost. Termination
        brings the tenancy to an end. Eviction is
        what you are forced into when the tenancy
        has ended and the occupant has not left.
        Everything below is about staying in the
        first category.
      </P>

      <H2 id="how-tenancies-end">The four ways a Kenyan tenancy ends</H2>

      <OL>
        <LI>
          <strong>Effluxion of time.</strong> A
          fixed term expires on its stated end
          date. In principle nothing further is
          needed, though in practice a reminder
          notice avoids the holdover problem below.
        </LI>
        <LI>
          <strong>Notice to quit.</strong> A
          periodic tenancy, whether monthly or
          created by holding over, is ended by
          notice from either party of the length
          the agreement or the general law
          requires.
        </LI>
        <LI>
          <strong>Break clause.</strong> A fixed
          term ended early by one party exercising
          a right the lease gave them, on the
          notice and conditions the clause states.
        </LI>
        <LI>
          <strong>Surrender by agreement.</strong>{" "}
          Both parties agree to end it early and
          record that agreement in writing. The
          quickest and most underused route.
        </LI>
      </OL>

      <Callout title="The holdover trap">
        A fixed term expires, the tenant stays, and
        you accept next month&rsquo;s rent. You
        have very likely created a new periodic
        tenancy on the old terms. That is not a
        disaster, but the notice you now need to
        end it is governed by that periodic
        tenancy rather than by the expired lease,
        and landlords who assume the fixed term
        ended everything discover otherwise. If you
        do not want a holdover, do not accept rent
        after expiry without agreeing in writing
        what it is for.
      </Callout>

      <H2 id="notice-length">How much notice</H2>

      <P>
        This depends on which regime the tenancy
        sits under, and it is the question worth
        getting right before you draft anything.
      </P>

      <H3 id="controlled">Controlled residential tenancies</H3>

      <P>
        Where the rent falls at or below the
        threshold under the Rent Restriction Act,
        the Act prescribes the notice and the Rent
        Restriction Tribunal supervises. You cannot
        shorten it by agreement, and a notice that
        does not comply is invalid rather than
        merely late. Take advice before serving.
      </P>

      <H3 id="uncontrolled">Uncontrolled residential tenancies</H3>

      <P>
        The majority of letting in the
        neighbourhoods we manage. Notice is
        whatever the tenancy agreement says, and
        where it is silent, the general law
        supplies a period matching the rental
        period, so a month for a monthly tenancy.
        This is one of the strongest arguments for
        a properly drafted agreement: it is the
        only place the notice period is set.
      </P>

      <H3 id="business">Business premises</H3>

      <P>
        If the tenant runs a shop, hotel or
        catering business from the premises, the
        tenancy may be controlled under the
        Landlord and Tenant Shops, Hotels and
        Catering Establishments Act, which requires
        notice in a prescribed form, gives long
        minimum periods, and allows the tenant to
        object to the Business Premises Rent
        Tribunal. A residential landlord who let a
        ground floor unit to a salon is in this
        regime whether or not they realised.
      </P>

      <H2 id="serving-it">Serving the notice so that it counts</H2>

      <UL>
        <LI>
          <strong>In writing, always.</strong> A
          conversation is not a notice. Neither, on
          its own, is a WhatsApp message, unless the
          agreement expressly permits electronic
          service.
        </LI>
        <LI>
          <strong>To the address in the
          agreement.</strong> Not to wherever you
          believe they now are.
        </LI>
        <LI>
          <strong>By a method the agreement
          allows.</strong> Hand delivery against a
          signed acknowledgement is best. Registered
          post with the receipt retained is the
          usual alternative.
        </LI>
        <LI>
          <strong>Dated, and stating the date
          possession is required.</strong> Not
          &ldquo;in one month&rdquo; but the actual
          calendar date, calculated to expire at the
          end of a rental period where that is
          required.
        </LI>
        <LI>
          <strong>Keep proof.</strong> The
          acknowledgement, the postal receipt, a
          photograph of the notice affixed if that
          is what the agreement permits. If it comes
          to a hearing, service is the first thing
          challenged.
        </LI>
      </UL>

      <Pullquote>
        A notice that is a week short is not a
        notice that arrives a week late. It is
        usually no notice at all, and you begin
        again from the day you discover it.
      </Pullquote>

      <H2 id="surrender">The route landlords forget: agreed surrender</H2>

      <P>
        Where a tenant wants to leave early and you
        want them gone, there is no need for either
        of you to rely on notice provisions at all.
        A short written surrender agreement can end
        the tenancy on an agreed date, deal with the
        rent up to that date, settle the deposit,
        and record that neither party has further
        claims.
      </P>

      <P>
        This is worth reaching for more often than
        it is. A tenant who has been posted abroad
        and wants out of a fixed term will often
        agree to cover the void until you relet, or
        to forfeit part of the deposit, in exchange
        for a clean exit. That is a better outcome
        than a tenant who simply stops paying and
        dares you to sue.
      </P>

      <H2 id="handover">The handover, which is where the money is</H2>

      <P>
        The tenancy has ended. What determines
        whether it ends cleanly is the next two
        hours.
      </P>

      <OL>
        <LI>
          <strong>Inspect with the tenant
          present.</strong> Not after they have
          gone. An inspection the tenant witnessed
          and signed is nearly impossible to argue
          with later.
        </LI>
        <LI>
          <strong>Compare against the schedule of
          condition.</strong> The one attached to
          the agreement at the start. This is the
          entire reason it exists.
        </LI>
        <LI>
          <strong>Photograph everything,
          dated.</strong> Including the meters.
        </LI>
        <LI>
          <strong>Take final meter
          readings.</strong> Water, electricity,
          and the prepaid token balance where
          applicable, so the tenant is billed to
          the day.
        </LI>
        <LI>
          <strong>Collect every key, card and
          remote.</strong> Against the list in the
          inventory. Replacement of access cards
          and gate remotes is a real cost and a
          legitimate deduction if they are missing.
        </LI>
        <LI>
          <strong>Confirm the service charge and
          utility position.</strong> Unpaid
          utilities follow the property in
          practice, whatever the contract says
          about whose name the account is in.
        </LI>
        <LI>
          <strong>Account for the deposit in
          writing.</strong> An itemised statement
          with the receipt or quotation behind
          every deduction, within the period the
          agreement sets.
        </LI>
      </OL>

      <Callout title="Deductions need evidence, not estimates">
        A deposit deduction supported by a
        contractor&rsquo;s invoice is defensible. A
        round number with no document behind it
        invites a claim, and in a dispute the party
        holding the money is the one who has to
        justify keeping it. Get the quote before
        you deduct, not after the tenant objects.
      </Callout>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        Every tenancy we manage ends with a
        witnessed inspection against the original
        schedule of condition, photographs, final
        meter readings and an itemised deposit
        statement with receipts attached. The
        tenant signs the inspection on the day.
        Across the properties we run, deposit
        disputes are rare, and the reason is
        procedural rather than clever: it is very
        hard to argue about a condition report you
        signed while standing in the room.
      </P>

      <P>
        We also serve notices ourselves on{" "}
        <Link
          href="/long-term-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          long-term management
        </Link>
        , which matters for diaspora landlords
        because valid service usually needs
        somebody physically present with an
        acknowledgement slip, and a notice posted
        from abroad to an address nobody checks is
        not service in any useful sense.
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/tenancy-agreement-kenya-landlord-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the tenancy agreement guide
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
          the eviction playbook for when this does
          not work
        </Link>
        .
      </P>
    </>
  );
}

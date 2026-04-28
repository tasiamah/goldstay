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
  slug: "tenant-screening-nairobi-how-we-do-it",
  title:
    "Tenant screening in Nairobi: the checklist we actually use",
  description:
    "How professional tenant screening works in Kenya in 2026, the eight checks we run before any lease is signed, the three patterns that predict bad tenancy, and what to do when somebody offers six months rent up front in cash.",
  publishedAt: "2024-12-18",
  readingMinutes: 8,
  author: authors.poonam,
  tags: ["Nairobi", "Tenants", "Screening", "Operations"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Tenant screening Nairobi, how to vet a prospective tenant in Kenya",
};

export default function Article() {
  return (
    <>
      <Lede>
        The single highest-leverage decision in property
        management is who you let in. Once a tenant has
        keys, every other lever (eviction, repair recovery,
        rent enforcement) is slower, more expensive, and
        more uncertain than the prevention. Here is the
        eight-point screening process we run on every
        prospective tenant in Nairobi, the three patterns
        that predict trouble, and why six months of rent
        offered in cash up front is more often a red flag
        than an opportunity.
      </Lede>

      <H2 id="why-it-matters">Why screening matters more in Kenya</H2>

      <P>
        In a market with strong landlord protections and
        fast court processes, screening can be lighter
        because remediation is cheap. Kenya is the
        opposite. Eviction takes 90 days at best, 18
        months at worst (read{" "}
        <Link
          href="/insights/how-to-evict-tenant-kenya-legally"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the eviction guide
        </Link>
        ). Rent recovery is contested. Damage repair is
        almost never recovered through deposit. Every
        problem is more expensive to solve in Kenya than
        in the UK or US. So the efficient frontier is
        prevention.
      </P>

      <H2 id="eight-checks">The eight checks we run</H2>

      <H3 id="check-1">1. Government-issued ID verification</H3>

      <P>
        National ID for Kenyan tenants, passport for
        foreign tenants. We photograph the original (not
        a copy) against the tenant&rsquo;s face on a video
        call or in person. We cross-reference the ID
        number against the iTax PIN, since every adult
        Kenyan working formally has one. If the ID and
        PIN do not align, we do not proceed.
      </P>

      <H3 id="check-2">2. Employment verification</H3>

      <P>
        Last three pay slips. We call the HR contact
        independently using the publicly listed company
        number, not the number on the pay slip. Roughly
        5% of pay slips presented to us in any given
        quarter turn out to be either fake or for an
        employment that has ended. Independent verification
        is the only way to catch this.
      </P>

      <H3 id="check-3">3. Bank statement, three months</H3>

      <P>
        We require three months of bank statements. We are
        looking for: regular salary credits matching the
        pay slips, no salary credit reversals (which
        suggests the bank is clawing back due to fraud
        flagging), no concentration of single large
        deposits with no source documentation, and a
        balance position consistent with somebody who can
        cover three months of rent if income paused.
      </P>

      <H3 id="check-4">4. Landlord reference</H3>

      <P>
        We require a reference from the previous landlord
        and we contact them independently. Kenyan
        landlords do not always know the questions to
        ask, so we ask them ourselves: was rent ever
        late? How many months out of twelve was rent
        paid on time? Were there damage disputes? Why
        is the tenant moving?
      </P>

      <P>
        We treat &ldquo;great tenant, no issues&rdquo;
        with mild scepticism if the previous landlord is
        a relative. We treat the same statement with
        confidence if the previous landlord is a known
        management company or a corporate landlord.
      </P>

      <H3 id="check-5">5. Credit check</H3>

      <P>
        Credit Reference Bureaus (CRB) operate in Kenya:
        Metropol, TransUnion, CreditInfo. A CRB report
        costs roughly KES 200 to KES 500 and shows any
        defaulted loans, persistent late payments, or
        listed adverse credit events. We run one on
        every Kenyan-passport tenant. For foreign
        tenants we ask for a credit reference from their
        home country if the tenancy is long enough to
        justify it.
      </P>

      <H3 id="check-6">6. Social and online check</H3>

      <P>
        We look up the tenant on LinkedIn against the
        company they say they work for. We look up the
        company itself, especially if it is small and
        unfamiliar, against the BRS (Business Registration
        Service). We are not looking for perfection. We
        are looking for consistency between what the
        tenant says and what is independently verifiable.
      </P>

      <H3 id="check-7">7. In-person interview</H3>

      <P>
        Either physically or by video call. The
        conversation goes in 30 minutes: how long they
        plan to stay, how many people will live in the
        unit, work-from-home patterns, pets, smoking,
        what they would do if the geyser fails on a
        Sunday morning. The answers reveal far more about
        the prospective tenancy than any document.
      </P>

      <H3 id="check-8">8. Lease term match</H3>

      <P>
        We match lease terms to the tenant&rsquo;s
        actual situation. A 12 month lease for somebody
        on a three month consulting contract is asking
        for early termination. A 6 month lease for
        somebody who has just moved their family across
        the country is short-changing your own tenant
        retention. The right lease length is the term
        the tenant most plausibly stays.
      </P>

      <Pullquote>
        The right lease length is the term the tenant
        most plausibly stays, not the longest term you
        can persuade them to sign.
      </Pullquote>

      <H2 id="three-patterns">Three patterns that predict bad tenancy</H2>

      <H3 id="pattern-1">1. Hurry</H3>

      <P>
        Tenants who insist on signing within 48 hours
        and resist any of the standard checks. Healthy
        tenant moves are paced over one to three weeks.
        Hurry is almost always covering for one of:
        another landlord refusing to let them stay, a
        recent court issue, an income source they do not
        want examined, or imminent insolvency.
      </P>

      <H3 id="pattern-2">2. Cash up front</H3>

      <P>
        Six or twelve months of rent offered in cash up
        front. This is a real Kenyan pattern that
        sometimes is exactly what it looks like (a senior
        diaspora returnee or a businessperson who prefers
        to settle in cash) and sometimes is exactly what
        it is not (somebody who knows they will not pay
        going forward and is buying themselves time).
      </P>

      <P>
        The cash up front does not eliminate the need for
        screening. It just means the screening has a
        different shape. We ask about source of funds, we
        cross-check against income, and we accept the
        cash only into a Kenyan bank account that
        triggers ordinary AML reporting. If the prospect
        is uncomfortable with the funds going through a
        bank, they should not be your tenant.
      </P>

      <H3 id="pattern-3">3. Reluctance to provide one specific document</H3>

      <P>
        Tenants who provide everything except, say, the
        bank statement. Or everything except a previous
        landlord reference. The missing document is
        almost always the one that contains the truth
        the tenant is hiding. We do not proceed with any
        tenancy where one specific check has been
        actively avoided.
      </P>

      <H2 id="what-it-costs">What screening costs</H2>

      <UL>
        <LI>CRB credit report: KES 200 to KES 500 per check.</LI>
        <LI>Time, mostly. A full screening pack runs about 2 to 3 hours.</LI>
        <LI>
          Two to four days from application to lease
          signing. Faster than informal arrangements but
          slower than &ldquo;same-day if you have the
          money&rdquo;, which is the wrong cadence for
          serious tenancies.
        </LI>
      </UL>

      <Callout title="The most useful question we ask">
        &ldquo;What rent are you paying right now, and
        what was your rent before that?&rdquo; Tenants
        with stable rent histories that match their
        income answer easily. Tenants with chaotic
        histories struggle. Five seconds of phrasing
        often reveals more than five hours of paperwork.
      </Callout>

      <H2 id="how-we-handle-it">How we handle screening</H2>

      <P>
        For every Goldstay-managed property, we run the
        full eight-point check before any lease is
        signed. The landlord receives a screening summary
        with the recommendation: proceed, proceed with
        adjusted terms (e.g. additional deposit), or
        decline. The landlord has final say but the
        recommendation is clear.
      </P>

      <P>
        We turn down roughly 30 to 40% of prospective
        tenants who reach the application stage. The
        share is higher than most informal landlords
        realise, and it is the single largest reason our
        properties have meaningfully lower arrears and
        damage rates than the Nairobi average.
      </P>
    </>
  );
}

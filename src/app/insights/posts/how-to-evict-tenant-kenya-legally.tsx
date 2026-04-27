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
  slug: "how-to-evict-tenant-kenya-legally",
  title:
    "How to evict a tenant in Kenya, legally and as quickly as possible",
  description:
    "The exact legal process for evicting a non-paying or breaching tenant in Nairobi in 2026. Notice periods, the right court, the four common mistakes that add six months to a case, and how to avoid ever needing the process at all.",
  publishedAt: "2026-02-25",
  readingMinutes: 9,
  author: authors.poonam,
  tags: ["Kenya", "Eviction", "Legal", "Tenants", "Nairobi"],
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt: "Nairobi apartment block, how to legally evict a tenant in Kenya",
};

export default function Article() {
  return (
    <>
      <Lede>
        Almost every diaspora landlord we onboard has either
        lived through a difficult eviction or is one missed rent
        payment away from one. The good news is that the Kenyan
        eviction process is more landlord-friendly than the
        common gossip suggests, provided you follow it
        correctly. The bad news is that almost everybody starts
        wrong, which adds three to nine months to the timeline.
        Here is the exact process, the four mistakes that
        wreck cases, and the practical playbook for keeping
        timelines short.
      </Lede>

      <H2 id="legal-framework">The legal framework</H2>

      <P>
        Two Acts govern residential eviction in Kenya:
      </P>

      <UL>
        <LI>
          <strong>The Distress for Rent Act (Cap 293)</strong>
          gives the landlord the right to recover unpaid rent
          by lawful seizure of the tenant&rsquo;s goods,
          executed via a licensed auctioneer. Useful for
          recovering rent owed; does not by itself remove the
          tenant.
        </LI>
        <LI>
          <strong>The Rent Restriction Act (Cap 296)</strong>
          and the <strong>Landlord and Tenant Act</strong>
          (subject to ongoing reform) govern the actual
          termination of tenancy and recovery of possession.
          For most residential lets above the controlled-rent
          threshold, the relevant route is a plain civil claim
          in the appropriate Magistrate&rsquo;s Court.
        </LI>
      </UL>

      <P>
        For controlled tenancies (rent below the prescribed
        threshold) you go through the Rent Restriction Tribunal.
        For everyone above (most diaspora-owned units in
        Nairobi), you go through the Magistrate&rsquo;s Court.
        Mixing the two is the first big mistake.
      </P>

      <H2 id="step-by-step">The process, step by step</H2>

      <H3 id="step-1">Step 1: Issue a written notice to remedy</H3>

      <P>
        Any termination starts with a written notice giving the
        tenant a chance to remedy the breach. For non-payment,
        the standard practice is a 14 day notice to pay all
        outstanding rent or vacate. The notice must be in
        writing, dated, signed, and properly served (delivered
        in person with acknowledgement, or by registered post,
        or to the property address with a witness).
      </P>

      <P>
        WhatsApp messages do not constitute formal notice. Your
        case will be challenged on this point and you will
        lose weeks. Use a written letter, even if you also send
        a WhatsApp.
      </P>

      <H3 id="step-2">Step 2: Issue a notice to terminate</H3>

      <P>
        If the tenant does not remedy within the notice period,
        you issue a notice to terminate the tenancy. For a
        monthly tenancy, the standard notice is one month. For
        a fixed-term lease, you rely on the breach clause in
        the lease itself, which typically gives 14 to 30 days.
      </P>

      <H3 id="step-3">
        Step 3: File a plaint at the Magistrate&rsquo;s Court
      </H3>

      <P>
        The plaint asks the court for: vacant possession of the
        premises, a money judgment for arrears, mesne profits
        (compensation for occupation post-termination), interest,
        and costs. Filing fees scale with the amount claimed.
        For a typical Nairobi 1 or 2 bed eviction the total
        court costs come in around KES 12,000 to KES 25,000.
      </P>

      <P>
        You file at the court with jurisdiction over the
        property location: typically Milimani Commercial Courts
        for Nairobi properties.
      </P>

      <H3 id="step-4">Step 4: Service of summons</H3>

      <P>
        The tenant must be personally served. They have 14 days
        to enter appearance and 21 days to file a defence.
        Most tenants in arrears do not file a defence, in which
        case the landlord can apply for judgment in default.
      </P>

      <H3 id="step-5">Step 5: Judgment and warrant of eviction</H3>

      <P>
        On default judgment or after a contested hearing, the
        court issues an order for vacant possession. If the
        tenant still does not vacate, the landlord applies for
        a warrant of eviction, which is then executed by the
        court bailiff or a licensed auctioneer.
      </P>

      <P>
        Lawful eviction execution requires giving the tenant
        notice (typically 7 days), and is conducted in daylight
        hours with a court official or licensed auctioneer
        present. The tenant&rsquo;s belongings are removed and
        either stored at the tenant&rsquo;s cost or sold at
        public auction to recover arrears.
      </P>

      <Callout title="Realistic timelines">
        Best case for an uncontested eviction in Nairobi is
        roughly 90 to 120 days from first written notice to
        executed warrant. A contested case routinely runs 9 to
        18 months. Adjournments, judge availability, and
        tenant counsel tactics drive most of the variance.
      </Callout>

      <H2 id="four-mistakes">Four mistakes that wreck timelines</H2>

      <H3 id="mistake-1">1. Self-help eviction</H3>

      <P>
        Changing the locks, cutting power, removing the
        tenant&rsquo;s belongings without a warrant, or
        physically removing the tenant. All of these are
        unlawful in Kenya and expose the landlord to
        counter-claims for damages and even criminal charges.
        We have seen otherwise winnable cases collapse because
        the landlord, frustrated after three months of
        non-payment, cut power for two days. The tenant&rsquo;s
        counter-claim ate the original arrears and added
        another six months to the case.
      </P>

      <H3 id="mistake-2">2. Skipping the formal notice</H3>

      <P>
        Going straight to court without a properly served
        written notice. The court will dismiss or stay the
        case until notice is served and the period has run.
        You lose four to eight weeks.
      </P>

      <H3 id="mistake-3">3. Wrong court</H3>

      <P>
        Filing at the Rent Restriction Tribunal when the
        tenancy is uncontrolled, or vice versa. Cases get
        struck out and you start again.
      </P>

      <H3 id="mistake-4">4. Inadequate documentation</H3>

      <P>
        No signed lease, no record of payments, no record of
        notices, no MRI tax filings (a tenant&rsquo;s counsel
        can use the absence of MRI filings to suggest the
        landlord operates outside the law). Diaspora landlords
        managed by informal arrangements often discover at
        the courtroom door that they have no admissible
        evidence of anything.
      </P>

      <Pullquote>
        Diaspora landlords managed by informal arrangements
        often discover at the courtroom door that they have
        no admissible evidence of anything.
      </Pullquote>

      <H2 id="prevention">The actual answer: avoiding eviction</H2>

      <P>
        Most evictions are the consequence of a chain of
        smaller decisions, each of which could have been made
        differently. The single highest-leverage change a
        landlord can make is to never allow arrears to grow
        past one month. Once two or more months are owed, the
        tenant&rsquo;s incentive structure flips. They have
        nothing to lose by staying as long as possible.
      </P>

      <P>
        Operationally, this means:
      </P>

      <OL>
        <LI>
          Reminder on day one past due, every time, no
          exceptions.
        </LI>
        <LI>
          Formal demand letter on day five.
        </LI>
        <LI>
          Statutory 14 day notice to pay or vacate on day
          fifteen.
        </LI>
        <LI>
          Plaint filed on day thirty if no payment received
          and no genuine plan to remedy.
        </LI>
      </OL>

      <P>
        Tenants quickly learn the cadence. Most never let it
        progress past day five. The few who do are exactly
        the tenants you want to remove anyway.
      </P>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        We run the same cadence on every property. Reminder
        on day one. Demand letter on day five. Statutory
        notice on day fifteen. Eviction filing on day thirty.
        We work with two specialist landlord-and-tenant
        litigation firms in Nairobi who handle the court
        process, and the cost of litigation is split between
        the landlord and any recoverable judgment costs at
        the end of the case.
      </P>

      <P>
        Goldstay does not earn a margin on legal work. The
        firms invoice you direct, we coordinate, you pay only
        what the firms charge.
      </P>

      <P>
        If your current property is in a difficult tenant
        situation, we can take it over mid-case. Send the
        details on{" "}
        <Link
          href="/list-your-property"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          this form
        </Link>
        . We will assess where the case actually stands, what
        documentation exists, and what the realistic path to
        recovery is.
      </P>
    </>
  );
}

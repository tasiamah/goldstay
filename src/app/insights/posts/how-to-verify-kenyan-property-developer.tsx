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
  slug: "how-to-verify-kenyan-property-developer",
  title:
    "How to verify a Kenyan property developer before buying off-plan",
  description:
    "Off-plan buyers carry the project execution risk on the developer&rsquo;s shoulders. Pick the wrong developer and your deposit funds the next failed Instagram launch. Here is the practical 2026 checklist for verifying a Kenyan property developer before you commit, with the specific questions and the documents that matter.",
  publishedAt: "2024-10-26",
  readingMinutes: 8,
  author: authors.editors,
  tags: [
    "Kenya",
    "Developer",
    "Off-plan",
    "Diligence",
    "Buying",
    "Diaspora",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "How to verify a Kenyan property developer before buying off-plan, diligence checklist 2026",
};

export default function Article() {
  return (
    <>
      <Lede>
        Off-plan buyers carry the entire project
        execution risk on the developer&rsquo;s
        shoulders. Pick a strong developer and an off
        plan deposit becomes equity in a finished
        building. Pick a weak one and the deposit funds
        the next failed Instagram launch. The good
        news is that strong developers and weak
        developers are usually distinguishable from each
        other if you do 90 minutes of work before you
        commit. Here is the practical 2026 checklist
        for verifying a Kenyan property developer.
      </Lede>

      <H2 id="track-record">Step 1: track record</H2>

      <P>
        The single most important diligence question:
        what has this developer actually delivered.
        Specifically:
      </P>

      <OL>
        <LI>
          How many completed projects does the
          developer have. Not announced, not in
          progress, completed.
        </LI>
        <LI>
          Where are they. Can you visit them today.
        </LI>
        <LI>
          When were they completed. A developer that
          finished one project in 2018 and has been
          launching ever since without delivering
          another is a different developer from one
          that has finished a project a year for the
          last five years.
        </LI>
        <LI>
          Are the completed projects performing in
          rental and resale, or struggling.
        </LI>
        <LI>
          What did the original buyers from the first
          phase actually get versus what was promised.
        </LI>
      </OL>

      <P>
        A developer that cannot point to three
        completed projects, with first-phase buyers
        you can speak to, is a developer that has not
        actually shown they can do this work. The
        Instagram is not evidence.
      </P>

      <H2 id="legal-form">Step 2: legal form and beneficial ownership</H2>

      <UL>
        <LI>
          Confirm the developer is a registered
          company in Kenya (CR number, registration
          date, registered office)
        </LI>
        <LI>
          Confirm the directors and beneficial owners
          (BO disclosure is now mandatory under the
          Beneficial Ownership Regulations)
        </LI>
        <LI>
          Cross-reference the directors against any
          past failed projects, regulatory actions or
          litigation (a Google search of the
          director&rsquo;s name plus &ldquo;Kenya
          property&rdquo; reveals more than you would
          expect)
        </LI>
        <LI>
          Confirm the project SPV (Special Purpose
          Vehicle, a separate company that owns the
          specific project) and the relationship
          between the SPV and the parent developer
        </LI>
      </UL>

      <H2 id="land">Step 3: land ownership and approvals</H2>

      <P>
        The single most important answer here: does
        the developer or the project SPV actually own
        the land.
      </P>

      <OL>
        <LI>
          Run an Ardhisasa or Lands Registry search on
          the project parcel. Confirm the developer or
          SPV is the registered owner.
        </LI>
        <LI>
          Confirm the title is freehold or has a
          long enough remaining lease for the project
          to make sense (50+ years remaining as a
          minimum for residential)
        </LI>
        <LI>
          Confirm there are no charges, cautions or
          restrictions registered against the title
        </LI>
        <LI>
          Confirm county-level approvals: change of
          user (if applicable), development permit,
          building plans approval
        </LI>
        <LI>
          Confirm NEMA approval where required
        </LI>
      </OL>

      <P>
        A project where the developer does not own the
        land yet, where approvals are &ldquo;in
        progress&rdquo; or where charges are
        registered, is a project at substantial
        execution risk regardless of how attractive
        the marketing is.
      </P>

      <H2 id="finance">Step 4: project finance structure</H2>

      <UL>
        <LI>
          How is the project financed: developer
          equity, off-plan deposits, bank facility,
          private capital, or some combination
        </LI>
        <LI>
          Has a construction loan been arranged
        </LI>
        <LI>
          What is the proportion of the build cost
          covered by deposits versus other sources
        </LI>
        <LI>
          Do deposits sit in an escrow account
          managed by a third party (lawyer&rsquo;s
          client account or escrow agent), or in the
          developer&rsquo;s operating account
        </LI>
        <LI>
          Is there a buyer protection mechanism (in
          the event of developer default)
        </LI>
      </UL>

      <P>
        A project largely funded by buyer deposits with
        no escrow, no construction loan and limited
        developer equity is a project where the
        completion is conditional on continued
        deposit inflows. If the inflows pause for any
        reason, the project pauses.
      </P>

      <H2 id="contractor">Step 5: contractor and consultants</H2>

      <UL>
        <LI>
          Who is the main contractor. Is it a known
          firm with previous projects you can verify
        </LI>
        <LI>
          Who is the architect, structural engineer,
          quantity surveyor. Are they all Kenyan
          professional body registered (Architectural
          Association of Kenya, Institution of
          Engineers of Kenya, Institute of Quantity
          Surveyors of Kenya)
        </LI>
        <LI>
          Is the contractor on site already, or will
          they be appointed once deposits are
          collected
        </LI>
        <LI>
          What is the construction contract structure
          and the payment milestone schedule
        </LI>
      </UL>

      <H2 id="contract">Step 6: the buyer contract</H2>

      <P>
        Read the off-plan sale agreement carefully.
        Specific clauses to focus on:
      </P>

      <UL>
        <LI>
          <strong>Delivery date</strong>: a specific
          date with a defined remedy if missed (extension
          window, deposit refund, penalty)
        </LI>
        <LI>
          <strong>Specification</strong>: the spec is
          a schedule attached to the contract, not a
          marketing brochure that can change
        </LI>
        <LI>
          <strong>Variation rights</strong>: can the
          developer change the spec or layout without
          buyer consent? In what circumstances?
        </LI>
        <LI>
          <strong>Defect liability period</strong>: at
          least 12 months after handover for fixes
        </LI>
        <LI>
          <strong>Title transfer date</strong>:
          specific commitment on when the sectional
          title will be issued and registered, not
          &ldquo;within reasonable time&rdquo;
        </LI>
        <LI>
          <strong>Refund clause</strong>: what
          happens if the project is cancelled, delayed
          beyond a defined window or fundamentally
          altered
        </LI>
        <LI>
          <strong>Escrow arrangement</strong>:
          deposits sit in escrow until specific
          construction milestones
        </LI>
        <LI>
          <strong>Governing law and dispute
          resolution</strong>: Kenyan courts, with
          arbitration as a possible alternative for
          larger projects
        </LI>
      </UL>

      <H2 id="references">Step 7: references and reputation</H2>

      <OL>
        <LI>
          Speak to at least three previous buyers from
          the developer&rsquo;s completed projects
        </LI>
        <LI>
          Ask specifically about delivery date
          reliability, specification consistency, defect
          handling and post-completion responsiveness
        </LI>
        <LI>
          Ask specifically about title delivery
          (registered title in buyer&rsquo;s name, on
          time)
        </LI>
        <LI>
          Search news and social media for the
          developer&rsquo;s name; bad projects leave
          digital trails
        </LI>
        <LI>
          Ask the broker community quietly about the
          developer&rsquo;s reputation; established
          brokers know which developers complete and
          which ones do not
        </LI>
      </OL>

      <H2 id="financial">Step 8: financial signals</H2>

      <UL>
        <LI>
          A developer offering implausibly attractive
          payment plans (5 percent down with the
          balance over 5 years, no interest) is
          almost always running a deposit-funded
          construction model
        </LI>
        <LI>
          A developer running aggressive flash sales
          and &ldquo;today only&rdquo; pricing is
          using behavioural pressure rather than
          building durable demand
        </LI>
        <LI>
          A developer with clear professional pricing
          and a consistent payment schedule (typically
          20 to 30 percent deposit, balance against
          milestones) is more likely to be financially
          serious
        </LI>
        <LI>
          A developer asking buyers to pay deposits
          directly to a personal or directors&rsquo;
          account, rather than to a corporate or
          escrow account, is the strongest negative
          signal
        </LI>
      </UL>

      <H2 id="green-flags">Green flags that strengthen confidence</H2>

      <OL>
        <LI>
          Completed projects that you can visit, with
          residents in occupation
        </LI>
        <LI>
          Tier 1 bank construction finance facility in
          place
        </LI>
        <LI>
          Escrow account with a tier 1 firm or trust
        </LI>
        <LI>
          Engagement with established firms (architect,
          QS, contractor)
        </LI>
        <LI>
          Specific delivery date with credible defaults
          if missed
        </LI>
        <LI>
          Title transfer commitment with specific
          timing
        </LI>
        <LI>
          Refund clause with realistic mechanism for
          delays beyond a defined window
        </LI>
        <LI>
          References from earlier-phase buyers who
          received their titles on time and got the
          unit they were promised
        </LI>
      </OL>

      <Callout title="The shortcut question">
        Ask the developer for a list of three
        completed projects, with the contact details
        of three buyers from each who got their
        registered title on time and the unit they
        were promised. A developer that cannot produce
        this is a developer you should not be writing
        a deposit cheque to.
      </Callout>

      <Pullquote>
        Off-plan in Kenya is not a category to avoid.
        It is a category to be selective in. Strong
        developers do exist and deliver consistently.
        The diligence above separates them from the
        ones whose marketing is better than their
        construction.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For sourcing clients we maintain an internal
        list of developers we work with confidently
        and developers we steer clients away from
        regardless of price. Our diligence on every
        off-plan project follows the checklist above
        before we recommend.
      </P>

      <P>
        Read also our pieces on{" "}
        <Link
          href="/insights/buying-off-plan-nairobi-risks-red-flags"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          off-plan red flags
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/why-nairobi-off-plan-delivery-dates-slip"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          why off-plan dates slip
        </Link>{" "}
        for the deeper context.
      </P>
    </>
  );
}

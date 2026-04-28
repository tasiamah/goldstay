import Link from "next/link";
import { authors, type PostMeta } from "./_shared";
import {
  Callout,
  H2,
  LI,
  Lede,
  OL,
  P,
  Pullquote,
  UL,
} from "@/components/ArticleProse";

export const meta: PostMeta = {
  slug: "stalled-construction-projects-kenya-what-to-do",
  title:
    "Stalled construction projects in Kenya: what to do when your build stops in 2026",
  description:
    "When a Kenyan build stalls, the cost of inaction compounds quickly. Here is the honest 2026 playbook on what to do when your construction project stops, the legal and contractual options, the realistic recovery paths and the prevention measures that work next time.",
  publishedAt: "2025-10-01",
  readingMinutes: 7,
  author: authors.editors,
  tags: [
    "Kenya",
    "Construction",
    "Stalled Projects",
    "Build",
    "Disputes",
    "Property",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Stalled construction projects Kenya 2026 what to do honest playbook",
};

export default function Article() {
  return (
    <>
      <Lede>
        When a Kenyan build stalls, the cost of
        inaction compounds quickly. Materials
        deteriorate, security weakens, scope
        creeps, contractor leverage shifts and
        the project that was 70 percent complete
        starts requiring 60 percent of the
        original budget to finish. Here is the
        honest 2026 playbook on what to do.
      </Lede>

      <H2 id="why-stall">Why builds stall</H2>

      <UL>
        <LI>
          Cash flow gap on the owner side
        </LI>
        <LI>
          Cash flow problem on the contractor
          side
        </LI>
        <LI>
          Material price inflation that broke
          the original quote
        </LI>
        <LI>
          Spec creep that consumed contingency
        </LI>
        <LI>
          Disputes (contractor vs sub-contractor,
          owner vs contractor, neighbour
          disputes)
        </LI>
        <LI>
          Approval issues that paused work
        </LI>
        <LI>
          Family disputes among co-owners
        </LI>
        <LI>
          Owner abroad with reduced engagement
        </LI>
        <LI>
          Death or illness of the principal
          owner or contractor
        </LI>
      </UL>

      <H2 id="immediate">Immediate actions</H2>

      <OL>
        <LI>
          <strong>Secure the site</strong>:
          fence, security guards, CCTV. An
          unsecured stalled site loses material
          quickly
        </LI>
        <LI>
          <strong>Inventory what is on
          site</strong>: materials, equipment,
          partial works
        </LI>
        <LI>
          <strong>Confirm legal status</strong>:
          contractor still under contract, NCA
          notification status, insurances
        </LI>
        <LI>
          <strong>Insure</strong>: ensure the
          works are covered by all-risks
          insurance for the stalled period
        </LI>
        <LI>
          <strong>Engage the architect / QS</strong>:
          formal certification of the position
          (work done, work outstanding,
          variations, payments due)
        </LI>
        <LI>
          <strong>Communicate with the
          contractor in writing</strong>: not
          email threats, but formal notices
          recording the position
        </LI>
      </OL>

      <H2 id="paths">Recovery paths</H2>

      <H2 id="path1">Path 1: resume with same contractor</H2>

      <UL>
        <LI>
          Negotiate revised price for remaining
          works
        </LI>
        <LI>
          Agree milestone payments tied to
          progress
        </LI>
        <LI>
          QS values the existing position
          before any additional payment
        </LI>
        <LI>
          Updated programme with a credible
          completion date
        </LI>
        <LI>
          Revised security or retention to
          incentivise completion
        </LI>
      </UL>

      <H2 id="path2">Path 2: terminate and re-engage</H2>

      <UL>
        <LI>
          Formal notice of default and
          termination per the contract
        </LI>
        <LI>
          QS valuation of work done and amounts
          due (in either direction)
        </LI>
        <LI>
          New contractor engaged for remaining
          works
        </LI>
        <LI>
          Increased completion cost (5 to 25
          percent typically) reflecting the
          rebid environment
        </LI>
        <LI>
          Resolution of any contractor claims
          (payments due, retentions, materials
          on site)
        </LI>
      </UL>

      <H2 id="path3">Path 3: pause and restart later</H2>

      <UL>
        <LI>
          Where cash flow on the owner side is
          the primary issue
        </LI>
        <LI>
          Site fully secured and weatherproofed
        </LI>
        <LI>
          Materials secured or sold
        </LI>
        <LI>
          Contractor relationship preserved or
          formally closed
        </LI>
        <LI>
          Restart cost (10 to 20 percent
          typically) for de-mobilisation and
          re-mobilisation
        </LI>
      </UL>

      <H2 id="path4">Path 4: dispose of the project as is</H2>

      <UL>
        <LI>
          Sell the site with partial works in
          place
        </LI>
        <LI>
          Discount of 30 to 50 percent versus
          completed value typically
        </LI>
        <LI>
          Buyer profile: developer, investor or
          contractor with capacity to complete
        </LI>
        <LI>
          Title diligence on outstanding charges
          and disputes essential
        </LI>
      </UL>

      <H2 id="legal">Legal and contractual considerations</H2>

      <UL>
        <LI>
          Review the JBC or bespoke construction
          contract for default, termination and
          dispute resolution clauses
        </LI>
        <LI>
          Engage a construction lawyer if the
          dispute is contested
        </LI>
        <LI>
          Arbitration clauses are common; expect
          dispute resolution outside court
        </LI>
        <LI>
          Performance bonds (if any) can be
          called for genuine contractor default
        </LI>
        <LI>
          Sub-contractors have direct claims in
          some scenarios (NCA dispute resolution,
          payment claims)
        </LI>
      </UL>

      <H2 id="prevent">Prevention</H2>

      <UL>
        <LI>
          Engage NCA-registered contractor
          for the right category
        </LI>
        <LI>
          Use proper construction contract
        </LI>
        <LI>
          Retain proper architect and QS
        </LI>
        <LI>
          Milestone payments tied to certified
          progress, not calendar
        </LI>
        <LI>
          Retention (5 to 10 percent typically)
          held against final completion
        </LI>
        <LI>
          Owner-side contingency of 15 percent
        </LI>
        <LI>
          Active site visits (or representative
          for absentee owners)
        </LI>
        <LI>
          All-risks insurance cover throughout
        </LI>
      </UL>

      <Callout title="The stalled build rule">
        A stalled build is a managed crisis,
        not a permanent loss. Action within
        the first 30 days protects most of the
        value. Inaction over months is what
        turns it into a permanent loss. Engage
        the QS, secure the site, document the
        position, and choose the recovery path
        deliberately.
      </Callout>

      <Pullquote>
        Most stalled Kenyan builds were
        avoidable at the start. The next-best
        outcome is recovering them through a
        deliberate plan rather than letting
        them rust under the rain.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For build clients in distress we
        coordinate the QS, legal and new-
        contractor leg of the recovery. Read
        also our pieces on{" "}
        <Link
          href="/insights/what-to-do-developer-goes-bankrupt-kenya"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          what to do if your developer goes
          bankrupt
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/why-nairobi-off-plan-delivery-dates-slip"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          why off-plan delivery dates slip
        </Link>
        .
      </P>
    </>
  );
}

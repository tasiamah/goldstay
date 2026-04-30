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
  slug: "county-building-approvals-kenya-roadmap",
  title:
    "County building approvals in Kenya: the practical 2026 roadmap",
  description:
    "Building approvals in Kenya are run by the counties and they are one of the most procedural parts of the build. Here is the honest 2026 roadmap on county building approvals, who you need, how long each step takes, what each one costs, and how to keep the build on schedule.",
  publishedAt: "2025-12-07",
  readingMinutes: 7,
  author: authors.legal,
  tags: [
    "Kenya",
    "Building Approvals",
    "County",
    "Construction",
    "Compliance",
    "Permits",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "County building approvals Kenya 2026 practical roadmap",
};

export default function Article() {
  return (
    <>
      <Lede>
        Building approvals in Kenya are run by the
        counties under the Physical and Land Use
        Planning Act and various county finance
        and planning laws. The process is
        procedural, multi-stakeholder and
        time-consuming, but predictable when
        run properly. Here is the 2026 roadmap.
      </Lede>

      <H2 id="who">Who is involved</H2>

      <UL>
        <LI>
          County Department of Physical Planning
        </LI>
        <LI>
          County Department of Public Works
        </LI>
        <LI>
          County Public Health Office
        </LI>
        <LI>
          NEMA (National Environment Management
          Authority) for projects above
          threshold
        </LI>
        <LI>
          National Construction Authority (NCA)
          for contractor registration and
          project notification
        </LI>
        <LI>
          Water and sewerage utility
        </LI>
        <LI>
          KPLC for power connection
        </LI>
        <LI>
          County Fire Department for some
          projects
        </LI>
      </UL>

      <H2 id="step1">Step 1: PPA1 (planning approval)</H2>

      <UL>
        <LI>
          Architect prepares application with
          drawings
        </LI>
        <LI>
          Submitted to County Physical Planning
          Department
        </LI>
        <LI>
          Reviewed for zoning compliance
        </LI>
        <LI>
          Typical fee: KES 20,000 to KES 80,000
          for residential
        </LI>
        <LI>
          Typical timeline: 30 to 90 days
        </LI>
      </UL>

      <H2 id="step2">Step 2: building plan approval</H2>

      <UL>
        <LI>
          Architectural drawings, structural
          drawings, electrical and plumbing
          drawings submitted
        </LI>
        <LI>
          County Public Works review
        </LI>
        <LI>
          Public Health review (sanitation,
          waste, water)
        </LI>
        <LI>
          Fee: percentage of estimated
          construction cost (typically 0.5 to
          1.5 percent)
        </LI>
        <LI>
          Typical timeline: 30 to 90 days
        </LI>
      </UL>

      <H2 id="step3">Step 3: NEMA (environmental impact)</H2>

      <UL>
        <LI>
          Required for projects above defined
          thresholds (large residential, mixed
          use, commercial)
        </LI>
        <LI>
          EIA (Environmental Impact Assessment)
          conducted by registered consultant
        </LI>
        <LI>
          Submitted to NEMA for review
        </LI>
        <LI>
          Public participation requirement
        </LI>
        <LI>
          Fee: 0.05 to 0.1 percent of project
          cost
        </LI>
        <LI>
          Typical timeline: 60 to 150 days for
          full EIA
        </LI>
      </UL>

      <H2 id="step4">Step 4: NCA (contractor and project)</H2>

      <UL>
        <LI>
          Contractor must be NCA registered for
          the relevant category
        </LI>
        <LI>
          Project notified to NCA at start of
          works
        </LI>
        <LI>
          NCA project levy: 0.5 percent of
          project cost
        </LI>
        <LI>
          Typical timeline: 7 to 21 days for
          notification
        </LI>
      </UL>

      <H2 id="step5">Step 5: utility connections</H2>

      <UL>
        <LI>
          Water connection application
        </LI>
        <LI>
          Sewer connection or septic system
          approval
        </LI>
        <LI>
          KPLC power connection
        </LI>
        <LI>
          Telecoms and fibre
        </LI>
      </UL>

      <H2 id="step6">Step 6: occupation certificate</H2>

      <UL>
        <LI>
          On completion of build
        </LI>
        <LI>
          County inspection
        </LI>
        <LI>
          Occupation certificate issued
        </LI>
        <LI>
          Required for connection of utilities
          on official tariffs and for some
          insurance coverage
        </LI>
      </UL>

      <H2 id="costs">Total cost benchmark</H2>

      <UL>
        <LI>
          For a typical 250 sqm Nairobi
          standalone home, total approval and
          consent costs typically run KES
          200,000 to KES 700,000 depending on
          county
        </LI>
        <LI>
          Plus utility connections KES 100,000
          to KES 500,000+
        </LI>
        <LI>
          Plus consultant fees (architect, QS,
          structural, electrical, mechanical,
          environmental)
        </LI>
      </UL>

      <H2 id="timeline">Total timeline benchmark</H2>

      <UL>
        <LI>
          Pre-construction approvals: 4 to 8
          months realistic
        </LI>
        <LI>
          Build: 12 to 24 months
        </LI>
        <LI>
          Occupation certificate: 1 to 3 months
          after practical completion
        </LI>
      </UL>

      <H2 id="speed">How to keep it on schedule</H2>

      <UL>
        <LI>
          Engage architect and QS who have
          delivered in your specific county
        </LI>
        <LI>
          Run the consents in parallel, not in
          series, where possible
        </LI>
        <LI>
          Submit complete files first time
          (incomplete files get sent back)
        </LI>
        <LI>
          Engage NCA-registered contractor from
          the start (avoids re-papering)
        </LI>
        <LI>
          Build a relationship with the county
          office; follow up actively
        </LI>
      </UL>

      <Callout title="The approvals rule">
        Build approvals in Kenya are
        unavoidable, predictable when run
        properly, and time-consuming when run
        carelessly. Front-load the consultant
        team, run consents in parallel, and
        build the timeline into the project
        from day one.
      </Callout>

      <Pullquote>
        Most build delays in Kenya trace to one
        of two failures: a contractor who was
        not NCA registered for the right
        category, or a consent that was filed
        incomplete and bounced back twice. Both
        are preventable.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For build clients we coordinate the
        consent stack and the consultant team
        end to end. Read also our pieces on{" "}
        <Link
          href="/insights/cost-of-building-3-bedroom-house-kenya-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          cost of building
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/architects-quantity-surveyors-kenya-cost-value"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          architects and quantity surveyors
        </Link>
        .
      </P>
    </>
  );
}

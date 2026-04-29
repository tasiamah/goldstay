import Link from "next/link";
import { authors, type PostMeta } from "./_shared";
import {
  Callout,
  H2,
  LI,
  Lede,
  P,
  Pullquote,
  UL,
} from "@/components/ArticleProse";

export const meta: PostMeta = {
  slug: "best-nairobi-off-plans-2026-ranked",
  title:
    "Best Nairobi off-plans in 2026 ranked: the honest map",
  description:
    "Luminara, The Diplomat, Gemini, Pandora, Brookside Oak, Riviera at Brookside, Le Mac and several other off-plans are competing for the same diaspora and professional investor cohort. Here is the honest 2026 ranked map of Nairobi off-plans by segment, location and risk profile.",
  publishedAt: "2026-04-10",
  readingMinutes: 6,
  author: authors.research,
  tags: [
    "Off-Plan",
    "Nairobi",
    "Ranked",
    "Buyer Guide",
    "2026",
    "Property",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Best Nairobi off-plans 2026 ranked honest map",
};

export default function Article() {
  return (
    <>
      <Lede>
        Luminara, The Diplomat, Gemini,
        Pandora, Brookside Oak, Riviera at
        Brookside, Le Mac and several other
        off-plans are competing for the same
        diaspora and professional investor
        cohort. Marketing budgets are
        substantial. Diligence shortcuts are
        common. Here is the honest 2026 ranked
        map by segment, location and risk
        profile.
      </Lede>

      <H2 id="approach">How to think about ranking</H2>

      <P>
        We do not rank by marketing budget,
        glossy brochure or launch event
        attendance. We rank by location
        anchor, developer track record,
        specification quality, milestone
        discipline and tenant-pool fit. The
        result correlates poorly with
        marketing prominence and well with
        long-term outcome.
      </P>

      <H2 id="premium">Premium tier: location anchor + delivery track record</H2>

      <UL>
        <LI>
          <strong>Brookside Oak</strong>:
          location anchor on Brookside Drive
          is the strongest in this group;
          developer track record is the
          decisive factor
        </LI>
        <LI>
          <strong>The Diplomat (Gigiri /
          Runda corridor)</strong>: tenant
          thesis defensible; verify with
          actual lettings community before
          committing
        </LI>
      </UL>

      <H2 id="mid-premium">Mid-premium tier: corridor selection + specification</H2>

      <UL>
        <LI>
          <strong>Luminara</strong>: marketed
          well; segment positioning standard
          for the corridor; track record
          and specification compared to
          delivered stock decide the
          outcome
        </LI>
        <LI>
          <strong>Pandora</strong>: similar
          comments; diaspora marketing leans
          heavy
        </LI>
        <LI>
          <strong>Gemini</strong>: tower-led;
          oversupply lens applies; compound
          and developer selection within the
          tier matters more than the tier
        </LI>
        <LI>
          <strong>Riviera at Brookside</strong>:
          location anchor strong; segment
          positioning premium-leaning
        </LI>
      </UL>

      <H2 id="other">Other notable launches in 2026</H2>

      <UL>
        <LI>
          Le Mac (Westlands core, mid-rise
          mixed-use stock)
        </LI>
        <LI>
          Karen-area gated compound launches
          from established developers
        </LI>
        <LI>
          Mi Vida new phases on existing
          developments
        </LI>
        <LI>
          Acorn-style PBSA next generation
        </LI>
        <LI>
          Centum Two Rivers next phases
        </LI>
      </UL>

      <H2 id="discipline">The discipline that decides outcome</H2>

      <UL>
        <LI>
          <strong>Track record</strong>:
          confirm prior delivered projects
          and handover quality
        </LI>
        <LI>
          <strong>Title</strong>: verify
          mother title, encumbrances,
          zoning at Lands Registry
        </LI>
        <LI>
          <strong>Approvals</strong>: NEMA,
          NCA, county before deposit
        </LI>
        <LI>
          <strong>Milestones</strong>:
          payment tied to construction
          stages, not calendar dates
        </LI>
        <LI>
          <strong>Independent counsel</strong>:
          not the developer&rsquo;s lawyer
        </LI>
        <LI>
          <strong>Comparables</strong>: per
          square metre against delivered
          stock in the same micro-market
        </LI>
        <LI>
          <strong>Specification protection</strong>:
          finishing schedule attached to
          contract with photo-grade
          definition
        </LI>
        <LI>
          <strong>Defect liability</strong>:
          retention or defect liability
          period at handover
        </LI>
      </UL>

      <Callout title="The off-plan ranking rule">
        The strongest 2026 off-plan you can
        buy is the one with the strongest
        location anchor, the cleanest
        developer track record, the most
        protected contract and the best
        per-square-metre comparable. Marketing
        prominence is not on this list. Apply
        the discipline.
      </Callout>

      <Pullquote>
        Most off-plan rankings online are
        ranked by marketing budget. The
        honest ranking is the one that
        looks at outcomes after delivery,
        not at the launch weekend.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For sourcing clients we evaluate
        every shortlisted off-plan through
        the same diligence framework. Read
        also our pieces on{" "}
        <Link
          href="/insights/luminara-review-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Luminara review
        </Link>
        ,{" "}
        <Link
          href="/insights/the-diplomat-off-plan-review-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          The Diplomat review
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/brookside-oak-off-plan-review-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Brookside Oak review
        </Link>
        .
      </P>
    </>
  );
}

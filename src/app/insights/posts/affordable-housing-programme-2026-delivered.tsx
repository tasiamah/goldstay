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
  slug: "affordable-housing-programme-2026-delivered",
  title:
    "Affordable Housing Programme 2026: what has actually been delivered",
  description:
    "The Affordable Housing Programme (AHP) was the most ambitious property policy initiative of the Kenyan government in recent years. Here is the honest 2026 stocktake on what has actually been delivered, what is in pipeline, and what it means for first-time Nairobi buyers.",
  publishedAt: "2026-03-14",
  readingMinutes: 5,
  author: authors.legal,
  tags: [
    "AHP",
    "Affordable Housing",
    "Nairobi",
    "Government",
    "Buyer Guide",
    "Property",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Affordable Housing Programme 2026 actually delivered honest stocktake",
};

export default function Article() {
  return (
    <>
      <Lede>
        The Affordable Housing Programme (AHP)
        was the most ambitious property policy
        initiative of the Kenyan government in
        recent years. Here is the honest 2026
        stocktake on what has actually been
        delivered.
      </Lede>

      <H2 id="background">Programme background</H2>

      <UL>
        <LI>
          Launched as part of the
          government’s “Big
          Four” agenda; continued
          under the Kenya Kwanza
          administration
        </LI>
        <LI>
          Funded through Housing Levy
          (1.5 percent of gross salary
          plus employer match)
        </LI>
        <LI>
          Delivered through Boma Yangu
          allocation system
        </LI>
        <LI>
          Linked to KMRC for affordable
          mortgage financing
        </LI>
      </UL>

      <H2 id="delivered">What has been delivered</H2>

      <UL>
        <LI>
          Park Road Estate (Ngara): a
          flagship delivered project with
          1,300+ units allocated through
          Boma Yangu
        </LI>
        <LI>
          Other phased deliveries in
          Nairobi metro and beyond
        </LI>
        <LI>
          Boma Yangu allocation portal
          operating
        </LI>
        <LI>
          KMRC-aligned affordable mortgage
          rates 9.5 to 11.5 percent
          available through partner banks
        </LI>
      </UL>

      <H2 id="pipeline">What is in pipeline</H2>

      <UL>
        <LI>
          Multiple sites in Nairobi metro
          under construction at varied
          progress stages
        </LI>
        <LI>
          Site delivery has been slower
          than original political timelines
        </LI>
        <LI>
          Allocation backlog remains
          significant relative to applicant
          base
        </LI>
      </UL>

      <H2 id="reality">The realistic 2026 picture</H2>

      <UL>
        <LI>
          Volume delivered is meaningful but
          smaller than the political
          headline; the wider supply
          pipeline still depends on private
          developers
        </LI>
        <LI>
          KMRC affordable mortgage product
          is the most quantifiable benefit
          for first-time buyers
        </LI>
        <LI>
          Boma Yangu allocation is real;
          process is documented; allocation
          is competitive
        </LI>
        <LI>
          The programme has not transformed
          the wider Nairobi housing market
          in the way the original political
          framing suggested
        </LI>
      </UL>

      <H2 id="for-buyers">What it means for first-time buyers</H2>

      <UL>
        <LI>
          Apply to Boma Yangu if income and
          eligibility align
        </LI>
        <LI>
          Apply for KMRC-aligned mortgage
          through Co-op, KCB, Equity, HFC,
          Family or Stanbic
        </LI>
        <LI>
          Do not wait for AHP allocation
          if there are credible private
          alternatives at similar price
          and quality
        </LI>
        <LI>
          Treat AHP as one option in a
          shortlist, not the only option
        </LI>
      </UL>

      <Callout title="The AHP rule">
        Affordable Housing Programme is
        real, smaller than the political
        headline, and most useful as the
        gateway to KMRC-aligned mortgage
        rates rather than as the
        delivery channel for the unit
        itself. First-time buyers should
        treat it as one shortlist option.
      </Callout>

      <Pullquote>
        Government housing programmes
        rarely deliver on the original
        scale. AHP’s most lasting
        contribution is probably the
        KMRC mortgage architecture, not
        the unit count.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For first-time buyer clients we
        check AHP eligibility alongside
        private alternatives. Read also
        our pieces on{" "}
        <Link
          href="/insights/boma-yangu-affordable-housing-programme-diaspora"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Boma Yangu
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/kmrc-affordable-mortgage-explained"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          KMRC explained
        </Link>
        .
      </P>
    </>
  );
}

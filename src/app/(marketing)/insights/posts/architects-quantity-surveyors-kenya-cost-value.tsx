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
  slug: "architects-quantity-surveyors-kenya-cost-value",
  title:
    "Architects and quantity surveyors in Kenya: cost and value in 2026",
  description:
    "Architects and quantity surveyors are the two most consequential professional appointments on a Kenyan build, and the two appointments owners most often cut corners on. Here is the honest 2026 guide to what they do, what they cost, and what good ones save you.",
  publishedAt: "2025-11-27",
  readingMinutes: 6,
  author: authors.editors,
  tags: [
    "Kenya",
    "Architects",
    "Quantity Surveyors",
    "Construction",
    "Build",
    "Property",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Architects and quantity surveyors Kenya 2026 cost and value guide",
};

export default function Article() {
  return (
    <>
      <Lede>
        Architects and quantity surveyors are the
        two most consequential professional
        appointments on a Kenyan build, and the
        two appointments owners most often cut
        corners on. Here is the honest 2026 guide
        on what they do, what they cost and what
        good ones save you.
      </Lede>

      <H2 id="architect">What the architect actually does</H2>

      <UL>
        <LI>
          Translates the brief into a build
          design
        </LI>
        <LI>
          Produces drawings (architectural,
          coordinated with structural and
          engineering)
        </LI>
        <LI>
          Submits and runs the planning and
          building approval process
        </LI>
        <LI>
          Specifies finishes
        </LI>
        <LI>
          Supervises construction (extent depends
          on the engagement model)
        </LI>
        <LI>
          Certifies progress payments to the
          contractor
        </LI>
        <LI>
          Issues practical completion and
          handover certificates
        </LI>
      </UL>

      <H2 id="qs">What the quantity surveyor actually does</H2>

      <UL>
        <LI>
          Quantifies the bill of materials and
          labour from the design
        </LI>
        <LI>
          Produces the bill of quantities (BoQ)
          used to tender the work
        </LI>
        <LI>
          Negotiates the contract sum with the
          contractor
        </LI>
        <LI>
          Tracks progress against the BoQ
        </LI>
        <LI>
          Values variations
        </LI>
        <LI>
          Certifies progress payments alongside
          the architect
        </LI>
        <LI>
          Produces the final account at end of
          project
        </LI>
      </UL>

      <H2 id="fees">Typical fees</H2>

      <UL>
        <LI>
          <strong>Architect (BORAQS scale)</strong>:
          6 to 10 percent of construction cost
        </LI>
        <LI>
          <strong>Quantity surveyor</strong>: 1
          to 2 percent of construction cost
        </LI>
        <LI>
          <strong>Structural engineer</strong>:
          1 to 1.5 percent
        </LI>
        <LI>
          <strong>Electrical and mechanical
          engineer</strong>: 0.5 to 1 percent
          each
        </LI>
        <LI>
          <strong>Project manager (where
          separate)</strong>: 2 to 4 percent
        </LI>
      </UL>

      <H2 id="value">What good ones save you</H2>

      <UL>
        <LI>
          Design that matches the budget rather
          than aspiration: 5 to 15 percent
          saved on construction cost
        </LI>
        <LI>
          Approvals that go through first time:
          2 to 6 months saved on timeline
        </LI>
        <LI>
          BoQ that prevents contractor padding:
          5 to 10 percent saved on materials
        </LI>
        <LI>
          Progress certification that prevents
          over-payment relative to actual work:
          5 to 10 percent saved on cash flow
          discipline
        </LI>
        <LI>
          Variation control that prevents the
          build creeping in scope: 10 to 25
          percent saved on the eventual final
          account
        </LI>
        <LI>
          Contract administration that protects
          the owner from contractor disputes:
          difficult to quantify, sometimes the
          difference between a finished build
          and an abandoned site
        </LI>
      </UL>

      <H2 id="how-to-choose">How to choose</H2>

      <UL>
        <LI>
          Verify BORAQS registration (architects)
          and IQSK registration (QS)
        </LI>
        <LI>
          See three completed projects of
          similar scale and brief
        </LI>
        <LI>
          Talk to two recent clients
        </LI>
        <LI>
          Review their drawings and BoQs from
          previous projects
        </LI>
        <LI>
          Check that they will sign as
          principal agent on your contract
        </LI>
        <LI>
          Confirm professional indemnity
          insurance
        </LI>
      </UL>

      <H2 id="cutting-corners">When owners try to cut corners</H2>

      <UL>
        <LI>
          Self-managing without an architect:
          almost always over budget and behind
          schedule. Approvals nightmare.
          Disputes with contractor that nobody
          arbitrates
        </LI>
        <LI>
          Skipping the QS: contractors quote
          loosely, materials inflate, variations
          accumulate, final account surprise
        </LI>
        <LI>
          Hiring unqualified family member:
          best case awkward, worst case
          litigation
        </LI>
      </UL>

      <Callout title="The professional rule">
        On a Kenyan build, the architect and QS
        are the cheapest insurance you can buy.
        Their fees together are 7 to 12 percent
        of construction cost. The savings they
        produce against an unmanaged build are
        typically 15 to 30 percent. They pay
        for themselves several times over.
      </Callout>

      <Pullquote>
        Owners who tried to save on the
        architect and QS almost always paid more
        than they would have. The savings on
        professional fees are visible. The
        savings their absence causes are
        invisible until the build runs out of
        money.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For build clients we connect to BORAQS
        registered architects and IQSK registered
        QS partners we have worked with for
        years. Read also our pieces on{" "}
        <Link
          href="/insights/cost-of-building-3-bedroom-house-kenya-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          cost of building
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/county-building-approvals-kenya-roadmap"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          county building approvals
        </Link>
        .
      </P>
    </>
  );
}

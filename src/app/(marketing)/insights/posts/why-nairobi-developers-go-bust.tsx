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
  slug: "why-nairobi-developers-go-bust",
  title:
    "Why some Nairobi developers go bust (and how to spot the signs)",
  description:
    "Several high-profile Nairobi developers have collapsed mid-project in the last decade, leaving deposits stranded and units undelivered. The signs are usually visible early. Here is the honest 2026 guide on why developers go bust and how to spot the signs before you buy.",
  publishedAt: "2026-02-06",
  readingMinutes: 5,
  author: authors.research,
  tags: [
    "Developer Risk",
    "Nairobi",
    "Off-Plan",
    "Buyer Guide",
    "Diligence",
    "Property",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Why Nairobi developers go bust how to spot signs 2026",
};

export default function Article() {
  return (
    <>
      <Lede>
        Several high-profile Nairobi developers
        have collapsed mid-project in the last
        decade, leaving deposits stranded and
        units undelivered. The signs are
        usually visible early. Here is the
        honest 2026 guide.
      </Lede>

      <H2 id="why">Why developers go bust</H2>

      <UL>
        <LI>
          <strong>Cash flow management</strong>:
          using deposits from new project
          to fund delivery on previous
          project; the music eventually
          stops
        </LI>
        <LI>
          <strong>Cost overrun</strong>:
          construction inflation outruns
          deposit-funded budget
        </LI>
        <LI>
          <strong>Sales velocity</strong>:
          launches that do not sell at
          expected pace starve construction
        </LI>
        <LI>
          <strong>Currency exposure</strong>:
          dollar-priced inputs against
          KES-priced sales
        </LI>
        <LI>
          <strong>Land cost</strong>:
          overpaying for plot reduces
          margin to zero
        </LI>
        <LI>
          <strong>Bank exposure</strong>:
          construction loan covenants
          tripped
        </LI>
        <LI>
          <strong>Legal trouble</strong>:
          title disputes, tax claims,
          buyer litigation
        </LI>
      </UL>

      <H2 id="signs">Signs to watch for</H2>

      <UL>
        <LI>
          <strong>Site activity slowing</strong>:
          fewer workers, slower progress,
          unexplained pauses
        </LI>
        <LI>
          <strong>Communication degrading</strong>:
          slower replies, evasive answers,
          marketing replaced by “trust
          us”
        </LI>
        <LI>
          <strong>Payment requests outside
          milestones</strong>: requests for
          early payment, off-schedule
          deposits
        </LI>
        <LI>
          <strong>Discounting to new
          buyers</strong>: significant
          price cuts to find new buyers
          while existing buyers wait
        </LI>
        <LI>
          <strong>Subcontractor disputes</strong>:
          public arguments with main
          contractor, materials suppliers
        </LI>
        <LI>
          <strong>Director changes</strong>:
          unusual changes in directorship,
          legal entity restructuring
        </LI>
        <LI>
          <strong>Unhappy buyer reports</strong>:
          buyers from earlier projects
          publicly raising concerns
        </LI>
        <LI>
          <strong>Court filings</strong>:
          litigation, judgement creditors
        </LI>
      </UL>

      <H2 id="diligence">Pre-purchase diligence that prevents this</H2>

      <UL>
        <LI>
          Track record: at least 2 to 3
          delivered projects you can
          inspect
        </LI>
        <LI>
          Reference calls with prior
          buyers
        </LI>
        <LI>
          Bank construction financing in
          place (not buyer-deposit-only
          financing)
        </LI>
        <LI>
          Independent counsel with property
          practice depth
        </LI>
        <LI>
          Milestone-tied payments verified by
          independent inspection
        </LI>
        <LI>
          Defect liability and retention at
          handover
        </LI>
      </UL>

      <H2 id="if-bust">If your developer goes bust</H2>

      <UL>
        <LI>
          Engage independent counsel
          immediately
        </LI>
        <LI>
          Lodge claim against the company
          and any guarantors
        </LI>
        <LI>
          Coordinate with other affected
          buyers; collective action helps
        </LI>
        <LI>
          Report to authorities (DCI,
          NCA, EARB on registered
          parties)
        </LI>
        <LI>
          Recovery rates vary; some buyers
          recover units after restructuring,
          some do not
        </LI>
      </UL>

      <Callout title="The developer risk rule">
        The developer track record is the
        single most predictive indicator
        of off-plan outcome. The marketing,
        the brochure and the launch
        weekend are not. Pick proven
        delivery; ignore the rest.
      </Callout>

      <Pullquote>
        Every Nairobi off-plan that ended
        badly had warning signs that the
        diligent buyer could have caught.
        The undiligent buyers either did
        not know to look or did not want
        to know what they would find.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For sourcing clients we run full
        developer diligence as standard.
        Read also our pieces on{" "}
        <Link
          href="/insights/best-property-developers-kenya-2026-ranked"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          best property developers Kenya
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/buying-off-plan-nairobi-risks-red-flags"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          buying off-plan risks
        </Link>
        .
      </P>
    </>
  );
}

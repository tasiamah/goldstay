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
  slug: "beach-plots-kenya-avoiding-the-traps",
  title:
    "Beach plots in Kenya: how to buy without losing your money",
  description:
    "The Kenyan coast has the best plot fraud opportunities in the country, with double allocations, contested titles, missing beach access and quietly underwater plots. Here is the honest 2026 guide on how to buy a beach plot in Kenya without losing your money.",
  publishedAt: "2025-09-03",
  readingMinutes: 7,
  author: authors.legal,
  tags: [
    "Beach Plots",
    "Coastal",
    "Title",
    "Diligence",
    "Kenya",
    "Fraud",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Beach plots Kenya 2026 avoiding title fraud diligence guide",
};

export default function Article() {
  return (
    <>
      <Lede>
        The Kenyan coast has the best plot fraud
        opportunities in the country. Double
        allocations, contested titles, missing
        beach access, plots quietly underwater at
        high tide, group ranch derivations,
        chief&rsquo;s allocations that never
        reached the registry. The list is long.
        Here is the honest 2026 guide on how to
        buy a beach plot in Kenya without
        losing your money.
      </Lede>

      <H2 id="problems">The recurring problems</H2>

      <UL>
        <LI>
          <strong>Double allocations</strong>:
          two title documents for the same plot,
          held by different families
        </LI>
        <LI>
          <strong>Contested boundaries</strong>:
          neighbour disputes that can take a
          decade to resolve in court
        </LI>
        <LI>
          <strong>Beach access</strong>: plot
          looks beach-adjacent on the map but
          access is via a neighbour&rsquo;s
          land
        </LI>
        <LI>
          <strong>Tidal flooding</strong>: plot
          is partly underwater at spring tide
          but the seller&rsquo;s photos all show
          low tide
        </LI>
        <LI>
          <strong>Conservation
          designation</strong>: marine park,
          riparian or environmental protection
          that bars development
        </LI>
        <LI>
          <strong>Group ranch
          derivation</strong>: plot derives from
          a group ranch with unresolved
          succession or ongoing litigation
        </LI>
        <LI>
          <strong>Chief&rsquo;s allocation</strong>:
          informal allocation that never reached
          the registry; legally precarious
        </LI>
        <LI>
          <strong>Encroachment</strong>:
          neighbours have built across the
          boundary; resolving requires
          litigation
        </LI>
      </UL>

      <H2 id="diligence">The diligence checklist</H2>

      <UL>
        <LI>
          <strong>Independent advocate</strong>:
          coast-based, not introduced by the
          seller; runs full title search
        </LI>
        <LI>
          <strong>Survey diagram</strong>:
          obtained independently from the
          Survey of Kenya, not from the
          seller
        </LI>
        <LI>
          <strong>Boundary walk</strong>: in
          person, with a licensed surveyor,
          before signing
        </LI>
        <LI>
          <strong>Adjacent owner check</strong>:
          interview neighbours; confirm
          boundary understanding matches
        </LI>
        <LI>
          <strong>Tidal verification</strong>:
          visit at spring high tide; verify
          actual usable land area
        </LI>
        <LI>
          <strong>Chain of title</strong>: trace
          back at least three transactions;
          verify each
        </LI>
        <LI>
          <strong>Conservation status</strong>:
          confirm with NEMA, KFS, KWS as
          applicable
        </LI>
        <LI>
          <strong>County records</strong>:
          confirm zoning and any planning
          conditions
        </LI>
        <LI>
          <strong>Land Control Board
          consent</strong>: where applicable
        </LI>
      </UL>

      <H2 id="payment">Payment discipline</H2>

      <UL>
        <LI>
          Funds via advocate trust account, not
          direct to seller
        </LI>
        <LI>
          Conditional release on title
          registration
        </LI>
        <LI>
          Stamp duty paid promptly
        </LI>
        <LI>
          Original title received in the
          buyer&rsquo;s name before the final
          tranche releases
        </LI>
      </UL>

      <Callout title="The beach plot rule">
        Coastal title diligence is harder than
        Nairobi diligence. The fraudsters know
        this. Bring coast-based legal,
        survey-led boundary verification and
        tidal due diligence. Skip any of the
        three and the risk goes up sharply.
      </Callout>

      <Pullquote>
        Most beach plot regrets we hear about
        are not bad market timing. They are
        diligence that was skipped because the
        seller offered a price that felt too
        good to walk away from.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For coastal plot acquisitions we run
        the diligence with coast-based
        partners and walk away from
        problematic plots. Read also our
        pieces on{" "}
        <Link
          href="/insights/title-deed-diligence-kenya-fraud"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          title diligence and fraud
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/buying-property-diani-complete-guide-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          buying in Diani
        </Link>
        .
      </P>
    </>
  );
}

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
  slug: "mombasa-road-corridor-nairobi-side",
  title:
    "The Mombasa Road corridor: Nairobi&rsquo;s southern residential belt",
  description:
    "Mombasa Road runs from the Nairobi CBD past JKIA into the southern metro. The suburbs along the way each have distinct character and tenant profiles, anchored by the airport, the Industrial Area and the SGR. Here is the honest 2026 guide on the Nairobi side of the corridor.",
  publishedAt: "2026-03-13",
  readingMinutes: 5,
  author: authors.editors,
  tags: [
    "Mombasa Road",
    "Nairobi",
    "Corridor",
    "Airport",
    "Buyer Guide",
    "Investment",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Mombasa Road corridor Nairobi 2026 southern residential guide",
};

export default function Article() {
  return (
    <>
      <Lede>
        Mombasa Road runs from the Nairobi CBD
        past JKIA into the southern metro. The
        suburbs along the way each have distinct
        character and tenant profiles, anchored
        by the airport, the Industrial Area, the
        SGR station and the Expressway. Here is
        the honest 2026 guide on the Nairobi
        side of the corridor.
      </Lede>

      <H2 id="suburbs">The suburbs in order</H2>

      <UL>
        <LI>
          <strong>South C</strong>:
          established mid-market family
        </LI>
        <LI>
          <strong>South B</strong>: mid-market
          working professional
        </LI>
        <LI>
          <strong>Imara Daima</strong>:
          mass-market with active rental
        </LI>
        <LI>
          <strong>Pipeline</strong>: dense
          mass-market apartment supply
        </LI>
        <LI>
          <strong>Embakasi</strong>:
          mass-market with broad rental base
        </LI>
        <LI>
          <strong>Syokimau</strong>:
          mid-market commuter (Machakos
          County, Nairobi commuter)
        </LI>
        <LI>
          <strong>Athi River fringe</strong>:
          mass-market commuter
        </LI>
      </UL>

      <H2 id="prices">Indicative prices</H2>

      <UL>
        <LI>
          South C 3-bed: KES 10m to KES 18m
        </LI>
        <LI>
          South B 2-bed: KES 5m to KES 9m
        </LI>
        <LI>
          Imara Daima 2-bed: KES 4m to KES
          6.5m
        </LI>
        <LI>
          Pipeline 1-bed: KES 1.8m to KES 3m
        </LI>
        <LI>
          Embakasi 3-bed townhouse: KES 7m
          to KES 14m
        </LI>
        <LI>
          Syokimau 3-bed: KES 6m to KES 11m
        </LI>
      </UL>

      <H2 id="commute">Commute reality</H2>

      <UL>
        <LI>
          The Expressway transformed
          peak-hour commute on the corridor;
          tolls apply
        </LI>
        <LI>
          Off-peak (or via Expressway):
          South C to CBD is 15 minutes,
          Syokimau to CBD is 30 minutes
        </LI>
        <LI>
          Peak without Expressway: 60 to
          100 minutes from Syokimau
          common
        </LI>
        <LI>
          SGR station at Syokimau supports
          commuter and intercity use
        </LI>
      </UL>

      <H2 id="who">Who buys along the corridor</H2>

      <UL>
        <LI>
          Aviation, JKIA and Industrial Area
          professionals
        </LI>
        <LI>
          Working professionals on
          Expressway-supported commute
        </LI>
        <LI>
          First-time buyers
        </LI>
        <LI>
          Yield-focused investors targeting
          mass-market rental
        </LI>
        <LI>
          Diaspora investors at lower ticket
          sizes
        </LI>
      </UL>

      <H2 id="risks">Risks</H2>

      <UL>
        <LI>
          Pipeline and Imara Daima oversupply
          in pockets
        </LI>
        <LI>
          Build quality variance significant
        </LI>
        <LI>
          Industrial-fringe residential
          character is weaker in some pockets
        </LI>
        <LI>
          Floods affect specific pockets
          during heavy rains
        </LI>
        <LI>
          Title diligence on plot
          subdivisions
        </LI>
      </UL>

      <Callout title="The corridor rule">
        Mombasa Road works for working
        professionals on Expressway commute,
        airport and industrial workers, and
        yield-focused investors with
        disciplined diligence. Compound
        selection is the central skill;
        oversupply varies sharply by
        suburb.
      </Callout>

      <Pullquote>
        The Mombasa Road corridor is
        Nairobi&rsquo;s southern engine. The
        Expressway changed the calculation;
        the disciplined investor reaps the
        most.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For Mombasa Road sourcing clients we
        run compound and yield diligence per
        suburb. Read also our pieces on{" "}
        <Link
          href="/insights/syokimau-mlolongo-mass-market-corridor"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Syokimau and Mlolongo
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/embakasi-massive-market-explained"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Embakasi
        </Link>
        .
      </P>
    </>
  );
}

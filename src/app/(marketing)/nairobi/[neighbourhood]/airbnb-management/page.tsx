import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NeighbourhoodShortLetPage } from "@/components/NeighbourhoodShortLetPage";
import { enforceCityHost } from "@/lib/enforceCityHost";
import {
  alternateLanguagesFor,
  findShortLetNeighbourhood,
  neighbourhoodSlug,
  shortLetNeighbourhoods,
} from "@/lib/site";

// Service-plus-location pages: /nairobi/kilimani/airbnb-management.
//
// /airbnb-management targets the service and /nairobi/kilimani targets
// the location, but neither targeted "airbnb management kilimani",
// which is how the query is actually typed. These do.
//
// Only neighbourhoods with real short-stay data in the cities map get a
// page. Karen and Runda deliberately have none: both are
// standalone-house suburbs where nightly demand is thin and a long
// lease is the better business, so generating a page for them would
// mean publishing a template with nothing true to say. dynamicParams
// is false, so those URLs 404 rather than rendering an empty shell.
export function generateStaticParams() {
  return shortLetNeighbourhoods("nairobi").map((n) => ({
    neighbourhood: neighbourhoodSlug(n.name),
  }));
}

export const dynamicParams = false;

type Props = { params: { neighbourhood: string } };

export function generateMetadata({ params }: Props): Metadata {
  const n = findShortLetNeighbourhood("nairobi", params.neighbourhood);
  if (!n) return {};

  const path = `/nairobi/${neighbourhoodSlug(n.name)}/airbnb-management`;

  // Neighbourhood first in the title. The query carries the place name
  // and the title is the heaviest signal we control, which is the same
  // mistake /airbnb-management itself was making until recently.
  const title = `Airbnb Management in ${n.name}, Nairobi`;
  const description = `Short-stay management for ${n.name} apartments. USD ${n.shortLet.nightlyUsd.min} to ${n.shortLet.nightlyUsd.max} a night at ${n.shortLet.occupancyPct.min} to ${n.shortLet.occupancyPct.max}% occupancy. Photography, daily pricing, guests and turnovers handled, paid to you in USD.`;

  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: alternateLanguagesFor(path),
    },
    openGraph: { title, description, type: "website" },
  };
}

export default function Page({ params }: Props) {
  const n = findShortLetNeighbourhood("nairobi", params.neighbourhood);
  if (!n) notFound();
  enforceCityHost(
    "nairobi",
    `/nairobi/${neighbourhoodSlug(n.name)}/airbnb-management`,
  );
  return <NeighbourhoodShortLetPage neighbourhood={n} />;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NeighbourhoodPage } from "@/components/NeighbourhoodPage";
import { enforceCityHost } from "@/lib/enforceCityHost";
import {
  alternateLanguagesFor,
  cities,
  findNeighbourhood,
  neighbourhoodSlug,
  profiledNeighbourhoods,
  robotsForCity,
} from "@/lib/site";

// Programmatic neighbourhood pages for Accra. Pre-rendered at build
// time from the cities map so each entry in cities.accra.neighbourhoods
// gets its own URL like /accra/east-legon, /accra/airport-residential.
// Any path that doesn't match a known neighbourhood 404s.
// Only areas with a profile. An area without one has nothing to say
// that its siblings do not, and publishing it anyway produced pages
// measuring 88% identical to each other — see the `profile` comment in
// lib/site.ts. The rest are listed on /accra/areas and redirected
// there in next.config.ts.
export function generateStaticParams() {
  return profiledNeighbourhoods("accra").map((n) => ({
    neighbourhood: neighbourhoodSlug(n.name),
  }));
}

export const dynamicParams = false;

type Props = { params: { neighbourhood: string } };

export function generateMetadata({ params }: Props): Metadata {
  const n = findNeighbourhood("accra", params.neighbourhood);
  if (!n) return {};

  const path = `/accra/${neighbourhoodSlug(n.name)}`;
  const title = `Property Management in ${n.name}, Accra`;
  const description = `Premium property management in ${n.name}, Accra for diaspora landlords. We let to ${n.tenant.toLowerCase()}, collect rent in GHS and remit in USD to your foreign account every month.`;

  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: alternateLanguagesFor(path),
    },
    // Built, not launched. See site.launchedMarkets.
    robots: robotsForCity("accra"),
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default function Page({ params }: Props) {
  const n = findNeighbourhood("accra", params.neighbourhood);
  if (!n) notFound();
  enforceCityHost("accra", `/accra/${neighbourhoodSlug(n.name)}`);
  return <NeighbourhoodPage city="accra" neighbourhood={n} />;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NeighbourhoodPage } from "@/components/NeighbourhoodPage";
import {
  alternateLanguagesFor,
  cities,
  findNeighbourhood,
  neighbourhoodSlug,
} from "@/lib/site";

// Programmatic neighbourhood pages for Accra. Pre-rendered at build
// time from the cities map so each entry in cities.accra.neighbourhoods
// gets its own URL like /accra/east-legon, /accra/airport-residential.
// Any path that doesn't match a known neighbourhood 404s.
export function generateStaticParams() {
  return cities.accra.neighbourhoods.map((n) => ({
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
  return <NeighbourhoodPage city="accra" neighbourhood={n} />;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NeighbourhoodPage } from "@/components/NeighbourhoodPage";
import {
  alternateLanguagesFor,
  cities,
  findNeighbourhood,
  neighbourhoodSlug,
} from "@/lib/site";

// Programmatic neighbourhood pages for Nairobi. Pre-rendered at build
// time from the cities map so each entry in cities.nairobi.neighbourhoods
// gets its own URL like /nairobi/kilimani, /nairobi/westlands etc. Any
// path that doesn't match a known neighbourhood 404s.
export function generateStaticParams() {
  return cities.nairobi.neighbourhoods.map((n) => ({
    neighbourhood: neighbourhoodSlug(n.name),
  }));
}

export const dynamicParams = false;

type Props = { params: { neighbourhood: string } };

export function generateMetadata({ params }: Props): Metadata {
  const n = findNeighbourhood("nairobi", params.neighbourhood);
  if (!n) return {};

  const path = `/nairobi/${neighbourhoodSlug(n.name)}`;
  const title = `Property Management in ${n.name}, Nairobi`;
  const description = `Premium property management in ${n.name}, Nairobi for diaspora landlords. We let to ${n.tenant.toLowerCase()}, collect rent in KES and remit in USD to your foreign account every month.`;

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
  const n = findNeighbourhood("nairobi", params.neighbourhood);
  if (!n) notFound();
  return <NeighbourhoodPage city="nairobi" neighbourhood={n} />;
}

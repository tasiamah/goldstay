import type { Metadata } from "next";
import { CityPage } from "@/components/CityPage";
import { enforceCityHost } from "@/lib/enforceCityHost";
import { alternateLanguagesFor, cityCanonical } from "@/lib/site";

export const metadata: Metadata = {
  // This route is the homepage on goldstay.co.ke, so this title is what
  // the head term resolves to. Exact match, brand last: the first words
  // are the most heavily weighted part of a title and were being spent
  // on a preposition.
  title: "Property Management Nairobi",
  description:
    "Premium property management for Nairobi landlords abroad. We vet tenants, collect rent in KES and remit in USD to your foreign account every month.",
  alternates: {
    // The .co.ke root serves this page, so the root is the canonical
    // URL and /nairobi is the duplicate. This metadata is what the root
    // renders with, which is why the canonical has to be the absolute
    // home URL rather than "/nairobi".
    canonical: cityCanonical("nairobi"),
    languages: alternateLanguagesFor("/nairobi"),
  },
};

export default function NairobiPage() {
  enforceCityHost("nairobi", "/nairobi");
  return <CityPage city="nairobi" />;
}

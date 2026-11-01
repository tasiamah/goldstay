import type { Metadata } from "next";
import { CityPage } from "@/components/CityPage";
import { enforceCityHost } from "@/lib/enforceCityHost";
import {
  alternateLanguagesFor,
  cityCanonical,
  robotsForCity,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Property Management Accra",
  description:
    "Premium property management for Accra landlords, at home and abroad. We vet tenants and collect rent, paid in USD or to a local account.",
  alternates: {
    // Root of .com.gh once that domain is live; the /accra URL on the
    // fallback host until then. See cityCanonical.
    canonical: cityCanonical("accra"),
    languages: alternateLanguagesFor("/accra"),
  },
  // Built, not launched. See site.launchedMarkets.
  robots: robotsForCity("accra"),
};

export default function AccraPage() {
  enforceCityHost("accra", "/accra");
  return <CityPage city="accra" />;
}

import type { Metadata } from "next";
import { CityPage } from "@/components/CityPage";
import { enforceCityHost } from "@/lib/enforceCityHost";
import { alternateLanguagesFor, cityCanonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "Property Management in Accra",
  description:
    "Premium property management for Accra landlords abroad. We vet tenants, collect rent in GHS and remit in USD to your foreign account every month.",
  alternates: {
    // Root of .com.gh once that domain is live; the /accra URL on the
    // fallback host until then. See cityCanonical.
    canonical: cityCanonical("accra"),
    languages: alternateLanguagesFor("/accra"),
  },
};

export default function AccraPage() {
  enforceCityHost("accra", "/accra");
  return <CityPage city="accra" />;
}

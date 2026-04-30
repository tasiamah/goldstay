import type { Metadata } from "next";
import { CityPage } from "@/components/CityPage";
import { alternateLanguagesFor } from "@/lib/site";

export const metadata: Metadata = {
  title: "Property Management in Accra",
  description:
    "Premium property management for Accra landlords abroad. We vet tenants, collect rent in GHS and remit in USD to your foreign account every month.",
  alternates: {
    canonical: "/accra",
    languages: alternateLanguagesFor("/accra"),
  },
};

export default function AccraPage() {
  return <CityPage city="accra" />;
}

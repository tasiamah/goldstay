import type { Metadata } from "next";
import { CityPage } from "@/components/CityPage";
import { alternateLanguagesFor } from "@/lib/site";

export const metadata: Metadata = {
  title: "Property Management in Nairobi",
  description:
    "Premium property management for Nairobi landlords abroad. We vet tenants, collect rent in KES and remit in USD to your foreign account every month.",
  alternates: {
    canonical: "/nairobi",
    languages: alternateLanguagesFor("/nairobi"),
  },
};

export default function NairobiPage() {
  return <CityPage city="nairobi" />;
}

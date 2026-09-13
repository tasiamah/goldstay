import type { Metadata } from "next";
import { CityBuyPage } from "@/components/CityBuyPage";
import { enforceCityHost } from "@/lib/enforceCityHost";
import { alternateLanguagesFor } from "@/lib/site";

export const metadata: Metadata = {
  title: "Buy Property in Nairobi",
  description:
    "Buy-side property sourcing in Nairobi for diaspora buyers: Kilimani, Westlands, Lavington and Karen. Inspection, negotiation, title checks.",
  alternates: {
    canonical: "/nairobi/buy",
    languages: alternateLanguagesFor("/nairobi/buy"),
  },
};

export default function Page() {
  enforceCityHost("nairobi", "/nairobi/buy");
  return <CityBuyPage city="nairobi" />;
}

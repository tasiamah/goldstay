import type { Metadata } from "next";
import { CityBuyPage } from "@/components/CityBuyPage";
import { enforceCityHost } from "@/lib/enforceCityHost";
import { alternateLanguagesFor, robotsForCity } from "@/lib/site";

export const metadata: Metadata = {
  title: "Buy Property in Accra",
  description:
    "Buy-side property sourcing in Accra for diaspora buyers: East Legon, Cantonments and Labone. Lands Commission title checks. Free for buyers.",
  alternates: {
    canonical: "/accra/buy",
    languages: alternateLanguagesFor("/accra/buy"),
  },
  // Built, not launched. See site.launchedMarkets.
  robots: robotsForCity("accra"),
};

export default function Page() {
  enforceCityHost("accra", "/accra/buy");
  return <CityBuyPage city="accra" />;
}

import type { Metadata } from "next";
import { AreasPage } from "@/components/AreasPage";
import { enforceCityHost } from "@/lib/enforceCityHost";
import { alternateLanguagesFor, cities } from "@/lib/site";

// The comparison page that replaced the thin per-area pages, and the
// redirect target for the areas that no longer have one of their own.
//
// Targets the query the old pages could not win because they were
// competing with each other: someone deciding which part of Nairobi
// to buy a rental in wants the areas side by side, not eleven tabs.

const count = cities.nairobi.neighbourhoods.length;

export function generateMetadata(): Metadata {
  const title = `Nairobi Rent Prices by Area: ${count} Suburbs Compared`;
  const description = `What a two-bedroom apartment lets for in ${count} Nairobi suburbs, who rents in each, and where nightly letting earns more than a lease. Indicative bands from recently let stock.`;

  return {
    title,
    description,
    alternates: {
      canonical: "/nairobi/areas",
      languages: alternateLanguagesFor("/nairobi/areas"),
    },
    openGraph: { title, description, type: "website" },
  };
}

export default function Page() {
  enforceCityHost("nairobi", "/nairobi/areas");
  return <AreasPage city="nairobi" />;
}

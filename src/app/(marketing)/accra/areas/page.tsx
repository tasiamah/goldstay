import type { Metadata } from "next";
import { AreasPage } from "@/components/AreasPage";
import { enforceCityHost } from "@/lib/enforceCityHost";
import { alternateLanguagesFor, cities } from "@/lib/site";

// Accra's equivalent of /nairobi/areas.
//
// Accra had five per-area pages measuring 69% identical to each other
// and no properties under management behind any of them, so there was
// nothing to write a deep page from that would not have been
// invention. One honest comparison page is the better trade, and the
// per-area pages can come back individually once there is something
// specific to say about a given suburb.

const count = cities.accra.neighbourhoods.length;

export function generateMetadata(): Metadata {
  const title = `Accra Rent Prices by Area: ${count} Suburbs Compared`;
  const description = `What a two-bedroom apartment lets for in ${count} Accra suburbs and who rents in each. Indicative bands from recently let stock, for diaspora landlords weighing where to buy.`;

  return {
    title,
    description,
    alternates: {
      canonical: "/accra/areas",
      languages: alternateLanguagesFor("/accra/areas"),
    },
    openGraph: { title, description, type: "website" },
  };
}

export default function Page() {
  enforceCityHost("accra", "/accra/areas");
  return <AreasPage city="accra" />;
}

import type { Metadata } from "next";
import { CityBuyPage } from "@/components/CityBuyPage";

export const metadata: Metadata = {
  title: "Buy Property in Nairobi",
  description:
    "Buy-side property sourcing in Nairobi for diaspora buyers. On-the-ground search in Kilimani, Westlands, Lavington and Karen. In-person inspection, price negotiation, title verification at the Ministry of Lands and handover. Free for buyers.",
  alternates: { canonical: "/nairobi/buy" },
};

export default function Page() {
  return <CityBuyPage city="nairobi" />;
}

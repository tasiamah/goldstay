import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://goldstay.com";
  const routes = [
    "",
    "/nairobi",
    "/accra",
    "/airbnb-management",
    "/property-sourcing",
    "/nairobi/buy",
    "/accra/buy",
    "/yield-calculator",
    "/list-your-property",
    "/find-a-home",
    "/privacy",
    "/terms",
  ];
  const now = new Date();
  return routes.map((r) => ({
    url: `${base}${r}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: r === "" ? 1 : 0.8,
  }));
}

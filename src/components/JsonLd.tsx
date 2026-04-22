import { site, cities } from "@/lib/site";

// Keep JSON-LD narrow and accurate. We declare who we are, what we do, where,
// and how to reach us. Nothing here claims revenue, headcount or client lists.
export function JsonLd() {
  const baseUrl = `https://${site.domain}`;

  const organization = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: site.name,
    description: site.description,
    url: baseUrl,
    email: site.email,
    parentOrganization: {
      "@type": "Organization",
      name: "TADCO",
    },
    areaServed: [
      { "@type": "City", name: "Nairobi", sameAs: "https://en.wikipedia.org/wiki/Nairobi" },
      { "@type": "City", name: "Accra", sameAs: "https://en.wikipedia.org/wiki/Accra" },
    ],
    sameAs: [site.socials.instagram, site.socials.linkedin],
    knowsLanguage: ["en"],
    currenciesAccepted: "USD, KES, GHS",
    paymentAccepted: "Bank transfer, mobile money",
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Long-Term Property Management",
          description:
            "End-to-end management of residential rental properties for long-term tenants, with monthly USD remittance to overseas accounts.",
          areaServed: ["Nairobi", "Accra"],
          provider: { "@type": "Organization", name: site.name },
        },
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          description: "10% of collected rent",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Short-Stay / Airbnb Management",
          description:
            "Full short-stay operations including listing, pricing, guest communication, cleaning and maintenance, with monthly USD remittance.",
          areaServed: ["Nairobi", "Accra"],
          provider: { "@type": "Organization", name: site.name },
        },
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          description: "20% of revenue collected",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Tenant Finding",
          description:
            "Targeted sourcing, referencing and vetting of tenants with lease execution, for landlords managing their own property.",
          areaServed: ["Nairobi", "Accra"],
          provider: { "@type": "Organization", name: site.name },
        },
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          description: "One-time fee equivalent to one month's rent",
        },
      },
    ],
  };

  const nairobi = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${baseUrl}/nairobi#localbusiness`,
    name: `${site.name} Nairobi`,
    url: `${baseUrl}/nairobi`,
    parentOrganization: { "@type": "Organization", name: site.name },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Nairobi",
      addressCountry: cities.nairobi.country,
    },
    areaServed: cities.nairobi.neighbourhoods.map((n) => ({
      "@type": "Place",
      name: n.name,
    })),
  };

  const accra = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${baseUrl}/accra#localbusiness`,
    name: `${site.name} Accra`,
    url: `${baseUrl}/accra`,
    parentOrganization: { "@type": "Organization", name: site.name },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Accra",
      addressCountry: cities.accra.country,
    },
    areaServed: cities.accra.neighbourhoods.map((n) => ({
      "@type": "Place",
      name: n.name,
    })),
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: baseUrl,
    inLanguage: "en",
    publisher: { "@type": "Organization", name: site.name },
  };

  const jsonld = [organization, nairobi, accra, website];

  return (
    <script
      type="application/ld+json"
      // JSON stringification with no HTML-escaped entities; this is inert data.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonld) }}
    />
  );
}

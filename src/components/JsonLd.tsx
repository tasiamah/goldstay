import { site, cities, offices } from "@/lib/site";
import { getServerCity } from "@/lib/getServerCity";

// Keep JSON-LD narrow and accurate. We declare who we are, what we do, where,
// and how to reach us. Nothing here claims revenue, headcount or client lists.
// Per-domain: on goldstay.co.ke we emit Kenya/Nairobi structured data only,
// on goldstay.com.gh we emit Ghana/Accra only. Goldstay.com stays dual-market.
export function JsonLd() {
  const domainCity = getServerCity();
  const baseUrl =
    domainCity === "nairobi"
      ? `https://${site.domains.nairobi}`
      : domainCity === "accra"
        ? `https://${site.domains.accra}`
        : `https://${site.domain}`;

  const includeNairobi = domainCity !== "accra";
  const includeAccra = domainCity !== "nairobi";

  const areaServed = [
    includeNairobi
      ? { "@type": "City", name: "Nairobi", sameAs: "https://en.wikipedia.org/wiki/Nairobi" }
      : null,
    includeAccra
      ? { "@type": "City", name: "Accra", sameAs: "https://en.wikipedia.org/wiki/Accra" }
      : null,
  ].filter(Boolean);

  const offerAreas = [
    includeNairobi ? "Nairobi" : null,
    includeAccra ? "Accra" : null,
  ].filter((v): v is string => Boolean(v));

  const currencies = ["USD", includeNairobi ? "KES" : null, includeAccra ? "GHS" : null]
    .filter(Boolean)
    .join(", ");

  const organization = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: site.name,
    description: site.description,
    url: baseUrl,
    email:
      domainCity === "nairobi"
        ? site.emails.nairobi
        : domainCity === "accra"
          ? site.emails.accra
          : site.email,
    parentOrganization: {
      "@type": "Organization",
      name: "TADCO",
    },
    areaServed,
    sameAs: [site.socials.instagram, site.socials.linkedin],
    knowsLanguage: ["en"],
    currenciesAccepted: currencies,
    paymentAccepted: "Bank transfer, mobile money",
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Long-Term Property Management",
          description:
            "End-to-end management of residential rental properties for long-term tenants, with monthly USD remittance to overseas accounts.",
          areaServed: offerAreas,
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
          areaServed: offerAreas,
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
          name: "Property Sourcing",
          description: `Buy-side property sourcing for diaspora buyers in ${offerAreas.join(" and ")}. Search, negotiation, title verification, inspection and handover. Free for the buyer.`,
          areaServed: offerAreas,
          provider: { "@type": "Organization", name: site.name },
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Tenant Finding",
          description:
            "Targeted sourcing, referencing and vetting of tenants with lease execution, for landlords managing their own property.",
          areaServed: offerAreas,
          provider: { "@type": "Organization", name: site.name },
        },
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          description: "One-time fee equivalent to one month's rent",
        },
      },
    ],
  };

  const nairobiOffice = offices.nairobi;
  const nairobi = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${baseUrl}/nairobi#localbusiness`,
    name: `${site.name} Nairobi`,
    url: `${baseUrl}/nairobi`,
    parentOrganization: { "@type": "Organization", name: site.name },
    address: nairobiOffice
      ? {
          "@type": "PostalAddress",
          streetAddress: `${nairobiOffice.building}, ${nairobiOffice.street}`,
          addressLocality: nairobiOffice.locality,
          addressRegion: nairobiOffice.district,
          postalCode: nairobiOffice.postalCode,
          addressCountry: nairobiOffice.countryCode,
          postOfficeBoxNumber: nairobiOffice.postalBox,
        }
      : {
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

  const jsonld = [
    organization,
    includeNairobi ? nairobi : null,
    includeAccra ? accra : null,
    website,
  ].filter(Boolean);

  return (
    <script
      type="application/ld+json"
      // JSON stringification with no HTML-escaped entities; this is inert data.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonld) }}
    />
  );
}

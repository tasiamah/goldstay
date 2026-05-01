export const site = {
  name: "Goldstay",
  domain: "goldstay.com",
  tagline: "Your Property. Professionally Managed.",
  description:
    "Premium property management in Nairobi and Accra for diaspora landlords. We handle everything. You receive monthly USD transfers.",
  // Display email shown on the neutral .com surface and any page that
  // renders without a city context. We intentionally use the .co.ke
  // address as the default until goldstay.com is purchased and its MX
  // is live, otherwise we'd be printing a dead address on the site.
  // Flip back to hello@goldstay.com once that domain is configured.
  email: "hello@goldstay.co.ke",
  parent: "A TADCO Company",
  socials: {
    instagram: "https://instagram.com/goldstay.ke",
    // This is the Goldstay Kenya personal/brand profile (not a LinkedIn
    // Company Page yet). Flip to the /company/... URL once the Company
    // Page is created and claimed so JSON-LD sameAs signals stay clean.
    linkedin: "https://www.linkedin.com/in/goldstay-kenya",
  },
  domains: {
    main: "goldstay.com",
    nairobi: "goldstay.co.ke",
    accra: "goldstay.com.gh",
  },
  emails: {
    // Same rationale as `email` above: .co.ke is the only live mailbox
    // right now, so every city-agnostic surface routes to it. The
    // Ghana entry is kept as a placeholder so when the .com.gh domain
    // and inbox are provisioned, only this file needs to change.
    default: "hello@goldstay.co.ke",
    nairobi: "hello@goldstay.co.ke",
    accra: "hello@goldstay.com.gh",
  },
};

export type Office = {
  city: string;
  country: string;
  countryCode: string;
  building: string;
  street: string;
  locality: string;
  district?: string;
  postalCode: string;
  postalBox?: string;
};

// Physical offices on display in the footer and JSON-LD. Only include a
// market here once we have a real, registered address in that city;
// phantom addresses are a trust killer.
export const offices: Partial<Record<"nairobi" | "accra", Office>> = {
  nairobi: {
    city: "Nairobi",
    country: "Kenya",
    countryCode: "KE",
    building: "Pinetree Plaza",
    street: "Kindaruma Road",
    locality: "Kilimani",
    district: "Westlands",
    postalCode: "00606",
    postalBox: "P.O. Box 1730, Sarit Centre",
  },
};

// Slug helpers for neighbourhood URLs. Kept here next to the cities
// map so any place that lists neighbourhoods can build the same URL
// without re-deriving the slug rule.
export function neighbourhoodSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export function findNeighbourhood(
  city: "nairobi" | "accra",
  slug: string,
): Neighbourhood | undefined {
  return cities[city].neighbourhoods.find((n) => neighbourhoodSlug(n.name) === slug);
}

// hreflang helper. Returns the alternates.languages map for a given
// path so each page declares the correct cross-domain equivalents.
//
// - Routes that exist on every domain (services, calculators, legal)
//   get all three language tags.
// - /nairobi-rooted routes are Kenya-relevant: en-KE points at the
//   equivalent URL on goldstay.co.ke, x-default at the .com URL.
// - /accra-rooted routes mirror that on goldstay.com.gh.
//
// Special case: the .co.ke root rewrites to /nairobi at the edge (see
// next.config.mjs rewrites), so the .co.ke alias of /nairobi is "/"
// and not "/nairobi". Same for .com.gh and /accra. Sub-paths like
// /nairobi/buy or /nairobi/kilimani keep their full prefix on every
// host because the rewrite is scoped to source "/".
//
// Without an explicit map per page Google picks one domain as canonical
// and treats the other two as duplicates, the opposite of what we want
// for local-pack visibility in Nairobi and Accra.
export function alternateLanguagesFor(path: string) {
  const main = `https://${site.domains.main}`;
  const ke = `https://${site.domains.nairobi}`;
  const gh = `https://${site.domains.accra}`;

  if (path === "/" || path === "") {
    return {
      "en-KE": ke,
      "en-GH": gh,
      "x-default": main,
    };
  }

  if (path === "/nairobi") {
    return {
      "en-KE": ke,
      "x-default": `${main}/nairobi`,
    };
  }

  if (path === "/accra") {
    return {
      "en-GH": gh,
      "x-default": `${main}/accra`,
    };
  }

  if (path.startsWith("/nairobi/")) {
    return {
      "en-KE": `${ke}${path}`,
      "x-default": `${main}${path}`,
    };
  }

  if (path.startsWith("/accra/")) {
    return {
      "en-GH": `${gh}${path}`,
      "x-default": `${main}${path}`,
    };
  }

  return {
    "en-KE": `${ke}${path}`,
    "en-GH": `${gh}${path}`,
    "x-default": `${main}${path}`,
  };
}

// Country routing for the /insights hub. The catalogue is split so
// each domain only ranks for its own market: goldstay.com and
// goldstay.co.ke serve Kenya articles, goldstay.com.gh serves Ghana
// articles. Hosts that don't match the requested article 308-redirect
// to the canonical host (see /insights/[slug]/page.tsx).
export function countryForHost(host: string): "kenya" | "ghana" {
  const lower = host.toLowerCase();
  if (lower.endsWith(site.domains.accra)) return "ghana";
  return "kenya";
}

export function canonicalHostForCountry(country: "kenya" | "ghana") {
  return country === "ghana" ? site.domains.accra : site.domains.main;
}

// hreflang + canonical for an /insights/<slug> URL. Kenya posts are
// canonical on .com with .co.ke as the en-KE alternate; Ghana posts
// are canonical on .com.gh and don't appear on the Kenya hosts at
// all. Returning absolute URLs for the canonical lets us point Google
// at the correct host even when the request is served from a
// different domain (handy if a 308 redirect ever fails to fire).
export function insightAlternates(slug: string, country: "kenya" | "ghana") {
  const main = `https://${site.domains.main}`;
  const ke = `https://${site.domains.nairobi}`;
  const gh = `https://${site.domains.accra}`;
  const path = `/insights/${slug}`;

  if (country === "ghana") {
    return {
      canonical: `${gh}${path}`,
      languages: {
        "en-GH": `${gh}${path}`,
        "x-default": `${gh}${path}`,
      },
    };
  }

  return {
    canonical: `${main}${path}`,
    languages: {
      "en-KE": `${ke}${path}`,
      "x-default": `${main}${path}`,
    },
  };
}

export function emailFor(city?: "nairobi" | "accra" | null) {
  if (city === "nairobi") return site.emails.nairobi;
  if (city === "accra") return site.emails.accra;
  return site.emails.default;
}

// TEMPORARY: until a Kenyan WhatsApp Business number is live, the Nairobi
// surface (and the neutral .com fallback) route to the founder's UAE
// WhatsApp so inbound leads reach a real human instead of a dead
// placeholder. Override with NEXT_PUBLIC_WHATSAPP_NUMBER_NAIROBI in Vercel
// the moment the Kenyan number is provisioned. Accra still uses its
// placeholder because .com.gh is not live yet.
const TEMP_UAE_FOUNDER_NUMBER = "971504833050";
export const whatsapp = {
  number:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER_NAIROBI ||
    TEMP_UAE_FOUNDER_NUMBER,
  nairobi:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER_NAIROBI || TEMP_UAE_FOUNDER_NUMBER,
  accra: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER_ACCRA || "233500000000",
};

export function waLink(message: string, city?: "nairobi" | "accra") {
  const number =
    city === "nairobi"
      ? whatsapp.nairobi
      : city === "accra"
        ? whatsapp.accra
        : whatsapp.number;
  const text = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${text}`;
}

export const services = [
  {
    slug: "property-sourcing",
    title: "Property Sourcing",
    fee: "Free",
    feeLabel: "for buyers",
    detailHref: "/property-sourcing",
    blurb:
      "For diaspora landlords buying remotely. We find the right property, run the inspections, negotiate the price, verify the title and hand you a turnkey asset ready to rent.",
    features: [
      "On-the-ground property search to your investment brief",
      "Remote video walk-through and in-person inspection",
      "Price negotiation on your behalf",
      "Legal and title verification with our property lawyers",
      "Due diligence on the developer, building and service charge history",
      "Full handover pack at completion: keys, documents, inventory, utilities",
      "Seamless transition into Goldstay long-term or short-stay management",
    ],
  },
  {
    slug: "long-term",
    title: "Long-Term Management",
    fee: "10%",
    feeLabel: "of collected rent",
    blurb:
      "End-to-end management for landlords who want stable, long-term tenants in Nairobi or Accra.",
    features: [
      "Tenant sourcing and rigorous vetting",
      "Lease agreement drafting",
      "Rent collection and USD remittance to your foreign account",
      "Routine and emergency maintenance coordination",
      "Monthly financial statements",
      "24/7 landlord WhatsApp support",
    ],
  },
  {
    slug: "short-stay",
    title: "Airbnb / Short-Stay Management",
    fee: "20%",
    feeLabel: "of revenue",
    detailHref: "/airbnb-management",
    blurb:
      "Full Airbnb operations for landlords who want maximum yield without lifting a finger.",
    features: [
      "Professional photography and listing creation",
      "Dynamic pricing optimisation",
      "Guest communication and screening",
      "Turnover cleaning coordination",
      "Maintenance management",
      "Monthly revenue statements and USD remittance",
    ],
  },
  {
    slug: "tenant-finding",
    title: "Tenant Finding Only",
    fee: "1 month",
    feeLabel: "one-time fee",
    blurb:
      "For self-managing landlords who simply need a vetted, high-quality tenant in place.",
    features: [
      "Targeted tenant sourcing",
      "Full background and reference checks",
      "Employment and income verification",
      "Lease drafting and signing support",
      "Move-in inventory and handover",
    ],
  },
];

// Neighbourhood-level economics. Ranges are indicative monthly rent in USD
// for a recently let, well-finished 2-bedroom apartment. They're directional,
// not guarantees, and explicitly framed as such on the page. Sourced from
// publicly available listings and our own managed/advised stock.
export type Neighbourhood = {
  name: string;
  twoBrUsd: { min: number; max: number };
  tenant: string;
};

export const cities = {
  nairobi: {
    country: "Kenya",
    currency: "KES",
    tenantProfile: "UN, diplomats, corporates, international NGOs and expats",
    heroRentClaim:
      "Typical 2BR in Kilimani or Westlands nets USD 1,400 to 1,900 a month, wired to your account on the 5th.",
    neighbourhoods: [
      {
        name: "Westlands",
        twoBrUsd: { min: 1400, max: 2000 },
        tenant: "Corporate, UN, NGO",
      },
      {
        name: "Kilimani",
        twoBrUsd: { min: 1300, max: 1800 },
        tenant: "Young professionals, expats",
      },
      {
        name: "Kileleshwa",
        twoBrUsd: { min: 1400, max: 1900 },
        tenant: "Families, diplomats",
      },
      {
        name: "Lavington",
        twoBrUsd: { min: 1500, max: 2200 },
        tenant: "Diplomats, corporate executives",
      },
      {
        name: "Parklands",
        twoBrUsd: { min: 1000, max: 1500 },
        tenant: "Mixed corporate, mid-tier expat",
      },
      {
        name: "Brookside",
        twoBrUsd: { min: 1700, max: 2500 },
        tenant: "Premium families, embassies",
      },
      {
        name: "Karen",
        twoBrUsd: { min: 1500, max: 2000 },
        tenant: "Expat families, diplomats, school faculty",
      },
      {
        name: "Runda",
        twoBrUsd: { min: 1800, max: 2500 },
        tenant: "Corporate executives, embassies",
      },
      {
        name: "Rosslyn",
        twoBrUsd: { min: 1600, max: 2300 },
        tenant: "UN, diplomats, international school families",
      },
    ] satisfies Neighbourhood[],
    domain: "goldstay.co.ke",
  },
  accra: {
    country: "Ghana",
    currency: "GHS",
    tenantProfile: "NGOs, embassies, oil & gas executives and expat professionals",
    heroRentClaim:
      "Typical 2BR in East Legon or Airport Residential nets USD 1,300 to 1,900 a month, wired to your account on the 5th.",
    neighbourhoods: [
      {
        name: "East Legon",
        twoBrUsd: { min: 1200, max: 1800 },
        tenant: "Oil & gas execs, embassies",
      },
      {
        name: "Adjiringanor",
        twoBrUsd: { min: 1300, max: 1900 },
        tenant: "Corporate executives, NGOs",
      },
      {
        name: "Airport Residential",
        twoBrUsd: { min: 1400, max: 2200 },
        tenant: "Diplomats, senior expats",
      },
      {
        name: "Cantonments",
        twoBrUsd: { min: 1800, max: 2800 },
        tenant: "Embassies, premium expats",
      },
      {
        name: "Labone",
        twoBrUsd: { min: 1000, max: 1500 },
        tenant: "Young professionals, corporate mid-tier",
      },
    ] satisfies Neighbourhood[],
    domain: "goldstay.com.gh",
  },
} as const;

// Per-city content for the "Buy" page at /nairobi/buy and /accra/buy.
// Kept here so the page itself stays purely presentational and new
// claims (price ranges, yield bands, registry references) are updated
// in one place when the market moves.
export const citySourcing = {
  nairobi: {
    heroNeighbourhoods: "Kilimani, Westlands, Lavington or Karen",
    yieldAreaName: "Kilimani or Westlands",
    priceRange: "USD 180,000 to 220,000",
    longTermRent: "USD 1,400 to 1,900 / month",
    shortStayRent: "USD 2,200 to 2,800 / month",
    netYield: "7 to 8.5% per year",
    projectsTracked: 30,
    projectsLabel: "New-build projects currently on our Nairobi inspection list across Kilimani, Westlands, Riverside, Lavington, Kileleshwa and Karen.",
    titleAuthority: "the Ministry of Lands",
    taxAuthority: "KRA",
    titlePillarBody:
      "Our Kenyan property lawyers pull the title at Ardhi House, verify there are no undisclosed caveats or charges, confirm service charge arrears and draft a watertight sale agreement in your name.",
    buildingPillarBody:
      "For apartments, we pull service charge history, reserve fund health, AGM minutes and developer track record. For standalone homes, we run the physical survey against the title deed.",
    riskNote:
      "In Nairobi the most common buyer trap is a clean-looking title that hides a charge against the property, a survey discrepancy or a service charge in arrears. We catch all three before you wire a cent.",
  },
  accra: {
    heroNeighbourhoods: "East Legon, Airport Residential, Cantonments or Labone",
    yieldAreaName: "East Legon or Airport Residential",
    priceRange: "USD 160,000 to 210,000",
    longTermRent: "USD 1,300 to 1,900 / month",
    shortStayRent: "USD 2,000 to 2,600 / month",
    netYield: "6.5 to 8% per year",
    projectsTracked: 20,
    projectsLabel: "New-build projects currently on our Accra inspection list across East Legon, Airport Residential, Cantonments, Labone and Ridge.",
    titleAuthority: "the Lands Commission",
    taxAuthority: "GRA",
    titlePillarBody:
      "Our Ghanaian property lawyers trace the full title chain at the Lands Commission, confirm it is not stool, family or disputed land, and draft a sale agreement registered in your name.",
    buildingPillarBody:
      "For apartments, we pull service charge history, reserve fund health and developer track record. For standalone homes, we run the physical survey and confirm the building matches the registered plot.",
    riskNote:
      "In Accra the single biggest buyer trap is a title that looks clean on the deed but sits on stool or family land with a disputed chain. We verify the full chain at the Lands Commission before you wire a cent.",
  },
} as const;

// City-specific FAQ that sits on top of the global FAQ on each city page.
// These are the questions every diaspora landlord in that specific market
// actually asks in month one of ownership.
export const cityFaq = {
  nairobi: [
    {
      q: "Do I need a KRA PIN to rent out my property in Kenya?",
      a: "By Kenyan law, yes. If you don't already have one, we handle the registration for you end-to-end. Send us a scanned passport and proof of ownership and your KRA PIN is live in roughly a week, with no visit to Kenya required. The reason we insist on this isn't paperwork. It's to protect your title from any future KRA action on undeclared income.",
    },
    {
      q: "Who handles the 7.5% monthly residential rental income tax?",
      a: "Kenya charges a 7.5% MRI (Monthly Rental Income) tax on gross rent for residential landlords (reduced from 10% under the Finance Act 2023). We calculate it, withhold it from each month's collection, and remit it to KRA by the 20th on your behalf. The tax line appears on your monthly statement with the KRA receipt reference.",
    },
    {
      q: "What about land rates, service charge and SRA levies?",
      a: "All paid from your collected rent, all handled by us. Recurring charges like service charge to your apartment committee, annual land rates to Nairobi City County and any SRA (Special Rating Area) levies such as Karen or Westlands are set up once at onboarding and run on auto-pilot after that, so you're not approving the same bill every month. Anything new, one-off or above USD 250 comes to you in writing first. Every payment lands on your monthly statement with the receipt attached.",
    },
    {
      q: "Do I need NEMA or county licences to run my property as an Airbnb?",
      a: "No. When we operate your short-stay, the licensing sits with us, not with you. Goldstay holds the Nairobi City County single business permit, the Tourism Regulatory Authority registration and any NEMA clearance required for the building. You hold ownership; we hold every operating permit the property needs. Nothing for you to file, renew or worry about.",
    },
  ],
  accra: [
    {
      q: "Do I need a Ghana TIN to rent out my property?",
      a: "By Ghanaian law, yes. If you don't already have one, we handle the registration for you end-to-end. Send us a scanned passport and your title documents and your TIN is live in under two weeks, with no visit to Ghana required. The reason we insist on this isn't paperwork. It's to keep your title clean of any future GRA action on undeclared income.",
    },
    {
      q: "Who handles the 8% rental income tax?",
      a: "Ghana applies an 8% final withholding tax on gross residential rental income. We deduct it from each month's collection and remit it to GRA by the 15th of the following month on your behalf. You receive the GRA acknowledgement reference on every monthly statement.",
    },
    {
      q: "What about property rates and ground rent?",
      a: "All paid from your collected rent, all handled by us. Accra property rates to AMA (or your relevant municipal assembly) and annual ground rent to the Lands Commission are set up once at onboarding and run on auto-pilot after that, so you're not approving the same bill every year. Anything new, one-off or above USD 250 comes to you in writing first. Every payment lands on your monthly statement with the official receipt attached.",
    },
    {
      q: "Do I need a GTA licence to list my property on Airbnb?",
      a: "No. When we operate your short-stay, the Ghana Tourism Authority (GTA) licensing sits with us, not with you. Goldstay holds the GTA operator licence, the municipal business operating permit and any other short-stay permits the property needs. You hold ownership; we hold every operating permit. Nothing for you to file or renew.",
    },
  ],
} as const;

export const faq = [
  {
    q: "What is your management fee?",
    a: "For long-term management we charge 10% of rent collected. For Airbnb and short-stay we charge 20% of revenue. Tenant finding only is a one-time fee equivalent to one month's rent. No hidden charges, no surprise deductions.",
  },
  {
    q: "How do you remit rent to my foreign account?",
    a: "We collect rent locally in KES or GHS, convert at a transparent wholesale FX rate, and wire USD to your bank account in Europe, the UK, USA, UAE or Canada. You receive a statement every month showing every shilling collected and every cent remitted.",
  },
  {
    q: "What currency do you collect and remit in?",
    a: "We collect in local currency (KES in Nairobi, GHS in Accra) and remit in US dollars by default. We can also remit in EUR, GBP or AED on request. FX is done at wholesale interbank rate with the spread disclosed on every statement.",
  },
  {
    q: "Do I need to be in Kenya or Ghana to sign you on?",
    a: "No. Everything from the first call to contract signing happens remotely. Documents are signed electronically and witnessed under Kenyan or Ghanaian law where required. Your first visit to the property can be long after you've started earning.",
  },
  {
    q: "How do you vet tenants?",
    a: "Every applicant goes through ID verification, employer confirmation, income verification, referee checks and a face-to-face interview. For corporate tenants we verify the entity and signatory. We only present shortlisted tenants to you for final approval, and nothing is signed without you.",
  },
  {
    q: "What happens if a tenant doesn't pay?",
    a: "We chase on day one, not day thirty. Our lease agreements are enforceable and we have legal partners in both Nairobi and Accra who can serve notice and begin eviction proceedings within the statutory window. You'll know within 48 hours of the first missed payment.",
  },
  {
    q: "What happens to my property if Goldstay closes?",
    a: "Your property is yours. Your tenant relationship is yours. Your bank details stay on your own accounts. If we ever wound down, every landlord would receive a full onboarding pack within 14 days: tenant contact, lease, statements, vendor list, keys. No lock-in is built into our operating model.",
  },
  {
    q: "Do you manage Airbnb properties?",
    a: "Yes. We run full short-stay operations including listing creation, dynamic pricing, guest communication, cleaning and maintenance. We pay only the portion of our fee that corresponds to revenue actually collected. We do not guarantee a specific revenue number, we guarantee the execution.",
  },
  {
    q: "Can Goldstay help me buy a property I don't own yet?",
    a: "Yes. Our Property Sourcing service is built for diaspora buyers who want to buy remotely without getting burned. We search to your brief, run in-person inspections, negotiate the price, verify the title with our property lawyers, and hand you a turnkey asset at completion. The service is free for you as the buyer.",
  },
  {
    q: "Who pays for repairs and maintenance?",
    a: "You do. It's your asset, after all. But the job is entirely ours. We source quotes, supervise the work, pay vendors directly from your collected rent, and send you the receipts. Anything under USD 50 is handled without disturbing you. Anything between USD 50 and USD 250 appears on your statement with a photo receipt. Anything above USD 250 is pre-approved with you in writing before we spend a shilling.",
  },
  {
    q: "How is Goldstay different from my current local agent?",
    a: "Three things: we live on the ground full time, our entire operating model is built around diaspora reporting and USD remittance, and we take zero commissions from contractors or listing platforms. If your current agent offers all three of those and you're happy, we'd genuinely tell you to stay.",
  },
];

// Returns the operational FAQ with cross-city references swapped out so
// a reader on /nairobi only sees Nairobi/Kenya phrasing and a reader on
// /accra only sees Accra/Ghana phrasing. The homepage still uses the
// unscoped `faq` because it serves both markets.
export function localizedFaq(city: "nairobi" | "accra") {
  const cityName = city === "nairobi" ? "Nairobi" : "Accra";
  const country = city === "nairobi" ? "Kenya" : "Ghana";
  const countryAdj = city === "nairobi" ? "Kenyan" : "Ghanaian";
  const currency = city === "nairobi" ? "KES" : "GHS";
  const currencyWord = city === "nairobi" ? "shilling" : "cedi";
  const currencyFull =
    city === "nairobi" ? "Kenyan shillings (KES)" : "Ghanaian cedis (GHS)";

  return [
    faq[0],
    {
      q: "How do you remit rent to my foreign account?",
      a: `We collect rent in ${cityName} in ${currency}, convert at a transparent wholesale FX rate, and wire USD to your bank account in Europe, the UK, USA, UAE or Canada. You receive a statement every month showing every ${currencyWord} collected and every cent remitted.`,
    },
    {
      q: "What currency do you collect and remit in?",
      a: `In ${cityName} we collect in ${currencyFull} and remit in US dollars by default. We can also remit in EUR, GBP or AED on request. FX is done at wholesale interbank rate with the spread disclosed on every statement.`,
    },
    {
      q: `Do I need to be in ${country} to sign you on?`,
      a: `No. Everything from the first call to contract signing happens remotely. Documents are signed electronically and witnessed under ${countryAdj} law where required. Your first visit to the property can be long after you've started earning.`,
    },
    faq[4],
    {
      q: "What happens if a tenant doesn't pay?",
      a: `We chase on day one, not day thirty. Our lease agreements are enforceable and we have ${countryAdj} legal partners in ${cityName} who can serve notice and begin eviction proceedings within the statutory window. You'll know within 48 hours of the first missed payment.`,
    },
    faq[6],
    faq[7],
    {
      q: `Can Goldstay help me buy a property in ${cityName}?`,
      a: `Yes. Our Property Sourcing service is built for diaspora buyers who want to buy in ${cityName} remotely without getting burned. We search to your brief, run in-person inspections, negotiate the price, verify the title with our ${countryAdj} property lawyers, and hand you a turnkey asset at completion. The service is free for you as the buyer.`,
    },
    {
      q: "Who pays for repairs and maintenance?",
      a: `You do. It's your asset, after all. But the job is entirely ours. We source quotes, supervise the work, pay vendors directly from your collected rent, and send you the receipts. Anything under USD 50 is handled without disturbing you. Anything between USD 50 and USD 250 appears on your statement with a photo receipt. Anything above USD 250 is pre-approved with you in writing before we spend a ${currencyWord}.`,
    },
    {
      q: `How is Goldstay different from my current ${cityName} agent?`,
      a: `Three things: we live in ${cityName} full time, our entire operating model is built around diaspora reporting and USD remittance, and we take zero commissions from contractors or listing platforms. If your current ${cityName} agent offers all three of those and you're happy, we'd genuinely tell you to stay.`,
    },
  ];
}

export const painPoints = [
  {
    title: "Unreliable Agents",
    body: "Local agents who stop communicating after the first month and go silent when it matters most.",
  },
  {
    title: "Late Rent Payments",
    body: "Chasing tenants from six thousand miles away is exhausting, awkward and rarely effective.",
  },
  {
    title: "Maintenance Surprises",
    body: "Finding out about a burst pipe or damaged floor six months after the fact, with no invoices to show.",
  },
  {
    title: "Currency Friction",
    body: "Collecting rent in KES or GHS and wrestling with conversion, wire fees and timing every single month.",
  },
];

export const differentiators = [
  {
    title: "Based On The Ground",
    body: "We are physically present in both Nairobi and Accra. Not remote agents who've never seen your property.",
  },
  {
    title: "USD Remittances",
    body: "Rent collected locally and wired to your foreign bank every month in US dollars. No conversion headaches.",
  },
  {
    title: "Full Transparency",
    body: "Monthly statements showing every shilling collected and every expense incurred. Access your dashboard anytime.",
  },
  {
    title: "Diaspora Specialists",
    body: "We were built specifically for landlords living abroad. We understand your situation because we've lived it.",
  },
];

export const steps = [
  {
    n: "01",
    title: "Contact Us",
    body: "Message us on WhatsApp or fill in the form. We'll call you within 2 hours during business hours.",
  },
  {
    n: "02",
    title: "We Assess Your Property",
    body: "Virtual or in-person assessment. We advise on pricing, furnishing and the optimal rental strategy.",
  },
  {
    n: "03",
    title: "We Handle Everything",
    body: "Tenant sourcing, management, maintenance and monthly USD remittances. You do nothing.",
  },
];

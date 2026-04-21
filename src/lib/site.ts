export const site = {
  name: "Goldstay",
  domain: "goldstay.com",
  tagline: "Your Property. Professionally Managed.",
  description:
    "Premium property management in Nairobi and Accra for diaspora landlords. We handle everything. You receive monthly USD transfers.",
  email: "hello@goldstay.com",
  parent: "A TADCO Company",
  socials: {
    instagram: "https://instagram.com/goldstay",
    linkedin: "https://www.linkedin.com/company/goldstay",
  },
  domains: {
    main: "goldstay.com",
    nairobi: "goldstay.co.ke",
    accra: "goldstay.com.gh",
  },
};

export const whatsapp = {
  number:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER_NAIROBI ||
    "254700000000",
  nairobi: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER_NAIROBI || "254700000000",
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
    slug: "long-term",
    title: "Long-Term Management",
    fee: "18%",
    feeLabel: "of monthly rent",
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
    fee: "22%",
    feeLabel: "of revenue",
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

export const cities = {
  nairobi: {
    country: "Kenya",
    currency: "KES",
    tenantProfile: "UN, diplomats, corporates, international NGOs and expats",
    neighbourhoods: [
      "Westlands",
      "Kilimani",
      "Kileleshwa",
      "Lavington",
      "Parklands",
      "Brookside",
    ],
    domain: "goldstay.co.ke",
  },
  accra: {
    country: "Ghana",
    currency: "GHS",
    tenantProfile: "NGOs, embassies, oil & gas executives and expat professionals",
    neighbourhoods: [
      "East Legon",
      "Adjiringanor",
      "Airport Residential",
      "Cantonments",
      "Labone",
    ],
    domain: "goldstay.com.gh",
  },
} as const;

export const faq = [
  {
    q: "What is your management fee?",
    a: "18% of monthly rent for long-term management and 22% of revenue for Airbnb / short-stay. Tenant finding only is a one-time fee equivalent to one month's rent. No hidden charges, no surprise deductions.",
  },
  {
    q: "How do you remit rent to my foreign account?",
    a: "We collect rent locally in KES or GHS, convert at a transparent wholesale FX rate, and wire USD to your bank account in Europe, the UK, USA, UAE or Canada. You receive a statement every month showing every shilling collected and every cent remitted.",
  },
  {
    q: "What currency do you collect and remit in?",
    a: "We collect in local currency (KES in Nairobi, GHS in Accra) and remit in US dollars by default. We can also remit in EUR, GBP or AED on request.",
  },
  {
    q: "How do you vet tenants?",
    a: "Every applicant goes through ID verification, employer confirmation, income verification, referee checks and a face-to-face interview. For corporate tenants we verify the entity and signatory. We only present shortlisted tenants to you for final approval.",
  },
  {
    q: "What happens if a tenant doesn't pay?",
    a: "We chase on day one, not day thirty. Our lease agreements are enforceable and we have legal partners in both Nairobi and Accra. In 6 years of operation our default-to-eviction rate is under 2%.",
  },
  {
    q: "Do you manage Airbnb properties?",
    a: "Yes. We run full short-stay operations including listing creation, dynamic pricing, guest communication, cleaning and maintenance. Airbnb typically yields 40 to 70% more than long-term let in the neighbourhoods we operate in.",
  },
];

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

// Per-diaspora-origin content for the /from/[origin]/[city] programmatic
// SEO pages. Each entry must have enough unique copy to avoid the thin-
// content trap that Google penalises programmatically generated pages
// for. Add new origins by extending this array; URL slug, hreflang and
// the page itself all derive from this single source.

export type DiasporaOriginCode =
  | "uk"
  | "usa"
  | "uae"
  | "qatar"
  | "saudi-arabia"
  | "australia"
  | "canada"
  | "ireland"
  | "germany"
  | "netherlands";

export type DiasporaOrigin = {
  code: DiasporaOriginCode;
  // Title-cased canonical name for headings ("the United Kingdom").
  name: string;
  // Short-form ("UK") for nav, breadcrumbs and tight UI surfaces.
  short: string;
  // ISO 3166-1 alpha-2 for hreflang composition where useful.
  countryCode: string;
  // Currency the recipient bank account is most likely denominated in,
  // shown in the FX corridor explainer section.
  remitCurrency: "GBP" | "USD" | "AED" | "EUR" | "AUD" | "CAD" | "QAR" | "SAR";
  // Approximate hours offset from EAT (Nairobi/UTC+3). Used to render
  // the "we work while you sleep" angle truthfully per origin.
  eatOffsetHours: number;
  // Per-origin unique paragraph that Google can fingerprint as
  // distinct from every other /from/* page. Keep it ≥ 2 sentences,
  // ≤ 4 sentences, and avoid AI-tells.
  whyDiasporaOwn: string;
  // The single most common question this diaspora cluster asks on a
  // discovery call. Surfaces high in the page so the searcher feels
  // immediately understood.
  topQuestion: { q: string; a: string };
  // Common pain point that distinguishes this origin from neighbours
  // (e.g. UK landlords vs UAE landlords face different tax angles).
  paragraphPain: string;
};

export const DIASPORA_ORIGINS: DiasporaOrigin[] = [
  {
    code: "uk",
    name: "the United Kingdom",
    short: "UK",
    countryCode: "GB",
    remitCurrency: "GBP",
    eatOffsetHours: -2,
    whyDiasporaOwn:
      "Most British-Kenyan and British-Ghanaian landlords own a home back home as a hedge against UK property prices, an inheritance for children with British passports, or a retirement plan in Karen, Kilimani or East Legon. The split-life economics work (sterling salary, hard-asset rent in USD), but only if the property doesn't quietly leak value while you're 6,000 miles away.",
    topQuestion: {
      q: "Do I need to declare Kenyan rental income on my UK self-assessment?",
      a: "Yes. The UK-Kenya double tax treaty means the 7.5% MRI you pay in Kenya is creditable against your UK liability, but you still file. We hand you a clean year-end pack with every shilling collected, every shilling withheld and the KRA receipt references, ready to drop into your accountant's bundle.",
    },
    paragraphPain:
      "The recurring UK-landlord pain is the inheritance plot (a Karen or Kilimani title in your name from a parent or grandparent) that nobody is actively managing. Service charge in arrears, caretaker arrangements no one ever wrote down, no KRA PIN. We unwind that quietly and put the property back to work in USD before HMRC ever notices.",
  },
  {
    code: "usa",
    name: "the United States",
    short: "USA",
    countryCode: "US",
    remitCurrency: "USD",
    eatOffsetHours: -8,
    whyDiasporaOwn:
      "American-Kenyan and American-Ghanaian landlords are typically dual-income households who bought a Nairobi or Accra apartment as a USD-yield asset that would be impossible to find at the same yield in any US metro. The maths is real (net 7-8% in a hard-currency-remitted property is rare), but only if the operator does what they promise.",
    topQuestion: {
      q: "How does the IRS treat my Kenyan or Ghanaian rental income?",
      a: "Worldwide income is reportable on your 1040 and your foreign rental belongs on Schedule E. The Kenya 7.5% MRI (or Ghana 8% withholding) is creditable via Form 1116. We give you a one-page year-end statement that maps directly to those line items and survives an IRS look.",
    },
    paragraphPain:
      "The US-landlord trap is wire infrastructure. SWIFT charges, intermediary banks, and unpredictable USD landing dates kill the maths. We pre-clear the corridor and lock the rate at remittance, so what we promise on the statement is what arrives in Chase, Wells Fargo or your credit union, on the 5th of the month, every month.",
  },
  {
    code: "uae",
    name: "the United Arab Emirates",
    short: "UAE",
    countryCode: "AE",
    remitCurrency: "AED",
    eatOffsetHours: 1,
    whyDiasporaOwn:
      "The UAE has Goldstay's largest single diaspora cluster: Dubai- and Abu Dhabi-based Kenyan and Ghanaian professionals who can't legally own UAE property at meaningful scale and use Nairobi or Accra as their long-term hard-asset corridor. Tax-free salaries plus USD rent in a market they actually understand is a structurally good trade.",
    topQuestion: {
      q: "Can I receive my Kenyan rent into a UAE bank account in AED?",
      a: "Yes. We remit in USD by default but settle directly to ENBD, FAB, ADCB or any UAE bank in your preferred currency. AED is supported on a transparent wholesale FX rate; the spread is itemised on every monthly statement.",
    },
    paragraphPain:
      "The UAE-landlord trap is the cousin-as-caretaker arrangement that quietly stops working when life events happen on either side. We replace that gracefully, keep the relationship intact, and have the cousin keep doing the things they're best at (key handover, viewings) on a contracted, paid basis instead of a favour basis.",
  },
  {
    code: "qatar",
    name: "Qatar",
    short: "Qatar",
    countryCode: "QA",
    remitCurrency: "QAR",
    eatOffsetHours: 0,
    whyDiasporaOwn:
      "Doha-based Kenyan and Ghanaian engineers, medical staff and Aviation industry professionals run the same playbook as the UAE cluster: tax-free local salary, hard-asset USD rent at home. The time zone is identical to EAT, which makes onboarding calls dramatically easier.",
    topQuestion: {
      q: "Do I need to be in Kenya or Ghana to sign you on?",
      a: "No. Everything from the discovery call to the management agreement is signed remotely under Kenyan or Ghanaian law. We've onboarded landlords from Doha without them setting foot back home in years.",
    },
    paragraphPain:
      "The Qatar-landlord pain is annual leave windows: short, infrequent visits that have to do triple duty (family, paperwork, property check). We clear the property paperwork backlog before you land so the trip stays a holiday.",
  },
  {
    code: "saudi-arabia",
    name: "Saudi Arabia",
    short: "Saudi Arabia",
    countryCode: "SA",
    remitCurrency: "SAR",
    eatOffsetHours: 0,
    whyDiasporaOwn:
      "Riyadh- and Jeddah-based African expats (predominantly medical, engineering and education sector) share the Gulf playbook of tax-free salary plus hard-asset USD rent at home. Kenya and Ghana are the most common target markets for diaspora ownership.",
    topQuestion: {
      q: "Will the rent landing in my account create any reporting issues with my Saudi bank?",
      a: "Foreign-source personal income (rent) wired in USD lands cleanly. We issue a transparent monthly statement that doubles as the audit trail your bank will ask for if compliance ever queries the inbound wires.",
    },
    paragraphPain:
      "The Saudi-landlord trap is the gap between salary cycle and rent cycle. We align our remittance to land in the first week of each month so it stacks predictably with your salary date, instead of a moving-target arrival window that complicates household budgeting.",
  },
  {
    code: "australia",
    name: "Australia",
    short: "Australia",
    countryCode: "AU",
    remitCurrency: "AUD",
    eatOffsetHours: 7,
    whyDiasporaOwn:
      "Melbourne, Sydney and Perth host a quietly-growing Kenyan and Ghanaian diaspora that sees Nairobi and Accra property as both an emotional anchor and a portfolio diversifier denominated in something other than the AUD they live in. The 7-hour time zone is awkward for self-management; that's exactly where we add the most value.",
    topQuestion: {
      q: "Will I be able to claim the Kenya MRI tax against my Australian assessment?",
      a: "Yes, via the Australia-Kenya double tax arrangement, the MRI counts as a foreign income tax offset on your individual return. We ship the year-end pack in a format your Australian accountant can lift straight in.",
    },
    paragraphPain:
      "The Australia-landlord trap is the time-zone gap: a burst pipe in Westlands that you find out about Monday morning AEST happened on Sunday afternoon EAT, by which point a self-managed caretaker has either fixed it badly or spent your money on the wrong supplier. We close that loop in under four hours, every time.",
  },
  {
    code: "canada",
    name: "Canada",
    short: "Canada",
    countryCode: "CA",
    remitCurrency: "CAD",
    eatOffsetHours: -7,
    whyDiasporaOwn:
      "Toronto, Vancouver, Calgary and Edmonton-based Kenyan and Ghanaian landlords use Nairobi or Accra ownership as a hedge against Canadian property prices and an inheritance vehicle that survives the colder side of dual-citizenship planning. Most own one or two units and can't justify a full-time caretaker.",
    topQuestion: {
      q: "Does the CRA want me to declare this rental income?",
      a: "Yes. Worldwide income is reportable, and the Kenya MRI (or Ghana withholding) is creditable. We hand you a clean Form T776-friendly summary at year-end, with currency-converted figures and the originating KES/GHS amounts both shown.",
    },
    paragraphPain:
      "The Canada-landlord trap is the family-pressure dynamic where a relative agrees to manage the property informally and resents it after the third year. We replace that with a clean, paid arrangement so the relationship survives and the property starts performing.",
  },
  {
    code: "ireland",
    name: "Ireland",
    short: "Ireland",
    countryCode: "IE",
    remitCurrency: "EUR",
    eatOffsetHours: -2,
    whyDiasporaOwn:
      "Dublin-based Kenyan and Ghanaian healthcare and tech professionals are a quiet but loyal Goldstay cluster. Property in Nairobi or Accra is both an inheritance and a EUR-uncorrelated asset, often bought through pooled family money and badly under-managed.",
    topQuestion: {
      q: "Will the rent show up in EUR or USD?",
      a: "USD by default; EUR on request, with the FX spread shown line-by-line on every statement. AIB, Bank of Ireland and Revolut all accept the inbound transparently.",
    },
    paragraphPain:
      "The Ireland-landlord trap is mid-tier inheritance properties that nobody wants to sell but nobody actually manages. We unlock those in 30-60 days and convert the standstill into a USD-yielding asset.",
  },
  {
    code: "germany",
    name: "Germany",
    short: "Germany",
    countryCode: "DE",
    remitCurrency: "EUR",
    eatOffsetHours: -2,
    whyDiasporaOwn:
      "Berlin, Munich and Frankfurt-based Kenyan and Ghanaian engineers, doctors and academics own Nairobi and Accra property as a hedge against German real estate fragility and a hard-currency yield asset. EUR salaries plus USD rent is a proven pairing.",
    topQuestion: {
      q: "How does this income interact with my German tax return?",
      a: "Foreign rental income is reportable on Anlage V and the Kenya/Ghana withholding is creditable under the respective DTA. We ship a German-accountant-friendly summary at year-end with both KES/GHS originals and EUR-converted line items.",
    },
    paragraphPain:
      "The Germany-landlord trap is paperwork perfectionism colliding with informal Kenyan caretaker arrangements. We bring the full audit trail (KRA receipts, vendor invoices, photo evidence) up to a standard that satisfies even the most thorough German bookkeeping.",
  },
  {
    code: "netherlands",
    name: "the Netherlands",
    short: "Netherlands",
    countryCode: "NL",
    remitCurrency: "EUR",
    eatOffsetHours: -2,
    whyDiasporaOwn:
      "Amsterdam, Rotterdam, The Hague and Utrecht-based Kenyan and Ghanaian professionals (many in NGO and academic roles) own home-country property partly as legacy, partly as the only asset in their portfolio not denominated in EUR. We see strong East Legon and Lavington concentration in this cluster.",
    topQuestion: {
      q: "Will the income create issues with Box 3 in my Dutch tax return?",
      a: "Foreign property is taxable under Box 3 in the Netherlands, but the Kenya MRI (or Ghana withholding) is creditable under the respective DTA. We give you a ready-for-Belastingdienst summary at year-end.",
    },
    paragraphPain:
      "The Netherlands-landlord trap is the holiday-home dual-use where the family wants to use the property a few weeks a year. We design a hybrid model that keeps your weeks blocked, lets the rest, and still beats a pure self-managed setup financially.",
  },
];

export function findDiasporaOrigin(
  code: string,
): DiasporaOrigin | undefined {
  return DIASPORA_ORIGINS.find((o) => o.code === code);
}

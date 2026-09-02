// Shared dropdown options for the public landlord intake surfaces:
// /list-your-property, the partner embed at /embed/landlord-intake, and
// the shareable /start link ops paste into a WhatsApp thread.
//
// These lived inline in the embed form first. They are shared now
// because the values are not cosmetic — `residenceCountry` feeds the
// diaspora check in lead-enrichment and `serviceInterest` feeds the
// tier score, so two forms drifting apart would quietly score the same
// landlord differently depending on which link they were sent.

// Where the landlord lives, not where the property is. Everything
// except Kenya and Ghana counts as diaspora downstream, so the list
// leads with the corridors we actually see: UK, then the rest of the
// Anglophone diaspora, then the Gulf.
export const RESIDENCE_COUNTRIES = [
  "United Kingdom",
  "United States",
  "Canada",
  "Australia",
  "Germany",
  "Ireland",
  "Netherlands",
  "Qatar",
  "Saudi Arabia",
  "United Arab Emirates",
  "South Africa",
  "Kenya",
  "Ghana",
  "Other",
] as const;

// What the landlord wants from us. Free-text on the Lead row
// (`serviceInterest`) rather than an enum because the answer at first
// contact is a statement of intent, not a signed scope of work.
export const SERVICE_OPTIONS = [
  "Long-term",
  "Short-stay / Airbnb",
  "Help me buy a property",
  "Tenant finding only",
  "Not sure",
] as const;

// Asset cities we operate in. Mapped to the Country enum downstream by
// inferCountry() in /api/lead.
export const PROPERTY_CITIES = ["Nairobi", "Accra"] as const;

export type PropertyCity = (typeof PROPERTY_CITIES)[number];

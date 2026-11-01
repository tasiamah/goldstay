// Labels for PropertyType, in one place.
//
// There are now three rental models and at least five surfaces that
// name them: the admin property form, the locked form field on edit,
// the admin list badge, the client portal badge and the referral
// digest. With two values those had already drifted — "Long-term
// lease" in the form against "Long-term" on the badge — and a third
// value would have been copied into each of them by hand.
//
// `label` is the short form for badges and tables. `formLabel` is the
// longer one for a select, where the extra words are what tell an
// admin which model they are picking.

import type { PropertyType } from "@prisma/client";

export const PROPERTY_TYPE_LABEL: Record<PropertyType, string> = {
  LONG_TERM: "Long-term",
  SHORT_TERM: "Short-term",
  TENANT_FINDING: "Tenant finding",
};

export const PROPERTY_TYPE_FORM_LABEL: Record<PropertyType, string> = {
  LONG_TERM: "Long-term lease (10% of rent collected)",
  SHORT_TERM: "Short-term / Airbnb (20% of revenue)",
  TENANT_FINDING: "Tenant finding only (one month's rent, once)",
};

// The order the three are offered in, which is also the order of
// increasing involvement on our side. Tenant finding last because it
// is the exception: picking it means no recurring fee and no
// statements after the placement, and an admin choosing it should be
// choosing it deliberately rather than landing on it by position.
export const PROPERTY_TYPE_ORDER: readonly PropertyType[] = [
  "LONG_TERM",
  "SHORT_TERM",
  "TENANT_FINDING",
];

export const PROPERTY_TYPE_OPTIONS = PROPERTY_TYPE_ORDER.map((value) => ({
  value,
  label: PROPERTY_TYPE_FORM_LABEL[value],
}));

// How the referral digest describes the engagement to a referrer.
// Lower case and hyphenated because it lands mid-sentence.
export function isPropertyType(value: unknown): value is PropertyType {
  return (
    typeof value === "string" &&
    (PROPERTY_TYPE_ORDER as readonly string[]).includes(value)
  );
}

// Tenant finding is Kenya-only for now: the engagement is drafted
// against Kenyan law in TENANT_FINDING_KE_V1, and the generic
// agreement Ghana would otherwise fall back to is a management
// contract that does not describe a placement-only scope. Offering
// the combination would issue a Ghanaian client a contract for a
// service the document never mentions.
export function isPropertyTypeAvailableIn(
  type: PropertyType,
  country: "KE" | "GH",
): boolean {
  return type !== "TENANT_FINDING" || country === "KE";
}

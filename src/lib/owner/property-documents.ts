// Per-property document requirements.
//
// We deliberately keep the required set minimal for now — title deed
// only, which is the universal "this is mine" proof — because the
// owner can't upload most property-level documents themselves; the
// Goldstay team attaches title deeds, sale agreements, leases, etc.
// on the owner's behalf as the relationship matures.
//
// The dashboard banner reads this set to count "properties missing
// documents", and the property detail page reads it to render a
// "Documents we still need" callout. Adding a new required kind is
// a one-line change here; no consumer needs to know about it.

import type { DocumentKind } from "@prisma/client";

// Canonical list of document kinds every property must have on file
// for it to be considered "fully documented". Order is the order
// we'd present them in a checklist if we ever build one.
export const REQUIRED_PROPERTY_DOC_KINDS: ReadonlyArray<DocumentKind> = [
  "TITLE_DEED",
];

const REQUIRED_LABELS: Partial<Record<DocumentKind, string>> = {
  TITLE_DEED: "Title deed",
  SALE_AGREEMENT: "Sale agreement",
  LEASE: "Lease",
};

// Returns the kinds in REQUIRED_PROPERTY_DOC_KINDS that are not
// present in the supplied uploaded set. Pure; no DB.
export function missingPropertyDocKinds(
  uploadedKinds: ReadonlyArray<DocumentKind>,
): DocumentKind[] {
  const have = new Set(uploadedKinds);
  return REQUIRED_PROPERTY_DOC_KINDS.filter((k) => !have.has(k));
}

// Human label for a required kind. Falls back to the enum name in
// sentence case if a label is not registered (so a future addition
// doesn't crash the UI before the label is defined).
export function labelForRequiredDoc(kind: DocumentKind): string {
  if (REQUIRED_LABELS[kind]) return REQUIRED_LABELS[kind]!;
  const lower = kind.toLowerCase().replace(/_/g, " ");
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

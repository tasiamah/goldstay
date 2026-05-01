// Display helpers for Owner names. When a landlord sets a company
// name (e.g. "Pinetree Holdings Ltd") that's the legal counterparty
// we contract with and the name they want to see on cards, lists,
// and statements. The personal full name stays as a secondary line
// so the operator can still tell who's behind the account at a
// glance.
//
// When no company is set the personal name is the only thing we have
// to show, so it becomes primary and there is no secondary line.

export type OwnerNameInput = {
  fullName: string;
  companyName?: string | null;
};

export function formatOwnerDisplayName({
  fullName,
  companyName,
}: OwnerNameInput): string {
  const trimmed = companyName?.trim();
  return trimmed ? trimmed : fullName;
}

// Returns the natural-person name when there's a company name to
// promote to primary, otherwise null. Use this where you want the
// "Acme Ltd · Asha Kimani" treatment and want to skip the separator
// when there's only one name to show.
export function formatOwnerSecondaryName({
  fullName,
  companyName,
}: OwnerNameInput): string | null {
  const trimmed = companyName?.trim();
  return trimmed ? fullName : null;
}

// Formats a property's display name as "Building · Unit X" when the
// unit number is set. Used everywhere a property is named in a list,
// header, or document so the same property never appears under two
// different labels (e.g. "Luminara" on the dashboard and "Luminara
// A2003" in the statement).

export function formatPropertyDisplayName(
  name: string,
  unitNumber: string | null | undefined,
): string {
  const trimmed = unitNumber?.trim();
  return trimmed ? `${name} · ${trimmed}` : name;
}

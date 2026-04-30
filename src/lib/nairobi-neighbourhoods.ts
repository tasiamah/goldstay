// Curated list of Nairobi neighbourhoods used as the dropdown options
// on the property form. The set is deliberately limited to areas a
// diaspora landlord might realistically own a residential investment
// in — premium suburbs, mid-tier family neighbourhoods, and newer
// growth corridors. Slums and informal settlements are intentionally
// excluded (no portfolio is held there).
//
// Anything not on this list can still be entered via the "Other"
// option on the form, so this is a fast-path UX shortcut, not a hard
// constraint. When you spot a missing neighbourhood that a landlord
// keeps typing in via "Other", add it here so the dropdown stays
// useful.
//
// Sorted alphabetically because the dropdown surfaces them in this
// order.

export const NAIROBI_NEIGHBOURHOODS = [
  "Athi River",
  "Brookside",
  "Buruburu",
  "CBD",
  "Donholm",
  "Eastleigh",
  "Embakasi",
  "Garden Estate",
  "Gigiri",
  "Hurlingham",
  "Imara Daima",
  "Kahawa Sukari",
  "Kahawa Wendani",
  "Karen",
  "Kasarani",
  "Kiambu Road",
  "Kileleshwa",
  "Kilimani",
  "Kitengela",
  "Komarock",
  "Langata",
  "Lavington",
  "Loresho",
  "Madaraka",
  "Mlolongo",
  "Mountain View",
  "Muthaiga",
  "Nairobi West",
  "Ngara",
  "Ngong Road",
  "Nyari",
  "Old Muthaiga",
  "Ongata Rongai",
  "Parklands",
  "Pipeline",
  "Ridgeways",
  "Riverside",
  "Rosslyn",
  "Roysambu",
  "Ruaka",
  "Runda",
  "South B",
  "South C",
  "Spring Valley",
  "Syokimau",
  "Tatu City",
  "Thigiri",
  "Thome",
  "Two Rivers",
  "Upper Hill",
  "Westlands",
  "Zimmerman",
] as const;

export type NairobiNeighbourhood = (typeof NAIROBI_NEIGHBOURHOODS)[number];

// Case-insensitive lookup — returns the canonical spelling if the
// input matches one of our entries, else null. Used by the form to
// recognise "westlands" / "WESTLANDS" / " Westlands " as the same
// dropdown option, and by any future search/filter that wants to
// dedupe user-entered variants.
export function findCanonicalNairobiNeighbourhood(
  input: string | null | undefined,
): NairobiNeighbourhood | null {
  if (!input) return null;
  const needle = input.trim().toLowerCase();
  if (!needle) return null;
  return (
    NAIROBI_NEIGHBOURHOODS.find((n) => n.toLowerCase() === needle) ?? null
  );
}

// "Is this city Nairobi?" check used to decide whether to show the
// dropdown. Tolerates whitespace and case so "  nairobi " still
// triggers it.
export function isNairobiCity(city: string | null | undefined): boolean {
  if (!city) return false;
  return city.trim().toLowerCase() === "nairobi";
}

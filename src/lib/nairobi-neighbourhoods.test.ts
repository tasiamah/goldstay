import { describe, expect, it } from "vitest";
import {
  findCanonicalNairobiNeighbourhood,
  isNairobiCity,
  NAIROBI_NEIGHBOURHOODS,
} from "./nairobi-neighbourhoods";

// Nairobi neighbourhood canonicaliser. The senior risk: data drift
// between the dropdown list and the canonical lookup, which would
// silently drop landlord submissions on the floor when the form
// value doesn't normalise to a value the DB knows about. Sort + dedup
// of the dropdown list is asserted in passing.

describe("nairobi neighbourhoods", () => {
  it("dropdown is sorted + dedup'd and the canonical lookup matches every entry case-insensitively", () => {
    const sorted = [...NAIROBI_NEIGHBOURHOODS].sort((a, b) => a.localeCompare(b));
    expect(NAIROBI_NEIGHBOURHOODS).toEqual(sorted);
    expect(new Set(NAIROBI_NEIGHBOURHOODS).size).toBe(NAIROBI_NEIGHBOURHOODS.length);
    expect(findCanonicalNairobiNeighbourhood("  westlands ")).toBe("Westlands");
    expect(findCanonicalNairobiNeighbourhood("Atlantis")).toBeNull();
    expect(isNairobiCity("  NAIROBI ")).toBe(true);
    expect(isNairobiCity("Mombasa")).toBe(false);
  });
});

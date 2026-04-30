import { describe, expect, it } from "vitest";
import {
  findCanonicalNairobiNeighbourhood,
  isNairobiCity,
  NAIROBI_NEIGHBOURHOODS,
} from "./nairobi-neighbourhoods";

describe("NAIROBI_NEIGHBOURHOODS", () => {
  it("is sorted alphabetically and free of duplicates", () => {
    // Both properties matter for the dropdown UX: alphabetical so a
    // landlord scanning the list can find their suburb, dedup'd so
    // the form never shows two "Westlands" options.
    const sorted = [...NAIROBI_NEIGHBOURHOODS].sort((a, b) =>
      a.localeCompare(b),
    );
    expect(NAIROBI_NEIGHBOURHOODS).toEqual(sorted);
    expect(new Set(NAIROBI_NEIGHBOURHOODS).size).toBe(
      NAIROBI_NEIGHBOURHOODS.length,
    );
  });
});

describe("findCanonicalNairobiNeighbourhood", () => {
  it("normalises case and whitespace to the canonical spelling", () => {
    expect(findCanonicalNairobiNeighbourhood("  westlands ")).toBe("Westlands");
    expect(findCanonicalNairobiNeighbourhood("KILIMANI")).toBe("Kilimani");
  });

  it("returns null for empty / unknown values", () => {
    expect(findCanonicalNairobiNeighbourhood(null)).toBeNull();
    expect(findCanonicalNairobiNeighbourhood("")).toBeNull();
    expect(findCanonicalNairobiNeighbourhood("Atlantis")).toBeNull();
  });
});

describe("isNairobiCity", () => {
  it("returns true for Nairobi regardless of case / whitespace", () => {
    expect(isNairobiCity("Nairobi")).toBe(true);
    expect(isNairobiCity("  nairobi  ")).toBe(true);
    expect(isNairobiCity("NAIROBI")).toBe(true);
  });

  it("returns false for any other city or empty input", () => {
    expect(isNairobiCity("Mombasa")).toBe(false);
    expect(isNairobiCity("Accra")).toBe(false);
    expect(isNairobiCity("")).toBe(false);
    expect(isNairobiCity(null)).toBe(false);
  });
});

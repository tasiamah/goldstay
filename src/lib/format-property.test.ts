import { describe, expect, it } from "vitest";
import { formatPropertyDisplayName } from "./format-property";

describe("formatPropertyDisplayName", () => {
  it("appends the unit number with a separator when set", () => {
    expect(formatPropertyDisplayName("Luminara", "A2003")).toBe(
      "Luminara · A2003",
    );
  });

  it("returns just the building name when the unit is absent", () => {
    expect(formatPropertyDisplayName("Brookside Oak", null)).toBe(
      "Brookside Oak",
    );
    expect(formatPropertyDisplayName("Brookside Oak", undefined)).toBe(
      "Brookside Oak",
    );
  });

  it("treats whitespace-only as absent", () => {
    expect(formatPropertyDisplayName("Pinetree Plaza", "   ")).toBe(
      "Pinetree Plaza",
    );
  });

  it("trims surrounding whitespace from the unit number", () => {
    expect(formatPropertyDisplayName("Pinetree Plaza", "  4B ")).toBe(
      "Pinetree Plaza · 4B",
    );
  });
});

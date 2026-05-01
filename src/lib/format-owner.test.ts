import { describe, expect, it } from "vitest";
import {
  formatOwnerDisplayName,
  formatOwnerSecondaryName,
} from "./format-owner";

describe("formatOwnerDisplayName", () => {
  it("prefers the company name when set", () => {
    expect(
      formatOwnerDisplayName({
        fullName: "Asha Kimani",
        companyName: "Pinetree Holdings Ltd",
      }),
    ).toBe("Pinetree Holdings Ltd");
  });

  it("falls back to the personal name when company is missing", () => {
    expect(
      formatOwnerDisplayName({ fullName: "Asha Kimani", companyName: null }),
    ).toBe("Asha Kimani");
    expect(
      formatOwnerDisplayName({
        fullName: "Asha Kimani",
        companyName: undefined,
      }),
    ).toBe("Asha Kimani");
  });

  it("treats whitespace-only company as absent", () => {
    expect(
      formatOwnerDisplayName({ fullName: "Asha Kimani", companyName: "   " }),
    ).toBe("Asha Kimani");
  });
});

describe("formatOwnerSecondaryName", () => {
  it("returns the personal name when company is set", () => {
    expect(
      formatOwnerSecondaryName({
        fullName: "Asha Kimani",
        companyName: "Pinetree Holdings Ltd",
      }),
    ).toBe("Asha Kimani");
  });

  it("returns null when company is absent", () => {
    expect(
      formatOwnerSecondaryName({
        fullName: "Asha Kimani",
        companyName: null,
      }),
    ).toBeNull();
  });
});

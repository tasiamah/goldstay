import { describe, expect, it } from "vitest";
import { defaultAgreementTerms, namesPlausiblyMatch } from "./defaults";

describe("defaultAgreementTerms", () => {
  it("uses 20% / 60-day notice / KES 75k floor for Kenyan short-term", () => {
    const t = defaultAgreementTerms({
      country: "KE",
      propertyType: "SHORT_TERM",
    });
    expect(t.termMonths).toBe(12);
    expect(t.commissionRate).toBe(0.2);
    expect(t.earlyExitFee).toBe(75_000);
    expect(t.earlyExitFeeCurrency).toBe("KES");
    expect(t.noticePeriodDays).toBe(60);
    expect(t.governingLaw).toBe("Kenya");
  });

  it("uses 10% / 90-day notice / KES 50k floor for Kenyan long-term", () => {
    const t = defaultAgreementTerms({
      country: "KE",
      propertyType: "LONG_TERM",
    });
    expect(t.commissionRate).toBe(0.1);
    expect(t.earlyExitFee).toBe(50_000);
    expect(t.noticePeriodDays).toBe(90);
  });

  it("switches to GHS / Ghana law for Ghanaian properties", () => {
    const t = defaultAgreementTerms({
      country: "GH",
      propertyType: "SHORT_TERM",
    });
    expect(t.earlyExitFeeCurrency).toBe("GHS");
    expect(t.governingLaw).toBe("Ghana");
    expect(t.earlyExitFee).toBe(7_500);
  });
});

describe("namesPlausiblyMatch", () => {
  it("accepts an exact match", () => {
    expect(namesPlausiblyMatch("Jane Doe", "Jane Doe")).toBe(true);
  });

  it("is case and whitespace insensitive", () => {
    expect(namesPlausiblyMatch("  jane   doe ", "Jane Doe")).toBe(true);
    expect(namesPlausiblyMatch("JANE DOE", "Jane Doe")).toBe(true);
  });

  it("accepts middle-name omission or addition either way", () => {
    expect(namesPlausiblyMatch("Jane Doe", "Jane Margaret Doe")).toBe(true);
    expect(namesPlausiblyMatch("Jane Margaret Doe", "Jane Doe")).toBe(true);
  });

  it("rejects a single-name signature when the record has more", () => {
    expect(namesPlausiblyMatch("Jane", "Jane Doe")).toBe(false);
  });

  it("rejects a clearly different name", () => {
    expect(namesPlausiblyMatch("John Doe", "Jane Doe")).toBe(false);
  });

  it("rejects empty input", () => {
    expect(namesPlausiblyMatch("", "Jane Doe")).toBe(false);
    expect(namesPlausiblyMatch("Jane Doe", "")).toBe(false);
  });

  it("ignores punctuation differences", () => {
    expect(namesPlausiblyMatch("Jane O'Connor", "Jane OConnor")).toBe(true);
  });
});

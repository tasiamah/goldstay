import { describe, expect, it } from "vitest";
import { defaultAgreementTerms, namesPlausiblyMatch } from "./defaults";

// Management-agreement defaults. Wrong numbers here are printed onto a
// signed PDF so the failure mode is "we offered the wrong commission
// rate to a customer". Two scenarios cover the entire decision tree:
// short-term Kenya (the highest-fee path) and long-term Ghana (the
// other currency + governing law).
describe("defaultAgreementTerms", () => {
  it("matches the published rate card for KE short-term and GH long-term", () => {
    const ke = defaultAgreementTerms({ country: "KE", propertyType: "SHORT_TERM" });
    expect(ke).toMatchObject({
      commissionRate: 0.2,
      earlyExitFee: 75_000,
      earlyExitFeeCurrency: "KES",
      noticePeriodDays: 60,
      governingLaw: "Kenya",
    });

    const gh = defaultAgreementTerms({ country: "GH", propertyType: "LONG_TERM" });
    expect(gh).toMatchObject({
      commissionRate: 0.1,
      earlyExitFeeCurrency: "GHS",
      governingLaw: "Ghana",
    });
  });
});

// Signature name matcher. Used to decide whether the typed signature
// at the bottom of the PDF actually matches the named signatory.
// False positives let someone sign as another party; false negatives
// block a legitimate signing. Both sides matter.
describe("namesPlausiblyMatch", () => {
  it("accepts case / whitespace / punctuation / middle-name diffs and rejects clear mismatches", () => {
    expect(namesPlausiblyMatch("  jane   doe ", "Jane Doe")).toBe(true);
    expect(namesPlausiblyMatch("Jane O'Connor", "Jane OConnor")).toBe(true);
    expect(namesPlausiblyMatch("Jane Doe", "Jane Margaret Doe")).toBe(true);
    expect(namesPlausiblyMatch("Jane", "Jane Doe")).toBe(false);
    expect(namesPlausiblyMatch("John Doe", "Jane Doe")).toBe(false);
    expect(namesPlausiblyMatch("", "Jane Doe")).toBe(false);
  });
});

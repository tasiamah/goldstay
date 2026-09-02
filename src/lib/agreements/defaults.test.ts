import { describe, expect, it } from "vitest";
import { defaultAgreementTerms } from "./defaults";

// Management-agreement defaults. Wrong numbers here are printed onto a
// signed PDF so the failure mode is "we offered the wrong commission
// rate to a customer". Three scenarios cover the decision tree: the
// Kenyan short-let contract (its own term/notice/exit rules), Kenyan
// long-term and Ghanaian short-term (both on the generic contract, so
// they prove the short-let branch doesn't leak).
describe("defaultAgreementTerms", () => {
  it("applies the short-let agreement's own terms to KE short-term", () => {
    const ke = defaultAgreementTerms({
      country: "KE",
      propertyType: "SHORT_TERM",
      forecastMonthlyFee: 90_000,
    });
    expect(ke).toEqual({
      // Clause 10.1: three full calendar months from the Launch Date.
      termMonths: 3,
      commissionRate: 0.2,
      // Clause 10.3 caps the Early Termination Amount at one Forecast
      // Monthly Management Fee, so that's the stored worst case.
      earlyExitFee: 90_000,
      earlyExitFeeCurrency: "KES",
      // Clause 10.2: 30 days after the Initial Commitment Period.
      noticePeriodDays: 30,
      governingLaw: "Kenya",
    });
  });

  it("stores a zero exit cap when no forecast fee has been set", () => {
    // A property can be verified before anyone estimates a monthly
    // fee. Limb (b) of clause 10.3 then yields nothing, and inventing
    // a number here would overstate what we could actually charge.
    const ke = defaultAgreementTerms({
      country: "KE",
      propertyType: "SHORT_TERM",
    });
    expect(ke.earlyExitFee).toBe(0);
    expect(ke.termMonths).toBe(3);
  });

  it("keeps the generic contract's rate card everywhere else", () => {
    // Kenya, but long-term: the short-let contract does not apply.
    const keLong = defaultAgreementTerms({
      country: "KE",
      propertyType: "LONG_TERM",
    });
    expect(keLong).toMatchObject({
      termMonths: 12,
      commissionRate: 0.1,
      earlyExitFee: 50_000,
      earlyExitFeeCurrency: "KES",
      noticePeriodDays: 90,
      governingLaw: "Kenya",
    });

    // Short-term, but Ghana: likewise the generic contract, because
    // the short-let agreement is written to Kenyan law.
    const ghShort = defaultAgreementTerms({
      country: "GH",
      propertyType: "SHORT_TERM",
    });
    expect(ghShort).toMatchObject({
      termMonths: 12,
      commissionRate: 0.2,
      earlyExitFee: 7_500,
      earlyExitFeeCurrency: "GHS",
      noticePeriodDays: 60,
      governingLaw: "Ghana",
    });
  });
});

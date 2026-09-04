import { describe, expect, it } from "vitest";
import { defaultAgreementTerms } from "./defaults";

// Management-agreement defaults. Wrong numbers here are printed onto a
// signed PDF so the failure mode is "we offered the wrong commission
// rate to a customer". The decision tree has three branches: each
// Kenyan contract carries its own term/notice/exit rules, and Ghana
// falls through to the generic rate card. Only the generic contract
// still has a real early-exit fee; both Kenyan ones charge nothing to
// leave, for different reasons.
describe("defaultAgreementTerms", () => {
  it("applies the short-let agreement's own terms to KE short-term", () => {
    const ke = defaultAgreementTerms({
      country: "KE",
      propertyType: "SHORT_TERM",
    });
    expect(ke).toEqual({
      // Clause 10.1: three full calendar months from the Launch Date.
      termMonths: 3,
      commissionRate: 0.2,
      // Clause 10.3 sets the Early Termination Amount at unrecovered
      // Startup Costs, which aren't known at issue. Any number here
      // would claim we can charge something the contract doesn't
      // entitle us to.
      earlyExitFee: 0,
      earlyExitFeeCurrency: "KES",
      // Clause 10.2: 30 days after the Initial Commitment Period.
      noticePeriodDays: 30,
      governingLaw: "Kenya",
    });
  });

  it("applies the long-term agreement's own terms to KE long-term", () => {
    const ke = defaultAgreementTerms({
      country: "KE",
      propertyType: "LONG_TERM",
    });
    expect(ke).toEqual({
      // No minimum term. The service sheet sells "no lock-in", so the
      // generic 12 months must not leak in here.
      termMonths: 1,
      commissionRate: 0.1,
      // "No exit fee" is the term itself, not a figure we haven't
      // worked out yet.
      earlyExitFee: 0,
      earlyExitFeeCurrency: "KES",
      // The published promise is a 30-day exit. The generic 90 days
      // would break it.
      noticePeriodDays: 30,
      governingLaw: "Kenya",
    });
  });

  it("keeps the generic contract's rate card for Ghana", () => {
    // Short-term, but Ghana: the generic contract, because both
    // Kenyan agreements are written to Kenyan law.
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

    const ghLong = defaultAgreementTerms({
      country: "GH",
      propertyType: "LONG_TERM",
    });
    expect(ghLong).toMatchObject({
      termMonths: 12,
      commissionRate: 0.1,
      earlyExitFee: 5_000,
      earlyExitFeeCurrency: "GHS",
      noticePeriodDays: 90,
      governingLaw: "Ghana",
    });
  });
});

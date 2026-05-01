import { describe, expect, it } from "vitest";
import { computeSetupChecklist } from "./setup-status";

// computeSetupChecklist drives both the visible checklist on
// /owner/payouts and the dashboard "finish setup" callout. The risk
// that matters: a step is marked done while the underlying data is
// still missing → the owner thinks they're cleared and we hit a
// silent failure at the first payout. We guard the non-obvious gates:
//   * a single-token name / missing phone / missing address all fail Details
//   * a COMPANY-mode owner with no companyName fails Details
//   * an INDIVIDUAL-mode owner doesn't need companyName for Details
//   * a payout method with no proof-of-account doesn't satisfy Bank

const baseInput = {
  owner: {
    fullName: "Asha Kimani",
    phone: "+254712345678",
    address: "Riverside Drive, Westlands, Nairobi",
    entityType: "INDIVIDUAL" as const,
    companyName: null,
  },
  hasIdDocument: true,
  hasProofOfAccount: true,
  payoutMethodCount: 1,
};

describe("computeSetupChecklist", () => {
  it("treats a complete individual owner as 3 of 3 with no firstIncomplete", () => {
    const c = computeSetupChecklist(baseInput);
    expect(c.totalCount).toBe(3);
    expect(c.doneCount).toBe(3);
    expect(c.firstIncomplete).toBeNull();
  });

  it("rejects a single-token name, a phone-less owner, or a missing address on Details", () => {
    expect(
      computeSetupChecklist({
        ...baseInput,
        owner: { ...baseInput.owner, fullName: "Asha" },
      }).firstIncomplete,
    ).toBe("details");
    expect(
      computeSetupChecklist({
        ...baseInput,
        owner: { ...baseInput.owner, phone: "" },
      }).firstIncomplete,
    ).toBe("details");
    expect(
      computeSetupChecklist({
        ...baseInput,
        owner: { ...baseInput.owner, address: null },
      }).firstIncomplete,
    ).toBe("details");
  });

  it("requires companyName on Details when entityType is COMPANY", () => {
    expect(
      computeSetupChecklist({
        ...baseInput,
        owner: {
          ...baseInput.owner,
          entityType: "COMPANY",
          companyName: null,
        },
      }).firstIncomplete,
    ).toBe("details");
    // companyRegistrationNumber is intentionally not in SetupInput; even
    // if absent, COMPANY mode with companyName set should mark Details done.
    expect(
      computeSetupChecklist({
        ...baseInput,
        owner: {
          ...baseInput.owner,
          entityType: "COMPANY",
          companyName: "Pinetree Holdings Ltd",
        },
      }).firstIncomplete,
    ).toBeNull();
  });

  it("does not require companyName on Details when entityType is INDIVIDUAL", () => {
    expect(
      computeSetupChecklist({
        ...baseInput,
        owner: {
          ...baseInput.owner,
          entityType: "INDIVIDUAL",
          companyName: null,
        },
      }).firstIncomplete,
    ).toBeNull();
  });

  it("requires both a payout method and a proof-of-account doc on Bank", () => {
    expect(
      computeSetupChecklist({ ...baseInput, payoutMethodCount: 0 })
        .firstIncomplete,
    ).toBe("bank");
    expect(
      computeSetupChecklist({ ...baseInput, hasProofOfAccount: false })
        .firstIncomplete,
    ).toBe("bank");
  });
});

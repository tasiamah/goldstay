import { describe, expect, it } from "vitest";
import { computeSetupChecklist } from "./setup-status";

// computeSetupChecklist drives both the visible checklist on
// /owner/payouts and the dashboard "finish setup" callout. The risk
// that matters: a step is marked done while the underlying data is
// still missing → the owner thinks they're cleared and we hit a
// silent failure at the first payout. We guard the two non-obvious
// gates: a single-token name doesn't satisfy Personal, and a payout
// method with no proof-of-account doesn't satisfy Bank.

const baseInput = {
  owner: {
    fullName: "Asha Kimani",
    phone: "+254712345678",
    companyName: "Pinetree Holdings Ltd",
  },
  hasIdDocument: true,
  hasProofOfAccount: true,
  payoutMethodCount: 1,
};

describe("computeSetupChecklist", () => {
  it("treats a complete owner as 4 of 4 with no firstIncomplete", () => {
    const c = computeSetupChecklist(baseInput);
    expect(c.doneCount).toBe(4);
    expect(c.firstIncomplete).toBeNull();
  });

  it("rejects a single-token name and a phone-less owner on Personal", () => {
    expect(
      computeSetupChecklist({
        ...baseInput,
        owner: { ...baseInput.owner, fullName: "Asha" },
      }).firstIncomplete,
    ).toBe("personal");
    expect(
      computeSetupChecklist({
        ...baseInput,
        owner: { ...baseInput.owner, phone: "" },
      }).firstIncomplete,
    ).toBe("personal");
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

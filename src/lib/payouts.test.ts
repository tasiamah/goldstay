import { describe, expect, it } from "vitest";
import type { OwnerPayoutMethod } from "@prisma/client";
import { summarisePayoutMethod } from "./payouts";

function makeMethod(
  overrides: Partial<OwnerPayoutMethod> = {},
): OwnerPayoutMethod {
  return {
    id: "p_1",
    ownerId: "o_1",
    kind: "LOCAL_BANK",
    label: "KCB Westlands",
    currency: "KES",
    beneficiaryName: "Asha Kimani",
    bankName: "KCB Bank",
    bankCountry: "KE",
    branchCode: null,
    accountNumber: "1234567890",
    iban: null,
    swift: null,
    wiseEmail: null,
    mpesaPhone: null,
    beneficiaryAddress: null,
    internalNotes: null,
    isDefault: true,
    verifiedAt: null,
    verifiedByAdminId: null,
    archivedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

// summarisePayoutMethod renders the human label that appears in the
// admin "send payout" dialog. The bug class that matters: leaking the
// full bank account number into the UI / audit log. Also covered:
// each non-bank kind picks the right identifier so ops doesn't wire
// money to the wrong rail.

describe("summarisePayoutMethod", () => {
  it("masks bank tails to last 4, falls back to IBAN, and renders Wise / M-Pesa with their identifier", () => {
    expect(summarisePayoutMethod(makeMethod())).toBe(
      "KCB Bank · KES · …7890",
    );
    expect(
      summarisePayoutMethod(
        makeMethod({
          kind: "SWIFT_BANK",
          accountNumber: null,
          iban: "GB29NWBK60161331926819",
          bankName: "NatWest",
          currency: "GBP",
        }),
      ),
    ).toBe("NatWest · GBP · …6819");
    expect(
      summarisePayoutMethod(
        makeMethod({
          kind: "WISE",
          wiseEmail: "asha@example.com",
          currency: "USD",
        }),
      ),
    ).toBe("Wise · asha@example.com (USD)");
    expect(
      summarisePayoutMethod(
        makeMethod({ kind: "MPESA", mpesaPhone: "254712345678" }),
      ),
    ).toBe("M-Pesa · 254712345678");
  });
});

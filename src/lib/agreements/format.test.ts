import { describe, expect, it } from "vitest";
import {
  agreementTermSummary,
  formatCommissionPct,
  formatMoney,
} from "./format";

// agreementTermSummary is the headline the client reads before they
// click accept, and the same four figures are printed on the executed
// PDF. The columns behind it mean different things per contract, so
// the risk is a true number under a false label — "Term: 1 month" on a
// contract with no term, or "Early-exit fee: KES 0" on one that
// charges unrecovered costs to leave.
const base = {
  termMonths: 12,
  commissionPct: "10%",
  noticePeriodDays: 90,
  earlyExitFeeFormatted: "KES 50,000",
} as const;

describe("agreementTermSummary", () => {
  function labelled(
    template: Parameters<typeof agreementTermSummary>[0]["template"],
  ) {
    return Object.fromEntries(
      agreementTermSummary({ ...base, template }).map((t) => [
        t.label,
        t.value,
      ]),
    );
  }

  it("prints the generic contract's figures as they stand", () => {
    expect(labelled("GENERIC_MANAGEMENT_V1")).toEqual({
      Term: "12 months",
      Commission: "10%",
      "Notice period": "90 days",
      "Early-exit fee": "KES 50,000",
    });
  });

  it("names the basis of a short-let early exit instead of a figure", () => {
    // Clause 10.3 charges unrecovered Startup Costs, which aren't
    // known at issue. The row stores 0, and printing "KES 0" would
    // tell the client leaving is free.
    const summary = labelled("SHORT_LET_KE_V1");
    expect(summary["Early exit"]).toBe("Unrecovered startup costs");
    expect(summary["Minimum term"]).toBe("12 months");
    expect(summary).not.toHaveProperty("Early-exit fee");
  });

  it("says the long-term contract has no term and no exit fee", () => {
    // Here 0 really does mean free, and the term column is meaningless
    // — quoting it would contradict the no-lock-in promise.
    expect(labelled("LONG_LET_KE_V1")).toEqual({
      Term: "No minimum term",
      "Management fee": "10%",
      "Notice period": "90 days",
      "Early exit": "No exit fee",
    });
  });

  it("gives every template four terms", () => {
    // The PDF lays these out as a fixed four-column row.
    for (const template of [
      "GENERIC_MANAGEMENT_V1",
      "SHORT_LET_KE_V1",
      "LONG_LET_KE_V1",
    ] as const) {
      expect(agreementTermSummary({ ...base, template })).toHaveLength(4);
    }
  });
});

describe("formatters", () => {
  it("rounds a stored decimal rate to a percentage", () => {
    expect(formatCommissionPct("0.1")).toBe("10%");
    expect(formatCommissionPct(0.2)).toBe("20%");
  });

  it("says so rather than printing NaN for an unset figure", () => {
    expect(formatCommissionPct("nonsense")).toBe("Not set");
    expect(formatMoney("nonsense", "KES")).toBe("Not set");
  });

  it("groups thousands and drops the decimals", () => {
    expect(formatMoney("50000", "KES")).toBe("KES 50,000");
  });
});

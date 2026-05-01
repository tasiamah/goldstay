import { describe, expect, it } from "vitest";
import {
  aggregateTransactionsByCurrency,
  occupancyPercent,
} from "./owner-dashboard";

// Owner dashboard summariser. The two regressions that would hurt:
//   - net maths breaking on Prisma's Decimal-as-string serialisation
//     (would zero out a real payment), and
//   - occupancyPercent dividing by zero (would render NaN% to owners
//     with no units yet — embarrassing on day-one accounts).
// Sort and currency-separation are covered transitively below.

describe("aggregateTransactionsByCurrency", () => {
  it("nets per currency, sorts preferred to the top, and tolerates Decimal-as-string + nulls", () => {
    const out = aggregateTransactionsByCurrency(
      [
        { currency: "KES", direction: "INFLOW", amount: "100000.50" },
        { currency: "KES", direction: "INFLOW", amount: null },
        { currency: "KES", direction: "OUTFLOW", amount: 30_000 },
        { currency: "USD", direction: "INFLOW", amount: 1_500 },
        { currency: "", direction: "INFLOW", amount: 9_999 },
      ],
      "USD",
    );
    expect(out.map((r) => r.currency)).toEqual(["USD", "KES"]);
    const kes = out.find((r) => r.currency === "KES")!;
    expect(kes.inflow).toBe(100_000.5);
    expect(kes.net).toBe(70_000.5);
  });
});

describe("occupancyPercent", () => {
  it("avoids NaN% and rounds to integer", () => {
    expect(occupancyPercent({ totalUnits: 0, occupiedUnits: 0 })).toBeNull();
    expect(occupancyPercent({ totalUnits: 3, occupiedUnits: 2 })).toBe(67);
  });
});

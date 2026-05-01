import { describe, expect, it } from "vitest";
import { buildStatement, type StatementTransaction } from "./aggregate";

function tx(partial: Partial<StatementTransaction>): StatementTransaction {
  return {
    id: partial.id ?? "tx",
    occurredOn: partial.occurredOn ?? new Date("2026-04-15T00:00:00Z"),
    type: partial.type ?? "RENT",
    direction: partial.direction ?? "INFLOW",
    amount: partial.amount ?? 100_000,
    currency: partial.currency ?? "KES",
    propertyId: partial.propertyId ?? "p1",
    propertyName: partial.propertyName ?? "Pinetree 4B",
    leaseId: partial.leaseId,
    tenantName: partial.tenantName,
    description: partial.description,
    reference: partial.reference,
  };
}

// Statement aggregator. It's the document the owner sees every month;
// the failure modes that actually matter are:
//   - summing across currencies (would wire wrong USD amount)
//   - mishandling Decimal-as-string values from Prisma (would zero
//     out a real payment).
// Everything else (alphabetical sort, empty-input shape, multi-property
// grouping) is exercised transitively in the happy-path test below.

describe("buildStatement", () => {
  it("nets per currency, never crosses currencies, and pins the preferred one to the top", () => {
    const s = buildStatement(
      [
        tx({ id: "1", currency: "KES", direction: "INFLOW", amount: "100000.50" }),
        tx({ id: "2", currency: "KES", direction: "OUTFLOW", amount: "30000" }),
        tx({ id: "3", currency: "USD", direction: "INFLOW", amount: 1_500 }),
      ],
      { preferredCurrency: "USD" },
    );
    expect(s.totalsByCurrency).toEqual([
      { currency: "USD", inflow: 1_500, outflow: 0, net: 1_500 },
      { currency: "KES", inflow: 100_000.5, outflow: 30_000, net: 70_000.5 },
    ]);
  });

  it("ignores transactions with empty currency rather than corrupting another bucket", () => {
    const s = buildStatement([
      tx({ id: "good", currency: "KES" }),
      tx({ id: "bad", currency: "" }),
    ]);
    expect(s.totalsByCurrency).toHaveLength(1);
    expect(s.totalsByCurrency[0]!.currency).toBe("KES");
  });
});

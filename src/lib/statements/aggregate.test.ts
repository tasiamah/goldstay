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

describe("buildStatement", () => {
  it("returns an empty statement for no transactions", () => {
    const s = buildStatement([]);
    expect(s.transactionCount).toBe(0);
    expect(s.totalsByCurrency).toEqual([]);
    expect(s.propertyGroups).toEqual([]);
  });

  it("groups by property and aggregates inflow/outflow per currency", () => {
    const s = buildStatement([
      tx({ id: "1", direction: "INFLOW", amount: 100_000 }),
      tx({ id: "2", direction: "OUTFLOW", amount: 30_000 }),
    ]);
    expect(s.totalsByCurrency).toEqual([
      { currency: "KES", inflow: 100_000, outflow: 30_000, net: 70_000 },
    ]);
    expect(s.propertyGroups).toHaveLength(1);
  });

  it("sorts property groups alphabetically with their transactions chronological", () => {
    const s = buildStatement([
      tx({ id: "1", propertyId: "p1", propertyName: "Zebra", occurredOn: new Date("2026-04-20") }),
      tx({ id: "2", propertyId: "p1", propertyName: "Zebra", occurredOn: new Date("2026-04-05") }),
      tx({ id: "3", propertyId: "p2", propertyName: "Alpha" }),
    ]);
    expect(s.propertyGroups.map((g) => g.propertyName)).toEqual(["Alpha", "Zebra"]);
    const zebra = s.propertyGroups.find((g) => g.propertyName === "Zebra")!;
    expect(zebra.transactions.map((t) => t.id)).toEqual(["2", "1"]);
  });

  it("does not sum across currencies and pins the preferred currency to the top", () => {
    const s = buildStatement(
      [
        tx({ currency: "KES", amount: 100_000 }),
        tx({ currency: "USD", amount: 1_500 }),
      ],
      { preferredCurrency: "USD" },
    );
    expect(s.totalsByCurrency).toHaveLength(2);
    expect(s.totalsByCurrency[0].currency).toBe("USD");
  });

  it("coerces Decimal-as-string amounts that come straight from Prisma", () => {
    const s = buildStatement([
      tx({ amount: "100000.50" }),
      tx({ direction: "OUTFLOW", amount: "0.25" }),
    ]);
    expect(s.totalsByCurrency[0].inflow).toBe(100_000.5);
    expect(s.totalsByCurrency[0].outflow).toBe(0.25);
  });

  it("ignores transactions with empty currency rather than crashing", () => {
    const s = buildStatement([
      tx({ id: "good", currency: "KES" }),
      tx({ id: "bad", currency: "" }),
    ]);
    expect(s.totalsByCurrency).toHaveLength(1);
  });
});

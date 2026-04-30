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

  it("groups by property and aggregates per currency", () => {
    const s = buildStatement([
      tx({ id: "1", direction: "INFLOW", amount: 100_000 }),
      tx({ id: "2", direction: "OUTFLOW", amount: 30_000 }),
    ]);
    expect(s.transactionCount).toBe(2);
    expect(s.totalsByCurrency).toEqual([
      { currency: "KES", inflow: 100_000, outflow: 30_000, net: 70_000 },
    ]);
    expect(s.propertyGroups).toHaveLength(1);
    expect(s.propertyGroups[0].propertyName).toBe("Pinetree 4B");
  });

  it("keeps each property's transactions separate", () => {
    const s = buildStatement([
      tx({ id: "1", propertyId: "p1", propertyName: "Alpha" }),
      tx({ id: "2", propertyId: "p2", propertyName: "Beta" }),
    ]);
    expect(s.propertyGroups).toHaveLength(2);
    expect(s.propertyGroups[0].propertyName).toBe("Alpha");
    expect(s.propertyGroups[1].propertyName).toBe("Beta");
  });

  it("sorts property groups alphabetically", () => {
    const s = buildStatement([
      tx({ id: "1", propertyId: "p1", propertyName: "Zebra" }),
      tx({ id: "2", propertyId: "p2", propertyName: "Alpha" }),
    ]);
    expect(s.propertyGroups.map((g) => g.propertyName)).toEqual([
      "Alpha",
      "Zebra",
    ]);
  });

  it("sorts each property's transactions chronologically", () => {
    const s = buildStatement([
      tx({ id: "later", occurredOn: new Date("2026-04-20T00:00:00Z") }),
      tx({ id: "earlier", occurredOn: new Date("2026-04-05T00:00:00Z") }),
    ]);
    expect(s.propertyGroups[0].transactions.map((t) => t.id)).toEqual([
      "earlier",
      "later",
    ]);
  });

  it("does not sum across currencies", () => {
    const s = buildStatement([
      tx({ id: "1", currency: "KES", amount: 100_000 }),
      tx({ id: "2", currency: "USD", amount: 1_500 }),
    ]);
    expect(s.totalsByCurrency).toHaveLength(2);
  });

  it("sorts the preferred currency to the top", () => {
    const s = buildStatement(
      [
        tx({ id: "1", currency: "KES", amount: 100_000 }),
        tx({ id: "2", currency: "USD", amount: 1_500 }),
      ],
      { preferredCurrency: "USD" },
    );
    expect(s.totalsByCurrency[0].currency).toBe("USD");
  });

  it("coerces Decimal-as-string amounts", () => {
    const s = buildStatement([
      tx({ id: "1", amount: "100000.50" }),
      tx({ id: "2", direction: "OUTFLOW", amount: "0.25" }),
    ]);
    expect(s.totalsByCurrency[0].inflow).toBe(100_000.5);
    expect(s.totalsByCurrency[0].outflow).toBe(0.25);
  });

  it("ignores transactions with empty currency", () => {
    const s = buildStatement([
      tx({ id: "good", currency: "KES" }),
      tx({ id: "bad", currency: "" }),
    ]);
    expect(s.totalsByCurrency).toHaveLength(1);
    expect(s.totalsByCurrency[0].currency).toBe("KES");
  });
});

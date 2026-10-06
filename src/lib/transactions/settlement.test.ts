import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  EXCLUDE_SETTLEMENTS,
  isSettlement,
  SETTLEMENT_TYPES,
} from "./settlement";

describe("settlement types", () => {
  it("treats a payout as a settlement and a cost as not one", () => {
    expect(isSettlement("PAYOUT")).toBe(true);
    for (const t of ["RENT", "REPAIR", "UTILITIES", "EXPENSE"] as const) {
      expect(isSettlement(t)).toBe(false);
    }
  });

  it("produces a Prisma fragment that excludes rather than selects", () => {
    // A `notIn` that was accidentally an `in` would show nothing but
    // payouts, which is a loud failure. The dangerous typo is the
    // fragment being empty, which fails silently and is what this
    // pins.
    expect(EXCLUDE_SETTLEMENTS).toEqual({ type: { notIn: ["PAYOUT"] } });
    expect(SETTLEMENT_TYPES.length).toBeGreaterThan(0);
  });
});

// The bug this guards was not a wrong filter, it was four independent
// queries that each had to remember the same rule and three of which
// were written before any payout existed. A unit test of the helper
// would not have caught it, so this asserts the callers.
describe("every client-facing earnings query excludes settlements", () => {
  const root = join(__dirname, "..", "..");

  // Screens that add transactions up into a figure a client or an
  // operator reads as earnings, profit or cost.
  const MUST_EXCLUDE = [
    "app/(platform)/client/page.tsx",
    "app/(platform)/client/statements/page.tsx",
    "components/admin/finance/PropertyCostsCard.tsx",
    "lib/statements/assemble.ts",
  ];

  for (const rel of MUST_EXCLUDE) {
    it(`${rel} filters settlements out`, () => {
      const src = readFileSync(join(root, rel), "utf8");
      const guarded =
        src.includes("EXCLUDE_SETTLEMENTS") || src.includes("isSettlement");
      expect(guarded).toBe(true);
    });
  }

  it("counts how many transaction queries exist in those files", () => {
    // If someone adds a fifth query to one of these screens, the
    // count moves and this test asks them to decide whether the new
    // query needs the filter rather than letting it default to
    // including payouts.
    const counts = MUST_EXCLUDE.map((rel) => {
      const src = readFileSync(join(root, rel), "utf8");
      return (src.match(/transaction\.findMany|transaction\.count/g) ?? [])
        .length;
    });
    expect(counts).toEqual([2, 3, 1, 1]);
  });
});

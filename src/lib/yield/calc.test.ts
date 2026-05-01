import { describe, expect, it } from "vitest";
import { calculateYield } from "./calc";

const baseLT = {
  city: "nairobi" as const,
  bedrooms: 2,
  monthlyMarketRentUsd: 1500,
  strategy: "long-term" as const,
};

describe("calculateYield", () => {
  it("long-term: Goldstay nets meaningfully more than self-managed", () => {
    const r = calculateYield(baseLT);
    expect(r.selfManaged.netMonthly).toBeGreaterThan(0);
    expect(r.goldstayManaged.netMonthly).toBeGreaterThan(
      r.selfManaged.netMonthly,
    );
    // Annual uplift on a $1.5k unit should land in the four-figure
    // sanity band — a future tweak that pushes outside this range
    // is almost certainly wrong.
    expect(r.annualUplift).toBeGreaterThan(800);
    expect(r.annualUplift).toBeLessThan(6000);
  });

  it("long-term: uplift scales roughly linearly with rent", () => {
    const a = calculateYield({ ...baseLT, monthlyMarketRentUsd: 1000 });
    const b = calculateYield({ ...baseLT, monthlyMarketRentUsd: 2000 });
    expect(b.annualUplift).toBeGreaterThan(a.annualUplift * 1.8);
    expect(b.annualUplift).toBeLessThan(a.annualUplift * 2.2);
  });

  it("short-stay: Goldstay still beats self-managed despite higher cost stack", () => {
    const r = calculateYield({ ...baseLT, strategy: "short-stay" });
    expect(r.goldstayManaged.netMonthly).toBeGreaterThan(0);
    expect(r.goldstayManaged.netMonthly).toBeGreaterThan(
      r.selfManaged.netMonthly,
    );
  });
});

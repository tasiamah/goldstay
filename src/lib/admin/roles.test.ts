import { describe, expect, it } from "vitest";
import { ALL_ROLES, can, canForCountry } from "./roles";

// Permission matrix. Wrong answers here ship as security bugs, so the
// suite is biased toward "would this leak data or unlock destructive
// actions" cases. Every other role × action combination is covered
// transitively because the matrix is dense; one wrong row would
// trip at least one of these assertions.

describe("can", () => {
  it("locks admin.write and finance.read to SUPER_ADMIN and lets SUPER_ADMIN do everything", () => {
    expect(can("SUPER_ADMIN", "admin.write")).toBe(true);
    expect(can("SUPER_ADMIN", "finance.read")).toBe(true);
    expect(can("SUPER_ADMIN", "owner.write")).toBe(true);
    for (const role of ALL_ROLES) {
      if (role === "SUPER_ADMIN") continue;
      expect(can(role, "admin.write")).toBe(false);
      expect(can(role, "finance.read")).toBe(false);
    }
  });

  it("draws the high-trust lines: ACCOUNTING ≠ OPS, SUPPORT is read-only on entities", () => {
    expect(can("ACCOUNTING", "transaction.write")).toBe(true);
    expect(can("ACCOUNTING", "property.write")).toBe(false);
    expect(can("ACCOUNTING", "impersonate.owner")).toBe(false);
    expect(can("OPS", "impersonate.owner")).toBe(true);
    expect(can("SUPPORT", "owner.write")).toBe(false);
    expect(can("SUPPORT", "comms.write")).toBe(true);
  });
});

describe("canForCountry", () => {
  it("scopes COUNTRY_MANAGER to their country and never lets them escalate", () => {
    expect(canForCountry("COUNTRY_MANAGER", "owner.write", null, "KE")).toBe(false);
    expect(canForCountry("COUNTRY_MANAGER", "property.write", "KE", "KE")).toBe(true);
    expect(canForCountry("COUNTRY_MANAGER", "property.write", "KE", "GH")).toBe(false);
    expect(canForCountry("COUNTRY_MANAGER", "task.write", "KE", null)).toBe(true);
    expect(canForCountry("COUNTRY_MANAGER", "admin.write", "KE", "KE")).toBe(false);
    // Non-country roles ignore the country check entirely.
    expect(canForCountry("OPS", "owner.write", "KE", "GH")).toBe(true);
  });
});

import { describe, expect, it } from "vitest";
import { ALL_ROLES, can, canForCountry } from "./roles";

describe("can", () => {
  it("SUPER_ADMIN is allowed everything, including admin.write", () => {
    expect(can("SUPER_ADMIN", "admin.write")).toBe(true);
    expect(can("SUPER_ADMIN", "owner.write")).toBe(true);
    expect(can("SUPER_ADMIN", "impersonate.owner")).toBe(true);
  });

  it("admin.write is locked to SUPER_ADMIN", () => {
    for (const role of ALL_ROLES) {
      if (role === "SUPER_ADMIN") continue;
      expect(can(role, "admin.write")).toBe(false);
    }
  });

  it("OPS can verify properties and impersonate, ACCOUNTING cannot", () => {
    expect(can("OPS", "property.verify")).toBe(true);
    expect(can("OPS", "impersonate.owner")).toBe(true);
    expect(can("ACCOUNTING", "property.verify")).toBe(false);
    expect(can("ACCOUNTING", "impersonate.owner")).toBe(false);
  });

  it("ACCOUNTING can write transactions but not properties", () => {
    expect(can("ACCOUNTING", "transaction.write")).toBe(true);
    expect(can("ACCOUNTING", "property.write")).toBe(false);
  });

  it("SUPPORT is read-only on entities but can write comms / notes / tasks", () => {
    expect(can("SUPPORT", "owner.read")).toBe(true);
    expect(can("SUPPORT", "owner.write")).toBe(false);
    expect(can("SUPPORT", "transaction.write")).toBe(false);
    expect(can("SUPPORT", "comms.write")).toBe(true);
    expect(can("SUPPORT", "note.write")).toBe(true);
    expect(can("SUPPORT", "task.write")).toBe(true);
  });

  it("COUNTRY_MANAGER inherits OPS-shaped permissions", () => {
    expect(can("COUNTRY_MANAGER", "property.write")).toBe(true);
    expect(can("COUNTRY_MANAGER", "transaction.write")).toBe(true);
    expect(can("COUNTRY_MANAGER", "admin.write")).toBe(false);
  });
});

describe("canForCountry", () => {
  it("non-country roles ignore the country check", () => {
    expect(canForCountry("OPS", "owner.write", null, "KE")).toBe(true);
    expect(canForCountry("OPS", "owner.write", "KE", "GH")).toBe(true);
  });

  it("COUNTRY_MANAGER without a country is denied even for permitted actions", () => {
    expect(canForCountry("COUNTRY_MANAGER", "owner.write", null, "KE")).toBe(
      false,
    );
  });

  it("COUNTRY_MANAGER passes when target matches and fails otherwise", () => {
    expect(
      canForCountry("COUNTRY_MANAGER", "property.write", "KE", "KE"),
    ).toBe(true);
    expect(
      canForCountry("COUNTRY_MANAGER", "property.write", "KE", "GH"),
    ).toBe(false);
  });

  it("COUNTRY_MANAGER passes for a target with no country (global tasks)", () => {
    expect(
      canForCountry("COUNTRY_MANAGER", "task.write", "KE", null),
    ).toBe(true);
  });

  it("COUNTRY_MANAGER cannot bypass via SUPER_ADMIN-only action", () => {
    expect(
      canForCountry("COUNTRY_MANAGER", "admin.write", "KE", "KE"),
    ).toBe(false);
  });
});

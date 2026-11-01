import { describe, expect, it } from "vitest";
import { PropertyType } from "@prisma/client";
import {
  isPropertyType,
  isPropertyTypeAvailableIn,
  PROPERTY_TYPE_FORM_LABEL,
  PROPERTY_TYPE_LABEL,
  PROPERTY_TYPE_ORDER,
} from "./property-type";
import {
  defaultCommissionRate,
  hasRecurringFee,
  LONG_TERM_COMMISSION_RATE,
  SHORT_TERM_COMMISSION_RATE,
} from "./commission";

// Adding a rental model is the kind of change that lands everywhere
// and gets finished almost everywhere. These assertions are the
// "almost" — the label maps and the ordering that a new enum value
// can be added to Prisma without, leaving a blank badge in the admin
// and a select the new model cannot be chosen from.

describe("property type labels", () => {
  it("covers every value Prisma knows about", () => {
    for (const type of Object.values(PropertyType)) {
      expect(PROPERTY_TYPE_LABEL[type]).toBeTruthy();
      expect(PROPERTY_TYPE_FORM_LABEL[type]).toBeTruthy();
      expect(PROPERTY_TYPE_ORDER).toContain(type);
    }
    expect(PROPERTY_TYPE_ORDER).toHaveLength(
      Object.values(PropertyType).length,
    );
  });

  it("names the price in the form label, because that is the choice", () => {
    expect(PROPERTY_TYPE_FORM_LABEL.LONG_TERM).toContain("10%");
    expect(PROPERTY_TYPE_FORM_LABEL.SHORT_TERM).toContain("20%");
    expect(PROPERTY_TYPE_FORM_LABEL.TENANT_FINDING).toContain(
      "one month's rent",
    );
  });

  it("recognises only real property types", () => {
    expect(isPropertyType("TENANT_FINDING")).toBe(true);
    expect(isPropertyType("LONG_TERM")).toBe(true);
    // The admin list filter parses this straight off the query
    // string, so a junk value must not reach a Prisma where clause.
    expect(isPropertyType("TENANT_FINDING; DROP TABLE")).toBe(false);
    expect(isPropertyType("")).toBe(false);
    expect(isPropertyType(null)).toBe(false);
  });
});

describe("market availability", () => {
  it("keeps tenant finding out of Ghana", () => {
    // TENANT_FINDING_KE_V1 is drafted against Kenyan law, and the
    // generic agreement Ghana falls back to is a management contract
    // that never mentions a placement-only scope.
    expect(isPropertyTypeAvailableIn("TENANT_FINDING", "GH")).toBe(false);
    expect(isPropertyTypeAvailableIn("TENANT_FINDING", "KE")).toBe(true);
  });

  it("leaves the two managed models available in both markets", () => {
    for (const country of ["KE", "GH"] as const) {
      expect(isPropertyTypeAvailableIn("LONG_TERM", country)).toBe(true);
      expect(isPropertyTypeAvailableIn("SHORT_TERM", country)).toBe(true);
    }
  });
});

describe("commission by rental model", () => {
  it("charges no recurring percentage on a tenant-finding property", () => {
    expect(defaultCommissionRate("TENANT_FINDING")).toBe(0);
    expect(hasRecurringFee("TENANT_FINDING")).toBe(false);
  });

  it("leaves the two managed rates alone", () => {
    expect(defaultCommissionRate("LONG_TERM")).toBe(LONG_TERM_COMMISSION_RATE);
    expect(defaultCommissionRate("SHORT_TERM")).toBe(
      SHORT_TERM_COMMISSION_RATE,
    );
    expect(hasRecurringFee("LONG_TERM")).toBe(true);
    expect(hasRecurringFee("SHORT_TERM")).toBe(true);
  });
});

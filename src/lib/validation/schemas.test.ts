import { describe, expect, it } from "vitest";
import {
  LeaseInput,
  OwnerInput,
  PropertyInput,
  TransactionInput,
  UnitInput,
} from "./schemas";

// Sentinel for tests that should always succeed; lets us assert on
// `data` without forcing a non-null type guard everywhere.
function unwrap<T>(
  parsed:
    | { success: true; data: T }
    | { success: false; error: { issues: unknown } },
): T {
  if (!parsed.success) {
    throw new Error(
      `expected parse to succeed, got: ${JSON.stringify(parsed.error.issues, null, 2)}`,
    );
  }
  return parsed.data;
}

describe("OwnerInput", () => {
  const valid = {
    email: "Hello@Goldstay.co.ke",
    fullName: "  Asha Kimani  ",
    phone: "  +254700000000 ",
    companyName: "",
    country: "KE",
    preferredCurrency: "usd",
  };

  it("normalises email to lowercase and trims the name", () => {
    const data = unwrap(OwnerInput.safeParse(valid));
    expect(data.email).toBe("hello@goldstay.co.ke");
    expect(data.fullName).toBe("Asha Kimani");
  });

  it("upper-cases the preferred currency", () => {
    const data = unwrap(OwnerInput.safeParse(valid));
    expect(data.preferredCurrency).toBe("USD");
  });

  it("treats empty optional strings as undefined, not empty", () => {
    const data = unwrap(OwnerInput.safeParse({ ...valid, companyName: "" }));
    expect(data.companyName).toBeUndefined();
  });

  it("rejects an invalid email address", () => {
    const result = OwnerInput.safeParse({ ...valid, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects a name that is too short", () => {
    const result = OwnerInput.safeParse({ ...valid, fullName: "A" });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown country", () => {
    const result = OwnerInput.safeParse({ ...valid, country: "ZW" });
    expect(result.success).toBe(false);
  });

  it("defaults preferredCurrency to USD when omitted", () => {
    const { preferredCurrency: _ignored, ...rest } = valid;
    const data = unwrap(OwnerInput.safeParse(rest));
    expect(data.preferredCurrency).toBe("USD");
  });

  it("rejects a 4-letter currency code", () => {
    const result = OwnerInput.safeParse({
      ...valid,
      preferredCurrency: "USDD",
    });
    expect(result.success).toBe(false);
  });
});

describe("PropertyInput", () => {
  const base = {
    ownerId: "cuid-owner-1",
    name: "Pinetree 4B",
    city: "Nairobi",
    address: "Pinetree Plaza, Kindaruma Road",
  };

  it("accepts the minimum required fields", () => {
    const data = unwrap(PropertyInput.safeParse(base));
    expect(data.ownerId).toBe("cuid-owner-1");
    expect(data.status).toBe("ONBOARDING");
  });

  it("treats an empty bedroom string as undefined", () => {
    const data = unwrap(PropertyInput.safeParse({ ...base, bedrooms: "" }));
    expect(data.bedrooms).toBeUndefined();
  });

  it("parses bedrooms as a non-negative integer", () => {
    const data = unwrap(PropertyInput.safeParse({ ...base, bedrooms: "3" }));
    expect(data.bedrooms).toBe(3);
  });

  it("rejects a negative bedroom count", () => {
    const result = PropertyInput.safeParse({ ...base, bedrooms: "-1" });
    expect(result.success).toBe(false);
  });

  it("rejects a non-numeric bedroom value", () => {
    const result = PropertyInput.safeParse({ ...base, bedrooms: "abc" });
    expect(result.success).toBe(false);
  });

  it("parses acquisitionPrice as a decimal", () => {
    const data = unwrap(
      PropertyInput.safeParse({ ...base, acquisitionPrice: "1234567.89" }),
    );
    expect(data.acquisitionPrice).toBe(1234567.89);
  });

  it("parses acquiredOn (YYYY-MM-DD) into a Date", () => {
    const data = unwrap(
      PropertyInput.safeParse({ ...base, acquiredOn: "2024-06-15" }),
    );
    expect(data.acquiredOn).toBeInstanceOf(Date);
    expect(data.acquiredOn?.getUTCFullYear()).toBe(2024);
  });

  it("treats an empty acquiredOn as undefined", () => {
    const data = unwrap(
      PropertyInput.safeParse({ ...base, acquiredOn: "" }),
    );
    expect(data.acquiredOn).toBeUndefined();
  });

  it("rejects a malformed acquiredOn", () => {
    const result = PropertyInput.safeParse({
      ...base,
      acquiredOn: "yesterday",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty address (below min length)", () => {
    const result = PropertyInput.safeParse({ ...base, address: "x" });
    expect(result.success).toBe(false);
  });

  it("rejects a missing ownerId", () => {
    const { ownerId: _ignored, ...rest } = base;
    const result = PropertyInput.safeParse(rest);
    expect(result.success).toBe(false);
  });
});

describe("UnitInput", () => {
  it("accepts a single-character label", () => {
    const data = unwrap(
      UnitInput.safeParse({ propertyId: "p1", label: "A" }),
    );
    expect(data.label).toBe("A");
    expect(data.status).toBe("VACANT");
  });

  it("rejects an empty label", () => {
    const result = UnitInput.safeParse({ propertyId: "p1", label: "" });
    expect(result.success).toBe(false);
  });
});

describe("LeaseInput", () => {
  const base = {
    unitId: "unit-1",
    tenantName: "Jane Doe",
    startDate: "2026-01-01",
    monthlyRent: "85000",
  };

  it("accepts the minimum required fields", () => {
    const data = unwrap(LeaseInput.safeParse(base));
    expect(data.tenantName).toBe("Jane Doe");
    expect(data.monthlyRent).toBe(85000);
    expect(data.startDate).toBeInstanceOf(Date);
    expect(data.currency).toBe("KES");
    expect(data.status).toBe("ACTIVE");
  });

  it("treats an empty tenantEmail as undefined (not invalid email)", () => {
    const data = unwrap(LeaseInput.safeParse({ ...base, tenantEmail: "" }));
    expect(data.tenantEmail).toBeUndefined();
  });

  it("rejects a non-empty but invalid tenantEmail", () => {
    const result = LeaseInput.safeParse({
      ...base,
      tenantEmail: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("upper-cases the currency", () => {
    const data = unwrap(LeaseInput.safeParse({ ...base, currency: "kes" }));
    expect(data.currency).toBe("KES");
  });

  it("rejects a missing startDate", () => {
    const { startDate: _ignored, ...rest } = base;
    const result = LeaseInput.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects a negative monthlyRent", () => {
    const result = LeaseInput.safeParse({ ...base, monthlyRent: "-1" });
    expect(result.success).toBe(false);
  });

  it("parses an optional endDate", () => {
    const data = unwrap(
      LeaseInput.safeParse({ ...base, endDate: "2026-12-31" }),
    );
    expect(data.endDate).toBeInstanceOf(Date);
  });
});

describe("TransactionInput", () => {
  const base = {
    propertyId: "prop-1",
    occurredOn: "2026-04-15",
    type: "RENT",
    direction: "INFLOW",
    amount: "85000",
  };

  it("accepts a valid rent inflow", () => {
    const data = unwrap(TransactionInput.safeParse(base));
    expect(data.amount).toBe(85000);
    expect(data.type).toBe("RENT");
    expect(data.direction).toBe("INFLOW");
  });

  it("rejects an unknown transaction type", () => {
    const result = TransactionInput.safeParse({ ...base, type: "BRIBERY" });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown direction", () => {
    const result = TransactionInput.safeParse({ ...base, direction: "SIDEWAYS" });
    expect(result.success).toBe(false);
  });

  it("treats an empty leaseId as undefined", () => {
    const data = unwrap(TransactionInput.safeParse({ ...base, leaseId: "" }));
    expect(data.leaseId).toBeUndefined();
  });

  it("requires occurredOn", () => {
    const { occurredOn: _ignored, ...rest } = base;
    const result = TransactionInput.safeParse(rest);
    expect(result.success).toBe(false);
  });
});

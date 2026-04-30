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

// Tests in this file focus on our preprocessor + transform layer:
// what we add ON TOP of Zod's built-ins. We don't re-test min(), max(),
// .email(), .enum() — Zod already covers those.

describe("OwnerInput", () => {
  const valid = {
    email: "Hello@Goldstay.co.ke",
    fullName: "  Asha Kimani  ",
    companyName: "",
    country: "KE",
    preferredCurrency: "usd",
  };

  it("normalises email to lowercase, trims name, upper-cases currency, defaults USD", () => {
    const data = unwrap(OwnerInput.safeParse(valid));
    expect(data.email).toBe("hello@goldstay.co.ke");
    expect(data.fullName).toBe("Asha Kimani");
    expect(data.preferredCurrency).toBe("USD");

    const { preferredCurrency: _ignored, ...withoutCurrency } = valid;
    const fallback = unwrap(OwnerInput.safeParse(withoutCurrency));
    expect(fallback.preferredCurrency).toBe("USD");
  });

  it("treats empty optional strings as undefined, not as empty strings", () => {
    // Critical: HTML form posts always send "" for unfilled fields.
    // If we let it through, optional fields become brittle "" comparisons.
    const data = unwrap(OwnerInput.safeParse({ ...valid, companyName: "" }));
    expect(data.companyName).toBeUndefined();
  });

  it("rejects an unknown country", () => {
    expect(OwnerInput.safeParse({ ...valid, country: "ZW" }).success).toBe(false);
  });
});

describe("PropertyInput", () => {
  const base = {
    ownerId: "cuid-owner-1",
    name: "Pinetree 4B",
    city: "Nairobi",
    address: "Pinetree Plaza, Kindaruma Road",
  };

  it("accepts the minimum required fields with sensible status default", () => {
    const data = unwrap(PropertyInput.safeParse(base));
    expect(data.status).toBe("ONBOARDING");
  });

  it("converts an empty bedroom string to undefined and a numeric string to an int", () => {
    expect(unwrap(PropertyInput.safeParse({ ...base, bedrooms: "" })).bedrooms).toBeUndefined();
    expect(unwrap(PropertyInput.safeParse({ ...base, bedrooms: "3" })).bedrooms).toBe(3);
  });

  it("parses acquisitionPrice as a decimal", () => {
    const data = unwrap(
      PropertyInput.safeParse({ ...base, acquisitionPrice: "1234567.89" }),
    );
    expect(data.acquisitionPrice).toBe(1234567.89);
  });
});

describe("UnitInput", () => {
  it("accepts a single-character label and defaults to VACANT", () => {
    const data = unwrap(UnitInput.safeParse({ propertyId: "p1", label: "A" }));
    expect(data.label).toBe("A");
    expect(data.status).toBe("VACANT");
  });
});

describe("LeaseInput", () => {
  const base = {
    unitId: "unit-1",
    tenantName: "Jane Doe",
    startDate: "2026-01-01",
    monthlyRent: "85000",
  };

  it("accepts the minimum required fields with sensible defaults", () => {
    const data = unwrap(LeaseInput.safeParse(base));
    expect(data.monthlyRent).toBe(85_000);
    expect(data.startDate).toBeInstanceOf(Date);
    expect(data.currency).toBe("KES");
    expect(data.status).toBe("ACTIVE");
  });

  it("treats empty tenantEmail as undefined (not as an invalid email)", () => {
    // Regression guard. Plain z.string().email().optional() rejects ""
    // because "" fails the email rule before optional() runs.
    const data = unwrap(LeaseInput.safeParse({ ...base, tenantEmail: "" }));
    expect(data.tenantEmail).toBeUndefined();
  });

  it("upper-cases the currency", () => {
    expect(unwrap(LeaseInput.safeParse({ ...base, currency: "kes" })).currency).toBe("KES");
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

  it("accepts a valid rent inflow with the amount coerced to a number", () => {
    const data = unwrap(TransactionInput.safeParse(base));
    expect(data.amount).toBe(85_000);
  });

  it("rejects an unknown transaction type", () => {
    expect(TransactionInput.safeParse({ ...base, type: "BRIBERY" }).success).toBe(false);
  });

  it("treats empty leaseId as undefined", () => {
    const data = unwrap(TransactionInput.safeParse({ ...base, leaseId: "" }));
    expect(data.leaseId).toBeUndefined();
  });
});

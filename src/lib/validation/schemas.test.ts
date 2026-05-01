import { describe, expect, it } from "vitest";
import {
  LeaseInput,
  OwnerInput,
  PropertyInput,
  TransactionInput,
} from "./schemas";

// Zod input schemas. We only test the preprocessor + transform layer
// we ADD on top of Zod's built-ins; .min() / .email() / .enum() are
// Zod's contract, not ours. The senior risks live in two places:
//
//   1. HTML form posts always send "" for unfilled optional fields.
//      If we accept "" as valid, optional becomes a brittle ""-vs-
//      undefined bug spread across consumers. Every public form
//      handler relies on these schemas to normalise empties out.
//   2. String → number coercion on monetary fields. A wrong cast
//      lands as a corrupted payment.

function unwrap<T>(
  parsed:
    | { success: true; data: T }
    | { success: false; error: { issues: unknown } },
): T {
  if (!parsed.success) {
    throw new Error(`expected parse to succeed: ${JSON.stringify(parsed.error.issues)}`);
  }
  return parsed.data;
}

describe("OwnerInput", () => {
  const valid = {
    email: "Hello@Goldstay.co.ke",
    fullName: "  Asha Kimani  ",
    companyName: "",
    country: "KE",
    preferredCurrency: "usd",
  };

  it("normalises email, name, currency, and turns empty optionals into undefined", () => {
    const data = unwrap(OwnerInput.safeParse(valid));
    expect(data.email).toBe("hello@goldstay.co.ke");
    expect(data.fullName).toBe("Asha Kimani");
    expect(data.preferredCurrency).toBe("USD");
    expect(data.companyName).toBeUndefined();
  });

  it("rejects unknown country and single-token / too-short names", () => {
    expect(OwnerInput.safeParse({ ...valid, country: "ZW" }).success).toBe(false);
    expect(OwnerInput.safeParse({ ...valid, fullName: "Asha" }).success).toBe(false);
    expect(OwnerInput.safeParse({ ...valid, fullName: "A Kimani" }).success).toBe(false);
  });
});

describe("PropertyInput + LeaseInput + TransactionInput", () => {
  it("coerces string monetary fields to numbers and treats empty optional strings as undefined", () => {
    // Monetary string → number. A bug here corrupts a real payment.
    const prop = unwrap(
      PropertyInput.safeParse({
        ownerId: "cuid-owner-1",
        name: "Pinetree 4B",
        city: "Nairobi",
        address: "Pinetree Plaza",
        bedrooms: "",
        acquisitionPrice: "1234567.89",
      }),
    );
    expect(prop.bedrooms).toBeUndefined();
    expect(prop.acquisitionPrice).toBe(1_234_567.89);
    expect(prop.status).toBe("ONBOARDING");

    // Empty tenantEmail is the canonical regression: plain
    // z.string().email().optional() rejects "" because email runs
    // before optional. Our preprocessor must short-circuit that.
    const lease = unwrap(
      LeaseInput.safeParse({
        unitId: "unit-1",
        tenantName: "Jane Doe",
        startDate: "2026-01-01",
        monthlyRent: "85000",
        tenantEmail: "",
        currency: "kes",
      }),
    );
    expect(lease.monthlyRent).toBe(85_000);
    expect(lease.tenantEmail).toBeUndefined();
    expect(lease.currency).toBe("KES");

    const txn = unwrap(
      TransactionInput.safeParse({
        propertyId: "prop-1",
        occurredOn: "2026-04-15",
        type: "RENT",
        direction: "INFLOW",
        amount: "85000",
        leaseId: "",
      }),
    );
    expect(txn.amount).toBe(85_000);
    expect(txn.leaseId).toBeUndefined();

    expect(
      TransactionInput.safeParse({
        propertyId: "prop-1",
        occurredOn: "2026-04-15",
        type: "BRIBERY",
        direction: "INFLOW",
        amount: "1",
      }).success,
    ).toBe(false);
  });
});

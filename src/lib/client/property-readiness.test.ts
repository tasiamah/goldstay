import { describe, expect, it } from "vitest";
import { computePropertyReadiness } from "./property-readiness";

// computePropertyReadiness drives the client-side property status
// badge and the per-property blocker list. Risks worth covering:
//
//   * an ACTIVE property must produce zero blockers, regardless of
//     other inputs (a live property must never look broken)
//   * an EXITED property must also produce zero blockers — there's
//     no "activation" to chase
//   * an ONBOARDING property with the agreement signed falls back to
//     "Goldstay review" so the client is never left guessing
//   * the account checklist must never appear as a property blocker,
//     because it does not gate the listing

describe("computePropertyReadiness", () => {
  it("returns no blockers for ACTIVE properties", () => {
    const r = computePropertyReadiness({
      propertyStatus: "ACTIVE",
      hasPendingAgreement: true,
    });
    expect(r.isActive).toBe(true);
    expect(r.blockers).toEqual([]);
  });

  it("returns no blockers for EXITED properties", () => {
    const r = computePropertyReadiness({
      propertyStatus: "EXITED",
      hasPendingAgreement: true,
    });
    expect(r.isActive).toBe(false);
    expect(r.blockers).toEqual([]);
  });

  it("blocks only on the unsigned agreement", () => {
    const r = computePropertyReadiness({
      propertyStatus: "ONBOARDING",
      hasPendingAgreement: true,
    });
    expect(r.blockers.map((b) => b.key)).toEqual(["agreement"]);
    expect(r.clientSideDone).toBe(false);
  });

  it("falls back to Goldstay review once the agreement is signed", () => {
    const r = computePropertyReadiness({
      propertyStatus: "ONBOARDING",
      hasPendingAgreement: false,
    });
    expect(r.blockers.map((b) => b.key)).toEqual(["goldstay_review"]);
    expect(r.clientSideDone).toBe(true);
  });

  it("never presents the account checklist as a property blocker", () => {
    // The regression this guards. Bank details and a KRA PIN are
    // needed to pay a client, not to let their property, and listing
    // them here told owners their empty flat was waiting on paperwork
    // that the admin gate has never once asked for.
    for (const hasPendingAgreement of [true, false]) {
      const r = computePropertyReadiness({
        propertyStatus: "ONBOARDING",
        hasPendingAgreement,
      });
      for (const b of r.blockers) {
        expect(b.key).not.toBe("setup");
        expect(b.label.toLowerCase()).not.toContain("account setup");
        expect(b.label.toLowerCase()).not.toContain("bank");
      }
    }
  });
});

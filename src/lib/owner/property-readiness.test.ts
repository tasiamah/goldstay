import { describe, expect, it } from "vitest";
import { computePropertyReadiness } from "./property-readiness";

// computePropertyReadiness drives the owner-side property status
// badge and the per-property blocker list. Risks worth covering:
//
//   * an ACTIVE property must produce zero blockers, regardless of
//     other inputs (a stuck setupComplete=false bit shouldn't make
//     a live property look broken)
//   * an EXITED property must also produce zero blockers — there's
//     no "activation" to chase
//   * an ONBOARDING property with everything owner-side done falls
//     back to "Goldstay review" so the owner is never left guessing
//   * blockers come back in the canonical order setup → agreement →
//     review so the UI can render them as a checklist

describe("computePropertyReadiness", () => {
  it("returns no blockers for ACTIVE properties even when setup is flagged incomplete", () => {
    const r = computePropertyReadiness({
      propertyStatus: "ACTIVE",
      hasPendingAgreement: true,
      setupComplete: false,
    });
    expect(r.isActive).toBe(true);
    expect(r.blockers).toEqual([]);
  });

  it("returns no blockers for EXITED properties", () => {
    const r = computePropertyReadiness({
      propertyStatus: "EXITED",
      hasPendingAgreement: true,
      setupComplete: false,
    });
    expect(r.isActive).toBe(false);
    expect(r.blockers).toEqual([]);
  });

  it("surfaces both owner-side blockers in canonical order", () => {
    const r = computePropertyReadiness({
      propertyStatus: "ONBOARDING",
      hasPendingAgreement: true,
      setupComplete: false,
    });
    expect(r.blockers.map((b) => b.key)).toEqual(["setup", "agreement"]);
    expect(r.ownerSideDone).toBe(false);
  });

  it("falls back to Goldstay review when the owner side is fully done", () => {
    const r = computePropertyReadiness({
      propertyStatus: "ONBOARDING",
      hasPendingAgreement: false,
      setupComplete: true,
    });
    expect(r.blockers.map((b) => b.key)).toEqual(["goldstay_review"]);
    expect(r.ownerSideDone).toBe(true);
  });

  it("only emits the setup row when setup is the lone blocker", () => {
    const r = computePropertyReadiness({
      propertyStatus: "ONBOARDING",
      hasPendingAgreement: false,
      setupComplete: false,
    });
    expect(r.blockers.map((b) => b.key)).toEqual(["setup"]);
    expect(r.ownerSideDone).toBe(false);
  });
});

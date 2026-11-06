import { describe, expect, it } from "vitest";

import {
  checkRentalModelChange,
  type RentalModelChangeInput,
} from "./rental-model-change";

// A quiet Kenyan property mid-onboarding: nothing let, nothing signed.
// Every test overrides only the fact it is about.
function input(
  over: Partial<RentalModelChangeInput> = {},
): RentalModelChangeInput {
  return {
    from: "LONG_TERM",
    to: "SHORT_TERM",
    country: "KE",
    bookingCount: 0,
    leaseCount: 0,
    agreementStage: "none",
    status: "ONBOARDING",
    ...over,
  };
}

function allow(over: Partial<RentalModelChangeInput> = {}): string[] {
  const result = checkRentalModelChange(input(over));
  if (!result.allowed) throw new Error(`expected allowed: ${result.reason}`);
  return result.consequences;
}

function refuse(over: Partial<RentalModelChangeInput> = {}): string {
  const result = checkRentalModelChange(input(over));
  if (result.allowed) throw new Error("expected refusal");
  return result.reason;
}

describe("what it refuses", () => {
  it("refuses a switch to the model it is already on", () => {
    expect(refuse({ from: "SHORT_TERM", to: "SHORT_TERM" })).toContain(
      "already",
    );
  });

  it("refuses tenant finding outside Kenya", () => {
    // Same rule the create form applies. The Ghanaian fallback is a
    // management contract that never describes a placement-only scope,
    // so offering it would issue a contract for a different service.
    expect(refuse({ to: "TENANT_FINDING", country: "GH" })).toContain(
      "not available in Ghana",
    );
  });

  it("allows tenant finding in Kenya", () => {
    expect(() => allow({ to: "TENANT_FINDING" })).not.toThrow();
  });

  it("allows the two managed models in Ghana", () => {
    expect(() =>
      allow({ from: "LONG_TERM", to: "SHORT_TERM", country: "GH" }),
    ).not.toThrow();
  });
});

describe("the agreement", () => {
  it("says a signed agreement will be superseded and re-accepted", () => {
    // The whole reason the model was locked. An operator must not be
    // able to switch a property without knowing the landlord's signed
    // contract stops describing it.
    const lines = allow({ agreementStage: "accepted" });
    expect(lines[0]).toContain("signed management agreement");
    expect(lines[0]).toContain("accept it again");
  });

  it("says an unaccepted agreement will be replaced", () => {
    const lines = allow({ agreementStage: "awaiting_acceptance" });
    expect(lines[0]).toContain("cancelled and replaced");
  });

  it("says nothing about agreements when there are none", () => {
    const lines = allow({ agreementStage: "none" });
    expect(lines.join(" ")).not.toContain("agreement the client");
  });

  it("leads with the agreement, because it is the line people skip", () => {
    const lines = allow({
      agreementStage: "accepted",
      from: "SHORT_TERM",
      to: "LONG_TERM",
      bookingCount: 9,
    });
    expect(lines[0]).toContain("signed management agreement");
  });
});

describe("history already on the property", () => {
  it("warns that bookings drop off statements when leaving short-let", () => {
    const lines = allow({
      from: "SHORT_TERM",
      to: "LONG_TERM",
      bookingCount: 9,
    });
    expect(lines.join(" ")).toContain("9 bookings stay on the property");
  });

  it("warns that rent stops being reported when leaving long-let", () => {
    const lines = allow({ from: "LONG_TERM", to: "SHORT_TERM", leaseCount: 2 });
    expect(lines.join(" ")).toContain("2 leases stay on the property");
  });

  it("stays singular for one booking", () => {
    const lines = allow({
      from: "SHORT_TERM",
      to: "LONG_TERM",
      bookingCount: 1,
    });
    expect(lines.join(" ")).toContain("1 booking stays");
  });

  it("says nothing about bookings on a property that never let", () => {
    const lines = allow({
      from: "SHORT_TERM",
      to: "LONG_TERM",
      bookingCount: 0,
    });
    expect(lines.join(" ")).not.toContain("bookings stay");
  });

  it("does not mention bookings when they are still the relevant model", () => {
    // Switching long-let to short-let: the bookings count is zero but
    // more importantly leaving LONG_TERM is what matters here.
    const lines = allow({
      from: "LONG_TERM",
      to: "SHORT_TERM",
      bookingCount: 4,
    });
    expect(lines.join(" ")).not.toContain("bookings stay");
  });
});

describe("what the money does", () => {
  it("spells out that tenant finding ends recurring commission", () => {
    const lines = allow({ to: "TENANT_FINDING" });
    expect(lines.join(" ")).toContain("No recurring commission");
    expect(lines.join(" ")).toContain("one month's rent");
  });

  it("quotes the rate that starts applying when leaving tenant finding", () => {
    expect(
      allow({ from: "TENANT_FINDING", to: "SHORT_TERM" }).join(" "),
    ).toContain("20% of revenue");
    expect(
      allow({ from: "TENANT_FINDING", to: "LONG_TERM" }).join(" "),
    ).toContain("10% of collected rent");
  });

  it("reminds them a short-let needs a listing id to ever report a stay", () => {
    expect(allow({ to: "SHORT_TERM" }).join(" ")).toContain(
      "Hostaway listing ID",
    );
  });
});

describe("a live property", () => {
  it("says it keeps earning rather than dropping back to onboarding", () => {
    // Demoting a live property would stop it letting, which is worse
    // than an unaccepted agreement the reminder job already chases.
    const lines = allow({ status: "ACTIVE", agreementStage: "accepted" });
    expect(lines.join(" ")).toContain("stays live and keeps earning");
  });

  it("says nothing about going live for an onboarding property", () => {
    expect(allow({ status: "ONBOARDING" }).join(" ")).not.toContain(
      "stays live",
    );
  });
});

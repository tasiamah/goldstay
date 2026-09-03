import { describe, expect, it } from "vitest";
import { decidePropertyGoLive } from "./go-live";

// The rule being protected: a property does not go live until the
// client has accepted its management agreement. Before this, marking
// a property verified flipped it to ACTIVE and issued the agreement
// in the same breath, so every property went live before anyone had
// agreed to anything.
describe("decidePropertyGoLive", () => {
  it("issues an agreement when the property has none", () => {
    // Only reachable for properties that predate agreements being
    // issued at creation. Without this they could never go live:
    // launching needs an acceptance and there is nothing to accept.
    expect(decidePropertyGoLive({ agreementStatuses: [] })).toEqual({
      kind: "issue_agreement",
    });
  });

  it("never goes live off the back of an issue", () => {
    // Issuing and going live in one click is exactly the bug this
    // module exists to prevent, so the recovery path above must not
    // double as a launch.
    expect(decidePropertyGoLive({ agreementStatuses: [] }).kind).not.toBe(
      "go_live",
    );
  });

  it("refuses to go live while the client has not accepted", () => {
    for (const status of ["DRAFT", "SENT"] as const) {
      const decision = decidePropertyGoLive({ agreementStatuses: [status] });
      expect(decision.kind).toBe("blocked");
    }
  });

  it("goes live once an agreement is signed", () => {
    expect(
      decidePropertyGoLive({ agreementStatuses: ["SIGNED"] }),
    ).toEqual({ kind: "go_live" });
  });

  it("lets a signed agreement win over a newer unsigned one", () => {
    // Re-issuing terms leaves the signed row in place next to a fresh
    // SENT one. A property that legitimately went live must not be
    // dragged back to onboarding because an admin regenerated
    // paperwork.
    expect(
      decidePropertyGoLive({ agreementStatuses: ["SENT", "SIGNED"] }).kind,
    ).toBe("go_live");
  });

  it("treats an empty list as no agreement, however it got that way", () => {
    // Callers filter CANCELLED out before calling: a withdrawn offer
    // is not a pending one and must not hold the property hostage.
    // If every agreement was cancelled we are back to issuing one.
    expect(decidePropertyGoLive({ agreementStatuses: [] }).kind).toBe(
      "issue_agreement",
    );
  });

  it("explains itself when it blocks", () => {
    const decision = decidePropertyGoLive({ agreementStatuses: ["SENT"] });
    // The reason is shown to an admin as a toast, so it has to say
    // what to do next rather than just refusing.
    expect(decision.kind === "blocked" && decision.reason).toMatch(
      /accepts its management agreement/i,
    );
  });
});

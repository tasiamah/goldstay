import { describe, expect, it } from "vitest";
import { decodeCookie, encodeCookie } from "./impersonation";

// Impersonation cookie codec. The senior risks: a malformed cookie
// must NEVER throw (it would 500 every owner page for a stale admin
// session), and a partial payload must not pass for a full one (the
// banner would render with undefined fields and look broken).

describe("impersonation cookie codec", () => {
  it("round-trips a valid payload, and returns null for garbage or partial input", () => {
    const payload = {
      ownerId: "own_123",
      ownerLabel: "Pinetree Holdings",
      adminEmail: "ted@goldstay.co.ke",
      startedAt: "2026-05-01T08:00:00.000Z",
    };
    expect(decodeCookie(encodeCookie(payload))).toEqual(payload);
    expect(decodeCookie("not-base64-json")).toBeNull();
    expect(
      decodeCookie(
        Buffer.from(JSON.stringify({ ownerId: "x" }), "utf8").toString("base64url"),
      ),
    ).toBeNull();
  });
});

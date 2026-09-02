import { describe, expect, it } from "vitest";
import { decodeCookie, encodeCookie } from "./impersonation";

// Impersonation cookie codec. The senior risks: a malformed cookie
// must NEVER throw (it would 500 every client page for a stale admin
// session), and a partial payload must not pass for a full one (the
// banner would render with undefined fields and look broken).

describe("impersonation cookie codec", () => {
  it("round-trips a valid payload, and returns null for garbage or partial input", () => {
    const payload = {
      clientId: "own_123",
      clientLabel: "Pinetree Holdings",
      adminEmail: "ted@goldstay.co.ke",
      startedAt: "2026-05-01T08:00:00.000Z",
    };
    expect(decodeCookie(encodeCookie(payload))).toEqual(payload);
    expect(decodeCookie("not-base64-json")).toBeNull();
    expect(
      decodeCookie(
        Buffer.from(JSON.stringify({ clientId: "x" }), "utf8").toString("base64url"),
      ),
    ).toBeNull();
  });

  // Cookies outlive a deploy. An admin who started impersonating
  // before the owner -> client rename holds a payload keyed ownerId /
  // ownerLabel; rejecting it would drop the banner while leaving them
  // signed in as the client, which is the one state this cookie exists
  // to make visible.
  it("accepts the pre-rename ownerId / ownerLabel payload", () => {
    const legacy = Buffer.from(
      JSON.stringify({
        ownerId: "own_123",
        ownerLabel: "Pinetree Holdings",
        adminEmail: "ted@goldstay.co.ke",
        startedAt: "2026-05-01T08:00:00.000Z",
      }),
      "utf8",
    ).toString("base64url");

    expect(decodeCookie(legacy)).toEqual({
      clientId: "own_123",
      clientLabel: "Pinetree Holdings",
      adminEmail: "ted@goldstay.co.ke",
      startedAt: "2026-05-01T08:00:00.000Z",
    });
  });

  it("still rejects a legacy payload missing its label", () => {
    const partial = Buffer.from(
      JSON.stringify({
        ownerId: "own_123",
        adminEmail: "ted@goldstay.co.ke",
        startedAt: "2026-05-01T08:00:00.000Z",
      }),
      "utf8",
    ).toString("base64url");

    expect(decodeCookie(partial)).toBeNull();
  });
});

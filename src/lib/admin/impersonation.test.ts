import { describe, expect, it } from "vitest";
import { decodeCookie, encodeCookie } from "./impersonation";

describe("impersonation cookie codec", () => {
  it("round-trips a valid payload", () => {
    const payload = {
      ownerId: "own_123",
      ownerLabel: "Pinetree Holdings",
      adminEmail: "ted@goldstay.co.ke",
      startedAt: "2026-05-01T08:00:00.000Z",
    };
    const encoded = encodeCookie(payload);
    expect(decodeCookie(encoded)).toEqual(payload);
  });

  it("returns null for garbage input", () => {
    expect(decodeCookie("not-base64-json")).toBeNull();
  });

  it("returns null when required fields are missing", () => {
    const partial = Buffer.from(JSON.stringify({ ownerId: "x" }), "utf8")
      .toString("base64url");
    expect(decodeCookie(partial)).toBeNull();
  });
});

import { describe, expect, it } from "vitest";
import {
  isPlausibleEmail,
  isPlausibleShareToken,
  normaliseRecipientEmail,
  SHARE_TTL_DAYS,
  shareExpiryFrom,
  shareUrl,
  shareUsability,
} from "./share";

// These guard the rules that decide whether a stranger holding a URL
// can read one of our clients' contracts. The persistence layer is
// thin enough to read; this is the part with actual decisions in it.

describe("shareUsability", () => {
  const future = new Date("2026-10-01T00:00:00Z");
  const now = new Date("2026-09-07T12:00:00Z");

  it("allows a share that has not expired and has not been revoked", () => {
    expect(
      shareUsability({ expiresAt: future, revokedAt: null }, now),
    ).toEqual({ usable: true });
  });

  it("refuses a revoked share", () => {
    expect(
      shareUsability(
        { expiresAt: future, revokedAt: new Date("2026-09-05T00:00:00Z") },
        now,
      ),
    ).toEqual({ usable: false, reason: "revoked" });
  });

  it("refuses an expired share", () => {
    expect(
      shareUsability(
        { expiresAt: new Date("2026-09-01T00:00:00Z"), revokedAt: null },
        now,
      ),
    ).toEqual({ usable: false, reason: "expired" });
  });

  // Revocation is the deliberate act, so it is the honest answer even
  // when the clock would also have closed the link.
  it("reports revoked ahead of expired when both are true", () => {
    expect(
      shareUsability(
        {
          expiresAt: new Date("2026-09-01T00:00:00Z"),
          revokedAt: new Date("2026-08-30T00:00:00Z"),
        },
        now,
      ),
    ).toEqual({ usable: false, reason: "revoked" });
  });

  // A share whose expiry is exactly now is over. Treating the boundary
  // as still-open would mean a revoked-at-expiry link works for one
  // more request, which is the wrong direction to round in.
  it("treats the expiry instant as already expired", () => {
    expect(
      shareUsability({ expiresAt: now, revokedAt: null }, now),
    ).toEqual({ usable: false, reason: "expired" });
  });
});

describe("shareExpiryFrom", () => {
  it("defaults to the documented TTL", () => {
    const now = new Date("2026-09-07T00:00:00Z");
    const expiry = shareExpiryFrom(now);
    const days = (expiry.getTime() - now.getTime()) / (24 * 60 * 60 * 1000);
    expect(days).toBe(SHARE_TTL_DAYS);
  });

  it("honours an explicit window", () => {
    const now = new Date("2026-09-07T00:00:00Z");
    expect(shareExpiryFrom(now, 1).toISOString()).toBe(
      "2026-09-08T00:00:00.000Z",
    );
  });
});

describe("isPlausibleShareToken", () => {
  it("accepts a real generated token shape", () => {
    // 43 chars, base64url, which is what 32 random bytes produce.
    expect(isPlausibleShareToken("a".repeat(43))).toBe(true);
    expect(isPlausibleShareToken("A-b_9".padEnd(43, "x"))).toBe(true);
  });

  it("rejects anything that cannot be one", () => {
    for (const bad of [
      undefined,
      null,
      42,
      "",
      "short",
      "x".repeat(31),
      "x".repeat(65),
      // The characters that would matter if this ever reached a query
      // or a filesystem rather than being rejected here.
      `${"x".repeat(40)}/../`,
      `${"x".repeat(40)}' OR 1=1`,
      `${"x".repeat(40)}%00`,
    ]) {
      expect(isPlausibleShareToken(bad), String(bad)).toBe(false);
    }
  });
});

describe("normaliseRecipientEmail", () => {
  // One recipient in the shared-with list, however it was typed.
  it("lowercases and trims so one address is one recipient", () => {
    expect(normaliseRecipientEmail("  Dangulu1@Gmail.COM ")).toBe(
      "dangulu1@gmail.com",
    );
  });
});

describe("isPlausibleEmail", () => {
  it("accepts ordinary addresses", () => {
    for (const good of [
      "dangulu1@gmail.com",
      "d.angulu@chambers.co.ke",
      "a+tag@example.org",
    ]) {
      expect(isPlausibleEmail(good), good).toBe(true);
    }
  });

  it("rejects the ways an operator actually fat-fingers it", () => {
    for (const bad of [
      "",
      "dangulu1",
      "dangulu1@",
      "@gmail.com",
      "dangulu1@gmail",
      "two addresses@example.com",
      "a@b@c.com",
    ]) {
      expect(isPlausibleEmail(bad), bad).toBe(false);
    }
  });
});

describe("shareUrl", () => {
  it("builds the public path", () => {
    expect(shareUrl("tok", "https://goldstay.co.ke")).toBe(
      "https://goldstay.co.ke/agreements/shared/tok",
    );
  });

  it("does not double the slash when the base carries one", () => {
    expect(shareUrl("tok", "https://goldstay.co.ke/")).toBe(
      "https://goldstay.co.ke/agreements/shared/tok",
    );
  });
});

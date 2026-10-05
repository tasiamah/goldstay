import { describe, expect, it } from "vitest";
import { verifyHostawayBasicAuth } from "./auth";

const USER = "goldstay-hook";
const PASSWORD = "s3cr3t-pair";

function basic(user: string, password: string, scheme = "Basic"): string {
  const encoded = Buffer.from(`${user}:${password}`, "utf8").toString("base64");
  return `${scheme} ${encoded}`;
}

describe("verifyHostawayBasicAuth", () => {
  it("accepts the configured pair, and is not case-sensitive about the scheme", () => {
    expect(verifyHostawayBasicAuth(basic(USER, PASSWORD), USER, PASSWORD)).toBe(
      true,
    );
    expect(
      verifyHostawayBasicAuth(basic(USER, PASSWORD, "basic"), USER, PASSWORD),
    ).toBe(true);
  });

  it("rejects a wrong password, a wrong user, and the two swapped", () => {
    expect(verifyHostawayBasicAuth(basic(USER, "wrong"), USER, PASSWORD)).toBe(
      false,
    );
    expect(
      verifyHostawayBasicAuth(basic("wrong", PASSWORD), USER, PASSWORD),
    ).toBe(false);
    expect(verifyHostawayBasicAuth(basic(PASSWORD, USER), USER, PASSWORD)).toBe(
      false,
    );
  });

  it("rejects a missing header and unconfigured credentials", () => {
    expect(verifyHostawayBasicAuth(null, USER, PASSWORD)).toBe(false);
    expect(verifyHostawayBasicAuth(basic(USER, PASSWORD), "", PASSWORD)).toBe(
      false,
    );
    expect(verifyHostawayBasicAuth(basic(USER, PASSWORD), USER, "")).toBe(
      false,
    );
  });

  it("rejects other schemes and malformed headers without throwing", () => {
    const encoded = Buffer.from(`${USER}:${PASSWORD}`, "utf8").toString(
      "base64",
    );
    expect(verifyHostawayBasicAuth(`Bearer ${encoded}`, USER, PASSWORD)).toBe(
      false,
    );
    // A bare credential with no scheme is not Basic auth.
    expect(verifyHostawayBasicAuth(encoded, USER, PASSWORD)).toBe(false);
    expect(verifyHostawayBasicAuth("Basic", USER, PASSWORD)).toBe(false);
    expect(verifyHostawayBasicAuth("Basic    ", USER, PASSWORD)).toBe(false);
    expect(verifyHostawayBasicAuth("!!!not base64!!!", USER, PASSWORD)).toBe(
      false,
    );
  });

  it("tolerates a password containing colons", () => {
    const pw = "has:colons:inside";
    expect(verifyHostawayBasicAuth(basic(USER, pw), USER, pw)).toBe(true);
  });
});

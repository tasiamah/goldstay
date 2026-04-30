import { describe, expect, it } from "vitest";
import { createHmac } from "node:crypto";
import { verifyHostawaySignature } from "./signature";

const SECRET = "test-secret";

function sign(body: string, prefix = ""): string {
  const hex = createHmac("sha256", SECRET).update(body).digest("hex");
  return `${prefix}${hex}`;
}

describe("verifyHostawaySignature", () => {
  it("accepts a matching signature with and without the sha256= prefix", () => {
    const body = '{"event":"reservation.created"}';
    expect(verifyHostawaySignature(body, sign(body), SECRET)).toBe(true);
    expect(
      verifyHostawaySignature(body, sign(body, "sha256="), SECRET),
    ).toBe(true);
  });

  it("rejects a tampered body", () => {
    const body = '{"event":"reservation.created"}';
    const sig = sign(body);
    expect(
      verifyHostawaySignature('{"event":"replay"}', sig, SECRET),
    ).toBe(false);
  });

  it("rejects when secret or header is missing", () => {
    expect(verifyHostawaySignature("body", null, SECRET)).toBe(false);
    expect(verifyHostawaySignature("body", "abc", "")).toBe(false);
  });

  it("rejects malformed hex without throwing", () => {
    expect(verifyHostawaySignature("body", "not-hex", SECRET)).toBe(false);
  });
});

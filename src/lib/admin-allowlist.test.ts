import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { isAdminEmail } from "./admin-allowlist";

const ORIGINAL = process.env.ADMIN_EMAILS;
beforeEach(() => {
  delete process.env.ADMIN_EMAILS;
});
afterEach(() => {
  if (ORIGINAL === undefined) delete process.env.ADMIN_EMAILS;
  else process.env.ADMIN_EMAILS = ORIGINAL;
});

// Gate to /admin. The catastrophic regression here is a stranger
// bypassing the corporate-domain check via a clever email — every
// case in the rejection block below is a real attack pattern we've
// seen in production allowlist bugs (subdomain spoof, suffix attack,
// look-alike, hyphen homograph). Worth keeping the long list.

describe("isAdminEmail", () => {
  it("admits the corporate domains, normalises case + whitespace", () => {
    expect(isAdminEmail("ted@goldstay.co.ke")).toBe(true);
    expect(isAdminEmail("kwame@goldstay.com.gh")).toBe(true);
    expect(isAdminEmail("  Ted@GOLDSTAY.com  ")).toBe(true);
  });

  it("rejects every classic spoof pattern", () => {
    expect(isAdminEmail(null)).toBe(false);
    expect(isAdminEmail("")).toBe(false);
    expect(isAdminEmail("attacker@evil.goldstay.com")).toBe(false);
    expect(isAdminEmail("attacker@goldstay.com.evil.com")).toBe(false);
    expect(isAdminEmail("ted@gold-stay.co.ke")).toBe(false);
    expect(isAdminEmail("ted@goldstay.co")).toBe(false);
  });

  it("env allowlist matches case-insensitively but never partial-matches", () => {
    process.env.ADMIN_EMAILS = "  Accountant@Gmail.com , contractor@outlook.com ";
    expect(isAdminEmail("ACCOUNTANT@gmail.com")).toBe(true);
    expect(isAdminEmail("accountant@gmail.co")).toBe(false);
    expect(isAdminEmail("ccountant@gmail.com")).toBe(false);
  });
});

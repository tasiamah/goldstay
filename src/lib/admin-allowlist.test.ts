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

describe("isAdminEmail (corporate domain path)", () => {
  it("matches every goldstay corporate domain without env config", () => {
    expect(isAdminEmail("ted@goldstay.co.ke")).toBe(true);
    expect(isAdminEmail("kwame@goldstay.com.gh")).toBe(true);
    expect(isAdminEmail("ops@goldstay.com")).toBe(true);
  });

  it("normalises case and surrounding whitespace", () => {
    expect(isAdminEmail("  Ted@GOLDSTAY.co.KE  ")).toBe(true);
  });

  it("rejects subdomain spoofs and look-alike domains", () => {
    // The single most important property of this module: a stranger
    // who can register a clever email must NOT get /admin.
    expect(isAdminEmail("attacker@evil.goldstay.com")).toBe(false);
    expect(isAdminEmail("attacker@goldstay.com.evil.com")).toBe(false);
    expect(isAdminEmail("ted@gold-stay.co.ke")).toBe(false);
    expect(isAdminEmail("ted@goldstay.co")).toBe(false);
  });
});

describe("isAdminEmail (env allowlist path)", () => {
  it("returns false for empty / missing input", () => {
    expect(isAdminEmail(null)).toBe(false);
    expect(isAdminEmail(undefined)).toBe(false);
    expect(isAdminEmail("")).toBe(false);
    expect(isAdminEmail("   ")).toBe(false);
  });

  it("returns false for an outsider when env is unset", () => {
    expect(isAdminEmail("ops@example.com")).toBe(false);
  });

  it("matches a comma-separated env entry, case-insensitive and trimmed", () => {
    process.env.ADMIN_EMAILS =
      "  Accountant@Gmail.com ,  contractor@outlook.com  ";
    expect(isAdminEmail("ACCOUNTANT@gmail.com")).toBe(true);
    expect(isAdminEmail("contractor@outlook.com")).toBe(true);
  });

  it("does not partial-match an allowlisted address", () => {
    // Guards against the classic bug where 'foo@bar.com' is checked
    // with .includes(email) on the joined string.
    process.env.ADMIN_EMAILS = "accountant@gmail.com";
    expect(isAdminEmail("accountant@gmail.co")).toBe(false);
    expect(isAdminEmail("ccountant@gmail.com")).toBe(false);
  });
});

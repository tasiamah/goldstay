import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { isAdminEmail } from "./admin-allowlist";

const ORIGINAL = process.env.ADMIN_EMAILS;

describe("isAdminEmail (env allowlist path)", () => {
  beforeEach(() => {
    delete process.env.ADMIN_EMAILS;
  });
  afterEach(() => {
    if (ORIGINAL === undefined) delete process.env.ADMIN_EMAILS;
    else process.env.ADMIN_EMAILS = ORIGINAL;
  });

  it("returns false when the env allowlist is unset and email is not goldstay", () => {
    expect(isAdminEmail("ops@example.com")).toBe(false);
  });

  it("returns false when the env allowlist is empty and email is not goldstay", () => {
    process.env.ADMIN_EMAILS = "";
    expect(isAdminEmail("ops@example.com")).toBe(false);
  });

  it("returns false for empty inputs", () => {
    process.env.ADMIN_EMAILS = "hello@gmail.com";
    expect(isAdminEmail(null)).toBe(false);
    expect(isAdminEmail(undefined)).toBe(false);
    expect(isAdminEmail("")).toBe(false);
    expect(isAdminEmail("   ")).toBe(false);
  });

  it("matches a single allowlisted email exactly", () => {
    process.env.ADMIN_EMAILS = "accountant@gmail.com";
    expect(isAdminEmail("accountant@gmail.com")).toBe(true);
  });

  it("is case-insensitive on both sides", () => {
    process.env.ADMIN_EMAILS = "Accountant@Gmail.com";
    expect(isAdminEmail("ACCOUNTANT@gmail.com")).toBe(true);
    expect(isAdminEmail("accountant@gmail.com")).toBe(true);
  });

  it("trims whitespace around comma-separated entries", () => {
    process.env.ADMIN_EMAILS =
      "  accountant@gmail.com ,  contractor@outlook.com  ";
    expect(isAdminEmail("accountant@gmail.com")).toBe(true);
    expect(isAdminEmail("contractor@outlook.com")).toBe(true);
  });

  it("rejects a non-goldstay email not on the env allowlist", () => {
    process.env.ADMIN_EMAILS = "accountant@gmail.com";
    expect(isAdminEmail("attacker@example.com")).toBe(false);
  });

  it("does not partial-match (substring of allowlisted address)", () => {
    process.env.ADMIN_EMAILS = "accountant@gmail.com";
    expect(isAdminEmail("accountant@gmail.co")).toBe(false);
    expect(isAdminEmail("accountant@gmail.community")).toBe(false);
    expect(isAdminEmail("ccountant@gmail.com")).toBe(false);
  });

  it("ignores empty entries from a trailing comma", () => {
    process.env.ADMIN_EMAILS = "accountant@gmail.com,,";
    expect(isAdminEmail("")).toBe(false);
    expect(isAdminEmail("accountant@gmail.com")).toBe(true);
  });
});

describe("isAdminEmail (goldstay domain path)", () => {
  beforeEach(() => {
    delete process.env.ADMIN_EMAILS;
  });
  afterEach(() => {
    if (ORIGINAL === undefined) delete process.env.ADMIN_EMAILS;
    else process.env.ADMIN_EMAILS = ORIGINAL;
  });

  it("matches a goldstay.co.ke email without any env config", () => {
    expect(isAdminEmail("ted@goldstay.co.ke")).toBe(true);
  });

  it("matches a goldstay.com.gh email", () => {
    expect(isAdminEmail("kwame@goldstay.com.gh")).toBe(true);
  });

  it("matches a goldstay.com email", () => {
    expect(isAdminEmail("ops@goldstay.com")).toBe(true);
  });

  it("is case-insensitive on the domain", () => {
    expect(isAdminEmail("Ted@GOLDSTAY.co.KE")).toBe(true);
    expect(isAdminEmail("Ted@Goldstay.Com.Gh")).toBe(true);
  });

  it("tolerates surrounding whitespace", () => {
    expect(isAdminEmail("  ted@goldstay.co.ke  ")).toBe(true);
  });

  it("rejects subdomain spoofs", () => {
    expect(isAdminEmail("attacker@evil.goldstay.com")).toBe(false);
    expect(isAdminEmail("attacker@goldstay.com.evil.com")).toBe(false);
    expect(isAdminEmail("attacker@goldstay-co-ke.com")).toBe(false);
  });

  it("rejects similar but unrelated domains", () => {
    expect(isAdminEmail("ted@goldstay.co")).toBe(false);
    expect(isAdminEmail("ted@goldstay.co.kenya")).toBe(false);
    expect(isAdminEmail("ted@gold-stay.co.ke")).toBe(false);
  });

  it("rejects an email with no @", () => {
    expect(isAdminEmail("notanemail")).toBe(false);
  });

  it("rejects an email with no local part (still has @)", () => {
    expect(isAdminEmail("@goldstay.co.ke")).toBe(true);
    // ^ acceptable: the auth provider would never issue a session
    // for a malformed email; we are not the validator. We DO reject
    // the trailing-@ case below, which has no domain at all.
    expect(isAdminEmail("ted@")).toBe(false);
  });
});

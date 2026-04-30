import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { isAdminEmail } from "./admin-allowlist";

const ORIGINAL = process.env.ADMIN_EMAILS;

describe("isAdminEmail", () => {
  beforeEach(() => {
    delete process.env.ADMIN_EMAILS;
  });
  afterEach(() => {
    if (ORIGINAL === undefined) delete process.env.ADMIN_EMAILS;
    else process.env.ADMIN_EMAILS = ORIGINAL;
  });

  it("returns false when the allowlist is unset", () => {
    expect(isAdminEmail("hello@goldstay.co.ke")).toBe(false);
  });

  it("returns false when the allowlist is empty", () => {
    process.env.ADMIN_EMAILS = "";
    expect(isAdminEmail("hello@goldstay.co.ke")).toBe(false);
  });

  it("returns false for empty inputs", () => {
    process.env.ADMIN_EMAILS = "hello@goldstay.co.ke";
    expect(isAdminEmail(null)).toBe(false);
    expect(isAdminEmail(undefined)).toBe(false);
    expect(isAdminEmail("")).toBe(false);
  });

  it("matches a single allowlisted email exactly", () => {
    process.env.ADMIN_EMAILS = "hello@goldstay.co.ke";
    expect(isAdminEmail("hello@goldstay.co.ke")).toBe(true);
  });

  it("is case-insensitive on both sides", () => {
    process.env.ADMIN_EMAILS = "Hello@Goldstay.CO.KE";
    expect(isAdminEmail("HELLO@goldstay.co.ke")).toBe(true);
    expect(isAdminEmail("hello@goldstay.co.ke")).toBe(true);
  });

  it("trims whitespace around comma-separated entries", () => {
    process.env.ADMIN_EMAILS =
      "  hello@goldstay.co.ke ,  ops@goldstay.co.ke  ";
    expect(isAdminEmail("hello@goldstay.co.ke")).toBe(true);
    expect(isAdminEmail("ops@goldstay.co.ke")).toBe(true);
  });

  it("rejects an email not on the allowlist", () => {
    process.env.ADMIN_EMAILS = "hello@goldstay.co.ke,ops@goldstay.co.ke";
    expect(isAdminEmail("attacker@evil.com")).toBe(false);
    expect(isAdminEmail("tenant@goldstay.co.ke")).toBe(false);
  });

  it("does not partial-match (substring of allowlisted address)", () => {
    process.env.ADMIN_EMAILS = "hello@goldstay.co.ke";
    expect(isAdminEmail("hello@goldstay.co")).toBe(false);
    expect(isAdminEmail("hello@goldstay.co.kenya")).toBe(false);
    expect(isAdminEmail("ello@goldstay.co.ke")).toBe(false);
  });

  it("ignores empty entries from a trailing comma", () => {
    process.env.ADMIN_EMAILS = "hello@goldstay.co.ke,,";
    expect(isAdminEmail("")).toBe(false);
    expect(isAdminEmail("hello@goldstay.co.ke")).toBe(true);
  });
});

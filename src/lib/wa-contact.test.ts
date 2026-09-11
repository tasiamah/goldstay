import { describe, expect, it } from "vitest";
import { clientWaLink, internationalNumber } from "./wa-contact";

describe("internationalNumber", () => {
  it("accepts the Kenyan forms an operator actually types", () => {
    const cases: [string, string][] = [
      ["0712345678", "254712345678"],
      ["0712 345 678", "254712345678"],
      ["+254712345678", "254712345678"],
      ["+254 712 345 678", "254712345678"],
      ["254712345678", "254712345678"],
      ["00254712345678", "254712345678"],
      // Trunk zero left off, which is how people write it when they
      // have just been told to drop the zero.
      ["712345678", "254712345678"],
    ];
    for (const [input, expected] of cases) {
      expect(internationalNumber(input, "KE"), input).toBe(expected);
    }
  });

  it("uses the client's market for the trunk prefix", () => {
    expect(internationalNumber("0244123456", "GH")).toBe("233244123456");
  });

  it("keeps a diaspora number that says which country it is", () => {
    // The common real case: Kenyan property, British or American owner.
    expect(internationalNumber("+44 7700 900123", "KE")).toBe("447700900123");
    expect(internationalNumber("+1 301 555 0133", "KE")).toBe("13015550133");
    expect(internationalNumber("+971 50 123 4567", "KE")).toBe("971501234567");
  });

  it("refuses a foreign national number rather than making it Kenyan", () => {
    // This is the case the whole module exists for. "07700900123" is a
    // UK mobile and 11 digits; blindly swapping the zero for 254 gives
    // 2547700900123, which is a plausible-looking number belonging to
    // someone who has never heard of us, and we would send them a
    // message about a stranger's contract.
    expect(internationalNumber("07700900123", "KE")).toBeNull();
    expect(internationalNumber("(0770) 090 0123", "KE")).toBeNull();
  });

  it("returns null for anything it cannot place", () => {
    for (const input of ["", "   ", "n/a", "ask Mary", "12345", null, undefined]) {
      expect(internationalNumber(input, "KE"), String(input)).toBeNull();
    }
  });

  it("rejects lengths outside E.164", () => {
    expect(internationalNumber("+2547123456789012345", "KE")).toBeNull();
    expect(internationalNumber("+254712", "KE")).toBeNull();
  });
});

describe("clientWaLink", () => {
  it("builds a wa.me link with the message encoded", () => {
    const link = clientWaLink({
      phone: "0712345678",
      country: "KE",
      message: "Hi Jane — your agreement for Polaris 4B is still unsigned.",
    });
    expect(link).toContain("https://wa.me/254712345678?text=");
    expect(link).toContain("Polaris");
    // Encoded, not raw: an em dash and spaces in a query string produce
    // a link that breaks when pasted into a mail client.
    expect(link).not.toContain(" ");
  });

  it("is null when the number cannot be trusted, so callers fall back", () => {
    expect(
      clientWaLink({ phone: null, country: "KE", message: "hello" }),
    ).toBeNull();
    expect(
      clientWaLink({ phone: "07700900123", country: "KE", message: "hello" }),
    ).toBeNull();
  });
});

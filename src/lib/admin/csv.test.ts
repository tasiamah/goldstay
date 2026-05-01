import { describe, expect, it } from "vitest";
import { toCsv } from "./csv";

describe("toCsv", () => {
  it("returns empty string for no rows", () => {
    expect(toCsv([])).toBe("");
  });

  it("serialises basic rows with header", () => {
    const csv = toCsv([
      { name: "Asha", country: "KE" },
      { name: "Kofi", country: "GH" },
    ]);
    expect(csv).toBe("name,country\r\nAsha,KE\r\nKofi,GH\r\n");
  });

  it("escapes quotes, commas, and newlines per RFC 4180", () => {
    const csv = toCsv([
      { note: 'has "quotes" and, comma' },
      { note: "two\nlines" },
    ]);
    expect(csv).toBe(
      'note\r\n"has ""quotes"" and, comma"\r\n"two\nlines"\r\n',
    );
  });

  it("renders Date as ISO and null as empty", () => {
    const csv = toCsv([
      { when: new Date("2026-05-01T10:00:00Z"), missing: null },
    ]);
    expect(csv).toBe("when,missing\r\n2026-05-01T10:00:00.000Z,\r\n");
  });
});

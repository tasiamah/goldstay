import { describe, expect, it } from "vitest";
import { toCsv } from "./csv";

// CSV export from the admin tables. Excel and Numbers will both
// silently corrupt a file that doesn't escape per RFC 4180, so
// that's the only failure mode worth a guard. Dates / nulls /
// header generation are exercised in the same test.

describe("toCsv", () => {
  it("escapes quotes, commas and newlines per RFC 4180 and renders Date/null", () => {
    const csv = toCsv([
      {
        name: "Asha",
        note: 'has "quotes" and, comma',
        when: new Date("2026-05-01T10:00:00Z"),
        missing: null,
      },
      { name: "Kofi", note: "two\nlines", when: null, missing: null },
    ]);
    expect(csv).toBe(
      [
        "name,note,when,missing",
        'Asha,"has ""quotes"" and, comma",2026-05-01T10:00:00.000Z,',
        'Kofi,"two\nlines",,',
        "",
      ].join("\r\n"),
    );
  });
});

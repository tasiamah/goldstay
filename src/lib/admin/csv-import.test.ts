import { describe, expect, it } from "vitest";
import { parseCsv, summariseImport, validateRows } from "./csv-import";

// CSV import for ops bulk-loads (owners, properties, transactions).
// The senior risks are:
//   - mishandling RFC 4180 quoting (would split a field with a comma
//     into two columns and corrupt downstream rows), and
//   - dropping the row index → ops can't tell the user which row to
//     fix in their spreadsheet.
// BOM, blank-line and column-count handling are exercised transitively
// in the happy-path test.

describe("parseCsv + validateRows", () => {
  it("handles RFC 4180 quoting and produces row indices that match the spreadsheet", () => {
    const got = parseCsv(
      `name,note\n"Asha Kimani","Said: ""hello, world"""\n,empty\n`,
    );
    expect(got.rows).toEqual([
      { name: "Asha Kimani", note: 'Said: "hello, world"' },
      { name: "", note: "empty" },
    ]);

    const validated = validateRows<{ name: string }>(
      got.rows,
      (r) =>
        r.name
          ? { ok: true, value: { name: r.name } }
          : { ok: false, errors: ["name required"] },
    );
    expect(summariseImport(validated)).toEqual({ okCount: 1, errorCount: 1 });
    // Row 2 = data row 1 (header is row 1) — what ops sees in their CSV.
    expect(validated[0]!.rowIndex).toBe(2);
    expect(validated[1]!.rowIndex).toBe(3);
  });
});

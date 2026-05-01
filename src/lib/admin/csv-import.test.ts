import { describe, expect, it } from "vitest";
import { parseCsv, summariseImport, validateRows } from "./csv-import";

describe("parseCsv", () => {
  it("parses a simple CSV with headers", () => {
    const got = parseCsv("name,email\nasha,asha@example.com\nkwame,kwame@example.com");
    expect(got.headers).toEqual(["name", "email"]);
    expect(got.rows).toEqual([
      { name: "asha", email: "asha@example.com" },
      { name: "kwame", email: "kwame@example.com" },
    ]);
    expect(got.warnings).toEqual([]);
  });

  it("handles quoted fields with embedded commas and quotes", () => {
    const got = parseCsv(
      `name,note\n"Asha Kimani","Said: ""hello, world"""\n`,
    );
    expect(got.rows).toEqual([
      { name: "Asha Kimani", note: 'Said: "hello, world"' },
    ]);
  });

  it("strips a leading BOM", () => {
    const got = parseCsv("\ufeffname\nasha");
    expect(got.headers).toEqual(["name"]);
    expect(got.rows[0]?.name).toBe("asha");
  });

  it("warns on column count mismatch", () => {
    const got = parseCsv("a,b,c\n1,2");
    expect(got.warnings.length).toBeGreaterThan(0);
  });

  it("skips blank rows", () => {
    const got = parseCsv("name\nasha\n\nkwame\n");
    expect(got.rows).toEqual([{ name: "asha" }, { name: "kwame" }]);
  });

  it("returns empty for empty input", () => {
    expect(parseCsv("").rows).toEqual([]);
    expect(parseCsv("   \n   ").rows).toEqual([]);
  });
});

describe("validateRows + summariseImport", () => {
  it("partitions valid and invalid rows", () => {
    const validated = validateRows<{ name: string }>(
      [{ name: "asha" }, { name: "" }],
      (r) =>
        r.name
          ? { ok: true, value: { name: r.name } }
          : { ok: false, errors: ["name required"] },
    );
    expect(summariseImport(validated)).toEqual({ okCount: 1, errorCount: 1 });
    expect(validated[0].rowIndex).toBe(2);
    expect(validated[1].rowIndex).toBe(3);
  });
});

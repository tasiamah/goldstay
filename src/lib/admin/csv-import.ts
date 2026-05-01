// Tiny CSV parser for import flows.
//
// We parse RFC 4180 by hand instead of pulling a library: the only
// escaping rules we need to honour are double-quoted fields with
// embedded quotes (doubled). Tab-separated and semicolon variants are
// not supported; if pasted Excel exports contain them, we ask the
// operator to re-export.
//
// Returns rows as Record<header, value>. Validation is the caller's
// problem — schema-driven coercion lives in the per-entity import
// page (zod schema for owners, zod schema for properties, etc.).

export type ParsedCsv = {
  headers: string[];
  rows: Record<string, string>[];
  warnings: string[];
};

export function parseCsv(text: string): ParsedCsv {
  const trimmed = text.replace(/^\ufeff/, ""); // strip BOM
  if (!trimmed.trim()) {
    return { headers: [], rows: [], warnings: ["File is empty."] };
  }

  const records = tokenise(trimmed);
  if (records.length === 0) {
    return { headers: [], rows: [], warnings: ["No rows detected."] };
  }
  const [headerRow, ...dataRows] = records;
  const headers = headerRow.map((h) => h.trim());

  const warnings: string[] = [];
  const rows: Record<string, string>[] = dataRows
    .filter((r) => r.some((cell) => cell.trim() !== ""))
    .map((cells, idx) => {
      const out: Record<string, string> = {};
      if (cells.length !== headers.length) {
        warnings.push(
          `Row ${idx + 2}: expected ${headers.length} columns, got ${cells.length}.`,
        );
      }
      headers.forEach((h, i) => {
        out[h] = (cells[i] ?? "").trim();
      });
      return out;
    });

  return { headers, rows, warnings };
}

function tokenise(text: string): string[][] {
  const out: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let i = 0;
  let inQuotes = false;

  while (i < text.length) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      cell += ch;
      i += 1;
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }
    if (ch === ",") {
      row.push(cell);
      cell = "";
      i += 1;
      continue;
    }
    if (ch === "\r") {
      i += 1;
      continue;
    }
    if (ch === "\n") {
      row.push(cell);
      out.push(row);
      row = [];
      cell = "";
      i += 1;
      continue;
    }
    cell += ch;
    i += 1;
  }
  // Flush final cell / row
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    out.push(row);
  }

  return out;
}

// ---------- Validation helpers ----------

export type ValidatedRow<T> =
  | { ok: true; value: T; rowIndex: number; raw: Record<string, string> }
  | { ok: false; errors: string[]; rowIndex: number; raw: Record<string, string> };

export function validateRows<T>(
  rows: Record<string, string>[],
  validate: (row: Record<string, string>) => { ok: true; value: T } | { ok: false; errors: string[] },
): ValidatedRow<T>[] {
  return rows.map((raw, i) => {
    const result = validate(raw);
    if (result.ok) {
      return { ok: true, value: result.value, rowIndex: i + 2, raw };
    }
    return { ok: false, errors: result.errors, rowIndex: i + 2, raw };
  });
}

export function summariseImport<T>(rows: ValidatedRow<T>[]): {
  okCount: number;
  errorCount: number;
} {
  let okCount = 0;
  let errorCount = 0;
  for (const r of rows) {
    if (r.ok) okCount += 1;
    else errorCount += 1;
  }
  return { okCount, errorCount };
}

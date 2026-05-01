// Tiny CSV writer used by the admin export routes. We hand-roll
// rather than pull a library because the data set is small and the
// only escaping rules we need are RFC 4180:
//   * fields containing commas, quotes or newlines are wrapped in "
//   * embedded " characters are doubled
// Returns a string ready to stream as text/csv.

export function toCsv(rows: Array<Record<string, unknown>>): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => encodeCell(row[h])).join(","));
  }
  // Excel-safe CRLF terminators; final newline keeps tails happy.
  return lines.join("\r\n") + "\r\n";
}

function encodeCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str =
    value instanceof Date ? value.toISOString() : String(value);
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function csvResponse(filename: string, body: string): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}

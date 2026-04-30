// Shared zod preprocessors for HTML form input.
//
// HTML forms send everything as strings (including numbers and dates),
// and unset fields arrive as the empty string rather than `undefined`.
// These helpers normalise both edges before zod validation runs so each
// schema doesn't have to repeat the boilerplate.
import { z } from "zod";

// Treats "" as "not provided" and parses the rest with the inner schema.
// Use this anywhere a free-text field can be left blank.
export const optionalString = z
  .preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().trim().optional(),
  )
  .optional();

// Parses a possibly-empty string into a non-negative integer or
// undefined. Returns NaN for non-numeric input so zod can flag the
// field with a clear validation error rather than silently accept it.
//
// The outer .optional() is required on top of the inner schema's
// .optional() because zod 4 treats `z.preprocess(fn, S.optional())`
// as nonoptional at the field level: preprocess transforms the value
// but the outer slot in the parent object is still required to exist.
// Without the outer .optional(), an entirely missing key triggers
// "expected nonoptional, received undefined".
export const optionalInt = z
  .preprocess((v) => {
    if (typeof v !== "string") return undefined;
    const t = v.trim();
    if (t === "") return undefined;
    const n = Number(t);
    return Number.isFinite(n) ? n : NaN;
  }, z.number().int().min(0).optional())
  .optional();

// Same as optionalInt but allows decimals; used for money amounts where
// the stored Decimal column tolerates fractional values.
export const optionalDecimal = z
  .preprocess((v) => {
    if (typeof v !== "string") return undefined;
    const t = v.trim();
    if (t === "") return undefined;
    const n = Number(t);
    return Number.isFinite(n) ? n : NaN;
  }, z.number().min(0).optional())
  .optional();

// Parses HTML <input type="date"> output (YYYY-MM-DD) into a Date.
// Empty string -> undefined; bad input -> NaN so zod reports it.
export const optionalDate = z
  .preprocess((v) => {
    if (typeof v !== "string" || v.trim() === "") return undefined;
    const d = new Date(v);
    return isNaN(d.getTime()) ? NaN : d;
  }, z.date().optional())
  .optional();

// Required version of optionalDate for fields like lease.startDate.
export const requiredDate = z.preprocess((v) => {
  if (typeof v !== "string" || v.trim() === "") return undefined;
  const d = new Date(v);
  return isNaN(d.getTime()) ? NaN : d;
}, z.date());

// Parses an amount-like string into a non-negative number. Used for
// fields that are required to have a value (e.g. monthlyRent).
export const requiredAmount = z.preprocess(
  (v) => (typeof v === "string" ? Number(v) : v),
  z.number().min(0),
);

// Helper used by every Server Action's error envelope. Flattens a
// ZodError into a {fieldName: firstMessage} dictionary so the form
// can highlight the offending input directly.
export function flattenZodErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

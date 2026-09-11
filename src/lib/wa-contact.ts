// A wa.me link for messaging a client, or nothing at all.
//
// Distinct from `waLink` in site.ts, which builds a link to *our* number
// for a visitor to click. This builds a link to *their* number, for one
// of us to click. Same URL shape, opposite direction, and a completely
// different failure mode: getting our own number wrong shows a visitor
// a dead chat, whereas getting a client's number wrong opens a chat
// with a stranger and sends them a message about somebody else's
// management agreement.
//
// Which is why this returns null rather than its best guess. Every
// caller has the raw number to fall back on, so a missing link costs
// an operator a copy-paste. A wrong link costs a client's privacy.
//
// No phone-number library. libphonenumber is 300KB to parse two
// country formats, and the honest alternative to that weight is not a
// looser regex — it is refusing the numbers we cannot be sure about,
// which is what the length checks below do.

import type { Country } from "@prisma/client";

// Kenya and Ghana. Both are 9 significant digits after the code, and
// both write the national form with a single leading 0.
const DIALLING_CODE: Record<Country, string> = {
  KE: "254",
  GH: "233",
};

const NATIONAL_SIGNIFICANT_DIGITS = 9;

// E.164 allows 15 digits including the country code, and no real number
// is shorter than 8. A value outside that is data entry, not a phone.
const MIN_E164 = 8;
const MAX_E164 = 15;

// Turns whatever an operator typed into the digits wa.me expects, which
// is an international number with no plus, no spaces and no zeroes in
// front of the country code.
//
// `country` is the client's market, not necessarily where they live —
// that is the whole difficulty here. Most of these clients are diaspora
// landlords with a Kenyan property and a British or American mobile, so
// a leading zero cannot simply be swapped for 254. A UK mobile in
// national form is 11 digits ("07700 900123") and a Kenyan one is 10
// ("0712 345678"), so the length is the only thing that distinguishes
// them, and anything that is not exactly a local length is refused.
export function internationalNumber(
  raw: string | null | undefined,
  country: Country,
): string | null {
  if (!raw) return null;

  const trimmed = raw.trim();
  if (!trimmed) return null;

  // A leading + is the caller telling us this is already international,
  // and it is the only reliable signal in the string. Captured before
  // the non-digits are stripped, because stripping destroys it.
  const explicitlyInternational = trimmed.startsWith("+");
  let digits = trimmed.replace(/\D/g, "");
  if (!digits) return null;

  const code = DIALLING_CODE[country];

  if (explicitlyInternational) {
    // Trust it. "+44 7700 900123" is unambiguous in a way that
    // "07700900123" is not.
  } else if (digits.startsWith("00")) {
    // The other way of writing +, still unambiguous.
    digits = digits.slice(2);
  } else if (digits.startsWith("0")) {
    // National form. Only safe to reinterpret when the length matches
    // the local pattern for this market; a longer one is almost
    // certainly a foreign number written the foreign way, and guessing
    // would produce a real WhatsApp account belonging to nobody we
    // meant to contact.
    if (digits.length !== NATIONAL_SIGNIFICANT_DIGITS + 1) return null;
    digits = code + digits.slice(1);
  } else if (digits.startsWith(code)) {
    // Already carries the country code without a plus.
  } else if (digits.length === NATIONAL_SIGNIFICANT_DIGITS) {
    // A bare local number with the trunk zero left off: "712345678".
    digits = code + digits;
  } else {
    // Something else entirely — a foreign number with no plus, an
    // extension, a landline written oddly. Not ours to interpret.
    return null;
  }

  if (digits.length < MIN_E164 || digits.length > MAX_E164) return null;
  return digits;
}

export function clientWaLink(input: {
  phone: string | null | undefined;
  country: Country;
  message: string;
}): string | null {
  const number = internationalNumber(input.phone, input.country);
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(input.message)}`;
}

// Referral code + dashboard token generation.
//
// Two distinct identifiers per referrer:
//
//   code            — short (8 chars), public, embedded in URLs and
//                     visible to the world. Optimised for being typed
//                     into a partner-site form ("use code GS-AB12C3").
//                     Uses an ambiguity-free alphabet so a phone
//                     screenshot survives a re-type.
//
//   dashboardToken  — long (32 bytes, base64url), private, lives in
//                     the dashboard URL. Whoever holds it sees that
//                     referrer's earnings. Treated as a bearer secret;
//                     rotatable on request.
//
// Both are generated with crypto.randomBytes via the Web Crypto API,
// so this works on both Node runtime and the Edge runtime (the
// /middleware route uses Edge).

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I

function randomBytes(n: number): Uint8Array {
  const buf = new Uint8Array(n);
  crypto.getRandomValues(buf);
  return buf;
}

// 8-char human-friendly code from a 32-char ambiguity-free alphabet.
// Search space: 32^8 ≈ 1.1e12, plenty for our scale even after the
// no-collision check in the DB layer.
export function generateReferrerCode(): string {
  const bytes = randomBytes(8);
  let out = "";
  for (let i = 0; i < bytes.length; i++) {
    out += ALPHABET[bytes[i]! % ALPHABET.length];
  }
  return out;
}

// 32 bytes → 43-char base64url. Long enough that brute-force is not
// a concern; treat as a bearer credential and never log.
export function generateDashboardToken(): string {
  const bytes = randomBytes(32);
  // Web-Crypto-friendly base64url without padding. Buffer is Node-only,
  // so we hand-roll the conversion to keep this Edge-compatible.
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]!);
  const b64 = typeof btoa !== "undefined"
    ? btoa(bin)
    : Buffer.from(bytes).toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Light validation for cookie / URL-param values before we trust
// them as referral codes. Defensive: anything outside the alphabet
// is treated as not-a-code rather than 400ing the user.
export function isValidReferrerCode(input: unknown): input is string {
  if (typeof input !== "string") return false;
  if (input.length < 6 || input.length > 16) return false;
  return /^[A-Z0-9]+$/.test(input);
}

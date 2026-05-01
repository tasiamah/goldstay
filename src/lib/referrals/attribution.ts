// Cookie-based referral attribution.
//
// Single source of truth for cookie name + TTL so middleware (Edge),
// API routes (Node) and any future client-side reader all agree.
// The cookie is non-HttpOnly so a future client analytics layer can
// see it; we only store the public referral code, never the token.

import { cookies } from "next/headers";
import { isValidReferrerCode } from "./codes";

export const REFERRAL_COOKIE = "gs_ref";

// 90 days. Long enough to bridge a "save the link, fill in the form
// next month" pattern without becoming a privacy footgun. Anything
// shorter loses meaningful conversions; anything longer attributes
// signings that no longer feel earned.
export const REFERRAL_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 90;

// Server-side reader for any /api/* route. Returns the validated code
// or null. Validation is centralised in isValidReferrerCode so a
// junk cookie never reaches the DB layer.
export function readReferralCookie(): string | null {
  const c = cookies().get(REFERRAL_COOKIE)?.value;
  return isValidReferrerCode(c) ? c : null;
}

// Root middleware. Currently single-purpose: pick up the `?ref=…`
// query parameter on any public marketing URL and stash the value in
// a 90-day cookie so a referral attribution survives the visitor's
// later journey to /list-your-property or /yield-calculator.
//
// Deliberately *not* invoking the Supabase session helper here: the
// platform already authenticates per-route via requireOwner() /
// requireAdmin(), and adding a cookie-touching auth pass on every
// public request would invalidate Vercel's edge cache for the
// marketing pages. Keep this file's footprint as small as possible.
//
// Matcher excludes /api, /_next, /embed and static assets so we don't
// touch hot paths.

import { NextResponse, type NextRequest } from "next/server";
import {
  REFERRAL_COOKIE,
  REFERRAL_COOKIE_MAX_AGE_SECONDS,
} from "@/lib/referrals/attribution";
import { isValidReferrerCode } from "@/lib/referrals/codes";

export function middleware(request: NextRequest) {
  const ref = request.nextUrl.searchParams.get("ref");
  if (!ref) return NextResponse.next();

  // Defensive validation: any character set outside our alphabet is
  // a typo / scraper / cache-buster, not a real code. Treat as
  // "no attribution" rather than persisting garbage that would
  // never resolve to a Referrer row.
  const upper = ref.toUpperCase();
  if (!isValidReferrerCode(upper)) return NextResponse.next();

  // Don't overwrite an existing valid attribution silently — first
  // touch wins, which matches what most affiliate networks do and
  // keeps the conversation simple if two referrers each claim a
  // signing. The visitor can clear cookies if they really meant a
  // re-attribution.
  const existing = request.cookies.get(REFERRAL_COOKIE)?.value;
  if (existing && isValidReferrerCode(existing)) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  response.cookies.set(REFERRAL_COOKIE, upper, {
    maxAge: REFERRAL_COOKIE_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax",
    httpOnly: false,
    // Secure in production so the cookie isn't sent over HTTP. Vercel
    // handles the upgrade so this is always-on outside local dev.
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}

export const config = {
  // Match every public path except API routes, asset folders, the
  // embed surface (third-party host, no cookie set there), Sentry's
  // tunnel route and the standard Next.js internals.
  matcher: [
    "/((?!api/|_next/|_vercel/|monitoring/|embed/|.*\\.[^/]+$).*)",
  ],
};

// Root middleware. Two responsibilities:
//
//   1. On any platform request (/owner, /admin, /auth) refresh the
//      Supabase auth session and write the rotated access + refresh
//      tokens back into the response cookies. This is the only
//      place we can persist refreshed tokens to the browser —
//      Server Components are not allowed to mutate cookies, so a
//      session that's only ever touched inside an RSC silently
//      "expires" the moment the access token's hour is up. Doing
//      the refresh here keeps users signed in indefinitely (the
//      refresh token's lifetime is set in the Supabase dashboard,
//      typically months / never).
//
//   2. On any request, capture a ?ref=… affiliate code into a 90-
//      day cookie so referral attribution survives the visitor's
//      later journey (e.g. landing on /yield-calculator and only
//      converting two days later on /list-your-property).
//
// Public marketing routes get the referral cookie pass only — no
// auth side effects, so Vercel's edge cache for them stays intact.
// Auth refresh is scoped to platform paths via PLATFORM_PATHS so
// we don't bust the marketing CDN cache by writing Set-Cookie on
// every blog page.

import { NextResponse, type NextRequest } from "next/server";
import {
  REFERRAL_COOKIE,
  REFERRAL_COOKIE_MAX_AGE_SECONDS,
} from "@/lib/referrals/attribution";
import { isValidReferrerCode } from "@/lib/referrals/codes";
import { updateSession } from "@/lib/supabase/middleware";

const PLATFORM_PATH_PREFIXES = ["/owner", "/admin", "/auth"];

function isPlatformPath(pathname: string): boolean {
  return PLATFORM_PATH_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

export async function middleware(request: NextRequest) {
  const platform = isPlatformPath(request.nextUrl.pathname);

  // Auth refresh comes first so the response we eventually send back
  // already has the rotated supabase auth cookies attached. We then
  // bolt the (optional) referral cookie onto the same response.
  const baseResponse = platform
    ? (await updateSession(request)).response
    : NextResponse.next();

  const ref = request.nextUrl.searchParams.get("ref");
  if (!ref) return baseResponse;

  // Defensive validation: any character set outside our alphabet is
  // a typo / scraper / cache-buster, not a real code. Treat as
  // "no attribution" rather than persisting garbage that would
  // never resolve to a Referrer row.
  const upper = ref.toUpperCase();
  if (!isValidReferrerCode(upper)) return baseResponse;

  // Don't overwrite an existing valid attribution silently — first
  // touch wins, which matches what most affiliate networks do and
  // keeps the conversation simple if two referrers each claim a
  // signing. The visitor can clear cookies if they really meant a
  // re-attribution.
  const existing = request.cookies.get(REFERRAL_COOKIE)?.value;
  if (existing && isValidReferrerCode(existing)) {
    return baseResponse;
  }

  baseResponse.cookies.set(REFERRAL_COOKIE, upper, {
    maxAge: REFERRAL_COOKIE_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax",
    httpOnly: false,
    // Secure in production so the cookie isn't sent over HTTP. Vercel
    // handles the upgrade so this is always-on outside local dev.
    secure: process.env.NODE_ENV === "production",
  });
  return baseResponse;
}

export const config = {
  // Match every public path except API routes, asset folders, the
  // embed surface (third-party host, no cookie set there), Sentry's
  // tunnel route and the standard Next.js internals.
  matcher: [
    "/((?!api/|_next/|_vercel/|monitoring/|embed/|.*\\.[^/]+$).*)",
  ],
};

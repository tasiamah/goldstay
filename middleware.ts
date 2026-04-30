// Root middleware. Runs on the edge for every request that matches the
// `config.matcher` below. Two responsibilities:
//
//   1. Refresh the Supabase auth session on every navigation so access
//      tokens never silently expire mid-session.
//   2. Gate platform routes (`/owner/*`, `/admin/*`). Unauthenticated
//      visitors are bounced to /login with a `next` param so we can
//      send them straight back to where they were after sign-in.
//
// The marketing site is intentionally untouched; the matcher excludes
// static assets, API routes, and everything outside the protected
// surface so we keep the existing site free of any auth latency.
import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PROTECTED_PREFIXES = ["/owner", "/admin"];

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);

  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/owner/:path*",
    "/admin/:path*",
    "/login",
    "/auth/:path*",
  ],
};

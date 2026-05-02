// Post-password-sign-in landing route.
//
// signInWithPassword runs entirely in the browser, so unlike the
// magic-link flow we never round-trip through /auth/callback after
// success. That means we lose the natural seam where role-based
// destination ("admin → /admin, everyone else → /owner") is decided.
// This route restores that seam: the LoginForm bounces here right
// after a successful password sign-in and we redirect to the right
// surface based on the freshly-established session cookie.
//
// Honours an optional ?next= override that must be a same-origin
// path so we don't get used as an open-redirect.

import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const next = searchParams.get("next");

  const supabase = createSupabaseServerClient();

  // The session cookie is already on the request because the browser
  // client wrote it during signInWithPassword. If somehow it isn't —
  // user navigated here directly, cookies disabled, etc. — fall back
  // to /login rather than booting them into a guarded surface.
  let userEmail: string | null | undefined;
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userEmail = user?.email;
  } catch {
    userEmail = null;
  }

  if (!userEmail) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const fallback = isAdminEmail(userEmail) ? "/admin" : "/owner";
  const target = next && next.startsWith("/") ? next : fallback;
  return NextResponse.redirect(`${origin}${target}`);
}

// Edge-runtime helper used by the root middleware. On every request to
// a platform route it refreshes the Supabase auth session (rotating
// access tokens before they expire) and surfaces the resulting user so
// the middleware can redirect unauthenticated traffic to /login.
//
// IMPORTANT: this is wrapped in defensive try/catch because failures
// here would crash every platform request. Supabase Auth is an
// external dependency — network blips, transient 5xx, malformed
// cookies after a logout race — and an unhandled throw in middleware
// renders the platform error boundary for the user, even though the
// page itself would have worked fine. We swallow the failure and let
// the per-route requireUser() decide what to do; at worst the user
// sees one stale page render before being redirected to /login.
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  // If the env vars aren't wired up (local dev with no .env, or a
  // misconfigured preview deploy), bail out cleanly instead of
  // letting createServerClient throw deep inside supabase-js.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    return { response, user: null };
  }

  try {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    return { response, user };
  } catch {
    // Anything thrown by supabase-js (network, parse, cookie-decode)
    // is non-fatal for the request: the page still renders against
    // whatever cookies the browser already had, and the per-route
    // auth gate can redirect to /login if those have actually
    // expired. The alternative — surfacing a 500 — is worse.
    return { response, user: null };
  }
}

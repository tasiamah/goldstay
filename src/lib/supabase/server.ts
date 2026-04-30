// Server-side Supabase client. Used inside Server Components, route
// handlers, and Server Actions to read the current session from the
// HTTP-only auth cookies that Supabase sets on the browser. Always
// instantiate per-request: the cookies() store is request-scoped and
// caching the client across requests would leak sessions between users.
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export function createSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Components cannot mutate cookies; the middleware
            // refreshes the session on every navigation, so swallowing
            // this is safe.
          }
        },
      },
    },
  );
}

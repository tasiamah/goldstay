// Admin Supabase client, scoped to server-only code paths. Uses the
// service role secret key, so it bypasses Row Level Security and can
// create buckets, presign uploads on private buckets, and read every
// row regardless of the caller's session.
//
// NEVER import this from a client component, a route handler that
// mirrors user input back as a response, or any module that ends up
// in the browser bundle. The export name is deliberately scary so
// `grep` for it in PR review is fast.
import { createClient } from "@supabase/supabase-js";

let cached: ReturnType<typeof createClient> | null = null;

export function createSupabaseAdminClient() {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secret) {
    throw new Error(
      "Supabase admin client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY",
    );
  }

  cached = createClient(url, secret, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}

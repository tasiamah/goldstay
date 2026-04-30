// Magic-link callback. Supabase emails the landlord a URL of the form
//   https://goldstay.co.ke/auth/callback?code=<otp>&next=/owner
// and we exchange the one-time code here for a session cookie, then
// bounce them to wherever they were trying to reach (or /owner).
import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (!code) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent("missing code")}`,
    );
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error?.message ?? "session exchange failed")}`,
    );
  }

  const fallback = isAdminEmail(data.user.email) ? "/admin" : "/owner";
  const target = next && next.startsWith("/") ? next : fallback;
  return NextResponse.redirect(`${origin}${target}`);
}

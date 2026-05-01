// Magic-link callback. Supabase emails the user a URL of the form
//   https://goldstay.co.ke/auth/callback?code=<otp>&next=/owner       (PKCE)
// or, when the email template uses {{ .TokenHash }} instead of
// {{ .ConfirmationURL }}:
//   https://goldstay.co.ke/auth/callback?token_hash=<hash>&type=email (cross-device)
//
// Both shapes are accepted here so we work whether the user clicks
// the link in the same browser they requested it from (PKCE picks up
// its code-verifier cookie) or on a different device entirely
// (token_hash + verifyOtp avoids the cookie round-trip altogether).
//
// On success: route admin emails to /admin, everyone else to /owner,
// honouring an optional ?next= override that must be a same-origin
// path so we don't get used as an open-redirect.
import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/auth";

// Short, URL-safe codes the /login page renders into a friendly
// recovery message. We never bounce the raw Supabase error string
// back to the visitor — it leaks implementation detail and reads
// like a stack trace.
const ERROR_CODES = {
  MISSING_PARAMS: "missing-params",
  PKCE_DIFFERENT_DEVICE: "different-device",
  EXCHANGE_FAILED: "exchange-failed",
} as const;

function isAllowedOtpType(value: string | null): value is EmailOtpType {
  return (
    value === "email" ||
    value === "magiclink" ||
    value === "recovery" ||
    value === "invite" ||
    value === "signup" ||
    value === "email_change"
  );
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next");

  const supabase = createSupabaseServerClient();

  let userEmail: string | null | undefined;
  let exchangeError: string | null = null;

  if (code) {
    // PKCE flow: requires the matching code_verifier cookie set by
    // the browser client during signInWithOtp. If the user opens the
    // email on a different device the cookie isn't there and Supabase
    // returns an error containing "code verifier"; we map that to a
    // dedicated friendly message rather than the raw string.
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error || !data.user) {
      const msg = error?.message?.toLowerCase() ?? "";
      exchangeError =
        msg.includes("code verifier") || msg.includes("pkce")
          ? ERROR_CODES.PKCE_DIFFERENT_DEVICE
          : ERROR_CODES.EXCHANGE_FAILED;
    } else {
      userEmail = data.user.email;
    }
  } else if (tokenHash && isAllowedOtpType(type)) {
    // Token-hash flow: stateless, works on any device. Requires the
    // Supabase email template to render {{ .TokenHash }} into the URL
    // (default templates send `code` instead — see deploy notes).
    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    if (error || !data.user) {
      exchangeError = ERROR_CODES.EXCHANGE_FAILED;
    } else {
      userEmail = data.user.email;
    }
  } else {
    exchangeError = ERROR_CODES.MISSING_PARAMS;
  }

  if (exchangeError) {
    const errorUrl = new URL(`${origin}/login`);
    errorUrl.searchParams.set("error", exchangeError);
    if (next) errorUrl.searchParams.set("next", next);
    return NextResponse.redirect(errorUrl);
  }

  const fallback = isAdminEmail(userEmail) ? "/admin" : "/owner";
  const target = next && next.startsWith("/") ? next : fallback;
  return NextResponse.redirect(`${origin}${target}`);
}

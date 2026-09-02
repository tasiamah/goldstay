// Minting sign-in links that our own /auth/callback can actually
// complete.
//
// `supabase.auth.admin.generateLink` returns an `action_link` pointing
// at Supabase's own /auth/v1/verify endpoint, and it is tempting to
// email that straight to the user. It does not work here.
//
// A browser-initiated magic link (signInWithOtp) is PKCE: the client
// stores a code verifier, so verify hands back `?code=` and our
// callback exchanges it. An *admin*-generated link has no code
// challenge, so verify completes the exchange itself and redirects to
// `redirect_to` with the session in the URL **fragment**:
//
//   https://goldstay.co.ke/auth/callback#access_token=…&refresh_token=…
//
// Fragments are never transmitted to the server. Our callback is a
// route handler, so it saw neither `?code` nor `?token_hash`, took the
// else branch, and bounced every single clicker to
// /login?error=missing-params — "We didn't receive a valid sign-in
// token." The email sent fine; the link inside it could never work.
//
// The same generateLink response also carries `hashed_token`, which is
// exactly what the callback's verifyOtp branch expects. So we throw
// away action_link and build our own URL. The whole exchange then
// happens server-side, and because there is no code-verifier cookie
// involved it works on any device — the landlord can open the email on
// their phone having never visited the site in that browser.

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// `next` is where the user lands once the token is exchanged. It must
// be a same-origin path; the callback re-checks this before honouring
// it, so a bad value degrades to the default destination rather than
// redirecting off-site.
export async function mintCallbackLink(input: {
  email: string;
  siteUrl: string;
  next: string;
}): Promise<string | null> {
  const { email, siteUrl, next } = input;
  const supabase = createSupabaseAdminClient();

  // redirectTo is not what we email — we discard action_link below —
  // but GoTrue validates it against the project's redirect allowlist,
  // so passing the real destination keeps that check meaningful.
  const redirectTo = new URL(
    `/auth/callback?next=${encodeURIComponent(next)}`,
    siteUrl,
  ).toString();

  const { data, error } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo },
  });

  if (error) {
    console.warn("[magic-link] generateLink error", error);
    return null;
  }

  const hashedToken = data?.properties?.hashed_token;
  if (!hashedToken) {
    // Deliberately not falling back to action_link: it would produce a
    // link that looks fine and fails on click, which is the bug this
    // module exists to prevent. Callers treat null as "no link" and
    // send the plain "head to /login" wording instead.
    console.warn("[magic-link] generateLink returned no hashed_token");
    return null;
  }

  const url = new URL("/auth/callback", siteUrl);
  url.searchParams.set("token_hash", hashedToken);
  // Must match the type the token was minted under, or verifyOtp
  // rejects it.
  url.searchParams.set("type", "magiclink");
  url.searchParams.set("next", next);
  return url.toString();
}

"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

// Google and Apple SSO entry points. Each button kicks off an OAuth
// redirect via Supabase; the rest of the dance (provider auth screen,
// Supabase exchange, our /auth/callback) is identical to the magic
// link path, so this file owns nothing beyond the click and the icon.
//
// Both providers are gated behind public env flags
// (NEXT_PUBLIC_AUTH_GOOGLE_ENABLED, NEXT_PUBLIC_AUTH_APPLE_ENABLED) so
// that the buttons only appear once the corresponding provider has
// been wired up in the Supabase dashboard. This means the code can
// ship ahead of the dashboard work without users hitting a broken
// "provider not enabled" error.

type Provider = "google" | "apple";

const GOOGLE_ENABLED =
  process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED === "true";
const APPLE_ENABLED = process.env.NEXT_PUBLIC_AUTH_APPLE_ENABLED === "true";

export function oauthAvailable(): boolean {
  return GOOGLE_ENABLED || APPLE_ENABLED;
}

export function OAuthButtons({ next }: { next?: string }) {
  const [pending, setPending] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!oauthAvailable()) return null;

  async function startOAuth(provider: Provider) {
    setError(null);
    setPending(provider);

    const supabase = createSupabaseBrowserClient();
    // Same callback the magic-link flow uses. Supabase appends ?code=...
    // and our existing /auth/callback exchanges it the same way it
    // exchanges PKCE codes today.
    const redirectTo = new URL(
      `/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ""}`,
      window.location.origin,
    ).toString();

    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    });

    if (signInError) {
      // signInWithOAuth normally returns immediately with the redirect
      // URL and the browser navigates away, so we only land here on a
      // configuration problem (provider not enabled in Supabase, bad
      // redirect URI, network failure). Keep the copy neutral so it
      // doesn't read as a security failure.
      setPending(null);
      setError(
        "We couldn't open the sign-in window. Please try again, or use an email link below.",
      );
    }
    // On success the browser redirects to the provider; no further
    // state needed — the page is unmounting.
  }

  return (
    <div className="space-y-2.5">
      {GOOGLE_ENABLED ? (
        <button
          type="button"
          onClick={() => startOAuth("google")}
          disabled={pending !== null}
          className="inline-flex w-full items-center justify-center gap-2.5 rounded-md border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-800 shadow-sm hover:bg-stone-50 disabled:opacity-60"
        >
          <GoogleIcon />
          {pending === "google" ? "Opening Google..." : "Continue with Google"}
        </button>
      ) : null}

      {APPLE_ENABLED ? (
        <button
          type="button"
          onClick={() => startOAuth("apple")}
          disabled={pending !== null}
          className="inline-flex w-full items-center justify-center gap-2.5 rounded-md border border-black bg-black px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-stone-900 disabled:opacity-60"
        >
          <AppleIcon />
          {pending === "apple" ? "Opening Apple..." : "Continue with Apple"}
        </button>
      ) : null}

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      ) : null}
    </div>
  );
}

// Inline SVGs keep these buttons free of any icon-library dependency
// and avoid loading a network image just to render the brand mark.

function GoogleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#4285F4"
        d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9082c1.7018-1.5668 2.6841-3.874 2.6841-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.4673-.806 5.9564-2.1805l-2.9082-2.2581c-.806.54-1.8368.86-3.0482.86-2.344 0-4.3282-1.5832-5.0359-3.7104H.9573v2.3318C2.4382 15.9832 5.4818 18 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.9641 10.71c-.18-.54-.2823-1.1168-.2823-1.71s.1023-1.17.2823-1.71V4.9582H.9573C.3477 6.1732 0 7.5477 0 9c0 1.4523.3477 2.8268.9573 4.0418L3.9641 10.71z"
      />
      <path
        fill="#EA4335"
        d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5814C13.4632.8918 11.426 0 9 0 5.4818 0 2.4382 2.0168.9573 4.9582L3.9641 7.29C4.6718 5.1627 6.656 3.5795 9 3.5795z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      fill="currentColor"
    >
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./LoginForm";
import { OAuthButtons } from "./OAuthButtons";

// Whether either SSO button is enabled. Read here as a server-side
// expression rather than imported from OAuthButtons.tsx (which is a
// client component) because Next.js cannot call a function that
// lives behind a "use client" reference during prerender.
// NEXT_PUBLIC_* values are inlined into both server and client
// bundles at build time, so this evaluates the same way in both
// contexts and stays consistent with what OAuthButtons reads.
const SSO_ENABLED =
  process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED === "true" ||
  process.env.NEXT_PUBLIC_AUTH_APPLE_ENABLED === "true";

export const metadata: Metadata = {
  // Single sign-in surface for both landlords and Goldstay operators
  // (admins). The destination is decided after the magic link or
  // OAuth code is exchanged in /auth/callback, based on the email's
  // role, so the copy here stays role-neutral on purpose.
  title: "Sign in",
  description:
    "Sign in to Goldstay to access your owner dashboard or admin console.",
  robots: { index: false, follow: false },
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string; error?: string; sent?: string };
}) {
  const ssoOn = SSO_ENABLED;

  return (
    <div className="min-h-screen">
      {/* Escape hatch for visitors who clicked the header "Sign in"
          link by accident. The Platform layout doesn't ship the
          marketing nav, so without this they're stuck on a page
          that has no obvious way back to goldstay.co.ke. */}
      <header className="px-6 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-stone-600 transition-colors hover:text-stone-900"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M10 12L6 8l4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Goldstay
        </Link>
      </header>

      <div className="mx-auto flex min-h-[60vh] w-full max-w-md flex-col justify-center px-6 py-12">
        <h1 className="text-3xl font-serif text-stone-900">
          Sign in to Goldstay
        </h1>

        {ssoOn ? (
          <div className="mt-8 space-y-5">
            <OAuthButtons next={searchParams.next} />
            <Divider />
            {searchParams.sent ? (
              <SentNotice />
            ) : (
              <LoginForm next={searchParams.next} />
            )}
          </div>
        ) : (
          <div className="mt-8">
            {searchParams.sent ? (
              <SentNotice />
            ) : (
              <LoginForm next={searchParams.next} />
            )}
          </div>
        )}

        {searchParams.error ? (
          <SignInError code={searchParams.error} />
        ) : null}
      </div>
    </div>
  );
}

// Visual separator between the OAuth buttons and the email magic-link
// form. Pulled out so the page reads cleanly and the styling lives
// in one place.
function Divider() {
  return (
    <div
      role="separator"
      aria-label="or"
      className="relative flex items-center"
    >
      <span className="flex-1 border-t border-stone-200" />
      <span className="px-3 text-xs uppercase tracking-wider text-stone-500">
        or
      </span>
      <span className="flex-1 border-t border-stone-200" />
    </div>
  );
}

function SentNotice() {
  // The "open in the same browser" tip used to live above the form
  // unconditionally. It's only actionable after a link has been
  // requested, so we surface it here instead. Keeps the unsubmitted
  // page clean and puts the guidance exactly where it can prevent
  // the most common mistake (opening on phone after requesting on
  // laptop, then hitting the PKCE-different-device error).
  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
      <p className="font-medium">Check your inbox.</p>
      <p className="mt-1">
        The link expires in 60 minutes. Open it in this same browser.
      </p>
    </div>
  );
}

// Map the small set of error codes the /auth/callback route emits
// into human language. Anything we don't recognise (e.g. an old
// deploy that still bounces raw Supabase strings) falls through to
// a generic message so we never break the page.
function SignInError({ code }: { code: string }) {
  const message = (() => {
    switch (code) {
      case "different-device":
        return "That sign-in link was opened in a different browser. For security, the link only works in the browser that requested it. Please request a new one below.";
      case "exchange-failed":
        return "That sign-in link has already been used or has expired. Please request a fresh one below.";
      case "missing-params":
        return "We didn't receive a valid sign-in token. Please request a new link below.";
      default:
        return "We couldn't sign you in. Please request a new link below.";
    }
  })();

  return (
    <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
      {message}
    </div>
  );
}

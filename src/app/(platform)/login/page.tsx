import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  // Single sign-in surface for both landlords and Goldstay operators
  // (admins). The destination is decided after the magic link is
  // exchanged in /auth/callback, based on the email's role, so the
  // copy here stays role-neutral on purpose.
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
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-6 py-16">
      <h1 className="text-3xl font-serif text-stone-900">Sign in to Goldstay</h1>
      <p className="mt-3 text-stone-600">
        Enter the email address Goldstay has on file. We&apos;ll send you a
        one-tap sign-in link — no password required. The same link works
        for landlords and Goldstay operators; we&apos;ll route you to the
        right place after you&apos;re signed in.
      </p>
      <p className="mt-2 text-sm text-stone-500">
        Tip: open the link in the same browser you requested it from,
        otherwise you&apos;ll need to request a new one.
      </p>

      {searchParams.sent ? (
        <div className="mt-8 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          Check your inbox. The sign-in link expires in 60 minutes.
        </div>
      ) : (
        <div className="mt-8">
          <LoginForm next={searchParams.next} />
        </div>
      )}

      {searchParams.error ? (
        <SignInError code={searchParams.error} />
      ) : null}
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
        return (
          <>
            That sign-in link was requested in a different browser or
            device. For security, magic links can only be opened in the
            same browser they were requested from. Request a new link
            here and open it in this browser.
          </>
        );
      case "exchange-failed":
        return (
          <>
            That sign-in link has already been used or has expired
            (links are valid for 60 minutes). Request a fresh one
            below.
          </>
        );
      case "missing-params":
        return (
          <>
            We didn&apos;t receive a valid sign-in token. Please request
            a new link below.
          </>
        );
      default:
        return <>We couldn&apos;t sign you in. Please request a new link below.</>;
    }
  })();

  return (
    <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
      {message}
    </div>
  );
}

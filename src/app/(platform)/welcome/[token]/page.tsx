// /welcome/<token>
//
// The landing page for the welcome link we email new landlords.
//
// The single most important property of this page: loading it does
// nothing. It reads the invite to decide what to render and stops
// there. Mail scanners that prefetch every URL in an email — Outlook
// Safe Links, Mimecast, most corporate gateways — hit this, find a
// page, and spend nothing. Signing in happens in a server action,
// which is a POST, which they do not issue.
//
// That is the fix for "the link says it can no longer be used". The
// seven-day expiry is the fix for the other complaint.

import type { Metadata } from "next";
import Link from "next/link";

import { lookupInvite } from "@/lib/clients/invite";
import { openPortalAction } from "./actions";

export const metadata: Metadata = {
  title: "Welcome to Goldstay",
  robots: { index: false, follow: false },
};

// Never cached: the invite's state is the whole content of the page.
export const dynamic = "force-dynamic";

export default async function WelcomePage({
  params,
  searchParams,
}: {
  params: { token: string };
  searchParams?: { stale?: string };
}) {
  const found = await lookupInvite(params.token);

  // ?stale=1 comes from the action when the invite lapsed between
  // the page rendering and the button being pressed — the tab was
  // left open over the weekend.
  const stale = searchParams?.stale === "1";

  if (found.status === "valid" && !stale) {
    const firstName = found.client.fullName.split(/\s+/)[0] || "there";
    return (
      <Shell>
        <h1 className="text-3xl font-serif text-stone-900">
          Welcome, {firstName}.
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          Your Goldstay portal is ready. Click below and we&rsquo;ll sign you
          in and help you pick a password, so every visit after this one is
          instant.
        </p>

        <form action={openPortalAction} className="mt-8">
          <input type="hidden" name="token" value={params.token} />
          <button
            type="submit"
            className="w-full rounded-md bg-stone-900 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-stone-800"
          >
            Open my portal &rarr;
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-stone-500">
          This link works for a week and you can use it more than once.
        </p>
      </Shell>
    );
  }

  // Everything below is a dead end for the token, but not for the
  // person. We know who most of them are, so we say so and point at
  // the one action that always works.
  const name =
    found.status === "expired" || found.status === "retired"
      ? found.client.fullName.split(/\s+/)[0]
      : null;

  return (
    <Shell>
      <h1 className="text-3xl font-serif text-stone-900">
        {found.status === "retired"
          ? "You\u2019ve already set a password"
          : "This link has expired"}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-stone-600">
        {found.status === "retired" ? (
          <>
            {name ? `${name}, your` : "Your"} account is set up and this
            welcome link has been retired. Sign in with your email and
            password.
          </>
        ) : (
          <>
            {name ? `${name}, welcome` : "Welcome"} links last a week. Yours
            has run out, but getting a new one takes a moment: go to the sign-in
            page, enter your email and choose &ldquo;Forgot password?&rdquo;.
            We&rsquo;ll email you a fresh link straight away.
          </>
        )}
      </p>

      <Link
        href="/login"
        className="mt-8 block w-full rounded-md bg-stone-900 px-6 py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-stone-800"
      >
        Go to sign in &rarr;
      </Link>

      <p className="mt-4 text-center text-xs text-stone-500">
        Stuck? Reply to your welcome email, or write to{" "}
        <a
          href="mailto:hello@goldstay.co.ke"
          className="underline underline-offset-2"
        >
          hello@goldstay.co.ke
        </a>{" "}
        and a real person will sort it out.
      </p>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50">
      <header className="px-6 pt-6">
        <p className="font-serif text-lg text-stone-900">
          Goldstay<span className="text-red-700">.</span>
        </p>
      </header>
      <div className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-6 py-12">
        <div className="rounded-xl border border-stone-200 bg-white p-10">
          {children}
        </div>
      </div>
    </div>
  );
}

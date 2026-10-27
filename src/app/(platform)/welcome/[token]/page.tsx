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
import { openPortalAction, requestNewLinkAction } from "./actions";

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
  searchParams?: { stale?: string; sent?: string };
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

  const name =
    found.status === "expired" || found.status === "retired"
      ? found.client.fullName.split(/\s+/)[0]
      : null;

  // They pressed "send me a new one". Nothing to do but tell them
  // where to look, and resist the urge to offer the button again —
  // a second press inside the cooldown sends nothing, so offering it
  // would only invite them to doubt the first one worked.
  if (searchParams?.sent === "1") {
    return (
      <Shell>
        <h1 className="text-3xl font-serif text-stone-900">
          {name ? `On its way, ${name}.` : "On its way."}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          We&rsquo;ve emailed you a new link. It should arrive within a minute
          or two and works for a week once it does.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-stone-600">
          If it hasn&rsquo;t turned up, check your spam folder &mdash; and if
          it isn&rsquo;t there either, reply to any email from us and a real
          person will sort it out.
        </p>
        <Support />
      </Shell>
    );
  }

  // An expired link is a dead end for the token but not for the
  // person: it still tells us who they are, so we can offer to send
  // a new one rather than asking them to work out that the way back
  // in is a password reset they never set a password for.
  if (found.status === "expired") {
    return (
      <Shell>
        <h1 className="text-3xl font-serif text-stone-900">
          This link has expired
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          {name ? `${name}, welcome` : "Welcome"} links last a week and yours
          has run out. Press the button and we&rsquo;ll email you a new one
          straight away &mdash; no need to type anything, we know where to
          send it.
        </p>

        <form action={requestNewLinkAction} className="mt-8">
          <input type="hidden" name="token" value={params.token} />
          <button
            type="submit"
            className="w-full rounded-md bg-stone-900 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-stone-800"
          >
            Email me a new link &rarr;
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-stone-500">
          Already have a password?{" "}
          <Link href="/login" className="underline underline-offset-2">
            Sign in instead
          </Link>
          .
        </p>
        <Support />
      </Shell>
    );
  }

  // Retired, or a token we do not recognise. Neither earns a new
  // link: one already has a password, the other we cannot identify.
  return (
    <Shell>
      <h1 className="text-3xl font-serif text-stone-900">
        {found.status === "retired"
          ? "You\u2019ve already set a password"
          : "This link isn\u2019t valid"}
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
            We couldn&rsquo;t match this link to an account. It may have been
            typed or copied incompletely. Sign in below, or use &ldquo;Forgot
            password?&rdquo; there and we&rsquo;ll email you a fresh link.
          </>
        )}
      </p>

      <Link
        href="/login"
        className="mt-8 block w-full rounded-md bg-stone-900 px-6 py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-stone-800"
      >
        Go to sign in &rarr;
      </Link>

      <Support />
    </Shell>
  );
}

function Support() {
  return (
    <p className="mt-6 border-t border-stone-200 pt-5 text-center text-xs text-stone-500">
      Stuck? Write to{" "}
      <a
        href="mailto:hello@goldstay.co.ke"
        className="underline underline-offset-2"
      >
        hello@goldstay.co.ke
      </a>{" "}
      and a real person will sort it out.
    </p>
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

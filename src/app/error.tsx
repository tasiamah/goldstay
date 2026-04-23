"use client";

import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { useEffect } from "react";
import { site, waLink } from "@/lib/site";

// Per-route error boundary for the App Router. Runs when a React render
// error or an uncaught error bubbles out of any route below the root
// layout. Unlike global-error.tsx (which replaces the entire <html>
// shell), this one renders inside the root layout, so the Navbar and
// Footer still show and the visitor never sees a raw Next.js crash page.
//
// We:
//   1. Report to Sentry with the digest so the server-side event and the
//      client-side event can be correlated in the Sentry UI.
//   2. Offer a one-click reset (Next.js re-mounts the segment) plus a
//      WhatsApp fallback, because a landlord who just hit an error on the
//      lead form still deserves a way to reach us in one tap.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error, {
      tags: { boundary: "app/error.tsx" },
      extra: { digest: error.digest },
    });
  }, [error]);

  return (
    <section className="section pt-40">
      <div className="container-gs max-w-2xl text-center">
        <div className="eyebrow">Something went wrong</div>
        <h1 className="mt-4 font-serif text-display-md">
          We hit an unexpected error
        </h1>
        <p className="mt-5 text-charcoal/70">
          Our team has been notified automatically. In the meantime you can
          retry, go back to the homepage, or message us on WhatsApp and we will
          sort it personally.
        </p>
        {error.digest ? (
          <p className="mt-4 text-xs uppercase tracking-[0.18em] text-charcoal/40">
            Reference: {error.digest}
          </p>
        ) : null}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button type="button" onClick={reset} className="btn-primary">
            Try again
          </button>
          <Link href="/" className="btn-secondary">
            Back home
          </Link>
          <a
            href={waLink(
              `Hi ${site.name}, I hit an error on the website${
                error.digest ? ` (ref ${error.digest})` : ""
              }.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline text-sm text-charcoal/70"
          >
            Message us on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

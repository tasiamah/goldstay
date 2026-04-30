"use client";

import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { useEffect } from "react";

// Error boundary for /admin and /owner. Plain stone palette to match
// the rest of the platform; no marketing chrome, no WhatsApp CTA —
// staff and landlords here have a direct support channel and don't
// want to be funnelled through a sales surface when something breaks.
export default function PlatformError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error, {
      tags: { boundary: "platform/error.tsx" },
      extra: { digest: error.digest },
    });
  }, [error]);

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center justify-center px-6 py-10">
      <div className="rounded-lg border border-stone-200 bg-white p-8 text-center shadow-sm">
        <p className="text-xs uppercase tracking-wider text-stone-500">
          Something went wrong
        </p>
        <h1 className="mt-2 text-xl font-serif text-stone-900">
          We hit an unexpected error
        </h1>
        <p className="mt-3 text-sm text-stone-600">
          Our team has been notified. Try again in a moment.
        </p>
        {error.digest ? (
          <p className="mt-3 text-xs text-stone-400">
            Reference: {error.digest}
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700"
          >
            Try again
          </button>
          <Link
            href="/owner"
            className="rounded-md border border-stone-300 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
          >
            Back to portal
          </Link>
        </div>
      </div>
    </div>
  );
}

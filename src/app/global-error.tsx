"use client";

import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";
import { useEffect } from "react";

// Global error boundary for the App Router. Next.js renders this when a
// React render error or an uncaught error bubbles all the way up out of
// the root layout, which is exactly the moment Sentry must get a report.
// The default Next error UI is fine here; our goal is telemetry, not a
// branded crash page (the branded case is handled by error.tsx files
// further down the tree once we add them).
export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  );
}

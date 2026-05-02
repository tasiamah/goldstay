import * as Sentry from "@sentry/nextjs";

// Browser-side Sentry init. Loaded automatically by the @sentry/nextjs
// webpack plugin configured in next.config.mjs. This file runs inside the
// user's browser, so we are deliberately conservative about what we send:
//
// - sendDefaultPii is off (no IPs, cookies, request headers auto-attached),
//   which is what we want under KDPA and UK GDPR for our diaspora users.
// - Tracing is sampled lightly; we care about errors first, performance
//   second.
// - Session Replay is intentionally NOT loaded. The Replay integration
//   pulls in rrweb on every visitor and adds ~50 KB gzipped to the
//   critical-path JS, which on Kenyan and Ghanaian mobile networks (where
//   most owners actually live) translates into roughly a second of FCP.
//   Stack traces, breadcrumbs and source-mapped errors all still work
//   without it; we just lose the "watch the user repro it" video. If we
//   ever need that for a specific bug hunt, we can re-enable Replay
//   temporarily for a few days and pull it back out again.
//
// If NEXT_PUBLIC_SENTRY_DSN is not set, init() becomes a no-op: the SDK
// simply doesn't capture anything. That makes Sentry opt-in via env var, in
// line with how Resend, Airtable and Upstash degrade in this codebase.
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV || "development",
    release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
    tracesSampleRate: 0.1,
    sendDefaultPii: false,
    // Drop a few high-volume noise events that aren't actionable.
    ignoreErrors: [
      "ResizeObserver loop limit exceeded",
      "ResizeObserver loop completed with undelivered notifications.",
      "Non-Error promise rejection captured",
      // Safari extension shim noise
      "top.GLOBALS",
    ],
  });
}

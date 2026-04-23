import * as Sentry from "@sentry/nextjs";

// Edge runtime Sentry init. Loaded by src/instrumentation.ts when Next.js
// boots the Edge runtime (middleware, edge route handlers, the Vercel edge
// rewrites configured in next.config.mjs). The Edge runtime is a stripped
// V8 isolate, so we intentionally skip performance integrations that need
// Node-only APIs and stick to the essentials: capture unhandled errors
// and send them to Sentry.
const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
    release: process.env.VERCEL_GIT_COMMIT_SHA,
    tracesSampleRate: 0.1,
    sendDefaultPii: false,
  });
}

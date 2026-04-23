import * as Sentry from "@sentry/nextjs";

// Server-side (Node.js runtime) Sentry init. Loaded by the register()
// hook in src/instrumentation.ts when Next.js boots a Node runtime.
// This catches:
//   - unhandled errors in server components
//   - thrown errors in API route handlers (/api/lead, /api/tenant-*,
//     /api/units/search)
//   - rejected promises inside server actions
//
// Same env-var gate as the client config: if NEXT_PUBLIC_SENTRY_DSN is
// missing, Sentry stays a no-op. We intentionally read the public DSN
// here as well so a single Vercel env var drives both surfaces.
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

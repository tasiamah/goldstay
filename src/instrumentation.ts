import * as Sentry from "@sentry/nextjs";

// Next.js instrumentation hook. Called once per runtime (Node + Edge)
// when the app boots, before any request is handled. We route to the
// right Sentry config based on NEXT_RUNTIME so the Edge runtime does
// not try to load Node-only integrations and vice versa.
//
// Docs: https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

// Forward request-scoped errors from React Server Components and route
// handlers into Sentry with the request context attached. Next.js calls
// this for you on any uncaught server error.
export const onRequestError = Sentry.captureRequestError;

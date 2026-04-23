import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  // Host-based rewrites. This is what makes goldstay.co.ke serve the
  // Nairobi city page and goldstay.com.gh serve the Accra city page at
  // the root path. These run at Vercel's edge router before static
  // serving, so they work reliably even though / and /nairobi are both
  // pre-rendered at build time. Middleware was flaky here because
  // Vercel will cache the static / response per host once served, and
  // then middleware never runs again. Config-level rewrites do not hit
  // that footgun.
  async rewrites() {
    const kenyaHosts = ["goldstay.co.ke", "www.goldstay.co.ke"];
    const ghanaHosts = ["goldstay.com.gh", "www.goldstay.com.gh"];

    const hostRewrite = (hosts, destination) =>
      hosts.map((value) => ({
        source: "/",
        has: [{ type: "host", value }],
        destination,
      }));

    return {
      beforeFiles: [
        ...hostRewrite(kenyaHosts, "/nairobi"),
        ...hostRewrite(ghanaHosts, "/accra"),
      ],
    };
  },
};

// Wrap the Next config with Sentry's webpack plugin. When SENTRY_AUTH_TOKEN
// is set in the environment, this uploads source maps on every build so
// stack traces in Sentry point to real TS lines. When it is missing (local
// dev, PR preview without the secret), the plugin detects that and skips
// upload with a log warning: the app still builds and ships just fine.
//
// widenClientFileUpload: true tells the plugin to also upload client
// chunks under _next/static/chunks/* so breadcrumbs in deferred bundles
// (WhatsAppFloat, CookieConsent, etc.) symbolicate correctly.
//
// tunnelRoute: a /monitoring route that proxies Sentry ingest through our
// domain so ad blockers don't swallow client errors. Opt-in per-project;
// we leave it on because the cost is negligible and the signal loss from
// blockers is real.
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  disableLogger: true,
  automaticVercelMonitors: true,
});

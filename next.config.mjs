import { withSentryConfig } from "@sentry/nextjs";

// The hosts each country domain answers on. Shared by the redirects and
// the rewrites below so the two can never disagree about which host is
// which market.
const KENYA_HOSTS = ["goldstay.co.ke", "www.goldstay.co.ke"];
const GHANA_HOSTS = ["goldstay.com.gh", "www.goldstay.com.gh"];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // @react-pdf/renderer pulls in fontkit, yoga-layout, and a stack of
  // CommonJS internals that webpack can mangle when it tries to bundle
  // them into a serverless function. Marking them external keeps them
  // as require() calls that Node resolves at runtime, which is what
  // every working Next.js + react-pdf setup ends up doing.
  experimental: {
    serverComponentsExternalPackages: ["@react-pdf/renderer"],
  },
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
  // The portal moved from /owner to /client when we accepted that a
  // good share of the people who sign with us are not owners. These
  // have to stay indefinitely: every statement email we have ever sent
  // links to /owner/statements/{year}/{month}, and those land in
  // inboxes that people scroll back through years later.
  async redirects() {
    // Host-scoped city-root redirects. On a country domain the root and
    // /{city} render the same page (see the rewrites below), so /{city}
    // is a second address for the homepage. It now canonicalises to the
    // root, and this sends the duplicate there outright rather than
    // leaving two URLs serving 200.
    //
    // Safe against the rewrite underneath: Next runs redirects before
    // beforeFiles rewrites, and an internal rewrite does not re-enter
    // the redirect phase. So /nairobi 301s to /, then / rewrites to
    // /nairobi internally and renders. No loop.
    const cityRootRedirect = (hosts, source) =>
      hosts.map((value) => ({
        source,
        has: [{ type: "host", value }],
        destination: "/",
        permanent: true,
      }));

    return [
      ...cityRootRedirect(KENYA_HOSTS, "/nairobi"),
      ...cityRootRedirect(GHANA_HOSTS, "/accra"),
      {
        source: "/owner",
        destination: "/client",
        permanent: true,
      },
      {
        source: "/owner/:path*",
        destination: "/client/:path*",
        permanent: true,
      },
      {
        source: "/admin/owners",
        destination: "/admin/clients",
        permanent: true,
      },
      {
        source: "/admin/owners/:path*",
        destination: "/admin/clients/:path*",
        permanent: true,
      },
    ];
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
    const hostRewrite = (hosts, destination) =>
      hosts.map((value) => ({
        source: "/",
        has: [{ type: "host", value }],
        destination,
      }));

    return {
      beforeFiles: [
        ...hostRewrite(KENYA_HOSTS, "/nairobi"),
        ...hostRewrite(GHANA_HOSTS, "/accra"),
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

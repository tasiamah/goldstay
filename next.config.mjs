import { withSentryConfig } from "@sentry/nextjs";

// The hosts each country domain answers on. Shared by the redirects and
// the rewrites below so the two can never disagree about which host is
// which market.
const KENYA_HOSTS = ["goldstay.co.ke", "www.goldstay.co.ke"];
const GHANA_HOSTS = ["goldstay.com.gh", "www.goldstay.com.gh"];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Lint and typecheck are owned by .github/workflows/ci.yml, not by
  // the deploy.
  //
  // `next build` runs both by default, which was costing 38 seconds of
  // a 158 second deploy to re-check what the person pushing had
  // already run locally, while holding the deploy up to do it. They
  // now run in CI in parallel with the deploy instead of in front of
  // it, so the same checks happen and the deploy stops waiting on
  // them.
  //
  // This is safe in the specific sense that matters here: Next
  // compiles with SWC, which strips types without checking them, so a
  // type error never produced different output. It only meant nobody
  // had checked. The failures that do produce broken output are a
  // failure to compile or to prerender, and the build still does both
  // and still fails the deploy when either breaks.
  //
  // The cost is real and worth naming: a push with a type or lint
  // error will now deploy, and go red in CI about a minute later,
  // rather than failing the deploy outright. If that trade stops being
  // worth it, delete these two blocks and the deploy goes back to
  // blocking on them.
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
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

// Sentry's webpack plugin is only worth its build cost when Sentry is
// actually receiving something.
//
// The plugin generates source maps for every client chunk and rewrites
// the bundle to inject release metadata, and it does all of that
// whether or not the upload can happen. On this project it could not:
// there is no SENTRY_DSN and no NEXT_PUBLIC_SENTRY_DSN in the Vercel
// environment, so `Sentry.init()` in all three runtime configs is
// gated off and never runs, and there is no SENTRY_AUTH_TOKEN either,
// so the maps were built and then discarded. Measured on a cold local
// build that was 16 seconds of a 69 second build, which scaled out to
// roughly 45 of the 205 seconds every deploy was taking, in exchange
// for nothing at all.
//
// So the wrapper is now conditional on there being a reason for it.
// Set a DSN and the SDK starts reporting; add SENTRY_AUTH_TOKEN, ORG
// and PROJECT and the source maps upload again, both without touching
// this file. Nothing about the Sentry setup has been removed, and the
// runtime configs are untouched: this only stops paying for the build
// step while the destination is switched off.
const sentryConfigured = Boolean(
  process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
);

// widenClientFileUpload: true tells the plugin to also upload client
// chunks under _next/static/chunks/* so breadcrumbs in deferred bundles
// (WhatsAppFloat, CookieConsent, etc.) symbolicate correctly. It is
// also the expensive half of the plugin, so it is tied to there being
// a token to upload with rather than left on unconditionally.
//
// tunnelRoute: a /monitoring route that proxies Sentry ingest through our
// domain so ad blockers don't swallow client errors. Opt-in per-project;
// we leave it on because the cost is negligible and the signal loss from
// blockers is real.
export default sentryConfigured
  ? withSentryConfig(nextConfig, {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      silent: !process.env.CI,
      widenClientFileUpload: Boolean(process.env.SENTRY_AUTH_TOKEN),
      tunnelRoute: "/monitoring",
      disableLogger: true,
      automaticVercelMonitors: true,
    })
  : nextConfig;

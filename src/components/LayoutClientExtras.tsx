"use client";

import dynamic from "next/dynamic";

// Non-critical, purely interactive client widgets. None of them are
// above-the-fold or relevant to SEO/first paint, so we ship them as
// deferred client-only chunks. ssr: false keeps their markup out of
// the initial HTML (smaller response, less hydration), and dynamic()
// puts each one in its own chunk so they load after the main bundle.
// This wrapper exists because ssr: false can only be used from a
// Client Component, and our root layout is a Server Component.
const WhatsAppFloat = dynamic(
  () => import("./WhatsAppFloat").then((m) => m.WhatsAppFloat),
  { ssr: false },
);
const MobileStickyCTA = dynamic(
  () => import("./MobileStickyCTA").then((m) => m.MobileStickyCTA),
  { ssr: false },
);
const Toaster = dynamic(
  () => import("./Toaster").then((m) => m.Toaster),
  { ssr: false },
);

// Cookie banner intentionally not mounted: Goldstay operates in KE /
// GH only today and neither requires a prior-consent banner for the
// minimal first-party analytics + auth cookies we use. Re-import
// ./CookieConsent here when expanding into the EU / UK / South
// Africa where prior consent is the legal default — the component
// itself is still in the repo for that day.

export function LayoutClientExtras() {
  return (
    <>
      <WhatsAppFloat />
      <MobileStickyCTA />
      <Toaster />
    </>
  );
}

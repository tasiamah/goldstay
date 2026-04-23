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
const CookieConsent = dynamic(
  () => import("./CookieConsent").then((m) => m.CookieConsent),
  { ssr: false },
);

export function LayoutClientExtras() {
  return (
    <>
      <WhatsAppFloat />
      <MobileStickyCTA />
      <Toaster />
      <CookieConsent />
    </>
  );
}

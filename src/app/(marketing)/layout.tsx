import type { Metadata, Viewport } from "next";
import { Instrument_Serif } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "../globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@/components/Analytics";
import { JsonLd } from "@/components/JsonLd";
import { LayoutClientExtras } from "@/components/LayoutClientExtras";
import { site, alternateLanguagesFor } from "@/lib/site";
import { getServerCity } from "@/lib/getServerCity";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400"],
  style: ["normal", "italic"],
});

export function generateMetadata(): Metadata {
  const city = getServerCity();

  // Per-domain SEO surface. On goldstay.co.ke the title, description, OG
  // title, keywords and metadataBase all reflect Kenya/Nairobi only so
  // search engines, link unfurls and tab titles do not leak Ghana. Same
  // treatment for goldstay.com.gh. Neutral goldstay.com remains dual-market.
  const isNairobi = city === "nairobi";
  const isAccra = city === "accra";

  const titleSuffix = isNairobi
    ? "Premium Property Management in Nairobi"
    : isAccra
      ? "Premium Property Management in Accra"
      : "Premium Property Management in Nairobi & Accra";

  const description = isNairobi
    ? "Premium property management in Nairobi for diaspora landlords. We handle everything. You receive monthly USD transfers."
    : isAccra
      ? "Premium property management in Accra for diaspora landlords. We handle everything. You receive monthly USD transfers."
      : site.description;

  const metadataBase = new URL(
    isNairobi
      ? `https://${site.domains.nairobi}`
      : isAccra
        ? `https://${site.domains.accra}`
        : `https://${site.domain}`,
  );

  const allKeywords = [
    "property management Nairobi",
    "property management Accra",
    "diaspora landlord Kenya",
    "diaspora landlord Ghana",
    "Airbnb management Nairobi",
    "Airbnb management Accra",
    "USD rent remittance",
  ];
  const keywords = isNairobi
    ? allKeywords.filter((k) => !/accra|ghana/i.test(k))
    : isAccra
      ? allKeywords.filter((k) => !/nairobi|kenya/i.test(k))
      : allKeywords;

  // hreflang map for the homepage. Layout-level alternates only apply
  // when a child page doesn't declare its own; every page that ships a
  // canonical also re-declares languages via alternateLanguagesFor.
  const languages = alternateLanguagesFor("/");

  return {
    metadataBase,
    title: {
      default: `${site.name} | ${titleSuffix}`,
      template: `%s | ${site.name}`,
    },
    description,
    keywords,
    authors: [{ name: "Goldstay" }],
    alternates: {
      canonical: "/",
      languages,
    },
    openGraph: {
      title: `${site.name} | ${site.tagline}`,
      description,
      url: metadataBase.toString(),
      siteName: site.name,
      locale: "en_GB",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${site.name} | ${site.tagline}`,
      description,
    },
    robots: { index: true, follow: true },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
        ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
        : undefined,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#FAF8F3",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Marketing root layout. This is one of two root layouts in the app
// (the other lives at (platform)/layout.tsx). Splitting the root by
// route group is what keeps the public Navbar / Footer / WhatsApp
// float off the logged-in surfaces — middleware-set request headers
// turned out not to propagate to layout `headers()` calls reliably
// in production, so the route-group root-layout split is what we
// rely on instead.
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${instrumentSerif.variable}`}
    >
      <head>
        {/* Preconnect to the image CDNs the hero and location cards pull
            from, so the TLS handshake and DNS lookup happen in parallel
            with HTML parsing instead of blocking the LCP image. */}
        <link
          rel="preconnect"
          href="https://images.unsplash.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body>
        <JsonLd />
        <Analytics />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <LayoutClientExtras />
        {/* Vercel Speed Insights: captures real-user web vitals (LCP, CLS,
            INP) on production only. Self-hosts a tiny client script, no
            extra env vars needed, no-op on local dev and preview. */}
        <SpeedInsights />
      </body>
    </html>
  );
}

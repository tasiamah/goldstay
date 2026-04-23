import type { Metadata, Viewport } from "next";
import { Instrument_Serif } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { CookieConsent } from "@/components/CookieConsent";
import { Analytics } from "@/components/Analytics";
import { JsonLd } from "@/components/JsonLd";
import { MobileStickyCTA } from "@/components/MobileStickyCTA";
import { Toaster } from "@/components/Toaster";
import { site } from "@/lib/site";
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

  return {
    metadataBase,
    title: {
      default: `${site.name} | ${titleSuffix}`,
      template: `%s | ${site.name}`,
    },
    description,
    keywords,
    authors: [{ name: "Goldstay" }],
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
  };
}

export const viewport: Viewport = {
  themeColor: "#FAF8F3",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${instrumentSerif.variable}`}
    >
      <body>
        <JsonLd />
        <Analytics />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloat />
        <MobileStickyCTA />
        <Toaster />
        <CookieConsent />
      </body>
    </html>
  );
}

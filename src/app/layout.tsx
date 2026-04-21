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
import { site } from "@/lib/site";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://goldstay.com"),
  title: {
    default: `${site.name} | Premium Property Management in Nairobi & Accra`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "property management Nairobi",
    "property management Accra",
    "diaspora landlord Kenya",
    "diaspora landlord Ghana",
    "Airbnb management Nairobi",
    "Airbnb management Accra",
    "USD rent remittance",
  ],
  authors: [{ name: "Goldstay" }],
  openGraph: {
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
    url: "https://goldstay.com",
    siteName: site.name,
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

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
        <Analytics />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloat />
        <CookieConsent />
      </body>
    </html>
  );
}

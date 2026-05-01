import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Instrument_Serif } from "next/font/google";
import "../globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Goldstay embed",
  description: "Embeddable Goldstay surfaces for partner sites.",
  // Embeds must never be indexed: search engines should send people
  // to our own canonical pages, not to a stripped iframe target.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#FAF8F3",
  width: "device-width",
  initialScale: 1,
};

// Embed root layout — third parallel root in the app, alongside
// (marketing) and (platform). Deliberately bare: no nav, no footer,
// no analytics. Whatever site we're embedded on already owns the
// surrounding chrome and we don't want to fight it.
//
// We do load the brand fonts so the form looks like Goldstay even
// when displayed on a partner's white-label page.
export default function EmbedRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${instrumentSerif.variable}`}
    >
      <body className="bg-cream text-charcoal">{children}</body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Instrument_Serif } from "next/font/google";
import "../globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@/components/Analytics";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Goldstay portal",
  description: "Goldstay landlord and operations portal.",
  // Logged-in surfaces are not for search engines.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#FAF8F3",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Platform root layout. This is the second of two root layouts in
// the app (the marketing one lives at (marketing)/layout.tsx).
// Intentionally lean: no Navbar, no Footer, no marketing CTAs. The
// /admin and /owner sub-layouts add their own headers; /login renders
// edge-to-edge.
export default function PlatformRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${instrumentSerif.variable}`}
    >
      <body className="bg-stone-50 text-stone-900">
        <Analytics />
        <main className="min-h-screen">{children}</main>
        <SpeedInsights />
      </body>
    </html>
  );
}

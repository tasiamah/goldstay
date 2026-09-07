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
  title: "Goldstay statements",
  // Not for indexing. The page names the client whose statements the
  // visitor was copied on, so a crawler that followed a token out of
  // a forwarded email and published the result would put "X owns a
  // rental managed by Goldstay" in public search. robots.ts excludes
  // the path too; this is the belt to that braces.
  robots: { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = {
  themeColor: "#FAF8F3",
  width: "device-width",
  initialScale: 1,
};

// Fifth parallel root layout, alongside (marketing), (platform),
// agreements and embed. Same reasoning as agreements/layout.tsx: the
// person reading this is not our client, is not signed in, and holds
// a bearer token good for exactly one action. Rendering it inside the
// portal shell would show /client/... links to somebody with no
// session, and inside the marketing shell would wrap somebody's
// unsubscribe confirmation in a sales pitch.
export default function StatementsRootLayout({
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

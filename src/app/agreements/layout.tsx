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
  title: "Goldstay agreement",
  // A shared contract must never be indexed. The token in the URL is
  // the only credential protecting it, so a crawler that reached one
  // and published it would be handing a client's commercial terms to
  // anyone who searched. robots.ts excludes the path as well; this is
  // the belt to that braces.
  robots: { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = {
  themeColor: "#FAF8F3",
  width: "device-width",
  initialScale: 1,
};

// Fourth parallel root layout, alongside (marketing), (platform) and
// embed. It exists so a shared agreement renders without portal
// navigation or marketing chrome.
//
// That is a security property rather than a styling preference. The
// person reading this is not our client and is not signed in; they
// hold a bearer token for one document. Rendering the page inside the
// portal shell would put links to /client/... in front of somebody
// with no session, which is at best confusing and at worst an
// invitation to go looking. There is nothing to navigate to here.
export default function SharedAgreementRootLayout({
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

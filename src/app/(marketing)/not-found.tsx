import Link from "next/link";
import { Instrument_Serif } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

// This boundary renders outside the layout tree, so it has to carry
// its own font variables.
//
// The app has two root layouts, (marketing) and (platform), and no
// src/app/layout.tsx. Next serves a root-level not-found in its own
// <html id="__next_error__"> shell: the stylesheet still arrives,
// because the marketing layout stays in the RSC tree and preloads it,
// but that <html> carries no className, so the font variables the
// layout normally sets there are missing and font-serif falls back to
// the browser default. Putting them on the wrapper below is the fix;
// the wrapper is the outermost element this file controls.
//
// Two consequences worth knowing before changing this file. The
// Navbar and Footer do not render here and cannot be made to from
// this file, so the destination cards below are the only navigation a
// visitor gets. And the content is delivered through the RSC payload
// rather than the served HTML, so it paints after hydration. Neither
// affects the response status, which stays 404, and that status is
// what keeps these URLs out of the index.
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400"],
  style: ["normal", "italic"],
});

// Helpful destinations rather than a dead end. A default 404 reads as
// "the whole site is down" and loses the visit; naming the things
// someone arriving on a broken link was most likely after keeps it.
// These double as the page's only navigation, per the note above.
const DESTINATIONS = [
  {
    href: "/airbnb-management",
    label: "Airbnb management",
    blurb: "Short-stay management in Nairobi, end to end.",
  },
  {
    href: "/long-term-management",
    label: "Long-term management",
    blurb: "Tenant finding, rent collection and USD payouts.",
  },
  {
    href: "/pricing",
    label: "Pricing",
    blurb: "What we charge, and what the fee is charged on.",
  },
  {
    href: "/insights",
    label: "Insights",
    blurb: "Our writing on the Nairobi property market.",
  },
] as const;

export default function NotFound() {
  return (
    <div
      className={`${GeistSans.variable} ${GeistMono.variable} ${instrumentSerif.variable} min-h-screen bg-cream-50 font-sans`}
    >
      <section className="section pt-24">
        <div className="container-gs max-w-3xl">
          <div className="text-center">
            <Link
              href="/"
              className="font-serif text-2xl tracking-tight hover:text-gold-700"
            >
              Goldstay
            </Link>
            <div className="eyebrow mt-10">404</div>
            <h1 className="mt-4 font-serif text-display-md">Page not found</h1>
            <p className="mt-5 text-charcoal/70">
              The page you&apos;re looking for has either moved or never
              existed. Everything else on the site is working, so one of these
              may be what you were after.
            </p>
          </div>

          <ul className="mt-12 grid gap-4 sm:grid-cols-2">
            {DESTINATIONS.map((d) => (
              <li key={d.href}>
                <Link
                  href={d.href}
                  className="block h-full rounded-lg border border-charcoal/10 p-5 text-left transition-colors hover:border-gold-500"
                >
                  <span className="font-medium">{d.label}</span>
                  <span className="mt-1 block text-sm text-charcoal/60">
                    {d.blurb}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-12 text-center">
            <Link href="/" className="btn-primary inline-flex">
              Back home
            </Link>
            <p className="mt-6 text-sm text-charcoal/60">
              Arrived from a broken link somewhere?{" "}
              <Link
                href="/list-your-property"
                className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
              >
                Tell us
              </Link>{" "}
              and we will fix it.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

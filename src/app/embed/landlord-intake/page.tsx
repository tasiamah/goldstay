// Embeddable landlord intake.
//
// Renders inside an iframe injected by /embed/landlord-intake.js on
// any partner site (diaspora associations, employer benefit pages,
// founder-network newsletters). The page deliberately strips all
// site chrome — no nav, no footer, no analytics — because we are a
// guest on someone else's domain and the host page already sets the
// surrounding context.
//
// The `?partner=foo` query param flows through to the form so every
// signed landlord traces back to the source. Default to "unknown"
// when missing so a misconfigured embed still works.

import type { Metadata } from "next";
import { EmbedForm } from "./EmbedForm";

export const metadata: Metadata = {
  title: "Goldstay landlord intake",
  description:
    "Embeddable landlord intake form. List a Nairobi or Accra property with Goldstay in 60 seconds.",
  // Don't index the embed surface itself — Google should send people
  // to /list-your-property on our own domain, not to this stripped
  // iframe target.
  robots: { index: false, follow: false },
};

type Props = {
  searchParams?: { partner?: string };
};

export default function Page({ searchParams }: Props) {
  const partner = (searchParams?.partner ?? "unknown")
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "")
    .slice(0, 40) || "unknown";

  return (
    <main className="min-h-screen bg-cream-100 p-4 sm:p-6">
      <div className="mx-auto max-w-xl">
        <EmbedForm partner={partner} />
      </div>
    </main>
  );
}

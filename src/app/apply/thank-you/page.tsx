import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Application received · Goldstay",
  robots: { index: false, follow: false },
};

export default function ApplyThankYouPage() {
  return (
    <main className="section bg-cream pt-32 md:pt-40">
      <div className="container-gs">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-gold-500 text-charcoal">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h1 className="mt-8 font-serif text-display-md text-charcoal balance md:text-display-lg">
            Thank you. Your application is with Goldstay.
          </h1>
          <p className="mt-5 text-lg text-charcoal/75 pretty">
            We review every application by hand. A Goldstay associate will call
            or WhatsApp you within one business day to confirm a few details and
            schedule reference calls with your employer and previous landlord.
          </p>
          <p className="mt-4 text-charcoal/70">
            If anything urgent changes in the meantime, reply on the WhatsApp
            thread where you got this link.
          </p>
          <div className="mt-10">
            <Link href="/" className="btn-secondary">
              Back to Goldstay
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

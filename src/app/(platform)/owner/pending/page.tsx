// /owner/pending — landing surface for landlords who are signed in
// to Supabase but not yet linked to an Owner row in our DB. Hit when:
//   1. A new landlord lands on /login before Goldstay has manually
//      created their Owner row (typo'd email at signup, onboarding
//      paperwork still pending, etc.)
//   2. A signed-in user tries to deep-link to a portal route their
//      account isn't entitled to. requireOwner() redirects them here
//      rather than to /owner so the pending state is the same URL
//      every time.
//
// Intentionally not gated by requireOwner() (which would loop). It is
// gated by the platform middleware, so anonymous traffic still
// bounces to /login first.

import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { Mail } from "lucide-react";

export const dynamic = "force-dynamic";

const SUPPORT_EMAIL = "hello@goldstay.co.ke";

export default async function OwnerPendingPage() {
  const user = await requireUser();

  return (
    <div className="mx-auto max-w-2xl py-6">
      <div className="rounded-lg border border-stone-200 bg-white p-8 shadow-sm">
        <p className="text-xs uppercase tracking-wider text-stone-500">
          Account in review
        </p>
        <h1 className="mt-2 text-2xl font-serif text-stone-900">
          We are verifying your account
        </h1>
        <p className="mt-4 text-stone-600">
          You are signed in as{" "}
          <span className="font-medium text-stone-900">{user.email}</span>,
          but we have not finished linking this email to a portfolio yet.
        </p>
        <p className="mt-3 text-stone-600">
          Goldstay onboards every landlord by hand so the right title
          deeds, leases, and bank details are in place from day one.
          You should hear from us within{" "}
          <span className="font-medium text-stone-900">24 hours</span>.
        </p>

        <div className="mt-6 rounded-md border border-stone-200 bg-stone-50 p-4 text-sm text-stone-700">
          <p className="font-medium text-stone-900">
            What happens next
          </p>
          <ol className="mt-3 space-y-2 list-decimal pl-5 text-stone-600">
            <li>
              Our onboarding team verifies your identity and the
              property documents you shared.
            </li>
            <li>
              We add your portfolio (properties, units, current
              tenancies) to your dashboard.
            </li>
            <li>
              You receive an email when the dashboard is live; sign
              in again and everything will be there.
            </li>
          </ol>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <a
            href={`mailto:${SUPPORT_EMAIL}?subject=Goldstay%20account%20status%20-%20${encodeURIComponent(
              user.email ?? "",
            )}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-stone-900 hover:underline"
          >
            <Mail className="h-4 w-4" aria-hidden />
            Email {SUPPORT_EMAIL}
          </a>
          <form action="/auth/sign-out" method="post">
            <button
              type="submit"
              className="rounded-md border border-stone-300 px-3 py-1.5 text-sm text-stone-700 hover:bg-white"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-stone-500">
        It has been more than 24 hours? Email{" "}
        <Link
          href={`mailto:${SUPPORT_EMAIL}`}
          className="text-stone-700 underline-offset-2 hover:underline"
        >
          {SUPPORT_EMAIL}
        </Link>{" "}
        and we will respond the same day.
      </p>
    </div>
  );
}

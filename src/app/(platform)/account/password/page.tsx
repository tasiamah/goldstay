// /account/password
//
// Where signed-in users (admins or owners) set or change their
// account password. Two main entry points:
//
//   1. The "Forgot password?" / "Set your password" recovery email
//      lands on /auth/callback, which then bounces here once the
//      session is established. The user lands signed-in but in the
//      Supabase PASSWORD_RECOVERY mode and is expected to save a
//      new password before doing anything else.
//
//   2. A logged-in user who just wants to rotate their password can
//      navigate here directly from the account menu (added later).
//
// We require a session — without one there's nothing to update —
// and bounce unauthed visitors back to /login with this page as the
// post-auth target.

import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { SetPasswordForm } from "./SetPasswordForm";

export const metadata: Metadata = {
  title: "Set your password",
  description: "Set or change the password on your Goldstay account.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function SetPasswordPage({
  searchParams,
}: {
  searchParams?: { next?: string };
}) {
  const user = await requireUser();

  // ?next= is forwarded all the way from the original sign-in/recovery
  // request (LoginForm → resetPasswordForEmail → /auth/callback →
  // here) so we can deep-link the user back to whatever they were
  // trying to reach before being asked to set a password. Validated
  // to a same-origin path inside the form's server action.
  const next = searchParams?.next;

  return (
    <div className="min-h-screen">
      <header className="px-6 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-stone-600 transition-colors hover:text-stone-900"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M10 12L6 8l4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Goldstay
        </Link>
      </header>

      <div className="mx-auto flex min-h-[60vh] w-full max-w-md flex-col justify-center px-6 py-12">
        <h1 className="text-3xl font-serif text-stone-900">
          Set your password
        </h1>
        <p className="mt-2 text-sm text-stone-600">
          Signed in as <strong>{user.email}</strong>. Choose a password of at
          least 8 characters. You can use this password to sign in instantly
          next time, instead of waiting for an email link.
        </p>

        <div className="mt-8">
          <SetPasswordForm next={next} />
        </div>
      </div>
    </div>
  );
}

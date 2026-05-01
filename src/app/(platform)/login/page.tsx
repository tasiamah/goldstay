import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Owner login",
  description:
    "Sign in to the Goldstay owner platform to track your properties, leases, and monthly statements.",
  robots: { index: false, follow: false },
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string; error?: string; sent?: string };
}) {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-6 py-16">
      <h1 className="text-3xl font-serif text-stone-900">Owner sign in</h1>
      <p className="mt-3 text-stone-600">
        Enter the email address Goldstay has on file. We will send you a
        one-tap sign-in link. No password required.
      </p>

      {searchParams.sent ? (
        <div className="mt-8 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          Check your inbox. The sign-in link expires in 60 minutes.
        </div>
      ) : (
        <div className="mt-8">
          <LoginForm next={searchParams.next} />
        </div>
      )}

      {searchParams.error ? (
        <p className="mt-6 text-sm text-red-700">
          We could not sign you in: {searchParams.error}
        </p>
      ) : null}
    </div>
  );
}

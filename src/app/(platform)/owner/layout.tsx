import Link from "next/link";
import { requireUser } from "@/lib/auth";

export default async function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <header className="mb-10 flex items-center justify-between border-b border-stone-200 pb-6">
        <div>
          <p className="text-xs uppercase tracking-wider text-stone-500">
            Landlord portal
          </p>
          <h1 className="mt-1 text-2xl font-serif text-stone-900">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-stone-500">{user.email}</p>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/owner"
            className="text-stone-700 hover:text-stone-900"
          >
            Overview
          </Link>
          <Link
            href="/owner/transactions"
            className="text-stone-700 hover:text-stone-900"
          >
            Transactions
          </Link>
          <Link
            href="/owner/statements"
            className="text-stone-700 hover:text-stone-900"
          >
            Statements
          </Link>
          <form action="/auth/sign-out" method="post">
            <button
              type="submit"
              className="rounded-md border border-stone-300 px-3 py-1.5 text-stone-700 hover:bg-white"
            >
              Sign out
            </button>
          </form>
        </nav>
      </header>
      {children}
    </div>
  );
}

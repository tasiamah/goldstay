// Layout for every /owner/* surface.
//
// We do one extra Owner lookup here on top of requireUser() so the
// nav can drop the Transactions / Statements links for landlords
// who are still in the pending state. Showing a nav full of links
// that all bounce back to /owner/pending is confusing; better to
// hide them entirely until the account is wired up.
//
// The Owner lookup mirrors the one in requireOwner() — match by
// authUserId first, fall back to email — so a single source of
// truth for "is this user a real owner?" without two round-trips.

import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  const owner = user.email
    ? await prisma.owner.findFirst({
        where: {
          OR: [{ authUserId: user.id }, { email: user.email }],
        },
        select: { id: true },
      })
    : null;
  const isLinkedOwner = Boolean(owner);

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
          {isLinkedOwner ? (
            <>
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
            </>
          ) : null}
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

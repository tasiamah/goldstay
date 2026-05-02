// Layout for every /owner/* surface.
//
// We do one extra Owner lookup here on top of requireUser() so the
// nav can drop the Statements / Payouts / Profile links for
// landlords who are still in the pending state. Showing a nav full
// of links that all bounce back to /owner/pending is confusing;
// better to hide them entirely until the account is wired up.
//
// The Owner lookup mirrors the one in requireOwner() — match by
// authUserId first, fall back to email — so a single source of
// truth for "is this user a real owner?" without two round-trips.

import Link from "next/link";
import { getCurrentOwner, requireUser } from "@/lib/auth";
import { ImpersonationBanner } from "@/components/admin/ImpersonationBanner";
import { NotificationBell } from "@/components/owner/NotificationBell";
import { listOwnerNotifications } from "@/lib/notifications/list";

export default async function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  // Same cached helper requireOwner() uses, so the page's later
  // call doesn't re-hit Prisma — one Owner round-trip per request.
  const owner = await getCurrentOwner();
  const isLinkedOwner = Boolean(owner);

  // The bell reads whatever the dashboard sync most recently wrote
  // to OwnerNotification. We don't sync here — that runs on /owner
  // — so the bell on a deep page can be at most one navigation
  // stale. Acceptable for a notifications surface and saves four
  // round-trips on every layout render.
  const notifications =
    isLinkedOwner && owner
      ? await listOwnerNotifications(owner.id)
      : { items: [], unreadCount: 0 };

  // First name only — full names look formal in a header. Falls
  // back to "back" so an unlinked Supabase user still gets a clean
  // "Welcome back" rather than "Welcome back, undefined".
  const firstName = owner?.fullName?.trim().split(/\s+/)[0] ?? null;

  // Owner navigation links. Defined once so the desktop nav and the
  // mobile menu render the same set without drift. Sign-out stays as a
  // POST form (it always has) so it lives outside this list.
  const navLinks: ReadonlyArray<{ href: string; label: string }> = isLinkedOwner
    ? [
        { href: "/owner", label: "Overview" },
        { href: "/owner/statements", label: "Statements" },
        { href: "/owner/account", label: "Account" },
      ]
    : [];

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <ImpersonationBanner />
      <header className="mb-10 border-b border-stone-200 pb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wider text-stone-500">
              Owner portal
            </p>
            <h1 className="mt-1 text-2xl font-serif text-stone-900">
              {firstName ? `Welcome back, ${firstName}` : "Welcome back"}
            </h1>
            <p className="mt-1 truncate text-sm text-stone-500">{user.email}</p>
          </div>

          {/* Mobile-only controls: bell stays visible (notifications
              matter), the rest of the nav collapses into a hamburger
              powered by a <details> element so we don't ship a client
              component just for show/hide. */}
          <div className="flex items-center gap-2 md:hidden">
            {isLinkedOwner ? (
              <NotificationBell
                items={notifications.items}
                unreadCount={notifications.unreadCount}
              />
            ) : null}
            <details className="relative">
              <summary
                aria-label="Open menu"
                className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-md border border-stone-300 text-stone-700 hover:bg-white [&::-webkit-details-marker]:hidden"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </summary>
              <div className="absolute right-0 z-30 mt-2 w-56 rounded-md border border-stone-200 bg-white p-1 shadow-lg">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block rounded px-3 py-2 text-sm text-stone-700 hover:bg-stone-100"
                  >
                    {link.label}
                  </Link>
                ))}
                {isLinkedOwner ? (
                  <hr className="my-1 border-stone-200" />
                ) : null}
                <form action="/auth/sign-out" method="post">
                  <button
                    type="submit"
                    className="block w-full rounded px-3 py-2 text-left text-sm text-stone-700 hover:bg-stone-100"
                  >
                    Sign out
                  </button>
                </form>
              </div>
            </details>
          </div>

          {/* Desktop nav — same links inline, plus bell and sign-out. */}
          <nav className="hidden items-center gap-4 text-sm md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-stone-700 hover:text-stone-900"
              >
                {link.label}
              </Link>
            ))}
            {isLinkedOwner ? (
              <NotificationBell
                items={notifications.items}
                unreadCount={notifications.unreadCount}
              />
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
        </div>
      </header>
      {children}
    </div>
  );
}

// First-login welcome panel for new admins. Mirrors the owner
// welcome card pattern but tuned for ops:
//
//   * pointers to the four most-used surfaces (Owners, Properties,
//     Tasks, Health), so a new hire can orient inside 30 seconds
//   * a "what gets logged" line about the audit trail, because new
//     hires often hesitate before clicking buttons until they know
//     it's safe to experiment
//   * dismissed via a server action that sets
//     AdminUser.welcomeCompletedAt; the card never reappears
//
// Read-only when role === SUPPORT (they don't see Tasks/Team), but
// the card itself is rendered for everyone on first login.

import Link from "next/link";
import type { AdminUser } from "@prisma/client";
import { dismissAdminWelcomeAction } from "./actions";

const QUICK_LINKS: ReadonlyArray<{ href: string; label: string; hint: string }> =
  [
    {
      href: "/admin/owners",
      label: "Owners",
      hint: "Add an owner, send the welcome email, and verify their first property here.",
    },
    {
      href: "/admin/properties",
      label: "Properties",
      hint: "Search across the portfolio. Each row links to documents, lease/booking, and statements.",
    },
    {
      href: "/admin/tasks",
      label: "Tasks",
      hint: "Personal follow-ups and anything pinned to an owner or property.",
    },
    {
      href: "/admin/health",
      label: "Health",
      hint: "Cron success rate and last-error per integration. Glance once a day.",
    },
  ];

export function AdminWelcomeCard({ admin }: { admin: AdminUser }) {
  if (admin.welcomeCompletedAt) return null;

  return (
    <section className="rounded-lg border border-stone-200 bg-stone-50 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-stone-500">
            Welcome to Goldstay ops
          </p>
          <h2 className="mt-1 font-serif text-2xl text-stone-900">
            Hi {admin.fullName.split(" ")[0]}.
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-stone-600">
            This is the operations cockpit. Every mutation in here writes
            an audit row attributed to your email, so it's safe to click
            around and learn the surface. Below are the four places you
            will live.
          </p>
        </div>
        <form action={dismissAdminWelcomeAction}>
          <button
            type="submit"
            className="shrink-0 rounded-md bg-stone-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-800"
          >
            Got it, hide this
          </button>
        </form>
      </div>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {QUICK_LINKS.map((link) => (
          <li
            key={link.href}
            className="rounded-md border border-stone-200 bg-white p-4"
          >
            <Link
              href={link.href}
              className="font-medium text-stone-900 hover:underline"
            >
              {link.label} →
            </Link>
            <p className="mt-1 text-xs text-stone-600">{link.hint}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

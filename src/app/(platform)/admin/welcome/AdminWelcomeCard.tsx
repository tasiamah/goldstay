// First-login welcome panel for new admins. Mirrors the owner
// welcome card pattern but tuned for ops:
//
//   * pointers to the surfaces a new hire actually uses in week one,
//     filtered by role so a SUPPORT user doesn't see a Tasks link
//     to a page they have no actions on, or an Imports link for a
//     workflow they can't run
//   * a "what gets logged" line about the audit trail, because new
//     hires often hesitate before clicking buttons until they know
//     it's safe to experiment
//   * dismissed via a server action that sets
//     AdminUser.welcomeCompletedAt; the card never reappears
//
// Permission gating uses the same `can()` matrix as the rest of the
// admin chrome, so the welcome card stays in sync with what AdminNav
// shows. New roles or new actions need only to be added to roles.ts.

import Link from "next/link";
import type { AdminUser } from "@prisma/client";
import { dismissAdminWelcomeAction } from "./actions";
import { can, type AdminAction } from "@/lib/admin/roles";

type QuickLink = {
  href: string;
  label: string;
  hint: string;
  // The role-matrix action that gates visibility. Omit for links
  // that are visible to every admin role (e.g. Owners, Properties,
  // Leads — Lead is not action-gated in the matrix).
  requires?: AdminAction;
};

const QUICK_LINKS: ReadonlyArray<QuickLink> = [
  {
    href: "/admin/owners",
    label: "Owners",
    hint: "Add an owner, send the welcome email, verify their first property here.",
  },
  {
    href: "/admin/properties",
    label: "Properties",
    hint: "Search across the portfolio. Each row links to documents, lease/booking, statements.",
  },
  {
    href: "/admin/leads",
    label: "Leads",
    hint: "Inbound enquiries from /list-your-property and WhatsApp. Convert qualified leads to owners.",
  },
  {
    href: "/admin/transactions",
    label: "Transactions",
    hint: "Every rent, expense, payout and refund. The numbers behind the owner statements.",
    requires: "transaction.read",
  },
  {
    href: "/admin/tasks",
    label: "Tasks",
    hint: "Personal follow-ups and anything pinned to an owner or property.",
    requires: "task.read",
  },
  {
    href: "/admin/owners/import",
    label: "Imports",
    hint: "Bulk-add owners or properties from a CSV. Validates before writing anything.",
    requires: "import.write",
  },
  {
    href: "/admin/health",
    label: "Health",
    hint: "Cron success rate and last-error per integration. Glance once a day.",
    requires: "health.read",
  },
  {
    href: "/admin/archive",
    label: "Archive",
    hint: "Soft-deleted owners, properties and transactions for the last 30 days. Restore from here.",
    requires: "archive.write",
  },
];

export function AdminWelcomeCard({ admin }: { admin: AdminUser }) {
  if (admin.welcomeCompletedAt) return null;

  const visibleLinks = QUICK_LINKS.filter(
    (link) => !link.requires || can(admin.role, link.requires),
  );

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
            an audit row attributed to your email, so it&apos;s safe to click
            around and learn the surface. Below are the places you&apos;ll
            spend most of your time.
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

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {visibleLinks.map((link) => (
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

      <p className="mt-5 text-xs text-stone-500">
        Press <kbd className="rounded border border-stone-300 bg-white px-1 py-0.5 font-sans text-[10px]">⌘</kbd>
        <kbd className="ml-1 rounded border border-stone-300 bg-white px-1 py-0.5 font-sans text-[10px]">K</kbd>{" "}
        anywhere to jump to an owner, property, lease or booking.
      </p>
    </section>
  );
}

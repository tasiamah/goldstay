// /admin/team — operator roster.
//
// SUPER_ADMIN only. Lists every AdminUser (active + archived in two
// sections) with role, country, last-login, and a quick link to the
// detail page.

import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ROLE_LABEL } from "@/lib/admin/roles";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  const me = await requireAdmin();
  if (me.role !== "SUPER_ADMIN") redirect("/admin");

  const admins = await prisma.adminUser.findMany({
    orderBy: [{ archivedAt: "asc" }, { fullName: "asc" }],
  });

  const active = admins.filter((a) => !a.archivedAt);
  const archived = admins.filter((a) => a.archivedAt);

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <Breadcrumbs items={[{ label: "Team" }]} />
          <h2 className="mt-2 text-xl font-medium text-stone-900">Team</h2>
          <p className="text-sm text-stone-500">
            Every operator with admin access. Roles are enforced server-side
            on every action; archiving revokes access immediately.
          </p>
        </div>
        <Link
          href="/admin/team/new"
          className="inline-flex items-center rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
        >
          Invite admin
        </Link>
      </div>

      <section className="rounded-lg border border-stone-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-stone-500">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">Last login</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {active.map((a) => (
              <tr
                key={a.id}
                className="border-t border-stone-100 hover:bg-stone-50"
              >
                <td className="px-4 py-3 text-stone-900">
                  {a.fullName}
                  {a.id === me.id ? (
                    <span className="ml-2 text-xs text-stone-400">(you)</span>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-stone-700">{a.email}</td>
                <td className="px-4 py-3 text-stone-700">
                  {ROLE_LABEL[a.role]}
                </td>
                <td className="px-4 py-3 text-stone-700">
                  {a.country ?? <span className="text-stone-400">global</span>}
                </td>
                <td className="px-4 py-3 text-xs text-stone-500">
                  {a.lastLoginAt
                    ? a.lastLoginAt.toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"}
                </td>
                <td className="px-4 py-3 text-right text-sm">
                  <Link
                    href={`/admin/team/${a.id}`}
                    className="text-stone-900 hover:underline"
                  >
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {archived.length > 0 ? (
        <section>
          <h3 className="text-sm font-medium text-stone-700">Archived</h3>
          <ul className="mt-2 divide-y divide-stone-100 rounded-lg border border-stone-200 bg-stone-50">
            {archived.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between px-4 py-3 text-sm"
              >
                <div>
                  <p className="text-stone-700">{a.fullName}</p>
                  <p className="text-xs text-stone-500">
                    {a.email} ·{" "}
                    {a.archivedAt?.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <Link
                  href={`/admin/team/${a.id}`}
                  className="text-xs text-stone-700 hover:underline"
                >
                  View
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

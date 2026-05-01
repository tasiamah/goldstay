// /admin/team/[id] — single-admin detail.
//
// SUPER_ADMIN only. Edit role / country / name, archive (revokes
// access), restore (un-archive), and view their audit history.

import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ALL_ROLES, ROLE_LABEL } from "@/lib/admin/roles";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { ActivityTimeline } from "@/components/admin/ActivityTimeline";
import {
  archiveAdminAction,
  restoreAdminAction,
  updateAdminAction,
} from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const me = await requireAdmin();
  if (me.role !== "SUPER_ADMIN") redirect("/admin");

  const target = await prisma.adminUser.findUnique({
    where: { id: params.id },
  });
  if (!target) notFound();

  const updateBound = updateAdminAction.bind(null, target.id);
  const archiveBound = archiveAdminAction.bind(null, target.id);
  const restoreBound = restoreAdminAction.bind(null, target.id);

  return (
    <div className="space-y-8">
      <div>
        <Breadcrumbs
          items={[
            { label: "Team", href: "/admin/team" },
            { label: target.fullName },
          ]}
        />
        <div className="mt-2 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-medium text-stone-900">
              {target.fullName}
            </h2>
            <p className="text-sm text-stone-500">
              {target.email} · {ROLE_LABEL[target.role]}
              {target.country ? ` (${target.country})` : ""}
              {target.archivedAt ? (
                <span className="ml-2 inline-flex items-center rounded bg-stone-200 px-2 py-0.5 text-xs uppercase tracking-wider text-stone-700">
                  Archived
                </span>
              ) : null}
            </p>
            <p className="mt-1 text-xs text-stone-500">
              Last login{" "}
              {target.lastLoginAt
                ? target.lastLoginAt.toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "—"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {target.archivedAt ? (
              <form action={restoreBound}>
                <button
                  type="submit"
                  className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-900 hover:bg-emerald-100"
                >
                  Restore access
                </button>
              </form>
            ) : target.id === me.id ? (
              <span className="text-xs text-stone-400">
                You can&apos;t archive your own account
              </span>
            ) : (
              <form action={archiveBound}>
                <button
                  type="submit"
                  className="rounded-md border border-red-300 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-900 hover:bg-red-100"
                >
                  Archive
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <section className="rounded-lg border border-stone-200 bg-white p-6">
        <h3 className="text-base font-medium text-stone-900">Edit details</h3>
        <form action={updateBound} className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="text-xs uppercase tracking-wider text-stone-500">
              Full name
            </span>
            <input
              name="fullName"
              defaultValue={target.fullName}
              required
              minLength={2}
              className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-stone-500">
              Role
            </span>
            <select
              name="role"
              defaultValue={target.role}
              className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
            >
              {ALL_ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABEL[r]}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-stone-500">
              Country
            </span>
            <select
              name="country"
              defaultValue={target.country ?? ""}
              className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
            >
              <option value="">Global</option>
              <option value="KE">Kenya</option>
              <option value="GH">Ghana</option>
            </select>
          </label>
          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
            >
              Save changes
            </button>
          </div>
        </form>
      </section>

      <ActivityTimeline entity="ADMIN_USER" entityId={target.id} />
    </div>
  );
}

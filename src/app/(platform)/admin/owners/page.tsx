import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  formatOwnerDisplayName,
  formatOwnerSecondaryName,
} from "@/lib/format-owner";

export const dynamic = "force-dynamic";

export default async function OwnersListPage() {
  const owners = await prisma.owner.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { properties: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium text-stone-900">Owners</h2>
          <p className="text-sm text-stone-500">
            {owners.length} {owners.length === 1 ? "landlord" : "landlords"} in
            the platform
          </p>
        </div>
        <Link
          href="/admin/owners/new"
          className="inline-flex items-center rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
        >
          Add owner
        </Link>
      </div>

      {owners.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
          <table className="min-w-full divide-y divide-stone-200">
            <thead className="bg-stone-50">
              <tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Country</Th>
                <Th align="right">Properties</Th>
                <Th>Joined</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {owners.map((o) => {
                const secondary = formatOwnerSecondaryName(o);
                return (
                <tr key={o.id} className="hover:bg-stone-50/60">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/owners/${o.id}`}
                      className="font-medium text-stone-900 hover:underline"
                    >
                      {formatOwnerDisplayName(o)}
                    </Link>
                    {secondary ? (
                      <p className="text-xs text-stone-500">{secondary}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-sm text-stone-700">
                    {o.email}
                  </td>
                  <td className="px-4 py-3 text-sm text-stone-700">
                    {o.country === "KE" ? "Kenya" : "Ghana"}
                  </td>
                  <td className="px-4 py-3 text-right text-sm tabular-nums text-stone-700">
                    {o._count.properties}
                  </td>
                  <td className="px-4 py-3 text-sm text-stone-500">
                    {o.createdAt.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Th({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-4 py-2 text-${align} text-xs font-semibold uppercase tracking-wider text-stone-500`}
    >
      {children}
    </th>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-stone-300 bg-white p-10 text-center">
      <h3 className="text-base font-medium text-stone-900">No owners yet</h3>
      <p className="mt-1 text-sm text-stone-500">
        Add your first landlord to start tracking properties and leases.
      </p>
      <Link
        href="/admin/owners/new"
        className="mt-4 inline-flex items-center rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
      >
        Add owner
      </Link>
    </div>
  );
}

// /admin/archive — restore window for soft-deleted rows.
//
// Lists every archived owner, property, lease, transaction in one
// place, ordered most-recently-archived first. Restore returns the
// row to default queries; archived rows older than the 30-day window
// stay visible but the restore button is disabled (a future cleanup
// job will hard-delete them, but we don't run one yet).

import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { ArchiveRow } from "./ArchiveRow";
import {
  ARCHIVE_RESTORE_WINDOW_DAYS,
  isWithinRestoreWindow,
} from "@/lib/admin/archive";
import { formatOwnerDisplayName } from "@/lib/format-owner";
import { formatPropertyDisplayName } from "@/lib/format-property";

export const dynamic = "force-dynamic";

export default async function AdminArchivePage() {
  await requireRole("archive.write");

  const [owners, properties, leases, transactions] = await Promise.all([
    prisma.owner.findMany({
      where: { archivedAt: { not: null } },
      orderBy: { archivedAt: "desc" },
      select: {
        id: true,
        fullName: true,
        companyName: true,
        email: true,
        archivedAt: true,
      },
    }),
    prisma.property.findMany({
      where: { archivedAt: { not: null } },
      orderBy: { archivedAt: "desc" },
      select: {
        id: true,
        name: true,
        unitNumber: true,
        city: true,
        archivedAt: true,
      },
    }),
    prisma.lease.findMany({
      where: { archivedAt: { not: null } },
      orderBy: { archivedAt: "desc" },
      select: {
        id: true,
        tenantName: true,
        unit: { select: { label: true, property: { select: { name: true } } } },
        archivedAt: true,
      },
    }),
    prisma.transaction.findMany({
      where: { archivedAt: { not: null } },
      orderBy: { archivedAt: "desc" },
      select: {
        id: true,
        amount: true,
        currency: true,
        type: true,
        occurredOn: true,
        archivedAt: true,
        property: { select: { name: true } },
      },
    }),
  ]);

  const now = new Date();
  const totalCount =
    owners.length + properties.length + leases.length + transactions.length;

  return (
    <div className="space-y-8">
      <div>
        <Breadcrumbs items={[{ label: "Archive" }]} />
        <h2 className="mt-2 text-xl font-medium text-stone-900">Archive</h2>
        <p className="text-sm text-stone-500">
          Soft-deleted rows. Restore is available for{" "}
          {ARCHIVE_RESTORE_WINDOW_DAYS} days from the archive timestamp.
          {totalCount === 0 ? " Nothing currently archived." : null}
        </p>
      </div>

      <ArchiveSection
        title="Owners"
        emptyHint="No archived owners."
        rows={owners.map((o) => ({
          id: o.id,
          entity: "OWNER" as const,
          label: formatOwnerDisplayName(o),
          hint: o.email,
          archivedAt: o.archivedAt,
          restorable: isWithinRestoreWindow(o.archivedAt, now),
          returnPath: `/admin/owners/${o.id}`,
        }))}
      />

      <ArchiveSection
        title="Properties"
        emptyHint="No archived properties."
        rows={properties.map((p) => ({
          id: p.id,
          entity: "PROPERTY" as const,
          label: formatPropertyDisplayName(p.name, p.unitNumber),
          hint: p.city,
          archivedAt: p.archivedAt,
          restorable: isWithinRestoreWindow(p.archivedAt, now),
          returnPath: `/admin/properties/${p.id}`,
        }))}
      />

      <ArchiveSection
        title="Leases"
        emptyHint="No archived leases."
        rows={leases.map((l) => ({
          id: l.id,
          entity: "LEASE" as const,
          label: l.tenantName,
          hint: `${l.unit.property.name} · ${l.unit.label}`,
          archivedAt: l.archivedAt,
          restorable: isWithinRestoreWindow(l.archivedAt, now),
          returnPath: `/admin/leases/${l.id}`,
        }))}
      />

      <ArchiveSection
        title="Transactions"
        emptyHint="No archived transactions."
        rows={transactions.map((t) => ({
          id: t.id,
          entity: "TRANSACTION" as const,
          label: `${t.currency} ${Number(t.amount).toLocaleString("en-GB", { minimumFractionDigits: 2 })}`,
          hint: `${t.property.name} · ${t.occurredOn.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} · ${t.type}`,
          archivedAt: t.archivedAt,
          restorable: isWithinRestoreWindow(t.archivedAt, now),
          returnPath: `/admin/transactions/${t.id}`,
        }))}
      />
    </div>
  );
}

function ArchiveSection({
  title,
  emptyHint,
  rows,
}: {
  title: string;
  emptyHint: string;
  rows: Array<{
    id: string;
    entity: "OWNER" | "PROPERTY" | "LEASE" | "TRANSACTION";
    label: string;
    hint: string;
    archivedAt: Date | null;
    restorable: boolean;
    returnPath: string;
  }>;
}) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-medium text-stone-900">{title}</h3>
        <span className="text-xs uppercase tracking-wider text-stone-500">
          {rows.length} {rows.length === 1 ? "row" : "rows"}
        </span>
      </div>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-stone-500">{emptyHint}</p>
      ) : (
        <ul className="mt-3 divide-y divide-stone-100">
          {rows.map((r) => (
            <li
              key={`${r.entity}:${r.id}`}
              className="flex items-start justify-between gap-3 py-3"
            >
              <div>
                <Link
                  href={r.returnPath}
                  className="text-sm font-medium text-stone-900 hover:underline"
                >
                  {r.label}
                </Link>
                <p className="text-xs text-stone-500">
                  {r.hint} · archived{" "}
                  {r.archivedAt?.toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <ArchiveRow
                entity={r.entity}
                id={r.id}
                returnPath="/admin/archive"
                restorable={r.restorable}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

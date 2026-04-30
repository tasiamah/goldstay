// /owner/properties/[id] — drill-down for a single property in the
// landlord's portfolio. Read-only: listing the units, the active
// leases, the documents, and the full transaction history (newest
// first) for that one property. The dashboard sends them here when
// they click on a property name.
//
// We use findFirst with a scoped where clause (id + ownerId) so a
// landlord can never load another landlord's property by guessing
// the cuid. Returns notFound() instead of 403 to avoid leaking
// existence.

import Link from "next/link";
import { notFound } from "next/navigation";
import { requireOwner } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { occupancyPercent } from "@/lib/owner-dashboard";

const DOCUMENT_KIND_LABELS: Record<string, string> = {
  TITLE_DEED: "Title deed",
  SALE_AGREEMENT: "Sale agreement",
  LEASE: "Lease",
  KYC: "KYC",
  INVOICE: "Invoice",
  RECEIPT: "Receipt",
  STATEMENT: "Statement",
  PHOTO: "Photo",
  OTHER: "Other",
};

export const dynamic = "force-dynamic";

export default async function OwnerPropertyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { owner } = await requireOwner();

  const property = await prisma.property.findFirst({
    where: { id: params.id, ownerId: owner.id },
    include: {
      units: {
        orderBy: { createdAt: "asc" },
        include: {
          leases: {
            where: { status: "ACTIVE" },
            select: {
              id: true,
              tenantName: true,
              startDate: true,
              endDate: true,
              monthlyRent: true,
              currency: true,
            },
          },
        },
      },
      documents: {
        orderBy: { createdAt: "desc" },
      },
      transactions: {
        orderBy: { occurredOn: "desc" },
        take: 100,
        include: {
          lease: { select: { tenantName: true } },
        },
      },
    },
  });

  if (!property) notFound();

  const occupied = property.units.filter(
    (u) => u.status === "OCCUPIED",
  ).length;
  const occPct = occupancyPercent({
    totalUnits: property.units.length,
    occupiedUnits: occupied,
  });

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/owner"
          className="text-sm text-stone-500 hover:text-stone-900"
        >
          ← Overview
        </Link>
        <h2 className="mt-2 text-2xl font-serif text-stone-900">
          {property.name}
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          {property.neighbourhood ? `${property.neighbourhood}, ` : ""}
          {property.city} ·{" "}
          {property.country === "KE" ? "Kenya" : "Ghana"} ·{" "}
          <span className="text-xs uppercase tracking-wider">
            {property.status}
          </span>
        </p>
      </div>

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Units" value={property.units.length} />
        <Stat label="Occupied" value={occupied} />
        <Stat
          label="Occupancy"
          value={occPct === null ? "—" : `${occPct}%`}
        />
        <Stat label="Bedrooms" value={property.bedrooms ?? "—"} />
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <Card title="Units">
          {property.units.length === 0 ? (
            <p className="mt-4 text-sm text-stone-500">
              No units recorded for this property yet.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-stone-100">
              {property.units.map((u) => {
                const activeLease = u.leases[0];
                return (
                  <li key={u.id} className="py-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-stone-900">
                        {u.label}
                      </span>
                      <span className="text-xs uppercase tracking-wider text-stone-500">
                        {u.status}
                      </span>
                    </div>
                    {activeLease ? (
                      <p className="mt-1 text-xs text-stone-500">
                        {activeLease.tenantName} ·{" "}
                        {fmt(Number(activeLease.monthlyRent))}{" "}
                        {activeLease.currency}/mo · since{" "}
                        {activeLease.startDate.toLocaleDateString("en-GB", {
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    ) : (
                      <p className="mt-1 text-xs text-stone-500">
                        No active lease
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card title="Documents">
          {property.documents.length === 0 ? (
            <p className="mt-4 text-sm text-stone-500">
              Goldstay has not uploaded any paperwork for this property
              yet. Title deeds, sale agreements, and leases will appear
              here as they are filed.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-stone-100">
              {property.documents.map((d) => (
                <li
                  key={d.id}
                  className="flex items-start justify-between gap-4 py-3"
                >
                  <div className="min-w-0">
                    <a
                      href={`/owner/documents/${d.id}/download`}
                      target="_blank"
                      rel="noopener"
                      className="block truncate font-medium text-stone-900 hover:underline"
                    >
                      {d.title}
                    </a>
                    <p className="mt-0.5 text-xs text-stone-500">
                      {DOCUMENT_KIND_LABELS[d.kind] ?? d.kind}
                      {d.sizeBytes
                        ? ` · ${formatBytes(d.sizeBytes)}`
                        : ""}
                      {" · "}
                      {d.createdAt.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>

      <Card title="Transaction history">
        <p className="mt-1 text-sm text-stone-500">
          Up to the last 100 transactions for this property. Need a
          formal record? Download the{" "}
          <Link
            href="/owner/statements"
            className="text-stone-900 underline-offset-2 hover:underline"
          >
            monthly statement PDF
          </Link>
          .
        </p>
        {property.transactions.length === 0 ? (
          <p className="mt-4 text-sm text-stone-500">
            No transactions recorded yet for this property.
          </p>
        ) : (
          <div className="mt-4 overflow-hidden rounded-md border border-stone-200">
            <table className="min-w-full divide-y divide-stone-200">
              <thead className="bg-stone-50">
                <tr>
                  <Th>Date</Th>
                  <Th>Type</Th>
                  <Th>Detail</Th>
                  <Th align="right">Amount</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 bg-white">
                {property.transactions.map((t) => (
                  <tr key={t.id}>
                    <td className="px-4 py-2.5 text-sm text-stone-700">
                      {t.occurredOn.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-2.5 text-sm text-stone-700">
                      {t.type.replace(/_/g, " ")}
                    </td>
                    <td className="px-4 py-2.5 text-sm text-stone-500">
                      {[t.description, t.lease?.tenantName, t.reference]
                        .filter(Boolean)
                        .join(" · ") || "—"}
                    </td>
                    <td
                      className={`px-4 py-2.5 text-right text-sm tabular-nums ${
                        t.direction === "INFLOW"
                          ? "text-emerald-700"
                          : "text-red-700"
                      }`}
                    >
                      {t.direction === "INFLOW" ? "+" : "−"}
                      {fmt(Number(t.amount))} {t.currency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5">
      <p className="text-xs uppercase tracking-wider text-stone-500">
        {label}
      </p>
      <p className="mt-2 text-xl font-serif text-stone-900">{value}</p>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-6">
      <h3 className="text-base font-medium text-stone-900">{title}</h3>
      {children}
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

function fmt(n: number): string {
  return n.toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

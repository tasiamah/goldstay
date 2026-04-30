import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PropertyForm } from "../PropertyForm";
import { updatePropertyAction } from "../actions";
import { DocumentUploader } from "./documents/DocumentUploader";
import { DeleteDocumentButton } from "./documents/DeleteDocumentButton";
import { PropertyStatusBadge } from "@/components/PropertyStatusBadge";

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

export default async function PropertyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const property = await prisma.property.findUnique({
    where: { id: params.id },
    include: {
      owner: {
        select: { id: true, fullName: true, country: true },
      },
      // We don't surface units in the UI any more (one property is
      // one rental) but we still walk them to find the active lease,
      // because Lease FKs into Unit, not Property.
      units: {
        orderBy: { createdAt: "asc" },
        include: {
          leases: {
            where: { status: "ACTIVE" },
            orderBy: { startDate: "desc" },
            take: 1,
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
    },
  });

  if (!property) notFound();

  const activeLease = property.units.flatMap((u) => u.leases)[0] ?? null;

  const boundUpdate = updatePropertyAction.bind(null, property.id);

  // Decimal serialises to string on the wire; convert for the form
  // value so the input doesn't crash on a Prisma Decimal instance.
  const acquisitionPrice = property.acquisitionPrice
    ? property.acquisitionPrice.toString()
    : null;

  return (
    <div className="space-y-8">
      <div>
        <Link
          href={`/admin/owners/${property.owner.id}`}
          className="text-sm text-stone-500 hover:text-stone-900"
        >
          ← {property.owner.fullName}
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-medium text-stone-900">
            {property.name}
          </h2>
          <PropertyStatusBadge status={property.status} />
        </div>
        <p className="text-sm text-stone-500">
          {property.neighbourhood ? `${property.neighbourhood}, ` : ""}
          {property.city} ·{" "}
          {property.country === "KE" ? "Kenya" : "Ghana"}
        </p>
      </div>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-lg border border-stone-200 bg-white p-6">
          <h3 className="text-base font-medium text-stone-900">Details</h3>
          <p className="mt-1 text-sm text-stone-500">
            Updates are visible to the landlord on next page load.
          </p>
          <div className="mt-5">
            <PropertyForm
              action={boundUpdate}
              ownerCountry={property.owner.country}
              defaults={{
                ownerId: property.owner.id,
                name: property.name,
                city: property.city,
                neighbourhood: property.neighbourhood,
                address: property.address,
                description: property.description,
                bedrooms: property.bedrooms,
                bathrooms: property.bathrooms,
                sizeSqm: property.sizeSqm,
                acquiredOn: property.acquiredOn,
                acquisitionPrice,
                acquisitionCurrency: property.acquisitionCurrency,
                status: property.status,
              }}
              submitLabel="Save changes"
              showStatusField
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-stone-200 bg-white p-6">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-base font-medium text-stone-900">
                Tenancy
              </h3>
              {activeLease ? (
                <Link
                  href={`/admin/leases/${activeLease.id}`}
                  className="text-sm text-stone-600 hover:text-stone-900"
                >
                  Manage lease
                </Link>
              ) : (
                <Link
                  href={`/admin/properties/${property.id}/leases/new`}
                  className="inline-flex items-center rounded-md bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800"
                >
                  + Start lease
                </Link>
              )}
            </div>
            {activeLease ? (
              <div className="mt-4 space-y-1">
                <p className="font-medium text-stone-900">
                  {activeLease.tenantName}
                </p>
                <p className="text-sm text-stone-500">
                  {activeLease.currency}{" "}
                  {Number(activeLease.monthlyRent).toLocaleString("en-GB")}/mo
                  {" · since "}
                  {activeLease.startDate.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                  {activeLease.endDate
                    ? ` → ${activeLease.endDate.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}`
                    : " · ongoing"}
                </p>
              </div>
            ) : (
              <p className="mt-4 text-sm text-stone-500">
                No active lease. Click{" "}
                <span className="font-medium text-stone-700">Start lease</span>{" "}
                to record a new tenant.
              </p>
            )}
          </div>

          <div className="rounded-lg border border-stone-200 bg-white p-6">
            <h3 className="text-base font-medium text-stone-900">
              Documents
            </h3>
            <p className="mt-1 text-sm text-stone-500">
              Title deeds, sale agreements, leases, invoices, and any
              other paperwork backing this property. Visible to the
              landlord on their portal.
            </p>

            <div className="mt-5 border-b border-stone-100 pb-5">
              <DocumentUploader propertyId={property.id} />
            </div>

            {property.documents.length === 0 ? (
              <p className="mt-5 text-sm text-stone-500">
                No documents uploaded yet.
              </p>
            ) : (
              <ul className="mt-5 divide-y divide-stone-100">
                {property.documents.map((d) => (
                  <li
                    key={d.id}
                    className="flex items-start justify-between gap-4 py-3"
                  >
                    <div className="min-w-0">
                      <a
                        href={`/admin/documents/${d.id}/download`}
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
                    <DeleteDocumentButton
                      documentId={d.id}
                      title={d.title}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

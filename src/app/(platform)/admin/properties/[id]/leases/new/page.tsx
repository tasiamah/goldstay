// /admin/properties/[id]/leases/new — start a lease against a
// property. Behind the scenes we resolve the property's implicit
// "Whole property" unit and reuse the existing LeaseForm wired to
// createLeaseAction; the unitId moves into a hidden field so the
// admin never sees the concept.

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getOrCreateImplicitUnitId } from "@/lib/property-unit";
import { LeaseForm } from "../../../../leases/LeaseForm";
import { createLeaseAction } from "../../../../leases/actions";

export const dynamic = "force-dynamic";

export default async function NewLeaseForPropertyPage({
  params,
}: {
  params: { id: string };
}) {
  const property = await prisma.property.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      country: true,
      owner: { select: { preferredCurrency: true } },
      units: {
        select: {
          id: true,
          leases: {
            where: { status: "ACTIVE" },
            select: { id: true },
          },
        },
      },
    },
  });
  if (!property) notFound();

  // Single-rental rule: if there's already an active lease on this
  // property, sending the admin to a fresh form is a footgun. Bounce
  // them to the property page instead, which surfaces the existing
  // lease and an End-lease action.
  const hasActive = property.units.some((u) => u.leases.length > 0);
  if (hasActive) {
    redirect(`/admin/properties/${property.id}`);
  }

  const unitId = await getOrCreateImplicitUnitId(property.id);

  const defaultCurrency =
    property.country === "KE"
      ? "KES"
      : property.country === "GH"
        ? "GHS"
        : (property.owner.preferredCurrency ?? "USD");

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div>
        <Link
          href={`/admin/properties/${property.id}`}
          className="text-sm text-stone-500 hover:text-stone-900"
        >
          ← {property.name}
        </Link>
        <h2 className="mt-2 text-xl font-medium text-stone-900">
          Start lease
        </h2>
        <p className="text-sm text-stone-500">
          New tenancy at{" "}
          <span className="font-medium text-stone-700">{property.name}</span>.
          The property will flip to occupied automatically when the lease
          is created in active status.
        </p>
      </div>

      <div className="rounded-lg border border-stone-200 bg-white p-6">
        <LeaseForm
          action={createLeaseAction}
          defaults={{
            unitId,
            startDate: new Date(),
            currency: defaultCurrency,
          }}
          defaultCurrency={defaultCurrency}
          submitLabel="Create lease"
        />
      </div>
    </div>
  );
}

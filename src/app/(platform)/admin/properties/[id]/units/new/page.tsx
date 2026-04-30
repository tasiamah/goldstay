import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { UnitForm } from "../../../../units/UnitForm";
import { createUnitAction } from "../../../../units/actions";

export default async function NewUnitPage({
  params,
}: {
  params: { id: string };
}) {
  const property = await prisma.property.findUnique({
    where: { id: params.id },
    select: { id: true, name: true, owner: { select: { fullName: true } } },
  });
  if (!property) notFound();

  return (
    <div className="mx-auto w-full max-w-xl space-y-6">
      <div>
        <Link
          href={`/admin/properties/${property.id}`}
          className="text-sm text-stone-500 hover:text-stone-900"
        >
          ← {property.name}
        </Link>
        <h2 className="mt-2 text-xl font-medium text-stone-900">Add unit</h2>
        <p className="text-sm text-stone-500">
          New rentable unit under{" "}
          <span className="font-medium text-stone-700">{property.name}</span>{" "}
          owned by {property.owner.fullName}.
        </p>
      </div>

      <div className="rounded-lg border border-stone-200 bg-white p-6">
        <UnitForm
          action={createUnitAction}
          defaults={{ propertyId: property.id }}
          submitLabel="Create unit"
        />
      </div>
    </div>
  );
}

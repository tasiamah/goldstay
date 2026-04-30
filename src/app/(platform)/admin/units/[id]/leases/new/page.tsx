import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { LeaseForm } from "../../../../leases/LeaseForm";
import { createLeaseAction } from "../../../../leases/actions";

export default async function NewLeasePage({
  params,
}: {
  params: { id: string };
}) {
  const unit = await prisma.unit.findUnique({
    where: { id: params.id },
    include: {
      property: {
        select: {
          id: true,
          name: true,
          country: true,
          owner: { select: { preferredCurrency: true } },
        },
      },
    },
  });
  if (!unit) notFound();

  const defaultCurrency =
    unit.property.country === "KE"
      ? "KES"
      : unit.property.country === "GH"
        ? "GHS"
        : (unit.property.owner.preferredCurrency ?? "USD");

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div>
        <Link
          href={`/admin/units/${unit.id}`}
          className="text-sm text-stone-500 hover:text-stone-900"
        >
          ← {unit.label}
        </Link>
        <h2 className="mt-2 text-xl font-medium text-stone-900">Start lease</h2>
        <p className="text-sm text-stone-500">
          New tenancy on{" "}
          <span className="font-medium text-stone-700">{unit.label}</span> at{" "}
          {unit.property.name}. The unit will be flipped to occupied
          automatically when the lease is created in active status.
        </p>
      </div>

      <div className="rounded-lg border border-stone-200 bg-white p-6">
        <LeaseForm
          action={createLeaseAction}
          defaults={{
            unitId: unit.id,
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

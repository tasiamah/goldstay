import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { UnitForm } from "../UnitForm";
import { updateUnitAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function UnitDetailPage({
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
          city: true,
          owner: { select: { id: true, fullName: true } },
        },
      },
      leases: {
        orderBy: [{ status: "asc" }, { startDate: "desc" }],
      },
    },
  });
  if (!unit) notFound();

  const boundUpdate = updateUnitAction.bind(null, unit.id);
  const activeLease = unit.leases.find((l) => l.status === "ACTIVE") ?? null;

  return (
    <div className="space-y-8">
      <div>
        <Link
          href={`/admin/properties/${unit.property.id}`}
          className="text-sm text-stone-500 hover:text-stone-900"
        >
          ← {unit.property.name}
        </Link>
        <div className="mt-2 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-medium text-stone-900">{unit.label}</h2>
            <p className="text-sm text-stone-500">
              {unit.property.name} · {unit.property.city} ·{" "}
              <span className="text-xs uppercase tracking-wider">
                {unit.status}
              </span>
            </p>
          </div>
          {activeLease ? null : (
            <Link
              href={`/admin/units/${unit.id}/leases/new`}
              className="inline-flex shrink-0 items-center rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
            >
              Start lease
            </Link>
          )}
        </div>
      </div>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-lg border border-stone-200 bg-white p-6">
          <h3 className="text-base font-medium text-stone-900">Details</h3>
          <div className="mt-5">
            <UnitForm
              action={boundUpdate}
              defaults={{
                propertyId: unit.property.id,
                label: unit.label,
                bedrooms: unit.bedrooms,
                bathrooms: unit.bathrooms,
                sizeSqm: unit.sizeSqm,
                status: unit.status,
              }}
              submitLabel="Save changes"
            />
          </div>
        </div>

        <div className="rounded-lg border border-stone-200 bg-white p-6">
          <h3 className="text-base font-medium text-stone-900">Leases</h3>
          {unit.leases.length === 0 ? (
            <p className="mt-4 text-sm text-stone-500">
              No leases yet. Click{" "}
              <span className="font-medium text-stone-700">Start lease</span>{" "}
              to record the first tenant.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-stone-100">
              {unit.leases.map((l) => (
                <li
                  key={l.id}
                  className="flex items-start justify-between py-3"
                >
                  <div>
                    <Link
                      href={`/admin/leases/${l.id}`}
                      className="font-medium text-stone-900 hover:underline"
                    >
                      {l.tenantName}
                    </Link>
                    <p className="text-xs text-stone-500">
                      {l.startDate.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                      {l.endDate
                        ? ` → ${l.endDate.toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}`
                        : " → ongoing"}{" "}
                      · {l.currency}{" "}
                      {Number(l.monthlyRent).toLocaleString("en-GB")}/mo
                    </p>
                  </div>
                  <span className="text-xs uppercase tracking-wider text-stone-500">
                    {l.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PropertyForm } from "../PropertyForm";
import { updatePropertyAction } from "../actions";

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
      units: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!property) notFound();

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
        <h2 className="mt-2 text-xl font-medium text-stone-900">
          {property.name}
        </h2>
        <p className="text-sm text-stone-500">
          {property.neighbourhood ? `${property.neighbourhood}, ` : ""}
          {property.city} ·{" "}
          {property.country === "KE" ? "Kenya" : "Ghana"} ·{" "}
          <span className="text-xs uppercase tracking-wider">
            {property.status}
          </span>
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
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-stone-200 bg-white p-6">
            <h3 className="text-base font-medium text-stone-900">Units</h3>
            <p className="mt-1 text-sm text-stone-500">
              Add the rentable subdivisions of this property. A single-family
              home is one unit; a building has many.
            </p>
            {property.units.length === 0 ? (
              <p className="mt-4 text-sm text-stone-500">
                No units yet. (Unit and lease management coming next.)
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-stone-100">
                {property.units.map((u) => (
                  <li
                    key={u.id}
                    className="flex items-center justify-between py-3"
                  >
                    <span className="font-medium text-stone-900">
                      {u.label}
                    </span>
                    <span className="text-xs uppercase tracking-wider text-stone-500">
                      {u.status}
                    </span>
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

import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPropertyDisplayName } from "@/lib/format-property";

export const dynamic = "force-dynamic";

export default async function PropertiesListPage() {
  const properties = await prisma.property.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      owner: { select: { id: true, fullName: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium text-stone-900">Properties</h2>
          <p className="text-sm text-stone-500">
            {properties.length}{" "}
            {properties.length === 1 ? "property" : "properties"} across all
            landlords
          </p>
        </div>
      </div>

      {properties.length === 0 ? (
        <div className="rounded-lg border border-dashed border-stone-300 bg-white p-10 text-center">
          <h3 className="text-base font-medium text-stone-900">
            No properties yet
          </h3>
          <p className="mt-1 text-sm text-stone-500">
            Add an owner first, then attach a property from their detail page.
          </p>
          <Link
            href="/admin/owners"
            className="mt-4 inline-flex items-center rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
          >
            Go to owners
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
          <table className="min-w-full divide-y divide-stone-200">
            <thead className="bg-stone-50">
              <tr>
                <Th>Property</Th>
                <Th>Owner</Th>
                <Th>Country</Th>
                <Th>Model</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {properties.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50/60">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/properties/${p.id}`}
                      className="font-medium text-stone-900 hover:underline"
                    >
                      {formatPropertyDisplayName(p.name, p.unitNumber)}
                    </Link>
                    <p className="text-xs text-stone-500">
                      {p.neighbourhood ? `${p.neighbourhood}, ` : ""}
                      {p.city}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Link
                      href={`/admin/owners/${p.owner.id}`}
                      className="text-stone-700 hover:underline"
                    >
                      {p.owner.fullName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-stone-700">
                    {p.country === "KE" ? "Kenya" : "Ghana"}
                  </td>
                  <td className="px-4 py-3 text-sm text-stone-700">
                    {p.propertyType === "SHORT_TERM"
                      ? "Short-term"
                      : "Long-term"}
                  </td>
                  <td className="px-4 py-3 text-xs uppercase tracking-wider text-stone-500">
                    {p.status}
                  </td>
                </tr>
              ))}
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

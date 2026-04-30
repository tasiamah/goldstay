import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function OwnerDashboardPage() {
  const user = await requireUser();

  // Best-effort owner lookup. Until an admin has provisioned an Owner
  // row matching this email, we render the "pending" empty state so
  // the user gets a useful message instead of a 500.
  const owner = await prisma.owner.findFirst({
    where: {
      OR: [
        { authUserId: user.id },
        user.email ? { email: user.email } : { id: "__never__" },
      ],
    },
    include: {
      properties: {
        include: { units: true },
      },
    },
  });

  if (!owner) {
    return (
      <div className="rounded-lg border border-stone-200 bg-white p-8">
        <h2 className="text-xl font-serif text-stone-900">
          We are still setting up your account
        </h2>
        <p className="mt-3 text-stone-600">
          You are signed in as <strong>{user.email}</strong>, but we have not
          linked any properties to this email yet. The Goldstay team will be
          in touch as soon as your portfolio is live in the portal.
        </p>
      </div>
    );
  }

  const totalProperties = owner.properties.length;
  const totalUnits = owner.properties.reduce(
    (sum, p) => sum + p.units.length,
    0,
  );

  return (
    <div className="space-y-8">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat label="Properties" value={totalProperties} />
        <Stat label="Units" value={totalUnits} />
        <Stat label="Country" value={owner.country} />
      </section>

      <section className="rounded-lg border border-stone-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-stone-900">Your portfolio</h2>
          <Link
            href="/owner/properties"
            className="text-sm text-stone-600 hover:text-stone-900"
          >
            See all
          </Link>
        </div>
        {owner.properties.length === 0 ? (
          <p className="mt-4 text-sm text-stone-500">
            No properties yet. Once Goldstay onboards a property under your
            name it will appear here.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-stone-100">
            {owner.properties.slice(0, 5).map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <p className="font-medium text-stone-900">{p.name}</p>
                  <p className="text-sm text-stone-500">
                    {p.neighbourhood ? `${p.neighbourhood}, ` : ""}
                    {p.city}
                  </p>
                </div>
                <span className="text-xs uppercase tracking-wider text-stone-500">
                  {p.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-6">
      <p className="text-xs uppercase tracking-wider text-stone-500">{label}</p>
      <p className="mt-2 text-2xl font-serif text-stone-900">{value}</p>
    </div>
  );
}

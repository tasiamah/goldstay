import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [ownerCount, propertyCount, unitCount, leaseCount] = await Promise.all([
    prisma.owner.count(),
    prisma.property.count(),
    prisma.unit.count(),
    prisma.lease.count({ where: { status: "ACTIVE" } }),
  ]);

  return (
    <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <Stat label="Owners" value={ownerCount} />
      <Stat label="Properties" value={propertyCount} />
      <Stat label="Units" value={unitCount} />
      <Stat label="Active leases" value={leaseCount} />
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-6">
      <p className="text-xs uppercase tracking-wider text-stone-500">{label}</p>
      <p className="mt-2 text-2xl font-serif text-stone-900">{value}</p>
    </div>
  );
}

import { prisma } from "@/lib/db";

// Loader shared by /admin/transactions/new and /admin/transactions/[id]
// to feed the property + lease pickers in TransactionForm. We expose
// only ACTIVE leases on each property because logging a transaction
// against an ended lease is almost always a mistake; if you need it,
// edit the transaction directly in the DB.
export async function loadPropertyOptions() {
  const properties = await prisma.property.findMany({
    orderBy: [{ city: "asc" }, { name: "asc" }],
    include: {
      owner: { select: { fullName: true, preferredCurrency: true } },
      units: {
        include: {
          leases: {
            where: { status: "ACTIVE" },
            select: { id: true, tenantName: true },
          },
        },
      },
    },
  });

  return properties.map((p) => ({
    id: p.id,
    name: p.name,
    city: p.city,
    ownerName: p.owner.fullName,
    defaultCurrency:
      p.country === "KE"
        ? "KES"
        : p.country === "GH"
          ? "GHS"
          : (p.owner.preferredCurrency ?? "USD"),
    leases: p.units.flatMap((u) =>
      u.leases.map((l) => ({
        id: l.id,
        tenantName: l.tenantName,
        unitLabel: u.label,
      })),
    ),
  }));
}

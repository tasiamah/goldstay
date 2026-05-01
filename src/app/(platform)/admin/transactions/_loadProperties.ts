import { prisma } from "@/lib/db";
import { formatOwnerDisplayName } from "@/lib/format-owner";

// Loader shared by /admin/transactions/new and /admin/transactions/[id]
// to feed the property + lease pickers in TransactionForm. We expose
// only ACTIVE leases on each property because logging a transaction
// against an ended lease is almost always a mistake; if you need it,
// edit the transaction directly in the DB.
export async function loadPropertyOptions() {
  const properties = await prisma.property.findMany({
    orderBy: [{ city: "asc" }, { name: "asc" }],
    include: {
      owner: {
        select: {
          fullName: true,
          companyName: true,
          preferredCurrency: true,
        },
      },
      units: {
        include: {
          leases: {
            where: { status: "ACTIVE" },
            select: { id: true, tenantName: true },
          },
        },
      },
      bookings: {
        where: { status: { in: ["CONFIRMED", "COMPLETED"] } },
        orderBy: { checkIn: "desc" },
        take: 30,
        select: {
          id: true,
          guestName: true,
          checkIn: true,
          checkOut: true,
          source: true,
        },
      },
    },
  });

  return properties.map((p) => ({
    id: p.id,
    name: p.name,
    city: p.city,
    ownerName: formatOwnerDisplayName(p.owner),
    propertyType: p.propertyType,
    defaultCurrency:
      p.country === "KE"
        ? "KES"
        : p.country === "GH"
          ? "GHS"
          : (p.owner.preferredCurrency ?? "USD"),
    // Goldstay rents each property as a whole, so we flatten the
    // implicit unit out of the picker and just expose the active
    // tenants on this property.
    leases: p.units.flatMap((u) =>
      u.leases.map((l) => ({
        id: l.id,
        tenantName: l.tenantName,
      })),
    ),
    bookings: p.bookings.map((b) => ({
      id: b.id,
      label: `${b.guestName} · ${b.checkIn.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      })} → ${b.checkOut.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      })} · ${b.source.replace("_", " ").toLowerCase()}`,
    })),
  }));
}

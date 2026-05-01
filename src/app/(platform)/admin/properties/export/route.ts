import type { NextRequest } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { csvResponse, toCsv } from "@/lib/admin/csv";
import { parsePropertyListFilters } from "@/lib/admin/list-search";
import { formatOwnerDisplayName } from "@/lib/format-owner";
import { formatPropertyDisplayName } from "@/lib/format-property";

export const dynamic = "force-dynamic";

// GET /admin/properties/export[?q=&country=&status=&type=]
//
// Same filters as the properties list page. Returns the columns
// finance + operations need to reconcile against bank statements
// and OTA payouts. Admin-only.
export async function GET(request: NextRequest) {
  await requireAdmin();

  const { searchParams } = new URL(request.url);
  const filters = parsePropertyListFilters(
    Object.fromEntries(searchParams.entries()),
  );

  const where: Prisma.PropertyWhereInput = {};
  if (filters.country) where.country = filters.country;
  if (filters.status) where.status = filters.status;
  if (filters.type) where.propertyType = filters.type;
  if (filters.q) {
    where.OR = [
      { name: { contains: filters.q, mode: "insensitive" } },
      { unitNumber: { contains: filters.q, mode: "insensitive" } },
      { address: { contains: filters.q, mode: "insensitive" } },
      { neighbourhood: { contains: filters.q, mode: "insensitive" } },
      { city: { contains: filters.q, mode: "insensitive" } },
      {
        owner: {
          is: {
            OR: [
              { fullName: { contains: filters.q, mode: "insensitive" } },
              { companyName: { contains: filters.q, mode: "insensitive" } },
              { email: { contains: filters.q, mode: "insensitive" } },
            ],
          },
        },
      },
    ];
  }

  const properties = await prisma.property.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      owner: {
        select: { id: true, fullName: true, companyName: true, email: true },
      },
    },
  });

  const rows = properties.map((p) => ({
    id: p.id,
    property: formatPropertyDisplayName(p.name, p.unitNumber),
    address: p.address,
    neighbourhood: p.neighbourhood ?? "",
    city: p.city,
    country: p.country,
    type: p.propertyType,
    status: p.status,
    bedrooms: p.bedrooms ?? "",
    owner: formatOwnerDisplayName(p.owner),
    owner_email: p.owner.email,
    created_at: p.createdAt,
  }));

  const today = new Date().toISOString().slice(0, 10);
  return csvResponse(`goldstay-properties-${today}.csv`, toCsv(rows));
}

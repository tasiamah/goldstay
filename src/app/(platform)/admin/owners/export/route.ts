import type { NextRequest } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { csvResponse, toCsv } from "@/lib/admin/csv";
import { parseOwnerListFilters } from "@/lib/admin/list-search";

export const dynamic = "force-dynamic";

// GET /admin/owners/export[?q=&country=]
//
// Streams the same filtered owner set the operator is currently
// looking at as a CSV. Useful for finance handovers and offline
// reconciliation. Admin-only; falls through requireAdmin which
// redirects unauthenticated requests to /login.
export async function GET(request: NextRequest) {
  await requireAdmin();

  const { searchParams } = new URL(request.url);
  const filters = parseOwnerListFilters(
    Object.fromEntries(searchParams.entries()),
  );

  const where: Prisma.OwnerWhereInput = {};
  if (filters.country) where.country = filters.country;
  if (filters.q) {
    where.OR = [
      { fullName: { contains: filters.q, mode: "insensitive" } },
      { companyName: { contains: filters.q, mode: "insensitive" } },
      { email: { contains: filters.q, mode: "insensitive" } },
      { phone: { contains: filters.q, mode: "insensitive" } },
    ];
  }

  const owners = await prisma.owner.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { properties: true } } },
  });

  const rows = owners.map((o) => ({
    id: o.id,
    company_name: o.companyName ?? "",
    full_name: o.fullName,
    email: o.email,
    phone: o.phone ?? "",
    country: o.country,
    preferred_currency: o.preferredCurrency,
    properties: o._count.properties,
    created_at: o.createdAt,
  }));

  const today = new Date().toISOString().slice(0, 10);
  return csvResponse(`goldstay-owners-${today}.csv`, toCsv(rows));
}

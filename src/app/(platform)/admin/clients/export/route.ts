import type { NextRequest } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { csvResponse, toCsv } from "@/lib/admin/csv";
import { parseClientListFilters, periodRange } from "@/lib/admin/list-search";
import {
  CLIENT_AGREEMENT_INCLUDE,
  clientAgreementWhere,
  rollupClientAgreements,
} from "@/lib/admin/client-agreements";

export const dynamic = "force-dynamic";

// GET /admin/clients/export[?q=&country=&period=&agreement=]
//
// Streams the same filtered client set the operator is currently
// looking at as a CSV. Useful for finance handovers and offline
// reconciliation. Admin-only; falls through requireAdmin which
// redirects unauthenticated requests to /login.
export async function GET(request: NextRequest) {
  await requireAdmin();

  const { searchParams } = new URL(request.url);
  const filters = parseClientListFilters(
    Object.fromEntries(searchParams.entries()),
  );

  const where: Prisma.ClientWhereInput = {};
  if (filters.country) where.country = filters.country;
  // Was silently dropped even though the Export CSV link on the list
  // page has always passed it, so exporting from a month-filtered view
  // handed back every client on the platform.
  const range = periodRange(filters.period);
  if (range) where.createdAt = { gte: range.gte, lt: range.lt };
  if (filters.q) {
    where.OR = [
      { fullName: { contains: filters.q, mode: "insensitive" } },
      { companyName: { contains: filters.q, mode: "insensitive" } },
      { email: { contains: filters.q, mode: "insensitive" } },
      { phone: { contains: filters.q, mode: "insensitive" } },
    ];
  }
  const agreementWhere = clientAgreementWhere(filters.agreement);
  if (agreementWhere) where.AND = agreementWhere;

  const clients = await prisma.client.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { properties: true } },
      properties: CLIENT_AGREEMENT_INCLUDE,
    },
  });

  const rows = clients.map((o) => {
    // Same rollup the list page renders, so a CSV pulled for a
    // signature chase says what the screen said.
    const agreement = rollupClientAgreements(o.properties);
    return {
      id: o.id,
      company_name: o.companyName ?? "",
      full_name: o.fullName,
      email: o.email,
      phone: o.phone ?? "",
      country: o.country,
      preferred_currency: o.preferredCurrency,
      properties: o._count.properties,
      agreement_state: agreement.state,
      agreements_awaiting: agreement.awaiting,
      agreements_signed: agreement.signed,
      created_at: o.createdAt,
    };
  });

  const today = new Date().toISOString().slice(0, 10);
  return csvResponse(`goldstay-clients-${today}.csv`, toCsv(rows));
}

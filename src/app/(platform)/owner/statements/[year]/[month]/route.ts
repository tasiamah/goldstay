// GET /owner/statements/2026/4 — returns the rendered PDF for the
// logged-in owner's portfolio for that month. Browser hits this URL
// directly via a download link; we set a content-disposition header
// so the file lands in Downloads with a sensible name instead of
// "[year].pdf".
//
// Auth: requireOwner() handles redirect-to-login for guests and
// redirect-to-/owner/pending for users not yet linked to an Owner row.
// We never serve PDFs to anyone outside the owner's own properties.

import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { requireOwner } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { StatementDocument } from "@/lib/statements/StatementDocument";
import { buildStatement } from "@/lib/statements/aggregate";
import { buildShortTermSummary } from "@/lib/statements/short-term";
import {
  formatPeriod,
  parsePeriod,
  periodRange,
  periodSlug,
} from "@/lib/statements/period";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: { year: string; month: string } },
) {
  const period = parsePeriod(context.params.year, context.params.month);
  if (!period) {
    return new NextResponse("Invalid period", { status: 400 });
  }

  const { owner } = await requireOwner();

  const { start, end } = periodRange(period);

  const [transactions, shortTermBookings] = await Promise.all([
    prisma.transaction.findMany({
      where: {
        occurredOn: { gte: start, lt: end },
        property: { ownerId: owner.id },
      },
      include: {
        property: { select: { id: true, name: true } },
        lease: { select: { id: true, tenantName: true } },
      },
      orderBy: { occurredOn: "asc" },
    }),
    // Bookings whose stay overlaps the period at all. The aggregator
    // clips nights to the window; gross / fees stay attached to the
    // booking's anchor period so it matches the bank.
    prisma.booking.findMany({
      where: {
        property: { ownerId: owner.id, propertyType: "SHORT_TERM" },
        checkIn: { lt: end },
        checkOut: { gt: start },
      },
      include: {
        property: { select: { id: true, name: true } },
      },
    }),
  ]);

  const statement = buildStatement(
    transactions.map((t) => ({
      id: t.id,
      occurredOn: t.occurredOn,
      type: t.type,
      direction: t.direction,
      amount: t.amount.toString(),
      currency: t.currency,
      description: t.description,
      reference: t.reference,
      propertyId: t.propertyId,
      propertyName: t.property.name,
      leaseId: t.leaseId,
      tenantName: t.lease?.tenantName ?? null,
    })),
    { preferredCurrency: owner.preferredCurrency },
  );

  const shortTerm = buildShortTermSummary(
    shortTermBookings.map((b) => ({
      propertyId: b.propertyId,
      propertyName: b.property.name,
      checkIn: b.checkIn,
      checkOut: b.checkOut,
      nights: b.nights,
      grossAmount: Number(b.grossAmount),
      otaCommission: b.otaCommission ? Number(b.otaCommission) : null,
      cleaningFee: b.cleaningFee ? Number(b.cleaningFee) : null,
      netPayout: Number(b.netPayout),
      currency: b.currency,
      status: b.status,
    })),
    transactions
      .filter((t) => t.type === "GOLDSTAY_COMMISSION")
      .map((t) => ({
        propertyId: t.propertyId,
        type: t.type,
        amount: Number(t.amount),
        currency: t.currency,
      })),
    { start, end },
  );

  const buffer = await renderToBuffer(
    StatementDocument({
      period,
      owner: {
        fullName: owner.fullName,
        companyName: owner.companyName,
        email: owner.email,
        preferredCurrency: owner.preferredCurrency,
      },
      statement,
      shortTerm,
      generatedAt: new Date(),
    }),
  );

  // Filename mirrors the cover page: company name when set, personal
  // name otherwise. Diaspora landlords keep these statements in
  // shared Drive folders, so a recognisable filename matters.
  const filename = `goldstay-statement-${periodSlug(period)}-${slug(
    owner.companyName?.trim() || owner.fullName,
  )}.pdf`;

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "private, max-age=0, must-revalidate",
      "X-Statement-Period": formatPeriod(period),
    },
  });
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

// GET /client/statements/2026/4 — returns the rendered PDF for the
// logged-in client's portfolio for that month. Browser hits this URL
// directly via a download link; we set a content-disposition header
// so the file lands in Downloads with a sensible name instead of
// "[year].pdf".
//
// Auth: requireClient() handles redirect-to-login for guests and
// redirect-to-/client/pending for users not yet linked to a Client row.
// We never serve PDFs to anyone outside the client's own properties.

import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { requireClient } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { StatementDocument } from "@/lib/statements/StatementDocument";
import { assembleStatement } from "@/lib/statements/assemble";
import {
  formatPeriod,
  parsePeriod,
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

  const { client } = await requireClient();

  const { statement, shortTerm, payoutInPreferred } = await assembleStatement({
    prisma,
    client,
    period,
  });

  const buffer = await renderToBuffer(
    StatementDocument({
      period,
      client: {
        fullName: client.fullName,
        companyName: client.companyName,
        email: client.email,
        preferredCurrency: client.preferredCurrency,
      },
      statement,
      shortTerm,
      payoutInPreferred,
      generatedAt: new Date(),
    }),
  );

  // Filename mirrors the cover page: company name when set, personal
  // name otherwise. Diaspora landlords keep these statements in
  // shared Drive folders, so a recognisable filename matters.
  const filename = `goldstay-statement-${periodSlug(period)}-${slug(
    client.companyName?.trim() || client.fullName,
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

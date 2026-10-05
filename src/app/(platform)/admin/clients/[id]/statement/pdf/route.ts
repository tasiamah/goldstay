// GET /admin/clients/<id>/statement/pdf?month=YYYY-MM — the exact PDF
// a given client would receive, rendered for an operator.
//
// This exists because the preview's "Download PDF" button used to
// point at /client/statements/<year>/<month>, which resolves the
// *logged-in* user's client record through requireClient(). An admin
// clicking it got their own statement, or a redirect to /client/pending
// if they hold no client record, but never the statement of the client
// whose page they were looking at. The button could not do the one job
// it was there for.
//
// Auth is requireAdmin() and the client is taken from the path, so an
// operator can render anybody's. That is the whole point: checking a
// statement before it goes out means reading somebody else's.

import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { StatementDocument } from "@/lib/statements/StatementDocument";
import { assembleStatement } from "@/lib/statements/assemble";
import {
  formatPeriod,
  isValidPeriod,
  periodSlug,
  type Period,
} from "@/lib/statements/period";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: { id: string } },
) {
  await requireAdmin();

  const period = parseMonthParam(
    new URL(request.url).searchParams.get("month"),
  );
  if (!period) {
    return new NextResponse("Invalid or missing ?month=YYYY-MM", {
      status: 400,
    });
  }

  const client = await prisma.client.findUnique({
    where: { id: context.params.id },
    select: {
      id: true,
      email: true,
      fullName: true,
      companyName: true,
      preferredCurrency: true,
    },
  });
  if (!client) {
    return new NextResponse("Client not found", { status: 404 });
  }

  const { statement, shortTerm, payoutInPreferred, firstStatementNote } =
    await assembleStatement({
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
      firstStatementNote,
      generatedAt: new Date(),
    }),
  );

  // inline rather than attachment so it opens in a tab next to the
  // preview, which is how an operator actually compares the two.
  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="goldstay-statement-${periodSlug(
        period,
      )}-${slug(client.companyName?.trim() || client.fullName)}.pdf"`,
      "Cache-Control": "private, max-age=0, must-revalidate",
      "X-Statement-Period": formatPeriod(period),
    },
  });
}

function parseMonthParam(raw: string | null): Period | null {
  if (!raw) return null;
  const m = /^(\d{4})-(\d{1,2})$/.exec(raw);
  if (!m) return null;
  const period = { year: Number(m[1]), month: Number(m[2]) };
  return isValidPeriod(period) ? period : null;
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

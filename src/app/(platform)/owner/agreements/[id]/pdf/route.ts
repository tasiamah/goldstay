// GET /owner/agreements/[id]/pdf — download the executed Goldstay
// management agreement as a PDF.
//
// Materialise-on-first-hit: the sign action only flips the agreement
// status and captures the forensic record; we render and store the
// PDF the first time anyone (the landlord on the success screen, an
// admin via the property page) clicks the download link. Subsequent
// requests reuse the same Document row so the PDF is bit-stable
// across downloads. Worst case under a race is one wasted render.
//
// Auth: requireOwner() + a property-scoped findFirst, so a landlord
// can never download another landlord's agreement.

import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createSignedDownloadUrl } from "@/lib/storage";
import { materialiseSignedAgreement } from "@/lib/agreements/materialise";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: { id: string } },
) {
  const { owner } = await requireOwner();

  const agreement = await prisma.managementAgreement.findFirst({
    where: {
      id: context.params.id,
      property: { ownerId: owner.id },
    },
    select: { id: true, status: true, documentId: true },
  });
  if (!agreement) {
    return new NextResponse("Agreement not found", { status: 404 });
  }
  if (agreement.status !== "SIGNED") {
    return new NextResponse(
      "Agreement has not been signed yet.",
      { status: 409 },
    );
  }

  let documentId = agreement.documentId;
  if (!documentId) {
    const result = await materialiseSignedAgreement(agreement.id);
    documentId = result.documentId;
  }

  const doc = await prisma.document.findUnique({
    where: { id: documentId },
    select: { storagePath: true },
  });
  if (!doc || doc.storagePath === "pending") {
    return new NextResponse("Agreement PDF is not available yet.", {
      status: 503,
    });
  }

  const signed = await createSignedDownloadUrl(doc.storagePath, {
    downloadAs: "goldstay-management-agreement.pdf",
  });
  return NextResponse.redirect(signed, { status: 302 });
}

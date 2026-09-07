// GET /agreements/shared/[token]/pdf — download the executed PDF of a
// shared agreement.
//
// The token stands in for the auth that /client/agreements/[id]/pdf
// gets from requireClient(). It resolves to exactly one agreement, so
// there is no id in this URL to tamper with: a holder of one share
// token cannot walk it to another agreement's PDF the way an id-based
// route would invite.
//
// Only SIGNED agreements have a PDF. An unsigned one 409s here, same
// as on the client route, because the document does not exist yet.

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSignedDownloadUrl } from "@/lib/storage";
import { materialiseSignedAgreement } from "@/lib/agreements/materialise";
import { consumeShareToken } from "@/lib/agreements/share";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: { token: string } },
) {
  // consumeShareToken returns null for unknown, revoked and expired
  // alike. All three are 404 here: unlike the page, there is nothing
  // useful to render for a closed link and no reason to distinguish.
  const share = await consumeShareToken(context.params.token);
  if (!share) {
    return new NextResponse("Not found", { status: 404 });
  }

  const { agreement } = share;
  if (agreement.status !== "SIGNED") {
    return new NextResponse("Agreement has not been signed yet.", {
      status: 409,
    });
  }

  // Materialise-on-first-hit, matching the client route. It is
  // possible for the advocate to be the first person to click
  // download, and rendering the PDF is not a privileged operation:
  // it reads the same agreement row this token already grants.
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

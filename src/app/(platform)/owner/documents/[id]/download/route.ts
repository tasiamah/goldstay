// Owner download endpoint. Mints a 5-minute signed URL and 302s the
// browser to it. We check ownership server-side: the document must
// hang off a property owned by the logged-in landlord, otherwise we
// return 404 (NOT 403) to avoid leaking the existence of other
// landlords' documents.
import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createSignedDownloadUrl } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: { id: string } },
) {
  const { owner } = await requireOwner();

  const doc = await prisma.document.findFirst({
    where: {
      id: context.params.id,
      property: { ownerId: owner.id },
    },
    select: { storagePath: true },
  });
  if (!doc || !doc.storagePath || doc.storagePath === "pending") {
    return new NextResponse("Document not found", { status: 404 });
  }

  const url = await createSignedDownloadUrl(doc.storagePath);
  return NextResponse.redirect(url, { status: 302 });
}

// Admin download endpoint. Mints a 5-minute signed URL and 302s the
// browser to it. Admin sees every document; the per-property
// authorisation check that the owner side needs is unnecessary here.
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createSignedDownloadUrl } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: { id: string } },
) {
  await requireAdmin();

  const doc = await prisma.document.findUnique({
    where: { id: context.params.id },
    select: { id: true, storagePath: true, title: true, mimeType: true },
  });
  if (!doc || !doc.storagePath || doc.storagePath === "pending") {
    return new NextResponse("Document not found", { status: 404 });
  }

  const url = await createSignedDownloadUrl(doc.storagePath);
  return NextResponse.redirect(url, { status: 302 });
}

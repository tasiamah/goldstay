"use server";

import { revalidatePath } from "next/cache";
import { currentAuditActor, requireRole } from "@/lib/auth";
import { archiveEntity } from "@/lib/admin/archive";

// Bulk archive ids submitted from the owners list page. Failures
// per row are swallowed so one bad id can't strand the rest of the
// batch — the operator sees a count toast and can spot survivors in
// the next render.

export async function bulkArchiveOwnersAction(formData: FormData): Promise<{
  archived: number;
  failed: number;
}> {
  await requireRole("archive.write");
  const actor = await currentAuditActor();
  const ids = formData.getAll("ids").map(String).filter(Boolean);

  let archived = 0;
  let failed = 0;
  for (const id of ids) {
    try {
      await archiveEntity("OWNER", id, actor);
      archived += 1;
    } catch (err) {
      console.warn("[bulk-archive-owners] failed", id, err);
      failed += 1;
    }
  }

  revalidatePath("/admin/owners");
  return { archived, failed };
}

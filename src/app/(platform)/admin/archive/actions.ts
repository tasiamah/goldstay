"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { currentAuditActor, requireRole } from "@/lib/auth";
import {
  archiveEntity,
  restoreEntity,
  type ArchivableEntity,
} from "@/lib/admin/archive";

const EntityEnum = z.enum(["OWNER", "PROPERTY", "LEASE", "TRANSACTION"]);

// Result returned to runWithUndo so the toast can offer an Undo
// button bound to the inverse server action.
export type ArchiveActionResult = {
  ok: true;
  entity: ArchivableEntity;
  id: string;
};

export async function archiveAction(
  entity: ArchivableEntity,
  id: string,
  returnPath: string,
): Promise<ArchiveActionResult> {
  await requireRole("archive.write");
  const actor = await currentAuditActor();
  const parsed = EntityEnum.safeParse(entity);
  if (!parsed.success) throw new Error("Unknown entity");
  await archiveEntity(parsed.data, id, actor);
  revalidatePath(returnPath);
  revalidatePath("/admin/archive");
  return { ok: true, entity: parsed.data, id };
}

export async function restoreAction(
  entity: ArchivableEntity,
  id: string,
  returnPath: string,
): Promise<{ ok: true }> {
  await requireRole("archive.write");
  const actor = await currentAuditActor();
  const parsed = EntityEnum.safeParse(entity);
  if (!parsed.success) throw new Error("Unknown entity");
  await restoreEntity(parsed.data, id, actor);
  revalidatePath(returnPath);
  revalidatePath("/admin/archive");
  return { ok: true };
}

"use server";

import { revalidatePath } from "next/cache";
import type { AuditEntity } from "@prisma/client";
import { completeTask, createTask, reopenTask } from "@/lib/tasks";
import { currentAuditActor, requireAdmin } from "@/lib/auth";

// Pinned-to-entity task creation. Bound from <TasksPanel> at the
// detail-page level so the panel is generic across owners /
// properties / leases / bookings.
export async function createEntityTaskAction(
  entity: AuditEntity,
  entityId: string,
  returnPath: string,
  formData: FormData,
): Promise<void> {
  const actor = await currentAuditActor();
  const title = String(formData.get("title") ?? "").trim();
  if (title.length === 0) return;
  const dueAtRaw = String(formData.get("dueAt") ?? "");
  const dueAt = dueAtRaw ? new Date(dueAtRaw) : null;

  await createTask({ actor, title, dueAt, entity, entityId });
  revalidatePath(returnPath);
}

// Personal task (no entity FK). Used by /admin/tasks.
export async function createPersonalTaskAction(
  returnPath: string,
  formData: FormData,
): Promise<void> {
  const actor = await currentAuditActor();
  const title = String(formData.get("title") ?? "").trim();
  if (title.length === 0) return;
  const dueAtRaw = String(formData.get("dueAt") ?? "");
  const dueAt = dueAtRaw ? new Date(dueAtRaw) : null;

  await createTask({ actor, title, dueAt });
  revalidatePath(returnPath);
}

export async function toggleTaskAction(
  taskId: string,
  alreadyCompleted: boolean,
  returnPath: string,
): Promise<void> {
  const actor = await currentAuditActor();
  if (alreadyCompleted) {
    await reopenTask(taskId, actor);
  } else {
    await completeTask(taskId, actor);
  }
  revalidatePath(returnPath);
}

// Re-export so the /admin/tasks page can render its own admin
// banner with the correct viewer.
export async function getMyAdmin() {
  return requireAdmin();
}

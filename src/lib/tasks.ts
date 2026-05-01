// Lightweight follow-up tasks for the admin team.
//
// A task is either pinned to an entity (a property, an owner, etc.)
// or freestanding for personal admin to-dos. The /admin/tasks page
// reads `myOpenTasks(adminId)`, the per-entity panels read
// `tasksForEntity(...)`, and the attention queue uses
// `categoriseTask` to split overdue / today / this week.

import { prisma } from "@/lib/db";
import type { AuditEntity, Task } from "@prisma/client";
import { recordAudit, type AuditActor } from "@/lib/audit";

export type CreateTaskInput = {
  actor: AuditActor;
  title: string;
  notes?: string | null;
  dueAt?: Date | null;
  assigneeAdminId?: string | null;
  entity?: AuditEntity | null;
  entityId?: string | null;
};

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const title = input.title.trim();
  if (title.length === 0) {
    throw new Error("Task title cannot be empty.");
  }

  const task = await prisma.task.create({
    data: {
      title,
      notes: input.notes ?? null,
      dueAt: input.dueAt ?? null,
      assigneeAdminId:
        input.assigneeAdminId ?? input.actor.adminId ?? null,
      createdByAdminId: input.actor.adminId ?? null,
      entity: input.entity ?? null,
      entityId: input.entityId ?? null,
    },
  });

  if (task.entity && task.entityId) {
    await recordAudit({
      actor: input.actor,
      entity: task.entity,
      entityId: task.entityId,
      action: "task.created",
      summary: title,
      metadata: { taskId: task.id, dueAt: task.dueAt?.toISOString() ?? null },
    });
  }

  return task;
}

export async function completeTask(
  taskId: string,
  actor: AuditActor,
): Promise<Task> {
  const task = await prisma.task.update({
    where: { id: taskId },
    data: { completedAt: new Date() },
  });

  if (task.entity && task.entityId) {
    await recordAudit({
      actor,
      entity: task.entity,
      entityId: task.entityId,
      action: "task.completed",
      summary: task.title,
      metadata: { taskId: task.id },
    });
  }
  return task;
}

export async function reopenTask(
  taskId: string,
  _actor: AuditActor,
): Promise<Task> {
  return prisma.task.update({
    where: { id: taskId },
    data: { completedAt: null },
  });
}

export async function myOpenTasks(adminId: string): Promise<Task[]> {
  return prisma.task.findMany({
    where: { assigneeAdminId: adminId, completedAt: null },
    orderBy: [{ dueAt: { sort: "asc", nulls: "last" } }, { createdAt: "asc" }],
  });
}

export async function tasksForEntity(
  entity: AuditEntity,
  entityId: string,
): Promise<Task[]> {
  return prisma.task.findMany({
    where: { entity, entityId },
    orderBy: [
      { completedAt: { sort: "asc", nulls: "first" } },
      { dueAt: { sort: "asc", nulls: "last" } },
      { createdAt: "asc" },
    ],
  });
}

// ---------- Pure helpers (tested directly) ----------

export type TaskCategory =
  | "overdue"
  | "today"
  | "thisWeek"
  | "later"
  | "noDate"
  | "completed";

export function categoriseTask(
  task: Pick<Task, "dueAt" | "completedAt">,
  now: Date = new Date(),
): TaskCategory {
  if (task.completedAt) return "completed";
  if (!task.dueAt) return "noDate";

  const due = startOfUtcDay(task.dueAt);
  const today = startOfUtcDay(now);
  if (due < today) return "overdue";
  if (due.getTime() === today.getTime()) return "today";

  const sevenDays = new Date(today);
  sevenDays.setUTCDate(sevenDays.getUTCDate() + 7);
  if (due <= sevenDays) return "thisWeek";
  return "later";
}

export function isTaskOverdue(
  task: Pick<Task, "dueAt" | "completedAt">,
  now: Date = new Date(),
): boolean {
  return categoriseTask(task, now) === "overdue";
}

// Sort priority for the My Tasks list: overdue first, then today,
// this week, later, no-date, completed at the bottom.
const CATEGORY_RANK: Record<TaskCategory, number> = {
  overdue: 0,
  today: 1,
  thisWeek: 2,
  later: 3,
  noDate: 4,
  completed: 5,
};

export function sortTasksByPriority<
  T extends { dueAt: Date | null; completedAt: Date | null },
>(tasks: T[], now: Date = new Date()): T[] {
  return [...tasks].sort((a, b) => {
    const ra = CATEGORY_RANK[categoriseTask(a, now)];
    const rb = CATEGORY_RANK[categoriseTask(b, now)];
    if (ra !== rb) return ra - rb;
    // Within a bucket, earlier dueAt first; null sorts last.
    if (a.dueAt && b.dueAt) return a.dueAt.getTime() - b.dueAt.getTime();
    if (a.dueAt) return -1;
    if (b.dueAt) return 1;
    return 0;
  });
}

function startOfUtcDay(d: Date): Date {
  const next = new Date(d);
  next.setUTCHours(0, 0, 0, 0);
  return next;
}

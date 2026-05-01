// TasksPanel — server component for an entity's pinned tasks plus
// the create form. Renders open tasks first, completed at the
// bottom, both ordered by due date.
//
// Categorisation badges lean on the pure helper from lib/tasks
// so the labels match what the global /admin/tasks page shows.

import type { AuditEntity, Task } from "@prisma/client";
import { tasksForEntity, categoriseTask, type TaskCategory } from "@/lib/tasks";
import {
  createEntityTaskAction,
  toggleTaskAction,
} from "./tasks-actions";

const CATEGORY_BADGE: Record<TaskCategory, string> = {
  overdue: "bg-red-100 text-red-800",
  today: "bg-amber-100 text-amber-800",
  thisWeek: "bg-stone-100 text-stone-700",
  later: "bg-stone-50 text-stone-500",
  noDate: "bg-stone-50 text-stone-500",
  completed: "bg-emerald-50 text-emerald-700",
};

const CATEGORY_LABEL: Record<TaskCategory, string> = {
  overdue: "Overdue",
  today: "Today",
  thisWeek: "This week",
  later: "Later",
  noDate: "No date",
  completed: "Done",
};

export async function TasksPanel({
  entity,
  entityId,
  returnPath,
}: {
  entity: AuditEntity;
  entityId: string;
  returnPath: string;
}) {
  const tasks = await tasksForEntity(entity, entityId);
  const open = tasks.filter((t) => !t.completedAt);
  const done = tasks.filter((t) => t.completedAt);
  const createBound = createEntityTaskAction.bind(
    null,
    entity,
    entityId,
    returnPath,
  );

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-base font-medium text-stone-900">Tasks</h3>
        <span className="text-xs text-stone-400">
          {open.length} open · {done.length} done
        </span>
      </div>
      <p className="mt-1 text-sm text-stone-500">
        Use this for follow-ups pinned to this record. Personal to-dos go on{" "}
        <code className="text-stone-700">/admin/tasks</code>.
      </p>

      <form action={createBound} className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto_auto]">
        <input
          name="title"
          required
          placeholder="Follow up on lease renewal"
          className="rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
        />
        <input
          name="dueAt"
          type="date"
          className="rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
        />
        <button
          type="submit"
          className="rounded-md bg-stone-900 px-3 py-2 text-sm font-medium text-white hover:bg-stone-800"
        >
          Add task
        </button>
      </form>

      {tasks.length === 0 ? (
        <p className="mt-6 text-sm text-stone-500">
          No tasks yet. Add the first one above.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-stone-100">
          {[...open, ...done].map((t) => (
            <TaskRow key={t.id} task={t} returnPath={returnPath} />
          ))}
        </ul>
      )}
    </section>
  );
}

export function TaskRow({
  task,
  returnPath,
}: {
  task: Task;
  returnPath: string;
}) {
  const category = categoriseTask(task);
  const toggleBound = toggleTaskAction.bind(
    null,
    task.id,
    Boolean(task.completedAt),
    returnPath,
  );
  return (
    <li className="flex items-start justify-between gap-4 py-3">
      <form action={toggleBound} className="flex flex-1 items-start gap-3">
        <button
          type="submit"
          aria-label={task.completedAt ? "Reopen task" : "Mark complete"}
          className={
            task.completedAt
              ? "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-300 bg-emerald-50 text-xs text-emerald-700"
              : "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-stone-300 bg-white text-xs text-stone-400 hover:border-stone-500 hover:text-stone-700"
          }
        >
          {task.completedAt ? "✓" : ""}
        </button>
        <div className="min-w-0 flex-1">
          <p
            className={
              task.completedAt
                ? "text-sm text-stone-400 line-through"
                : "text-sm text-stone-900"
            }
          >
            {task.title}
          </p>
          {task.dueAt ? (
            <p className="text-xs text-stone-500">
              Due {task.dueAt.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          ) : null}
        </div>
      </form>
      <span
        className={`inline-flex shrink-0 items-center rounded px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${CATEGORY_BADGE[category]}`}
      >
        {CATEGORY_LABEL[category]}
      </span>
    </li>
  );
}

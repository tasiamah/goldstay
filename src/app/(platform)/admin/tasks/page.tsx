// /admin/tasks — "My open tasks" for the logged-in admin.
//
// Personal to-dos created here aren't pinned to an entity; they're
// the operator's own list. Tasks pinned from a property /
// owner panel show up here too (because the assignee defaults to
// the creator). The categorise helper from lib/tasks runs through
// sortTasksByPriority so overdue floats to the top.

import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { myOpenTasks, sortTasksByPriority } from "@/lib/tasks";
import { prisma } from "@/lib/db";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { TaskRow } from "@/components/admin/tasks/TasksPanel";
import { createPersonalTaskAction } from "@/components/admin/tasks/tasks-actions";

export const dynamic = "force-dynamic";

export default async function MyTasksPage() {
  const admin = await requireAdmin();
  const tasks = sortTasksByPriority(await myOpenTasks(admin.id));

  // We also surface the most recently completed 10 so the operator
  // can quickly reopen something they marked done by accident.
  const recentlyCompleted = await prisma.task.findMany({
    where: {
      assigneeAdminId: admin.id,
      completedAt: { not: null },
    },
    orderBy: { completedAt: "desc" },
    take: 10,
  });

  const createBound = createPersonalTaskAction.bind(null, "/admin/tasks");
  const returnPath = "/admin/tasks";

  return (
    <div className="space-y-8">
      <div>
        <Breadcrumbs items={[{ label: "Tasks" }]} />
        <h2 className="mt-2 text-xl font-medium text-stone-900">My tasks</h2>
        <p className="mt-1 text-sm text-stone-500">
          Personal to-dos plus anything assigned to you from a property or
          owner page. Linked tasks show the entity below the title.
        </p>
      </div>

      <section className="rounded-lg border border-stone-200 bg-white p-6">
        <form
          action={createBound}
          className="grid gap-2 sm:grid-cols-[1fr_auto_auto]"
        >
          <input
            name="title"
            required
            placeholder="Quick to-do"
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
            Inbox zero. Add a personal to-do above, or pin a task from any
            owner / property detail page.
          </p>
        ) : (
          <ul className="mt-6 divide-y divide-stone-100">
            {tasks.map((t) => (
              <TaskRow key={t.id} task={t} returnPath={returnPath} />
            ))}
          </ul>
        )}
      </section>

      {recentlyCompleted.length > 0 ? (
        <section className="rounded-lg border border-stone-200 bg-stone-50 p-6">
          <h3 className="text-base font-medium text-stone-900">
            Recently completed
          </h3>
          <p className="mt-1 text-sm text-stone-500">
            Click the check to reopen a task. Older history is in the audit
            trail on the linked entity.
          </p>
          <ul className="mt-4 divide-y divide-stone-200">
            {recentlyCompleted.map((t) => (
              <TaskRow key={t.id} task={t} returnPath={returnPath} />
            ))}
          </ul>
        </section>
      ) : null}

      <p className="text-xs text-stone-400">
        Need to assign a task to a teammate? Open the entity and add the task
        there — assignment by name lands in a future iteration. Until then,{" "}
        <Link href="/admin/team" className="underline">
          ping them
        </Link>{" "}
        directly.
      </p>
    </div>
  );
}

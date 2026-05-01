// Cron / background job execution recorder.
//
// `wrapJob(name, fn)` runs `fn`, persists a JobRun row with start /
// finish / status / error, and re-throws on failure so the caller's
// HTTP response stays correct. The system-health page reads JobRun
// rows to show last-24h success rate, longest run, last error per
// job name. Cheap, zero-dep replacement for a separate observability
// product while traffic is small.

import { prisma } from "@/lib/db";
import type { JobRun } from "@prisma/client";

export type JobResult = {
  summary?: string;
  // Caller-supplied detail surfaced in the system-health card.
};

export async function wrapJob(
  name: string,
  fn: () => Promise<JobResult | void>,
): Promise<JobRun> {
  const startedAt = new Date();
  try {
    const result = (await fn()) ?? {};
    return await prisma.jobRun.create({
      data: {
        name,
        status: "SUCCESS",
        startedAt,
        finishedAt: new Date(),
        summary: result.summary ?? null,
        error: null,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await prisma.jobRun.create({
      data: {
        name,
        status: "FAILURE",
        startedAt,
        finishedAt: new Date(),
        summary: null,
        error: message.slice(0, 2000),
      },
    });
    throw err;
  }
}

export async function listRecentJobRuns(
  hours = 24,
): Promise<JobRun[]> {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);
  return prisma.jobRun.findMany({
    where: { startedAt: { gte: since } },
    orderBy: { startedAt: "desc" },
  });
}

// Pure helper for the system-health summary card.
export type JobNameSummary = {
  name: string;
  total: number;
  successes: number;
  failures: number;
  lastRun: JobRun | null;
};

export function summariseRunsByName(runs: JobRun[]): JobNameSummary[] {
  const byName = new Map<string, JobNameSummary>();
  for (const r of runs) {
    let s = byName.get(r.name);
    if (!s) {
      s = {
        name: r.name,
        total: 0,
        successes: 0,
        failures: 0,
        lastRun: null,
      };
      byName.set(r.name, s);
    }
    s.total += 1;
    if (r.status === "SUCCESS") s.successes += 1;
    else s.failures += 1;
    if (!s.lastRun || s.lastRun.startedAt < r.startedAt) {
      s.lastRun = r;
    }
  }
  return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name));
}

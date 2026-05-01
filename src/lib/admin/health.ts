// System health snapshot.
//
// Joins everything an operator wants to glance at on /admin/health:
// last-24h JobRun success/failure per name, iCal feeds with the
// most recent error, last QUEUED/FAILED StatementSends, and a
// rough indicator of whether Resend is configured.
//
// Pure read-side helpers. The page composes them.

import { prisma } from "@/lib/db";
import {
  listRecentJobRuns,
  summariseRunsByName,
  type JobNameSummary,
} from "./job-run";
import type {
  PropertyIcalFeed,
  StatementSend,
} from "@prisma/client";

export type IcalFeedHealth = Pick<
  PropertyIcalFeed,
  | "id"
  | "propertyId"
  | "source"
  | "lastSyncedAt"
  | "lastSuccessAt"
  | "lastError"
> & {
  property: { name: string; unitNumber: string | null } | null;
};

export type StatementSendHealth = Pick<
  StatementSend,
  | "id"
  | "ownerId"
  | "periodYear"
  | "periodMonth"
  | "status"
  | "createdAt"
  | "sentAt"
  | "error"
> & {
  owner: {
    fullName: string;
    companyName: string | null;
  } | null;
};

export type SystemHealth = {
  generatedAt: Date;
  jobs: JobNameSummary[];
  failingFeeds: IcalFeedHealth[];
  recentSends: StatementSendHealth[];
  resendConfigured: boolean;
  supabaseConfigured: boolean;
};

export async function getSystemHealth(): Promise<SystemHealth> {
  const runs = await listRecentJobRuns(24);
  const jobs = summariseRunsByName(runs);

  const [failingFeeds, recentSends] = await Promise.all([
    prisma.propertyIcalFeed.findMany({
      where: { lastError: { not: null } },
      orderBy: { lastSyncedAt: "desc" },
      take: 25,
      include: {
        property: {
          select: { name: true, unitNumber: true },
        },
      },
    }),
    prisma.statementSend.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        owner: { select: { fullName: true, companyName: true } },
      },
    }),
  ]);

  return {
    generatedAt: new Date(),
    jobs,
    failingFeeds,
    recentSends,
    resendConfigured: Boolean(process.env.RESEND_API_KEY),
    supabaseConfigured: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.SUPABASE_SECRET_KEY,
    ),
  };
}

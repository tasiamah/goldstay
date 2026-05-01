// Owner notifications — derived sync.
//
// Called from the owner dashboard render path. Reconciles
// OwnerNotification rows against the owner's current state so the
// bell always shows what's actionable right now.
//
// We avoid an event bus / cron for the MVP because:
//
//   * The four derived sources are all cheap to query alongside the
//     dashboard's existing reads.
//   * "Right when the owner opens the page" is the only moment the
//     bell is going to be looked at, so eventual consistency is fine.
//   * A separate cron risks the bell going stale between runs and
//     would need a way to coalesce duplicate inserts anyway.
//
// Idempotency is enforced by the (ownerId, kind, sourceRef) unique
// index on OwnerNotification — see the schema comment. We never
// delete derived rows: when the source condition is no longer true,
// we set resolvedAt so the owner can scroll through "what was true
// when" without losing context. ADMIN_BROADCAST rows are never
// touched here.

import {
  type ManagementAgreement,
  type OwnerNotificationKind,
  type OwnerNotificationTone,
  type Prisma,
  type StatementSend,
  type Transaction,
} from "@prisma/client";
import { prisma } from "@/lib/db";
import type {
  SetupChecklist,
  SetupStepKey,
} from "@/lib/owner/setup-status";

// Each desired derived notification we'd like to exist right now.
// The sync diffs this against the active rows in the database and
// applies the minimum set of inserts + resolves.
export type DesiredNotification = {
  kind: OwnerNotificationKind;
  sourceRef: string;
  tone: OwnerNotificationTone;
  title: string;
  body?: string;
  href?: string;
};

// All the inputs needed to compute the desired set. Pure with
// respect to these inputs — easy to unit-test.
export type SyncInputs = {
  setup: SetupChecklist;
  pendingAgreements: Pick<
    ManagementAgreement & {
      property: { id: string; name: string; unitNumber: string | null };
    },
    "id" | "property"
  >[];
  // Most recent statement that's been sent + its month label. Pass
  // null if none. We only ever surface one row for the latest period
  // — if an owner needs to scroll, they go to /owner/statements.
  latestStatement: Pick<
    StatementSend,
    "periodYear" | "periodMonth" | "sentAt"
  > | null;
  // Most recent OUTFLOW transaction that's actually a payout (i.e.
  // a wire we sent the owner) within the last `payoutWindowDays`.
  // Pass null if none. We only ever surface one.
  latestPayout: Pick<
    Transaction,
    "id" | "amount" | "currency" | "occurredOn"
  > | null;
  payoutWindowDays?: number;
};

const DEFAULT_PAYOUT_WINDOW_DAYS = 14;

const STEP_TITLE: Record<SetupStepKey, string> = {
  details: "Finish your details",
  legal: "Upload your ID document",
  bank: "Add a payout method",
};

const STEP_HREF: Record<SetupStepKey, string> = {
  details: "/owner/profile#details",
  legal: "/owner/payouts?step=legal#legal",
  bank: "/owner/payouts?step=bank#bank",
};

// Pure: no DB access. Returns the ideal set of derived
// notifications for the given inputs. Tested directly.
export function buildDesiredNotifications(
  inputs: SyncInputs,
): DesiredNotification[] {
  const desired: DesiredNotification[] = [];

  for (const step of inputs.setup.steps) {
    if (step.done) continue;
    desired.push({
      kind: "SETUP_INCOMPLETE",
      sourceRef: step.key,
      tone: "WARNING",
      title: STEP_TITLE[step.key],
      body: step.description,
      href: STEP_HREF[step.key],
    });
  }

  for (const agreement of inputs.pendingAgreements) {
    const propertyLabel = agreement.property.unitNumber
      ? `${agreement.property.name} ${agreement.property.unitNumber}`
      : agreement.property.name;
    desired.push({
      kind: "AGREEMENT_PENDING",
      sourceRef: agreement.id,
      tone: "WARNING",
      title: `Sign your management agreement`,
      body: `For ${propertyLabel}. Until this is signed, payouts and statements stay paused.`,
      href: `/owner/agreements/${agreement.id}`,
    });
  }

  if (inputs.latestStatement) {
    const periodKey = `${inputs.latestStatement.periodYear}-${String(
      inputs.latestStatement.periodMonth,
    ).padStart(2, "0")}`;
    desired.push({
      kind: "STATEMENT_AVAILABLE",
      sourceRef: `period:${periodKey}`,
      tone: "INFO",
      title: `Your ${monthLabel(
        inputs.latestStatement.periodYear,
        inputs.latestStatement.periodMonth,
      )} statement is ready`,
      body: "Download the signed PDF for your records.",
      href: "/owner/statements",
    });
  }

  if (inputs.latestPayout) {
    const days = inputs.payoutWindowDays ?? DEFAULT_PAYOUT_WINDOW_DAYS;
    const ageDays = Math.floor(
      (Date.now() - inputs.latestPayout.occurredOn.getTime()) /
        (1000 * 60 * 60 * 24),
    );
    if (ageDays <= days) {
      desired.push({
        kind: "PAYOUT_PAID",
        sourceRef: inputs.latestPayout.id,
        tone: "SUCCESS",
        title: `Payout of ${
          inputs.latestPayout.currency
        } ${Number(inputs.latestPayout.amount).toLocaleString("en-GB", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} sent`,
        body: `On ${inputs.latestPayout.occurredOn.toLocaleDateString(
          "en-GB",
          { day: "2-digit", month: "short", year: "numeric" },
        )}. See the matching receipt under Transactions.`,
        href: "/owner/transactions",
      });
    }
  }

  return desired;
}

function monthLabel(year: number, month: number): string {
  const d = new Date(year, month - 1, 1);
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

// Applies the desired set against the database in a single
// transaction. Returns nothing; the caller refetches via
// listOwnerNotifications. Idempotent: safe to call on every render.
export async function syncOwnerNotifications(
  ownerId: string,
  inputs: SyncInputs,
): Promise<void> {
  const desired = buildDesiredNotifications(inputs);
  // Active = unresolved derived rows. We never touch BROADCAST.
  const existing = await prisma.ownerNotification.findMany({
    where: {
      ownerId,
      kind: { not: "ADMIN_BROADCAST" },
      resolvedAt: null,
    },
    select: { id: true, kind: true, sourceRef: true },
  });

  const desiredKey = (n: { kind: string; sourceRef: string | null }) =>
    `${n.kind}::${n.sourceRef ?? ""}`;
  const desiredKeys = new Set(desired.map(desiredKey));
  const existingKeys = new Set(existing.map(desiredKey));

  const toResolve = existing.filter((e) => !desiredKeys.has(desiredKey(e)));
  const toUpsert = desired.filter((d) => !existingKeys.has(desiredKey(d)));

  if (toUpsert.length === 0 && toResolve.length === 0) return;

  await prisma.$transaction([
    ...(toResolve.length > 0
      ? [
          prisma.ownerNotification.updateMany({
            where: { id: { in: toResolve.map((r) => r.id) } },
            data: { resolvedAt: new Date() },
          }),
        ]
      : []),
    ...toUpsert.map((d) =>
      prisma.ownerNotification.upsert({
        where: {
          ownerId_kind_sourceRef: {
            ownerId,
            kind: d.kind,
            sourceRef: d.sourceRef,
          },
        },
        create: {
          ownerId,
          kind: d.kind,
          tone: d.tone,
          title: d.title,
          body: d.body,
          href: d.href,
          sourceRef: d.sourceRef,
        },
        // If a previously-resolved row exists for the same key, we
        // re-open it (clear resolvedAt + readAt) so the owner sees
        // it again. This handles "they completed setup, then we
        // added a new step that's now incomplete" gracefully.
        update: {
          tone: d.tone,
          title: d.title,
          body: d.body,
          href: d.href,
          resolvedAt: null,
          readAt: null,
        },
      }),
    ),
  ] as Prisma.PrismaPromise<unknown>[]);
}


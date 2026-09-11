// The reminder runner: finds unsigned agreements, decides what each one
// is owed via the pure planner, and does it exactly once.
//
// Split from reminder-schedule.ts on purpose. Everything about *when*
// to chase is pure and tested at pinned timestamps; this module is the
// part that talks to Postgres and Resend, and it deliberately contains
// no cadence arithmetic of its own.
//
// At-most-once is enforced in the database, not here. A step is claimed
// before it is sent — either by inserting an AgreementReminder row
// (whose unique index on (agreementId, step) makes concurrent runs race
// for one winner) or by an attempts-guarded updateMany, which is the
// same optimistic-concurrency pattern signAgreementAction uses. A run
// that dies between claiming and sending leaves the row QUEUED, and the
// next run retries it rather than the client silently losing a nudge.

import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { mintCallbackLink } from "@/lib/supabase/magic-link";
import { logCommunication } from "@/lib/comms";
import { recordAudit, type AuditActor } from "@/lib/audit";
import { createTask } from "@/lib/tasks";
import { formatPropertyDisplayName } from "@/lib/format-property";
import {
  ESCALATION_STEP,
  isFollowUpStep,
  LAST_EMAIL_STEP,
  planAgreementReminder,
  REMINDER_LADDER,
  timeZoneForCountry,
  type ReminderPlan,
  type WaitReason,
} from "./reminder-schedule";
import {
  escalationTaskNotes,
  escalationTaskTitle,
  escalationWaMessage,
  renderEscalationEmail,
  renderReminderEmail,
} from "./reminder-email";
import { clientWaLink } from "@/lib/wa-contact";
import { AGREEMENT_TEMPLATE_TITLE } from "./template";

const DEFAULT_FROM = "Goldstay <hello@goldstay.co.ke>";
const DEFAULT_SITE = "https://goldstay.co.ke";
const DEFAULT_INBOX = "hello@goldstay.co.ke";

// Cron has no admin session, so audit rows and tasks are attributed to
// the job rather than to a person. Kept as a named constant so a
// timeline reader can tell an automated chase from an operator's.
const SYSTEM_ACTOR: AuditActor = {
  adminId: null,
  email: "system@goldstay.co.ke",
};

// Ceiling on client emails per run. Bounds the blast radius of a bad
// deploy or a data accident: if something ever makes every agreement
// look freshly unsigned, this run sends 50 emails and says so in the
// job summary, rather than mailing the entire client base at 3am.
export const DEFAULT_SEND_LIMIT = 50;

export type ReminderOutcome =
  | { kind: "emailed"; step: number; agreementId: string }
  | { kind: "escalated"; agreementId: string }
  | { kind: "failed"; step: number; agreementId: string; error: string }
  | { kind: "claimed-elsewhere"; step: number; agreementId: string }
  | { kind: "waited"; reason: WaitReason; agreementId: string }
  | { kind: "would-send"; step: number; agreementId: string };

export type RunSummary = {
  considered: number;
  emailed: number;
  escalated: number;
  failed: number;
  waited: number;
  skippedSteps: number;
  capped: boolean;
  dryRun: boolean;
  outcomes: ReminderOutcome[];
};

export type RunOptions = {
  now?: Date;
  limit?: number;
  /** Plan and report without sending, claiming or escalating. */
  dryRun?: boolean;
};

export function isReminderDeliveryConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function runAgreementReminders(
  options: RunOptions = {},
): Promise<RunSummary> {
  const now = options.now ?? new Date();
  const limit = options.limit ?? DEFAULT_SEND_LIMIT;
  const dryRun = options.dryRun ?? false;

  const candidates = await findCandidates();
  const summary: RunSummary = {
    considered: candidates.length,
    emailed: 0,
    escalated: 0,
    failed: 0,
    waited: 0,
    skippedSteps: 0,
    capped: false,
    dryRun,
    outcomes: [],
  };

  for (const agreement of candidates) {
    // The cap counts actions taken, not agreements looked at, so a run
    // that hits it resumes from the same place an hour later.
    if (summary.emailed + summary.escalated >= limit) {
      summary.capped = true;
      break;
    }

    const plan = planAgreementReminder({
      status: agreement.status,
      sentAt: agreement.sentAt,
      history: agreement.reminders.map((r) => ({
        step: r.step,
        status: r.status,
        attempts: r.attempts,
      })),
      timeZone: timeZoneForCountry(agreement.property.client.country),
      now,
    });

    if (plan.action === "wait") {
      summary.waited += 1;
      summary.outcomes.push({
        kind: "waited",
        reason: plan.reason,
        agreementId: agreement.id,
      });
      continue;
    }

    if (dryRun) {
      summary.outcomes.push({
        kind: "would-send",
        step: plan.step,
        agreementId: agreement.id,
      });
      continue;
    }

    summary.skippedSteps += await recordSuperseded(agreement.id, plan);

    const outcome =
      plan.kind === "ESCALATION"
        ? await escalate(agreement, plan.step, now)
        : await sendReminder(agreement, plan.step);

    summary.outcomes.push(outcome);
    if (outcome.kind === "emailed") summary.emailed += 1;
    else if (outcome.kind === "escalated") summary.escalated += 1;
    else if (outcome.kind === "failed") summary.failed += 1;
  }

  return summary;
}

// Everything that could conceivably be owed a reminder. The status and
// timing gates live in the planner; this query only excludes rows where
// chasing makes no sense at all, so the planner's decisions stay
// testable without a database.
async function findCandidates() {
  return prisma.managementAgreement.findMany({
    where: {
      status: "SENT",
      signedAt: null,
      property: {
        archivedAt: null,
        // An exited property is off the books. Nobody is chasing a
        // signature on it, and emailing about one would be baffling.
        status: { not: "EXITED" },
        client: { archivedAt: null },
      },
    },
    // Oldest first, so if the per-run cap bites it bites the freshest
    // agreements, which have the most time left on the ladder.
    orderBy: { sentAt: "asc" },
    select: {
      id: true,
      status: true,
      sentAt: true,
      reference: true,
      // Needed for the subject line. One unit can carry two agreements
      // at once, a short-let and a long-let, and without the template
      // every reminder for both reads identically in the inbox.
      template: true,
      reminders: { select: { step: true, status: true, attempts: true } },
      property: {
        select: {
          id: true,
          name: true,
          unitNumber: true,
          city: true,
          client: {
            select: {
              id: true,
              email: true,
              fullName: true,
              phone: true,
              country: true,
            },
          },
        },
      },
    },
  });
}

type Candidate = Awaited<ReturnType<typeof findCandidates>>[number];

// Steps that came due while nothing was running. Recorded as SKIPPED so
// a recovering cron sends one email instead of the whole ladder, and so
// the gap is visible afterwards rather than looking like we chose not
// to chase.
async function recordSuperseded(
  agreementId: string,
  plan: Extract<ReminderPlan, { action: "send" }>,
): Promise<number> {
  if (plan.supersede.length === 0) return 0;
  const { count } = await prisma.agreementReminder.createMany({
    data: plan.supersede.map((step) => ({
      agreementId,
      step,
      kind: kindOf(step),
      status: "SKIPPED" as const,
      attempts: 0,
    })),
    skipDuplicates: true,
  });
  return count;
}

// Claims a step for this run. Returns false when another run got there
// first, which under an hourly cron with manual replays is a normal
// outcome rather than an error.
async function claimStep(agreement: Candidate, step: number): Promise<boolean> {
  const existing = agreement.reminders.find((r) => r.step === step);

  if (!existing) {
    try {
      await prisma.agreementReminder.create({
        data: {
          agreementId: agreement.id,
          step,
          kind: kindOf(step),
          status: "QUEUED",
          attempts: 1,
        },
      });
      return true;
    } catch (err) {
      // P2002 on (agreementId, step): a concurrent run inserted the
      // same claim. Exactly the collision the unique index exists for.
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        return false;
      }
      throw err;
    }
  }

  // Retrying a QUEUED or FAILED row. Guarding on the attempts value we
  // read means two overlapping runs cannot both increment it and both
  // send.
  const { count } = await prisma.agreementReminder.updateMany({
    where: {
      agreementId: agreement.id,
      step,
      attempts: existing.attempts,
      status: { in: ["QUEUED", "FAILED"] },
    },
    data: { attempts: existing.attempts + 1, status: "QUEUED" },
  });
  return count === 1;
}

async function sendReminder(
  agreement: Candidate,
  step: number,
): Promise<ReminderOutcome> {
  if (!(await claimStep(agreement, step))) {
    return { kind: "claimed-elsewhere", step, agreementId: agreement.id };
  }

  const client = agreement.property.client;
  const propertyLabel = formatPropertyDisplayName(
    agreement.property.name,
    agreement.property.unitNumber,
  );
  const siteUrl = process.env.PUBLIC_SITE_URL || DEFAULT_SITE;
  const from =
    process.env.RESEND_FROM_CLIENTS ||
    process.env.RESEND_FROM_OWNERS ||
    DEFAULT_FROM;

  // A fresh link per reminder. Magic links expire, so reusing the one
  // from the original email would send the client to an error page —
  // worse than sending no link, because it looks like the agreement
  // itself is broken.
  const agreementPath = `/client/agreements/${agreement.id}`;
  let link = `${siteUrl}${agreementPath}`;
  try {
    const minted = await mintCallbackLink({
      email: client.email,
      siteUrl,
      next: agreementPath,
    });
    if (minted) link = minted;
  } catch (err) {
    console.warn("[agreement-remind] link generation failed", err);
  }

  const rendered = renderReminderEmail({
    step,
    clientName: client.fullName,
    propertyLabel,
    agreementTitle: AGREEMENT_TEMPLATE_TITLE[agreement.template],
    reference: agreement.reference,
    link,
  });
  if (!rendered) {
    return await markFailed(agreement.id, step, `no copy for step ${step}`);
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    const result = await resend.emails.send({
      from,
      to: [client.email],
      subject: rendered.subject,
      text: rendered.text,
      html: rendered.html,
    });
    const providerId = (result?.data?.id as string | undefined) ?? null;

    await prisma.agreementReminder.updateMany({
      where: { agreementId: agreement.id, step },
      data: { status: "SENT", sentAt: new Date(), providerId, error: null },
    });

    // Bookkeeping is best-effort: a successful send must never be
    // reported as failed because a log write did not land.
    await safely(() =>
      logCommunication({
        clientId: client.id,
        channel: "EMAIL",
        direction: "OUTBOUND",
        subject: rendered.subject,
        status: "SENT",
        providerId,
      }),
    );
    await safely(() =>
      recordAudit({
        actor: SYSTEM_ACTOR,
        entity: "AGREEMENT",
        entityId: agreement.id,
        action: "agreement.reminder.sent",
        summary: `Reminder ${step} of ${LAST_EMAIL_STEP} sent to ${client.email}`,
        metadata: { step, propertyId: agreement.property.id, providerId },
      }),
    );

    return { kind: "emailed", step, agreementId: agreement.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[agreement-remind] send failed", message);
    await safely(() =>
      logCommunication({
        clientId: client.id,
        channel: "EMAIL",
        direction: "OUTBOUND",
        subject: rendered.subject,
        status: "FAILED",
      }),
    );
    return await markFailed(agreement.id, step, message);
  }
}

// Hands the client to a human. Stops the automated emailing, puts a
// task on the property so the follow-up is owned, and tells ops — the
// task alone would sit unassigned and unseen, and an email alone would
// be read once and forgotten.
//
// Also handles the weekly follow-ups after it, which are the same two
// actions with different wording. Same code path deliberately: a
// separate one would drift, and the only real difference is whether
// this is news or a standing reproach.
async function escalate(
  agreement: Candidate,
  step: number,
  now: Date,
): Promise<ReminderOutcome> {
  if (!(await claimStep(agreement, step))) {
    return { kind: "claimed-elsewhere", step, agreementId: agreement.id };
  }

  const client = agreement.property.client;
  const propertyLabel = formatPropertyDisplayName(
    agreement.property.name,
    agreement.property.unitNumber,
  );
  const siteUrl = process.env.PUBLIC_SITE_URL || DEFAULT_SITE;
  const adminLink = `${siteUrl}/admin/properties/${agreement.property.id}`;
  const emailsSent = agreement.reminders.filter(
    (r) => r.status === "SENT" && r.step <= LAST_EMAIL_STEP,
  ).length;

  // 0 for the handover, then 1, 2, 3… for each weekly follow-up.
  const followUpNumber = isFollowUpStep(step) ? step - ESCALATION_STEP : 0;

  const waLink = clientWaLink({
    phone: client.phone,
    country: client.country,
    message: escalationWaMessage({
      clientName: client.fullName,
      propertyLabel,
    }),
  });

  try {
    await createTask({
      actor: SYSTEM_ACTOR,
      title: escalationTaskTitle({
        clientName: client.fullName,
        propertyLabel,
        followUpNumber,
      }),
      notes: escalationTaskNotes({
        emailsSent,
        clientPhone: client.phone,
        clientEmail: client.email,
        waLink,
        followUpNumber,
      }),
      // Due immediately. The property has been off the market for over
      // a week at this point and every day of that is lost rent.
      dueAt: now,
      entity: "PROPERTY",
      entityId: agreement.property.id,
    });

    await safely(() =>
      sendEscalationEmail({
        clientName: client.fullName,
        clientEmail: client.email,
        clientPhone: client.phone,
        propertyLabel,
        propertyCity: agreement.property.city,
        reference: agreement.reference,
        sentAt: agreement.sentAt ?? now,
        emailsSent,
        adminLink,
        waLink,
        followUpNumber,
        now,
      }),
    );

    await prisma.agreementReminder.updateMany({
      where: { agreementId: agreement.id, step },
      data: { status: "SENT", sentAt: new Date(), error: null },
    });

    await safely(() =>
      recordAudit({
        actor: SYSTEM_ACTOR,
        entity: "AGREEMENT",
        entityId: agreement.id,
        action: "agreement.reminder.escalated",
        summary:
          followUpNumber === 0
            ? `Unsigned after ${emailsSent} reminders — raised for a WhatsApp chase`
            : `Still unsigned ${followUpNumber} ${followUpNumber === 1 ? "week" : "weeks"} after handover — weekly task raised`,
        metadata: {
          step,
          propertyId: agreement.property.id,
          emailsSent,
          followUpNumber,
        },
      }),
    );

    return { kind: "escalated", agreementId: agreement.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[agreement-remind] escalation failed", message);
    return await markFailed(agreement.id, step, message);
  }
}

async function sendEscalationEmail(
  input: Parameters<typeof renderEscalationEmail>[0],
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_OPS || DEFAULT_FROM;
  const inbox =
    process.env.AGREEMENTS_INBOX || process.env.CONTACT_INBOX || DEFAULT_INBOX;
  const { subject, text } = renderEscalationEmail(input);

  if (!apiKey) {
    console.log(`[agreement-remind] would notify ${inbox}\n${text}`);
    return;
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);
  await resend.emails.send({
    from,
    to: [inbox],
    // Replying reaches the client who has been ignoring us, which is
    // who you want when the next step is a conversation.
    replyTo: input.clientEmail,
    subject,
    text,
  });
}

async function markFailed(
  agreementId: string,
  step: number,
  error: string,
): Promise<ReminderOutcome> {
  await safely(() =>
    prisma.agreementReminder.updateMany({
      where: { agreementId, step },
      data: { status: "FAILED", error: error.slice(0, 1000) },
    }),
  );
  return { kind: "failed", step, agreementId, error };
}

function kindOf(step: number): "EMAIL" | "ESCALATION" {
  // The weekly follow-ups are generated above the end of the array, so
  // a lookup misses them. Defaulting those to EMAIL would send the
  // runner looking for copy that does not exist and fail the row every
  // hour, forever.
  if (step === ESCALATION_STEP || isFollowUpStep(step)) return "ESCALATION";
  return REMINDER_LADDER.find((s) => s.step === step)?.kind ?? "EMAIL";
}

// Bookkeeping writes that must not turn a delivered email into a
// reported failure.
async function safely(fn: () => Promise<unknown>): Promise<void> {
  try {
    await fn();
  } catch (err) {
    console.warn("[agreement-remind] bookkeeping write failed", err);
  }
}

// One-line summary for JobRun, so the system-health page shows what a
// run actually did rather than just that it exited zero.
export function formatRunSummary(summary: RunSummary): string {
  const parts = [
    `considered=${summary.considered}`,
    `emailed=${summary.emailed}`,
    `escalated=${summary.escalated}`,
    `failed=${summary.failed}`,
    `waited=${summary.waited}`,
  ];
  if (summary.skippedSteps > 0)
    parts.push(`superseded=${summary.skippedSteps}`);
  if (summary.capped) parts.push("capped=true");
  if (summary.dryRun) parts.push("dryRun=true");
  return parts.join(" ");
}

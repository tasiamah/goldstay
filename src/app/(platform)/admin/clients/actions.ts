"use server";

// Server Actions for Client mutations from the admin surface. Every
// action revalidates the affected paths and re-runs the auth gate so
// a stolen form action token cannot be replayed by a non-admin.
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { currentAuditActor } from "@/lib/auth";
import { ClientInput } from "@/lib/validation/schemas";
import { flattenZodErrors } from "@/lib/validation/preprocessors";
import { sendClientWelcomeEmail } from "@/lib/client-welcome";
import { recordAudit } from "@/lib/audit";
import { formatClientDisplayName } from "@/lib/format-client";

export type ClientActionResult =
  | { ok: true; clientId: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

function fromForm(formData: FormData) {
  return {
    email: String(formData.get("email") ?? ""),
    fullName: String(formData.get("fullName") ?? ""),
    phone: String(formData.get("phone") ?? "") || undefined,
    companyName: String(formData.get("companyName") ?? "") || undefined,
    country: String(formData.get("country") ?? ""),
    preferredCurrency: String(formData.get("preferredCurrency") ?? "USD"),
  };
}

export async function createClientAction(
  _prev: ClientActionResult | null,
  formData: FormData,
): Promise<ClientActionResult> {
  const actor = await currentAuditActor();

  const parsed = ClientInput.safeParse(fromForm(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: flattenZodErrors(parsed.error),
    };
  }

  try {
    const client = await prisma.client.create({ data: parsed.data });

    await recordAudit({
      actor,
      entity: "CLIENT",
      entityId: client.id,
      action: "client.created",
      summary: `Client ${formatClientDisplayName(client)} created`,
      metadata: { country: client.country, email: client.email },
    });

    // Fire-and-forget welcome email with a magic-link the landlord
    // can click straight from their inbox. We deliberately await it
    // here (not detach with .catch()) so a Resend timeout can't
    // outlive the request lifetime on Vercel — but we never throw on
    // failure, because a missing email is recoverable via the manual
    // "resend welcome" button on the client detail page, while a
    // missing client row would be a real data loss.
    await sendClientWelcomeEmail({
      email: client.email,
      fullName: client.fullName,
      companyName: client.companyName,
      country: client.country,
      clientId: client.id,
      actor,
    }).catch((err) => {
      console.error("[createClientAction] welcome email failed", err);
    });

    revalidatePath("/admin");
    revalidatePath("/admin/clients");
    redirect(`/admin/clients/${client.id}`);
  } catch (e) {
    // Re-throw the redirect "error" so Next.js can handle it; only
    // catch real DB errors here.
    if ((e as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) {
      throw e;
    }
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      return {
        ok: false,
        error: "A client with that email already exists.",
        fieldErrors: { email: "Already in use" },
      };
    }
    return { ok: false, error: "Could not save the client. Please retry." };
  }
}

// Manual re-trigger of the welcome email + magic link. Used when
// the original send bounced, the landlord deleted the email, or the
// 60-minute link expired before they got to it. Idempotent — a
// landlord can receive this many times without any DB side effects.
export async function resendClientWelcomeAction(
  clientId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const actor = await currentAuditActor();

  const client = await prisma.client.findUnique({
    where: { id: clientId },
    select: {
      email: true,
      fullName: true,
      companyName: true,
      country: true,
    },
  });
  if (!client) return { ok: false, error: "Client not found." };

  // sendClientWelcomeEmail owns the audit entry now, so a resend and
  // an initial send are recorded the same way rather than only the
  // resend being written from the call site.
  const result = await sendClientWelcomeEmail({
    ...client,
    clientId,
    actor,
    auditAction: "client.welcomed.resent",
  });
  if (!result.ok) {
    return {
      ok: false,
      error:
        "Welcome email could not be sent. Check Resend logs and try again.",
    };
  }
  return { ok: true };
}

export async function updateClientAction(
  clientId: string,
  _prev: ClientActionResult | null,
  formData: FormData,
): Promise<ClientActionResult> {
  const actor = await currentAuditActor();

  const parsed = ClientInput.safeParse(fromForm(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: flattenZodErrors(parsed.error),
    };
  }

  try {
    const updated = await prisma.client.update({
      where: { id: clientId },
      data: parsed.data,
    });
    await recordAudit({
      actor,
      entity: "CLIENT",
      entityId: clientId,
      action: "client.updated",
      summary: `Client ${formatClientDisplayName(updated)} updated`,
    });
    revalidatePath("/admin");
    revalidatePath("/admin/clients");
    revalidatePath(`/admin/clients/${clientId}`);
    return { ok: true, clientId };
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      return {
        ok: false,
        error: "Another client already uses that email.",
        fieldErrors: { email: "Already in use" },
      };
    }
    return { ok: false, error: "Could not save changes. Please retry." };
  }
}

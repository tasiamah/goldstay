"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { TransactionDirection, TransactionType } from "@prisma/client";
import { prisma } from "@/lib/db";
import { currentAuditActor } from "@/lib/auth";
import { BookingInput } from "@/lib/validation/schemas";
import { flattenZodErrors } from "@/lib/validation/preprocessors";
import { nightsBetween } from "@/lib/bookings/nights";
import { SHORT_TERM_COMMISSION_RATE } from "@/lib/commission";
import { recordAudit } from "@/lib/audit";

export type BookingActionResult =
  | { ok: true; bookingId: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

function fromForm(formData: FormData) {
  return {
    propertyId: String(formData.get("propertyId") ?? ""),
    source: String(formData.get("source") ?? "DIRECT"),
    externalId: String(formData.get("externalId") ?? ""),
    guestName: String(formData.get("guestName") ?? ""),
    guestEmail: String(formData.get("guestEmail") ?? ""),
    checkIn: String(formData.get("checkIn") ?? ""),
    checkOut: String(formData.get("checkOut") ?? ""),
    grossAmount: String(formData.get("grossAmount") ?? ""),
    otaCommission: String(formData.get("otaCommission") ?? ""),
    cleaningFee: String(formData.get("cleaningFee") ?? ""),
    netPayout: String(formData.get("netPayout") ?? ""),
    currency: String(formData.get("currency") ?? "KES"),
    status: String(formData.get("status") ?? "CONFIRMED"),
    notes: String(formData.get("notes") ?? ""),
  };
}

export async function createBookingAction(
  _prev: BookingActionResult | null,
  formData: FormData,
): Promise<BookingActionResult> {
  const actor = await currentAuditActor();
  const parsed = BookingInput.safeParse(fromForm(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: flattenZodErrors(parsed.error),
    };
  }
  const nights = nightsBetween(parsed.data.checkIn, parsed.data.checkOut);
  if (nights <= 0) {
    return {
      ok: false,
      error: "Check-out must be at least one night after check-in.",
      fieldErrors: { checkOut: "Must be after check-in." },
    };
  }

  try {
    const booking = await prisma.booking.create({
      data: { ...parsed.data, nights },
    });
    await recordAudit({
      actor,
      entity: "BOOKING",
      entityId: booking.id,
      action: "booking.created",
      summary: `Booking ${booking.guestName} (${nights}n) created`,
      metadata: { propertyId: booking.propertyId, source: booking.source },
    });
    revalidatePath("/admin");
    revalidatePath(`/admin/properties/${parsed.data.propertyId}`);
    redirect(`/admin/properties/${parsed.data.propertyId}`);
  } catch (e) {
    if ((e as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) {
      throw e;
    }
    return { ok: false, error: "Could not save the booking. Please retry." };
  }
}

export async function cancelBookingAction(bookingId: string): Promise<void> {
  const actor = await currentAuditActor();
  const booking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED" },
    select: { propertyId: true, guestName: true },
  });
  await recordAudit({
    actor,
    entity: "BOOKING",
    entityId: bookingId,
    action: "booking.cancelled",
    summary: `Booking ${booking.guestName} cancelled`,
    metadata: { propertyId: booking.propertyId },
  });
  revalidatePath("/admin");
  revalidatePath(`/admin/properties/${booking.propertyId}`);
}

export async function updateBookingAction(
  bookingId: string,
  _prev: BookingActionResult | null,
  formData: FormData,
): Promise<BookingActionResult> {
  const actor = await currentAuditActor();
  const parsed = BookingInput.safeParse(fromForm(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: flattenZodErrors(parsed.error),
    };
  }
  const nights = nightsBetween(parsed.data.checkIn, parsed.data.checkOut);
  if (nights <= 0) {
    return {
      ok: false,
      error: "Check-out must be at least one night after check-in.",
      fieldErrors: { checkOut: "Must be after check-in." },
    };
  }
  try {
    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { ...parsed.data, nights },
      select: { id: true, propertyId: true, guestName: true },
    });
    await recordAudit({
      actor,
      entity: "BOOKING",
      entityId: bookingId,
      action: "booking.updated",
      summary: `Booking ${updated.guestName} updated`,
      metadata: { propertyId: updated.propertyId },
    });
    revalidatePath("/admin");
    revalidatePath(`/admin/properties/${updated.propertyId}`);
    revalidatePath(`/admin/bookings/${bookingId}`);
    return { ok: true, bookingId };
  } catch {
    return { ok: false, error: "Could not save changes. Please retry." };
  }
}

export async function deleteBookingAction(bookingId: string): Promise<void> {
  const actor = await currentAuditActor();
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: { propertyId: true, guestName: true },
  });
  if (!booking) return;
  await prisma.booking.delete({ where: { id: bookingId } });
  await recordAudit({
    actor,
    entity: "BOOKING",
    entityId: bookingId,
    action: "booking.deleted",
    summary: `Booking ${booking.guestName} deleted`,
    metadata: { propertyId: booking.propertyId },
  });
  revalidatePath("/admin");
  revalidatePath(`/admin/properties/${booking.propertyId}`);
  redirect(`/admin/properties/${booking.propertyId}`);
}

// Records the booking's monetary footprint as Transactions so the
// owner statement can reconcile against bank reality without us
// needing to re-derive numbers from Booking columns. Idempotent: if
// the booking already has emitted transactions, do nothing. Used by
// the Hostaway webhook on first ingest and exposed manually for
// direct bookings.
// Defaults to Goldstay's published 20% short-stay commission. Pass
// 0 explicitly to skip (e.g. when invoicing the owner directly).
export async function emitBookingTransactionsAction(
  bookingId: string,
  goldstayCommissionRate: number = SHORT_TERM_COMMISSION_RATE,
): Promise<{ ok: boolean }> {
  await currentAuditActor();
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { transactions: { select: { id: true } } },
  });
  if (!booking) return { ok: false };
  if (booking.transactions.length > 0) return { ok: true };

  const rows: Array<{
    type: TransactionType;
    direction: TransactionDirection;
    amount: number;
    description?: string;
  }> = [
    {
      type: TransactionType.RENT,
      direction: TransactionDirection.INFLOW,
      amount: Number(booking.grossAmount),
      description: `Gross from ${booking.guestName}`,
    },
  ];
  if (booking.otaCommission && Number(booking.otaCommission) > 0) {
    rows.push({
      type: TransactionType.OTA_COMMISSION,
      direction: TransactionDirection.OUTFLOW,
      amount: Number(booking.otaCommission),
      description: `${booking.source} commission`,
    });
  }
  if (booking.cleaningFee && Number(booking.cleaningFee) > 0) {
    rows.push({
      type: TransactionType.CLEANING_FEE,
      direction: TransactionDirection.OUTFLOW,
      amount: Number(booking.cleaningFee),
      description: "Turnover cleaning",
    });
  }
  if (goldstayCommissionRate > 0) {
    const commission =
      Math.round(Number(booking.grossAmount) * goldstayCommissionRate * 100) /
      100;
    if (commission > 0) {
      rows.push({
        type: TransactionType.GOLDSTAY_COMMISSION,
        direction: TransactionDirection.OUTFLOW,
        amount: commission,
        description: `Goldstay commission (${(goldstayCommissionRate * 100).toFixed(0)}%)`,
      });
    }
  }

  await prisma.$transaction(
    rows.map((row) =>
      prisma.transaction.create({
        data: {
          propertyId: booking.propertyId,
          bookingId: booking.id,
          occurredOn: booking.checkOut,
          type: row.type,
          direction: row.direction,
          amount: row.amount,
          currency: booking.currency,
          description: row.description,
        },
      }),
    ),
  );

  revalidatePath(`/admin/properties/${booking.propertyId}`);
  return { ok: true };
}

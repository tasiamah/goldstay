// Tells a client a booking landed on one of their units, or went away.
//
// One entry point, called from all three places a booking can arrive
// (the Hostaway webhook, the iCal sync, the admin form) and from the
// admin cancel action. Ingest paths should not each grow their own
// copy of "who owns this, what do we say, have we already said it".
//
// At-most-once is enforced by the database rather than by care here.
// The ClientNotification unique index on (clientId, kind, sourceRef)
// is claimed with sourceRef = bookingId before the email goes out, so
// two concurrent callers race for one winner and the loser returns
// quietly. That constraint is doing real work: the Hostaway webhook
// upserts on every upstream modification event, so a guest editing
// their arrival time three times would otherwise send three "you have
// a booking" emails for one reservation.
//
// The claim is kept even when the email then fails, which is the
// opposite of what the agreement reminder ladder does, because the
// row is not only a lock here — it is also the in-portal bell
// notification. Deleting it to allow a retry would take away the
// notification the client can actually see in exchange for an email
// retry that no scheduled job exists to perform. The failure is
// recorded on CommunicationLog instead, where the admin comms
// timeline shows it.
//
// Never throws. Every caller is an ingest path whose real job is
// recording the booking; a Resend outage must not turn into a 500
// that makes Hostaway retry, or an exception that halts an iCal run
// halfway through a feed.
//
// Deliberately does not copy observers. Per the rule stated in
// statements/send.ts, the statement is the only client email that
// resolves recipients through lib/clients/recipients.ts.

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { logCommunication, updateCommunicationStatus } from "@/lib/comms";
import { formatMoney } from "@/lib/agreements/format";
import { formatPropertyDisplayName } from "@/lib/format-property";
import {
  bookingNotificationTitle,
  bookingSubject,
  renderBookingHtml,
  renderBookingText,
  type BookingEmailInput,
} from "./booking-email";

const DEFAULT_FROM = "Goldstay <hello@goldstay.co.ke>";
const DEFAULT_SITE = "https://goldstay.co.ke";

export type BookingEvent = "received" | "cancelled";

export type BookingNotifyOutcome =
  | { kind: "sent"; notificationId: string }
  | { kind: "already-notified" }
  | { kind: "skipped"; reason: string }
  | { kind: "email-failed"; notificationId: string; error: string };

export async function notifyClientOfBooking(
  bookingId: string,
  event: BookingEvent,
): Promise<BookingNotifyOutcome> {
  try {
    return await run(bookingId, event);
  } catch (err) {
    // The contract above. Log loudly, return quietly.
    console.error(
      `[booking-notify] ${event} ${bookingId}:`,
      err instanceof Error ? err.message : err,
    );
    return { kind: "skipped", reason: "unexpected_error" };
  }
}

async function run(
  bookingId: string,
  event: BookingEvent,
): Promise<BookingNotifyOutcome> {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: {
      id: true,
      propertyId: true,
      checkIn: true,
      checkOut: true,
      nights: true,
      guestName: true,
      grossAmount: true,
      netPayout: true,
      currency: true,
      status: true,
      source: true,
      property: {
        select: {
          name: true,
          unitNumber: true,
          client: { select: { id: true, email: true, fullName: true } },
        },
      },
    },
  });

  if (!booking) return { kind: "skipped", reason: "booking_not_found" };

  const client = booking.property.client;
  if (!client?.email) return { kind: "skipped", reason: "client_has_no_email" };

  // A booking that arrives already cancelled is not news. Hostaway
  // does send reservation events for reservations that are dead on
  // arrival, and announcing one would be the first the client had
  // heard of it.
  if (event === "received" && booking.status === "CANCELLED") {
    return { kind: "skipped", reason: "arrived_cancelled" };
  }

  const kind =
    event === "cancelled" ? "BOOKING_CANCELLED" : ("BOOKING_RECEIVED" as const);

  // Only tell someone a booking was cancelled if they were told it
  // existed. Otherwise the first and only message about a reservation
  // is that it is gone, which reads as though we lost them money.
  if (event === "cancelled") {
    const announced = await prisma.clientNotification.findUnique({
      where: {
        clientId_kind_sourceRef: {
          clientId: client.id,
          kind: "BOOKING_RECEIVED",
          sourceRef: booking.id,
        },
      },
      select: { id: true },
    });
    if (!announced) return { kind: "skipped", reason: "never_announced" };
  }

  const propertyLabel = formatPropertyDisplayName(
    booking.property.name,
    booking.property.unitNumber,
  );

  // An iCal import is a placeholder: sync.ts writes every money field
  // as zero because the feed carries dates and nothing else. That is
  // indistinguishable from a real booking worth nothing, so the
  // amounts decide the variant rather than the source enum, and a
  // manually entered booking that genuinely has no figures yet gets
  // the same honest treatment.
  const gross = Number(booking.grossAmount);
  const net = Number(booking.netPayout);
  const isSparse = gross === 0 && net === 0;

  const input: BookingEmailInput = {
    kind:
      event === "cancelled" ? "cancelled" : isSparse ? "sparse" : "full",
    clientFirstName: firstNameOf(client.fullName),
    propertyLabel,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    nights: booking.nights,
    guestName: booking.guestName,
    netPayoutFormatted:
      net > 0 ? formatMoney(net, booking.currency) : null,
    channelLabel: channelLabel(booking.source),
    siteUrl: process.env.PUBLIC_SITE_URL || DEFAULT_SITE,
  };

  // Claim. A unique-constraint collision means somebody already told
  // this client about this booking, so stop without sending.
  let notificationId: string;
  try {
    const row = await prisma.clientNotification.create({
      data: {
        clientId: client.id,
        kind,
        tone: event === "cancelled" ? "INFO" : "SUCCESS",
        title: bookingNotificationTitle(input),
        href: `/client/properties/${booking.propertyId}`,
        sourceRef: booking.id,
      },
      select: { id: true },
    });
    notificationId = row.id;
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return { kind: "already-notified" };
    }
    throw err;
  }

  const subject = bookingSubject(input);
  const text = renderBookingText(input);

  const log = await logCommunication({
    clientId: client.id,
    channel: "EMAIL",
    direction: "OUTBOUND",
    subject,
    body: text,
    status: "QUEUED",
    // Written by the system in response to a booking, not by a person.
    actor: null,
  });

  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.RESEND_FROM_CLIENTS ||
    process.env.RESEND_FROM_OWNERS ||
    DEFAULT_FROM;

  if (!apiKey) {
    // Dev and preview. Mark sent so local ingest work does not bounce
    // on a missing key; production surfaces a missing key separately
    // on /admin/health.
    console.log(`[booking-notify] would email ${client.email}: ${subject}`);
    await updateCommunicationStatus(log.id, "SENT");
    return { kind: "sent", notificationId };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from,
      to: [client.email],
      subject,
      text,
      html: renderBookingHtml(input),
    });
    await updateCommunicationStatus(log.id, "SENT", result?.data?.id ?? null);
    return { kind: "sent", notificationId };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Send failed";
    await updateCommunicationStatus(log.id, "FAILED");
    console.error(`[booking-notify] email failed for ${booking.id}:`, message);
    return { kind: "email-failed", notificationId, error: message };
  }
}

function firstNameOf(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? "";
}

function channelLabel(source: string): string {
  switch (source) {
    case "AIRBNB":
      return "Airbnb";
    case "BOOKING_COM":
      return "Booking.com";
    case "VRBO":
      return "Vrbo";
    case "DIRECT":
      return "Direct booking";
    default:
      return "Direct booking";
  }
}

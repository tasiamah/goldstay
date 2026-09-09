// The booking notification email's subject and bodies.
//
// Split from notify.ts for the same reason statements/email.ts is
// split from send.ts: this is the part with copy in it that a client
// reads, so it should be assertable without a database or a Resend
// key. Pure. No prisma, no environment, no clock.
//
// Three shapes, because the three ingest paths genuinely know
// different amounts:
//
//   full    a Hostaway or manually entered booking, with a guest
//           name and money attached
//   sparse  an iCal import. sync.ts creates these as placeholders so
//           the occupancy calendar is right, with guestName set to
//           "Reserved (Airbnb)" and every amount zero. Telling an
//           owner they earned KES 0 would be worse than telling them
//           nothing, so this variant states the dates and the
//           channel and stops
//   cancelled  a booking the owner was already told about, which has
//           gone away. They need this or they plan around income that
//           is not coming

export type BookingEmailKind = "full" | "sparse" | "cancelled";

export type BookingEmailInput = {
  kind: BookingEmailKind;
  clientFirstName: string;
  propertyLabel: string;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  guestName?: string | null;
  // Already-formatted so this module never has to know about
  // Decimal, currency placement or rounding.
  netPayoutFormatted?: string | null;
  channelLabel: string;
  siteUrl: string;
};

// "Fri 3 Oct 2026". Written out rather than 03/10/2026 because the
// audience is split between Kenyan, British and American owners who
// read that ambiguously, and a booking email whose dates can be
// misread is worse than useless.
export function formatBookingDate(d: Date): string {
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function bookingSubject(input: BookingEmailInput): string {
  const dates = `${formatBookingDate(input.checkIn)} to ${formatBookingDate(
    input.checkOut,
  )}`;
  if (input.kind === "cancelled") {
    return `Booking cancelled: ${input.propertyLabel}, ${dates}`;
  }
  const nights = input.nights === 1 ? "1 night" : `${input.nights} nights`;
  return `New booking: ${input.propertyLabel}, ${nights} from ${formatBookingDate(
    input.checkIn,
  )}`;
}

export function renderBookingText(input: BookingEmailInput): string {
  const greeting = `Hi ${input.clientFirstName || "there"},`;
  const checkIn = formatBookingDate(input.checkIn);
  const checkOut = formatBookingDate(input.checkOut);
  const nights = input.nights === 1 ? "1 night" : `${input.nights} nights`;

  const lines: string[] = [greeting, ""];

  if (input.kind === "cancelled") {
    lines.push(
      `The booking at ${input.propertyLabel} from ${checkIn} to ${checkOut} has been cancelled.`,
      "",
      "Those nights are back on your calendar and available to re-let. Nothing is owed and nothing needs doing at your end.",
    );
  } else if (input.kind === "sparse") {
    lines.push(
      `${input.propertyLabel} has been booked for ${nights}.`,
      "",
      `  Check-in:  ${checkIn}`,
      `  Check-out: ${checkOut}`,
      `  Channel:   ${input.channelLabel}`,
      "",
      // Saying why the money is absent is the whole point of this
      // variant. An owner who sees a booking with no figure and no
      // explanation assumes something is broken.
      "This came through the channel calendar, which tells us the dates but not the guest or the amount. We reconcile the figures onto your statement once the channel reports them, so this booking will show its full value there.",
    );
  } else {
    lines.push(`${input.propertyLabel} has been booked for ${nights}.`, "");
    lines.push(`  Check-in:  ${checkIn}`);
    lines.push(`  Check-out: ${checkOut}`);
    if (input.guestName) lines.push(`  Guest:     ${input.guestName}`);
    lines.push(`  Channel:   ${input.channelLabel}`);
    if (input.netPayoutFormatted) {
      lines.push(`  Net to you: ${input.netPayoutFormatted}`);
    }
    lines.push(
      "",
      "Net payouts are remitted monthly per your management agreement, and this booking will appear on the statement for the month it checks out in.",
    );
  }

  lines.push(
    "",
    "Every booking on your portfolio, with live occupancy:",
    `${input.siteUrl}/client`,
    "",
    "Reply to this email if anything looks wrong and you will reach a real person.",
    "",
    "— The Goldstay team",
  );

  return lines.join("\n");
}

export function renderBookingHtml(input: BookingEmailInput): string {
  const firstName = escapeHtml(input.clientFirstName || "there");
  const property = escapeHtml(input.propertyLabel);
  const checkIn = escapeHtml(formatBookingDate(input.checkIn));
  const checkOut = escapeHtml(formatBookingDate(input.checkOut));
  const nights = input.nights === 1 ? "1 night" : `${input.nights} nights`;
  const cancelled = input.kind === "cancelled";

  const heading = cancelled ? "A booking was cancelled" : "You have a booking";
  const lead = cancelled
    ? `The booking at <strong>${property}</strong> from ${checkIn} to ${checkOut} has been cancelled. Those nights are back on your calendar and available to re-let.`
    : `<strong>${property}</strong> has been booked for ${nights}.`;

  const rows: Array<[string, string]> = [
    ["Check-in", checkIn],
    ["Check-out", checkOut],
  ];
  if (!cancelled) {
    if (input.kind === "full" && input.guestName) {
      rows.push(["Guest", escapeHtml(input.guestName)]);
    }
    rows.push(["Channel", escapeHtml(input.channelLabel)]);
    if (input.kind === "full" && input.netPayoutFormatted) {
      rows.push(["Net to you", escapeHtml(input.netPayoutFormatted)]);
    }
  }

  const table = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#78716c;font-size:13px">${label}</td><td style="padding:6px 0;color:#1c1917;font-size:14px;font-weight:600">${value}</td></tr>`,
    )
    .join("");

  const footnote = cancelled
    ? "Nothing is owed and nothing needs doing at your end."
    : input.kind === "sparse"
      ? "This came through the channel calendar, which tells us the dates but not the guest or the amount. We reconcile the figures onto your statement once the channel reports them."
      : "Net payouts are remitted monthly per your management agreement. This booking appears on the statement for the month it checks out in.";

  return `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#fafaf9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1c1917">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fafaf9;padding:40px 16px">
      <tr><td align="center">
        <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #e7e5e4;border-radius:12px;padding:40px">
          <tr><td>
            <p style="font-size:18px;font-family:Georgia,serif;color:#1c1917;margin:0 0 4px 0">Goldstay<span style="color:#b91c1c">.</span></p>
            <h1 style="font-size:22px;font-family:Georgia,serif;color:#1c1917;margin:24px 0 0 0;font-weight:normal">Hi ${firstName},</h1>
            <p style="color:#44403c;line-height:1.55;margin:16px 0 0 0">${lead}</p>
            <table role="presentation" cellspacing="0" cellpadding="0" style="margin:24px 0 0 0">${table}</table>
            <p style="margin:32px 0;text-align:center"><a href="${escapeHtml(input.siteUrl)}/client" style="background:#1c1917;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:6px;font-weight:600;font-size:14px;display:inline-block">Open my portal &rarr;</a></p>
            <p style="color:#78716c;font-size:13px;line-height:1.55;margin:32px 0 0 0;border-top:1px solid #e7e5e4;padding-top:24px">${footnote} Reply to this email if anything looks wrong and you will reach a real person.</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

// The in-portal bell row. Shorter than the email because it sits in a
// dropdown, and it carries a deep link so a click lands on the
// property rather than the dashboard.
export function bookingNotificationTitle(input: BookingEmailInput): string {
  const dates = `${formatBookingDate(input.checkIn)} to ${formatBookingDate(
    input.checkOut,
  )}`;
  return input.kind === "cancelled"
    ? `Cancelled: ${input.propertyLabel}, ${dates}`
    : `Booked: ${input.propertyLabel}, ${dates}`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

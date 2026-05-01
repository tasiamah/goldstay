import { describe, expect, it } from "vitest";
import { isCalendarBlock, parseIcal } from "./parse";

const AIRBNB_SAMPLE = `BEGIN:VCALENDAR
PRODID:-//Airbnb Inc//Hosting Calendar 0.8.8//EN
VERSION:2.0
BEGIN:VEVENT
DTEND;VALUE=DATE:20260315
DTSTART;VALUE=DATE:20260310
UID:abc123@airbnb.com
DESCRIPTION:Reservation URL: https://www.airbnb.com/hosting/reservations/details/HMABCXYZ
SUMMARY:Reserved
END:VEVENT
BEGIN:VEVENT
DTEND;VALUE=DATE:20260420
DTSTART;VALUE=DATE:20260418
UID:blocker-1@airbnb.com
SUMMARY:Airbnb (Not available)
END:VEVENT
END:VCALENDAR
`;

// iCal feed parser. Third-party data parsing is the highest-risk
// surface in the platform — a malformed Airbnb feed must never crash
// the sync, and a "Not available" event must never be booked into the
// occupancy stats. Two tests cover both.

describe("parseIcal + isCalendarBlock", () => {
  it("extracts UID, summary, dates from a real Airbnb-shaped feed", () => {
    const events = parseIcal(AIRBNB_SAMPLE);
    expect(events).toHaveLength(2);
    const reservation = events[0]!;
    expect(reservation.uid).toBe("abc123@airbnb.com");
    expect(reservation.start.toISOString()).toBe("2026-03-10T00:00:00.000Z");
    expect(reservation.end.toISOString()).toBe("2026-03-15T00:00:00.000Z");
    expect(reservation.description).toContain("HMABCXYZ");
    // The "Airbnb (Not available)" event must be detectable as a block
    // so we don't book it as occupancy.
    expect(isCalendarBlock(events[1]!.summary)).toBe(true);
    expect(isCalendarBlock("Reserved")).toBe(false);
  });

  it("survives malformed input and skips events missing UID, dates, or with end <= start", () => {
    expect(parseIcal("garbage in, garbage out")).toEqual([]);
    expect(parseIcal("")).toEqual([]);
    const broken = `BEGIN:VCALENDAR
BEGIN:VEVENT
SUMMARY:no uid here
DTSTART;VALUE=DATE:20260101
DTEND;VALUE=DATE:20260102
END:VEVENT
BEGIN:VEVENT
UID:inverted@example.com
DTSTART;VALUE=DATE:20260105
DTEND;VALUE=DATE:20260105
END:VEVENT
END:VCALENDAR`;
    expect(parseIcal(broken)).toEqual([]);
  });
});

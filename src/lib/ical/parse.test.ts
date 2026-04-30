import { describe, expect, it } from "vitest";
import { isCalendarBlock, parseIcal } from "./parse";

const AIRBNB_SAMPLE = `BEGIN:VCALENDAR
PRODID:-//Airbnb Inc//Hosting Calendar 0.8.8//EN
VERSION:2.0
CALSCALE:GREGORIAN
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

describe("parseIcal", () => {
  it("extracts UID, summary, dates from a real Airbnb-shaped feed", () => {
    const events = parseIcal(AIRBNB_SAMPLE);
    expect(events).toHaveLength(2);

    const reservation = events[0];
    expect(reservation.uid).toBe("abc123@airbnb.com");
    expect(reservation.summary).toBe("Reserved");
    expect(reservation.start.toISOString()).toBe("2026-03-10T00:00:00.000Z");
    expect(reservation.end.toISOString()).toBe("2026-03-15T00:00:00.000Z");
    expect(reservation.description).toContain("HMABCXYZ");
  });

  it("handles unfolded continuation lines and CRLF newlines", () => {
    const folded =
      "BEGIN:VCALENDAR\r\nBEGIN:VEVENT\r\nUID:long@example.com\r\nDTSTART;VALUE=DATE:20260101\r\nDTEND;VALUE=DATE:20260103\r\nDESCRIPTION:Line one\r\n that wraps onto another\r\nSUMMARY:Reserved\r\nEND:VEVENT\r\nEND:VCALENDAR";
    const events = parseIcal(folded);
    expect(events).toHaveLength(1);
    expect(events[0].description).toBe("Line onethat wraps onto another");
  });

  it("skips events missing UID, dates, or with end <= start", () => {
    const broken = `BEGIN:VCALENDAR
BEGIN:VEVENT
SUMMARY:no uid here
DTSTART;VALUE=DATE:20260101
DTEND;VALUE=DATE:20260102
END:VEVENT
BEGIN:VEVENT
UID:no-end@example.com
DTSTART;VALUE=DATE:20260101
END:VEVENT
BEGIN:VEVENT
UID:inverted@example.com
DTSTART;VALUE=DATE:20260105
DTEND;VALUE=DATE:20260105
END:VEVENT
END:VCALENDAR`;
    expect(parseIcal(broken)).toEqual([]);
  });

  it("returns empty array for empty or malformed input", () => {
    expect(parseIcal("")).toEqual([]);
    expect(parseIcal("garbage in, garbage out")).toEqual([]);
  });
});

describe("isCalendarBlock", () => {
  it("recognises common OTA block summaries", () => {
    expect(isCalendarBlock("Airbnb (Not available)")).toBe(true);
    expect(isCalendarBlock("CLOSED - Not available")).toBe(true);
    expect(isCalendarBlock("Blocked")).toBe(true);
    expect(isCalendarBlock("Unavailable")).toBe(true);
  });

  it("treats real reservation summaries as not-blocked", () => {
    expect(isCalendarBlock("Reserved")).toBe(false);
    expect(isCalendarBlock("Alex Owino")).toBe(false);
    expect(isCalendarBlock("")).toBe(false);
  });
});

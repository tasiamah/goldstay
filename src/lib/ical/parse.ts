// Minimal iCal parser scoped to what Airbnb / Booking.com / Vrbo
// emit for hosting calendars. We deliberately avoid pulling in
// node-ical or ical.js — both are heavier than this file and bring
// timezone parsing complexity we don't need (OTAs always emit
// VALUE=DATE for whole-day reservations, no DTSTAMP timezones).
//
// Public surface: parseIcal(rawText) → ParsedEvent[]. Anything we
// can't parse cleanly we just skip; bad input never throws.

export type ParsedEvent = {
  uid: string;
  summary: string;
  description: string;
  // Anchored to UTC midnight to match the rest of the booking
  // helpers. iCal DTSTART is the check-in night; DTEND is the
  // departure morning, exclusive — same convention as our schema.
  start: Date;
  end: Date;
};

const LINE_BREAK = /\r?\n/;

// iCal allows long values to be folded onto multiple lines by
// prefixing continuation lines with a single space or tab. Unfold
// before splitting into fields so a wrapped DESCRIPTION still parses.
function unfold(raw: string): string {
  return raw.replace(/\r?\n[ \t]/g, "");
}

function parseIcalDate(value: string): Date | null {
  // Two shapes we accept:
  //   YYYYMMDD                — VALUE=DATE (most OTA reservations)
  //   YYYYMMDDTHHMMSSZ        — UTC timestamp
  if (/^\d{8}$/.test(value)) {
    const y = Number(value.slice(0, 4));
    const m = Number(value.slice(4, 6)) - 1;
    const d = Number(value.slice(6, 8));
    const dt = new Date(Date.UTC(y, m, d));
    return Number.isNaN(dt.getTime()) ? null : dt;
  }
  if (/^\d{8}T\d{6}Z$/.test(value)) {
    const y = Number(value.slice(0, 4));
    const m = Number(value.slice(4, 6)) - 1;
    const d = Number(value.slice(6, 8));
    const hh = Number(value.slice(9, 11));
    const mm = Number(value.slice(11, 13));
    const ss = Number(value.slice(13, 15));
    const dt = new Date(Date.UTC(y, m, d, hh, mm, ss));
    return Number.isNaN(dt.getTime()) ? null : dt;
  }
  return null;
}

// Strip the parameter section from a property name, e.g.
// "DTSTART;VALUE=DATE" → "DTSTART".
function bareKey(line: string): string {
  const colon = line.indexOf(":");
  if (colon < 0) return line;
  const head = line.slice(0, colon);
  const semi = head.indexOf(";");
  return (semi < 0 ? head : head.slice(0, semi)).toUpperCase();
}

function valueOf(line: string): string {
  const colon = line.indexOf(":");
  return colon < 0 ? "" : line.slice(colon + 1);
}

function dateValue(line: string): Date | null {
  return parseIcalDate(valueOf(line).trim());
}

// Airbnb signals a host-side calendar block (vs. a real reservation)
// with a SUMMARY of "Airbnb (Not available)" or similar. Booking.com
// uses "CLOSED - Not available". Vrbo uses "Blocked". We keep the
// list narrow and case-insensitive; anything we don't recognise is
// treated as a real reservation and lets the operator double-check.
const BLOCK_PATTERNS = [
  /not\s*available/i,
  /^blocked$/i,
  /^closed/i,
  /unavailable/i,
];

export function isCalendarBlock(summary: string): boolean {
  const trimmed = summary.trim();
  if (!trimmed) return false;
  return BLOCK_PATTERNS.some((re) => re.test(trimmed));
}

export function parseIcal(raw: string): ParsedEvent[] {
  if (!raw) return [];
  const lines = unfold(raw).split(LINE_BREAK);

  const events: ParsedEvent[] = [];
  let inEvent = false;
  let current: Partial<ParsedEvent> = {};

  for (const line of lines) {
    if (!line) continue;
    const key = bareKey(line);

    if (key === "BEGIN" && valueOf(line).trim() === "VEVENT") {
      inEvent = true;
      current = {};
      continue;
    }
    if (key === "END" && valueOf(line).trim() === "VEVENT") {
      inEvent = false;
      if (
        current.uid &&
        current.start &&
        current.end &&
        current.end > current.start
      ) {
        events.push({
          uid: current.uid,
          summary: current.summary ?? "",
          description: current.description ?? "",
          start: current.start,
          end: current.end,
        });
      }
      current = {};
      continue;
    }
    if (!inEvent) continue;

    switch (key) {
      case "UID":
        current.uid = valueOf(line).trim();
        break;
      case "SUMMARY":
        current.summary = valueOf(line).trim();
        break;
      case "DESCRIPTION":
        current.description = valueOf(line).trim();
        break;
      case "DTSTART": {
        const d = dateValue(line);
        if (d) current.start = d;
        break;
      }
      case "DTEND": {
        const d = dateValue(line);
        if (d) current.end = d;
        break;
      }
    }
  }

  return events;
}

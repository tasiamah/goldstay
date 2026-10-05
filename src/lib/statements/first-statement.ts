// The note that appears on a client's first statement.
//
// A first statement is the worst statement a client will ever get,
// and it arrives before they have any basis for judging us. Two
// things make it low that have nothing to do with how well the unit
// is run: it usually covers a part month, and a listing with no
// reviews has to undercut comparable units to win its first guests.
// Both correct themselves, and neither is obvious to someone reading
// their first payout figure.
//
// Saying so once, on the statement itself, is cheap. Saying it only
// when a client asks means saying it to the ones who were already
// considering leaving.
//
// The copy is deliberately free of dates and figures so one wording
// serves every client. The only thing that varies is whether the
// part-month sentence appears at all, which is driven by when they
// joined: telling someone who was with us for the whole month that
// their month was short is an excuse they can disprove from their
// own records, and that costs more than the reassurance is worth.

export const FIRST_STATEMENT_TITLE = "About your first statement";

const PART_MONTH =
  "You joined partway through the month, so this statement covers a part month rather than a full one.";

// "Usually", never "will". This is a statement about future money and
// we control neither number.
const REVIEWS = (also: boolean) =>
  `A new listing ${
    also ? "also " : ""
  }starts with no reviews, so it has to be priced below established units nearby to win its first guests. Both the nightly rate and the occupancy usually climb over the first few months as reviews build up.`;

const BASELINE = "Treat this month as a starting point rather than a run rate.";

// Sentences rather than one string so the PDF can lay them out and
// the email can join them, without either rewording the other.
export function firstStatementNote(opts: { isPartMonth: boolean }): string[] {
  return opts.isPartMonth
    ? [PART_MONTH, REVIEWS(true), BASELINE]
    : [REVIEWS(false), BASELINE];
}

// Whether the client joined after the period had already started.
//
// Flattened to the day they signed up rather than the timestamp: a
// client who joined at two in the afternoon on the 1st had the month,
// and should not be told it was short on a technicality of hours.
export function joinedPartWayThrough({
  joinedOn,
  period,
}: {
  joinedOn: Date | null | undefined;
  period: { start: Date; end: Date };
}): boolean {
  if (!joinedOn) return false;
  const joinedDay = Date.UTC(
    joinedOn.getUTCFullYear(),
    joinedOn.getUTCMonth(),
    joinedOn.getUTCDate(),
  );
  return (
    joinedDay > period.start.getTime() && joinedDay < period.end.getTime()
  );
}

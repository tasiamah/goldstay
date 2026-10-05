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
// Everything here is checkable on purpose. The part-month sentence
// states the actual dates rather than claiming "a partial month", so
// a client who joined on the 2nd is not told the month was short.
// Spin that a client can disprove from their own records costs more
// than the reassurance is worth.

import { formatPeriod, type Period } from "./period";

export type FirstStatementFacts = {
  // Days of the period the client had been signed up for. Null when
  // they joined before the period began, in which case the month was
  // not short for them and we say nothing about it.
  daysLive: number | null;
  daysInPeriod: number;
  // When they joined, for the sentence that states it.
  joinedOn: Date | null;
};

export const FIRST_STATEMENT_TITLE = "About your first statement";

// Sentences rather than one string so the PDF can lay them out and
// the email can join them, without either rewording the other.
export function firstStatementNote(
  facts: FirstStatementFacts,
  period: Period,
): string[] {
  const lines: string[] = [];

  if (
    facts.joinedOn &&
    facts.daysLive != null &&
    facts.daysLive < facts.daysInPeriod
  ) {
    const joined = facts.joinedOn.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      timeZone: "UTC",
    });
    lines.push(
      `You joined Goldstay on ${joined}, so this statement covers ${facts.daysLive} of ${formatPeriod(
        period,
      )}'s ${facts.daysInPeriod} days rather than a full month.`,
    );
  }

  // "Usually", not "will". This is a statement about money in the
  // future and we do not control either number.
  lines.push(
    "A new listing also starts with no reviews, so it has to be priced below established units nearby to win its first guests. Both the nightly rate and the occupancy usually climb over the first few months as reviews build up.",
  );
  lines.push("Treat this month as a starting point rather than a run rate.");

  return lines;
}

// How much of the period the client had been with us for.
//
// Returns daysLive null when they joined before the period started:
// the month was a full one for them, and the part-month sentence
// would be false.
export function firstStatementFacts({
  joinedOn,
  period,
}: {
  joinedOn: Date | null | undefined;
  period: { start: Date; end: Date };
}): FirstStatementFacts {
  const dayMs = 24 * 60 * 60 * 1000;
  const daysInPeriod = Math.round(
    (period.end.getTime() - period.start.getTime()) / dayMs,
  );

  // Flattened to the start of the day they signed up. A client who
  // joined at two in the afternoon on the 5th counts the 5th as a day
  // they were with us, and the sentence names that date — so counting
  // from the timestamp would print 25 next to a date from which
  // anyone counting on their fingers gets 26.
  const joinedDay = joinedOn
    ? new Date(
        Date.UTC(
          joinedOn.getUTCFullYear(),
          joinedOn.getUTCMonth(),
          joinedOn.getUTCDate(),
        ),
      )
    : null;

  if (!joinedDay || joinedDay.getTime() <= period.start.getTime()) {
    return { daysLive: null, daysInPeriod, joinedOn: joinedDay };
  }
  // Joined after the period ended: they should not be getting this
  // statement at all, but never report a figure above the month.
  if (joinedDay.getTime() >= period.end.getTime()) {
    return { daysLive: 0, daysInPeriod, joinedOn: joinedDay };
  }

  const daysLive = Math.round(
    (period.end.getTime() - joinedDay.getTime()) / dayMs,
  );
  return { daysLive, daysInPeriod, joinedOn: joinedDay };
}

// Email address handling shared by the features that let one person
// nominate another: agreement shares and client observers.
//
// Extracted from lib/agreements/share.ts when observers became the
// second caller. Two copies of "is this an address" would have been
// two copies free to disagree, and the disagreement would surface as
// an address a client could add as an observer but not as a share
// recipient, for no reason either of them could explain.

// Normalising centrally rather than at each call site because the
// same address arriving as "Dangulu1@Gmail.com " and
// "dangulu1@gmail.com" is one person, and the uniqueness constraints
// that depend on that (ClientObserver's clientId+email) only hold if
// every writer agrees on the canonical form.
export function normaliseEmail(input: string): string {
  return input.trim().toLowerCase();
}

// Deliberately permissive. Every caller is a human typing a
// colleague's or a relative's address into a form they are already
// signed in to, not a public signup, so the job is to catch a
// fat-fingered entry rather than to adjudicate RFC 5322. Being
// stricter than this reliably rejects somebody's real address, and
// the cost of a bad one here is a bounce we can see, not a breach.
export function isPlausibleEmail(input: string): boolean {
  const value = input.trim();
  if (value.length < 6 || value.length > 254) return false;
  if (/\s/.test(value)) return false;
  return /^[^@]+@[^@.]+\.[^@]+$/.test(value);
}

// Two addresses are the same recipient if they normalise the same.
// Used to keep a person out of a list they are already the other side
// of — an observer who is really the account holder, say.
export function isSameEmail(a: string, b: string): boolean {
  return normaliseEmail(a) === normaliseEmail(b);
}

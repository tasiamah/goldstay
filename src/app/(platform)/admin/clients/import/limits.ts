// Shared between the import server action and its client component.
//
// It lives in its own module because `actions.ts` is a "use server"
// file, and those can only export async functions — a plain constant
// exported from there is not importable by the form.

// Above this many valid rows, the import creates the clients but
// skips the welcome emails.
//
// Every send is a Supabase generateLink call plus a Resend call, so a
// large import would be hundreds of network round trips inside a
// single server action. That would exceed the function's time limit
// partway through and leave an unknowable number of clients emailed,
// which is worse than not sending: you cannot tell who to follow up
// with. Skipping is recoverable — the clients show up in the admin
// overview's "Clients who never signed in" bucket, and each one can
// be welcomed from their detail page.
export const WELCOME_SEND_CAP = 25;

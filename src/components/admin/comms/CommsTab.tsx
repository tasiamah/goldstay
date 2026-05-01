// CommsTab — owner-detail panel that renders the communication log
// in reverse-chronological order, with a small form to log a
// manual call / WhatsApp / SMS / inbound email.
//
// We intentionally don't add a "send email" button here yet:
// outbound transactional emails are written by named server
// actions (welcome email, statement send, etc.) so the schema for
// each is stable. Quick-firing arbitrary text is easy to abuse and
// hard to reason about for the audit trail.

import { listCommunicationsFor, summariseLog } from "@/lib/comms";
import { logManualCommAction } from "./comms-actions";

const STATUS_TONE: Record<string, string> = {
  QUEUED: "bg-stone-100 text-stone-600",
  SENT: "bg-emerald-50 text-emerald-700",
  DELIVERED: "bg-emerald-100 text-emerald-800",
  BOUNCED: "bg-amber-100 text-amber-800",
  FAILED: "bg-red-100 text-red-800",
};

export async function CommsTab({
  ownerId,
  returnPath,
}: {
  ownerId: string;
  returnPath: string;
}) {
  const logs = await listCommunicationsFor(ownerId);
  const logBound = logManualCommAction.bind(null, ownerId, returnPath);

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-base font-medium text-stone-900">Communications</h3>
        <span className="text-xs text-stone-400">
          {logs.length} {logs.length === 1 ? "entry" : "entries"}
        </span>
      </div>
      <p className="mt-1 text-sm text-stone-500">
        Every system email writes a row here automatically. Manually log
        phone calls and WhatsApp threads so the next operator picks up
        the relationship without a context switch.
      </p>

      <form
        action={logBound}
        className="mt-4 grid gap-2 rounded-md border border-stone-200 bg-stone-50 p-3 sm:grid-cols-[auto_auto_1fr_auto]"
      >
        <select
          name="channel"
          className="rounded-md border border-stone-300 px-2 py-1.5 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
          defaultValue="CALL"
        >
          <option value="CALL">Call</option>
          <option value="WHATSAPP">WhatsApp</option>
          <option value="SMS">SMS</option>
          <option value="EMAIL">Email</option>
        </select>
        <select
          name="direction"
          className="rounded-md border border-stone-300 px-2 py-1.5 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
          defaultValue="OUTBOUND"
        >
          <option value="OUTBOUND">→ to owner</option>
          <option value="INBOUND">← from owner</option>
        </select>
        <input
          name="subject"
          placeholder="What was discussed (one line)"
          className="rounded-md border border-stone-300 px-3 py-1.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
        />
        <button
          type="submit"
          className="rounded-md bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800"
        >
          Log
        </button>
      </form>

      {logs.length === 0 ? (
        <p className="mt-6 text-sm text-stone-500">
          No communications recorded yet.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-stone-100">
          {logs.map((log) => (
            <li key={log.id} className="flex items-start justify-between gap-4 py-3">
              <div className="min-w-0">
                <p className="text-sm text-stone-900">{summariseLog(log)}</p>
                <p className="text-xs text-stone-500">
                  {log.createdAt.toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {log.providerId ? (
                    <>
                      {" · "}
                      <span className="font-mono text-[10px] text-stone-400">
                        {log.providerId}
                      </span>
                    </>
                  ) : null}
                </p>
              </div>
              <span
                className={`inline-flex shrink-0 items-center rounded px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                  STATUS_TONE[log.status] ?? "bg-stone-100 text-stone-600"
                }`}
              >
                {log.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

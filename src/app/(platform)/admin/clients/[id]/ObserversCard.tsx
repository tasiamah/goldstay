// Server wrapper that loads a client's observer list and binds the
// admin actions for the shared panel.
//
// Split from the client page for the same reason PayoutMethodsCard
// and ClientDocumentsCard are: the page is already 250 lines and
// every one of these needs its own query.

import {
  MAX_OBSERVERS_PER_CLIENT,
  isReceiving,
  listObserversFor,
} from "@/lib/clients/observers";
import { ObserversPanel } from "@/components/platform/ObserversPanel";
import {
  adminAddObserverAction,
  adminRemoveObserverAction,
} from "./observer-actions";

export async function ObserversCard({
  clientId,
  clientName,
}: {
  clientId: string;
  clientName: string;
}) {
  const rows = await listObserversFor(clientId);
  const liveCount = rows.filter(isReceiving).length;

  const add = adminAddObserverAction.bind(null, clientId);
  const remove = adminRemoveObserverAction.bind(null, clientId);

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium text-stone-900">
          Statement copies
        </h3>
        <span className="text-xs uppercase tracking-wider text-stone-500">
          {liveCount} of {MAX_OBSERVERS_PER_CLIENT}
        </span>
      </div>
      <p className="mt-1 text-sm text-stone-500">
        Other people copied on {clientName.split(/\s+/)[0] || "this client"}
        &rsquo;s monthly statement — a co-owner, a spouse, an accountant.
        They receive the statement and its PDF and nothing else: no login,
        and no ability to accept an agreement.
      </p>

      <div className="mt-5">
        <ObserversPanel
          rows={rows}
          addAction={add}
          removeAction={remove}
          audience="admin"
          atLimit={liveCount >= MAX_OBSERVERS_PER_CLIENT}
        />
      </div>
    </div>
  );
}

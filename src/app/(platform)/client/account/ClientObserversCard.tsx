// Server wrapper for the client's own view of who they copy on their
// statements.
//
// Deliberately not one of the setup checklist steps. The checklist is
// things we need before we can pay somebody; copying a co-owner is
// optional and nobody's payout waits on it, so it sits below as its
// own section and never shows as an outstanding task.

import {
  MAX_OBSERVERS_PER_CLIENT,
  isReceiving,
  listObserversFor,
} from "@/lib/clients/observers";
import { ObserversPanel } from "@/components/platform/ObserversPanel";
import {
  clientAddObserverAction,
  clientRemoveObserverAction,
} from "./observer-actions";

export async function ClientObserversCard({
  clientId,
}: {
  clientId: string;
}) {
  const rows = await listObserversFor(clientId);
  const liveCount = rows.filter(isReceiving).length;

  return (
    <ObserversPanel
      rows={rows}
      addAction={clientAddObserverAction}
      removeAction={clientRemoveObserverAction}
      audience="client"
      atLimit={liveCount >= MAX_OBSERVERS_PER_CLIENT}
    />
  );
}

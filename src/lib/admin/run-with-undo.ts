"use client";

// runWithUndo — client-side pattern used by archive (and later
// "soft-delete") buttons in /admin. It triggers the action
// optimistically, surfaces a toast with an Undo button, and on
// click invokes the supplied undoAction.
//
// Why client-side rather than a server-driven flow?
//   - The undo grace window is a UX concern, not a data one. The
//     server commits immediately; "undo" is just a second action
//     the user can choose. This keeps server actions simple and
//     idempotent.
//   - We want the toast to remain visible (and the undo clickable)
//     across navigations within /admin. Sonner handles that as
//     long as we don't unmount the provider.
//
// Both `action` and `undoAction` should be small async functions
// returning void or a result object with optional `error`. They run
// from the browser, so server actions should be passed in already
// bound (or their wrappers awaited via `useTransition`).

import { toast } from "sonner";

export type UndoableActionResult = void | { ok: boolean; error?: string };

export type RunWithUndoOptions = {
  // Headline shown in the success toast: "Owner archived",
  // "Property archived", etc.
  successMessage: string;
  // Subtext shown under the headline. Optional.
  description?: string;
  // Inverse action to run on undo click.
  undoAction: () => Promise<UndoableActionResult>;
  // Headline shown in the toast that confirms the undo succeeded.
  undoMessage?: string;
  // How long the undo button stays clickable (ms). Defaults to 8s.
  durationMs?: number;
};

export async function runWithUndo(
  action: () => Promise<UndoableActionResult>,
  options: RunWithUndoOptions,
): Promise<void> {
  const result = await action();
  if (result && typeof result === "object" && result.ok === false) {
    toast.error(result.error ?? "Action failed.");
    return;
  }

  toast.success(options.successMessage, {
    description: options.description,
    duration: options.durationMs ?? 8000,
    action: {
      label: "Undo",
      onClick: async () => {
        const undone = await options.undoAction();
        if (undone && typeof undone === "object" && undone.ok === false) {
          toast.error(undone.error ?? "Undo failed.");
          return;
        }
        toast.success(options.undoMessage ?? "Reverted.");
      },
    },
  });
}

"use client";

// Single toast provider used across /admin/*. Wrapped here so the
// component contract (position, visual style) is colocated with the
// admin chrome and we never grow two parallel toasters by accident.
//
// Sonner is intentionally chosen over react-hot-toast because:
//   * it already supports an action button per toast, which we use
//     for runWithUndo on archive-style mutations
//   * it stacks gracefully when multiple jobs finish at once

import { Toaster as SonnerToaster } from "sonner";

export function AdminToaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      richColors
      closeButton
      duration={6000}
      // The undo affordance gets a longer life so the operator can
      // think for a beat before committing. Individual toasts can
      // still override.
      toastOptions={{ classNames: { actionButton: "bg-stone-900" } }}
    />
  );
}

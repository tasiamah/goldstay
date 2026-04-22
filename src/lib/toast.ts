// Tiny custom-event based toast dispatcher. The Toaster component listens
// for "goldstay-toast" CustomEvents on window and renders them. This keeps
// the API call-site sync and dependency free: form handlers just call
// toast.success("...") without threading a context through the tree.
//
// SSR safe: calls guarded for window so dispatches from a server component
// (which should not happen but defence in depth) are silently ignored.

export type ToastKind = "success" | "error" | "info";

export type ToastDetail = {
  kind: ToastKind;
  message: string;
};

const EVENT_NAME = "goldstay-toast";

function dispatch(kind: ToastKind, message: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<ToastDetail>(EVENT_NAME, {
      detail: { kind, message },
    }),
  );
}

export const toast = {
  success: (message: string) => dispatch("success", message),
  error: (message: string) => dispatch("error", message),
  info: (message: string) => dispatch("info", message),
};

export const TOAST_EVENT = EVENT_NAME;

"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import type { ToastDetail, ToastKind } from "@/lib/toast";
import { TOAST_EVENT } from "@/lib/toast";

// Global toaster. Mounted once in the root layout. Listens for
// "goldstay-toast" CustomEvents and renders each as a card in the
// top-right for five seconds, auto-dismissing. Manual close is available
// because five seconds sometimes is not enough to read an error message.

type ToastItem = {
  id: number;
  kind: ToastKind;
  message: string;
};

const AUTO_DISMISS_MS = 5000;

export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<ToastDetail>).detail;
      if (!detail) return;
      const id = Date.now() + Math.random();
      setItems((prev) => [
        ...prev,
        { id, kind: detail.kind, message: detail.message },
      ]);
      window.setTimeout(() => {
        setItems((prev) => prev.filter((i) => i.id !== id));
      }, AUTO_DISMISS_MS);
    };

    window.addEventListener(TOAST_EVENT, handler as EventListener);
    return () => {
      window.removeEventListener(TOAST_EVENT, handler as EventListener);
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <div
      aria-live="polite"
      role="status"
      className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-2 md:right-6 md:top-6"
    >
      {items.map((item) => (
        <ToastCard
          key={item.id}
          item={item}
          onClose={() =>
            setItems((prev) => prev.filter((i) => i.id !== item.id))
          }
        />
      ))}
    </div>
  );
}

function ToastCard({
  item,
  onClose,
}: {
  item: ToastItem;
  onClose: () => void;
}) {
  const Icon =
    item.kind === "success"
      ? CheckCircle2
      : item.kind === "error"
        ? XCircle
        : Info;

  const iconColor =
    item.kind === "success"
      ? "text-green-600"
      : item.kind === "error"
        ? "text-red-600"
        : "text-gold-700";

  const ring =
    item.kind === "success"
      ? "ring-green-500/20"
      : item.kind === "error"
        ? "ring-red-500/25"
        : "ring-gold-500/25";

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 rounded-xl border border-charcoal/10 bg-white p-4 shadow-lg ring-1 ${ring}`}
    >
      <Icon className={`mt-0.5 h-5 w-5 flex-shrink-0 ${iconColor}`} />
      <p className="flex-1 text-sm leading-snug text-charcoal">
        {item.message}
      </p>
      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss"
        className="flex-shrink-0 rounded-md p-1 text-charcoal/40 transition-colors hover:bg-charcoal/5 hover:text-charcoal"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

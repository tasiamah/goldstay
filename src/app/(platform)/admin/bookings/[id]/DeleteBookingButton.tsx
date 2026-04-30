"use client";

import { useTransition } from "react";
import { deleteBookingAction } from "../actions";

export function DeleteBookingButton({ bookingId }: { bookingId: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (
          !window.confirm(
            "Delete this booking? This will also unlink any transactions emitted from it.",
          )
        )
          return;
        start(async () => {
          await deleteBookingAction(bookingId);
        });
      }}
      className="inline-flex items-center rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}

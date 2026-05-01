// AttentionQueue — top-of-overview panel that surfaces the work
// that's actually waiting on a human. Each bucket is a clickable
// list of up to N items plus a counter; if a bucket is empty we
// keep its tile but render a neutral "all clear" line so the
// operator can see at a glance what state the portfolio is in.

import Link from "next/link";
import type { AttentionQueue as AttentionQueueT } from "@/lib/admin/queue";

export function AttentionQueue({ queue }: { queue: AttentionQueueT }) {
  return (
    <section>
      <header className="mb-3 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-base font-medium text-stone-900">
            Attention queue
          </h2>
          <p className="text-sm text-stone-500">
            Everything blocked on a human, ranked by what an operator usually
            opens first.
          </p>
        </div>
        <span className="text-xs uppercase tracking-wider text-stone-500">
          {queue.totalItems} {queue.totalItems === 1 ? "item" : "items"}
        </span>
      </header>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {queue.buckets.map((bucket) => (
          <article
            key={bucket.key}
            className={`rounded-lg border bg-white p-5 ${
              bucket.total > 0
                ? "border-amber-200"
                : "border-stone-200"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-medium text-stone-900">
                {bucket.title}
              </h3>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                  bucket.total > 0
                    ? "bg-amber-100 text-amber-800"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {bucket.total}
              </span>
            </div>
            <p className="mt-1 text-xs text-stone-500">{bucket.description}</p>

            {bucket.items.length === 0 ? (
              <p className="mt-4 text-xs text-stone-400">All clear.</p>
            ) : (
              <ul className="mt-3 divide-y divide-stone-100">
                {bucket.items.map((item) => (
                  <li key={item.id} className="py-2">
                    <Link
                      href={item.href}
                      className="group block"
                    >
                      <p className="text-sm text-stone-900 group-hover:underline">
                        {item.label}
                      </p>
                      {item.hint ? (
                        <p className="text-xs text-stone-500">{item.hint}</p>
                      ) : null}
                    </Link>
                  </li>
                ))}
                {bucket.total > bucket.items.length ? (
                  <li className="py-2 text-xs text-stone-500">
                    +{bucket.total - bucket.items.length} more not shown
                  </li>
                ) : null}
              </ul>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

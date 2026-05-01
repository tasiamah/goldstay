"use client";

// Global cmd-K command palette. Mounted once in the admin layout.
//
// - cmd/ctrl+K toggles the palette.
// - Empty query shows static "jump to" actions (open owners, my
//   tasks, system health, etc.). As the operator types, we hit
//   /api/admin/search?q= with a small debounce and merge entity hits
//   in. Selection navigates immediately.
// - We deliberately don't show recent history yet; the entity list
//   already shows the freshest rows first.

import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  PALETTE_ACTIONS,
  filterPaletteActions,
  type PaletteAction,
  type SearchHit,
} from "@/lib/admin/search";

const ENTITY_LABEL: Record<SearchHit["entity"], string> = {
  owner: "Owners",
  property: "Properties",
  lease: "Leases",
  booking: "Bookings",
  transaction: "Transactions",
  document: "Documents",
  lead: "Leads",
};

const ENTITY_ORDER: SearchHit["entity"][] = [
  "owner",
  "property",
  "lease",
  "booking",
  "transaction",
  "document",
  "lead",
];

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const reqId = useRef(0);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setHits([]);
    }
  }, [open]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setHits([]);
      setLoading(false);
      return;
    }
    const myReq = ++reqId.current;
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/admin/search?q=${encodeURIComponent(trimmed)}`,
          { cache: "no-store" },
        );
        if (!res.ok) throw new Error("search failed");
        const data = (await res.json()) as { hits: SearchHit[] };
        if (myReq !== reqId.current) return;
        setHits(data.hits);
      } catch {
        if (myReq === reqId.current) setHits([]);
      } finally {
        if (myReq === reqId.current) setLoading(false);
      }
    }, 150);
    return () => clearTimeout(t);
  }, [query]);

  const groupedHits = useMemo(() => {
    const m = new Map<SearchHit["entity"], SearchHit[]>();
    for (const h of hits) {
      const arr = m.get(h.entity) ?? [];
      arr.push(h);
      m.set(h.entity, arr);
    }
    return ENTITY_ORDER.map((e) => ({ entity: e, items: m.get(e) ?? [] })).filter(
      (g) => g.items.length > 0,
    );
  }, [hits]);

  const filteredActions = useMemo(
    () => filterPaletteActions(query, PALETTE_ACTIONS),
    [query],
  );
  const actionsByGroup = useMemo(() => {
    const m = new Map<PaletteAction["group"], PaletteAction[]>();
    for (const a of filteredActions) {
      const arr = m.get(a.group) ?? [];
      arr.push(a);
      m.set(a.group, arr);
    }
    return [...m.entries()];
  }, [filteredActions]);

  const navigate = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router],
  );

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      className="fixed inset-0 z-50 flex items-start justify-center bg-stone-950/40 px-4 pt-24 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <Command
        label="Admin command palette"
        className="w-full max-w-2xl overflow-hidden rounded-xl border border-stone-200 bg-white shadow-2xl"
        shouldFilter={false}
      >
        <div className="flex items-center gap-2 border-b border-stone-200 px-4">
          <span className="text-xs uppercase tracking-wider text-stone-400">
            ⌘K
          </span>
          <Command.Input
            value={query}
            onValueChange={setQuery}
            placeholder="Search owners, properties, leases, bookings, transactions, documents…"
            className="w-full bg-transparent py-4 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
          />
          {loading ? (
            <span className="text-xs text-stone-400">Searching…</span>
          ) : null}
        </div>
        <Command.List className="max-h-[60vh] overflow-y-auto p-2">
          <Command.Empty className="px-3 py-6 text-center text-sm text-stone-500">
            {query.trim().length < 2
              ? "Type at least 2 characters to search."
              : "No matches."}
          </Command.Empty>

          {actionsByGroup.map(([group, actions]) => (
            <Command.Group
              key={group}
              heading={group}
              className="px-1 pb-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-stone-500"
            >
              {actions.map((a) => (
                <Command.Item
                  key={a.id}
                  value={`action:${a.id}:${a.label}`}
                  onSelect={() => navigate(a.href)}
                  className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm text-stone-900 aria-selected:bg-stone-100"
                >
                  <span>{a.label}</span>
                  {a.hint ? (
                    <span className="text-xs text-stone-500">{a.hint}</span>
                  ) : null}
                </Command.Item>
              ))}
            </Command.Group>
          ))}

          {groupedHits.map((g) => (
            <Command.Group
              key={g.entity}
              heading={ENTITY_LABEL[g.entity]}
              className="px-1 pb-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-stone-500"
            >
              {g.items.map((h) => (
                <Command.Item
                  key={`${g.entity}:${h.id}`}
                  value={`hit:${h.entity}:${h.id}:${h.label}`}
                  onSelect={() => navigate(h.href)}
                  className="flex cursor-pointer flex-col items-start rounded-md px-3 py-2 text-sm text-stone-900 aria-selected:bg-stone-100"
                >
                  <span>{h.label}</span>
                  {h.hint ? (
                    <span className="text-xs text-stone-500">{h.hint}</span>
                  ) : null}
                </Command.Item>
              ))}
            </Command.Group>
          ))}
        </Command.List>
        <div className="border-t border-stone-100 px-4 py-2 text-[10px] uppercase tracking-wider text-stone-400">
          ↵ open · esc close · ⌘K toggle
        </div>
      </Command>
    </div>
  );
}

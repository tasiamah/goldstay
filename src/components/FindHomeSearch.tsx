"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Loader2, Home as HomeIcon, CalendarRange } from "lucide-react";
import type { PublicUnit } from "@/lib/airtable";
import { useCurrentCity } from "@/lib/useCurrentCity";
import { UnitCard } from "./UnitCard";
import { WaitlistForm } from "./WaitlistForm";
import clsx from "./clsx";

// The search surface on /find-a-home. Two stay types switch the filter row
// (long-term cares about monthly budget and move-in; short-stay cares about
// dates, guests and nightly budget). On first render we auto-submit with
// the current filters so the results grid never sits empty — an empty grid
// on a search page reads as "nothing to rent", which is the opposite of
// what we want when we're growing inventory.

type StayType = "Long-term" | "Short-stay";

type Filters = {
  stayType: StayType;
  city: "Nairobi" | "Accra" | "Any";
  bedrooms: string; // "Any" | "0" (studio) | "1" | "2" | "3" | "4"
  budget: string; // numeric string or ""
  checkIn: string;
  checkOut: string;
  guests: string;
};

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function FindHomeSearch() {
  const currentCity = useCurrentCity();
  const lockedCity =
    currentCity === "nairobi"
      ? "Nairobi"
      : currentCity === "accra"
        ? "Accra"
        : null;

  const [filters, setFilters] = useState<Filters>({
    stayType: "Long-term",
    city: lockedCity ?? "Any",
    bedrooms: "Any",
    budget: "",
    checkIn: "",
    checkOut: "",
    guests: "2",
  });
  const [units, setUnits] = useState<PublicUnit[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Keep the city in sync if the user lands on /find-a-home after a client
  // navigation that changed the surface's inferred city (e.g. the /nairobi
  // path lighting up on goldstay.com).
  useEffect(() => {
    if (lockedCity && filters.city !== lockedCity) {
      setFilters((f) => ({ ...f, city: lockedCity }));
    }
  }, [lockedCity, filters.city]);

  const query = useMemo(() => {
    const q = new URLSearchParams();
    q.set("stayType", filters.stayType);
    if (filters.city !== "Any") q.set("city", filters.city);
    if (filters.bedrooms !== "Any") q.set("bedrooms", filters.bedrooms);
    if (filters.budget) q.set("budget", filters.budget);
    if (filters.stayType === "Short-stay") {
      if (filters.checkIn) q.set("checkIn", filters.checkIn);
      if (filters.guests) q.set("guests", filters.guests);
    }
    return q.toString();
  }, [filters]);

  const runSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/units/search?${query}`, {
        cache: "no-store",
      });
      if (!res.ok) {
        setUnits([]);
      } else {
        const json = (await res.json()) as { units?: PublicUnit[] };
        setUnits(json.units ?? []);
      }
    } catch {
      setUnits([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  // Run the first search on mount so the grid populates immediately.
  // Subsequent searches are user-triggered via the Search button so the
  // page doesn't hammer the API on every keystroke.
  useEffect(() => {
    runSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showEmpty = searched && !loading && units.length === 0;

  return (
    <div>
      {/* Stay-type tabs */}
      <div
        className="inline-flex rounded-full border border-charcoal/10 bg-cream p-1"
        role="tablist"
        aria-label="Stay type"
      >
        {(["Long-term", "Short-stay"] as const).map((t) => {
          const active = filters.stayType === t;
          return (
            <button
              key={t}
              role="tab"
              aria-selected={active}
              type="button"
              onClick={() =>
                setFilters((f) => ({ ...f, stayType: t, budget: "" }))
              }
              className={clsx(
                "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300",
                active
                  ? "bg-charcoal text-cream shadow-soft"
                  : "text-charcoal/70 hover:text-charcoal",
              )}
            >
              {t === "Long-term" ? (
                <HomeIcon className="h-4 w-4" />
              ) : (
                <CalendarRange className="h-4 w-4" />
              )}
              {t}
            </button>
          );
        })}
      </div>

      {/* Filter row */}
      <div className="mt-6 grid gap-4 rounded-3xl border border-charcoal/10 bg-cream p-5 md:grid-cols-5 md:p-6">
        <label className="flex flex-col gap-1.5 text-xs">
          <span className="eyebrow">City</span>
          <select
            value={filters.city}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                city: e.target.value as Filters["city"],
              }))
            }
            disabled={lockedCity !== null}
            className="rounded-xl border border-charcoal/15 bg-white px-3 py-2.5 text-sm text-charcoal focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30 disabled:opacity-80"
          >
            {lockedCity ? (
              <option>{lockedCity}</option>
            ) : (
              <>
                <option value="Any">Any city</option>
                <option value="Nairobi">Nairobi</option>
                <option value="Accra">Accra</option>
              </>
            )}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-xs">
          <span className="eyebrow">Bedrooms</span>
          <select
            value={filters.bedrooms}
            onChange={(e) =>
              setFilters((f) => ({ ...f, bedrooms: e.target.value }))
            }
            className="rounded-xl border border-charcoal/15 bg-white px-3 py-2.5 text-sm text-charcoal focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
          >
            <option value="Any">Any</option>
            <option value="0">Studio</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </label>

        {filters.stayType === "Long-term" ? (
          <label className="flex flex-col gap-1.5 text-xs md:col-span-2">
            <span className="eyebrow">Max monthly budget (USD)</span>
            <input
              type="number"
              min={0}
              step={50}
              value={filters.budget}
              onChange={(e) =>
                setFilters((f) => ({ ...f, budget: e.target.value }))
              }
              placeholder="e.g. 1800"
              className="rounded-xl border border-charcoal/15 bg-white px-3 py-2.5 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
            />
          </label>
        ) : (
          <>
            <label className="flex flex-col gap-1.5 text-xs">
              <span className="eyebrow">Check-in</span>
              <input
                type="date"
                min={today()}
                value={filters.checkIn}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, checkIn: e.target.value }))
                }
                className="rounded-xl border border-charcoal/15 bg-white px-3 py-2.5 text-sm text-charcoal focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-xs">
              <span className="eyebrow">Check-out</span>
              <input
                type="date"
                min={filters.checkIn || today()}
                value={filters.checkOut}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, checkOut: e.target.value }))
                }
                className="rounded-xl border border-charcoal/15 bg-white px-3 py-2.5 text-sm text-charcoal focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-xs">
              <span className="eyebrow">Guests</span>
              <input
                type="number"
                min={1}
                max={20}
                value={filters.guests}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, guests: e.target.value }))
                }
                className="rounded-xl border border-charcoal/15 bg-white px-3 py-2.5 text-sm text-charcoal focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
              />
            </label>
          </>
        )}

        <div className="flex items-end md:col-span-1">
          <button
            type="button"
            onClick={runSearch}
            disabled={loading}
            className="btn-primary w-full justify-center disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Searching…
              </>
            ) : (
              <>
                <Search className="h-4 w-4" /> Search
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="mt-10">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-[460px] animate-pulse rounded-3xl border border-charcoal/10 bg-cream"
              />
            ))}
          </div>
        ) : showEmpty ? (
          <EmptyState
            stayType={filters.stayType}
            city={filters.city}
            checkIn={filters.checkIn}
            checkOut={filters.checkOut}
            guests={filters.guests}
          />
        ) : (
          <>
            <div className="mb-6 flex items-baseline justify-between">
              <p className="text-sm text-charcoal/60">
                {units.length}{" "}
                {units.length === 1 ? "home" : "homes"} available
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {units.map((u) => (
                <UnitCard key={u.id} unit={u} stayType={filters.stayType} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Always-on waitlist below results. A tenant who found nothing they
          liked still leaves something useful; a tenant who did find
          something ignores this block. */}
      {!showEmpty && units.length > 0 ? (
        <div className="mt-16">
          <WaitlistForm
            defaultStayType={filters.stayType}
            defaultCity={
              filters.city === "Any" ? undefined : filters.city
            }
            defaultCheckIn={filters.checkIn || undefined}
            defaultCheckOut={filters.checkOut || undefined}
            defaultGuests={
              filters.stayType === "Short-stay"
                ? filters.guests || undefined
                : undefined
            }
            compact
          />
        </div>
      ) : null}
    </div>
  );
}

function EmptyState({
  stayType,
  city,
  checkIn,
  checkOut,
  guests,
}: {
  stayType: StayType;
  city: Filters["city"];
  checkIn: string;
  checkOut: string;
  guests: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-charcoal/20 bg-cream p-8 sm:p-10">
      <div className="max-w-2xl">
        <div className="eyebrow">Nothing currently live</div>
        <h3 className="mt-3 font-serif text-2xl sm:text-3xl">
          No homes match that search right now.
        </h3>
        <p className="mt-3 text-charcoal/70">
          New inventory arrives every week. Join the waitlist and we&apos;ll
          match you to the next home that fits — before it goes public.
        </p>
      </div>
      <div className="mt-8">
        <WaitlistForm
          defaultStayType={stayType}
          defaultCity={city === "Any" ? undefined : city}
          defaultCheckIn={checkIn || undefined}
          defaultCheckOut={checkOut || undefined}
          defaultGuests={stayType === "Short-stay" ? guests : undefined}
        />
      </div>
    </div>
  );
}

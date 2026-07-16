// src/components/PlaceAutocomplete.tsx
//
// India-only "place of birth" input for the Kundli Generator + Kundli
// Matching birth-details forms. Replaces the old free-text-plus-"Locate"-
// button flow in BirthDetailsForm.tsx.
//
// PRIMARY PATH (instant, offline): as the person types 2+ characters, this
// searches the bundled india-locations dataset (24,982 towns/cities across
// every state and district) entirely in the browser — no network call, no
// waiting, lat/long comes straight from the dataset the moment a
// suggestion is picked.
//
// FALLBACK PATH (rare): if their exact village/locality isn't in the
// bundled dataset, a "Can't find it? Search all of India" action calls
// Nominatim (server-proxied, scoped to India) and shows a handful of
// candidates to disambiguate from — see geocode.functions.ts.
//
// Deliberately NOT built on the shadcn Popover/Command primitives: this
// needs to keep keyboard focus in a live <input> while a suggestion list
// opens/closes/updates on every keystroke, which fights Radix Popover's
// focus-management assumptions. A small self-contained listbox is more
// predictable here and easier to reason about.

import { useEffect, useRef, useState } from "react";
import { MapPin, Loader2, CheckCircle2, Search, X } from "lucide-react";
import { toast } from "sonner";
import {
  preloadIndiaLocations,
  loadIndiaLocations,
  searchLocations,
  type IndiaLocation,
  type LocationMatch,
} from "@/lib/india-locations";
import { geocodePlaceInIndia, type GeocodeResult } from "@/lib/api/geocode.functions";

export interface PlaceSelection {
  label: string;
  latitude: number;
  longitude: number;
  utcOffsetHours: number;
}

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onSelect: (selection: PlaceSelection) => void;
  resolvedPlace: string | null;
  placeholder?: string;
}

export default function PlaceAutocomplete({
  value,
  onChangeText,
  onSelect,
  resolvedPlace,
  placeholder = "e.g. Jaipur, Rajasthan",
}: Props) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const [localResults, setLocalResults] = useState<LocationMatch[]>([]);
  const [datasetReady, setDatasetReady] = useState(false);

  const [fallbackResults, setFallbackResults] = useState<GeocodeResult[] | null>(null);
  const [fallbackLoading, setFallbackLoading] = useState(false);
  const [fallbackError, setFallbackError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const datasetRef = useRef<IndiaLocation[] | null>(null);

  // Kick the ~1.7MB dataset off as soon as this field mounts, so it's
  // already resolved by the time the person finishes typing a couple of
  // characters. Cheap no-op if it's already cached (e.g. the other
  // person's birth-details block already triggered it).
  useEffect(() => {
    preloadIndiaLocations();
    let cancelled = false;
    loadIndiaLocations().then((rows) => {
      if (cancelled) return;
      datasetRef.current = rows;
      setDatasetReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Close the dropdown on outside click.
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function runLocalSearch(query: string) {
    if (!datasetRef.current) {
      setLocalResults([]);
      return;
    }
    setLocalResults(searchLocations(datasetRef.current, query, 8));
  }

  function handleTextChange(text: string) {
    onChangeText(text);
    // Editing the text after a fallback search invalidates that search's
    // stale results, same as the old "editing place invalidates lat/long"
    // rule this form already followed.
    setFallbackResults(null);
    setFallbackError(null);
    setHighlighted(0);
    if (text.trim().length >= 2) {
      runLocalSearch(text);
      setOpen(true);
    } else {
      setLocalResults([]);
      setOpen(false);
    }
  }

  function pickLocal(loc: LocationMatch) {
    onSelect({
      label: `${loc.name}, ${loc.district}, ${loc.state}`,
      latitude: loc.latitude,
      longitude: loc.longitude,
      utcOffsetHours: 5.5,
    });
    setOpen(false);
  }

  function pickFallback(result: GeocodeResult) {
    onSelect({
      label: result.displayName,
      latitude: result.latitude,
      longitude: result.longitude,
      utcOffsetHours: result.utcOffsetHours,
    });
    setOpen(false);
  }

  async function searchAllIndia() {
    if (!value.trim()) {
      toast.error("Type a place name first");
      return;
    }
    setFallbackLoading(true);
    setFallbackError(null);
    try {
      const results = await geocodePlaceInIndia({ data: { query: value.trim() } });
      setFallbackResults(results);
    } catch (error) {
      setFallbackError(error instanceof Error ? error.message : "Couldn't search that place");
    } finally {
      setFallbackLoading(false);
    }
  }

  const totalOptions = localResults.length + (fallbackResults?.length ?? 0);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || totalOptions === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((i) => Math.min(i + 1, totalOptions - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlighted < localResults.length) {
        pickLocal(localResults[highlighted]);
      } else if (fallbackResults) {
        const fbIndex = highlighted - localResults.length;
        if (fallbackResults[fbIndex]) pickFallback(fallbackResults[fbIndex]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={value}
          onChange={(e) => handleTextChange(e.target.value)}
          onFocus={() => {
            if (value.trim().length >= 2) {
              runLocalSearch(value);
              setOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
        />
        {value && (
          <button
            type="button"
            aria-label="Clear place"
            onClick={() => {
              handleTextChange("");
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {resolvedPlace && !open && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-green-700">
          <CheckCircle2 className="h-3.5 w-3.5" />
          {resolvedPlace}
        </p>
      )}
      {!resolvedPlace && !datasetReady && (
        <p className="mt-1.5 text-[11px] text-muted-foreground">Loading India places…</p>
      )}

      {open && (
        <div className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-xl border border-border bg-popover shadow-lg">
          <ul role="listbox" className="max-h-64 overflow-y-auto py-1">
            {localResults.map((loc, i) => (
              <li key={`${loc.name}-${loc.district}-${i}`}>
                <button
                  type="button"
                  role="option"
                  aria-selected={highlighted === i}
                  onMouseEnter={() => setHighlighted(i)}
                  onClick={() => pickLocal(loc)}
                  className={`flex w-full items-start gap-2 px-3 py-2 text-left text-sm transition ${
                    highlighted === i ? "bg-accent text-accent-foreground" : "hover:bg-accent/60"
                  }`}
                >
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  <span>
                    <span className="font-medium text-foreground">{loc.name}</span>
                    <span className="text-muted-foreground">
                      {" "}
                      — {loc.district}, {loc.state}
                    </span>
                  </span>
                </button>
              </li>
            ))}

            {fallbackResults?.map((r, i) => {
              const idx = localResults.length + i;
              return (
                <li key={`fallback-${i}`}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={highlighted === idx}
                    onMouseEnter={() => setHighlighted(idx)}
                    onClick={() => pickFallback(r)}
                    className={`flex w-full items-start gap-2 px-3 py-2 text-left text-sm transition ${
                      highlighted === idx
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent/60"
                    }`}
                  >
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    <span className="text-foreground">{r.displayName}</span>
                  </button>
                </li>
              );
            })}

            {localResults.length === 0 && !fallbackResults && datasetReady && (
              <li className="px-3 py-3 text-xs text-muted-foreground">
                No match in our India places list yet.
              </li>
            )}
          </ul>

          <div className="border-t border-border p-2">
            {fallbackError && (
              <p className="mb-1.5 px-1 text-xs text-destructive">{fallbackError}</p>
            )}
            <button
              type="button"
              onClick={searchAllIndia}
              disabled={fallbackLoading}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 transition disabled:opacity-60"
            >
              {fallbackLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Search className="h-3.5 w-3.5" />
              )}
              Can't find your village or locality? Search all of India
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
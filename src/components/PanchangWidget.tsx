// src/components/PanchangWidget.tsx
//
// Today's Panchang: tithi, nakshatra, yoga, karana, sunrise/sunset, and
// the day's auspicious/inauspicious windows (Rahu Kaal etc.) for any
// Indian city/locality. Reuses PlaceAutocomplete (already built for the
// Kundli forms) for location search, and the Prokerala Panchang API via
// panchang.functions.ts for the calculation itself — no new backend
// dependency beyond credentials AstroView already has.

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Sunrise, Sunset, Moon, AlertTriangle, Sparkles } from "lucide-react";
import { format, addDays, isSameDay } from "date-fns";
import PlaceAutocomplete, { type PlaceSelection } from "@/components/PlaceAutocomplete";
import { getPanchang, type PanchangSnapshot } from "@/lib/api/panchang.functions";

const DEFAULT_LOCATION: PlaceSelection = {
  label: "New Delhi, Delhi",
  latitude: 28.6139,
  longitude: 77.209,
  utcOffsetHours: 5.5,
};

// Prokerala returns full ISO timestamps ("2026-07-16T05:37:53+05:30") for
// sunrise/sunset/moonrise/moonset and every "ends at" moment. Nobody wants
// to read that on a Panchang card — format as a plain local time, and only
// surface the date when it rolls onto a different day than `relativeTo`
// (tithis/nakshatras routinely run past midnight into the next day).
function formatFriendlyTime(iso: string | undefined, relativeTo: Date): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const time = format(d, "h:mm a");
  return isSameDay(d, relativeTo) ? time : `${time}, ${format(d, "d MMM")}`;
}

function ElementCard({
  title,
  items,
  extraLabel,
  referenceDate,
}: {
  title: string;
  items: PanchangSnapshot["tithi"];
  extraLabel?: string;
  referenceDate: Date;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <p className="text-xs tracking-[0.16em] uppercase text-primary font-medium mb-3">{title}</p>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">—</p>
      ) : (
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-baseline justify-between gap-3">
              <span className="font-display text-lg font-semibold text-foreground">
                {item.name}
                {item.extra && (
                  <span className="ml-1.5 text-sm font-normal text-muted-foreground">
                    ({extraLabel ? `${extraLabel}: ` : ""}
                    {item.extra})
                  </span>
                )}
              </span>
              {item.endsAt && (
                <span className="text-xs text-muted-foreground shrink-0">
                  upto {formatFriendlyTime(item.endsAt, referenceDate)}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function WindowList({
  title,
  windows,
  tone,
  referenceDate,
}: {
  title: string;
  windows: PanchangSnapshot["auspicious"];
  tone: "good" | "bad";
  referenceDate: Date;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <p
        className={`text-xs tracking-[0.16em] uppercase font-medium mb-3 flex items-center gap-1.5 ${
          tone === "good" ? "text-emerald-700" : "text-destructive"
        }`}
      >
        {tone === "good" ? <Sparkles className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
        {title}
      </p>
      {windows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Not available for this location/date.</p>
      ) : (
        <ul className="space-y-2">
          {windows.map((w, i) => (
            <li key={i} className="flex items-center justify-between text-sm">
              <span className="text-foreground">{w.name}</span>
              <span className="text-muted-foreground">
                {formatFriendlyTime(w.start, referenceDate)} – {formatFriendlyTime(w.end, referenceDate)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function PanchangWidget() {
  const [location, setLocation] = useState<PlaceSelection>(DEFAULT_LOCATION);
  const [placeText, setPlaceText] = useState(DEFAULT_LOCATION.label);
  const [date, setDate] = useState(() => new Date());

  const [snapshot, setSnapshot] = useState<PanchangSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getPanchang({
      data: {
        date: format(date, "yyyy-MM-dd"),
        latitude: location.latitude,
        longitude: location.longitude,
        utcOffsetHours: location.utcOffsetHours,
      },
    })
      .then((res) => {
        if (!cancelled) setSnapshot(res);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Couldn't load today's Panchang");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [date, location]);

  const isToday = format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Location</label>
          <PlaceAutocomplete
            value={placeText}
            onChangeText={setPlaceText}
            onSelect={(sel) => {
              setLocation(sel);
              setPlaceText(sel.label);
            }}
            resolvedPlace={location.label}
            placeholder="e.g. Mumbai, Maharashtra"
          />
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setDate((d) => addDays(d, -1))}
            className="flex items-center justify-center h-9 w-9 rounded-full border border-border hover:border-primary/40 hover:bg-accent/60 transition"
            aria-label="Previous day"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="text-center min-w-[10rem]">
            <p className="font-display text-lg font-semibold text-foreground">{format(date, "d MMMM yyyy")}</p>
            {!isToday && (
              <button
                type="button"
                onClick={() => setDate(new Date())}
                className="text-xs text-primary hover:underline"
              >
                Back to today
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setDate((d) => addDays(d, 1))}
            className="flex items-center justify-center h-9 w-9 rounded-full border border-border hover:border-primary/40 hover:bg-accent/60 transition"
            aria-label="Next day"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {loading && (
        <div className="bg-card border border-border rounded-2xl p-8 text-center text-sm text-muted-foreground">
          Calculating the Panchang…
        </div>
      )}

      {error && !loading && (
        <div className="bg-card border border-destructive/30 rounded-2xl p-5 text-sm text-destructive">
          {error}
        </div>
      )}

      {snapshot && !loading && !error && (
        <>
          <div className="bg-card border border-border rounded-2xl p-5 flex flex-wrap items-center gap-x-8 gap-y-3">
            {snapshot.weekday && (
              <div>
                <p className="text-xs text-muted-foreground">Day</p>
                <p className="font-medium text-foreground">{snapshot.weekday}</p>
              </div>
            )}
            {snapshot.sunrise && (
              <div className="flex items-center gap-1.5">
                <Sunrise className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Sunrise</p>
                  <p className="font-medium text-foreground">{formatFriendlyTime(snapshot.sunrise, date)}</p>
                </div>
              </div>
            )}
            {snapshot.sunset && (
              <div className="flex items-center gap-1.5">
                <Sunset className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Sunset</p>
                  <p className="font-medium text-foreground">{formatFriendlyTime(snapshot.sunset, date)}</p>
                </div>
              </div>
            )}
            {snapshot.moonrise && (
              <div className="flex items-center gap-1.5">
                <Moon className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Moonrise</p>
                  <p className="font-medium text-foreground">{formatFriendlyTime(snapshot.moonrise, date)}</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <ElementCard title="Tithi" items={snapshot.tithi} extraLabel="Paksha" referenceDate={date} />
            <ElementCard title="Nakshatra" items={snapshot.nakshatra} extraLabel="Lord" referenceDate={date} />
            <ElementCard title="Yoga" items={snapshot.yoga} referenceDate={date} />
            <ElementCard title="Karana" items={snapshot.karana} referenceDate={date} />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <WindowList title="Auspicious Windows" windows={snapshot.auspicious} tone="good" referenceDate={date} />
            <WindowList title="Inauspicious Windows" windows={snapshot.inauspicious} tone="bad" referenceDate={date} />
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Calculated for {location.label} · Lahiri ayanamsa
          </p>
        </>
      )}
    </div>
  );
}
// src/components/BirthDetailsForm.tsx
//
// Reusable birth-details input block: name, date of birth, time of birth,
// and place of birth (with a "Locate" button that geocodes the typed place
// via Nominatim, server-proxied through geocode.functions.ts). Used twice
// on the Kundli Matching page (boy + girl), and built to be reused as-is
// on the upcoming single-person Kundli Making page.
//
// Geocoding is a separate explicit action (not auto-fire-on-blur) so we
// don't hammer Nominatim's free tier on every keystroke/blur — the parent
// only gets valid lat/long/timezone once the user confirms the resolved
// place looks right.

import { useState } from "react";
import { MapPin, Loader2, CheckCircle2, CalendarIcon, Clock } from "lucide-react";
import { format, parse } from "date-fns";
import { toast } from "sonner";
import { geocodePlace } from "@/lib/api/geocode.functions";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface BirthDetails {
  name: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  place: string;
  latitude: number | null;
  longitude: number | null;
  utcOffsetHours: number | null;
  resolvedPlace: string | null;
}

export const emptyBirthDetails: BirthDetails = {
  name: "",
  date: "",
  time: "",
  place: "",
  latitude: null,
  longitude: null,
  utcOffsetHours: null,
  resolvedPlace: null,
};

interface Props {
  label: string;
  value: BirthDetails;
  onChange: (next: BirthDetails) => void;
}

const today = new Date();
const currentYear = today.getFullYear();
const HOURS_12 = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES_60 = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

export default function BirthDetailsForm({ label, value, onChange }: Props) {
  const [locating, setLocating] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);

  const dobDate = value.date ? parse(value.date, "yyyy-MM-dd", new Date()) : undefined;
  const [timeHour, timeMinute] = value.time ? value.time.split(":") : ["", ""];
  const hour24 = timeHour ? Number(timeHour) : null;
  const displayHour = hour24 === null ? null : hour24 % 12 === 0 ? 12 : hour24 % 12;
  const displayMeridiem = hour24 === null ? null : hour24 < 12 ? "AM" : "PM";

  const setTimeParts = (nextHour24: number, nextMinute: string) => {
    set("time", `${String(nextHour24).padStart(2, "0")}:${nextMinute}`);
  };

  const setHour12 = (h: number) => {
    const meridiem = displayMeridiem ?? "AM";
    const nextHour24 = meridiem === "AM" ? h % 12 : (h % 12) + 12;
    setTimeParts(nextHour24, timeMinute || "00");
  };

  const setMeridiem = (meridiem: "AM" | "PM") => {
    const h12 = displayHour ?? 12;
    const nextHour24 = meridiem === "AM" ? h12 % 12 : (h12 % 12) + 12;
    setTimeParts(nextHour24, timeMinute || "00");
  };

  const setMinute = (m: string) => {
    setTimeParts(hour24 ?? 0, m);
  };

  const set = <K extends keyof BirthDetails>(key: K, val: BirthDetails[K]) => {
    // Editing the place text after it was resolved invalidates the old
    // coordinates — force a re-locate before this person can be submitted.
    if (key === "place") {
      onChange({
        ...value,
        place: val as string,
        latitude: null,
        longitude: null,
        utcOffsetHours: null,
        resolvedPlace: null,
      });
      return;
    }
    onChange({ ...value, [key]: val });
  };

  const handleLocate = async () => {
    if (!value.place.trim()) {
      toast.error("Enter a place of birth first");
      return;
    }
    try {
      setLocating(true);
      const result = await geocodePlace({ data: { query: value.place.trim() } });
      onChange({
        ...value,
        latitude: result.latitude,
        longitude: result.longitude,
        utcOffsetHours: result.utcOffsetHours,
        resolvedPlace: result.displayName,
      });
      toast.success("Location found");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't find that place");
    } finally {
      setLocating(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
      <h3 className="font-display text-lg font-semibold text-foreground">{label}</h3>

      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Full Name</label>
        <input
          type="text"
          value={value.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Enter full name"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">
            Date of Birth
          </label>
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="w-full flex items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-left focus:outline-none focus:ring-2 focus:ring-primary/40 hover:border-primary/40 transition"
              >
                <span className={dobDate ? "text-foreground" : "text-muted-foreground"}>
                  {dobDate ? format(dobDate, "d MMM yyyy") : "Select date"}
                </span>
                <CalendarIcon className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dobDate}
                onSelect={(date) => {
                  if (!date) return;
                  set("date", format(date, "yyyy-MM-dd"));
                  setDateOpen(false);
                }}
                captionLayout="dropdown"
                startMonth={new Date(1930, 0)}
                endMonth={today}
                disabled={{ after: today }}
                defaultMonth={dobDate ?? new Date(currentYear - 25, 0)}
                autoFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">
            Time of Birth
          </label>
          <Popover open={timeOpen} onOpenChange={setTimeOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="w-full flex items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-left focus:outline-none focus:ring-2 focus:ring-primary/40 hover:border-primary/40 transition"
              >
                <span className={displayHour ? "text-foreground" : "text-muted-foreground"}>
                  {displayHour ? `${displayHour}:${timeMinute} ${displayMeridiem}` : "Select time"}
                </span>
                <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="flex divide-x divide-border">
                <div className="flex flex-col max-h-56 overflow-y-auto py-1 w-14">
                  {HOURS_12.map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setHour12(h)}
                      className={`px-3 py-1.5 text-sm text-center transition ${
                        displayHour === h
                          ? "bg-primary text-primary-foreground font-medium"
                          : "text-foreground hover:bg-accent"
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
                <div className="flex flex-col max-h-56 overflow-y-auto py-1 w-14">
                  {MINUTES_60.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMinute(m)}
                      className={`px-3 py-1.5 text-sm text-center transition ${
                        timeMinute === m
                          ? "bg-primary text-primary-foreground font-medium"
                          : "text-foreground hover:bg-accent"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <div className="flex flex-col py-1 w-14">
                  {(["AM", "PM"] as const).map((mer) => (
                    <button
                      key={mer}
                      type="button"
                      onClick={() => {
                        setMeridiem(mer);
                        if (timeMinute) setTimeOpen(false);
                      }}
                      className={`px-3 py-1.5 text-sm text-center transition ${
                        displayMeridiem === mer
                          ? "bg-primary text-primary-foreground font-medium"
                          : "text-foreground hover:bg-accent"
                      }`}
                    >
                      {mer}
                    </button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">
          Place of Birth
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={value.place}
            onChange={(e) => set("place", e.target.value)}
            placeholder="e.g. Jaipur, Rajasthan"
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <button
            type="button"
            onClick={handleLocate}
            disabled={locating}
            className="shrink-0 flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-3 py-2 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {locating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MapPin className="h-4 w-4" />
            )}
            Locate
          </button>
        </div>
        {value.resolvedPlace && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-green-700">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {value.resolvedPlace}
          </p>
        )}
      </div>
    </div>
  );
}

export function isBirthDetailsComplete(d: BirthDetails): boolean {
  return (
    d.name.trim().length > 0 &&
    d.date.length > 0 &&
    d.time.length > 0 &&
    d.latitude !== null &&
    d.longitude !== null &&
    d.utcOffsetHours !== null
  );
}

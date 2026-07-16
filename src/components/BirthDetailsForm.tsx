// src/components/BirthDetailsForm.tsx
//
// Reusable birth-details input block: name, date of birth, time of birth,
// and place of birth. The place field is PlaceAutocomplete — an India-only
// type-ahead over a bundled offline dataset of towns/cities (instant, no
// network call), with an explicit "search all of India" fallback to
// Nominatim for anything not in that dataset. See PlaceAutocomplete.tsx.
// Used twice on the Kundli Matching page (boy + girl), and reused as-is on
// the Kundli Generator (single-person) page.

import { useState } from "react";
import { CalendarIcon, Clock } from "lucide-react";
import { format, parse } from "date-fns";
import PlaceAutocomplete from "@/components/PlaceAutocomplete";
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

  const handlePlaceText = (text: string) => {
    set("place", text);
  };

  const handlePlaceSelect = (selection: {
    label: string;
    latitude: number;
    longitude: number;
    utcOffsetHours: number;
  }) => {
    onChange({
      ...value,
      place: selection.label,
      latitude: selection.latitude,
      longitude: selection.longitude,
      utcOffsetHours: selection.utcOffsetHours,
      resolvedPlace: selection.label,
    });
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
          Place of Birth (India)
        </label>
        <PlaceAutocomplete
          value={value.place}
          onChangeText={handlePlaceText}
          onSelect={handlePlaceSelect}
          resolvedPlace={value.resolvedPlace}
        />
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
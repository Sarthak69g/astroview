// src/lib/api/panchang.functions.ts
//
// Server-side proxy for Prokerala's Daily Panchang API — specifically the
// /advanced variant (v2/astrology/panchang/advanced), NOT the basic
// v2/astrology/panchang endpoint. This matters: per Prokerala's own OpenAPI
// spec, auspicious_period/inauspicious_period only exist on the advanced
// response — the basic endpoint returns tithi/nakshatra/yoga/karana/
// sunrise/sunset/moonrise/moonset only, with no windows at all. Hitting the
// basic URL (the original bug here) meant Auspicious/Inauspicious would
// always come back empty regardless of how normalizeWindows() parsed it.
// Same OAuth2 client-credentials flow as kundli.functions.ts and
// kundli-chart.functions.ts, via the shared token cache in
// prokerala.server.ts — no new credentials or .env changes needed.
//
// Returns tithi, nakshatra, yoga, karana, sunrise/sunset, and the day's
// auspicious (Abhijit Muhurat, Amrit Kaal, Brahma Muhurat) and
// inauspicious (Rahu Kaal, Yamaganda, Gulika Kaal, Dur Muhurat, Varjyam)
// windows for a given date + location.
//
// FIELD SHAPE — confirmed against prokerala/astrology-sdk's panchang.php
// (the official PHP SDK's source, which reads the raw JSON via getName()/
// getPeriod() getters): auspicious_period and inauspicious_period are each
// an ARRAY of { name, period: [{ start, end }, ...] } entries — a single
// named window (e.g. "Rahu Kaal") can have more than one period in a day.
// This was the actual bug behind empty Auspicious/Inauspicious sections:
// the previous version of this file assumed a keyed object instead of an
// array. normalizeWindows() below now handles the real array shape, with
// the old keyed-object shape kept as a defensive fallback. If a card ever
// renders "—"/"Not available" unexpectedly again, add back a
// console.log(bodyText) here temporarily to check against a live response.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getProkeralaToken, extractProkeralaError } from "@/lib/api/prokerala.server";

const PANCHANG_URL = "https://api.prokerala.com/v2/astrology/panchang/advanced";

const inputSchema = z.object({
  date: z.string().min(1), // YYYY-MM-DD
  latitude: z.number(),
  longitude: z.number(),
  utcOffsetHours: z.number(),
});

export interface PanchangElement {
  name: string;
  endsAt?: string; // local time the element is active until, e.g. "07:38 PM"
  extra?: string; // paksha (for tithi) / lord (for nakshatra) / pada, when present
}

export interface PanchangWindow {
  name: string;
  start: string;
  end: string;
}

export interface PanchangSnapshot {
  date: string;
  weekday?: string;
  sunrise?: string;
  sunset?: string;
  moonrise?: string;
  moonset?: string;
  tithi: PanchangElement[];
  nakshatra: PanchangElement[];
  yoga: PanchangElement[];
  karana: PanchangElement[];
  auspicious: PanchangWindow[];
  inauspicious: PanchangWindow[];
}

// Tries each candidate key in order and returns the first defined value —
// a small hedge against not knowing Prokerala's exact raw field casing
// (see caveat above).
function pick(obj: Record<string, unknown> | undefined, ...keys: string[]): unknown {
  if (!obj) return undefined;
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null) return obj[k];
  }
  return undefined;
}

function asString(v: unknown): string | undefined {
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  return undefined;
}

// Normalizes one Panchang element (tithi/nakshatra/yoga/karana), which
// Prokerala's demo shows can appear as either a single object or an array
// (an element can transition mid-day, e.g. two tithis in one calendar day).
function normalizeElement(raw: unknown, extraKey?: string): PanchangElement[] {
  if (!raw) return [];
  const items = Array.isArray(raw) ? raw : [raw];
  return items
    .map((item): PanchangElement | null => {
      if (typeof item !== "object" || item === null) return null;
      const obj = item as Record<string, unknown>;
      const name = asString(pick(obj, "name", "details"));
      if (!name) return null;
      const endsAt = asString(pick(obj, "ends_at", "end", "completes_at", "end_time"));
      const extra = extraKey ? asString(pick(obj, extraKey)) : undefined;
      return { name, endsAt, extra };
    })
    .filter((x): x is PanchangElement => x !== null);
}

// Fallback labels, only used if a raw item is missing its own "name" —
// Prokerala's real payload (confirmed against prokerala/astrology-sdk's
// panchang.php, which reads getName()/getPeriod() off each entry) already
// supplies human-readable names, so this is a safety net, not the primary
// source of labels.
const WINDOW_LABELS: Record<string, string> = {
  abhijitMuhurat: "Abhijit Muhurat",
  amritKaal: "Amrit Kaal",
  brahmaMuhurat: "Brahma Muhurat",
  rahuKaal: "Rahu Kaal",
  yamagandaKaal: "Yamaganda Kaal",
  gulikaKaal: "Gulika Kaal",
  durMuhurat: "Dur Muhurat",
  varjyam: "Varjyam",
};

// Prokerala's actual shape (per prokerala/astrology-sdk panchang.php):
// auspicious_period / inauspicious_period is an ARRAY of entries, each
// shaped like { id, name, type, period: [{ start, end }, ...] } — a single
// named window (e.g. "Rahu Kaal") can have more than one period in a day.
// Handles a legacy/alternate keyed-object shape too, just in case.
function normalizeWindows(raw: unknown): PanchangWindow[] {
  if (!raw) return [];
  const out: PanchangWindow[] = [];

  const pushPeriods = (name: string, periodsRaw: unknown) => {
    const periods = Array.isArray(periodsRaw) ? periodsRaw : periodsRaw ? [periodsRaw] : [];
    for (const period of periods) {
      if (typeof period !== "object" || period === null) continue;
      const p = period as Record<string, unknown>;
      const start = asString(pick(p, "start", "start_time"));
      const end = asString(pick(p, "end", "end_time"));
      if (!start || !end) continue;
      out.push({ name, start, end });
    }
  };

  if (Array.isArray(raw)) {
    // Real shape: array of { name, period: [...] } entries.
    for (const item of raw) {
      if (typeof item !== "object" || item === null) continue;
      const obj = item as Record<string, unknown>;
      const rawName = asString(pick(obj, "name"));
      const name = rawName ?? "Window";
      const periodsRaw = pick(obj, "period", "periods");
      // If there's no nested period/periods field, the start/end might sit
      // directly on this object instead (defensive fallback).
      pushPeriods(name, periodsRaw ?? obj);
    }
  } else if (typeof raw === "object") {
    // Legacy/alternate shape: keyed object, e.g. { rahuKaal: [{start,end}] }.
    for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
      pushPeriods(WINDOW_LABELS[key] ?? key, value);
    }
  }

  return out;
}

export const getPanchang = createServerFn({ method: "POST" })
  .validator(inputSchema)
  .handler(async ({ data }): Promise<PanchangSnapshot> => {
    const token = await getProkeralaToken();

    // Panchang is computed for a calendar day, not a live clock moment —
    // noon local time is a stable, unambiguous reference point for "which
    // day" regardless of which hour someone opens the widget at.
    const sign = data.utcOffsetHours >= 0 ? "+" : "-";
    const abs = Math.abs(data.utcOffsetHours);
    const hh = String(Math.floor(abs)).padStart(2, "0");
    const mm = String(Math.round((abs % 1) * 60)).padStart(2, "0");
    const datetime = `${data.date}T12:00:00${sign}${hh}:${mm}`;

    const url =
      `${PANCHANG_URL}?ayanamsa=1` +
      `&coordinates=${encodeURIComponent(`${data.latitude},${data.longitude}`)}` +
      `&datetime=${encodeURIComponent(datetime)}`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const bodyText = await res.text();
    if (!res.ok) {
      console.error(`[Panchang] upstream error (${res.status}):`, bodyText.slice(0, 500));
      throw new Error(`Panchang lookup failed (${res.status}): ${extractProkeralaError(bodyText)}`);
    }

    const json = JSON.parse(bodyText) as { data?: Record<string, unknown> } & Record<
      string,
      unknown
    >;
    // Prokerala v2 endpoints usually wrap the payload in a top-level
    // "data" key; fall back to the root object if this one doesn't.
    const d = (json.data ?? json) as Record<string, unknown>;

    return {
      date: data.date,
      weekday: asString(pick(d, "vaara", "weekday_name")) ?? undefined,
      sunrise: asString(pick(d, "sunrise")),
      sunset: asString(pick(d, "sunset")),
      moonrise: asString(pick(d, "moonrise")),
      moonset: asString(pick(d, "moonset")),
      tithi: normalizeElement(pick(d, "tithi"), "paksha"),
      nakshatra: normalizeElement(pick(d, "nakshatra"), "lord"),
      yoga: normalizeElement(pick(d, "yoga")),
      karana: normalizeElement(pick(d, "karana", "karanas")),
      auspicious: normalizeWindows(pick(d, "auspicious_period", "auspiciousPeriod")),
      inauspicious: normalizeWindows(pick(d, "inauspicious_period", "inauspiciousPeriod")),
    };
  });
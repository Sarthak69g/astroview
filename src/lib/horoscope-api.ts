// src/lib/horoscope-api.ts
// Client-side helper for daily/weekly/monthly horoscope text. The actual
// HTTP call to freehoroscopeapi.com happens server-side (see
// lib/api/horoscope.functions.ts) because that API doesn't send CORS
// headers, so calling it directly from the browser gets blocked. Results
// are cached in localStorage so a sign only gets re-fetched once per day
// (or once per week/month for those periods), matching how often the
// underlying data actually changes.

import { getHoroscope } from "@/lib/api/horoscope.functions";

export type HoroscopePeriod = "daily" | "weekly" | "monthly";

export interface HoroscopeResult {
  date: string;
  period: HoroscopePeriod;
  sign: string;
  horoscope: string;
}

// Cache key changes with the calendar unit relevant to the period, so a
// "weekly" cache entry naturally expires when the week rolls over, etc.
function cacheKey(sign: string, period: HoroscopePeriod): string {
  const now = new Date();
  let bucket: string;

  if (period === "daily") {
    bucket = now.toISOString().slice(0, 10); // YYYY-MM-DD
  } else if (period === "weekly") {
    const firstDay = new Date(now);
    const day = (now.getDay() + 6) % 7; // Monday = 0
    firstDay.setDate(now.getDate() - day);
    bucket = `week-${firstDay.toISOString().slice(0, 10)}`;
  } else {
    bucket = now.toISOString().slice(0, 7); // YYYY-MM
  }

  return `astroview_horoscope_${period}_${sign}_${bucket}`;
}

function readCache(key: string): HoroscopeResult | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as HoroscopeResult;
  } catch {
    return null;
  }
}

function writeCache(key: string, value: HoroscopeResult) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable — silently skip caching, not fatal.
  }
}

export async function fetchHoroscope(
  sign: string,
  period: HoroscopePeriod,
): Promise<HoroscopeResult> {
  const key = cacheKey(sign, period);
  const cached = readCache(key);
  if (cached) return cached;

  const result = await getHoroscope({ data: { sign, period } });
  writeCache(key, result as HoroscopeResult);
  return result as HoroscopeResult;
}


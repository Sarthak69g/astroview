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
    const parsed = JSON.parse(raw) as HoroscopeResult;
    if (!isValidHoroscopeText(parsed.horoscope)) {
      // A bad/garbled response got cached at some point (upstream glitch).
      // Drop it so the next call re-fetches instead of showing junk forever.
      localStorage.removeItem(key);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

// Sanity check on the horoscope text before we trust or cache it. Guards
// against upstream glitches like freehoroscopeapi.com occasionally
// returning short, garbled, or heavily-repetitive placeholder strings
// (seen in production as e.g. ".Forms.Forms.Forms000.Forms000...") instead
// of an actual forecast paragraph.
function isValidHoroscopeText(text: unknown): text is string {
  if (typeof text !== "string") return false;
  const trimmed = text.trim();
  if (trimmed.length < 40) return false;

  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length < 8) return false;

  // Real forecast copy uses a healthy variety of words. Garbled/repetitive
  // output (like the bug above) collapses to a handful of tokens repeated
  // over and over — catch that with a unique-word ratio floor.
  const uniqueWords = new Set(words.map((w) => w.toLowerCase()));
  if (uniqueWords.size / words.length < 0.35) return false;

  return true;
}

function writeCache(key: string, value: HoroscopeResult) {
  if (!isValidHoroscopeText(value.horoscope)) return; // never cache junk
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable — silently skip caching, not fatal.
  }
}

export async function fetchHoroscope(
  sign: string,
  period: HoroscopePeriod,
  options: { forceRefresh?: boolean } = {},
): Promise<HoroscopeResult> {
  const key = cacheKey(sign, period);

  if (!options.forceRefresh) {
    const cached = readCache(key);
    if (cached) return cached;
  }

  const result = (await getHoroscope({ data: { sign, period } })) as HoroscopeResult;

  if (!isValidHoroscopeText(result.horoscope)) {
    // Upstream returned something that doesn't look like a real horoscope.
    // Surface this as an error rather than showing garbled text to users.
    throw new Error("Horoscope response looked malformed — not displaying it.");
  }

  writeCache(key, result);
  return result;
}
// src/lib/api/geocode.functions.ts
//
// Server-side proxy for OpenStreetMap's Nominatim geocoding service,
// scoped to India only.
//
// This is now the FALLBACK path for "place of birth" — the primary path
// is the offline india-locations dataset searched instantly in the
// browser (see src/lib/india-locations.ts + PlaceAutocomplete.tsx). This
// function only runs when someone's exact village/locality isn't in that
// bundled dataset and they explicitly tap "Search all of India".
//
// Runs server-side (not fetched directly from the browser) because
// Nominatim's usage policy requires a descriptive User-Agent header —
// easy to set server-side, not reliably settable from browser fetch.
//
// Nominatim usage policy: max ~1 request/second, no bulk/heavy use. Fine
// for this form's rare, user-triggered, explicitly-opted-into fallback.
//
// Since every result is restricted to India (a single-timezone country,
// no DST), UTC offset is hardcoded to +5:30 (IST) instead of making a
// second network call to a timezone API - one less external dependency
// and one less thing that can fail or rate-limit this form.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const INDIA_UTC_OFFSET_HOURS = 5.5;

export interface GeocodeResult {
  displayName: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utcOffsetHours: number;
}

export const geocodePlaceInIndia = createServerFn({ method: "POST" })
  .validator(z.object({ query: z.string().min(2) }))
  .handler(async ({ data }): Promise<GeocodeResult[]> => {
    const searchUrl =
      `${NOMINATIM_URL}?q=${encodeURIComponent(data.query)}` +
      `&format=json&limit=5&countrycodes=in&addressdetails=0`;

    const geoRes = await fetch(searchUrl, {
      headers: {
        "User-Agent": "AstroView/1.0 (astroview kundli birth-place search)",
      },
    });

    if (!geoRes.ok) {
      throw new Error(`Geocoding upstream error (${geoRes.status})`);
    }

    const results = (await geoRes.json()) as Array<{
      display_name: string;
      lat: string;
      lon: string;
    }>;

    if (!results.length) {
      throw new Error(
        `No place found for "${data.query}" in India. Try a nearby bigger town, or check the spelling.`,
      );
    }

    return results.map((r) => ({
      displayName: r.display_name,
      latitude: Number(r.lat),
      longitude: Number(r.lon),
      timezone: "Asia/Kolkata",
      utcOffsetHours: INDIA_UTC_OFFSET_HOURS,
    }));
  });

// Kept for backward compatibility in case anything else on the site still
// imports the old single-result, worldwide function name. New code should
// use geocodePlaceInIndia above.
export const geocodePlace = geocodePlaceInIndia;
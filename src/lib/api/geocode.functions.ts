// src/lib/api/geocode.functions.ts
// Server-side proxy for OpenStreetMap's Nominatim geocoding service.
// Used by the Kundli Matching birth-details form to turn a typed "place of
// birth" (e.g. "Jaipur, Rajasthan") into lat/long, which Prokerala's chart
// endpoints require. Also resolves an IANA timezone from the coordinates
// via the free timeapi.io lookup (no key needed), since Prokerala expects a
// UTC offset, not a place name.
//
// Runs server-side (not fetched directly from the browser) for two reasons:
// 1. Nominatim's usage policy requires a descriptive User-Agent header —
//    easy to set server-side, not reliably settable from browser fetch.
// 2. Keeps both calls off the client bundle / avoids any CORS friction,
//    same reasoning as horoscope.functions.ts and auth.functions.ts.
//
// Nominatim usage policy: max ~1 request/second, no bulk/heavy use. Fine
// for this form's on-demand, user-triggered lookups.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const TIMEZONE_URL = "https://timeapi.io/api/timezone/coordinate";

export interface GeocodeResult {
  displayName: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utcOffsetHours: number;
}

export const geocodePlace = createServerFn({ method: "POST" })
  .validator(z.object({ query: z.string().min(2) }))
  .handler(async ({ data }): Promise<GeocodeResult> => {
    const searchUrl = `${NOMINATIM_URL}?q=${encodeURIComponent(data.query)}&format=json&limit=1`;

    const geoRes = await fetch(searchUrl, {
      headers: {
        // Nominatim requires an identifying User-Agent — requests without
        // one get silently rate-limited or blocked.
        "User-Agent": "AstroView/1.0 (astroview kundli matching feature)",
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
      throw new Error(`No location found for "${data.query}". Try adding a state or country.`);
    }

    const { display_name, lat, lon } = results[0];
    const latitude = Number(lat);
    const longitude = Number(lon);

    // Resolve timezone + UTC offset from the coordinates. Prokerala's
    // chart/matching endpoints take a numeric UTC offset (e.g. 5.5 for
    // IST), not an IANA timezone name.
    let timezone = "Asia/Kolkata";
    let utcOffsetHours = 5.5;

    try {
      const tzRes = await fetch(`${TIMEZONE_URL}?latitude=${latitude}&longitude=${longitude}`);
      if (tzRes.ok) {
        const tzJson = (await tzRes.json()) as {
          timeZone?: string;
          currentUtcOffset?: { seconds?: number };
        };
        if (tzJson.timeZone) timezone = tzJson.timeZone;
        if (typeof tzJson.currentUtcOffset?.seconds === "number") {
          utcOffsetHours = tzJson.currentUtcOffset.seconds / 3600;
        }
      }
      // If the timezone lookup fails, fall through with the India defaults
      // above rather than failing the whole geocode — most AstroView users
      // are searching Indian birthplaces anyway.
    } catch {
      // ignore — defaults above cover it
    }

    return {
      displayName: display_name,
      latitude,
      longitude,
      timezone,
      utcOffsetHours,
    };
  });
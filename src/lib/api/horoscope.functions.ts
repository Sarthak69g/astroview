// src/lib/api/horoscope.functions.ts
// Server-side proxy for AstrologyAPI.com's sun-sign horoscope endpoint.
// Swapped in from freehoroscopeapi.com (2026-07-14) because AstrologyAPI.com
// actually generates dynamic daily/weekly/monthly predictions instead of
// static text — see the API R&D doc. Running the call here (inside a
// createServerFn handler) keeps the token out of the client bundle and
// avoids any CORS issues, same reasoning as before.
//
// getHoroscope()'s input/output shape is UNCHANGED from the previous
// implementation on purpose — horoscope-api.ts (caching layer) and
// DailyHoroscope.tsx (UI) don't need to change at all.
//
// AUTH NOTE: using AstrologyAPI.com's RECOMMENDED auth method — the
// Access Token (aka Wallet Token), confirmed against their official
// Quick Start guide (astrologyapi.com/developers/v1/access-token-usage-guide).
// It is NOT a Bearer token and NOT Basic Auth — it's a single value sent
// in a custom header:
//   x-astrologyapi-key: <ACCESS_TOKEN>
// Trial token is currently hardcoded into .env since this account can't
// rotate it; treat it as already-exposed and swap for a fresh one the
// moment the paid plan is purchased.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getServerConfig } from "@/lib/config.server";

const inputSchema = z.object({
  sign: z.string().min(1),
  period: z.enum(["daily", "weekly", "monthly"]),
});

export interface HoroscopePayload {
  date: string;
  period: string;
  sign: string;
  horoscope: string;
}

// ENDPOINT NOTE: confirmed against AstrologyAPI.com's own docs — daily and
// weekly/monthly horoscopes are NOT the same endpoint family. Calling
// sun_sign_prediction/weekly/... or /monthly/... (the original bug here)
// silently 200s with a shape that has no usable prediction text for most
// signs, which is exactly the "some signs work, some don't" flakiness
// that was reported.
//   daily   -> sun_sign_prediction/daily/{sign}
//   weekly  -> horoscope_prediction/weekly/{sign}
//   monthly -> horoscope_prediction/monthly/{sign}  (prediction is an ARRAY
//              of paragraph strings for this endpoint, not a single string)
interface AstrologyApiResponse {
  status?: boolean;
  sun_sign?: string;
  prediction_date?: string;
  prediction_start_date?: string;
  prediction_end_date?: string;
  prediction_month?: string;
  prediction?: string | string[] | Record<string, string>;
  description?: string;
  horoscope?: string;
}

// AstrologyAPI.com's endpoints use the plain lowercase English sign name in
// the URL path (aries, taurus, ...) — this matches the `slug` values in
// zodiacData.ts exactly, so no mapping is needed here.
function buildUrl(period: string, sign: string): string {
  const encodedSign = encodeURIComponent(sign);
  if (period === "daily") {
    return `https://json.astrologyapi.com/v1/sun_sign_prediction/daily/${encodedSign}`;
  }
  // weekly and monthly both live under horoscope_prediction, not
  // sun_sign_prediction.
  return `https://json.astrologyapi.com/v1/horoscope_prediction/${period}/${encodedSign}`;
}

// Turn whatever shape the API returned into the single readable paragraph
// DailyHoroscope.tsx expects in `horoscope`.
function extractHoroscopeText(json: AstrologyApiResponse): string | null {
  if (typeof json.horoscope === "string") return json.horoscope;
  if (typeof json.description === "string") return json.description;

  if (typeof json.prediction === "string") return json.prediction;

  // Monthly's horoscope_prediction endpoint returns `prediction` as an
  // array of paragraph strings.
  if (Array.isArray(json.prediction)) {
    const paragraphs = json.prediction
      .filter((p): p is string => typeof p === "string" && p.trim().length > 0)
      .map((p) => p.trim());
    if (paragraphs.length > 0) return paragraphs.join(" ");
  }

  if (json.prediction && typeof json.prediction === "object" && !Array.isArray(json.prediction)) {
    // Prefer the most "horoscope-like" fields first, then fall back to
    // whatever else is in the object so nothing gets silently dropped.
    const preferredOrder = ["personal_life", "profession", "health", "travel", "emotions"];
    const entries = Object.entries(json.prediction);
    entries.sort(([a], [b]) => {
      const ai = preferredOrder.indexOf(a);
      const bi = preferredOrder.indexOf(b);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
    const paragraphs = entries
      .filter(([, text]) => typeof text === "string" && text.trim().length > 0)
      .map(([, text]) => text.trim());
    if (paragraphs.length > 0) return paragraphs.join(" ");
  }

  return null;
}

export const getHoroscope = createServerFn({ method: "POST" })
  .validator(inputSchema)
  .handler(async ({ data }): Promise<HoroscopePayload> => {
    const { astrologyApiAccessToken } = getServerConfig();

    if (!astrologyApiAccessToken) {
      throw new Error("ASTROLOGYAPI_ACCESS_TOKEN is not set on the server — add it to .env.");
    }

    const url = buildUrl(data.period, data.sign);
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "x-astrologyapi-key": astrologyApiAccessToken,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      // eslint-disable-next-line no-console
      console.error(`[AstrologyAPI] ${url} failed (${res.status}):`, body.slice(0, 500));
      throw new Error(`Horoscope upstream error (${res.status})`);
    }

    const json = (await res.json()) as AstrologyApiResponse;
    const horoscope = extractHoroscopeText(json);

    if (!horoscope) {
      throw new Error("Horoscope response was empty");
    }

    return {
      date: new Date().toISOString().slice(0, 10),
      period: data.period,
      sign: data.sign,
      horoscope,
    };
  });

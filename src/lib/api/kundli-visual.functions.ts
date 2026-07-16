// src/lib/api/kundli-visual.functions.ts
//
// Two more Prokerala proxies, both aimed at the same gap: the Kundli
// Generator currently only shows *interpretations* (nakshatra, dosha,
// yoga, dasha) with nothing a user can visually verify against — no
// ascendant, no planet-by-planet placement, no chart.
//
//  - getPlanetPositions -> /v2/astrology/planet-position: a flat table of
//    every planet's rasi (sign), house, degree, and retrograde status.
//  - getKundliChartSvg  -> /v2/astrology/chart: Prokerala's own rendered
//    Rasi (D1) chart, returned as ready-to-embed SVG markup. We don't
//    attempt to lay out a North/South Indian chart ourselves — Prokerala
//    already does this correctly, so we just proxy it (auth can't be done
//    from the browser) and inline the SVG string it returns.
//
// Both share the OAuth2 token cache and datetime formatting already set
// up in prokerala.server.ts.
//
// FIELD SHAPE — planet-position: confirmed against prokerala/astrology-
// api-demo's planet-position.php (the official demo, which reads the SDK
// result via getId()/getName()/getLongitude()/isRetrograde()/getPosition()/
// getDegree()/getRasi()). The raw v2 JSON keys follow the same snake_case
// convention as every other v2 endpoint in this codebase (nakshatra_
// details, mangal_dosha, etc.), so pick() below tries the expected
// snake_case names first with camelCase as a defensive fallback.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  getProkeralaToken,
  extractProkeralaError,
  toProkeralaDateTime,
} from "@/lib/api/prokerala.server";

const PLANET_POSITION_URL = "https://api.prokerala.com/v2/astrology/planet-position";
const CHART_SVG_URL = "https://api.prokerala.com/v2/astrology/chart";

// Prokerala's free/basic tier caps requests at 5/60s per account. The
// Kundli Generator makes 3 calls per submission (kundli/advanced, planet-
// position, chart) plus another whenever the chart style is toggled — easy
// to trip, especially with quick back-to-back testing. One retry, honoring
// Retry-After when present, turns a transient 429 into a ~2s wait instead
// of an outright failure. This does NOT fix the underlying account-level
// rate limit — if 429s persist in normal use, the fix is upgrading the
// Prokerala plan, not more retries.
async function fetchWithRetry(url: string, token: string): Promise<Response> {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (res.status !== 429) return res;

  const retryAfterHeader = Number(res.headers.get("retry-after"));
  const waitMs = (Number.isFinite(retryAfterHeader) && retryAfterHeader > 0 ? retryAfterHeader : 2) * 1000;
  await new Promise((resolve) => setTimeout(resolve, waitMs));

  return fetch(url, { headers: { Authorization: `Bearer ${token}` } });
}

const birthInputSchema = z.object({
  date: z.string().min(1),
  time: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
  utcOffsetHours: z.number(),
});

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

function asNumber(v: unknown): number | undefined {
  if (typeof v === "number") return v;
  if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) return Number(v);
  return undefined;
}

function asBoolean(v: unknown): boolean {
  return v === true || v === "true" || v === 1 || v === "1";
}

export interface PlanetPositionItem {
  name: string;
  rasi?: string;
  rasiLord?: string;
  house?: number;
  degree?: number;
  isRetrograde: boolean;
}

export const getPlanetPositions = createServerFn({ method: "POST" })
  .validator(birthInputSchema)
  .handler(async ({ data }): Promise<PlanetPositionItem[]> => {
    const token = await getProkeralaToken();

    const params = new URLSearchParams({
      ayanamsa: "1",
      la: "en",
      coordinates: `${data.latitude},${data.longitude}`,
      datetime: toProkeralaDateTime(data.date, data.time, data.utcOffsetHours),
    });

    const res = await fetchWithRetry(`${PLANET_POSITION_URL}?${params.toString()}`, token);

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[Prokerala] planet-position failed (${res.status}):`, body.slice(0, 500));
      throw new Error(
        `Planet positions upstream error (${res.status}): ${extractProkeralaError(body)}`,
      );
    }

    const rawJson = (await res.json()) as { data?: Record<string, unknown> };
    const d = rawJson.data;
    if (!d) throw new Error("Planet positions response was empty or in an unexpected shape.");

    const rawList = pick(d, "planet_position", "planetPosition");
    if (!Array.isArray(rawList)) return [];

    return rawList
      .map((item): PlanetPositionItem | null => {
        if (typeof item !== "object" || item === null) return null;
        const obj = item as Record<string, unknown>;
        const name = asString(pick(obj, "name"));
        if (!name) return null;

        const rasiRaw = pick(obj, "rasi");
        const rasiObj =
          typeof rasiRaw === "object" && rasiRaw !== null
            ? (rasiRaw as Record<string, unknown>)
            : undefined;
        const rasiLordRaw = pick(rasiObj, "lord");
        const rasiLordObj =
          typeof rasiLordRaw === "object" && rasiLordRaw !== null
            ? (rasiLordRaw as Record<string, unknown>)
            : undefined;

        return {
          name,
          rasi: asString(pick(rasiObj, "name")),
          rasiLord: asString(pick(rasiLordObj, "vedic_name", "vedicName", "name")),
          house: asNumber(pick(obj, "position", "house")),
          degree: asNumber(pick(obj, "degree", "longitude")),
          isRetrograde: asBoolean(pick(obj, "is_retrograde", "isRetrograde")),
        };
      })
      .filter((x): x is PlanetPositionItem => x !== null);
  });

const chartInputSchema = birthInputSchema.extend({
  chartType: z.enum(["rasi", "navamsa"]).default("rasi"),
  chartStyle: z.enum(["north-indian", "south-indian"]).default("north-indian"),
});

export const getKundliChartSvg = createServerFn({ method: "POST" })
  .validator(chartInputSchema)
  .handler(async ({ data }): Promise<string> => {
    const token = await getProkeralaToken();

    const params = new URLSearchParams({
      ayanamsa: "1",
      la: "en",
      coordinates: `${data.latitude},${data.longitude}`,
      datetime: toProkeralaDateTime(data.date, data.time, data.utcOffsetHours),
      chart_type: data.chartType,
      chart_style: data.chartStyle,
      format: "svg",
    });

    const res = await fetchWithRetry(`${CHART_SVG_URL}?${params.toString()}`, token);

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[Prokerala] chart failed (${res.status}):`, body.slice(0, 500));
      throw new Error(`Chart upstream error (${res.status}): ${extractProkeralaError(body)}`);
    }

    const svg = await res.text();
    if (!svg.includes("<svg")) {
      // Some accounts/plans may return JSON-wrapped SVG instead of a raw
      // image response — try to unwrap { data: { chart: "<svg ...>" } }
      // style payloads before giving up.
      try {
        const asJson = JSON.parse(svg) as { data?: Record<string, unknown> };
        const inner = pick(asJson.data, "chart", "svg", "image");
        if (typeof inner === "string" && inner.includes("<svg")) return inner;
      } catch {
        // not JSON either — fall through to the error below
      }
      throw new Error("Chart response didn't contain an SVG image.");
    }
    return svg;
  });
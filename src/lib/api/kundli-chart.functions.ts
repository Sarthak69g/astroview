// src/lib/api/kundli-chart.functions.ts
//
// Server-side proxy for Prokerala's Kundli/Advanced API — a full single-
// person birth chart (ascendant, nakshatra, planet positions, yogas,
// doshas, Vimshottari Dasha). Counterpart to kundli.functions.ts's
// two-person Ashtakoot matching, reusing the same OAuth2 token flow from
// prokerala.server.ts.
//
// Prokerala's raw `data` object is genuinely huge — the Vimshottari Dasha
// tree alone is Mahadasha > Antardasha > Pratyantardasha, i.e. roughly
// 9 x 9 x 9 = 729 rows covering a full 120-year cycle. We parse it into a
// tight, purpose-built shape here instead of passing it straight to the
// client:
//   - nakshatra/rasi/zodiac + "additional info" -> flat snapshot fields
//   - yoga_details -> filtered down to only the yogas that are actually
//     present (has_yoga: true); the ~30 "does not have this yoga" entries
//     Prokerala includes are dropped server-side, never sent to the client
//   - dasha_periods -> kept two levels deep (Mahadasha + Antardasha only).
//     Pratyantardasha is dropped entirely — it's the bulk of the payload
//     and not something a result page needs to render row-by-row.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  getProkeralaToken,
  extractProkeralaError,
  toProkeralaDateTime,
} from "@/lib/api/prokerala.server";

const CHART_URL = "https://api.prokerala.com/v2/astrology/kundli/advanced";

const inputSchema = z.object({
  name: z.string().min(1),
  date: z.string().min(1), // YYYY-MM-DD
  time: z.string().min(1), // HH:mm
  latitude: z.number(),
  longitude: z.number(),
  utcOffsetHours: z.number(),
});

export interface PlanetRef {
  name: string;
  vedicName?: string;
}

export interface NakshatraSnapshot {
  nakshatraName?: string;
  nakshatraLord?: PlanetRef;
  pada?: number;
  chandraRasi?: string;
  chandraRasiLord?: PlanetRef;
  sooryaRasi?: string;
  sooryaRasiLord?: PlanetRef;
  zodiac?: string;
  deity?: string;
  ganam?: string;
  symbol?: string;
  animalSign?: string;
  nadi?: string;
  color?: string;
  bestDirection?: string;
  syllables?: string;
  birthStone?: string;
}

export interface MangalDosha {
  hasDosha: boolean;
  description?: string;
  hasException?: boolean;
  exceptions?: string;
  remedies?: string;
}

export interface YogaItem {
  name: string;
  description?: string;
}

export interface YogaGroup {
  name: string;
  summary?: string;
  yogas: YogaItem[];
}

export interface DashaAntar {
  name: string;
  start: string;
  end: string;
}

export interface DashaMaha {
  name: string;
  start: string;
  end: string;
  antardasha: DashaAntar[];
}

export interface DashaBalance {
  lord?: string;
  description?: string;
}

export interface KundliChartPayload {
  nakshatra: NakshatraSnapshot;
  mangalDosha: MangalDosha | null;
  yogaGroups: YogaGroup[];
  dashaPeriods: DashaMaha[];
  dashaBalance: DashaBalance | null;
}

// ---- raw Prokerala shape (loosely typed — we only read what we use) ----

interface RawPlanetRef {
  name?: string;
  vedic_name?: string;
}
interface RawSignRef {
  name?: string;
  lord?: RawPlanetRef;
}
interface RawNakshatraDetails {
  nakshatra?: { name?: string; lord?: RawPlanetRef; pada?: number };
  chandra_rasi?: RawSignRef;
  soorya_rasi?: RawSignRef;
  zodiac?: { name?: string };
  additional_info?: {
    deity?: string;
    ganam?: string;
    symbol?: string;
    animal_sign?: string;
    nadi?: string;
    color?: string;
    best_direction?: string;
    syllables?: string;
    birth_stone?: string;
  };
}
interface RawMangalDosha {
  has_dosha?: boolean;
  description?: string;
  has_exception?: boolean;
  exceptions?: string;
  remedies?: string;
}
interface RawYogaItem {
  name?: string;
  has_yoga?: boolean;
  description?: string;
}
interface RawYogaGroup {
  name?: string;
  description?: string;
  yoga_list?: RawYogaItem[];
}
interface RawDashaPratyantar {
  name?: string;
}
interface RawDashaAntar {
  name?: string;
  start?: string;
  end?: string;
  pratyantardasha?: RawDashaPratyantar[];
}
interface RawDashaMaha {
  name?: string;
  start?: string;
  end?: string;
  antardasha?: RawDashaAntar[];
}
interface RawDashaBalance {
  lord?: RawPlanetRef;
  description?: string;
}
interface RawKundliData {
  nakshatra_details?: RawNakshatraDetails;
  mangal_dosha?: RawMangalDosha;
  yoga_details?: RawYogaGroup[];
  dasha_periods?: RawDashaMaha[];
  dasha_balance?: RawDashaBalance;
}

function toPlanetRef(p?: RawPlanetRef): PlanetRef | undefined {
  if (!p?.name) return undefined;
  return { name: p.name, vedicName: p.vedic_name };
}

function parseNakshatra(raw?: RawNakshatraDetails): NakshatraSnapshot {
  if (!raw) return {};
  return {
    nakshatraName: raw.nakshatra?.name,
    nakshatraLord: toPlanetRef(raw.nakshatra?.lord),
    pada: raw.nakshatra?.pada,
    chandraRasi: raw.chandra_rasi?.name,
    chandraRasiLord: toPlanetRef(raw.chandra_rasi?.lord),
    sooryaRasi: raw.soorya_rasi?.name,
    sooryaRasiLord: toPlanetRef(raw.soorya_rasi?.lord),
    zodiac: raw.zodiac?.name,
    deity: raw.additional_info?.deity,
    ganam: raw.additional_info?.ganam,
    symbol: raw.additional_info?.symbol,
    animalSign: raw.additional_info?.animal_sign,
    nadi: raw.additional_info?.nadi,
    color: raw.additional_info?.color,
    bestDirection: raw.additional_info?.best_direction,
    syllables: raw.additional_info?.syllables,
    birthStone: raw.additional_info?.birth_stone,
  };
}

function parseMangalDosha(raw?: RawMangalDosha): MangalDosha | null {
  if (!raw || typeof raw.has_dosha !== "boolean") return null;
  return {
    hasDosha: raw.has_dosha,
    description: raw.description,
    hasException: raw.has_exception,
    exceptions: raw.exceptions,
    remedies: raw.remedies,
  };
}

// Only keep yogas the chart actually has — Prokerala includes every yoga
// it checked for, has_yoga: true or false, and most charts have far more
// "false" than "true". Dropping the false ones here (not in the UI) is
// what actually shrinks the payload.
function parseYogaGroups(raw?: RawYogaGroup[]): YogaGroup[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((group) => ({
      name: group.name ?? "Yogas",
      summary: group.description,
      yogas: (group.yoga_list ?? [])
        .filter((y) => y.has_yoga && y.name)
        .map((y) => ({ name: y.name as string, description: y.description })),
    }))
    .filter((group) => group.yogas.length > 0);
}

// Two levels deep only (Mahadasha + Antardasha) — Pratyantardasha is
// dropped entirely, see file header.
function parseDashaPeriods(raw?: RawDashaMaha[]): DashaMaha[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((m) => m.name && m.start && m.end)
    .map((m) => ({
      name: m.name as string,
      start: m.start as string,
      end: m.end as string,
      antardasha: (m.antardasha ?? [])
        .filter((a) => a.name && a.start && a.end)
        .map((a) => ({ name: a.name as string, start: a.start as string, end: a.end as string })),
    }));
}

function parseDashaBalance(raw?: RawDashaBalance): DashaBalance | null {
  if (!raw) return null;
  return { lord: raw.lord?.name, description: raw.description };
}

export const getKundliChart = createServerFn({ method: "POST" })
  .validator(inputSchema)
  .handler(async ({ data }): Promise<KundliChartPayload> => {
    const token = await getProkeralaToken();

    const params = new URLSearchParams({
      ayanamsa: "1",
      la: "en",
      coordinates: `${data.latitude},${data.longitude}`,
      datetime: toProkeralaDateTime(data.date, data.time, data.utcOffsetHours),
    });

    const res = await fetch(`${CHART_URL}?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[Prokerala] kundli/advanced failed (${res.status}):`, body.slice(0, 500));
      throw new Error(
        `Kundli generator upstream error (${res.status}): ${extractProkeralaError(body)}`,
      );
    }

    const rawJson = (await res.json()) as { data?: RawKundliData };

    if (!rawJson.data) {
      throw new Error("Kundli generator response was empty or in an unexpected shape.");
    }

    const raw = rawJson.data;

    return {
      nakshatra: parseNakshatra(raw.nakshatra_details),
      mangalDosha: parseMangalDosha(raw.mangal_dosha),
      yogaGroups: parseYogaGroups(raw.yoga_details),
      dashaPeriods: parseDashaPeriods(raw.dasha_periods),
      dashaBalance: parseDashaBalance(raw.dasha_balance),
    };
  });

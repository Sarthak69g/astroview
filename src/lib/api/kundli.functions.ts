// src/lib/api/kundli.functions.ts
// Server-side proxy for Prokerala's Kundli Matching (Ashtakoot Guna Milan)
// API. Same reasoning as horoscope.functions.ts / auth.functions.ts — the
// call runs server-side so the OAuth2 client secret never reaches the
// browser, and to sidestep CORS.
//
// AUTH: Prokerala uses OAuth2 client-credentials — POST clientId + secret
// to /token, get back a short-lived bearer access_token, use it on every
// API call via `Authorization: Bearer <token>`. The token is cached in
// module scope with its expiry so we don't re-auth on every request — but
// per config.server.ts's warning, module scope only survives for the life
// of a single Worker instance; a cold start re-fetches, which is fine.
//
// SETUP: add PROKERALA_CLIENT_ID and PROKERALA_CLIENT_SECRET to .env
// (no VITE_ prefix — these must never reach the client bundle). Get them
// from the Prokerala dashboard > API Access > Client Credentials.
//
// PER-KOOTA BREAKDOWN — TWO DATA SOURCES:
// Prokerala's advanced per-koota score breakdown (data.guna_milan.guna,
// with obtained_points per koota) is gated behind a paid plan/credit
// tier — on our current account it comes back completely absent, even
// with result_type=advanced.
//
// What IS free on every tier: girl_info.nakshatra / girl_info.rasi and
// boy_info.nakshatra / boy_info.rasi — each partner's birth star and
// moon sign, already correctly computed by Prokerala. That's genuinely
// all the classical Ashtakoot algorithm needs, so when the paid
// breakdown isn't available we compute all 8 kootas ourselves from this
// data (src/lib/astro/ashtakoot.ts) instead of showing an empty result.
// If/when the account is upgraded, Prokerala's own guna[] array is
// preferred automatically — see the branch below.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  getProkeralaToken,
  extractProkeralaError,
  toProkeralaDateTime,
} from "@/lib/api/prokerala.server";
import { computeAshtakoot, ashtakootTotal, type ComputedKoota } from "@/lib/astro/ashtakoot";
import { findNakshatra, findRashi } from "@/data/ashtakootData";
import { buildMatchNarrative, type NarrativeReport } from "@/lib/astro/matchNarrative";

const MATCH_URL = "https://api.prokerala.com/v2/astrology/kundli-matching";

const personSchema = z.object({
  name: z.string().min(1),
  date: z.string().min(1), // YYYY-MM-DD
  time: z.string().min(1), // HH:mm
  latitude: z.number(),
  longitude: z.number(),
  utcOffsetHours: z.number(),
});

const inputSchema = z.object({
  boy: personSchema,
  girl: personSchema,
});

export interface GunaMilanKoota {
  name: string;
  boy_koot?: string;
  girl_koot?: string;
  received_koot_points?: number;
  max_koot_points?: number;
  description?: string;
  matches?: boolean;
}

export interface MangalDoshaInfo {
  hasDosha: boolean;
  hasException: boolean;
  doshaType?: string;
  description?: string;
}

export interface KundliMatchPayload {
  totalPoints: number;
  maxPoints: number;
  conclusion?: string;
  kootas: GunaMilanKoota[];
  boyMangalDosha?: MangalDoshaInfo;
  girlMangalDosha?: MangalDoshaInfo;
  /** "vendor" = Prokerala's own paid per-koota breakdown, "computed" = we
   * derived it ourselves from nakshatra/rasi (see file header), "none" =
   * neither was available (rare — only if nakshatra/rasi lookup failed). */
  breakdownSource: "vendor" | "computed" | "none";
  narrative: NarrativeReport | null;
}

interface RawPersonInfo {
  koot?: Record<string, unknown>;
  nakshatra?: { name?: string };
  rasi?: { name?: string };
}

export const getKundliMatch = createServerFn({ method: "POST" })
  .validator(inputSchema)
  .handler(async ({ data }): Promise<KundliMatchPayload> => {
    const token = await getProkeralaToken();

    const params = new URLSearchParams({
      ayanamsa: "1",
      // Requesting "advanced" costs nothing extra to ask for — if the
      // account's plan doesn't include it, Prokerala just omits the guna
      // array and we fall back to computing it ourselves below.
      result_type: "advanced",
      la: "en",
      boy_dob: toProkeralaDateTime(data.boy.date, data.boy.time, data.boy.utcOffsetHours),
      boy_coordinates: `${data.boy.latitude},${data.boy.longitude}`,
      girl_dob: toProkeralaDateTime(data.girl.date, data.girl.time, data.girl.utcOffsetHours),
      girl_coordinates: `${data.girl.latitude},${data.girl.longitude}`,
    });

    const res = await fetch(`${MATCH_URL}?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[Prokerala] kundli-matching failed (${res.status}):`, body.slice(0, 500));
      throw new Error(
        `Kundli matching upstream error (${res.status}): ${extractProkeralaError(body)}`,
      );
    }

    const rawJson = (await res.json()) as {
      data?: {
        message?: { type?: string; description?: string };
        guna_milan?: {
          total_points?: number;
          maximum_points?: number;
          guna?: Array<Record<string, unknown>>;
        };
        girl_info?: RawPersonInfo;
        boy_info?: RawPersonInfo;
        girl_mangal_dosha_details?: Record<string, unknown>;
        boy_mangal_dosha_details?: Record<string, unknown>;
      };
    };

    const gunaMilan = rawJson.data?.guna_milan;
    if (!gunaMilan) {
      throw new Error("Kundli matching response was empty or in an unexpected shape.");
    }

    const totalPoints = gunaMilan.total_points ?? 0;
    const maxPoints = gunaMilan.maximum_points ?? 36;

    const rawGuna = gunaMilan.guna;
    let kootas: GunaMilanKoota[];
    let breakdownSource: KundliMatchPayload["breakdownSource"];
    let computedKootas: ComputedKoota[] | null = null;

    if (Array.isArray(rawGuna) && rawGuna.length > 0) {
      // Paid/advanced tier: use Prokerala's own per-koota breakdown as-is.
      breakdownSource = "vendor";
      kootas = rawGuna.map((k) => ({
        name: String(k.name ?? k.koot_name ?? "Unknown"),
        boy_koot: typeof k.boy_koot === "string" ? k.boy_koot : undefined,
        girl_koot: typeof k.girl_koot === "string" ? k.girl_koot : undefined,
        received_koot_points: asNumberOrUndefined(k.obtained_points ?? k.received_koot_points),
        max_koot_points: asNumberOrUndefined(k.maximum_points ?? k.max_koot_points),
        description: typeof k.description === "string" ? k.description : undefined,
      }));
    } else {
      // Free tier: compute the breakdown ourselves from nakshatra + rasi.
      const boyNakshatra = findNakshatra(rawJson.data?.boy_info?.nakshatra?.name);
      const boyRashi = findRashi(rawJson.data?.boy_info?.rasi?.name);
      const girlNakshatra = findNakshatra(rawJson.data?.girl_info?.nakshatra?.name);
      const girlRashi = findRashi(rawJson.data?.girl_info?.rasi?.name);

      if (boyNakshatra && boyRashi && girlNakshatra && girlRashi) {
        computedKootas = computeAshtakoot(
          { nakshatra: boyNakshatra, rashi: boyRashi },
          { nakshatra: girlNakshatra, rashi: girlRashi },
        );
        breakdownSource = "computed";
        kootas = computedKootas.map((k) => ({
          name: k.name,
          boy_koot: k.boyValue,
          girl_koot: k.girlValue,
          received_koot_points: k.receivedPoints,
          max_koot_points: k.maxPoints,
          description: k.explanation,
          matches: k.matches,
        }));

        // Diagnostic only — never surfaced to the end user. Prokerala's
        // total_points is free on every tier and known-correct, so if our
        // computed sum disagrees it's worth a look before the next
        // senior review, not an emergency.
        const computedTotal = ashtakootTotal(computedKootas);
        if (Math.abs(computedTotal - totalPoints) > 0.5) {
          console.warn(
            `[Ashtakoot] Computed total (${computedTotal}) differs from Prokerala's total_points (${totalPoints}) for this pair — worth a manual spot-check.`,
          );
        }
      } else {
        // Couldn't resolve nakshatra/rasi names against our reference
        // tables (unexpected spelling from Prokerala) — fail soft with
        // total score only, same as before.
        breakdownSource = "none";
        kootas = [];
      }
    }

    const narrative =
      computedKootas && computedKootas.length > 0
        ? buildMatchNarrative({
            boyName: data.boy.name,
            girlName: data.girl.name,
            totalPoints,
            maxPoints,
            kootas: computedKootas,
            boyMangalDosha: parseMangalDosha(rawJson.data?.boy_mangal_dosha_details),
            girlMangalDosha: parseMangalDosha(rawJson.data?.girl_mangal_dosha_details),
          })
        : null;

    return {
      totalPoints,
      maxPoints,
      conclusion: asStringOrUndefined(rawJson.data?.message?.description),
      kootas,
      boyMangalDosha: parseMangalDosha(rawJson.data?.boy_mangal_dosha_details),
      girlMangalDosha: parseMangalDosha(rawJson.data?.girl_mangal_dosha_details),
      breakdownSource,
      narrative,
    };
  });

function asNumberOrUndefined(val: unknown): number | undefined {
  return typeof val === "number" ? val : undefined;
}

function asStringOrUndefined(val: unknown): string | undefined {
  return typeof val === "string" ? val : undefined;
}

function parseMangalDosha(raw: Record<string, unknown> | undefined): MangalDoshaInfo | undefined {
  if (!raw) return undefined;
  return {
    hasDosha: Boolean(raw.has_dosha),
    hasException: Boolean(raw.has_exception),
    doshaType: typeof raw.dosha_type === "string" ? raw.dosha_type : undefined,
    description: typeof raw.description === "string" ? raw.description : undefined,
  };
}

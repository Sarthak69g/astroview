// src/lib/horoscope-extras.ts
//
// ⚠️ PLACEHOLDER DATA — NOT REAL ASTROLOGY.
// This file exists to let the richer horoscope UI (dimension badges, luck
// strip, "what to avoid" note) be built and approved before a real data
// source (DivineAPI or similar) is wired up — per the Phase B discussion in
// the July 2 session handoff. Everything below is cosmetic scaffolding.
//
// When a real API key exists, replace `getHoroscopeExtras()` with a fetch
// (likely another createServerFn proxy, same pattern as horoscope.functions.ts
// if the provider doesn't send CORS headers). Keep the `HoroscopeExtras`
// shape stable so DailyHoroscope.tsx doesn't need to change.

import type { HoroscopePeriod } from "@/lib/horoscope-api";

export interface DimensionRating {
  label: string;
  rating: number; // 1–5
  blurb: string;
}

export interface HoroscopeExtras {
  dimensions: {
    career: DimensionRating;
    health: DimensionRating;
    emotions: DimensionRating;
    travel: DimensionRating;
  };
  luck: {
    number: number;
    color: string;
    colorHex: string;
    alphabet: string;
    cosmicTip: string;
  };
  avoid: string;
}

// Small deterministic hash so the same sign+period+day always renders the
// same placeholder values (no layout-shifting randomness on every reload),
// while still varying across signs so the preview doesn't look like one
// hardcoded stub repeated 12 times.
function hash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function bucketFor(period: HoroscopePeriod): string {
  const now = new Date();
  if (period === "daily") return now.toISOString().slice(0, 10);
  if (period === "weekly") {
    const d = new Date(now);
    const day = (now.getDay() + 6) % 7;
    d.setDate(now.getDate() - day);
    return `week-${d.toISOString().slice(0, 10)}`;
  }
  return now.toISOString().slice(0, 7);
}

const CAREER_BLURBS = [
  "A steady day for focused work — avoid taking on new commitments impulsively.",
  "Recognition may come for effort already put in. Stay visible, not loud.",
  "Good window for negotiation or asking for what you're due.",
  "Collaboration flows more easily than solo push today.",
  "Patience with slow-moving decisions pays off more than forcing them.",
];

const HEALTH_BLURBS = [
  "Energy runs a little low mid-day — pace yourself rather than pushing through.",
  "Good vitality overall; a short walk will do more than you'd expect.",
  "Mind the sleep schedule this period — it's the lever that matters most.",
  "Digestion and diet deserve a bit more attention than usual.",
  "Physical energy is strong; channel it into movement, not restlessness.",
];

const EMOTION_BLURBS = [
  "A reflective mood — good for journaling, not ideal for big confrontations.",
  "Warmth in close relationships comes easily; let people in a little more.",
  "Some restlessness under the surface. Naming it helps more than ignoring it.",
  "A settled, grounded emotional tone — a good period for honest conversations.",
  "Old feelings may resurface briefly. They're passing through, not staying.",
];

const TRAVEL_BLURBS = [
  "Local movement favoured over long journeys right now.",
  "A good period to plan travel, even if the trip itself is further out.",
  "Minor delays possible — build a little slack into any itinerary.",
  "Favourable for travel connected to work or family.",
  "Short, spontaneous trips carry better energy than rigid plans.",
];

const COLORS: { name: string; hex: string }[] = [
  { name: "Saffron", hex: "#E8985E" },
  { name: "Deep Blue", hex: "#3B5A8A" },
  { name: "Emerald", hex: "#2F9E6E" },
  { name: "Ivory", hex: "#F3EEE3" },
  { name: "Maroon", hex: "#7A2E3B" },
  { name: "Gold", hex: "#C9A038" },
  { name: "Lavender", hex: "#9C8FC2" },
];

const COSMIC_TIPS = [
  "A small act of patience today outweighs a big display of effort.",
  "Say the honest thing gently — both parts matter.",
  "Rest is productive too, especially now.",
  "Finish one thing before starting the next.",
  "Trust the timing, even where you can't see the whole shape yet.",
];

const AVOID_NOTES = [
  "Avoid signing anything final or making big commitments in haste.",
  "Avoid overcommitting your evening — leave room to recover.",
  "Avoid rehashing old arguments; the timing favours moving forward, not backward.",
  "Avoid skipping meals or rest in the name of getting more done.",
  "Avoid lending money or making financial promises today.",
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function getHoroscopeExtras(sign: string, period: HoroscopePeriod): HoroscopeExtras {
  const seed = `${sign}-${period}-${bucketFor(period)}`;
  const h = hash(seed);

  const pick = <T,>(arr: T[], salt: number) => arr[(h + salt) % arr.length];

  return {
    dimensions: {
      career: { label: "Career", rating: 2 + ((h + 1) % 4), blurb: pick(CAREER_BLURBS, 1) },
      health: { label: "Health", rating: 2 + ((h + 2) % 4), blurb: pick(HEALTH_BLURBS, 2) },
      emotions: { label: "Emotions", rating: 2 + ((h + 3) % 4), blurb: pick(EMOTION_BLURBS, 3) },
      travel: { label: "Travel", rating: 2 + ((h + 4) % 4), blurb: pick(TRAVEL_BLURBS, 4) },
    },
    luck: {
      number: 1 + ((h + 5) % 9),
      color: pick(COLORS, 6).name,
      colorHex: pick(COLORS, 6).hex,
      alphabet: ALPHABET[(h + 7) % ALPHABET.length],
      cosmicTip: pick(COSMIC_TIPS, 8),
    },
    avoid: pick(AVOID_NOTES, 9),
  };
}
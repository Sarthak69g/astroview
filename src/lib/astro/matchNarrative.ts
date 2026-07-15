// src/lib/astro/matchNarrative.ts
//
// Turns a computed (or vendor) koota breakdown into a full, multi-
// paragraph written compatibility report — not just score cards. Used by
// both the Kundli Matching result page and the downloadable PDF, so the
// two stay in sync automatically.

import type { ComputedKoota } from "@/lib/astro/ashtakoot";
import type { MangalDoshaInfo } from "@/lib/api/kundli.functions";

export interface NarrativeReport {
  opening: string;
  strengths: string;
  concerns: string;
  mangalDosha: string | null;
  closing: string;
}

interface NarrativeInput {
  boyName: string;
  girlName: string;
  totalPoints: number;
  maxPoints: number;
  kootas: ComputedKoota[];
  boyMangalDosha?: MangalDoshaInfo;
  girlMangalDosha?: MangalDoshaInfo;
}

function verdictPhrase(total: number): { label: string; tone: "good" | "ok" | "caution" } {
  if (total >= 32) return { label: "an excellent match", tone: "good" };
  if (total >= 24) return { label: "a very good match", tone: "good" };
  if (total >= 18) return { label: "an acceptable match", tone: "ok" };
  return { label: "below the traditional threshold considered ideal", tone: "caution" };
}

export function buildMatchNarrative(input: NarrativeInput): NarrativeReport {
  const { boyName, girlName, totalPoints, maxPoints, kootas } = input;
  const verdict = verdictPhrase(totalPoints);
  const strong = kootas.filter((k) => k.matches);
  const weak = kootas.filter((k) => !k.matches);
  const nadi = kootas.find((k) => k.key === "nadi");
  const bhakoot = kootas.find((k) => k.key === "bhakoot");

  const opening =
    `${boyName || "The boy"} and ${girlName || "the girl"} score ${totalPoints} out of ${maxPoints} Gunas ` +
    `in the Ashtakoot Guna Milan system, which classically makes this ${verdict.label}. ` +
    `This score comes from comparing eight areas of compatibility — spiritual outlook, mutual attraction, ` +
    `health and destiny, physical compatibility, mental connection, temperament, family harmony, and genetic ` +
    `compatibility — each drawn from both partners' birth nakshatra and moon sign.`;

  const strengths =
    strong.length > 0
      ? `The strongest areas of alignment are ${listNames(strong)}. ` +
        strong
          .slice(0, 4)
          .map((k) => k.explanation)
          .join(" ")
      : `No koota came back as a clean, full-marks match here — that doesn't rule out a good marriage on its own, but it does mean it's worth reading the "needs attention" areas below with a professional astrologer rather than the total score alone.`;

  const concerns =
    weak.length > 0
      ? `The areas worth discussing further are ${listNames(weak)}. ` +
        weak
          .slice(0, 4)
          .map((k) => k.explanation)
          .join(" ")
      : `Every koota came back favorable in this comparison — an unusually clean result across the board.`;

  let mangalDosha: string | null = null;
  const boyFlagged = input.boyMangalDosha?.hasDosha && !input.boyMangalDosha.hasException;
  const girlFlagged = input.girlMangalDosha?.hasDosha && !input.girlMangalDosha.hasException;
  if (input.boyMangalDosha || input.girlMangalDosha) {
    if (boyFlagged && girlFlagged) {
      mangalDosha = `Both ${boyName || "the boy"} and ${girlName || "the girl"} show Mangal Dosha in this chart comparison. Classically, when both partners are Manglik the effect is considered to balance out, so this is generally treated as less of a concern than one-sided Mangal Dosha — though it's still worth a professional astrologer's read on the specific placements.`;
    } else if (boyFlagged || girlFlagged) {
      const who = boyFlagged ? boyName || "the boy" : girlName || "the girl";
      mangalDosha = `${who} shows Mangal Dosha in this chart while the other partner does not — traditionally the combination considered most worth discussing with an astrologer, since an uneven Mangal Dosha (rather than both or neither) is the classical concern, not the dosha itself.`;
    } else {
      mangalDosha = `Neither partner shows an active Mangal Dosha in this comparison, which removes one common source of astrological concern from the picture entirely.`;
    }
  }

  const closing =
    nadi?.matches === false
      ? `Given the Nadi Dosha flagged above, the overall score should be read alongside a professional astrologer's opinion rather than as a final verdict on its own — Nadi is traditionally the single most heavily weighted koota, and a zero here is worth a closer look regardless of how the total lands.`
      : bhakoot?.matches === false
        ? `With Bhakoot flagged above, it's worth discussing family and financial harmony specifically with an astrologer, even though the overall total may still look reasonable.`
        : totalPoints >= 24
          ? `Overall, this comparison points to a genuinely compatible pairing across most of the classical measures — a good foundation to move forward on, alongside the usual practical conversations every couple should have.`
          : `Overall, this comparison shows a mixed picture — not a reason to rule the match out, but a good basis for a more detailed conversation with a professional astrologer before drawing firm conclusions.`;

  return { opening, strengths, concerns, mangalDosha, closing };
}

function listNames(kootas: ComputedKoota[]): string {
  const names = kootas.map((k) => k.name);
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

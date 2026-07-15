// src/data/gunaKootaData.ts
//
// Reference content for the 8 standard Ashtakoot Guna Milan kootas. This is
// classical, fixed Vedic astrology knowledge (not proprietary to any
// vendor) — the names, max points, and what each koota measures never
// change, regardless of which API we're calling. We use this to explain
// every koota card in the Kundli Matching result, and match it against
// whatever koota name Prokerala's response returns (their `description`
// field is often sparse or absent depending on result_type/plan).
//
// Max points across all 8 kootas sum to 36, the traditional total.

export interface GunaKootaInfo {
  key: string;
  name: string;
  maxPoints: number;
  meaning: string;
  description: string;
}

export const GUNA_KOOTA_INFO: GunaKootaInfo[] = [
  {
    key: "varna",
    name: "Varna",
    maxPoints: 1,
    meaning: "Spiritual compatibility & ego alignment",
    description:
      "Based on each partner's Moon sign, Varna reflects spiritual growth and ego compatibility — whether one partner's nature naturally supports the other's, without friction over pride or dominance.",
  },
  {
    key: "vashya",
    name: "Vashya",
    maxPoints: 2,
    meaning: "Mutual attraction & control",
    description:
      "Vashya measures the natural pull and influence partners have over one another — how easily they can understand, attract, and (in a healthy sense) sway each other in the relationship.",
  },
  {
    key: "tara",
    name: "Tara",
    maxPoints: 3,
    meaning: "Health, wellbeing & destiny",
    description:
      "Calculated from birth star (nakshatra) positions, Tara Koota indicates the general health, wellbeing, and destiny-related compatibility between partners over the course of the marriage.",
  },
  {
    key: "yoni",
    name: "Yoni",
    maxPoints: 4,
    meaning: "Sexual & physical compatibility",
    description:
      "Yoni Koota reflects physical and sexual compatibility, based on each partner's birth nakshatra and its associated animal symbol — a classical marker of intimate harmony.",
  },
  {
    key: "graha_maitri",
    name: "Graha Maitri",
    maxPoints: 5,
    meaning: "Mental compatibility & friendship",
    description:
      "Graha Maitri looks at the friendship between the ruling planets of each partner's Moon sign — a strong score points to intellectual connection, shared values, and ease of communication.",
  },
  {
    key: "gana",
    name: "Gana",
    maxPoints: 6,
    meaning: "Temperament & nature",
    description:
      "Every nakshatra belongs to one of three Ganas — Deva (divine), Manushya (human), or Rakshasa (demonic) — describing core temperament. Gana Koota checks how well the partners' underlying natures get along.",
  },
  {
    key: "bhakoot",
    name: "Bhakoot",
    maxPoints: 7,
    meaning: "Love, family growth & prosperity",
    description:
      "Bhakoot is based on the distance between partners' Moon signs and is linked to love, financial prosperity, and the wellbeing of the family the couple builds together.",
  },
  {
    key: "nadi",
    name: "Nadi",
    maxPoints: 8,
    meaning: "Health of offspring & genetic compatibility",
    description:
      "The single most heavily weighted koota. Nadi relates to health, genetic compatibility, and the wellbeing of children — traditionally considered critical, since a Nadi Dosha (zero score here) is taken seriously even when the overall total is high.",
  },
];

// Normalizes a koota name from any source ("Graha Maitri", "graha-maitri",
// "GRAHA_MAITRI KOOT", etc.) down to a matchable key, so we can pair up
// whatever string Prokerala sends back with our static reference content.
function normalizeKey(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/koot(a)?/g, "")
    .replace(/[^a-z]/g, "");
}

const LOOKUP: Record<string, GunaKootaInfo> = Object.fromEntries(
  GUNA_KOOTA_INFO.map((k) => [normalizeKey(k.key), k]),
);

export function findGunaKootaInfo(apiName: string | undefined | null): GunaKootaInfo | null {
  if (!apiName) return null;
  const key = normalizeKey(apiName);
  return LOOKUP[key] ?? null;
}

// Overall verdict copy for the total score — the traditional guidance is
// 18+/36 is considered an acceptable match, 24+ good, 32+ excellent.
export function gunaMilanVerdict(totalPoints: number): {
  label: string;
  tone: "good" | "ok" | "caution";
} {
  if (totalPoints >= 32) return { label: "Excellent match", tone: "good" };
  if (totalPoints >= 24) return { label: "Very good match", tone: "good" };
  if (totalPoints >= 18) return { label: "Acceptable match", tone: "ok" };
  return { label: "Below the traditional threshold — consult an astrologer", tone: "caution" };
}
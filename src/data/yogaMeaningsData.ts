// src/data/yogaMeaningsData.ts
//
// Plain-language explanations for common Vedic astrology yogas — classical,
// fixed knowledge (not proprietary to any API vendor), same reasoning as
// gunaKootaData.ts for the Kundli Matching kootas.
//
// WHY THIS EXISTS: Prokerala's kundli/advanced endpoint returns a
// `description` per yoga, but it's Prokerala's own auto-generated text and
// occasionally comes back garbled or self-referential (e.g. a sentence
// that repeats a planet name three times, like "Saturn ... with Saturn").
// kundli-chart.functions.ts already filters those out server-side before
// they reach the client — but even a *correct* Prokerala description is
// dense, jargon-heavy astrological reasoning ("twelfth house from the
// Moon is occupied by Mercury...") that most users can't parse. This file
// gives every common yoga a one-line "what this actually means for you"
// explanation to show front-and-center, with Prokerala's own technical
// paragraph (when it passed the coherence check) tucked into an optional
// "astrological detail" disclosure underneath.

export interface YogaMeaning {
  /** Lowercase, "yoga"-suffix-stripped key used for matching. */
  key: string;
  /** Short category tag shown as a badge, e.g. "Wealth", "Status". */
  tag: string;
  /** One or two plain-English sentences — no jargon, no house numbers. */
  meaning: string;
}

export const YOGA_MEANINGS: YogaMeaning[] = [
  {
    key: "raja",
    tag: "Status & Success",
    meaning:
      "A classic marker of authority and recognition — people with this yoga tend to rise in their field and earn respect through their own efforts.",
  },
  {
    key: "ruchaka",
    tag: "Courage & Drive",
    meaning:
      "One of the five Panch Mahapurusha yogas — associated with physical courage, leadership, and a strong, determined personality.",
  },
  {
    key: "bhadra",
    tag: "Intellect",
    meaning:
      "Another Panch Mahapurusha yoga — linked to sharp intelligence, business acumen, and clear communication.",
  },
  {
    key: "hamsa",
    tag: "Wisdom & Grace",
    meaning:
      "A Panch Mahapurusha yoga associated with wisdom, a graceful nature, and a life inclined toward knowledge or spirituality.",
  },
  {
    key: "malavya",
    tag: "Comfort & Charm",
    meaning:
      "A Panch Mahapurusha yoga linked to comfort, charisma, artistic taste, and material well-being.",
  },
  {
    key: "sasa",
    tag: "Discipline",
    meaning:
      "A Panch Mahapurusha yoga associated with discipline, authority through hard work, and leadership over people or resources.",
  },
  {
    key: "gaja kesari",
    tag: "Wisdom & Fame",
    meaning:
      "One of the most well-known yogas — associated with intelligence, a good reputation, and steady success over a lifetime.",
  },
  {
    key: "budhaditya",
    tag: "Intellect",
    meaning:
      "Formed by the Sun and Mercury together — linked to sharp analytical thinking and success in fields that reward intellect.",
  },
  {
    key: "chandra mangal",
    tag: "Ambition",
    meaning:
      "Formed by the Moon and Mars together — associated with drive, financial ambition, and a strong will to improve one's circumstances.",
  },
  {
    key: "neecha bhanga raja",
    tag: "Reversal of Fortune",
    meaning:
      "A yoga where an initially weak planetary placement gets cancelled out and turns into a source of strength — often linked to a life that improves significantly after early struggles.",
  },
  {
    key: "anapha",
    tag: "Self-Reliance",
    meaning:
      "Associated with a self-made, independent nature — steady effort and personal resourcefulness rather than relying on inherited advantage.",
  },
  {
    key: "sunapha",
    tag: "Self-Reliance",
    meaning:
      "Similar in spirit to Anapha Yoga — linked to a resourceful, self-driven nature and the ability to build things up through one's own effort.",
  },
  {
    key: "durudhura",
    tag: "Support Network",
    meaning:
      "Associated with a good support system — comfort, resources, and help from people around you when you need it.",
  },
  {
    key: "kemadruma",
    tag: "Needs Balance",
    meaning:
      "A yoga traditionally read as a challenging one for the Moon's placement — often shows up alongside periods that call for extra resilience, though classical texts note it's frequently cancelled out by other factors in the same chart.",
  },
  {
    key: "vasi",
    tag: "Discipline",
    meaning:
      "Linked to a composed, thoughtful nature — someone who tends to think before acting and carries themselves with quiet discipline.",
  },
  {
    key: "vosi",
    tag: "Discipline",
    meaning:
      "Closely related to Vasi Yoga — associated with a measured, self-controlled temperament.",
  },
  {
    key: "kaal sarp",
    tag: "Karmic Pattern",
    meaning:
      "A well-known dosha rather than a beneficial yoga — traditionally read as a karmic pattern that can bring obstacles, though its effects are considered highly dependent on the rest of the chart and are often manageable with time and effort.",
  },
  {
    key: "daridra",
    tag: "Needs Attention",
    meaning:
      "Traditionally associated with financial ups and downs or delays — not a permanent condition, and classical texts treat it as one factor among many, often softened by other strong placements elsewhere in the chart.",
  },
  {
    key: "shakat",
    tag: "Needs Balance",
    meaning:
      "Traditionally linked to fluctuating fortune — periods of gain followed by setbacks — though, like most doshas, its real-world impact depends heavily on the chart as a whole.",
  },
  {
    key: "dhana",
    tag: "Wealth",
    meaning:
      "A wealth-indicating yoga — associated with financial gain and the ability to accumulate resources over time.",
  },
  {
    key: "vipreet raja",
    tag: "Reversal of Fortune",
    meaning:
      "A 'reverse' Raja Yoga — formed from placements that are normally considered difficult, but which classical astrology says can flip into unexpected success once challenges are worked through.",
  },
];

// Per-group fallback used when a specific yoga name isn't in the table
// above — keeps the UI from ever showing nothing, while staying honest
// about how specific the explanation is.
const GROUP_FALLBACKS: Record<string, string> = {
  "major yogas": "A notable planetary combination in your chart, traditionally linked to a distinct life theme — status, opportunity, or personal strength.",
  "chandra yogas": "Formed from the Moon's placement relative to other planets — Chandra Yogas generally speak to emotional temperament and day-to-day resourcefulness.",
  "soorya yogas": "Formed from the Sun's placement relative to other planets — Soorya Yogas generally speak to confidence, leadership, and public standing.",
  "inauspicious yogas": "A pattern classical astrology flags as one to be mindful of — not a fixed outcome, and its real effect depends on the chart as a whole.",
};

function normalize(name: string): string {
  return name
    .toLowerCase()
    .replace(/\byoga\b/g, "")
    .replace(/\bdosha\b/g, "")
    .trim();
}

export function getYogaMeaning(yogaName: string, groupName?: string): YogaMeaning | undefined {
  const normalized = normalize(yogaName);
  const exact = YOGA_MEANINGS.find((y) => normalized === y.key || normalized.startsWith(y.key));
  if (exact) return exact;

  const fallbackText = groupName ? GROUP_FALLBACKS[groupName.toLowerCase()] : undefined;
  if (!fallbackText) return undefined;
  return { key: normalized, tag: "General", meaning: fallbackText };
}

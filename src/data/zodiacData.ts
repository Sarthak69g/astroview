// src/data/zodiacData.ts
// Single source of truth for all zodiac sign data across AstroView.
// All compatibility scoring is based on traditional Vedic principles:
// element harmony, sign distance (trine/sextile/square/opposition), mode, and
// Naisargika Maitri (natural planetary friendship). Total is out of 36 to mirror
// the Guna Milan scale — but this is an indicative guide, not a full Kundali calculation.

export type Element = "Fire" | "Earth" | "Air" | "Water";
export type Mode = "Cardinal" | "Fixed" | "Mutable";

export interface ZodiacSign {
  index: number;
  slug: string;
  name: string;
  vedicName: string;
  symbol: string;
  dateRange: string;
  startMonth: number;
  startDay: number;
  element: Element;
  mode: Mode;
  rulingPlanet: string;
  blurb: string;
  description: string;
  traits: string[];
  strengths: string[];
  challenges: string[];
  relatedServiceSlug: string;
  relatedServiceNote: string;
}

export interface CompatibilityResult {
  score: number;
  label: "Excellent" | "Good" | "Moderate" | "Challenging";
  color: "green" | "amber" | "neutral" | "rose";
}

// ─── The 12 signs ─────────────────────────────────────────────────────────────

export const zodiacSigns: ZodiacSign[] = [
  {
    index: 0,
    slug: "aries",
    name: "Aries",
    vedicName: "Mesha",
    symbol: "♈︎",
    dateRange: "Mar 21 – Apr 19",
    startMonth: 3,
    startDay: 21,
    element: "Fire",
    mode: "Cardinal",
    rulingPlanet: "Mars",
    blurb: "Direct and energetic, comfortable starting things others hesitate to begin.",
    description:
      "Aries is the first sign of the zodiac, ruled by Mars — the planet of energy, courage, and decisive action. As a Cardinal Fire sign, Mesha initiates, leads, and moves forward with a force that is difficult to stop. Those born under this sign carry a pioneering spirit and a directness that is both their greatest strength and their most honest quality.",
    traits: ["Pioneering", "Courageous", "Direct", "Energetic", "Competitive", "Independent"],
    strengths: [
      "Natural leadership that inspires action",
      "Courage in the face of adversity",
      "Relentless energy and drive",
      "Honest and straightforward in all dealings",
    ],
    challenges: [
      "Impatience when others move slower",
      "Impulsive decisions under pressure",
      "Difficulty sustaining long-term focus",
      "Tendency toward unnecessary conflict",
    ],
    relatedServiceSlug: "birth-chart-analysis",
    relatedServiceNote:
      "Your Mars energy shows up powerfully in your birth chart. A reading reveals where your drive is best directed — and which areas of life it could be overreaching.",
  },
  {
    index: 1,
    slug: "taurus",
    name: "Taurus",
    vedicName: "Vrishabha",
    symbol: "♉︎",
    dateRange: "Apr 20 – May 20",
    startMonth: 4,
    startDay: 20,
    element: "Earth",
    mode: "Fixed",
    rulingPlanet: "Venus",
    blurb: "Steady and grounded, with a strong pull toward comfort and lasting stability.",
    description:
      "Taurus is ruled by Venus — the planet of love, beauty, and material well-being. As a Fixed Earth sign, Vrishabha is the most patient and reliable of all signs, with a deep appreciation for quality and an unwavering sense of loyalty. Taurus builds slowly, but what it builds lasts.",
    traits: ["Patient", "Reliable", "Sensual", "Devoted", "Practical", "Determined"],
    strengths: [
      "Unwavering patience in any situation",
      "Strong financial instincts and work ethic",
      "Deep, enduring loyalty",
      "Ability to create stability from nothing",
    ],
    challenges: [
      "Resistance to necessary change",
      "Possessiveness in close relationships",
      "Stubbornness once a position is held",
      "Material attachment that complicates decisions",
    ],
    relatedServiceSlug: "love-relationship-guidance",
    relatedServiceNote:
      "Venus governs your heart, your values, and your relationships. A reading maps how you love, what you need, and where harmony is written in your chart.",
  },
  {
    index: 2,
    slug: "gemini",
    name: "Gemini",
    vedicName: "Mithuna",
    symbol: "♊︎",
    dateRange: "May 21 – Jun 20",
    startMonth: 5,
    startDay: 21,
    element: "Air",
    mode: "Mutable",
    rulingPlanet: "Mercury",
    blurb: "Curious and quick, energised by conversation and new streams of thought.",
    description:
      "Gemini is ruled by Mercury — the planet of communication, intellect, and movement. As a Mutable Air sign, Mithuna adapts to any situation with remarkable ease, absorbing ideas from every direction. Gemini is the great connector of the zodiac, bridging people, concepts, and worlds with a wit that is rarely matched.",
    traits: ["Versatile", "Curious", "Communicative", "Witty", "Adaptable", "Expressive"],
    strengths: [
      "Exceptional communication across any audience",
      "Quick thinking and mental agility",
      "Social intelligence and ease with people",
      "Ability to hold multiple perspectives at once",
    ],
    challenges: [
      "Inconsistency when attention shifts",
      "Difficulty making final decisions",
      "Tendency to scatter energy across too many things",
      "Superficiality under stress",
    ],
    relatedServiceSlug: "tarot-numerology",
    relatedServiceNote:
      "Mercury's dual nature in your Mithuna chart makes numerology and tarot particularly revealing — they reflect the patterns your restless mind often moves too fast to notice.",
  },
  {
    index: 3,
    slug: "cancer",
    name: "Cancer",
    vedicName: "Karka",
    symbol: "♋︎",
    dateRange: "Jun 21 – Jul 22",
    startMonth: 6,
    startDay: 21,
    element: "Water",
    mode: "Cardinal",
    rulingPlanet: "Moon",
    blurb: "Protective and deeply attuned to home, family, and the emotional undercurrents of life.",
    description:
      "Cancer is ruled by the Moon — the planet of emotion, memory, and intuition in Vedic astrology. As a Cardinal Water sign, Karka is the nurturer of the zodiac, profoundly connected to family, home, and the inner lives of those it loves. Cancer's strength lies not in force, but in an emotional depth few other signs can match.",
    traits: ["Intuitive", "Nurturing", "Protective", "Emotionally deep", "Imaginative", "Loyal"],
    strengths: [
      "Powerful empathy and emotional attunement",
      "Fierce, instinctive protectiveness",
      "Deep creative intuition",
      "Loyalty that never wavers",
    ],
    challenges: [
      "Moodiness tied closely to external circumstances",
      "Over-sensitivity to perceived criticism",
      "Difficulty releasing past hurts",
      "Tendency to withdraw rather than confront",
    ],
    relatedServiceSlug: "love-relationship-guidance",
    relatedServiceNote:
      "The Moon governs your emotional world in all its depth. A reading maps the tides of your heart — and where your deepest, most lasting connections are written.",
  },
  {
    index: 4,
    slug: "leo",
    name: "Leo",
    vedicName: "Simha",
    symbol: "♌︎",
    dateRange: "Jul 23 – Aug 22",
    startMonth: 7,
    startDay: 23,
    element: "Fire",
    mode: "Fixed",
    rulingPlanet: "Sun",
    blurb: "Warm and expressive, with a natural pull toward leading, creating, and being fully seen.",
    description:
      "Leo is ruled by the Sun — the source of light, life, and authority in Vedic astrology. As a Fixed Fire sign, Simha possesses a magnetic presence, creative fire, and a deep need to contribute something meaningful. Leo leads not through force, but through the warmth and genuine generosity it extends to everyone it considers its own.",
    traits: ["Generous", "Confident", "Creative", "Dramatic", "Ambitious", "Protective"],
    strengths: [
      "Natural charisma that draws people in",
      "Creative vision others struggle to match",
      "Generosity that costs them nothing to give",
      "Unwavering loyalty to those they love",
    ],
    challenges: [
      "Pride and acute sensitivity to ego",
      "Deep need for recognition and appreciation",
      "Stubbornness once a position is taken",
      "Tendency to overshadow those around them",
    ],
    relatedServiceSlug: "career-business-guidance",
    relatedServiceNote:
      "The Sun illuminates your purpose and authority. A career reading shows where your natural leadership and creative power create the greatest — and most lasting — impact.",
  },
  {
    index: 5,
    slug: "virgo",
    name: "Virgo",
    vedicName: "Kanya",
    symbol: "♍︎",
    dateRange: "Aug 23 – Sep 22",
    startMonth: 8,
    startDay: 23,
    element: "Earth",
    mode: "Mutable",
    rulingPlanet: "Mercury",
    blurb: "Precise and observant, often the one who notices what everyone else walks past.",
    description:
      "Virgo is ruled by Mercury — here expressed not as communication, but as analysis. As a Mutable Earth sign, Kanya is the most discerning sign in the zodiac, applying a sharp, practical mind to the material world with uncommon care. Virgo excels at seeing the gap between what is and what could be — and then doing something about it.",
    traits: ["Analytical", "Precise", "Organised", "Helpful", "Observant", "Methodical"],
    strengths: [
      "Exceptional attention to detail",
      "Practical problem-solving that actually works",
      "Reliability others can genuinely count on",
      "Sincere desire to be useful",
    ],
    challenges: [
      "Over-criticism directed at self and others",
      "Perfectionism as a barrier to starting",
      "Chronic worry that doesn't resolve anything",
      "Difficulty delegating or trusting others' work",
    ],
    relatedServiceSlug: "birth-chart-analysis",
    relatedServiceNote:
      "Mercury in Kanya makes your birth chart unusually rich with detail. A reading reveals how your analytical nature maps to your highest path — and where it might be working against you.",
  },
  {
    index: 6,
    slug: "libra",
    name: "Libra",
    vedicName: "Tula",
    symbol: "♎︎",
    dateRange: "Sep 23 – Oct 22",
    startMonth: 9,
    startDay: 23,
    element: "Air",
    mode: "Cardinal",
    rulingPlanet: "Venus",
    blurb: "Diplomatic and relationship-oriented, with a sharp eye for what is — and isn't — in balance.",
    description:
      "Libra is ruled by Venus — here expressed not through sensuality, but through justice, aesthetics, and the art of relationship. As a Cardinal Air sign, Tula is the peacemaker of the zodiac, driven by a deep need for harmony and fairness. Libra sees all sides of every situation, which is simultaneously its greatest gift and its most persistent challenge.",
    traits: ["Diplomatic", "Fair", "Social", "Idealistic", "Gracious", "Collaborative"],
    strengths: [
      "Natural diplomacy in any conflict",
      "A refined aesthetic sense",
      "Genuine commitment to fairness",
      "Ability to hold space for multiple perspectives",
    ],
    challenges: [
      "Indecisiveness from seeing every side",
      "Conflict avoidance that delays resolution",
      "People-pleasing over honest expression",
      "Dependence on others for a sense of self",
    ],
    relatedServiceSlug: "kundali-matching",
    relatedServiceNote:
      "Tula is the sign of partnership. Kundali matching reveals the harmony — and friction — written into your most significant relationships, before life reveals it for you.",
  },
  {
    index: 7,
    slug: "scorpio",
    name: "Scorpio",
    vedicName: "Vrischika",
    symbol: "♏︎",
    dateRange: "Oct 23 – Nov 21",
    startMonth: 10,
    startDay: 23,
    element: "Water",
    mode: "Fixed",
    rulingPlanet: "Mars",
    blurb: "Intense and perceptive, drawn to what lies beneath the surface of every situation.",
    description:
      "Scorpio is ruled by Mars in Vedic astrology — here operating not as outward force, but as penetrating inner power. As a Fixed Water sign, Vrischika is the most psychologically complex sign in the zodiac, capable of extraordinary transformation, profound loyalty, and a perception that sees what others simply cannot. Scorpio is not afraid of the dark.",
    traits: ["Intense", "Perceptive", "Passionate", "Determined", "Resourceful", "Magnetic"],
    strengths: [
      "Exceptional perception — almost nothing escapes notice",
      "Unflinching determination under pressure",
      "Capacity for profound, lasting transformation",
      "Fierce loyalty to those who earn it",
    ],
    challenges: [
      "Jealousy and possessiveness in close bonds",
      "Secretiveness that isolates under stress",
      "Difficulty extending forgiveness",
      "All-or-nothing thinking in grey situations",
    ],
    relatedServiceSlug: "spiritual-healing",
    relatedServiceNote:
      "Vrischika's Mars energy runs deep — deeper than most charts. A spiritual reading helps you work with its transformative power rather than against it.",
  },
  {
    index: 8,
    slug: "sagittarius",
    name: "Sagittarius",
    vedicName: "Dhanu",
    symbol: "♐︎",
    dateRange: "Nov 22 – Dec 21",
    startMonth: 11,
    startDay: 22,
    element: "Fire",
    mode: "Mutable",
    rulingPlanet: "Jupiter",
    blurb: "Optimistic and restless, happiest when there is a horizon worth moving toward.",
    description:
      "Sagittarius is ruled by Jupiter — the great benefic, the planet of wisdom, expansion, and fortunate timing. As a Mutable Fire sign, Dhanu is the philosopher-adventurer of the zodiac, ever in search of truth, meaning, and the next great experience. Sagittarius asks not just what, but why — and then sets off to find out.",
    traits: ["Optimistic", "Adventurous", "Philosophical", "Honest", "Independent", "Generous"],
    strengths: [
      "Natural, infectious optimism",
      "Philosophical depth behind the humour",
      "Honesty that sometimes surprises people",
      "Ability to inspire others to think bigger",
    ],
    challenges: [
      "Tactlessness in how truth is delivered",
      "Restlessness that makes commitment difficult",
      "Overconfidence in unproven positions",
      "Starting things with more energy than finishing",
    ],
    relatedServiceSlug: "career-business-guidance",
    relatedServiceNote:
      "Jupiter is the planet of expansion and fortunate timing. A career reading maps where your growth windows are written — and when the timing aligns in your favour.",
  },
  {
    index: 9,
    slug: "capricorn",
    name: "Capricorn",
    vedicName: "Makara",
    symbol: "♑︎",
    dateRange: "Dec 22 – Jan 19",
    startMonth: 12,
    startDay: 22,
    element: "Earth",
    mode: "Cardinal",
    rulingPlanet: "Saturn",
    blurb: "Grounded and patient, with a quiet drive to build things that genuinely endure.",
    description:
      "Capricorn is ruled by Saturn — the planet of discipline, karma, and long-term reward. As a Cardinal Earth sign, Makara is the most self-sufficient and structurally ambitious sign in the zodiac, willing to do the slow, patient work others simply won't. Capricorn climbs not for appearance, but because the summit represents something real.",
    traits: ["Disciplined", "Ambitious", "Patient", "Practical", "Responsible", "Strategic"],
    strengths: [
      "Exceptional self-discipline over long timelines",
      "Strategic thinking that accounts for what others miss",
      "Reliability in conditions where others falter",
      "Ability to achieve under sustained pressure",
    ],
    challenges: [
      "Pessimism during difficult or slow phases",
      "Emotional rigidity that distances close relationships",
      "Workaholism at the expense of everything else",
      "Difficulty accepting help or appearing vulnerable",
    ],
    relatedServiceSlug: "career-business-guidance",
    relatedServiceNote:
      "Saturn governs your path, your karma, and your ambition. A reading shows where your steady effort is about to translate into something permanent.",
  },
  {
    index: 10,
    slug: "aquarius",
    name: "Aquarius",
    vedicName: "Kumbha",
    symbol: "♒︎",
    dateRange: "Jan 20 – Feb 18",
    startMonth: 1,
    startDay: 20,
    element: "Air",
    mode: "Fixed",
    rulingPlanet: "Saturn",
    blurb: "Independent and forward-looking, drawn to ideas and causes that are ahead of their time.",
    description:
      "Aquarius is ruled by Saturn in Vedic astrology — here operating not as limitation, but as the disciplined force behind radical innovation. As a Fixed Air sign, Kumbha is the visionary of the zodiac, drawn to systems, collectives, and the long arc of the future. Aquarius thinks in patterns and cares about humanity in a way that is both its gift and its isolation.",
    traits: ["Innovative", "Independent", "Humanitarian", "Intellectual", "Unconventional", "Progressive"],
    strengths: [
      "Genuinely original thinking",
      "Deep commitment to principles over popularity",
      "Ability to see the systems others can't",
      "Intellectual depth that opens new worlds",
    ],
    challenges: [
      "Emotional detachment that confuses those close",
      "Stubbornness of belief once formed",
      "Unpredictability that unsettles stable environments",
      "Difficulty with intimate, personal connection",
    ],
    relatedServiceSlug: "tarot-numerology",
    relatedServiceNote:
      "Saturn in Kumbha creates a unique karmic signature. Numerology and tarot surface the recurring patterns shaping your unconventional path — the ones you sense but haven't named.",
  },
  {
    index: 11,
    slug: "pisces",
    name: "Pisces",
    vedicName: "Meena",
    symbol: "♓︎",
    dateRange: "Feb 19 – Mar 20",
    startMonth: 2,
    startDay: 19,
    element: "Water",
    mode: "Mutable",
    rulingPlanet: "Jupiter",
    blurb: "Compassionate and intuitive, often the first to sense what others are only beginning to feel.",
    description:
      "Pisces is ruled by Jupiter — here not as worldly expansion, but as spiritual depth and inner wisdom. As a Mutable Water sign, Meena is the last sign of the zodiac, carrying something of all eleven before it. Pisces dissolves boundaries between the seen and the unseen, feels everything deeply, and connects to threads that run beneath ordinary life.",
    traits: ["Compassionate", "Intuitive", "Artistic", "Gentle", "Wise", "Empathetic"],
    strengths: [
      "Deep, unconditional compassion",
      "Intuition that perceives beyond the obvious",
      "Artistic and creative gifts that move people",
      "Ability to understand others without needing to be told",
    ],
    challenges: [
      "Emotional absorption from surrounding environments",
      "Escapism as a response to difficulty",
      "Boundary-setting that never quite holds",
      "Self-sacrifice taken too far, too often",
    ],
    relatedServiceSlug: "spiritual-healing",
    relatedServiceNote:
      "Jupiter in Meena is deeply spiritual. A healing-focused reading helps you understand the gifts — and the necessary boundaries — your chart requires you to hold.",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getSignBySlug(slug: string): ZodiacSign | undefined {
  return zodiacSigns.find((s) => s.slug === slug);
}

export function getSignByDate(month: number, day: number): ZodiacSign {
  const cutoffs: [number, number, number][] = [
    [1, 19, 9],
    [2, 18, 10],
    [3, 20, 11],
    [4, 19, 0],
    [5, 20, 1],
    [6, 20, 2],
    [7, 22, 3],
    [8, 22, 4],
    [9, 22, 5],
    [10, 22, 6],
    [11, 21, 7],
    [12, 21, 8],
  ];
  for (const [m, d, idx] of cutoffs) {
    if (month < m || (month === m && day <= d)) return zodiacSigns[idx];
  }
  return zodiacSigns[9];
}

// ─── Compatibility engine ─────────────────────────────────────────────────────

function getSignDistance(a: ZodiacSign, b: ZodiacSign): number {
  const d = Math.abs(a.index - b.index);
  return Math.min(d, 12 - d);
}

function elementScore(a: Element, b: Element): number {
  if (a === b) return 15;
  if (
    (a === "Fire" && b === "Air") || (a === "Air" && b === "Fire") ||
    (a === "Earth" && b === "Water") || (a === "Water" && b === "Earth")
  ) return 10;
  if (
    (a === "Fire" && b === "Earth") || (a === "Earth" && b === "Fire") ||
    (a === "Air" && b === "Water") || (a === "Water" && b === "Air")
  ) return 5;
  return 2;
}

function positionScore(distance: number): number {
  const map: Record<number, number> = { 0: 9, 1: 4, 2: 8, 3: 2, 4: 12, 5: 0, 6: 3 };
  return map[distance] ?? 2;
}

function modeScore(a: Mode, b: Mode): number {
  return a === b ? 2 : 5;
}

const PLANETARY_FRIENDSHIP: Record<string, Record<string, number>> = {
  Sun:     { Sun: 3, Moon: 4, Mars: 4, Mercury: 2, Jupiter: 4, Venus: 0, Saturn: 0 },
  Moon:    { Sun: 4, Moon: 3, Mars: 2, Mercury: 3, Jupiter: 2, Venus: 1, Saturn: 1 },
  Mars:    { Sun: 4, Moon: 3, Mars: 3, Mercury: 1, Jupiter: 4, Venus: 2, Saturn: 2 },
  Mercury: { Sun: 3, Moon: 0, Mars: 1, Mercury: 3, Jupiter: 2, Venus: 4, Saturn: 2 },
  Jupiter: { Sun: 4, Moon: 4, Mars: 4, Mercury: 1, Jupiter: 3, Venus: 1, Saturn: 2 },
  Venus:   { Sun: 0, Moon: 1, Mars: 2, Mercury: 4, Jupiter: 2, Venus: 3, Saturn: 4 },
  Saturn:  { Sun: 0, Moon: 0, Mars: 2, Mercury: 4, Jupiter: 2, Venus: 4, Saturn: 3 },
};

function planetaryScore(p1: string, p2: string): number {
  return PLANETARY_FRIENDSHIP[p1]?.[p2] ?? 2;
}

export function getCompatibility(a: ZodiacSign, b: ZodiacSign): CompatibilityResult {
  const dist = getSignDistance(a, b);
  const total = Math.min(
    36,
    elementScore(a.element, b.element) +
      positionScore(dist) +
      modeScore(a.mode, b.mode) +
      planetaryScore(a.rulingPlanet, b.rulingPlanet)
  );

  if (total >= 28) return { score: total, label: "Excellent", color: "green" };
  if (total >= 20) return { score: total, label: "Good",      color: "amber" };
  if (total >= 12) return { score: total, label: "Moderate",  color: "neutral" };
  return              { score: total, label: "Challenging", color: "rose" };
}
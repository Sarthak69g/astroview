// src/data/numerologyData.ts
// Single source of truth for numerology number meanings across AstroView.
// Mirrors the shape of zodiacData.ts — one array, one lookup helper —
// so the numerology hub/detail pages can reuse the same patterns as
// the horoscope hub/sign pages.

export interface NumerologyNumber {
  number: number;
  slug: string; // "1".."9", "11", "22", "33" — used in URLs
  title: string; // short archetype label, e.g. "The Leader"
  tagline: string;
  description: string;
  strengths: string[];
  challenges: string[];
  // Context-specific blurbs — the same number reads a little differently
  // depending on which of the three core numbers it shows up as.
  lifePathNote: string;
  destinyNote: string;
  soulUrgeNote: string;
  isMaster: boolean;
}

export const numerologyNumbers: NumerologyNumber[] = [
  {
    number: 1,
    slug: "1",
    title: "The Leader",
    tagline: "Independent, driven, first to act.",
    description:
      "Number 1 is the number of beginnings — the spark that starts every cycle in numerology. It carries initiative, self-reliance, and an instinct to lead rather than follow. People strongly connected to 1 tend to trust their own judgement over the crowd's, and are happiest when they're building something from nothing rather than maintaining what already exists.",
    strengths: ["Natural initiative", "Self-reliant", "Original thinking", "Decisive under pressure"],
    challenges: ["Can turn stubborn or impatient", "May struggle to ask for help", "Risk of steamrolling others' input"],
    lifePathNote: "As a Life Path, 1 points toward a life built around independence — carving your own route rather than inheriting one, often through entrepreneurship, founding, or simply insisting on doing things your own way.",
    destinyNote: "As a Destiny number, 1 suggests your path forward involves stepping into leadership, even if that's uncomfortable at first — the world keeps handing you the front of the room.",
    soulUrgeNote: "As a Soul Urge, 1 means what you privately crave is autonomy — the freedom to act on your own terms, even if you present as accommodating on the surface.",
    isMaster: false,
  },
  {
    number: 2,
    slug: "2",
    title: "The Diplomat",
    tagline: "Sensitive, cooperative, tuned to others.",
    description:
      "Number 2 governs partnership, balance, and emotional attunement. Where 1 acts alone, 2 works through relationship — sensing what a room needs, mediating between opposing views, and finding harmony where others see only conflict. It's a quieter kind of strength, built on patience rather than force.",
    strengths: ["Deep empathy", "Natural mediator", "Detail-oriented", "Loyal in relationships"],
    challenges: ["Prone to people-pleasing", "Can avoid necessary conflict", "Sensitive to criticism"],
    lifePathNote: "As a Life Path, 2 points toward a life shaped by partnership — you're likely to grow most through close relationships, collaborative work, and learning where your needs end and someone else's begin.",
    destinyNote: "As a Destiny number, 2 suggests your path involves becoming the connective tissue in groups — the one who holds things together when everyone else is pulling apart.",
    soulUrgeNote: "As a Soul Urge, 2 means you privately long for closeness and peace — harmony in your relationships matters to you more than most people around you realize.",
    isMaster: false,
  },
  {
    number: 3,
    slug: "3",
    title: "The Communicator",
    tagline: "Expressive, creative, socially magnetic.",
    description:
      "Number 3 carries the energy of self-expression — words, art, performance, humour. It's an optimistic, sociable vibration that draws people in and finds joy in creating something others can see, hear, or feel. 3 doesn't just have ideas; it needs an outlet for them.",
    strengths: ["Natural creativity", "Gifted communicator", "Optimistic outlook", "Easily inspires others"],
    challenges: ["Can scatter energy across too many projects", "Prone to surface-level follow-through", "Mood can swing with audience response"],
    lifePathNote: "As a Life Path, 3 points toward a life built around creative or expressive work — writing, speaking, performing, or simply being the person who makes gatherings come alive.",
    destinyNote: "As a Destiny number, 3 suggests your path forward runs through visibility — putting your voice or work in front of others, even when that feels exposing.",
    soulUrgeNote: "As a Soul Urge, 3 means what you privately crave is joyful self-expression — you feel most alive when you're free to create without being boxed in.",
    isMaster: false,
  },
  {
    number: 4,
    slug: "4",
    title: "The Builder",
    tagline: "Grounded, disciplined, built to last.",
    description:
      "Number 4 is the number of structure — foundations, systems, and steady, methodical effort. Where 3 improvises, 4 plans. It values reliability over flash, and tends to earn trust slowly, through consistency shown over time rather than any single dramatic gesture.",
    strengths: ["Highly disciplined", "Dependable under pressure", "Strong practical instincts", "Builds things that last"],
    challenges: ["Can be inflexible to change", "Prone to overworking", "May resist anything that feels unproven"],
    lifePathNote: "As a Life Path, 4 points toward a life built on foundations — steady careers, long-term projects, and a deep satisfaction in doing things properly rather than quickly.",
    destinyNote: "As a Destiny number, 4 suggests your path forward involves becoming the person others rely on to actually execute — turning someone else's vision into something real.",
    soulUrgeNote: "As a Soul Urge, 4 means you privately crave security and order — a stable base beneath you matters more to your peace of mind than most people would guess.",
    isMaster: false,
  },
  {
    number: 5,
    slug: "5",
    title: "The Free Spirit",
    tagline: "Restless, adaptable, drawn to change.",
    description:
      "Number 5 carries the energy of freedom and movement. It resists routine, thrives on variety, and tends to learn by doing rather than planning. 5 energy is quick to adapt to new circumstances — sometimes because it seeks change out deliberately, sometimes because it simply can't sit still.",
    strengths: ["Highly adaptable", "Quick-thinking under change", "Naturally curious", "Comfortable with risk"],
    challenges: ["Can struggle with commitment", "Prone to restlessness", "May chase novelty over depth"],
    lifePathNote: "As a Life Path, 5 points toward a life with real variety in it — travel, changing careers, or simply resisting the idea that life has to look the same year after year.",
    destinyNote: "As a Destiny number, 5 suggests your path forward involves embracing change rather than fighting it — your growth tends to come through the unplanned detour, not the fixed plan.",
    soulUrgeNote: "As a Soul Urge, 5 means you privately crave freedom — the feeling of being boxed in, even in a good situation, tends to bother you more than you let on.",
    isMaster: false,
  },
  {
    number: 6,
    slug: "6",
    title: "The Nurturer",
    tagline: "Responsible, caring, family-oriented.",
    description:
      "Number 6 is the number of care and responsibility — home, family, community, and anyone who needs looking after. It carries a strong sense of duty and finds genuine fulfilment in taking care of others, sometimes to the point of putting itself last on the list.",
    strengths: ["Deeply responsible", "Naturally nurturing", "Strong sense of justice", "Creates warmth wherever it goes"],
    challenges: ["Prone to self-sacrifice", "Can become controlling out of care", "Struggles to receive help gracefully"],
    lifePathNote: "As a Life Path, 6 points toward a life centred on responsibility to others — family, community, or work that involves genuine care, often becoming the person others lean on by default.",
    destinyNote: "As a Destiny number, 6 suggests your path forward involves service — your fulfilment tends to arrive through what you build or provide for people close to you.",
    soulUrgeNote: "As a Soul Urge, 6 means you privately crave to be needed and to belong — being useful to the people you love matters to you at a fairly deep level.",
    isMaster: false,
  },
  {
    number: 7,
    slug: "7",
    title: "The Seeker",
    tagline: "Analytical, introspective, drawn inward.",
    description:
      "Number 7 is the number of inquiry — it wants to understand the mechanism behind things, not just accept the surface. It's comfortable with solitude, drawn to research, philosophy, or anything that rewards depth over breadth, and often trusts its own quiet analysis more than the popular consensus.",
    strengths: ["Sharp analytical mind", "Comfortable with solitude", "Naturally intuitive", "Values truth over comfort"],
    challenges: ["Can isolate when stressed", "Prone to overthinking", "May come across as distant or guarded"],
    lifePathNote: "As a Life Path, 7 points toward a life shaped by inquiry — research, spirituality, or any pursuit that rewards sitting with a question longer than most people are willing to.",
    destinyNote: "As a Destiny number, 7 suggests your path forward involves becoming a specialist or authority — depth in one thing, rather than breadth across many.",
    soulUrgeNote: "As a Soul Urge, 7 means you privately crave understanding — you're not satisfied with 'that's just how it is,' even when you don't say so out loud.",
    isMaster: false,
  },
  {
    number: 8,
    slug: "8",
    title: "The Powerhouse",
    tagline: "Ambitious, strategic, results-driven.",
    description:
      "Number 8 is the number of material mastery — ambition, authority, and the confidence to operate at scale. It thinks in terms of outcomes and resources, and tends to be comfortable with power in a way that makes other numbers uneasy. 8 energy wants to build something that visibly works.",
    strengths: ["Strong strategic instincts", "Naturally authoritative", "Excellent at execution", "Resilient under setbacks"],
    challenges: ["Can prioritize results over people", "Prone to workaholism", "May equate self-worth with achievement"],
    lifePathNote: "As a Life Path, 8 points toward a life measured in tangible achievement — business, leadership, or any arena where results are visible and scorekeeping is real.",
    destinyNote: "As a Destiny number, 8 suggests your path forward involves stepping into authority — managing resources, people, or outcomes at a scale bigger than just yourself.",
    soulUrgeNote: "As a Soul Urge, 8 means you privately crave recognition through achievement — being seen as capable and successful matters to you more than you might admit.",
    isMaster: false,
  },
  {
    number: 9,
    slug: "9",
    title: "The Humanitarian",
    tagline: "Compassionate, idealistic, big-picture.",
    description:
      "Number 9 is the number of completion — the last of the single digits, carrying a bit of everything before it. It thinks in terms of humanity rather than self-interest, drawn to causes bigger than any one person, and tends to feel other people's pain almost as if it were its own.",
    strengths: ["Broad compassion", "Naturally generous", "Big-picture thinker", "Comfortable letting go"],
    challenges: ["Can neglect personal needs for causes", "Prone to idealism over practicality", "May struggle with closure or endings"],
    lifePathNote: "As a Life Path, 9 points toward a life oriented around service to something larger than yourself — a cause, a community, or humanity in the abstract.",
    destinyNote: "As a Destiny number, 9 suggests your path forward involves a kind of completion or giving-back — using what you've learned to lift others rather than accumulate for yourself.",
    soulUrgeNote: "As a Soul Urge, 9 means you privately crave meaning — a life that only serves you personally tends to leave you unsatisfied, even if it looks comfortable.",
    isMaster: false,
  },
  {
    number: 11,
    slug: "11",
    title: "The Intuitive",
    tagline: "A Master Number — heightened insight, held to a higher wire.",
    description:
      "11 is the first Master Number — a 2 raised to a higher, more intense frequency. It carries strong intuition, sensitivity, and a kind of visionary insight that can feel almost involuntary. Master Numbers aren't automatically 'better' than single digits — they're more amplified, which means both the gifts and the internal pressure run higher.",
    strengths: ["Heightened intuition", "Inspires others almost effortlessly", "Sees connections others miss", "Deeply empathetic"],
    challenges: ["Nervous energy runs high", "Prone to self-doubt despite ability", "Can feel overwhelmed by its own sensitivity"],
    lifePathNote: "As a Life Path, 11 suggests a life lived close to the edge of intuition and inspiration — you may be pulled toward roles that involve guiding, teaching, or illuminating something for others, often before you feel ready for it.",
    destinyNote: "As a Destiny number, 11 suggests your path forward asks you to trust insight you can't always fully explain — your instincts are more reliable than your self-doubt gives them credit for.",
    soulUrgeNote: "As a Soul Urge, 11 means you privately crave meaningful connection to something larger — spiritual, creative, or emotional depth, not surface-level exchange.",
    isMaster: true,
  },
  {
    number: 22,
    slug: "22",
    title: "The Master Builder",
    tagline: "A Master Number — big vision, built with real hands.",
    description:
      "22 is the Master Builder — a 4 raised to a higher frequency, combining the practical discipline of 4 with far larger ambition. Where 4 builds steadily, 22 builds at scale: institutions, movements, structures meant to outlast a single lifetime. It's a rare pairing of dreamer and engineer in the same person.",
    strengths: ["Visionary combined with practicality", "Capable of large-scale execution", "Natural long-term strategist", "Turns ideas into lasting structures"],
    challenges: ["Pressure of high expectations", "Can feel weighed down by its own potential", "Prone to burnout chasing scale"],
    lifePathNote: "As a Life Path, 22 suggests a life with unusually large potential impact — you may be capable of building something that outlasts you, though getting there takes real patience with the process.",
    destinyNote: "As a Destiny number, 22 suggests your path forward involves turning an ambitious vision into something concrete — not just imagining it, but actually constructing it.",
    soulUrgeNote: "As a Soul Urge, 22 means you privately crave significance — leaving something behind that genuinely matters, rather than just getting by comfortably.",
    isMaster: true,
  },
  {
    number: 33,
    slug: "33",
    title: "The Master Teacher",
    tagline: "A Master Number — selfless care, amplified.",
    description:
      "33 is the Master Teacher — a 6 raised to a higher frequency, carrying an unusually deep capacity for compassion and guidance. It's the rarest of the Master Numbers to appear as a core number, and where 6 nurtures those close to it, 33 tends to extend that same care outward to a much wider circle.",
    strengths: ["Profound compassion", "Natural teacher or healer instinct", "Selfless under pressure", "Inspires devotion in others"],
    challenges: ["Extreme risk of self-sacrifice", "Can struggle to set boundaries", "May carry others' burdens as its own"],
    lifePathNote: "As a Life Path, 33 suggests a life oriented around teaching, healing, or guiding — with an unusually strong pull to give of yourself, one you'll need to consciously balance against your own needs.",
    destinyNote: "As a Destiny number, 33 suggests your path forward involves service on a wide scale — your care for others is meant to be shared, not just kept within your closest circle.",
    soulUrgeNote: "As a Soul Urge, 33 means you privately crave to heal or uplift — you feel most fulfilled when your compassion is actually reaching someone who needed it.",
    isMaster: true,
  },
];

export function getNumberBySlug(slug: string): NumerologyNumber | undefined {
  return numerologyNumbers.find((n) => n.slug === slug);
}

export function getNumberByValue(value: number): NumerologyNumber | undefined {
  return numerologyNumbers.find((n) => n.number === value);
}

// src/data/tarotSpreads.ts
// Reading-type configs for the Tarot section. Each spread defines how many
// cards are drawn and what each position means — mirrors the "service card"
// pattern used across Horoscope/Numerology/Services (icon, title, blurb,
// slug-based routing to a detail page).

export interface TarotSpread {
  slug: string;
  title: string;
  blurb: string;
  icon: string; // lucide-react icon name, resolved in the route component
  positions: { label: string; description: string }[];
}

export const tarotSpreads: TarotSpread[] = [
  {
    slug: "daily-card",
    title: "Daily Card",
    blurb: "One card, one focus — a quick read on today's energy.",
    icon: "Sun",
    positions: [{ label: "Today", description: "The energy shaping your day." }],
  },
  {
    slug: "love-relationships",
    title: "Love & Relationships",
    blurb: "A three-card spread on you, them, and the connection between you.",
    icon: "Heart",
    positions: [
      { label: "You", description: "Where you stand in this connection." },
      { label: "Them", description: "Where the other person stands." },
      { label: "Connection", description: "The energy running between you both." },
    ],
  },
  {
    slug: "career-finance",
    title: "Career & Finance",
    blurb: "A three-card look at your work and money — past, present, and advice.",
    icon: "Briefcase",
    positions: [
      { label: "Past", description: "What's shaped your current situation." },
      { label: "Present", description: "Where things stand right now." },
      { label: "Advice", description: "What to focus on moving forward." },
    ],
  },
  {
    slug: "yes-or-no",
    title: "Yes or No",
    blurb: "A single quick pull for a straightforward either/or question.",
    icon: "HelpCircle",
    positions: [{ label: "Answer", description: "The card's lean on your question." }],
  },
  {
    slug: "past-present-future",
    title: "Past, Present, Future",
    blurb: "The classic three-card spread — how a situation is unfolding over time.",
    icon: "Hourglass",
    positions: [
      { label: "Past", description: "What led to where you are now." },
      { label: "Present", description: "The heart of the situation today." },
      { label: "Future", description: "Where things are headed." },
    ],
  },
];

export function getSpreadBySlug(slug: string): TarotSpread | undefined {
  return tarotSpreads.find((s) => s.slug === slug);
}

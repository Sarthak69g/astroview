// src/data/tarotData.ts
// Full 78-card Tarot deck — 22 Major Arcana + 56 Minor Arcana (4 suits x
// 10 pips + 4 court cards). Mirrors the shape of zodiacData.ts /
// numerologyData.ts: one array, one lookup helper, one type export —
// consistent with the rest of the design system.

export type Arcana = "major" | "minor";
export type Suit = "wands" | "cups" | "swords" | "pentacles";
export type Court = "page" | "knight" | "queen" | "king";

export interface TarotCard {
  slug: string;
  name: string;
  arcana: Arcana;
  suit?: Suit;
  court?: Court;
  number: number; // 0-21 for Major Arcana, 1-10 for Minor pips (court cards use 0)
  symbol: string; // roman numeral (Major) or suit glyph + rank (Minor)
  keyword: string;
  meaning: string;
}

export const SUIT_INFO: Record<Suit, { label: string; element: string; glyph: string }> = {
  wands: { label: "Wands", element: "Fire", glyph: "🔥" },
  cups: { label: "Cups", element: "Water", glyph: "💧" },
  swords: { label: "Swords", element: "Air", glyph: "⚔️" },
  pentacles: { label: "Pentacles", element: "Earth", glyph: "🪙" },
};

export const tarotDeck: TarotCard[] = [
  {
    slug: "the-fool",
    name: "The Fool",
    arcana: "major",
    number: 0,
    symbol: "0",
    keyword: "New beginnings",
    meaning:
      "A leap of faith into the unknown. The Fool represents fresh starts, a willingness to trust the journey before knowing the destination, and the innocence needed to try without letting fear talk you out of it.",
  },
  {
    slug: "the-magician",
    name: "The Magician",
    arcana: "major",
    number: 1,
    symbol: "I",
    keyword: "Willpower and resourcefulness",
    meaning:
      "You already have every tool you need. The Magician points to a moment of manifestation — turning idea into action through focus, skill, and confidence in your own ability.",
  },
  {
    slug: "the-high-priestess",
    name: "The High Priestess",
    arcana: "major",
    number: 2,
    symbol: "II",
    keyword: "Intuition and hidden knowledge",
    meaning:
      "Not everything worth knowing is visible yet. This card asks you to trust your inner voice over outside noise, and to sit with mystery rather than force an answer.",
  },
  {
    slug: "the-empress",
    name: "The Empress",
    arcana: "major",
    number: 3,
    symbol: "III",
    keyword: "Abundance and nurturing",
    meaning:
      "Growth, comfort, and creation. The Empress reflects a season of nurturing something — a project, a relationship, yourself — and letting it flourish without rushing it.",
  },
  {
    slug: "the-emperor",
    name: "The Emperor",
    arcana: "major",
    number: 4,
    symbol: "IV",
    keyword: "Structure and authority",
    meaning:
      "Order, discipline, and steady leadership. This card favours building solid foundations and taking responsibility rather than leaving things to chance.",
  },
  {
    slug: "the-hierophant",
    name: "The Hierophant",
    arcana: "major",
    number: 5,
    symbol: "V",
    keyword: "Tradition and guidance",
    meaning:
      "Learning through established systems, mentors, or shared belief. The Hierophant suggests value in structure, ritual, or seeking counsel rather than going it alone.",
  },
  {
    slug: "the-lovers",
    name: "The Lovers",
    arcana: "major",
    number: 6,
    symbol: "VI",
    keyword: "Connection and choice",
    meaning:
      "A meaningful bond or a values-based decision. The Lovers is less about romance alone and more about alignment — choosing what truly reflects who you are.",
  },
  {
    slug: "the-chariot",
    name: "The Chariot",
    arcana: "major",
    number: 7,
    symbol: "VII",
    keyword: "Willpower and direction",
    meaning:
      "Forward motion through sheer determination. The Chariot rewards discipline and a clear goal, even when the path pulls in two directions at once.",
  },
  {
    slug: "strength",
    name: "Strength",
    arcana: "major",
    number: 8,
    symbol: "VIII",
    keyword: "Quiet courage",
    meaning:
      "Not brute force, but patience and self-mastery. Strength is the calm confidence to handle a difficult situation with grace rather than aggression.",
  },
  {
    slug: "the-hermit",
    name: "The Hermit",
    arcana: "major",
    number: 9,
    symbol: "IX",
    keyword: "Reflection and solitude",
    meaning:
      "A call to step back and look inward. The Hermit favours quiet, honest self-examination over outside answers right now.",
  },
  {
    slug: "wheel-of-fortune",
    name: "Wheel of Fortune",
    arcana: "major",
    number: 10,
    symbol: "X",
    keyword: "Cycles and change",
    meaning:
      "Life moves in turns, not straight lines. This card marks a shift — for better or worse — that reminds you how much is simply out of your hands.",
  },
  {
    slug: "justice",
    name: "Justice",
    arcana: "major",
    number: 11,
    symbol: "XI",
    keyword: "Fairness and consequence",
    meaning:
      "Truth surfaces, and outcomes reflect actions taken. Justice calls for honesty, accountability, and trusting that balance eventually finds its way back.",
  },
  {
    slug: "the-hanged-man",
    name: "The Hanged Man",
    arcana: "major",
    number: 12,
    symbol: "XII",
    keyword: "Surrender and new perspective",
    meaning:
      "Progress by pausing. The Hanged Man suggests that letting go of control, and viewing the situation from a different angle, reveals what force alone cannot.",
  },
  {
    slug: "death",
    name: "Death",
    arcana: "major",
    number: 13,
    symbol: "XIII",
    keyword: "Endings and transformation",
    meaning:
      "Rarely literal — this card marks the close of a chapter that has to end for the next one to begin. Resisting the change tends to hurt more than the change itself.",
  },
  {
    slug: "temperance",
    name: "Temperance",
    arcana: "major",
    number: 14,
    symbol: "XIV",
    keyword: "Balance and patience",
    meaning:
      "Slow, deliberate blending of opposites. Temperance favours moderation, compromise, and the kind of patience that turns tension into harmony over time.",
  },
  {
    slug: "the-devil",
    name: "The Devil",
    arcana: "major",
    number: 15,
    symbol: "XV",
    keyword: "Attachment and restriction",
    meaning:
      "A pattern, habit, or relationship that has become a cage — often one you agreed to. This card asks what you're holding onto that no longer serves you.",
  },
  {
    slug: "the-tower",
    name: "The Tower",
    arcana: "major",
    number: 16,
    symbol: "XVI",
    keyword: "Sudden upheaval",
    meaning:
      "A fast, disruptive collapse of something that wasn't as stable as it looked. Painful in the moment, but it clears space for something built on firmer ground.",
  },
  {
    slug: "the-star",
    name: "The Star",
    arcana: "major",
    number: 17,
    symbol: "XVII",
    keyword: "Hope and renewal",
    meaning:
      "After hardship, a quiet return of faith. The Star points to healing, optimism, and trust that things are genuinely getting better.",
  },
  {
    slug: "the-moon",
    name: "The Moon",
    arcana: "major",
    number: 18,
    symbol: "XVIII",
    keyword: "Uncertainty and the subconscious",
    meaning:
      "Not everything is clear right now, and that's the point. The Moon reflects a time of confusion, dreams, or fears worth examining rather than ignoring.",
  },
  {
    slug: "the-sun",
    name: "The Sun",
    arcana: "major",
    number: 19,
    symbol: "XIX",
    keyword: "Joy and clarity",
    meaning:
      "Warmth, success, and things finally making sense. The Sun is one of the most positive cards in the deck — vitality, confidence, and genuine happiness.",
  },
  {
    slug: "judgement",
    name: "Judgement",
    arcana: "major",
    number: 20,
    symbol: "XX",
    keyword: "Reckoning and awakening",
    meaning:
      "A moment of reckoning or realisation that changes how you see your own story. Judgement favours honest self-assessment and answering a call you can no longer ignore.",
  },
  {
    slug: "the-world",
    name: "The World",
    arcana: "major",
    number: 21,
    symbol: "XXI",
    keyword: "Completion and wholeness",
    meaning:
      "A cycle closes, fully and successfully. The World marks achievement, integration, and the satisfaction of having come full circle.",
  },
  {
    slug: "ace-of-wands",
    name: "Ace of Wands",
    arcana: "minor",
    suit: "wands",
    number: 1,
    symbol: "🔥 1",
    keyword: "A burst of new potential in ambition, creativity, and drive",
    meaning:
      "The Ace of Wands points to the very start of something in this area of life — raw, unshaped, and full of promise, playing out through ambition, creativity, and drive.",
  },
  {
    slug: "two-of-wands",
    name: "Two of Wands",
    arcana: "minor",
    suit: "wands",
    number: 2,
    symbol: "🔥 2",
    keyword: "Balance and choice in ambition, creativity, and drive",
    meaning:
      "The Two of Wands points to a decision or a partnership that asks you to weigh two paths carefully, playing out through ambition, creativity, and drive.",
  },
  {
    slug: "three-of-wands",
    name: "Three of Wands",
    arcana: "minor",
    suit: "wands",
    number: 3,
    symbol: "🔥 3",
    keyword: "Growth through collaboration in ambition, creativity, and drive",
    meaning:
      "The Three of Wands points to early progress that comes from working with others rather than alone, playing out through ambition, creativity, and drive.",
  },
  {
    slug: "four-of-wands",
    name: "Four of Wands",
    arcana: "minor",
    suit: "wands",
    number: 4,
    symbol: "🔥 4",
    keyword: "Stability and pause in ambition, creativity, and drive",
    meaning:
      "The Four of Wands points to a settled moment — solid ground, but also a plateau worth noticing, playing out through ambition, creativity, and drive.",
  },
  {
    slug: "five-of-wands",
    name: "Five of Wands",
    arcana: "minor",
    suit: "wands",
    number: 5,
    symbol: "🔥 5",
    keyword: "Conflict and disruption in ambition, creativity, and drive",
    meaning:
      "The Five of Wands points to friction or setback that shakes things up, testing what you're really built of, playing out through ambition, creativity, and drive.",
  },
  {
    slug: "six-of-wands",
    name: "Six of Wands",
    arcana: "minor",
    suit: "wands",
    number: 6,
    symbol: "🔥 6",
    keyword: "Harmony and generosity in ambition, creativity, and drive",
    meaning:
      "The Six of Wands points to a return to balance, often through cooperation, memory, or giving, playing out through ambition, creativity, and drive.",
  },
  {
    slug: "seven-of-wands",
    name: "Seven of Wands",
    arcana: "minor",
    suit: "wands",
    number: 7,
    symbol: "🔥 7",
    keyword: "Reflection and assessment in ambition, creativity, and drive",
    meaning:
      "The Seven of Wands points to a pause to take stock — questioning whether the current approach is working, playing out through ambition, creativity, and drive.",
  },
  {
    slug: "eight-of-wands",
    name: "Eight of Wands",
    arcana: "minor",
    suit: "wands",
    number: 8,
    symbol: "🔥 8",
    keyword: "Focused movement in ambition, creativity, and drive",
    meaning:
      "The Eight of Wands points to swift progress or mastery that comes from narrowing your focus, playing out through ambition, creativity, and drive.",
  },
  {
    slug: "nine-of-wands",
    name: "Nine of Wands",
    arcana: "minor",
    suit: "wands",
    number: 9,
    symbol: "🔥 9",
    keyword: "Near completion in ambition, creativity, and drive",
    meaning:
      "The Nine of Wands points to almost there — a stage of resilience, or quiet fulfilment just before the end, playing out through ambition, creativity, and drive.",
  },
  {
    slug: "ten-of-wands",
    name: "Ten of Wands",
    arcana: "minor",
    suit: "wands",
    number: 10,
    symbol: "🔥 10",
    keyword: "Culmination in ambition, creativity, and drive",
    meaning:
      "The Ten of Wands points to the full outcome of this journey, for better or worse, and the transition into what's next, playing out through ambition, creativity, and drive.",
  },
  {
    slug: "page-of-wands",
    name: "Page of Wands",
    arcana: "minor",
    suit: "wands",
    court: "page",
    number: 0,
    symbol: "🔥 P",
    keyword: "A student or messenger, tied to ambition, creativity, and drive",
    meaning:
      "The Page of Wands embodies curiosity, new information, or an early, still-forming stage of ambition, creativity, and drive.",
  },
  {
    slug: "knight-of-wands",
    name: "Knight of Wands",
    arcana: "minor",
    suit: "wands",
    court: "knight",
    number: 0,
    symbol: "🔥 K",
    keyword: "A pursuer in motion, tied to ambition, creativity, and drive",
    meaning:
      "The Knight of Wands embodies bold, sometimes impulsive action driven by ambition, creativity, and drive.",
  },
  {
    slug: "queen-of-wands",
    name: "Queen of Wands",
    arcana: "minor",
    suit: "wands",
    court: "queen",
    number: 0,
    symbol: "🔥 Q",
    keyword: "An inward master, tied to ambition, creativity, and drive",
    meaning:
      "The Queen of Wands embodies confident, nurturing command of ambition, creativity, and drive.",
  },
  {
    slug: "king-of-wands",
    name: "King of Wands",
    arcana: "minor",
    suit: "wands",
    court: "king",
    number: 0,
    symbol: "🔥 K",
    keyword: "An outward master, tied to ambition, creativity, and drive",
    meaning:
      "The King of Wands embodies authoritative, seasoned command of ambition, creativity, and drive.",
  },
  {
    slug: "ace-of-cups",
    name: "Ace of Cups",
    arcana: "minor",
    suit: "cups",
    number: 1,
    symbol: "💧 1",
    keyword: "A burst of new potential in emotion, relationships, and intuition",
    meaning:
      "The Ace of Cups points to the very start of something in this area of life — raw, unshaped, and full of promise, playing out through emotion, relationships, and intuition.",
  },
  {
    slug: "two-of-cups",
    name: "Two of Cups",
    arcana: "minor",
    suit: "cups",
    number: 2,
    symbol: "💧 2",
    keyword: "Balance and choice in emotion, relationships, and intuition",
    meaning:
      "The Two of Cups points to a decision or a partnership that asks you to weigh two paths carefully, playing out through emotion, relationships, and intuition.",
  },
  {
    slug: "three-of-cups",
    name: "Three of Cups",
    arcana: "minor",
    suit: "cups",
    number: 3,
    symbol: "💧 3",
    keyword: "Growth through collaboration in emotion, relationships, and intuition",
    meaning:
      "The Three of Cups points to early progress that comes from working with others rather than alone, playing out through emotion, relationships, and intuition.",
  },
  {
    slug: "four-of-cups",
    name: "Four of Cups",
    arcana: "minor",
    suit: "cups",
    number: 4,
    symbol: "💧 4",
    keyword: "Stability and pause in emotion, relationships, and intuition",
    meaning:
      "The Four of Cups points to a settled moment — solid ground, but also a plateau worth noticing, playing out through emotion, relationships, and intuition.",
  },
  {
    slug: "five-of-cups",
    name: "Five of Cups",
    arcana: "minor",
    suit: "cups",
    number: 5,
    symbol: "💧 5",
    keyword: "Conflict and disruption in emotion, relationships, and intuition",
    meaning:
      "The Five of Cups points to friction or setback that shakes things up, testing what you're really built of, playing out through emotion, relationships, and intuition.",
  },
  {
    slug: "six-of-cups",
    name: "Six of Cups",
    arcana: "minor",
    suit: "cups",
    number: 6,
    symbol: "💧 6",
    keyword: "Harmony and generosity in emotion, relationships, and intuition",
    meaning:
      "The Six of Cups points to a return to balance, often through cooperation, memory, or giving, playing out through emotion, relationships, and intuition.",
  },
  {
    slug: "seven-of-cups",
    name: "Seven of Cups",
    arcana: "minor",
    suit: "cups",
    number: 7,
    symbol: "💧 7",
    keyword: "Reflection and assessment in emotion, relationships, and intuition",
    meaning:
      "The Seven of Cups points to a pause to take stock — questioning whether the current approach is working, playing out through emotion, relationships, and intuition.",
  },
  {
    slug: "eight-of-cups",
    name: "Eight of Cups",
    arcana: "minor",
    suit: "cups",
    number: 8,
    symbol: "💧 8",
    keyword: "Focused movement in emotion, relationships, and intuition",
    meaning:
      "The Eight of Cups points to swift progress or mastery that comes from narrowing your focus, playing out through emotion, relationships, and intuition.",
  },
  {
    slug: "nine-of-cups",
    name: "Nine of Cups",
    arcana: "minor",
    suit: "cups",
    number: 9,
    symbol: "💧 9",
    keyword: "Near completion in emotion, relationships, and intuition",
    meaning:
      "The Nine of Cups points to almost there — a stage of resilience, or quiet fulfilment just before the end, playing out through emotion, relationships, and intuition.",
  },
  {
    slug: "ten-of-cups",
    name: "Ten of Cups",
    arcana: "minor",
    suit: "cups",
    number: 10,
    symbol: "💧 10",
    keyword: "Culmination in emotion, relationships, and intuition",
    meaning:
      "The Ten of Cups points to the full outcome of this journey, for better or worse, and the transition into what's next, playing out through emotion, relationships, and intuition.",
  },
  {
    slug: "page-of-cups",
    name: "Page of Cups",
    arcana: "minor",
    suit: "cups",
    court: "page",
    number: 0,
    symbol: "💧 P",
    keyword: "A student or messenger, tied to emotion, relationships, and intuition",
    meaning:
      "The Page of Cups embodies curiosity, new information, or an early, still-forming stage of emotion, relationships, and intuition.",
  },
  {
    slug: "knight-of-cups",
    name: "Knight of Cups",
    arcana: "minor",
    suit: "cups",
    court: "knight",
    number: 0,
    symbol: "💧 K",
    keyword: "A pursuer in motion, tied to emotion, relationships, and intuition",
    meaning:
      "The Knight of Cups embodies bold, sometimes impulsive action driven by emotion, relationships, and intuition.",
  },
  {
    slug: "queen-of-cups",
    name: "Queen of Cups",
    arcana: "minor",
    suit: "cups",
    court: "queen",
    number: 0,
    symbol: "💧 Q",
    keyword: "An inward master, tied to emotion, relationships, and intuition",
    meaning:
      "The Queen of Cups embodies confident, nurturing command of emotion, relationships, and intuition.",
  },
  {
    slug: "king-of-cups",
    name: "King of Cups",
    arcana: "minor",
    suit: "cups",
    court: "king",
    number: 0,
    symbol: "💧 K",
    keyword: "An outward master, tied to emotion, relationships, and intuition",
    meaning:
      "The King of Cups embodies authoritative, seasoned command of emotion, relationships, and intuition.",
  },
  {
    slug: "ace-of-swords",
    name: "Ace of Swords",
    arcana: "minor",
    suit: "swords",
    number: 1,
    symbol: "⚔️ 1",
    keyword: "A burst of new potential in thought, conflict, and truth",
    meaning:
      "The Ace of Swords points to the very start of something in this area of life — raw, unshaped, and full of promise, playing out through thought, conflict, and truth.",
  },
  {
    slug: "two-of-swords",
    name: "Two of Swords",
    arcana: "minor",
    suit: "swords",
    number: 2,
    symbol: "⚔️ 2",
    keyword: "Balance and choice in thought, conflict, and truth",
    meaning:
      "The Two of Swords points to a decision or a partnership that asks you to weigh two paths carefully, playing out through thought, conflict, and truth.",
  },
  {
    slug: "three-of-swords",
    name: "Three of Swords",
    arcana: "minor",
    suit: "swords",
    number: 3,
    symbol: "⚔️ 3",
    keyword: "Growth through collaboration in thought, conflict, and truth",
    meaning:
      "The Three of Swords points to early progress that comes from working with others rather than alone, playing out through thought, conflict, and truth.",
  },
  {
    slug: "four-of-swords",
    name: "Four of Swords",
    arcana: "minor",
    suit: "swords",
    number: 4,
    symbol: "⚔️ 4",
    keyword: "Stability and pause in thought, conflict, and truth",
    meaning:
      "The Four of Swords points to a settled moment — solid ground, but also a plateau worth noticing, playing out through thought, conflict, and truth.",
  },
  {
    slug: "five-of-swords",
    name: "Five of Swords",
    arcana: "minor",
    suit: "swords",
    number: 5,
    symbol: "⚔️ 5",
    keyword: "Conflict and disruption in thought, conflict, and truth",
    meaning:
      "The Five of Swords points to friction or setback that shakes things up, testing what you're really built of, playing out through thought, conflict, and truth.",
  },
  {
    slug: "six-of-swords",
    name: "Six of Swords",
    arcana: "minor",
    suit: "swords",
    number: 6,
    symbol: "⚔️ 6",
    keyword: "Harmony and generosity in thought, conflict, and truth",
    meaning:
      "The Six of Swords points to a return to balance, often through cooperation, memory, or giving, playing out through thought, conflict, and truth.",
  },
  {
    slug: "seven-of-swords",
    name: "Seven of Swords",
    arcana: "minor",
    suit: "swords",
    number: 7,
    symbol: "⚔️ 7",
    keyword: "Reflection and assessment in thought, conflict, and truth",
    meaning:
      "The Seven of Swords points to a pause to take stock — questioning whether the current approach is working, playing out through thought, conflict, and truth.",
  },
  {
    slug: "eight-of-swords",
    name: "Eight of Swords",
    arcana: "minor",
    suit: "swords",
    number: 8,
    symbol: "⚔️ 8",
    keyword: "Focused movement in thought, conflict, and truth",
    meaning:
      "The Eight of Swords points to swift progress or mastery that comes from narrowing your focus, playing out through thought, conflict, and truth.",
  },
  {
    slug: "nine-of-swords",
    name: "Nine of Swords",
    arcana: "minor",
    suit: "swords",
    number: 9,
    symbol: "⚔️ 9",
    keyword: "Near completion in thought, conflict, and truth",
    meaning:
      "The Nine of Swords points to almost there — a stage of resilience, or quiet fulfilment just before the end, playing out through thought, conflict, and truth.",
  },
  {
    slug: "ten-of-swords",
    name: "Ten of Swords",
    arcana: "minor",
    suit: "swords",
    number: 10,
    symbol: "⚔️ 10",
    keyword: "Culmination in thought, conflict, and truth",
    meaning:
      "The Ten of Swords points to the full outcome of this journey, for better or worse, and the transition into what's next, playing out through thought, conflict, and truth.",
  },
  {
    slug: "page-of-swords",
    name: "Page of Swords",
    arcana: "minor",
    suit: "swords",
    court: "page",
    number: 0,
    symbol: "⚔️ P",
    keyword: "A student or messenger, tied to thought, conflict, and truth",
    meaning:
      "The Page of Swords embodies curiosity, new information, or an early, still-forming stage of thought, conflict, and truth.",
  },
  {
    slug: "knight-of-swords",
    name: "Knight of Swords",
    arcana: "minor",
    suit: "swords",
    court: "knight",
    number: 0,
    symbol: "⚔️ K",
    keyword: "A pursuer in motion, tied to thought, conflict, and truth",
    meaning:
      "The Knight of Swords embodies bold, sometimes impulsive action driven by thought, conflict, and truth.",
  },
  {
    slug: "queen-of-swords",
    name: "Queen of Swords",
    arcana: "minor",
    suit: "swords",
    court: "queen",
    number: 0,
    symbol: "⚔️ Q",
    keyword: "An inward master, tied to thought, conflict, and truth",
    meaning:
      "The Queen of Swords embodies confident, nurturing command of thought, conflict, and truth.",
  },
  {
    slug: "king-of-swords",
    name: "King of Swords",
    arcana: "minor",
    suit: "swords",
    court: "king",
    number: 0,
    symbol: "⚔️ K",
    keyword: "An outward master, tied to thought, conflict, and truth",
    meaning:
      "The King of Swords embodies authoritative, seasoned command of thought, conflict, and truth.",
  },
  {
    slug: "ace-of-pentacles",
    name: "Ace of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: 1,
    symbol: "🪙 1",
    keyword: "A burst of new potential in money, work, and the material world",
    meaning:
      "The Ace of Pentacles points to the very start of something in this area of life — raw, unshaped, and full of promise, playing out through money, work, and the material world.",
  },
  {
    slug: "two-of-pentacles",
    name: "Two of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: 2,
    symbol: "🪙 2",
    keyword: "Balance and choice in money, work, and the material world",
    meaning:
      "The Two of Pentacles points to a decision or a partnership that asks you to weigh two paths carefully, playing out through money, work, and the material world.",
  },
  {
    slug: "three-of-pentacles",
    name: "Three of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: 3,
    symbol: "🪙 3",
    keyword: "Growth through collaboration in money, work, and the material world",
    meaning:
      "The Three of Pentacles points to early progress that comes from working with others rather than alone, playing out through money, work, and the material world.",
  },
  {
    slug: "four-of-pentacles",
    name: "Four of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: 4,
    symbol: "🪙 4",
    keyword: "Stability and pause in money, work, and the material world",
    meaning:
      "The Four of Pentacles points to a settled moment — solid ground, but also a plateau worth noticing, playing out through money, work, and the material world.",
  },
  {
    slug: "five-of-pentacles",
    name: "Five of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: 5,
    symbol: "🪙 5",
    keyword: "Conflict and disruption in money, work, and the material world",
    meaning:
      "The Five of Pentacles points to friction or setback that shakes things up, testing what you're really built of, playing out through money, work, and the material world.",
  },
  {
    slug: "six-of-pentacles",
    name: "Six of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: 6,
    symbol: "🪙 6",
    keyword: "Harmony and generosity in money, work, and the material world",
    meaning:
      "The Six of Pentacles points to a return to balance, often through cooperation, memory, or giving, playing out through money, work, and the material world.",
  },
  {
    slug: "seven-of-pentacles",
    name: "Seven of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: 7,
    symbol: "🪙 7",
    keyword: "Reflection and assessment in money, work, and the material world",
    meaning:
      "The Seven of Pentacles points to a pause to take stock — questioning whether the current approach is working, playing out through money, work, and the material world.",
  },
  {
    slug: "eight-of-pentacles",
    name: "Eight of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: 8,
    symbol: "🪙 8",
    keyword: "Focused movement in money, work, and the material world",
    meaning:
      "The Eight of Pentacles points to swift progress or mastery that comes from narrowing your focus, playing out through money, work, and the material world.",
  },
  {
    slug: "nine-of-pentacles",
    name: "Nine of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: 9,
    symbol: "🪙 9",
    keyword: "Near completion in money, work, and the material world",
    meaning:
      "The Nine of Pentacles points to almost there — a stage of resilience, or quiet fulfilment just before the end, playing out through money, work, and the material world.",
  },
  {
    slug: "ten-of-pentacles",
    name: "Ten of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    number: 10,
    symbol: "🪙 10",
    keyword: "Culmination in money, work, and the material world",
    meaning:
      "The Ten of Pentacles points to the full outcome of this journey, for better or worse, and the transition into what's next, playing out through money, work, and the material world.",
  },
  {
    slug: "page-of-pentacles",
    name: "Page of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    court: "page",
    number: 0,
    symbol: "🪙 P",
    keyword: "A student or messenger, tied to money, work, and the material world",
    meaning:
      "The Page of Pentacles embodies curiosity, new information, or an early, still-forming stage of money, work, and the material world.",
  },
  {
    slug: "knight-of-pentacles",
    name: "Knight of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    court: "knight",
    number: 0,
    symbol: "🪙 K",
    keyword: "A pursuer in motion, tied to money, work, and the material world",
    meaning:
      "The Knight of Pentacles embodies bold, sometimes impulsive action driven by money, work, and the material world.",
  },
  {
    slug: "queen-of-pentacles",
    name: "Queen of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    court: "queen",
    number: 0,
    symbol: "🪙 Q",
    keyword: "An inward master, tied to money, work, and the material world",
    meaning:
      "The Queen of Pentacles embodies confident, nurturing command of money, work, and the material world.",
  },
  {
    slug: "king-of-pentacles",
    name: "King of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    court: "king",
    number: 0,
    symbol: "🪙 K",
    keyword: "An outward master, tied to money, work, and the material world",
    meaning:
      "The King of Pentacles embodies authoritative, seasoned command of money, work, and the material world.",
  },
];

export function getCardBySlug(slug: string): TarotCard | undefined {
  return tarotDeck.find((c) => c.slug === slug);
}

// Draws `count` unique cards from the full deck at random. Used by the
// reading pages to deal a fresh, non-repeating spread each time.
export function drawCards(count: number): TarotCard[] {
  const pool = [...tarotDeck];
  const drawn: TarotCard[] = [];
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    drawn.push(pool[idx]);
    pool.splice(idx, 1);
  }
  return drawn;
}

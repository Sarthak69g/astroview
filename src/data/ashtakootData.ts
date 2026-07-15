// src/data/ashtakootData.ts
//
// Reference tables for computing the 8-koota Ashtakoot Guna Milan
// ourselves, when Prokerala's account tier doesn't return the paid
// per-koota breakdown (data.guna_milan.guna). This is classical, public
// Vedic astrology data — the same tables every Kundli matching
// calculator (AstroSage, Prokerala itself, etc.) is built on — computed
// from the nakshatra + rashi (moon sign) that Prokerala's free tier
// already returns per person, no paid credits required.
//
// CONFIDENCE NOTE (read before treating this as "final"):
// - NAKSHATRA_TABLE (gana, nadi, yoni), RASHI_TABLE (lord, varna), the
//   Tara/Bhakoot/Nadi/Gana/Varna *rules* are simple counting/threshold
//   rules — high confidence, low risk of error.
// - VASHYA_GROUP, YONI_COMPAT and GRAHA_MAITRI are lookup *grids*
//   reconstructed from the standard published tables. Grids are more
//   error-prone to hand-transcribe than counting rules. Recommend
//   spot-checking 5-10 known couples against a trusted calculator
//   (Prokerala's own advanced tier once available, or AstroSage) before
//   treating these three kootas' scores as final for production users.

export type Gana = "deva" | "manushya" | "rakshasa";
export type Nadi = "aadi" | "madhya" | "antya";
export type VashyaGroup = "chatushpada" | "manava" | "jalachara" | "vanachara" | "keeta";
export type Varna = "brahmin" | "kshatriya" | "vaishya" | "shudra";
export type Planet = "sun" | "moon" | "mars" | "mercury" | "jupiter" | "venus" | "saturn";

export interface NakshatraRef {
  index: number; // 1-27
  name: string;
  aliases: string[];
  gana: Gana;
  nadi: Nadi;
  yoni: string; // animal
  yoniGender: "m" | "f";
}

export interface RashiRef {
  index: number; // 1-12, Aries = 1
  name: string;
  aliases: string[];
  lord: Planet;
  varna: Varna;
  vashya: VashyaGroup;
}

// 27 Nakshatras in classical order. Gana/Nadi/Yoni are the standard
// Ashtakoot reference values.
export const NAKSHATRA_TABLE: NakshatraRef[] = [
  { index: 1, name: "Ashwini", aliases: ["ashwini", "aswini"], gana: "deva", nadi: "aadi", yoni: "horse", yoniGender: "m" },
  { index: 2, name: "Bharani", aliases: ["bharani"], gana: "manushya", nadi: "madhya", yoni: "elephant", yoniGender: "m" },
  { index: 3, name: "Krittika", aliases: ["krittika", "krithika", "kartika"], gana: "rakshasa", nadi: "antya", yoni: "goat", yoniGender: "f" },
  { index: 4, name: "Rohini", aliases: ["rohini"], gana: "manushya", nadi: "antya", yoni: "serpent", yoniGender: "m" },
  { index: 5, name: "Mrigashira", aliases: ["mrigashira", "mrigasira", "mrigashirsha"], gana: "deva", nadi: "madhya", yoni: "serpent", yoniGender: "f" },
  { index: 6, name: "Ardra", aliases: ["ardra", "arudra"], gana: "manushya", nadi: "aadi", yoni: "dog", yoniGender: "f" },
  { index: 7, name: "Punarvasu", aliases: ["punarvasu"], gana: "deva", nadi: "aadi", yoni: "cat", yoniGender: "f" },
  { index: 8, name: "Pushya", aliases: ["pushya", "pushyami"], gana: "deva", nadi: "madhya", yoni: "goat", yoniGender: "m" },
  { index: 9, name: "Ashlesha", aliases: ["ashlesha", "aslesha"], gana: "rakshasa", nadi: "antya", yoni: "cat", yoniGender: "m" },
  { index: 10, name: "Magha", aliases: ["magha"], gana: "rakshasa", nadi: "antya", yoni: "rat", yoniGender: "m" },
  { index: 11, name: "Purva Phalguni", aliases: ["purva phalguni", "purvaphalguni", "pubba"], gana: "manushya", nadi: "madhya", yoni: "rat", yoniGender: "f" },
  { index: 12, name: "Uttara Phalguni", aliases: ["uttara phalguni", "uttaraphalguni", "uttiram"], gana: "manushya", nadi: "aadi", yoni: "cow", yoniGender: "m" },
  { index: 13, name: "Hasta", aliases: ["hasta"], gana: "deva", nadi: "aadi", yoni: "buffalo", yoniGender: "f" },
  { index: 14, name: "Chitra", aliases: ["chitra", "chithra"], gana: "rakshasa", nadi: "madhya", yoni: "tiger", yoniGender: "f" },
  { index: 15, name: "Swati", aliases: ["swati", "swathi"], gana: "deva", nadi: "antya", yoni: "buffalo", yoniGender: "m" },
  { index: 16, name: "Vishakha", aliases: ["vishakha", "visakha"], gana: "rakshasa", nadi: "antya", yoni: "tiger", yoniGender: "m" },
  { index: 17, name: "Anuradha", aliases: ["anuradha"], gana: "deva", nadi: "madhya", yoni: "deer", yoniGender: "f" },
  { index: 18, name: "Jyeshtha", aliases: ["jyeshtha", "jyeshta"], gana: "rakshasa", nadi: "aadi", yoni: "deer", yoniGender: "m" },
  { index: 19, name: "Mula", aliases: ["mula", "moola"], gana: "rakshasa", nadi: "aadi", yoni: "dog", yoniGender: "m" },
  { index: 20, name: "Purva Ashadha", aliases: ["purva ashadha", "purvashada", "poorvashada"], gana: "manushya", nadi: "madhya", yoni: "monkey", yoniGender: "f" },
  { index: 21, name: "Uttara Ashadha", aliases: ["uttara ashadha", "uttarashada", "uttarashadha"], gana: "manushya", nadi: "antya", yoni: "mongoose", yoniGender: "m" },
  { index: 22, name: "Shravana", aliases: ["shravana", "sravana"], gana: "deva", nadi: "antya", yoni: "monkey", yoniGender: "m" },
  { index: 23, name: "Dhanishta", aliases: ["dhanishta", "dhanishtha", "dhanista"], gana: "rakshasa", nadi: "madhya", yoni: "lion", yoniGender: "f" },
  { index: 24, name: "Shatabhisha", aliases: ["shatabhisha", "satabhisha", "sadabhisha"], gana: "rakshasa", nadi: "aadi", yoni: "horse", yoniGender: "f" },
  { index: 25, name: "Purva Bhadrapada", aliases: ["purva bhadrapada", "poorvabhadra", "purvabhadrapada"], gana: "manushya", nadi: "aadi", yoni: "lion", yoniGender: "m" },
  { index: 26, name: "Uttara Bhadrapada", aliases: ["uttara bhadrapada", "uttarabhadra", "uttarabhadrapada"], gana: "manushya", nadi: "madhya", yoni: "cow", yoniGender: "f" },
  { index: 27, name: "Revati", aliases: ["revati"], gana: "deva", nadi: "antya", yoni: "elephant", yoniGender: "f" },
];

// 12 Rashis (moon signs). Varna groups per classical rule: Brahmin
// (Cancer, Scorpio, Pisces), Kshatriya (Leo, Aries, Sagittarius),
// Vaishya (Taurus, Virgo, Capricorn), Shudra (Gemini, Libra, Aquarius).
// Vashya group uses the common simplified whole-sign mapping (see
// confidence note above re: half-sign nuance for Sagittarius/Capricorn).
export const RASHI_TABLE: RashiRef[] = [
  { index: 1, name: "Aries", aliases: ["aries", "mesha"], lord: "mars", varna: "kshatriya", vashya: "chatushpada" },
  { index: 2, name: "Taurus", aliases: ["taurus", "vrishabha", "vrishabh"], lord: "venus", varna: "vaishya", vashya: "chatushpada" },
  { index: 3, name: "Gemini", aliases: ["gemini", "mithuna"], lord: "mercury", varna: "shudra", vashya: "manava" },
  { index: 4, name: "Cancer", aliases: ["cancer", "karka", "kataka"], lord: "moon", varna: "brahmin", vashya: "jalachara" },
  { index: 5, name: "Leo", aliases: ["leo", "simha"], lord: "sun", varna: "kshatriya", vashya: "vanachara" },
  { index: 6, name: "Virgo", aliases: ["virgo", "kanya"], lord: "mercury", varna: "vaishya", vashya: "manava" },
  { index: 7, name: "Libra", aliases: ["libra", "tula"], lord: "venus", varna: "shudra", vashya: "manava" },
  { index: 8, name: "Scorpio", aliases: ["scorpio", "vrishchika", "vrischika"], lord: "mars", varna: "brahmin", vashya: "keeta" },
  { index: 9, name: "Sagittarius", aliases: ["sagittarius", "dhanu", "dhanus"], lord: "jupiter", varna: "kshatriya", vashya: "chatushpada" },
  { index: 10, name: "Capricorn", aliases: ["capricorn", "makara"], lord: "saturn", varna: "vaishya", vashya: "jalachara" },
  { index: 11, name: "Aquarius", aliases: ["aquarius", "kumbha"], lord: "saturn", varna: "shudra", vashya: "manava" },
  { index: 12, name: "Pisces", aliases: ["pisces", "meena", "meenam"], lord: "jupiter", varna: "brahmin", vashya: "jalachara" },
];

// Naisargika Maitri — the classical natural-friendship table between the
// 7 grahas that rule the 12 rashis. Used for Graha Maitri koota.
export const GRAHA_FRIENDSHIP: Record<Planet, { friends: Planet[]; enemies: Planet[] }> = {
  sun: { friends: ["moon", "mars", "jupiter"], enemies: ["venus", "saturn"] },
  moon: { friends: ["sun", "mercury"], enemies: [] },
  mars: { friends: ["sun", "moon", "jupiter"], enemies: ["mercury"] },
  mercury: { friends: ["sun", "venus"], enemies: ["moon"] },
  jupiter: { friends: ["sun", "moon", "mars"], enemies: ["mercury", "venus"] },
  venus: { friends: ["mercury", "saturn"], enemies: ["sun", "moon"] },
  saturn: { friends: ["mercury", "venus"], enemies: ["sun", "moon", "mars"] },
};

// Vashya compatibility grid (points out of 2), simplified whole-sign
// version — see confidence note at top of file.
export const VASHYA_GRID: Record<VashyaGroup, Record<VashyaGroup, number>> = {
  chatushpada: { chatushpada: 2, manava: 1, jalachara: 0, vanachara: 0, keeta: 0.5 },
  manava: { chatushpada: 1, manava: 2, jalachara: 1, vanachara: 0, keeta: 1 },
  jalachara: { chatushpada: 0, manava: 1, jalachara: 2, vanachara: 0.5, keeta: 0.5 },
  vanachara: { chatushpada: 0, manava: 0, jalachara: 0.5, vanachara: 2, keeta: 0 },
  keeta: { chatushpada: 0.5, manava: 1, jalachara: 0.5, vanachara: 0, keeta: 2 },
};

// Yoni enmity pairs (the well-documented "extreme enemy" pairs) score 0.
// Same yoni scores 4 (max). Everything else is treated as neutral (2) —
// a deliberate simplification that avoids guessing at the intermediate
// "friendly" tier from memory (see confidence note at top of file).
export const YONI_ENEMY_PAIRS: Array<[string, string]> = [
  ["cow", "tiger"],
  ["elephant", "lion"],
  ["horse", "buffalo"],
  ["dog", "deer"],
  ["goat", "monkey"],
  ["serpent", "mongoose"],
  ["rat", "cat"],
];

export function findNakshatra(name: string | undefined | null): NakshatraRef | null {
  if (!name) return null;
  const key = name.trim().toLowerCase();
  return NAKSHATRA_TABLE.find((n) => n.aliases.includes(key) || n.name.toLowerCase() === key) ?? null;
}

export function findRashi(name: string | undefined | null): RashiRef | null {
  if (!name) return null;
  const key = name.trim().toLowerCase();
  return RASHI_TABLE.find((r) => r.aliases.includes(key) || r.name.toLowerCase() === key) ?? null;
}

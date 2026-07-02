// src/lib/numerology.ts
// Pure calculation functions for the three core Pythagorean numerology
// numbers. No I/O, no DOM — safe to unit test and safe to run on either
// the client or the server.

const MASTER_NUMBERS = new Set([11, 22, 33]);

// Pythagorean letter → number mapping (1-9, repeating every 9 letters).
const LETTER_VALUES: Record<string, number> = {
  a: 1, j: 1, s: 1,
  b: 2, k: 2, t: 2,
  c: 3, l: 3, u: 3,
  d: 4, m: 4, v: 4,
  e: 5, n: 5, w: 5,
  f: 6, o: 6, x: 6,
  g: 7, p: 7, y: 7,
  h: 8, q: 8, z: 8,
  i: 9, r: 9,
};

const VOWELS = new Set(["a", "e", "i", "o", "u"]);

/**
 * Reduces a number to a single digit (1-9), unless it lands on a Master
 * Number (11, 22, 33) partway through — those are preserved rather than
 * reduced further.
 */
export function reduceNumber(input: number): number {
  let n = Math.abs(Math.trunc(input));
  if (MASTER_NUMBERS.has(n)) return n;

  while (n > 9) {
    if (MASTER_NUMBERS.has(n)) return n;
    n = String(n)
      .split("")
      .reduce((sum, digit) => sum + Number(digit), 0);
  }
  return n;
}

function sumDigits(str: string): number {
  return str
    .split("")
    .filter((c) => /\d/.test(c))
    .reduce((sum, digit) => sum + Number(digit), 0);
}

export interface BirthDate {
  day: number;
  month: number;
  year: number;
}

/**
 * Life Path Number — derived entirely from the birth date. Reduces
 * day, month, and year separately first (preserving Master Numbers at
 * each step), then sums and reduces the result.
 */
export function calculateLifePath({ day, month, year }: BirthDate): number {
  const d = reduceNumber(sumDigits(String(day)));
  const m = reduceNumber(sumDigits(String(month)));
  const y = reduceNumber(sumDigits(String(year)));
  return reduceNumber(d + m + y);
}

function lettersOnly(name: string): string {
  return name.toLowerCase().replace(/[^a-z]/g, "");
}

/**
 * Destiny / Expression Number — derived from every letter in the full
 * birth name.
 */
export function calculateDestiny(fullName: string): number {
  const letters = lettersOnly(fullName);
  if (!letters) return 0;
  const total = letters
    .split("")
    .reduce((sum, ch) => sum + (LETTER_VALUES[ch] ?? 0), 0);
  return reduceNumber(total);
}

/**
 * Soul Urge / Heart's Desire Number — derived from the vowels only in
 * the full birth name.
 */
export function calculateSoulUrge(fullName: string): number {
  const letters = lettersOnly(fullName);
  const vowelSum = letters
    .split("")
    .filter((ch) => VOWELS.has(ch))
    .reduce((sum, ch) => sum + (LETTER_VALUES[ch] ?? 0), 0);
  if (vowelSum === 0) return 0;
  return reduceNumber(vowelSum);
}

export interface NumerologyProfile {
  lifePath: number;
  destiny: number;
  soulUrge: number;
}

export function calculateNumerologyProfile(fullName: string, dob: BirthDate): NumerologyProfile {
  return {
    lifePath: calculateLifePath(dob),
    destiny: calculateDestiny(fullName),
    soulUrge: calculateSoulUrge(fullName),
  };
}

// src/lib/astro/ashtakoot.ts
//
// Computes the full 8-koota Ashtakoot Guna Milan ourselves, from each
// partner's nakshatra + rashi (moon sign) — which Prokerala's
// kundli-matching endpoint returns on every account tier via
// girl_info.nakshatra/rasi and boy_info.nakshatra/rasi. This lets us show
// a real per-koota breakdown today, without waiting on a paid-tier
// upgrade for Prokerala's own guna_milan.guna array.
//
// See src/data/ashtakootData.ts for the reference tables and a note on
// which rules are simple/high-confidence vs. grid-based/worth spot-
// checking before final production sign-off.

import {
  NAKSHATRA_TABLE,
  RASHI_TABLE,
  GRAHA_FRIENDSHIP,
  VASHYA_GRID,
  YONI_ENEMY_PAIRS,
  type NakshatraRef,
  type RashiRef,
} from "@/data/ashtakootData";

export interface PersonAstro {
  nakshatra: NakshatraRef;
  rashi: RashiRef;
}

export interface ComputedKoota {
  key: string;
  name: string;
  maxPoints: number;
  receivedPoints: number;
  boyValue: string;
  girlValue: string;
  matches: boolean;
  explanation: string;
}

function isYoniEnemy(a: string, b: string): boolean {
  return YONI_ENEMY_PAIRS.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
}

// Tara koota: count nakshatras from one partner to the other (inclusive),
// mod 9. Remainders 3, 5, 7 ("Vipat", "Pratyak", "Vadha") are
// inauspicious (0 points); the rest are auspicious (3 points). Checked
// both directions and the lower of the two governs.
function taraCount(fromIdx: number, toIdx: number): number {
  const diff = ((toIdx - fromIdx + 27) % 27) + 1;
  return ((diff - 1) % 9) + 1;
}

const TARA_INAUSPICIOUS = new Set([3, 5, 7]);

export function computeAshtakoot(boy: PersonAstro, girl: PersonAstro): ComputedKoota[] {
  const kootas: ComputedKoota[] = [];

  // 1. Varna (max 1) — spiritual/ego compatibility, by rashi varna class.
  // Classical rule: boy's varna should be equal to or "higher" than
  // girl's (Brahmin > Kshatriya > Vaishya > Shudra).
  {
    const rank: Record<string, number> = { brahmin: 4, kshatriya: 3, vaishya: 2, shudra: 1 };
    const boyRank = rank[boy.rashi.varna];
    const girlRank = rank[girl.rashi.varna];
    const matches = boyRank >= girlRank;
    kootas.push({
      key: "varna",
      name: "Varna",
      maxPoints: 1,
      receivedPoints: matches ? 1 : 0,
      boyValue: capitalize(boy.rashi.varna),
      girlValue: capitalize(girl.rashi.varna),
      matches,
      explanation: matches
        ? `${capitalize(boy.rashi.varna)} (boy) sits at or above ${capitalize(girl.rashi.varna)} (girl) in the Varna hierarchy, which classically supports ego and spiritual alignment.`
        : `${capitalize(girl.rashi.varna)} (girl) ranks above ${capitalize(boy.rashi.varna)} (boy) in the Varna hierarchy — traditionally a minor point of friction around ego and spiritual pace, though far from decisive on its own.`,
    });
  }

  // 2. Vashya (max 2) — mutual attraction/control, by rashi vashya group.
  {
    const points = VASHYA_GRID[boy.rashi.vashya][girl.rashi.vashya];
    kootas.push({
      key: "vashya",
      name: "Vashya",
      maxPoints: 2,
      receivedPoints: points,
      boyValue: capitalize(boy.rashi.vashya),
      girlValue: capitalize(girl.rashi.vashya),
      matches: points >= 1.5,
      explanation:
        points >= 1.5
          ? `${capitalize(boy.rashi.vashya)} and ${capitalize(girl.rashi.vashya)} groups pull well together — a good sign for mutual attraction and neither partner feeling controlled by the other.`
          : points > 0
            ? `${capitalize(boy.rashi.vashya)} and ${capitalize(girl.rashi.vashya)} groups show partial compatibility — attraction is present but the balance of influence may lean one way.`
            : `${capitalize(boy.rashi.vashya)} and ${capitalize(girl.rashi.vashya)} groups are classically distant, which can mean one partner feels they have less sway in the relationship than the other.`,
    });
  }

  // 3. Tara (max 3) — health/wellbeing/destiny, nakshatra count.
  {
    const t1 = taraCount(girl.nakshatra.index, boy.nakshatra.index);
    const t2 = taraCount(boy.nakshatra.index, girl.nakshatra.index);
    const bad = TARA_INAUSPICIOUS.has(t1) || TARA_INAUSPICIOUS.has(t2);
    kootas.push({
      key: "tara",
      name: "Tara",
      maxPoints: 3,
      receivedPoints: bad ? 0 : 3,
      boyValue: boy.nakshatra.name,
      girlValue: girl.nakshatra.name,
      matches: !bad,
      explanation: bad
        ? `The nakshatra count between ${boy.nakshatra.name} and ${girl.nakshatra.name} falls on an inauspicious Tara — traditionally worth keeping an eye on general wellbeing and shared destiny.`
        : `The nakshatra count between ${boy.nakshatra.name} and ${girl.nakshatra.name} falls on a favorable Tara, a good sign for general health and mutual wellbeing.`,
    });
  }

  // 4. Yoni (max 4) — physical/sexual compatibility, by nakshatra animal.
  {
    const boyYoni = boy.nakshatra.yoni;
    const girlYoni = girl.nakshatra.yoni;
    let points: number;
    if (boyYoni === girlYoni) points = 4;
    else if (isYoniEnemy(boyYoni, girlYoni)) points = 0;
    else points = 2;
    kootas.push({
      key: "yoni",
      name: "Yoni",
      maxPoints: 4,
      receivedPoints: points,
      boyValue: capitalize(boyYoni),
      girlValue: capitalize(girlYoni),
      matches: points >= 2,
      explanation:
        points === 4
          ? `Both partners share the ${capitalize(boyYoni)} Yoni — the strongest possible physical/instinctive compatibility this koota measures.`
          : points === 0
            ? `${capitalize(boyYoni)} and ${capitalize(girlYoni)} are classical Yoni enemies, traditionally flagged as friction in physical/intimate compatibility.`
            : `${capitalize(boyYoni)} and ${capitalize(girlYoni)} are neither the same nor natural enemies — a workable, neutral physical compatibility.`,
    });
  }

  // 5. Graha Maitri (max 5) — mental compatibility, by rashi lord friendship.
  {
    const boyLord = boy.rashi.lord;
    const girlLord = girl.rashi.lord;
    let points: number;
    if (boyLord === girlLord) points = 5;
    else {
      const boyFriendly = GRAHA_FRIENDSHIP[boyLord].friends.includes(girlLord);
      const girlFriendly = GRAHA_FRIENDSHIP[girlLord].friends.includes(boyLord);
      const boyEnemy = GRAHA_FRIENDSHIP[boyLord].enemies.includes(girlLord);
      const girlEnemy = GRAHA_FRIENDSHIP[girlLord].enemies.includes(boyLord);
      if (boyFriendly && girlFriendly) points = 4;
      else if ((boyFriendly && !girlEnemy) || (girlFriendly && !boyEnemy)) points = 3;
      else if (boyEnemy && girlEnemy) points = 0;
      else if (boyEnemy || girlEnemy) points = 1;
      else points = 2;
    }
    kootas.push({
      key: "graha_maitri",
      name: "Graha Maitri",
      maxPoints: 5,
      receivedPoints: points,
      boyValue: `${capitalize(boy.rashi.name)} (${capitalize(boyLord)})`,
      girlValue: `${capitalize(girl.rashi.name)} (${capitalize(girlLord)})`,
      matches: points >= 3,
      explanation:
        points >= 3
          ? `${capitalize(boyLord)} and ${capitalize(girlLord)} — the rulers of each partner's moon sign — get along well classically, a good sign for intellectual connection and easy communication.`
          : `${capitalize(boyLord)} and ${capitalize(girlLord)} aren't natural allies in the classical friendship table, which can mean communication or shared values take more conscious effort.`,
    });
  }

  // 6. Gana (max 6) — temperament, by nakshatra gana class.
  {
    const boyGana = boy.nakshatra.gana;
    const girlGana = girl.nakshatra.gana;
    let points: number;
    if (boyGana === girlGana) points = 6;
    else if (
      (boyGana === "deva" && girlGana === "manushya") ||
      (boyGana === "manushya" && girlGana === "deva")
    )
      points = 5;
    else if (
      (boyGana === "manushya" && girlGana === "rakshasa") ||
      (boyGana === "rakshasa" && girlGana === "manushya")
    )
      points = 1;
    else points = 0; // deva/rakshasa clash
    kootas.push({
      key: "gana",
      name: "Gana",
      maxPoints: 6,
      receivedPoints: points,
      boyValue: capitalize(boyGana),
      girlValue: capitalize(girlGana),
      matches: points >= 5,
      explanation:
        points >= 5
          ? `Both temperaments (${capitalize(boyGana)}/${capitalize(girlGana)}) align well classically — a good sign for how naturally the partners' underlying natures get along.`
          : points >= 1
            ? `${capitalize(boyGana)} and ${capitalize(girlGana)} Ganas are a workable but imperfect pairing — some temperament adjustment is classically expected.`
            : `${capitalize(boyGana)} and ${capitalize(girlGana)} Ganas are considered classically opposed — worth being mindful of temperament differences.`,
    });
  }

  // 7. Bhakoot (max 7) — love/family/prosperity, by rashi distance.
  {
    const dist = ((girl.rashi.index - boy.rashi.index + 12) % 12) + 1;
    const bad = dist === 6 || dist === 8 || dist === 2 || dist === 12;
    kootas.push({
      key: "bhakoot",
      name: "Bhakoot",
      maxPoints: 7,
      receivedPoints: bad ? 0 : 7,
      boyValue: capitalize(boy.rashi.name),
      girlValue: capitalize(girl.rashi.name),
      matches: !bad,
      explanation: bad
        ? `${capitalize(boy.rashi.name)} and ${capitalize(girl.rashi.name)} sit in a classically difficult 2/12 or 6/8 relationship from each other — traditionally the koota to look at more closely for family and financial harmony.`
        : `${capitalize(boy.rashi.name)} and ${capitalize(girl.rashi.name)} sit in a favorable relationship from each other, a good classical sign for love and prosperity in the family the couple builds.`,
    });
  }

  // 8. Nadi (max 8) — health of offspring/genetic compatibility.
  {
    const same = boy.nakshatra.nadi === girl.nakshatra.nadi;
    kootas.push({
      key: "nadi",
      name: "Nadi",
      maxPoints: 8,
      receivedPoints: same ? 0 : 8,
      boyValue: capitalize(boy.nakshatra.nadi),
      girlValue: capitalize(girl.nakshatra.nadi),
      matches: !same,
      explanation: same
        ? `Both partners share the same ${capitalize(boy.nakshatra.nadi)} Nadi — traditionally the most heavily weighted flag in Ashtakoot, worth discussing with a professional astrologer regardless of the overall total.`
        : `${capitalize(boy.nakshatra.nadi)} and ${capitalize(girl.nakshatra.nadi)} Nadis differ, which is the classically favorable outcome for this koota.`,
    });
  }

  return kootas;
}

export function ashtakootTotal(kootas: ComputedKoota[]): number {
  return kootas.reduce((sum, k) => sum + k.receivedPoints, 0);
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

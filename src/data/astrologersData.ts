// src/data/astrologersData.ts
//
// PHASE 2: this used to be a static array of 12 fully-fake astrologers.
// It's now a set of types + pure mapping/helper functions over REAL records
// from POST /Astrologer/GetAllAstrologersGrid (see lib/api/astrologer.functions.ts)
// — there's no astrologers[] constant anymore. Routes fetch the live list
// themselves and pass it through mapGridRecordToAstrologer.
//
// Fields the real backend doesn't provide yet (bio, star rating, order
// count, review count, "Top Choice"/"New"/"Celebrity" badges) are left
// optional and simply not rendered, rather than fabricated — showing a made
// up "4.9 (3,010 reviews)" next to a real person's real name would be
// actively misleading. Revisit once/if the backend adds a ratings system.
//
// `modes` stays hardcoded to ["Chat", "Call"] for now — that's a UI-level
// "what buttons show" concern, not something the grid API reports, and Call
// isn't live yet regardless (still routes through handleConsultAction's
// "coming soon" toast until Phase 4+ wires an actual voice/video backend).

import type { AstrologerGridRecord, AstrologerDetailRecord } from "@/lib/api/astrologer.functions";
import type { DropdownOption } from "@/lib/api/dropdowns.functions";

export type ConsultMode = "Chat" | "Call";

export interface Astrologer {
  id: string; // UserId, stringified — the real stable identifier
  slug: string; // slugified name + "-" + id, so URLs stay human-readable
  name: string;
  avatarSeed: string;
  skills: string[]; // raw PrimarySkill string(s) from the backend, not slugs
  languages: string[];
  experienceYears: number;
  pricePerMin: number;
  isOnline: boolean;
  modes: ConsultMode[];
  // Not provided by the backend yet — optional, UI hides these when absent.
  bio?: string;
  badge?: "New" | "Top Choice" | "Celebrity";
  rating?: number;
  orders?: number;
  reviews?: number;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "astrologer";
}

// StatusId 1 = Available/online — confirmed in AstroCard.jsx
// ("CRITICAL FIX: The database uses 1 for 'Available'").
function isAvailable(statusId?: number): boolean {
  return statusId === 1;
}

export function mapGridRecordToAstrologer(raw: AstrologerGridRecord): Astrologer {
  const userId = raw.UserId ?? raw.userId ?? raw.Id ?? 0;
  const id = String(userId);
  const name = raw.FullName?.trim() || "Astrologer";
  const slug = `${slugify(name)}-${id}`;

  const languages = raw.Languages
    ? String(raw.Languages)
        .split(",")
        .map((l) => l.trim())
        .filter(Boolean)
    : [];

  const skills = raw.PrimarySkill
    ? String(raw.PrimarySkill)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return {
    id,
    slug,
    name,
    avatarSeed: name,
    skills,
    languages,
    experienceYears: raw.ExperienceYears ?? 0,
    pricePerMin: raw.ChargesPerMinute ?? 0,
    isOnline: isAvailable(raw.StatusId ?? raw.statusId),
    modes: ["Chat", "Call"],
  };
}

// For the getAstrologer/{id} fallback path only (deep link that missed the
// cached grid page) — this record is camelCase and gives IDs, not names,
// for skills/languages, so the caller must fetch getSkillOptions() /
// getLanguageOptions() first and pass them in here to resolve. aboutMe is
// the one real bio-equivalent field the backend has — surfaced as `bio`.
export function mapDetailRecordToAstrologer(
  raw: AstrologerDetailRecord,
  skillOptions: DropdownOption[],
  languageOptions: DropdownOption[],
): Astrologer {
  const userId = raw.userId ?? 0;
  const id = String(userId);
  const name = raw.fullName?.trim() || "Astrologer";
  const slug = `${slugify(name)}-${id}`;

  const skillIds = (raw.primarySkillIds ?? []).map(String);
  const languageIds = (raw.languageIds ?? []).map(String);
  const skills = skillOptions.filter((o) => skillIds.includes(String(o.id))).map((o) => o.name);
  const languages = languageOptions.filter((o) => languageIds.includes(String(o.id))).map((o) => o.name);

  return {
    id,
    slug,
    name,
    avatarSeed: name,
    skills,
    languages,
    experienceYears: raw.experienceYears ?? 0,
    pricePerMin: raw.chargesPerMinute ?? 0,
    isOnline: isAvailable(raw.statusId),
    modes: ["Chat", "Call"],
    bio: raw.aboutMe?.trim() || undefined,
  };
}

export function formatOrders(n: number): string {
  if (n >= 1000) return `${Math.floor(n / 1000)}k+`;
  return `${n}`;
}

export function getAstrologerBySlug(list: Astrologer[], slug: string): Astrologer | undefined {
  return list.find((a) => a.slug === slug);
}

// Fallback for when a direct detail fetch is needed but we only have the
// slug (e.g. a deep link / page refresh with no in-memory list yet) — the
// UserId is always the trailing numeric segment we appended in the slug.
export function extractIdFromSlug(slug: string): string | null {
  const match = slug.match(/-(\d+)$/);
  return match ? match[1] : null;
}

export function relatedAstrologers(list: Astrologer[], current: Astrologer, count = 3): Astrologer[] {
  return list
    .filter(
      (a) => a.id !== current.id && a.skills.some((s) => current.skills.includes(s)),
    )
    .slice(0, count);
}

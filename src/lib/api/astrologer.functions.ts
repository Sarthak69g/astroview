// src/lib/api/astrologer.functions.ts
// Server-side proxy for the KamleshKhyati Astro API's astrologer directory —
// same host and envelope shape as auth.functions.ts / dropdowns.functions.ts
// ({ success, statusCode, message, data, errors }), different controller
// (/api/Astrologer).
//
// CONFIRMED against astro-admin-portal (Divyansh's build, same backend) —
// this is a straight port of the request/response shapes actually used in
// production there, not a guess from Swagger:
//   - AstrologerListing.jsx: POST /Astrologer/GetAllAstrologersGrid with
//     { screenCode: "ASTROLOGER_MASTER", pageIndex, pageSize, commonSearch,
//     primarySkill, isDeleted }, response unwraps to
//     { listData: [...], totalRecords } (see loadAstrologers()).
//   - AstroCard.jsx: the raw grid record is PascalCase — Id, UserId,
//     FullName, ExperienceYears, ChargesPerMinute, PrimarySkill,
//     ProfilePhotoGuid, Languages (comma-separated string, not an array),
//     StatusId (1 = Available/online).
//   - astrologerApi.js: GET /Astrologer/getAstrologer/{id} for a single
//     record (used for the detail page).
//
// Both endpoints go through axiosInstance on the admin portal side, which
// attaches a Bearer token whenever one exists in localStorage — meaning a
// logged-out browser can still hit these successfully there. We pass the
// AstroView token through the same way (optional, attached if present)
// rather than hard-requiring it, since we haven't independently confirmed
// the grid endpoint 401s for anonymous callers and don't want to break the
// public browse experience if it doesn't.
//
// Photos: getMediaBlobUrl (GET /Astrologer/media/{guid}, needs Bearer,
// responseType blob) is NOT wired up here on purpose — per Sarthak, Phase 2
// keeps the existing DiceBear avatar fallback for every astrologer instead
// of proxying real photos. Revisit if/when that's wanted; a createServerFn
// can't stream a blob straight to an <img src>, it'd need to come back as a
// base64 data URI.
//
// IMPORTANT CASING MISMATCH — confirmed by reading both real call sites in
// the admin portal, not assumed:
//   - GetAllAstrologersGrid (list)  -> PascalCase: FullName, ExperienceYears,
//     ChargesPerMinute, PrimarySkill (a name string), Languages (comma-
//     separated name string), ProfilePhotoGuid, UserId, StatusId, Id.
//   - getAstrologer/{id} (detail)   -> camelCase, and structurally
//     different: fullName, experienceYears, chargesPerMinute, aboutMe,
//     universityName, degree, primarySkillIds[] / languageIds[] (numeric
//     IDs, NOT names), profilePhotoGuid, isVerified. Confirmed against
//     AstroProfileView.jsx (the astrologer's own self-edit page), which
//     reads `p.fullName`, `p.aboutMe`, `p.primarySkillIds.map(String)`, etc.
//     straight off the getAstrologerById response.
// This is a genuine backend inconsistency (grid is a flattened DTO, detail
// is the raw entity with ASP.NET's default camelCase serialization) — not a
// typo on our side. The two response types below are kept separate on
// purpose so callers can't accidentally read PrimarySkill off a detail
// response or primarySkillIds off a grid record. Resolving the ID arrays
// to display names needs the /Dropdowns/skills and /Dropdowns/languages
// lookups (see dropdowns.functions.ts) — done at the call site, not here.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const API_BASE = "https://kgaapi.techascents.com/api/Astrologer";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function callApi(path: string, init: RequestInit, token?: string): Promise<any> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  const text = await res.text();
  const json = text ? safeJsonParse(text) : null;
  const envelope = json && typeof json === "object" ? (json as Record<string, unknown>) : null;

  if (!res.ok || (envelope && envelope.success === false)) {
    const message =
      envelope && typeof envelope.message === "string"
        ? envelope.message
        : `Astrologer API error (${res.status})`;
    // eslint-disable-next-line no-console
    console.error(`[AstrologerAPI] ${path} failed (${res.status}):`, message);
    throw new Error(message);
  }

  return envelope && "data" in envelope ? envelope.data : json;
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// Raw shape as it actually comes back from GetAllAstrologersGrid — PascalCase,
// per AstroCard.jsx. Every field optional and read defensively at the call
// site (see astrologersData.ts's mapGridRecordToAstrologer).
export interface AstrologerGridRecord {
  Id?: number;
  UserId?: number;
  userId?: number;
  FullName?: string;
  ExperienceYears?: number;
  ChargesPerMinute?: number;
  PrimarySkill?: string;
  ProfilePhotoGuid?: string | null;
  Languages?: string;
  StatusId?: number;
  statusId?: number;
}

export interface AstrologerGridResponse {
  listData?: AstrologerGridRecord[];
  totalRecords?: number;
}

// Raw shape from GET /Astrologer/getAstrologer/{id} — camelCase, and
// structurally different from the grid record above. See the file header
// comment for the confirmation trail. primarySkillIds/languageIds are
// numeric IDs that need resolving via getSkillOptions/getLanguageOptions
// (dropdowns.functions.ts) before they're display-ready.
export interface AstrologerDetailRecord {
  userId?: number;
  fullName?: string;
  experienceYears?: number;
  chargesPerMinute?: number;
  aboutMe?: string;
  universityName?: string;
  degree?: string;
  primarySkillIds?: (string | number)[];
  languageIds?: (string | number)[];
  profilePhotoGuid?: string | null;
  isVerified?: boolean;
  statusId?: number;
}

// --- POST /api/Astrologer/GetAllAstrologersGrid ---
export const getAstrologersGrid = createServerFn({ method: "POST" })
  .validator(
    z.object({
      token: z.string().optional(),
      commonSearch: z.string().optional().default(""),
      primarySkill: z.string().optional().default(""),
      pageIndex: z.number().optional().default(1),
      pageSize: z.number().optional().default(50),
    }),
  )
  .handler(async ({ data }) => {
    const { token, ...rest } = data;
    const payload = {
      screenCode: "ASTROLOGER_MASTER",
      isDeleted: false,
      ...rest,
    };
    const result: AstrologerGridResponse = await callApi(
      "/GetAllAstrologersGrid",
      { method: "POST", body: JSON.stringify(payload) },
      token,
    );
    return {
      listData: Array.isArray(result?.listData) ? result.listData : [],
      totalRecords: result?.totalRecords ?? 0,
    };
  });

// --- GET /api/Astrologer/getAstrologer/{id} ---
export const getAstrologerDetail = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.union([z.string(), z.number()]), token: z.string().optional() }))
  .handler(async ({ data }) => {
    const result = await callApi(`/getAstrologer/${data.id}`, { method: "GET" }, data.token);
    // AstroProfileView.jsx defends against a possible double-nested
    // `res?.data?.data ?? res?.data ?? res` — callApi already unwraps one
    // layer of envelope, so mirror the same defensiveness for the rest.
    const nested = (result as Record<string, unknown>)?.data;
    return (nested ?? result) as AstrologerDetailRecord;
  });

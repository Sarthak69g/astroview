// src/lib/api/dropdowns.functions.ts
// Server-side proxy for the KamleshKhyati Astro API's lookup/dropdown
// endpoints — same host and envelope shape as auth.functions.ts
// ({ success, statusCode, message, data, errors }), just a different
// controller (/api/Dropdowns instead of /api/User).
//
// These back the profile form's Gender / State / City fields. The backend
// stores these as numeric foreign keys (genderId, stateId, cityId), not
// free text — see UserProfile in the astro-admin-portal (Divyansh's build)
// for the reference implementation. Country is effectively fixed to India
// (id 1) for this project, same as the admin portal, but the dropdown is
// still fetched from the API rather than hardcoded in case that changes.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const API_BASE = "https://kgaapi.techascents.com/api/Dropdowns";

export interface DropdownOption {
  id: number;
  name: string;
}

async function callApi(path: string): Promise<DropdownOption[]> {
  const res = await fetch(`${API_BASE}${path}`);
  const text = await res.text();
  const json = text ? safeJsonParse(text) : null;
  const envelope = json && typeof json === "object" ? (json as Record<string, unknown>) : null;

  if (!res.ok || (envelope && envelope.success === false)) {
    const message =
      envelope && typeof envelope.message === "string"
        ? envelope.message
        : `Dropdowns API error (${res.status})`;
    // eslint-disable-next-line no-console
    console.error(`[DropdownsAPI] ${path} failed (${res.status}):`, message);
    throw new Error(message);
  }

  const data = envelope && "data" in envelope ? envelope.data : json;
  return Array.isArray(data) ? (data as DropdownOption[]) : [];
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// --- GET /api/Dropdowns/genders ---
export const getGenderOptions = createServerFn({ method: "GET" }).handler(async () => {
  return callApi("/genders");
});

// --- GET /api/Dropdowns/countries/{countryId}/states ---
export const getStateOptions = createServerFn({ method: "POST" })
  .validator(z.object({ countryId: z.number().default(1) }))
  .handler(async ({ data }) => {
    return callApi(`/countries/${data.countryId}/states`);
  });

// --- GET /api/Dropdowns/states/{stateId}/cities ---
export const getCityOptions = createServerFn({ method: "POST" })
  .validator(z.object({ stateId: z.number() }))
  .handler(async ({ data }) => {
    return callApi(`/states/${data.stateId}/cities`);
  });

// --- GET /api/Dropdowns/skills ---
// Added for Phase 2: getAstrologer/{id} (the detail endpoint) returns
// primarySkillIds/languageIds as raw numeric IDs, not names — see
// astrologer.functions.ts and AstroProfileView.jsx in the admin portal.
// These two resolve those IDs back to display names.
export const getSkillOptions = createServerFn({ method: "GET" }).handler(async () => {
  return callApi("/skills");
});

// --- GET /api/Dropdowns/languages ---
export const getLanguageOptions = createServerFn({ method: "GET" }).handler(async () => {
  return callApi("/languages");
});

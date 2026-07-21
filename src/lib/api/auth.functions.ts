// src/lib/api/auth.functions.ts
// Server-side proxy for the KamleshKhyati Astro API (kgaapi.techascents.com),
// the Swagger Sarthak shared with LoginOtp / OtpVerification / RegisterUser /
// UserProfile / google-login endpoints. Calls run here (server-to-server)
// instead of straight from the browser, same reasoning as horoscope.functions.ts:
// avoids CORS and keeps the API host out of client bundles.
//
// AUTH: confirmed against real responses (2026-07-10). OtpVerification
// returns { token, isProfileComplete, mobile, userId } inside the envelope's
// `data` field — Bearer scheme is correct, and RegisterUser/UserProfile/
// profile all need that token. There's no `name` field anywhere on
// OtpVerification's response — route first-time vs returning users off
// `isProfileComplete`, and fetch the profile (getUserProfile) for returning
// users to get their name.
//
// Every response is wrapped as { success, statusCode, message, data, errors }
// — callApi() below unwraps `.data` before returning, so call sites read
// fields directly. Handlers still return `any` on purpose (createServerFn
// requires a serializable return type) — the client reads fields
// defensively via AuthApiUser at the call sites (login.tsx, profile.tsx).
// RegisterUser/UserProfile request-body field names (mobileNo vs mobile,
// etc.) are still per the original Swagger and haven't been independently
// re-confirmed — worth a look if either of those still error.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const API_BASE = "https://kgaapi.techascents.com/api/User";

// The API wraps every response as { success, statusCode, message, data, errors }.
// `data` holds the actual payload (a string OTP for LoginOtp, an object for
// OtpVerification/RegisterUser/UserProfile). We unwrap it here so call sites
// can read fields directly instead of reaching into `.data` themselves.
// `success: false` can come back on a 200 (e.g. validation failures), so we
// check that too, not just res.ok.
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
    const baseMessage =
      envelope && typeof envelope.message === "string"
        ? envelope.message
        : `Astro API error (${res.status})`;

    // `message` alone is often generic (e.g. "User profile fields validation
    // failed") and doesn't say which field. The envelope's `errors` field
    // usually carries the per-field detail — surface it in both the thrown
    // message (so it reaches the toast) and a server log (so it's in the
    // Vercel function logs even if the toast gets missed/screenshotted).
    const errors = envelope?.errors;
    const detail = formatValidationErrors(errors);

    // eslint-disable-next-line no-console
    console.error(`[AstroAPI] ${path} failed (${res.status}):`, baseMessage, errors ?? "(no errors field)");

    throw new Error(detail ? `${baseMessage} — ${detail}` : baseMessage);
  }

  // Unwrap the envelope's `data` field if present; otherwise return as-is
  // (defensive, in case some endpoint ever responds unwrapped).
  return envelope && "data" in envelope ? envelope.data : json;
}

// Handles both shapes seen from ASP.NET-style validation responses:
// a flat array of messages, or a { fieldName: ["msg", ...] } map.
function formatValidationErrors(errors: unknown): string | null {
  if (!errors) return null;
  if (Array.isArray(errors)) {
    const flat = errors.filter((e) => typeof e === "string").join("; ");
    return flat || null;
  }
  if (typeof errors === "object") {
    const parts = Object.entries(errors as Record<string, unknown>).map(([field, msgs]) => {
      const text = Array.isArray(msgs) ? msgs.join(", ") : String(msgs);
      return `${field}: ${text}`;
    });
    return parts.join("; ") || null;
  }
  return null;
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// Loose shape of whatever user info the API sends back after OTP
// verification / registration / profile fetch. Every field optional and
// read defensively on the client — see login.tsx / profile.tsx.
export interface AuthApiUser {
  userId?: string | number;
  id?: string | number;
  mobileNo?: string;
  mobile?: string;
  name?: string;
  email?: string;
  token?: string;
  accessToken?: string;
  // OtpVerification confirms via this flag whether the user still needs to
  // complete signup — there's no `name` field on that response at all, so
  // don't branch on `resolvedName` truthiness (it'll always be falsy).
  isProfileComplete?: boolean;
}

// --- POST /api/User/LoginOtp — sends the OTP to a mobile number ---
export const sendLoginOtp = createServerFn({ method: "POST" })
  .validator(z.object({ mobileNo: z.string().length(10) }))
  .handler(async ({ data }) => {
    return callApi("/LoginOtp", {
      method: "POST",
      body: JSON.stringify({ mobileNo: data.mobileNo }),
    });
  });

// --- POST /api/User/OtpVerification — verifies the OTP, returns a token ---
export const verifyLoginOtp = createServerFn({ method: "POST" })
  .validator(z.object({ mobileNo: z.string().length(10), otp: z.string().min(4).max(6) }))
  .handler(async ({ data }) => {
    return callApi("/OtpVerification", {
      method: "POST",
      body: JSON.stringify({ mobileNo: data.mobileNo, otp: data.otp }),
    });
  });

// --- POST /api/User/RegisterUser — first-time users, after OTP verify ---
// Requires the bearer token from OtpVerification (was 401-ing without it).
//
// CONFIRMED 2026-07-10: the backend rejects a combined `name` field —
// "FirstName: First name is required" comes back even when `name` is set.
// It wants FirstName/LastName as separate fields, matching what
// GetUserProfile already returns (firstName/lastName, not name). The UI
// only collects a single "Your name" input, so we split it here: first
// word -> firstName, remaining words -> lastName. If there's no second
// word, lastName reuses firstName rather than sending an empty string —
// some existing backend records still carry the literal Swagger placeholder
// "string" for lastName, which is a strong signal that field is required
// and can't be blank.
export const registerUser = createServerFn({ method: "POST" })
  .validator(
    z.object({
      mobileNo: z.string().length(10),
      name: z.string().min(1),
      email: z.string().email().optional(),
      token: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const { token, name, ...rest } = data;
    const trimmed = name.trim().replace(/\s+/g, " ");
    const [firstName, ...restWords] = trimmed.split(" ");
    const lastName = restWords.join(" ") || firstName;
    return callApi(
      "/RegisterUser",
      { method: "POST", body: JSON.stringify({ ...rest, firstName, lastName }) },
      token,
    );
  });

// --- PUT /api/User/UserProfile — update profile details (needs token) ---
// CONFIRMED against astro-admin-portal's UserProfile.jsx (Divyansh's build,
// same backend): the real payload shape uses firstName/lastName (not a
// combined name), genderId as a number (1/2/3), and location as
// countryId/stateId/cityId foreign keys rather than free text — plus tob
// (time of birth) and pob (place of birth), which are required before
// chat is allowed. Kept `name`/`gender`/`city` accepted-but-unused on the
// validator for backward compatibility with any other caller; the actual
// request body only sends the confirmed backend fields.
export const updateUserProfile = createServerFn({ method: "POST" })
  .validator(
    z.object({
      userId: z.string().min(1),
      firstName: z.string().min(1).optional(),
      lastName: z.string().min(1).optional(),
      email: z.string().email().optional(),
      dob: z.string().optional(),
      tob: z.string().optional(),
      pob: z.string().optional(),
      genderId: z.number().optional(),
      addressLine1: z.string().optional(),
      addressLine2: z.string().optional(),
      countryId: z.number().optional(),
      stateId: z.number().optional(),
      cityId: z.number().optional(),
      pinCode: z.string().optional(),
      token: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const { token, ...body } = data;
    return callApi("/UserProfile", { method: "PUT", body: JSON.stringify(body) }, token);
  });

// --- GET /api/User/profile/{userId} — (needs token) ---
export const getUserProfile = createServerFn({ method: "POST" })
  .validator(z.object({ userId: z.string().min(1), token: z.string().optional() }))
  .handler(async ({ data }) => {
    return callApi(`/profile/${encodeURIComponent(data.userId)}`, { method: "GET" }, data.token);
  });

// --- POST /api/User/google-login — not wired up client-side yet, waiting ---
// --- on a Google OAuth client ID. Endpoint is ready on the backend side. ---
export const googleLogin = createServerFn({ method: "POST" })
  .validator(z.object({ idToken: z.string().min(1) }))
  .handler(async ({ data }) => {
    return callApi("/google-login", {
      method: "POST",
      body: JSON.stringify({ idToken: data.idToken }),
    });
  });
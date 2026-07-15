// src/lib/api/prokerala.server.ts
//
// Shared Prokerala OAuth2 client-credentials auth, used by every Prokerala
// endpoint we call (kundli-matching today, kundli/advanced for the Kundli
// Generator). Pulled out of kundli.functions.ts so the token cache is
// shared across both instead of each function file re-authenticating.
//
// SETUP: add PROKERALA_CLIENT_ID and PROKERALA_CLIENT_SECRET to .env (no
// VITE_ prefix). Get them from the Prokerala dashboard > API Access >
// Client Credentials.

import { getServerConfig } from "@/lib/config.server";

const TOKEN_URL = "https://api.prokerala.com/token";

// Module-scope cache: avoids a token round-trip on every request within
// the same Worker instance's lifetime. Shared across all Prokerala calls.
let cachedToken: { value: string; expiresAt: number } | null = null;

export async function getProkeralaToken(): Promise<string> {
  const { prokeralaClientId, prokeralaClientSecret } = getServerConfig();

  if (!prokeralaClientId || !prokeralaClientSecret) {
    throw new Error(
      "Prokerala credentials are not set — add PROKERALA_CLIENT_ID and PROKERALA_CLIENT_SECRET to .env.",
    );
  }

  if (cachedToken && cachedToken.expiresAt - Date.now() > 30_000) {
    return cachedToken.value;
  }

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: prokeralaClientId,
      client_secret: prokeralaClientSecret,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(`[Prokerala] token request failed (${res.status}):`, body.slice(0, 500));
    throw new Error(`Prokerala auth failed (${res.status}): ${extractProkeralaError(body)}`);
  }

  const json = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    value: json.access_token,
    expiresAt: Date.now() + json.expires_in * 1000,
  };
  return cachedToken.value;
}

// Prokerala's error responses are usually JSON:API-flavored, e.g.
// { "status": "error", "errors": [{ "code": ..., "title": "...", "detail": "..." }] }
// but fall back gracefully if the shape is something else (HTML error page,
// plain text, etc.) so we never throw while trying to explain a failure.
export function extractProkeralaError(rawBody: string): string {
  if (!rawBody) return "No error details returned by Prokerala.";
  try {
    const parsed = JSON.parse(rawBody) as {
      errors?: Array<{ detail?: string; title?: string; message?: string }>;
      error_description?: string;
      error?: string;
      message?: string;
    };
    const fromErrorsArray = parsed.errors?.[0]?.detail ?? parsed.errors?.[0]?.title;
    const detail = fromErrorsArray ?? parsed.error_description ?? parsed.message ?? parsed.error;
    if (detail) return detail;
  } catch {
    // Not JSON — fall through to raw text below.
  }
  return rawBody.slice(0, 300);
}

// Prokerala wants an ISO 8601 datetime with a numeric UTC offset suffix,
// e.g. 1995-08-20T14:30:00+05:30 — build the +HH:MM tail from the decimal
// offset (handles fractional zones like IST's +5:30).
export function toProkeralaDateTime(date: string, time: string, utcOffsetHours: number): string {
  const sign = utcOffsetHours >= 0 ? "+" : "-";
  const abs = Math.abs(utcOffsetHours);
  const hh = String(Math.floor(abs)).padStart(2, "0");
  const mm = String(Math.round((abs % 1) * 60)).padStart(2, "0");
  return `${date}T${time}:00${sign}${hh}:${mm}`;
}
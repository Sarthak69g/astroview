// src/lib/api/horoscope.functions.ts
// Server-side proxy for freehoroscopeapi.com. That API doesn't send
// Access-Control-Allow-Origin, so a direct browser fetch gets blocked by
// CORS even though the request itself succeeds (200 OK, just an
// unreadable response). Running the fetch here — inside a createServerFn
// handler — means the request happens server-to-server, where CORS
// doesn't apply, and we just hand the client clean JSON back.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  sign: z.string().min(1),
  period: z.enum(["daily", "weekly", "monthly"]),
});

export interface HoroscopePayload {
  date: string;
  period: string;
  sign: string;
  horoscope: string;
}

export const getHoroscope = createServerFn({ method: "POST" })
  .validator(inputSchema)
  .handler(async ({ data }): Promise<HoroscopePayload> => {
    const url = `https://freehoroscopeapi.com/api/v1/get-horoscope/${data.period}?sign=${encodeURIComponent(data.sign)}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Horoscope upstream error (${res.status})`);
    }

    const json = (await res.json()) as { data?: HoroscopePayload };
    const result = json.data;

    if (!result || !result.horoscope) {
      throw new Error("Horoscope response was empty");
    }

    return result;
  });
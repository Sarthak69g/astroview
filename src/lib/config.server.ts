import process from "node:process";

// Server-only config. The .server.ts suffix prevents Vite from bundling
// this file into the client — values here never reach the browser.
//
// On Cloudflare Workers, env binds at REQUEST time. Module-scope reads
// (e.g. `const x = process.env.X`) resolve to undefined — always read
// process.env INSIDE a function or handler.
//
// When to use which env-access pattern:
//   - .server.ts module (this file): server-only helpers reused across
//     handlers. Wrap reads in a function so they run per-request.
//   - inline process.env inside a createServerFn handler: one-off reads
//     not reused elsewhere.
//   - import.meta.env.VITE_FOO: PUBLIC config readable from both client
//     and server (analytics IDs, public URLs). Define in .env with the
//     VITE_ prefix. Never put secrets here — they ship to the browser.

export function getServerConfig() {
  return {
    nodeEnv: process.env.NODE_ENV,
    // Add server-only values here, e.g.:
    //   databaseUrl: process.env.DATABASE_URL,
    //   stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    // AstrologyAPI.com's recommended auth method: a single Access Token
    // (aka Wallet Token) sent in a custom `x-astrologyapi-key` header —
    // confirmed against their official Quick Start guide. Simpler and
    // safer than the Basic Auth (userId+apiKey) alternative.
    astrologyApiAccessToken: process.env.ASTROLOGYAPI_ACCESS_TOKEN,
    // Prokerala uses OAuth2 client-credentials — a Client ID + Secret
    // exchanged server-side for a short-lived bearer token (see
    // kundli.functions.ts). Get these from the Prokerala dashboard >
    // API Access > your app's Client Credentials.
    prokeralaClientId: process.env.PROKERALA_CLIENT_ID,
    prokeralaClientSecret: process.env.PROKERALA_CLIENT_SECRET,
  };
}
// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: true,

  tanstackStart: {
    server: {
      entry: "server",
    },
  },

  // Dev server port pinned to 5173 (Vite's own default) instead of whatever
  // the shared config's sandbox detection would otherwise pick — this is
  // the exact origin (http://localhost:5173) that's already whitelisted in
  // kgaapi.techascents.com's CORS policy for the SignalR hub (confirmed:
  // that's the port the astro-admin-portal's default `vite` dev script
  // runs on, and its live chat works). Local-only workaround — the actual
  // deployed AstroView domain still needs to be added to that same
  // allow-list on the backend before chat will work in production.
  vite: {
    server: {
      port: 5173,
      strictPort: true,
      host: "localhost",
    },
  },
});

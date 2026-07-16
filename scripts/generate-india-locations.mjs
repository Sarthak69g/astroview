// scripts/generate-india-locations.mjs
//
// Generates src/data/india-locations.json — the offline dataset behind
// PlaceAutocomplete.tsx's India-only "place of birth" search.
//
// SOURCE: the `india-pincode` npm package (India Post pincode data,
// 165,627 post office records). Run this manually whenever that package
// publishes a data update:
//
//   npm install india-pincode@latest --no-save
//   node scripts/generate-india-locations.mjs
//
// PIPELINE:
//   1. Decompress the package's gzipped post-office dataset.
//   2. Keep only Sub Office (S.O) and Head Office (H.O) records — these
//      correspond to real named towns/cities. Branch Offices (B.O) are
//      individual villages/hamlets (~140k of the 165k records) — too
//      granular for a birthplace search box and would 7x the bundle size
//      for locations almost nobody searches by that exact name.
//   3. Drop records with missing/zero coordinates (~7% of the data).
//   4. Strip the " S.O" / " H.O" / " SO" / " HO" suffix from office names
//      so "Jaipur City S.O" becomes "Jaipur City".
//   5. Title-case district/state (source data is in caps: "TELANGANA").
//   6. De-duplicate exact (name, district, state) triples.
//   7. Sort and emit as compact [name, district, state, lat, lon, pincode]
//      tuples (~30% smaller on disk than an array of objects).
//
// OUTPUT: src/data/india-locations.json, committed to the repo so builds
// don't depend on network access or a third-party package at build time.

import { gunzipSync } from "node:zlib";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");

// Resolved directly rather than via require.resolve()/import(), since the
// package's package.json "exports" map blocks reaching into ./data/ from
// outside the package.
const pincodeDataPath = join(
  repoRoot,
  "node_modules/india-pincode/data/pincodes.json.gz",
);

function titleCase(str) {
  return str
    .toLowerCase()
    .split(/(\s+|-)/)
    .map((part) => (part.trim() ? part.charAt(0).toUpperCase() + part.slice(1) : part))
    .join("");
}

function cleanOfficeName(raw) {
  return raw
    .replace(/\s+(S\.?O|H\.?O)\.?$/i, "")
    .trim();
}

function main() {
  const raw = JSON.parse(gunzipSync(readFileSync(pincodeDataPath)).toString("utf8"));
  console.log(`Loaded ${raw.length} raw post-office records`);

  const seen = new Set();
  const rows = [];

  for (const rec of raw) {
    if (rec.t === "BO") continue; // skip branch offices (villages)
    if (!rec.a || !rec.n) continue; // skip missing coordinates
    if (!rec.s || rec.s.toUpperCase() === "NA") continue; // skip junk state values
    if (!rec.i) continue;

    const name = cleanOfficeName(rec.o);
    const district = titleCase(rec.i);
    const state = titleCase(rec.s);
    const key = `${name}|${district}|${state}`;
    if (seen.has(key)) continue;
    seen.add(key);

    rows.push([name, district, state, rec.a, rec.n, rec.p]);
  }

  rows.sort((a, b) => a[2].localeCompare(b[2]) || a[1].localeCompare(b[1]) || a[0].localeCompare(b[0]));

  const states = new Set(rows.map((r) => r[2]));
  const districts = new Set(rows.map((r) => `${r[2]}|${r[1]}`));
  console.log(`Kept ${rows.length} town/city-level records`);
  console.log(`Covering ${states.size} states/UTs and ${districts.size} districts`);

  const outDir = join(repoRoot, "src/data");
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "india-locations.json");
  writeFileSync(outPath, JSON.stringify(rows));
  console.log(`Wrote ${outPath}`);
}

main();

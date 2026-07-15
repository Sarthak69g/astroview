// src/lib/pdf/kundli-chart-pdf.ts
//
// Builds a downloadable PDF for the Kundli Generator result. Plain text
// layout via Report (see report.ts) — no DOM screenshotting, so it stays
// small and the text is selectable/searchable in the PDF.

import { Report } from "@/lib/pdf/report";
import type { KundliChartPayload } from "@/lib/api/kundli-chart.functions";

export interface KundliChartPdfMeta {
  name: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  place: string;
}

function formatDateShort(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export async function downloadKundliChartPdf(
  meta: KundliChartPdfMeta,
  result: KundliChartPayload,
) {
  const { nakshatra, mangalDosha, yogaGroups, dashaPeriods, dashaBalance } = result;
  const report = await Report.create("Vedic Kundli");

  report.brandHeader();
  report.h1(`Vedic Kundli — ${meta.name}`);
  report.subtitle(
    `Born ${new Date(`${meta.date}T${meta.time}:00`).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })} at ${meta.time} · ${meta.place}`,
  );
  report.spacer(2);

  report.h2("Birth Snapshot");
  report.rowPair(
    ["Nakshatra", nakshatra.nakshatraName ? `${nakshatra.nakshatraName}${nakshatra.pada ? ` (Pada ${nakshatra.pada})` : ""}` : undefined],
    ["Moon Sign", nakshatra.chandraRasi],
  );
  report.rowPair(["Sun Sign", nakshatra.sooryaRasi], ["Zodiac (Western)", nakshatra.zodiac]);
  report.spacer(3);

  report.h2("Nakshatra Details");
  report.rowPair(
    [
      "Nakshatra Lord",
      nakshatra.nakshatraLord
        ? `${nakshatra.nakshatraLord.name}${nakshatra.nakshatraLord.vedicName ? ` (${nakshatra.nakshatraLord.vedicName})` : ""}`
        : undefined,
    ],
    ["Deity", nakshatra.deity],
  );
  report.rowPair(["Ganam", nakshatra.ganam], ["Symbol", nakshatra.symbol]);
  report.rowPair(["Animal Sign", nakshatra.animalSign], ["Nadi", nakshatra.nadi]);
  report.rowPair(["Best Direction", nakshatra.bestDirection], ["Birth Stone", nakshatra.birthStone]);
  report.rowPair(["Syllables", nakshatra.syllables], ["Colour", nakshatra.color]);
  report.spacer(3);

  if (mangalDosha) {
    report.h2(mangalDosha.hasDosha ? "Manglik Dosha" : "Mangal Dosha — Not Manglik");
    report.paragraph(mangalDosha.description ?? "", { size: 9.5, color: [50, 50, 50] });
    if (mangalDosha.hasException && mangalDosha.exceptions) {
      report.bullet("Exception applies", mangalDosha.exceptions);
    }
    if (mangalDosha.remedies) {
      report.bullet("Remedies", mangalDosha.remedies);
    }
    report.spacer(3);
  }

  if (yogaGroups.length > 0) {
    report.h2("Yogas in This Chart");
    for (const group of yogaGroups) {
      report.h3(group.name);
      for (const yoga of group.yogas) {
        report.bullet(yoga.name, yoga.description);
      }
      report.spacer(1);
    }
  }

  if (dashaPeriods.length > 0) {
    report.h2("Vimshottari Dasha");
    const now = Date.now();
    const currentMaha = dashaPeriods.find(
      (m) => now >= new Date(m.start).getTime() && now <= new Date(m.end).getTime(),
    );
    if (currentMaha) {
      const currentAntar = currentMaha.antardasha.find(
        (a) => now >= new Date(a.start).getTime() && now <= new Date(a.end).getTime(),
      );
      report.paragraph(
        `Current period: ${currentMaha.name} Mahadasha${currentAntar ? ` — ${currentAntar.name} Antardasha` : ""}${
          dashaBalance?.description ? ` (${dashaBalance.description} remaining in this Mahadasha)` : ""
        }`,
        { size: 10, color: [180, 83, 9] },
      );
      report.spacer(2);
    }

    for (const maha of dashaPeriods) {
      report.row(
        `${maha.name} Mahadasha`,
        `${formatDateShort(maha.start)} – ${formatDateShort(maha.end)}`,
      );
      for (const antar of maha.antardasha) {
        report.subRow(`↳ ${antar.name}`, `${formatDateShort(antar.start)} – ${formatDateShort(antar.end)}`);
      }
    }
  }

  report.finish(`${meta.name.replace(/\s+/g, "-").toLowerCase()}-kundli.pdf`);
}

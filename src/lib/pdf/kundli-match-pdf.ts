// src/lib/pdf/kundli-match-pdf.ts
//
// Builds a downloadable PDF for the Kundli Matching (Ashtakoot Guna Milan)
// result. Same plain-text Report layout as kundli-chart-pdf.ts.

import { Report } from "@/lib/pdf/report";
import type { KundliMatchPayload } from "@/lib/api/kundli.functions";
import { findGunaKootaInfo, gunaMilanVerdict } from "@/data/gunaKootaData";

export interface KundliMatchPdfMeta {
  boyName: string;
  girlName: string;
}

export async function downloadKundliMatchPdf(meta: KundliMatchPdfMeta, result: KundliMatchPayload) {
  const report = await Report.create("Kundli Matching Report");
  const verdict = gunaMilanVerdict(result.totalPoints);

  report.brandHeader();
  report.h1(`Kundli Matching — ${meta.boyName} & ${meta.girlName}`);
  report.subtitle("Ashtakoot Guna Milan — 36-point compatibility score");
  report.spacer(2);

  report.h2("Overall Result");
  report.row("Total Guna Score", `${result.totalPoints} / ${result.maxPoints}`);
  report.row("Verdict", verdict.label);
  if (result.conclusion) {
    report.spacer(1);
    report.paragraph(result.conclusion, { size: 9.5 });
  }
  report.spacer(3);

  if (result.narrative) {
    report.h2("Detailed Compatibility Report");
    report.paragraph(result.narrative.opening, { size: 9.5 });
    report.spacer(1);
    report.h3("Where They Align");
    report.paragraph(result.narrative.strengths, { size: 9, color: [90, 90, 90] });
    report.spacer(1);
    report.h3("Worth a Closer Look");
    report.paragraph(result.narrative.concerns, { size: 9, color: [90, 90, 90] });
    if (result.narrative.mangalDosha) {
      report.spacer(1);
      report.h3("Mangal Dosha");
      report.paragraph(result.narrative.mangalDosha, { size: 9, color: [90, 90, 90] });
    }
    report.spacer(1);
    report.paragraph(result.narrative.closing, { size: 9.5 });
    report.spacer(3);
  }

  if (result.kootas.length > 0) {
    report.h2("Koota Breakdown");
    for (const k of result.kootas) {
      const info = findGunaKootaInfo(k.name);
      const displayName = info?.name ?? k.name;
      const maxPoints = k.max_koot_points || info?.maxPoints || 0;
      report.h3(`${displayName} — ${k.received_koot_points}/${maxPoints}`);
      if (info?.meaning) {
        report.paragraph(info.meaning, { size: 9, color: [180, 83, 9] });
      }
      report.paragraph(k.description || info?.description || "", { size: 9, color: [90, 90, 90] });
    }
    report.spacer(2);

    if (result.boyMangalDosha || result.girlMangalDosha) {
      report.h2("Mangal Dosha");
      if (result.boyMangalDosha) {
        const status = result.boyMangalDosha.hasDosha
          ? result.boyMangalDosha.hasException
            ? "Dosha (cancelled)"
            : "Manglik"
          : "Not Manglik";
        report.h3(`${meta.boyName} — ${status}`);
        if (result.boyMangalDosha.description) {
          report.paragraph(result.boyMangalDosha.description, { size: 9, color: [90, 90, 90] });
        }
      }
      if (result.girlMangalDosha) {
        const status = result.girlMangalDosha.hasDosha
          ? result.girlMangalDosha.hasException
            ? "Dosha (cancelled)"
            : "Manglik"
          : "Not Manglik";
        report.h3(`${meta.girlName} — ${status}`);
        if (result.girlMangalDosha.description) {
          report.paragraph(result.girlMangalDosha.description, { size: 9, color: [90, 90, 90] });
        }
      }
      report.spacer(2);
    }

    const zeroScored = result.kootas.filter((k) => k.received_koot_points === 0);
    if (zeroScored.length > 0) {
      report.h2("Points to Discuss with an Astrologer");
      for (const k of zeroScored) {
        const info = findGunaKootaInfo(k.name);
        report.bullet(
          `${info?.name ?? k.name} scored 0`,
          "A zero score on this koota is traditionally worth a closer look with a professional astrologer before drawing conclusions from the total alone.",
        );
      }
    }
  }

  report.finish(
    `${meta.boyName.replace(/\s+/g, "-").toLowerCase()}-${meta.girlName.replace(/\s+/g, "-").toLowerCase()}-kundli-match.pdf`,
  );
}
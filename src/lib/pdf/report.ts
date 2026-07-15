// src/lib/pdf/report.ts
//
// Tiny text-layout helper around jsPDF, shared by kundli-chart-pdf.ts and
// kundli-match-pdf.ts. Both reports are plain structured text (no DOM
// screenshotting / html2canvas) so file size stays small and text stays
// crisp + selectable in the downloaded PDF.

import type { jsPDF } from "jspdf";

const PAGE_WIDTH = 210; // A4 mm
const PAGE_HEIGHT = 297;
const MARGIN = 18;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

export class Report {
  y = MARGIN;

  private constructor(
    private title: string,
    public doc: jsPDF,
  ) {}

  // jsPDF pulls in html2canvas/canvg/dompurify as transitive deps for
  // features we never use (rendering DOM/SVG into the PDF) — dynamic
  // import keeps that ~700KB out of the route's main chunk and only
  // fetches it the moment someone clicks "Download PDF".
  static async create(title: string): Promise<Report> {
    const { jsPDF } = await import("jspdf");
    return new Report(title, new jsPDF({ unit: "mm", format: "a4" }));
  }

  private ensureSpace(needed: number) {
    if (this.y + needed > PAGE_HEIGHT - MARGIN) {
      this.doc.addPage();
      this.y = MARGIN;
    }
  }

  brandHeader() {
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(10);
    this.doc.setTextColor(217, 119, 6); // amber-ish accent
    this.doc.text("AstroView", MARGIN, this.y);
    this.doc.setTextColor(0, 0, 0);
    this.y += 8;
  }

  h1(text: string) {
    this.ensureSpace(12);
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(18);
    this.doc.text(text, MARGIN, this.y);
    this.y += 9;
  }

  subtitle(text: string) {
    this.ensureSpace(7);
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(10);
    this.doc.setTextColor(90, 90, 90);
    this.doc.text(text, MARGIN, this.y);
    this.doc.setTextColor(0, 0, 0);
    this.y += 8;
  }

  h2(text: string) {
    this.ensureSpace(10);
    this.y += 2;
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(13);
    this.doc.setTextColor(180, 83, 9);
    this.doc.text(text, MARGIN, this.y);
    this.doc.setTextColor(0, 0, 0);
    this.y += 2;
    this.doc.setDrawColor(230, 200, 170);
    this.doc.line(MARGIN, this.y, PAGE_WIDTH - MARGIN, this.y);
    this.y += 6;
  }

  h3(text: string) {
    this.ensureSpace(8);
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(11);
    this.doc.text(text, MARGIN, this.y);
    this.y += 6;
  }

  // label ................ value, single line
  row(label: string, value?: string | number) {
    if (value === undefined || value === null || value === "") return;
    this.ensureSpace(6);
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(10);
    this.doc.setTextColor(90, 90, 90);
    this.doc.text(label, MARGIN, this.y);
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(String(value), PAGE_WIDTH - MARGIN, this.y, { align: "right" });
    this.y += 6;
  }

  // Two label/value pairs side by side (matches the on-screen 2-col grid)
  rowPair(a: [string, string | undefined], b: [string, string | undefined]) {
    if (!a[1] && !b[1]) return;
    this.ensureSpace(6);
    const half = CONTENT_WIDTH / 2;
    this.doc.setFontSize(10);
    if (a[1]) {
      this.doc.setFont("helvetica", "normal");
      this.doc.setTextColor(90, 90, 90);
      this.doc.text(a[0], MARGIN, this.y);
      this.doc.setFont("helvetica", "bold");
      this.doc.setTextColor(0, 0, 0);
      this.doc.text(String(a[1]), MARGIN + half - 4, this.y, { align: "right" });
    }
    if (b[1]) {
      this.doc.setFont("helvetica", "normal");
      this.doc.setTextColor(90, 90, 90);
      this.doc.text(b[0], MARGIN + half + 4, this.y);
      this.doc.setFont("helvetica", "bold");
      this.doc.setTextColor(0, 0, 0);
      this.doc.text(String(b[1]), PAGE_WIDTH - MARGIN, this.y, { align: "right" });
    }
    this.y += 6;
  }

  // Smaller, indented, muted variant of row() — for nested items like
  // Antardasha under a Mahadasha.
  subRow(label: string, value?: string) {
    if (!value) return;
    this.ensureSpace(5);
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(8.5);
    this.doc.setTextColor(130, 130, 130);
    this.doc.text(label, MARGIN + 4, this.y);
    this.doc.text(value, PAGE_WIDTH - MARGIN, this.y, { align: "right" });
    this.doc.setTextColor(0, 0, 0);
    this.y += 4.8;
  }

  paragraph(text: string, opts: { size?: number; color?: [number, number, number] } = {}) {
    if (!text) return;
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(opts.size ?? 9.5);
    const [r, g, b] = opts.color ?? [50, 50, 50];
    this.doc.setTextColor(r, g, b);
    const lines: string[] = this.doc.splitTextToSize(text, CONTENT_WIDTH);
    for (const line of lines) {
      this.ensureSpace(5);
      this.doc.text(line, MARGIN, this.y);
      this.y += 4.6;
    }
    this.doc.setTextColor(0, 0, 0);
    this.y += 2;
  }

  bullet(label: string, body?: string) {
    this.ensureSpace(6);
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(10);
    this.doc.text(`• ${label}`, MARGIN, this.y);
    this.y += 5;
    if (body) this.paragraph(body, { size: 9, color: [100, 100, 100] });
  }

  spacer(mm = 4) {
    this.y += mm;
  }

  finish(filename: string) {
    const pageCount = this.doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.setFont("helvetica", "normal");
      this.doc.setFontSize(8);
      this.doc.setTextColor(150, 150, 150);
      this.doc.text(
        `AstroView · Generated for reference — consult an astrologer for major decisions · ${i}/${pageCount}`,
        PAGE_WIDTH / 2,
        PAGE_HEIGHT - 10,
        { align: "center" },
      );
    }
    this.doc.save(filename);
  }
}

export { CONTENT_WIDTH, MARGIN };

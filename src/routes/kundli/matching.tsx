// src/routes/kundli/matching.tsx
//
// Ashtakoot Guna Milan (Kundli Matching) — two-person birth-details form,
// submits to Prokerala via kundli.functions.ts, renders the 8-Koota
// breakdown + overall verdict. See BirthDetailsForm.tsx for the shared
// input block (also reused by the Kundli Generator at /kundli/generator).
//
// Result section design: a score ring up front (more legible at a glance
// than plain text), kootas sorted into the traditional Ashtakoot order
// with a mini progress bar per koota, and the score split into "Strong
// Points" vs "Needs Attention" so the result reads as an interpretation,
// not just a number grid. Zero-scored kootas get a dedicated callout since
// a 0 on a heavily-weighted koota (Nadi, Bhakoot) is traditionally worth
// flagging even when the total looks fine.

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Sparkles, Loader2, CheckCircle2, AlertTriangle, Download } from "lucide-react";
import { toast } from "sonner";
import Starfield from "@/components/Starfield";
import Reveal from "@/components/Reveal";
import BirthDetailsForm, {
  emptyBirthDetails,
  isBirthDetailsComplete,
  type BirthDetails,
} from "@/components/BirthDetailsForm";
import {
  getKundliMatch,
  type KundliMatchPayload,
  type MangalDoshaInfo,
} from "@/lib/api/kundli.functions";
import { GUNA_KOOTA_INFO, findGunaKootaInfo, gunaMilanVerdict } from "@/data/gunaKootaData";
import { downloadKundliMatchPdf } from "@/lib/pdf/kundli-match-pdf";

export const Route = createFileRoute("/kundli/matching")({
  head: () => ({
    meta: [
      { title: "Kundli Matching — Ashtakoot Guna Milan — AstroView" },
      {
        name: "description",
        content:
          "Check marriage compatibility with authentic Ashtakoot Guna Milan Kundli matching — enter both partners' birth details for a full 36-point score breakdown.",
      },
      { property: "og:title", content: "Kundli Matching — AstroView" },
    ],
  }),
  component: KundliMatchingPage,
});

function toBirthPayload(d: BirthDetails) {
  return {
    name: d.name,
    date: d.date,
    time: d.time,
    latitude: d.latitude as number,
    longitude: d.longitude as number,
    utcOffsetHours: d.utcOffsetHours as number,
  };
}

const VERDICT_STYLES = {
  good: "bg-green-100 text-green-800 border-green-200",
  ok: "bg-amber-100 text-amber-800 border-amber-200",
  caution: "bg-red-100 text-red-800 border-red-200",
} as const;

const KOOTA_ORDER = GUNA_KOOTA_INFO.map((k) => k.key);

function orderKootas(kootas: KundliMatchPayload["kootas"]) {
  return [...kootas].sort((a, b) => {
    const ai = KOOTA_ORDER.indexOf(findGunaKootaInfo(a.name)?.key ?? "");
    const bi = KOOTA_ORDER.indexOf(findGunaKootaInfo(b.name)?.key ?? "");
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });
}

function ScoreRing({ value, max }: { value: number; max: number }) {
  const size = 156;
  const radius = 62;
  const stroke = 12;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(1, max > 0 ? value / max : 0));
  const offset = circumference * (1 - pct);
  const center = size / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        strokeWidth={stroke}
        className="stroke-border"
      />
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="stroke-primary transition-all duration-700 ease-out"
        transform={`rotate(-90 ${center} ${center})`}
      />
      <text
        x={center}
        y={center - 4}
        textAnchor="middle"
        className="fill-primary-deep font-display font-semibold"
        style={{ fontSize: "34px" }}
      >
        {value}
      </text>
      <text
        x={center}
        y={center + 18}
        textAnchor="middle"
        className="fill-muted-foreground"
        style={{ fontSize: "13px" }}
      >
        / {max}
      </text>
    </svg>
  );
}

function KootaBar({ received, max }: { received: number; max: number }) {
  const pct = max > 0 ? Math.max(0, Math.min(1, received / max)) * 100 : 0;
  const tone = received === 0 ? "bg-red-400" : received === max ? "bg-green-500" : "bg-amber-400";
  return (
    <div className="h-1.5 w-full rounded-full bg-border/70 overflow-hidden">
      <div className={`h-full rounded-full ${tone}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function MangalDoshaCard({ label, info }: { label: string; info: MangalDoshaInfo }) {
  const flagged = info.hasDosha && !info.hasException;
  return (
    <div
      className={`rounded-xl border px-4 py-3.5 ${
        flagged ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"
      }`}
    >
      <div className="flex items-center justify-between gap-3 mb-1">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            flagged ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
          }`}
        >
          {info.hasDosha ? (info.hasException ? "Dosha (cancelled)" : "Manglik") : "Not Manglik"}
        </span>
      </div>
      {info.description && (
        <p className="text-xs text-muted-foreground leading-relaxed">{info.description}</p>
      )}
    </div>
  );
}

function KundliMatchingPage() {
  const [boy, setBoy] = useState<BirthDetails>(emptyBirthDetails);
  const [girl, setGirl] = useState<BirthDetails>(emptyBirthDetails);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<KundliMatchPayload | null>(null);

  const canSubmit = isBirthDetailsComplete(boy) && isBirthDetailsComplete(girl);

  const updateBoy = (d: BirthDetails) => {
    setBoy(d);
    setResult(null);
  };
  const updateGirl = (d: BirthDetails) => {
    setGirl(d);
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      toast.error("Fill in both birth details and locate both places of birth first");
      return;
    }
    try {
      setLoading(true);
      setResult(null);
      const payload = await getKundliMatch({
        data: { boy: toBirthPayload(boy), girl: toBirthPayload(girl) },
      });
      setResult(payload);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't complete the match");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!result) return;
    try {
      await downloadKundliMatchPdf(
        { boyName: boy.name || "Partner A", girlName: girl.name || "Partner B" },
        result,
      );
    } catch {
      toast.error("Couldn't generate the PDF — try again");
    }
  };

  const verdict = result ? gunaMilanVerdict(result.totalPoints) : null;
  const orderedKootas = result ? orderKootas(result.kootas) : [];
  const hasScores = orderedKootas.length > 0 && orderedKootas[0].received_koot_points !== undefined;
  const kootaMatches = (k: KundliMatchPayload["kootas"][number]): boolean => {
    if (typeof k.matches === "boolean") return k.matches;
    const info = findGunaKootaInfo(k.name);
    const max = k.max_koot_points || info?.maxPoints || 0;
    return k.received_koot_points === max && max > 0;
  };
  const strongKootas = !hasScores ? [] : orderedKootas.filter(kootaMatches);
  const weakKootas = !hasScores ? [] : orderedKootas.filter((k) => !kootaMatches(k));
  const zeroKootas = !hasScores ? [] : orderedKootas.filter((k) => k.received_koot_points === 0);

  return (
    <div className="relative min-h-screen bg-background">
      <Starfield />
      <div className="relative max-w-4xl mx-auto px-4 py-16 md:py-24">
        <Reveal>
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-3">
              <Heart className="h-3.5 w-3.5" />
              Ashtakoot Guna Milan
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-2">
              Kundli Matching
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Enter both partners' birth details for an authentic 36-point Ashtakoot compatibility
              score.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="grid md:grid-cols-2 gap-5">
            <BirthDetailsForm label="Boy's Details" value={boy} onChange={updateBoy} />
            <BirthDetailsForm label="Girl's Details" value={girl} onChange={updateGirl} />
          </div>
        </Reveal>

        <Reveal>
          <div className="flex justify-center mt-6">
            <button
              onClick={handleSubmit}
              disabled={loading || (!!result && !loading)}
              className={`flex items-center gap-2 rounded-xl px-6 py-3 font-medium transition-opacity disabled:opacity-100 ${
                result && !loading
                  ? "bg-green-100 text-green-800 cursor-default"
                  : "bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-60"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Matching...
                </>
              ) : result ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Compatibility Checked
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Check Compatibility
                </>
              )}
            </button>
          </div>
        </Reveal>

        {result && verdict && (
          <Reveal>
            <div className="mt-10 bg-card border border-border rounded-2xl p-6 md:p-8">
              <div className="flex items-center justify-end mb-2">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 text-xs font-medium text-primary-deep bg-primary/10 hover:bg-primary/15 transition-colors px-3 py-1.5 rounded-full"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download PDF
                </button>
              </div>

              <div className="text-center mb-8">
                <ScoreRing value={result.totalPoints} max={result.maxPoints} />
                <span
                  className={`inline-flex items-center gap-1.5 mt-4 text-xs font-medium px-3 py-1 rounded-full border ${VERDICT_STYLES[verdict.tone]}`}
                >
                  {verdict.tone === "caution" ? (
                    <AlertTriangle className="h-3.5 w-3.5" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  )}
                  {verdict.label}
                </span>
                {result.conclusion && (
                  <p className="text-sm text-foreground mt-3 max-w-lg mx-auto">
                    {result.conclusion}
                  </p>
                )}
                {result.breakdownSource === "computed" && (
                  <p className="text-[11px] text-muted-foreground/70 mt-3">
                    Full breakdown computed using classical Ashtakoot rules from each partner's
                    birth star and moon sign.
                  </p>
                )}
              </div>

              {result.narrative && (
                <div className="mb-8 rounded-xl border border-border bg-background/60 p-5 md:p-6 space-y-4">
                  <p className="text-xs font-semibold text-primary-deep uppercase tracking-wide">
                    Detailed Compatibility Report
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">{result.narrative.opening}</p>
                  <div>
                    <p className="text-xs font-semibold text-green-700 mb-1">Where They Align</p>
                    <p className="text-sm text-foreground/90 leading-relaxed">
                      {result.narrative.strengths}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-amber-700 mb-1">Worth a Closer Look</p>
                    <p className="text-sm text-foreground/90 leading-relaxed">
                      {result.narrative.concerns}
                    </p>
                  </div>
                  {result.narrative.mangalDosha && (
                    <div>
                      <p className="text-xs font-semibold text-primary-deep mb-1">Mangal Dosha</p>
                      <p className="text-sm text-foreground/90 leading-relaxed">
                        {result.narrative.mangalDosha}
                      </p>
                    </div>
                  )}
                  <div className="pt-2 border-t border-border/60">
                    <p className="text-sm text-foreground/90 leading-relaxed">
                      {result.narrative.closing}
                    </p>
                  </div>
                </div>
              )}

              {(result.boyMangalDosha || result.girlMangalDosha) && (
                <div className="mb-6">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2.5">
                    Mangal Dosha
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {result.boyMangalDosha && (
                      <MangalDoshaCard label={boy.name || "Boy"} info={result.boyMangalDosha} />
                    )}
                    {result.girlMangalDosha && (
                      <MangalDoshaCard label={girl.name || "Girl"} info={result.girlMangalDosha} />
                    )}
                  </div>
                </div>
              )}

              {orderedKootas.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground">
                  Total score received, but the per-koota breakdown wasn't included in this
                  response.
                </p>
              ) : (
                <>
                  {zeroKootas.length > 0 && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
                      <div className="flex items-center gap-2 mb-1.5">
                        <AlertTriangle className="h-4 w-4 text-red-700 shrink-0" />
                        <p className="text-sm font-semibold text-red-800">
                          Worth Discussing With an Astrologer
                        </p>
                      </div>
                      <p className="text-xs text-red-800/80 leading-relaxed">
                        {zeroKootas
                          .map((k) => findGunaKootaInfo(k.name)?.name ?? k.name)
                          .join(", ")}
                        {zeroKootas.length === 1 ? " scored 0" : " scored 0"} — a zero on these is
                        traditionally worth a closer look with a professional before drawing
                        conclusions from the total score alone.
                      </p>
                    </div>
                  )}

                  {strongKootas.length > 0 && (
                    <div className="mb-6">
                      <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2.5">
                        Strong Points ({strongKootas.length})
                      </p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {strongKootas.map((k) => (
                          <KootaCard key={k.name} koota={k} />
                        ))}
                      </div>
                    </div>
                  )}

                  {weakKootas.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2.5">
                        Needs Attention ({weakKootas.length})
                      </p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {weakKootas.map((k) => (
                          <KootaCard key={k.name} koota={k} />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}

function KootaCard({ koota }: { koota: KundliMatchPayload["kootas"][number] }) {
  const info = findGunaKootaInfo(koota.name);
  const displayName = info?.name ?? koota.name;
  const maxPoints = koota.max_koot_points || info?.maxPoints || 0;
  return (
    <div className="rounded-xl border border-border bg-background px-4 py-3.5">
      <div className="flex items-center justify-between gap-3 mb-1.5">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-semibold text-foreground">{displayName}</p>
          {typeof koota.matches === "boolean" &&
            (koota.matches ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
            ) : (
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
            ))}
        </div>
        <span className="shrink-0 text-sm font-semibold text-primary-deep">
          {koota.received_koot_points}/{maxPoints}
        </span>
      </div>
      <div className="mb-2">
       <KootaBar
  received={koota.received_koot_points!}
  max={maxPoints}
/>
      </div>
      {info?.meaning && <p className="text-xs font-medium text-primary/80 mb-1">{info.meaning}</p>}
      {(koota.boy_koot || koota.girl_koot) && (
        <p className="text-[11px] text-muted-foreground/80 mb-1.5">
          {koota.boy_koot && <>Boy: {koota.boy_koot}</>}
          {koota.boy_koot && koota.girl_koot && " · "}
          {koota.girl_koot && <>Girl: {koota.girl_koot}</>}
        </p>
      )}
      <p className="text-xs text-muted-foreground leading-relaxed">
        {koota.description || info?.description}
      </p>
    </div>
  );
}
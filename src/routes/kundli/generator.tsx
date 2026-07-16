// src/routes/kundli/generator.tsx
//
// Kundli Generator — single-person Vedic birth chart. Reuses
// BirthDetailsForm (the same shared input block as Kundli Matching) and
// calls getKundliChart (Prokerala's kundli/advanced endpoint) via
// kundli-chart.functions.ts, which now returns a tight, pre-parsed shape
// instead of Prokerala's raw response — see the header comment there for
// why (short version: the full Vimshottari Dasha tree alone is ~700 rows).
//
// Layout: a 4-up birth snapshot (Nakshatra / Chandra Rasi / Soorya Rasi /
// Zodiac), a nakshatra detail card, a Mangal Dosha callout, any yogas the
// chart actually has, and the current Dasha period up front with the full
// Mahadasha -> Antardasha timeline tucked into an accordion.

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  Download,
  LayoutGrid,
  Orbit,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import Starfield from "@/components/Starfield";
import Reveal from "@/components/Reveal";
import BirthDetailsForm, {
  emptyBirthDetails,
  isBirthDetailsComplete,
  type BirthDetails,
} from "@/components/BirthDetailsForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  getKundliChart,
  type KundliChartPayload,
  type DashaMaha,
  type DashaAntar,
} from "@/lib/api/kundli-chart.functions";
import {
  getKundliChartSvg,
  getPlanetPositions,
  type PlanetPositionItem,
} from "@/lib/api/kundli-visual.functions";
import { getYogaMeaning } from "@/data/yogaMeaningsData";
import { downloadKundliChartPdf } from "@/lib/pdf/kundli-chart-pdf";

export const Route = createFileRoute("/kundli/generator")({
  head: () => ({
    meta: [
      { title: "Kundli Generator — Vedic Birth Chart — AstroView" },
      {
        name: "description",
        content:
          "Generate your Vedic Kundli — ascendant, Moon sign, nakshatra, yogas, doshas, and Vimshottari Dasha from your exact birth details.",
      },
      { property: "og:title", content: "Kundli Generator — AstroView" },
    ],
  }),
  component: KundliGeneratorPage,
});

function formatDate(iso: string): string {
  try {
    return format(new Date(iso), "d MMM yyyy");
  } catch {
    return iso;
  }
}

function isCurrent(start: string, end: string): boolean {
  const now = Date.now();
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  return !Number.isNaN(s) && !Number.isNaN(e) && now >= s && now <= e;
}

function findCurrentAntar(antardasha: DashaAntar[]): DashaAntar | undefined {
  return antardasha.find((a) => isCurrent(a.start, a.end));
}

function findCurrentMaha(periods: DashaMaha[]): DashaMaha | undefined {
  return periods.find((m) => isCurrent(m.start, m.end));
}

// One short, jargon-free paragraph synthesizing what the snapshot cards +
// Mangal Dosha actually mean, for someone who doesn't already know what a
// "Chandra Rasi" or "Manglik exception" is. Sits above the detail cards so
// there's always a plain-language entry point into the chart before the
// terminology starts.
function buildGlanceSummary(result: KundliChartPayload): string | null {
  const { nakshatra, mangalDosha } = result;
  if (!nakshatra.chandraRasi && !nakshatra.sooryaRasi) return null;

  const parts: string[] = [];
  if (nakshatra.chandraRasi) {
    parts.push(
      `Your Moon sits in ${nakshatra.chandraRasi}${
        nakshatra.nakshatraName ? `, within the ${nakshatra.nakshatraName} nakshatra` : ""
      } — in Vedic astrology this shapes your emotional instincts and inner temperament more than your Sun sign does.`,
    );
  }
  if (nakshatra.sooryaRasi) {
    parts.push(
      `Your Sun is in ${nakshatra.sooryaRasi}, which speaks to your core identity, willpower, and how you tend to show up in the world.`,
    );
  }
  if (mangalDosha) {
    if (!mangalDosha.hasDosha) {
      parts.push("You are not Manglik, so this particular factor won't come up in matchmaking.");
    } else if (mangalDosha.hasException) {
      parts.push(
        "You do carry a Manglik influence, but a classical exception applies to it — traditionally read as cancelling out most of its effect, so it's usually not a major concern.",
      );
    } else {
      parts.push(
        "You are Manglik — a factor commonly weighed in Indian marriage matching, worth discussing with an astrologer if it's relevant to you.",
      );
    }
  }
  return parts.join(" ");
}

// ---- small presentational pieces ----

function SnapshotCard({
  label,
  value,
  sub,
}: {
  label: string;
  value?: string;
  sub?: string;
}) {
  if (!value) return null;
  return (
    <div className="rounded-xl border border-border bg-background px-4 py-3.5 text-center">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="font-display text-lg font-semibold text-primary-deep">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value?: string | number }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground font-medium text-right">{value}</span>
    </div>
  );
}

// Birth details needed to independently request the chart SVG and the
// planet-position table — both are separate Prokerala calls from
// getKundliChart, fetched in parallel once a submission succeeds.
interface ChartRequestInput {
  date: string;
  time: string;
  latitude: number;
  longitude: number;
  utcOffsetHours: number;
}

function PlanetPositionsTable({ planets }: { planets: PlanetPositionItem[] }) {
  if (planets.length === 0) return null;
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs text-muted-foreground">
            <th className="px-4 py-2.5 font-medium">Planet</th>
            <th className="px-4 py-2.5 font-medium">Rasi</th>
            <th className="px-4 py-2.5 font-medium">Rasi Lord</th>
            <th className="px-4 py-2.5 font-medium">House</th>
            <th className="px-4 py-2.5 font-medium">Degree</th>
          </tr>
        </thead>
        <tbody>
          {planets.map((p) => (
            <tr key={p.name} className="border-b border-border/60 last:border-0">
              <td className="px-4 py-2.5 font-medium text-foreground">
                {p.name}
                {p.isRetrograde && (
                  <span className="ml-1.5 text-[10px] font-medium text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full align-middle">
                    Retrograde
                  </span>
                )}
              </td>
              <td className="px-4 py-2.5 text-foreground/90">{p.rasi ?? "—"}</td>
              <td className="px-4 py-2.5 text-muted-foreground">{p.rasiLord ?? "—"}</td>
              <td className="px-4 py-2.5 text-muted-foreground">{p.house ?? "—"}</td>
              <td className="px-4 py-2.5 text-muted-foreground">
                {typeof p.degree === "number" ? `${p.degree.toFixed(2)}°` : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ChartAndPlanetsSection({ input }: { input: ChartRequestInput }) {
  const [chartStyle, setChartStyle] = useState<"north-indian" | "south-indian">("north-indian");
  const [svg, setSvg] = useState<string | null>(null);
  const [svgLoading, setSvgLoading] = useState(true);
  const [svgError, setSvgError] = useState<string | null>(null);
  const [planets, setPlanets] = useState<PlanetPositionItem[]>([]);
  const [planetsLoading, setPlanetsLoading] = useState(true);
  const [planetsError, setPlanetsError] = useState<string | null>(null);

  // Planet positions don't depend on chart style — fetch once per
  // submission only. Splitting this from the SVG effect below means
  // toggling North/South Indian doesn't burn a second planet-position call
  // against Prokerala's rate limit for no reason.
  useEffect(() => {
    let cancelled = false;
    setPlanetsLoading(true);
    setPlanetsError(null);

    getPlanetPositions({ data: input })
      .then((result) => {
        if (!cancelled) setPlanets(result);
      })
      .catch((err) => {
        if (!cancelled) {
          setPlanetsError(err instanceof Error ? err.message : "Couldn't load planet positions");
        }
      })
      .finally(() => {
        if (!cancelled) setPlanetsLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input.date, input.time, input.latitude, input.longitude, input.utcOffsetHours]);

  useEffect(() => {
    let cancelled = false;
    setSvgLoading(true);
    setSvgError(null);

    getKundliChartSvg({ data: { ...input, chartType: "rasi", chartStyle } })
      .then((result) => {
        if (!cancelled) setSvg(result);
      })
      .catch((err) => {
        if (!cancelled) {
          setSvgError(err instanceof Error ? err.message : "Couldn't load the chart");
        }
      })
      .finally(() => {
        if (!cancelled) setSvgLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input.date, input.time, input.latitude, input.longitude, input.utcOffsetHours, chartStyle]);

  const loading = planetsLoading || svgLoading;

  return (
    <div className="rounded-xl border border-border bg-card px-5 py-4 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
          <LayoutGrid className="h-4 w-4 text-primary-deep" />
          Your Rasi Chart (D1)
        </p>
        <div className="inline-flex rounded-full border border-border p-0.5 text-xs">
          {(["north-indian", "south-indian"] as const).map((style) => (
            <button
              key={style}
              type="button"
              onClick={() => setChartStyle(style)}
              className={`px-3 py-1 rounded-full transition-colors ${
                chartStyle === style
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {style === "north-indian" ? "North Indian" : "South Indian"}
            </button>
          ))}
        </div>
      </div>

      {svgLoading && (
        <div className="flex items-center justify-center py-12 text-sm text-muted-foreground gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Drawing your chart…
        </div>
      )}

      {svgError && !svgLoading && <p className="text-sm text-destructive py-4">{svgError}</p>}

      {!svgLoading && !svgError && svg && (
        <div
          className="mx-auto max-w-sm [&_svg]:w-full [&_svg]:h-auto"
          // Prokerala's own rendered chart SVG — safe to inline, sourced
          // directly from our own server function's response, not user input.
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      )}

      <div className="pt-1">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
          <Orbit className="h-3.5 w-3.5" />
          Planet Positions
        </p>
        {planetsLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading planet positions…
          </div>
        )}
        {planetsError && !planetsLoading && (
          <p className="text-sm text-destructive py-2">{planetsError}</p>
        )}
        {!planetsLoading && !planetsError && planets.length > 0 && (
          <PlanetPositionsTable planets={planets} />
        )}
      </div>
    </div>
  );
}

function KundliResult({
  result,
  onDownload,
  chartInput,
}: {
  result: KundliChartPayload;
  onDownload: () => void;
  chartInput: ChartRequestInput;
}) {
  const { nakshatra, mangalDosha, yogaGroups, dashaPeriods, dashaBalance } = result;

  const currentMaha = findCurrentMaha(dashaPeriods);
  const currentAntar = currentMaha ? findCurrentAntar(currentMaha.antardasha) : undefined;
  const glanceSummary = buildGlanceSummary(result);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={onDownload}
          className="flex items-center gap-1.5 text-xs font-medium text-primary-deep bg-primary/10 hover:bg-primary/15 transition-colors px-3 py-1.5 rounded-full"
        >
          <Download className="h-3.5 w-3.5" />
          Download PDF
        </button>
      </div>

      {/* Birth snapshot */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SnapshotCard
          label="Nakshatra"
          value={nakshatra.nakshatraName}
          sub={nakshatra.pada ? `Pada ${nakshatra.pada}` : undefined}
        />
        <SnapshotCard
          label="Moon Sign"
          value={nakshatra.chandraRasi}
          sub={nakshatra.chandraRasiLord?.vedicName}
        />
        <SnapshotCard
          label="Sun Sign"
          value={nakshatra.sooryaRasi}
          sub={nakshatra.sooryaRasiLord?.vedicName}
        />
        <SnapshotCard label="Zodiac (Western)" value={nakshatra.zodiac} />
      </div>

      {/* The actual chart + planet-by-planet placements — the piece that
          was missing entirely before: everything above this point was
          interpretation, with nothing to visually verify it against. */}
      <ChartAndPlanetsSection input={chartInput} />

      {/* Plain-English synthesis — the entry point before the jargon starts */}
      {glanceSummary && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 px-5 py-4">
          <p className="text-xs font-semibold text-primary-deep uppercase tracking-wide mb-1.5">
            Your Kundli, in Plain Words
          </p>
          <p className="text-sm text-foreground/90 leading-relaxed">{glanceSummary}</p>
        </div>
      )}

      {/* Nakshatra details */}
      <div className="rounded-xl border border-border bg-card px-5 py-4">
        <p className="text-sm font-semibold text-foreground mb-3">Nakshatra Details</p>
        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
          <DetailRow
            label="Nakshatra Lord"
            value={
              nakshatra.nakshatraLord
                ? `${nakshatra.nakshatraLord.name}${nakshatra.nakshatraLord.vedicName ? ` (${nakshatra.nakshatraLord.vedicName})` : ""}`
                : undefined
            }
          />
          <DetailRow label="Deity" value={nakshatra.deity} />
          <DetailRow label="Ganam (temperament type)" value={nakshatra.ganam} />
          <DetailRow label="Symbol" value={nakshatra.symbol} />
          <DetailRow label="Animal Sign" value={nakshatra.animalSign} />
          <DetailRow label="Nadi (used in match-making)" value={nakshatra.nadi} />
          <DetailRow label="Best Direction" value={nakshatra.bestDirection} />
          <DetailRow label="Birth Stone" value={nakshatra.birthStone} />
          <DetailRow label="Syllables" value={nakshatra.syllables} />
          <DetailRow label="Colour" value={nakshatra.color} />
        </div>
      </div>

      {/* Mangal Dosha */}
      {mangalDosha && (
        <div
          className={`rounded-xl border px-5 py-4 ${
            mangalDosha.hasDosha
              ? "border-amber-200 bg-amber-50"
              : "border-green-200 bg-green-50"
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5">
            {mangalDosha.hasDosha ? (
              <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-green-700 shrink-0" />
            )}
            <p
              className={`text-sm font-semibold ${mangalDosha.hasDosha ? "text-amber-800" : "text-green-800"}`}
            >
              {mangalDosha.hasDosha ? "Manglik" : "Not Manglik"}
            </p>
          </div>
          {mangalDosha.description && (
            <p className="text-sm text-foreground/80 leading-relaxed">
              {mangalDosha.description}
            </p>
          )}
          {mangalDosha.hasException && mangalDosha.exceptions && (
            <p className="text-xs text-muted-foreground mt-2">
              <span className="font-medium">Exception applies: </span>
              {mangalDosha.exceptions}
            </p>
          )}
          {mangalDosha.remedies && (
            <p className="text-xs text-muted-foreground mt-1">
              <span className="font-medium">Remedies: </span>
              {mangalDosha.remedies}
            </p>
          )}
        </div>
      )}

      {/* Yogas actually present in the chart */}
      {yogaGroups.length > 0 && (
        <div className="rounded-xl border border-border bg-card px-5 py-4">
          <p className="text-sm font-semibold text-foreground mb-1">Yogas in Your Chart</p>
          <p className="text-xs text-muted-foreground mb-3">
            Special planetary combinations found in your birth chart, and what they traditionally
            point to.
          </p>
          <div className="space-y-4">
            {yogaGroups.map((group) => (
              <div key={group.name}>
                <p className="text-xs font-medium text-primary-deep mb-2">{group.name}</p>
                <div className="space-y-2">
                  {group.yogas.map((yoga) => {
                    const meaning = getYogaMeaning(yoga.name, group.name);
                    return (
                      <div
                        key={yoga.name}
                        className="rounded-lg border border-border/60 bg-background px-3.5 py-2.5"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="text-sm font-medium text-foreground">{yoga.name}</p>
                          {meaning && (
                            <span className="text-[10px] font-medium text-primary-deep bg-primary/10 px-1.5 py-0.5 rounded-full shrink-0">
                              {meaning.tag}
                            </span>
                          )}
                        </div>
                        {meaning ? (
                          <p className="text-xs text-foreground/80 leading-relaxed">{meaning.meaning}</p>
                        ) : (
                          yoga.description && (
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {yoga.description}
                            </p>
                          )
                        )}
                        {meaning && yoga.description && (
                          <details className="mt-1.5 group">
                            <summary className="text-[11px] text-muted-foreground cursor-pointer hover:text-primary-deep select-none">
                              Astrological detail
                            </summary>
                            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                              {yoga.description}
                            </p>
                          </details>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Dasha + full timeline */}
      {dashaPeriods.length > 0 && (
        <div className="rounded-xl border border-border bg-card px-5 py-4">
          <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
            <Clock3 className="h-4 w-4 text-primary-deep" />
            Vimshottari Dasha
          </p>

          {currentMaha && (
            <div className="rounded-lg bg-primary/5 border border-primary/20 px-4 py-3 mb-4">
              <p className="text-xs text-muted-foreground mb-0.5">Current Period</p>
              <p className="text-base font-semibold text-primary-deep">
                {currentMaha.name} Mahadasha
                {currentAntar && (
                  <span className="text-foreground font-normal"> — {currentAntar.name} Antardasha</span>
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDate(currentMaha.start)} – {formatDate(currentMaha.end)}
                {dashaBalance?.description && ` · ${dashaBalance.description} remaining`}
              </p>
            </div>
          )}

          <Accordion type="single" collapsible className="w-full">
            {dashaPeriods.map((maha) => {
              const activeMaha = isCurrent(maha.start, maha.end);
              return (
                <AccordionItem key={`${maha.name}-${maha.start}`} value={`${maha.name}-${maha.start}`}>
                  <AccordionTrigger className="text-sm">
                    <span className="flex items-center gap-2">
                      {maha.name}
                      {activeMaha && (
                        <span className="text-[10px] font-medium text-primary-deep bg-primary/10 px-1.5 py-0.5 rounded-full">
                          current
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-muted-foreground font-normal mr-2">
                      {formatDate(maha.start)} – {formatDate(maha.end)}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-1.5 pb-1">
                      {maha.antardasha.map((antar) => (
                        <div
                          key={`${antar.name}-${antar.start}`}
                          className={`flex items-center justify-between gap-3 text-xs rounded-md px-2.5 py-1.5 ${
                            isCurrent(antar.start, antar.end)
                              ? "bg-primary/10 text-primary-deep font-medium"
                              : "text-muted-foreground"
                          }`}
                        >
                          <span>{antar.name}</span>
                          <span>
                            {formatDate(antar.start)} – {formatDate(antar.end)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      )}
    </div>
  );
}

function KundliGeneratorPage() {
  const [details, setDetails] = useState<BirthDetails>(emptyBirthDetails);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<KundliChartPayload | null>(null);

  const canSubmit = isBirthDetailsComplete(details);

  const updateDetails = (d: BirthDetails) => {
    setDetails(d);
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      toast.error("Fill in your birth details and locate your place of birth first");
      return;
    }
    try {
      setLoading(true);
      setResult(null);
      const payload = await getKundliChart({
        data: {
          name: details.name,
          date: details.date,
          time: details.time,
          latitude: details.latitude as number,
          longitude: details.longitude as number,
          utcOffsetHours: details.utcOffsetHours as number,
        },
      });
      setResult(payload);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't generate the Kundli");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!result) return;
    try {
      await downloadKundliChartPdf(
        {
          name: details.name,
          date: details.date,
          time: details.time,
          place: details.resolvedPlace ?? details.place,
        },
        result,
      );
    } catch {
      toast.error("Couldn't generate the PDF — try again");
    }
  };

  return (
    <div className="relative min-h-screen bg-background">
      <Starfield />
      <div className="relative max-w-3xl mx-auto px-4 py-16 md:py-24">
        <Reveal>
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              Vedic Birth Chart
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-2">
              Kundli Generator
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Enter your exact birth details to generate your Vedic Kundli.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <BirthDetailsForm label="Your Details" value={details} onChange={updateDetails} />
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
                  Generating...
                </>
              ) : result ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Kundli Generated
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Kundli
                </>
              )}
            </button>
          </div>
        </Reveal>

        {result && (
          <Reveal>
            <div className="mt-10">
              <KundliResult
                result={result}
                onDownload={handleDownload}
                chartInput={{
                  date: details.date,
                  time: details.time,
                  latitude: details.latitude as number,
                  longitude: details.longitude as number,
                  utcOffsetHours: details.utcOffsetHours as number,
                }}
              />
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
// src/components/DailyHoroscope.tsx
// Daily / Weekly / Monthly horoscope card for the sign detail page.
// Phase A implementation per the roadmap — pulls a single forecast paragraph
// from freehoroscopeapi.com (no key needed) and caches it in localStorage so
// each sign only refetches once per period.

import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Sparkles,
  RefreshCw,
  AlertCircle,
  Briefcase,
  HeartPulse,
  Heart,
  Plane,
  Hash,
  Palette,
  Type,
  Lightbulb,
  Ban,
} from "lucide-react";
import { fetchHoroscope, type HoroscopePeriod } from "@/lib/horoscope-api";
import { getHoroscopeExtras, type DimensionRating } from "@/lib/horoscope-extras";

const TABS: { key: HoroscopePeriod; label: string }[] = [
  { key: "daily", label: "Today" },
  { key: "weekly", label: "This week" },
  { key: "monthly", label: "This month" },
];

function formatDate(dateStr: string, period: HoroscopePeriod) {
  const d = new Date(`${dateStr}T00:00:00`);
  if (isNaN(d.getTime())) return dateStr;

  if (period === "monthly") {
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }
  if (period === "weekly") {
    return `Week of ${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  }
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

// ─── Rating dots (1–5) ─────────────────────────────────────────────────────

function RatingDots({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${
            i < rating ? "bg-cosmic-foreground/80" : "bg-cosmic-foreground/15"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Dimension card ────────────────────────────────────────────────────────

function DimensionCard({ icon: Icon, data }: { icon: typeof Briefcase; data: DimensionRating }) {
  return (
    <div className="rounded-2xl bg-cosmic-foreground/5 border border-cosmic-foreground/10 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5 text-cosmic-foreground/60" />
          <p className="text-[11px] uppercase tracking-wider text-cosmic-foreground/60 font-semibold">
            {data.label}
          </p>
        </div>
        <RatingDots rating={data.rating} />
      </div>
      <p className="text-cosmic-foreground/80 text-xs leading-relaxed">{data.blurb}</p>
    </div>
  );
}

export default function DailyHoroscope({ signSlug, signName }: { signSlug: string; signName: string }) {
  const [period, setPeriod] = useState<HoroscopePeriod>("daily");
  // One-shot flag: set right before a manual retry, consumed (and reset) by
  // the very next fetch. This means "Try again" bypasses a bad cache entry
  // without permanently disabling caching for the rest of the session.
  const forceRefreshRef = useRef(false);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["horoscope", signSlug, period],
    queryFn: () => {
      const forceRefresh = forceRefreshRef.current;
      forceRefreshRef.current = false;
      return fetchHoroscope(signSlug, period, { forceRefresh });
    },
    staleTime: 1000 * 60 * 30,
    retry: 1,
  });

  const handleRetry = () => {
    forceRefreshRef.current = true;
    refetch();
  };

  return (
    <section className="max-w-4xl mx-auto px-6 -mt-8 mb-14 relative z-10">
      <div className="rounded-3xl bg-gradient-cosmic border border-cosmic-foreground/10 shadow-soft p-6 md:p-8">
        {/* Header row */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cosmic-foreground/70" />
            <p className="text-xs tracking-[0.16em] uppercase text-cosmic-foreground/70 font-medium">
              {signName}'s forecast
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex items-center gap-1 rounded-full bg-cosmic-foreground/5 border border-cosmic-foreground/10 p-1">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setPeriod(tab.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  period === tab.key
                    ? "bg-cosmic-foreground/15 text-cosmic-foreground"
                    : "text-cosmic-foreground/50 hover:text-cosmic-foreground/80"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-3 w-32 bg-cosmic-foreground/10 rounded-full" />
            <div className="h-4 w-full bg-cosmic-foreground/10 rounded-full" />
            <div className="h-4 w-full bg-cosmic-foreground/10 rounded-full" />
            <div className="h-4 w-2/3 bg-cosmic-foreground/10 rounded-full" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center text-center gap-3 py-4">
            <AlertCircle className="h-5 w-5 text-cosmic-foreground/50" />
            <p className="text-cosmic-foreground/60 text-sm max-w-sm">
              Couldn't load {signName}'s forecast right now. The horoscope service might be
              briefly unavailable.
            </p>
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-cosmic-foreground/80 hover:text-cosmic-foreground transition"
            >
              <RefreshCw className={`h-3 w-3 ${isFetching ? "animate-spin" : ""}`} />
              Try again
            </button>
          </div>
        ) : data ? (
          <div>
            <p className="text-cosmic-foreground/50 text-xs mb-3">{formatDate(data.date, period)}</p>
            <p className="text-cosmic-foreground text-base md:text-lg leading-relaxed">
              {data.horoscope}
            </p>

            <HoroscopeExtrasSection signSlug={signSlug} period={period} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

// ─── Extras: dimension badges, luck strip, avoid note ─────────────────────
// Placeholder-data layout, pending Phase B decision (DivineAPI vs. mock).
// See src/lib/horoscope-extras.ts for why this data isn't real yet.

function HoroscopeExtrasSection({ signSlug, period }: { signSlug: string; period: HoroscopePeriod }) {
  const extras = getHoroscopeExtras(signSlug, period);

  return (
    <div className="mt-8 pt-6 border-t border-cosmic-foreground/10">
      {/* Sample-data label — keep this visible until real data is wired up */}
      <div className="flex items-center gap-1.5 mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80" />
        <p className="text-[10px] uppercase tracking-[0.14em] text-cosmic-foreground/40 font-medium">
          Sample layout — not live data
        </p>
      </div>

      {/* Dimension badges */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <DimensionCard icon={Briefcase} data={extras.dimensions.career} />
        <DimensionCard icon={HeartPulse} data={extras.dimensions.health} />
        <DimensionCard icon={Heart} data={extras.dimensions.emotions} />
        <DimensionCard icon={Plane} data={extras.dimensions.travel} />
      </div>

      {/* Luck strip */}
      <div className="rounded-2xl bg-cosmic-foreground/5 border border-cosmic-foreground/10 p-4 mb-5">
        <p className="text-[11px] uppercase tracking-wider text-cosmic-foreground/60 font-semibold mb-3">
          Lucky today
        </p>
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex items-center gap-2">
            <Hash className="h-3.5 w-3.5 text-cosmic-foreground/50" />
            <span className="text-cosmic-foreground text-sm font-semibold">{extras.luck.number}</span>
          </div>
          <div className="flex items-center gap-2">
            <Palette className="h-3.5 w-3.5 text-cosmic-foreground/50" />
            <span
              className="w-3 h-3 rounded-full border border-cosmic-foreground/20"
              style={{ backgroundColor: extras.luck.colorHex }}
            />
            <span className="text-cosmic-foreground text-sm font-semibold">{extras.luck.color}</span>
          </div>
          <div className="flex items-center gap-2">
            <Type className="h-3.5 w-3.5 text-cosmic-foreground/50" />
            <span className="text-cosmic-foreground text-sm font-semibold">{extras.luck.alphabet}</span>
          </div>
        </div>
        <div className="flex items-start gap-2 mt-3 pt-3 border-t border-cosmic-foreground/10">
          <Lightbulb className="h-3.5 w-3.5 text-cosmic-foreground/50 mt-0.5 flex-shrink-0" />
          <p className="text-cosmic-foreground/70 text-xs leading-relaxed">{extras.luck.cosmicTip}</p>
        </div>
      </div>

      {/* What to avoid */}
      <div className="flex items-start gap-2.5 rounded-2xl bg-cosmic-foreground/5 border border-cosmic-foreground/10 p-4">
        <Ban className="h-3.5 w-3.5 text-cosmic-foreground/50 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-[11px] uppercase tracking-wider text-cosmic-foreground/60 font-semibold mb-1">
            What to avoid
          </p>
          <p className="text-cosmic-foreground/70 text-xs leading-relaxed">{extras.avoid}</p>
        </div>
      </div>
    </div>
  );
}
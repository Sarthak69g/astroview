import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { zodiacSigns, getSignByDate, type Element, type ZodiacSign } from "../../data/zodiacData";
import { ChevronRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import Starfield from "@/components/Starfield";

export const Route = createFileRoute("/horoscope/")({
  head: () => ({
    meta: [
      { title: "Zodiac Signs & Horoscopes — AstroView" },
      {
        name: "description",
        content:
          "Explore all 12 Vedic zodiac signs — traits, strengths, compatibility, and how each sign maps to your life path. Grounded in classical Jyotish, written for the modern reader.",
      },
      { property: "og:title", content: "Zodiac Signs & Horoscopes — AstroView" },
    ],
  }),
  component: HoroscopeHub,
});

// ─── Element colours (consistent with the design system) ─────────────────────

const elementConfig: Record<Element, { label: string; bg: string; text: string; dot: string }> = {
  Fire:  { label: "Fire",  bg: "bg-rose-500/10",   text: "text-rose-700",   dot: "bg-rose-400" },
  Earth: { label: "Earth", bg: "bg-emerald-500/10", text: "text-emerald-700", dot: "bg-emerald-400" },
  Air:   { label: "Air",   bg: "bg-sky-500/10",     text: "text-sky-700",    dot: "bg-sky-400" },
  Water: { label: "Water", bg: "bg-violet-500/10",  text: "text-violet-700", dot: "bg-violet-400" },
};

// ─── Sign finder (by date of birth) ──────────────────────────────────────────

function SignFinder() {
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [result, setResult] = useState<ZodiacSign | null>(null);

  function find() {
    const m = parseInt(month);
    const d = parseInt(day);
    if (!m || !d || m < 1 || m > 12 || d < 1 || d > 31) return;
    setResult(getSignByDate(m, d));
  }

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-card max-w-lg mx-auto">
      <p className="text-xs tracking-[0.16em] uppercase text-primary font-medium mb-2">Find your sign</p>
      <p className="text-muted-foreground text-sm mb-5">Enter your date of birth to find your Vedic sun sign.</p>

      <div className="flex gap-3 mb-4">
        <select
          value={month}
          onChange={(e) => { setMonth(e.target.value); setResult(null); }}
          className="flex-1 h-11 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
        >
          <option value="">Month</option>
          {months.map((m, i) => (
            <option key={m} value={String(i + 1)}>{m}</option>
          ))}
        </select>

        <select
          value={day}
          onChange={(e) => { setDay(e.target.value); setResult(null); }}
          className="w-24 h-11 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
        >
          <option value="">Day</option>
          {Array.from({ length: 31 }, (_, i) => (
            <option key={i + 1} value={String(i + 1)}>{i + 1}</option>
          ))}
        </select>

        <button
          onClick={find}
          disabled={!month || !day}
          className="px-5 h-11 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-medium disabled:opacity-40 transition hover:opacity-95"
        >
          Find
        </button>
      </div>

      {result && (
        <Link
          to="/horoscope/$sign"
          params={{ sign: result.slug }}
          className="flex items-center gap-4 p-4 rounded-xl bg-accent/50 border border-primary/20 hover:border-primary/40 transition group"
        >
          <span className="text-4xl">{result.symbol}</span>
          <div className="flex-1 min-w-0">
            <p className="font-display text-lg font-semibold text-foreground">
              {result.name} <span className="text-muted-foreground font-normal text-sm">({result.vedicName})</span>
            </p>
            <p className="text-xs text-muted-foreground">{result.dateRange} · {result.element} · {result.rulingPlanet}</p>
            <p className="text-sm text-muted-foreground mt-1 truncate">{result.blurb}</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition flex-shrink-0" />
        </Link>
      )}
    </div>
  );
}

// ─── Sign card ────────────────────────────────────────────────────────────────

function SignCard({ sign }: { sign: ZodiacSign }) {
  const el = elementConfig[sign.element];
  return (
    <Link
      to="/horoscope/$sign"
      params={{ sign: sign.slug }}
      className="group relative flex flex-col h-full bg-card border border-border rounded-2xl p-5 hover:border-primary/40 hover:shadow-card transition-all duration-300 hover:-translate-y-1"
    >
      {/* Top accent */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute top-0 left-0 rounded-t-2xl" />

      <div className="flex items-start justify-between mb-3">
        <span className="text-4xl leading-none">{sign.symbol}</span>
        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${el.bg} ${el.text}`}>
          {sign.element}
        </span>
      </div>

      <h2 className="font-display text-xl font-semibold text-foreground mb-0.5">{sign.name}</h2>
      <p className="text-xs text-muted-foreground mb-1">{sign.vedicName} · {sign.rulingPlanet}</p>
      <p className="text-xs text-primary font-medium mb-3">{sign.dateRange}</p>
      <p className="text-sm text-muted-foreground leading-relaxed flex-1">{sign.blurb}</p>

      <div className="flex items-center gap-1 mt-4 text-xs font-medium text-primary-deep group-hover:gap-2 transition-all">
        Explore {sign.name}
        <ChevronRight className="h-3 w-3" />
      </div>
    </Link>
  );
}

// ─── Hub page ─────────────────────────────────────────────────────────────────

function HoroscopeHub() {
  const [activeElement, setActiveElement] = useState<Element | "All">("All");

  const filtered = activeElement === "All"
    ? zodiacSigns
    : zodiacSigns.filter((s) => s.element === activeElement);

  const elements: (Element | "All")[] = ["All", "Fire", "Earth", "Air", "Water"];

  return (
    <main className="min-h-screen bg-background text-foreground">

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-36 md:pt-40 pb-16">
        <div className="absolute inset-0 -z-10 bg-gradient-hero" />
        <Starfield />

        {/* Decorative zodiac symbols */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none select-none" aria-hidden="true">
          {["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓","♈","♍","♏","♑"].map((sym, i) => (
            <span
              key={i}
              className="absolute text-primary/[0.14] font-display font-bold"
              style={{
                fontSize: `${((i * 41) % 46) + 26}px`,
                left: `${(i * 6.4) % 100}%`,
                top: `${(i * 13 + 6) % 85}%`,
                transform: `rotate(${i * 15}deg)`,
              }}
            >
              {sym}
            </span>
          ))}
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium mb-5">
            Zodiac & Horoscopes
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-semibold tracking-tight text-foreground leading-tight mb-6">
            Know your sign.
            <br />
            <span className="text-gradient">Know yourself.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Each of the 12 Vedic signs carries a distinct energy, element, and planetary ruler.
            Explore what yours reveals about how you think, love, work, and grow.
          </p>
        </div>

        {/* Scrolling sign strip */}
        <div className="mt-12 flex justify-center gap-3 flex-wrap max-w-2xl mx-auto">
          {zodiacSigns.map((s) => (
            <Link
              key={s.slug}
              to="/horoscope/$sign"
              params={{ sign: s.slug }}
              className="flex flex-col items-center gap-1 p-2.5 rounded-xl hover:bg-card hover:shadow-card transition-all group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{s.symbol}</span>
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-medium">{s.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Sign finder */}
      <section className="px-6 pb-16">
        <Reveal>
          <SignFinder />
        </Reveal>
      </section>

      {/* Sign grid with element filter */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <Reveal>
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <p className="text-xs tracking-[0.16em] uppercase text-primary font-medium mb-1">All Signs</p>
              <h2 className="font-display text-2xl font-semibold text-foreground">Browse by element.</h2>
            </div>

            {/* Element filter pills */}
            <div className="flex gap-2 flex-wrap">
              {elements.map((el) => {
                const isActive = activeElement === el;
                const cfg = el !== "All" ? elementConfig[el] : null;
                return (
                  <button
                    key={el}
                    onClick={() => setActiveElement(el)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      isActive
                        ? "bg-gradient-primary text-primary-foreground border-transparent shadow-soft"
                        : "bg-card border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                    }`}
                  >
                    {cfg && <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />}
                    {el}
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((sign, i) => (
            <Reveal key={sign.slug} delay={(i % 4) * 60} className="h-full">
              <SignCard sign={sign} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gradient-cosmic py-14 px-6 text-center">
        <Reveal>
          <h2 className="font-display text-3xl font-semibold text-cosmic-foreground mb-3">
            Your sun sign is one layer.
          </h2>
          <p className="text-cosmic-foreground/70 text-sm mb-7 max-w-md mx-auto leading-relaxed">
            A full birth chart reading goes far deeper — your moon sign, rising sign, planetary
            house positions, and Dasha timeline all shape who you are and what's ahead.
          </p>
          <Link
            to="/consultation"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-95 transition"
          >
            Explore birth chart analysis
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </section>

    </main>
  );
}
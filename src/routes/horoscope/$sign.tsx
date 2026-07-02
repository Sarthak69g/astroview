import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { zodiacSigns, getSignBySlug, getCompatibility, type ZodiacSign, type Element } from "../../data/zodiacData";
import { services } from "../../data/servicesData";
import { ChevronRight, Star, Zap, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/horoscope/$sign")({
  component: SignDetailPage,
});

// ─── Element colours ──────────────────────────────────────────────────────────

const elementConfig: Record<Element, { bg: string; text: string; border: string; glow: string }> = {
  Fire:  { bg: "bg-rose-500/10",    text: "text-rose-700",    border: "border-rose-500/20",    glow: "shadow-rose-500/20" },
  Earth: { bg: "bg-emerald-500/10", text: "text-emerald-700", border: "border-emerald-500/20", glow: "shadow-emerald-500/20" },
  Air:   { bg: "bg-sky-500/10",     text: "text-sky-700",     border: "border-sky-500/20",     glow: "shadow-sky-500/20" },
  Water: { bg: "bg-violet-500/10",  text: "text-violet-700",  border: "border-violet-500/20",  glow: "shadow-violet-500/20" },
};

// ─── Compatibility colour map ─────────────────────────────────────────────────

const compatConfig = {
  green:   { bar: "bg-emerald-400", label: "text-emerald-700", bg: "bg-emerald-500/8",  border: "border-emerald-500/20" },
  amber:   { bar: "bg-amber-400",   label: "text-amber-700",   bg: "bg-amber-500/8",    border: "border-amber-500/20" },
  neutral: { bar: "bg-slate-400",   label: "text-slate-600",   bg: "bg-slate-500/8",    border: "border-slate-300" },
  rose:    { bar: "bg-rose-400",    label: "text-rose-700",    bg: "bg-rose-500/8",     border: "border-rose-500/20" },
};

// ─── Sign selector strip ──────────────────────────────────────────────────────

function SignStrip({ current }: { current: string }) {
  return (
    <div className="overflow-x-auto scrollbar-none">
      <div className="flex gap-2 min-w-max px-6 pb-2">
        {zodiacSigns.map((s) => (
          <Link
            key={s.slug}
            to="/horoscope/$sign"
            params={{ sign: s.slug }}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all flex-shrink-0 ${
              s.slug === current
                ? "bg-primary/10 border border-primary/30"
                : "hover:bg-accent border border-transparent"
            }`}
          >
            <span className="text-xl leading-none">{s.symbol}</span>
            <span className={`text-[9px] uppercase tracking-wider font-semibold ${
              s.slug === current ? "text-primary-deep" : "text-muted-foreground"
            }`}>
              {s.name.slice(0, 3).toUpperCase()}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Compatibility grid ───────────────────────────────────────────────────────

function CompatibilityGrid({ sign }: { sign: ZodiacSign }) {
  const others = zodiacSigns.filter((s) => s.slug !== sign.slug);

  return (
    <div>
      <p className="text-xs tracking-[0.16em] uppercase text-primary font-medium mb-2">Compatibility</p>
      <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
        {sign.name} with every sign.
      </h2>
      <p className="text-muted-foreground text-sm mb-8 max-w-lg">
        Scored out of 36 using the Vedic Guna Milan framework — element harmony, sign distance,
        mode, and Naisargika Maitri (natural planetary friendship).
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {others.map((other) => {
          const result = getCompatibility(sign, other);
          const cfg = compatConfig[result.color];
          const pct = Math.round((result.score / 36) * 100);

          return (
            <Link
              key={other.slug}
              to="/horoscope/$sign"
              params={{ sign: other.slug }}
              className={`group flex flex-col items-center gap-2 p-4 rounded-xl border ${cfg.bg} ${cfg.border} hover:shadow-card transition-all hover:-translate-y-0.5`}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{sign.symbol}</span>
                <span className="text-muted-foreground text-xs">&</span>
                <span className="text-2xl">{other.symbol}</span>
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                {sign.name.slice(0,3).toUpperCase()} & {other.name.slice(0,3).toUpperCase()}
              </p>

              {/* Score bar */}
              <div className="w-full bg-border/50 rounded-full h-1">
                <div
                  className={`h-1 rounded-full ${cfg.bar} transition-all`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <p className={`text-base font-bold ${cfg.label}`}>{pct}%</p>
              <p className={`text-[10px] font-semibold uppercase tracking-wider ${cfg.label}`}>
                {result.label}
              </p>
            </Link>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-muted-foreground/70 max-w-lg">
        * These scores are based on classical Vedic principles and serve as an indicative guide.
        A full Kundali matching consultation accounts for the complete birth chart — including
        moon sign, rising sign, and planetary positions — which reveals the true picture.
      </p>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

function SignDetailPage() {
  const { sign: signSlug } = useParams({ strict: false }) as { sign: string };
  const sign = getSignBySlug(signSlug);

  if (!sign) throw notFound();

  const el = elementConfig[sign.element];

  // Find the related service for this sign
  const relatedService = services.find((s) => s.slug === sign.relatedServiceSlug);

  // Best and most challenging matches
  const allCompat = zodiacSigns
    .filter((s) => s.slug !== sign.slug)
    .map((s) => ({ sign: s, result: getCompatibility(sign, s) }))
    .sort((a, b) => b.result.score - a.result.score);
  const bestMatches = allCompat.slice(0, 3);
  const hardMatches = allCompat.slice(-2);

  return (
    <main className="min-h-screen bg-background text-foreground">

      {/* Sign selector strip */}
      <div className="fixed top-[72px] left-0 right-0 z-40 bg-background/90 backdrop-blur-md border-b border-border py-2">
        <SignStrip current={signSlug} />
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-44 pb-16">
        <div className="absolute inset-0 -z-10 bg-gradient-hero" />

        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/horoscope" className="hover:text-foreground transition-colors">Horoscope</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground capitalize">{sign.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-start gap-8">
            {/* Symbol */}
            <div className={`w-28 h-28 rounded-2xl ${el.bg} border ${el.border} flex items-center justify-center flex-shrink-0 shadow-lg ${el.glow}`}>
              <span className="text-6xl leading-none">{sign.symbol}</span>
            </div>

            {/* Identity */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${el.bg} ${el.text} ${el.border}`}>
                  {sign.element}
                </span>
                <span className="text-xs font-medium text-muted-foreground px-2.5 py-1 rounded-full bg-accent border border-border">
                  {sign.mode}
                </span>
                <span className="text-xs font-medium text-muted-foreground px-2.5 py-1 rounded-full bg-accent border border-border">
                  Ruled by {sign.rulingPlanet}
                </span>
              </div>

              <h1 className="font-display text-5xl md:text-6xl font-semibold text-foreground mb-1">
                {sign.name}
              </h1>
              <p className="text-primary font-medium text-lg mb-1 italic">{sign.vedicName}</p>
              <p className="text-muted-foreground text-sm mb-5">{sign.dateRange}</p>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl">
                {sign.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Traits pill row */}
      <section className="border-y border-border bg-accent/20 py-5 px-6">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-2">
          {sign.traits.map((t) => (
            <span key={t} className="px-3.5 py-1.5 rounded-full bg-card border border-border text-sm font-medium text-foreground">
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* Strengths + Challenges */}
      <section className="max-w-4xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-5">
            <Star className="h-4 w-4 text-primary-deep" />
            <p className="text-xs tracking-[0.16em] uppercase text-primary font-medium">Strengths</p>
          </div>
          <ul className="space-y-3">
            {sign.strengths.map((s) => (
              <li key={s} className="flex items-start gap-3">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                <span className="text-foreground text-sm leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-5">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <p className="text-xs tracking-[0.16em] uppercase text-amber-600 font-medium">Challenges</p>
          </div>
          <ul className="space-y-3">
            {sign.challenges.map((c) => (
              <li key={c} className="flex items-start gap-3">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                <span className="text-foreground text-sm leading-relaxed">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Quick compatibility highlights */}
      <section className="bg-accent/30 border-y border-border px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Best matches */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-4 w-4 text-emerald-600" />
                <p className="text-xs tracking-[0.16em] uppercase text-emerald-700 font-medium">Best matches</p>
              </div>
              <div className="space-y-2">
                {bestMatches.map(({ sign: other, result }) => {
                  const pct = Math.round((result.score / 36) * 100);
                  return (
                    <Link
                      key={other.slug}
                      to="/horoscope/$sign"
                      params={{ sign: other.slug }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-emerald-500/30 hover:bg-emerald-500/5 transition group"
                    >
                      <span className="text-2xl">{other.symbol}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{other.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
                            <div className="h-1 bg-emerald-400 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-emerald-700 font-semibold">{pct}%</span>
                        </div>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-emerald-600 transition" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Harder matches */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-4 w-4 text-rose-500" />
                <p className="text-xs tracking-[0.16em] uppercase text-rose-600 font-medium">More challenging</p>
              </div>
              <div className="space-y-2">
                {hardMatches.map(({ sign: other, result }) => {
                  const pct = Math.round((result.score / 36) * 100);
                  return (
                    <Link
                      key={other.slug}
                      to="/horoscope/$sign"
                      params={{ sign: other.slug }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-rose-500/30 hover:bg-rose-500/5 transition group"
                    >
                      <span className="text-2xl">{other.symbol}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{other.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
                            <div className="h-1 bg-rose-400 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-rose-600 font-semibold">{pct}%</span>
                        </div>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-rose-500 transition" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full compatibility grid */}
      <section className="max-w-4xl mx-auto px-6 py-14">
        <CompatibilityGrid sign={sign} />
      </section>

      {/* Service CTA */}
      {relatedService && (
        <section className="bg-gradient-cosmic py-14 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-cosmic-foreground/60 mb-3">
              Go deeper
            </p>
            <h2 className="font-display text-3xl font-semibold text-cosmic-foreground mb-4">
              {sign.name} in your chart is more than just your sun sign.
            </h2>
            <p className="text-cosmic-foreground/70 text-sm leading-relaxed mb-3 max-w-lg mx-auto">
              {sign.relatedServiceNote}
            </p>
            <p className="text-cosmic-foreground/50 text-xs mb-8">
              Most relevant service: <span className="text-cosmic-foreground/80 font-medium">{relatedService.name}</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/services/$slug"
                params={{ slug: sign.relatedServiceSlug }}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-95 transition"
              >
                Explore {relatedService.name}
                <ChevronRight className="h-4 w-4" />
              </Link>
              <a
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-cosmic-foreground/20 text-cosmic-foreground/80 text-sm font-medium hover:border-cosmic-foreground/40 transition"
              >
                Get in touch
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Other signs */}
      <section className="max-w-4xl mx-auto px-6 py-14">
        <p className="text-xs tracking-[0.16em] uppercase text-primary font-medium mb-2">Explore</p>
        <h2 className="font-display text-2xl font-semibold text-foreground mb-6">Other signs.</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {zodiacSigns
            .filter((s) => s.slug !== sign.slug)
            .slice(0, 8)
            .map((s) => (
              <Link
                key={s.slug}
                to="/horoscope/$sign"
                params={{ sign: s.slug }}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-card transition group"
              >
                <span className="text-xl">{s.symbol}</span>
                <div>
                  <p className="text-sm font-medium text-foreground group-hover:text-primary-deep transition">{s.name}</p>
                  <p className="text-[10px] text-muted-foreground">{s.dateRange}</p>
                </div>
              </Link>
            ))}
        </div>
        <div className="mt-6 text-center">
          <Link to="/horoscope" className="text-sm text-muted-foreground hover:text-foreground transition">
            View all 12 signs →
          </Link>
        </div>
      </section>

    </main>
  );
}
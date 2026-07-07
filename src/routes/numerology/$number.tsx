// src/routes/numerology/$number.tsx
import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { numerologyNumbers, getNumberBySlug } from "../../data/numerologyData";
import { ChevronRight, Star, AlertTriangle, Heart, Compass, Sparkles } from "lucide-react";

export const Route = createFileRoute("/numerology/$number")({
  component: NumberDetailPage,
});

// ─── Number strip ─────────────────────────────────────────────────────────────

function NumberStrip({ current }: { current: string }) {
  return (
    <div className="overflow-x-auto scrollbar-none">
      <div className="flex justify-center gap-2 min-w-max mx-auto px-6 pb-2">
        {numerologyNumbers.map((n) => (
          <Link
            key={n.slug}
            to="/numerology/$number"
            params={{ number: n.slug }}
            className={`flex flex-col items-center gap-1 px-3.5 py-2 rounded-xl transition-all flex-shrink-0 ${
              n.slug === current
                ? "bg-primary/10 border border-primary/30"
                : "hover:bg-accent border border-transparent"
            }`}
          >
            <span className="text-lg leading-none font-display font-semibold">{n.number}</span>
            <span className={`text-[9px] uppercase tracking-wider font-semibold whitespace-nowrap ${
              n.slug === current ? "text-primary-deep" : "text-muted-foreground"
            }`}>
              {n.title.replace("The ", "")}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Context notes (Life Path / Destiny / Soul Urge) ──────────────────────────

function ContextNotes({ n }: { n: (typeof numerologyNumbers)[number] }) {
  const notes = [
    { icon: Compass, label: "As your Life Path", text: n.lifePathNote },
    { icon: Star, label: "As your Destiny", text: n.destinyNote },
    { icon: Heart, label: "As your Soul Urge", text: n.soulUrgeNote },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-5">
      {notes.map(({ icon: Icon, label, text }) => (
        <div key={label} className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Icon className="h-4 w-4 text-primary-deep" />
            <p className="text-xs tracking-[0.14em] uppercase text-primary font-medium">{label}</p>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

function NumberDetailPage() {
  const { number: numberSlug } = useParams({ strict: false }) as { number: string };
  const n = getNumberBySlug(numberSlug);

  if (!n) throw notFound();

  const others = numerologyNumbers.filter((o) => o.slug !== n.slug);

  return (
    <main className="min-h-screen bg-background text-foreground">

      {/* Number selector strip */}
      <div className="fixed top-[72px] left-0 right-0 z-40 bg-background/90 backdrop-blur-md border-b border-border py-2">
        <NumberStrip current={numberSlug} />
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-44 pb-16">
        <div className="absolute inset-0 -z-10 bg-gradient-hero" />

        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/numerology" className="hover:text-foreground transition-colors">Numerology</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">Number {n.number}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-start gap-8">
            {/* Symbol */}
            <div className="w-28 h-28 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/10">
              <span className="font-display text-5xl font-semibold text-primary-deep leading-none">{n.number}</span>
            </div>

            {/* Identity */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {n.isMaster && (
                  <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border bg-violet-500/10 text-violet-700 border-violet-500/20 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> Master Number
                  </span>
                )}
                <span className="text-xs font-medium text-muted-foreground px-2.5 py-1 rounded-full bg-accent border border-border">
                  {n.tagline}
                </span>
              </div>

              <h1 className="font-display text-5xl md:text-6xl font-semibold text-foreground mb-1">
                {n.title}
              </h1>
              <p className="text-primary font-medium text-lg mb-5 italic">Number {n.number}</p>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl">
                {n.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Context notes */}
      <section className="max-w-4xl mx-auto px-6 pb-14">
        <p className="text-xs tracking-[0.16em] uppercase text-primary font-medium mb-2">In context</p>
        <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
          What Number {n.number} means, depending on where it shows up.
        </h2>
        <ContextNotes n={n} />
      </section>

      {/* Strengths + Challenges */}
      <section className="max-w-4xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-10 border-t border-border">
        <div>
          <div className="flex items-center gap-2 mb-5">
            <Star className="h-4 w-4 text-primary-deep" />
            <p className="text-xs tracking-[0.16em] uppercase text-primary font-medium">Strengths</p>
          </div>
          <ul className="space-y-3">
            {n.strengths.map((s) => (
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
            {n.challenges.map((c) => (
              <li key={c} className="flex items-start gap-3">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                <span className="text-foreground text-sm leading-relaxed">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Service CTA */}
      <section className="bg-gradient-cosmic py-14 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-cosmic-foreground/60 mb-3">
            Go deeper
          </p>
          <h2 className="font-display text-3xl font-semibold text-cosmic-foreground mb-4">
            Number {n.number} is one part of a much bigger picture.
          </h2>
          <p className="text-cosmic-foreground/70 text-sm leading-relaxed mb-8 max-w-lg mx-auto">
            A full Tarot & numerology consultation reads all of your core numbers together —
            Life Path, Destiny, Soul Urge, and more — alongside the cards, for a fuller picture
            than any single number can give on its own.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/services/$slug"
              params={{ slug: "tarot-numerology" }}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-95 transition"
            >
              Explore Tarot & numerology
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

      {/* Other numbers */}
      <section className="max-w-4xl mx-auto px-6 py-14">
        <p className="text-xs tracking-[0.16em] uppercase text-primary font-medium mb-2">Explore</p>
        <h2 className="font-display text-2xl font-semibold text-foreground mb-6">Other numbers.</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {others.slice(0, 8).map((o) => (
            <Link
              key={o.slug}
              to="/numerology/$number"
              params={{ number: o.slug }}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-card transition group"
            >
              <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary-deep font-display font-semibold flex-shrink-0">
                {o.number}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground group-hover:text-primary-deep transition truncate">{o.title}</p>
                <p className="text-[10px] text-muted-foreground">Number {o.number}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link to="/numerology" className="text-sm text-muted-foreground hover:text-foreground transition">
            View all numbers →
          </Link>
        </div>
      </section>

    </main>
  );
}

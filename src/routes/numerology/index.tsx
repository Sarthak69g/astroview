// src/routes/numerology/index.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { numerologyNumbers } from "../../data/numerologyData";
import NumerologyCalculator from "@/components/NumerologyCalculator";
import Starfield from "@/components/Starfield";
import Reveal from "@/components/Reveal";
import { ChevronRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/numerology/")({
  head: () => ({
    meta: [
      { title: "Numerology — Life Path, Destiny & Soul Urge Numbers — AstroView" },
      {
        name: "description",
        content:
          "Discover what your Life Path, Destiny, and Soul Urge numbers reveal about you. A real Pythagorean numerology calculator, plus meanings for every core and Master Number.",
      },
      { property: "og:title", content: "Numerology — AstroView" },
    ],
  }),
  component: NumerologyHub,
});

const coreNumbers = numerologyNumbers.filter((n) => !n.isMaster);
const masterNumbers = numerologyNumbers.filter((n) => n.isMaster);

function NumberCard({ n }: { n: (typeof numerologyNumbers)[number] }) {
  return (
    <Link
      to="/numerology/$number"
      params={{ number: n.slug }}
      className="group relative flex flex-col bg-card border border-border rounded-2xl p-5 hover:border-primary/40 hover:shadow-card transition-all duration-300 hover:-translate-y-1"
    >
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute top-0 left-0 rounded-t-2xl" />

      <div className="flex items-start justify-between mb-3">
        <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary-deep font-display text-2xl font-semibold">
          {n.number}
        </span>
        {n.isMaster && (
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-700">
            Master Number
          </span>
        )}
      </div>

      <h2 className="font-display text-xl font-semibold text-foreground mb-0.5">{n.title}</h2>
      <p className="text-xs text-primary font-medium mb-3">{n.tagline}</p>
      <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3">{n.description}</p>

      <div className="flex items-center gap-1 mt-4 text-xs font-medium text-primary-deep group-hover:gap-2 transition-all">
        Explore Number {n.number}
        <ChevronRight className="h-3 w-3" />
      </div>
    </Link>
  );
}

function NumerologyHub() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-36 md:pt-40 pb-16">
        <div className="absolute inset-0 -z-10 bg-gradient-hero" />
        <Starfield />

        {/* Decorative numerals */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none select-none" aria-hidden="true">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "11", "22", "33", "1", "4", "7", "9"].map((sym, i) => (
            <span
              key={i}
              className="absolute text-primary/[0.14] font-display font-bold"
              style={{
                fontSize: `${((i * 37) % 40) + 28}px`,
                left: `${(i * 6.4) % 100}%`,
                top: `${(i * 13 + 6) % 85}%`,
                transform: `rotate(${i * 11 - 60}deg)`,
              }}
            >
              {sym}
            </span>
          ))}
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium mb-5">
            Numerology
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-semibold tracking-tight text-foreground leading-tight mb-6">
            Your name, your date.
            <br />
            <span className="text-gradient">Your numbers.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Every letter and every date carries a number — and every number carries a meaning.
            Calculate your Life Path, Destiny, and Soul Urge numbers below, or explore what each
            one means.
          </p>
        </div>

        {/* Number strip */}
        <div className="mt-12 flex justify-center gap-3 flex-wrap max-w-2xl mx-auto">
          {numerologyNumbers.map((n) => (
            <Link
              key={n.slug}
              to="/numerology/$number"
              params={{ number: n.slug }}
              className="flex flex-col items-center gap-1 p-2.5 rounded-xl hover:bg-card hover:shadow-card transition-all group"
            >
              <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary-deep font-display text-base font-semibold group-hover:scale-110 transition-transform">
                {n.number}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-medium">
                {n.title.replace("The ", "")}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Calculator */}
      <NumerologyCalculator />

      {/* Core numbers grid */}
      <section className="max-w-6xl mx-auto px-6 pb-14">
        <div className="mb-8">
          <p className="text-xs tracking-[0.16em] uppercase text-primary font-medium mb-1">Core Numbers</p>
          <h2 className="font-display text-2xl font-semibold text-foreground">The nine foundations.</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {coreNumbers.map((n, idx) => (
            <Reveal key={n.slug} delay={idx * 40}>
              <NumberCard n={n} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Master numbers grid */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="mb-8 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-600" />
          <div>
            <p className="text-xs tracking-[0.16em] uppercase text-violet-700 font-medium mb-1">Master Numbers</p>
            <h2 className="font-display text-2xl font-semibold text-foreground">Amplified, not just bigger.</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {masterNumbers.map((n, idx) => (
            <Reveal key={n.slug} delay={idx * 40}>
              <NumberCard n={n} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gradient-cosmic py-14 px-6 text-center">
        <h2 className="font-display text-3xl font-semibold text-cosmic-foreground mb-3">
          Numbers are one language. Your chart is the fuller conversation.
        </h2>
        <p className="text-cosmic-foreground/70 text-sm mb-7 max-w-md mx-auto leading-relaxed">
          A full Tarot & numerology consultation reads your numbers alongside the cards and your
          chart — a fuller picture than any single number can give on its own.
        </p>
        <Link
          to="/consultation"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-95 transition"
        >
          Explore Tarot & numerology
          <ChevronRight className="h-4 w-4" />
        </Link>
      </section>
    </main>
  );
}

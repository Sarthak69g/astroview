// src/routes/tarot/$spread.tsx
import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronRight, RotateCcw, Sparkles } from "lucide-react";
import { getSpreadBySlug, tarotSpreads } from "@/data/tarotSpreads";
import { drawCards, type TarotCard } from "@/data/tarotData";
import TarotCardFlip from "@/components/TarotCardFlip";
import Reveal from "@/components/Reveal";

export const Route = createFileRoute("/tarot/$spread")({
  component: SpreadDetail,
});

function SpreadDetail() {
  const { spread: spreadSlug } = useParams({ strict: false }) as { spread: string };
  const spread = getSpreadBySlug(spreadSlug);

  if (!spread) throw notFound();

  // Cards are drawn client-side only (after mount) so SSR output stays
  // deterministic and hydration never mismatches — same reasoning Reveal.tsx
  // uses for its scroll animation state.
  const [cards, setCards] = useState<TarotCard[] | null>(null);
  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    setCards(drawCards(spread.positions.length));
    setRevealedCount(0);
  }, [spread.slug, spread.positions.length]);

  const reshuffle = () => {
    setCards(drawCards(spread.positions.length));
    setRevealedCount(0);
  };

  const allRevealed = cards !== null && revealedCount >= cards.length;
  const otherSpreads = tarotSpreads.filter((s) => s.slug !== spread.slug);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden px-6 pt-36 md:pt-40 pb-14">
        <div className="absolute inset-0 -z-10 bg-gradient-hero" />

        <div className="max-w-2xl mx-auto text-center">
          <Link
            to="/tarot"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition mb-6"
          >
            ← All Tarot readings
          </Link>
          <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium mb-4">
            Tarot Reading
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight text-foreground leading-tight mb-5">
            {spread.title}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            {spread.blurb}
          </p>
        </div>
      </section>

      {/* Card reveal area */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          {!cards ? (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-16">
              <Sparkles className="h-4 w-4 animate-pulse" /> Shuffling the deck…
            </div>
          ) : (
            <div
              className={`grid gap-8 ${
                cards.length === 1
                  ? "grid-cols-1 max-w-[220px] mx-auto"
                  : "grid-cols-1 sm:grid-cols-3"
              }`}
            >
              {cards.map((card, i) => (
                <TarotCardFlip
                  key={`${card.slug}-${i}`}
                  card={card}
                  positionLabel={spread.positions[i]?.label}
                  onReveal={() => setRevealedCount((c) => c + 1)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Interpretation — appears once every card is flipped */}
      {allRevealed && cards && (
        <section className="px-6 pb-20">
          <Reveal>
            <div className="max-w-3xl mx-auto space-y-4">
              <h2 className="font-display text-2xl font-semibold text-foreground text-center mb-6">
                Your reading
              </h2>
              {cards.map((card, i) => {
                const position = spread.positions[i];
                return (
                  <div
                    key={`${card.slug}-interp-${i}`}
                    className="rounded-2xl border border-border bg-card p-5 flex gap-4"
                  >
                    <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 text-primary-deep font-display text-lg font-semibold flex-shrink-0">
                      {card.symbol}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                        {position?.label} — {position?.description}
                      </p>
                      <p className="font-display text-lg font-semibold text-foreground mt-0.5">
                        {card.name}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                        {card.meaning}
                      </p>
                    </div>
                  </div>
                );
              })}

              <div className="flex flex-wrap justify-center gap-3 pt-4">
                <button
                  onClick={reshuffle}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-sm font-medium hover:border-primary/40 hover:bg-accent/50 transition"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Draw again
                </button>
                <Link
                  to="/tarot"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-95 transition"
                >
                  Try another spread
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {/* Other spreads */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <Reveal>
          <p className="text-xs tracking-[0.16em] uppercase text-primary font-medium mb-1">
            More readings
          </p>
          <h2 className="font-display text-xl font-semibold text-foreground mb-6">
            Try a different spread.
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {otherSpreads.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 4) * 60}>
              <Link
                to="/tarot/$spread"
                params={{ spread: s.slug }}
                className="flex flex-col gap-1 p-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-card transition group"
              >
                <span className="text-sm font-semibold text-foreground">{s.title}</span>
                <span className="text-xs text-muted-foreground truncate">{s.blurb}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}

// src/components/TarotCardFlip.tsx
// A single face-down card that flips to reveal a drawn TarotCard on click.
// Uses inline styles for the 3D transform (same approach Reveal.tsx takes
// for its animation, since Tailwind's default utility set doesn't ship
// perspective/backface-visibility helpers) — kept self-contained so both
// the hub and detail pages can reuse it.

import { useState } from "react";
import type { TarotCard } from "@/data/tarotData";

// Hand-drawn-style card back: a centred eye flanked by a crescent moon and a
// star, framed by a double border — inline SVG so it's crisp at any size and
// needs no external image asset.
function CardBackArt() {
  return (
    <svg viewBox="0 0 120 180" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tarot-card-back-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.18 0.06 285)" />
          <stop offset="100%" stopColor="oklch(0.28 0.1 50)" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="118" height="178" rx="14" fill="url(#tarot-card-back-bg)" />
      <rect
        x="8"
        y="8"
        width="104"
        height="164"
        rx="9"
        stroke="var(--cosmic-foreground)"
        strokeOpacity="0.3"
        strokeWidth="1"
      />
      {/* crescent moon */}
      <path
        d="M40 55a12 12 0 1 0 0 24 15 15 0 0 1 0-24Z"
        stroke="var(--cosmic-foreground)"
        strokeOpacity="0.5"
        strokeWidth="1.3"
      />
      {/* eye */}
      <path
        d="M46 92c8-10 20-10 28 0-8 10-20 10-28 0Z"
        stroke="var(--cosmic-foreground)"
        strokeOpacity="0.65"
        strokeWidth="1.3"
      />
      <circle cx="60" cy="92" r="4.5" stroke="var(--cosmic-foreground)" strokeOpacity="0.65" strokeWidth="1.3" />
      {/* star */}
      <path
        d="M80 55l2.3 6.7L89 64l-6.7 2.3L80 73l-2.3-6.7L71 64l6.7-2.3L80 55Z"
        stroke="var(--cosmic-foreground)"
        strokeOpacity="0.5"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      {/* small sparkles */}
      <circle cx="30" cy="120" r="1.4" fill="var(--cosmic-foreground)" fillOpacity="0.4" />
      <circle cx="92" cy="115" r="1.1" fill="var(--cosmic-foreground)" fillOpacity="0.4" />
      <circle cx="60" cy="140" r="1.6" fill="var(--cosmic-foreground)" fillOpacity="0.45" />
    </svg>
  );
}

export default function TarotCardFlip({
  card,
  positionLabel,
  onReveal,
}: {
  card: TarotCard;
  positionLabel?: string;
  onReveal?: () => void;
}) {
  const [flipped, setFlipped] = useState(false);

  function flip() {
    if (flipped) return;
    setFlipped(true);
    onReveal?.();
  }

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-[220px] mx-auto">
      {positionLabel && (
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
          {positionLabel}
        </p>
      )}

      <button
        type="button"
        onClick={flip}
        aria-label={flipped ? card.name : "Reveal card"}
        className="relative w-full aspect-[2/3] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-2xl"
        style={{ perspective: "1000px" }}
      >
        <div
          className="relative w-full h-full transition-transform duration-700 ease-out"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Face-down side */}
          <div
            className="absolute inset-0 rounded-2xl shadow-card overflow-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            <CardBackArt />
          </div>

          {/* Face-up side */}
          <div
            className="absolute inset-0 rounded-2xl bg-card border border-primary/30 shadow-card flex flex-col items-center justify-center gap-2 p-4 text-center"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <span className="font-display text-2xl font-semibold text-primary-deep">
              {card.symbol}
            </span>
            <span className="font-display text-sm font-semibold text-foreground leading-tight">
              {card.name}
            </span>
            <span className="text-[11px] text-muted-foreground leading-snug">{card.keyword}</span>
          </div>
        </div>
      </button>

      {!flipped && <p className="text-[11px] text-muted-foreground">Tap to reveal</p>}
    </div>
  );
}

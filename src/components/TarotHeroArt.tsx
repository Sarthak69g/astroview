// src/components/TarotHeroArt.tsx
// Line-art illustration for the Tarot hub hero — three cards fanned on a
// podium with a soft radial glow behind them. Built as inline SVG (no
// external image assets) using the existing primary/gold palette so it sits
// naturally next to the rest of AstroView rather than introducing a new
// purple/illustrative style.

export default function TarotHeroArt() {
  return (
    <svg
      viewBox="0 0 420 340"
      className="w-full h-auto max-w-md mx-auto"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Three tarot cards fanned on a podium"
    >
      <defs>
        <radialGradient id="tarot-hero-glow" cx="50%" cy="42%" r="55%">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="tarot-hero-card" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--card)" />
          <stop offset="100%" stopColor="var(--accent)" />
        </linearGradient>
      </defs>

      <circle cx="210" cy="150" r="170" fill="url(#tarot-hero-glow)" />

      {/* podium */}
      <ellipse cx="210" cy="290" rx="120" ry="14" fill="var(--primary)" fillOpacity="0.12" />
      <path d="M120 285 L300 285 L285 260 L135 260 Z" fill="var(--card)" stroke="var(--border)" />
      <ellipse cx="210" cy="260" rx="75" ry="10" fill="var(--card)" stroke="var(--border)" />

      {/* left card — moon */}
      <g transform="rotate(-14 145 190)">
        <rect x="105" y="110" width="80" height="120" rx="10" fill="url(#tarot-hero-card)" stroke="var(--border)" />
        <path
          d="M132 150a14 14 0 1 0 0 28 17.5 17.5 0 0 1 0-28Z"
          stroke="var(--primary-deep)"
          strokeWidth="1.4"
        />
      </g>

      {/* right card — star */}
      <g transform="rotate(14 275 190)">
        <rect x="235" y="110" width="80" height="120" rx="10" fill="url(#tarot-hero-card)" stroke="var(--border)" />
        <path
          d="M275 150l3.4 10 10.6 3.4-10.6 3.4-3.4 10-3.4-10-10.6-3.4 10.6-3.4 3.4-10Z"
          stroke="var(--primary-deep)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </g>

      {/* centre card — sun, drawn last so it sits on top */}
      <g>
        <rect
          x="170"
          y="90"
          width="80"
          height="130"
          rx="10"
          fill="url(#tarot-hero-card)"
          stroke="var(--primary-deep)"
          strokeOpacity="0.4"
        />
        <circle cx="210" cy="145" r="16" stroke="var(--primary-deep)" strokeWidth="1.6" />
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * Math.PI) / 4;
          const x1 = 210 + Math.cos(angle) * 22;
          const y1 = 145 + Math.sin(angle) * 22;
          const x2 = 210 + Math.cos(angle) * 29;
          const y2 = 145 + Math.sin(angle) * 29;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="var(--primary-deep)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          );
        })}
        <text
          x="210"
          y="196"
          textAnchor="middle"
          className="fill-primary-deep"
          style={{ font: "600 9px var(--font-display)", letterSpacing: "0.12em" }}
        >
          THE SUN
        </text>
      </g>

      {/* floating sparkles */}
      <circle cx="90" cy="90" r="2.2" fill="var(--primary)" fillOpacity="0.5" />
      <circle cx="335" cy="110" r="1.8" fill="var(--primary)" fillOpacity="0.5" />
      <circle cx="330" cy="200" r="2.6" fill="var(--primary)" fillOpacity="0.4" />
      <circle cx="80" cy="210" r="1.6" fill="var(--primary)" fillOpacity="0.4" />
    </svg>
  );
}

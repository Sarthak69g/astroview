// src/components/Starfield.tsx
// Subtle twinkling dots meant to sit behind a hero section's centered content,
// filling the empty side margins on wide screens without competing with the
// text. Originally built inline for the homepage hero — extracted here so
// any page's hero (Services, Horoscope, Numerology, etc.) can reuse it.

export default function Starfield({ count = 28 }: { count?: number }) {
  const stars = Array.from({ length: count }, (_, i) => ({
    top: `${(i * 37) % 95}%`,
    left: `${(i * 53) % 97}%`,
    size: (i % 3) + 1,
    delay: `${(i % 7) * 0.4}s`,
  }));
  return (
    <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-primary animate-twinkle"
          style={{ top: s.top, left: s.left, width: s.size, height: s.size, animationDelay: s.delay }}
        />
      ))}
    </div>
  );
}

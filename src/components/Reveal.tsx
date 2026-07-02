// src/components/Reveal.tsx
// Shared scroll-reveal utility. Originally lived inline in routes/index.tsx
// (homepage only) — extracted so other pages, like the horoscope hub, can
// reuse the exact same fade-up-on-scroll pattern instead of reinventing it.
//
// SSR-safe: starts visible so hydration never flashes, hides & animates only
// elements that are below the fold when the page first loads. Respects
// prefers-reduced-motion.

import { useEffect, useRef, useState } from "react";

export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"visible" | "hidden" | "entering">("visible");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) return;
    setState("hidden");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("entering");
          observer.unobserve(el);
        }
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: state === "hidden" ? 0 : 1,
        transform: state === "hidden" ? "translateY(22px)" : "none",
        transition:
          state === "entering"
            ? `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`
            : "none",
      }}
    >
      {children}
    </div>
  );
}
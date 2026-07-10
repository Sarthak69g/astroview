// src/hooks/use-sliding-indicator.ts
// Powers the "sliding pill" motion behind nav links and segmented toggles
// (Header desktop nav, Consultation Chat/Call toggle, Puja category filter).
// Measures the active item's position relative to its container and hands
// back left/width so the caller can render an absolutely-positioned pill
// that transitions between values instead of the active background snapping.

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

interface IndicatorStyle {
  left: number;
  top: number;
  width: number;
  height: number;
  ready: boolean;
}

const NONE_KEY = "__none__";

export function useSlidingIndicator(activeKey: string | null) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map());
  const [style, setStyle] = useState<IndicatorStyle>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    ready: false,
  });

  const register = useCallback(
    (key: string) => (el: HTMLElement | null) => {
      if (el) itemRefs.current.set(key, el);
      else itemRefs.current.delete(key);
    },
    [],
  );

  const measure = useCallback(() => {
    const container = containerRef.current;
    const active = itemRefs.current.get(activeKey ?? NONE_KEY);
    if (!container || !active) {
      setStyle((prev) => (prev.ready ? { ...prev, ready: false } : prev));
      return;
    }
    const containerRect = container.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    setStyle({
      left: activeRect.left - containerRect.left,
      top: activeRect.top - containerRect.top,
      width: activeRect.width,
      height: activeRect.height,
      ready: true,
    });
  }, [activeKey]);

  // Re-measure whenever the active key changes, and once more on the next
  // frame in case fonts/images shifted layout after the initial measure.
  useLayoutEffect(() => {
    measure();
    const raf = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(raf);
  }, [measure]);

  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  return { containerRef, register, style };
}
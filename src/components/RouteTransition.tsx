// src/components/RouteTransition.tsx
// Wraps the router Outlet so every navigation gets a small fade + lift-in
// animation, keyed by pathname (so /horoscope/gemini -> /horoscope/leo
// re-triggers it too, not just top-level route changes).
//
// Deliberately simple: this is a mount animation on the *incoming* page,
// not a true crossfade with the outgoing page. TanStack Router swaps route
// content synchronously, so animating an exit would mean holding the old
// tree alive after navigation — real complexity for very little visible
// gain compared to just animating the page that just landed.

import { useRouterState } from "@tanstack/react-router";
import { type ReactNode } from "react";

export default function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div key={pathname} className="route-fade-in">
      {children}
    </div>
  );
}
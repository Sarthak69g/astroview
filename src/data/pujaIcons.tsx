// src/data/pujaIcons.tsx
// Maps the icon key strings stored in pujaData.ts (puja.icon) to their Lucide
// React equivalents, mirroring the pattern already used in serviceIcons.tsx
// so both data sets stay consistent instead of each inventing its own map.

import {
  Baby,
  Circle,
  Compass,
  Flame,
  Home,
  Orbit,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export const pujaIconMap: Record<string, LucideIcon> = {
  home: Home,
  sparkles: Sparkles,
  flame: Flame,
  orbit: Orbit,
  "circle-dashed": Circle,
  baby: Baby,
  compass: Compass,
};

export function getPujaIcon(iconName: string): LucideIcon {
  return pujaIconMap[iconName] ?? Sparkles;
}

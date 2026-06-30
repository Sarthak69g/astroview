// src/data/serviceIcons.ts
// Single source of truth mapping the Tabler icon name strings stored in
// servicesData.ts (service.icon) to their Lucide React equivalents.
// Both the homepage and the /services pages render Lucide icons, so this
// map keeps icon choice consistent without duplicating logic in each route.

import {
  Compass,
  Flame,
  Gem,
  Heart,
  Home,
  ScrollText,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

export const serviceIconMap: Record<string, LucideIcon> = {
  "chart-dots": ScrollText,
  briefcase: Compass,
  heart: Heart,
  users: Users,
  diamond: Gem,
  home: Home,
  cards: Sparkles,
  flame: Flame,
};

export function getServiceIcon(iconName: string): LucideIcon {
  return serviceIconMap[iconName] ?? Sparkles;
}

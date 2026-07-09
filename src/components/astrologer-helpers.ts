// src/components/astrologer-helpers.ts
// Non-component helpers used by AstrologerCard and the astrologer profile
// page. Split out from AstrologerCard.tsx so that file only exports the
// component itself — keeps React Fast Refresh working during dev.

import { toast } from "sonner";
import { type Astrologer, type ConsultMode } from "@/data/astrologersData";

export function avatarUrl(seed: string) {
  return `https://api.dicebear.com/8.x/personas/svg?seed=${encodeURIComponent(seed)}&backgroundColor=fde9d0,fbe0c4,f7d9b0&radius=50`;
}

export function handleConsultAction(astrologer: Astrologer, mode: ConsultMode) {
  toast(`${mode === "Chat" ? "Chat" : "Call"} sessions are launching soon`, {
    description: `You'll be able to connect with ${astrologer.name} directly once live ${mode.toLowerCase()} goes live on AstroView.`,
  });
}
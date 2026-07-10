// src/components/astrologer-helpers.ts
// Non-component helpers used by AstrologerCard and the astrologer profile
// page. Split out from AstrologerCard.tsx so that file only exports the
// component itself — keeps React Fast Refresh working during dev.

import { toast } from "sonner";
import { type Astrologer, type ConsultMode } from "@/data/astrologersData";

export { avatarUrl } from "@/lib/avatar";

export function handleConsultAction(astrologer: Astrologer, mode: ConsultMode) {
  toast(`${mode === "Chat" ? "Chat" : "Call"} sessions are launching soon`, {
    description: `You'll be able to connect with ${astrologer.name} directly once live ${mode.toLowerCase()} goes live on AstroView.`,
  });
}
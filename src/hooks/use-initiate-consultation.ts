// src/hooks/use-initiate-consultation.ts
//
// PHASE 4: this is what actually replaces the "coming soon" toast for Chat.
// Call still shows the toast (that infrastructure doesn't exist yet).
//
// The flow mirrors AstrologerListing.jsx's handleInitiateChat in the admin
// portal exactly, since that's the one place the backend's real
// requirements for starting a chat are already worked out and tested:
//   1. Must be logged in.
//   2. Fetch the FRESH profile from the backend (not the cached one in
//      auth-context) and check firstName, lastName, genderId, dob, tob, pob
//      are all filled in — the backend enforces this server-side too, but
//      the admin portal checks client-side first for a better error message
//      ("complete your details" instead of a raw API rejection), and a 404
//      on the profile fetch itself is treated the same way (brand new user,
//      profile row doesn't exist yet).
//   3. If the SignalR connection isn't up yet, don't fire InitiateChat into
//      the void — tell the user to try again in a second instead.
//   4. Call initiateChat() with the astrologer info already in hand (see
//      chat-context.tsx's ConsultationTarget), then navigate to /chat,
//      which renders the waiting-for-acceptance state and then the live
//      session once ChatStarted fires.

import { useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { useChat } from "@/lib/chat-context";
import { getUserProfile } from "@/lib/api/auth.functions";
import { type Astrologer, type ConsultMode } from "@/data/astrologersData";
import { handleConsultAction } from "@/components/astrologer-helpers";

export function useInitiateConsultation() {
  const { user, isLoggedIn } = useAuth();
  const { initiateChat, isConnected } = useChat();
  const navigate = useNavigate();

  return useCallback(
    async (astrologer: Astrologer, mode: ConsultMode) => {
      if (mode === "Call") {
        // Live voice/video infra doesn't exist yet — unchanged placeholder.
        handleConsultAction(astrologer, mode);
        return;
      }

      if (!isLoggedIn || !user) {
        toast.error("Please log in to start a chat.");
        navigate({ to: "/login" });
        return;
      }

      try {
        const profile = await getUserProfile({ data: { userId: user.userId, token: user.token } });
        const isProfileComplete =
          Boolean(profile?.firstName?.trim?.()) &&
          Boolean(profile?.lastName?.trim?.()) &&
          Boolean(profile?.genderId) &&
          Boolean(profile?.dob) &&
          Boolean(profile?.tob?.trim?.()) &&
          Boolean(profile?.pob?.trim?.());

        if (!isProfileComplete) {
          toast.error("Please complete your astrological details & gender to start chatting.");
          navigate({ to: "/profile" });
          return;
        }
      } catch {
        // Mirrors the admin portal's handling of a 404 on the profile
        // fetch (a brand-new user with no profile row yet) — same message
        // either way, since we can't distinguish network failure from
        // missing-profile without inspecting a status code we don't get
        // back through callApi's envelope unwrapping.
        toast.error("Please set up your profile before chatting.");
        navigate({ to: "/profile" });
        return;
      }

      if (!isConnected) {
        toast.error("Connecting to live chat — please try again in a moment.");
        return;
      }

      initiateChat({ id: astrologer.id, name: astrologer.name, pricePerMin: astrologer.pricePerMin });
      navigate({ to: "/chat" });
    },
    [isLoggedIn, user, isConnected, initiateChat, navigate],
  );
}

// src/lib/chat-context.tsx
// Client-side real-time chat, ported from the astro-admin-portal's
// ChatContext.jsx (built by Divyansh against the same kgaapi.techascents.com
// backend). Uses SignalR directly from the browser — this has to be
// client-side, not a TanStack server function, because it's a persistent
// WebSocket connection, not a request/response call.
//
// Simplified vs the admin portal version: that context has to branch on
// roleId (Admin=1 skips connecting entirely, User=3 vs Astrologer=other
// changes how sender bubbles and popups behave) because one codebase serves
// three roles. AstroView only ever has the customer/user role, so all of
// that branching is gone — every logged-in AstroView user is chat-eligible,
// and every message they send is "mine" (no isMe / senderRoleId check
// needed the way WorkspaceChat.jsx needs it).
//
// One thing this context deliberately does NOT do: the admin portal's
// astrologer side listens for "ShowReadyCheckPopup" to show a 60s accept/
// decline modal. That's the astrologer accepting an incoming request — it
// doesn't apply here. AstroView users only ever see the "waiting for
// astrologer to accept" state (WaitingForAstrologerAcceptance), never the
// accept-prompt itself.

// One more fix vs the original draft: ChatStarted was written expecting
// `(sessionId, sessionMeta)` so the chat header could show astrologer name
// + birth details. Checked against the admin portal's actual production
// ChatContext.jsx (the real reference implementation, not just the Swagger
// doc) — the hub only ever sends `sessionId`, full stop, no second
// argument, anywhere. So instead of trusting a socket payload that will
// never arrive, initiateChat now takes the full astrologer summary the
// caller already has in hand (from the card/profile the user just clicked)
// and remembers it locally until ChatStarted confirms the session — same
// end result (a populated header), without depending on the backend for
// something it doesn't provide. The birth-detail fields (dateOfBirth etc.)
// are dropped entirely — they were never reliable either, and the user's
// own dob/tob/pob is already available straight off useAuth().user if a
// chat screen wants to show it.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import * as signalR from "@microsoft/signalr";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";

export interface ChatMessageBubble {
  id: string | number;
  sender: "user" | "astrologer" | "system";
  text: string;
  timestamp: Date;
}

export interface ActiveChatSession {
  sessionId: string | number;
  astrologerId: string | number;
  astrologerName: string;
  pricePerMin?: number;
  messages: ChatMessageBubble[];
}

export interface ConsultationTarget {
  id: string | number;
  name: string;
  pricePerMin?: number;
}

interface ChatContextValue {
  isConnected: boolean;
  incomingRequestPending: boolean;
  pendingAstrologer: ConsultationTarget | null;
  activeSession: ActiveChatSession | null;
  sessionDuration: number;
  initiateChat: (astrologer: ConsultationTarget) => void;
  cancelPendingRequest: () => void;
  sendLiveMessage: (text: string) => void;
  endChatSession: () => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

const HUB_URL = "https://kgaapi.techascents.com/hub/chathub";

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const token = user?.token;

  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [incomingRequestPending, setIncomingRequestPending] = useState(false);
  const [pendingAstrologer, setPendingAstrologer] = useState<ConsultationTarget | null>(null);
  const [activeSession, setActiveSession] = useState<ActiveChatSession | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0);

  // Mirrors pendingAstrologer state but readable synchronously inside the
  // ChatStarted handler below (state set via initiateChat right before the
  // invoke may not have flushed into the closure the handler was created
  // with yet — the ref always has the latest value).
  const pendingAstrologerRef = useRef<ConsultationTarget | null>(null);

  const sessionIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Build (or tear down) the connection whenever the token changes.
  useEffect(() => {
    if (!token) {
      setConnection((prev) => {
        prev?.stop().catch(() => {});
        return null;
      });
      return;
    }

    const hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, { accessTokenFactory: () => token })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    setConnection(hubConnection);

    return () => {
      hubConnection.stop().catch(() => {});
    };
  }, [token]);

  // Wire up hub event listeners once we have a connection.
  useEffect(() => {
    if (!connection) return;

    let cancelled = false;

    connection
      .start()
      .then(() => {
        if (!cancelled) setIsConnected(true);
      })
      .catch((err) => {
        console.error("[SignalR] Connection failed:", err);
      });

    connection.onreconnected(() => setIsConnected(true));
    connection.onreconnecting(() => setIsConnected(false));
    connection.onclose(() => setIsConnected(false));

    connection.on("QueueStatus", (statusText: string) => {
      toast.success(statusText);
    });

    connection.on("PromptWaitlistConfirmation", (astrologerUserId: string | number) => {
      const joinWaitlist = window.confirm(
        "This astrologer is currently busy. Would you like to join the waitlist?",
      );
      if (joinWaitlist) {
        connection.invoke("JoinWaitlist", Number(astrologerUserId)).catch(() => {});
      }
    });

    // User side only ever sees this — astrologer is still deciding.
    connection.on("WaitingForAstrologerAcceptance", () => {
      setIncomingRequestPending(true);
      toast.success("Request sent — waiting for the astrologer to accept...");
    });

    connection.on("ChatStarted", (sessionId: string | number) => {
      setIncomingRequestPending(false);
      const target = pendingAstrologerRef.current;
      setActiveSession({
        sessionId,
        astrologerId: target?.id ?? "",
        astrologerName: target?.name ?? "Astrologer",
        pricePerMin: target?.pricePerMin,
        messages: [],
      });
      setPendingAstrologer(null);
      pendingAstrologerRef.current = null;

      setSessionDuration(0);
      if (sessionIntervalRef.current) clearInterval(sessionIntervalRef.current);
      sessionIntervalRef.current = setInterval(() => {
        setSessionDuration((prev) => prev + 1);
      }, 1000);
    });

    connection.on(
      "ReceiveMessage",
      (chatMessage: { id?: string | number; senderRoleId?: number; messageText: string; createdDate?: string }) => {
        setActiveSession((prev) => {
          if (!prev) return prev;
          // senderRoleId 3 = astrologer on the backend's role scheme; anything
          // else reaching this client is our own echoed message.
          const sender = chatMessage.senderRoleId === 3 ? "astrologer" : "user";
          const bubble: ChatMessageBubble = {
            id: chatMessage.id ?? Date.now(),
            sender,
            text: chatMessage.messageText,
            timestamp: new Date(chatMessage.createdDate ?? Date.now()),
          };
          return { ...prev, messages: [...prev.messages, bubble] };
        });
      },
    );

    connection.on("ReceiveSystemNotification", (notificationText: string) => {
      setActiveSession((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: [
            ...prev.messages,
            { id: `sys-${Date.now()}`, sender: "system", text: notificationText, timestamp: new Date() },
          ],
        };
      });
    });

    connection.on("ChatEnded", () => {
      if (sessionIntervalRef.current) clearInterval(sessionIntervalRef.current);
      toast.error("The consultation has ended.");
      setActiveSession(null);
      setSessionDuration(0);
    });

    connection.on("ChatCancelled", (reason?: string) => {
      setIncomingRequestPending(false);
      setPendingAstrologer(null);
      pendingAstrologerRef.current = null;
      toast.error(reason || "The chat request was cancelled.");
    });

    connection.on("ChatError", (errorMsg: string) => {
      toast.error(errorMsg);
      setIncomingRequestPending(false);
      setPendingAstrologer(null);
      pendingAstrologerRef.current = null;
    });

    return () => {
      cancelled = true;
      connection.off("QueueStatus");
      connection.off("PromptWaitlistConfirmation");
      connection.off("WaitingForAstrologerAcceptance");
      connection.off("ChatStarted");
      connection.off("ReceiveMessage");
      connection.off("ReceiveSystemNotification");
      connection.off("ChatEnded");
      connection.off("ChatCancelled");
      connection.off("ChatError");
      if (sessionIntervalRef.current) clearInterval(sessionIntervalRef.current);
    };
  }, [connection]);

  const initiateChat = useCallback(
    (astrologer: ConsultationTarget) => {
      if (!connection) {
        toast.error("Real-time connection isn't ready yet — try again in a moment.");
        return;
      }
      setPendingAstrologer(astrologer);
      pendingAstrologerRef.current = astrologer;
      connection.invoke("InitiateChat", Number(astrologer.id)).catch((err) => {
        console.error("[SignalR] InitiateChat failed:", err);
        toast.error("Couldn't start the chat request. Please try again.");
        setPendingAstrologer(null);
        pendingAstrologerRef.current = null;
      });
    },
    [connection],
  );

  const cancelPendingRequest = useCallback(() => {
    const target = pendingAstrologerRef.current;
    setIncomingRequestPending(false);
    setPendingAstrologer(null);
    pendingAstrologerRef.current = null;
    if (connection && target) {
      connection.invoke("DeclineChat", Number(target.id)).catch(() => {});
    }
  }, [connection]);

  const sendLiveMessage = useCallback(
    (text: string) => {
      if (!connection || !activeSession) return;
      connection.invoke("SendMessage", activeSession.sessionId, text).catch((err) => {
        console.error("[SignalR] SendMessage failed:", err);
      });
    },
    [connection, activeSession],
  );

  const endChatSession = useCallback(() => {
    if (!connection || !activeSession) return;
    connection.invoke("EndChat", activeSession.sessionId).catch(() => {});
  }, [connection, activeSession]);

  return (
    <ChatContext.Provider
      value={{
        isConnected,
        incomingRequestPending,
        pendingAstrologer,
        activeSession,
        sessionDuration,
        initiateChat,
        cancelPendingRequest,
        sendLiveMessage,
        endChatSession,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within a ChatProvider");
  return ctx;
}

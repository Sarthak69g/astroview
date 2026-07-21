// src/routes/chat.tsx
//
// PHASE 3 + 4: the live consultation screen. Ported from astro-admin-portal's
// LiveConsultation.jsx (+ ChatMessage.jsx + TimerBadge.jsx), restyled to
// AstroView's design tokens (bg-card/border-border/gradient-primary instead
// of the admin portal's bg-brand-*/gray-*).
//
// Reachable only by clicking a "Chat" button (see use-initiate-consultation.ts)
// — there's no direct nav link to it. Three states, same as the admin
// portal's user-side flow:
//   1. incomingRequestPending, no activeSession yet -> "waiting for the
//      astrologer to accept" screen with a cancel option.
//   2. activeSession exists -> the live message thread.
//   3. neither -> nothing pending (direct nav, refresh, or session already
//      ended) -> bounce back to the astrologer directory.

import { useEffect, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Send, LogOut, MessageSquare, Loader2, X } from "lucide-react";
import { useChat, type ChatMessageBubble } from "@/lib/chat-context";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "Live Consultation — AstroView" }] }),
  component: ChatPage,
});

function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function ChatPage() {
  const navigate = useNavigate();
  const { activeSession, incomingRequestPending, pendingAstrologer, sessionDuration, sendLiveMessage, endChatSession, cancelPendingRequest } =
    useChat();
  const [typedMessage, setTypedMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Nothing pending and no session — got here by accident (direct nav,
  // refresh mid-session, or the session already wrapped up). Bounce back.
  useEffect(() => {
    if (!activeSession && !incomingRequestPending) {
      navigate({ to: "/consultation" });
    }
  }, [activeSession, incomingRequestPending, navigate]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages]);

  const fireMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;
    sendLiveMessage(typedMessage.trim());
    setTypedMessage("");
  };

  if (!activeSession && incomingRequestPending) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-md text-center rounded-3xl border border-border bg-card p-10 shadow-card">
          <Loader2 className="h-9 w-9 mx-auto mb-5 animate-spin text-primary" />
          <h1 className="font-display text-xl font-semibold mb-2">
            Waiting for {pendingAstrologer?.name ?? "the astrologer"} to accept…
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            This usually takes a few seconds. You can cancel any time before they accept.
          </p>
          <button
            onClick={() => {
              cancelPendingRequest();
              navigate({ to: "/consultation" });
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-primary/25 transition-all"
          >
            <X className="h-4 w-4" /> Cancel request
          </button>
        </div>
      </main>
    );
  }

  if (!activeSession) return null;

  return (
    <main className="min-h-screen bg-background flex flex-col pt-20 md:pt-24 pb-6 px-4 md:px-6">
      <div className="flex-1 max-w-3xl w-full mx-auto rounded-3xl border border-border bg-card shadow-card flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-secondary/60 px-5 md:px-6 py-4 border-b border-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 text-primary-deep flex items-center justify-center">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-semibold text-foreground leading-tight truncate">
                {activeSession.astrologerName}
              </h1>
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                {activeSession.pricePerMin ? `₹${activeSession.pricePerMin}/min · ` : ""}Live session
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <div className="flex items-center gap-1.5 bg-card border border-border px-3 py-1.5 rounded-xl shadow-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-mono font-semibold text-foreground tracking-wider">
                {formatDuration(sessionDuration)}
              </span>
            </div>
            <button
              onClick={() => endChatSession()}
              className="inline-flex items-center gap-1.5 bg-destructive/10 hover:bg-destructive/15 text-destructive px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wide transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" /> End
            </button>
          </div>
        </div>

        {/* Message feed */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-3 bg-background/40 min-h-[50vh]">
          {activeSession.messages.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-10">
              You're connected — say hello to get started.
            </p>
          ) : (
            activeSession.messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
          )}
          <div ref={scrollRef} />
        </div>

        {/* Composer */}
        <div className="p-4 bg-card border-t border-border shrink-0">
          <form onSubmit={fireMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={typedMessage}
              onChange={(e) => setTypedMessage(e.target.value)}
              placeholder="Type your question…"
              className="flex-1 bg-secondary/60 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15 transition-all"
            />
            <button
              type="submit"
              disabled={!typedMessage.trim()}
              className="h-[46px] w-[46px] shrink-0 flex items-center justify-center bg-gradient-primary text-primary-foreground rounded-xl shadow-soft disabled:opacity-40 transition-all active:scale-95"
            >
              <Send className="h-4 w-4 ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

function MessageBubble({ message }: { message: ChatMessageBubble }) {
  if (message.sender === "system") {
    return (
      <div className="flex justify-center my-2">
        <div className="bg-primary/10 border border-primary/15 text-primary-deep text-xs font-medium px-4 py-2 rounded-xl max-w-[85%] text-center">
          {message.text}
        </div>
      </div>
    );
  }

  const isMe = message.sender === "user";
  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-soft ${
          isMe
            ? "bg-gradient-primary text-primary-foreground rounded-tr-sm"
            : "bg-secondary text-secondary-foreground border border-border rounded-tl-sm"
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
        <p className={`text-[10px] mt-1 text-right ${isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
}

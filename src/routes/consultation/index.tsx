// src/routes/consultation/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MessageCircle, Phone, Search } from "lucide-react";
import Starfield from "@/components/Starfield";
import AstrologerCard from "@/components/AstrologerCard";
import { astrologers } from "@/data/astrologersData";
import { services } from "@/data/servicesData";
import type { ConsultMode } from "@/data/astrologersData";

export const Route = createFileRoute("/consultation/")({
  head: () => ({
    meta: [
      { title: "Talk to an Astrologer — AstroView" },
      {
        name: "description",
        content:
          "Chat or call with a verified AstroView astrologer. Filter by specialty — birth chart, career, love, kundali matching, and more.",
      },
      { property: "og:title", content: "Talk to an Astrologer — AstroView" },
      {
        property: "og:description",
        content: "Chat or call with a verified AstroView astrologer, filtered by what you actually need.",
      },
    ],
  }),
  component: ConsultationPage,
});

function ConsultationPage() {
  const [mode, setMode] = useState<ConsultMode>("Chat");
  const [specialty, setSpecialty] = useState<string>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return astrologers.filter((a) => {
      const matchesSpecialty = specialty === "all" || a.specialties.includes(specialty);
      const matchesQuery = a.name.toLowerCase().includes(query.trim().toLowerCase());
      return matchesSpecialty && matchesQuery;
    });
  }, [specialty, query]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-36 md:pt-40 pb-16">
        <div className="absolute inset-0 -z-10 bg-gradient-hero" />
        <Starfield />

        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium mb-5">
            Consultation
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-semibold tracking-tight leading-tight">
            Talk to an astrologer,
            <br />
            right now.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Pick chat or call, filter by what you need guidance on, and choose an
            astrologer whose experience actually fits your question.
          </p>

          {/* Mode toggle */}
          <div className="mt-10 inline-flex items-center gap-1.5 rounded-full border border-border bg-card p-1.5 shadow-card">
            <button
              onClick={() => setMode("Chat")}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                mode === "Chat"
                  ? "bg-gradient-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MessageCircle className="h-4 w-4" /> Chat
            </button>
            <button
              onClick={() => setMode("Call")}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                mode === "Call"
                  ? "bg-gradient-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Phone className="h-4 w-4" /> Call
            </button>
          </div>
        </div>
      </section>

      {/* Filters + grid */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="mb-8 flex flex-col gap-5">
          <div className="relative max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name…"
              className="w-full rounded-full border border-border bg-card pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15 transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSpecialty("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                specialty === "all"
                  ? "bg-gradient-primary text-primary-foreground border-transparent shadow-soft"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-primary/25"
              }`}
            >
              All
            </button>
            {services.map((s) => (
              <button
                key={s.slug}
                onClick={() => setSpecialty(s.slug)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  specialty === s.slug
                    ? "bg-gradient-primary text-primary-foreground border-transparent shadow-soft"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-primary/25"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((a, idx) => (
              <AstrologerCard key={a.id} astrologer={a} mode={mode} delay={idx * 40} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground text-sm py-16">
            No astrologers match that filter yet — try a different specialty or search.
          </p>
        )}
      </section>
    </main>
  );
}

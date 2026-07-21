// src/routes/consultation/index.tsx
//
// PHASE 2: fetches the real astrologer directory (POST
// /Astrologer/GetAllAstrologersGrid, proxied server-side via
// lib/api/astrologer.functions.ts) instead of importing the old static
// mock array. Same loading/error pattern already used in profile.tsx
// (useEffect + cancelled flag + loading state), and the same "fetch once,
// filter client-side" approach the old mock version used — pageSize 50
// covers the entire directory for now.
//
// The specialty filter chips used to come from servicesData's fixed slug
// list, matched against astrologer.specialties. Real records only carry a
// single free-text PrimarySkill string that won't line up with those slugs
// 1:1, so the chips are now built dynamically from whatever skills actually
// show up in the fetched list — correct for live data, and it'll grow/shrink
// naturally as astrologers with different skills are added on the backend.

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { MessageCircle, Phone, Search, Loader2 } from "lucide-react";
import Starfield from "@/components/Starfield";
import AstrologerCard from "@/components/AstrologerCard";
import Reveal from "@/components/Reveal";
import { getAstrologersGrid } from "@/lib/api/astrologer.functions";
import { mapGridRecordToAstrologer, type Astrologer, type ConsultMode } from "@/data/astrologersData";
import { useAuth } from "@/lib/auth-context";
import { useSlidingIndicator } from "@/hooks/use-sliding-indicator";

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
  const { user } = useAuth();
  const [mode, setMode] = useState<ConsultMode>("Chat");
  const [specialty, setSpecialty] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const { containerRef: modeToggleRef, register: registerModeBtn, style: modePillStyle } =
    useSlidingIndicator(mode);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(false);

    getAstrologersGrid({ data: { token: user?.token, pageIndex: 1, pageSize: 50 } })
      .then((res) => {
        if (cancelled) return;
        setAstrologers(res.listData.map(mapGridRecordToAstrologer));
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.token]);

  const skillOptions = useMemo(() => {
    const unique = new Set<string>();
    astrologers.forEach((a) => a.skills.forEach((s) => unique.add(s)));
    return Array.from(unique).sort();
  }, [astrologers]);

  const filtered = useMemo(() => {
    return astrologers.filter((a) => {
      const matchesSpecialty = specialty === "all" || a.skills.includes(specialty);
      const matchesQuery = a.name.toLowerCase().includes(query.trim().toLowerCase());
      return matchesSpecialty && matchesQuery;
    });
  }, [astrologers, specialty, query]);

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
          <div
            ref={modeToggleRef}
            className="mt-10 relative inline-flex items-center gap-1.5 rounded-full border border-border bg-card p-1.5 shadow-card"
          >
            <span
              aria-hidden="true"
              className="absolute top-1.5 bottom-1.5 rounded-full bg-gradient-primary shadow-soft transition-[left,width] duration-300 ease-out"
              style={{
                left: modePillStyle.left,
                width: modePillStyle.width,
                opacity: modePillStyle.ready ? 1 : 0,
              }}
            />
            <button
              ref={registerModeBtn("Chat")}
              onClick={() => setMode("Chat")}
              className={`relative z-10 inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-colors active:scale-[0.97] ${
                mode === "Chat" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MessageCircle className="h-4 w-4" /> Chat
            </button>
            <button
              ref={registerModeBtn("Call")}
              onClick={() => setMode("Call")}
              className={`relative z-10 inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-colors active:scale-[0.97] ${
                mode === "Call" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
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

          {skillOptions.length > 0 && (
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
              {skillOptions.map((skill) => (
                <button
                  key={skill}
                  onClick={() => setSpecialty(skill)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    specialty === skill
                      ? "bg-gradient-primary text-primary-foreground border-transparent shadow-soft"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-primary/25"
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-3" />
            <p className="text-sm font-medium">Loading astrologers…</p>
          </div>
        ) : loadError ? (
          <p className="text-center text-muted-foreground text-sm py-16">
            Couldn't load the astrologer directory right now — please try again in a moment.
          </p>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((a, idx) => (
              <Reveal key={a.id} delay={idx * 40}>
                <AstrologerCard astrologer={a} mode={mode} />
              </Reveal>
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

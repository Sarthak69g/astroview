// src/routes/consultation/$slug.tsx
//
// PHASE 2: real data instead of the static getAstrologerBySlug lookup.
// Meta title/description are now generic (can't synchronously read a name
// we haven't fetched yet inside `head()`, which runs before any component
// renders) — revisit with a route loader if SEO on this page matters later.
//
// Lookup strategy: fetch the live grid (same call the listing page makes)
// and find the matching slug — covers the normal flow of clicking through
// from /consultation. If that misses (e.g. a stale/deep link after the
// astrologer moved further than pageSize 50 back), fall back to pulling the
// UserId out of the slug itself (see extractIdFromSlug) and hitting
// getAstrologer/{id} directly.

import { useEffect, useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { BadgeCheck, MessageCircle, Phone, ArrowLeft, Loader2 } from "lucide-react";
import Starfield from "@/components/Starfield";
import AstrologerCard from "@/components/AstrologerCard";
import { avatarUrl } from "@/components/astrologer-helpers";
import { useInitiateConsultation } from "@/hooks/use-initiate-consultation";
import {
  mapGridRecordToAstrologer,
  mapDetailRecordToAstrologer,
  getAstrologerBySlug,
  extractIdFromSlug,
  relatedAstrologers,
  type Astrologer,
} from "@/data/astrologersData";
import { getAstrologersGrid, getAstrologerDetail } from "@/lib/api/astrologer.functions";
import { getSkillOptions, getLanguageOptions } from "@/lib/api/dropdowns.functions";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/consultation/$slug")({
  head: () => ({
    meta: [
      { title: "Astrologer Profile — AstroView" },
      {
        name: "description",
        content: "Chat or call with a verified AstroView astrologer.",
      },
    ],
  }),
  component: AstrologerProfilePage,
});

function AstrologerProfilePage() {
  const { slug } = useParams({ strict: false }) as { slug: string };
  const { user } = useAuth();
  const startConsultation = useInitiateConsultation();

  const [astrologer, setAstrologer] = useState<Astrologer | null>(null);
  const [related, setRelated] = useState<Astrologer[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFoundState(false);

    (async () => {
      try {
        const grid = await getAstrologersGrid({ data: { token: user?.token, pageIndex: 1, pageSize: 50 } });
        const list = grid.listData.map(mapGridRecordToAstrologer);
        if (cancelled) return;

        const found = getAstrologerBySlug(list, slug);
        if (found) {
          setAstrologer(found);
          setRelated(relatedAstrologers(list, found));
          return;
        }

        // Fallback: not in the first page of the grid — try a direct fetch.
        // The detail endpoint is camelCase and only gives skill/language IDs
        // (not names), so resolve those against the dropdowns first.
        const id = extractIdFromSlug(slug);
        if (!id) {
          setNotFoundState(true);
          return;
        }
        const [detail, skillOptions, languageOptions] = await Promise.all([
          getAstrologerDetail({ data: { id, token: user?.token } }),
          getSkillOptions(),
          getLanguageOptions(),
        ]);
        if (cancelled) return;
        if (!detail) {
          setNotFoundState(true);
          return;
        }
        setAstrologer(mapDetailRecordToAstrologer(detail, skillOptions, languageOptions));
        setRelated([]);
      } catch {
        if (!cancelled) setNotFoundState(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug, user?.token]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="flex flex-col items-center text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mb-3" />
          <p className="text-sm font-medium">Loading profile…</p>
        </div>
      </main>
    );
  }

  if (notFoundState || !astrologer) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="font-display text-2xl font-semibold mb-2">Astrologer not found</h1>
          <p className="text-muted-foreground mb-6">
            This astrologer couldn't be found — they may no longer be listed.
          </p>
          <Link
            to="/consultation"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-deep hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> All astrologers
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden px-6 pt-32 md:pt-36 pb-14">
        <div className="absolute inset-0 -z-10 bg-gradient-hero" />
        <Starfield />

        <div className="max-w-4xl mx-auto">
          <Link
            to="/consultation"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> All astrologers
          </Link>

          <div className="flex flex-col sm:flex-row items-start gap-6 rounded-3xl border border-border bg-card p-7 shadow-card">
            <div className="relative shrink-0">
              <img
                src={avatarUrl(astrologer.avatarSeed)}
                alt={astrologer.name}
                className="h-28 w-28 rounded-full border border-border bg-secondary object-cover"
              />
              {astrologer.isOnline && (
                <span
                  className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-card"
                  title="Online now"
                />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-3xl font-semibold">{astrologer.name}</h1>
                <BadgeCheck className="h-5 w-5 text-primary" />
                {astrologer.badge && (
                  <span className="rounded-full bg-primary/10 text-primary-deep px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide">
                    {astrologer.badge}
                  </span>
                )}
                {astrologer.isOnline && (
                  <span className="rounded-full bg-emerald-500/10 text-emerald-700 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide">
                    Online now
                  </span>
                )}
              </div>

              <p className="mt-1.5 text-sm text-muted-foreground">
                {astrologer.languages.length > 0 ? astrologer.languages.join(", ") : "Languages unavailable"}
                {" · "}
                {astrologer.experienceYears} yrs experience
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <span className="font-semibold text-foreground">₹{astrologer.pricePerMin}/min</span>
              </div>

              {astrologer.skills.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {astrologer.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground border border-border"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => startConsultation(astrologer, "Chat")}
                  disabled={!astrologer.modes.includes("Chat")}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                    astrologer.modes.includes("Chat")
                      ? "bg-gradient-primary text-primary-foreground shadow-soft hover:opacity-95 hover:scale-[1.02] active:scale-[0.97]"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  <MessageCircle className="h-4 w-4" /> Start Chat
                </button>
                <button
                  onClick={() => startConsultation(astrologer, "Call")}
                  disabled={!astrologer.modes.includes("Call")}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold border transition-all ${
                    astrologer.modes.includes("Call")
                      ? "border-primary/30 text-primary-deep hover:bg-primary/5"
                      : "border-border text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  <Phone className="h-4 w-4" /> Start Call
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {astrologer.bio && (
        <section className="max-w-4xl mx-auto px-6 pb-16">
          <h2 className="font-display text-2xl font-semibold mb-3">About</h2>
          <p className="text-muted-foreground leading-relaxed">{astrologer.bio}</p>
        </section>
      )}

      {related.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <h2 className="font-display text-2xl font-semibold mb-6">Similar astrologers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map((a) => (
              <AstrologerCard key={a.id} astrologer={a} mode="Chat" />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

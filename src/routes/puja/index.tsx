// src/routes/puja/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import Starfield from "@/components/Starfield";
import PujaCard from "@/components/PujaCard";
import OnRequestPujaForm from "@/components/OnRequestPujaForm";
import { pujas, pujaCategories, type PujaCategory } from "@/data/pujaData";

export const Route = createFileRoute("/puja/")({
  head: () => ({
    meta: [
      { title: "Book a Puja — AstroView" },
      {
        name: "description",
        content:
          "Book a verified pandit for Griha Pravesh, Satyanarayan, Rudrabhishek and more — at home, online, or on request. Pick a package that fits your occasion.",
      },
      { property: "og:title", content: "Book a Puja — AstroView" },
      {
        property: "og:description",
        content: "Book a verified pandit for traditional Vedic pujas — at home, online, or on request.",
      },
    ],
  }),
  component: PujaPage,
});

function PujaPage() {
  const [category, setCategory] = useState<PujaCategory | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return pujas.filter((p) => {
      const matchesCategory = category === "all" || p.categories.includes(category);
      const matchesQuery = p.name.toLowerCase().includes(query.trim().toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-36 md:pt-40 pb-16">
        <div className="absolute inset-0 -z-10 bg-gradient-hero" />
        <Starfield />

        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium mb-5">
            Puja
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-semibold tracking-tight leading-tight">
            Book a Pandit ji,
            <br />
            for any occasion.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            At your home, over a live video call, or on your own request — choose a
            puja, pick a package, and we'll take care of the rest.
          </p>

          {/* Category toggle */}
          <div className="mt-10 inline-flex flex-wrap justify-center items-center gap-1.5 rounded-full border border-border bg-card p-1.5 shadow-card">
            <button
              onClick={() => setCategory("all")}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                category === "all"
                  ? "bg-gradient-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            {pujaCategories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  category === c
                    ? "bg-gradient-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {category === "On Request Puja" ? (
        /* On Request Puja is a custom, quote-based flow — no package picker,
           just a direct line to the team. */
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <OnRequestPujaForm />
        </section>
      ) : (
        /* Search + grid */
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="mb-8 flex flex-col gap-5">
            <div className="relative max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search puja name…"
                className="w-full rounded-full border border-border bg-card pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15 transition-all"
              />
            </div>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((p, idx) => (
                <PujaCard key={p.slug} puja={p} delay={idx * 40} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground text-sm py-16">
              No pujas match that filter yet — try a different category or search.
            </p>
          )}
        </section>
      )}
    </main>
  );
}

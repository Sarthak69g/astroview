// src/routes/kundli/index.tsx
//
// Kundli hub — entry point for the two Kundli services: the single-person
// Kundli Generator (birth chart) and the two-person Kundli Matching
// (Ashtakoot Guna Milan). Replaces the old standalone /kundli-matching
// route, which now lives at /kundli/matching.

import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Sparkles, Heart } from "lucide-react";
import Starfield from "@/components/Starfield";
import Reveal from "@/components/Reveal";

export const Route = createFileRoute("/kundli/")({
  head: () => ({
    meta: [
      { title: "Kundli — Birth Chart & Matching — AstroView" },
      {
        name: "description",
        content:
          "Generate a full Vedic birth chart (Kundli) or check marriage compatibility with a 36-point Ashtakoot Guna Milan Kundli match.",
      },
      { property: "og:title", content: "Kundli — AstroView" },
    ],
  }),
  component: KundliHub,
});

const SERVICES = [
  {
    to: "/kundli/generator" as const,
    icon: Sparkles,
    title: "Kundli Generator",
    blurb:
      "Enter your birth details to generate your Vedic Kundli — ascendant, Moon sign, nakshatra, planetary positions, and more, straight from your birth chart.",
  },
  {
    to: "/kundli/matching" as const,
    icon: Heart,
    title: "Kundli Matching",
    blurb:
      "Enter both partners' birth details for an authentic 36-point Ashtakoot Guna Milan compatibility score, with every koota explained.",
  },
];

function KundliHub() {
  return (
    <div className="relative min-h-screen bg-background">
      <Starfield />
      <div className="relative max-w-5xl mx-auto px-4 pt-32 pb-24 md:pt-40">
        <Reveal>
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-3">
              Vedic Astrology
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-2">
              Kundli
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Generate your own Vedic birth chart, or check marriage compatibility between two
              people — pick a service to get started.
            </p>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-6">
          {SERVICES.map((service, i) => (
            <Reveal key={service.to} delay={i * 80}>
              <Link
                to={service.to}
                className="group relative flex flex-col h-full bg-card border border-border rounded-2xl p-7 hover:border-primary/40 hover:shadow-card transition-all duration-300 hover:-translate-y-1"
              >
                <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute top-0 left-0 rounded-t-2xl" />

                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary-deep mb-5">
                  <service.icon className="h-6 w-6" />
                </div>

                <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
                  {service.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {service.blurb}
                </p>

                <div className="flex items-center gap-1 mt-6 text-sm font-medium text-primary-deep group-hover:gap-2 transition-all">
                  Get started
                  <ChevronRight className="h-4 w-4" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
// src/routes/panchang/index.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Sunrise } from "lucide-react";
import Starfield from "@/components/Starfield";
import Reveal from "@/components/Reveal";
import PanchangWidget from "@/components/PanchangWidget";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/panchang/")({
  head: () => ({
    meta: [
      { title: "Today's Panchang — Tithi, Nakshatra, Rahu Kaal — AstroView" },
      {
        name: "description",
        content:
          "Today's Panchang for any city in India — Tithi, Nakshatra, Yoga, Karana, sunrise/sunset, and auspicious & inauspicious windows including Rahu Kaal, computed with the Lahiri ayanamsa.",
      },
      { property: "og:title", content: "Today's Panchang — AstroView" },
    ],
  }),
  component: PanchangPage,
});

const FAQ_SECTIONS = [
  {
    q: "What is a Panchang?",
    a: "The Panchang is the traditional Vedic almanac that breaks a calendar day into five elements — Tithi, Vaara, Nakshatra, Yoga, and Karana — plus the auspicious and inauspicious windows within that day, like Rahu Kaal and Abhijit Muhurat.",
  },
  {
    q: "What is Tithi?",
    a: "Tithi is a lunar day, based on the angular distance between the Moon and Sun. There are 30 tithis in a lunar month, split across the waxing (Shukla) and waning (Krishna) paksha.",
  },
  {
    q: "What is Rahu Kaal, and why does it matter?",
    a: "Rahu Kaal is a roughly 90-minute window each day considered inauspicious for starting new or important activities — many people avoid beginning travel, purchases, or ceremonies during this time.",
  },
  {
    q: "Why does the Panchang change by city?",
    a: "Tithi, Nakshatra, and the auspicious/inauspicious windows are all calculated from sunrise and the Moon's position, which shift with your location's latitude, longitude, and local sunrise time — so the same calendar date reads slightly differently in Delhi versus Chennai.",
  },
];

function PanchangPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-36 md:pt-40 pb-16">
        <div className="absolute inset-0 -z-10 bg-gradient-hero" />
        <Starfield />

        {/* Decorative panchang glyphs */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none select-none" aria-hidden="true">
          {["☀","☾","✦","☉","☽","✧","॰","⋆"].map((sym, i) => (
            <span
              key={i}
              className="absolute text-primary/[0.14] font-display font-bold"
              style={{
                fontSize: `${((i * 41) % 46) + 26}px`,
                left: `${(i * 6.4) % 100}%`,
                top: `${(i * 13 + 6) % 85}%`,
                transform: `rotate(${i * 15}deg)`,
              }}
            >
              {sym}
            </span>
          ))}
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium mb-5">Panchang</p>
          <h1 className="font-display text-5xl md:text-7xl font-semibold tracking-tight text-foreground leading-tight mb-6">
            Today's five elements.
            <br />
            <span className="text-gradient">One almanac.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Tithi, Nakshatra, Yoga, and Karana for today — plus sunrise, sunset, and the day's
            auspicious and inauspicious windows, calculated for any city in India.
          </p>
        </div>
      </section>

      {/* Widget */}
      <section className="px-6 pb-14">
        <PanchangWidget />
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <Reveal>
          <div className="mb-8 text-center">
            <p className="text-xs tracking-[0.16em] uppercase text-primary font-medium mb-1">Good to know</p>
            <h2 className="font-display text-2xl font-semibold text-foreground">Reading your Panchang</h2>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <Accordion type="single" collapsible className="bg-card border border-border rounded-2xl px-5">
            {FAQ_SECTIONS.map((item, i) => (
              <AccordionItem
                key={item.q}
                value={`faq-${i}`}
                className={i === FAQ_SECTIONS.length - 1 ? "border-b-0" : ""}
              >
                <AccordionTrigger className="font-display text-base font-semibold text-foreground hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gradient-cosmic py-14 px-6 text-center">
        <Reveal>
          <Sunrise className="h-6 w-6 text-cosmic-foreground/70 mx-auto mb-4" />
          <h2 className="font-display text-3xl font-semibold text-cosmic-foreground mb-3">
            Know the day before you start it.
          </h2>
          <p className="text-cosmic-foreground/70 text-sm mb-7 max-w-md mx-auto leading-relaxed">
            For a Muhurat picked specifically for your event — marriage, griha pravesh, or a new
            venture — a full consultation goes further than the daily Panchang alone.
          </p>
          <Link
            to="/consultation"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-95 transition"
          >
            Talk to an astrologer
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
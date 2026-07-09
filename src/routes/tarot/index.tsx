// src/routes/tarot/index.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronRight,
  Sun,
  Heart,
  Briefcase,
  HelpCircle,
  Hourglass,
  type LucideIcon,
} from "lucide-react";
import { tarotSpreads } from "@/data/tarotSpreads";
import Reveal from "@/components/Reveal";
import TarotHeroArt from "@/components/TarotHeroArt";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/tarot/")({
  head: () => ({
    meta: [
      { title: "Tarot Readings — AstroView" },
      {
        name: "description",
        content:
          "Draw real Tarot readings online — Daily Card, Love & Relationships, Career & Finance, Yes or No, and Past/Present/Future spreads, each with an animated card reveal.",
      },
      { property: "og:title", content: "Tarot Readings — AstroView" },
    ],
  }),
  component: TarotHub,
});

const ICONS: Record<string, LucideIcon> = {
  Sun,
  Heart,
  Briefcase,
  HelpCircle,
  Hourglass,
};

const FAQ_SECTIONS = [
  {
    q: "What is Tarot?",
    a: "Tarot is a 78-card deck used for reflection, not fortune-telling. Each card carries a theme — the images act as prompts that help you look at a question from a fresh angle.",
  },
  {
    q: "How does a reading actually work?",
    a: "Pick a spread that matches what's on your mind, then draw and flip your cards. Each position in the spread carries a specific meaning — past, present, advice, and so on — that shapes how the card is read.",
  },
  {
    q: "What are the benefits of a reading?",
    a: "A good spread doesn't predict the future — it slows you down enough to notice what you already suspect. Most people use it for clarity and perspective, not certainty.",
  },
  {
    q: "Which spread should I choose?",
    a: "Quick check-in on your day → Daily Card. Something on your mind about a relationship → Love & Relationships. A decision at work → Career & Finance. A clear either/or → Yes or No. Anything unfolding over time → Past, Present, Future.",
  },
  {
    q: "Is this the same as a real Tarot reading?",
    a: "The cards and their meanings are the genuine, traditional Tarot deck — this just gives you a fast, free, digital way to draw and read them yourself, any time.",
  },
];

function SpreadCard({ spread }: { spread: (typeof tarotSpreads)[number] }) {
  const Icon = ICONS[spread.icon] ?? Sun;
  return (
    <Link
      to="/tarot/$spread"
      params={{ spread: spread.slug }}
      className="group relative flex flex-col h-full bg-card border border-border rounded-2xl p-5 hover:border-primary/40 hover:shadow-card transition-all duration-300 hover:-translate-y-1"
    >
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute top-0 left-0 rounded-t-2xl" />

      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary-deep mb-4">
        <Icon className="h-5 w-5" />
      </div>

      <h2 className="font-display text-xl font-semibold text-foreground mb-1.5">{spread.title}</h2>
      <p className="text-sm text-muted-foreground leading-relaxed flex-1">{spread.blurb}</p>

      <div className="flex items-center gap-1 mt-4 text-xs font-medium text-primary-deep group-hover:gap-2 transition-all">
        Explore Service
        <ChevronRight className="h-3 w-3" />
      </div>
    </Link>
  );
}

function TarotHub() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-36 md:pt-40 pb-16">
        <div className="absolute inset-0 -z-10 bg-gradient-hero" />

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <Reveal>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium mb-5">
                Tarot Readings
              </p>
              <h1 className="font-display text-5xl md:text-6xl font-semibold tracking-tight text-foreground leading-tight mb-6">
                Ancient wisdom.
                <br />
                <span className="text-gradient">Modern guidance.</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-md mb-8">
                Draw a card and receive insight that brings clarity, confidence, and direction to
                your day — five spreads, each with an instant, honest reading.
              </p>
              <a
                href="#spreads"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-95 transition"
              >
                Explore Tarot
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <TarotHeroArt />
          </Reveal>
        </div>
      </section>

      {/* Spread grid */}
      <section id="spreads" className="max-w-6xl mx-auto px-6 pb-24">
        <Reveal>
          <div className="mb-8">
            <p className="text-xs tracking-[0.16em] uppercase text-primary font-medium mb-1">
              Choose a reading
            </p>
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Pick your spread.
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tarotSpreads.map((spread, i) => (
            <Reveal key={spread.slug} delay={(i % 3) * 60} className="h-full">
              <SpreadCard spread={spread} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <Reveal>
          <div className="mb-8 text-center">
            <p className="text-xs tracking-[0.16em] uppercase text-primary font-medium mb-1">
              Good to know
            </p>
            <h2 className="font-display text-2xl font-semibold text-foreground">
              What is Tarot, really?
            </h2>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <Accordion type="single" collapsible className="bg-card border border-border rounded-2xl px-5">
            {FAQ_SECTIONS.map((item, i) => (
              <AccordionItem key={item.q} value={`faq-${i}`} className={i === FAQ_SECTIONS.length - 1 ? "border-b-0" : ""}>
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
          <h2 className="font-display text-3xl font-semibold text-cosmic-foreground mb-3">
            A card gives you a moment of clarity.
          </h2>
          <p className="text-cosmic-foreground/70 text-sm mb-7 max-w-md mx-auto leading-relaxed">
            For a deeper, personalised reading tied to your actual birth chart and timing, a full
            consultation goes much further than any spread alone.
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

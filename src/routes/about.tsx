import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  ShieldCheck,
  Eye,
  Heart,
  Sparkles,
  Compass,
  Search,
  Hammer,
  Rocket,
  Plus,
} from "lucide-react";
import Starfield from "@/components/Starfield";
import Reveal from "@/components/Reveal";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — AstroView" },
      {
        name: "description",
        content:
          "AstroView is a modern home for Vedic astrology — built by KamleshKhyati Infosolution, designed for seekers who value tradition, honesty, and clarity.",
      },
      { property: "og:title", content: "About — AstroView" },
      {
        property: "og:description",
        content:
          "AstroView is a modern home for Vedic astrology — built by KamleshKhyati Infosolution, designed for seekers who value tradition, honesty, and clarity.",
      },
      { name: "twitter:title", content: "About — AstroView" },
      {
        name: "twitter:description",
        content:
          "AstroView is a modern home for Vedic astrology — built by KamleshKhyati Infosolution, designed for seekers who value tradition, honesty, and clarity.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <AboutHero />
      <Reveal>
        <Origin />
      </Reveal>
      <Reveal>
        <Beliefs />
      </Reveal>
      <Reveal>
        <Journey />
      </Reveal>
      <Reveal>
        <ClosingStatement />
      </Reveal>
    </div>
  );
}

// ─── Hero ───────────────────────────────────────────────────────────────────

function AboutHero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-20 bg-gradient-hero">
      <Starfield />
      <div className="mx-auto max-w-4xl px-6 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-primary font-medium">
          Who We Are
        </p>

        <h1 className="mt-5 font-display text-4xl md:text-6xl font-semibold leading-tight">
          Built slowly. <span className="text-gradient">Built carefully.</span>
        </h1>

        <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          AstroView exists because seeking guidance online had started to feel
          loud. We're building something quieter — rooted in real
          conversation, not manufactured urgency.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-2.5">
          {["Classical Vedic Methods", "Human Astrologers", "Privacy First"].map(
            (item) => (
              <span
                key={item}
                className="rounded-full border border-border bg-card/70 backdrop-blur px-4 py-2 text-sm"
              >
                {item}
              </span>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Origin ─────────────────────────────────────────────────────────────────

function Origin() {
  return (
    <section className="py-14 md:py-16">
      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-8 md:gap-10 items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium">
            Why AstroView Exists
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-display font-semibold leading-snug">
            A different starting question.
          </h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            Most astrology platforms are built around attention — urgency,
            volume, one more purchase. We started AstroView by asking the
            opposite question: what would this feel like if it were designed
            around the person seeking guidance, not the platform selling it?
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            That question shaped every decision since — from how a reading is
            explained to how (and whether) we ask you to pay again.
          </p>
        </div>

        <div className="rounded-[2rem] border border-border bg-card p-8 md:p-10 shadow-card">
          <span className="font-display text-5xl text-primary/30 leading-none">
            "
          </span>
          <p className="mt-2 font-display text-xl md:text-2xl leading-snug">
            Astrology designed around the seeker, not the platform.
          </p>
          <p className="mt-5 text-sm text-muted-foreground">
            The question that became AstroView.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Beliefs (interactive accordion) ───────────────────────────────────────

const beliefs = [
  {
    icon: ShieldCheck,
    title: "Honesty over impressiveness",
    text: "If astrology can't answer something clearly, we say so — rather than dressing up uncertainty as prophecy. Honest guidance beats dramatic prediction, every time.",
  },
  {
    icon: Eye,
    title: "Transparency in practice",
    text: "We show our reasoning. Whether it's a Dasha period, a transit, or a Guna Milan score, we explain what it means and why it matters to your specific situation.",
  },
  {
    icon: Heart,
    title: "People, not sessions",
    text: "Everyone who consults AstroView is a real person with a real story — never a query to resolve or a session to close as fast as possible.",
  },
  {
    icon: Sparkles,
    title: "Tradition, applied thoughtfully",
    text: "Vedic astrology is thousands of years old, and we respect that lineage. We also believe it's honoured best by applying it with care, not mechanically.",
  },
];

function Beliefs() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section className="py-14 md:py-16 bg-accent/20">
      <div className="mx-auto max-w-4xl px-6">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium">
            What We Believe
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-display font-semibold">
            Four principles, non-negotiable.
          </h2>
        </Reveal>

        <div className="mt-8 rounded-3xl border border-border bg-card shadow-card divide-y divide-border overflow-hidden">
          {beliefs.map((item, idx) => {
            const isOpen = openIdx === idx;
            const Icon = item.icon;
            return (
              <BeliefRow
                key={item.title}
                icon={Icon}
                title={item.title}
                text={item.text}
                isOpen={isOpen}
                onToggle={() => setOpenIdx(isOpen ? -1 : idx)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BeliefRow({
  icon: Icon,
  title,
  text,
  isOpen,
  onToggle,
}: {
  icon: typeof ShieldCheck;
  title: string;
  text: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  return (
    <div className={`transition-colors duration-300 ${isOpen ? "bg-accent/30" : ""}`}>
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center gap-4 p-5 md:p-6 text-left cursor-pointer"
      >
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
            isOpen ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
          }`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <span className="flex-1 font-display text-base md:text-lg font-semibold">
          {title}
        </span>
        <Plus
          className={`h-5 w-5 shrink-0 text-primary transition-transform duration-300 ${
            isOpen ? "rotate-45" : "rotate-0"
          }`}
        />
      </button>
      <div
        ref={bodyRef}
        className="overflow-hidden"
        style={{
          maxHeight: isOpen ? bodyRef.current?.scrollHeight ?? 200 : 0,
          transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <p className="px-5 md:px-6 pb-6 pl-[3.75rem] md:pl-[4.25rem] text-sm md:text-base text-muted-foreground leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  );
}

// ─── Journey (tabs) ─────────────────────────────────────────────────────────

const journey = [
  {
    label: "The beginning",
    icon: Compass,
    text: "KamleshKhyati Infosolution started AstroView with a simple question: why does astrology online feel so transactional? The platforms out there were loud, ad-heavy and impersonal — we wanted something different.",
  },
  {
    label: "The research",
    icon: Search,
    text: "We spent real time with seekers who use astrology to navigate decisions, and with practising astrologers. The gap between what people needed and what existed online was obvious.",
  },
  {
    label: "The build",
    icon: Hammer,
    text: "We began building AstroView from scratch, with a simple brief: slow, private, honest, beautiful. No fake reviews, no manufactured urgency, no pop-ups. Just astrology, done properly.",
  },
  {
    label: "Coming soon",
    icon: Rocket,
    text: "AstroView is in its final stages before launch. Our first release includes Janam Kundli reports, live call consultations and chat readings — all built around real astrologers and real care.",
  },
];

function Journey() {
  const [active, setActive] = useState(0);
  const current = journey[active];

  return (
    <section className="py-14 md:py-16">
      <div className="mx-auto max-w-4xl px-6">
        <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium">
          Our Journey
        </p>
        <h2 className="mt-3 text-3xl md:text-4xl font-display font-semibold">
          Where we've been, where we're going.
        </h2>

        <div className="mt-8 flex flex-wrap gap-2">
          {journey.map((step, idx) => {
            const Icon = step.icon;
            const isActive = idx === active;
            return (
              <button
                key={step.label}
                onClick={() => setActive(idx)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "border border-border text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <Icon className="h-4 w-4" />
                {step.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6 rounded-3xl border border-border bg-card p-7 md:p-9 shadow-card min-h-[9rem] flex items-center">
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            {current.text}
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Closing ────────────────────────────────────────────────────────────────

function ClosingStatement() {
  return (
    <section className="py-14 md:py-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="rounded-[2.5rem] bg-gradient-cosmic p-8 md:p-14 shadow-glow grid md:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <p className="text-3xl md:text-4xl font-display text-cosmic-foreground leading-snug">
              "We don't claim to have all the answers. We simply believe
              honest guidance, delivered with care, helps people see their
              path more clearly."
            </p>
            <p className="mt-6 text-cosmic-foreground/70">— The AstroView Team</p>
          </div>
          <div className="md:border-l md:border-cosmic-foreground/20 md:pl-8 md:max-w-[220px]">
            <p className="text-xs uppercase tracking-[0.22em] text-cosmic-foreground/60 font-medium">
              Built By
            </p>
            <p className="mt-2 font-display text-lg text-cosmic-foreground font-semibold">
              KamleshKhyati Infosolution Pvt. Ltd.
            </p>
            <p className="mt-2 text-sm text-cosmic-foreground/70">
              Noida, India — designed and built in-house.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Moon,
  Sun,
  Star,
  Phone,
  MessageCircle,
  ScrollText,
  HeartHandshake,
  ShieldCheck,
  ArrowRight,
  Compass,
  Gem,
  Mail,
  Instagram,
  Youtube,
  Facebook,
  Menu,
  X,
} from "lucide-react";

// ─── Logo ────────────────────────────────────────────────────────────────────
// If you're running inside Lovable keep the original logoAsset.url import.
// Outside Lovable, drop your logo.png into src/assets/ and use this instead:
import logoAsset from "@/assets/logo.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AstraGuru — Vedic Astrology, Reimagined" },
      {
        name: "description",
        content:
          "Discover your path with AstraGuru — personalized Vedic astrology, kundli & spiritual guidance crafted for the modern seeker.",
      },
      { property: "og:title", content: "AstraGuru — Vedic Astrology, Reimagined" },
      {
        property: "og:description",
        content: "Personalized Vedic astrology and spiritual guidance for the modern seeker.",
      },
    ],
  }),
  component: Landing,
});

// ─── Data ─────────────────────────────────────────────────────────────────────

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Why AstraGuru", href: "#why" },
  { label: "Journey", href: "#journey" },
  { label: "FAQ", href: "#faq" },
];

const services = [
  {
    icon: Phone,
    title: "Live Call Consultations",
    text: "One-on-one voice sessions with seasoned astrologers, anywhere you are.",
  },
  {
    icon: MessageCircle,
    title: "Chat Readings",
    text: "Quick, private chat sessions for moments when you need clarity, fast.",
  },
  {
    icon: ScrollText,
    title: "Janam Kundli",
    text: "A meticulously cast Vedic birth chart that decodes your life's blueprint.",
  },
  {
    icon: HeartHandshake,
    title: "Love & Compatibility",
    text: "Guna Milan and synastry insights to understand the bonds that matter.",
  },
  {
    icon: Gem,
    title: "Gemstone & Remedies",
    text: "Personalised gemstone, mantra and ritual suggestions rooted in tradition.",
  },
  {
    icon: Compass,
    title: "Career & Direction",
    text: "Map planetary cycles to make confident decisions about your work and path.",
  },
];

const pillars = [
  {
    icon: ShieldCheck,
    title: "Authentic Vedic lineage",
    text: "Built on classical Parashari and Jaimini systems — no gimmicks, no shortcuts.",
  },
  {
    icon: Star,
    title: "Crafted, not mass-produced",
    text: "Every reading is interpreted with care. You are a person, not a template.",
  },
  {
    icon: Sparkles,
    title: "Modern, private, calm",
    text: "A soft, ad-free experience designed to feel less like an app and more like a quiet conversation.",
  },
];

const journey = [
  {
    step: "01",
    title: "Share your moment",
    text: "Your birth date, time and place — the three coordinates of your cosmic story.",
  },
  {
    step: "02",
    title: "We cast your chart",
    text: "A precise Vedic kundli is prepared and reviewed by an astrologer who actually reads it.",
  },
  {
    step: "03",
    title: "Speak with a guide",
    text: "Connect by call or chat for an honest, personal conversation about your questions.",
  },
  {
    step: "04",
    title: "Walk with clarity",
    text: "Receive remedies, timing and direction you can carry into your everyday life.",
  },
];

const faqs = [
  {
    q: "Is AstraGuru live yet?",
    a: "We're building thoughtfully. This is our home — readings, accounts and bookings will open in our next release. Drop your email below to be the first to know.",
  },
  {
    q: "What kind of astrology do you practice?",
    a: "Classical Vedic (Jyotish) astrology — primarily the Parashari system, with select use of Jaimini techniques for timing and direction.",
  },
  {
    q: "Will my information be private?",
    a: "Always. Your birth details and conversations are yours alone. We will never sell, share, or surface them publicly.",
  },
  {
    q: "Do you make predictions or promises?",
    a: "Astrology offers patterns and possibilities, not guarantees. Our guidance is honest, considered and meant to help you choose — never to scare you.",
  },
];

// ─── Root component ───────────────────────────────────────────────────────────

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Scroll padding so sticky header doesn't cover jump targets */}
      <style>{`html { scroll-padding-top: 80px; scroll-behavior: smooth; }`}</style>
      <Header />
      <Hero />
      <TrustStrip />
      <Services />
      <Why />
      <Journey />
      <Promise />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-background/80 border-b border-border/50 shadow-[0_1px_12px_oklch(0.58_0.18_42_/_0.08)]"
          : "backdrop-blur-xl bg-background/70 border-b border-border/50"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 h-18 py-3 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 shrink-0">
          <img src={logoAsset.url} alt="AstraGuru" className="h-10 w-10" />
          <span className="text-xl font-display font-semibold tracking-tight">
            Astra<span className="text-primary">Guru</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-9">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <a
          href="#cta"
          className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-soft hover:opacity-95 transition"
        >
          Join early <ArrowRight className="h-4 w-4" />
        </a>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(true)}
          className="md:hidden p-2 text-foreground rounded-lg hover:bg-accent transition"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer overlay — full screen dark bg */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[60] bg-foreground/40 backdrop-blur-sm md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile drawer panel — slides in from right */}
      <div
        className={`fixed top-0 right-0 z-[70] h-full w-[280px] bg-background border-l border-border shadow-2xl flex flex-col md:hidden transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-2">
            <img src={logoAsset.url} alt="" className="h-8 w-8" />
            <span className="font-display font-semibold text-lg">
              Astra<span className="text-primary">Guru</span>
            </span>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-1.5 rounded-full hover:bg-accent transition"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-col gap-1 p-4 flex-1">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3.5 rounded-xl text-base font-medium text-foreground hover:bg-accent transition"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="p-5 border-t border-border">
          <a
            href="#cta"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full rounded-full bg-gradient-primary px-5 py-3.5 text-sm font-medium text-primary-foreground shadow-soft"
          >
            Join early <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero -z-10" />
      <Starfield />
      {/* orbiting rings */}
      <div className="pointer-events-none absolute left-1/2 top-[8%] -translate-x-1/2 w-[900px] h-[900px] -z-10 opacity-50">
        <div className="absolute inset-0 rounded-full border border-primary/15 animate-orbit" />
        <div className="absolute inset-12 rounded-full border border-primary/10" />
        <div className="absolute inset-28 rounded-full border border-primary/10" />
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-16 pb-20 md:pt-28 md:pb-36 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center">
        {/* Left */}
        <div className="relative">
          <div
            className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3 py-1 text-xs font-medium text-primary-deep"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.5s ease 0.05s, transform 0.5s ease 0.05s",
            }}
          >
            <Sparkles className="h-3.5 w-3.5" /> Quietly arriving soon
          </div>

          <h1
            className="mt-6 font-display font-semibold text-4xl sm:text-5xl md:text-7xl leading-[1.02] tracking-tight"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.65s ease 0.15s, transform 0.65s ease 0.15s",
            }}
          >
            Ancient wisdom,
            <br />
            <span className="text-gradient">spoken softly</span> in
            <br />a modern voice.
          </h1>

          <p
            className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s",
            }}
          >
            AstraGuru is a thoughtful home for Vedic astrology — built for seekers who want
            clarity without noise, tradition without theatre, and guidance that respects your time.
          </p>

          <div
            className="mt-8 flex flex-wrap items-center gap-3"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.6s ease 0.42s, transform 0.6s ease 0.42s",
            }}
          >
            <a
              href="#cta"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3.5 text-sm font-medium text-primary-foreground shadow-glow hover:scale-[1.02] transition"
            >
              Reserve your reading <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#services"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-sm font-medium hover:bg-accent transition"
            >
              Explore what's coming
            </a>
          </div>

          <div
            className="mt-10 flex items-center gap-6 text-xs text-muted-foreground"
            style={{
              opacity: loaded ? 1 : 0,
              transition: "opacity 0.6s ease 0.56s",
            }}
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" /> Private by design
            </span>
            <span className="flex items-center gap-1.5">
              <Sun className="h-4 w-4 text-primary" /> Authentic Vedic lineage
            </span>
          </div>
        </div>

        {/* Right — floating logo orb */}
        <div
          className="hidden lg:flex relative items-center justify-center"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "scale(1)" : "scale(0.9)",
            transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
          }}
        >
          <div className="absolute inset-0 bg-gradient-glow blur-3xl" />
          <div className="relative">
            <div className="absolute -inset-8 rounded-full bg-gradient-primary opacity-20 blur-2xl animate-pulse-glow" />
            <div className="relative h-[340px] w-[340px] md:h-[420px] md:w-[420px] rounded-full bg-gradient-to-br from-card to-accent/50 shadow-glow flex items-center justify-center animate-float-slow">
              <img
                src={logoAsset.url}
                alt="AstraGuru emblem"
                className="h-[78%] w-[78%] object-contain drop-shadow-xl"
              />
            </div>
            {/* floating info chips */}
            <div className="absolute -left-6 top-10 rounded-2xl bg-card/90 backdrop-blur border border-border px-4 py-3 shadow-card flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Moon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Today</p>
                <p className="text-sm font-medium">Chandra in Rohini</p>
              </div>
            </div>
            <div className="absolute -right-4 bottom-12 rounded-2xl bg-card/90 backdrop-blur border border-border px-4 py-3 shadow-card flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Star className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Nakshatra</p>
                <p className="text-sm font-medium">A gentle day</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-only: compact logo orb, no floating chips */}
        <div
          className="lg:hidden flex justify-center pt-2"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "scale(1)" : "scale(0.92)",
            transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
          }}
        >
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-gradient-primary opacity-15 blur-2xl animate-pulse-glow" />
            <div className="relative h-[220px] w-[220px] rounded-full bg-gradient-to-br from-card to-accent/50 shadow-glow flex items-center justify-center animate-float-slow">
              <img src={logoAsset.url} alt="AstraGuru emblem" className="h-[78%] w-[78%] object-contain drop-shadow-xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Starfield() {
  const stars = Array.from({ length: 28 }, (_, i) => ({
    top: `${(i * 37) % 95}%`,
    left: `${(i * 53) % 97}%`,
    size: (i % 3) + 1,
    delay: `${(i % 7) * 0.4}s`,
  }));
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-primary animate-twinkle"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
          }}
        />
      ))}
    </div>
  );
}

// ─── Trust strip ──────────────────────────────────────────────────────────────

function TrustStrip() {
  const items = [
    "Vedic · Parashari",
    "Jaimini timing",
    "Private & ad-free",
    "Human astrologers",
    "Hindi · English",
  ];
  return (
    <div className="border-y border-border/60 bg-card/40 overflow-x-auto">
      <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-start md:justify-center gap-x-8 md:gap-x-10 gap-y-2 text-xs uppercase tracking-[0.18em] text-muted-foreground min-w-max md:min-w-0 flex-nowrap md:flex-wrap">
        {items.map((item) => (
          <span key={item} className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-primary/60" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Services ─────────────────────────────────────────────────────────────────

function Services() {
  return (
    <section id="services" className="relative py-14 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium">
            What we're building
          </p>
          <h2 className="mt-3 text-4xl md:text-5xl font-display font-semibold tracking-tight">
            Six ways to meet your chart.
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            A focused set of services — none of the clutter. Each one is being shaped with care and
            will arrive in our first release.
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => (
            <div
              key={s.title}
              className="group relative rounded-3xl border border-border bg-card p-7 shadow-card hover:shadow-glow hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition" />
              <div className="h-12 w-12 rounded-2xl bg-gradient-primary text-primary-foreground flex items-center justify-center shadow-soft">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-xl font-display font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.text}</p>
              <span className="mt-5 inline-flex items-center text-xs font-medium text-primary-deep/70">
                Coming soon
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Why ──────────────────────────────────────────────────────────────────────

function Why() {
  return (
    <section
      id="why"
      className="relative py-14 md:py-32 bg-gradient-to-b from-background via-accent/30 to-background"
    >
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium">
            Why AstraGuru
          </p>
          <h2 className="mt-3 text-4xl md:text-5xl font-display font-semibold tracking-tight">
            A different kind of astrology platform.
          </h2>
          <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
            We started AstraGuru because the experience of seeking guidance online had become loud,
            transactional and oddly cold. This is our attempt at something else — slower, more
            personal, more honest.
          </p>
          <div className="mt-10 space-y-5">
            {pillars.map((p) => (
              <div key={p.title} className="flex gap-4">
                <div className="shrink-0 h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <p.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-semibold">{p.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{p.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vedic chart ring diagram */}
        <div className="relative">
          <div className="aspect-square max-w-lg mx-auto relative">
            <div className="absolute inset-0 rounded-[3rem] bg-gradient-cosmic shadow-glow" />
            <div className="absolute inset-0 rounded-[3rem] bg-[radial-gradient(circle_at_30%_20%,oklch(0.83_0.15_70_/_0.35),transparent_60%)]" />
            <svg
              viewBox="0 0 400 400"
              className="absolute inset-0 m-auto p-8 text-primary-glow/60"
            >
              <g fill="none" stroke="currentColor" strokeWidth="0.6">
                <circle cx="200" cy="200" r="180" />
                <circle cx="200" cy="200" r="140" />
                <circle cx="200" cy="200" r="100" />
                <circle cx="200" cy="200" r="60" />
                {Array.from({ length: 12 }).map((_, i) => {
                  const a = (i * Math.PI) / 6;
                  return (
                    <line
                      key={i}
                      x1={200 + Math.cos(a) * 60}
                      y1={200 + Math.sin(a) * 60}
                      x2={200 + Math.cos(a) * 180}
                      y2={200 + Math.sin(a) * 180}
                    />
                  );
                })}
              </g>
              {["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"].map((g, i) => {
                const a = (i * Math.PI) / 6 - Math.PI / 12;
                return (
                  <text
                    key={i}
                    x={200 + Math.cos(a) * 160}
                    y={200 + Math.sin(a) * 160}
                    fill="currentColor"
                    fontSize="16"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {g}
                  </text>
                );
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <img src={logoAsset.url} alt="" className="h-28 w-28 opacity-90 drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Journey ──────────────────────────────────────────────────────────────────

function Journey() {
  return (
    <section id="journey" className="py-14 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium">
            How it will work
          </p>
          <h2 className="mt-3 text-4xl md:text-5xl font-display font-semibold tracking-tight">
            From your birth moment to a clear next step.
          </h2>
        </div>

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {journey.map((j, idx) => (
            <div
              key={j.step}
              className="relative rounded-3xl border border-border bg-card p-7 shadow-card"
            >
              <div className="flex items-baseline justify-between">
                <span className="text-5xl font-display font-semibold text-gradient leading-none">
                  {j.step}
                </span>
                {idx < journey.length - 1 && (
                  <ArrowRight className="hidden lg:block h-4 w-4 text-muted-foreground/50" />
                )}
              </div>
              <h3 className="mt-6 text-lg font-display font-semibold">{j.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{j.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Promise ──────────────────────────────────────────────────────────────────

function Promise() {
  return (
    <section className="py-14 md:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-cosmic p-10 md:p-16 shadow-glow">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-primary/30 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-primary-glow/20 blur-3xl pointer-events-none" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.25em] text-primary-glow font-medium">
              Our promise
            </p>
            <p className="mt-5 text-2xl md:text-4xl font-display font-medium text-cosmic-foreground leading-snug">
              "We will never use fear to sell a remedy. We will never invent a problem to keep you
              on a call. Your story is not a script — and we will treat it that way."
            </p>
            <div className="mt-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-primary-glow/20" />
              <p className="text-sm text-cosmic-foreground/70 tracking-wide shrink-0">
                — The AstraGuru team
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FAQ — animated accordion ────────────────────────────────────────────────

function FAQItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  const bodyRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`transition-colors duration-300 ${isOpen ? "bg-accent/40" : ""}`}>
      <button
        onClick={onToggle}
        className="w-full flex cursor-pointer items-center justify-between gap-6 p-7 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-lg font-display font-medium">{q}</span>
        <span
          className={`h-8 w-8 shrink-0 rounded-full border border-border flex items-center justify-center text-primary transition-transform duration-300 ${
            isOpen ? "rotate-45" : "rotate-0"
          }`}
        >
          +
        </span>
      </button>
      {/* Animated body */}
      <div
        ref={bodyRef}
        className="overflow-hidden"
        style={{
          maxHeight: isOpen ? bodyRef.current?.scrollHeight ?? 300 : 0,
          transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <p className="px-7 pb-7 text-muted-foreground leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="py-14 md:py-32 bg-gradient-to-b from-background to-accent/30"
    >
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium">
            Questions, asked honestly
          </p>
          <h2 className="mt-3 text-4xl md:text-5xl font-display font-semibold tracking-tight">
            What you might be wondering.
          </h2>
        </div>
        <div className="mt-12 divide-y divide-border rounded-3xl border border-border bg-card shadow-card overflow-hidden">
          {faqs.map((f, i) => (
            <FAQItem
              key={f.q}
              q={f.q}
              a={f.a}
              isOpen={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA — with success state ─────────────────────────────────────────────────

function CTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    // Simulate async (replace with your real API call)
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section id="cta" className="py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <img src={logoAsset.url} alt="" className="mx-auto h-16 w-16 animate-float-slow" />
        <h2 className="mt-6 text-3xl sm:text-4xl md:text-6xl font-display font-semibold tracking-tight">
          Be among the <span className="text-gradient">first</span> to sit with us.
        </h2>
        <p className="mt-5 text-muted-foreground text-lg">
          We're opening AstraGuru to a small circle of early seekers. Leave your email and we'll
          reach out personally when your reading is ready to book.
        </p>

        {submitted ? (
          <div className="mt-9 inline-flex flex-col items-center gap-2">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/30 bg-primary/5 px-6 py-3.5 text-sm font-medium text-primary-deep">
              <Sparkles className="h-4 w-4" />
              You're on the list — we'll reach out when we're ready.
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Check your inbox for a confirmation from hello@astraguru.app
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-9 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          >
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@somewhere.com"
                disabled={loading}
                className="w-full rounded-full border border-border bg-card pl-11 pr-5 py-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition disabled:opacity-60"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-gradient-primary px-6 py-3.5 text-sm font-medium text-primary-foreground shadow-glow hover:scale-[1.02] transition disabled:opacity-70 disabled:cursor-not-allowed min-w-[110px]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Saving…
                </span>
              ) : (
                "Notify me"
              )}
            </button>
          </form>
        )}

        <p className="mt-4 text-xs text-muted-foreground">
          No spam, no newsletters — just one quiet note when we're ready.
        </p>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-6 py-14 grid md:grid-cols-[1.4fr_1fr_1fr] gap-10">
        <div>
          <div className="flex items-center gap-2.5">
            <img src={logoAsset.url} alt="" className="h-9 w-9" />
            <span className="text-lg font-display font-semibold">
              Astra<span className="text-primary">Guru</span>
            </span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-sm leading-relaxed">
            A modern home for Vedic astrology. Built slowly, with care, for seekers who value
            tradition and clarity in equal measure.
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Explore</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="hover:text-primary transition">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Stay in touch</p>
          <div className="mt-4 flex items-center gap-3">
            <a
              href="#"
              aria-label="Instagram"
              className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition"
            >
              <Youtube className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition"
            >
              <Facebook className="h-4 w-4" />
            </a>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">hello@astraguru.app</p>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} AstraGuru. Crafted with reverence.</p>
          <p>Made for seekers, not scrollers.</p>
        </div>
      </div>
    </footer>
  );
}

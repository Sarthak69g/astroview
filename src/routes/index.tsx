import logoAsset from "@/assets/logo.png";
import { sendContactEmail } from "@/lib/emailjs-config";
import { getAstrologerBySlug, type Astrologer, type ConsultMode } from "@/data/astrologersData";
import { services as allServices } from "@/data/servicesData";
import { createFileRoute, Link } from "@tanstack/react-router";
import { pujas } from "@/data/pujaData";
import PujaCard from "@/components/PujaCard";
import {
  ArrowRight,
  Mail,
  MapPin,
  MessageCircle,
  Moon,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
} from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import SunSignFinder from "@/components/SunSignFinder";
import AstrologerCard from "@/components/AstrologerCard";
import Reveal from "@/components/Reveal";
import Starfield from "@/components/Starfield";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AstroView — Vedic Astrology, Reimagined" },
      {
        name: "description",
        content:
          "Discover your path with AstroView — personalized Vedic astrology, kundli & spiritual guidance crafted for the modern seeker.",
      },
      { property: "og:title", content: "AstroView — Vedic Astrology, Reimagined" },
      {
        property: "og:description",
        content: "Personalized Vedic astrology and spiritual guidance for the modern seeker.",
      },
    ],
  }),
  component: Landing,
});

// ─── Data ─────────────────────────────────────────────────────────────────────

const CONTACT = {
  email: "support@kamleshkhyatiinfosolution.com",
  phone: "+91-9319843151",
  address: [
    "Unit No.202, Second Floor, Plot No. 103,",
    "Block A, Sector 63 Noida,",
    "Gautam Budh Nagar UP – 201301",
  ],
};

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
    question: "How do I book a consultation?",
    answer:
      "Simply fill out the contact form and select the service you're interested in. Our team will review your inquiry and contact you to schedule the consultation.",
  },
  {
    question: "What information do I need to provide?",
    answer:
      "Depending on the service, we may require your full name, date of birth, time of birth, and place of birth. Additional details may be requested for more personalized guidance.",
  },
  {
    question: "Are consultations available online?",
    answer:
      "Yes. AstroView offers online consultations, allowing you to connect from anywhere through convenient digital communication channels.",
  },
  {
    question: "How long does a consultation usually take?",
    answer:
      "Consultation duration varies depending on the service selected. Most sessions typically range between 30 and 60 minutes.",
  },
  {
    question: "Will my personal information remain confidential?",
    answer:
      "Absolutely. We respect your privacy and handle all personal information and consultation discussions with strict confidentiality.",
  },
  {
    question: "Can astrology guarantee specific outcomes?",
    answer:
      "No. Astrology is intended to provide guidance, insights, and perspectives. Personal decisions and actions ultimately shape individual outcomes.",
  },
];

// ─── Root ─────────────────────────────────────────────────────────────────────

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <style>{`html { scroll-padding-top: 80px; scroll-behavior: smooth; }`}</style>
      <Hero />
      {/* <TrustStrip /> — disabled for now, content not finalized */}
      <SunSignFinder />
      <Consultation />
      <PujaTeaser />
      <Why />
      <Values />
      <Promise />
      <Journey />
      <Contact />
      <FAQ />
    </div>
  );
}

// ─── Scroll parallax hook ──────────────────────────────────────────────────
// Tracks window scroll and returns `scrollY * rate`, rAF-throttled. Used to
// drift the hero's background layers (starfield, orbit rings) at different
// speeds as the page scrolls past them, for a sense of depth. No-ops under
// prefers-reduced-motion.

function useScrollParallax(rate: number) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      raf = requestAnimationFrame(() => {
        setOffset(window.scrollY * rate);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [rate]);

  return offset;
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const [loaded, setLoaded] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Background layers drift at different rates as the page scrolls — the
  // rings (closer, larger) move a bit more than the starfield (further back).
  const ringOffset = useScrollParallax(0.14);
  const starOffset = useScrollParallax(0.06);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: relX * 18, y: relY * 18 });
  }

  function resetTilt() {
    setTilt({ x: 0, y: 0 });
  }

  return (
    <section
      className="relative isolate overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
    >
      <div className="absolute inset-0 bg-gradient-hero -z-10" />
      <div style={{ transform: `translateY(${starOffset}px)` }}>
        <Starfield />
      </div>
      <div
        className="pointer-events-none absolute left-1/2 top-[8%] w-[900px] h-[900px] -z-10 opacity-50"
        style={{ transform: `translateX(-50%) translateY(${ringOffset}px)` }}
      >
        <div className="absolute inset-0 rounded-full border border-primary/15 animate-orbit" />
        <div className="absolute inset-12 rounded-full border border-primary/10" />
        <div className="absolute inset-28 rounded-full border border-primary/10" />
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-12 pb-8 md:pt-20 md:pb-16 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center">
        {/* Left */}
        <div className="relative">
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
            AstroView is a thoughtful home for Vedic astrology — built for seekers who want
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
              href="/consultation"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3.5 text-sm font-medium text-primary-foreground shadow-glow hover:scale-[1.02] transition"
            >
              Talk to an astrologer <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3.5 text-sm font-medium hover:bg-accent transition"
            >
              Get in touch
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

        {/* Right — desktop orb */}
        <div
          className="hidden lg:flex relative items-center justify-center"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "scale(1)" : "scale(0.9)",
            transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
          }}
        >
          <div
            className="relative"
            style={{
              transform: `translate(${tilt.x}px, ${tilt.y}px)`,
              transition: "transform 0.3s ease-out",
            }}
          >
          <div className="absolute inset-0 bg-gradient-glow blur-3xl" />
          <div className="relative">
            <div className="absolute -inset-8 rounded-full bg-gradient-primary opacity-20 blur-2xl animate-pulse-glow" />
            <div className="relative h-[340px] w-[340px] md:h-[420px] md:w-[420px] rounded-full bg-gradient-to-br from-card to-accent/50 shadow-glow flex items-center justify-center animate-float-slow">
              <img src={logoAsset} alt="AstroView emblem" className="h-[78%] w-[78%] object-contain drop-shadow-xl" />
            </div>
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
        </div>

        {/* Mobile orb */}
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
              <img src={logoAsset} alt="AstroView emblem" className="h-[78%] w-[78%] object-contain drop-shadow-xl" />
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}

// ─── Starfield ────────────────────────────────────────────────────────────────

// ─── Consultation ─────────────────────────────────────────────────────────────

const FEATURED_ASTROLOGER_SLUGS = [
  "acharya-devraj-shastri",
  "meera-iyer",
  "priyanka-sharma",
];

function Consultation() {
  const [mode, setMode] = useState<ConsultMode>("Chat");
  const featured = FEATURED_ASTROLOGER_SLUGS.map((slug) => getAstrologerBySlug(slug)).filter(
    Boolean
  ) as Astrologer[];

  return (
    <section id="consultation" className="relative pt-14 pb-16 md:pt-20 md:pb-20">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium">
              Consultation
            </p>
            <h2 className="mt-3 text-4xl md:text-5xl font-display font-semibold tracking-tight">
              Talk to an astrologer, right now.
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Chat or call — pick what suits you, then choose an astrologer whose
              specialty matches what you're looking for.
            </p>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <div className="mt-8 inline-flex items-center gap-1.5 rounded-full border border-border bg-card p-1.5 shadow-card">
            <button
              onClick={() => setMode("Chat")}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                mode === "Chat"
                  ? "bg-gradient-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MessageCircle className="h-4 w-4" /> Chat
            </button>
            <button
              onClick={() => setMode("Call")}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                mode === "Call"
                  ? "bg-gradient-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Phone className="h-4 w-4" /> Call
            </button>
          </div>
        </Reveal>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((a, idx) => (
            <Reveal key={a.id} delay={idx * 70}>
              <AstrologerCard astrologer={a} mode={mode} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="mt-8 text-center">
            <Link
              to="/consultation"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium hover:bg-accent hover:border-primary/20 transition-all duration-200"
            >
              View all astrologers <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Puja ─────────────────────────────────────────────────────────────────────

function PujaTeaser() {
  const featured = pujas.slice(0, 3);

  return (
    <section className="relative pt-14 pb-16 md:pt-20 md:pb-20 bg-accent/20">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium">
              Puja
            </p>
            <h2 className="mt-3 text-4xl md:text-5xl font-display font-semibold tracking-tight">
              Book a pandit ji, for any occasion.
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              At home, over video call, or on request — choose a puja, pick a
              package that fits, and let a verified pandit handle the rest.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((p, idx) => (
            <Reveal key={p.slug} delay={idx * 70}>
              <PujaCard puja={p} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="mt-8 text-center">
            <Link
              to="/puja"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium hover:bg-accent hover:border-primary/20 transition-all duration-200"
            >
              View all pujas <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Why ──────────────────────────────────────────────────────────────────────

function Why() {
  return (
    <section id="why" className="relative pt-4 pb-14 md:pt-8 md:pb-20">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <Reveal>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium">
              Why AstroView
            </p>
            <h2 className="mt-3 text-4xl md:text-5xl font-display font-semibold tracking-tight">
              A different kind of astrology platform.
            </h2>
            <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
              We started AstroView because the experience of seeking guidance online had become loud,
              transactional and oddly cold. This is our attempt at something else — slower, more
              personal, more honest.
            </p>
            <div className="mt-10 space-y-5">
              {pillars.map((p, idx) => (
                <div
                  key={p.title}
                  className="flex gap-4 group cursor-default"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <div className="shrink-0 h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-105 transition-all duration-200">
                    <p.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-semibold group-hover:text-primary-deep transition-colors duration-200">
                      {p.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{p.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="relative">
            <div className="aspect-square max-w-lg mx-auto relative">
              <div className="absolute inset-0 rounded-[3rem] bg-gradient-cosmic shadow-glow" />
              <div className="absolute inset-0 rounded-[3rem] bg-[radial-gradient(circle_at_30%_20%,oklch(0.83_0.15_70_/_0.35),transparent_60%)]" />
              <svg viewBox="0 0 400 400" className="absolute inset-0 m-auto p-8 text-primary-glow/60">
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
                        x1={Number((200 + Math.cos(a) * 60).toFixed(2))}
                        y1={Number((200 + Math.sin(a) * 60).toFixed(2))}
                        x2={Number((200 + Math.cos(a) * 180).toFixed(2))}
                        y2={Number((200 + Math.sin(a) * 180).toFixed(2))}
                      />
                    );
                  })}
                </g>
                {["♈\uFE0E", "♉\uFE0E", "♊\uFE0E", "♋\uFE0E", "♌\uFE0E", "♍\uFE0E", "♎\uFE0E", "♏\uFE0E", "♐\uFE0E", "♑\uFE0E", "♒\uFE0E", "♓\uFE0E"].map((g, i) => {
                  const a = (i * Math.PI) / 6 - Math.PI / 12;
                  return (
                    <text
                      key={i}
                      x={Number((200 + Math.cos(a) * 160).toFixed(2))}
                      y={Number((200 + Math.sin(a) * 160).toFixed(2))}
                      fill="currentColor" fontSize="16" textAnchor="middle" dominantBaseline="middle"
                    >
                      {g}
                    </text>
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <img src={logoAsset} alt="" className="h-28 w-28 opacity-90 drop-shadow-2xl" />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Values ───────────────────────────────────────────────────────────────────

function Values() {
  const values = [
    { title: "Human Interpretation", text: "Every reading is reviewed by a real astrologer, not generated automatically." },
    { title: "Privacy First",         text: "Your birth details and consultations remain confidential and treated with care." },
    { title: "Traditional Foundation",text: "Built on classical Vedic principles rather than trend-driven astrology." },
    { title: "No Fear-Based Selling", text: "We explain possibilities honestly without creating anxiety or pressure." },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium">
              Why People Choose AstroView
            </p>
            <h2 className="mt-3 text-4xl md:text-5xl font-display font-semibold tracking-tight">
              Built on principles, not persuasion.
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 grid md:grid-cols-2 gap-5">
          {values.map((value, idx) => (
            <Reveal key={value.title} delay={idx * 80}>
              <div className="group rounded-3xl border border-border bg-card p-7 shadow-card hover:-translate-y-1 hover:shadow-glow hover:border-primary/20 transition-all duration-300 h-full">
                <div className="flex items-start gap-4">
                  {/* Expanding accent bar */}
                  <div className="mt-1 h-6 w-1 rounded-full bg-gradient-primary shrink-0 group-hover:h-full transition-all duration-500 ease-out" />
                  <div>
                    <h3 className="text-xl font-display font-semibold group-hover:text-primary-deep transition-colors duration-200">
                      {value.title}
                    </h3>
                    <p className="mt-3 text-muted-foreground leading-relaxed">{value.text}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Promise ──────────────────────────────────────────────────────────────────

function Promise() {
  return (
    <section className="pt-10 pb-10 md:pt-14 md:pb-14">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-cosmic p-10 md:p-16 shadow-glow">
            <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-primary/30 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-primary-glow/20 blur-3xl pointer-events-none" />
            <div className="relative">
              <p className="text-xs uppercase tracking-[0.25em] text-primary-glow font-medium">
                What we stand for
              </p>
              <p className="mt-5 text-2xl md:text-4xl font-display font-medium text-cosmic-foreground leading-snug">
                "We will never use fear to sell a remedy. We will never invent a problem to keep you
                on a call. Your story is not a script — and we will treat it that way."
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-primary-glow/20" />
                <p className="text-sm text-cosmic-foreground/70 tracking-wide shrink-0">
                  — The AstroView team
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Journey ──────────────────────────────────────────────────────────────────

function Journey() {
  return (
    <section id="journey" className="py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium">
              How it will work
            </p>
            <h2 className="mt-3 text-4xl md:text-5xl font-display font-semibold tracking-tight">
              From your birth moment to a clear next step.
            </h2>
          </div>
        </Reveal>

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {journey.map((j, idx) => (
            <Reveal key={j.step} delay={idx * 80}>
              <div className="group relative rounded-3xl border border-border bg-card p-7 shadow-card hover:-translate-y-1 hover:shadow-glow hover:border-primary/20 transition-all duration-300 h-full">
                {/* Accent line that draws on hover */}
                <div className="absolute left-0 top-6 bottom-6 w-0.5 rounded-full bg-gradient-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-400 origin-top" />

                <div className="flex items-baseline justify-between">
                  <span className="text-5xl font-display font-semibold text-gradient leading-none">
                    {j.step}
                  </span>
                  {idx < journey.length - 1 && (
                    <ArrowRight className="hidden lg:block h-4 w-4 text-muted-foreground/40 group-hover:text-primary/60 group-hover:translate-x-0.5 transition-all duration-200" />
                  )}
                </div>
                <h3 className="mt-6 text-lg font-display font-semibold group-hover:text-primary-deep transition-colors duration-200">
                  {j.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{j.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function Contact() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    from_name: "",
    from_email: "",
    phone: "",
    service: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.from_name.trim()) { toast.error("Please enter your name"); return; }
    const nameRegex = /^[A-Za-z\s]{2,50}$/;
    if (!nameRegex.test(formData.from_name.trim())) { toast.error("Please enter a valid name"); return; }
    if (!formData.from_email.trim()) { toast.error("Please enter your email"); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.from_email)) { toast.error("Please enter a valid email address"); return; }
    if (!formData.phone.trim()) { toast.error("Please enter your phone number"); return; }
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) { toast.error("Please enter a valid 10-digit phone number"); return; }
    if (!formData.service.trim()) { toast.error("Please select a service"); return; }
    if (!formData.message.trim()) { toast.error("Please enter your message"); return; }
    if (formData.message.trim().length < 10) { toast.error("Message must be at least 10 characters long"); return; }

    try {
      setLoading(true);
      const templateParams = {
        from_name: formData.from_name,
        from_email: formData.from_email,
        phone: formData.phone,
        service: formData.service,
        message: formData.message,
        source: "Website Contact Form",
        time: new Date().toLocaleString(),
      };
      await sendContactEmail(templateParams);
      toast.success("Inquiry submitted successfully. Our team will contact you within 24 hours.");
      setFormData({ from_name: "", from_email: "", phone: "", service: "", message: "" });
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast.error("Unable to submit your inquiry. Please try again in a few moments.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="pt-8 pb-20 md:pt-12 md:pb-28 bg-gradient-to-b from-background to-accent/30">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="max-w-3xl mx-auto text-center mb-14">
            <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium">
              Get In Touch
            </p>
            <h2 className="mt-4 text-4xl md:text-5xl font-display font-semibold tracking-tight">
              We'd love to hear from you.
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Reach out with your questions, feedback, or simply say hello.
            </p>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-[360px_1fr] gap-6 lg:gap-8">
          {/* Info cards */}
          <Reveal delay={80}>
            <div className="space-y-5">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
                <div className="flex gap-4">
                  <MapPin className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <div>
                    <h3 className="font-display text-lg font-semibold">Visit Our Office</h3>
                    <div className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {CONTACT.address.map((line, i) => <p key={i}>{line}</p>)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
                <div className="flex gap-4">
                  <Phone className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <div>
                    <h3 className="font-display text-lg font-semibold">Call Us</h3>
                    <a href={`tel:${CONTACT.phone}`} className="mt-2 block text-muted-foreground hover:text-primary transition">
                      {CONTACT.phone}
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
                <div className="flex gap-4">
                  <Mail className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <div>
                    <h3 className="font-display text-lg font-semibold">Email Us</h3>
                    <a href={`mailto:${CONTACT.email}`} className="mt-2 block break-all text-muted-foreground hover:text-primary transition">
                      {CONTACT.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
                <h3 className="font-display text-lg font-semibold">Availability</h3>
                <p className="mt-3 text-sm text-muted-foreground">Monday – Saturday</p>
                <p className="text-sm text-muted-foreground">10:00 AM – 7:00 PM</p>
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={160}>
            <form
              onSubmit={handleSubmit}
              className="rounded-[2rem] border border-border bg-card p-5 md:p-10 shadow-card"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  disabled={loading}
                  type="text"
                  name="from_name"
                  value={formData.from_name}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^A-Za-z\s]/g, "");
                    setFormData({ ...formData, from_name: value });
                  }}
                  placeholder="Full Name"
                  required
                  className="w-full h-14 rounded-xl border border-border bg-background px-4 outline-none focus:border-primary transition-colors"
                />
                <input
                  disabled={loading}
                  type="email"
                  name="from_email"
                  value={formData.from_email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                  className="w-full h-14 rounded-xl border border-border bg-background px-4 outline-none focus:border-primary transition-colors"
                />
                <input
                  disabled={loading}
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setFormData({ ...formData, phone: value });
                  }}
                  placeholder="Phone Number"
                  required
                  className="w-full h-14 rounded-xl border border-border bg-background px-4 outline-none focus:border-primary transition-colors"
                />
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full h-14 rounded-xl border border-border bg-background px-4 outline-none focus:border-primary transition-colors"
                >
                  <option value="">Select Service</option>
                  {allServices.map((service) => (
                    <option key={service.slug} value={service.name}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                rows={6}
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us how we can help..."
                required
                className="mt-6 w-full rounded-xl border border-border bg-background p-4 outline-none focus:border-primary transition-colors resize-none"
              />

              <button
                type="submit"
                disabled={loading}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-soft hover:opacity-95 hover:scale-[1.02] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Sending Inquiry..." : <><span>Send Message</span><ArrowRight className="h-4 w-4" /></>}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

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
            isOpen ? "rotate-45 bg-primary/10" : "rotate-0"
          }`}
        >
          +
        </span>
      </button>
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
    <section id="faq" className="py-14 md:py-32">
      <div className="mx-auto max-w-4xl px-6">
        <Reveal>
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium">
              Questions, asked honestly
            </p>
            <h2 className="mt-3 text-4xl md:text-5xl font-display font-semibold tracking-tight">
              What you might be wondering.
            </h2>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="mt-12 divide-y divide-border rounded-3xl border border-border bg-card shadow-card overflow-hidden">
            {faqs.map((f, i) => (
              <FAQItem
                key={f.question}
                q={f.question}
                a={f.answer}
                isOpen={openIdx === i}
                onToggle={() => setOpenIdx(openIdx === i ? null : i)}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, Phone, MessageCircle, ScrollText, HeartHandshake, Gem, Compass, Menu, X, Clock, Layers, MapPin, Mail } from "lucide-react";
import LOGO from "@/assets/logo.png";

const CONTACT = {
  email: "support@kamleshkhyatiinfosolution.com",
  phone: "+91-9319843151",

  footerAddress: "Sector 63, Noida",

  address: [
    "Unit No.202, Second Floor, Plot No. 103,",
    "Block A, Sector 63 Noida,",
    "Gautam Budh Nagar UP – 201301",
  ],
};
export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Services — AstroView" },
      { name: "description", content: "Explore AstroView's full range of Vedic astrology services — from live call consultations and Janam Kundli to compatibility and career guidance." },
    ],
  }),
  component: ServicesPage,
});

const services = [
  { slug: "live-call", icon: Phone, title: "Live Call Consultations", short: "One-on-one voice sessions with seasoned astrologers, anywhere you are.", long: "Connect directly with a vetted astrologer over a live voice call. Whether you have a pressing career question, a relationship concern, or simply want to understand your chart better, our call consultations offer a personal, real-time conversation tailored entirely to your situation. Sessions are available in Hindi and English.", duration: "30–60 min", mode: "Voice call" },
  { slug: "chat-readings", icon: MessageCircle, title: "Chat Readings", short: "Quick, private chat sessions for moments when you need clarity, fast.", long: "Not every question needs a full hour. Our chat readings let you ask specific questions and receive considered, written responses from a real astrologer — not a bot. Perfect for a quick check on timing, a yes/no that deserves more than a coin flip, or a second opinion before a decision.", duration: "15–30 min", mode: "Text chat" },
  { slug: "janam-kundli", icon: ScrollText, title: "Janam Kundli", short: "A meticulously cast Vedic birth chart that decodes your life's blueprint.", long: "Your Janam Kundli is the foundation of Vedic astrology. We prepare a precise Parashari kundli from your birth date, time and place — then an astrologer actually reads it and provides a written interpretation covering your personality, health, career, relationships and spiritual path.", duration: "Delivered in 24–48 hrs", mode: "Written report + call" },
  { slug: "love-compatibility", icon: HeartHandshake, title: "Love & Compatibility", short: "Guna Milan and synastry insights to understand the bonds that matter.", long: "Relationship guidance rooted in classical Guna Milan (36-point matching system) combined with modern synastry analysis. We look beyond a compatibility score to explain the actual dynamics at play — where you naturally align, where friction might arise, and how to navigate it together.", duration: "45–60 min or written report", mode: "Call or report" },
  { slug: "gemstone-remedies", icon: Gem, title: "Gemstone & Remedies", short: "Personalised gemstone, mantra and ritual suggestions rooted in tradition.", long: "Remedies in Vedic astrology are tools for working with planetary energies. Based on a reading of your chart, we suggest gemstones, mantras, colours, fasting days or simple daily rituals that are personally calibrated — never a generic list.", duration: "Included with kundli or standalone", mode: "Written report" },
  { slug: "career-direction", icon: Compass, title: "Career & Direction", short: "Map planetary cycles to make confident decisions about your work and path.", long: "Career decisions are among the most consequential choices you'll make. We use Dasha timelines (planetary period cycles) alongside your 10th house analysis to identify periods of opportunity, transition and consolidation — so you can act with confidence.", duration: "45–60 min", mode: "Voice call" },
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 16); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll); }, []);
  useEffect(() => { document.body.style.overflow = menuOpen ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [menuOpen]);
  const navLinks = [{ label: "Home", href: "/" }, { label: "Why Us", href: "/#why" }, { label: "Contact", href: "/#contact" }, { label: "About", href: "/about" }];
  return (
    <>
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "backdrop-blur-xl bg-background/80 border-b border-border/50 shadow-[0_1px_12px_oklch(0.58_0.18_42_/_0.08)]" : "backdrop-blur-xl bg-background/70 border-b border-border/50"}`}>
      <div className="mx-auto max-w-7xl px-6 py-3 h-18 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5 shrink-0"><img src={LOGO} alt="AstroView" className="h-10 w-10" /><span className="text-xl font-display font-semibold tracking-tight">Astro<span className="text-primary">View</span></span></a>
        <nav className="hidden md:flex items-center gap-7">{navLinks.map((l) => <a key={l.href} href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l.label}</a>)}<a href="/services" className="text-sm text-foreground font-medium">Services</a></nav>
        <a href="/#contact" className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-soft hover:opacity-95 transition">Get in touch <ArrowRight className="h-4 w-4" /></a>
        <button onClick={() => setMenuOpen(true)} className="md:hidden p-2 text-foreground rounded-lg hover:bg-accent transition"><Menu className="h-5 w-5" /></button>
      </div>

    </header>

    {typeof document !== "undefined" && createPortal(
      <>
      {menuOpen && <div className="fixed inset-0 z-[60] bg-foreground/40 backdrop-blur-sm md:hidden" onClick={() => setMenuOpen(false)} />}
      <div className={`fixed top-0 right-0 z-[70] h-full w-[280px] bg-background border-l border-border shadow-2xl flex flex-col md:hidden transition-transform duration-300 ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-border"><div className="flex items-center gap-2"><img src={LOGO} alt="" className="h-8 w-8" /><span className="font-display font-semibold text-lg">Astro<span className="text-primary">View</span></span></div><button onClick={() => setMenuOpen(false)} className="p-1.5 rounded-full hover:bg-accent transition"><X className="h-5 w-5" /></button></div>
        <nav className="flex flex-col gap-1 p-4 flex-1">{navLinks.map((l) => <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="px-4 py-3.5 rounded-xl text-base font-medium hover:bg-accent transition">{l.label}</a>)}<a href="/services" onClick={() => setMenuOpen(false)} className="px-4 py-3.5 rounded-xl text-base font-medium text-primary">Services</a></nav>
        <div className="p-5 border-t border-border"><a href="/#contact" onClick={() => setMenuOpen(false)} className="flex items-center justify-center gap-2 w-full rounded-full bg-gradient-primary px-5 py-3.5 text-sm font-medium text-primary-foreground">Get in touch <ArrowRight className="h-4 w-4" /></a></div>
      </div>
      </>,
      document.body
    )}
    </>
  );
}

function ServicesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />
      {/* Hero */}
      <section className="relative isolate overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-hero -z-10" />
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium">What we offer</p>
          <h1 className="mt-4 font-display font-semibold text-5xl md:text-7xl leading-[1.02] tracking-tight">
            Six ways to <span className="text-gradient">meet your chart.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            A focused set of services, each shaped with care. We'd rather offer six things done properly than sixty done carelessly. Click any service to learn more about what it involves.
          </p>
        </div>
      </section>

      {/* Services list */}
      <section className="py-14 md:py-24">
        <div className="mx-auto max-w-7xl px-6 space-y-6">
          {services.map((s) => (
            <a key={s.slug} href={`/services/${s.slug}`}
              className="group flex flex-col md:flex-row gap-8 rounded-3xl border border-border bg-card p-8 shadow-card hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300">
              <div className="shrink-0 flex flex-col gap-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-primary text-primary-foreground flex items-center justify-center shadow-soft"><s.icon className="h-7 w-7" /></div>
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" />{s.duration}</div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Layers className="h-3.5 w-3.5" />{s.mode}</div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-2xl font-display font-semibold">{s.title}</h2>
                  <span className="shrink-0 inline-flex items-center gap-1 text-xs font-medium text-primary-deep/80 group-hover:gap-2 transition-all mt-1">Read more <ArrowRight className="h-3 w-3" /></span>
                </div>
                <p className="mt-3 text-muted-foreground leading-relaxed">{s.long}</p>
                <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary-deep">Coming soon</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-cosmic p-10 md:p-14 shadow-glow text-center">
            <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/30 blur-3xl pointer-events-none" />
            <div className="relative">
              <p className="text-xs uppercase tracking-[0.22em] text-primary-glow font-medium mb-4">Questions about a service?</p>
              <h2 className="text-3xl md:text-4xl font-display font-semibold text-cosmic-foreground">We're happy to talk before you book.</h2>
              <p className="mt-4 text-cosmic-foreground/70 max-w-xl mx-auto">Reach out by email or phone and we'll point you toward the right service — no pressure, no sales pitch.</p>
              <div className="mt-8 flex flex-wrap gap-4 justify-center">
                <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-2 rounded-full bg-primary/20 border border-primary/30 px-6 py-3 text-sm font-medium text-cosmic-foreground hover:bg-primary/30 transition">
                  <Mail className="h-4 w-4" />{CONTACT.email}
                </a>
                <a href={`tel:${CONTACT.phone}`} className="inline-flex items-center gap-2 rounded-full bg-primary/20 border border-primary/30 px-6 py-3 text-sm font-medium text-cosmic-foreground hover:bg-primary/30 transition">
                  <Phone className="h-4 w-4" />{CONTACT.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/40">
        <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col md:flex-row justify-between gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2.5"><img src={LOGO} alt="" className="h-8 w-8" /><span className="font-display font-semibold text-foreground">Astro<span className="text-primary">View</span></span></div>
          <div className="flex items-center gap-2">
  <MapPin className="h-4 w-4 shrink-0" />
  <span>{CONTACT.footerAddress}</span>
</div>
          <div className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0" /><a href={`mailto:${CONTACT.email}`} className="hover:text-primary transition">{CONTACT.email}</a></div>
          <div className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0" /><a href={`tel:${CONTACT.phone}`} className="hover:text-primary transition">{CONTACT.phone}</a></div>
        </div>
        <div className="border-t border-border/60 px-6 py-4 max-w-7xl mx-auto flex justify-between text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} AstroView. All rights reserved.</p><p>KamleshKhyati Infosolution Pvt. Ltd.</p>
        </div>
      </footer>
    </div>
  );
}
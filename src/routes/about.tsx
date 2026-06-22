import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowRight, Menu, X, ShieldCheck, Eye, Heart, Sparkles, MapPin, Mail, Phone } from "lucide-react";
import LOGO from "@/assets/logo.png";

const CONTACT = {
  email: "support@kamleshkhyatiinfosolution.com",
  phone: "+91-9319843151",
  address: ["Unit No.202, Second Floor, Plot No. 103,", "Block A, Sector 63 Noida,", "Gautam Budh Nagar UP – 201301"],
};

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — AstroView" },
      { name: "description", content: "AstroView is a modern home for Vedic astrology — built by KamleshKhyati Infosolution, designed for seekers who value tradition, honesty, and clarity." },
    ],
  }),
  component: AboutPage,
});

const values = [
  { icon: ShieldCheck, title: "Honesty over impressiveness", text: "We won't dress up uncertainty as prophecy. When astrology can't tell you something definitively, we'll say so. Honest guidance is more valuable than dramatic prediction." },
  { icon: Eye, title: "Transparency in practice", text: "We'll always show our reasoning. Whether it's a Dasha period, a planetary transit, or a Guna Milan score — we explain what it means and why it matters to your situation." },
  { icon: Heart, title: "People, not products", text: "Every person who consults AstroView is a unique individual with a real story. We'll never treat you as a session to close or a query to resolve." },
  { icon: Sparkles, title: "Tradition without rigidity", text: "Vedic astrology is thousands of years old. We respect that lineage deeply. We also believe tradition is best honoured by applying it thoughtfully, not mechanically." },
];

const timeline = [
  { year: "The beginning", text: "KamleshKhyati Infosolution started AstroView with a simple question: why does astrology online feel so transactional? The platforms that existed were loud, ad-heavy, and impersonal. We wanted something different." },
  { year: "The research", text: "We spent time speaking with seekers — people who genuinely used astrology to navigate decisions — and with practising astrologers. The gap between what people needed and what was available was clear." },
  { year: "The build", text: "We began building AstroView from scratch. The brief was simple: slow, private, honest, beautiful. No fake reviews. No manufactured urgency. No pop-ups. Just astrology, done properly." },
  { year: "Coming soon", text: "AstroView is in its final stages before launch. Our first release will include Janam Kundli reports, live call consultations, and chat readings — each built around real astrologers and real care." },
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 16); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll); }, []);
  useEffect(() => { document.body.style.overflow = menuOpen ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [menuOpen]);
  const navLinks = [{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: "Why Us", href: "/#why" }, { label: "Contact", href: "/#contact" }];
  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "backdrop-blur-xl bg-background/80 border-b border-border/50 shadow-[0_1px_12px_oklch(0.58_0.18_42_/_0.08)]" : "backdrop-blur-xl bg-background/70 border-b border-border/50"}`}>
      <div className="mx-auto max-w-7xl px-6 py-3 h-18 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5 shrink-0"><img src={LOGO} alt="AstroView" className="h-10 w-10" /><span className="text-xl font-display font-semibold tracking-tight">Astro<span className="text-primary">View</span></span></a>
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((l) => <a key={l.href} href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l.label}</a>)}
          <a href="/about" className="text-sm text-foreground font-medium">About</a>
        </nav>
        <a href="/services" className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-soft hover:opacity-95 transition">Our services <ArrowRight className="h-4 w-4" /></a>
        <button onClick={() => setMenuOpen(true)} className="md:hidden p-2 text-foreground rounded-lg hover:bg-accent transition"><Menu className="h-5 w-5" /></button>
      </div>
      {menuOpen && <div className="fixed inset-0 z-[60] bg-foreground/40 backdrop-blur-sm md:hidden" onClick={() => setMenuOpen(false)} />}
      <div className={`fixed top-0 right-0 z-[70] h-full w-[280px] bg-background border-l border-border shadow-2xl flex flex-col md:hidden transition-transform duration-300 ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-border"><div className="flex items-center gap-2"><img src={LOGO} alt="" className="h-8 w-8" /><span className="font-display font-semibold text-lg">Astro<span className="text-primary">View</span></span></div><button onClick={() => setMenuOpen(false)} className="p-1.5 rounded-full hover:bg-accent transition"><X className="h-5 w-5" /></button></div>
        <nav className="flex flex-col gap-1 p-4 flex-1">
          {navLinks.map((l) => <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="px-4 py-3.5 rounded-xl text-base font-medium hover:bg-accent transition">{l.label}</a>)}
          <a href="/about" onClick={() => setMenuOpen(false)} className="px-4 py-3.5 rounded-xl text-base font-medium text-primary">About</a>
        </nav>
        <div className="p-5 border-t border-border"><a href="/services" onClick={() => setMenuOpen(false)} className="flex items-center justify-center gap-2 w-full rounded-full bg-gradient-primary px-5 py-3.5 text-sm font-medium text-primary-foreground">Our services <ArrowRight className="h-4 w-4" /></a></div>
      </div>
    </header>
  );
}

function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />

      {/* Hero */}
      <section className="relative isolate overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-hero -z-10" />
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-[700px] h-[500px] -z-10 opacity-40">
          <div className="absolute inset-0 rounded-full border border-primary/15" />
          <div className="absolute inset-16 rounded-full border border-primary/10" />
        </div>
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium">Who we are</p>
          <h1 className="mt-4 font-display font-semibold text-5xl md:text-7xl leading-[1.02] tracking-tight">
            Built slowly.<br /><span className="text-gradient">With intention.</span>
          </h1>
          <p className="mt-7 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            AstroView is a product of KamleshKhyati Infosolution — a technology company based in Noida, India. We build software that tries to make something better than what existed before. AstroView is our attempt to bring that same care to Vedic astrology.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-14 md:py-24">
        <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium">Our mission</p>
            <h2 className="mt-3 text-4xl md:text-5xl font-display font-semibold tracking-tight leading-tight">Astrology that respects the person asking.</h2>
            <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
              Most astrology platforms are built around volume. More users, more sessions, more upsells. The experience of the person asking the question tends to be secondary.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We're building AstroView around a different idea: that the person seeking guidance deserves an experience that feels considered. That their birth chart is treated as their story, not a data point. That an astrologer's time should be spent genuinely helping — not managing a queue.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We don't know if we'll get everything right immediately. But we're committed to building with that intention from the start.
            </p>
          </div>
          <div className="relative">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-cosmic p-10 shadow-glow">
              <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-primary/25 blur-3xl pointer-events-none" />
              <div className="relative space-y-6">
                {[
                  ["Classical Vedic astrology", "Parashari system, Jaimini timing, time-tested methods."],
                  ["Private by design", "Your birth details never leave our hands. No advertising. No data sales."],
                  ["Human astrologers only", "Every reading interpreted by a real person, not an algorithm."],
                ].map(([title, desc]) => (
                  <div key={title} className="flex gap-4">
                    <div className="h-2 w-2 rounded-full bg-primary-glow mt-2 shrink-0" />
                    <div>
                      <p className="font-display font-semibold text-cosmic-foreground">{title}</p>
                      <p className="mt-1 text-sm text-cosmic-foreground/70">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-14 md:py-24 bg-gradient-to-b from-background via-accent/30 to-background">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl mb-14">
            <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium">What we believe</p>
            <h2 className="mt-3 text-4xl md:text-5xl font-display font-semibold tracking-tight">Four values that shape everything.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {values.map((v) => (
              <div key={v.title} className="rounded-3xl border border-border bg-card p-8 shadow-card flex gap-5">
                <div className="shrink-0 h-12 w-12 rounded-2xl bg-gradient-primary text-primary-foreground flex items-center justify-center shadow-soft"><v.icon className="h-5 w-5" /></div>
                <div>
                  <h3 className="text-xl font-display font-semibold">{v.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story / Timeline */}
      <section className="py-14 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="max-w-2xl mb-14">
            <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium">Our story</p>
            <h2 className="mt-3 text-4xl md:text-5xl font-display font-semibold tracking-tight">How AstroView came to be.</h2>
          </div>
          <div className="relative">
            <div className="absolute left-[18px] top-2 bottom-2 w-px bg-border hidden md:block" />
            <div className="space-y-8">
              {timeline.map((t, i) => (
                <div key={i} className="md:flex gap-8 items-start">
                  <div className="hidden md:flex shrink-0 h-9 w-9 rounded-full bg-gradient-primary text-primary-foreground items-center justify-center text-xs font-bold shadow-soft relative z-10">{i + 1}</div>
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-card flex-1">
                    <p className="text-xs uppercase tracking-[0.18em] text-primary font-medium mb-2">{t.year}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Behind AstroView — Company */}
      <section className="py-14 md:py-20 bg-gradient-to-b from-background to-accent/30">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-[2.5rem] border border-border bg-card p-10 md:p-14 shadow-card">
            <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium mb-4">Behind AstroView</p>
            <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight">KamleshKhyati Infosolution Pvt. Ltd.</h2>
            <p className="mt-5 text-muted-foreground leading-relaxed max-w-3xl">
              We're a technology company based in Noida, India. We build digital products across multiple domains — HR management, productivity tools, and now, Vedic astrology. What unites our work is an emphasis on user experience, privacy, and building things that actually help people.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-3xl">
              AstroView is built in-house by our team. We don't outsource the product decisions or the design. Every detail you see — the fonts, the flow, the language — was made here, with intention.
            </p>
            <div className="mt-8 pt-8 border-t border-border grid sm:grid-cols-3 gap-6">
              <div className="flex gap-3 items-start">
                <div className="h-9 w-9 rounded-lg border border-border flex items-center justify-center shrink-0 text-muted-foreground"><MapPin className="h-4 w-4" /></div>
                <div className="text-sm text-muted-foreground">{CONTACT.address.map((l, i) => <span key={i} className="block">{l}</span>)}</div>
              </div>
              <div className="flex gap-3 items-center">
                <div className="h-9 w-9 rounded-lg border border-border flex items-center justify-center shrink-0 text-muted-foreground"><Mail className="h-4 w-4" /></div>
                <a href={`mailto:${CONTACT.email}`} className="text-sm text-muted-foreground hover:text-primary transition">{CONTACT.email}</a>
              </div>
              <div className="flex gap-3 items-center">
                <div className="h-9 w-9 rounded-lg border border-border flex items-center justify-center shrink-0 text-muted-foreground"><Phone className="h-4 w-4" /></div>
                <a href={`tel:${CONTACT.phone}`} className="text-sm text-muted-foreground hover:text-primary transition">{CONTACT.phone}</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight">Ready to explore?</h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">See what we offer and find the service that fits your question.</p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <a href="/services" className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-glow hover:scale-[1.02] transition">Explore our services <ArrowRight className="h-4 w-4" /></a>
            <a href="/#contact" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-7 py-3.5 text-sm font-medium hover:bg-accent transition">Get in touch</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/40">
        <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col md:flex-row justify-between gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2.5"><img src={LOGO} alt="" className="h-8 w-8" /><span className="font-display font-semibold text-foreground">Astro<span className="text-primary">View</span></span></div>
          <div className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0" />{CONTACT.address[1]}</div>
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
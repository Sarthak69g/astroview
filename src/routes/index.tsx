import logoAsset from "@/assets/logo.png";
import { sendContactEmail } from "@/lib/emailjs-config";
import { services as allServices } from "@/data/servicesData";
import { getServiceIcon } from "@/data/serviceIcons";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Mail,
  MapPin,
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

// Six services featured on the homepage — sourced from the single
// source of truth in servicesData.ts so slugs can never drift out of sync.
export const services = allServices.slice(0, 6).map((s) => ({
  slug: s.slug,
  icon: getServiceIcon(s.icon),
  title: s.name,
  text: s.shortDesc,
}));

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
      "Simply fill out the contact form and select the service you're interested in. Our team will review your inquiry and contact you to schedule the consultation."
  },

  {
    question: "What information do I need to provide?",
    answer:
      "Depending on the service, we may require your full name, date of birth, time of birth, and place of birth. Additional details may be requested for more personalized guidance."
  },
  {
  question: "Are consultations available online?",
  answer:
    "Yes. AstroView offers online consultations, allowing you to connect from anywhere through convenient digital communication channels."
},

{
  question: "How long does a consultation usually take?",
  answer:
    "Consultation duration varies depending on the service selected. Most sessions typically range between 30 and 60 minutes."
},

  {
    question: "Will my personal information remain confidential?",
    answer:
      "Absolutely. We respect your privacy and handle all personal information and consultation discussions with strict confidentiality."
  },

  {
    question: "Can astrology guarantee specific outcomes?",
    answer:
      "No. Astrology is intended to provide guidance, insights, and perspectives. Personal decisions and actions ultimately shape individual outcomes."
  }
];

// ─── Root component ───────────────────────────────────────────────────────────

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <style>{`html { scroll-padding-top: 80px; scroll-behavior: smooth; }`}</style>
      
<Hero />
{/* <TrustStrip /> — disabled for now, content not finalized */}
<SunSignFinder />
<Services />
<Why />
<Values />
<Promise />
<Journey />
<Contact />
<FAQ />
    </div>
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
              href="/services"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3.5 text-sm font-medium text-primary-foreground shadow-glow hover:scale-[1.02] transition"
            >
              Explore our services <ArrowRight className="h-4 w-4" />
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

        {/* Right — floating logo orb (desktop) */}
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
                src={logoAsset}
                alt="AstroView emblem"
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

        {/* Mobile-only: compact logo orb */}
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
          style={{ top: s.top, left: s.left, width: s.size, height: s.size, animationDelay: s.delay }}
        />
      ))}
    </div>
  );
}

// ─── Trust strip ──────────────────────────────────────────────────────────────

function TrustStrip() {
  const items = ["Vedic · Parashari", "Jaimini timing", "Private & ad-free", "Human astrologers", "Hindi · English"];
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
    <section id="services" className="relative pt-14 pb-16 md:pt-20 md:pb-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium">
            What we offer
          </p>
          <h2 className="mt-3 text-4xl md:text-5xl font-display font-semibold tracking-tight">
            Six ways to meet your chart.
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            A focused set of services — each shaped with care. Click any to learn more.
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => (
            <a
              key={s.title}
              href={`/services/${s.slug}`}
              className="group relative rounded-3xl border border-border bg-card p-7 shadow-card hover:shadow-glow hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition" />
              <div className="h-12 w-12 rounded-2xl bg-gradient-primary text-primary-foreground flex items-center justify-center shadow-soft">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-xl font-display font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.text}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-primary-deep/80 group-hover:gap-2 transition-all">
                Learn more <ArrowRight className="h-3 w-3" />
              </span>
            </a>
          ))}
        </div>

        <div className="mt-6 text-center">
          <a
            href="/services"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium hover:bg-accent transition"
          >
            View all services <ArrowRight className="h-4 w-4" />
          </a>
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
  className="relative pt-4 pb-14 md:pt-8 md:pb-20"
>
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
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
              {["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"].map((g, i) => {
                const a = (i * Math.PI) / 6 - Math.PI / 12;
                return (
                  <text key={i} x={Number((200 + Math.cos(a) * 160).toFixed(2))} y={Number((200 + Math.sin(a) * 160).toFixed(2))}
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
      </div>
    </section>
  );
}

function Values() {
  const values = [
    {
      title: "Human Interpretation",
      text: "Every reading is reviewed by a real astrologer, not generated automatically.",
    },
    {
      title: "Privacy First",
      text: "Your birth details and consultations remain confidential and treated with care.",
    },
    {
      title: "Traditional Foundation",
      text: "Built on classical Vedic principles rather than trend-driven astrology.",
    },
    {
      title: "No Fear-Based Selling",
      text: "We explain possibilities honestly without creating anxiety or pressure.",
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium">
            Why People Choose AstroView
          </p>

          <h2 className="mt-3 text-4xl md:text-5xl font-display font-semibold tracking-tight">
            Built on principles, not persuasion.
          </h2>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-5">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-3xl border border-border bg-card p-7 shadow-card"
            >
              <h3 className="text-xl font-display font-semibold">
                {value.title}
              </h3>

              <p className="mt-3 text-muted-foreground leading-relaxed">
                {value.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Journey ──────────────────────────────────────────────────────────────────

function Journey() {
  return (
    <section id="journey" className="py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium">
            How it will work
          </p>
          <h2 className="mt-3 text-4xl md:text-5xl font-display font-semibold tracking-tight">
            From your birth moment to a clear next step.
          </h2>
        </div>

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
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
    <section className="pt-10 pb-10 md:pt-14 md:pb-14">
      <div className="mx-auto max-w-5xl px-6">
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
   if (!formData.from_name.trim()) {
  toast.error("Please enter your name");
  return;
}

const nameRegex = /^[A-Za-z\s]{2,50}$/;

if (!nameRegex.test(formData.from_name.trim())) {
  toast.error("Please enter a valid name");
  return;
}

if (!formData.from_email.trim()) {
  toast.error("Please enter your email");
  return;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(formData.from_email)) {
  toast.error("Please enter a valid email address");
  return;
}

if (!formData.phone.trim()) {
  toast.error("Please enter your phone number");
  return;
}

const phoneRegex = /^[6-9]\d{9}$/;
if (!phoneRegex.test(formData.phone)) {
  toast.error("Please enter a valid 10-digit phone number");
  return;
}

if (!formData.service.trim()) {
  toast.error("Please select a service");
  return;
}

if (!formData.message.trim()) {
  toast.error("Please enter your message");
  return;
}

if (formData.message.trim().length < 10) {
  toast.error("Message must be at least 10 characters long");
  return;
}

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

      toast.success(
        "Inquiry submitted successfully. Our team will contact you within 24 hours."
      );

      setFormData({
        from_name: "",
        from_email: "",
        phone: "",
        service: "",
        message: "",
      });
    } catch (error) {
      console.error("EmailJS Error:", error);

      toast.error(
        "Unable to submit your inquiry. Please try again in a few moments."
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <section
  id="contact"
  className="pt-8 pb-20 md:pt-12 md:pb-28 bg-gradient-to-b from-background to-accent/30"
>
      <div className="mx-auto max-w-7xl px-6">
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

        <div className="grid lg:grid-cols-[360px_1fr] gap-6 lg:gap-8">
          {/* LEFT COLUMN */}

          <div className="space-y-5">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
              <div className="flex gap-4">
                <MapPin className="h-5 w-5 text-primary mt-1" />

                <div>
                  <h3 className="font-display text-lg font-semibold">
                    Visit Our Office
                  </h3>

                  <div className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {CONTACT.address.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
              <div className="flex gap-4">
                <Phone className="h-5 w-5 text-primary mt-1" />

                <div>
                  <h3 className="font-display text-lg font-semibold">
                    Call Us
                  </h3>

                  <a
                    href={`tel:${CONTACT.phone}`}
                    className="mt-2 block text-muted-foreground hover:text-primary transition"
                  >
                    {CONTACT.phone}
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
              <div className="flex gap-4">
                <Mail className="h-5 w-5 text-primary mt-1" />

                <div>
                  <h3 className="font-display text-lg font-semibold">
                    Email Us
                  </h3>

                  <a
  href={`mailto:${CONTACT.email}`}
  className="mt-2 block break-all text-muted-foreground hover:text-primary transition"
>
  {CONTACT.email}
</a>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
              <h3 className="font-display text-lg font-semibold">
                Availability
              </h3>

              <p className="mt-3 text-sm text-muted-foreground">
                Monday – Saturday
              </p>

              <p className="text-sm text-muted-foreground">
                10:00 AM – 7:00 PM
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN */}

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

  setFormData({
    ...formData,
    from_name: value,
  });
}}
  placeholder="Full Name"
  required
  className="w-full h-14 rounded-xl border border-border bg-background px-4 outline-none focus:border-primary"
/>

              <input
               disabled={loading}
  type="email"
  name="from_email"
  value={formData.from_email}
  onChange={handleChange}
  placeholder="Email Address"
  required
                className=" w-full h-14 rounded-xl border border-border bg-background px-4 outline-none focus:border-primary"
              />

              <input
               disabled={loading}
  type="tel"
  name="phone"
  value={formData.phone}
  onChange={(e) => {
  const value = e.target.value.replace(/\D/g, "");

  setFormData({
    ...formData,
    phone: value,
  });
}}
  placeholder="Phone Number"
  required
                className=" w-full h-14 rounded-xl border border-border bg-background px-4 outline-none focus:border-primary"
              />

              <select
  name="service"
  value={formData.service}
  onChange={handleChange}
  className=" w-full h-14 rounded-xl border border-border bg-background px-4 outline-none focus:border-primary"
>
                <option value="">Select Service</option>

                {allServices.map((service) => (
                  <option
  key={service.slug}
  value={service.name}
>
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
              className="mt-6 w-full rounded-xl border border-border bg-background p-4 outline-none focus:border-primary"
            />

            <button
  type="submit"
  disabled={loading}
  className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-soft hover:opacity-95 transition"
>
  {loading ? (
    <>
      Sending Inquiry...
    </>
  ) : (
    <>
      Send Message
      <ArrowRight className="h-4 w-4" />
    </>
  )}
</button>
          </form>
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
  key={f.question}
  q={f.question}
  a={f.answer}
  isOpen={openIdx === i}
  onToggle={() => setOpenIdx(openIdx === i ? null : i)}
/>
          ))}
        </div>
      </div>
    </section>
  );
}
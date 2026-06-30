import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Eye, Heart, Sparkles, MapPin, Mail, Phone } from "lucide-react";

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

function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <AboutHero />
      <WhyExist />
      <Beliefs />
      <HowWeWork />
      <WhatBuilding />
      <CompanySection />
      <ClosingStatement />
    </div>
  );
}

function AboutHero() {
  return (
    <section className="relative overflow-hidden py-24 md:py-36 bg-gradient-hero">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-primary font-medium">
          Who We Are
        </p>

        <h1 className="mt-6 font-display text-5xl md:text-7xl font-semibold leading-none">
          Built slowly.
          <br />
          <span className="text-gradient">Built carefully.</span>
        </h1>

        <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          AstroView was created because seeking guidance online had started to
          feel loud. We wanted to build something quieter, more thoughtful and
          rooted in genuine human conversation.
        </p>

        <div className="mt-12 grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {[
            "Classical Vedic Methods",
            "Human Astrologers",
            "Privacy First",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-border bg-card/70 backdrop-blur p-5"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


function WhyExist() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-4xl px-6">
        <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium">
          Why AstroView Exists
        </p>

        <h2 className="mt-4 text-4xl md:text-5xl font-display font-semibold">
          A different idea.
        </h2>

        <div className="mt-10 space-y-6 text-lg text-muted-foreground leading-relaxed">
          <p>
            The modern internet is very good at capturing attention.
            It is less good at creating trust.
          </p>

          <p>
            Many astrology platforms are designed around urgency,
            transactions and volume.
          </p>

          <blockquote className="border-l-2 border-primary pl-6 text-foreground font-medium text-xl">
            “What would astrology feel like if it were designed around the
            person seeking guidance rather than the platform providing it?”
          </blockquote>

          <p>
            That question became AstroView.
          </p>
        </div>
      </div>
    </section>
  );
}

function Beliefs() {
  const beliefs = [
    {
      title: "Honesty before certainty",
      text: "If astrology cannot answer something clearly, we believe it is better to say so than invent confidence."
    },
    {
      title: "People before products",
      text: "Every consultation represents a real person navigating real decisions."
    },
    {
      title: "Tradition before trends",
      text: "Our work is rooted in classical Vedic principles."
    },
    {
      title: "Clarity before complexity",
      text: "Insights should be understandable, useful and grounded."
    }
  ];

  return (
    <section className="py-24 bg-accent/20">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium">
          What We Believe
        </p>

        <h2 className="mt-4 text-4xl md:text-5xl font-display font-semibold">
          Principles that guide every decision.
        </h2>

        <div className="mt-14 grid md:grid-cols-2 gap-6">
          {beliefs.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-border bg-card p-8 shadow-card hover:-translate-y-1 hover:shadow-glow transition-all duration-300"
            >
              <h3 className="font-display text-2xl font-semibold">
                {item.title}
              </h3>

              <p className="mt-4 text-muted-foreground leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


function HowWeWork() {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-6">
        <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium">
          How We Work
        </p>

        <h2 className="mt-4 text-4xl md:text-5xl font-display font-semibold">
          Listen first.
        </h2>

        <div className="mt-10 space-y-6 text-lg text-muted-foreground leading-relaxed">
          <p>
            Every reading begins with understanding the person before
            interpreting the chart.
          </p>

          <p>
            Astrology can reveal possibilities.
            Conversation provides context.
          </p>

          <p>
            We believe both matter.
          </p>
        </div>
      </div>
    </section>
  );
}

function WhatBuilding() {
  return (
    <section className="py-16 md:py-20 bg-accent/20">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium">
          What We Are Building
        </p>

        <h2 className="mt-4 text-4xl md:text-5xl font-display font-semibold">
          Trust over attention.
        </h2>

        <p className="mt-8 text-lg text-muted-foreground leading-relaxed">
          Our goal is not to become the loudest astrology platform.
          Our goal is to become one of the most trusted.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
  {[
    "Human Guidance",
    "Privacy First",
    "No Fear-Based Selling",
    "Transparent Consultations",
  ].map((item) => (
    <div
      key={item}
      className="rounded-full border border-border bg-card px-4 py-2 text-sm"
    >
      {item}
    </div>
  ))}
</div>
      </div>
    </section>
  );
}
function CompanySection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium">
          Built By
        </p>

        <h2 className="mt-4 text-4xl font-display font-semibold">
          KamleshKhyati Infosolution Pvt. Ltd.
        </h2>

        <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
          AstroView is built by a technology company based in Noida, India.
          Every detail of the experience has been designed and developed
          in-house with a focus on usability, trust and clarity.
        </p>
      </div>
    </section>
  );
}

function ClosingStatement() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="rounded-[2.5rem] bg-gradient-cosmic p-10 md:p-16 shadow-glow">

          <p className="text-3xl md:text-5xl font-display text-cosmic-foreground leading-snug">
            “We don't claim to have all the answers.
            We simply believe that honest guidance,
            delivered with care, can help people
            see their path more clearly.”
          </p>

          <p className="mt-8 text-cosmic-foreground/70">
            — The AstroView Team
          </p>

        </div>
      </div>
    </section>
  );
}

<div className="mt-10 grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
  {[
    "Classical Vedic Methods",
    "Human Astrologers",
    "Privacy First",
  ].map((item) => (
    <div
      key={item}
      className="rounded-2xl border border-border bg-card/60 backdrop-blur px-5 py-4 text-sm font-medium"
    >
      {item}
    </div>
  ))}
</div>

// src/routes/services/Services.tsx
// Import path: ../../data/servicesData  (routes/services → src/data)
import { createFileRoute, Link } from "@tanstack/react-router";
import { services, type Service, type DeliveryMode } from "../../data/servicesData";
import { getServiceIcon } from "../../data/serviceIcons";
import { ArrowUpRight, Clock } from "lucide-react";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Our Services — AstroView" },
      {
        name: "description",
        content:
          "Explore AstroView's Vedic astrology services — birth chart analysis, relationship guidance, career consultations, and spiritual remedies, each led by an experienced astrologer.",
      },
      { property: "og:title", content: "Our Services — AstroView" },
      {
        property: "og:description",
        content:
          "Explore AstroView's Vedic astrology services — birth chart analysis, relationship guidance, career consultations, and spiritual remedies, each led by an experienced astrologer.",
      },
      { name: "twitter:title", content: "Our Services — AstroView" },
      {
        name: "twitter:description",
        content:
          "Explore AstroView's Vedic astrology services — birth chart analysis, relationship guidance, career consultations, and spiritual remedies, each led by an experienced astrologer.",
      },
    ],
  }),
  component: ServicesPage,
});

const deliveryColours: Record<DeliveryMode, string> = {
  Call: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  Chat: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  Report: "bg-primary/10 text-primary-deep border-primary/20",
};

function ServicesPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Page hero */}
      <section className="relative overflow-hidden px-6 pt-36 md:pt-40 pb-20">
        {/* Soft background glow */}
        <div className="absolute inset-0 -z-10 bg-gradient-hero" />

        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium mb-5">
            Our Services
          </p>

          <h1 className="font-display text-5xl md:text-7xl font-semibold tracking-tight text-foreground leading-tight">
            Find the guidance
            <br />
            that's right for you.
          </h1>

          <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            From birth chart analysis and relationship guidance to career
            consultations and spiritual remedies, every session is conducted
            by an experienced astrologer and tailored to your unique journey.
          </p>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {[
              "Experienced Astrologers",
              "Private Consultations",
              "Personalised Guidance",
            ].map((label) => (
              <span
                key={label}
                className="rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary-deep transition-all duration-300 hover:-translate-y-1 hover:shadow-card cursor-default"
              >
                ✓ {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service: Service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-accent/30 border-t border-border px-6 py-16 text-center">
        <p className="text-muted-foreground text-sm mb-2">Not sure which service fits?</p>
        <h2 className="font-display text-2xl font-semibold text-foreground mb-5">
          We are happy to talk before you book.
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm leading-relaxed">
          Reach out by email or phone and we will point you toward the right
          service — no pressure, no sales pitch.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:support@kamleshkhyatiinfosolution.com"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card text-foreground text-sm hover:bg-accent transition-all"
          >
            support@kamleshkhyatiinfosolution.com
          </a>
          <a
            href="tel:+919319843151"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-primary text-primary-foreground text-sm hover:opacity-95 transition-all"
          >
            +91-9319843151
          </a>
        </div>
      </section>
    </main>
  );
}

function ServiceCard({ service }: { service: Service }) {
  const featured = service.slug === "birth-chart-analysis";
  const Icon = getServiceIcon(service.icon);

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-3xl bg-card shadow-card transition-all duration-300 hover:-translate-y-2 hover:shadow-glow ${
        featured
          ? "border border-primary/30 ring-1 ring-primary/10"
          : "border border-border hover:border-primary/30"
      }`}
    >
      {featured && (
        <div className="absolute top-3 right-4 z-20 rounded-full bg-gradient-primary px-3 py-1 text-[8px] font-semibold uppercase tracking-[0.15em] text-primary-foreground shadow-soft">
          Most Popular
        </div>
      )}
      {/* Top accent strip on hover */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex flex-col flex-1 p-7">
        {/* Icon + duration */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary-deep" />
          </div>

          <span className="flex items-center text-sm text-muted-foreground font-medium pt-1">
            <Clock className="h-3.5 w-3.5 mr-1" />
            {service.duration}
          </span>
        </div>

        {/* Name + tagline */}
        <h2 className="font-display text-2xl font-semibold text-foreground mb-2 leading-snug">
          {service.name}
        </h2>
        <p className="text-sm text-primary-deep font-medium mb-3 italic tracking-wide">
          {service.tagline}
        </p>

        {/* Short description */}
        <p className="text-muted-foreground text-[15px] leading-relaxed mb-5 flex-1">
          {service.shortDesc}
        </p>

        {/* Delivery badges */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {service.deliveryModes.map((mode: DeliveryMode) => (
            <span
              key={mode}
              className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${deliveryColours[mode]}`}
            >
              {mode}
            </span>
          ))}
        </div>

        <Link
          to="/services/$slug"
          params={{ slug: service.slug }}
          className="mt-auto block group/link"
        >
          <div className="flex items-center justify-between border-t border-border pt-5">
            <span className="text-sm font-semibold text-foreground transition-colors group-hover/link:text-primary-deep">
              Explore service →
            </span>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 group-hover/link:text-primary-deep" />
          </div>
        </Link>
      </div>
    </article>
  );
}
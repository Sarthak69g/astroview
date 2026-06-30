// src/routes/services/ServiceDetail.tsx
// Import path: ../../data/servicesData  (routes/services → src/data)

import {
  createFileRoute,
  Link,
  useParams,
  notFound,
} from "@tanstack/react-router";
import { getServiceBySlug, getOtherServices, type Service, type ServiceFAQ, type DeliveryMode } from "../../data/servicesData";
import { getServiceIcon } from "../../data/serviceIcons";
import { useState } from "react";
import {
  ChevronRight,
  Clock,
  Smartphone,
  Tag,
  Check,
  User,
  Plus,
  Mail,
  Phone,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/services/$slug")({
  head: ({ params }) => {
    const service = getServiceBySlug(params.slug);

    if (!service) {
      return {
        meta: [
          { title: "Service not found — AstroView" },
          { name: "description", content: "This service couldn't be found. Browse all AstroView services instead." },
        ],
      };
    }

    const title = `${service.name} — AstroView`;
    const description = service.shortDesc;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
    };
  },
  component: ServiceDetailPage,
});

const deliveryColours: Record<DeliveryMode, string> = {
  Call: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  Chat: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  Report: "bg-primary/10 text-primary-deep border-primary/20",
};

function ServiceDetailPage() {
  const { slug } = useParams({ strict: false }) as { slug: string };
  const service = getServiceBySlug(slug);

  if (!service) throw notFound();

  const others = getOtherServices(slug, 3);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const Icon = getServiceIcon(service.icon);

  return (
    <main className="min-h-screen bg-background text-foreground">

      {/* Breadcrumb */}
      <nav className="max-w-5xl mx-auto px-6 pt-28 pb-0">
        <ol className="flex items-center gap-2 text-xs text-muted-foreground">
          <li><Link to="/" className="hover:text-foreground transition-colors">Home</Link></li>
          <li><ChevronRight className="h-3 w-3 text-muted-foreground/50" aria-hidden="true" /></li>
          <li><Link to="/services" className="hover:text-foreground transition-colors">Services</Link></li>
          <li><ChevronRight className="h-3 w-3 text-muted-foreground/50" aria-hidden="true" /></li>
          <li className="text-foreground capitalize">{service.name}</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-10 pb-14 grid md:grid-cols-5 gap-10">

        {/* Left — main content */}
        <div className="md:col-span-3">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon className="h-5 w-5 text-primary-deep" aria-hidden="true" />
            </div>
            <p className="text-xs tracking-[0.16em] uppercase text-primary font-medium">Service</p>
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-3 leading-tight">
            {service.name}
          </h1>
          <p className="text-primary-deep italic text-lg mb-6">{service.tagline}</p>
          <p className="text-muted-foreground text-base leading-relaxed mb-6">{service.heroDesc}</p>

          <div className="flex flex-wrap gap-2">
            {service.deliveryModes.map((mode: DeliveryMode) => (
              <span key={mode} className={`text-xs px-3 py-1 rounded-full border font-medium ${deliveryColours[mode]}`}>
                Available via {mode}
              </span>
            ))}
          </div>
        </div>

        {/* Right — sticky info card */}
        <aside className="md:col-span-2">
          <div className="sticky top-24 bg-card border border-border rounded-2xl p-6 shadow-card">
            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-4">Quick info</p>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-muted-foreground mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="text-sm text-foreground font-medium">{service.duration}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Smartphone className="h-4 w-4 text-muted-foreground mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-xs text-muted-foreground">Available via</p>
                  <p className="text-sm text-foreground font-medium">{service.deliveryModes.join(" · ")}</p>
                </div>
              </div>
              {service.startingFrom && (
                <div className="flex items-start gap-3">
                  <Tag className="h-4 w-4 text-muted-foreground mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-xs text-muted-foreground">Starting from</p>
                    <p className="text-sm text-foreground font-medium">{service.startingFrom}</p>
                  </div>
                </div>
              )}
            </div>

            <a href="/#contact" className="block w-full text-center bg-gradient-primary hover:opacity-95 text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-full transition-colors mb-3 shadow-soft">
              Get in touch
            </a>
            <a href="tel:+919319843151" className="block w-full text-center border border-border hover:bg-accent text-foreground text-sm font-medium px-5 py-2.5 rounded-full transition-colors">
              +91-9319843151
            </a>
            <p className="text-xs text-muted-foreground text-center mt-4">No pressure. Happy to answer questions first.</p>
          </div>
        </aside>
      </section>

      <div className="max-w-5xl mx-auto px-6"><div className="border-t border-border" /></div>

      {/* What you get + Who is it for */}
      <section className="max-w-5xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-12">
        <div>
          <p className="text-xs tracking-[0.16em] uppercase text-primary font-medium mb-3">What's included</p>
          <h2 className="font-display text-2xl font-semibold text-foreground mb-6">What you walk away with.</h2>
          <ul className="space-y-3">
            {service.whatYouGet.map((item: string, i: number) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1 w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Check className="h-2.5 w-2.5 text-primary-deep" aria-hidden="true" />
                </span>
                <span className="text-muted-foreground text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs tracking-[0.16em] uppercase text-primary font-medium mb-3">Who is it for</p>
          <h2 className="font-display text-2xl font-semibold text-foreground mb-6">Is this right for you?</h2>
          <ul className="space-y-3">
            {service.whoIsItFor.map((item: string, i: number) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1 w-4 h-4 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                  <User className="h-2.5 w-2.5 text-muted-foreground" aria-hidden="true" />
                </span>
                <span className="text-muted-foreground text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-accent/30 border-y border-border py-14">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs tracking-[0.16em] uppercase text-primary font-medium mb-3">How it works</p>
          <h2 className="font-display text-2xl font-semibold text-foreground mb-10">What to expect.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.whatToExpect.map((step: { step: string; description: string }, i: number) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5 shadow-card">
                <span className="inline-block text-xs font-semibold text-primary-deep bg-primary/10 px-2.5 py-0.5 rounded-full mb-3">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-medium text-foreground text-sm mb-2">{step.step}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ accordion */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <p className="text-xs tracking-[0.16em] uppercase text-primary font-medium mb-3">Questions</p>
        <h2 className="font-display text-2xl font-semibold text-foreground mb-8">What you might be wondering.</h2>
        <div className="divide-y divide-border max-w-2xl">
          {service.faqs.map((faq: ServiceFAQ, i: number) => (
            <div key={i} className="py-4">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-start justify-between gap-4 text-left group"
                aria-expanded={openFaq === i}
              >
                <span className="text-foreground text-sm font-medium group-hover:text-primary-deep transition-colors">
                  {faq.question}
                </span>
                <Plus
                  className={`h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5 transition-transform duration-200 ${openFaq === i ? "rotate-45 text-primary-deep" : ""}`}
                  aria-hidden="true"
                />
              </button>
              {openFaq === i && (
                <p className="mt-3 text-muted-foreground text-sm leading-relaxed pr-8">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Dark CTA banner */}
      <section className="bg-gradient-cosmic py-14 px-6 text-center">
        <h2 className="font-display text-3xl font-semibold text-cosmic-foreground mb-3">Ready to begin?</h2>
        <p className="text-cosmic-foreground/70 text-sm mb-7 max-w-md mx-auto leading-relaxed">
          Reach out and we will confirm the right format, answer any questions, and schedule your session.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="mailto:support@kamleshkhyatiinfosolution.com" className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-gradient-primary hover:opacity-95 text-primary-foreground text-sm font-semibold transition-colors">
            <Mail className="h-4 w-4" aria-hidden="true" />
            support@kamleshkhyatiinfosolution.com
          </a>
          <a href="tel:+919319843151" className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-cosmic-foreground/20 hover:border-cosmic-foreground/40 text-cosmic-foreground/80 text-sm font-medium transition-colors">
            <Phone className="h-4 w-4" aria-hidden="true" />
            +91-9319843151
          </a>
        </div>
      </section>

      {/* Other services */}
      {others.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-14">
          <p className="text-xs tracking-[0.16em] uppercase text-primary font-medium mb-3">Explore</p>
          <h2 className="font-display text-2xl font-semibold text-foreground mb-8">Other services.</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {others.map((s: Service) => {
              const OtherIcon = getServiceIcon(s.icon);
              return (
                <Link
                  key={s.slug}
                  to="/services/$slug"
                  params={{ slug: s.slug }}
                  className="group flex flex-col bg-card border border-border rounded-xl p-5 hover:border-primary/30 hover:shadow-card transition-all"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <OtherIcon className="h-4 w-4 text-primary-deep" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-1">{s.name}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed flex-1">{s.shortDesc}</p>
                  <div className="flex items-center gap-1 mt-3 text-xs text-primary-deep font-medium group-hover:gap-2 transition-all">
                    Learn more
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="mt-8 text-center">
            <Link to="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              View all services →
            </Link>
          </div>
        </section>
      )}

    </main>
  );
}
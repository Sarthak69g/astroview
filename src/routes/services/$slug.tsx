// src/routes/services/ServiceDetail.tsx
// Import path: ../../data/servicesData  (routes/services → src/data)

import {
  createFileRoute,
  Link,
  useParams,
  notFound,
} from "@tanstack/react-router";
import { getServiceBySlug, getOtherServices, type Service, type ServiceFAQ, type DeliveryMode } from "../../data/servicesData";
import { useState } from "react";

export const Route = createFileRoute("/services/$slug")({
  component: ServiceDetailPage,
});

const deliveryColours: Record<DeliveryMode, string> = {
  Call: "bg-blue-50 text-blue-700 border-blue-200",
  Chat: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Report: "bg-amber-50 text-amber-700 border-amber-200",
};

function ServiceDetailPage() {
  const { slug } = useParams({ strict: false }) as { slug: string };
  const service = getServiceBySlug(slug);

  if (!service) throw notFound();

  const others = getOtherServices(slug, 3);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-white">

      {/* Breadcrumb */}
      <nav className="max-w-5xl mx-auto px-6 pt-6 pb-0">
        <ol className="flex items-center gap-2 text-xs text-stone-400">
          <li><Link to="/" className="hover:text-stone-600 transition-colors">Home</Link></li>
          <li><i className="ti ti-chevron-right text-stone-300 text-xs" aria-hidden="true" /></li>
          <li><Link to="/services" className="hover:text-stone-600 transition-colors">Services</Link></li>
          <li><i className="ti ti-chevron-right text-stone-300 text-xs" aria-hidden="true" /></li>
          <li className="text-stone-600 capitalize">{service.name}</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-10 pb-14 grid md:grid-cols-5 gap-10">

        {/* Left — main content */}
        <div className="md:col-span-3">
          <div className="flex items-center gap-3 mb-5">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${service.accentColor}`}>
              <i className={`ti ti-${service.icon} text-xl ${service.textColor}`} aria-hidden="true" />
            </div>
            <p className="text-xs tracking-[0.16em] uppercase text-amber-600 font-medium">Service</p>
          </div>

          <h1 className="font-cormorant text-4xl md:text-5xl font-semibold text-stone-900 mb-3 leading-tight">
            {service.name}
          </h1>
          <p className="text-amber-600 italic text-lg mb-6">{service.tagline}</p>
          <p className="text-stone-600 text-base leading-relaxed mb-6">{service.heroDesc}</p>

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
          <div className="sticky top-6 bg-stone-50 border border-stone-200 rounded-2xl p-6">
            <p className="text-xs tracking-widest uppercase text-stone-400 mb-4">Quick info</p>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <i className="ti ti-clock text-stone-400 mt-0.5 text-base" aria-hidden="true" />
                <div>
                  <p className="text-xs text-stone-400">Duration</p>
                  <p className="text-sm text-stone-700 font-medium">{service.duration}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <i className="ti ti-device-mobile text-stone-400 mt-0.5 text-base" aria-hidden="true" />
                <div>
                  <p className="text-xs text-stone-400">Available via</p>
                  <p className="text-sm text-stone-700 font-medium">{service.deliveryModes.join(" · ")}</p>
                </div>
              </div>
              {service.startingFrom && (
                <div className="flex items-start gap-3">
                  <i className="ti ti-tag text-stone-400 mt-0.5 text-base" aria-hidden="true" />
                  <div>
                    <p className="text-xs text-stone-400">Starting from</p>
                    <p className="text-sm text-stone-700 font-medium">{service.startingFrom}</p>
                  </div>
                </div>
              )}
            </div>

            <a href="#contact" className="block w-full text-center bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors mb-3">
              Get in touch
            </a>
            <a href="tel:+919319843151" className="block w-full text-center border border-stone-300 hover:border-stone-400 text-stone-700 text-sm font-medium px-5 py-2.5 rounded-full transition-colors">
              +91-9319843151
            </a>
            <p className="text-xs text-stone-400 text-center mt-4">No pressure. Happy to answer questions first.</p>
          </div>
        </aside>
      </section>

      <div className="max-w-5xl mx-auto px-6"><div className="border-t border-stone-100" /></div>

      {/* What you get + Who is it for */}
      <section className="max-w-5xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-12">
        <div>
          <p className="text-xs tracking-[0.16em] uppercase text-amber-600 font-medium mb-3">What's included</p>
          <h2 className="font-cormorant text-2xl font-semibold text-stone-900 mb-6">What you walk away with.</h2>
          <ul className="space-y-3">
            {service.whatYouGet.map((item: string, i: number) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1 w-4 h-4 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <i className="ti ti-check text-amber-700 text-xs" aria-hidden="true" />
                </span>
                <span className="text-stone-600 text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs tracking-[0.16em] uppercase text-amber-600 font-medium mb-3">Who is it for</p>
          <h2 className="font-cormorant text-2xl font-semibold text-stone-900 mb-6">Is this right for you?</h2>
          <ul className="space-y-3">
            {service.whoIsItFor.map((item: string, i: number) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1 w-4 h-4 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0">
                  <i className="ti ti-user text-stone-500 text-xs" aria-hidden="true" />
                </span>
                <span className="text-stone-600 text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-stone-50 border-y border-stone-100 py-14">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs tracking-[0.16em] uppercase text-amber-600 font-medium mb-3">How it works</p>
          <h2 className="font-cormorant text-2xl font-semibold text-stone-900 mb-10">What to expect.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.whatToExpect.map((step: { step: string; description: string }, i: number) => (
              <div key={i} className="bg-white border border-stone-200 rounded-xl p-5">
                <span className="inline-block text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full mb-3">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-medium text-stone-900 text-sm mb-2">{step.step}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ accordion */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        <p className="text-xs tracking-[0.16em] uppercase text-amber-600 font-medium mb-3">Questions</p>
        <h2 className="font-cormorant text-2xl font-semibold text-stone-900 mb-8">What you might be wondering.</h2>
        <div className="divide-y divide-stone-100 max-w-2xl">
          {service.faqs.map((faq: ServiceFAQ, i: number) => (
            <div key={i} className="py-4">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-start justify-between gap-4 text-left group"
                aria-expanded={openFaq === i}
              >
                <span className="text-stone-800 text-sm font-medium group-hover:text-amber-700 transition-colors">
                  {faq.question}
                </span>
                <i
                  className={`ti ti-plus text-stone-400 text-sm mt-0.5 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-45 text-amber-600" : ""}`}
                  aria-hidden="true"
                />
              </button>
              {openFaq === i && (
                <p className="mt-3 text-stone-500 text-sm leading-relaxed pr-8">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Dark CTA banner */}
      <section className="bg-stone-900 py-14 px-6 text-center">
        <h2 className="font-cormorant text-3xl font-semibold text-white mb-3">Ready to begin?</h2>
        <p className="text-stone-400 text-sm mb-7 max-w-md mx-auto leading-relaxed">
          Reach out and we will confirm the right format, answer any questions, and schedule your session.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="mailto:hello@astroview.app" className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-900 text-sm font-semibold transition-colors">
            <i className="ti ti-mail text-base" aria-hidden="true" />
            hello@astroview.app
          </a>
          <a href="tel:+919319843151" className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-stone-600 hover:border-stone-400 text-stone-300 text-sm font-medium transition-colors">
            <i className="ti ti-phone text-base" aria-hidden="true" />
            +91-9319843151
          </a>
        </div>
      </section>

      {/* Other services */}
      {others.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-14">
          <p className="text-xs tracking-[0.16em] uppercase text-amber-600 font-medium mb-3">Explore</p>
          <h2 className="font-cormorant text-2xl font-semibold text-stone-900 mb-8">Other services.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {others.map((s: Service) => (
              <Link
                key={s.slug}
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="group flex flex-col bg-white border border-stone-200 rounded-xl p-5 hover:border-stone-300 hover:shadow-sm transition-all"
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${s.accentColor}`}>
                  <i className={`ti ti-${s.icon} text-base ${s.textColor}`} aria-hidden="true" />
                </div>
                <h3 className="font-cormorant text-lg font-semibold text-stone-900 mb-1">{s.name}</h3>
                <p className="text-stone-500 text-xs leading-relaxed flex-1">{s.shortDesc}</p>
                <div className="flex items-center gap-1 mt-3 text-xs text-amber-600 font-medium group-hover:gap-2 transition-all">
                  Learn more
                  <i className="ti ti-arrow-right text-xs" aria-hidden="true" />
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/services" className="text-sm text-stone-500 hover:text-stone-800 transition-colors">
              View all services →
            </Link>
          </div>
        </section>
      )}

    </main>
  );
}
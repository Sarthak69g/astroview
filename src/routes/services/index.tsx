// src/routes/services/Services.tsx
// Import path: ../../data/servicesData  (routes/services → src/data)
import { createFileRoute, Link } from "@tanstack/react-router";
import { services, type Service, type DeliveryMode } from "../../data/servicesData";
export const Route = createFileRoute("/services/")({
  component: ServicesPage,
});

const deliveryColours: Record<DeliveryMode, string> = {
  Call: "bg-blue-50 text-blue-700 border-blue-200",
  Chat: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Report: "bg-amber-50 text-amber-700 border-amber-200",
};

function ServicesPage() {
  return (
  <>
    <main className="min-h-screen">
      {/* Page hero */}
      <section className="relative overflow-hidden px-6 pt-36 md:pt-40 pb-20">

  {/* Soft background glow */}
  <div className="absolute inset-0 -z-10 bg-gradient-to-b from-amber-50 via-white to-white" />

  <div className="max-w-3xl mx-auto text-center">

    <p className="text-sm uppercase tracking-[0.22em] text-amber-600 font-semibold mb-5">
      OUR SERVICES
    </p>

    <h1 className="font-cormorant text-5xl md:text-7xl font-semibold text-stone-900 leading-tight">
      Find the guidance
      <br />
      that's right for you.
    </h1>

    <p className="mt-6 text-2xl text-stone-400 leading-relaxed max-w-3xl mx-auto">
      From birth chart analysis and relationship guidance to career
      consultations and spiritual remedies, every session is conducted
      by an experienced astrologer and tailored to your unique journey.
    </p>

    {/* Trust badges */}

    <div className="mt-12 flex flex-wrap justify-center gap-4">

      <span
  className="
    rounded-full
    border
    border-amber-200
    bg-amber-50
    px-4
    py-2
    text-sm
    font-medium
    text-amber-700
    transition-all
duration-300
hover:-translate-y-1
hover:shadow-xl
hover:-translate-y-2
cursor-default
  "
>
        ✓ Experienced Astrologers
      </span>

      <span
  className="
    rounded-full
    border
    border-emerald-200
    bg-emerald-50
    px-4
    py-2
    text-sm
    font-medium
    text-emerald-700
    transition-all
    duration-300
    hover:-translate-y-1
    hover:shadow-xl
hover:-translate-y-2
    cursor-default
  "
>
        ✓ Private Consultations
      </span>

      <span
  className="
    rounded-full
    border
    border-blue-200
    bg-blue-50
    px-4
    py-2
    text-sm
    font-medium
    text-blue-700
    transition-all
duration-300
hover:-translate-y-1
hover:shadow-xl
hover:-translate-y-2
cursor-default
  "
>
        ✓ Personalised Guidance
      </span>

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
      <section className="bg-stone-50 border-t border-stone-200 px-6 py-16 text-center">
        <p className="text-stone-400 text-sm mb-2">Not sure which service fits?</p>
        <h2 className="font-cormorant text-2xl font-semibold text-stone-900 mb-5">
          We are happy to talk before you book.
        </h2>
        <p className="text-stone-400 mb-8 max-w-md mx-auto text-sm leading-relaxed">
          Reach out by email or phone and we will point you toward the right
          service — no pressure, no sales pitch.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:hello@astroview.app"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-stone-300 text-stone-700 text-sm hover:border-stone-400 hover:bg-white transition-all"
          >
            hello@astroview.app
          </a>
          <a
            href="tel:+919319843151"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-600 text-white text-sm hover:bg-amber-700 transition-all"
          >
            +91-9319843151
          </a>
        </div>
      </section>
    </main>
    </>
  );
}


function ServiceCard({ service }: { service: Service }) {
  const featured = service.slug === "birth-chart-analysis";
  return (
    <article
  className={`
    group relative flex flex-col overflow-hidden rounded-2xl bg-white
    transition-all duration-300 hover:-translate-y-2 hover:shadow-xl
    ${
      featured
        ? "border border-amber-300 ring-1 ring-amber-100 shadow-lg"
        : "border border-stone-200 hover:border-stone-300"
    }
  `}
>
  {featured && (
  <div className="absolute top-3
right-4 z-20 rounded-full bg-amber-500 px-3 py-1 text-[7px] font-semibold uppercase tracking-wider tracking-[0.15em] text-white shadow-md">
    Most Popular
  </div>
)}
      {/* Top accent strip on hover */}
      <div className="h-0.5 w-full bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex flex-col flex-1 p-7">
        {/* Icon + duration */}
        <div className="flex items-start justify-between mb-4">
  <div
    className={`w-14 h-14 rounded-xl flex items-center justify-center ${service.accentColor}`}
  >
    <i
      className={`ti ti-${service.icon} text-2xl ${service.textColor}`}
      aria-hidden="true"
    />
  </div>

  <span className="flex items-center text-sm text-stone-400 font-medium pt-1">
    <i className="ti ti-clock mr-1 text-xs"></i>
    {service.duration}
  </span>
</div>

        {/* Name + tagline */}
        <h2 className="font-cormorant text-2xl font-semibold text-stone-900 mb-2 leading-snug">
          {service.name}
        </h2>
        <p className="text-sm text-amber-600 font-medium mb-3 italic tracking-wide">{service.tagline}</p>

        {/* Short description */}
        <p className="text-stone-400 text-[15px] leading-relaxed mb-5 flex-1">{service.shortDesc}</p>

        {/* Delivery badges */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {service.deliveryModes.map((mode: DeliveryMode) => (
            <span
              key={mode}
              className={`text-sm px-2.5 py-0.5 rounded-full border font-medium ${deliveryColours[mode]}`}
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
  <div className="flex items-center justify-between border-t border-stone-100 pt-5">
    <span className="text-sm font-semibold text-stone-900 transition-colors group-hover/link:text-amber-700">
      Explore service →
    </span>

    <i
      className="ti ti-arrow-up-right text-lg transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-1"
      aria-hidden="true"
    />
  </div>
</Link>

      </div>
    </article>
  );
}
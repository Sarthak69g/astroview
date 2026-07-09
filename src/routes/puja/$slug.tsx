// src/routes/puja/$slug.tsx
import { createFileRoute, Link, useParams, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Clock, Users } from "lucide-react";
import { toast } from "sonner";
import Starfield from "@/components/Starfield";
import PujaCard from "@/components/PujaCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  getPujaBySlug,
  relatedPujas,
  formatINR,
  type Puja,
  type PackageTier,
  type SamagriOptionId,
} from "@/data/pujaData";
import { getPujaIcon } from "@/data/pujaIcons";

export const Route = createFileRoute("/puja/$slug")({
  head: ({ params }) => {
    const puja = getPujaBySlug(params.slug);

    if (!puja) {
      return {
        meta: [
          { title: "Puja not found — AstroView" },
          { name: "description", content: "This puja couldn't be found. Browse all AstroView pujas instead." },
        ],
      };
    }

    const title = `${puja.name} — AstroView`;
    const description = `Book ${puja.name} with a verified pandit ji on AstroView — starting from ${formatINR(puja.packages[0].price)}.`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: PujaDetailPage,
});

function PujaDetailPage() {
  const { slug } = useParams({ strict: false }) as { slug: string };
  const found = getPujaBySlug(slug);

  if (!found) throw notFound();

  const puja: Puja = found;
  const Icon = getPujaIcon(puja.icon);
  const related = relatedPujas(puja);

  const [tier, setTier] = useState<PackageTier | null>(null);
  const [samagri, setSamagri] = useState<SamagriOptionId | null>(null);
  const [expanded, setExpanded] = useState<SamagriOptionId | null>(null);

  const selectedPackage = puja.packages.find((p) => p.tier === tier);
  const selectedSamagri = puja.samagriOptions.find((s) => s.id === samagri);

  const total = useMemo(() => {
    if (!selectedPackage) return null;
    return selectedPackage.price + (selectedSamagri?.priceAdd ?? 0);
  }, [selectedPackage, selectedSamagri]);

  const canProceed = Boolean(selectedPackage && selectedSamagri);

  function handleProceed() {
    toast("Booking & payments are launching soon", {
      description: `We've noted ${puja.name} (${tier} · ${selectedSamagri?.label}) for ${formatINR(total ?? 0)}. Full online booking is on its way — for now, reach out and we'll confirm your date directly.`,
    });
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-32 md:pt-36 pb-14">
        <div className="absolute inset-0 -z-10 bg-gradient-hero" />
        <Starfield />

        <div className="max-w-4xl mx-auto">
          <Link
            to="/puja"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> All pujas
          </Link>

          <div className="flex flex-col sm:flex-row items-start gap-6 rounded-3xl border border-border bg-card p-7 shadow-card">
            <div className={`h-20 w-20 rounded-2xl flex items-center justify-center shrink-0 ${puja.accentColor}`}>
              <Icon className={`h-9 w-9 ${puja.textColor}`} />
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="font-display text-3xl font-semibold">{puja.name}</h1>
              <p className="mt-1.5 text-sm text-primary-deep italic">{puja.tagline}</p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {puja.categories.map((c) => (
                  <span
                    key={c}
                    className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground border border-border"
                  >
                    {c}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {puja.duration}</span>
                <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {puja.team}</span>
                <span className="font-semibold text-foreground">
                  Starting from {formatINR(puja.packages[0].price)}
                </span>
              </div>
            </div>

            {/* Small photo gallery — gives a real visual sense of the puja right in the hero.
                Guarded on both fields so a missing image can never render a broken <img>. */}
            {(puja.image || puja.image2) && (
              <div className="flex gap-2.5 w-full sm:w-auto shrink-0">
                {puja.image && (
                  <img
                    src={puja.image}
                    alt={puja.name}
                    loading="lazy"
                    style={{ objectPosition: puja.imagePosition ?? "50% 25%" }}
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                    className="h-28 sm:h-24 w-1/2 sm:w-24 rounded-xl object-cover border border-border bg-secondary"
                  />
                )}
                {puja.image2 && (
                  <img
                    src={puja.image2}
                    alt={`${puja.name} ritual detail`}
                    loading="lazy"
                    style={{ objectPosition: puja.imagePosition2 ?? "50% 25%" }}
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                    className="h-28 sm:h-24 w-1/2 sm:w-24 rounded-xl object-cover border border-border bg-secondary"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why you need this puja */}
      <section className="max-w-4xl mx-auto px-6 pb-14">
        <h2 className="font-display text-2xl font-semibold mb-3">Why you need this puja</h2>
        <p className="text-muted-foreground leading-relaxed">{puja.whyNeeded}</p>
      </section>

      {/* Package + Samagri selector */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-2 gap-5">
          {/* Choose your puja */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <h3 className="font-display text-lg font-semibold mb-4">Choose Your Puja</h3>
            <div className="flex flex-col divide-y divide-border">
              {puja.packages.map((pkg) => (
                <label
                  key={pkg.tier}
                  className="flex items-start gap-3 py-3.5 cursor-pointer group"
                >
                  <span
                    className={`mt-1 h-4 w-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                      tier === pkg.tier ? "border-primary" : "border-border group-hover:border-primary/40"
                    }`}
                  >
                    {tier === pkg.tier && <span className="h-2 w-2 rounded-full bg-primary" />}
                  </span>
                  <input
                    type="radio"
                    name="tier"
                    className="sr-only"
                    checked={tier === pkg.tier}
                    onChange={() => setTier(pkg.tier)}
                  />
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground">{pkg.tier}</span>
                      <span className="text-sm text-muted-foreground">{formatINR(pkg.price)}</span>
                    </span>
                    <span className="block mt-1 text-sm text-muted-foreground leading-relaxed">
                      {pkg.description}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Puja samagri */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <h3 className="font-display text-lg font-semibold mb-4">Pooja Samagri</h3>
            <div className="flex flex-col divide-y divide-border">
              {puja.samagriOptions.map((opt) => (
                <div key={opt.id} className="py-3.5">
                  <div className="flex items-start gap-3">
                    <label className="flex items-start gap-3 cursor-pointer group flex-1 min-w-0">
                      <span
                        className={`mt-1 h-4 w-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                          samagri === opt.id ? "border-primary" : "border-border group-hover:border-primary/40"
                        }`}
                      >
                        {samagri === opt.id && <span className="h-2 w-2 rounded-full bg-primary" />}
                      </span>
                      <input
                        type="radio"
                        name="samagri"
                        className="sr-only"
                        checked={samagri === opt.id}
                        onChange={() => setSamagri(opt.id)}
                      />
                      <span className="min-w-0">
                        <span className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-foreground text-sm">{opt.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {opt.priceAdd === 0 ? "included" : opt.priceAdd > 0 ? `+${formatINR(opt.priceAdd)}` : `−${formatINR(Math.abs(opt.priceAdd))}`}
                          </span>
                        </span>
                        <span className="block mt-1 text-sm text-muted-foreground leading-relaxed">
                          {opt.description}
                        </span>
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setExpanded(expanded === opt.id ? null : opt.id)}
                      className="text-xs text-primary-deep font-medium shrink-0 hover:underline"
                    >
                      {expanded === opt.id ? "Hide" : "Details"}
                    </button>
                  </div>
                  {expanded === opt.id && (
                    <ul className="mt-3 ml-7 space-y-1.5">
                      {opt.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Total + CTA */}
        <div className="mt-8 text-center">
          <p className="text-lg">
            <span className="text-muted-foreground">Total you pay: </span>
            <span className="font-display font-semibold text-primary-deep text-2xl">
              {total !== null ? formatINR(total) : "—"}
            </span>
          </p>
          <button
            onClick={handleProceed}
            disabled={!canProceed}
            className={`mt-5 inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold transition-all ${
              canProceed
                ? "bg-gradient-primary text-primary-foreground shadow-soft hover:opacity-95 hover:scale-[1.02]"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            Proceed for Booking
          </button>
          {!canProceed && (
            <p className="mt-2 text-xs text-muted-foreground">
              Pick a package and a samagri option to see your total.
            </p>
          )}
        </div>
      </section>

      {/* Advantages + Puja details */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-2 gap-5">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <h3 className="font-display text-lg font-semibold mb-4">Advantages</h3>
            <ul className="space-y-3">
              {puja.advantages.map((a, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  {a}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <h3 className="font-display text-lg font-semibold mb-4">Puja Vidhi</h3>
            <ol className="space-y-4">
              {puja.vidhi.map((v, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="h-6 w-6 rounded-full bg-primary/10 text-primary-deep text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-foreground">{v.step}</span>
                    <span className="block mt-0.5 text-sm text-muted-foreground leading-relaxed">
                      {v.description}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="font-display text-2xl font-semibold mb-5">Frequently asked questions</h2>
        <Accordion type="single" collapsible className="max-w-2xl">
          {puja.faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-foreground text-sm font-medium hover:text-primary-deep hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed pr-8">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Related pujas */}
      {related.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <h2 className="font-display text-2xl font-semibold mb-6">Related pujas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map((p) => (
              <PujaCard key={p.slug} puja={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

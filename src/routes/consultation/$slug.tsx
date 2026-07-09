// src/routes/consultation/$slug.tsx
import { createFileRoute, Link, useParams, notFound } from "@tanstack/react-router";
import { BadgeCheck, MessageCircle, Phone, Star, ArrowLeft } from "lucide-react";
import Starfield from "@/components/Starfield";
import AstrologerCard from "@/components/AstrologerCard";
import { avatarUrl, handleConsultAction } from "@/components/astrologer-helpers";
import { getAstrologerBySlug, relatedAstrologers, formatOrders } from "@/data/astrologersData";
import { getServiceBySlug } from "@/data/servicesData";

export const Route = createFileRoute("/consultation/$slug")({
  head: ({ params }) => {
    const astrologer = getAstrologerBySlug(params.slug);

    if (!astrologer) {
      return {
        meta: [
          { title: "Astrologer not found — AstroView" },
          {
            name: "description",
            content: "This astrologer couldn't be found. Browse all AstroView astrologers instead.",
          },
        ],
      };
    }

    const title = `${astrologer.name} — AstroView`;
    const description = `Chat or call with ${astrologer.name} on AstroView — verified Vedic astrologer available now.`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: AstrologerProfilePage,
});

function AstrologerProfilePage() {
  const { slug } = useParams({ strict: false }) as { slug: string };
  const astrologer = getAstrologerBySlug(slug);

  if (!astrologer) throw notFound();

  const specialtyNames = astrologer.specialties.map((s) => getServiceBySlug(s)).filter(Boolean);
  const related = relatedAstrologers(astrologer);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden px-6 pt-32 md:pt-36 pb-14">
        <div className="absolute inset-0 -z-10 bg-gradient-hero" />
        <Starfield />

        <div className="max-w-4xl mx-auto">
          <Link
            to="/consultation"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> All astrologers
          </Link>

          <div className="flex flex-col sm:flex-row items-start gap-6 rounded-3xl border border-border bg-card p-7 shadow-card">
            <img
              src={avatarUrl(astrologer.avatarSeed)}
              alt={astrologer.name}
              className="h-28 w-28 rounded-full border border-border bg-secondary object-cover shrink-0"
            />

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-3xl font-semibold">{astrologer.name}</h1>
                <BadgeCheck className="h-5 w-5 text-primary" />
                {astrologer.badge && (
                  <span className="rounded-full bg-primary/10 text-primary-deep px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide">
                    {astrologer.badge}
                  </span>
                )}
              </div>

              <p className="mt-1.5 text-sm text-muted-foreground">
                {astrologer.languages.join(", ")} · {astrologer.experienceYears} yrs experience
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <span className="flex items-center gap-1 font-medium">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  {astrologer.rating.toFixed(1)}
                  <span className="text-muted-foreground font-normal">
                    ({astrologer.reviews.toLocaleString()} reviews)
                  </span>
                </span>
                <span className="text-muted-foreground">
                  {formatOrders(astrologer.orders)} orders
                </span>
                <span className="font-semibold text-foreground">₹{astrologer.pricePerMin}/min</span>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {specialtyNames.map((s) => (
                  <span
                    key={s!.slug}
                    className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground border border-border"
                  >
                    {s!.name}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => handleConsultAction(astrologer, "Chat")}
                  disabled={!astrologer.modes.includes("Chat")}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                    astrologer.modes.includes("Chat")
                      ? "bg-gradient-primary text-primary-foreground shadow-soft hover:opacity-95 hover:scale-[1.02]"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  <MessageCircle className="h-4 w-4" /> Start Chat
                </button>
                <button
                  onClick={() => handleConsultAction(astrologer, "Call")}
                  disabled={!astrologer.modes.includes("Call")}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold border transition-all ${
                    astrologer.modes.includes("Call")
                      ? "border-primary/30 text-primary-deep hover:bg-primary/5"
                      : "border-border text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  <Phone className="h-4 w-4" /> Start Call
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="font-display text-2xl font-semibold mb-3">About</h2>
        <p className="text-muted-foreground leading-relaxed">{astrologer.bio}</p>
      </section>

      {related.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <h2 className="font-display text-2xl font-semibold mb-6">Similar astrologers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map((a) => (
              <AstrologerCard key={a.id} astrologer={a} mode="Chat" />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
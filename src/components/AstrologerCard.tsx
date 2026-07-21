// src/components/AstrologerCard.tsx
// Reusable astrologer card used on the homepage Consultation teaser and the
// full /consultation directory. Clicking the astrologer's name/avatar opens
// their profile; the Chat/Call button is a placeholder action (toast) until
// live chat/call infrastructure exists — matches how the OTP login flow was
// held back pending approval rather than shipping fake working sessions.
//
// PHASE 2 update: astrologer.specialties (slugs into servicesData) is gone —
// real records carry a raw `skills` string instead, so tags render whatever
// the backend actually returns rather than being forced into the old
// service taxonomy. Star rating / order count / "Top Choice" badges are now
// optional and simply omitted when the backend hasn't provided them (real
// astrologers don't have fake review counts stapled on). An online dot
// (StatusId === 1, i.e. isOnline) replaces the badge as the primary visual
// signal, same idea as the admin portal's AstroCard.jsx.

import { Link } from "@tanstack/react-router";
import { MessageCircle, Phone, Star, BadgeCheck } from "lucide-react";
import { type Astrologer, type ConsultMode, formatOrders } from "@/data/astrologersData";
import { avatarUrl } from "@/components/astrologer-helpers";
import { useInitiateConsultation } from "@/hooks/use-initiate-consultation";

const badgeStyles: Record<NonNullable<Astrologer["badge"]>, string> = {
  "Top Choice": "bg-primary/15 text-primary-deep",
  New: "bg-emerald-500/15 text-emerald-700",
  Celebrity: "bg-purple-500/15 text-purple-700",
};

export default function AstrologerCard({
  astrologer,
  mode,
}: {
  astrologer: Astrologer;
  mode: ConsultMode;
}) {
  const supportsMode = astrologer.modes.includes(mode);
  const startConsultation = useInitiateConsultation();

  return (
    <article className="group relative flex flex-col h-full rounded-3xl border border-border bg-card p-6 shadow-card hover:shadow-glow hover:-translate-y-1.5 hover:border-primary/25 transition-all duration-300">
      {astrologer.badge && (
        <span
          className={`absolute top-4 right-4 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${badgeStyles[astrologer.badge]}`}
        >
          {astrologer.badge}
        </span>
      )}

      <Link
        to="/consultation/$slug"
        params={{ slug: astrologer.slug }}
        className="flex items-start gap-3.5"
      >
        <div className="relative shrink-0">
          <img
            src={avatarUrl(astrologer.avatarSeed)}
            alt={astrologer.name}
            className="h-16 w-16 rounded-full border border-border bg-secondary object-cover"
            loading="lazy"
          />
          {astrologer.isOnline && (
            <span
              className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-card"
              title="Online now"
            />
          )}
        </div>
        <div className="min-w-0 pt-0.5">
          <div className="flex items-center gap-1">
            <h3 className="font-display text-lg font-semibold text-foreground truncate group-hover:text-primary-deep transition-colors">
              {astrologer.name}
            </h3>
            <BadgeCheck className="h-4 w-4 text-primary shrink-0" />
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {astrologer.languages.length > 0 ? astrologer.languages.join(", ") : "Languages unavailable"}
          </p>
          {astrologer.rating !== undefined && (
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              <span className="font-medium text-foreground">{astrologer.rating.toFixed(1)}</span>
              {astrologer.orders !== undefined && (
                <span>· {formatOrders(astrologer.orders)} orders</span>
              )}
            </div>
          )}
        </div>
      </Link>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {astrologer.skills.length > 0 ? (
          <>
            {astrologer.skills.slice(0, 2).map((skill) => (
              <span
                key={skill}
                className="text-[11px] px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground border border-border"
              >
                {skill}
              </span>
            ))}
            {astrologer.skills.length > 2 && (
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground border border-border">
                +{astrologer.skills.length - 2}
              </span>
            )}
          </>
        ) : (
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground border border-border">
            Vedic Astrology
          </span>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <div className="text-sm">
          <span className="font-semibold text-foreground">₹{astrologer.pricePerMin}</span>
          <span className="text-muted-foreground">/min</span>
          <p className="text-[11px] text-muted-foreground">
            {astrologer.experienceYears} yrs experience
          </p>
        </div>

        <button
          onClick={() => startConsultation(astrologer, mode)}
          disabled={!supportsMode}
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
            supportsMode
              ? "bg-gradient-primary text-primary-foreground shadow-soft hover:opacity-95 hover:scale-[1.03] active:scale-[0.96]"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          {mode === "Chat" ? (
            <MessageCircle className="h-3.5 w-3.5" />
          ) : (
            <Phone className="h-3.5 w-3.5" />
          )}
          {supportsMode ? mode : `No ${mode.toLowerCase()}`}
        </button>
      </div>
    </article>
  );
}

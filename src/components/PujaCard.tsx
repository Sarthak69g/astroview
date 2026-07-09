// src/components/PujaCard.tsx
// Card used on the Puja directory (/puja) and the "related pujas" section on
// a puja detail page. Mirrors AstrologerCard's structure/tone so the Puja
// section feels native to the rest of AstroView rather than bolted on.

import { Link } from "@tanstack/react-router";
import { Clock, Users } from "lucide-react";
import { useState } from "react";
import { type Puja, formatINR } from "@/data/pujaData";
import { getPujaIcon } from "@/data/pujaIcons";

export default function PujaCard({ puja, delay = 0 }: { puja: Puja; delay?: number }) {
  const Icon = getPujaIcon(puja.icon);
  const startingPrice = puja.packages[0].price;
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <Link
      to="/puja/$slug"
      params={{ slug: puja.slug }}
      className="group relative flex flex-col h-full rounded-3xl border border-border bg-card shadow-card overflow-hidden hover:shadow-glow hover:-translate-y-1.5 hover:border-primary/25 transition-all duration-300"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Deity/ritual photo — gives the card a real visual connection to the puja */}
      <div className={`relative h-48 w-full overflow-hidden ${puja.accentColor}`}>
        {!imageFailed ? (
          <img
            src={puja.image}
            alt={puja.name}
            loading="lazy"
            onError={() => setImageFailed(true)}
            style={{ objectPosition: puja.imagePosition ?? "50% 25%" }}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <Icon className={`h-10 w-10 ${puja.textColor}`} />
          </div>
        )}
        <div className={`absolute top-3 left-3 w-10 h-10 rounded-xl flex items-center justify-center shadow-soft ${puja.accentColor}`}>
          <Icon className={`h-4.5 w-4.5 ${puja.textColor}`} />
        </div>
      </div>

      <div className="flex flex-col flex-1 p-6">
        <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary-deep transition-colors">
          {puja.name}
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {puja.tagline}
        </p>

        <div className="mt-auto pt-5 flex items-center justify-between border-t border-border">
          <div className="text-sm">
            <span className="text-muted-foreground">Starting from </span>
            <span className="font-semibold text-foreground">{formatINR(startingPrice)}</span>
            <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{puja.duration}</span>
              <span className="flex items-center gap-1"><Users className="h-3 w-3" />{puja.team}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

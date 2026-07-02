// src/components/NumerologyCalculator.tsx
// A real, Pythagorean-system numerology calculator — full name + date of
// birth in, three core numbers out (Life Path, Destiny/Expression, Soul
// Urge), each linking through to its own meaning page. Matches the design
// language and honesty of SunSignFinder: instant, real calculation, upfront
// that it's a starting point rather than a full reading.

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { calculateNumerologyProfile, type NumerologyProfile } from "@/lib/numerology";
import { getNumberByValue } from "@/data/numerologyData";

const RESULT_LABELS: { key: keyof NumerologyProfile; label: string; blurb: string }[] = [
  { key: "lifePath", label: "Life Path", blurb: "Who you fundamentally are" },
  { key: "destiny", label: "Destiny", blurb: "Where your path is heading" },
  { key: "soulUrge", label: "Soul Urge", blurb: "What you privately want" },
];

export default function NumerologyCalculator() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [profile, setProfile] = useState<NumerologyProfile | null>(null);
  const maxDate = new Date().toISOString().split("T")[0];

  function handleCalculate() {
    if (!name.trim() || !dob) return;
    const [yearStr, monthStr, dayStr] = dob.split("-");
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    const day = parseInt(dayStr, 10);
    const currentYear = new Date().getFullYear();
    if (!year || !month || !day || year < 1900 || year > currentYear) return;

    setProfile(calculateNumerologyProfile(name, { day, month, year }));
  }

  const canCalculate = name.trim().length > 0 && dob.length > 0;

  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card shadow-card p-8 md:p-12">
          <div className="grid md:grid-cols-[1fr_auto] gap-8 md:gap-12 items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5" /> Try it yourself
              </p>
              <h2 className="mt-3 text-3xl md:text-4xl font-display font-semibold tracking-tight">
                What are your numbers?
              </h2>
              <p className="mt-3 text-muted-foreground max-w-md leading-relaxed">
                Enter your full birth name and date of birth for an instant, real calculation
                using the Pythagorean system — the same method most Western numerologists use.
              </p>

              <div className="mt-6 max-w-xs space-y-4">
                <div>
                  <label htmlFor="numerology-name" className="block text-xs font-medium text-muted-foreground mb-2">
                    Full name at birth
                  </label>
                  <input
                    id="numerology-name"
                    type="text"
                    placeholder="e.g. Ram Kumar"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setProfile(null); }}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div>
                  <label htmlFor="numerology-dob" className="block text-xs font-medium text-muted-foreground mb-2">
                    Date of birth
                  </label>
                  <input
                    id="numerology-dob"
                    type="date"
                    min="1000-01-01"
                    max={maxDate}
                    value={dob}
                    onChange={(e) => { setDob(e.target.value); setProfile(null); }}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <button
                  onClick={handleCalculate}
                  disabled={!canCalculate}
                  className="w-full rounded-xl bg-gradient-primary text-primary-foreground text-sm font-medium py-2.5 disabled:opacity-40 transition hover:opacity-95"
                >
                  Calculate my numbers
                </button>
              </div>
            </div>

            <div className="md:w-72 w-full">
              {profile ? (
                <div className="space-y-3">
                  {RESULT_LABELS.map(({ key, label, blurb }) => {
                    const value = profile[key];
                    const meaning = getNumberByValue(value);
                    if (!meaning) return null;
                    return (
                      <Link
                        key={key}
                        to="/numerology/$number"
                        params={{ number: meaning.slug }}
                        className="flex items-center gap-4 rounded-2xl border border-border bg-background p-4 hover:border-primary/40 hover:shadow-card transition group"
                      >
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary-deep font-display text-2xl font-semibold flex-shrink-0">
                          {value}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{label}</p>
                          <p className="text-sm font-semibold text-foreground">{meaning.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{blurb}</p>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition flex-shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground md:w-72">
                  Your three core numbers will appear here.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

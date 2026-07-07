// src/components/SunSignFinder.tsx
// A real, date-based sun sign lookup — no fabricated chart data, no fake "Dasha" output.
// Honest by design: tells the visitor their sun sign instantly, then is upfront that
// a sun sign is the surface layer and a real birth chart reading goes deeper.

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CalendarIcon, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ZodiacSign {
  name: string;
  symbol: string;
  dateRange: string;
  blurb: string;
}

// Tropical (Western) sun sign date ranges — standard, factual, not chart-derived.
const ZODIAC_SIGNS: ZodiacSign[] = [
  { name: "Capricorn", symbol: "♑", dateRange: "Dec 22 – Jan 19", blurb: "Grounded and patient, with a quiet drive to build things that last." },
  { name: "Aquarius", symbol: "♒", dateRange: "Jan 20 – Feb 18", blurb: "Independent and forward-looking, drawn to ideas ahead of their time." },
  { name: "Pisces", symbol: "♓", dateRange: "Feb 19 – Mar 20", blurb: "Intuitive and empathetic, often the first to sense what others are feeling." },
  { name: "Aries", symbol: "♈", dateRange: "Mar 21 – Apr 19", blurb: "Direct and energetic, comfortable starting things others hesitate to begin." },
  { name: "Taurus", symbol: "♉", dateRange: "Apr 20 – May 20", blurb: "Steady and grounded, with a strong pull toward comfort and consistency." },
  { name: "Gemini", symbol: "♊", dateRange: "May 21 – Jun 20", blurb: "Curious and quick, energised by conversation and new information." },
  { name: "Cancer", symbol: "♋", dateRange: "Jun 21 – Jul 22", blurb: "Protective and deeply attuned to home, family, and emotional undercurrents." },
  { name: "Leo", symbol: "♌", dateRange: "Jul 23 – Aug 22", blurb: "Warm and expressive, with a natural pull toward leading and creating." },
  { name: "Virgo", symbol: "♍", dateRange: "Aug 23 – Sep 22", blurb: "Precise and observant, often the one who notices what others miss." },
  { name: "Libra", symbol: "♎", dateRange: "Sep 23 – Oct 22", blurb: "Diplomatic and relationship-oriented, with a sharp eye for balance." },
  { name: "Scorpio", symbol: "♏", dateRange: "Oct 23 – Nov 21", blurb: "Intense and perceptive, drawn to what lies beneath the surface." },
  { name: "Sagittarius", symbol: "♐", dateRange: "Nov 22 – Dec 21", blurb: "Optimistic and restless, happiest when there's a horizon to move toward." },
];

function getSunSign(month: number, day: number): ZodiacSign {
  // month is 1-12
  const cutoffs: [number, number, number][] = [
    [1, 19, 0],   // through Jan 19 -> Capricorn (index 0)
    [2, 18, 1],   // through Feb 18 -> Aquarius
    [3, 20, 2],
    [4, 19, 3],
    [5, 20, 4],
    [6, 20, 5],
    [7, 22, 6],
    [8, 22, 7],
    [9, 22, 8],
    [10, 22, 9],
    [11, 21, 10],
    [12, 21, 11],
  ];

  for (const [m, d, idx] of cutoffs) {
    if (month < m || (month === m && day <= d)) {
      return ZODIAC_SIGNS[idx];
    }
  }
  // anything after Dec 21 falls into Capricorn
  return ZODIAC_SIGNS[0];
}

export default function SunSignFinder() {
  const [dob, setDob] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [sign, setSign] = useState<ZodiacSign | null>(null);
  const today = new Date();
  const currentYear = today.getFullYear();

  const handleChange = (date: Date | undefined) => {
    setDob(date);
    setCalendarOpen(false);
    if (!date) {
      setSign(null);
      return;
    }
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const isValidYear = year >= 1900 && year <= currentYear;

    if (month && day && isValidYear) {
      setSign(getSunSign(month, day));
    } else {
      setSign(null);
    }
  };

  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card shadow-card p-8 md:p-12">
          <div className="grid md:grid-cols-[1fr_auto] gap-8 md:gap-12 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-primary font-medium flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5" /> Try it yourself
              </p>
              <h2 className="mt-3 text-3xl md:text-4xl font-display font-semibold tracking-tight">
                What's your sun sign?
              </h2>
              <p className="mt-3 text-muted-foreground max-w-md leading-relaxed">
                Enter your birth date for an instant answer. It's a starting point, not the full
                picture — your sun sign is one placement among many in your actual chart.
              </p>

              <div className="mt-6 max-w-xs">
                <label htmlFor="sun-sign-dob" className="block text-xs font-medium text-muted-foreground mb-2">
                  Your date of birth
                </label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <button
                      id="sun-sign-dob"
                      type="button"
                      className="w-full flex items-center justify-between gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-left focus:outline-none focus:ring-2 focus:ring-primary/40 hover:border-primary/40 transition"
                    >
                      <span className={dob ? "text-foreground" : "text-muted-foreground"}>
                        {dob ? format(dob, "d MMMM yyyy") : "Select date of birth"}
                      </span>
                      <CalendarIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dob}
                      onSelect={handleChange}
                      captionLayout="dropdown"
                      startMonth={new Date(1930, 0)}
                      endMonth={today}
                      disabled={{ after: today }}
                      defaultMonth={dob ?? new Date(currentYear - 25, 0)}
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="md:w-72">
              {sign ? (
                <div className="rounded-2xl border border-border bg-background p-6 text-center">
                  <div className="text-5xl">{sign.symbol}</div>
                  <h3 className="mt-3 font-display text-2xl font-semibold">{sign.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{sign.dateRange}</p>
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{sign.blurb}</p>
                  <Link
                    to="/services/$slug"
                    params={{ slug: "birth-chart-analysis" }}
                    className="mt-5 inline-flex items-center justify-center gap-1.5 text-sm font-medium text-primary-deep hover:gap-2.5 transition-all"
                  >
                    See your full chart <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground md:w-72">
                  Your sign will appear here.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
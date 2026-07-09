// src/data/astrologersData.ts
//
// PLACEHOLDER DATA — mirrors the pattern already used for pricing/service
// copy in this project: mock content to build and test the Consultation
// flow against, swapped for real astrologer records once onboarding is
// finalized. `specialties` intentionally reference the slugs already
// defined in servicesData.ts so the two stay in sync instead of drifting
// into a second, parallel taxonomy.

export type ConsultMode = "Chat" | "Call";

export interface Astrologer {
  id: string;
  slug: string;
  name: string;
  avatarSeed: string;
  specialties: string[]; // Service["slug"] values from servicesData.ts
  languages: string[];
  experienceYears: number;
  pricePerMin: number;
  rating: number; // out of 5
  orders: number;
  reviews: number;
  bio: string;
  badge?: "New" | "Top Choice" | "Celebrity";
  modes: ConsultMode[];
}

export const astrologers: Astrologer[] = [
  {
    id: "a1",
    slug: "acharya-devraj-shastri",
    name: "Acharya Devraj Shastri",
    avatarSeed: "Devraj Shastri",
    specialties: ["birth-chart-analysis", "kundali-matching"],
    languages: ["Hindi", "English", "Sanskrit"],
    experienceYears: 21,
    pricePerMin: 42,
    rating: 4.9,
    orders: 18400,
    reviews: 6210,
    bio: "Acharya Devraj has spent two decades reading birth charts in the classical Parashari tradition. He is known for calm, precise readings that focus on what a chart is actually saying rather than generic predictions — especially trusted for kundali matching before marriage.",
    badge: "Top Choice",
    modes: ["Chat", "Call"],
  },
  {
    id: "a2",
    slug: "priyanka-sharma",
    name: "Priyanka Sharma",
    avatarSeed: "Priyanka Sharma",
    specialties: ["love-relationship-guidance", "tarot-numerology"],
    languages: ["Hindi", "English"],
    experienceYears: 7,
    pricePerMin: 24,
    rating: 4.8,
    orders: 9800,
    reviews: 3120,
    bio: "Priyanka blends Vedic astrology with tarot to work through relationship questions — compatibility, timing, and the patterns people repeat without noticing. Her sessions are conversational and gentle, never fatalistic.",
    modes: ["Chat", "Call"],
  },
  {
    id: "a3",
    slug: "pandit-om-prakash-tiwari",
    name: "Pandit Om Prakash Tiwari",
    avatarSeed: "Om Prakash Tiwari",
    specialties: ["gemstone-remedies", "spiritual-healing"],
    languages: ["Hindi", "Bhojpuri"],
    experienceYears: 15,
    pricePerMin: 29,
    rating: 4.7,
    orders: 7600,
    reviews: 2440,
    bio: "Panditji specializes in gemstone and remedial astrology — matching stones and rituals to a chart's actual weak points rather than prescribing by sun sign alone. He also guides spiritual healing practices for people going through difficult periods.",
    modes: ["Call"],
  },
  {
    id: "a4",
    slug: "meera-iyer",
    name: "Meera Iyer",
    avatarSeed: "Meera Iyer",
    specialties: ["career-business-guidance", "birth-chart-analysis"],
    languages: ["English", "Tamil", "Hindi"],
    experienceYears: 11,
    pricePerMin: 33,
    rating: 4.9,
    orders: 12100,
    reviews: 4870,
    bio: "Meera reads charts through a career-and-timing lens — favourable fields, when to switch jobs or launch a business, and how to read the Dashas running through your current decade. Popular with founders and career-changers alike.",
    badge: "Top Choice",
    modes: ["Chat", "Call"],
  },
  {
    id: "a5",
    slug: "kabir-malhotra",
    name: "Kabir Malhotra",
    avatarSeed: "Kabir Malhotra",
    specialties: ["vastu-consultation"],
    languages: ["Hindi", "English", "Punjabi"],
    experienceYears: 9,
    pricePerMin: 27,
    rating: 4.6,
    orders: 5300,
    reviews: 1680,
    bio: "Kabir consults on Vastu for homes and offices — practical layout fixes rather than large renovations wherever possible. He walks clients through floor plans over chat or call before recommending anything structural.",
    modes: ["Chat", "Call"],
  },
  {
    id: "a6",
    slug: "ananya-joshi",
    name: "Ananya Joshi",
    avatarSeed: "Ananya Joshi",
    specialties: ["tarot-numerology"],
    languages: ["English", "Marathi", "Hindi"],
    experienceYears: 4,
    pricePerMin: 18,
    rating: 4.7,
    orders: 2100,
    reviews: 940,
    bio: "Ananya reads tarot alongside numerology — your name and birth-date numbers layered against the cards drawn for a session. New to the platform but building a loyal following for her clarity and warmth.",
    badge: "New",
    modes: ["Chat"],
  },
  {
    id: "a7",
    slug: "suresh-bhatt",
    name: "Suresh Bhatt",
    avatarSeed: "Suresh Bhatt",
    specialties: ["spiritual-healing", "gemstone-remedies"],
    languages: ["Hindi", "Gujarati"],
    experienceYears: 18,
    pricePerMin: 31,
    rating: 4.8,
    orders: 10200,
    reviews: 3560,
    bio: "Suresh has guided spiritual healing and remedial work for almost two decades, often working alongside clients' existing medical or therapeutic care rather than in place of it. Known for being direct about what astrology can and cannot fix.",
    modes: ["Call"],
  },
  {
    id: "a8",
    slug: "lakshmi-menon",
    name: "Lakshmi Menon",
    avatarSeed: "Lakshmi Menon",
    specialties: ["kundali-matching", "love-relationship-guidance"],
    languages: ["English", "Malayalam", "Tamil"],
    experienceYears: 13,
    pricePerMin: 30,
    rating: 4.9,
    orders: 9100,
    reviews: 3010,
    bio: "Lakshmi's Guna Milan sessions go beyond the score itself — she walks both families through what each mismatch actually means day to day. A steady, reassuring presence for pre-marriage consultations.",
    modes: ["Chat", "Call"],
  },
  {
    id: "a9",
    slug: "arjun-chaturvedi",
    name: "Arjun Chaturvedi",
    avatarSeed: "Arjun Chaturvedi",
    specialties: ["birth-chart-analysis", "career-business-guidance"],
    languages: ["Hindi", "English"],
    experienceYears: 25,
    pricePerMin: 49,
    rating: 5.0,
    orders: 22300,
    reviews: 8410,
    bio: "One of the platform's most senior astrologers, Arjun has read over twenty thousand charts across a 25-year practice. Sought out for high-stakes career and business timing decisions where precision matters.",
    badge: "Celebrity",
    modes: ["Chat", "Call"],
  },
  {
    id: "a10",
    slug: "neha-kapoor",
    name: "Neha Kapoor",
    avatarSeed: "Neha Kapoor",
    specialties: ["love-relationship-guidance", "spiritual-healing"],
    languages: ["English", "Hindi", "Punjabi"],
    experienceYears: 6,
    pricePerMin: 21,
    rating: 4.6,
    orders: 3400,
    reviews: 1290,
    bio: "Neha works mostly with people navigating breakups, long-distance relationships, and family pressure around marriage timing. Sessions lean supportive and grounded rather than purely predictive.",
    modes: ["Chat"],
  },
  {
    id: "a11",
    slug: "rajeshwari-nair",
    name: "Rajeshwari Nair",
    avatarSeed: "Rajeshwari Nair",
    specialties: ["vastu-consultation", "gemstone-remedies"],
    languages: ["English", "Malayalam"],
    experienceYears: 16,
    pricePerMin: 34,
    rating: 4.8,
    orders: 6700,
    reviews: 2050,
    bio: "Rajeshwari combines Vastu review with gemstone recommendations for clients setting up a new home or office. She asks for floor plans and a birth chart together so the two remedies actually align.",
    modes: ["Chat", "Call"],
  },
  {
    id: "a12",
    slug: "vinod-tripathi",
    name: "Vinod Tripathi",
    avatarSeed: "Vinod Tripathi",
    specialties: ["kundali-matching", "birth-chart-analysis"],
    languages: ["Hindi", "Awadhi"],
    experienceYears: 8,
    pricePerMin: 19,
    rating: 4.5,
    orders: 2900,
    reviews: 810,
    bio: "Vinod trained under his grandfather, a temple astrologer in Ayodhya, and now practices independently online. Straightforward chart readings without the frills — popular for quick, focused questions.",
    modes: ["Chat", "Call"],
  },
];

export function getAstrologerBySlug(slug: string): Astrologer | undefined {
  return astrologers.find((a) => a.slug === slug);
}

export function formatOrders(n: number): string {
  if (n >= 1000) return `${Math.floor(n / 1000)}k+`;
  return `${n}`;
}

export function relatedAstrologers(current: Astrologer, count = 3): Astrologer[] {
  return astrologers
    .filter((a) => a.id !== current.id && a.specialties.some((s) => current.specialties.includes(s)))
    .slice(0, count);
}

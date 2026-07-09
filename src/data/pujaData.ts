// src/data/pujaData.ts
//
// Data model for the Puja booking section. Follows the same placeholder-data
// convention as astrologersData.ts and servicesData.ts: realistic mock
// pricing and content to build and test the full browse → detail → package
// picker flow against, ready to swap for real catalog data once pricing is
// finalized with the business.
//
// IMPORTANT: "Proceed for Booking" is intentionally a placeholder action
// (see PujaBookingBar in the detail route) — no live payment gateway exists
// yet. A real payment/checkout step is expected to land later; the pricing
// math here (package + samagri delta = total) is already structured so a
// payment step can consume the same computed total without changes.

export type PujaCategory = "Ghar Pe Puja" | "Online Puja" | "On Request Puja";
export type PackageTier = "Standard" | "Premium" | "Grand";
export type SamagriOptionId = "with-samagri" | "without-samagri" | "with-samagri-all-items";

export interface PujaPackage {
  tier: PackageTier;
  price: number;
  description: string;
  inclusions: string[];
}

export interface SamagriChoice {
  id: SamagriOptionId;
  label: string;
  priceAdd: number; // added to (or subtracted from) the selected package price
  description: string;
  items: string[];
}

export interface PujaVidhiStep {
  step: string;
  description: string;
}

export interface PujaFAQ {
  question: string;
  answer: string;
}

export interface Puja {
  slug: string;
  name: string;
  categories: PujaCategory[];
  tagline: string;
  whyNeeded: string;
  duration: string;
  team: string;
  icon: string; // lucide icon key, mapped in pujaIcons.tsx
  accentColor: string;
  textColor: string;
  /** Small connect-building photo shown on the puja card (deity/ritual related). */
  image: string;
  /** Optional CSS object-position override for `image`, for source photos that crop awkwardly by default. */
  imagePosition?: string;
  /** Second real photo, shown alongside `image` in a small gallery on the puja detail page. */
  image2: string;
  imagePosition2?: string;
  packages: PujaPackage[];
  samagriOptions: SamagriChoice[];
  advantages: string[];
  vidhi: PujaVidhiStep[];
  faqs: PujaFAQ[];
}

// Small, real deity/ritual photos sourced from Wikimedia Commons (freely
// licensed) so each puja card has a relevant, recognizable image rather than
// a generic stock photo. Special:FilePath resolves straight to the current
// original file, so we don't need to hardcode per-file hashes.
function wikimediaImage(filename: string, width = 640): string {
  const canonical = filename.trim().replace(/\s+/g, "_");
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(canonical)}?width=${width}`;
}

// Shared samagri option builder — most pujas offer the same three choices,
// scaled to that puja's own package pricing.
function samagriOptionsFor(standardPrice: number): SamagriChoice[] {
  const withoutDelta = -Math.round(standardPrice * 0.16);
  const allItemsDelta = Math.round(standardPrice * 0.28);
  return [
    {
      id: "with-samagri",
      label: "With Pooja Samagri",
      priceAdd: 0,
      description: "All core ritual items included — pandit ji arrives fully prepared.",
      items: ["Kalash, coconut & mango leaves", "Roli, chawal, moli & havan samagri", "Diya, camphor & incense", "Flowers & basic prasad ingredients"],
    },
    {
      id: "without-samagri",
      label: "Without Pooja Samagri",
      priceAdd: withoutDelta,
      description: "You arrange the items yourself — pandit ji brings only their own ritual tools.",
      items: ["You'll need to arrange all puja items", "A checklist is shared 48 hours before", "Best if you already keep items at home"],
    },
    {
      id: "with-samagri-all-items",
      label: "With Pooja Samagri & All Items",
      priceAdd: allItemsDelta,
      description: "Everything included, right down to fruits, sweets and decor — you arrange nothing.",
      items: ["Everything in 'With Pooja Samagri'", "Fresh fruits, sweets & full prasad spread", "Flower decoration for the puja space", "Extra havan samagri for a longer havan"],
    },
  ];
}

function packagesFor(base: number, name: string): PujaPackage[] {
  const premium = Math.round((base * 1.6) / 100) * 100;
  const grand = Math.round((base * 2.4) / 100) * 100;
  return [
    {
      tier: "Standard",
      price: base,
      description: `Core ${name} rituals performed correctly and completely — nothing skipped, nothing extra.`,
      inclusions: ["1 experienced Pandit ji", "All mandatory rituals & mantras", "Aarti and prasad vitran", "Approx. 1.5–2 hrs duration"],
    },
    {
      tier: "Premium",
      price: premium,
      description: `Everything in Standard, plus a fuller havan and a second pandit for smoother flow.`,
      inclusions: ["2 Pandit ji", "Extended havan with more aahutis", "Sankalp customized to your gotra & nakshatra", "Photos/video-friendly pacing"],
    },
    {
      tier: "Grand",
      price: grand,
      description: `The complete experience — larger team, longer havan, and added rituals for a bigger occasion.`,
      inclusions: ["3+ Pandit ji", "Extended Vedic path alongside the havan", "Additional related rituals on request", "Full ritual setup guidance for larger gatherings"],
    },
  ];
}

export const pujas: Puja[] = [
  {
    slug: "griha-pravesh-puja",
    name: "Griha Pravesh Puja",
    categories: ["Ghar Pe Puja", "On Request Puja"],
    tagline: "Begin your new home on the right note.",
    whyNeeded:
      "Griha Pravesh marks the first formal entry into a new home and is performed to clear the space of negative energy while inviting prosperity and peace for the family that will live there. It is traditionally done before moving belongings in, and is considered one of the most important sanskars around a new house or apartment.",
    duration: "1.5–2 hrs",
    team: "1 Pandit ji",
    icon: "home",
    accentColor: "bg-amber-100",
    textColor: "text-amber-700",
    image: wikimediaImage("Dagdusheth Ganesh Idol, Miraj Market.jpg"),
    image2: wikimediaImage("Griha Pravesh Puja Ceremony.jpg"),
    packages: packagesFor(2800, "Griha Pravesh"),
    samagriOptions: samagriOptionsFor(2800),
    advantages: [
      "Removes negative energy from the new home before you move in",
      "Invites the blessings of Vastu Purush and Lord Ganesha for the household",
      "Sets a peaceful, auspicious tone for everyone who will live there",
    ],
    vidhi: [
      { step: "Sankalp & Kalash Sthapana", description: "The pandit takes a formal vow on your behalf and installs the sacred kalash at the entrance." },
      { step: "Ganesh & Vastu Puja", description: "Worship of Lord Ganesha and the Vastu Purush to seek permission and blessings for the dwelling." },
      { step: "Havan", description: "A fire ritual invoking prosperity and protection for the household." },
      { step: "Griha Pravesh & Aarti", description: "Formal entry into the home followed by aarti and prasad distribution." },
    ],
    faqs: [
      { question: "Can Griha Pravesh be done for a rented flat?", answer: "Yes — it's just as commonly performed for rented homes as owned ones. The ritual focuses on the space itself, not ownership." },
      { question: "Do we need to move in on the same day?", answer: "It's traditional to move key belongings in on the day of the puja, but the pandit can guide you on what's essential versus flexible for your schedule." },
      { question: "Is there a specific auspicious date required?", answer: "Yes, Griha Pravesh is usually timed to a Muhurat. Let us know your preferred dates and we'll help confirm a suitable one." },
    ],
  },
  {
    slug: "satyanarayan-puja",
    name: "Satyanarayan Puja",
    categories: ["Ghar Pe Puja", "Online Puja"],
    tagline: "A puja of gratitude, for any happy occasion.",
    whyNeeded:
      "Satyanarayan Puja is performed to seek the blessings of Lord Vishnu in his Satyanarayan form, typically to mark a happy milestone — a new home, a wedding anniversary, recovery from illness, or simply gratitude for the year gone by. It's one of the most commonly performed home pujas across Hindu households.",
    duration: "2–2.5 hrs",
    team: "1 Pandit ji",
    icon: "sparkles",
    accentColor: "bg-orange-100",
    textColor: "text-orange-700",
    image: wikimediaImage("Idol of Lord Vishnu in Chennakeshava Temple, Somnath Pura.jpg"),
    image2: wikimediaImage("Satyanarayan Pooja.jpg"),
    packages: packagesFor(2400, "Satyanarayan Puja"),
    samagriOptions: samagriOptionsFor(2400),
    advantages: [
      "Invokes Lord Vishnu's blessings for peace, prosperity and family harmony",
      "A meaningful way to mark and give thanks for a happy occasion",
      "Brings the whole family together for a shared, positive ritual",
    ],
    vidhi: [
      { step: "Sankalp", description: "A formal statement of intent for the puja, along with your family's names and gotra." },
      { step: "Kalash & Panchamrit Snan", description: "Installation of the kalash and ceremonial bathing of the deity idol/image." },
      { step: "Katha", description: "Narration of the Satyanarayan Katha — the story behind the puja's significance." },
      { step: "Aarti & Prasad Vitran", description: "Closing aarti followed by distribution of the signature sheera (halwa) prasad." },
    ],
    faqs: [
      { question: "What day is best for Satyanarayan Puja?", answer: "It's traditionally done on a Purnima (full moon) or a Sankranti, but can be performed any day that suits your family." },
      { question: "Can this be done online instead of at home?", answer: "Yes — many families now do this over a live video call with the pandit guiding them through each step in real time." },
      { question: "Is fasting required before the puja?", answer: "It's customary but not mandatory. The pandit can advise on a simple pre-puja routine if you'd like to observe it." },
    ],
  },
  {
    slug: "rudrabhishek-puja",
    name: "Rudrabhishek Puja",
    categories: ["Ghar Pe Puja", "On Request Puja"],
    tagline: "A powerful abhishek for Lord Shiva's blessings.",
    whyNeeded:
      "Rudrabhishek involves ceremonial bathing of the Shiva Lingam with milk, honey, water, and other sacred substances while chanting the Rudri mantras. It's performed for health, removal of obstacles, and inner peace, and is especially popular during Shravan month and on Mondays.",
    duration: "1.5–2 hrs",
    team: "1 Pandit ji",
    icon: "flame",
    accentColor: "bg-slate-100",
    textColor: "text-slate-700",
    image: wikimediaImage(
      "Lord Shiva devotees offering milk, flowers, fruits and bel leaves on a Shivaling for seeking divine blessings, in a city temple at the celebration of Maha Shivaratri, in New Delhi on February 23, 2009 (1).jpg"
    ),
    image2: wikimediaImage("Bilva fruit and leaves to Shiva Linga.jpg"),
    packages: packagesFor(3200, "Rudrabhishek"),
    samagriOptions: samagriOptionsFor(3200),
    advantages: [
      "Believed to reduce the effects of ill-health and long-standing obstacles",
      "Brings a calm, grounded mental state through Rudri chanting",
      "Well suited to Shravan month, Mahashivratri or personal difficult periods",
    ],
    vidhi: [
      { step: "Sankalp", description: "Intent for the abhishek is stated, along with the specific concern it's aimed at addressing." },
      { step: "Panchamrit Abhishek", description: "Ceremonial bathing of the Shiva Lingam with milk, curd, honey, ghee and sugar." },
      { step: "Rudri Path", description: "Chanting of the Rudri mantras from the Yajurveda through the abhishek." },
      { step: "Aarti & Prasad", description: "Closing aarti and distribution of prasad." },
    ],
    faqs: [
      { question: "Do I need my own Shiva Lingam at home?", answer: "A small Lingam is arranged as part of the samagri if you don't have one — let us know when booking." },
      { question: "Is Rudrabhishek only for Shravan month?", answer: "No, it can be performed any time, though Shravan Mondays and Mahashivratri are considered especially auspicious." },
      { question: "How many Rudri chants (Ekadash/Laghu Rudra) are included?", answer: "The Standard package includes one round (Ekadashani); larger rounds like Laghu Rudra are available in the Grand package." },
    ],
  },
  {
    slug: "navgraha-shanti-puja",
    name: "Navgraha Shanti Puja",
    categories: ["Ghar Pe Puja", "On Request Puja"],
    tagline: "Pacify the nine planets, ease their tougher effects.",
    whyNeeded:
      "Navgraha Shanti Puja is performed to pacify the nine planetary deities — Surya, Chandra, Mangal, Budh, Guru, Shukra, Shani, Rahu and Ketu — when a chart shows a challenging planetary period. It's commonly recommended alongside a birth chart reading when a specific planet needs remedial attention.",
    duration: "2–2.5 hrs",
    team: "1 Pandit ji",
    icon: "orbit",
    accentColor: "bg-indigo-100",
    textColor: "text-indigo-700",
    image: wikimediaImage("Navagraha Pooja.jpg"),
    image2: wikimediaImage("Sculpture of Surya, the Sun God.jpg"),
    packages: packagesFor(3500, "Navgraha Shanti"),
    samagriOptions: samagriOptionsFor(3500),
    advantages: [
      "Addresses the effects of a specific troublesome planet in your chart",
      "Commonly paired with a birth chart or Dasha reading for targeted remedy",
      "A structured, traditional alternative to gemstone-only remedies",
    ],
    vidhi: [
      { step: "Sankalp & Navgraha Sthapana", description: "The nine planetary deities are formally invoked and installed for the ritual." },
      { step: "Individual Graha Puja", description: "Each planet is worshipped with its associated mantra, colour, and offerings." },
      { step: "Havan", description: "A fire ritual dedicated to the planet(s) needing the most attention in your chart." },
      { step: "Aarti & Prasad", description: "Closing aarti and prasad distribution." },
    ],
    faqs: [
      { question: "Do I need a birth chart reading first?", answer: "It helps — knowing which planet needs attention makes the puja more targeted, but a general all-planet version is also available." },
      { question: "How is this different from Shani Shanti Puja specifically?", answer: "Navgraha Shanti addresses all nine planets together; if only Saturn is a concern, a focused Shani Puja may be more efficient — ask us and we'll advise." },
      { question: "How often should this be repeated?", answer: "Most families do this once when a difficult Dasha period begins, not on a recurring schedule." },
    ],
  },
  {
    slug: "kaal-sarp-dosh-nivaran-puja",
    name: "Kaal Sarp Dosh Nivaran Puja",
    categories: ["Ghar Pe Puja", "On Request Puja"],
    tagline: "A dedicated remedy for Kaal Sarp Dosh in the chart.",
    whyNeeded:
      "Kaal Sarp Dosh occurs when all seven classical planets sit between Rahu and Ketu in a birth chart, which some traditions associate with recurring delays and obstacles. This puja is performed as a remedial ritual for individuals whose chart shows this specific placement.",
    duration: "2–3 hrs",
    team: "1–2 Pandit ji",
    icon: "circle-dashed",
    accentColor: "bg-emerald-100",
    textColor: "text-emerald-700",
    image: wikimediaImage("Naga Lingam Lepakshi Temple Hindupur 3.jpg"),
    image2: wikimediaImage("BritishmuseumRahu.JPG"),
    packages: packagesFor(4200, "Kaal Sarp Dosh Nivaran"),
    samagriOptions: samagriOptionsFor(4200),
    advantages: [
      "A focused, traditional remedy for a specifically diagnosed chart placement",
      "Often performed at pilgrimage sites like Trimbakeshwar, also available at home",
      "Includes both Rahu-Ketu worship and a supporting havan",
    ],
    vidhi: [
      { step: "Chart Confirmation", description: "We recommend confirming the dosh with a birth chart reading before booking, so the ritual is genuinely relevant." },
      { step: "Sankalp & Naag Puja", description: "Worship of the serpent deities associated with Rahu and Ketu." },
      { step: "Rahu-Ketu Havan", description: "A fire ritual specifically addressing the Rahu-Ketu axis in your chart." },
      { step: "Aarti & Prasad", description: "Closing aarti and prasad distribution." },
    ],
    faqs: [
      { question: "How do I know if I actually have Kaal Sarp Dosh?", answer: "This requires checking your birth chart — we recommend a quick birth chart analysis first if you're not sure, so the remedy is actually relevant to you." },
      { question: "Is this the same as Trimbakeshwar-style Kaal Sarp Puja?", answer: "The core rituals are the same tradition; we perform it at your home or chosen location rather than requiring pilgrimage travel." },
      { question: "Does this guarantee removal of the dosh's effects?", answer: "We don't make guarantees about outcomes — this is offered as a traditional remedial practice, not a promise of results." },
    ],
  },
  {
    slug: "mundan-sanskar",
    name: "Mundan Sanskar",
    categories: ["Ghar Pe Puja", "On Request Puja"],
    tagline: "Your little one's first haircut, done right.",
    whyNeeded:
      "Mundan Sanskar is one of the sixteen traditional sanskars, marking a child's first haircut — usually between age one and three. It's believed to remove traits carried from past lives and bless the child with a fresh, positive start, alongside long life and good health.",
    duration: "1–1.5 hrs",
    team: "1 Pandit ji + barber (on request)",
    icon: "baby",
    accentColor: "bg-pink-100",
    textColor: "text-pink-700",
    image: wikimediaImage("Mundan.jpg"),
    image2: wikimediaImage("Hindu ritual of Head Shaving (Mundan).jpg"),
    packages: packagesFor(2100, "Mundan Sanskar"),
    samagriOptions: samagriOptionsFor(2100),
    advantages: [
      "Marks an important life milestone with proper Vedic rites",
      "Believed to bless the child with health, long life and clarity of mind",
      "Can be combined with a small family gathering at home",
    ],
    vidhi: [
      { step: "Sankalp", description: "The parents take a formal vow for the child's Mundan, stating the child's name and nakshatra." },
      { step: "Ganesh Puja", description: "Worship of Lord Ganesha before beginning any auspicious ritual for the child." },
      { step: "Mundan (Haircutting)", description: "The child's first haircut is performed, traditionally by a family elder or barber, guided by the pandit's timing." },
      { step: "Aarti & Prasad", description: "Closing aarti followed by blessings and prasad for everyone present." },
    ],
    faqs: [
      { question: "Do you also arrange the barber?", answer: "Yes, on request — just mention it when booking and we'll include a barber experienced with Mundan ceremonies." },
      { question: "Is there an ideal age for Mundan?", answer: "Most families do it between age 1 and 3, in odd years (1, 3, 5), though this can vary by family tradition." },
      { question: "What happens to the cut hair?", answer: "It's traditionally collected and later immersed in a river or buried near a tree — the pandit can guide you on this." },
    ],
  },
  {
    slug: "ganesh-puja",
    name: "Ganesh Puja",
    categories: ["Ghar Pe Puja", "Online Puja"],
    tagline: "Clear the way, before anything else begins.",
    whyNeeded:
      "Ganesh Puja is performed to invoke Lord Ganesha, the remover of obstacles, before starting anything new — a business, a project, a ceremony, or simply to seek clarity and smoother progress in ongoing efforts.",
    duration: "1–1.5 hrs",
    team: "1 Pandit ji",
    icon: "sparkles",
    accentColor: "bg-red-100",
    textColor: "text-red-700",
    image: wikimediaImage("Ganesh Photo - An image of Dancing Lord Ganesha.jpg"),
    image2: wikimediaImage("Devotees carrying Ganesh idols for immersion during Ganesh Chaturthi, India.jpg"),
    packages: packagesFor(1800, "Ganesh Puja"),
    samagriOptions: samagriOptionsFor(1800),
    advantages: [
      "Traditionally performed before starting any new venture or ceremony",
      "Believed to clear obstacles and bring smoother progress",
      "A short, simple puja suitable for any home or office",
    ],
    vidhi: [
      { step: "Sankalp", description: "A brief statement of intent — what the puja is being performed for." },
      { step: "Ganesh Avahan", description: "Invocation of Lord Ganesha into the idol or image used for the puja." },
      { step: "Shodashopachar Puja", description: "The sixteen-step traditional worship sequence, offered to Lord Ganesha." },
      { step: "Aarti & Prasad", description: "Closing aarti and modak or ladoo prasad distribution." },
    ],
    faqs: [
      { question: "Can this be done for an office or shop opening?", answer: "Yes — this is one of the most common pujas for a business or office opening, alongside Vastu Shanti." },
      { question: "How long before an event should this be done?", answer: "It's usually performed on the same day, right before the main event or activity begins." },
      { question: "Is modak required as prasad?", answer: "It's traditional but not mandatory — the pandit can guide you on suitable alternatives if needed." },
    ],
  },
  {
    slug: "diwali-puja",
    name: "Diwali Puja",
    categories: ["Ghar Pe Puja", "Online Puja"],
    tagline: "Lakshmi-Ganesh puja for the festival of lights.",
    whyNeeded:
      "Diwali Puja invokes Goddess Lakshmi and Lord Ganesha together on Diwali night, seeking prosperity, wisdom and the removal of obstacles for the year ahead. It's the most widely performed home puja of the year across Hindu households.",
    duration: "1–1.5 hrs",
    team: "1 Pandit ji",
    icon: "flame",
    accentColor: "bg-yellow-100",
    textColor: "text-yellow-700",
    image: wikimediaImage("108diyas.JPG"),
    image2: wikimediaImage("Goddess Lakshmi inside a home for Diwali Puja.jpg"),
    packages: packagesFor(2600, "Diwali Puja"),
    samagriOptions: samagriOptionsFor(2600),
    advantages: [
      "Invokes Lakshmi's blessings for prosperity through the year ahead",
      "A meaningful, guided version of the puja most families already do at home",
      "Includes proper Muhurat timing guidance for Lakshmi Puja night",
    ],
    vidhi: [
      { step: "Sankalp & Kalash Sthapana", description: "Formal intent-setting and installation of the kalash for the evening's puja." },
      { step: "Lakshmi-Ganesh Puja", description: "Joint worship of Goddess Lakshmi and Lord Ganesha with the traditional sixteen-step sequence." },
      { step: "Diya Lighting & Havan", description: "Lighting of diyas around the home followed by a short havan." },
      { step: "Aarti & Prasad", description: "Closing aarti sung together as a family, followed by prasad distribution." },
    ],
    faqs: [
      { question: "What time is best for Lakshmi Puja on Diwali?", answer: "Pradosh Kaal (dusk) on Amavasya night is considered most auspicious — we'll confirm the exact Muhurat window for your booking date." },
      { question: "Can this be done as a video call for family abroad?", answer: "Yes, our Online Puja option lets family members join over video call even if they can't be there in person." },
      { question: "Do you provide the diyas and rangoli materials?", answer: "The 'With Pooja Samagri & All Items' option includes diyas — rangoli materials can be added on request." },
    ],
  },
  {
    slug: "manglik-dosh-nivaran-puja",
    name: "Manglik Dosh Nivaran Puja",
    categories: ["Ghar Pe Puja", "On Request Puja"],
    tagline: "A traditional remedy before marriage matching.",
    whyNeeded:
      "Manglik Dosh occurs when Mars is placed in certain houses of a birth chart, which some traditions associate with friction in marriage. This puja is a remedial ritual typically performed before an engagement or wedding when one partner's chart shows this placement.",
    duration: "2–2.5 hrs",
    team: "1 Pandit ji",
    icon: "flame",
    accentColor: "bg-rose-100",
    textColor: "text-rose-700",
    image: wikimediaImage(
      "Navagraha (Nine Planets), Central India, Uttar Pradesh, 550-575 AD, sandstone relief - Worcester Art Museum - IMG 7564.JPG"
    ),
    image2: wikimediaImage("(A) Hindu wedding, Saptapadi ritual before Agni Yajna.jpg"),
    packages: packagesFor(5500, "Manglik Dosh Nivaran"),
    samagriOptions: samagriOptionsFor(5500),
    advantages: [
      "A traditional remedy considered before finalizing a marriage match",
      "Focused specifically on Mars (Mangal) placement in the chart",
      "Often paired with a Kundali Matching consultation for full clarity",
    ],
    vidhi: [
      { step: "Chart Confirmation", description: "We recommend confirming the Manglik placement through a Kundali Matching or birth chart session first." },
      { step: "Sankalp & Mangal Puja", description: "Formal worship of Mars (Mangal) with its associated mantras and offerings." },
      { step: "Havan", description: "A fire ritual specifically addressing the Mangal placement." },
      { step: "Aarti & Prasad", description: "Closing aarti and prasad distribution." },
    ],
    faqs: [
      { question: "Does this need to be done before Kundali Matching?", answer: "It's usually done after Manglik status is confirmed through matching, as a next step rather than a substitute for it." },
      { question: "Can this be done for either partner separately?", answer: "Yes, it's typically performed for whichever partner's chart shows the Manglik placement." },
      { question: "Is this puja binding on the marriage decision?", answer: "No — this is a traditional remedial ritual, not a requirement, and the final decision always rests with the families involved." },
    ],
  },
  {
    slug: "vastu-shanti-puja",
    name: "Vastu Shanti Puja",
    categories: ["Ghar Pe Puja", "On Request Puja"],
    tagline: "Set the energy right, before or after Vastu changes.",
    whyNeeded:
      "Vastu Shanti Puja is performed to harmonize a space with Vastu principles — often after a Vastu consultation identifies imbalances, or simply as a periodic ritual to keep a home or office energetically settled.",
    duration: "1.5–2 hrs",
    team: "1 Pandit ji",
    icon: "compass",
    accentColor: "bg-blue-100",
    textColor: "text-blue-700",
    image: wikimediaImage("A havan ceremony on the banks of Ganges, Muni ki Reti, Rishikesh.jpg"),
    image2: wikimediaImage("Vaastu Purusha Frontal.jpg"),
    packages: packagesFor(3100, "Vastu Shanti"),
    samagriOptions: samagriOptionsFor(3100),
    advantages: [
      "Pairs naturally with a Vastu consultation for spaces that can't be structurally changed",
      "Helps settle the energy of a space after renovation or a difficult period",
      "Suitable for both homes and commercial spaces",
    ],
    vidhi: [
      { step: "Sankalp & Vastu Purush Puja", description: "Formal worship of the Vastu Purush, the presiding energy of the built space." },
      { step: "Disha Shuddhi", description: "Directional purification rituals addressing specific corners flagged in a Vastu review." },
      { step: "Havan", description: "A fire ritual to settle and harmonize the space's overall energy." },
      { step: "Aarti & Prasad", description: "Closing aarti and prasad distribution." },
    ],
    faqs: [
      { question: "Do I need a Vastu consultation first?", answer: "It helps but isn't required — many families do this puja on its own, especially after moving in or during a renovation." },
      { question: "Is this different from Griha Pravesh?", answer: "Griha Pravesh is a one-time entry ritual for a new home; Vastu Shanti addresses ongoing energetic balance and can be repeated if needed." },
      { question: "Can this be done for a commercial office?", answer: "Yes, it's commonly performed for offices and shops, particularly after a layout change or a run of setbacks." },
    ],
  },
  {
    slug: "bhoomi-pujan",
    name: "Bhoomi Pujan",
    categories: ["Ghar Pe Puja", "On Request Puja"],
    tagline: "Seek the land's blessing before construction begins.",
    whyNeeded:
      "Bhoomi Pujan is performed before construction begins on a plot of land, seeking the blessings of Bhoomi Devi (the earth deity) and Vastu Purush for a safe, smooth building process ahead.",
    duration: "1.5–2 hrs",
    team: "1 Pandit ji",
    icon: "compass",
    accentColor: "bg-lime-100",
    textColor: "text-lime-700",
    image: wikimediaImage("(A) puja fire, Havanam.jpg"),
    image2: wikimediaImage("(A) Bhumi Puja, yajna.jpg"),
    packages: packagesFor(3300, "Bhoomi Pujan"),
    samagriOptions: samagriOptionsFor(3300),
    advantages: [
      "Seeks the earth's blessing before disturbing the land through construction",
      "Believed to support a safer, smoother construction process",
      "A traditional first step before laying the foundation",
    ],
    vidhi: [
      { step: "Sankalp & Bhoomi Puja", description: "Formal worship of Bhoomi Devi, seeking permission and blessing for the construction." },
      { step: "Shilanyas (Foundation Stone)", description: "Ceremonial placement of the first foundation stone at an auspicious spot." },
      { step: "Havan", description: "A fire ritual invoking a smooth, obstacle-free construction process." },
      { step: "Aarti & Prasad", description: "Closing aarti and prasad distribution to those present at the site." },
    ],
    faqs: [
      { question: "Should this be done before or after the land is cleared?", answer: "Typically right after the land is cleared but before any digging or foundation work begins." },
      { question: "Do you also help choose the Muhurat?", answer: "Yes — send us your preferred window of dates and we'll help identify a suitable Muhurat for Bhoomi Pujan." },
      { question: "Is this needed for renovation, or only new construction?", answer: "It's primarily for new construction; for renovations, a Vastu Shanti Puja is usually more relevant." },
    ],
  },
  {
    slug: "ashtami-navami-puja-havan",
    name: "Ashtami Navami Puja and Havan",
    categories: ["Ghar Pe Puja"],
    tagline: "Honour Maa Durga on Navratri's most auspicious days.",
    whyNeeded:
      "The eighth and ninth days of Navratri are considered especially auspicious for worshipping Maa Durga in her Mahagauri and Siddhidatri forms. This puja includes Kanya Pujan and a closing havan, marking the culmination of the nine-day festival.",
    duration: "2 hrs",
    team: "1 Pandit ji",
    icon: "sparkles",
    accentColor: "bg-fuchsia-100",
    textColor: "text-fuchsia-700",
    image: wikimediaImage("Durga Idol, Kolkata-04.jpg"),
    image2: wikimediaImage("Aarti of Goddess Durga.jpg"),
    packages: packagesFor(2200, "Ashtami Navami Puja"),
    samagriOptions: samagriOptionsFor(2200),
    advantages: [
      "Devotees receive the blessings of Maa Durga on the festival's most auspicious days",
      "Believed to help release family stress and anxiety accumulated over the year",
      "Maa Durga's strength and courage are invoked for the year ahead",
    ],
    vidhi: [
      { step: "Chowki Preparation & Sankalp", description: "Setup of the puja chowki and a formal statement of intent for the ritual." },
      { step: "Gauri Ganesh Puja", description: "Preliminary worship of Gauri and Ganesha before the main Devi puja." },
      { step: "Ashtami/Navami Puja & Kanya Pujan", description: "Main worship of Maa Durga along with the traditional Kanya Pujan." },
      { step: "Havan, Aarti & Prasad Vitran", description: "Closing havan, aarti, and distribution of prasad to the family and guests." },
    ],
    faqs: [
      { question: "Is Kanya Pujan included by default?", answer: "Yes, Kanya Pujan is part of the standard ritual sequence for this puja." },
      { question: "Should this be done on Ashtami or Navami specifically?", answer: "Many families do it on both days; if you can only do one, Navami is the more commonly chosen day." },
      { question: "How many young girls are needed for Kanya Pujan?", answer: "Traditionally nine, though the pandit can guide you on a suitable smaller number if that's not feasible." },
    ],
  },
  {
    slug: "annaprashan-sanskar-puja",
    name: "Annaprashan Sanskar Puja",
    categories: ["Ghar Pe Puja"],
    tagline: "Your baby's first taste of solid food, blessed.",
    whyNeeded:
      "Annaprashan Sanskar marks a baby's first solid meal, typically performed around six months of age. It's one of the sixteen traditional sanskars, celebrated with a small puja that blesses the child's health, growth and relationship with food ahead.",
    duration: "1–1.5 hrs",
    team: "1 Pandit ji",
    icon: "baby",
    accentColor: "bg-teal-100",
    textColor: "text-teal-700",
    image: wikimediaImage("AnnaPrashan (Anna Prashan) - Hindu First Rice Eating Ceremony.JPG"),
    image2: wikimediaImage("First Rice feeding Ceremony at Budhanilkanth Kathmandu Nepal 24.jpg"),
    packages: packagesFor(2300, "Annaprashan Sanskar"),
    samagriOptions: samagriOptionsFor(2300),
    advantages: [
      "Marks the baby's transition to solid food with proper Vedic rites",
      "Believed to bless the child with good health and growth",
      "A joyful, simple family occasion suited to a home setting",
    ],
    vidhi: [
      { step: "Sankalp", description: "The parents take a formal vow for the child's Annaprashan, naming the child and nakshatra." },
      { step: "Ganesh & Navgraha Puja", description: "Brief worship seeking blessings before the main ritual." },
      { step: "Annaprashan (First Feeding)", description: "The child is fed a small amount of kheer or rice by an elder, guided by the pandit's timing." },
      { step: "Aarti & Prasad", description: "Closing aarti and blessings shared with everyone present." },
    ],
    faqs: [
      { question: "What food is traditionally used for the first feeding?", answer: "Kheer (rice pudding) is most common, though some families use plain cooked rice with ghee — the pandit can guide you on your family's tradition." },
      { question: "What is the right age for Annaprashan?", answer: "Typically around six months, though some families follow their specific community's guidance on timing." },
      { question: "Who usually feeds the baby first?", answer: "Traditionally a grandparent or the eldest family member present, though this can vary by family." },
    ],
  },
  {
    slug: "ark-vivah",
    name: "Ark Vivah",
    categories: ["Ghar Pe Puja", "On Request Puja"],
    tagline: "A remedial pre-marriage ritual for certain chart placements.",
    whyNeeded:
      "Ark Vivah is a symbolic marriage ceremony performed with the Ark plant (Calotropis), used as a remedial ritual before a person's actual marriage when their chart shows specific doshas that traditions associate with marital delay or difficulty.",
    duration: "2–2.5 hrs",
    team: "1 Pandit ji",
    icon: "flame",
    accentColor: "bg-yellow-100",
    textColor: "text-yellow-800",
    image: wikimediaImage("Calotropis gigantea Flower.jpg"),
    image2: wikimediaImage("Calotropis Gigantea Plant.jpg"),
    packages: packagesFor(4601, "Ark Vivah"),
    samagriOptions: samagriOptionsFor(4601),
    advantages: [
      "A traditional remedy for specific chart doshas linked to marriage delay",
      "Performed once, ahead of the person's actual wedding",
      "Best booked alongside a birth chart reading to confirm relevance",
    ],
    vidhi: [
      { step: "Chart Confirmation", description: "We recommend confirming the relevant dosh through a birth chart reading before booking this ritual." },
      { step: "Sankalp & Ark Sthapana", description: "The Ark plant is installed and treated as the symbolic partner for the ceremony." },
      { step: "Vivah Rituals", description: "Core marriage-ceremony rituals are performed symbolically with the Ark plant." },
      { step: "Havan, Aarti & Prasad", description: "Closing havan, aarti, and prasad distribution." },
    ],
    faqs: [
      { question: "Is this a substitute for the real wedding?", answer: "No — it's a remedial ritual performed before the actual marriage, not a replacement for it." },
      { question: "How do I know if I need Ark Vivah specifically?", answer: "This is chart-specific — we recommend a birth chart reading first to confirm whether this particular remedy applies to you." },
      { question: "Is the Ark plant provided?", answer: "Yes, it's arranged as part of the puja samagri." },
    ],
  },
];

export function getPujaBySlug(slug: string): Puja | undefined {
  return pujas.find((p) => p.slug === slug);
}

export function relatedPujas(current: Puja, count = 4): Puja[] {
  return pujas
    .filter((p) => p.slug !== current.slug && p.categories.some((c) => current.categories.includes(c)))
    .slice(0, count);
}

export function formatINR(n: number): string {
  return `₹${Math.max(0, Math.round(n)).toLocaleString("en-IN")}`;
}

export const pujaCategories: PujaCategory[] = ["Ghar Pe Puja", "Online Puja", "On Request Puja"];

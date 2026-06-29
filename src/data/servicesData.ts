// src/data/servicesData.ts
// Drop this file in src/data/ and import from anywhere in the project.

export type DeliveryMode = "Call" | "Chat" | "Report";

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface Service {
  slug: string;
  name: string;
  tagline: string;
  shortDesc: string;       // used in service cards (2–3 lines)
  heroDesc: string;        // used in the detail page hero paragraph
  duration: string;        // e.g. "45–60 min" or "Delivered in 24–48 hrs"
  deliveryModes: DeliveryMode[];
  icon: string;            // tabler icon name (without "ti-"), e.g. "chart-dots"
  accentColor: string;     // tailwind bg class for the icon background
  textColor: string;       // tailwind text class for the icon
  whatYouGet: string[];    // bullet list of what's included
  whoIsItFor: string[];    // ideal customer profiles
  whatToExpect: {
    step: string;
    description: string;
  }[];
  faqs: ServiceFAQ[];
  startingFrom?: string;   // e.g. "₹799" — optional, add when pricing is ready
}

export const services: Service[] = [
  {
    slug: "birth-chart-analysis",
    name: "Birth chart analysis",
    tagline: "The complete picture of who you are and where you are headed.",
    shortDesc:
      "A full Vedic reading of your birth chart covering personality, strengths, life patterns, health, relationships, and the road ahead — built on your exact birth moment.",
    heroDesc:
      "Your birth chart is the most precise map of your inner world ever devised. Cast from the exact second and location of your birth, it encodes the planetary positions that shaped your temperament, your gifts, your recurring challenges, and the rhythm of your life's unfolding. Our astrologers read this chart in the classical Parashari tradition — no algorithms, no automated reports. You receive a living conversation with someone who has spent years learning to read what the chart is actually saying.",
    duration: "60–90 min or written report",
    deliveryModes: ["Call", "Chat", "Report"],
    icon: "chart-dots",
    accentColor: "bg-amber-100",
    textColor: "text-amber-700",
    whatYouGet: [
      "Full Lagna (ascendant) and planetary position analysis",
      "Personality strengths and natural tendencies",
      "Health sensitivities and recommended lifestyle adjustments",
      "Career aptitudes and favourable fields",
      "Relationship patterns and emotional landscape",
      "Current Dasha (planetary period) and its meaning for you right now",
      "Written summary delivered after the session",
    ],
    whoIsItFor: [
      "Anyone seeking a deep, honest understanding of themselves",
      "People at a crossroads — career, relationship, or life direction",
      "Those who have had readings before but want a more thorough one",
      "People who feel they live against the grain and want to understand why",
    ],
    whatToExpect: [
      {
        step: "Share your birth details",
        description:
          "Date, time, and place of birth. Accurate birth time gives us the most precise chart — within 15 minutes is ideal, but we work with what you have.",
      },
      {
        step: "We prepare the chart",
        description:
          "An astrologer studies your chart before the session — not during it. We arrive knowing the chart, so the session is a conversation, not a cold reading.",
      },
      {
        step: "Your session",
        description:
          "A 60–90 minute conversation covering the key themes of your chart. You can ask questions, go deeper on anything, or redirect us to what matters most to you.",
      },
      {
        step: "Written follow-up",
        description:
          "Key insights, timing notes, and any remedies discussed are summarised in writing and sent to you after the session.",
      },
    ],
    faqs: [
      {
        question: "How important is an accurate birth time?",
        answer:
          "Very important for ascendant and house calculations — a 2-hour difference can change the entire chart. If you don't know your exact time, we can work with an approximate time and note the uncertainty, or we can use a technique called birth-time rectification to narrow it down.",
      },
      {
        question: "Which system do you use — KP, Nadi, or Parashari?",
        answer:
          "Our primary system is Parashari, which is the classical foundation of Vedic astrology. For specific questions where KP or Nadi methods offer additional insight, our astrologers integrate those perspectives as well.",
      },
      {
        question: "Can I ask about a specific area of life only?",
        answer:
          "Yes. While the birth chart analysis is designed to be comprehensive, if you want to focus on one area — say, career or relationships — just let us know when you book and the astrologer will give that area deeper attention.",
      },
    ],
  },

  {
    slug: "career-business-guidance",
    name: "Career & business guidance",
    tagline: "Stop guessing your timing. Start reading it.",
    shortDesc:
      "Dasha timelines and 10th house analysis to identify when to push, when to wait, and which direction actually fits your chart — for job changes, entrepreneurship, and major career decisions.",
    heroDesc:
      "Career decisions are consequential and rarely reversible in the short term. The question isn't just which direction is right — it's whether the timing is right. Vedic astrology has a remarkably precise system for timing called Dasha, which maps planetary period cycles onto your life's actual rhythm. We use Dasha analysis alongside your 10th house (career and public life) to identify periods of natural growth, transition, and consolidation. This is not generic advice. It is rooted in your specific chart.",
    duration: "45–60 min",
    deliveryModes: ["Call", "Chat"],
    icon: "briefcase",
    accentColor: "bg-blue-100",
    textColor: "text-blue-700",
    whatYouGet: [
      "10th house analysis — your natural professional strengths and fields",
      "Current Dasha period reading and its career implications",
      "Upcoming planetary transitions and their likely timing",
      "Best periods to take action vs. consolidate and prepare",
      "Business vs. employment — which suits your chart and when",
      "Honest assessment of sectors that align with your planetary placements",
    ],
    whoIsItFor: [
      "Professionals considering a job change or industry switch",
      "Entrepreneurs wondering whether this is the right time to start",
      "People feeling stuck or under-recognised despite hard work",
      "Anyone about to make a major career decision and wanting clarity on timing",
    ],
    whatToExpect: [
      {
        step: "Tell us your situation",
        description:
          "When you book, briefly describe where you are and what decision you are facing. This helps us arrive focused on what actually matters to you.",
      },
      {
        step: "Chart preparation",
        description:
          "We review your 10th house, current Dasha, and upcoming transits before the session — so the conversation starts with insights, not setup.",
      },
      {
        step: "Your session",
        description:
          "A focused 45–60 minute conversation on career and timing. We tell you what we see — including things that might not be what you hoped to hear — and give you specific time windows to work with.",
      },
    ],
    faqs: [
      {
        question: "Can astrology tell me which job offer to take?",
        answer:
          "Not in the sense of 'take offer A, not B.' But it can tell you whether this is a period of growth or consolidation for you, which environments suit your temperament, and whether the timing of a specific move is supported. That context usually makes the decision much clearer.",
      },
      {
        question: "I want to start a business — is this the right time?",
        answer:
          "This is one of the most common questions we address. We look at entrepreneurial indicators in your chart and your current Dasha to assess how supported this period is for a new venture. We also look at 3rd, 5th, and 11th house factors for risk appetite and gain potential.",
      },
      {
        question: "What if I am not working right now?",
        answer:
          "That context is actually very useful. Periods of pause or transition often show up clearly in the Dasha — and knowing that it's a chart-supported phase of preparation versus one that calls for action is valuable in itself.",
      },
    ],
  },

  {
    slug: "love-relationship-guidance",
    name: "Love & relationship guidance",
    tagline: "Understand the bonds that shape you.",
    shortDesc:
      "Relationship dynamics, emotional compatibility, and the patterns that play out between people — whether you are navigating a partnership, seeking one, or trying to understand why the same thing keeps happening.",
    heroDesc:
      "Relationships are the most personal territory in astrology. The way planets are placed in your chart shapes how you love, what you need in a partner, how you handle conflict, and the patterns you attract. Whether you want to understand a specific relationship, make sense of a painful ending, or simply understand your own relational tendencies, this session works from your chart outward. When both partners' charts are available, we look at synastry — how the planetary energies interact and what that means for the relationship's actual dynamics.",
    duration: "45–60 min or written report",
    deliveryModes: ["Call", "Chat", "Report"],
    icon: "heart",
    accentColor: "bg-pink-100",
    textColor: "text-pink-700",
    whatYouGet: [
      "Your 7th house analysis — what you seek and attract in relationships",
      "Venus and Moon placement readings for emotional needs and expression",
      "Relationship patterns from your chart and their roots",
      "Synastry reading (if both charts are available)",
      "Current planetary period influence on your relationship life",
      "Honest guidance on timing — periods of connection vs. distance",
    ],
    whoIsItFor: [
      "Couples wanting to understand each other at a deeper level",
      "Individuals reflecting on a recurring pattern in relationships",
      "People navigating a difficult or uncertain relationship",
      "Those who are single and want to understand what they are actually looking for",
    ],
    whatToExpect: [
      {
        step: "Share your details",
        description:
          "Your birth details are required. If you want synastry, share your partner's details too. You don't need your partner's consent to look at your own chart's relational patterns.",
      },
      {
        step: "Chart review",
        description:
          "We study the relational signatures in your chart — 7th house, Venus, Moon, and nodal axis — before the session.",
      },
      {
        step: "Your session",
        description:
          "A conversation about what the chart reveals — and what it doesn't. We do not tell you whether to stay or leave. We help you see the dynamics more clearly so you can decide for yourself.",
      },
    ],
    faqs: [
      {
        question: "Can you tell me if this relationship will work out?",
        answer:
          "Astrology shows tendencies, not certainties. We can tell you about the compatibility patterns between two charts, the strengths and friction points of a synastry, and what the current planetary periods suggest. What you do with that is entirely yours to decide.",
      },
      {
        question: "My partner doesn't believe in astrology. Can we still do this?",
        answer:
          "Yes — your own chart holds a great deal about your relational patterns without needing your partner's details at all. Synastry adds a layer, but it is not required.",
      },
      {
        question: "Is this the same as Kundali Matching?",
        answer:
          "No. Kundali Matching (Guna Milan) is a specific pre-marriage compatibility assessment rooted in a traditional 36-point system. Relationship guidance is broader — it's about understanding the actual dynamics at play, whether you are in a relationship or not. We offer Kundali Matching as a separate service.",
      },
    ],
  },

  {
    slug: "kundali-matching",
    name: "Kundali matching",
    tagline: "The classical view, explained honestly.",
    shortDesc:
      "Traditional Guna Milan with a modern interpretation — what the compatibility score actually means, where alignment exists, and what to watch for. For couples and families navigating marriage decisions.",
    heroDesc:
      "Kundali Matching is one of the oldest and most widely used tools in Vedic astrology for assessing marriage compatibility. The classical system assigns points across 8 categories (Ashta Koota Milan), producing a score out of 36. But the score is only one part of the picture — and often misused. We provide the full Guna Milan reading alongside a plain-language explanation of what each category means, where genuine compatibility exists, where friction might arise, and how to work with it. No fearmongering about Manglik dosha or bad scores without context.",
    duration: "45–60 min or written report",
    deliveryModes: ["Call", "Report"],
    icon: "users",
    accentColor: "bg-purple-100",
    textColor: "text-purple-700",
    whatYouGet: [
      "Complete Ashta Koota Milan (36-point compatibility analysis)",
      "Explanation of all 8 categories in plain language",
      "Manglik status assessment with proper contextual interpretation",
      "Navamsha chart reading for deeper marriage compatibility",
      "Dashas at the time of proposed marriage and what they indicate",
      "Written report delivered within 48 hours",
    ],
    whoIsItFor: [
      "Couples or families considering marriage and wanting the traditional assessment",
      "People who have received a Kundali report elsewhere and want an honest second opinion",
      "Those who were told they have a 'bad' score and want to understand what it actually means",
      "Anyone who wants the classical view explained without fear or pressure",
    ],
    whatToExpect: [
      {
        step: "Share both charts",
        description:
          "We need birth date, time, and place for both individuals. The more accurate the birth times, the more precise the reading.",
      },
      {
        step: "Full report preparation",
        description:
          "We prepare a written Kundali Matching report covering all 8 Koota categories, Manglik status, and Navamsha analysis. This takes 24–48 hours.",
      },
      {
        step: "Report delivery + optional call",
        description:
          "You receive the written report first. A follow-up call to discuss it in detail is available and recommended — reading a report alone can raise more questions than it answers.",
      },
    ],
    faqs: [
      {
        question: "Our score is below 18. Should we be worried?",
        answer:
          "Not necessarily. The 18/36 threshold is one guideline, not a verdict. A score below 18 with certain strong placements can be more compatible than a score of 28 with problematic Navamsha patterns. The score is the beginning of the analysis, not the end.",
      },
      {
        question: "What is Manglik dosha and how serious is it?",
        answer:
          "Manglik dosha occurs when Mars is in certain houses. It is frequently overstated — and frequently used to create fear and sell remedies. We give you the actual classical interpretation of the placement in your chart, in context, without creating unnecessary anxiety.",
      },
      {
        question: "Can same-sex couples use this service?",
        answer:
          "Yes. The planetary analysis applies to both charts regardless of gender. We adapt the classical framework where needed and focus on what the charts actually reveal about compatibility and harmony.",
      },
    ],
  },

  {
    slug: "gemstone-remedies",
    name: "Gemstone & remedies",
    tagline: "Tools for working with your planetary energies, not against them.",
    shortDesc:
      "Personalised gemstone, mantra, colour, and fasting recommendations rooted in your actual chart — never a generic list. Based on Parashari and Lal Kitab traditions.",
    heroDesc:
      "Remedies in Vedic astrology are not fixes for bad luck. They are tools for working more consciously with the planetary energies that are already active in your chart. A gemstone recommendation that doesn't come from a careful reading of your chart — your rising sign, your current Dasha, the strength of specific planets — is not a recommendation. It's a guess. Our remedy suggestions are derived from a full reading of your chart and tailored to your current planetary period, not a product catalogue.",
    duration: "Written Report",
    deliveryModes: ["Call", "Report"],
    icon: "diamond",
    accentColor: "bg-teal-100",
    textColor: "text-teal-700",
    whatYouGet: [
      "Gemstone recommendation based on your rising sign and current Dasha",
      "Clarity on which planets to strengthen and which to pacify in your chart",
      "Mantra recommendations suited to your planetary placements",
      "Colour therapy and directional suggestions from Vastu-astrology",
      "Fasting recommendations where relevant",
      "Guidance on what to avoid — not everything sold as a remedy is beneficial for your chart",
    ],
    whoIsItFor: [
      "People who have been told to wear a gemstone and want to verify it's right for them",
      "Those going through a difficult Dasha period and looking for supportive practices",
      "People who already do spiritual practices and want to align them with their chart",
      "Anyone who wants a remedy consultation without the upselling",
    ],
    whatToExpect: [
      {
        step: "Chart review",
        description:
          "We study your birth chart with specific attention to planetary strengths, the current Dasha sequence, and which energies are most active for you right now.",
      },
      {
        step: "Remedy assessment",
        description:
          "We identify what would genuinely support your chart — and what is unnecessary or potentially counterproductive. Not every chart needs a gemstone.",
      },
      {
        step: "Written recommendations",
        description:
          "A written list of specific, practical remedies with clear guidance on how and when to use them. No vague instructions.",
      },
    ],
    faqs: [
      {
        question: "Do I have to buy a gemstone from you?",
        answer:
          "No. We do not sell gemstones. We give you the recommendation and guidance on quality, weight, and how to identify authentic stones — and leave the purchase to you.",
      },
      {
        question: "Can remedies change the outcomes shown in my chart?",
        answer:
          "Remedies work by helping you align with planetary energies rather than resist them. They can shift your orientation, reduce friction, and support certain qualities in yourself. They do not override free will or guarantee specific outcomes.",
      },
      {
        question: "I was told I need to wear multiple gemstones. Is that normal?",
        answer:
          "Wearing multiple stones simultaneously can sometimes create conflicting energies. A careful reading usually identifies one or two key stones at most. If you've been told you need five, we'd recommend a second opinion.",
      },
    ],
  },

  {
    slug: "vastu-consultation",
    name: "Vastu consultation",
    tagline: "Space shapes energy. Energy shapes everything.",
    shortDesc:
      "Home and workplace energy analysis using Vastu Shastra — the classical Indian system of spatial harmony. Direction, layout, and practical adjustments for your specific space.",
    heroDesc:
      "Vastu Shastra is the classical Indian science of spatial energy — older than most architectural traditions on the planet. It maps the directional energies of a space against the five elements and their influence on the people who live or work within it. A Vastu consultation for your home or office is not about demolition or massive renovation. Most effective adjustments are practical and require no structural changes: placement of objects, directional shifts, colour choices, and clearing specific areas. The goal is to make your space support rather than subtly work against the life you are trying to build.",
    duration: "45–60 min + written report",
    deliveryModes: ["Call", "Report"],
    icon: "home",
    accentColor: "bg-green-100",
    textColor: "text-green-700",
    whatYouGet: [
      "Analysis of your floor plan or space layout against Vastu principles",
      "Directional energy mapping (eight compass directions and central zone)",
      "Identification of beneficial and challenging zones in your space",
      "Practical adjustments — placement, colours, elements — with no structural changes required",
      "Bedroom, kitchen, and workspace-specific guidance",
      "Written report with an annotated layout summary",
    ],
    whoIsItFor: [
      "People moving into a new home or office and wanting to set it up well",
      "Those who feel their current space carries a heavy or stuck energy",
      "Business owners experiencing persistent challenges despite strong effort",
      "Families going through a period of friction or difficulty since moving",
    ],
    whatToExpect: [
      {
        step: "Share your space details",
        description:
          "A floor plan or sketch of your home or office, along with compass directions (a phone compass app works). Photos of key areas are helpful.",
      },
      {
        step: "Energy mapping",
        description:
          "We map the directional zones of your space against the Vastu Purusha Mandala and identify which areas are well-placed and which may need attention.",
      },
      {
        step: "Consultation and report",
        description:
          "A call to walk through the findings together, followed by a written report with specific, practical adjustments listed by priority.",
      },
    ],
    faqs: [
      {
        question: "Do I need to break down walls to follow Vastu?",
        answer:
          "Almost never. Structural changes are a last resort and often unnecessary. Most Vastu corrections involve repositioning furniture, introducing specific elements (earth, water, metal, wood, fire in modest forms), or adjusting colours — all of which can be done practically and affordably.",
      },
      {
        question: "Can Vastu help with a rented apartment?",
        answer:
          "Yes. The principles apply regardless of ownership. We focus on what you can practically change as a tenant.",
      },
      {
        question: "Does Vastu work for offices and commercial spaces?",
        answer:
          "Yes — and it is particularly relevant for business spaces where the energy of the environment directly affects productivity, team dynamics, and client experience.",
      },
    ],
  },

  {
    slug: "tarot-numerology",
    name: "Tarot & numerology",
    tagline: "Focused clarity for specific questions.",
    shortDesc:
      "Tarot readings and numerology analysis for targeted guidance — a specific question, a decision, a period of uncertainty. Precise and practical, not theatrical.",
    heroDesc:
      "Tarot and numerology operate on different principles than Vedic astrology but serve a related purpose: bringing clarity to a specific question or period. Tarot works particularly well for questions that don't have a clean Vedic astrology answer — interpersonal dynamics, the emotional weight of a situation, or a decision you need to examine from multiple angles. Numerology uses the patterns in your birth date and name to reveal life path, expression, and personal year cycles. These are tools we offer for people who want focused insight rather than a full chart reading.",
    duration: "30–45 min",
    deliveryModes: ["Call", "Chat"],
    icon: "cards",
    accentColor: "bg-orange-100",
    textColor: "text-orange-700",
    whatYouGet: [
      "Tarot spread tailored to your specific question or situation",
      "Plain-language card interpretation — no mystification",
      "Numerological life path and expression number analysis",
      "Personal year cycle for the current year",
      "Practical guidance based on the reading",
      "Written notes of the key cards and interpretations",
    ],
    whoIsItFor: [
      "People with one specific question they need clarity on",
      "Those going through a period of uncertainty who want a focused reading",
      "People curious about numerology and what their numbers reveal",
      "Anyone who wants a shorter, more targeted session than a full chart reading",
    ],
    whatToExpect: [
      {
        step: "Bring your question",
        description:
          "The more specific your question, the more useful the reading. 'What should I do about my job?' works less well than 'I have two offers — help me see this situation more clearly.'",
      },
      {
        step: "The reading",
        description:
          "A conversational session where cards are laid and interpreted in response to your question. You can ask follow-up questions or redirect the focus.",
      },
      {
        step: "Written notes",
        description:
          "Key cards, positions, and interpretations noted and sent to you after the session.",
      },
    ],
    faqs: [
      {
        question: "Do you predict specific events with tarot?",
        answer:
          "Tarot is better at revealing dynamics, energies, and likely trajectories than predicting specific events with dates. Think of it as a lens rather than a crystal ball.",
      },
      {
        question: "Can I ask multiple questions in one session?",
        answer:
          "Yes, though one focused question yields more depth than five quick ones. We'll work with what you bring and tell you when depth is better served by narrowing down.",
      },
      {
        question: "Is numerology based on my name or birth date?",
        answer:
          "Both. Your birth date gives your Life Path number — the core direction of your life. Your full name (as given at birth) gives your Expression number — the capabilities and character you bring to that path. We use both.",
      },
    ],
  },

  {
    slug: "spiritual-healing",
    name: "Spiritual & healing guidance",
    tagline: "Practical support for the inner journey.",
    shortDesc:
      "Spiritual guidance, healing practices, puja consultation, and muhurat selection — for those seeking support that goes beyond the analytical and into the lived spiritual experience.",
    heroDesc:
      "Not every need is answered by a chart reading. Some people come to us in a period of grief, of spiritual searching, of feeling that something in their inner life needs attention they cannot name. This service is for that territory. We offer guidance on appropriate spiritual practices for your chart and life period, puja (ritual) consultations for specific intentions, Muhurat selection for auspicious timing of important events, and a grounded space to discuss what you are going through. We do not make claims about healing or guarantee outcomes. We offer a thoughtful, honest companion for this kind of work.",
    duration: "45–60 min",
    deliveryModes: ["Call", "Report"],
    icon: "flame",
    accentColor: "bg-red-100",
    textColor: "text-red-700",
    whatYouGet: [
      "Spiritual practice recommendations suited to your chart and current life period",
      "Puja consultation — which practice, how to approach it, what it is for",
      "Muhurat selection for weddings, new ventures, housewarming, or other significant events",
      "Guidance on working with difficult planetary periods through spiritual practice",
      "An honest, unhurried conversation about where you are",
    ],
    whoIsItFor: [
      "People going through a difficult life period and seeking spiritual grounding",
      "Those who want to deepen an existing practice and align it with their chart",
      "Families planning significant events and wanting auspicious timing",
      "Anyone who feels called to this kind of support but isn't sure where to start",
    ],
    whatToExpect: [
      {
        step: "Tell us what you are navigating",
        description:
          "There is no wrong way to begin. Share what is present for you — a life event, a question, a feeling, or a specific request like Muhurat selection.",
      },
      {
        step: "Chart review (where relevant)",
        description:
          "For practice recommendations and Muhurat, we work from your birth chart. For more conversational spiritual guidance, this is secondary.",
      },
      {
        step: "Your session",
        description:
          "A grounded, unhurried conversation. We follow your lead and offer what we genuinely think is useful rather than what sounds impressive.",
      },
    ],
    faqs: [
      {
        question: "What is Muhurat selection?",
        answer:
          "Muhurat is the selection of an auspicious time for a significant action — starting a business, getting married, buying a home, signing a contract. Vedic astrology has a detailed system for identifying windows when planetary conditions are most supportive for a specific type of action.",
      },
      {
        question: "Do you perform pujas?",
        answer:
          "We provide puja consultation — guidance on which puja is appropriate for your situation, how to approach it, and what it is intended to do. Performing the puja is your own practice or the work of a local pandit.",
      },
      {
        question: "Is this service religious?",
        answer:
          "The practices we draw on come from Hindu traditions. The guidance we offer is non-dogmatic — we respect your background and don't assume any specific religious commitment. The practices are offered as tools, not beliefs you are required to hold.",
      },
    ],
  },
];

// Helper to get a service by slug
export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

// Helper to get other services (for "other services" section on detail page)
export function getOtherServices(currentSlug: string, count = 3): Service[] {
  return services.filter((s) => s.slug !== currentSlug).slice(0, count);
}
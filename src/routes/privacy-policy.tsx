import { createFileRoute, Link } from "@tanstack/react-router";
import Starfield from "@/components/Starfield";
import Reveal from "@/components/Reveal";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — AstroView" },
      {
        name: "description",
        content:
          "How AstroView collects, uses, and protects your data — operated by KamleshKhyati Infosolution Pvt. Ltd.",
      },
    ],
  }),
  component: PrivacyPolicyPage,
});

const EMAIL = "support@kamleshkhyatiinfosolution.com";
const CORRESPONDENCE_ADDRESS =
  "Flat No. 604, 6th Floor, Tower C, JNC Greenwood's, Sector 3, Vasundhara, Ghaziabad – 201012";

const sections = [
  {
    title: "1. Information We Collect",
    body: `We collect essential details such as your name, phone number, email, date of birth, gender, birth time and place (needed to generate accurate Kundli and horoscope readings), IP address, and device/browser specifications. For platform optimization, we may log session durations and usage history. Chat or call transcripts with astrologers, uploaded documents, and support communication may also be stored for service quality and analytics.`,
  },
  {
    title: "2. How We Use Your Info",
    body: `Your data is used to provide core services — Kundli generation, horoscope and numerology readings, live consultations, and wallet/payment processing. We may send emails, notifications, or alerts relevant to your account, bookings, or recharges. We also use this data to troubleshoot technical issues, prevent misuse, and improve the accuracy and relevance of readings over time.`,
  },
  {
    title: "3. Data Security",
    body: `We use encryption (SSL/TLS), access controls, and secure cloud storage to protect your data, including sensitive birth details. Our backend is hosted on compliant infrastructure, and we run regular audits to guard against breaches. Only authorized personnel can access user data, strictly based on role and need.`,
  },
  {
    title: "4. Cookies & Tracking",
    body: `AstroView uses cookies to track session activity, remember preferences, and personalize your experience — for example, keeping you logged in or remembering your last horoscope sign. These cookies don't contain sensitive information and can be disabled through your browser settings, though this may affect how the site functions.`,
  },
  {
    title: "5. User Rights",
    body: `You have the right to access, update, or delete your personal data at any time — including from your Profile page. For any other data-related request, email us at ${EMAIL}. We respond to all data queries within 7 working days.`,
  },
  {
    title: "6. Policy Updates",
    body: `We may revise this Privacy Policy periodically as the platform grows. Continued use of AstroView after an update implies your agreement to the revised terms. We recommend checking this page occasionally for changes.`,
  },
  {
    title: "7. Contact Us",
    body: `For questions, requests, or complaints regarding your data or privacy, email us at ${EMAIL} or write to us at ${CORRESPONDENCE_ADDRESS}.`,
  },
];

function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <section className="relative overflow-hidden pt-28 pb-14 md:pt-36 md:pb-16 bg-gradient-hero">
        <Starfield />
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-medium">
            Legal
          </p>
          <h1 className="mt-5 font-display text-4xl md:text-5xl font-semibold">
            Privacy <span className="text-gradient">Policy</span>
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Your data security and privacy are our top priorities. Here's exactly
            how we protect and manage your information.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-16">
        <div className="mx-auto max-w-3xl px-6 space-y-4">
          <Reveal>
            <p className="text-muted-foreground leading-relaxed">
              AstroView is committed to safeguarding the privacy of every user on
              our platform. Whether you're exploring a free reading or booking a
              live consultation, we prioritize transparency — every piece of data
              you share is treated with strict confidentiality and
              industry-standard security practices.
            </p>
          </Reveal>

          {sections.map((s, idx) => (
            <Reveal key={s.title} delay={idx * 40}>
              <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card">
                <h2 className="font-display text-lg md:text-xl font-semibold">
                  {s.title}
                </h2>
                <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                  {s.body.split(EMAIL).map((part, i, arr) =>
                    i < arr.length - 1 ? (
                      <span key={i}>
                        {part}
                        <a href={`mailto:${EMAIL}`} className="text-primary hover:underline">
                          {EMAIL}
                        </a>
                      </span>
                    ) : (
                      <span key={i}>{part}</span>
                    ),
                  )}
                </p>
              </div>
            </Reveal>
          ))}

          <Reveal>
            <p className="text-sm text-muted-foreground text-center pt-4">
              Looking for our{" "}
              <Link to="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>
              ?
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

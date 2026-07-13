import { createFileRoute, Link } from "@tanstack/react-router";
import Starfield from "@/components/Starfield";
import Reveal from "@/components/Reveal";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — AstroView" },
      {
        name: "description",
        content:
          "The terms governing your access to and use of the AstroView platform, operated by KamleshKhyati Infosolution Pvt. Ltd.",
      },
    ],
  }),
  component: TermsPage,
});

const EMAIL = "support@kamleshkhyatiinfosolution.com";
const EFFECTIVE_DATE = "July 16, 2025";
const SITE_URL = "https://astroview-one.vercel.app/";

const sections = [
  {
    title: "1. Eligibility",
    body: `You must be at least 18 years old and capable of entering into a legally binding agreement under applicable laws to use AstroView. By registering or using our services, you confirm that you meet these requirements. If you're accessing the platform on behalf of a company or other legal entity, you represent that you have the authority to bind that organization to these Terms.`,
  },
  {
    title: "2. User Responsibilities",
    body: `You're responsible for maintaining the confidentiality of your login credentials and for all activity under your account. Notify us immediately of any unauthorized access or suspected security breach. Sharing your account or credentials with others is strictly prohibited and may result in suspension or termination.`,
  },
  {
    title: "3. Consultations & Readings",
    body: `Astrological readings, Kundli reports, and consultations offered on AstroView are intended for guidance and self-reflection. They are not a substitute for professional medical, legal, financial, or psychological advice. Decisions made based on a reading are entirely your own responsibility.`,
  },
  {
    title: "4. Payments & Wallet",
    body: `Consultations, pujas, and premium reports are paid services. Wallet recharges are non-transferable and, once credited, are subject to the refund policy communicated at the time of purchase. We reserve the right to adjust pricing for any service with reasonable prior notice.`,
  },
  {
    title: "5. Intellectual Property",
    body: `All content, branding, graphics, source code, and other intellectual property on this platform are owned by AstroView or licensed for our use. Unauthorized copying, distribution, modification, or reproduction of any material is strictly prohibited and may result in legal action.`,
  },
  {
    title: "6. Termination Policy",
    body: `AstroView reserves the right to suspend or terminate access for any user who violates these Terms, misuses platform features, or poses a threat to the system's integrity. Termination may occur without prior notice and may result in loss of access to all data associated with the account.`,
  },
  {
    title: "7. Contact Information",
    body: `For any questions regarding these Terms, please reach out to us at ${EMAIL}. You can also contact us at our corporate address in Ghaziabad, India.`,
  },
];

function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <section className="relative overflow-hidden pt-28 pb-14 md:pt-36 md:pb-16 bg-gradient-hero">
        <Starfield />
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-medium">
            Legal
          </p>
          <h1 className="mt-5 font-display text-4xl md:text-5xl font-semibold">
            Terms of <span className="text-gradient">Service</span>
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Please read these terms carefully before using our services. Your
            access and use of the platform are conditioned upon your compliance.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-16">
        <div className="mx-auto max-w-3xl px-6 space-y-4">
          <Reveal>
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Effective Date: {EFFECTIVE_DATE}.</strong>{" "}
              These Terms govern your access to and use of the AstroView platform
              and related services, operated by KamleshKhyati Infosolution Pvt.
              Ltd. By accessing or using any part of our services via{" "}
              <a href={SITE_URL} className="text-primary hover:underline">
                {SITE_URL}
              </a>
              , you agree to be legally bound by these Terms.
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
              <Link to="/privacy-policy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              ?
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

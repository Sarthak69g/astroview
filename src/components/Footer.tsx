import {
  Phone,
  Mail,
  Instagram,
  Youtube,
  Linkedin,
  MapPin,
} from "lucide-react";
import logoAsset from "@/assets/logo.png";

const CONTACT = {
  email: "support@kamleshkhyatiinfosolution.com",
  phone: "+91-9319843151",
  address: [
    "Unit No.202, Second Floor, Plot No. 103,",
    "Block A, Sector 63 Noida,",
    "Gautam Budh Nagar UP – 201301",
  ],
};
;

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-6 py-14 grid md:grid-cols-[1.3fr_0.85fr_0.85fr_1.1fr] gap-10">
        {/* Brand col */}
        <div>
          <div className="flex items-center gap-2.5">
            <img src={logoAsset} alt="" className="h-9 w-9" />
            <span className="text-lg font-display font-semibold">
              Astro<span className="text-primary">View</span>
            </span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-sm leading-relaxed">
            A modern home for Vedic astrology. Built slowly, with care, for seekers who value
            tradition and clarity in equal measure.
          </p>
          <div className="mt-5 flex items-center gap-3">
  <a
    href="https://www.linkedin.com/company/kamleshkhyati-infosolutions/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="LinkedIn"
    className="h-9 w-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition"
  >
    <Linkedin className="h-4 w-4" />
  </a>

  <a
    href="https://www.instagram.com/kamleshkhyati_infosolutions/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Instagram"
    className="h-9 w-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition"
  >
    <Instagram className="h-4 w-4" />
  </a>

  <a
     href="https://www.youtube.com/@KamleshkhyatiInfosolution"
    aria-label="YouTube"
    className="h-9 w-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition"
  >
    <Youtube className="h-4 w-4" />
  </a>
</div>
        </div>

        {/* Explore col */}
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Explore</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              ["Consultation", "/consultation"],
              ["Puja", "/puja"],
              ["Horoscope", "/horoscope"],
              ["Numerology", "/numerology"],
              ["Tarot", "/tarot"],
              ["About Us", "/about"],
            ].map(([label, href]) => (
              <li key={href}><a href={href} className="hover:text-primary transition">{label}</a></li>
            ))}
          </ul>
        </div>

        {/* Company col */}
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Company</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              ["Why Us", "#why"],
              ["Journey", "#journey"],
              ["FAQ", "#faq"],
              ["Contact", "#contact"],
            ].map(([label, href]) => (
              <li key={href}><a href={href} className="hover:text-primary transition">{label}</a></li>
            ))}
          </ul>
        </div>

        {/* Contact col */}
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Contact</p>
          <ul className="mt-4 space-y-4">
            <li className="flex gap-3">
              <div className="h-9 w-9 rounded-lg border border-border flex items-center justify-center shrink-0 text-muted-foreground">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed">
                {CONTACT.address.map((line, i) => <span key={i} className="block">{line}</span>)}
              </div>
            </li>
            <li className="flex gap-3">
              <div className="h-9 w-9 rounded-lg border border-border flex items-center justify-center shrink-0 text-muted-foreground">
                <Mail className="h-4 w-4" />
              </div>
              <a href={`mailto:${CONTACT.email}`} className="text-sm text-muted-foreground hover:text-primary transition self-center">
                {CONTACT.email}
              </a>
            </li>
            <li className="flex gap-3">
              <div className="h-9 w-9 rounded-lg border border-border flex items-center justify-center shrink-0 text-muted-foreground">
                <Phone className="h-4 w-4" />
              </div>
              <a href={`tel:${CONTACT.phone}`} className="text-sm text-muted-foreground hover:text-primary transition self-center">
                {CONTACT.phone}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} AstroView. All rights reserved.</p>
          <p>KamleshKhyati Infosolution Pvt. Ltd.</p>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, Menu, X } from "lucide-react";
import logoAsset from "@/assets/logo.png";

const navLinks = [
  { id: "home",      label: "Home",      to: "/"          },
  { id: "services",  label: "Services",  to: "/services"  },
  { id: "horoscope", label: "Horoscope", to: "/horoscope" },
  { id: "why",       label: "Why Us",    to: "/#why"      },
  { id: "journey",   label: "Journey",   to: "/#journey"  },
  { id: "contact",   label: "Contact",   to: "/#contact"  },
  { id: "faq",       label: "FAQ",       to: "/#faq"      },
  { id: "about",     label: "About",     to: "/about"     },
];

const SECTION_IDS = ["why", "journey", "contact", "faq"];

export default function Header() {
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [scrolled,      setScrolled]      = useState(false);
  const [mounted,       setMounted]       = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Section highlighting via IntersectionObserver (homepage only)
  useEffect(() => {
    if (pathname !== "/") { setActiveSection(null); return; }
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-15% 0px -60% 0px", threshold: 0 }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [pathname]);

  const isActive = (href: string): boolean => {
    if (href === "/")           return pathname === "/" && !activeSection;
    if (href === "/services")   return pathname.startsWith("/services");
    if (href === "/horoscope")  return pathname.startsWith("/horoscope");
    if (href === "/about")      return pathname === "/about";
    if (href.startsWith("/#"))  return pathname === "/" && activeSection === href.substring(2);
    return false;
  };

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const activeCls   = "text-sm font-medium text-primary bg-primary/10 px-4 py-2 rounded-full transition-all duration-200";
  const inactiveCls = "text-sm text-muted-foreground hover:text-foreground px-4 py-2 rounded-full transition-all duration-200";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-xl bg-background/85 border-b border-border/50 shadow-[0_1px_12px_oklch(0.58_0.18_42_/_0.08)]"
            : "backdrop-blur-xl bg-background/70 border-b border-border/30"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 h-18 py-3 flex items-center justify-between">

          <Link to="/" preload="intent" className="flex items-center gap-2.5 shrink-0">
            <img src={logoAsset} alt="AstroView" className="h-10 w-10" />
            <span className="text-xl font-display font-semibold tracking-tight">
              Astro<span className="text-primary">View</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                preload="intent"
                className={isActive(link.to) ? activeCls : inactiveCls}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            to="/services"
            preload="intent"
            className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-soft hover:opacity-95 hover:scale-[1.02] transition-all duration-200"
          >
            Our services <ArrowRight className="h-4 w-4" />
          </Link>

          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden p-2 text-foreground rounded-lg hover:bg-accent transition"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {mounted && createPortal(
        <>
          <div
            className={`fixed inset-0 bg-foreground/40 backdrop-blur-sm md:hidden transition-opacity duration-300 ${
              menuOpen ? "opacity-100 z-[9998] pointer-events-auto" : "opacity-0 z-[-1] pointer-events-none"
            }`}
            onClick={() => setMenuOpen(false)}
          />
          <div
            className={`fixed top-0 right-0 h-full w-[280px] bg-background border-l border-border shadow-2xl flex flex-col md:hidden transition-transform duration-300 ease-in-out z-[9999] ${
              menuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div className="flex items-center gap-2">
                <img src={logoAsset} alt="" className="h-8 w-8" />
                <span className="font-display font-semibold text-lg">
                  Astro<span className="text-primary">View</span>
                </span>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-1.5 rounded-full hover:bg-accent transition"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-1 p-4 flex-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  preload="intent"
                  onClick={() => setMenuOpen(false)}
                  className={
                    isActive(link.to)
                      ? "px-4 py-3.5 rounded-xl text-base font-semibold text-foreground bg-accent transition"
                      : "px-4 py-3.5 rounded-xl text-base font-medium text-foreground hover:bg-accent transition"
                  }
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="p-5 border-t border-border">
              <Link
                to="/services"
                preload="intent"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full rounded-full bg-gradient-primary px-5 py-3.5 text-sm font-medium text-primary-foreground shadow-soft"
              >
                Our services <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}

// src/components/Header.tsx
// Drop this file at src/components/Header.tsx (replace the existing one)

import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, Menu, X } from "lucide-react";
import logoAsset from "@/assets/logo.png";

// ─── Nav links ────────────────────────────────────────────────────────────────
// "to" is used for Link — TanStack Router handles both /path and /#hash fine.

const navLinks = [
{
id:"home",
label:"Home",
to:"/"
},
{
id:"services",
label:"Services",
to:"/services"
},
{
id:"why",
label:"Why Us",
to:"/#why"
},
{
id:"journey",
label:"Journey",
to:"/#journey"
},
{
id:"contact",
label:"Contact",
to:"/#contact"
},
{
id:"faq",
label:"FAQ",
to:"/#faq"
},
{
id:"about",
label:"About",
to:"/about"
},
];

// ─── Header ───────────────────────────────────────────────────────────────────

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const pathname = useRouterState({
  select: (state) => state.location.pathname,
});
const [hash, setHash] = useState("");

useEffect(() => {
  const updateHash = () => {
    setHash(window.location.hash);
  };

  updateHash(); // <-- initialize once

  window.addEventListener("hashchange", updateHash);

  return () => {
    window.removeEventListener("hashchange", updateHash);
  };
}, []);

const isActive = (href: string) => {
  // Home
  if (href === "/") {
    return pathname === "/" && hash === "";
  }

  // Services
  if (href === "/services") {
    return pathname.startsWith("/services");
  }

  // About
  if (href === "/about") {
    return pathname === "/about";
  }

  // Homepage sections
  if (href.startsWith("/#")) {
    return pathname === "/" && hash === href.substring(1);
  }
  return false;
};

  // Hydration guard for portal
  useEffect(() => { setMounted(true); }, []);

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
  if (pathname !== "/") return;

  const sections = [
    "services",
    "why",
    "journey",
    "contact",
    "faq",
  ];

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    },
    {
      threshold: 0.45,
    }
  );

  sections.forEach((id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });

  return () => observer.disconnect();
}, [pathname]);

  return (
    <>
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-xl bg-background/80 border-b border-border/50 shadow-[0_1px_12px_oklch(0.58_0.18_42_/_0.08)]"
            : "backdrop-blur-xl bg-background/70 border-b border-border/50"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 h-18 py-3 flex items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            preload="intent"
            className="flex items-center gap-2.5 shrink-0"
          >
            <img src={logoAsset} alt="AstroView" className="h-10 w-10" />
            <span className="text-xl font-display font-semibold tracking-tight">
              Astro<span className="text-primary">View</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                preload="intent"
                activeProps={{
                       className:
                            "text-sm font-medium text-primary bg-primary/10 px-4 py-2 rounded-full shadow-sm transition-all",
            }}
                inactiveProps={{
                      className:
                           "text-sm text-muted-foreground hover:text-foreground px-4 py-2 rounded-full transition-all",
            }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <Link
            to="/services"
            preload="intent"
            className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-soft hover:opacity-95 transition"
          >
            Our services <ArrowRight className="h-4 w-4" />
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden p-2 text-foreground rounded-lg hover:bg-accent transition"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

        </div>
      </header>

      {/* ── Mobile drawer (portal) ──────────────────────────────── */}
      {mounted && createPortal(
        <>
          {/* Overlay */}
          <div
            className={`fixed inset-0 bg-foreground/40 backdrop-blur-sm md:hidden transition-opacity duration-300 ${
              menuOpen
                ? "opacity-100 z-[9998] pointer-events-auto"
                : "opacity-0 z-[-1] pointer-events-none"
            }`}
            onClick={() => setMenuOpen(false)}
          />

          {/* Drawer panel */}
          <div
            className={`fixed top-0 right-0 h-full w-[280px] bg-background border-l border-border shadow-2xl flex flex-col md:hidden transition-transform duration-300 ease-in-out z-[9999] ${
              menuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Drawer header */}
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

            {/* Drawer nav links */}
            <nav className="flex flex-col gap-1 p-4 flex-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  preload="intent"
                  onClick={() => setMenuOpen(false)}
                  activeProps={{
                    className: "px-4 py-3.5 rounded-xl text-base font-semibold text-foreground bg-accent transition",
                  }}
                  inactiveProps={{
                    className: "px-4 py-3.5 rounded-xl text-base font-medium text-foreground hover:bg-accent transition",
                  }}
                >
                  {link.label}
                </Link>
                
              ))}
              

              {/* About in drawer */}
              <Link
  to="/about"
  preload="intent"
  onClick={() => setMenuOpen(false)}
  className={`px-4 py-3.5 rounded-xl text-base transition ${
    isActive("/about")
      ? "bg-primary/10 text-primary font-semibold"
      : "text-foreground hover:bg-accent"
  }`}
>
  About
</Link>
            </nav>

            {/* Drawer CTA */}
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
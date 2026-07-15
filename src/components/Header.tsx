import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowRight,
  Menu,
  User,
  Wallet,
  History,
  MessageCircle,
  LogOut,
  X,
  ChevronDown,
  Sun,
  Sparkles,
  Hash,
  Heart,
} from "lucide-react";
import logoAsset from "@/assets/logo.png";
import { useAuth } from "@/lib/auth-context";
import { avatarUrl } from "@/lib/avatar";
import { useSlidingIndicator } from "@/hooks/use-sliding-indicator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { id: "home", label: "Home", to: "/" },
  { id: "consultation", label: "Consultation", to: "/consultation" },
  { id: "puja", label: "Puja", to: "/puja" },
  // Not a real route — grouping id for the "Free Services" dropdown below.
  // isActive() treats it as active whenever any of freeServiceLinks' routes
  // are current, so the sliding pill lands on the dropdown trigger.
  { id: "free-services", label: "Free Services", to: "/free-services" },
  { id: "contact", label: "Contact", to: "/#contact" },
  { id: "about", label: "About", to: "/about" },
];

// The three currently-free tools, grouped under one "Free Services" entry
// instead of three separate top-level nav links. Add new free tools here —
// both the desktop dropdown and the mobile expandable section read from
// this single list.
const freeServiceLinks = [
  {
    label: "Horoscope",
    to: "/horoscope",
    description: "Daily, weekly & monthly predictions",
    icon: Sun,
  },
  { label: "Tarot", to: "/tarot", description: "Pick a spread, get your reading", icon: Sparkles },
  {
    label: "Numerology",
    to: "/numerology",
    description: "Life Path, Destiny & Soul Urge",
    icon: Hash,
  },
  {
    label: "Kundli",
    to: "/kundli",
    description: "Generate a chart or match two horoscopes",
    icon: Heart,
  },
];

const SECTION_IDS = ["contact"];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [mobileFreeServicesOpen, setMobileFreeServicesOpen] = useState(false);

  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, isLoggedIn, logout, walletBalance } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Section highlighting (homepage only). Checks each tracked section's
  // position against a line just below the fixed header on every scroll —
  // more reliable than an IntersectionObserver rootMargin band, which can
  // miss tall sections (the pill would get stuck on "Home" once the section
  // scrolled past that narrow band without ever registering as active).
  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection(null);
      return;
    }
    const HEADER_OFFSET = 110;
    const updateActiveSection = () => {
      let current: string | null = null;
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= HEADER_OFFSET && rect.bottom > HEADER_OFFSET) {
          current = id;
          break;
        }
      }
      setActiveSection(current);
    };
    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [pathname]);

  const isActive = (href: string): boolean => {
    if (href === "/") return pathname === "/" && !activeSection;
    if (href === "/consultation") return pathname.startsWith("/consultation");
    if (href === "/puja") return pathname.startsWith("/puja");
    if (href === "/free-services") {
      return freeServiceLinks.some((l) => pathname.startsWith(l.to));
    }
    if (href === "/horoscope") return pathname.startsWith("/horoscope");
    if (href === "/numerology") return pathname.startsWith("/numerology");
    if (href === "/tarot") return pathname.startsWith("/tarot");
    if (href === "/about") return pathname === "/about";
    if (href.startsWith("/#")) return pathname === "/" && activeSection === href.substring(2);
    return false;
  };

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (freeServiceLinks.some((l) => pathname.startsWith(l.to))) {
      setMobileFreeServicesOpen(true);
    }
  }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Which nav link (if any) is active right now, for the sliding pill below.
  const activeLinkId = navLinks.find((link) => isActive(link.to))?.id ?? null;
  const {
    containerRef: navRef,
    register: registerNavLink,
    style: pillStyle,
  } = useSlidingIndicator(activeLinkId);

  // Background lives on a separate absolutely-positioned pill now, so the
  // links themselves only need to swap text color.
  const activeCls =
    "relative z-10 text-sm font-medium text-primary px-4 py-2 rounded-full transition-colors duration-200";
  const inactiveCls =
    "relative z-10 text-sm text-muted-foreground hover:text-foreground px-4 py-2 rounded-full transition-colors duration-200";

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-5 pt-3 sm:pt-4">
        <div
          className={`mx-auto max-w-7xl rounded-2xl border backdrop-blur-xl transition-all duration-300 ease-out ${
            scrolled
              ? "bg-background/85 border-border/60 shadow-soft scale-[0.99]"
              : "bg-background/70 border-border/30 shadow-card scale-100"
          }`}
        >
          <div className="mx-auto px-6 h-16 py-3 flex items-center justify-between">
            <Link to="/" preload="intent" className="flex items-center gap-2.5 shrink-0">
              <img src={logoAsset} alt="AstroView" className="h-10 w-10" />
              <span className="text-xl font-display font-semibold tracking-tight">
                Astro<span className="text-primary">View</span>
              </span>
            </Link>

            <nav ref={navRef} className="hidden md:flex items-center gap-1 relative">
              <span
                aria-hidden="true"
                className="absolute top-0 h-full rounded-full bg-primary/10 transition-[left,width] duration-300 ease-out"
                style={{
                  left: pillStyle.left,
                  width: pillStyle.width,
                  opacity: activeLinkId && pillStyle.ready ? 1 : 0,
                }}
              />
              {navLinks.map((link) =>
                link.id === "free-services" ? (
                  <DropdownMenu key={link.to}>
                    <DropdownMenuTrigger
                      ref={registerNavLink(link.id)}
                      className={`flex items-center gap-1 outline-none ${
                        isActive(link.to) ? activeCls : inactiveCls
                      }`}
                    >
                      {link.label}
                      <ChevronDown className="h-3.5 w-3.5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-64">
                      <DropdownMenuLabel className="text-xs text-muted-foreground">
                        Choose a free service
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {freeServiceLinks.map((service) => (
                        <DropdownMenuItem key={service.to} asChild>
                          <Link
                            to={service.to}
                            preload="intent"
                            className="cursor-pointer items-start gap-2.5 py-2"
                          >
                            <service.icon className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                            <div>
                              <p className="text-sm font-medium leading-none">{service.label}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {service.description}
                              </p>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    key={link.to}
                    ref={registerNavLink(link.id)}
                    to={link.to}
                    preload="intent"
                    className={isActive(link.to) ? activeCls : inactiveCls}
                  >
                    {link.label}
                  </Link>
                ),
              )}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/consultation"
                preload="intent"
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-soft hover:opacity-95 hover:scale-[1.02] active:scale-[0.97] transition-all duration-200"
              >
                Talk now <ArrowRight className="h-4 w-4" />
              </Link>

              {isLoggedIn && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    <img
                      src={avatarUrl(user.mobileNo)}
                      alt={user.name}
                      className="h-9 w-9 rounded-full border border-border bg-secondary object-cover"
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <p className="text-sm font-semibold">{user.name}</p>
                      <p className="text-xs font-normal text-muted-foreground">
                        +91 {user.mobileNo}
                      </p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="h-4 w-4" /> Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/recharge" className="cursor-pointer">
                        <Wallet className="h-4 w-4" /> Wallet
                        <span className="ml-auto text-xs font-medium text-primary-deep">
                          ₹{walletBalance}
                        </span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                      <History className="h-4 w-4" /> Order history
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                      <MessageCircle className="h-4 w-4" /> Customer support
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  to="/login"
                  preload="intent"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-all duration-200"
                >
                  Login
                </Link>
              )}
            </div>

            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden p-2 text-foreground rounded-lg hover:bg-accent transition"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {mounted &&
        createPortal(
          <>
            <div
              className={`fixed inset-0 bg-foreground/40 backdrop-blur-sm md:hidden transition-opacity duration-300 ${
                menuOpen
                  ? "opacity-100 z-[9998] pointer-events-auto"
                  : "opacity-0 z-[-1] pointer-events-none"
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

              {isLoggedIn && user ? (
                <Link
                  to="/profile"
                  preload="intent"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-6 py-4 border-b border-border"
                >
                  <img
                    src={avatarUrl(user.mobileNo)}
                    alt={user.name}
                    className="h-10 w-10 rounded-full border border-border bg-secondary object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground">Wallet: ₹{walletBalance}</p>
                  </div>
                </Link>
              ) : (
                <Link
                  to="/login"
                  preload="intent"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-6 py-4 border-b border-border text-sm font-semibold text-primary-deep"
                >
                  <User className="h-4 w-4" /> Login / Sign up
                </Link>
              )}

              <nav className="flex flex-col gap-1 p-4 flex-1">
                {navLinks.map((link) =>
                  link.id === "free-services" ? (
                    <div key={link.to}>
                      <button
                        onClick={() => setMobileFreeServicesOpen((prev) => !prev)}
                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-base transition ${
                          isActive(link.to)
                            ? "font-semibold text-foreground bg-accent"
                            : "font-medium text-foreground hover:bg-accent"
                        }`}
                      >
                        {link.label}
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            mobileFreeServicesOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {mobileFreeServicesOpen && (
                        <div className="pl-3 flex flex-col gap-1 mt-1">
                          {freeServiceLinks.map((service) => (
                            <Link
                              key={service.to}
                              to={service.to}
                              preload="intent"
                              onClick={() => setMenuOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition"
                            >
                              <service.icon className="h-4 w-4 text-primary" />
                              {service.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
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
                  ),
                )}
              </nav>

              <div className="p-5 border-t border-border space-y-2.5">
                <Link
                  to="/consultation"
                  preload="intent"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full rounded-full bg-gradient-primary px-5 py-3.5 text-sm font-medium text-primary-foreground shadow-soft"
                >
                  Talk now <ArrowRight className="h-4 w-4" />
                </Link>
                {isLoggedIn && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center justify-center gap-2 w-full rounded-full border border-border px-5 py-3 text-sm font-medium text-destructive"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                )}
              </div>
            </div>
          </>,
          document.body,
        )}
    </>
  );
}
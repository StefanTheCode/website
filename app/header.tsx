"use client";

import { useEffect, useRef, useState } from "react";
import "./globals.css";
import Image from "next/image";

type NavLink = { href: string; label: string; note?: string };
type NavGroup = { id: string; label: string; links: NavLink[] };

const GROUPS: NavGroup[] = [
  {
    id: "free",
    label: "Free resources",
    links: [
      { href: "/dotnet-roadmap-2026", label: ".NET Roadmap 2026" },
      { href: "/ai-roadmap-2026", label: "AI Roadmap for .NET 2026" },
      { href: "/ai-roadmap-course", label: "AI Roadmap Course", note: "Free lessons" },
      { href: "/dotnet-code-rules-starter-kit", label: ".NET Code Rules Starter Kit" },
      { href: "/vertical-slices-architecture", label: "Vertical Slice Architecture" },
      { href: "/pass-your-interview", label: "Pass Your .NET Interview", note: "250 interview Q&As" },
      { href: "/builder-pattern-free-stuff", label: "Builder Pattern Chapter" },
      { href: "/ai-in-dotnet-starter-kit", label: "AI in .NET Starter Kit" },
    ],
  },
  {
    id: "courses",
    label: "Courses",
    links: [
      { href: "/ai-for-dotnet-developers", label: "AI for .NET Developers", note: "Community + lessons" },
      { href: "/pragmatic-dotnet-code-rules", label: "Pragmatic .NET Code Rules", note: "Video course" },
      { href: "/design-patterns-that-deliver-ebook", label: "Design Patterns That Deliver", note: "Written course + ebook + AI tutor" },
    ],
  },
  {
    id: "ebooks",
    label: "Ebooks",
    links: [
      { href: "/design-patterns-simplified", label: "Design Patterns Simplified" },
    ],
  },
  {
    id: "ai",
    label: "AI tools",
    links: [
      { href: "/tools/pattern-picker", label: "Pattern Picker" },
      { href: "/tools/pattern-comparison", label: "Pattern Comparison" },
      { href: "/tools/interview-quiz", label: "Interview Quiz" },
      { href: "/playground", label: "C# Playground" },
      { href: "/tools/ask-the-book", label: "Ask the Book", note: "For ebook owners" },
      { href: "/tools", label: "All AI tools →" },
    ],
  },
];

const Chevron = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
);

export default function Header() {
  const headerRef = useRef<HTMLDivElement>(null);
  const promoRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [path, setPath] = useState("");

  // Keep --promo-h in sync so the fixed header never covers page content.
  useEffect(() => {
    const setPromoHeight = () => {
      const h = promoRef.current?.offsetHeight ?? 0;
      document.documentElement.style.setProperty("--promo-h", `${h}px`);
    };
    setPromoHeight();
    window.addEventListener("resize", setPromoHeight);
    return () => window.removeEventListener("resize", setPromoHeight);
  }, []);

  useEffect(() => { setPath(window.location.pathname); }, []);

  // Close dropdowns on outside click / Escape; close the mobile menu on desktop widths.
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setOpenDropdown(null);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpenDropdown(null); setMenuOpen(false); } };
    const onResize = () => { if (window.innerWidth >= 992) setMenuOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  };

  const isActive = (href: string) => path === href || (href !== "/" && path.startsWith(href + "/"));
  const groupActive = (g: NavGroup) => g.links.some((l) => isActive(l.href));

  return (
    <div className="tcm-header" ref={headerRef}>
      {/* Announcement (class promo-bar kept: product pages hide it by that name) */}
      <div ref={promoRef} className="promo-bar tcm-announce">
        <div className="tcm-announce__inner">
          <span className="tcm-announce__tag">NEW</span>
          <span className="tcm-announce__text"><strong>AI for .NET Developers</strong><span className="tcm-announce__more"> - skills, agents and practical lessons</span></span>
          <a href="/ai-for-dotnet-developers" data-cta="ai-community-header">
            Explore
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
          </a>
        </div>
      </div>

      {/* id/class kept: product pages hide the global nav with nav#ftco-navbar.header-nav */}
      <nav className="header-nav tcm-nav" id="ftco-navbar" aria-label="Main">
        <div className="tcm-container tcm-nav__bar">
          <a className="tcm-brand" href="/">
            <Image src="/images/thecodeman-logo-96.webp" alt="" width={48} height={48} />
            <span className="tcm-brand__text">
              <span className="tcm-brand__name">Stefan Đokić</span>
              <span className="tcm-brand__sub">Microsoft MVP</span>
            </span>
          </a>

          <ul className="tcm-nav__menu">
            <li><a href="/blog" className={`tcm-nav__link ${isActive("/blog") ? "is-active" : ""}`}>Blog</a></li>
            {GROUPS.map((g) => (
              <li key={g.id}>
                <button
                  type="button"
                  className={`tcm-nav__link ${groupActive(g) ? "is-active" : ""}`}
                  aria-expanded={openDropdown === g.id}
                  aria-controls={`dd-${g.id}`}
                  onClick={() => setOpenDropdown(openDropdown === g.id ? null : g.id)}
                >
                  {g.label}<Chevron />
                </button>
                <div id={`dd-${g.id}`} className={`tcm-dd ${openDropdown === g.id ? "is-open" : ""}`}>
                  {g.links.map((l) => (
                    <a key={l.href} href={l.href} onClick={() => setOpenDropdown(null)}>
                      {l.label}{l.note ? <small>{l.note}</small> : null}
                    </a>
                  ))}
                </div>
              </li>
            ))}
            <li><a href="/sponsorship" className={`tcm-nav__link ${isActive("/sponsorship") ? "is-active" : ""}`}>Sponsor</a></li>
          </ul>

          <div className="tcm-nav__actions">
            <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label="Toggle light/dark theme" title="Toggle light/dark theme">
              <svg className="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
              <svg className="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="5"></circle>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
              </svg>
            </button>
            <a href="https://www.skool.com/thecodeman-community-2911" className="tcm-nav__text-link">Free community</a>
            <a href="/ai-for-dotnet-developers" className="tcm-btn tcm-btn--primary tcm-btn--sm" data-cta="ai-community-nav">AI for .NET Devs</a>
            <button
              type="button"
              className="tcm-burger"
              aria-expanded={menuOpen}
              aria-controls="tcm-mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
              )}
            </button>
          </div>
        </div>

        <div id="tcm-mobile-menu" className={`tcm-mobile ${menuOpen ? "is-open" : ""}`}>
          <div className="tcm-container">
            <a href="/blog" onClick={() => setMenuOpen(false)}>Blog</a>
            {GROUPS.map((g) => (
              <details key={g.id}>
                <summary>{g.label}<Chevron /></summary>
                {g.links.map((l) => (
                  <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>
                ))}
              </details>
            ))}
            <a href="/sponsorship" onClick={() => setMenuOpen(false)}>Sponsor</a>
            <div className="tcm-mobile__ctas">
              <a href="/ai-for-dotnet-developers" className="tcm-btn tcm-btn--primary">AI for .NET Developers</a>
              <a href="https://www.skool.com/thecodeman-community-2911" className="tcm-btn tcm-btn--secondary">Join the free community</a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

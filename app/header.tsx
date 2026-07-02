"use client";

import { useEffect, useRef, useState } from "react";
import "./globals.css";
import Image from "next/image";

export default function Header() {
  const promoRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const setPromoHeight = () => {
      const h = promoRef.current?.offsetHeight ?? 0;
      document.documentElement.style.setProperty("--promo-h", `${h}px`);
    };

    setPromoHeight();
    window.addEventListener("resize", setPromoHeight);
    return () => window.removeEventListener("resize", setPromoHeight);
  }, []);

  useEffect(() => {
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll(".navbar-nav .nav-item a");

    navItems.forEach((item) => {
      if (item.getAttribute("href") === currentPath) item.classList.add("active");
      else item.classList.remove("active");
    });
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setMenuOpen(false);
        setOpenDropdown(null);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setOpenDropdown(null);
  };

  const toggleTheme = () => {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  };

  return (
    <>
      {/* PROMO BAR */}
      <div ref={promoRef} className="promo-bar">
        <div className="container promo-inner-center">
          <div className="promo-center-group">
            <span className="promo-text">
              🔥 <strong>Pragmatic .NET Code Rules Course</strong> is on Presale - 50% off!
            </span>

            <a href="/pragmatic-dotnet-code-rules?utm_source=promo" className="promo-buy-btn">
              BUY NOW
            </a>
          </div>
        </div>
      </div>

      {/* NAVBAR */}
      <nav
        className="navbar navbar-expand-lg navbar-dark ftco_navbar ftco-navbar-light site-navbar-target header-nav"
        id="ftco-navbar"
      >
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <Image
              src="/images/thecodeman-logo.webp"
              alt="Profile"
              width={48}
              height={48}
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                objectFit: "cover",
                marginRight: "12px",
              }}
            />

            <div className="brand-text">
              <div className="brand-name">Stefan Đokić</div>
              <div className="brand-sub">Microsoft MVP</div>
            </div>
          </a>

          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-controls="ftco-nav"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`navbar-collapse ${menuOpen ? 'show' : 'collapse'}`} id="ftco-nav">
            <ul className="navbar-nav nav margin-left-auto">
              <li className="nav-item">
                <a href="/" className="nav-link" onClick={closeMenu}><span>Home</span></a>
              </li>

              <li className={`nav-item dropdown ${openDropdown === 'free' ? 'show' : ''}`}>
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  onClick={(e) => { e.preventDefault(); toggleDropdown('free'); }}
                  aria-expanded={openDropdown === 'free'}
                >
                  Get for Free
                </a>
                <div className={`dropdown-menu ${openDropdown === 'free' ? 'show' : ''}`}>
                  <a className="dropdown-item" href="/dotnet-roadmap-2026" onClick={closeMenu}>.NET Roadmap 2026</a>
                  <a className="dropdown-item" href="/dotnet-code-rules-starter-kit" onClick={closeMenu}>.NET Code Rules Starter Kit</a>
                  <a className="dropdown-item" href="/vertical-slices-architecture" onClick={closeMenu}>Vertical Slice Architecture</a>
                  <a className="dropdown-item" href="/pass-your-interview" onClick={closeMenu}>Pass Interview Prep Kit</a>
                  <a className="dropdown-item" href="/builder-pattern-free-stuff" onClick={closeMenu}>Builder Pattern Chapter</a>
                  <a className="dropdown-item" href="/ai-in-dotnet-starter-kit" onClick={closeMenu}>AI in .NET Starter Kit</a>
                </div>
              </li>

              <li className="nav-item">
                <a href="/blog" className="nav-link" onClick={closeMenu}><span>Blog</span></a>
              </li>

              <li className={`nav-item dropdown ${openDropdown === 'courses' ? 'show' : ''}`}>
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  onClick={(e) => { e.preventDefault(); toggleDropdown('courses'); }}
                  aria-expanded={openDropdown === 'courses'}
                >
                  Courses
                </a>
                <div className={`dropdown-menu ${openDropdown === 'courses' ? 'show' : ''}`}>
                  <a className="dropdown-item" href="/pragmatic-dotnet-code-rules" onClick={closeMenu}>Pragmatic .NET Code Rules</a>
                  <a className="dropdown-item" href="/design-patterns-that-deliver-ebook" onClick={closeMenu}>Design Patterns That Deliver</a>
                </div>
              </li>

              <li className={`nav-item dropdown ${openDropdown === 'ai' ? 'show' : ''}`}>
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  onClick={(e) => { e.preventDefault(); toggleDropdown('ai'); }}
                  aria-expanded={openDropdown === 'ai'}
                >
                  AI Tools
                </a>
                <div className={`dropdown-menu ${openDropdown === 'ai' ? 'show' : ''}`}>
                  <a className="dropdown-item" href="/tools/pattern-picker" onClick={closeMenu}>Pattern Picker (Free)</a>
                  <a className="dropdown-item" href="/tools/pattern-comparison" onClick={closeMenu}>Pattern Comparison (Free)</a>
                  <a className="dropdown-item" href="/tools/interview-quiz" onClick={closeMenu}>Interview Quiz (Free)</a>
                  <a className="dropdown-item" href="/playground" onClick={closeMenu}>C# Playground (Free)</a>
                  <a className="dropdown-item" href="/tools/ask-the-book" onClick={closeMenu}>Ask the Book (Owners)</a>
                  <a className="dropdown-item" href="/tools" onClick={closeMenu}>All AI Tools →</a>
                </div>
              </li>

              <li className={`nav-item dropdown ${openDropdown === 'ebooks' ? 'show' : ''}`}>
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  onClick={(e) => { e.preventDefault(); toggleDropdown('ebooks'); }}
                  aria-expanded={openDropdown === 'ebooks'}
                >
                  Ebooks
                </a>
                <div className={`dropdown-menu ${openDropdown === 'ebooks' ? 'show' : ''}`}>
                  <a className="dropdown-item" href="/design-patterns-simplified" onClick={closeMenu}>Design Patterns Simplified</a>
                  <a className="dropdown-item" href="/tools" onClick={closeMenu}>Free AI Tools →</a>
                </div>
              </li>

              <li className="nav-item">
                <a href="/sponsorship" className="nav-link" onClick={closeMenu}><span>For Sponsors</span></a>
              </li>

              <li className="nav-item nav-join-cta">
                <a href="/ai-toolkit" className="join-community-btn toolkit-cta-btn" onClick={closeMenu}>
                  AI Toolkit
                </a>
              </li>

              <li className="nav-item nav-join-cta">
                <a href="https://www.skool.com/thecodeman-community-2911" className="join-community-btn" onClick={closeMenu}>
                  Join FREE Community
                </a>
              </li>

              <li className="nav-item d-flex align-items-center">
                <button
                  type="button"
                  className="theme-toggle"
                  onClick={toggleTheme}
                  aria-label="Toggle light/dark theme"
                  title="Toggle light/dark theme"
                >
                  <svg className="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                  <svg className="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                </button>
              </li>

            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

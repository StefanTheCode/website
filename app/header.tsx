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

  return (
    <>
      {/* PROMO BAR */}
      <div ref={promoRef} className="promo-bar">
        <div className="container promo-inner-center">
          <div className="promo-center-group">
            <span className="promo-text">
              🔥 <strong>Pragmatic .NET Code Rules Course</strong> is on Presale - 40% off!
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
              src="/images/a.png"
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
                  <a className="dropdown-item" href="/design-patterns-simplified" onClick={closeMenu}>Ebook Simplified</a>
                  <a className="dropdown-item" href="/design-patterns-that-deliver-ebook" onClick={closeMenu}>5 Patterns Ebook</a>
                </div>
              </li>

              <li className="nav-item">
                <a href="/sponsorship" className="nav-link" onClick={closeMenu}><span>For Sponsors</span></a>
              </li>

              <li className="nav-item nav-join-cta">
                <a href="https://www.skool.com/thecodeman-community-2911" className="join-community-btn" onClick={closeMenu}>
                  Join FREE Community
                </a>
              </li>

            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

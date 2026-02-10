"use client";

import { useEffect, useRef } from "react";
import "./globals.css";
import Image from "next/image";

export default function Header() {
  const promoRef = useRef<HTMLDivElement>(null);

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
            className="navbar-toggler js-fh5co-nav-toggle fh5co-nav-toggle"
            type="button"
            data-toggle="collapse"
            data-target="#ftco-nav"
            aria-controls="ftco-nav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="oi oi-menu"></span> Menu
          </button>

          <div className="collapse navbar-collapse" id="ftco-nav">
            <ul className="navbar-nav nav margin-left-auto">
              <li className="nav-item"><a href="/" className="nav-link"><span>Home</span></a></li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown">
                  Get for Free
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <a className="dropdown-item" href="/dotnet-code-rules-starter-kit">.NET Code Rules Starter Kit</a>
                  <a className="dropdown-item" href="/pass-your-interview">Pass Interview Prep Kit</a>
                  <a className="dropdown-item" href="/builder-pattern-free-stuff">Builder Pattern Chapter</a>
                  <a className="dropdown-item" href="/rag-system-dotnet">RAG System in .NET</a>
                </div>
              </li>

              <li className="nav-item" data-toggle="collapse" data-target="#ftco-nav">
                <a href="/blog" className="nav-link"><span>Blog</span></a>
              </li>

              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownCourses" role="button" data-toggle="dropdown">
                  Courses
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdownCourses">
                  <a className="dropdown-item" href="/pragmatic-dotnet-code-rules">Pragmatic .NET Code Rules</a>
                </div>
              </li>

              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownEbooks" role="button" data-toggle="dropdown">
                  Ebooks
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdownEbooks">
                  <a className="dropdown-item" href="/design-patterns-simplified">Ebook Simplified</a>
                  <a className="dropdown-item" href="/design-patterns-that-deliver-ebook">5 Patterns Ebook</a>
                </div>
              </li>

              <li className="nav-item" data-toggle="collapse" data-target="#ftco-nav">
                <a href="/sponsorship" className="nav-link"><span>For Sponsors</span></a>
              </li>

              <li className="nav-item nav-join-cta">
                <a href="https://www.skool.com/thecodeman-community-2911" className="join-community-btn">
                  Join FREE Community
                </a>
              </li>

            </ul>
          </div>
        </div>
      </nav>

      {/* ostatak tvog script-a može da ostane */}
    </>
  );
}

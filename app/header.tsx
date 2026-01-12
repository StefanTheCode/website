"use client"; // Add this line

import { useEffect } from 'react';
import './globals.css';
import Image from 'next/image';

export default function Header() {
  useEffect(() => {
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.navbar-nav .nav-item a');

    navItems.forEach(item => {
      if (item.getAttribute('href') === currentPath) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }, []);

  return (
    <>
      {/* <nav className="navbar background-yellow text-black navbar-expand-lg text-center ftco_navbar ftco-navbar-light site-navbar-target" id="ftco-navbar">
        <div className="container text-black">
          <div className="collapse navbar-collapse text-center">
            <p className='text-black'>BLACK FRIDAY SPECIAL OFFER: <b>60% OFF</b> all products. Use Code: <b>BF25</b> at checkout.</p>
          </div>
        </div>
      </nav> */}
      <nav className="navbar navbar-expand-lg navbar-dark ftco_navbar ftco-navbar-light site-navbar-target" id="ftco-navbar">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <Image
              src="/images/a.png"
              alt="Last YouTube video"
              className="social-icon"
              width={0}
              height={0}
              sizes="100vw"
              style={{
                width: '48px',      // ili '30%' ako baš želiš procenat
                height: '48px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginRight: '12px'
              }}
            />

            <div>
              Stefan Đokić
              <span
                style={{
                  display: "block",
                  fontSize: "1.2rem",
                  lineHeight: "0.9rem",
                  marginTop: "-25px",
                  fontWeight: 400
                }}
              >
                <hr style={{ marginBottom: "0.5rem" }}></hr>
                Microsoft MVP
              </span>
            </div>
          </a>

          <button className="navbar-toggler js-fh5co-nav-toggle fh5co-nav-toggle" type="button" data-toggle="collapse"
            data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="oi oi-menu"></span> Menu
          </button>
          <div className="collapse navbar-collapse" id="ftco-nav">
            <ul className="navbar-nav nav margin-left-auto">
              <li className="nav-item"><a href="/" className="nav-link"><span>Home</span></a></li>
              {/* <li className="nav-item"><a href="/about-me" className="nav-link">About</a></li>        */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Get for Free
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <a className="dropdown-item" href="/dotnet-code-rules-starter-kit">
                    .NET Code Rules Starter Kit
                  </a>
                  <a className="dropdown-item" href="/pass-your-interview">
                    Pass Interview Prep Kit
                  </a>
                  <a className="dropdown-item" href="/builder-pattern-free-stuff">
                    Builder Pattern Chapter
                  </a>
                  <a className="dropdown-item" href="/rag-system-dotnet">
                    RAG System in .NET
                  </a>
                </div>
              </li>
              <li className="nav-item" data-toggle="collapse" data-target="#ftco-nav"><a href="/blog"
                className="nav-link"><span>Blog</span></a></li>
              {/* <li className="nav-item" data-toggle="collapse" data-target="#ftco-nav"><a href="/design-patterns"
            className="nav-link"><span>Design Patterns Blog</span></a></li> */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Courses
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <a className="dropdown-item" href="/pragmatic-dotnet-code-rules">
                    Pragmatic .NET Code Rules
                  </a>
                </div>
              </li>

              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Ebooks
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <a className="dropdown-item" href="/design-patterns-simplified">
                    Ebook Simplified
                  </a>
                  <a className="dropdown-item" href="/design-patterns-that-deliver-ebook">
                    5 Patterns Ebook
                  </a>
                </div>
              </li>

              <li className="nav-item" data-toggle="collapse" data-target="#ftco-nav"><a
                href="/sponsorship"
                className="nav-link"><span>For Sponsors</span></a></li>
              {/* <li className="nav-item special-offer" data-toggle="collapse" data-target="#ftco-nav">
  <a href="/black-friday" className="nav-link black-friday-link">
    <span>🔥 Black Friday 🔥</span>
  </a>
</li> */}
            </ul>
          </div>
        </div>
      </nav>


      <div>
        <script dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener("DOMContentLoaded", function() {

                "use strict";
                
                // Burger Menu
                function burgerMenu() {
                    document.body.addEventListener('click', function(event) {
                        if (event.target.matches('.js-fh5co-nav-toggle')) {
                            var nav = document.getElementById('ftco-nav');
                            if (nav.style.display === 'block' || getComputedStyle(nav).display === 'block') {
                                event.target.classList.remove('active');
                                nav.style.display = 'none';
                            } else {
                                event.target.classList.add('active');
                                nav.style.display = 'block';
                            }
                            event.preventDefault();
                        }
                    });
                }
                burgerMenu();
                
                // Dropdown hover
                var dropdowns = document.querySelectorAll('nav .dropdown');
                dropdowns.forEach(function(dropdown) {
                    dropdown.addEventListener('mouseover', function() {
    this.classList.add('show');
    const link = this.querySelector('a');
    if (link) {
        link.setAttribute('aria-expanded', true);
    }
    const dropdownMenu = this.querySelector('.dropdown-menu');
    if (dropdownMenu) {
        dropdownMenu.classList.add('show');
    }
});
dropdown.addEventListener('mouseout', function() {
    this.classList.remove('show');
    const link = this.querySelector('a');
    if (link) {
        link.setAttribute('aria-expanded', false);
    }
    const dropdownMenu = this.querySelector('.dropdown-menu');
    if (dropdownMenu) {
        dropdownMenu.classList.remove('show');
    }
});

                });
                
                // Scroll Window
                function scrollWindow() {
                    window.addEventListener('scroll', function() {
                        var st = window.scrollY,
                            navbar = document.querySelector('.ftco_navbar'),
                            sd = document.querySelector('.js-scroll-wrap');
                
                        if (st > 150) {
                            if (!navbar.classList.contains('scrolled')) {
                                navbar.classList.add('scrolled');
                            }
                        }
                
                        if (st < 150) {
                            if (navbar.classList.contains('scrolled')) {
                                navbar.classList.remove('scrolled', 'sleep');
                            }
                        }
                
                        if (st > 350) {
                            if (!navbar.classList.contains('awake')) {
                                navbar.classList.add('awake');
                            }
                            if (sd) {
                                sd.classList.add('sleep');
                            }
                        }
                
                        if (st < 350) {
                            if (navbar.classList.contains('awake')) {
                                navbar.classList.remove('awake');
                                navbar.classList.add('sleep');
                            }
                            if (sd) {
                                sd.classList.remove('sleep');
                            }
                        }
                    });
                }
                scrollWindow();
            
            });            
            `
        }} />
      </div>
    </>
  )
}
import './globals.css'

export default function Header() {
    return (
        <>
           <nav className="navbar navbar-expand-lg navbar-dark ftco_navbar ftco-navbar-light site-navbar-target" id="ftco-navbar">
  <div className="container">
    <a className="navbar-brand" href="/">Stefan Đokić</a>
    <button className="navbar-toggler js-fh5co-nav-toggle fh5co-nav-toggle" type="button" data-toggle="collapse"
        data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="oi oi-menu"></span> Menu
    </button>
    <div className="collapse navbar-collapse" id="ftco-nav">
      <ul className="navbar-nav nav margin-left-auto">
        <li className="nav-item"><a href="/" className="nav-link"><span>Home</span></a></li>
        <li className="nav-item" data-toggle="collapse" data-target="#ftco-nav"><a href="/blog"
            className="nav-link"><span>Blog</span></a></li>
        <li className="nav-item" data-toggle="collapse" data-target="#ftco-nav"><a href="/design-patterns-simplified"
            className="nav-link"><span>E Book</span></a></li>
             <li className="nav-item" data-toggle="collapse" data-target="#ftco-nav"><a
            href="/sponsorship"
            className="nav-link"><span>Sponsorship</span></a></li>
        <li className="nav-item special-offer" data-toggle="collapse" data-target="#ftco-nav"><a href="/black-friday"
            className="nav-link"><span>Black Friday</span></a></li>
       
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
                        this.querySelector('> a').setAttribute('aria-expanded', true);
                        this.querySelector('.dropdown-menu').classList.add('show');
                    });
                    dropdown.addEventListener('mouseout', function() {
                        this.classList.remove('show');
                        this.querySelector('> a').setAttribute('aria-expanded', false);
                        this.querySelector('.dropdown-menu').classList.remove('show');
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
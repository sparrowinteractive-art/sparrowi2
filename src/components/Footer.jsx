import React from "react";
import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer" data-navbar-theme="dark">
      {/* Hero — sticky, stays in place while overlay scrolls over it */}
      <div className="footer__hero">
        <div className="footer__blob"></div>
        <h2 className="footer__hero-text">
          There&rsquo;s Always<br />
          Room for a Better<br />
          Experience.
        </h2>
      </div>

      {/* Content overlay — scrolls up over the sticky hero */}
      <div className="footer__overlay">
        <div className="footer__layout">
          <nav className="footer__nav">
            {["Home", "Works", "Services", "About Us", "Careers", "Blog"].map(
              (link) => (
                <a key={link} href={`/${link.toLowerCase().replace(" ", "-")}`} className="footer__nav-link">
                  {link}
                </a>
              )
            )}
          </nav>

          <div className="footer__right">
            <div className="footer__info">
              <div className="footer__contact">
                <h4 className="footer__info-heading">CONTACT</h4>
                <p>PT +351 916 740 305</p>
                <p>ES +34 611 851 141</p>
                <p>Around the world.</p>
              </div>
              <div className="footer__social">
                <h4 className="footer__info-heading">OUR VOICE</h4>
                <a href="#" className="footer__social-link">Instagram{"\u00A0\u00A0"}&nearr;</a>
                <a href="#" className="footer__social-link">LinkedIn{"\u00A0\u00A0"}&nearr;</a>
              </div>
            </div>

            <div className="footer__newsletter">
              <h4 className="footer__info-heading">SUBSCRIBE TO OUR NEWSLETTER</h4>
              <div className="footer__newsletter-form">
                <input type="email" placeholder="Enter your email*" className="footer__input" />
                <button className="footer__subscribe-btn">SUBSCRIBE</button>
              </div>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <img src="/images/logo.svg" alt="Sparrow" className="footer__logo-large" />
          <p className="footer__copyright">
            SPARROW INTERACTIVE ©
            <br />
            2026 ALL RIGHTS RESERVED
          </p>
        </div>
      </div>
    </footer>
  );
}

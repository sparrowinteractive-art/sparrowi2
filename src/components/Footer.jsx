import React from "react";
import { Grid, GridItem } from "./Grid";
import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer" data-navbar-theme="dark">
      {/* Fixed bottom panel — nav, contact, social, newsletter, copyright */}
      <div className="footer_back">
        {/* Glass-fill layer — sits ABOVE the animated blob pseudos so the
            blobs read as if they're rendered behind the glass. */}
        <div className="footer_back__glass" aria-hidden="true"></div>
        <Grid className="footer__layout">
          <GridItem span={{ base: 4, md: 8, lg: 5 }} className="footer__nav-cell">
            <nav className="footer__nav">
              {["Home", "Works", "Services", "About Us", "Careers", "Blog"].map(
                (link) => (
                  <a
                    key={link}
                    href={`/${link.toLowerCase().replace(" ", "-")}`}
                    className="footer__nav-link"
                  >
                    {link}
                  </a>
                )
              )}
            </nav>
          </GridItem>

          <GridItem span={{ base: 4, md: 8, lg: 7 }} className="footer__right">
            <Grid variant="inner" gap="gap-x-6 gap-y-6">
              <GridItem span={{ base: 4, md: 4, lg: 6 }}>
                <div className="footer__contact">
                  <h4 className="footer__info-heading">CONTACT</h4>
                  <p>PT +351 916 740 305</p>
                  <p>ES +34 611 851 141</p>
                  <p>Around the world.</p>
                </div>
              </GridItem>
              <GridItem span={{ base: 4, md: 4, lg: 6 }}>
                <div className="footer__social">
                  <h4 className="footer__info-heading">OUR VOICE</h4>
                  <a href="#" className="footer__social-link">Instagram{"\u00A0\u00A0"}&nearr;</a>
                  <a href="#" className="footer__social-link">LinkedIn{"\u00A0\u00A0"}&nearr;</a>
                </div>
              </GridItem>
            </Grid>

            <div className="footer__newsletter">
              <h4 className="footer__info-heading">SUBSCRIBE TO OUR NEWSLETTER</h4>
              <div className="footer__newsletter-form">
                <input type="email" placeholder="Enter your email*" className="footer__input" />
                <button className="footer__subscribe-btn">SUBSCRIBE</button>
              </div>
            </div>
          </GridItem>
        </Grid>

        <Grid className="footer__bottom">
          <GridItem span={{ base: 4, md: 4, lg: 6 }}>
            <img src="/images/logo.svg" alt="Sparrow" className="footer__logo-large" />
          </GridItem>
          <GridItem span={{ base: 4, md: 4, lg: 6 }} className="footer__bottom-right">
            <p className="footer__copyright">
              SPARROW INTERACTIVE ©
              <br />
              2026 ALL RIGHTS RESERVED
            </p>
          </GridItem>
        </Grid>
      </div>
    </footer>
  );
}

"use client";

import { useState } from "react";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import "@styles/ContactPage.css";

// Pin coordinates expressed as percentages of the world-map SVG's
// 1000×500 viewBox so they re-anchor automatically as the map scales.
const PINS = [
  { id: "india",   xPct: 67.5, yPct: 44, label: "India"        },
  { id: "uae",     xPct: 58,   yPct: 42, label: "Middle East"  },
  { id: "africa",  xPct: 49,   yPct: 54, label: "Africa"       },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "", email: "", subject: "", message: "", newsletter: false,
  });

  const updateField = (key) => (e) =>
    setForm((s) => ({
      ...s,
      [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  const onSubmit = (e) => {
    e.preventDefault();
    // Wire up to the real endpoint later — for now just echo to console
    // so the form is functional during design review.
    console.log("contact form", form);
  };

  return (
    <div className="contact-page" data-navbar-theme="dark">
      <Navbar logoVisible={true} />

      {/* ── Section 1 — hero CTA ────────────────────────────────────── */}
      <section className="contact-section contact-section--hero">
        <div className="contact-section__inner contact-hero">
          <h1 className="contact-hero__title">
            There&rsquo;s Always Room
            <br />
            for a Better Experience.
          </h1>
          <button
            type="button"
            className="contact-pill contact-pill--cta"
            onClick={() =>
              document
                .querySelector(".contact-section--info")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          >
            Lets Create One
          </button>
        </div>
      </section>

      {/* ── Section 2 — addresses (left) + glass form on pink (right) ── */}
      <section className="contact-section contact-section--info">
        {/* Bleeds-to-edge pink/magenta wash that lives behind the form */}
        <div className="contact-info__wash" aria-hidden="true" />
        <div className="contact-section__inner contact-info">
          <div className="contact-info__addresses">
            <div className="contact-address">
              <h3 className="contact-address__country">INDIA</h3>
              <p className="contact-address__line">7th Floor, Plot No 19A, Filmcity</p>
              <p className="contact-address__line">Sector 16 A, Noida - 201301, India</p>
              <p className="contact-address__line">
                +91-9810119956
                <span className="contact-address__sep">|</span>
                <a href="mailto:biz@sparrowi.com" className="contact-address__mail">biz@sparrowi.com</a>
              </p>
            </div>
            <div className="contact-address">
              <h3 className="contact-address__country">MIDDLE EAST</h3>
              <p className="contact-address__line">
                +971-588515640
                <span className="contact-address__sep">|</span>
                +91-9902778888
              </p>
              <p className="contact-address__line">
                <a href="mailto:biz@sparrowglobal.ae" className="contact-address__mail">biz@sparrowglobal.ae</a>
              </p>
            </div>
            <div className="contact-address">
              <h3 className="contact-address__country">AFRICA</h3>
              <p className="contact-address__line">
                <a href="mailto:biz@sparrowi.com" className="contact-address__mail">biz@sparrowi.com</a>
              </p>
            </div>

            <button type="button" className="contact-pill contact-pill--query">
              Any Query? Let Us Know.
            </button>
          </div>

          <form className="contact-form" onSubmit={onSubmit}>
            <div className="contact-form__field">
              <input
                type="text"
                placeholder="Your Full Name"
                value={form.name}
                onChange={updateField("name")}
                aria-label="Your full name"
              />
            </div>
            <div className="contact-form__field">
              <input
                type="email"
                placeholder="Email (needed to contact you)"
                value={form.email}
                onChange={updateField("email")}
                aria-label="Email"
              />
            </div>
            <div className="contact-form__field">
              <input
                type="text"
                placeholder="Subject"
                value={form.subject}
                onChange={updateField("subject")}
                aria-label="Subject"
              />
            </div>
            <div className="contact-form__field">
              <input
                type="text"
                placeholder="Message"
                value={form.message}
                onChange={updateField("message")}
                aria-label="Message"
              />
            </div>

            <label className="contact-form__check">
              <input
                type="checkbox"
                checked={form.newsletter}
                onChange={updateField("newsletter")}
              />
              <span>Yes, I would like to receive the free monthly newsletter.</span>
            </label>

            <button type="submit" className="contact-pill contact-pill--send">
              Send
            </button>
          </form>
        </div>
      </section>

      {/* ── Section 3 — world map with location pins ─────────────────── */}
      <section className="contact-section contact-section--map">
        <div className="contact-section__inner contact-map">
          <div className="contact-map__frame">
            <img
              src="/images/world-map.svg"
              alt="Map showing Sparrow office locations in India, the Middle East, and Africa"
              className="contact-map__image"
            />
            {PINS.map((p) => (
              <span
                key={p.id}
                className="contact-map__pin"
                style={{ left: `${p.xPct}%`, top: `${p.yPct}%` }}
                aria-label={p.label}
                role="img"
              >
                <svg
                  width="22"
                  height="30"
                  viewBox="0 0 22 30"
                  fill="#0a0a0a"
                  aria-hidden="true"
                >
                  <path d="M11 0C4.92 0 0 4.92 0 11c0 8.25 11 19 11 19s11-10.75 11-19C22 4.92 17.08 0 11 0Zm0 15a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" />
                </svg>
              </span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

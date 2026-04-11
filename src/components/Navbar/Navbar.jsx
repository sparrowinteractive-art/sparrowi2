"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import "@styles/Navbar.css";

export default function Navbar() {
  const { scrollY } = useScroll();
  const lastY = useRef(0);
  // "full" = top of page, "hidden" = scrolled down, "floating" = scrolled up
  const [mode, setMode] = useState("full");
  const [onLight, setOnLight] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = lastY.current;
    lastY.current = y;

    if (y < 100) {
      setMode("full");
    } else if (y > prev) {
      setMode("hidden");
    } else if (y < prev) {
      setMode("floating");
    }
  });

  // Detect if the floating pill is over a white section
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const navY = 40; // approx vertical center of the floating pill
        const sections = document.querySelectorAll('[data-navbar-theme="dark"]');
        let light = false;
        for (const section of sections) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= navY && rect.bottom >= navY) {
            light = true;
            break;
          }
        }
        setOnLight(light);
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navContent = (
    <>
      <button className="navbar__hamburger" aria-label="Menu">
        <span className="navbar__hamburger-line"></span>
        <span className="navbar__hamburger-line"></span>
        <span className="navbar__hamburger-line"></span>
      </button>

      <a href="/" className="navbar__logo">
        <img src="/images/logo.svg" alt="Sparrow" className="navbar__logo-light" />
        <img src="/images/logo-black.svg" alt="" className="navbar__logo-dark" />
      </a>

      <a href="/contact" className="navbar__cta">
        Let&apos;s Talk
      </a>
    </>
  );

  return (
    <>
      {/* Full-width bar — visible only at top, slides down from top edge */}
      <AnimatePresence>
        {mode === "full" && (
          <motion.nav
            key="full"
            className="navbar navbar--full"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="navbar__inner">{navContent}</div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Floating island — slides down when scrolling up, exits up */}
      <AnimatePresence>
        {mode === "floating" && (
          <motion.nav
            key="island"
            className={`navbar navbar--island${onLight ? " navbar--on-light" : ""}`}
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          >
            <div className="navbar__pill">{navContent}</div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

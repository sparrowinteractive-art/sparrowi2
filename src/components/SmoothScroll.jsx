"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Wraps the entire app with Lenis smooth scroll.
 *
 * Lenis controls window scroll position via requestAnimationFrame, so all
 * existing `window.addEventListener("scroll", …)` hooks (hero parallax,
 * gradient reveal, about parallax, team parallax) keep working — they just
 * read the smoothed scrollY each frame.
 */
export default function SmoothScroll({ children }) {
  useEffect(() => {
    // Respect users who prefer reduced motion — give them native scroll.
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      // `lerp` mode (frame-by-frame interpolation) feels noticeably smoother
      // than `duration` mode for free wheel scrolling — there's no fixed
      // animation endpoint, so the page tracks the wheel/trackpad more
      // organically. 0.08 = silky-smooth without feeling laggy.
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      // Touch devices use native momentum; only smooth wheel/trackpad.
      syncTouch: false,
    });

    // Expose the Lenis instance globally so other components (e.g. the
    // team-photo scroll-jack pan in HomePage.jsx) can call lenis.stop() /
    // lenis.start() / lenis.scrollTo() to lock and release scrolling.
    // Bracket notation avoids TS hints about undeclared Window properties.
    window["__lenis"] = lenis;

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete window["__lenis"];
    };
  }, []);

  return children;
}

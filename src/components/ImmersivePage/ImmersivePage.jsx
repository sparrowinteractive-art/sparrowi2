"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import BetterExperience from "@components/BetterExperience";
import { Grid, GridItem } from "@components/Grid";
import "@styles/ImmersivePage.css";

// Five curved-screen frames, each backed by its own short video. Drop
// Curved-2.mp4 … Curved-5.mp4 into /public/video/ to replace the
// Curved-1.mp4 placeholders below — no code change needed.
const FRAMES = [
  {
    video: "/video/Curved-1.mp4",
    title: "Curved Screen Theatres",
    description:
      "Immerse incredibly up close in visuals. A curved screen\nexperience, created to pull you deeper into the story.",
  },
  {
    video: "/video/Curved-2.mp4",
    title: "Curved screen with Floor Projection",
    description:
      "The story doesn't just surround you, it grounds you with\nvisuals extending from screen to floor.",
  },
  {
    video: "/video/Curved-3.mp4",
    title: "3-sided Projection",
    description:
      "Stories that extend beyond the front,\ndrawing your peripheral vision into the experience.",
  },
  {
    video: "/video/Curved-4.mp4",
    title: " 3-sided with Floor Projection",
    description:
      "A fully enveloping environment with ceiling and the ground,\nplacing you right at the centre of the world.",
  },
  {
    video: "/video/Curved-5.mp4",
    title: " Projection Mapping",
    description:
      "HD projectors mapping every section of the scale model,\naugmenting reality and blurring the line between structure and imagination.",
  },
];

// Reusable intro hero content. Rendered twice — once per split half — so
// the two halves can translate independently while displaying the same
// underlying layout. The right-side clone is marked aria-hidden so
// screen readers only see one copy.
function IntroHero() {
  return (
    <div className="immersive-intro__inner">
      <Grid>
        <GridItem
          span={{ base: 4, md: 8, lg: 8 }}
          start={{ lg: 2 }}
          className="immersive-intro__title-cell"
        >
          <h1 className="immersive-intro__title">
            Immersive
            <br />
            Experiences
          </h1>
        </GridItem>
        <GridItem
          span={{ base: 4, md: 5, lg: 4 }}
          start={{ md: 4, lg: 8 }}
          className="immersive-intro__copy-cell"
        >
          <p className="immersive-intro__lede">
            Immersive theatres and 360° spaces.
            <br />
            <span className="immersive-intro__accent">
              Total sensory immersion.
            </span>
          </p>
          <ul className="immersive-intro__list">
            <li>Curved Screen Theatres</li>
            <li>Curved Screen with Floor Projection</li>
            <li>Three-sided Screen Theatres</li>
            <li>360 Immersive Theatres</li>
            <li>Projection Mapping</li>
          </ul>
        </GridItem>
      </Grid>
    </div>
  );
}

export default function ImmersivePage() {
  // ── Unified pinned stack (intro split + curved-frame crossfade) ──
  // The pin wrapper is (FRAMES.length + 1) viewports tall: one viewport
  // of scroll for the intro center-split reveal (phase 0), then one
  // viewport per curved frame (phases 1..N). The first curved video
  // plays behind the glass intro from the start, so when the intro
  // halves slide apart the next section is already visible behind them.
  const TOTAL_PHASES = FRAMES.length + 1;
  const pinRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeProgress, setActiveProgress] = useState(0);
  const [introProgress, setIntroProgress] = useState(0); // 0..1 across phase 0

  useEffect(() => {
    const pin = pinRef.current;
    if (!pin) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const rect = pin.getBoundingClientRect();
        const totalScroll = pin.offsetHeight - window.innerHeight;
        if (totalScroll <= 0) return;
        const raw = -rect.top / totalScroll;
        const clamped = Math.min(Math.max(raw, 0), 0.9999);

        const phaseSize = 1 / TOTAL_PHASES;
        if (clamped < phaseSize) {
          // Phase 0 — intro split. Frame 0 stays fully visible behind.
          setIntroProgress(clamped / phaseSize);
          setActiveIndex(0);
          setActiveProgress(0);
        } else {
          setIntroProgress(1);
          const curvedRange = (clamped - phaseSize) / (1 - phaseSize); // 0..1
          const stepSize = 1 / FRAMES.length;
          const idx = Math.min(
            Math.floor(curvedRange / stepSize),
            FRAMES.length - 1
          );
          const within = (curvedRange - idx * stepSize) / stepSize;
          setActiveIndex(idx);
          setActiveProgress(within);
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [TOTAL_PHASES]);

  // Crossfade window — last 40% of each step is reserved for the fade
  // into the next one. The eased curve smooths the start/end of the
  // transition so the swap feels like a soft dissolve rather than a
  // linear ramp tied 1:1 to scroll position.
  const FADE_TAIL = 0.4;
  const easeInOutCubic = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const opacityFor = (i) => {
    if (i === activeIndex) {
      if (activeIndex === FRAMES.length - 1) return 1;
      if (activeProgress < 1 - FADE_TAIL) return 1;
      const t = (activeProgress - (1 - FADE_TAIL)) / FADE_TAIL;
      return 1 - easeInOutCubic(t);
    }
    if (i === activeIndex + 1) {
      if (activeProgress < 1 - FADE_TAIL) return 0;
      const t = (activeProgress - (1 - FADE_TAIL)) / FADE_TAIL;
      return easeInOutCubic(t);
    }
    return 0;
  };

  // Text opacity uses a *sequential* crossfade — outgoing text fades fully
  // out in the first half of the fade window, then the incoming text fades
  // in during the second half. This prevents two text blocks from
  // overlapping on top of each other (they share the same bottom anchor),
  // which previously made the old title appear ghosted under the new one.
  const textOpacityFor = (i) => {
    if (i === activeIndex) {
      if (activeIndex === FRAMES.length - 1) return 1;
      if (activeProgress < 1 - FADE_TAIL) return 1;
      const t = (activeProgress - (1 - FADE_TAIL)) / FADE_TAIL; // 0..1
      if (t >= 0.5) return 0;
      return 1 - easeInOutCubic(t * 2);
    }
    if (i === activeIndex + 1) {
      if (activeProgress < 1 - FADE_TAIL) return 0;
      const t = (activeProgress - (1 - FADE_TAIL)) / FADE_TAIL; // 0..1
      if (t <= 0.5) return 0;
      return easeInOutCubic((t - 0.5) * 2);
    }
    return 0;
  };

  // Intro split — eased translation so the halves accelerate softly out
  // rather than tracking scroll 1:1.
  const splitT = easeInOutCubic(introProgress);
  const introHidden = introProgress >= 0.999;

  return (
    <div className="immersive-page">
      <Navbar logoVisible={true} />

      {/* Unified pinned stack — intro overlay sits on top of the curved
          frame crossfade and splits apart on scroll. */}
      <div
        ref={pinRef}
        className="immersive-pin"
        style={{ height: `${TOTAL_PHASES * 100}vh` }}
      >
        <div className="immersive-pin__sticky immersive-frame immersive-frame--curved">
          {/* Stacked video layers — one per curved frame. */}
          <div className="immersive-pin__media">
            {FRAMES.map((f, i) => (
              <div
                key={`m-${f.title}`}
                className="immersive-pin__media-layer"
                style={{ opacity: opacityFor(i) }}
                aria-hidden="true"
              >
                <video
                  className="immersive-frame__video"
                  src={f.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  disablePictureInPicture
                  disableRemotePlayback
                />
              </div>
            ))}
          </div>

          {/* Vertical progress bar — only meaningful once we're in the
              curved-frame phase, so it fades in as the intro splits out. */}
          <div
            className="immersive-pin__progress"
            aria-hidden="true"
            style={{ opacity: introProgress }}
          >
            <div
              className="immersive-pin__progress-fill"
              style={{
                transform: `scaleY(${
                  (activeIndex + activeProgress) / FRAMES.length
                })`,
              }}
            />
          </div>

          {/* Stacked text layers for curved frames — hidden behind the
              intro overlay until the split completes. */}
          <div
            className="immersive-pin__text"
            style={{ opacity: introProgress }}
          >
            {FRAMES.map((f, i) => (
              <div
                key={`t-${f.title}`}
                className="immersive-pin__text-layer"
                style={{ opacity: textOpacityFor(i) }}
              >
                <Grid>
                  <GridItem
                    span={{ base: 4, md: 8, lg: 8 }}
                    start={{ lg: 3 }}
                    className="immersive-frame__text-cell"
                  >
                    <h2 className="immersive-frame__title">{f.title}</h2>
                    <p className="immersive-frame__desc">{f.description}</p>
                  </GridItem>
                </Grid>
              </div>
            ))}
          </div>

          {/* Phase-0 intro overlay — two glass-filled halves clipped to
              the left/right of the viewport. They render the same hero
              content and slide outward on scroll, revealing the curved
              video already playing behind them. */}
          <div
            className="immersive-intro-overlay"
            style={{
              visibility: introHidden ? "hidden" : "visible",
              pointerEvents: introHidden ? "none" : "auto",
            }}
            aria-hidden={introHidden}
          >
            <div
              className="immersive-intro__half immersive-intro__half--left"
              style={{ transform: `translateX(${-splitT * 100}%)` }}
            >
              <IntroHero />
            </div>
            <div
              className="immersive-intro__half immersive-intro__half--right"
              style={{ transform: `translateX(${splitT * 100}%)` }}
              aria-hidden="true"
            >
              <IntroHero />
            </div>
          </div>
        </div>
      </div>

      <BetterExperience
        text={
          <>
            Stories that Surround.<br />
            Spaces that Move.<br />
            Worlds you Live in.
          </>
        }
      />
      <Footer />
    </div>
  );
}

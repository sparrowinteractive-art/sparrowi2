"use client";

import { useRef, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import { Grid, GridItem } from "@components/Grid";
import "@styles/HomePage.css";

// ─────────────────────────────────────────────────────────────────
// StatsTicker — odometer-style hover ticker for the About section
// ─────────────────────────────────────────────────────────────────
// Stats stack vertically inside an overflow-clipped column. Hovering
// anywhere on the row advances the index forward (item exits up, next
// enters from below) on a hold-then-advance loop. A duplicate of the
// first item is appended at the end so the wrap-around is seamless:
// the duplicate slides in normally, then we silently snap back to
// index 0 with the transition disabled. On hover-out the index walks
// back to 0 one step at a time — visually reversing the cycle.
const STATS = [
  { number: "30+",   label: ["Years of",  "Legacy"] },
  { number: "2.5k+", label: ["Projects",  "Executed"] },
  { number: "200+",  label: ["Clients",   "Globally"] },
  { number: "120+",  label: ["Creative",  "Professionals"] },
];
const HOLD_MS = 1500;       // dwell time on each item while hovering
const TRANSITION_MS = 850;  // slide duration between items (slower = smoother)

// ─────────────────────────────────────────────────────────────────
// Testimonials carousel data
// ─────────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote:
      "We've worked with visualisation studios before. The difference with Sparrow is that they don't think in deliverables — they think in journeys. Every room, every transition, every moment in our experience centre was designed to move a buyer one step closer to yes.",
    name: "Marketing Head",
    company: "GAURS, Noida",
  },
  {
    quote:
      "Sparrow turned our launch into an event people still talk about. The phygital experience felt cinematic — our buyers walked in skeptical and walked out booking units. That's not just design, that's storytelling at scale.",
    name: "Sales Director",
    company: "Lodha Group, Mumbai",
  },
  {
    quote:
      "What sets Sparrow apart is that they obsess over the small things — the quality of light through a virtual window, the texture of a wall you'll never touch. That obsession is exactly what makes the unbuilt feel real.",
    name: "Design Lead",
    company: "Emaar, Dubai",
  },
];

function StatsTicker() {
  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  // `snapping` disables the CSS transition for one frame so we can
  // jump from the duplicate-of-first slot back to index 0 invisibly.
  const [snapping, setSnapping] = useState(false);
  // True right after hover-in, until the first advance has fired.
  // We use this to skip the dwell delay on the very first step so
  // hovering feels instantly responsive.
  const [justEntered, setJustEntered] = useState(false);

  useEffect(() => {
    let timeoutId;

    if (snapping) {
      // Re-enable transitions on the next frame after the silent snap
      timeoutId = setTimeout(() => setSnapping(false), 20);
    } else if (hovering) {
      if (index === STATS.length) {
        // Currently sliding into the duplicate slot. After the slide
        // finishes, snap back to index 0 with transitions off.
        timeoutId = setTimeout(() => {
          setSnapping(true);
          setIndex(0);
        }, TRANSITION_MS);
      } else {
        // First advance after hover-in is near-instant. Subsequent
        // advances use the normal dwell time.
        const delay = justEntered ? 60 : HOLD_MS;
        timeoutId = setTimeout(() => {
          setIndex((p) => p + 1);
          if (justEntered) setJustEntered(false);
        }, delay);
      }
    } else if (index > 0) {
      // Hover ended — reverse one step at a time back to 0
      timeoutId = setTimeout(() => setIndex((p) => p - 1), TRANSITION_MS);
    }

    return () => clearTimeout(timeoutId);
  }, [index, hovering, snapping, justEntered]);

  // Append a duplicate of the first item for the seamless wrap-around
  const cells = [...STATS, STATS[0]];

  const innerStyle = {
    transform: `translate3d(0, ${-index * 100}%, 0)`,
    // Smooth in-out cubic — accelerates from rest, decelerates into rest.
    // Feels more like a physical odometer than the original sharp expo curve.
    transition: snapping
      ? "none"
      : `transform ${TRANSITION_MS}ms cubic-bezier(0.65, 0.05, 0.36, 1)`,
  };

  return (
    <div
      className="stats-ticker"
      onMouseEnter={() => {
        setHovering(true);
        setJustEntered(true);
      }}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="stats-ticker__col stats-ticker__col--number">
        <div className="stats-ticker__inner" style={innerStyle}>
          {cells.map((s, i) => (
            <span
              key={`n-${i}`}
              className="stats-ticker__cell stats-ticker__cell--number"
            >
              {s.number}
            </span>
          ))}
        </div>
      </div>

      <div className="stats-ticker__col stats-ticker__col--label">
        <div className="stats-ticker__inner" style={innerStyle}>
          {cells.map((s, i) => (
            <span
              key={`l-${i}`}
              className="stats-ticker__cell stats-ticker__cell--label"
            >
              {s.label[0]}
              <br />
              {s.label[1]}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const pathname = usePathname();
  const gradientRef = useRef(null);
  const heroInnerRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroDescRef = useRef(null);
  const showcaseVideoRef = useRef(null);
  const showcaseCanvasRef = useRef(null);
  const showcaseSectionRef = useRef(null);

  // ── Preloader state (declared early so hero entrance can depend on it) ──
  const [loading, setLoading] = useState(true);
  const [morphing, setMorphing] = useState(false);
  const preloaderLogoRef = useRef(null);

  // ── Showcase video text overlays ──
  // Define your text entries here. Times are in SECONDS.
  // To find the right times: open video_on_scroll.mp4 in any video
  // player, note the timestamp when each scene starts/ends, and
  // enter those values below.
  const VIDEO_LEGENDS = [
    { title: "See the Unbuilt",                subtitle: "High-fidelity 3D visualizations that turn concepts\ninto clear, compelling walkthroughs.", start: 1,  end: 3  },
    { title: "Live the Moment",                subtitle: "Immersive theatres and 360° environments\ndesigned to fully engage the senses.",        start: 5,  end: 7 },
    { title: "Step Inside Virtually",          subtitle: "Touch. Explore. Interact.\nPowered by AR, VR, XR, and holographic systems.",             start: 14, end: 17 },
    { title: "God\u2019s View",                subtitle: "Smart, interactive scale models offering a complete,\nintuitive view of the entire project.",  start: 21, end: 27 },
    { title: "Ultimate Experience Environment", subtitle: "Where story, space, and technology come together—\nso real, it feels like you’re already living it.", start: 30, end: 32 },
  ];
  const [activeLegend, setActiveLegend] = useState(null);
  const aboutLayoutRef = useRef(null);
  const touchTitleRef = useRef(null);
  const touchAccentRef = useRef(null);
  const partnerTextRef = useRef(null);
  const teamLabelRef = useRef(null);
  const teamTopRef = useRef(null);
  const teamPhotoRef = useRef(null);
  const teamPinRef = useRef(null);

  // Testimonials carousel — index + slide direction. `dir` is "next" (right
  // arrow → new content slides in from right) or "prev" (left arrow → from left).
  // We key the inner element on the index so React replaces the DOM node and
  // the CSS animation re-runs cleanly every navigation.
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [testimonialDir, setTestimonialDir] = useState("next");

  const goToTestimonial = (delta) => {
    setTestimonialDir(delta > 0 ? "next" : "prev");
    setTestimonialIndex(
      (prev) => (prev + delta + TESTIMONIALS.length) % TESTIMONIALS.length
    );
  };

  // Hero text parallax — container drifts up as user scrolls down (entrance is CSS)
  useEffect(() => {
    const inner = heroInnerRef.current;
    if (!inner) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const vh = window.innerHeight;
        const progress = Math.min(Math.max(scrollY / vh, 0), 1);
        // ease-out-cubic for smoother deceleration at the end
        const eased = 1 - Math.pow(1 - progress, 3);
        inner.style.transform = `translate3d(0, ${-eased * 180}px, 0)`;
        // Fade out faster — text gone by the time page 2 is halfway up
        const fade = Math.min(progress * 2, 1);
        inner.style.opacity = 1 - fade;
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Showcase video — scroll-driven playback via canvas.
  // A hidden <video> is used for seeking. Decoded frames are drawn to a
  // <canvas> only when the browser has finished seeking — no half-decoded
  // or flickering frames ever appear. Lerp smoothing eases between seeks,
  // and a minimum-delta threshold prevents micro-seek stutter.
  useEffect(() => {
    const video = showcaseVideoRef.current;
    const canvas = showcaseCanvasRef.current;
    const section = showcaseSectionRef.current;
    if (!video || !canvas || !section) return;

    const ctx = canvas.getContext("2d");
    let targetTime = 0;
    let lastSeekTime = -1;
    let isSeeking = false;
    let rafId = null;

    const LERP = 0.08;
    const SEEK_THRESHOLD = 0.04; // only seek if diff > 40ms

    // Size canvas to match video dimensions
    const sizeCanvas = () => {
      const w = video.videoWidth || 1920;
      const h = video.videoHeight || 1080;
      if (canvas.width !== w) canvas.width = w;
      if (canvas.height !== h) canvas.height = h;
    };

    const drawFrame = () => {
      sizeCanvas();
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    };

    const updateTarget = () => {
      const rect = section.getBoundingClientRect();
      const scrollRange = section.offsetHeight - window.innerHeight;
      const raw = -rect.top / scrollRange;
      const progress = Math.min(Math.max(raw, 0), 1);

      if (video.duration && isFinite(video.duration)) {
        targetTime = progress * video.duration;
      }
    };

    // When a seek completes, draw the decoded frame to canvas
    const onSeeked = () => {
      isSeeking = false;
      drawFrame();
    };

    const tick = () => {
      const diff = targetTime - lastSeekTime;

      // Only issue a new seek if we're not already seeking
      // and the change is large enough to warrant a new frame
      if (!isSeeking && Math.abs(diff) > SEEK_THRESHOLD) {
        // Lerp toward target for smoothness
        const next = lastSeekTime + diff * LERP;
        lastSeekTime = next;
        isSeeking = true;
        video.currentTime = next;
      }

      // Update active legend text based on current time
      const legend = VIDEO_LEGENDS.find(
        (l) => lastSeekTime >= l.start && lastSeekTime < l.end
      );
      setActiveLegend(legend || null);

      rafId = requestAnimationFrame(tick);
    };

    const onScroll = () => updateTarget();

    const onReady = () => {
      sizeCanvas();
      updateTarget();
      lastSeekTime = targetTime;
      video.currentTime = targetTime;
    };

    video.addEventListener("loadedmetadata", onReady);
    video.addEventListener("seeked", onSeeked);
    window.addEventListener("scroll", onScroll, { passive: true });
    updateTarget();
    lastSeekTime = targetTime;
    rafId = requestAnimationFrame(tick);

    return () => {
      video.removeEventListener("loadedmetadata", onReady);
      video.removeEventListener("seeked", onSeeked);
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Scroll-driven gradient reveal — clip tracks the partner-content top edge
  useEffect(() => {
    const gradient = gradientRef.current;
    if (!gradient) return;
    const partner = document.querySelector(".partner-wrapper");
    if (!partner) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const partnerTop = partner.getBoundingClientRect().top;
        const gRect = gradient.getBoundingClientRect();
        const visible = gRect.bottom - partnerTop;
        const progress = Math.max(0, Math.min(visible / gRect.height, 1));

        gradient.style.clipPath = `inset(${(1 - progress) * 100}% 0 0 0)`;
        gradient.style.opacity = progress;
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // About layout reveal — fade-up, replays on every scroll-in.
  // Same observer pattern as the partner text.
  useEffect(() => {
    const el = aboutLayoutRef.current;
    if (!el) return;

    const playReveal = () => {
      el.classList.remove("about-reveal--active");
      void el.offsetWidth;
      el.classList.add("about-reveal--active");
    };

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      playReveal();
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          playReveal();
        } else {
          el.classList.remove("about-reveal--active");
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -10% 0px",
      }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  // Same parallax pattern for the Team section: team__top and team__photo-wrapper
  // both rise from below, settle at natural position, then drift upward.
  // ResizeObserver handles the image-load layout shift in team__photo-wrapper.
  useEffect(() => {
    const teamLabel = teamLabelRef.current;
    const teamTop = teamTopRef.current;
    if (!teamLabel || !teamTop) return;

    const setupParallax = (element, { enterDistance = 320, driftDistance = 200 } = {}) => {
      let elPageY = 0;
      let elH = 0;

      const measure = () => {
        element.style.transform = "none";
        const r = element.getBoundingClientRect();
        elPageY = r.top + window.scrollY;
        elH = r.height;
      };
      measure();

      let ticking = false;
      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const vh = window.innerHeight;
          const elTop = elPageY - scrollY;

          const raw = (vh - elTop) / (vh + elH);
          const progress = Math.min(Math.max(raw, 0), 1);

          let y;
          let opacity;

          if (progress < 0.5) {
            const p = progress * 2;
            const eased = 1 - Math.pow(1 - p, 3);
            y = (1 - eased) * enterDistance;
            opacity = Math.min(eased * 1.3, 1);
          } else {
            const p = (progress - 0.5) * 2;
            y = -p * driftDistance;
            opacity = 1;
          }

          element.style.transform = `translate3d(0, ${y}px, 0)`;
          element.style.opacity = opacity;
          ticking = false;
        });
      };

      const onResize = () => {
        measure();
        onScroll();
      };

      // Re-measure when the element itself changes size (e.g. image load)
      const ro = new ResizeObserver(() => {
        measure();
        onScroll();
      });
      ro.observe(element);

      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize);
      onScroll();

      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
        ro.disconnect();
      };
    };

    const cleanupLabel = setupParallax(teamLabel, { enterDistance: 220, driftDistance: 120 });
    const cleanupTop = setupParallax(teamTop, { enterDistance: 280, driftDistance: 150 });
    // No vertical parallax on the photo wrapper — it's `position: sticky`
    // and gets pinned during the scroll-jacked horizontal pan instead.
    // A transform here would break sticky positioning.

    return () => {
      cleanupLabel();
      cleanupTop();
    };
  }, []);

  // Team photo horizontal pan — scroll-driven.
  // The sticky wrapper stays pinned while the user scrolls through the
  // pin container. Scroll progress maps proportionally to the horizontal
  // pan with smooth lerp interpolation. No scroll-jacking, no Lenis
  // stop/start, no wheel capture — just natural scroll → pan.
  useEffect(() => {
    const pin = teamPinRef.current;
    const wrapper = teamPhotoRef.current;
    if (!pin || !wrapper) return;
    const img = wrapper.querySelector(".team__photo");
    if (!img) return;

    const isMobile = () => window.matchMedia("(max-width: 768px)").matches;
    if (isMobile()) return;

    let pinTop = 0;
    let scrollRange = 0;
    let maxPan = 0;
    let panCurrent = 0;
    let rafId = null;

    const LERP = 0.1;

    const measure = () => {
      const pinRect = pin.getBoundingClientRect();
      pinTop = pinRect.top + window.scrollY;
      // Scroll range = how much scroll travel is available while sticky
      scrollRange = pinRect.height - window.innerHeight;

      const wrapRect = wrapper.getBoundingClientRect();
      if (img.naturalWidth && img.naturalHeight) {
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        const imgDisplayedW = wrapRect.height * aspectRatio;
        img.style.setProperty("--base-left", "0px");
        maxPan = Math.max(0, imgDisplayedW - wrapRect.width);
      }
    };

    const tick = () => {
      if (scrollRange <= 0 || maxPan <= 0) {
        rafId = null;
        return;
      }

      // How far through the pin container the user has scrolled (0 → 1)
      const raw = (window.scrollY - pinTop) / scrollRange;
      const progress = Math.min(Math.max(raw, 0), 1);
      const panTarget = progress * maxPan;

      const diff = panTarget - panCurrent;
      if (Math.abs(diff) < 0.5) {
        panCurrent = panTarget;
      } else {
        panCurrent += diff * LERP;
      }

      img.style.setProperty("--pan", `${-panCurrent}px`);
      rafId = requestAnimationFrame(tick);
    };

    const startTicker = () => {
      if (rafId == null) rafId = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      startTicker();
    };

    const onLoad = () => measure();
    const onResize = () => measure();

    if (img.complete && img.naturalWidth) {
      measure();
    } else {
      img.addEventListener("load", onLoad);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onScroll();

    return () => {
      img.removeEventListener("load", onLoad);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Hero title + description entrance — JS-driven so it RE-FIRES on every
  // page visit (Next.js client-side nav, bfcache restore, etc.) rather than
  // running only once when the CSS keyframe is first parsed.
  // Re-keys on `pathname` so revisiting the route replays the animation,
  // and listens to `pageshow` for back/forward (bfcache) restores.
  useEffect(() => {
    if (loading) return;

    const title = heroTitleRef.current;
    const desc = heroDescRef.current;
    if (!title || !desc) return;

    const playEntrance = () => {
      // Reset to start state
      title.classList.remove("hero-text--in");
      desc.classList.remove("hero-text--in");

      // Force a reflow so the browser registers the reset before adding the
      // class back — without this the class swap is batched and no animation
      // plays on repeat visits.
      void title.offsetWidth;

      // Trigger entrance on next frame
      requestAnimationFrame(() => {
        title.classList.add("hero-text--in");
        desc.classList.add("hero-text--in");
      });
    };

    playEntrance();

    // bfcache (back/forward) restore — useEffect does NOT re-run, so listen here
    const onPageShow = (e) => {
      if (e.persisted) playEntrance();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [pathname, loading]);

  // Partner statement reveal — fade-up + blur-in, replays on every scroll-in.
  // Same observer pattern as the touch title below.
  useEffect(() => {
    const el = partnerTextRef.current;
    if (!el) return;

    const playReveal = () => {
      el.classList.remove("partner-blur--active");
      void el.offsetWidth;
      el.classList.add("partner-blur--active");
    };

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      playReveal();
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          playReveal();
        } else {
          el.classList.remove("partner-blur--active");
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -10% 0px",
      }
    );
    observer.observe(el);

    const onPageShow = (e) => {
      if (!e.persisted) return;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) playReveal();
    };
    window.addEventListener("pageshow", onPageShow);

    return () => {
      observer.disconnect();
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [pathname]);

  // Blur-to-sharp word reveal — REPLAYS every time the title enters the viewport.
  // The observer stays alive for the lifetime of the page; on each enter we
  // remove the class, force a reflow, then re-add it so the keyframe restarts.
  // On exit we remove the class so the next entry has a clean slate.
  useEffect(() => {
    const title = touchTitleRef.current;
    if (!title) return;

    const playReveal = () => {
      // Reset → reflow → re-add to restart the CSS animation
      title.classList.remove("blur-reveal--active");
      void title.offsetWidth;
      title.classList.add("blur-reveal--active");
    };

    // If the title is already in view on mount (mid-page refresh), play once immediately
    const rect = title.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      playReveal();
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          playReveal();
        } else {
          // Clear the class on exit so the next entry restarts cleanly
          title.classList.remove("blur-reveal--active");
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -10% 0px",
      }
    );
    observer.observe(title);

    // bfcache restore — replay if currently visible
    const onPageShow = (e) => {
      if (!e.persisted) return;
      const r = title.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) playReveal();
    };
    window.addEventListener("pageshow", onPageShow);

    return () => {
      observer.disconnect();
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [pathname]);

  // "Touch of More" gradient slicing — each word is its own element (so it can
  // animate independently with blur+opacity), but each word displays a SLICE
  // of one unified gradient sized to the whole phrase. JS measures each word's
  // offset within the parent and writes CSS variables that the .touch__accent
  // .blur-word rule reads via background-size + background-position.
  useEffect(() => {
    const accent = touchAccentRef.current;
    if (!accent) return;

    const measure = () => {
      const phraseRect = accent.getBoundingClientRect();
      const phraseWidth = phraseRect.width;
      if (!phraseWidth) return;

      const words = accent.querySelectorAll(".blur-word");
      words.forEach((word) => {
        const wordRect = word.getBoundingClientRect();
        const offset = wordRect.left - phraseRect.left;
        word.style.setProperty("--phrase-w", `${phraseWidth}px`);
        word.style.setProperty("--word-offset", `${-offset}px`);
      });
    };

    // Measure now, then again after fonts settle (font load shifts widths)
    measure();
    if (document.fonts?.ready) {
      document.fonts.ready.then(measure);
    }

    const ro = new ResizeObserver(measure);
    ro.observe(accent);
    window.addEventListener("resize", measure);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [pathname]);


  // ── Preloader — wait for critical assets before revealing the page ──

  // Lock scroll while loading so users can't scroll past while preloader is up
  useEffect(() => {
    if (loading || morphing) {
      document.body.style.overflow = "hidden";
      window["__lenis"]?.stop();
    } else {
      window.scrollTo(0, 0);
      document.body.style.overflow = "";
      window["__lenis"]?.start();
    }
  }, [loading, morphing]);

  // Start the morph animation: calculate FLIP coordinates and transition
  const morphStarted = useRef(false);
  const startMorph = () => {
    if (morphStarted.current) return;
    morphStarted.current = true;
    setLoading(false);
    setMorphing(true);

    const logo = preloaderLogoRef.current;
    if (!logo) {
      setMorphing(false);
      return;
    }

    // Measure preloader logo's current position
    const from = logo.getBoundingClientRect();

    // Navbar logo target: centered horizontally, vertically centered in 56px bar
    // Navbar logo height is 32px — compute target rect
    const targetH = 32;
    const aspect = from.width / from.height;
    const targetW = targetH * aspect;
    const targetX = (window.innerWidth - targetW) / 2;
    const targetY = (56 - targetH) / 2; // centered in navbar height

    // Calculate translation and scale
    const scaleVal = targetH / from.height;
    const dx = targetX + targetW / 2 - (from.left + from.width / 2);
    const dy = targetY + targetH / 2 - (from.top + from.height / 2);

    // Apply CSS custom properties for the morph animation
    logo.style.setProperty("--morph-dx", `${dx}px`);
    logo.style.setProperty("--morph-dy", `${dy}px`);
    logo.style.setProperty("--morph-scale", scaleVal);

    // Listen for the morph animation specifically
    const onEnd = (e) => {
      if (e.animationName !== "preloaderLogoMorph") return;
      logo.removeEventListener("animationend", onEnd);
      setMorphing(false);
    };
    logo.addEventListener("animationend", onEnd);
    logo.classList.add("preloader__logo--morphing");
  };

  useEffect(() => {
    const timeout = setTimeout(() => startMorph(), 8000); // fallback max 8s

    // Minimum time the preloader must show (let logo animation play out)
    const minDisplay = new Promise((res) => setTimeout(res, 3000));

    const waitForAssets = async () => {
      try {
        // Wait for all images in the page
        const images = Array.from(document.querySelectorAll("img"));
        const imagePromises = images.map(
          (img) =>
            img.complete
              ? Promise.resolve()
              : new Promise((res) => {
                  img.addEventListener("load", res, { once: true });
                  img.addEventListener("error", res, { once: true });
                })
        );

        // Wait for videos to have enough data
        const videos = Array.from(document.querySelectorAll("video"));
        const videoPromises = videos.map(
          (vid) =>
            vid.readyState >= 2
              ? Promise.resolve()
              : new Promise((res) => {
                  vid.addEventListener("loadeddata", res, { once: true });
                  vid.addEventListener("error", res, { once: true });
                })
        );

        // Wait for both assets AND minimum display time
        await Promise.all([...imagePromises, ...videoPromises, minDisplay]);
      } catch (_) {
        // proceed even if some assets fail
      }
      clearTimeout(timeout);
      startMorph();
    };

    waitForAssets();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="homepage">
      {/* Preloader overlay */}
      <div className={`preloader${morphing ? " preloader--morphing" : !loading ? " preloader--hidden" : ""}`}>
        <div className="preloader__blob preloader__blob--1"></div>
        <div className="preloader__blob preloader__blob--2"></div>
        <div className="preloader__blob preloader__blob--3"></div>
        <div className="preloader__logo-wrap">
          <div className="preloader__aura"></div>
          <img
            ref={preloaderLogoRef}
            src="/images/logo.svg"
            alt="Sparrow"
            className="preloader__logo"
          />
        </div>
      </div>

      <Navbar logoVisible={!loading && !morphing} />

      {/* Section 1: Hero (fixed) */}
      <section className="section section--hero">
        <div className="hero-hardware">
          <video
            className="hero__bg"
            src="/video/Showreel_V1.mp4"
            autoPlay
            loop
            muted
            playsInline

          />
        </div>
        <div ref={gradientRef} className="hero-gradient"></div>
        <div ref={heroInnerRef} className="section__inner">
          <Grid>
            <GridItem
              span={{ base: 4, md: 8, lg: 8 }}
              start={{ lg: 3 }}
              className="hero__title-cell"
            >
              <h3 ref={heroTitleRef} className="hero__title">
                Experience <em>the</em> Unbuilt
              </h3>
            </GridItem>
            <GridItem
              span={{ base: 4, md: 6, lg: 6 }}
              start={{ md: 2, lg: 4 }}
              className="hero__desc-cell"
            >
              <p ref={heroDescRef} className="hero__description">
                Obsessive innovators. Storytellers.
                <br />
                 Creators of phygital experiences.
                <br />
              </p>
            </GridItem>
          </Grid>
        </div>
      </section>

      {/* Spacer to push page 2 below the fixed hero */}
      <div className="hero-spacer"></div>

      {/* Section 2: Partner Statement */}
      <div className="partner-wrapper">
        <section className="section section--partner"></section>
        <div className="partner-content">
          <Grid>
            <GridItem
              span={{ base: 4, md: 8, lg: 10 }}
              start={{ lg: 2 }}
              className="partner__text-cell"
            >
              <p ref={partnerTextRef} className="partner__text">
                We partner with real estate brands to transform
                <br />
                the unbuilt into{" "}
                <span className="partner__highlight">
                  immersive, tech-led experiences
                </span>
                <br />
                that move hearts, and decisions.
              </p>
            </GridItem>
          </Grid>
        </div>
      </div>

      {/* Section 3: Touch of More — blur-word reveal */}
      <section className="section section--touch" data-navbar-theme="dark">
        <Grid>
          <GridItem
            span={{ base: 4, md: 8, lg: 10 }}
            start={{ lg: 2 }}
            className="touch__title-cell"
          >
            <h2 ref={touchTitleRef} className="touch__title">
              {["Experiences", "with", "a"].map((w, i) => (
                <span key={i} className="blur-word" style={{ "--i": i }}>
                  {w}{"\u00A0"}
                </span>
              ))}
              <br />
              <span ref={touchAccentRef} className="touch__accent">
                {["Touch", "of", "More"].map((w, i) => (
                  <span
                    key={i + 3}
                    className="blur-word"
                    style={{ "--i": i + 3 }}
                  >
                    {w}
                    {i < 2 ? "\u00A0" : ""}
                  </span>
                ))}
              </span>
            </h2>
          </GridItem>
        </Grid>
      </section>

      {/* ═══ Showcase Video Section — scroll-driven playback ═══ */}
      <section ref={showcaseSectionRef} className="showcase-video">
        <div className="showcase-video__sticky">
          <canvas ref={showcaseCanvasRef} className="showcase-video__player" />
          <video
            ref={showcaseVideoRef}
            src="/video/video_on_scroll.mp4"
            muted
            playsInline
            preload="auto"
            style={{ display: "none" }}
          />
          <div className="showcase-video__overlay"></div>
          <AnimatePresence mode="wait">
            {activeLegend && (
              <motion.div
                key={activeLegend.title}
                className="showcase-video__text"
                initial={{ opacity: 0, filter: "blur(16px)", y: 20 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                exit={{ opacity: 0, filter: "blur(16px)", y: -10 }}
                transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <Grid>
                  <GridItem span={{ base: 4, md: 6, lg: 8 }}>
                    <h2 className="showcase-video__title">{activeLegend.title}</h2>
                    <div className="showcase-video__sub">
                      <span className="showcase-video__subtitle">{activeLegend.subtitle}</span>
                    </div>
                  </GridItem>
                </Grid>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ═══ Section 9: Who We Are ═══ */}
      <section className="section-about">
        <Grid ref={aboutLayoutRef} className="about__layout">
          <GridItem span={{ base: 4, md: 3, lg: 4 }} className="about__left">
            <span className="about__label">Who We Are</span>
          </GridItem>
          <GridItem span={{ base: 4, md: 5, lg: 8 }} className="about__right">
            <h2 className="about__heading">
              We are a tech-driven, creativity-led{" "}
              <span className="about__heading-accent">phygital experience design</span>{" "}
              agency redefining how real estate is experienced.
            </h2>
            <div className="about__stats-row">
              <StatsTicker />
            </div>
            <div className="about__divider"></div>
            <a href="/about" className="about__btn">More About Us</a>
          </GridItem>
        </Grid>
      </section>

      {/* ═══ Section 10: Leadership / Meet the Team ═══ */}
      <section className="section-team" data-navbar-theme="dark">
        <Grid>
          <GridItem span={12}>
            <span ref={teamLabelRef} className="team__label">Leadership/Team</span>
          </GridItem>
        </Grid>

        <Grid ref={teamTopRef} className="team__top">
          <GridItem span={{ base: 4, md: 4, lg: 6 }}>
            <h2 className="team__heading">Leaders bored<br />with Conformity</h2>
          </GridItem>
          <GridItem span={{ base: 4, md: 4, lg: 6 }} className="team__right">
            <p className="team__quote">Good enough is never where we stop,<br /> and we learned that from the best.</p>
            <a href="/about" className="team__btn">Meet the Team</a>
          </GridItem>
        </Grid>
        {/* Pin container — height = 1 viewport of pinned scrolling AFTER the
            sticky child reaches the top. The sticky child is the photo wrapper;
            it gets pinned at viewport top, and the user's scroll progress
            through the pin container drives the horizontal pan. */}
        <div ref={teamPinRef} className="team__pin">
          <div ref={teamPhotoRef} className="team__photo-wrapper">
            <img className="team__photo" src="/images/leadership-team.png" alt="Leadership Team" loading="lazy" />
          </div>
        </div>
      </section>

      {/* ═══ Section 11: Clients ═══ */}
      <section className="section-clients" data-navbar-theme="dark">
        <Grid className="clients-top">
          <GridItem span={{ base: 4, md: 4, lg: 6 }}>
            <h2 className="clients-heading">
              Clients We&apos;ve<br />Surprised So Far
            </h2>
          </GridItem>
          <GridItem span={{ base: 4, md: 4, lg: 6 }}>
            <p className="clients-description">
              We bring the unimaginable to ground,<br />
              surprising our clients with solutions<br />
              never seen before.
            </p>
          </GridItem>
        </Grid>
        <div className="clients-logos">
          <div className="clients-logos-track">
            {/* Render the logo set 4 times so each "half" of the track
                (which is what gets translated by -50%) is wider than any
                desktop viewport. Eliminates the empty-gap loop seam. */}
            {Array.from({ length: 4 }).flatMap((_, setIdx) => [
              <div key={`emaar-${setIdx}`} className="client-logo-wrap client-logo--emaar">
                <img src="/images/logos/EMAAR.webp" alt="Emaar" />
              </div>,
              <div key={`reliance-${setIdx}`} className="client-logo-wrap client-logo--reliance">
                <img src="/images/logos/RELIANCE.webp" alt="Reliance Industries Limited" />
              </div>,
              <div key={`dlf-${setIdx}`} className="client-logo-wrap client-logo--dlf">
                <img src="/images/logos/DLF.webp" alt="DLF" />
              </div>,
              <div key={`sobha-${setIdx}`} className="client-logo-wrap client-logo--sobha">
                <img src="/images/logos/SOBHA.webp" alt="Sobha Realty" />
              </div>,
              <div key={`lodha-${setIdx}`} className="client-logo-wrap client-logo--lodha">
                <img src="/images/logos/LODHA.webp" alt="Lodha Group" />
              </div>,
              <div key={`indiabulls-${setIdx}`} className="client-logo-wrap client-logo--indiabulls">
                <img src="/images/logos/INDIABULLS.webp" alt="Indiabulls" />
              </div>,
              <div key={`adani-${setIdx}`} className="client-logo-wrap client-logo--adani">
                <img src="/images/logos/ADANI.webp" alt="Adani" />
              </div>,
              <div key={`brigade-${setIdx}`} className="client-logo-wrap client-logo--brigade">
                <img src="/images/logos/Brigade.webp" alt="Brigade" />
              </div>,
              <div key={`godrej-${setIdx}`} className="client-logo-wrap client-logo--godrej">
                <img src="/images/logos/GODREJ.webp" alt="Godrej Properties" />
              </div>,
              <div key={`prestige-${setIdx}`} className="client-logo-wrap client-logo--prestige">
                <img src="/images/logos/PRESTIGE.webp" alt="Prestige Group" />
              </div>,
            ])}
          </div>
        </div>
      </section>

      {/* ═══ Section 12: Testimonials ═══ */}
      <section className="section-testimonials" data-navbar-theme="dark">
        <Grid>
          <GridItem span={12}>
            <span className="testimonials__label">Testimonials</span>
          </GridItem>
        </Grid>

        <Grid className="testimonials__center">
          <GridItem span={{ base: 4, md: 4, lg: 6 }}>
            <h2 className="testimonials__heading">Out Loud</h2>
          </GridItem>
          <GridItem span={{ base: 4, md: 4, lg: 6 }}>
            <h3 className="testimonials__quote-heading">They felt it.<br></br>They said it.</h3>
          </GridItem>
        </Grid>

        <Grid className="testimonials__bottom">
          <GridItem span={{ base: 4, md: 4, lg: 6 }}>
            <div className="testimonials__arrows">
              <button
                className="testimonials__arrow testimonials__arrow--left"
                aria-label="Previous"
                onClick={() => goToTestimonial(-1)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M19 12H5M5 12L12 19M5 12L12 5" />
                </svg>
              </button>
              <button
                className="testimonials__arrow testimonials__arrow--right"
                aria-label="Next"
                onClick={() => goToTestimonial(1)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" />
                </svg>
              </button>
            </div>
          </GridItem>
          <GridItem span={{ base: 4, md: 4, lg: 6 }} className="testimonials__right">
            {/* Keyed on index so React replaces the node, restarting the CSS
                slide-in animation. data-dir picks which direction to slide from. */}
            <div
              key={testimonialIndex}
              className="testimonials__slide"
              data-dir={testimonialDir}
            >
              <p className="testimonials__quote-text">
                {"\u201C"}{TESTIMONIALS[testimonialIndex].quote}{"\u201D"}
              </p>
              <div className="testimonials__author">
                <div className="testimonials__avatar"></div>
                <div className="testimonials__author-info">
                  <span className="testimonials__author-name">
                    {TESTIMONIALS[testimonialIndex].name}
                  </span>
                  <span className="testimonials__author-company">
                    {TESTIMONIALS[testimonialIndex].company}
                  </span>
                </div>
              </div>
            </div>
          </GridItem>
        </Grid>
      </section>

      {/* ═══ Section 13: Latest from the Community ═══ */}
      <section className="section-blog" data-navbar-theme="dark">
        <Grid className="blog__header">
          <GridItem span={{ base: 4, md: 5, lg: 8 }}>
            <h2 className="blog__heading">
              Latest from
              <br />
              the community
            </h2>
          </GridItem>
          <GridItem span={{ base: 4, md: 3, lg: 4 }} className="blog__arrows-cell">
            <div className="blog__arrows">
              <button className="blog__arrow blog__arrow--left" aria-label="Previous">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M19 12H5M5 12L12 19M5 12L12 5" />
                </svg>
              </button>
              <button className="blog__arrow blog__arrow--right" aria-label="Next">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" />
                </svg>
              </button>
            </div>
          </GridItem>
        </Grid>

        <Grid className="blog__cards">
          {[
            { src: "/images/community_1.webp" },
            { src: "/images/community_2.webp" },
            { src: "/images/community_3.webp" },
          ].map((card) => (
            <GridItem key={card.src} span={{ base: 4, md: 8, lg: 4 }} as="article" className="blog__card">
              <img className="blog__card-bg" src={card.src} alt="" loading="lazy" />
              <div className="blog__card-blur"></div>
              <div className="blog__card-content">
                <h3 className="blog__card-title">
                  Inside Bvlgari Residences: An Experience Centre for Dubai&apos;s Most Discerning
                </h3>
                <div className="blog__card-bottom">
                  <span>6 min</span>
                  <p>Real Estate, Experience Centre</p>
                </div>
              </div>
            </GridItem>
          ))}
        </Grid>
      </section>

      {/* ═══ Section 13: Footer ═══ */}
      <Footer />

    </div>
  );
}

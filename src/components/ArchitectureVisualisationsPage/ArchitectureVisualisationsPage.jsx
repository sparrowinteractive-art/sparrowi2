"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useAnimationControls,
  useMotionValue,
  animate,
} from "framer-motion";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import BetterExperience from "@components/BetterExperience";
import { Grid, GridItem } from "@components/Grid";
import "@styles/ArchitectureVisualisationsPage.css";

// "FILTER" is rendered as a static heading in the pill (not in this list).
// "walkthrough" is a special category whose entries carry a `video` field
// instead of `image`; the gallery widens those cards to a 2-column layout.
const FILTERS = [
  { id: "exterior",    label: "EXTERIOR" },
  { id: "interior",    label: "INTERIOR" },
  { id: "aerial",      label: "AERIAL" },
  { id: "landscape",   label: "LANDSCAPE" },
  { id: "walkthrough", label: "WALKTHROUGH" },
];

// Real project assets live under /public/images/projects/<slug>/. For a
// project with its own `images` array, the modal carousel uses that
// list verbatim (hero first, then the rest). Projects without an
// `images` array fall back to seeded picsum placeholders below — swap
// each `image` to a real /images/... path as assets land.
const PROJECT_IMAGES = {
  ace100: [
    "/images/projects/ace-100-commercial/elevation-h.jpg",
    "/images/projects/ace-100-commercial/elevation-n.jpg",
    "/images/projects/ace-100-commercial/pool.jpg",
    "/images/projects/ace-100-commercial/mood-c.jpg",
    "/images/projects/ace-100-commercial/mood-h.jpg",
  ],
  aceItPark: [
    "/images/projects/ace-it-park/commercial-a-01.jpg",
  ],
  alHamra: [
    "/images/projects/al-hamra-waterfront/pool-d.jpg",
    "/images/projects/al-hamra-waterfront/balcony-c.jpg",
  ],
  alHumara: [
    "/images/projects/al-humara-greens/elevation-a.jpg",
    "/images/projects/al-humara-greens/elevation-e.jpg",
    "/images/projects/al-humara-greens/pool-a.jpg",
    "/images/projects/al-humara-greens/aerial-b.jpg",
    "/images/projects/al-humara-greens/aerial-c.jpg",
  ],
  ashiana: [
    "/images/projects/ashiana-mulberry-moments/mood-a.jpg",
  ],
  county151: [
    "/images/projects/county-151/balcony.jpg",
    "/images/projects/county-151/club-cafe.jpg",
    "/images/projects/county-151/worm-eye-tower-a.jpg",
  ],
  countyWave: [
    "/images/projects/county-wave/elevation-p.jpg",
    "/images/projects/county-wave/mood-d.jpg",
    "/images/projects/county-wave/mood-e.jpg",
  ],
  exoticaIt: [
    "/images/projects/exotica-it/elevation-d.jpg",
    "/images/projects/exotica-it/aerial-a.jpg",
    "/images/projects/exotica-it/worm-eye.jpg",
  ],
  gaurLegacy: [
    "/images/projects/gaur-legacy/elevation-g.jpg",
  ],
  godrejIhp: [
    "/images/projects/godrej-ihp/hero-shot.jpg",
  ],
};

// Categories map onto the filter pill: exterior / interior / aerial /
// landscape / walkthrough. Walkthrough entries carry a `video` field
// instead of `image` and the gallery renders them as 2-column video tiles.
// These are not classifications of the actual projects — swap the
// `category` value when real metadata is available.
const PROJECTS = [
  { name: "Ace 100 Commercial",        location: "Noida",          category: "landscape",   image: PROJECT_IMAGES.ace100[0],     images: PROJECT_IMAGES.ace100 },
  { name: "Ace IT Park",               location: "Noida",          category: "exterior",    image: PROJECT_IMAGES.aceItPark[0],  images: PROJECT_IMAGES.aceItPark },
  { name: "Al Hamra Waterfront",       location: "Ras Al Khaimah", category: "interior",    image: PROJECT_IMAGES.alHamra[0],    images: PROJECT_IMAGES.alHamra },
  { name: "Al Humara Greens",          location: "Ras Al Khaimah", category: "aerial",      image: PROJECT_IMAGES.alHumara[0],   images: PROJECT_IMAGES.alHumara },
  { name: "Ashiana Mulberry Moments",  location: "Gurugram",       category: "exterior",    image: PROJECT_IMAGES.ashiana[0],    images: PROJECT_IMAGES.ashiana },
  { name: "County 151",                location: "Greater Noida",  category: "interior",    image: PROJECT_IMAGES.county151[0],  images: PROJECT_IMAGES.county151 },
  { name: "County Wave",               location: "Greater Noida",  category: "landscape",   image: PROJECT_IMAGES.countyWave[0], images: PROJECT_IMAGES.countyWave },
  { name: "Exotica IT",                location: "Noida",          category: "exterior",    image: PROJECT_IMAGES.exoticaIt[0],  images: PROJECT_IMAGES.exoticaIt },
  { name: "Gaur Legacy",               location: "Noida",          category: "aerial",      image: PROJECT_IMAGES.gaurLegacy[0], images: PROJECT_IMAGES.gaurLegacy },
  { name: "Godrej IHP",                location: "Mumbai",         category: "interior",    image: PROJECT_IMAGES.godrejIhp[0],  images: PROJECT_IMAGES.godrejIhp },
  // Walkthroughs — drop real walkthrough .mp4 files into /public/video/ and
  // swap the `video` paths below as assets land. Two entries are enough to
  // populate the 2-column layout; add more rows by appending here.
  { name: "Showreel Walkthrough",      location: "Various",        category: "walkthrough", video: "/video/Showreel_V1.mp4" },
  { name: "Scroll Walkthrough",        location: "Various",        category: "walkthrough", video: "/video/video_on_scroll.mp4" },
];

// Derive a small set of "related" placeholder images from the project's
// existing picsum seed so each modal feels coherent per-project. Replace
// with real per-project image arrays when assets are wired up.
function relatedImagesFor(project) {
  if (!project?.image) return [];
  const seedMatch = project.image.match(/picsum\.photos\/seed\/([^/]+)/);
  const seed = seedMatch ? seedMatch[1] : project.name.toLowerCase();
  return [2, 3, 4, 5].map(
    (n) => `https://picsum.photos/seed/${seed}-${n}/1400/900`
  );
}

// Build the ordered slide list for the modal carousel. If the project
// ships its own `images` array (real assets), use it verbatim — the
// first entry is treated as the hero. Otherwise fall back to the
// picsum-derived placeholder set so legacy entries keep working.
function carouselImagesFor(project) {
  if (!project?.image) return [];
  if (Array.isArray(project.images) && project.images.length) {
    return project.images.map((src, i) => ({
      url: src,
      title: i === 0 ? project.name : `${project.name} view ${i + 1}`,
    }));
  }
  return [
    {
      url: project.image.replace("/800/800", "/1600/1000"),
      title: project.name,
    },
    ...relatedImagesFor(project).map((src, i) => ({
      url: src,
      title: `${project.name} view ${i + 2}`,
    })),
  ];
}

// Carousel sizing — matches 21st.dev/framer-thumbnail-carousel reference.
// Active thumbnail expands to FULL_WIDTH_PX, inactive ones collapse to
// COLLAPSED_WIDTH_PX. GAP_PX/MARGIN_PX feed the auto-scroll math below.
const FULL_WIDTH_PX = 120;
const COLLAPSED_WIDTH_PX = 35;
const GAP_PX = 2;
const MARGIN_PX = 2;

// Drag-driven main carousel. The motion.div track is full-width × N
// slides; we translate it by -index * containerWidth on commit. While
// dragging, the user controls x freely; on drag-end we snap to the
// nearest neighbour using either velocity (>500px/s = swipe) or a 30%
// offset threshold.
function ProjectCarousel({ images, onClose }) {
  const [index, setIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const x = useMotionValue(0);

  // Reset to first slide whenever the image set changes (new project)
  useEffect(() => {
    setIndex(0);
  }, [images]);

  // Snap-animate x to the active slide whenever index changes (and the
  // user isn't actively dragging — committing mid-drag would fight them).
  useEffect(() => {
    if (!isDragging && containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth || 1;
      const targetX = -index * containerWidth;
      const controls = animate(x, targetX, {
        type: "spring",
        stiffness: 300,
        damping: 30,
      });
      return () => controls.stop();
    }
  }, [index, x, isDragging]);

  // Keep the slide aligned if the modal is resized while open.
  useEffect(() => {
    const onResize = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth || 1;
      x.set(-index * containerWidth);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [index, x]);

  if (!images.length) return null;

  return (
    <div className="arch-viz-carousel">
      {/* Stage = positioning context for prev/next/close so they sit in
          the side gutters outside the image, not on top of it. Padding
          on the stage carves room for the buttons; the viewport fills
          the inset area. */}
      <div className="arch-viz-carousel__stage">
        <div className="arch-viz-carousel__viewport" ref={containerRef}>
          <motion.div
            className="arch-viz-carousel__track"
            drag="x"
            dragElastic={0.2}
            dragMomentum={false}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={(_e, info) => {
              setIsDragging(false);
              const containerWidth = containerRef.current?.offsetWidth || 1;
              const offset = info.offset.x;
              const velocity = info.velocity.x;
              let newIndex = index;
              if (Math.abs(velocity) > 500) {
                newIndex = velocity > 0 ? index - 1 : index + 1;
              } else if (Math.abs(offset) > containerWidth * 0.3) {
                newIndex = offset > 0 ? index - 1 : index + 1;
              }
              newIndex = Math.max(0, Math.min(images.length - 1, newIndex));
              setIndex(newIndex);
            }}
            style={{ x }}
          >
            {images.map((img, i) => (
              <div key={i} className="arch-viz-carousel__slide">
                <img
                  src={img.url}
                  alt={img.title}
                  className="arch-viz-carousel__img"
                  draggable={false}
                />
              </div>
            ))}
          </motion.div>
        </div>

        <button
          type="button"
          className="arch-viz-carousel__btn arch-viz-carousel__btn--prev"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          aria-label="Previous image"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M15 19l-7-7 7-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          className="arch-viz-carousel__btn arch-viz-carousel__btn--next"
          disabled={index === images.length - 1}
          onClick={() =>
            setIndex((i) => Math.min(images.length - 1, i + 1))
          }
          aria-label="Next image"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M9 5l7 7-7 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {onClose && (
          <button
            type="button"
            className="arch-viz-modal__close"
            onClick={onClose}
            aria-label="Close gallery"
          >
            ×
          </button>
        )}
      </div>

      <CarouselThumbnails
        images={images}
        index={index}
        setIndex={setIndex}
      />
    </div>
  );
}

// Thumbnail strip — the active one expands, the rest stay collapsed.
// On index change we auto-scroll the strip so the active thumb is
// horizontally centred in its viewport.
function CarouselThumbnails({ images, index, setIndex }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    let scrollPosition = 0;
    for (let i = 0; i < index; i++) {
      scrollPosition += COLLAPSED_WIDTH_PX + GAP_PX;
    }
    scrollPosition += MARGIN_PX;
    const containerWidth = ref.current.offsetWidth;
    const centerOffset = containerWidth / 2 - FULL_WIDTH_PX / 2;
    scrollPosition -= centerOffset;
    ref.current.scrollTo({ left: scrollPosition, behavior: "smooth" });
  }, [index]);

  return (
    <div className="arch-viz-thumbs" ref={ref}>
      <div className="arch-viz-thumbs__track">
        {images.map((img, i) => (
          <motion.button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            initial={false}
            animate={i === index ? "active" : "inactive"}
            variants={{
              active: {
                width: FULL_WIDTH_PX,
                marginLeft: MARGIN_PX,
                marginRight: MARGIN_PX,
              },
              inactive: {
                width: COLLAPSED_WIDTH_PX,
                marginLeft: 0,
                marginRight: 0,
              },
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="arch-viz-thumbs__btn"
            aria-label={`View image ${i + 1}`}
            aria-pressed={i === index}
          >
            <img
              src={img.url}
              alt={img.title}
              className="arch-viz-thumbs__img"
              draggable={false}
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export default function ArchitectureVisualisationsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  // The floating filter island is scoped to the gallery. It hides as soon
  // as .section-experience (the BetterExperience closing panel) enters the
  // viewport and re-appears when the user scrolls back up into the gallery.
  const [filterHidden, setFilterHidden] = useState(false);
  // Currently expanded project (null = no modal). Clicking a card sets this.
  const [selectedProject, setSelectedProject] = useState(null);
  // Drives the rubber-band "pull up + settle down" animation on the modal
  // content when the user tries to scroll past the bottom of the related
  // images. Triggered by wheel/touch events on the modal scroll container.
  const bounceControls = useAnimationControls();
  const bouncingRef = useRef(false);

  const filteredProjects =
    activeFilter === "all"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeFilter);

  useEffect(() => {
    const closing = document.querySelector(
      ".arch-viz-page .section-experience"
    );
    if (!closing) return;
    const io = new IntersectionObserver(
      ([entry]) => setFilterHidden(entry.isIntersecting),
      { threshold: 0 }
    );
    io.observe(closing);
    return () => io.disconnect();
  }, []);

  // While the lightbox is open, only the modal content should scroll.
  // The site uses Lenis smooth-scroll (window.__lenis) which hijacks
  // wheel events — overflow:hidden alone won't stop it, we have to call
  // lenis.stop(). Body/html overflow is also locked as a fallback for
  // users with prefers-reduced-motion (Lenis is skipped for them).
  useEffect(() => {
    if (!selectedProject) return;
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    window.__lenis?.stop();

    const onKey = (e) => {
      if (e.key === "Escape") setSelectedProject(null);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
      window.__lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [selectedProject]);

  return (
    <div className="arch-viz-page" data-navbar-theme="dark">
      <Navbar logoVisible={true} />

      {/* Hero — title left, lede top-right (matches reference) */}
      <section className="arch-viz-hero">
        <Grid>
          <GridItem
            span={{ base: 4, md: 3, lg: 4 }}
            className="arch-viz-hero__title-cell"
          >
            <h1 className="arch-viz-hero__title">Architecture Visualisations</h1>
          </GridItem>
          <GridItem
            span={{ base: 4, md: 4, lg: 6 }}
            start={{ md: 5, lg: 7 }}
            className="arch-viz-hero__copy-cell"
          >
            <p className="arch-viz-hero__lede">
            High-fidelity 3D visualizations that <br></br> turn concepts into clear, compelling walkthroughs.
            </p>
          </GridItem>
        </Grid>
      </section>

      {/* Gallery — staggered fade-up, AnimatePresence on filter swap.
          Walkthrough cards span 2 columns each (lg:6) and render video
          tiles instead of image tiles; all other filters keep the
          standard 4-column image grid (lg:3). */}
      <section className="arch-viz-gallery">
        <Grid>
          <AnimatePresence mode="popLayout" initial={false}>
            {filteredProjects.map((p, i) => {
              const isVideo = Boolean(p.video);
              return (
                <GridItem
                  key={p.name}
                  span={
                    isVideo
                      ? { base: 4, md: 4, lg: 6 }
                      : { base: 2, md: 4, lg: 3 }
                  }
                >
                  <motion.article
                    className={`arch-viz-card${isVideo ? " arch-viz-card--video" : ""}`}
                    layout
                    initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -16, filter: "blur(8px)" }}
                    transition={{
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                      delay: Math.min(i, 8) * 0.05,
                    }}
                  >
                    <div
                      className="arch-viz-card__media"
                      role={isVideo ? undefined : "button"}
                      tabIndex={isVideo ? undefined : 0}
                      aria-label={
                        isVideo ? `${p.name} walkthrough` : `Open ${p.name} gallery`
                      }
                      onClick={isVideo ? undefined : () => setSelectedProject(p)}
                      onKeyDown={
                        isVideo
                          ? undefined
                          : (e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                setSelectedProject(p);
                              }
                            }
                      }
                      style={
                        !isVideo && p.image
                          ? { "--bg-image": `url(${p.image})` }
                          : undefined
                      }
                    >
                      {isVideo ? (
                        <video
                          className="arch-viz-card__video"
                          src={p.video}
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="metadata"
                        />
                      ) : (
                        !p.image && (
                          <span className="arch-viz-card__placeholder">
                            {p.name}
                          </span>
                        )
                      )}
                    </div>
                    <div className="arch-viz-card__caption">
                      <strong className="arch-viz-card__name">{p.name}</strong>
                      <span className="arch-viz-card__sep" aria-hidden="true">|</span>
                      <span className="arch-viz-card__loc">{p.location}</span>
                    </div>
                  </motion.article>
                </GridItem>
              );
            })}
          </AnimatePresence>
        </Grid>
      </section>

      {/* Floating filter island — fixed bottom-center, glass like the navbar pill */}
      <nav
        className={`arch-viz-filter${filterHidden ? " arch-viz-filter--hidden" : ""}`}
        aria-label="Project filters"
      >
        <div className="arch-viz-filter__pill">
          <button
            type="button"
            className={`arch-viz-filter__heading${
              activeFilter === "all" ? " arch-viz-filter__heading--active" : ""
            }`}
            aria-label="Show all projects"
            aria-pressed={activeFilter === "all"}
            onClick={() => setActiveFilter("all")}
          >
            FILTER
          </button>
          {FILTERS.map((f) => {
            const isActive = activeFilter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                className={`arch-viz-filter__btn${
                  isActive ? " arch-viz-filter__btn--active" : ""
                }`}
                aria-pressed={isActive}
                onClick={() =>
                  setActiveFilter((prev) => (prev === f.id ? "all" : f.id))
                }
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </nav>

      <BetterExperience
        text={
          <>
            See it Whole.<br />
            See it Real.<br />
            God&rsquo;s View, Always.
          </>
        }
      />
      <Footer />

      {/* Lightbox — magnified hero image + scrollable related images for
          the clicked project. Closes on backdrop click, X button, or ESC. */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            key="arch-viz-modal"
            className="arch-viz-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedProject.name} gallery`}
            // Tell Lenis to leave wheel events on this element alone so the
            // modal scrolls natively. Without this, Lenis preventDefault's
            // wheel events globally and the modal can't scroll either.
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              className="arch-viz-modal__inner"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <header className="arch-viz-modal__header">
                <h2 className="arch-viz-modal__title">{selectedProject.name}</h2>
                <span className="arch-viz-modal__loc">{selectedProject.location}</span>
              </header>

              <ProjectCarousel
                images={carouselImagesFor(selectedProject)}
                onClose={() => setSelectedProject(null)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

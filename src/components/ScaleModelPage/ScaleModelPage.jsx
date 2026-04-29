"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import { Grid, GridItem } from "@components/Grid";
import "@styles/ScaleModelPage.css";

// "FILTER" is rendered as a static heading in the pill (not in this list),
// so this array only holds the four interactive category buttons.
const FILTERS = [
  { id: "villa",       label: "VILLA" },
  { id: "residential", label: "RESIDENTIAL" },
  { id: "commercial",  label: "COMMERCIAL" },
  { id: "hydraulic",   label: "HYDRAULIC" },
];

// Placeholder images via picsum.photos — seeded URLs return a stable random
// image per seed, so each card gets a different image but they don't change
// on reload. Swap each `image` to a real /images/... path when ready.
const PROJECTS = [
  { name: "PENINSULA Salcette 27",     location: "Mumbai",    category: "residential", image: "https://picsum.photos/seed/peninsula/800/800" },
  { name: "MERAAS Bvlgari Residences", location: "Dubai",     category: "residential", image: "https://picsum.photos/seed/meraas/800/800" },
  { name: "BRIGADE Parkside North",    location: "Bangalore", category: "residential", image: "https://picsum.photos/seed/brigade/800/800" },
  { name: "ELLINGTON",                 location: "Dubai",     category: "villa",       image: "https://picsum.photos/seed/ellington/800/800" },
  { name: "OASIS Skyline Villa",       location: "Dubai",     category: "villa",       image: "https://picsum.photos/seed/oasis/800/800" },
  { name: "PRESTIGE Falcon City",      location: "Hyderabad", category: "commercial",  image: "https://picsum.photos/seed/prestige/800/800" },
  { name: "GAURS Atrium",              location: "Noida",     category: "commercial",  image: "https://picsum.photos/seed/gaurs/800/800" },
  { name: "LODHA Park Tower",          location: "Mumbai",    category: "residential", image: "https://picsum.photos/seed/lodha/800/800" },
  { name: "EMAAR Address Crescent",    location: "Dubai",     category: "hydraulic",   image: "https://picsum.photos/seed/emaar/800/800" },
  { name: "DLF Camellias",             location: "Gurgaon",   category: "residential", image: "https://picsum.photos/seed/dlf/800/800" },
  { name: "GODREJ Reserve",            location: "Bangalore", category: "villa",       image: "https://picsum.photos/seed/godrej/800/800" },
  { name: "SOBHA Hartland",            location: "Dubai",     category: "hydraulic",   image: "https://picsum.photos/seed/sobha/800/800" },
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

export default function ScaleModelPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  // Hide the floating filter island when the footer is in view, so the
  // footer's sticky-hero/overlay reads the same as on the other pages.
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
    const footer = document.querySelector(".scale-model-page .footer");
    if (!footer) return;
    const io = new IntersectionObserver(
      ([entry]) => setFilterHidden(entry.isIntersecting),
      { rootMargin: "0px 0px -10% 0px", threshold: 0 }
    );
    io.observe(footer);
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
    <div className="scale-model-page" data-navbar-theme="dark">
      <Navbar logoVisible={true} />

      {/* Hero — title left, lede top-right (matches reference) */}
      <section className="scale-model-hero">
        <Grid>
          <GridItem
            span={{ base: 4, md: 3, lg: 4 }}
            className="scale-model-hero__title-cell"
          >
            <h1 className="scale-model-hero__title">Scale Models</h1>
          </GridItem>
          <GridItem
            span={{ base: 4, md: 4, lg: 6 }}
            start={{ md: 5, lg: 7 }}
            className="scale-model-hero__copy-cell"
          >
            <p className="scale-model-hero__lede">
            Smart, interactive scale models <br></br> offering a complete, intuitive view of the <br></br> entire project.
            </p>
          </GridItem>
        </Grid>
      </section>

      {/* Gallery — staggered fade-up, AnimatePresence on filter swap */}
      <section className="scale-model-gallery">
        <Grid>
          <AnimatePresence mode="popLayout" initial={false}>
            {filteredProjects.map((p, i) => (
              <GridItem key={p.name} span={{ base: 2, md: 4, lg: 3 }}>
                <motion.article
                  className="scale-model-card"
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
                    className="scale-model-card__media"
                    role="button"
                    tabIndex={0}
                    aria-label={`Open ${p.name} gallery`}
                    onClick={() => setSelectedProject(p)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedProject(p);
                      }
                    }}
                    style={p.image ? { "--bg-image": `url(${p.image})` } : undefined}
                  >
                    {!p.image && (
                      <span className="scale-model-card__placeholder">{p.name}</span>
                    )}
                  </div>
                  <div className="scale-model-card__caption">
                    <strong className="scale-model-card__name">{p.name}</strong>
                    <span className="scale-model-card__sep" aria-hidden="true">|</span>
                    <span className="scale-model-card__loc">{p.location}</span>
                  </div>
                </motion.article>
              </GridItem>
            ))}
          </AnimatePresence>
        </Grid>
      </section>

      {/* Floating filter island — fixed bottom-center, glass like the navbar pill */}
      <nav
        className={`scale-model-filter${filterHidden ? " scale-model-filter--hidden" : ""}`}
        aria-label="Project filters"
      >
        <div className="scale-model-filter__pill">
          <button
            type="button"
            className={`scale-model-filter__heading${
              activeFilter === "all" ? " scale-model-filter__heading--active" : ""
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
                className={`scale-model-filter__btn${
                  isActive ? " scale-model-filter__btn--active" : ""
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

      <Footer
        heroText={
          <>
            See it Whole.<br />
            See it Real.<br />
            God&rsquo;s View, Always.
          </>
        }
      />

      {/* Lightbox — magnified hero image + scrollable related images for
          the clicked project. Closes on backdrop click, X button, or ESC. */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            key="scale-model-modal"
            className="scale-model-modal"
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
              className="scale-model-modal__inner"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="scale-model-modal__close"
                aria-label="Close gallery"
                onClick={() => setSelectedProject(null)}
              >
                ×
              </button>

              <header className="scale-model-modal__header">
                <h2 className="scale-model-modal__title">{selectedProject.name}</h2>
                <span className="scale-model-modal__loc">{selectedProject.location}</span>
              </header>

              {selectedProject.image && (
                <img
                  className="scale-model-modal__main"
                  src={selectedProject.image.replace("/800/800", "/1600/1000")}
                  alt={selectedProject.name}
                />
              )}

              <div className="scale-model-modal__related">
                {relatedImagesFor(selectedProject).map((src, i) => (
                  <img
                    key={src}
                    className="scale-model-modal__related-img"
                    src={src}
                    alt={`${selectedProject.name} view ${i + 2}`}
                    loading="lazy"
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import BetterExperience from "@components/BetterExperience";
import { Grid, GridItem } from "@components/Grid";
import "@styles/CareersPage.css";

// Sample roles — replace with the live list when wired up. The shape is
// intentionally close to a typical ATS export so swapping is a copy-paste.
const JOBS = [
  { role: "Senior 3D Visualizer",     team: "Visualization", department: "visualization", location: "Mumbai",    type: "Full-time" },
  { role: "Lighting & Lookdev Artist",team: "Visualization", department: "visualization", location: "Mumbai",    type: "Full-time" },
  { role: "Unreal Engine Developer",  team: "Real-time",     department: "real-time",     location: "Mumbai",    type: "Full-time" },
  { role: "Touchdesigner Lead",       team: "Real-time",     department: "real-time",     location: "Bangalore", type: "Contract"  },
  { role: "Experience Designer",      team: "Phygital Studio", department: "experience",  location: "Bangalore", type: "Full-time" },
  { role: "Creative Technologist",    team: "Innovation Lab",  department: "experience",  location: "Dubai",     type: "Full-time" },
  { role: "Production Designer",      team: "Set & Build",   department: "production",    location: "Mumbai",    type: "Full-time" },
  { role: "Fabrication Lead",         team: "Set & Build",   department: "production",    location: "Mumbai",    type: "Full-time" },
  { role: "Project Manager",          team: "Delivery",      department: "operations",    location: "Noida",     type: "Full-time" },
  { role: "Talent Partner",           team: "People",        department: "operations",    location: "Mumbai",    type: "Full-time" },
];

export default function CareersPage() {
  const heroVideoRef = useRef(null);

  // Force 2× playback. Some browsers reset playbackRate when the source
  // (re)loads, so we re-apply on loadedmetadata too.
  useEffect(() => {
    const v = heroVideoRef.current;
    if (!v) return;
    const apply = () => {
      v.playbackRate = 2;
    };
    apply();
    v.addEventListener("loadedmetadata", apply);
    return () => v.removeEventListener("loadedmetadata", apply);
  }, []);

  return (
    <div className="careers-page" data-navbar-theme="dark">
      <Navbar logoVisible={true} />

      {/* Hero — full-viewport frame. Looping video centered as the visual
          wordmark, with a short lede stacked beneath it. Matches the
          single-screen hero rhythm used elsewhere on the site. */}
      <section className="careers-hero">
        <div className="careers-hero__inner">
          <div className="careers-hero__video-wrap">
            <video
              ref={heroVideoRef}
              className="careers-hero__video"
              src="/video/Careers-Hero.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              aria-hidden="true"
            />
          </div>
          <div className="careers-hero__copy">
            <h1 className="careers-hero__title">Join us.</h1>
            <p className="careers-hero__lede">
              We make space for people who want to
              <br />
              <span className="careers-hero__lede-accent">
                build something that lasts.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Roles list — full-width rows, hairline-separated. Stagger fade-up
          on enter. */}
      <section className="careers-jobs">
        <Grid>
          <GridItem span={{ base: 4, md: 8, lg: 10 }} start={{ lg: 2 }}>
            <ul className="careers-jobs__list">
              <AnimatePresence mode="popLayout" initial={false}>
                {JOBS.map((j, i) => (
                  <motion.li
                    key={`${j.role}-${j.location}`}
                    layout
                    initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                    transition={{
                      duration: 0.45,
                      ease: [0.22, 1, 0.36, 1],
                      delay: Math.min(i, 8) * 0.04,
                    }}
                    className="careers-jobs__row"
                  >
                    <a
                      href={`/careers/${j.role.toLowerCase().replace(/\s+/g, "-")}`}
                      className="careers-jobs__link"
                    >
                      <div className="careers-jobs__main">
                        <h2 className="careers-jobs__role">{j.role}</h2>
                        <div className="careers-jobs__meta">
                          <span>{j.team}</span>
                          <span className="careers-jobs__dot" aria-hidden="true">·</span>
                          <span>{j.location}</span>
                          <span className="careers-jobs__dot" aria-hidden="true">·</span>
                          <span>{j.type}</span>
                        </div>
                      </div>
                      <span className="careers-jobs__cta">
                        <span className="careers-jobs__cta-label">Apply</span>
                        <svg
                          className="careers-jobs__arrow"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M5 12h14" />
                          <path d="M13 5l7 7-7 7" />
                        </svg>
                      </span>
                    </a>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </GridItem>
        </Grid>
      </section>

      <BetterExperience
        text={
          <>
            Stories worth Telling.<br />
            People worth Knowing.<br />
            Build with us.
          </>
        }
      />
      <Footer />
    </div>
  );
}

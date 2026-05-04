"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import BetterExperience from "@components/BetterExperience";
import { Grid, GridItem } from "@components/Grid";
import { getNextCaseStudy } from "@/lib/caseStudies";
import "@styles/CaseStudyPage.css";

// ── Reusable: parallax full-bleed image ──────────────────────────────
// Wrapping div clips, inner motion.div is oversized & translated on
// scroll so the image drifts within the clip — exoape's signature
// scroll-driven parallax. Range tuned so the image never reveals the
// transparent overscan within the clip.
function ParallaxBleed({ image, alt, strength = 12 }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`${-strength}%`, `${strength}%`]
  );

  return (
    <figure ref={ref} className="cs-bleed" aria-label={alt}>
      <motion.div
        className="cs-bleed__image"
        style={{
          y,
          backgroundImage: `url(${image})`,
        }}
      />
    </figure>
  );
}

// ── Reusable: line-by-line reveal heading ────────────────────────────
function RevealLines({ children, as: Tag = "h2", className = "", delay = 0 }) {
  const lines = Array.isArray(children) ? children : [children];
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={i} className="cs-reveal-line">
          <motion.span
            className="cs-reveal-line__inner"
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{
              duration: 1,
              ease: [0.22, 1, 0.36, 1],
              delay: delay + i * 0.08,
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

// ── Sticky-pin section ───────────────────────────────────────────────
// Tall wrapper so the inner sticky child stays at top:0 while scroll
// pushes images past on the right side. Common Exo Ape device.
function StickyPin({ pin }) {
  return (
    <section className="cs-pin">
      <Grid>
        <GridItem
          span={{ base: 4, md: 4, lg: 5 }}
          className="cs-pin__text-cell"
        >
          <div className="cs-pin__sticky">
            <span className="cs-pin__eyebrow">{pin.eyebrow}</span>
            <RevealLines as="h2" className="cs-pin__heading">
              {pin.heading}
            </RevealLines>
            <motion.p
              className="cs-pin__body"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            >
              {pin.body}
            </motion.p>
          </div>
        </GridItem>
        <GridItem
          span={{ base: 4, md: 4, lg: 6 }}
          start={{ md: 5, lg: 7 }}
          className="cs-pin__images-cell"
        >
          <div className="cs-pin__images">
            {pin.images.map((src, i) => (
              <motion.figure
                key={src}
                className="cs-pin__image"
                initial={{ opacity: 0, y: 80, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-5% 0px" }}
                transition={{
                  duration: 1.1,
                  ease: [0.22, 1, 0.36, 1],
                  delay: i * 0.1,
                }}
                style={{ backgroundImage: `url(${src})` }}
              />
            ))}
          </div>
        </GridItem>
      </Grid>
    </section>
  );
}

// ── Next-project hover preview (cursor-tracked) ──────────────────────
// On mouse-enter, an image preview snaps in near the cursor and tracks
// it with smooth spring damping. Exo Ape's signature next-link feel.
function NextProject({ next }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { damping: 28, stiffness: 220, mass: 0.6 });
  const sy = useSpring(y, { damping: 28, stiffness: 220, mass: 0.6 });

  const onMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  return (
    <section
      ref={ref}
      className="cs-next"
      data-navbar-theme="dark"
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/case-studies/${next.slug}`} className="cs-next__link">
        <div className="cs-next__inner">
          <span className="cs-next__eyebrow">Next Project</span>
          <h3 className="cs-next__title">
            <span className="cs-next__name">{next.name}</span>
            <span className="cs-next__subtitle">{next.subtitle}</span>
          </h3>
          <span className="cs-next__cta">
            View case study
            <span className="cs-next__arrow">&rarr;</span>
          </span>
        </div>

        <motion.div
          className="cs-next__preview"
          style={{
            x: sx,
            y: sy,
            backgroundImage: `url(${next.hero?.image})`,
          }}
          animate={{
            opacity: hovered ? 1 : 0,
            scale: hovered ? 1 : 0.85,
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </Link>
    </section>
  );
}

export default function CaseStudyPage({ study }) {
  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  // Hero image drifts up while title sinks slightly — paired parallax.
  const heroImageY = useTransform(heroProgress, [0, 1], ["0%", "20%"]);
  const heroTitleY = useTransform(heroProgress, [0, 1], ["0%", "-30%"]);
  const heroTitleScale = useTransform(heroProgress, [0, 1], [1, 0.95]);

  const next = getNextCaseStudy(study.slug);

  return (
    <div className="cs-page">
      <Navbar logoVisible={true} />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="cs-hero"
        data-navbar-theme="dark"
      >
        <motion.div
          className="cs-hero__image"
          style={{
            backgroundImage: `url(${study.hero.image})`,
            y: heroImageY,
          }}
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="cs-hero__veil" aria-hidden="true" />

        <div className="cs-hero__top">
          <Grid>
            <GridItem span={{ base: 2, md: 4, lg: 6 }}>
              <span className="cs-hero__label">{study.hero.label}</span>
            </GridItem>
            <GridItem
              span={{ base: 2, md: 4, lg: 6 }}
              className="cs-hero__top-right"
            >
              <span className="cs-hero__year">{study.year}</span>
            </GridItem>
          </Grid>
        </div>

        <motion.div
          className="cs-hero__title-wrap"
          style={{ y: heroTitleY, scale: heroTitleScale }}
        >
          <Grid>
            <GridItem span={{ base: 4, md: 8, lg: 12 }}>
              <h1 className="cs-hero__title">
                <span className="cs-reveal-line">
                  <motion.span
                    className="cs-reveal-line__inner"
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{
                      duration: 1.2,
                      ease: [0.22, 1, 0.36, 1],
                      delay: 0.25,
                    }}
                  >
                    {study.name}
                  </motion.span>
                </span>
                <span className="cs-reveal-line cs-hero__title-sub">
                  <motion.span
                    className="cs-reveal-line__inner"
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{
                      duration: 1.2,
                      ease: [0.22, 1, 0.36, 1],
                      delay: 0.4,
                    }}
                  >
                    <em>{study.subtitle}</em>
                  </motion.span>
                </span>
              </h1>
            </GridItem>
          </Grid>
        </motion.div>

        <motion.div
          className="cs-hero__bottom"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.85 }}
        >
          <Grid>
            <GridItem span={{ base: 2, md: 4, lg: 4 }}>
              <span className="cs-hero__meta-key">Client</span>
              <span className="cs-hero__meta-val">{study.client}</span>
            </GridItem>
            <GridItem span={{ base: 2, md: 4, lg: 4 }}>
              <span className="cs-hero__meta-key">Location</span>
              <span className="cs-hero__meta-val">{study.location}</span>
            </GridItem>
            <GridItem
              span={{ base: 4, md: 8, lg: 4 }}
              className="cs-hero__bottom-right"
            >
              <span className="cs-hero__scroll">
                Scroll
                <span className="cs-hero__scroll-line" aria-hidden="true" />
              </span>
            </GridItem>
          </Grid>
        </motion.div>
      </section>

      {/* ── Intro / brief + meta sidebar ─────────────────── */}
      <section className="cs-intro">
        <Grid>
          <GridItem span={{ base: 4, md: 3, lg: 4 }} className="cs-intro__meta-cell">
            <div className="cs-intro__meta">
              <div className="cs-intro__row">
                <span className="cs-intro__meta-key">Industry</span>
                <span className="cs-intro__meta-val">{study.industry}</span>
              </div>
              <div className="cs-intro__row">
                <span className="cs-intro__meta-key">Roles</span>
                <span className="cs-intro__meta-val">
                  {study.roles.map((r, i) => (
                    <span key={r}>
                      {r}
                      {i < study.roles.length - 1 && <br />}
                    </span>
                  ))}
                </span>
              </div>
              <div className="cs-intro__row">
                <span className="cs-intro__meta-key">Services</span>
                <span className="cs-intro__meta-val">
                  {study.services.map((s, i) => (
                    <span key={s}>
                      {s}
                      {i < study.services.length - 1 && <br />}
                    </span>
                  ))}
                </span>
              </div>
            </div>
          </GridItem>

          <GridItem
            span={{ base: 4, md: 5, lg: 7 }}
            start={{ md: 4, lg: 6 }}
            className="cs-intro__copy-cell"
          >
            <span className="cs-intro__eyebrow">{study.intro.eyebrow}</span>
            <RevealLines as="h2" className="cs-intro__lede">
              {study.intro.lede}
            </RevealLines>
            <motion.p
              className="cs-intro__body"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            >
              {study.intro.body}
            </motion.p>
          </GridItem>
        </Grid>
      </section>

      {/* ── First parallax bleed ────────────────────────── */}
      {study.parallax?.[0] && (
        <ParallaxBleed
          image={study.parallax[0].image}
          alt={study.parallax[0].alt}
        />
      )}

      {/* ── Two-column: image + body ────────────────────── */}
      <section className="cs-twocol">
        <Grid>
          <GridItem
            span={{ base: 4, md: 4, lg: 6 }}
            className="cs-twocol__media-cell"
          >
            <motion.figure
              className="cs-twocol__media"
              initial={{ opacity: 0, y: 60, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              style={{ backgroundImage: `url(${study.twoCol.image})` }}
            >
              <figcaption className="cs-twocol__caption">
                {study.twoCol.caption}
              </figcaption>
            </motion.figure>
          </GridItem>
          <GridItem
            span={{ base: 4, md: 4, lg: 5 }}
            start={{ lg: 8 }}
            className="cs-twocol__copy-cell"
          >
            <span className="cs-twocol__eyebrow">{study.twoCol.eyebrow}</span>
            <RevealLines as="h2" className="cs-twocol__heading">
              {study.twoCol.heading}
            </RevealLines>
            <motion.p
              className="cs-twocol__body"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
            >
              {study.twoCol.body}
            </motion.p>
          </GridItem>
        </Grid>
      </section>

      {/* ── Second parallax bleed ───────────────────────── */}
      {study.parallax?.[1] && (
        <ParallaxBleed
          image={study.parallax[1].image}
          alt={study.parallax[1].alt}
        />
      )}

      {/* ── Sticky pin section ──────────────────────────── */}
      {study.pin && <StickyPin pin={study.pin} />}

      {/* ── Mosaic grid ─────────────────────────────────── */}
      <section className="cs-mosaic">
        <div className="cs-mosaic__grid">
          {study.mosaic?.map((m, i) => (
            <motion.figure
              key={m.image}
              className={`cs-mosaic__item cs-mosaic__item--${m.span}`}
              initial={{ opacity: 0, y: 60, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{
                duration: 1,
                ease: [0.22, 1, 0.36, 1],
                delay: (i % 2) * 0.12,
              }}
              style={{ backgroundImage: `url(${m.image})` }}
            />
          ))}
        </div>
      </section>

      {/* ── Wide image with caption ─────────────────────── */}
      {study.wide && (
        <section className="cs-wide">
          <ParallaxBleed image={study.wide.image} alt={study.wide.caption} strength={8} />
          <Grid>
            <GridItem span={{ base: 4, md: 8, lg: 12 }}>
              <p className="cs-wide__caption">{study.wide.caption}</p>
            </GridItem>
          </Grid>
        </section>
      )}

      {/* ── Pull quote ──────────────────────────────────── */}
      {study.quote && (
        <section className="cs-quote">
          <Grid>
            <GridItem
              span={{ base: 4, md: 8, lg: 10 }}
              start={{ lg: 2 }}
            >
              <RevealLines as="blockquote" className="cs-quote__body">
                {study.quote.body}
              </RevealLines>
              <motion.cite
                className="cs-quote__cite"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              >
                &mdash; {study.quote.attribution}
              </motion.cite>
            </GridItem>
          </Grid>
        </section>
      )}

      {/* ── Marquee ─────────────────────────────────────── */}
      {study.marquee && (
        <div className="cs-marquee" data-navbar-theme="dark" aria-hidden="true">
          <div className="cs-marquee__track">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="cs-marquee__item">
                {study.marquee}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Credits ─────────────────────────────────────── */}
      <section className="cs-credits">
        <Grid>
          <GridItem
            span={{ base: 4, md: 8, lg: 10 }}
            start={{ lg: 2 }}
          >
            <span className="cs-credits__eyebrow">Credits</span>
            <ul className="cs-credits__list">
              {study.credits?.map((c) => (
                <motion.li
                  key={c.role}
                  className="cs-credits__row"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="cs-credits__role">{c.role}</span>
                  <span className="cs-credits__names">{c.names}</span>
                </motion.li>
              ))}
            </ul>
          </GridItem>
        </Grid>
      </section>

      {/* ── Next project ────────────────────────────────── */}
      {next && <NextProject next={next} />}

      <BetterExperience
        text={
          <>
            See another<br />
            Story we&rsquo;ve<br />
            Stepped into.
          </>
        }
      />
      <Footer />
    </div>
  );
}

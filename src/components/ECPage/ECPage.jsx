"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import BetterExperience from "@components/BetterExperience";
import { Grid, GridItem } from "@components/Grid";
import "@styles/ECPage.css";

// Session flag passed across the navigation. When set, the inbound page
// mounts with its cover already at top:0 and animates it down to reveal
// the hero, so the hand-off reads as one continuous scroll.
const TRANSITION_FLAG = "__ec_transition_in";

// ── Reusable: parallax full-bleed image ──────────────────────────────
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
    <figure ref={ref} className="ec-bleed" aria-label={alt}>
      <motion.div
        className="ec-bleed__image"
        style={{ y, backgroundImage: `url(${image})` }}
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
        <span key={i} className="ec-reveal-line">
          <motion.span
            className="ec-reveal-line__inner"
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

// ── Scroll-zoom gallery ──────────────────────────────────────────────
// Recreates exoape's Fluid Glass project grid (the screenshots the
// user shared): an irregular grid of pre-placed images. As you scroll
// the entire stage zooms outward from its centre via a single scale.
// Because the focus tile is centred at (50%, 50%) of the stage and the
// transform-origin matches, the focus grows in place to fill the
// viewport while every off-centre tile is pushed outward by
// position × scale and naturally clipped by the sticky parent's
// overflow: hidden. No per-tile fade, no overlap fight, no z-index
// gymnastics — one motion value drives everything.
function ExplodedGallery({ gallery }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Final scale set high enough that the focus tile (sized
  // `gallery.focusFill` % of the stage) fully covers the viewport.
  // 100 / focusFill ensures the focus image's frame reaches 100% of
  // the viewport in its smallest dimension. We push slightly past so
  // the surrounding images are firmly off-screen.
  const finalScale = gallery.finalScale || 4;
  const scale = useTransform(scrollYProgress, [0, 1], [1, finalScale]);

  return (
    <section
      ref={ref}
      className="ec-gallery"
      data-navbar-theme="dark"
      aria-label={gallery.caption || "Project gallery"}
    >
      <div className="ec-gallery__sticky">
        <motion.div className="ec-gallery__stage" style={{ scale }}>
          {gallery.items.map((item, i) => (
            <div
              key={i}
              className={`ec-gallery__media${
                item.focus ? " ec-gallery__media--focus" : ""
              }`}
              style={{
                top: `${item.top}%`,
                left: `${item.left}%`,
                width: `${item.width}%`,
                height: `${item.height}%`,
                backgroundImage: `url(${item.image})`,
              }}
            />
          ))}
        </motion.div>
        {gallery.caption && (
          <span className="ec-gallery__caption">{gallery.caption}</span>
        )}
      </div>
    </section>
  );
}

// ── Chapter section ──────────────────────────────────────────────────
// Image + eyebrow + heading + multiple paragraphs (+ optional pull-quote).
// Sides alternate so a long stack of chapters reads like a folded piece.
// Only used when `study.chapters` is provided (Inversa /EC/b uses this
// to mirror exoape's multi-section editorial cadence; Fluid Glass /EC/a
// doesn't, keeping it visually leaner).
function Chapter({ chapter, index }) {
  const imageRight = index % 2 === 0;
  const paragraphs = Array.isArray(chapter.body)
    ? chapter.body
    : chapter.body
    ? [chapter.body]
    : [];

  return (
    <section className="ec-chapter">
      <Grid>
        <GridItem
          span={{ base: 4, md: 4, lg: 6 }}
          start={imageRight ? { lg: 7 } : { lg: 1 }}
          className="ec-chapter__media-cell"
        >
          {chapter.image && (
            <motion.figure
              className="ec-chapter__media"
              initial={{ opacity: 0, y: 60, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              style={{ backgroundImage: `url(${chapter.image})` }}
            >
              {chapter.caption && (
                <figcaption className="ec-chapter__caption">
                  {chapter.caption}
                </figcaption>
              )}
            </motion.figure>
          )}
        </GridItem>
        <GridItem
          span={{ base: 4, md: 4, lg: 5 }}
          start={imageRight ? { lg: 1 } : { lg: 8 }}
          className="ec-chapter__copy-cell"
        >
          {chapter.eyebrow && (
            <span className="ec-chapter__eyebrow">{chapter.eyebrow}</span>
          )}
          {chapter.heading && (
            <RevealLines as="h3" className="ec-chapter__heading">
              {chapter.heading}
            </RevealLines>
          )}
          {paragraphs.length > 0 && (
            <motion.div
              className="ec-chapter__body"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
            >
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </motion.div>
          )}
          {chapter.pullQuote && (
            <motion.blockquote
              className="ec-chapter__pullquote"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
            >
              {chapter.pullQuote}
            </motion.blockquote>
          )}
        </GridItem>
      </Grid>
    </section>
  );
}

// ── Sticky-pin section ───────────────────────────────────────────────
function StickyPin({ pin }) {
  return (
    <section className="ec-pin">
      <Grid>
        <GridItem
          span={{ base: 4, md: 4, lg: 5 }}
          className="ec-pin__text-cell"
        >
          <div className="ec-pin__sticky">
            <span className="ec-pin__eyebrow">{pin.eyebrow}</span>
            <RevealLines as="h2" className="ec-pin__heading">
              {pin.heading}
            </RevealLines>
            <motion.p
              className="ec-pin__body"
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
          className="ec-pin__images-cell"
        >
          <div className="ec-pin__images">
            {pin.images.map((src, i) => (
              <motion.figure
                key={src}
                className="ec-pin__image"
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

// ── Next-project section + scroll-driven hand-off ────────────────────
// Watches its own scroll progress. Once the user has read past the
// section (progress >= 0.95) the component animates a full-screen
// cover up over the page and pushes the router to the next slug.
// A session flag tells the next mount to drop the cover down again.
function NextProjectHandoff({ next, slug }) {
  const router = useRouter();
  const ref = useRef(null);
  const triggered = useRef(false);
  const [coverActive, setCoverActive] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  useEffect(() => {
    if (!next) return;
    const unsub = scrollYProgress.on("change", (v) => {
      if (triggered.current) return;
      if (v >= 0.985) {
        triggered.current = true;
        // Lenis is the smooth-scroll authority — pause it so the cover
        // animation isn't fighting page scroll while we navigate.
        const lenis = typeof window !== "undefined" ? window.__lenis : null;
        if (lenis && typeof lenis.stop === "function") lenis.stop();
        try {
          sessionStorage.setItem(TRANSITION_FLAG, slug);
        } catch (_) {}
        setCoverActive(true);
        // Give the cover its rise time, then route. The inbound page
        // mounts with cover already covering, so there's no flash.
        window.setTimeout(() => {
          router.push(next.href);
        }, 720);
      }
    });
    return () => unsub();
  }, [scrollYProgress, next, router, slug]);

  if (!next) return null;

  return (
    <>
      <section
        ref={ref}
        className="ec-next"
        data-navbar-theme="dark"
      >
        <div
          className="ec-next__bg"
          style={{ backgroundImage: `url(${next.hero?.image})` }}
        />
        <Link href={next.href} className="ec-next__inner" prefetch>
          <span className="ec-next__eyebrow">Next Project</span>
          <h3 className="ec-next__title">
            <span className="ec-next__name">{next.name}</span>
            <span className="ec-next__subtitle">{next.subtitle}</span>
          </h3>
          <span className="ec-next__cta">
            View case study
            <span aria-hidden>&rarr;</span>
          </span>
          <span className="ec-next__hint">Scroll to continue</span>
        </Link>
      </section>

      {/* Outbound cover — slides up to fully obscure the page, then we route. */}
      <AnimatePresence>
        {coverActive && (
          <motion.div
            key="ec-cover-out"
            className="ec-cover"
            style={{ backgroundImage: `url(${next.hero?.image})` }}
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.83, 0, 0.17, 1] }}
          >
            <div className="ec-cover__veil" />
            <div className="ec-cover__label">{next.name}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Inbound cover — only renders if we arrived via the hand-off ─────
function InboundCover({ study }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let flag = null;
    try {
      flag = sessionStorage.getItem(TRANSITION_FLAG);
    } catch (_) {}
    if (!flag) return;
    try {
      sessionStorage.removeItem(TRANSITION_FLAG);
    } catch (_) {}
    // Render with cover at top, then drop it.
    setShow(true);
    // Re-enable lenis once the reveal is finishing.
    const lenis = typeof window !== "undefined" ? window.__lenis : null;
    const t = window.setTimeout(() => {
      if (lenis && typeof lenis.start === "function") lenis.start();
      setShow(false);
    }, 750);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="ec-cover-in"
          className="ec-cover"
          style={{ backgroundImage: `url(${study.hero.image})` }}
          initial={{ y: "0%" }}
          animate={{ y: "-100%" }}
          transition={{ duration: 0.75, ease: [0.83, 0, 0.17, 1] }}
        >
          <div className="ec-cover__veil" />
          <div className="ec-cover__label">{study.name}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ECPage({ study, next }) {
  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroImageY = useTransform(heroProgress, [0, 1], ["0%", "20%"]);
  const heroTitleY = useTransform(heroProgress, [0, 1], ["0%", "-30%"]);
  const heroTitleScale = useTransform(heroProgress, [0, 1], [1, 0.95]);

  // When this page is freshly mounted (regardless of inbound transition),
  // make sure we start at the top so the hand-off reveal is correct.
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo(0, 0);
    const lenis = window.__lenis;
    if (lenis && typeof lenis.scrollTo === "function") {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [study.slug]);

  return (
    <div className="ec-page">
      <Navbar logoVisible={true} />

      <InboundCover study={study} />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section ref={heroRef} className="ec-hero" data-navbar-theme="dark">
        <motion.div
          className="ec-hero__image"
          style={{
            backgroundImage: `url(${study.hero.image})`,
            y: heroImageY,
          }}
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="ec-hero__veil" aria-hidden="true" />

        <div className="ec-hero__top">
          <Grid>
            <GridItem span={{ base: 2, md: 4, lg: 6 }}>
              <span className="ec-hero__label">{study.hero.label}</span>
            </GridItem>
            <GridItem
              span={{ base: 2, md: 4, lg: 6 }}
              className="ec-hero__top-right"
            >
              <span className="ec-hero__year">{study.year}</span>
            </GridItem>
          </Grid>
        </div>

        <motion.div
          className="ec-hero__title-wrap"
          style={{ y: heroTitleY, scale: heroTitleScale }}
        >
          <Grid>
            <GridItem span={{ base: 4, md: 8, lg: 12 }}>
              <h1 className="ec-hero__title">
                <span className="ec-reveal-line">
                  <motion.span
                    className="ec-reveal-line__inner"
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
                <span className="ec-reveal-line ec-hero__title-sub">
                  <motion.span
                    className="ec-reveal-line__inner"
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
          className="ec-hero__bottom"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.85 }}
        >
          <Grid>
            <GridItem span={{ base: 2, md: 4, lg: 4 }}>
              <span className="ec-hero__meta-key">Client</span>
              <span className="ec-hero__meta-val">{study.client}</span>
            </GridItem>
            <GridItem span={{ base: 2, md: 4, lg: 4 }}>
              <span className="ec-hero__meta-key">Location</span>
              <span className="ec-hero__meta-val">{study.location}</span>
            </GridItem>
            <GridItem
              span={{ base: 4, md: 8, lg: 4 }}
              className="ec-hero__bottom-right"
            >
              <span className="ec-hero__scroll">
                Scroll
                <span className="ec-hero__scroll-line" aria-hidden="true" />
              </span>
            </GridItem>
          </Grid>
        </motion.div>
      </section>

      {/* ── Intro / brief + meta sidebar ─────────────────── */}
      <section className="ec-intro">
        <Grid>
          <GridItem
            span={{ base: 4, md: 3, lg: 4 }}
            className="ec-intro__meta-cell"
          >
            <div className="ec-intro__meta">
              <div className="ec-intro__row">
                <span className="ec-intro__meta-key">Industry</span>
                <span className="ec-intro__meta-val">{study.industry}</span>
              </div>
              <div className="ec-intro__row">
                <span className="ec-intro__meta-key">Roles</span>
                <span className="ec-intro__meta-val">
                  {study.roles.map((r, i) => (
                    <span key={r}>
                      {r}
                      {i < study.roles.length - 1 && <br />}
                    </span>
                  ))}
                </span>
              </div>
              <div className="ec-intro__row">
                <span className="ec-intro__meta-key">Services</span>
                <span className="ec-intro__meta-val">
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
            className="ec-intro__copy-cell"
          >
            <span className="ec-intro__eyebrow">{study.intro.eyebrow}</span>
            <RevealLines as="h2" className="ec-intro__lede">
              {study.intro.lede}
            </RevealLines>
            <motion.p
              className="ec-intro__body"
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

      {/* ── Two-column ──────────────────────────────────── */}
      <section className="ec-twocol">
        <Grid>
          <GridItem
            span={{ base: 4, md: 4, lg: 6 }}
            className="ec-twocol__media-cell"
          >
            <motion.figure
              className="ec-twocol__media"
              initial={{ opacity: 0, y: 60, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              style={{ backgroundImage: `url(${study.twoCol.image})` }}
            >
              <figcaption className="ec-twocol__caption">
                {study.twoCol.caption}
              </figcaption>
            </motion.figure>
          </GridItem>
          <GridItem
            span={{ base: 4, md: 4, lg: 5 }}
            start={{ lg: 8 }}
            className="ec-twocol__copy-cell"
          >
            <span className="ec-twocol__eyebrow">{study.twoCol.eyebrow}</span>
            <RevealLines as="h2" className="ec-twocol__heading">
              {study.twoCol.heading}
            </RevealLines>
            <motion.p
              className="ec-twocol__body"
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

      {/* ── Exploded scroll gallery (optional, /EC/a only) ──────────── */}
      {study.gallery && <ExplodedGallery gallery={study.gallery} />}

      {/* ── Sticky pin ──────────────────────────────────── */}
      {study.pin && <StickyPin pin={study.pin} />}

      {/* ── Chapters (optional, alternating image+text stack) ────────── */}
      {study.chapters?.length > 0 && (
        <div className="ec-chapters">
          {study.chapters.map((c, i) => (
            <Chapter key={c.eyebrow || c.heading || i} chapter={c} index={i} />
          ))}
        </div>
      )}

      {/* ── Mosaic ──────────────────────────────────────── */}
      <section className="ec-mosaic">
        <div className="ec-mosaic__grid">
          {study.mosaic?.map((m, i) => (
            <motion.figure
              key={m.image}
              className={`ec-mosaic__item ec-mosaic__item--${m.span}`}
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

      {/* ── Wide image ──────────────────────────────────── */}
      {study.wide && (
        <section className="ec-wide">
          <ParallaxBleed
            image={study.wide.image}
            alt={study.wide.caption}
            strength={8}
          />
          <Grid>
            <GridItem span={{ base: 4, md: 8, lg: 12 }}>
              <p className="ec-wide__caption">{study.wide.caption}</p>
            </GridItem>
          </Grid>
        </section>
      )}

      {/* ── Pull quote ──────────────────────────────────── */}
      {study.quote && (
        <section className="ec-quote">
          <Grid>
            <GridItem span={{ base: 4, md: 8, lg: 10 }} start={{ lg: 2 }}>
              <RevealLines as="blockquote" className="ec-quote__body">
                {study.quote.body}
              </RevealLines>
              <motion.cite
                className="ec-quote__cite"
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
        <div className="ec-marquee" data-navbar-theme="dark" aria-hidden="true">
          <div className="ec-marquee__track">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="ec-marquee__item">
                {study.marquee}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Credits — "text has-padding-bottom dark align-right" analog ─ */}
      <section className="ec-credits">
        <Grid>
          <GridItem span={{ base: 4, md: 8, lg: 10 }} start={{ lg: 2 }}>
            <span className="ec-credits__eyebrow">Credits</span>
            <ul className="ec-credits__list">
              {study.credits?.map((c) => (
                <motion.li
                  key={c.role}
                  className="ec-credits__row"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="ec-credits__role">{c.role}</span>
                  <span className="ec-credits__names">{c.names}</span>
                </motion.li>
              ))}
            </ul>
          </GridItem>
        </Grid>
      </section>

      {/* ── Next-project hand-off — "next-project light" analog ───────── */}
      <NextProjectHandoff next={next} slug={study.slug} />

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

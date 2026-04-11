"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { flushSync } from "react-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "../../styles/AboutPage.css";

const teamMembers = [
  { name: "Rashmi", img: "/images/Rashmi.png", label: "Rashmi Kohli | Co-Founder" },
  { name: "Ashish", img: "/images/Ashish.png", label: "Ashish Mahaja | Co-Founder" },
  { name: "Tarun", img: "/images/Tarun.png", label: "Tarrun Kumaria | Director", subtitle: "Sparrow Middle East" },
  { name: "Chandan", img: "/images/Chandan.png", label: "Chandan Abrol | VP", subtitle: "Projects" },
  { name: "Robin", img: "/images/Robin.png", label: "Robin" },
  { name: "Deepak", img: "/images/Deepak.png", label: "Deepak" },
  { name: "Mayank", img: "/images/Mayank.png", label: "Mayank" },
  { name: "Ayush", img: "/images/Ayush.png", label: "Ayush" },
  { name: "Kapish", img: "/images/Kapish.png", label: "Kapish" },
  { name: "Ranjit", img: "/images/Ranjit.png", label: "Ranjit" },
  { name: "Rishi", img: "/images/Rishi.png", label: "Rishi" },
  { name: "Shivangi", img: "/images/Shivangi.png", label: "Shivangi" },
  { name: "Vijay", img: "/images/Vijay.png", label: "Vijay" },
];

const whySparrowItems = [
  {
    title: "Pioneers, Not Followers",
    content:
      "We have introduced many industry firsts, photorealism, stereoscopic animation, holographic displays, 5D environments.",
  },
  {
    title: "Phygital by Design",
    content:
      "We bridge the physical and digital worlds, creating immersive experiences that blur the line between what is real and what is rendered.",
  },
  {
    title: "Story Before Spectacle",
    content:
      "Technology is only as good as the narrative it serves. We start with the story, then engineer the experience around it.",
  },
  {
    title: "3 Decades of Depth",
    content:
      "Nearly 30 years of industry expertise means we have seen every trend, outlasted every fad, and refined our craft through thousands of projects.",
  },
  {
    title: "India\u2019s Trusted Studio",
    content:
      "From marquee developers to global brands, we have earned our reputation as the go-to studio for experience design in India.",
  },
];

const beliefs = [
  {
    title: "On Experience",
    text: "People do not remember what they were told. They remember what they felt. An experience that bypasses the rational mind and speaks directly to the gut will always outperform one that merely explains.",
  },
  {
    title: "On Innovation",
    text: "Comfort is the enemy of relevance. We believe in deliberate discomfort, in asking, at every stage, whether there is a better, bolder, more resonant way to do what we are about to do.",
  },
  {
    title: "On Craft",
    text: "Detail is not a finishing touch. It is the entire argument. The texture, the timing, the light, these are not ornamental. They are the difference between something that impresses and something that converts.",
  },
  {
    title: "On Partnership",
    text: "The best work never happens in isolation. It happens when the ambition of the client meets the expertise of the studio in a relationship built on trust, candour, and a shared refusal to settle.",
  },
  {
    title: "On Stories",
    text: "We believe stories outlast spreadsheets. They outlast sales cycles. They outlast even the buildings they were made to sell. If we do our job well, the story of a place begins to matter to people before they have ever set foot in it.",
  },
];

const journeyYears = [
  {
    year: "2003",
    position: "calc(var(--grid-margin) + var(--grid-unit) + var(--col-w) / 2)",       // col 2 center
    desc: "The studio takes its first steps into spatial design, bringing architecture to life through early digital visualization.",
  },
  {
    year: "2006",
    position: "calc(var(--grid-margin) + 3 * var(--grid-unit) + var(--col-w) / 2)",   // col 4 center
    desc: "A chance encounter with 3D animation changes everything. We commit to becoming the best in a field that barely has a name yet. Destiny, as it turns out, has excellent taste.",
  },
  {
    year: "2008",
    position: "calc(var(--grid-margin) + 6 * var(--grid-unit) + var(--col-w) / 2)",   // col 7 center
    desc: "A pivotal year of growth. We expand beyond real estate into hospitality and retail, proving that great spatial storytelling knows no boundaries.",
  },
  {
    year: "2012",
    position: "calc(var(--grid-margin) + 7 * var(--grid-unit) + var(--col-w) / 2)",   // col 8 center
    desc: "We go fully digital, embracing real-time rendering and interactive experiences that set a new benchmark in the industry.",
  },
  {
    year: "2013",
    position: "calc(var(--grid-margin) + 8 * var(--grid-unit) + var(--col-w) / 2)",   // col 9 center
    desc: "Recognition follows ambition. Multiple awards validate our approach to immersive design and reshape industry expectations.",
  },
  {
    year: "2015",
    position: "calc(var(--grid-margin) + 9 * var(--grid-unit) + var(--col-w) / 2)",   // col 10 center
    desc: "The phygital revolution begins. We pioneer the fusion of physical and digital experiences, redefining what a studio can be.",
  },
  {
    year: "Today",
    position: "calc(var(--grid-margin) + 11 * var(--grid-unit) + var(--col-w) / 2)",  // col 12 center
    desc: "100+ creatives strong and still growing. Three decades of trust, innovation, and relentless pursuit of excellence continue to define us.",
  },
];

const approachCards = [
  {
    number: "01",
    heading: "Brief Deconstruction",
    text: "We dig beneath the stated requirement to find the real one. What developers think they need and what their buyers actually respond to are rarely the same thing. We close that gap.",
  },
  {
    number: "02",
    heading: "Creative Architecture",
    text: "Before anything is rendered or built, we design the experience \u2014 the narrative arc, the emotional sequence, the moments of surprise and inevitability that make the whole thing land.",
  },
  {
    number: "03",
    heading: "Craft & Execution",
    text: "This is where obsession serves us well. Whether it\u2019s the quality of light in a render, the grain of wood on a scale model, or the precisely timed reveal in a walkthrough \u2014 we hold the detail to a standard others consider excessive. We consider it baseline.",
  },
  {
    number: "04",
    heading: "Delivery & Beyond",
    text: "A great experience doesn\u2019t end at handover. We ensure that what we create continues to perform \u2014 in sales centres, pitch meetings, award submissions, and beyond.",
  },
];

/* CSS calc for center of grid column N (1-based) */
const colCenter = (col) =>
  `calc(var(--grid-margin) + ${col - 1} * var(--grid-unit) + var(--col-w) / 2)`;

/**
 * Compute each marker's grid-column position based on which year is active.
 *   - Active year       → col 4 (featured spot, pops up large)
 *   - 1 year to left    → col 2 (the only visible previous year)
 *   - All others left   → off-screen
 *   - Right years       → evenly spread across cols 6–12
 */
function getMarkerPositions(activeIndex, total) {
  const positions = [];
  const rightCount = total - activeIndex - 1;

  for (let i = 0; i < total; i++) {
    if (i === activeIndex) {
      positions.push(colCenter(4));
    } else if (i === activeIndex - 1) {
      // Immediate previous year → col 2
      positions.push(colCenter(2));
    } else if (i < activeIndex) {
      // All other left years → slide off-screen
      const dist = activeIndex - 1 - i; // how far past the one visible slot
      positions.push(`calc(var(--grid-margin) - ${dist * 140 + 80}px)`);
    } else {
      const rIdx = i - activeIndex - 1;
      const t = rightCount === 1 ? 0.5 : rIdx / (rightCount - 1);
      positions.push(colCenter(Math.round(6 + t * 6))); // cols 6→12
    }
  }
  return positions;
}

/* ═══════════════════════════════════════════════════════════
   Approach Section — relative + px-[6vw] container.

   Card 01 stays in place. On scroll each next card slides
   UP from the bottom of the viewport and overlays the
   previous one — but leaves a small top-edge strip visible
   (stacked-tabs effect). Content of lower cards is hidden
   by the covering card's opaque background.

   Visual after all 4:
   ┌─ card 01 edge ──────────────────────────┐
   ├─ card 02 edge ──────────────────────────┤
   ├─ card 03 edge ──────────────────────────┤
   │  04  Delivery & Beyond                  │
   │  ...                                 04 │
   └─────────────────────────────────────────┘
   ═══════════════════════════════════════════════════════════ */
function ApproachSection() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    let ctx;

    async function init() {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const cards = cardsRef.current.filter(Boolean);
        const total = cards.length;
        const GAP = 28; // px of top-edge visible per stacked card

        // Card 01: stays put. Cards 2-4: start far below (off-screen).
        cards.forEach((card, i) => {
          gsap.set(card, { zIndex: i + 1 });
          if (i > 0) gsap.set(card, { y: window.innerHeight });
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${window.innerHeight * (total + 0.5)}`,
            pin: true,
            scrub: 1,
            onUpdate: (self) => {
              setActiveIdx(
                Math.min(
                  Math.floor(self.progress * (total + 0.5)),
                  total - 1
                )
              );
            },
          },
        });

        // Hold first card
        tl.to({}, { duration: 0.5 });

        for (let i = 1; i < total; i++) {
          const card = cards[i];
          const h = card.querySelector(".approach-card__heading");
          const t = card.querySelector(".approach-card__text");
          const n = card.querySelector(".approach-card__number");

          gsap.set([h, t], { opacity: 0, y: 30 });
          gsap.set(n, { opacity: 0 });

          // ── Card flies up from bottom of page to its stacked offset ──
          tl.to(card, {
            y: i * GAP, // 28px, 56px, 84px — each reveals prev top edge
            duration: 1.2,
            ease: "power3.out",
          });

          // ── Stagger children once card is mostly in view ──
          tl.fromTo(
            n,
            { opacity: 0 },
            { opacity: 1, duration: 0.3 },
            ">-0.45"
          );
          tl.fromTo(
            h,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" },
            "<0.05"
          );
          tl.fromTo(
            t,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" },
            "<0.1"
          );

          // Hold before next card
          tl.to({}, { duration: 0.5 });
        }
      }, sectionRef);
    }

    init();
    return () => ctx && ctx.revert();
  }, []);

  return (
    <section className="about-approach" ref={sectionRef}>
      <h2 className="approach-header__title">Our Approach</h2>

      {/* Coordinate-system container: relative + overflow hidden
          so cards slide up from below the visible boundary */}
      <div className="approach-card-stack">
        {approachCards.map((card, i) => (
          <div
            key={card.number}
            className="approach-card"
            ref={(el) => (cardsRef.current[i] = el)}
          >
            <h3 className="approach-card__heading">{card.heading}</h3>
            <p className="approach-card__text">{card.text}</p>
            <span className="approach-card__number">{card.number}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function AboutPage() {
  const [activeAccordion, setActiveAccordion] = useState(0);
  const [activeYear, setActiveYear] = useState(1); // Controls dots/labels
  const [descYear, setDescYear] = useState(1);     // Controls description text
  const [descState, setDescState] = useState("idle"); // idle | exiting | entering
  const dirRef = useRef(1);          // 1 = forward (right), -1 = backward (left)
  const timeoutRef = useRef(null);

  // Beliefs circular scroll — continuous rolling paper
  // No transitions; transform follows wheel delta directly like physical scroll.
  const beliefsRef = useRef(null);
  const beliefsInnerRef = useRef(null);
  const beliefOrderRef = useRef([...beliefs]);
  const [displayBeliefs, setDisplayBeliefs] = useState([...beliefs]);

  useEffect(() => {
    const el = beliefsRef.current;
    if (!el) return;

    let offset = 0;

    const onWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const inner = beliefsInnerRef.current;
      if (!inner?.firstElementChild) return;

      offset += e.deltaY * 0.15;

      // Forward: first item scrolled fully out of top
      if (offset >= inner.firstElementChild.offsetHeight) {
        offset -= inner.firstElementChild.offsetHeight;
        const arr = beliefOrderRef.current;
        beliefOrderRef.current = [...arr.slice(1), arr[0]];
        flushSync(() => setDisplayBeliefs([...beliefOrderRef.current]));
      }

      // Backward: scrolled before start
      if (offset < 0) {
        const arr = beliefOrderRef.current;
        beliefOrderRef.current = [arr[arr.length - 1], ...arr.slice(0, -1)];
        flushSync(() => setDisplayBeliefs([...beliefOrderRef.current]));
        offset += inner.firstElementChild.offsetHeight;
      }

      inner.style.transform = `translateY(-${offset}px)`;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);
  const markerPositions = getMarkerPositions(activeYear, journeyYears.length);

  const handleYearClick = (index) => {
    if (index === activeYear) return;
    dirRef.current = index > activeYear ? 1 : -1;

    // Dots slide immediately
    setActiveYear(index);
    // Old description exits
    setDescState("exiting");

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      // Swap text and enter
      setDescYear(index);
      setDescState("entering");
      // Settle after enter animation
      setTimeout(() => setDescState("idle"), 500);
    }, 300);
  };

  return (
    <div className="about-page">
      <Navbar />

      {/* Hero Section */}
      <section className="about-hero">
        <h1 className="about-hero__title">
          Everything Except Average.
          <br />
          Always.
        </h1>
        <div className="about-hero__image-wrapper">
          <img
            src="/images/aboutus.webp"
            alt="Sparrow Team"
            className="about-hero__image"
          />
        </div>
      </section>

      {/* Intro Section */}
      <section className="about-intro">
        <h2 className="about-intro__heading">
          We are creativity,
          <br />
          obsessed with tech
        </h2>
        <div className="about-intro__body">
          <p className="about-intro__text">
            Founded in 1998, Sparrow is a flock of 100+ strategists, spatial
            designers, technologists, and storytellers,
            united by one purpose: to fuse strategic insight with the art of
            spatial storytelling, and craft narratives that move, convince, and
            compel.
          </p>
          <p className="about-intro__text">
            As a technology-obsessed, creativity-led, storytelling-driven
            experience design agency, we work at the intersection of imagination
            and execution, in what we call the phygital. This is the territory we
            have claimed, explored, and more often than not pioneered.
          </p>
        </div>
      </section>

      {/* Journey Section */}
      <section className="about-journey">
        <div className="journey-header">
          <h2 className="journey-header__title">Our Journey</h2>
          <p className="journey-header__desc">
            We know real estate Like The Back of Our Hands.
            <br />
            <strong>30</strong> Years in the Industry Does That to You.
          </p>
        </div>

        <div className="journey-content">
          <div className="journey-timeline">
            {/* Year labels (above the line) */}
            {journeyYears.map((item, index) => (
              <span
                key={item.year}
                className={`journey-timeline__label${
                  activeYear === index
                    ? " journey-timeline__label--active"
                    : ""
                }`}
                style={{ left: markerPositions[index] }}
                onClick={() => handleYearClick(index)}
              >
                {item.year}
              </span>
            ))}

            {/* Line */}
            <div className="journey-timeline__line" />

            {/* Dots (on the line, slide with their label) */}
            {journeyYears.map((item, index) => (
              <span
                key={`dot-${item.year}`}
                className={`journey-timeline__dot${
                  activeYear === index
                    ? " journey-timeline__dot--active"
                    : ""
                }`}
                style={{ left: markerPositions[index] }}
                onClick={() => handleYearClick(index)}
              />
            ))}
          </div>

          {/* Description: exit/enter animation synced with dot direction */}
          <p
            className={`journey-featured__desc${
              descState === "exiting"
                ? " journey-featured__desc--exiting"
                : descState === "entering"
                ? " journey-featured__desc--entering"
                : ""
            }`}
            style={{ "--desc-dir": dirRef.current }}
          >
            {journeyYears[descYear].desc}
          </p>
        </div>
      </section>

      {/* People of Honour Section */}
      <section className="about-honour">
        <h2 className="about-honour__title">
          Leaders bored
          <br />
          with Conformity
        </h2>
        <p className="about-honour__subtitle">
          Good enough is never where we stop, and we learned that from the best.
        </p>
      </section>

      {/* Team Photos Section */}
      <section className="about-team">
        <div className="team-grid">
          {teamMembers.slice(0, 4).map((member) => (
            <div key={member.name} className="team-card">
              <div className="team-card__img">
                <img src={member.img} alt={member.name} />
              </div>
              <div className="team-card__name">
                <span>{member.label}</span>
                {member.subtitle && (
                  <>
                    <br />
                    <span className="team-card__subtitle">{member.subtitle}</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Sparrow Section */}
      <section className="about-why">
        <div className="why-label">
          <span>Why Sparrow?</span>
        </div>
        <div className="why-accordion">
          {whySparrowItems.map((item, index) => (
            <div
              key={item.title}
              className={`why-accordion__item ${
                activeAccordion === index ? "why-accordion__item--active" : ""
              }`}
            >
              <div
                className="why-accordion__header"
                onClick={() =>
                  setActiveAccordion(activeAccordion === index ? -1 : index)
                }
              >
                <h3 className="why-accordion__title">{item.title}</h3>
                <span className="why-accordion__arrow">
                  <svg
                    width="29"
                    height="29"
                    viewBox="0 0 29 29"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 21L21 8M21 8H8M21 8V21"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </span>
              </div>
              {activeAccordion === index && (
                <p className="why-accordion__content">{item.content}</p>
              )}
              <div className="why-accordion__divider" />
            </div>
          ))}
        </div>
      </section>

      {/* Marquee Text */}
      <section className="about-marquee">
        <p className="about-marquee__text">
          What does this project really need to do?
        </p>
      </section>

      {/* Our Approach Section — scroll-pinned card carousel */}
      <ApproachSection />

      {/* What We Believe Section */}
      <section className="about-beliefs">
        <h2 className="beliefs-title">What We Believe</h2>
        <div ref={beliefsRef} className="beliefs-list">
          <div ref={beliefsInnerRef} className="beliefs-list__inner">
            {displayBeliefs.map((belief, i) => (
              <div key={`${belief.title}-${i}`} className="belief-item">
                <h4 className="belief-item__title">{belief.title}</h4>
                <p className="belief-item__text">{belief.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banner Image Section */}
      <section className="about-banner">
        <div className="banner-image-wrapper">
          <img src="/images/image 96.png" alt="Architecture" />
        </div>
        <h2 className="banner-text">AMAZE . DELIGHT . REPEAT</h2>
      </section>

      <Footer />
    </div>
  );
}

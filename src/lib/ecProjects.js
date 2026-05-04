// EC (Experience Clone) projects — Fluid Glass and Inversa.
// Two-page pair that recreates the exoape /work/[project] structure with
// the Sparrow cream-and-ink palette. /EC/a hands off to /EC/b on scroll
// via a shared overlay transition (see ECPage.jsx).

const seed = (s, w = 1600, h = 1000) =>
  `https://picsum.photos/seed/${s}/${w}/${h}`;

export const EC_PROJECTS = {
  a: {
    slug: "a",
    name: "FLUID GLASS",
    subtitle: "Architectural Glazing",
    location: "London, United Kingdom",
    year: "2024",
    client: "Fluid Glass",
    industry: "Architectural Glazing",
    roles: ["Brand Strategy", "Site Design", "Creative Development"],
    services: [
      "Identity System",
      "Web Design",
      "GSAP Motion",
      "Content Management",
    ],
    hero: {
      image: seed("fluid-glass-hero-arch", 2000, 1200),
      label: "Project /001",
    },
    intro: {
      eyebrow: "The Brief",
      lede:
        "Translate the precision of structural glazing into a digital experience as exact, considered and quietly confident as the work itself.",
      body:
        "Fluid Glass deliver structural and architectural glazing to some of the most prestigious construction projects in the United Kingdom. The site had to read like a craftsperson — calm, technical, and unmistakably premium — without ever raising its voice.",
    },
    parallax: [
      { image: seed("fluid-glass-elevation", 2000, 1200), alt: "Glass elevation" },
      { image: seed("fluid-glass-detail", 2000, 1200), alt: "Connection detail" },
    ],
    twoCol: {
      eyebrow: "Approach",
      heading: "Architecture as restraint.",
      body:
        "We let the glazing carry the story. Wide horizontal compositions, slow scroll-mask reveals and hairline rules echo the construction drawings the studio works from. Type stays small, generous and exact — every label earned.",
      image: seed("fluid-glass-twocol", 1400, 1700),
      caption: "Process — Vision · Planning · Site Assessment.",
    },
    pin: {
      eyebrow: "Detail",
      heading: "Three phases, one continuous read.",
      body:
        "Vision & Planning, Site Assessment and Production are presented as a single sticky stack. As you scroll, drawings give way to site photography and finally to fabrication, mirroring how a project actually moves through the studio's hands.",
      images: [
        seed("fluid-glass-pin-1", 1200, 1500),
        seed("fluid-glass-pin-2", 1200, 1500),
        seed("fluid-glass-pin-3", 1200, 1500),
      ],
    },
    // Scroll-zoom gallery — pre-placed tiles, generous breathing room.
    // The frames never move (only the focus tile's cell grows), and every
    // pair of side tiles has at least ~7% empty space between any two
    // edges, so even at peak inner-zoom no two images visually touch.
    // Side tiles zoom the image inside the frame; focus tile grows its
    // cell to exactly 100% × 100% of the stage (no overflow).
    //
    // Layout (% of stage):
    //   row 1 (top):     [TL]   [ focus ]   [TR]
    //   row 2 (mid):  [ML]      [ focus ]      [MR]
    //   row 3 (bot):     [BL]   [ focus ]   [BR]
    // Centre of focus = (50%, 50%) so it grows radially to the viewport.
    // Irregular masonry grid that mirrors the exoape Fluid Glass
    // screenshots: top-left small, top-centre wide, top-right small,
    // mid-left, FOCUS (centred), mid-right, bottom-left, bottom-centre,
    // bottom-right. The focus tile is sized 30 × 30 and positioned at
    // (35, 35) so its centre lands exactly at (50, 50) of the stage —
    // the same point as the stage's transform-origin. A single scale
    // on the stage zooms everything together; the focus grows in
    // place to fill the viewport, the surrounding tiles get pushed
    // outward by their off-centre positions and clipped by the
    // sticky parent. finalScale = 100 / focusWidth = 100 / 30 ≈ 3.34;
    // we use 3.6 so the focus comfortably overshoots the viewport edge.
    gallery: {
      caption: "Project Grid — Bespoke",
      finalScale: 3.6,
      items: [
        // top-left  (small, like the orange-corten panel in the screenshots)
        { image: seed("fluid-glass-g1", 1200, 1500), top: 14, left: 8,  width: 22, height: 30 },
        // top-centre wide (the dining-room / studio shot)
        { image: seed("fluid-glass-g2", 1400, 900),  top: 0,  left: 33, width: 34, height: 22 },
        // top-right (small, like the red-arch / plants shot)
        { image: seed("fluid-glass-g3", 1200, 1200), top: 18, left: 70, width: 22, height: 22 },
        // mid-left strip
        { image: seed("fluid-glass-g4", 1000, 1400), top: 44, left: 0,  width: 14, height: 14 },
        // mid-right (the red-arch / plants alt — wider)
        { image: seed("fluid-glass-g5", 1400, 1100), top: 32, left: 70, width: 26, height: 26 },
        // bottom-left wide (the brick house exterior)
        { image: seed("fluid-glass-g6", 1500, 1000), top: 64, left: 4,  width: 30, height: 28 },
        // bottom-centre (the tree-canopy / glass-roof shot)
        { image: seed("fluid-glass-g7", 1200, 1100), top: 66, left: 36, width: 28, height: 28 },
        // bottom-right (the brick / bike interior shot)
        { image: seed("fluid-glass-g8", 1400, 1000), top: 64, left: 68, width: 28, height: 28 },
        // CENTRE FOCUS — must be 30 × 30 at (35, 35) so the centre is
        // exactly (50, 50). This is what grows in place to fill the
        // viewport when the stage scales.
        {
          image: seed("fluid-glass-focus", 1600, 1600),
          top: 35, left: 35, width: 30, height: 30,
          focus: true,
        },
      ],
    },
    mosaic: [
      { image: seed("fluid-glass-m1", 1200, 1600), span: "tall" },
      { image: seed("fluid-glass-m2", 1400, 900), span: "wide" },
      { image: seed("fluid-glass-m3", 1200, 1200), span: "square" },
      { image: seed("fluid-glass-m4", 1200, 1600), span: "tall" },
    ],
    wide: {
      image: seed("fluid-glass-wide", 2400, 1100),
      caption: "Showroom gallery — horizontal scroll component.",
    },
    quote: {
      body:
        "The site doesn't sell the glass. It earns the brief, then quietly steps out of the way.",
      attribution: "Sparrow project lead",
    },
    marquee: "FLUID GLASS  —  STRUCTURAL GLAZING  —  UK  —",
    credits: [
      { role: "Creative Direction", names: "Sparrow Studio" },
      { role: "Site Design", names: "Sparrow Studio" },
      { role: "Creative Development", names: "Sparrow Studio" },
      { role: "Motion", names: "Sparrow Studio" },
    ],
  },

  b: {
    slug: "b",
    name: "INVERSA",
    subtitle: "Environmental Intelligence",
    location: "Roermond, The Netherlands · Field deployments, North America",
    year: "2025",
    client: "Inversa",
    industry: "Conservation Technology",
    roles: [
      "Creative Direction",
      "UX/UI Design",
      "Motion & Interaction",
      "Front-end Development",
    ],
    services: [
      "Strategy & Narrative",
      "Interactive Storytelling",
      "Custom Illustration",
      "Motion Design",
      "Nuxt Front-end",
      "Content Management",
    ],
    hero: {
      image: seed("inversa-hero-field", 2000, 1200),
      label: "Case Study /Inversa",
    },
    intro: {
      eyebrow: "The Brief",
      lede:
        "Inversa equips wildlife agencies to tackle invasive species where it matters most — out in the field, knee-deep in the mud and brush.",
      body:
        "Their work is hands-on, powered by real-time data and a vision for large-scale ecological restoration. When we joined forces with Inversa, our goal was clear: create an interactive digital experience that doesn't feel like every other software product. We set out to translate their mission into a living, breathing narrative that captures both the grit and the intelligence behind their work.",
    },
    parallax: [
      { image: seed("inversa-field-crew", 2000, 1200), alt: "Field crew at work" },
      { image: seed("inversa-drone", 2000, 1200), alt: "Drone survey overhead" },
    ],
    twoCol: {
      eyebrow: "Approach",
      heading: "Less brochure, more window.",
      body:
        "We ditched dry corporate facts. No \"leveraging data\" or \"synergizing efforts.\" Instead we designed an interactive experience that put the human element of environmental work front and centre — the people who use these tools to protect their local ecosystems.",
      image: seed("inversa-twocol", 1400, 1700),
      caption: "Origin app — interface explorations.",
    },
    pin: {
      eyebrow: "The Challenge",
      heading: "More than software.",
      body:
        "The real challenge for Inversa was identity. They didn't want to be seen as just another software vendor in a crowded field. Their ambition was bigger: to become the intelligence behind real-world restoration, not just a dashboard.",
      images: [
        seed("inversa-pin-1", 1200, 1500),
        seed("inversa-pin-2", 1200, 1500),
        seed("inversa-pin-3", 1200, 1500),
      ],
    },
    chapters: [
      {
        eyebrow: "The Challenge",
        heading: "The brain behind the boots.",
        body: [
          "Inversa's platform isn't just about storing data; it's about interpreting it, guiding action, and supporting the people making decisions on the ground. It's the brain that empowers the boots in the field.",
          "Our approach was to turn that expertise into something you could actually feel online. We wanted visitors to see how Inversa's tools help nature bounce back, not just read about features. Instead of focusing on the tech itself, we put the spotlight on the results: a forest coming back to life, a river running clear.",
        ],
        image: seed("inversa-chapter-challenge", 1400, 1700),
        caption: "The Origin app — user interface",
      },
      {
        eyebrow: "Simplifying Complexity",
        heading: "Cutting through the data.",
        body: [
          "Origin, Inversa's core platform, is packed with data — so much that it can be overwhelming at first glance. Our job was to cut through that complexity and shape it into a story anyone could follow, whether you're a field tech or a policymaker.",
          "We pulled the technical threads — geospatial alerts, satellite imagery, real-time habitat data — into one clear story. By focusing on the essentials, we turned dense data and complex interfaces into something intuitive. Something you can sense when you step into the woods.",
        ],
        image: seed("inversa-chapter-simplify", 1400, 1700),
        caption: "Showcasing how technology can be used to heal nature",
        pullQuote:
          "\"The site transforms dense data into an approachable, engaging story. It makes Inversa's mission tangible, builds trust with its audience, and establishes the brand as a leader in environmental intelligence.\"",
      },
      {
        eyebrow: "Blending Nature and Technology",
        heading: "An invisible layer of intelligence.",
        body: [
          "Origin is like an invisible layer of intelligence running through the landscape, quietly analyzing everything from soil to satellite feeds to guide restoration. To capture that sense of hidden power, we built a design that fuses nature and technology.",
          "We stayed away from the usual green non-profit look, but also avoided the cold, tech-for-tech's-sake vibe you see in so many startups. We went for high-contrast design, mixing crisp UI with striking nature photography. Sharp lines and clean type give the spotlight to the environment itself.",
        ],
        image: seed("inversa-chapter-blend", 1400, 1700),
        caption: "Design inspiration",
      },
      {
        eyebrow: "UX/UI Design",
        heading: "Story first, everything else second.",
        body: [
          "We started by shaping the story, and everything else followed from there. With the narrative in place, we built the UX and motion to guide visitors naturally, ensuring no one ever felt lost in the data.",
          "On the homepage, we let the story do the heavy lifting. By visualizing the hidden data layer at work, we show how removing invasive species brings a landscape back to life. As you scroll, the environment heals: invaders fade away, and ecosystems return.",
        ],
        image: seed("inversa-chapter-ux", 1400, 1700),
        caption: "The user experience narrative",
      },
      {
        eyebrow: "Illustration",
        heading: "Behind the tech, it's still humans.",
        body: [
          "We brought Inversa's story to life with custom line illustrations — people in the field, the tools in their hands, the drones overhead. These visuals add a layer of storytelling that makes the process feel real and relatable.",
          "The hand-drawn style keeps things approachable, reminding visitors that behind all the tech, it's still humans making the difference.",
        ],
        image: seed("inversa-chapter-illustration", 1400, 1700),
        caption: "Illustrations art direction",
      },
      {
        eyebrow: "Origin Showcase",
        heading: "A guided tour, not a screenshot.",
        body: [
          "One of the site's standout features is the interactive Origin showcase. A static screenshot wouldn't cut it, so we built a guided tour that lets users see exactly how the system supports restoration crews and tracks real results.",
          "By making the process transparent and easy to follow, we turned a complex tool into a story anyone can engage with. It's a way to make Inversa's impact feel real and immediate.",
        ],
        image: seed("inversa-chapter-origin", 1400, 1700),
        caption: "A dedicated section explaining how Origin works",
      },
      {
        eyebrow: "Look Under the Hood",
        heading: "Fast, reliable, alive.",
        body: [
          "Nuxt runs the front end, making sure everything stays smooth no matter the device. GSAP ScrollTrigger enables the scroll-driven animations that bring the storytelling elements to life — smooth and responsive, never distracting.",
          "We combined SVG animations and video to dynamically showcase UI components and workflows, so the Origin interface feels tangible and alive even on a static screen. And we set up the site so Inversa can manage everything themselves: testimonials, case studies, team bios. Not just a finished product, but a living tool.",
        ],
        image: seed("inversa-chapter-build", 1400, 1700),
        caption: "Development & motion — Nuxt + GSAP ScrollTrigger",
      },
    ],
    mosaic: [
      { image: seed("inversa-m1", 1200, 1600), span: "tall" },
      { image: seed("inversa-m2", 1400, 900), span: "wide" },
      { image: seed("inversa-m3", 1200, 1200), span: "square" },
      { image: seed("inversa-m4", 1200, 1600), span: "tall" },
    ],
    wide: {
      image: seed("inversa-wide", 2400, 1100),
      caption: "Origin showcase — guided interactive tour.",
    },
    quote: {
      body:
        "The site transforms dense data into an approachable, engaging story. It makes Inversa's mission tangible, builds trust with its audience, and establishes the brand as a leader in environmental intelligence.",
      attribution: "Inversa team",
    },
    marquee: "INVERSA  —  ECOLOGICAL INTELLIGENCE  —  REAL-TIME DATA  —",
    credits: [
      { role: "Creative Direction", names: "Clay Boan" },
      { role: "Creative Development", names: "Rob Smittenaar" },
      { role: "Motion Design", names: "Ronald Gijezen" },
      { role: "Digital Design", names: "Robbert Schefman" },
    ],
  },
};

// Map handing /EC/a → /EC/b → /EC/a so the next-project transition cycles.
const NEXT = { a: "b", b: "a" };

export function getECProject(slug) {
  return EC_PROJECTS[slug] || null;
}

export function getNextECProject(slug) {
  const nextSlug = NEXT[slug];
  if (!nextSlug) return null;
  const project = EC_PROJECTS[nextSlug];
  if (!project) return null;
  return {
    slug: nextSlug,
    name: project.name,
    subtitle: project.subtitle,
    hero: project.hero,
    href: `/EC/${nextSlug}`,
  };
}

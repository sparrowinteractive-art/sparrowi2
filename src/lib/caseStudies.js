// Case-study registry. Each entry powers /case-studies/[slug] via the
// CaseStudyPage template. Fields mirror the Exo Ape /work/* layout we
// recreate (hero → intro/meta → parallax full-bleed → two-col → sticky
// pin → mosaic → wide image → quote → marquee → credits → next-project).
//
// Image URLs use seeded picsum placeholders so each section feels
// project-coherent. Replace any `image:` value with a real
// /images/case-studies/... path when assets are ready — no template
// changes required.

const seed = (s, w = 1600, h = 1000) =>
  `https://picsum.photos/seed/${s}/${w}/${h}`;

export const CASE_STUDIES = {
  "m3m-capital": {
    slug: "m3m-capital",
    name: "M3M CAPITAL",
    subtitle: "Experience Centre",
    location: "Gurugram, India",
    year: "2023",
    client: "M3M India",
    industry: "Real Estate",
    roles: ["Spatial Storytelling", "Interactive Design", "Build & Install"],
    services: [
      "Touch-Wall Sales Tools",
      "Curved Theatre Reveal",
      "Smart Scale Model",
      "Concierge Walkthrough Choreography",
    ],
    tags: ["Real Estate", "Luxury", "Interactive"],
    hero: {
      image: seed("m3m-capital-hero", 2000, 1200),
      label: "Case Study /002",
    },
    intro: {
      eyebrow: "The Brief",
      lede:
        "Translate the ambition of a 1.5-million-square-foot luxury address into a 30-minute on-site experience that converts walk-ins into informed buyers.",
      body:
        "We treated the experience centre as a building of its own — programmed with rooms that escalate from quiet curiosity to confident decision. Every surface was wired to do work: walls that reveal, models that respond, theatres that immerse. Nothing was decoration.",
    },
    parallax: [
      { image: seed("m3m-capital-p1", 2000, 1200), alt: "Centre arrival foyer" },
      { image: seed("m3m-capital-p2", 2000, 1200), alt: "Curved screen reveal" },
    ],
    twoCol: {
      eyebrow: "Approach",
      heading: "Architecture as narrative.",
      body:
        "Five rooms, one story. Visitors are walked through a deliberate sequence — heritage, vision, the masterplan, the home, the closing — with each room calibrated to a single emotion. The transitions are as designed as the rooms themselves.",
      image: seed("m3m-capital-twocol", 1400, 1700),
      caption: "Reveal sequence — entry foyer to masterplan room.",
    },
    pin: {
      eyebrow: "Detail",
      heading: "The smart model holds the room together.",
      body:
        "A 14-foot interactive scale model anchors the masterplan room. Touch a tower and its specifications, views and unit availability rise on the wall behind it. The model is the index to the entire centre — every other room is a deeper read of what your hand just landed on.",
      images: [
        seed("m3m-capital-pin-1", 1200, 1500),
        seed("m3m-capital-pin-2", 1200, 1500),
        seed("m3m-capital-pin-3", 1200, 1500),
      ],
    },
    mosaic: [
      { image: seed("m3m-capital-m1", 1200, 1600), span: "tall" },
      { image: seed("m3m-capital-m2", 1400, 900), span: "wide" },
      { image: seed("m3m-capital-m3", 1200, 1200), span: "square" },
      { image: seed("m3m-capital-m4", 1200, 1600), span: "tall" },
    ],
    wide: {
      image: seed("m3m-capital-wide", 2400, 1100),
      caption: "Curved-screen brand reveal — opening sequence.",
    },
    quote: {
      body:
        "The centre doesn’t pitch the project. It choreographs the walk so the project pitches itself.",
      attribution: "Sparrow project lead",
    },
    marquee: "M3M CAPITAL  —  GURUGRAM  —  EST. 2023  —",
    credits: [
      { role: "Strategy & Concept", names: "Sparrow Studio" },
      { role: "Spatial Design", names: "Sparrow Studio" },
      { role: "Interactive Engineering", names: "Sparrow Tech" },
      { role: "Audio Visual", names: "In-house, with partners" },
      { role: "Build & Install", names: "Sparrow Production" },
    ],
  },

  "42-chowringhee-lane": {
    slug: "42-chowringhee-lane",
    name: "The 42",
    subtitle: "Chowringhee Lane",
    location: "Kolkata, India",
    year: "2022",
    client: "Mani Group",
    industry: "Luxury Residential",
    roles: ["Narrative Design", "Touch Interface", "Theatre Design"],
    services: [
      "Touch Wall",
      "3-Sided Theatre",
      "Smart Scale Model",
      "Tablet-led Walkthrough",
    ],
    tags: ["Luxury", "Heritage", "Skyline"],
    hero: {
      image: seed("the-42-hero", 2000, 1200),
      label: "Case Study /003",
    },
    intro: {
      eyebrow: "The Brief",
      lede:
        "Tell the story of Kolkata’s tallest residence in a way that earns the city’s respect, not just its attention.",
      body:
        "The 42 needed an experience as considered as the building. We built a centre that lets the city walk in first — and the tower follow.",
    },
    parallax: [
      { image: seed("the-42-p1", 2000, 1200), alt: "Skyline reveal" },
      { image: seed("the-42-p2", 2000, 1200), alt: "Heritage motif wall" },
    ],
    twoCol: {
      eyebrow: "Approach",
      heading: "City first, tower second.",
      body:
        "We open with Kolkata — sights, sounds, the line of the river — and let The 42 emerge as the city’s next exclamation, not its replacement.",
      image: seed("the-42-twocol", 1400, 1700),
      caption: "Heritage gallery into skyline reveal.",
    },
    pin: {
      eyebrow: "Detail",
      heading: "A skyline that listens.",
      body:
        "An 18-foot reactive skyline reacts to the visitor’s position — the closer you stand, the more the tower’s storey-level data steps forward.",
      images: [
        seed("the-42-pin-1", 1200, 1500),
        seed("the-42-pin-2", 1200, 1500),
        seed("the-42-pin-3", 1200, 1500),
      ],
    },
    mosaic: [
      { image: seed("the-42-m1", 1200, 1600), span: "tall" },
      { image: seed("the-42-m2", 1400, 900), span: "wide" },
      { image: seed("the-42-m3", 1200, 1200), span: "square" },
      { image: seed("the-42-m4", 1200, 1600), span: "tall" },
    ],
    wide: {
      image: seed("the-42-wide", 2400, 1100),
      caption: "Three-sided theatre opening sequence.",
    },
    quote: {
      body:
        "It is not a sales gallery. It is a love letter to Kolkata that happens to live inside The 42.",
      attribution: "Sparrow project lead",
    },
    marquee: "THE 42  —  KOLKATA  —  EST. 2022  —",
    credits: [
      { role: "Strategy & Concept", names: "Sparrow Studio" },
      { role: "Spatial Design", names: "Sparrow Studio" },
      { role: "Interactive Engineering", names: "Sparrow Tech" },
      { role: "Audio Visual", names: "In-house, with partners" },
      { role: "Build & Install", names: "Sparrow Production" },
    ],
  },

  "emami-nature": {
    slug: "emami-nature",
    name: "EMAMI",
    subtitle: "Nature",
    location: "Kolkata, India",
    year: "2022",
    client: "Emami Realty",
    industry: "Residential",
    roles: ["Concept", "Spatial Design", "Interactive"],
    services: ["E-Brochure", "Curved Theatre", "Touch Surfaces"],
    tags: ["Nature", "Residential", "Sustainability"],
    hero: { image: seed("emami-nature-hero", 2000, 1200), label: "Case Study /004" },
    intro: {
      eyebrow: "The Brief",
      lede: "Make a forested promise tangible inside a city sales gallery.",
      body:
        "We designed a centre that smells, sounds and feels like the project — so buyers left with a body memory, not just a brochure.",
    },
    parallax: [
      { image: seed("emami-nature-p1", 2000, 1200), alt: "Forest gallery" },
      { image: seed("emami-nature-p2", 2000, 1200), alt: "Material wall" },
    ],
    twoCol: {
      eyebrow: "Approach",
      heading: "Nature as a measured guest.",
      body:
        "Real moss, recorded birdsong, real timber. The centre is a curated sample of the site — proof, not promise.",
      image: seed("emami-nature-twocol", 1400, 1700),
      caption: "Material wall — moss, timber, brushed brass.",
    },
    pin: {
      eyebrow: "Detail",
      heading: "The forest reveal.",
      body:
        "A four-minute curved-screen reveal moves you from the city street to the project clearing — the room cools, the light shifts, the sound thickens.",
      images: [
        seed("emami-nature-pin-1", 1200, 1500),
        seed("emami-nature-pin-2", 1200, 1500),
        seed("emami-nature-pin-3", 1200, 1500),
      ],
    },
    mosaic: [
      { image: seed("emami-nature-m1", 1200, 1600), span: "tall" },
      { image: seed("emami-nature-m2", 1400, 900), span: "wide" },
      { image: seed("emami-nature-m3", 1200, 1200), span: "square" },
      { image: seed("emami-nature-m4", 1200, 1600), span: "tall" },
    ],
    wide: {
      image: seed("emami-nature-wide", 2400, 1100),
      caption: "Reveal exit — site clearing in projection.",
    },
    quote: {
      body: "The centre doesn’t describe the forest. It briefly is one.",
      attribution: "Sparrow project lead",
    },
    marquee: "EMAMI NATURE  —  KOLKATA  —  EST. 2022  —",
    credits: [
      { role: "Strategy & Concept", names: "Sparrow Studio" },
      { role: "Spatial Design", names: "Sparrow Studio" },
      { role: "Interactive Engineering", names: "Sparrow Tech" },
      { role: "Audio Visual", names: "In-house, with partners" },
      { role: "Build & Install", names: "Sparrow Production" },
    ],
  },

  "mahindra-experience-centre": {
    slug: "mahindra-experience-centre",
    name: "MAHINDRA",
    subtitle: "Experience Centre",
    location: "Mumbai, India",
    year: "2023",
    client: "Mahindra Lifespaces",
    industry: "Residential",
    roles: ["Spatial Design", "Interactive", "Walkthrough"],
    services: ["Touch Wall", "Smart Model", "Curved Theatre"],
    tags: ["Mumbai", "Residential", "Tech-led"],
    hero: { image: seed("mahindra-ec-hero", 2000, 1200), label: "Case Study /005" },
    intro: {
      eyebrow: "The Brief",
      lede:
        "Express Mahindra’s engineering rigour through a sales experience that feels assembled, not staged.",
      body:
        "We treated the centre like a product showroom for a building — every interaction precise, every detail considered.",
    },
    parallax: [
      { image: seed("mahindra-ec-p1", 2000, 1200), alt: "Engineered surfaces" },
      { image: seed("mahindra-ec-p2", 2000, 1200), alt: "Tower reveal" },
    ],
    twoCol: {
      eyebrow: "Approach",
      heading: "Engineered to be read.",
      body:
        "Visitors walk a sequence that mirrors how the building was designed — site, system, suite — each room a deeper section through the same idea.",
      image: seed("mahindra-ec-twocol", 1400, 1700),
      caption: "Engineering wall — site to suite.",
    },
    pin: {
      eyebrow: "Detail",
      heading: "Touch the system.",
      body:
        "A central interactive table lets buyers compare units across orientation, view and price, then route a single chosen unit to the curved theatre for a final reveal.",
      images: [
        seed("mahindra-ec-pin-1", 1200, 1500),
        seed("mahindra-ec-pin-2", 1200, 1500),
        seed("mahindra-ec-pin-3", 1200, 1500),
      ],
    },
    mosaic: [
      { image: seed("mahindra-ec-m1", 1200, 1600), span: "tall" },
      { image: seed("mahindra-ec-m2", 1400, 900), span: "wide" },
      { image: seed("mahindra-ec-m3", 1200, 1200), span: "square" },
      { image: seed("mahindra-ec-m4", 1200, 1600), span: "tall" },
    ],
    wide: {
      image: seed("mahindra-ec-wide", 2400, 1100),
      caption: "Final theatre — chosen-unit reveal.",
    },
    quote: {
      body:
        "Every interaction is a small assurance — an engineering tell that the building behind it is just as considered.",
      attribution: "Sparrow project lead",
    },
    marquee: "MAHINDRA  —  MUMBAI  —  EST. 2023  —",
    credits: [
      { role: "Strategy & Concept", names: "Sparrow Studio" },
      { role: "Spatial Design", names: "Sparrow Studio" },
      { role: "Interactive Engineering", names: "Sparrow Tech" },
      { role: "Audio Visual", names: "In-house, with partners" },
      { role: "Build & Install", names: "Sparrow Production" },
    ],
  },

  "ambuja-neotia": {
    slug: "ambuja-neotia",
    name: "AMBUJA NEOTIA",
    subtitle: "Brand Centre",
    location: "Kolkata, India",
    year: "2024",
    client: "Ambuja Neotia Group",
    industry: "Diversified",
    roles: ["Brand Strategy", "Spatial Design", "Interactive"],
    services: ["Brand Wall", "Touch Tables", "Immersive Theatre"],
    tags: ["Brand", "Diversified", "Heritage"],
    hero: { image: seed("ambuja-neotia-hero", 2000, 1200), label: "Case Study /006" },
    intro: {
      eyebrow: "The Brief",
      lede:
        "House a multi-decade, multi-sector group story under one roof — without choosing one chapter over the others.",
      body:
        "We designed a brand centre that lets each business breathe individually while folding back into a single, recognisable house style.",
    },
    parallax: [
      { image: seed("ambuja-neotia-p1", 2000, 1200), alt: "Brand wall" },
      { image: seed("ambuja-neotia-p2", 2000, 1200), alt: "Sectoral rooms" },
    ],
    twoCol: {
      eyebrow: "Approach",
      heading: "One house, many wings.",
      body:
        "A central spine threads the visitor past five sector wings — hospitality, healthcare, real estate, education, agriculture — with the brand language switching tone but not voice as you move.",
      image: seed("ambuja-neotia-twocol", 1400, 1700),
      caption: "Central spine into hospitality wing.",
    },
    pin: {
      eyebrow: "Detail",
      heading: "The house ledger.",
      body:
        "A 24-foot interactive timeline runs the length of the centre. Touch any year and the surrounding rooms recompose to show what the group looked like at that moment.",
      images: [
        seed("ambuja-neotia-pin-1", 1200, 1500),
        seed("ambuja-neotia-pin-2", 1200, 1500),
        seed("ambuja-neotia-pin-3", 1200, 1500),
      ],
    },
    mosaic: [
      { image: seed("ambuja-neotia-m1", 1200, 1600), span: "tall" },
      { image: seed("ambuja-neotia-m2", 1400, 900), span: "wide" },
      { image: seed("ambuja-neotia-m3", 1200, 1200), span: "square" },
      { image: seed("ambuja-neotia-m4", 1200, 1600), span: "tall" },
    ],
    wide: {
      image: seed("ambuja-neotia-wide", 2400, 1100),
      caption: "Immersive theatre — group film.",
    },
    quote: {
      body:
        "It is not a museum and it is not a sales gallery. It is the group standing up to introduce itself.",
      attribution: "Sparrow project lead",
    },
    marquee: "AMBUJA NEOTIA  —  KOLKATA  —  EST. 2024  —",
    credits: [
      { role: "Strategy & Concept", names: "Sparrow Studio" },
      { role: "Spatial Design", names: "Sparrow Studio" },
      { role: "Interactive Engineering", names: "Sparrow Tech" },
      { role: "Audio Visual", names: "In-house, with partners" },
      { role: "Build & Install", names: "Sparrow Production" },
    ],
  },
};

// Order is the navigable sequence used by the "Next project" link at the
// bottom of each case study. Wraps from the last back to the first.
export const CASE_ORDER = [
  "m3m-capital",
  "42-chowringhee-lane",
  "emami-nature",
  "mahindra-experience-centre",
  "ambuja-neotia",
];

export function getCaseStudy(slug) {
  return CASE_STUDIES[slug] || null;
}

export function getNextCaseStudy(slug) {
  const i = CASE_ORDER.indexOf(slug);
  if (i === -1) return null;
  const nextSlug = CASE_ORDER[(i + 1) % CASE_ORDER.length];
  return CASE_STUDIES[nextSlug];
}

export function listCaseStudySlugs() {
  return CASE_ORDER;
}

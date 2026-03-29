# James Wang — Portfolio Website Design Document

## Overview

A React-based portfolio website for James Wang — jazz saxophonist, music technology researcher, audio engineer, and developer. The site features four distinct experiences: a clean self-intro landing page, a vintage vinyl record listening room, a futuristic coding showcase, and an interactive career timeline.

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | React + Vite | Fast builds, modern DX, great plugin ecosystem |
| Styling | Tailwind CSS | Utility-first, clean Apple aesthetic, no fighting component libs |
| Page Animations | Framer Motion | Scroll-triggered reveals, page transitions, spring physics |
| Complex Animations | GSAP + ScrollTrigger | Matrix rain effect, timeline sequences, parallax |
| Audio Playback | Howler.js or Tone.js | Robust audio control, Web Audio API integration |
| Waveform Display | Wavesurfer.js | Visual waveform rendering for music player |
| 3D (optional) | React Three Fiber | If 3D elements are desired on landing page |
| Routing | React Router | Multi-page SPA navigation |

---

## Pages

### 1. Main / Landing Page

**Vibe:** Clean, elegant self-introduction — first impression, who James is, and how to navigate the portfolio.

**Key Elements:**
- Full-viewport hero with name, tagline ("Jazz Saxophonist / Music Tech Researcher / Audio Engineer / Developer")
- Brief self-introduction paragraph (carried from v1, refined)
- Three portal cards linking to the other pages:
  - Music — vinyl record icon, warm tones
  - Code — circuit/matrix icon, neon glow
  - Timeline — clock/path icon, clean lines
- Contact section with social links (GitHub, LinkedIn, Instagram, Email)
- CV/Resume download button
- Scroll-triggered fade-in animations (Framer Motion)

**Color Palette:** Clean dark or neutral — elegant, not competing with the themed pages.

**Inspiration:** Minimal personal sites, Apple "about" pages, clean typography-driven design.

---

### 2. Music Page

**Vibe:** Vintage vinyl listening room — each song is a physical record you drag onto a turntable. All analog, all warm.

**Key Elements:**
- **Turntable** centered on the page — a detailed vinyl player with spinning platter, tonearm
- **Record crate / shelf** on the side — each song displayed as a vinyl record with album art as the label
- **Drag-to-play interaction** — user drags a record from the crate onto the turntable to start playing
- **Spinning vinyl animation** — record spins when playing, stops when paused
- **Tonearm animation** — moves onto the record when playing, lifts when paused/stopped
- **VU meter** — real-time audio level visualization (carried from v1, upgraded)
- **Rotary knobs** — volume and tone controls (carried from v1)
- Warm color palette: beige, tan, amber, cream (#f4e8d1 family)
- Subtle textures evoking wood grain, leather, brushed metal
- Dim ambient lighting feel — like a cozy listening room

**Audio Assets:**
- 555.wav (48kHz, 24-bit stereo) — currently available
- Additional tracks TBD

**Albums & Recording Credits (from CV):**

| # | Project | Role | Year |
|---|---|---|---|
| 1 | **Senior Comprehensive Project Album** | Player, Recording/Mixing/Mastering Engineer | 2024 |
| 2 | **Occidental College Chamber Jazz Album 2024** | Player, Recording/Mixing/Mastering Engineer | 2024 |
| 3 | **Occidental College Chamber Jazz Album 2023** | Player, Recording/Mixing/Mastering Engineer | 2023 |
| 4 | **Berret Yuffee's EP** (3 songs) | Vocal/Guitar Recording, Mix/Master | 2024 |
| 5 | **Occidental Music YouTube Channel** | Audio/Visual Editor, 15 performances | 2022 |

**Live Performance History:**
- Bowers Museum — tenor saxophone & electronics (2024)
- Occidental Jazz Ensemble — tenor sax, 10 performances (2023–2025)
- Occidental Chamber Jazz — alto sax, 20 performances (2021–2025)
- Occidental Symphony Orchestra — tuba, 6 performances (2021–2023)
- Chouby (rock band) — guitar & drums, 4 performances (2021–2023)

**Instruments:** Saxophone (10+ years), Guitar, Piano, Tuba, Drums

**Interactions:**
- Drag record from crate → drop onto turntable → music plays
- Click record in crate to preview info (title, album, year)
- Turntable: click platter to pause/resume (vinyl stops/starts spinning)
- Tonearm: drag to scrub through the track
- Rotary knobs for volume and tone
- Keyboard shortcuts (space = play/pause, arrows = prev/next record)

---

### 3. Coding Page

**Vibe:** Futuristic / sci-fi command center — Matrix rain meets holographic UI. Dark, neon, high-tech.

**Key Elements:**
- Full-screen Matrix rain background (Canvas + GSAP)
  - Green falling characters (katakana, digits, symbols)
  - Variable speed, brightness, and trail length
- Project cards as **holographic floating panels** with:
  - Neon border glow (cyan/green)
  - Glassmorphism / frosted glass backdrop
  - Glitch effect on hover
  - Project name, one-line description, tech stack tags, GitHub link
  - Subtle scanline overlay texture
- HUD-style section header with typing animation ("// PROJECTS_")
- Floating particle grid or wireframe mesh in background (subtle)
- Dark theme: black (#0a0a0a) background, matrix green (#00ff41) + cyan (#00f0ff) accents
- Terminal-style monospace typography
- Animated circuit-board or data-flow lines connecting project cards

**Projects (from CV):**

| # | Project | Tags | Period |
|---|---|---|---|
| 1 | **Optical Music Recognition for Jazz Lead Sheet** — Extending Sheet Music Transformer to jazz lead sheets using curriculum learning on JazzMus dataset | Deep Learning, OMR, Transformers, Python | Aug 2025 – present |
| 2 | **Audio-to-Audio Patterns for Prediction** — End-to-end music continuation system using variable-order HMMs over clustered audio features (MIREX task) | Audio ML, HMM, DSP, Python | Sep – Dec 2025 |
| 3 | **Deep Salient Detection for F0 Estimation** — Pitch tracking via HCQT + fully convolutional CNN, compared with ResNet18 transfer learning | Deep Learning, CNN, MIR, Python | Sep – Dec 2025 |
| 4 | **Rock Harmony Evolution (Music Thesis)** — Computational musicology study of 890 rock songs using Shannon entropy as harmonic complexity metric | Computational Musicology, Python, Data Analysis | Jun – Dec 2024 |
| 5 | **Reference-free Audio Stem Separation Metrics (CS Thesis)** — Novel FIS and DSS metrics for evaluating stem separation without ground truth | Audio DSP, Python, Evaluation Metrics | Jun – Dec 2024 |
| 6 | **GEMS — Gesture Ensemble Music System** — Gesture-controlled human–machine improvisation system with MediaPipe pose tracking + Max/MSP | Max/MSP, MediaPipe, UDP, Real-time | Feb 2024 – present |
| 7 | **VIVO — Video Interactive VST Orchestra** — AI Orchestra, real-time VST parameter prediction, sound recognition using Hierarchical HMM in Max/MSP | Max/MSP, HMM, JavaScript, EU Horizon Grant | Aug 2021 – Dec 2024 |
| 8 | **VST Plug-in Development** — Vocal chain processor (EQ, compressor, gate, de-esser) built with JUCE/C++ | C++, JUCE, DSP, UI Design | Jun – Aug 2023 |
| 9 | **Music Genre Recognition** — Compared SVM, Random Forest, Stack Ensemble, MLP on 6000 openSMILE features from GTZAN dataset (89% accuracy) | Machine Learning, Python, openSMILE | Sep – Dec 2023 |
| 10 | **Audio Interface Design (Huaxin Musical Instrument)** — Designed UI + product specs for a live streaming/recording audio interface | Blender, Hardware Design, Product Specs | Jun – Aug 2024 |
| 11 | **Category Theory & Neural Networks** — Explored intersection of category theory, operads, and CNN dimensions | Python, Math Research | Nov 2021 – May 2022 |

**Interactions:**
- Matrix rain responds to mouse movement (repel/attract characters)
- Cards fade in with staggered animation on scroll
- Hover on card pauses nearby rain columns for readability
- Click-through to GitHub repos or live demos

---

### 4. Timeline / Experience Page

**Vibe:** Clean, interactive vertical timeline — scroll through career milestones chronologically.

**Key Elements:**
- Vertical timeline line down the center of the page
- Alternating left/right cards for each milestone
- Cards expand on click/hover to reveal details
- Category color-coding:
  - Blue — Education (Georgia Tech, Occidental)
  - Green — Research (OMR, VIVO, theses, MIREX)
  - Purple — Music Software Dev (GEMS, VST plugin, audio interface)
  - Orange — Music (albums, performances, studio work)
  - Gray — Industry (E&Y, Lombarda, Leizhi, Kingsize Soundlabs)
- Scroll-triggered animations: cards slide in from left/right as user scrolls
- Year markers along the timeline
- Filter buttons at top to show/hide categories

**Timeline Entries (chronological):**

| Year | Category | Entry |
|---|---|---|
| 2020 | Education | Started at Occidental College — B.A. Music + B.A. Computer Science |
| 2021 | Industry | Music Production Intern, Jiali Music Studio, Shanghai |
| 2021 | Industry | Finance Intern, Lombarda China Fund Management |
| 2021 | Industry | Consultant Intern, Ernst & Young, Shanghai |
| 2021 | Research | VIVO Research Assistant begins (EU Horizon Grant) |
| 2021 | Music | Joined Occidental Chamber Jazz — alto saxophone |
| 2021 | Music | Joined Occidental Symphony Orchestra — tuba |
| 2022 | Research | Category Theory & Neural Networks research |
| 2022 | Research | VIVO Use Case Study → presented at Mellon Conference |
| 2022 | Music | Occidental Music YouTube Channel — edited 15 performances |
| 2022 | Music Software | Started Production Manager role, Occidental Music Dept |
| 2023 | Research | Cinematic Pedal in Rock/Pop Music — Summer Research Program |
| 2023 | Music Software | VST Plug-in Development (JUCE, vocal chain processor) |
| 2023 | Research | Music Genre Recognition — ML comparison study |
| 2023 | Industry | Recording Intern, Kingsize Soundlabs (Lyla Forde, Julius Rodriguez, etc.) |
| 2023 | Music | Occidental Chamber Jazz Album 2023 — 10 songs |
| 2023 | Music Software | Studio Assistant, Occidental Choi Studio ($60K+ inventory) |
| 2024 | Research | Senior Thesis (Music): Rock Harmony Evolution — Shannon Entropy |
| 2024 | Research | Senior Thesis (CS): Reference-free Stem Separation Metrics |
| 2024 | Music Software | GEMS — Gesture Ensemble Music System |
| 2024 | Music | Senior Comprehensive Project Album — 11 songs |
| 2024 | Music | Occidental Chamber Jazz Album 2024 — 11 songs |
| 2024 | Music | Bowers Museum performance — tenor sax & electronics |
| 2024 | Industry | Data Science Intern, Leizhi IT, Shanghai |
| 2024 | Music Software | Audio Interface Designer, Huaxin Musical Instrument |
| 2025 | Education | M.S. Music Technology at Georgia Tech begins |
| 2025 | Research | Optical Music Recognition for Jazz Lead Sheet |
| 2025 | Research | Audio-to-Audio Patterns for Prediction (MIREX) |
| 2025 | Research | Deep Salient Detection for F0 Estimation |
| 2025 | Research | "Harmonic Divorce or Not?" published in Music Theory Online |

**Interactions:**
- Scroll to animate cards sliding in
- Click card to expand details
- Filter by category (Education, Research, Music Software, Music, Industry)
- Hover shows brief tooltip
- Smooth scroll-snap to year markers

---

## Shared Components

| Component | Description |
|---|---|
| Navbar | Minimal top nav, transparent over hero, solid on scroll. Links: Home, Music, Code, Timeline, CV |
| Page Transitions | Framer Motion AnimatePresence — smooth fade/slide between pages |
| Footer | Contact info, social links (GitHub, LinkedIn, Instagram, Email) |
| Loading Screen | Brief animated intro on first visit |
| Cursor | Optional custom cursor (subtle glow or crosshair) |

---

## Color Systems

| Page | Background | Primary | Accent | Text |
|---|---|---|---|---|
| Landing | #0a0a0a (dark) | #ffffff (white) | #888888 (gray) | #ffffff / #aaaaaa |
| Music | #1a1410 (dark wood) | #c4a265 (warm gold) | #c70000 (red VU peak) | #f4e8d1 (cream) |
| Coding | #0a0a0a (near black) | #00ff41 (matrix green) | #00f0ff (cyan) | #e0e0e0 |
| Timeline | #0f0f0f (dark) | #ffffff (white) | Category colors (blue/green/purple/orange/gray) | #e0e0e0 |

---

## Typography

| Use | Font | Fallback |
|---|---|---|
| Headings (Landing) | SF Pro Display or Inter | system-ui, sans-serif |
| Body | Space Grotesk (carried from v1) | sans-serif |
| Code/Terminal | JetBrains Mono or Fira Code | monospace |

---

## Responsive Strategy

- Mobile-first design
- Landing page: stacked sections, reduced parallax on mobile
- Music page: full-width player, simplified waveform
- Coding page: Matrix rain still runs (reduced density), cards stack vertically
- Breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)

---

## File Structure (Planned)

```
src/
├── main.jsx
├── App.jsx
├── index.css                       # Tailwind base + global styles
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   └── PageTransition.jsx
├── pages/
│   ├── Landing/
│   │   ├── Landing.jsx             # Main landing page
│   │   ├── HeroSection.jsx         # Name, tagline, intro
│   │   ├── PortalCards.jsx         # Three cards linking to Music/Code/Timeline
│   │   └── ContactSection.jsx      # Social links, email, CV download
│   ├── Music/
│   │   ├── Music.jsx               # Music page container
│   │   ├── Turntable.jsx           # Vinyl turntable with spinning platter + tonearm
│   │   ├── RecordCrate.jsx         # Collection of draggable vinyl records
│   │   ├── VinylRecord.jsx         # Individual draggable record component
│   │   ├── VUMeter.jsx             # Real-time audio VU meter
│   │   └── Knob.jsx                # Rotary control knob (volume, tone)
│   ├── Coding/
│   │   ├── Coding.jsx              # Coding page container
│   │   ├── MatrixRain.jsx          # Canvas-based falling characters
│   │   └── ProjectCard.jsx         # Holographic glassmorphism project card
│   └── Timeline/
│       ├── Timeline.jsx            # Timeline page container
│       ├── TimelineTrack.jsx       # Vertical line + year markers
│       ├── TimelineCard.jsx        # Individual milestone card
│       └── CategoryFilter.jsx      # Filter buttons for categories
├── hooks/
│   ├── useAudioPlayer.js           # Audio playback control hook
│   └── useDragAndDrop.js           # Drag-and-drop hook for vinyl records
├── assets/
│   ├── audio/
│   │   └── 555.wav
│   ├── images/
│   └── fonts/
└── data/
    ├── tracks.js                   # Music tracks metadata
    ├── projects.js                 # Coding projects data
    └── timeline.js                 # Timeline entries data
```

---

## Open Questions

- [ ] Music content: additional tracks/albums beyond 555.wav? Album art images?
- [ ] Coding projects: need GitHub repo URLs for each project card link
- [ ] Custom domain / hosting preference?
- [ ] Profile photo or avatar for the landing page hero?
- [ ] Any specific album art or images for the vinyl record labels?

---

## Current Assets (from v1)

- `555.wav` — 48kHz/24-bit stereo audio track
- `WANG, Jiayi CV Master.pdf` — 5-page CV
- VU meter + knob interaction code (reusable for music page)
- Social links: GitHub, LinkedIn, Instagram, Email

---

*Last updated: 2026-03-26*

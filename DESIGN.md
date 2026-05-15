---
name: James Wang Portfolio
description: Personal site for a jazz saxophonist, music technology researcher, audio engineer, and developer. Two rooms in one analog workshop.
colors:
  cream-base: "#f4e8d1"
  cream-deep: "#efe3c9"
  cream-shadow: "#e8dcc8"
  cream-light: "#fdf7e3"
  linen-band: "#c4b69c"
  brass-gold: "#c4a265"
  ink-deep: "#2d2d2d"
  walnut: "#4a3f35"
  aged-bronze: "#6c5c3b"
  espresso: "#1a1410"
  walnut-wood: "#2a1f15"
  parchment: "#f4e8d1"
  vu-red: "#c70000"
  ink-night: "#0f0f0f"
  carbon: "#1a1a1a"
  cobalt-edu: "#3b82f6"
  moss-research: "#22c55e"
  orchid-music-sw: "#a855f7"
  ember-music: "#f97316"
  slate-industry: "#6b7280"
typography:
  display:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "clamp(3rem, 6vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  label:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.1em"
  mono:
    fontFamily: "JetBrains Mono, Fira Code, monospace"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  xxl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.walnut}"
    textColor: "{colors.cream-base}"
    rounded: "{rounded.pill}"
    padding: "10px 24px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.ink-deep}"
    textColor: "{colors.cream-base}"
  button-ghost:
    backgroundColor: "#ffffff80"
    textColor: "{colors.walnut}"
    rounded: "{rounded.pill}"
    padding: "10px 24px"
  button-ghost-hover:
    backgroundColor: "#ffffffb3"
    textColor: "{colors.walnut}"
  nav-pill:
    backgroundColor: "transparent"
    textColor: "{colors.aged-bronze}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
  nav-pill-active:
    backgroundColor: "#2d2d2d14"
    textColor: "{colors.ink-deep}"
  project-card:
    backgroundColor: "{colors.cream-shadow}"
    textColor: "{colors.ink-deep}"
    rounded: "{rounded.lg}"
    padding: "0px"
  project-card-hover:
    backgroundColor: "{colors.linen-band}"
    textColor: "{colors.ink-deep}"
  timeline-card:
    backgroundColor: "transparent"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "20px"
  tag-chip:
    backgroundColor: "#c4b69c33"
    textColor: "{colors.walnut}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
    typography: "{typography.label}"
---

# Design System: James Wang Portfolio

## 1. Overview

**Creative North Star: "The Analog Workshop"**

This is the personal site of someone who builds with their hands and their ears. Tape reels, vinyl grooves, brass knobs, VU needles, the warm shadow of an evening studio: the chrome of the site references the actual instruments of audio work. The site has two committed rooms. The Landing, Timeline, and Project pages all share the front parlor at golden hour, dressed in cream and amber, where guests arrive and read. The Music room is the listening lounge: dim espresso wood, brass-gold gleams, a working turntable. Same craftsperson, two rooms, one continuous mood.

The system is not maximalist. Each room is committed to its palette and stays there. Motion is patient (long ambient orbs, slow vinyl rotation, deliberate scroll reveals); never frenetic. Type is one warm geometric sans (Space Grotesk) carrying both the parlor copy and the listening-room labels, so the rooms read as the same author. Hierarchy is built through scale and weight, not color or chrome. Restraint is the proof of skill.

What the system rejects, named in PRODUCT.md and reaffirmed here: generic-dev-portfolio dark mode with neon-green accents and identical project-card grids; SaaS landing-page templates with three feature columns and a pricing strip; awwwards-showreel scroll-jacking with autoplay audio and heavy WebGL; and academic-CV-as-website plain-HTML lists with no personality. None of these. If the visitor could guess "music tech grad student" from the chrome alone, the site has failed.

**Key Characteristics:**
- Two committed palettes (Cream Parlor, Espresso Lounge) bound by one warm thread: brass-gold (`#c4a265`).
- One typeface across the entire site (Space Grotesk), with JetBrains Mono reserved for keyboard hints and percentages.
- Tonally layered surfaces; shadows are ambient glow, not structural lift.
- Generous whitespace, calm motion, no glassmorphism.
- One conversion event throughout (Download CV); the rest of the site earns the click.

## 2. Colors

The palette is three warm-room committed schemes, joined by a single brass thread that carries from the parlor doorbell through the listening-room turntable.

### Primary
- **Brass Gold** (`#c4a265` / oklch(72.5% 0.084 75)): the one warm thread. Buttons, dividers, gold gleams on the turntable, kbd hint borders, profile-photo halo, "playing" indicators. Appears in both Landing and Music rooms; this is what makes the rooms feel like one workshop. Rare on Timeline by design.

### Secondary
- **Cream Parlor** (`#f4e8d1` / oklch(93.5% 0.034 88)): the background of Landing, Timeline, and Project pages. Aged paper, warm sunlight on plaster. Also serves as the cream text color on dark pages (token: `parchment`).
- **Espresso Lounge** (`#1a1410` / oklch(15.5% 0.014 50)): the Music room background. Coffee-soaked wood, dim and inviting. Dark but never neutral; tinted toward the brass.

### Tertiary (Timeline category lights)

The Timeline uses four category accents as quiet "category dots" on the parallel-tracks chart. Their saturation is deliberate; never decorative. They sit on the cream parlor surface, not on ink.
- **Moss** (`#22c55e`): Research.
- **Orchid** (`#a855f7`): Music Software.
- **Ember** (`#f97316`): Music.
- **Slate** (`#6b7280`): Industry.

### Neutral
- **Cream Deep** (`#efe3c9`): Landing gradient mid-step; aged-paper variation.
- **Cream Shadow** (`#e8dcc8`): Project-card resting surface on Landing. The "card paper" tone, slightly older than the parlor wall.
- **Cream Light** (`#fdf7e3`): the lightest cream. Knob faces, description cards, hover-paper surfaces.
- **Linen Band** (`#c4b69c`): chrome on Landing (navbar, footer, nav-pill hover bg). The linen runner across the parlor furniture.
- **Walnut Wood** (`#2a1f15`): turntable and record-crate frame. Slightly lighter than espresso so containers read as wood on coffee.
- **Carbon** (`#1a1a1a`): chrome on themed pages (navbar, footer). The dark equivalent of linen-band.
- **Ink Deep** (`#2d2d2d`): primary text on cream surfaces. Never `#000`.
- **Walnut** (`#4a3f35`): body text on cream surfaces. Warm, ink on paper.
- **Aged Bronze** (`#6c5c3b`): secondary text and labels on cream. The patina layer.

### Named Rules

**The Brass Thread Rule.** Brass-gold (`#c4a265`) appears on every page that wants to read as the workshop. On cream surfaces (Landing, Timeline, Project pages) it shows up as the 96px hairline rule under the editorial header, focus rings, and the GitHub/paper badges in the meta row. On the Music page it gleams on the play button, the turntable label, and the volume knob highlight. Use brass-gold on ≤8% of any single screen. Its rarity is what makes it precious.

**The No-Pure-Black, No-Pure-White Rule.** `#000` and `#ffffff` are forbidden as raw values. The dark rooms use ink-night (`#0f0f0f`), espresso (`#1a1410`), or carbon (`#1a1a1a`). The bright surfaces use cream-base (`#f4e8d1`) or cream-light (`#fdf7e3`). When a "white" is needed (pill button text, mobile menu surface), tint warm: rgba 255 / 250 / 240, or oklch(98% 0.01 85). The Tailwind `text-white` utility on themed pages is acceptable contextually but should be revisited if it ever leaks onto a cream surface.

**The Two-Room Commitment Rule.** Each room commits to its palette. Cream surfaces (Landing, Timeline, Project pages) hold a single mood across the long-form scroll. The Music room owns espresso wood and turntable shadow and does not leak elsewhere. The brass thread is the only color that crosses rooms.

## 3. Typography

**Display Font:** Space Grotesk (with system-ui, sans-serif fallback) — single typeface for everything.
**Body Font:** Space Grotesk, same family.
**Label/Mono Font:** JetBrains Mono (with Fira Code, monospace fallback) — for keyboard hints, progress percentages, and the occasional technical label.

**Character:** Space Grotesk is geometric without being cold; its slightly humanist vowels keep the warmth alive on the cream Landing while still feeling at home in the dark Music and Timeline rooms. One typeface across the whole site is intentional: it is the thread that proves "same author."

### Hierarchy
- **Display** (700, clamp(3rem, 6vw, 4.5rem), line-height 1.05, tracking -0.02em): hero name only. One per page max.
- **Headline** (700, clamp(2rem, 4vw, 3rem), 1.1, tracking -0.015em): page H1 ("Vinyl Listening Room", "Journey Through Time", project hero title).
- **Title** (600, 1.125rem, 1.3): card titles, section labels with body weight ("Record Collection", "Get in Touch").
- **Body** (400, 1rem, 1.65): paragraph copy. Cap line length at 65–75ch on long-form descriptions.
- **Label** (600, 0.75rem, 1.2, tracking 0.1em, uppercase): meta labels ("PROJECTS BELOW", "Technologies", "Period", "Category"). Use sparingly; uppercase tracks attention quickly and tires fast.
- **Mono** (500, 0.875rem, JetBrains Mono): keyboard hints (`Space`), percentages, file extensions, anything where the "this is technical" cue helps. Never as decoration.

### Named Rules

**The One Voice Rule.** Space Grotesk is the only sans-serif on the site. Do not introduce a second display face for drama; weight and size are sufficient hierarchy. JetBrains Mono is reserved for genuinely technical content (kbd, percentages, code-like values), not as a vibe.

**The Tracking Rule.** Display and Headline are tracked tight (negative letter-spacing) for editorial confidence. Body is tracked normal. Labels are tracked wide (0.1em) only when uppercase. Mixing these breaks the music.

## 4. Elevation

The system is tonally layered with low ambient shadows. Surfaces stack via tinted backgrounds (cream over cream, walnut-wood over espresso) more than via cast shadows. Shadows, when present, are soft and ambient: the brass halo around the profile photo, the gold glow under the play button, the diffuse amber orbs behind the hero. They serve atmosphere, not structural lift.

The Music room is the one place where shadow turns up: turntable and crate use `shadow-2xl` to read as physical objects on a wood surface. That is appropriate to the metaphor. It does not generalize to the rest of the site.

### Shadow Vocabulary
- **Ambient halo** (`box-shadow: 0 8px 24px rgba(196, 162, 101, 0.30)`): warm gold glow under brass-gold elements (profile photo, play button). Decorative, not structural.
- **Object shadow** (`box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.50)`): Music room only. Turntable and crate. Marks "physical thing on a wood floor."
- **Card lift** (rest `box-shadow: 0 4px 6px rgba(0, 0, 0, 0.10)` → hover `0 20px 25px -5px rgba(0, 0, 0, 0.10)`): Landing project cards. Subtle hover-only deepening.
- **Chrome edge** (`box-shadow: 0 4px 8px rgba(0, 0, 0, 0.10)`): navbar bottom edge; same value inverted on the footer top.

### Named Rules

**The Glow-Not-Lift Rule.** When a surface needs emphasis, prefer ambient warm-tinted glow over hard cast shadow. The play-button gold halo and the profile-photo amber ring are the canonical references. Heavy multi-layer shadows belong only to the Music room's turntable and crate.

**The No-Glassmorphism Rule.** Backdrop-blur appears in the codebase (mobile menu, secondary buttons, ambient orbs); it is acceptable when the layer beneath has visible color or gradient that the blur is genuinely interpreting. It is forbidden as a default cosmetic; never blur over a flat surface for "depth."

## 5. Components

For each component, the character line comes first, then specifics.

### Buttons

The button vocabulary is pill-rounded, generously padded, and quiet. Confidence by craft, not by size or color.

- **Shape:** Pill (`rounded-full`, `9999px`). Square corners are reserved for editorial-feel surfaces (cards, panels), never CTAs.
- **Primary:** Walnut/ink-deep fill on cream surfaces (Tailwind `bg-amber-800` ≈ `#92400e` in code, mapped to the `walnut` token), cream-base text. 24px horizontal padding, 10px vertical. Used for the only conversion-grade action on a screen (Download CV).
- **Hover / Focus:** Background deepens to ink-deep (`#2d2d2d`); 200ms transition; no transform. Focus ring is a 2px brass-gold outline at 80% opacity, offset 2px.
- **Secondary / Ghost:** White at 50% over the cream surface, backdrop-blurred, hairline cream-shadow border (`#e8dcc8`). Walnut text. On hover, opacity rises to 70% and border deepens to brass-gold at 50%. Used for "Listen to my music" and similar non-conversion CTAs.
- **Tertiary (themed pages):** No filled tertiary on dark; use a transparent button with white-at-60% text, white-at-100% on hover.

### Chips / Tags

The chip is the small printed label on a record sleeve. Quiet, type-driven.

- **Style:** Linen-band tinted at 20% (`#c4b69c33`) over cream surfaces; walnut text. 4px vertical, 12px horizontal padding. Pill-rounded. 1px solid linen-band border.
- **State:** No selected state on tag chips (used for static metadata: technologies, periods). For filter chips on Timeline, the inactive state is transparent with category-color text and 30% category-color border; the active state fills the chip with 5% category-color and lifts the border to 50%.

### Cards / Containers

Cards are used deliberately, never reflexively. Each card type has a distinct shape and surface; no generic shadowed-rectangle pattern.

- **Project Card (Landing):** Square `aspect-square`, 16px corner radius (`rounded-2xl`). Cream-shadow background at rest. Hover reveals a linen-band-95% overlay with the title and short description appearing centered. Bottom strip with shortTitle is visible at rest, hides on hover. Internal padding 20px.
- **Timeline Card:** No solid surface at rest, transparent with a 5%-tinted category-color background, 30% category-color border, 12px corner radius. 20px internal padding. Connector dot (12px) sits on the central spine, colored to match. Click expands to reveal description.
- **Turntable / Record Crate (Music):** Walnut-wood-to-espresso vertical gradient, 24px corner radius (`rounded-3xl`), 32px internal padding (24px on the crate). 1px brass-gold-at-15% border. `shadow-2xl` cast shadow. These are the only two cards on the site that are unambiguously physical objects.
- **Project Detail Page:** Cream parlor surface, single-column flow. Top: a small "← All projects" mono link in aged-bronze. Editorial header: mono kicker (`CATEGORY · PERIOD`), Display-grade headline, one-line tagline at body+ size, a 96-px brass-gold hairline, then a meta row of tag chips and outward-link badges (GitHub, paper, poster). Body: an ordered array of typed blocks (`text`, `image`, `audio`) rendered in order, so each figure earns its place next to the paragraph that names it. Text blocks capped at a 46-rem measure; image and audio blocks at 52-rem; both centered inside a 6vw side gutter. Closes with a centered prev / All projects / next nav above the footer.

### Inputs / Fields

The site has no form inputs as of writing. When introduced, follow:

- **Style:** Cream-light fill (`#fdf7e3`), 1px linen-band border (`#c4b69c`), 8px corner radius (`rounded-lg`). 12px vertical, 16px horizontal padding. Walnut text.
- **Focus:** Border shifts to brass-gold (`#c4a265`); 0 0 0 3px brass-gold-at-15% glow ring; no transform.
- **Error / Disabled:** VU-red border for error; cream-shadow fill at 50% opacity for disabled.

### Navigation

The nav is a thin colored band that swaps surface based on context. On Landing, it wears linen (`#c4b69c`) with ink-deep text. On themed pages, it wears carbon (`#1a1a1a`) with white text at 60% opacity rest, 100% active. The brand wordmark stays the same character on both, recolored only.

- **Pill:** Active item gets a soft fill (8% ink-deep on linen; 10% white on carbon) with `framer-motion` `layoutId` carrying the pill smoothly between routes. This shared-layout transition is a signature.
- **Mobile:** Hamburger animates to an X (rotation, no opacity dance). Mobile menu is a near-black overlay (`bg-black/95 backdrop-blur-xl`) with stacked links. Backdrop-blur here is justified by the colored content beneath.
- **Footer:** Same linen-or-carbon swap. Centers four social icons (GitHub, LinkedIn, Google Scholar, Email) with copyright pinned right.

### Signature Component: The Turntable

The turntable is the irreducible piece of the system; it is the moment the visitor most viscerally encounters "audio engineer." Specifications:
- Round platter (gray-800 to black gradient, 6 concentric border-line grooves, center spindle), rotates 360° on a 3-second linear loop while playing, halts when paused.
- Tonearm (gray-500 gradient, ~192px) animates from rest to a -25° rotation plus 40px x-translation when playing; reverses when paused. Spring-free 0.8s ease.
- Brass-gold play/pause button (`#c4a265`) with ambient gold halo when active.
- Volume knob to the left (Knob component, skeuomorphic radial gradient).
- VU meter on the right (animated needle responding to playback).

This component should not be replicated cosmetically elsewhere on the site. It is the headline act of one room.

### Signature Component: The Cassette Loader

The LoadingScreen is the system's overture. Cream-on-amber cassette body, two reels rotating in 2-second linear loops, a brass-gold progress bar moving inside a tape window, ambient floating music notes, an animated waveform of 20 amber bars below status text that cycles through tuning, setting up, sound check, ready. Together these say "you are entering an audio person's site" before a single page paint.

This component is the introduction; do not call it from a sub-page.

## 6. Do's and Don'ts

### Do:
- **Do** commit to one room palette per page. Landing, Timeline, and Project pages wear cream; the Music room wears espresso. Mixing them across rooms breaks the metaphor.
- **Do** use brass-gold (`#c4a265`) as the cross-room thread, on ≤8% of any screen. The rarity is the point.
- **Do** lead with type hierarchy and whitespace. Add chrome (borders, shadows, fills) only when type cannot do the work alone.
- **Do** use Space Grotesk for everything; reach for JetBrains Mono only for technical content (`<kbd>Space</kbd>`, percentages, file paths).
- **Do** render warm ambient glow under brass-gold elements (profile photo halo, play button), not hard cast shadow.
- **Do** keep motion patient: 0.6s page transitions, 8–12s ambient orb cycles, 3s vinyl rotation, 2s cassette reels. Restraint reads as confidence.
- **Do** gate every motion-heavy element on `prefers-reduced-motion: reduce`. The Loading cassette, vinyl spin, ambient orbs, scroll reveals must all collapse to instant non-animated equivalents.
- **Do** keep one Download CV CTA per major surface: hero on Landing, contact section, navbar. Three is the limit.
- **Do** set body line length at 65–75ch on all paragraph copy.

### Don't:
- **Don't** use `#000` or `#ffffff` as raw values. Tint dark to ink-night (`#0f0f0f`), espresso (`#1a1410`), or carbon (`#1a1a1a`); tint white to cream-base (`#f4e8d1`) or cream-light (`#fdf7e3`).
- **Don't** import the Music room's heavy `shadow-2xl` cast shadow into the cream surfaces. That shadow belongs only to the turntable and crate.
- **Don't** ship the generic-dev-portfolio look (PRODUCT.md anti-reference): dark mode plus matrix-green accents, identical six-card grid with stack badges, hero-and-features-and-contact layout. Reads as "first React tutorial." A `/coding` page in this style was previously built and retired; do not re-introduce it.
- **Don't** ship the SaaS-landing template (PRODUCT.md anti-reference): hero plus three feature columns plus testimonials plus pricing strip. This is not a product.
- **Don't** ship the awwwards-showreel failure mode (PRODUCT.md anti-reference): heavy WebGL intro, autoplay audio, scroll-jacking, slow first paint. The Loading cassette is the only "wow" gate; everything past it is calm.
- **Don't** ship the academic-CV-as-website failure mode (PRODUCT.md anti-reference): unstyled HTML lists of publications and dates with no warmth. The PDF CV is the canonical lineage; the site is the personality.
- **Don't** use `border-left` greater than 1px as a colored stripe on cards or callouts. Replace with full borders, leading icons, or background tints.
- **Don't** use `background-clip: text` with a gradient (gradient text). One solid color, weight as emphasis.
- **Don't** use glassmorphism as a default decorative effect. Backdrop-blur is allowed where the underlying layer has real color or gradient (mobile menu over content, secondary buttons over cream gradient); it is forbidden over flat surfaces.
- **Don't** introduce a second sans-serif typeface. Hierarchy is solved by weight and scale within Space Grotesk.
- **Don't** autoplay audio. Sound is always user-initiated; the keyboard `Space` shortcut on the Music page is the canonical pattern.
- **Don't** create new card-grid sections that mirror the Landing project grid pattern. That grid earned its place; an additional one (Skills cards, Testimonial cards) would dilute it.
- **Don't** fall into the second-order category reflex (PRODUCT.md AI-slop test): "music tech grad student who avoided dark + neon → editorial-typographic" is the trap one tier deeper. The answer here is "Analog Workshop" specifically, not generic editorial.

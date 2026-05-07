# Product

## Register

brand

## Users

Three audiences in equal weight, visiting from three different referral contexts:

1. **Music tech / research evaluators** — PhD admissions committees, MIR/audio-ML lab PIs, audio research engineers. Arrive from a CV link or paper bio. Want to verify the work is real and the person can ship.
2. **Music industry collaborators** — producers, artists, fellow performers, recording clients. Arrive from a recording credit, a gig flyer, or word of mouth. Want to hear the playing and see who they'd be working with.
3. **Software / engineering hiring managers** — audio software, DSP, plugin, and adjacent dev roles. Arrive from LinkedIn or a referral. Want to see shipped projects and technical depth.

Common context: skimming on a laptop, often with multiple tabs open, deciding within ~30 seconds whether to keep reading or download the CV. The site is a long warm-up to a single conversion event.

## Product Purpose

A personal portfolio for James Wang (Jiayi Wang) — jazz saxophonist, music technology researcher (M.S. Music Technology, Georgia Tech), audio engineer, and developer.

The site exists to let any of the three audiences above arrive cold and leave with two things: (1) the CV downloaded or full bio read, and (2) the genuine impression that the multi-hyphenate is real, not a costume. Each themed page (Vinyl Music room, project showcase, Timeline) exists to reinforce one facet of that identity through experience, not assertion.

Success looks like: a visitor who came for the research stays for the music, a visitor who came for the music respects the research, and either way they download the CV or send an email.

## Brand Personality

**Three words:** curious, eclectic, inventive.

**Voice:** quietly virtuosic. Confidence by craft, not by volume. Each page genuinely different — the multi-hyphenate is the point, not a problem to flatten. Light playfulness allowed (the vinyl room is the obvious example); never twee, never overdesigned for its own sake.

**Emotional goals:** intrigue, then trust. The site should feel like meeting someone interesting at a dinner party who turns out to be more accomplished than they let on, not someone leading with the resume.

## Anti-references

The site should explicitly not feel like:

- **Generic dev portfolio** — dark mode + matrix-green accents, identical project-card grid with stack badges, hero-and-six-features-and-contact layout. Reads as "first React tutorial."
- **SaaS landing template** — hero + three feature columns + testimonials + pricing strip. Wrong genre; this isn't a product.
- **Awwwards showreel** — heavy WebGL intro, autoplay audio, scroll-jacking, slow first paint. Prioritizes wow over content; punishes the visitor.
- **Academic CV-as-website** — plain HTML list of publications with no personality. Functional but loses everything that's interesting about the person.

If the visitor could guess the aesthetic from the category alone ("music tech grad student → dark + neon"), it has failed.

## Design Principles

1. **Each page is its own world.** The Landing's warm amber, the Vinyl room's analog warmth, and the Timeline are not three skins on one template — they're three rooms in one house. Variety is the brand. Resist the urge to homogenize them.

2. **Show the craft, don't list it.** A vinyl record you can drag onto a turntable says more about audio engineering than a paragraph claiming "audio engineer." Every page should have one moment that proves a skill rather than asserting it.

3. **Quiet confidence over loud claims.** Restrained typography, generous whitespace, no superlatives. Let the body of work do the boasting; the chrome around it stays calm.

4. **Make the CV download easy without making it the whole point.** It's the conversion event, but the site shouldn't beg. One clear CTA in the hero, one in the contact section, and let the work in between earn the click.

5. **Performance is part of the craft.** First paint fast, motion respects `prefers-reduced-motion`, audio never autoplays, the site stays usable on a laptop trackpad and a phone. A music tech site that drops frames on its own animations is a self-own.

## Accessibility & Inclusion

Target: **WCAG 2.1 AA**, with these specific commitments:

- Color contrast meets AA on all themed pages, including the warm amber Landing (currently the lowest-contrast palette on the site).
- All motion-heavy elements (LoadingScreen, scroll reveals, vinyl spin, timeline animations, ambient orbs) gate on `prefers-reduced-motion: reduce`. Reduced motion users get instant, non-animated equivalents — never an empty screen.
- Keyboard parity for every interactive element. The Music room's drag-to-play interaction needs a keyboard alternative (e.g. arrow keys + Enter to load a record).
- Alt text on every image, including profile photo, vinyl labels, and project icons. The PDF CV remains the canonical accessible document for screen-reader users who prefer linear reading.
- No autoplay audio, ever. Sound is always user-initiated.

Confirm or amend any of these — they're sensible defaults, not yet your stated preference.

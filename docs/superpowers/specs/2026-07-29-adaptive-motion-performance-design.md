# Adaptive Motion Performance Design

## Goal

Keep the portfolio's signature motion on capable desktop devices while avoiding
scroll jank on constrained hardware, slow connections, touch devices, and for
visitors who prefer reduced motion.

Success means the landing page remains recognizably the same site, but decorative
work no longer competes with scrolling or first-content loading.

## Confirmed diagnosis

- The production build also feels choppy when served from localhost, so network
  latency is not the primary cause of the low frame rate.
- The landing page combines several scroll-linked SVG scenes, continuous ambient
  loops, a React/Framer Motion cursor trail, and an auto-advancing photo carousel.
- Off-screen pausing already exists and should be preserved.
- The unused `HeroFluidBackground` is not mounted and is therefore not part of
  the current runtime bottleneck.

## Chosen approach

Create one shared adaptive-motion policy with three levels:

1. `reduced`: the existing accessibility mode. No decorative continuous motion.
2. `lite`: the new performance mode for constrained environments.
3. `full`: the current experience on capable desktop devices.

The policy is resolved once on the client and exposed through a hook. Explicit
user accessibility preferences always win.

### Automatic inputs

Use stable, privacy-preserving browser signals:

- `prefers-reduced-motion: reduce` selects `reduced`.
- Coarse pointer or the site's existing mobile breakpoint selects `lite`.
- `navigator.connection.saveData`, `2g`, or `slow-2g` selects `lite`.
- At most four logical CPU cores selects `lite`.
- At most 4 GB reported device memory selects `lite`.
- Otherwise select `full`.

Missing browser signals do not cause a downgrade by themselves.

## Behavior by level

### Full

- Preserve the existing painterly scroll transforms and ambient breathing.
- Preserve the conductor cursor and note trail.
- Preserve photo carousel auto-advance.

### Lite

- Keep short entrance and route transitions.
- Keep essential scroll-linked movement, with fewer simultaneously moving SVG
  layers and no continuous ambient breathing.
- Keep the conductor cursor position but disable spawned music-note particles.
- Disable carousel auto-advance. Load additional photos only after deliberate
  navigation.
- Avoid decorative infinite loops in landing-page previews.

### Reduced

- Honor the existing reduced-motion behavior.
- Do not add a site setting that overrides the operating-system accessibility
  preference back to full motion.

## Architecture

Add a focused `useMotionProfile` hook that returns:

```js
{
  level: 'reduced' | 'lite' | 'full',
  reduceMotion: boolean,
  liteMotion: boolean,
  fullMotion: boolean,
}
```

Landing components consume this policy instead of independently guessing from
mobile state. The first implementation targets the highest-cost surfaces only:
hero painterly motion, portrait carousel, cursor trail, projects preview, music
preview, and timeline preview.

No visual redesign, new dependency, telemetry service, or user-facing settings
panel is included in this pass.

## Loading behavior

- The hero portrait remains the only eager image.
- In `full`, prefetch only the next photo during idle time.
- In `lite` and `reduced`, do not prefetch carousel photos until the visitor
  requests them.
- Keep route code splitting and existing audio-on-demand behavior.

## Testing

Add deterministic unit tests for the policy resolver:

- reduced-motion preference wins over every other signal;
- save-data and slow effective connection select `lite`;
- low CPU or memory selects `lite`;
- missing optional signals on a desktop select `full`;
- coarse pointer selects `lite`.

Then verify:

- lint and production build pass;
- the landing page remains usable at desktop and mobile widths;
- reduced-motion produces static equivalents;
- local network requests do not fetch the full carousel without interaction;
- the count of continuous animations is lower in `lite`.

## Out of scope

- CDN or China-specific hosting changes;
- image re-encoding;
- rewriting the SVG illustrations;
- adding a public performance-mode toggle;
- removing the site's signature page transitions.

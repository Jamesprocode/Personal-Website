# Animation Conflict Diagnosis Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Identify the exact landing-page effect group responsible for missed frames before changing production animation behavior.

**Architecture:** Add a query-string-only diagnostic harness that measures `requestAnimationFrame` gaps and exposes the result in a small DOM report readable by local browser automation. Add effect gates around the four independent animation groups, then run the same idle, pointer, and scroll paths with each group disabled individually. The measured winner becomes the input to a separate root-cause repair task.

**Tech Stack:** React 19, Framer Motion 12, Vite 8, Node built-in test runner, browser `requestAnimationFrame`, `PerformanceObserver`.

## Global Constraints

- Do not change normal production behavior when `motionDebug` is absent.
- Do not globally disable motion to claim a fix.
- Treat an effect group as a bottleneck only when the missed-frame reduction repeats in two runs.
- Keep `prefers-reduced-motion` behavior intact.
- Add no dependencies.

---

### Task 1: Deterministic diagnostic configuration

**Files:**
- Create: `src/performance/motionDebug.js`
- Create: `src/performance/motionDebug.test.js`
- Modify: `package.json`

**Interfaces:**
- Consumes: `URLSearchParams`
- Produces: `readMotionDebug(search): { enabled: boolean, disabled: Set<'cursor' | 'ambient' | 'scroll' | 'carousel'> }`

- [ ] **Step 1: Add the Node test command and failing configuration tests**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readMotionDebug } from './motionDebug.js';

test('debug mode is inert without motionDebug', () => {
  assert.deepEqual(readMotionDebug(''), { enabled: false, disabled: new Set() });
});

test('only known effect groups can be disabled', () => {
  assert.deepEqual(
    readMotionDebug('?motionDebug=1&disable=cursor,ambient,unknown'),
    { enabled: true, disabled: new Set(['cursor', 'ambient']) },
  );
});
```

Add `"test": "node --test"` to `package.json`.

- [ ] **Step 2: Run the test and verify RED**

Run: `npm test -- src/performance/motionDebug.test.js`

Expected: FAIL because `motionDebug.js` does not exist.

- [ ] **Step 3: Implement the parser**

```js
const EFFECTS = new Set(['cursor', 'ambient', 'scroll', 'carousel']);

export function readMotionDebug(search = '') {
  const params = new URLSearchParams(search);
  const enabled = params.get('motionDebug') === '1';
  const requested = (params.get('disable') || '').split(',').filter(Boolean);
  return {
    enabled,
    disabled: new Set(enabled ? requested.filter((name) => EFFECTS.has(name)) : []),
  };
}
```

- [ ] **Step 4: Run the test and verify GREEN**

Run: `npm test -- src/performance/motionDebug.test.js`

Expected: 2 tests pass.

- [ ] **Step 5: Commit**

```bash
git add package.json src/performance/motionDebug.js src/performance/motionDebug.test.js
git commit -m "test: add animation diagnostic configuration"
```

### Task 2: Frame-budget probe

**Files:**
- Create: `src/performance/MotionDebugProbe.jsx`
- Create: `src/performance/frameStats.js`
- Create: `src/performance/frameStats.test.js`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `readMotionDebug(window.location.search)`
- Produces: `summarizeFrameGaps(gaps)` and `[data-motion-debug-report]` with JSON text

- [ ] **Step 1: Write failing frame-statistics tests**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { summarizeFrameGaps } from './frameStats.js';

test('summarizes missed and severe frames', () => {
  assert.deepEqual(summarizeFrameGaps([16, 17, 21, 34, 51]), {
    samples: 5,
    averageMs: 27.8,
    over20: 3,
    over33: 2,
    maxMs: 51,
  });
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `npm test -- src/performance/frameStats.test.js`

Expected: FAIL because `frameStats.js` does not exist.

- [ ] **Step 3: Implement the pure summarizer**

```js
export function summarizeFrameGaps(gaps) {
  const samples = gaps.length;
  const average = samples ? gaps.reduce((sum, gap) => sum + gap, 0) / samples : 0;
  return {
    samples,
    averageMs: Math.round(average * 10) / 10,
    over20: gaps.filter((gap) => gap > 20).length,
    over33: gaps.filter((gap) => gap > 33).length,
    maxMs: samples ? Math.max(...gaps) : 0,
  };
}
```

- [ ] **Step 4: Run the test and verify GREEN**

Run: `npm test -- src/performance/frameStats.test.js`

Expected: 1 test passes.

- [ ] **Step 5: Implement the query-only probe**

`MotionDebugProbe` must:

- return `null` unless `motionDebug=1`;
- collect frame gaps from one `requestAnimationFrame` loop;
- reset the sample window whenever a `motion-debug-reset` event fires;
- update a visually unobtrusive fixed `<output data-motion-debug-report>` once per second;
- include `scrollY`, the disabled groups, and `summarizeFrameGaps(gaps)`;
- cancel the frame and interval during cleanup.

Mount `<MotionDebugProbe />` once inside the Router in `App.jsx`.

- [ ] **Step 6: Verify tests and build**

Run: `npm test && npm run build`

Expected: all tests pass and Vite exits 0.

- [ ] **Step 7: Commit**

```bash
git add src/App.jsx src/performance/MotionDebugProbe.jsx src/performance/frameStats.js src/performance/frameStats.test.js
git commit -m "feat: add opt-in frame budget probe"
```

### Task 3: Independent effect gates

**Files:**
- Modify: `src/components/CursorMusicTrail.jsx`
- Modify: `src/pages/Landing/HeroSection.jsx`
- Modify: `src/pages/Landing/ProjectsSection.jsx`
- Modify: `src/pages/Landing/MusicPreview.jsx`
- Modify: `src/pages/Landing/TimelinePreview.jsx`
- Modify: `src/pages/Landing/HeroPortraitCarousel.jsx`

**Interfaces:**
- Consumes: `readMotionDebug(window.location.search).disabled`
- Produces: isolated URLs such as `?motionDebug=1&disable=cursor`

- [ ] **Step 1: Add one shared helper**

Extend `motionDebug.js`:

```js
export function isMotionEffectDisabled(name, search = window.location.search) {
  return readMotionDebug(search).disabled.has(name);
}
```

Add tests showing `cursor` is disabled only when debug mode is enabled.

- [ ] **Step 2: Run the tests and verify RED**

Run: `npm test -- src/performance/motionDebug.test.js`

Expected: FAIL because `isMotionEffectDisabled` is not exported.

- [ ] **Step 3: Implement the gates without changing the default path**

- `CursorMusicTrail`: return `null` when `cursor` is disabled.
- Painterly components: pass `reduceMotion || disabled.has('ambient')` to continuous loops.
- Scroll transforms: pass static ranges when `scroll` is disabled.
- `HeroPortraitCarousel`: set `autoOk` false when `carousel` is disabled.

Each gate must evaluate to the current behavior when `motionDebug` is absent.

- [ ] **Step 4: Run tests, lint, and build**

Run: `npm test && npm run lint && npm run build`

Expected: all commands exit 0.

- [ ] **Step 5: Commit**

```bash
git add src/performance/motionDebug.js src/performance/motionDebug.test.js src/components/CursorMusicTrail.jsx src/pages/Landing
git commit -m "feat: isolate landing animation groups for profiling"
```

### Task 4: Reproducible isolation matrix

**Files:**
- Create: `docs/performance/2026-07-29-animation-conflict-results.md`

**Interfaces:**
- Consumes: `[data-motion-debug-report]`
- Produces: confirmed bottleneck and exact evidence for the repair plan

- [ ] **Step 1: Build and start the production preview**

Run: `npm run build`

Run: `npm run preview -- --host 127.0.0.1`

Expected: local preview serves the production build.

- [ ] **Step 2: Record the baseline twice**

Open `/?motionDebug=1`. For each run:

1. leave the hero idle for 4 seconds;
2. move the pointer continuously over the hero for 4 seconds;
3. scroll through Projects, Music, and Timeline at a consistent pace;
4. read and save the JSON report after each segment.

- [ ] **Step 3: Record each isolated group twice**

Repeat Step 2 for:

- `/?motionDebug=1&disable=cursor`
- `/?motionDebug=1&disable=ambient`
- `/?motionDebug=1&disable=scroll`
- `/?motionDebug=1&disable=carousel`

- [ ] **Step 4: Write the evidence table**

The result document must include baseline and both runs for each group, with
`averageMs`, `over20`, `over33`, and `maxMs`. Calculate the percentage change in
`over20` relative to baseline for the same scenario.

- [ ] **Step 5: State one root-cause hypothesis**

Name the single group with the largest repeatable reduction. Trace it to the
specific event handler, animation loop, or SVG transform in source. If no group
improves `over20` by at least 15% twice, the hypothesis is that the conflict is
cross-group composition and the next diagnostic must test combined gates rather
than changing production behavior.

- [ ] **Step 6: Commit the result**

```bash
git add docs/performance/2026-07-29-animation-conflict-results.md
git commit -m "docs: record landing animation conflict profile"
```

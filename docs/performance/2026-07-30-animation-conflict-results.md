# Landing Animation Conflict Results

## Environment

- Production Vite build served from localhost.
- Viewport: 1440 × 900.
- Browser cadence: approximately 100 Hz, calibrated to a 10 ms frame budget.
- Scenario: eight 700 px wheel steps, spaced 300 ms apart.
- Each sample starts after the initial loader and entrance motion settle.
- Each comparison uses three runs; the table reports the median.

## Isolation matrix

| Disabled group | Missed frames | Severe frames | Frame debt | Change vs warm baseline |
| --- | ---: | ---: | ---: | ---: |
| None, initial baseline | 21 | 17 | 25.8% | — |
| None, warm baseline | 19 | 1 | 9.6% | — |
| Cursor | 22 | 16 | 21.8% | Initial baseline: -15.5% |
| Ambient loops | 21 | 20 | 24.0% | Initial baseline: -7.0% |
| All scroll-linked motion | 0 | 0 | 3.5% | Warm baseline: -63.5% |
| Hero scroll motion | 21 | 15 | 22.9% | Initial baseline: -11.2% |
| Projects scroll motion | 0 | 0 | 2.9% | Warm baseline: -69.8% |

The warm baseline is used for the final diagnosis because it removes first-run
shader, image decode, and cache effects. The Projects result matches the result
of disabling every scroll-linked scene, which localizes the primary conflict to
`ProjectsPainterlyBackground`.

## Projects layer isolation

| Disabled Projects layer | Missed frames | Severe frames | Frame debt | Change vs warm baseline |
| --- | ---: | ---: | ---: | ---: |
| Groove field | 10 | 0 | 6.5% | -32.3% |
| Large glow drift | 21 | 0 | 9.4% | -2.1% |
| Tracking arc | 0 | 0 | 2.7% | -71.9% |
| Dust drift | 17 | 0 | 8.4% | -12.5% |

## Root cause

The tracking arc transformed seven very large SVG circles every scroll frame.
Four of those circles also applied SVG Gaussian blur filters. The group changed
scale, rotation, and opacity together, forcing the browser to re-rasterize large
blurred surfaces instead of only compositing a cached transform.

The conflict was the combination of:

- circle radius `1000` with large off-screen paint bounds;
- scale range `1.68 → 0.46`;
- four animated SVG filter surfaces;
- rotation and opacity changing in the same group.

## Minimal repair

Remove the four Gaussian blur filter applications from the tracking arc while
keeping:

- all seven arc and dot layers;
- the tracking radius animation;
- rotation and opacity;
- stroke widths, colors, and pulse timing.

The now-unused filter definitions are removed as well.

## Repair verification

| Configuration | Run 1 | Run 2 | Run 3 | Median |
| --- | ---: | ---: | ---: | ---: |
| Warm baseline before repair | 9.6% | 9.7% | 9.4% | 9.6% |
| Full animation after repair | 2.6% | 3.1% | 2.9% | 2.9% |

All three post-repair runs reported:

- `0` missed frames;
- `0` severe frames;
- the same `scrollY: 2412` endpoint;
- full production animation enabled.

The repair reduces median frame debt by approximately 69.8% without disabling
the tracking gesture or changing normal page behavior.

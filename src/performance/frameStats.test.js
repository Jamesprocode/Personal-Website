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

test('returns zeroed statistics without samples', () => {
  assert.deepEqual(summarizeFrameGaps([]), {
    samples: 0,
    averageMs: 0,
    over20: 0,
    over33: 0,
    maxMs: 0,
  });
});

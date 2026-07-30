import test from 'node:test';
import assert from 'node:assert/strict';
import { summarizeFrameGaps } from './frameStats.js';

test('summarizes missed and severe frames', () => {
  assert.deepEqual(summarizeFrameGaps([16, 17, 21, 34, 51]), {
    samples: 5,
    durationMs: 139,
    frameBudgetMs: 16.7,
    missedFrames: 2,
    severeFrames: 1,
    missedTimeMs: 56.2,
    missedRatio: 40.4,
  });
});

test('returns zeroed statistics without samples', () => {
  assert.deepEqual(summarizeFrameGaps([]), {
    samples: 0,
    durationMs: 0,
    frameBudgetMs: 16.7,
    missedFrames: 0,
    severeFrames: 0,
    missedTimeMs: 0,
    missedRatio: 0,
  });
});

test('adapts the frame budget to a 120Hz display', () => {
  assert.equal(summarizeFrameGaps([8, 8, 9, 8, 9]).frameBudgetMs, 8.3);
});

test('adapts the frame budget to a 100Hz display', () => {
  assert.equal(summarizeFrameGaps([10, 10, 10, 10, 10]).frameBudgetMs, 10);
});

test('uses a calibrated frame budget across comparison runs', () => {
  assert.equal(summarizeFrameGaps([16, 17, 18], 8.3).frameBudgetMs, 8.3);
});

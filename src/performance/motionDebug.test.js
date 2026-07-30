import test from 'node:test';
import assert from 'node:assert/strict';
import { isMotionEffectDisabled, readMotionDebug } from './motionDebug.js';

test('debug mode is inert without motionDebug', () => {
  assert.deepEqual(readMotionDebug(''), { enabled: false, disabled: new Set() });
});

test('only known effect groups can be disabled', () => {
  assert.deepEqual(
    readMotionDebug('?motionDebug=1&disable=cursor,ambient,heroScroll,projectsScroll,unknown'),
    {
      enabled: true,
      disabled: new Set(['cursor', 'ambient', 'heroScroll', 'projectsScroll']),
    },
  );
});

test('an effect is disabled only in debug mode', () => {
  assert.equal(isMotionEffectDisabled('cursor', '?disable=cursor'), false);
  assert.equal(isMotionEffectDisabled('cursor', '?motionDebug=1&disable=cursor'), true);
});

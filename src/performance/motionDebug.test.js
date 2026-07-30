import test from 'node:test';
import assert from 'node:assert/strict';
import { isMotionEffectDisabled, readMotionDebug } from './motionDebug.js';

test('debug mode is inert without motionDebug', () => {
  assert.deepEqual(readMotionDebug(''), { enabled: false, disabled: new Set() });
});

test('only known effect groups can be disabled', () => {
  assert.deepEqual(
    readMotionDebug('?motionDebug=1&disable=cursor,ambient,snap,unknown'),
    { enabled: true, disabled: new Set(['cursor', 'ambient', 'snap']) },
  );
});

test('an effect is disabled only in debug mode', () => {
  assert.equal(isMotionEffectDisabled('snap', '?disable=snap'), false);
  assert.equal(isMotionEffectDisabled('snap', '?motionDebug=1&disable=snap'), true);
});

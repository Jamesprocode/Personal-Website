const EFFECTS = new Set([
  'cursor',
  'ambient',
  'scroll',
  'heroScroll',
  'projectsScroll',
  'projectsField',
  'projectsGlow',
  'projectsTrack',
  'projectsDust',
  'musicScroll',
  'timelineScroll',
  'contactScroll',
  'carousel',
  'snap',
]);

export function readMotionDebug(search = '') {
  const params = new URLSearchParams(search);
  const enabled = params.get('motionDebug') === '1';
  const requested = (params.get('disable') || '').split(',').filter(Boolean);

  return {
    enabled,
    disabled: new Set(enabled ? requested.filter((name) => EFFECTS.has(name)) : []),
  };
}

export function isMotionEffectDisabled(name, search) {
  const resolvedSearch = search
    ?? (typeof window === 'undefined' ? '' : window.location.search);
  return readMotionDebug(resolvedSearch).disabled.has(name);
}

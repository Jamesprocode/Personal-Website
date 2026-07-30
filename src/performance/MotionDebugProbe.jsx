import { useEffect, useMemo, useState } from 'react';
import { summarizeFrameGaps } from './frameStats';
import { readMotionDebug } from './motionDebug';

const SAMPLE_LIMIT = 240;

function MotionDebugProbe() {
  const config = useMemo(
    () => readMotionDebug(window.location.search),
    [],
  );
  const [report, setReport] = useState(null);

  useEffect(() => {
    if (!config.enabled) return undefined;

    const disableSnap = config.disabled.has('snap');
    let frameId = 0;
    let intervalId = 0;
    let lastFrameAt = performance.now();
    let gaps = [];

    const reset = () => {
      lastFrameAt = performance.now();
      gaps = [];
    };

    const frame = (now) => {
      gaps.push(now - lastFrameAt);
      if (gaps.length > SAMPLE_LIMIT) gaps = gaps.slice(-SAMPLE_LIMIT);
      lastFrameAt = now;
      frameId = window.requestAnimationFrame(frame);
    };

    const publish = () => {
      setReport({
        disabled: [...config.disabled],
        scrollY: Math.round(window.scrollY),
        ...summarizeFrameGaps(gaps),
      });
    };

    frameId = window.requestAnimationFrame(frame);
    intervalId = window.setInterval(publish, 500);
    window.addEventListener('motion-debug-reset', reset);
    document.documentElement.toggleAttribute('data-motion-debug-no-snap', disableSnap);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearInterval(intervalId);
      window.removeEventListener('motion-debug-reset', reset);
      document.documentElement.removeAttribute('data-motion-debug-no-snap');
    };
  }, [config]);

  if (!config.enabled) return null;

  return (
    <output
      data-motion-debug-report
      aria-live="off"
      style={{
        position: 'fixed',
        left: 8,
        bottom: 8,
        zIndex: 200,
        maxWidth: 'min(92vw, 34rem)',
        padding: '6px 8px',
        borderRadius: 6,
        color: '#f4e8d1',
        background: 'rgba(26, 20, 16, 0.88)',
        font: '11px/1.35 JetBrains Mono, monospace',
        pointerEvents: 'none',
      }}
    >
      {JSON.stringify(report ?? {
        disabled: [...config.disabled],
        scrollY: Math.round(window.scrollY),
        samples: 0,
        averageMs: 0,
        over20: 0,
        over33: 0,
        maxMs: 0,
      })}
    </output>
  );
}

export default MotionDebugProbe;

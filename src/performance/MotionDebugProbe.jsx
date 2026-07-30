import { useEffect, useMemo, useState } from 'react';
import { summarizeFrameGaps } from './frameStats';
import { readMotionDebug } from './motionDebug';

const SAMPLE_LIMIT = 2000;

function MotionDebugProbe() {
  const config = useMemo(
    () => readMotionDebug(window.location.search),
    [],
  );
  const calibratedBudgetMs = useMemo(() => {
    const value = Number(new URLSearchParams(window.location.search).get('budget'));
    return Number.isFinite(value) && value > 0 ? value : undefined;
  }, []);
  const [report, setReport] = useState(null);

  useEffect(() => {
    if (!config.enabled) return undefined;

    const disableSnap = config.disabled.has('snap');
    const disableAmbient = config.disabled.has('ambient');
    let frameId = 0;
    let intervalId = 0;
    let lastFrameAt = performance.now();
    let gaps = [];

    const reset = () => {
      lastFrameAt = performance.now();
      gaps = [];
      setReport({
        disabled: [...config.disabled],
        scrollY: Math.round(window.scrollY),
        ...summarizeFrameGaps([], calibratedBudgetMs),
      });
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
        ...summarizeFrameGaps(gaps, calibratedBudgetMs),
      });
    };

    frameId = window.requestAnimationFrame(frame);
    intervalId = window.setInterval(publish, 1000);
    window.addEventListener('motion-debug-reset', reset);
    window.addEventListener('motion-debug-capture', publish);
    document.documentElement.toggleAttribute('data-motion-debug-no-snap', disableSnap);
    document.documentElement.toggleAttribute('data-motion-debug-no-ambient', disableAmbient);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearInterval(intervalId);
      window.removeEventListener('motion-debug-reset', reset);
      window.removeEventListener('motion-debug-capture', publish);
      document.documentElement.removeAttribute('data-motion-debug-no-snap');
      document.documentElement.removeAttribute('data-motion-debug-no-ambient');
    };
  }, [calibratedBudgetMs, config]);

  if (!config.enabled) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: 8,
        bottom: 8,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      <button
        type="button"
        data-motion-debug-reset
        onClick={() => window.dispatchEvent(new Event('motion-debug-reset'))}
        style={{
          padding: '5px 7px',
          border: 0,
          borderRadius: 6,
          color: '#1a1410',
          background: '#c4a265',
          font: '11px/1.35 JetBrains Mono, monospace',
          cursor: 'pointer',
        }}
      >
        Reset performance sample
      </button>
      <button
        type="button"
        data-motion-debug-capture
        onClick={() => window.dispatchEvent(new Event('motion-debug-capture'))}
        style={{
          padding: '5px 7px',
          border: 0,
          borderRadius: 6,
          color: '#f4e8d1',
          background: '#4a3f35',
          font: '11px/1.35 JetBrains Mono, monospace',
          cursor: 'pointer',
        }}
      >
        Capture performance sample
      </button>
      <output
        data-motion-debug-report
        aria-live="off"
        style={{
          maxWidth: 'min(72vw, 42rem)',
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
          ...summarizeFrameGaps([], calibratedBudgetMs),
        })}
      </output>
    </div>
  );
}

export default MotionDebugProbe;

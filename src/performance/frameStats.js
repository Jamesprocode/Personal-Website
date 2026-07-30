export function summarizeFrameGaps(gaps) {
  const samples = gaps.length;
  const average = samples
    ? gaps.reduce((sum, gap) => sum + gap, 0) / samples
    : 0;

  return {
    samples,
    averageMs: Math.round(average * 10) / 10,
    over20: gaps.filter((gap) => gap > 20).length,
    over33: gaps.filter((gap) => gap > 33).length,
    maxMs: samples ? Math.max(...gaps) : 0,
  };
}

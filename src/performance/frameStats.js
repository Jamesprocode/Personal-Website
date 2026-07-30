const COMMON_FRAME_BUDGETS = [8.3, 10, 11.1, 16.7, 33.3];

function estimateFrameBudget(gaps) {
  if (!gaps.length) return 16.7;
  const sorted = [...gaps].sort((a, b) => a - b);
  const fastestCount = Math.max(1, Math.ceil(sorted.length * 0.2));
  const fastest = sorted.slice(0, fastestCount);
  const typicalFastGap = fastest.reduce((sum, gap) => sum + gap, 0) / fastest.length;
  return COMMON_FRAME_BUDGETS.reduce((closest, budget) =>
    Math.abs(budget - typicalFastGap) < Math.abs(closest - typicalFastGap)
      ? budget
      : closest
  );
}

export function summarizeFrameGaps(gaps, calibratedBudgetMs) {
  const samples = gaps.length;
  const durationMs = gaps.reduce((sum, gap) => sum + gap, 0);
  const frameBudgetMs = Number.isFinite(calibratedBudgetMs) && calibratedBudgetMs > 0
    ? calibratedBudgetMs
    : estimateFrameBudget(gaps);
  const missedTimeMs = gaps.reduce(
    (sum, gap) => sum + Math.max(0, gap - frameBudgetMs),
    0,
  );

  return {
    samples,
    durationMs: Math.round(durationMs * 10) / 10,
    frameBudgetMs,
    missedFrames: gaps.filter((gap) => gap > frameBudgetMs * 1.5).length,
    severeFrames: gaps.filter((gap) => gap > frameBudgetMs * 2.5).length,
    missedTimeMs: Math.round(missedTimeMs * 10) / 10,
    missedRatio: durationMs
      ? Math.round((missedTimeMs / durationMs) * 1000) / 10
      : 0,
  };
}

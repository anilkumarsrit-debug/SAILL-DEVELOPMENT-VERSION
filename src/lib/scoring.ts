/**
 * SAILL R26 Communicative English Laboratory Scoring & Assessment Engine
 * Standard 10-Mark Internal Laboratory Evaluation System
 */

export function normalizeTo10Scale(score: number | null | undefined): number {
  if (score === null || score === undefined || isNaN(score)) return 0;
  // If score is > 10 (e.g., on 100-point scale like 88, 94), convert to 10 scale
  const val = score > 10 ? score / 10 : score;
  return Math.min(10, Math.max(0, Math.round(val)));
}

export function formatScore10(score: number | null | undefined): string {
  const mark = normalizeTo10Scale(score);
  return `${mark} / 10`;
}

export function getPerformanceDescriptor(score: number | null | undefined): string {
  const mark = normalizeTo10Scale(score);
  if (mark === 10) return 'Outstanding';
  if (mark === 9) return 'Excellent';
  if (mark === 8) return 'Very Good';
  if (mark === 7) return 'Good';
  if (mark === 6) return 'Satisfactory';
  if (mark === 5) return 'Needs Improvement';
  return 'Requires Additional Practice';
}

export function getDescriptorColorClass(score: number | null | undefined): string {
  const mark = normalizeTo10Scale(score);
  if (mark >= 9) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
  if (mark >= 7) return 'text-blue-700 bg-blue-50 border-blue-200';
  if (mark >= 5) return 'text-amber-700 bg-amber-50 border-amber-200';
  return 'text-red-700 bg-red-50 border-red-200';
}

export function formatScoreWithDescriptor(score: number | null | undefined): string {
  const mark = normalizeTo10Scale(score);
  const descriptor = getPerformanceDescriptor(mark);
  return `${mark} / 10 – ${descriptor}`;
}

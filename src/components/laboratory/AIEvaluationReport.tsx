import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  Target,
  Clock,
  Sparkles,
  TrendingUp,
  RotateCcw,
  Volume2,
  ChevronRight,
  ShieldCheck,
  Zap,
  BarChart2
} from 'lucide-react';
import {
  AIEvaluationResult,
  AttemptRecord,
  WordAttemptHistory
} from '../../types/aiEvaluation';

interface AIEvaluationReportProps {
  targetWord: string;
  history?: WordAttemptHistory;
  currentResult?: AIEvaluationResult | null;
  onSelectPracticeWord?: (word: string) => void;
  onRetryRecording?: () => void;
  className?: string;
}

export const AIEvaluationReport: React.FC<AIEvaluationReportProps> = ({
  targetWord,
  history,
  currentResult,
  onSelectPracticeWord,
  onRetryRecording,
  className = ''
}) => {
  // If history is available, default to viewing the latest attempt
  const attempts = history?.attempts || [];
  const [selectedAttemptIndex, setSelectedAttemptIndex] = useState<number>(
    attempts.length > 0 ? attempts.length - 1 : 0
  );

  // Active result to display (either selected attempt or currentResult)
  const activeRecord: AttemptRecord | null =
    attempts.length > 0 ? attempts[selectedAttemptIndex] || attempts[attempts.length - 1] : null;

  const result: AIEvaluationResult | null = activeRecord?.result || currentResult || null;

  if (!result) {
    return null;
  }

  // Calculate score colors
  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (percentage >= 60) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  const getScoreProgressBg = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'bg-emerald-500';
    if (percentage >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getGradeBadgeStyle = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'B+':
      case 'B':
        return 'bg-teal-100 text-teal-900 border-teal-300';
      case 'C':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      default:
        return 'bg-rose-100 text-rose-900 border-rose-300';
    }
  };

  // 10 Detailed criteria criteria list
  const criteriaList = [
    { key: 'pronunciation', label: 'Pronunciation Accuracy', max: 25 },
    { key: 'wordStress', label: 'Word Stress & Accent', max: 20 },
    { key: 'syllables', label: 'Syllable Segmentation', max: 10 },
    { key: 'vowels', label: 'Vowel Sound Accuracy', max: 10 },
    { key: 'consonants', label: 'Consonant Clarity', max: 10 },
    { key: 'fluency', label: 'Fluency & Flow', max: 10 },
    { key: 'clarity', label: 'Intelligibility & Clarity', max: 5 },
    { key: 'pace', label: 'Speaking Pace & Cadence', max: 5 },
    { key: 'confidence', label: 'Voice Confidence', max: 3 },
    { key: 'naturalness', label: 'Overall Naturalness', max: 2 }
  ] as const;

  // SVG Circular progress math
  const overall = Math.min(100, Math.max(0, result.overallScore || 0));
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overall / 100) * circumference;

  return (
    <section aria-label="AI Speech Evaluation Report" className={`p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#FAD7A0] shadow-sm space-y-6 animate-fadeIn ${className}`}>
      {/* HEADER BAR WITH ATTEMPT SUMMARY & ATTEMPT SWITCHER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FAD7A0] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[#D35400] text-white text-[10px] font-black uppercase tracking-wider rounded-md font-mono">
              AI Evaluation Report
            </span>
            {result.activityType && (
              <span className="px-2.5 py-0.5 bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] text-[10px] font-bold uppercase rounded-md font-mono">
                {result.activityType}
              </span>
            )}
          </div>
          <h3 className="text-xl font-black text-[#2C3E50] font-heading flex items-center gap-2">
            <span>Target:</span>
            <span className="text-[#D35400] font-mono">"{targetWord}"</span>
          </h3>
        </div>

        {/* ATTEMPT STATS BANNER (Up to 3 Attempts) */}
        {history && history.attempts.length > 0 && (
          <div className="flex items-center gap-3 bg-[#FFF8F0] border border-[#FAD7A0] p-2.5 rounded-2xl shrink-0">
            {/* Best Score */}
            <div className="px-3 py-1 bg-white border border-[#FAD7A0] rounded-xl text-center">
              <span className="text-[9px] font-bold text-[#5D6D7E] uppercase block font-mono">Best Score</span>
              <span className="text-sm font-black text-emerald-700 font-mono">{history.bestScore}/100</span>
            </div>

            {/* Latest Score */}
            <div className="px-3 py-1 bg-white border border-[#FAD7A0] rounded-xl text-center">
              <span className="text-[9px] font-bold text-[#5D6D7E] uppercase block font-mono">Latest</span>
              <span className="text-sm font-black text-[#2C3E50] font-mono">{history.latestScore}/100</span>
            </div>

            {/* Improvement */}
            <div className="px-3 py-1 bg-white border border-[#FAD7A0] rounded-xl text-center">
              <span className="text-[9px] font-bold text-[#5D6D7E] uppercase block font-mono">Progress</span>
              <span className={`text-sm font-black font-mono flex items-center justify-center gap-0.5 ${
                history.improvement >= 0 ? 'text-emerald-600' : 'text-amber-600'
              }`}>
                <TrendingUp className="w-3 h-3" />
                <span>{history.improvement >= 0 ? `+${history.improvement}` : history.improvement}</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ATTEMPT SELECTION TABS (If multiple attempts exist) */}
      {attempts.length > 1 && (
        <div className="flex items-center justify-between gap-2 bg-[#FFF8F0] p-1.5 rounded-2xl border border-[#FAD7A0]">
          <span className="text-xs font-bold text-[#D35400] font-mono px-3">
            Attempt History ({attempts.length}/3):
          </span>

          <div className="flex items-center gap-1">
            {attempts.map((att, idx) => {
              const isSelected = idx === selectedAttemptIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedAttemptIndex(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition font-mono cursor-pointer ${
                    isSelected
                      ? 'bg-[#D35400] text-white shadow-2xs'
                      : 'bg-white border border-[#FAD7A0] text-[#2C3E50] hover:bg-[#FFF8F0]'
                  }`}
                >
                  Attempt {att.attemptNumber} ({att.result.overallScore} pts)
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* TOP ROW: SCORE CIRCLE + OVERALL GRADE + MOTIVATIONAL BANNER */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Col: Circular Score Gauge (4 cols) */}
        <div className="md:col-span-5 p-6 rounded-2xl bg-gradient-to-br from-[#FFF8F0] via-white to-[#FFF8F0] border border-[#FAD7A0] flex flex-col items-center justify-center text-center space-y-3">
          <div className="relative flex items-center justify-center">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r={radius}
                stroke="#FAD7A0"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="64"
                cy="64"
                r={radius}
                stroke="#D35400"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-[#2C3E50] font-heading leading-none">
                {overall}
              </span>
              <span className="text-[10px] font-bold text-[#5D6D7E] uppercase font-mono mt-0.5">
                Out of 100
              </span>
            </div>
          </div>

          {/* Letter Grade Pill */}
          <div className="space-y-1">
            <span className={`inline-block px-4 py-1 text-sm font-black font-mono rounded-full border shadow-2xs ${getGradeBadgeStyle(result.grade)}`}>
              Grade: {result.grade}
            </span>
            <p className="text-[11px] text-[#5D6D7E] font-medium pt-1">
              Evaluated by SAILL AI Pronunciation Engine
            </p>
          </div>
        </div>

        {/* Right Col: Motivation & Quick Metrics (7 cols) */}
        <div className="md:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] space-y-2">
            <div className="flex items-center gap-2 text-[#D35400] font-black text-xs font-heading uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#D35400]" />
              <span>AI Speech Assessment Summary</span>
            </div>
            <p className="text-sm font-extrabold text-[#2C3E50] leading-relaxed">
              "{result.motivation}"
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-white border border-[#FAD7A0] rounded-xl flex items-center gap-3">
              <div className="p-2 bg-[#FFF8F0] border border-[#FAD7A0] rounded-lg text-[#D35400]">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-[#5D6D7E] font-bold block uppercase font-mono">Recommended Practice</span>
                <span className="text-xs font-black text-[#2C3E50]">{result.practiceTime || '5 minutes daily'}</span>
              </div>
            </div>

            <div className="p-3.5 bg-white border border-[#FAD7A0] rounded-xl flex items-center gap-3">
              <div className="p-2 bg-[#FFF8F0] border border-[#FAD7A0] rounded-lg text-[#D35400]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-[#5D6D7E] font-bold block uppercase font-mono">Criteria Evaluated</span>
                <span className="text-xs font-black text-[#2C3E50]">10 Standard Metrics</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DETAILED SCORES GRID (10 CRITERIA) */}
      <div className="space-y-3 pt-2 border-t border-[#FAD7A0]/60">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-black text-[#2C3E50] font-heading flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[#D35400]" />
            <span>Detailed Pronunciation Criteria Breakdown</span>
          </h4>
          <span className="text-xs font-mono font-bold text-[#5D6D7E]">Weights sum = 100%</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {criteriaList.map((crit) => {
            const scoreVal = result.scores?.[crit.key as keyof typeof result.scores] ?? 0;
            const percentage = (scoreVal / crit.max) * 100;

            return (
              <div
                key={crit.key}
                className="p-3.5 rounded-xl bg-white border border-[#FAD7A0] shadow-2xs space-y-2 hover:border-[#D35400] transition"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-[#2C3E50]">{crit.label}</span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-black font-mono border ${getScoreColor(scoreVal, crit.max)}`}>
                    {scoreVal} / {crit.max}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#FFF8F0] h-2 rounded-full overflow-hidden border border-[#FAD7A0]/60">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${getScoreProgressBg(scoreVal, crit.max)}`}
                    style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* STRENGTHS & AREAS FOR IMPROVEMENT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Strengths */}
        <div className="p-4 rounded-2xl bg-[#FFF8F0]/80 border border-emerald-200 space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 font-black text-xs uppercase tracking-wider font-heading">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Key Speech Strengths</span>
          </div>

          <ul className="space-y-2 text-xs text-[#2C3E50]">
            {result.strengths && result.strengths.length > 0 ? (
              result.strengths.map((str, i) => (
                <li key={i} className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-emerald-100 shadow-2xs font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{str}</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-[#5D6D7E] italic">Clear overall pronunciation.</li>
            )}
          </ul>
        </div>

        {/* Improvements */}
        <div className="p-4 rounded-2xl bg-[#FFF8F0]/80 border border-amber-200 space-y-3">
          <div className="flex items-center gap-2 text-amber-800 font-black text-xs uppercase tracking-wider font-heading">
            <Target className="w-4 h-4 text-amber-600" />
            <span>Target Areas for Improvement</span>
          </div>

          <ul className="space-y-2 text-xs text-[#2C3E50]">
            {result.improvements && result.improvements.length > 0 ? (
              result.improvements.map((imp, i) => (
                <li key={i} className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-amber-100 shadow-2xs font-medium">
                  <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>{imp}</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-[#5D6D7E] italic">Maintain current pronunciation standards.</li>
            )}
          </ul>
        </div>
      </div>

      {/* RECOMMENDED PRACTICE WORDS */}
      {result.practiceWords && result.practiceWords.length > 0 && (
        <div className="p-4 bg-[#FFF8F0] rounded-2xl border border-[#FAD7A0] space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-black text-[#2C3E50] uppercase font-heading tracking-wider flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-[#D35400]" />
              <span>Recommended Practice Words</span>
            </h5>
            <span className="text-[11px] text-[#5D6D7E] font-medium">Click any word to practice</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {result.practiceWords.map((word, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectPracticeWord?.(word)}
                aria-label={`Practice word ${word}`}
                className="px-3.5 py-1.5 min-h-[38px] bg-white hover:bg-[#D35400] hover:text-white border border-[#FAD7A0] text-[#2C3E50] font-mono text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-2xs group focus:outline-none focus:ring-2 focus:ring-[#D35400] focus:ring-offset-2"
              >
                <span>{word}</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#D35400] group-hover:text-white transition" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* RETRY / NEXT PRACTICE BUTTON */}
      {onRetryRecording && (
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onRetryRecording}
            aria-label="Record next attempt"
            className="px-5 py-2.5 min-h-[44px] bg-[#D35400] text-white hover:bg-[#E67E22] font-black text-xs rounded-xl transition flex items-center gap-2 shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D35400] focus:ring-offset-2"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>Record Next Attempt ({attempts.length < 3 ? `Attempt ${attempts.length + 1} of 3` : 'Retry'})</span>
          </button>
        </div>
      )}
    </section>
  );
};

/**
 * AI Feedback Card Component for UALAF
 * Displays Overall Score, Skill-wise breakdown, Strengths, Areas for Improvement, Suggested Practice & Faculty Remarks
 */

import React from 'react';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  UserCheck,
  Sparkles,
  BarChart3,
  ArrowRight
} from 'lucide-react';
import { AIFeedbackPayload, AssessmentMetadata } from '../types';

interface AIFeedbackCardProps {
  feedback: AIFeedbackPayload;
  metadata: AssessmentMetadata;
  onContinueToReflection?: () => void;
}

export const AIFeedbackCard: React.FC<AIFeedbackCardProps> = ({
  feedback,
  metadata,
  onContinueToReflection
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 70) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const isPassed = feedback.overallScore >= metadata.passingScore;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" id="ualaf-ai-feedback-card">
      {/* Top Banner Header */}
      <div className={`p-6 border-b ${isPassed ? 'bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white' : 'bg-gradient-to-r from-slate-900 to-rose-950 text-white'}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md text-amber-300 border border-white/20 mb-2">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-300" />
              AI Studio Evaluation Engine
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Assessment Evaluation Results</h2>
            <p className="text-sm text-slate-300 mt-1">
              Evaluated against SAILL Rubric ID: <span className="font-mono text-emerald-300">{metadata.rubricId}</span>
            </p>
          </div>

          {/* Overall Score Badge */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/20">
            <div className="text-right">
              <div className="text-xs uppercase tracking-wider text-slate-300 font-medium">Overall Score</div>
              <div className="text-3xl font-extrabold text-white">
                {feedback.overallScore} <span className="text-sm text-slate-300 font-normal">/ {metadata.maxScore}</span>
              </div>
            </div>

            <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl text-lg font-black border ${getScoreColor(feedback.overallScore)}`}>
              {feedback.grade}
            </div>
          </div>
        </div>
      </div>

      {/* Main Feedback Grid */}
      <div className="p-6 lg:p-8 space-y-8">
        {/* Pass / Re-attempt Alert Banner */}
        <div className={`p-4 rounded-xl border flex items-start gap-3 ${isPassed ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'}`}>
          {isPassed ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div>
            <h3 className="font-semibold text-sm">
              {isPassed ? 'Assessment Benchmark Satisfied' : 'Passing Threshold Not Met'}
            </h3>
            <p className="text-xs mt-0.5 opacity-90">
              {isPassed
                ? `Congratulations! You scored ${feedback.overallScore}% which exceeds the required passing score of ${metadata.passingScore}%.`
                : `You scored ${feedback.overallScore}%, below the required ${metadata.passingScore}%. You can review AI insights below and retry your attempt.`}
            </p>
          </div>
        </div>

        {/* Skill-wise Breakdown */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center">
              <BarChart3 className="w-4 h-4 text-indigo-600 mr-2" />
              Skill-wise Performance Breakdown
            </h3>
            <span className="text-xs text-slate-500 font-medium">Rubric Dimensions</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(feedback.skillWiseScores).map(([skill, rawScore]) => {
              const score = typeof rawScore === 'number' ? rawScore : Number(rawScore) || 0;
              return (
                <div key={skill} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-800">
                    <span>{skill}</span>
                    <span className="font-mono text-indigo-700 font-bold">{score}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        score >= 80 ? 'bg-emerald-500' : score >= 70 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Strengths & Areas for Improvement (Two Column Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Key Strengths */}
          <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-3">
            <h3 className="text-sm font-bold text-emerald-900 flex items-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2" />
              Key Demonstrated Strengths
            </h3>
            <ul className="space-y-2">
              {feedback.strengths.map((str, idx) => (
                <li key={idx} className="text-xs text-emerald-800 flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
            <h3 className="text-sm font-bold text-amber-900 flex items-center">
              <AlertTriangle className="w-4 h-4 text-amber-600 mr-2" />
              Target Areas for Improvement
            </h3>
            <ul className="space-y-2">
              {feedback.areasForImprovement.map((area, idx) => (
                <li key={idx} className="text-xs text-amber-800 flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Suggested Practice Recommendations */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center">
            <Lightbulb className="w-4 h-4 text-amber-500 mr-2" />
            AI Recommended Targeted Practice
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {feedback.suggestedPractice.map((item) => (
              <div key={item.id} className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-indigo-950">{item.title}</h4>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                    {item.estimatedMinutes} mins
                  </span>
                </div>
                <p className="text-xs text-slate-600">{item.description}</p>
                <div className="text-[11px] font-semibold text-indigo-600 flex items-center pt-1">
                  Tool: {item.recommendedTool}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Faculty Remarks Placeholder */}
        <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 flex items-start gap-3">
          <UserCheck className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">Faculty & Mentor Queue</div>
            <p className="text-xs text-slate-600">{feedback.facultyRemarksPlaceholder}</p>
          </div>
        </div>

        {/* Action Button */}
        {onContinueToReflection && (
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={onContinueToReflection}
              className="inline-flex items-center px-6 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Proceed to Learner Self-Reflection
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Assessment Header Component for UALAF
 * Displays Title, Assessment Type, Estimated Time, Difficulty, Max Score, Attempts Remaining, Timer & Progress
 */

import React from 'react';
import {
  Clock,
  Award,
  BarChart2,
  ShieldAlert,
  Mic,
  HelpCircle,
  Headphones,
  BookOpen,
  PenTool,
  MessageSquare,
  Sparkles,
  Layers
} from 'lucide-react';
import { AssessmentMetadata, WorkflowStepId } from '../types';

interface AssessmentHeaderProps {
  metadata: AssessmentMetadata;
  currentStep: WorkflowStepId;
  stepNumber: number;
  attemptsUsed: number;
  attemptsRemaining: number;
  timerSecondsElapsed: number;
}

const STEP_LABELS: Record<number, string> = {
  1: 'Instructions',
  2: 'Attempt',
  3: 'Submission',
  4: 'Evaluation',
  5: 'Feedback',
  6: 'Reflection',
  7: 'Portfolio',
  8: 'Analytics',
  9: 'Next Steps'
};

export const AssessmentHeader: React.FC<AssessmentHeaderProps> = ({
  metadata,
  stepNumber,
  attemptsRemaining,
  timerSecondsElapsed
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ai_pronunciation':
        return <Mic className="w-4 h-4 text-emerald-600" />;
      case 'knowledge_check':
        return <HelpCircle className="w-4 h-4 text-blue-600" />;
      case 'listening':
        return <Headphones className="w-4 h-4 text-purple-600" />;
      case 'reading':
        return <BookOpen className="w-4 h-4 text-amber-600" />;
      case 'writing':
        return <PenTool className="w-4 h-4 text-indigo-600" />;
      case 'speaking':
        return <Mic className="w-4 h-4 text-teal-600" />;
      case 'interview':
        return <MessageSquare className="w-4 h-4 text-rose-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-indigo-600" />;
    }
  };

  const getTypeBadgeStyle = (type: string) => {
    switch (type) {
      case 'ai_pronunciation':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'knowledge_check':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'listening':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'reading':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'writing':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'speaking':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'interview':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Foundation':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'Intermediate':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Advanced':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Mastery':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 shadow-xs px-4 lg:px-8 py-5" id="ualaf-assessment-header">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Top Badges & Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Journey & Code Pill */}
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              <Layers className="w-3.5 h-3.5 mr-1 text-slate-500" />
              {metadata.code}
            </span>

            {/* Assessment Type Badge */}
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getTypeBadgeStyle(
                metadata.type
              )}`}
            >
              <span className="mr-1.5">{getTypeIcon(metadata.type)}</span>
              {metadata.type.replace('_', ' ').toUpperCase()}
            </span>

            {/* Difficulty Badge */}
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getDifficultyBadge(
                metadata.difficulty
              )}`}
            >
              <BarChart2 className="w-3.5 h-3.5 mr-1" />
              {metadata.difficulty}
            </span>
          </div>

          {/* Time & Attempt Counters */}
          <div className="flex items-center gap-3">
            {/* Live Timer */}
            <div
              className="inline-flex items-center px-3 py-1 rounded-lg bg-slate-900 text-slate-100 text-xs font-mono font-medium shadow-xs"
              aria-label="Elapsed Time"
            >
              <Clock className="w-3.5 h-3.5 mr-1.5 text-amber-400 animate-pulse" />
              {formatTime(timerSecondsElapsed)}
            </div>

            {/* Max Score & Threshold */}
            <div className="inline-flex items-center px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-medium">
              <Award className="w-3.5 h-3.5 mr-1 text-amber-600" />
              Max: {metadata.maxScore} (Pass: {metadata.passingScore}%)
            </div>

            {/* Attempts Remaining */}
            <div
              className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-xs font-semibold ${
                attemptsRemaining === 1
                  ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 mr-1" />
              Attempts left: {attemptsRemaining} / {metadata.maxAttempts}
            </div>
          </div>
        </div>

        {/* Assessment Title */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {metadata.title}
          </h1>
        </div>

        {/* 9-Step Stepper Progress Bar */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Step {stepNumber} of 9: <span className="text-indigo-600 font-bold">{STEP_LABELS[stepNumber]}</span>
            </span>
            <span className="text-xs font-medium text-slate-500">
              {Math.round((stepNumber / 9) * 100)}% Completed
            </span>
          </div>

          <div className="grid grid-cols-9 gap-1 sm:gap-1.5" role="progressbar" aria-valuenow={stepNumber} aria-valuemin={1} aria-valuemax={9}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((s) => {
              const isCompleted = s < stepNumber;
              const isCurrent = s === stepNumber;

              let barStyle = 'bg-slate-200';
              if (isCompleted) barStyle = 'bg-emerald-500';
              if (isCurrent) barStyle = 'bg-indigo-600 ring-2 ring-indigo-300';

              return (
                <div key={s} className="relative group">
                  <div className={`h-2 rounded-full transition-all duration-300 ${barStyle}`} />
                  <span className="hidden sm:block text-[10px] text-center mt-1 font-medium text-slate-500 truncate">
                    {STEP_LABELS[s]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};

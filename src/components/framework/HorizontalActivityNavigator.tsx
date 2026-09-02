import React from 'react';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export interface ActivityStepItem {
  id: string;
  label: string;
  phaseTitle?: string;
  phaseType?: 'LEARN' | 'PRACTICE' | 'REFLECT' | 'COMPLETE';
  isComplete?: boolean;
}

interface HorizontalActivityNavigatorProps {
  steps: ActivityStepItem[];
  currentIndex: number;
  direction: number;
  onSelectStep: (index: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  onCompleteModule?: () => void;
  validationError?: string | null;
  isNextDisabled?: boolean;
  children: React.ReactNode;
  extraControls?: React.ReactNode;
  moduleCompletionPercentage?: number;
}

const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
    filter: 'blur(2px)'
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      x: { type: 'spring' as const, stiffness: 350, damping: 30 },
      opacity: { duration: 0.25 },
      filter: { duration: 0.2 }
    }
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -50 : 50,
    opacity: 0,
    filter: 'blur(2px)',
    transition: {
      x: { type: 'spring' as const, stiffness: 350, damping: 30 },
      opacity: { duration: 0.2 }
    }
  })
};

export const HorizontalActivityNavigator: React.FC<HorizontalActivityNavigatorProps> = ({
  steps,
  currentIndex,
  direction,
  onSelectStep,
  onNext,
  onPrevious,
  onCompleteModule,
  validationError,
  isNextDisabled = false,
  children,
  extraControls,
  moduleCompletionPercentage = 0
}) => {
  const currentStep = steps[currentIndex] || steps[0];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === steps.length - 1;

  // Phase colors for integrated educational markers
  const getPhaseBadge = (phaseType?: string) => {
    switch (phaseType) {
      case 'LEARN':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PRACTICE':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'REFLECT':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'COMPLETE':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default:
        return 'bg-[#FFF8F0] text-[#D35400] border-[#FAD7A0]';
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Horizontal Step Indicator Bar */}
      <div className="srit-card p-3 sm:p-4 bg-white border border-[#FAD7A0] rounded-2xl shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#FAD7A0]/60 pb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black uppercase text-[#D35400] bg-[#FFF8F0] px-2.5 py-1 rounded-md border border-[#FAD7A0]">
              Step {currentIndex + 1} of {steps.length}
            </span>
            <h2 className="text-sm font-black text-[#2C3E50]">{currentStep?.label}</h2>
            {currentStep?.phaseType && (
              <span
                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${getPhaseBadge(
                  currentStep.phaseType
                )}`}
              >
                {currentStep.phaseType}: {currentStep.phaseTitle || ''}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {extraControls}
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#5D6D7E]">
              <span>Progress:</span>
              <span className="text-[#D35400] font-black font-mono">
                {Math.min(100, Math.round(moduleCompletionPercentage))}%
              </span>
            </div>
          </div>
        </div>

        {/* Step Progression Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {steps.map((step, idx) => {
            const isCurrent = idx === currentIndex;
            const isComplete = step.isComplete;
            return (
              <button
                key={step.id}
                type="button"
                id={`step-pill-${step.id}`}
                onClick={() => onSelectStep(idx)}
                className={`group px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer shrink-0 border ${
                  isCurrent
                    ? 'bg-[#D35400] text-white border-[#D35400] shadow-2xs font-black'
                    : isComplete
                    ? 'bg-[#FFF8F0] text-[#2C3E50] border-[#FAD7A0] hover:bg-[#FAD7A0]'
                    : 'bg-gray-50 text-[#5D6D7E] border-gray-200 hover:text-[#D35400] hover:border-[#FAD7A0]'
                }`}
                title={step.label}
              >
                <span>{idx + 1}. {step.label}</span>
                {isComplete && (
                  <CheckCircle2
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isCurrent ? 'text-white' : 'text-emerald-600'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div
          role="alert"
          id="activity-validation-warning"
          className="p-3.5 bg-amber-50 border-2 border-amber-300 rounded-xl text-amber-900 text-xs font-bold flex items-center gap-2.5 shadow-2xs animate-fadeIn"
        >
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
          <div className="flex-1">
            <span className="font-extrabold">Activity Requirement Incomplete: </span>
            <span>{validationError}</span>
          </div>
        </div>
      )}

      {/* Horizontal Animated Step Viewport */}
      <div className="w-full overflow-hidden relative min-h-[300px]">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={currentStep?.id || currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Primary Sticky / Bottom Horizontal Navigation Bar */}
      <div className="srit-card p-3 sm:p-4 bg-white border border-[#FAD7A0] rounded-2xl flex items-center justify-between flex-wrap gap-3 shadow-xs sticky bottom-4 z-20 backdrop-blur-md bg-white/95">
        <button
          type="button"
          id="prev-activity-btn"
          onClick={onPrevious}
          disabled={isFirst}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 ${
            isFirst
              ? 'opacity-40 cursor-not-allowed bg-gray-100 text-gray-400 border border-gray-200'
              : 'bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] hover:bg-[#FAD7A0] hover:text-[#935116] cursor-pointer shadow-2xs'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Previous Activity</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-[#5D6D7E] font-extrabold">
          <span className="hidden sm:inline">Current:</span>
          <span className="px-2.5 py-1 bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] rounded-lg font-mono">
            {currentIndex + 1} / {steps.length}
          </span>
          <span className="text-[#2C3E50] hidden md:inline truncate max-w-[200px]">
            {currentStep?.label}
          </span>
        </div>

        {isLast ? (
          <button
            type="button"
            id="complete-module-btn"
            onClick={onCompleteModule || onNext}
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-xl transition flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Complete Module</span>
          </button>
        ) : (
          <button
            type="button"
            id="next-activity-btn"
            onClick={onNext}
            disabled={isNextDisabled}
            className={`px-6 py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white text-xs font-black rounded-xl transition flex items-center gap-2 shadow-xs cursor-pointer ${
              isNextDisabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span>Next Activity →</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

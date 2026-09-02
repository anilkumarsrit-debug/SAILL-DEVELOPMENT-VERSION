import React from 'react';
import { BookOpen, Volume2, Mic, Sparkles, RefreshCw, ArrowRight, CheckCircle2 } from 'lucide-react';

export type PracticeStep = 'instruction' | 'example' | 'listen' | 'record' | 'evaluate' | 'retry' | 'continue';

interface PracticeWorkflowBarProps {
  currentStep?: PracticeStep;
  onStepSelect?: (step: PracticeStep) => void;
}

export const PracticeWorkflowBar: React.FC<PracticeWorkflowBarProps> = ({
  currentStep = 'instruction',
  onStepSelect
}) => {
  const steps: { id: PracticeStep; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'instruction', label: 'Instruction', icon: BookOpen },
    { id: 'example', label: 'Example', icon: Sparkles },
    { id: 'listen', label: 'Listen', icon: Volume2 },
    { id: 'record', label: 'Record', icon: Mic },
    { id: 'evaluate', label: 'Evaluate', icon: Sparkles },
    { id: 'retry', label: 'Retry', icon: RefreshCw },
    { id: 'continue', label: 'Continue', icon: ArrowRight }
  ];

  return (
    <div className="srit-card p-4 bg-[#FFF8F0] border border-[#FAD7A0] space-y-3">
      <div className="flex items-center justify-between text-xs font-black uppercase text-[#D35400]">
        <span>Standard Practice Workflow</span>
        <span className="text-[#5D6D7E] text-[10px] font-bold">Step-by-Step Guided Execution</span>
      </div>

      <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;

          return (
            <React.Fragment key={step.id}>
              <button
                onClick={() => onStepSelect?.(step.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#D35400] text-white shadow-2xs'
                    : 'bg-white text-[#2C3E50] border border-[#FAD7A0] hover:text-[#D35400]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{step.label}</span>
              </button>
              {idx < steps.length - 1 && (
                <span className="text-[#FAD7A0] font-bold shrink-0 text-xs">→</span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

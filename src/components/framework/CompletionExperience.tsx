import React from 'react';
import { Award, CheckCircle2, Sparkles, ArrowRight, RefreshCw, Trophy } from 'lucide-react';
import { ModuleData } from '../../types';

interface CompletionExperienceProps {
  module: ModuleData;
  onNextJourney?: () => void;
  onRestartJourney?: () => void;
}

export const CompletionExperience: React.FC<CompletionExperienceProps> = ({
  module,
  onNextJourney,
  onRestartJourney
}) => {
  return (
    <div className="srit-card p-8 bg-gradient-to-br from-white via-[#FFF8F0] to-orange-50 border-2 border-[#D35400] text-center space-y-6 shadow-md relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#D35400]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Trophy Badge Container */}
      <div className="w-20 h-20 bg-gradient-to-br from-[#D35400] to-[#E67E22] text-white rounded-3xl mx-auto flex items-center justify-center shadow-lg border-2 border-white">
        <Trophy className="w-10 h-10 text-amber-200" />
      </div>

      <div className="space-y-2 max-w-lg mx-auto">
        <span className="px-3 py-1 bg-green-100 text-green-800 border border-green-300 text-xs font-black uppercase tracking-widest rounded-full inline-flex items-center gap-1">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          Journey Certified
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-[#2C3E50] font-heading">
          Congratulations! Journey Completed
        </h2>
        <p className="text-xs sm:text-sm text-[#5D6D7E] leading-relaxed">
          You have successfully mastered the theory, interactive simulations, voice recordings, and knowledge checks for <strong className="text-[#D35400]">{module.title}</strong>.
        </p>
      </div>

      {/* Completion Badge Placeholder Card */}
      <div className="max-w-md mx-auto p-4 bg-white border border-[#FAD7A0] rounded-2xl flex items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3 text-left">
          <div className="p-3 bg-orange-100 text-[#D35400] rounded-xl font-black">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-[#2C3E50]">Official R26 Lab Badge</h4>
            <p className="text-[10px] text-[#5D6D7E]">{module.code} Master Badge • 100 XP Earned</p>
          </div>
        </div>
        <span className="text-[10px] font-black uppercase text-green-700 bg-green-100 px-2 py-1 rounded">
          Unlocked ✓
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        {onRestartJourney && (
          <button
            onClick={onRestartJourney}
            className="w-full sm:w-auto px-6 py-2.5 bg-white border border-[#FAD7A0] hover:bg-[#FFF8F0] text-[#2C3E50] font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-[#D35400]" />
            <span>Review Journey</span>
          </button>
        )}

        {onNextJourney && (
          <button
            onClick={onNextJourney}
            className="w-full sm:w-auto px-8 py-3 bg-[#D35400] hover:bg-[#E67E22] text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <span>Continue to Next Journey</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

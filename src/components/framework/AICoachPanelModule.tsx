import React from 'react';
import { Bot, Sparkles, Clock, Target, ArrowRight, Lightbulb, HeartHandshake } from 'lucide-react';
import { ModuleData } from '../../types';

interface AICoachPanelModuleProps {
  module: ModuleData;
  onNavigateToPractice?: () => void;
}

export const AICoachPanelModule: React.FC<AICoachPanelModuleProps> = ({
  module,
  onNavigateToPractice
}) => {
  return (
    <div className="bg-gradient-to-br from-[#2C3E50] via-[#34495E] to-[#1A252F] text-white p-6 rounded-2xl shadow-md border-2 border-[#FAD7A0]/40 space-y-4 relative overflow-hidden">
      <div className="absolute -right-12 -bottom-12 w-40 h-40 bg-[#D35400]/20 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-r from-[#D35400] to-[#E67E22] text-white rounded-xl shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base font-serif tracking-wide text-[#FAD7A0]">
                AI Coach Guidance ({module.title})
              </h3>
              <span className="px-2 py-0.5 bg-amber-400/20 text-amber-200 border border-amber-300/30 text-[10px] font-bold rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Adaptive Recommendation
              </span>
            </div>
            <p className="text-xs text-gray-300">
              Real-time speech strategy & daily practice goals for this module
            </p>
          </div>
        </div>
      </div>

      {/* Grid of 4 Coach Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Card 1: Today's Tip */}
        <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 space-y-1.5 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-amber-300 font-extrabold text-[11px] uppercase">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Today's Tip</span>
            </div>
            <p className="text-gray-200 text-[11px] leading-relaxed">
              Focus on articulation clarity and breath control during initial practice drills for {module.title}.
            </p>
          </div>
        </div>

        {/* Card 2: Suggested Practice */}
        <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 space-y-1.5 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-indigo-300 font-extrabold text-[11px] uppercase">
              <Target className="w-3.5 h-3.5" />
              <span>Suggested Practice</span>
            </div>
            <p className="text-gray-200 text-[11px] leading-relaxed">
              Complete {module.practiceConfig.toolTitle || 'Interactive Speech Drills'} with AI Voice Feedback.
            </p>
          </div>
        </div>

        {/* Card 3: Estimated Time & Confidence */}
        <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 space-y-1.5 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-emerald-300 font-extrabold text-[11px] uppercase">
                <Clock className="w-3.5 h-3.5" />
                <span>Estimated Time</span>
              </div>
              <span className="text-[10px] font-black text-emerald-200 bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-300/30">
                15 Mins
              </span>
            </div>
            <p className="text-gray-200 text-[11px] leading-relaxed">
              ~15 minutes of active voice recording & reflection.
            </p>
          </div>

          <div className="pt-2 border-t border-white/10 space-y-1">
            <div className="flex items-center justify-between text-[10px] text-amber-200 font-bold">
              <span>AI Confidence Indicator:</span>
              <span className="text-amber-300 font-black">94% (High Reliability)</span>
            </div>
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full w-[94%]" />
            </div>
          </div>
        </div>

        {/* Card 4: Motivational Message */}
        <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 space-y-2 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-pink-300 font-extrabold text-[11px] uppercase">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Motivational Message</span>
            </div>
            <p className="text-gray-200 text-[11px] leading-relaxed">
              "Consistency builds eloquence! Every recording sharpens your professional communicative confidence."
            </p>
          </div>

          {onNavigateToPractice && (
            <button
              onClick={onNavigateToPractice}
              className="mt-1 py-1.5 px-3 bg-[#D35400] hover:bg-[#E67E22] text-white font-bold text-[11px] rounded-lg transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Start Practice</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

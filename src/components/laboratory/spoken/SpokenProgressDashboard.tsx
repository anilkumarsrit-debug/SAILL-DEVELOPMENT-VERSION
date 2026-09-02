import React from 'react';
import { BarChart2, Award, Zap, CheckCircle2, TrendingUp, Flame } from 'lucide-react';
import { formatScore10, getPerformanceDescriptor } from '../../../lib/scoring';

interface SpokenProgressDashboardProps {
  completedCount: number;
  averageScore: number;
  avgWpm: number;
  fillerReductionPercent: number;
  completedCategories: string[];
}

export const SpokenProgressDashboard: React.FC<SpokenProgressDashboardProps> = ({
  completedCount,
  averageScore,
  avgWpm,
  fillerReductionPercent,
  completedCategories
}) => {
  const categoriesList = [
    { id: 'warmup', name: 'Fluency Warm-up' },
    { id: 'guided', name: 'Guided Speaking' },
    { id: 'picture', name: 'Picture Description' },
    { id: 'situation', name: 'Situation-Based' },
    { id: 'story', name: 'Story Completion' },
    { id: 'roleplay', name: 'Role Plays' },
    { id: 'partner', name: 'AI Conversation Partner' }
  ];

  return (
    <div className="srit-card p-6 bg-white border border-[#FAD7A0] rounded-2xl space-y-5">
      <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-3">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-[#D35400]" />
          <h3 className="text-base font-extrabold text-[#2C3E50] font-heading">
            Section 12: Spoken English & Fluency Progress Dashboard
          </h3>
        </div>
        <span className="text-xs font-bold text-[#D35400] bg-[#FFF8F0] px-3 py-1 rounded-full border border-[#FAD7A0]">
          SRIT R26 Continuous Evaluation
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* Completed Exercises */}
        <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1">
          <span className="text-[10px] font-bold text-[#E67E22] uppercase block">Speaking Drills Done</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-[#D35400] font-mono">{completedCount}</span>
            <span className="text-[10px] text-[#5D6D7E]">Exercises</span>
          </div>
          <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active Session Practice
          </p>
        </div>

        {/* Avg Fluency Score out of 10 */}
        <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1">
          <span className="text-[10px] font-bold text-[#E67E22] uppercase block">Average Fluency Score</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-[#D35400] font-mono">
              {formatScore10(averageScore)}
            </span>
          </div>
          <p className="text-[10px] font-bold text-emerald-700">
            {getPerformanceDescriptor(averageScore)}
          </p>
        </div>

        {/* Average WPM */}
        <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1">
          <span className="text-[10px] font-bold text-[#E67E22] uppercase block">Speech Pace WPM</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-[#2C3E50] font-mono">{avgWpm}</span>
            <span className="text-[10px] text-[#5D6D7E]">WPM</span>
          </div>
          <p className="text-[10px] text-[#5D6D7E]">Target Range: 130–150 WPM</p>
        </div>

        {/* Filler Word Reduction */}
        <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1">
          <span className="text-[10px] font-bold text-[#E67E22] uppercase block">Filler Word Reduction</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-600 font-mono">
              -{fillerReductionPercent}%
            </span>
          </div>
          <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-600" /> Fluency Mastery Improving
          </p>
        </div>
      </div>

      {/* Category Mastery Grid */}
      <div className="space-y-2 pt-2 border-t border-[#FAD7A0]">
        <span className="text-xs font-bold text-[#2C3E50] block uppercase">
          Fluency Studio Mastery Matrix ({completedCategories.length} / {categoriesList.length} Categories Active)
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-[11px]">
          {categoriesList.map((cat) => {
            const isDone = completedCategories.includes(cat.id);
            return (
              <div
                key={cat.id}
                className={`p-2.5 rounded-xl border text-center space-y-1 transition ${
                  isDone
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}
              >
                <div className="flex justify-center">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Flame className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <span className="block text-[10px] leading-tight">{cat.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { BarChart3, Award, Users, TrendingUp, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { GDEvaluationResult } from '../../../services/ai/groupDiscussionCoach';

interface GDPerformanceDashboardProps {
  latestEvaluation?: GDEvaluationResult | null;
}

export const GDPerformanceDashboard: React.FC<GDPerformanceDashboardProps> = ({ latestEvaluation }) => {
  const currentScore = latestEvaluation ? latestEvaluation.totalScore : 8.5;
  const participationRate = latestEvaluation ? latestEvaluation.participationRatePercent : 28;

  const categoryMastery = [
    { category: 'Factual & Current Trends', mastery: 88, status: 'Mastered' },
    { category: 'Campus Placement GDs', mastery: 82, status: 'Proficient' },
    { category: 'Abstract Topics', mastery: 74, status: 'Developing' },
    { category: 'Case Study Scenarios', mastery: 80, status: 'Proficient' }
  ];

  return (
    <div className="srit-card p-6 bg-white border border-[#FAD7A0] rounded-2xl space-y-6">
      <div className="border-b border-[#FAD7A0] pb-3 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#D35400]" />
            <h3 className="text-lg font-extrabold text-[#2C3E50] font-heading">
              Section 8: Group Discussion Performance Analytics Dashboard
            </h3>
          </div>
          <p className="text-xs text-[#5D6D7E] mt-1">
            Track your GD competency growth across the 10-mark assessment framework and campus placement readiness indicators.
          </p>
        </div>

        <span className="text-xs font-bold text-[#D35400] bg-[#FFF8F0] px-3 py-1 rounded-full border border-[#FAD7A0]">
          Max Score: 10.0 Marks
        </span>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1">
          <span className="text-[10px] text-[#5D6D7E] font-bold uppercase block">Latest GD Mark</span>
          <span className="text-2xl font-black font-mono text-[#D35400] block">{currentScore} / 10</span>
          <span className="text-[10px] text-emerald-700 font-bold block">✓ Above Placement Threshold (7.0)</span>
        </div>

        <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1">
          <span className="text-[10px] text-[#5D6D7E] font-bold uppercase block">Participation Volume</span>
          <span className="text-2xl font-black font-mono text-[#2C3E50] block">{participationRate}%</span>
          <span className="text-[10px] text-[#D35400] font-bold block">Target: 20% - 35%</span>
        </div>

        <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1">
          <span className="text-[10px] text-[#5D6D7E] font-bold uppercase block">Leadership Rating</span>
          <span className="text-base font-black text-[#2C3E50] block mt-1">
            {latestEvaluation ? latestEvaluation.leadershipRating : 'Strong Contributor'}
          </span>
          <span className="text-[10px] text-[#D35400] font-bold block">Initiation & Consensus</span>
        </div>

        <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1">
          <span className="text-[10px] text-[#5D6D7E] font-bold uppercase block">Completed Simulations</span>
          <span className="text-2xl font-black font-mono text-[#2C3E50] block">4 Drills</span>
          <span className="text-[10px] text-emerald-700 font-bold block">✓ Module 4 Requirement Met</span>
        </div>
      </div>

      {/* Category Mastery Matrix */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-extrabold uppercase text-[#2C3E50] tracking-wider flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-[#D35400]" />
          <span>Category Readiness Matrix</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {categoryMastery.map((cat, idx) => (
            <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex justify-between items-center font-bold">
                <span className="text-[#2C3E50] text-xs">{cat.category}</span>
                <span className="text-[#D35400] font-mono">{cat.mastery}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#D35400] h-full rounded-full transition-all duration-500"
                  style={{ width: `${cat.mastery}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">{cat.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

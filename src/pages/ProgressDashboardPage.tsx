import React from 'react';
import { ModuleProgress, StudentProfile } from '../types';
import { R26_MODULES } from '../data/modulesData';
import { BarChart3, CheckCircle2, Flame } from 'lucide-react';

interface ProgressDashboardPageProps {
  profile: StudentProfile;
  progressMap: Record<string, ModuleProgress>;
}

export const ProgressDashboardPage: React.FC<ProgressDashboardPageProps> = ({
  profile,
  progressMap
}) => {
  const completedModules = R26_MODULES.filter((m) => progressMap[m.id]?.status === 'completed');
  const inProgressModules = R26_MODULES.filter((m) => progressMap[m.id]?.status === 'in_progress');
  const total = R26_MODULES.length;
  const completionRate = Math.round((completedModules.length / total) * 100);

  const categories = ['Core Foundation', 'Speaking & Delivery', 'Professional Writing', 'Career Readiness'] as const;

  return (
    <div className="space-y-8 pb-12 text-[#2C3E50]">
      {/* Header */}
      <div className="srit-card p-6 sm:p-8 bg-white border border-[#FAD7A0]">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#D35400] text-white rounded-xl shadow-xs">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#D35400] font-heading">R26 Progress & Skill Analytics</h1>
            <p className="text-xs sm:text-sm text-[#5D6D7E]">
              Detailed breakdown of Communicative English Laboratory outcomes
            </p>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="srit-card p-5 text-center space-y-1 bg-white border border-[#FAD7A0]">
          <span className="text-xs text-[#5D6D7E] font-bold uppercase">Completion Rate</span>
          <span className="text-2xl sm:text-3xl font-black text-[#D35400] block">{completionRate}%</span>
          <span className="text-[10px] text-[#5D6D7E]">{completedModules.length} of {total} Modules</span>
        </div>

        <div className="srit-card p-5 text-center space-y-1 bg-white border border-[#FAD7A0]">
          <span className="text-xs text-[#5D6D7E] font-bold uppercase">Total XP Earned</span>
          <span className="text-2xl sm:text-3xl font-black text-[#E67E22] block">{profile.xp}</span>
          <span className="text-[10px] text-[#5D6D7E]">Level {profile.level} Communicator</span>
        </div>

        <div className="srit-card p-5 text-center space-y-1 bg-white border border-[#FAD7A0]">
          <span className="text-xs text-[#5D6D7E] font-bold uppercase">Active Streak</span>
          <span className="text-2xl sm:text-3xl font-black text-[#D35400] flex items-center justify-center gap-1">
            <Flame className="w-5 h-5 text-[#E67E22] fill-current" />
            {profile.streakDays} Days
          </span>
          <span className="text-[10px] text-[#5D6D7E]">Daily Lab Activity</span>
        </div>

        <div className="srit-card p-5 text-center space-y-1 bg-white border border-[#FAD7A0]">
          <span className="text-xs text-[#5D6D7E] font-bold uppercase">In Progress</span>
          <span className="text-2xl sm:text-3xl font-black text-[#2C3E50] block">{inProgressModules.length}</span>
          <span className="text-[10px] text-[#5D6D7E]">Active Workspaces</span>
        </div>
      </div>

      {/* Category Wise Outcome Progress */}
      <div className="srit-card p-6 space-y-5 bg-white border border-[#FAD7A0]">
        <h3 className="text-base font-bold text-[#D35400] border-b border-[#FAD7A0] pb-3 font-heading">
          R26 Skill Domain Completion Breakdown
        </h3>

        <div className="space-y-4">
          {categories.map((cat) => {
            const catModules = R26_MODULES.filter((m) => m.category === cat);
            const catDone = catModules.filter((m) => progressMap[m.id]?.status === 'completed').length;
            const catPercent = Math.round((catDone / catModules.length) * 100);

            return (
              <div key={cat} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#2C3E50]">{cat}</span>
                  <span className="text-[#D35400]">{catDone}/{catModules.length} ({catPercent}%)</span>
                </div>
                <div className="w-full h-2.5 bg-[#FFF8F0] rounded-full overflow-hidden border border-[#FAD7A0]">
                  <div
                    className="h-full bg-[#D35400] transition-all duration-500 rounded-full"
                    style={{ width: `${catPercent}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Module Status Table */}
      <div className="srit-card p-6 bg-white border border-[#FAD7A0] space-y-4">
        <h3 className="text-base font-bold text-[#D35400] border-b border-[#FAD7A0] pb-3 font-heading">
          Individual Module Completion Ledger
        </h3>

        <div className="space-y-2">
          {R26_MODULES.map((m, idx) => {
            const p = progressMap[m.id];
            const status = p?.status || 'not_started';
            const score = p?.score || 0;

            return (
              <div key={m.id} className="p-3.5 rounded-xl bg-[#FFF8F0] border border-[#FAD7A0] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-[#D35400] bg-white border border-[#FAD7A0] px-2 py-0.5 rounded-xs">
                    Module {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-[#2C3E50]">{m.title}</h4>
                    <p className="text-[10px] text-[#5D6D7E]">{m.code}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-xs border ${
                    status === 'completed'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : status === 'in_progress'
                      ? 'bg-amber-50 border-amber-200 text-amber-700'
                      : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}>
                    {status.toUpperCase().replace('_', ' ')}
                  </span>
                  <span className="text-xs font-black text-[#D35400]">{score}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

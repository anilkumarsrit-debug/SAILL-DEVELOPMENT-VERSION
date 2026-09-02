import React from 'react';
import { Clock, GraduationCap, Award, BookOpen, CheckCircle2, ArrowLeft } from 'lucide-react';
import { ModuleData, ModuleProgress } from '../../types';

interface LearningJourneyHeaderProps {
  module: ModuleData;
  progress: ModuleProgress;
  journeyNumber: number;
  onBack: () => void;
}

export const LearningJourneyHeader: React.FC<LearningJourneyHeaderProps> = ({
  module,
  progress,
  journeyNumber,
  onBack
}) => {
  const noDemoModules = ['pronunciation', 'listening', 'spoken-english', 'group-discussion', 'public-speaking', 'professional-writing', 'professional-email'];
  const totalTabs = noDemoModules.includes(module.id) ? 10 : 11;
  const completedTabsCount = (progress.completedTabs || []).filter(
    (t) => t !== 'record' && (!noDemoModules.includes(module.id) || t !== 'demo')
  ).length;
  const completionPercentage = progress.status === 'completed'
    ? 100
    : Math.min(100, Math.round((completedTabsCount / totalTabs) * 100));

  // Map difficulty level based on module index or properties
  const getDifficultyLevel = (index: number) => {
    if (index <= 3) return 'Foundation';
    if (index <= 8) return 'Intermediate';
    return 'Advanced';
  };

  const difficulty = getDifficultyLevel(journeyNumber);

  return (
    <div className="space-y-4">
      {/* Top Bar with Back Button and Quick Stats */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button
          onClick={onBack}
          className="px-3.5 py-2 bg-[#FFF8F0] border border-[#FAD7A0] hover:bg-[#FAD7A0] text-[#D35400] text-xs font-extrabold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Syllabus Catalog</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#D35400] bg-[#FFF8F0] px-3 py-1 rounded-lg border border-[#FAD7A0]">
            R26 Syllabus Alignment: {module.code}
          </span>
          {progress.status === 'completed' && (
            <span className="text-xs font-extrabold text-green-800 bg-green-100 border border-green-300 px-2.5 py-1 rounded-lg flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
              <span>Certified</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Module Header Banner */}
      <div className="srit-card p-6 bg-gradient-to-r from-white via-[#FFF8F0] to-white border-2 border-[#FAD7A0] shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-[#D35400] text-white text-xs font-black uppercase tracking-wider rounded-md">
                Learning Journey {journeyNumber}
              </span>
              <span className="text-xs font-bold text-[#5D6D7E] bg-white border border-[#FAD7A0] px-2.5 py-1 rounded-md">
                SRIT CSE Academic Lab
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#2C3E50] font-heading">
              {module.title}
            </h1>

            <p className="text-xs sm:text-sm text-[#5D6D7E] font-medium leading-relaxed max-w-3xl">
              {module.shortDesc}
            </p>
          </div>

          {/* Quick Progress Badge */}
          <div className="bg-white border-2 border-[#FAD7A0] p-4 rounded-2xl flex items-center gap-4 shrink-0 shadow-2xs">
            <div className="text-center px-2">
              <span className="text-2xl font-black text-[#D35400] block">{completionPercentage}%</span>
              <span className="text-[10px] text-[#5D6D7E] font-extrabold uppercase tracking-wider">Completed</span>
            </div>
            <div className="h-8 w-px bg-[#FAD7A0]"></div>
            <div className="text-center px-2">
              <span className="text-2xl font-black text-[#E67E22] block">{progress.score || 0}</span>
              <span className="text-[10px] text-[#5D6D7E] font-extrabold uppercase tracking-wider">Lab Score</span>
            </div>
          </div>
        </div>

        {/* Responsive Information Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-white border border-[#FAD7A0] rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-[#D35400]">
              <BookOpen className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-wider">Journey</span>
            </div>
            <p className="text-xs font-extrabold text-[#2C3E50]">Journey #{journeyNumber}</p>
          </div>

          <div className="p-3 bg-white border border-[#FAD7A0] rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-[#E67E22]">
              <Clock className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-wider">Est. Time</span>
            </div>
            <p className="text-xs font-extrabold text-[#2C3E50]">{module.estimatedMinutes} Minutes</p>
          </div>

          <div className="p-3 bg-white border border-[#FAD7A0] rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-indigo-600">
              <GraduationCap className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-wider">Difficulty</span>
            </div>
            <p className="text-xs font-extrabold text-[#2C3E50]">{difficulty}</p>
          </div>

          <div className="p-3 bg-white border border-[#FAD7A0] rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-[#27AE60]">
              <Award className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-wider">Curriculum</span>
            </div>
            <p className="text-xs font-extrabold text-[#2C3E50]">R26 Standard</p>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs font-extrabold">
            <span className="text-[#5D6D7E]">Overall Journey Progress</span>
            <span className="text-[#D35400]">{completionPercentage}% ({completedTabsCount}/{totalTabs} Activities)</span>
          </div>
          <div className="w-full h-2.5 bg-white rounded-full overflow-hidden border border-[#FAD7A0]">
            <div
              className="h-full bg-gradient-to-r from-[#D35400] to-[#E67E22] rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

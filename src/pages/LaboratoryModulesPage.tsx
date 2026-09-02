import React, { useState, useEffect } from 'react';
import { R26_MODULES } from '../data/modulesData';
import { ModuleCategory, ModuleProgress, StudentProfile, UserRole } from '../types';
import { BookOpen, Search, Filter, CheckCircle2, ArrowRight, Clock, Bookmark, Lock, AlertCircle, X } from 'lucide-react';
import { ModuleReleaseService } from '../services/ModuleReleaseService';

interface LaboratoryModulesPageProps {
  progressMap: Record<string, ModuleProgress>;
  onOpenModule: (moduleId: string) => void;
  studentBranch?: string;
  studentSemester?: string;
  studentSection?: string;
  profile?: StudentProfile;
  activeRole?: UserRole;
}

const CATEGORIES: ('All' | ModuleCategory)[] = [
  'All',
  'Core Foundation',
  'Speaking & Delivery',
  'Professional Writing',
  'Career Readiness'
];

export const LaboratoryModulesPage: React.FC<LaboratoryModulesPageProps> = ({
  progressMap,
  onOpenModule,
  studentBranch = 'General',
  studentSemester = 'Semester I',
  studentSection = 'A',
  profile,
  activeRole = 'STUDENT'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | ModuleCategory>('All');
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  const studentObj = profile || { branch: studentBranch, semester: studentSemester, section: studentSection };
  const classKey = ModuleReleaseService.getClassKey(studentObj);
  const [releaseSync, setReleaseSync] = useState(0);

  useEffect(() => {
    ModuleReleaseService.syncWithIndexedDB(studentObj).then(() => {
      setReleaseSync((prev) => prev + 1);
    });
  }, [profile, studentBranch, studentSemester, studentSection]);

  useEffect(() => {
    if (toastNotice) {
      const timer = setTimeout(() => setToastNotice(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastNotice]);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredModules = R26_MODULES.filter((m) => {
    const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.aiTools.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12 text-[#2C3E50]">
      {/* Header */}
      <div className="srit-card p-6 sm:p-8 bg-white border border-[#FAD7A0]">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-[#D35400] text-white rounded-xl shadow-xs">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#D35400] font-heading">
              Laboratory Modules Catalog
            </h1>
            <p className="text-xs sm:text-sm text-[#5D6D7E]">
              R26 Communicative English Laboratory Syllabus (12 Interactive Modules)
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#5D6D7E] absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by module title, AI tool, keyword, or R26 code (e.g. Pronunciation, ChatGPT, R26-LAB-01)..."
            className="w-full bg-white border border-[#FAD7A0] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#2C3E50] focus:outline-none focus:border-[#D35400] transition shadow-2xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#D35400] text-white shadow-xs'
                  : 'bg-[#FFF8F0] border border-[#FAD7A0] text-[#5D6D7E] hover:text-[#D35400]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Modules List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((m, idx) => {
          const accessInfo = ModuleReleaseService.getModuleAccessInfo(
            profile || classKey,
            m.id,
            progressMap[m.id],
            activeRole
          );

          const isReleased = accessInfo.isAccessible;
          const isDone = accessInfo.state === 'COMPLETED';
          const isInProgress = accessInfo.state === 'IN_PROGRESS';
          const p = progressMap[m.id];
          const completedTabCount = p?.completedTabs?.length || 0;
          const completionPercent = isDone ? 100 : !isReleased ? 0 : Math.min(100, Math.round((completedTabCount / 12) * 100));

          const handleCardClick = (e: React.MouseEvent) => {
            if (isReleased) {
              onOpenModule(m.id);
            } else {
              e.preventDefault();
              e.stopPropagation();
              setToastNotice(accessInfo.lockMessage || `Module ${idx + 1} (${m.title}) is locked.`);
            }
          };

          return (
            <div
              key={m.id}
              onClick={handleCardClick}
              className={`srit-card p-6 transition group shadow-xs flex flex-col justify-between ${
                isReleased
                  ? 'cursor-pointer hover:border-[#D35400]'
                  : 'opacity-90 bg-amber-50/30 border-amber-200 cursor-not-allowed'
              }`}
            >
              <div className="space-y-4">
                {/* Header: Module Code & Title & Bookmark */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D35400] bg-[#FFF8F0] border border-[#FAD7A0] px-2 py-0.5 rounded-sm">
                        {m.code}
                      </span>
                      {!isReleased && (
                        <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold border flex items-center gap-1 ${accessInfo.badgeClass}`}>
                          <Lock className="w-3 h-3" />
                          <span>{accessInfo.statusLabel}</span>
                        </span>
                      )}
                    </div>
                    <h3 className={`text-base font-extrabold ${!isReleased ? 'text-gray-600' : 'text-[#2C3E50] group-hover:text-[#D35400]'} transition leading-snug`}>
                      {m.title}
                    </h3>
                  </div>

                  <button
                    onClick={(e) => toggleBookmark(m.id, e)}
                    className="p-1.5 rounded-lg text-[#5D6D7E] hover:text-[#D35400] hover:bg-[#FFF8F0] transition"
                  >
                    <Bookmark className={`w-4 h-4 ${bookmarked[m.id] ? 'fill-[#D35400] text-[#D35400]' : ''}`} />
                  </button>
                </div>

                {!isReleased ? (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-amber-800">
                      <Lock className="w-4 h-4 text-amber-700" />
                      <span>{accessInfo.statusLabel === 'LOCKED (ADMIN)' ? 'Admin Release Required' : 'Faculty Release Required'}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      {accessInfo.lockMessage || `Module ${idx + 1} 🔒 — Waiting for release.`}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-[#5D6D7E] line-clamp-2 leading-relaxed">
                    {m.shortDesc}
                  </p>
                )}

                {/* AI Tools Badges */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-[#E67E22] uppercase tracking-wider block">
                    Recommended AI Tools:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {m.aiTools.map((tool) => (
                      <span
                        key={tool}
                        className="text-[10px] font-semibold bg-[#FFF8F0] text-[#D35400] border border-[#FAD7A0] px-2 py-0.5 rounded-sm"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1 pt-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-[#5D6D7E]">Progress</span>
                    <span className={!isReleased ? 'text-gray-400' : 'text-[#D35400]'}>{completionPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#FFF8F0] rounded-full overflow-hidden border border-[#FAD7A0]">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${!isReleased ? 'bg-gray-300' : 'bg-[#D35400]'}`}
                      style={{ width: `${completionPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 mt-4 border-t border-[#FAD7A0] space-y-3">
                <div className="flex items-center justify-between text-[11px] text-[#5D6D7E]">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#E67E22]" />
                    {m.estimatedMinutes} mins
                  </span>
                  <span className="px-2 py-0.5 rounded-xs bg-[#FFF8F0] border border-[#FAD7A0] font-bold text-[#D35400] text-[10px]">
                    {m.difficultyLevel}
                  </span>
                </div>

                <button
                  onClick={handleCardClick}
                  disabled={!isReleased}
                  className={`w-full py-2.5 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-2xs ${
                    isReleased
                      ? 'bg-[#D35400] group-hover:bg-[#E67E22] text-white'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300'
                  }`}
                >
                  <span>
                    {!isReleased
                      ? `Module ${idx + 1} Locked`
                      : isDone
                      ? 'Review Lab'
                      : isInProgress
                      ? 'Continue Lab'
                      : 'Start Lab Module'}
                  </span>
                  {isReleased ? (
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Toast Notice Banner */}
      {toastNotice && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-amber-900 text-white p-4 rounded-2xl shadow-2xl border-2 border-amber-400 flex items-start gap-3 animate-bounce">
          <AlertCircle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-0.5">
            <h5 className="text-xs font-black uppercase tracking-wider text-amber-300">
              Access Locked
            </h5>
            <p className="text-xs font-medium leading-relaxed">{toastNotice}</p>
          </div>
          <button
            onClick={() => setToastNotice(null)}
            className="p-1 hover:bg-amber-800 rounded-lg text-amber-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};


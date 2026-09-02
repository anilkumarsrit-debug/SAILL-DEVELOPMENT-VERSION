import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  Users,
  Award,
  Sliders,
  PlayCircle,
  FileCheck,
  Search,
  Filter,
  Lock,
  Unlock,
  ShieldCheck,
  ArrowRight,
  Info
} from 'lucide-react';
import { dbStorage } from '../../lib/db';
import { R26_MODULES } from '../../data/modulesData';
import { ModuleReleaseService } from '../../services/ModuleReleaseService';

interface ModuleManagementTabProps {
  onOpenModule?: (moduleId: string) => void;
}

export const ModuleManagementTab: React.FC<ModuleManagementTabProps> = ({ onOpenModule }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [studentCount, setStudentCount] = useState<number>(0);
  const [adminReleasedIds, setAdminReleasedIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await ModuleReleaseService.syncWithIndexedDB();
      const released = ModuleReleaseService.getAdminReleasedModuleIdsSync();
      setAdminReleasedIds(released);

      const students = await dbStorage.getAllProfiles();
      setStudentCount(students.length);
    } catch {
      setStudentCount(0);
    }
  };

  const handleToggleAdminRelease = async (moduleId: string, title: string) => {
    setIsProcessing(moduleId);
    const isCurrentlyReleased = adminReleasedIds.includes(moduleId);

    try {
      if (isCurrentlyReleased) {
        const updated = await ModuleReleaseService.revokeModuleByAdmin(moduleId, 'Administrator');
        setAdminReleasedIds(updated);
        setActionNotice(`Locked "${title}" from Faculty Incharges. Faculty will not be able to release this module until unlocked by Admin.`);
      } else {
        const updated = await ModuleReleaseService.releaseModuleByAdmin(moduleId, 'Administrator');
        setAdminReleasedIds(updated);
        setActionNotice(`Successfully released "${title}" to Faculty Incharges. Assigned Faculty can now release it to their students.`);
      }
    } catch (e: any) {
      setActionNotice(e.message || 'Failed to update module release state.');
    } finally {
      setIsProcessing(null);
      setTimeout(() => setActionNotice(''), 4500);
    }
  };

  const filteredModules = R26_MODULES.filter(
    (m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.overview.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const releasedCount = R26_MODULES.filter((m) =>
    adminReleasedIds.includes(m.id)
  ).length;

  return (
    <div className="space-y-6 text-[#2C3E50]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D35400]">
            Curriculum & Assessment Governance
          </span>
          <h2 className="text-xl font-black text-[#2C3E50]">R26 Curriculum Modules & Release Hierarchy</h2>
          <p className="text-xs text-[#5D6D7E] mt-0.5">
            Admin controls release of all 10 Communicative English Laboratory modules to Faculty Incharges.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-extrabold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {releasedCount} / 10 Modules Released to Faculty
          </span>
        </div>
      </div>

      {/* Release Hierarchy Card */}
      <div className="bg-gradient-to-r from-[#FFF8F0] via-white to-[#FFF8F0] p-4 rounded-2xl border border-[#FAD7A0] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#D35400] text-white flex items-center justify-center shrink-0 font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-[#2C3E50] text-sm">Strict 3-Tier Release Hierarchy</h4>
            <p className="text-gray-600 text-xs mt-0.5">
              <span className="font-bold text-[#D35400]">ADMIN</span> (All 10 Modules Always Accessible) <ArrowRight className="w-3 h-3 inline mx-1 text-gray-400" />
              <span className="font-bold text-blue-700">FACULTY</span> (Requires Admin Release to unlock) <ArrowRight className="w-3 h-3 inline mx-1 text-gray-400" />
              <span className="font-bold text-emerald-700">STUDENTS</span> (Requires Faculty Release for assigned class)
            </p>
          </div>
        </div>
      </div>

      {/* Action Notification */}
      {actionNotice && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2 animate-fadeIn">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="font-semibold">{actionNotice}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search all 10 modules by title, code, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
          />
        </div>

        <div className="text-xs font-bold text-gray-500">
          Curriculum Regulation: <span className="text-[#D35400] font-black">R26 Autonomous Standard (10 Modules)</span>
        </div>
      </div>

      {/* MODULE CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {filteredModules.map((mod, index) => {
          const isReleased = adminReleasedIds.includes(mod.id);

          return (
            <div
              key={mod.id}
              className={`bg-white rounded-2xl border transition p-5 flex flex-col justify-between space-y-4 relative overflow-hidden shadow-sm hover:shadow-md ${
                isReleased ? 'border-emerald-200 bg-white' : 'border-gray-200 bg-gray-50/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#FFF8F0] text-[#D35400] border border-[#FAD7A0] text-[10px] font-black font-mono">
                      {mod.code}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                      Module {index + 1}
                    </span>
                  </div>

                  {isReleased ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-extrabold border border-emerald-200 flex items-center gap-1">
                      <Unlock className="w-3 h-3 text-emerald-600" />
                      Released to Faculty
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-extrabold border border-amber-200 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-amber-600" />
                      Locked for Faculty
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-sm text-[#2C3E50] mt-3 leading-snug">{mod.title}</h3>
                <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{mod.overview.description}</p>
              </div>

              {/* Focus Areas */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5D6D7E]">
                  Syllabus Focus Areas:
                </span>
                <div className="flex flex-wrap gap-1">
                  {mod.overview.keyFocusAreas.slice(0, 3).map((area, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md text-[10px] font-semibold"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* Admin Action Bar */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                <div className="text-[11px] text-gray-500 font-medium">
                  {isReleased ? (
                    <span className="text-emerald-700 font-bold">Unlocked for Faculty Incharges</span>
                  ) : (
                    <span className="text-gray-500 font-medium">Locked (Faculty cannot release)</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {onOpenModule && (
                    <button
                      type="button"
                      onClick={() => onOpenModule(mod.id)}
                      className="px-3 py-1.5 bg-[#FFF8F0] hover:bg-[#FAD7A0]/40 text-[#D35400] font-bold text-xs rounded-xl border border-[#FAD7A0] transition flex items-center gap-1 cursor-pointer"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>
                  )}

                  <button
                    type="button"
                    disabled={isProcessing === mod.id}
                    onClick={() => handleToggleAdminRelease(mod.id, mod.title)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                      isReleased
                        ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                        : 'bg-[#D35400] hover:bg-[#E67E22] text-white shadow-sm'
                    }`}
                  >
                    {isProcessing === mod.id ? (
                      <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : isReleased ? (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Lock Module</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Release to Faculty</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

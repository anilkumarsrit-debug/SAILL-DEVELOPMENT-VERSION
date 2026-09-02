import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import { FacultyAssignment } from '../../types/academic';
import { R26_MODULES } from '../../data/modulesData';
import { ModuleReleaseService } from '../../services/ModuleReleaseService';
import {
  BookOpen,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Lock,
  Unlock,
  Users
} from 'lucide-react';

interface FacultyReleaseModulesTabProps {
  assignments: FacultyAssignment[];
  assignedStudents: StudentProfile[];
}

export const FacultyReleaseModulesTab: React.FC<FacultyReleaseModulesTabProps> = ({
  assignments,
  assignedStudents
}) => {
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>(
    assignments[0]?.id || ''
  );

  const selectedAssignment = assignments.find((a) => a.id === selectedAssignmentId) || assignments[0];

  // Filter students for the selected class
  const classStudents = selectedAssignment
    ? assignedStudents.filter((st) => {
        const sBranch = (st.branch || st.department || '').toLowerCase();
        const sSem = (st.semester || '').toLowerCase();
        const sSec = (st.section || '').toUpperCase();

        const aBranch = (selectedAssignment.branch || '').toLowerCase();
        const aSem = (selectedAssignment.semester || '').toLowerCase();
        const aSec = (selectedAssignment.section || '').toUpperCase();

        return (
          (!aBranch || sBranch.includes(aBranch) || aBranch.includes(sBranch)) &&
          (!aSem || sSem.includes(aSem) || aSem.includes(sSem)) &&
          (!aSec || sSec === aSec)
        );
      })
    : assignedStudents;

  const totalClassStudents = classStudents.length || 1;

  // Derive class key for module release tracking
  const classKey = selectedAssignment
    ? ModuleReleaseService.getClassKey(
        selectedAssignment.branch,
        selectedAssignment.semester,
        selectedAssignment.section
      )
    : 'default';

  const [releasedModuleIds, setReleasedModuleIds] = useState<string[]>(() =>
    ModuleReleaseService.getReleasedModuleIdsForClass(classKey)
  );

  // Modal State for Release Confirmation Safety Check
  const [confirmModalModule, setConfirmModalModule] = useState<{
    id: string;
    title: string;
    index: number;
  } | null>(null);

  const [releaseSuccessMsg, setReleaseSuccessMsg] = useState<string | null>(null);
  const [releaseErrorMsg, setReleaseErrorMsg] = useState<string | null>(null);

  const [adminReleasedIds, setAdminReleasedIds] = useState<string[]>(() =>
    ModuleReleaseService.getAdminReleasedModuleIdsSync()
  );

  React.useEffect(() => {
    let isMounted = true;
    const target = selectedAssignment || classKey;
    ModuleReleaseService.syncWithIndexedDB(target).then((released) => {
      if (isMounted) {
        setReleasedModuleIds(released);
        setAdminReleasedIds(ModuleReleaseService.getAdminReleasedModuleIdsSync());
      }
    });
    return () => {
      isMounted = false;
    };
  }, [selectedAssignmentId, classKey]);

  // Switch class selection
  const handleSelectClass = (assignmentId: string) => {
    setSelectedAssignmentId(assignmentId);
    const newAssignment = assignments.find((a) => a.id === assignmentId);
    if (newAssignment) {
      setReleasedModuleIds(ModuleReleaseService.getReleasedModuleIdsForClass(newAssignment));
      setAdminReleasedIds(ModuleReleaseService.getAdminReleasedModuleIdsSync());
      ModuleReleaseService.syncWithIndexedDB(newAssignment).then((released) => {
        setReleasedModuleIds(released);
      });
    }
    setReleaseSuccessMsg(null);
    setReleaseErrorMsg(null);
  };

  // Determine highest index of released modules
  const releasedIndices = R26_MODULES.map((m, idx) => (releasedModuleIds.includes(m.id) ? idx : -1)).filter(
    (idx) => idx !== -1
  );

  const currentModuleIndex = Math.max(0, ...releasedIndices);
  const currentModule = R26_MODULES[currentModuleIndex] || R26_MODULES[0];
  const nextModule = R26_MODULES[currentModuleIndex + 1] || null;

  // Calculate completion for current module
  let completedStudentsCount = 0;
  classStudents.forEach((st) => {
    if ((st.overallProgressPercentage || 0) >= 100) {
      completedStudentsCount++;
    }
  });

  const completionPercent = totalClassStudents > 0 ? Math.round((completedStudentsCount / totalClassStudents) * 100) : 0;
  const studentsNotCompletedCount = Math.max(0, totalClassStudents - completedStudentsCount);

  // Handle explicit module release confirmation
  const handleConfirmRelease = async () => {
    if (!confirmModalModule) return;
    setReleaseErrorMsg(null);
    setReleaseSuccessMsg(null);

    try {
      const target = selectedAssignment || classKey;
      const updated = await ModuleReleaseService.releaseModuleForClass(
        target,
        confirmModalModule.id,
        selectedAssignment?.facultyId || 'FACULTY'
      );
      setReleasedModuleIds(updated);

      const classNameStr = selectedAssignment
        ? `${selectedAssignment.branch} (Sem ${selectedAssignment.semester} - Sec ${selectedAssignment.section})`
        : 'Class';

      setReleaseSuccessMsg(
        `Successfully released "${confirmModalModule.title}" to ${classNameStr}. Students can now access this module.`
      );
      setConfirmModalModule(null);
    } catch (err: any) {
      console.error('[FacultyReleaseModulesTab] IndexedDB release failure:', err);
      setReleaseErrorMsg('Failed to persist module release in IndexedDB. Release aborted.');
    }
  };

  if (assignments.length === 0) {
    return (
      <div className="bg-white p-10 rounded-2xl border border-[#FAD7A0] text-center space-y-3">
        <BookOpen className="w-12 h-12 text-gray-300 mx-auto" />
        <h3 className="font-bold text-lg text-[#2C3E50]">No Class Assigned</h3>
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          Your account is active, but no class has been assigned yet. Module release controls will be available once a class is assigned.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-[#2C3E50]">
      {/* Title Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#FAD7A0]/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D35400]/10 text-[#D35400] rounded-full text-[11px] font-bold mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Module Release Management</span>
          </div>
          <h2 className="text-xl font-extrabold font-serif text-[#2C3E50]">Release Next Learning Module</h2>
          <p className="text-xs text-gray-500">
            Control curriculum progression for your assigned classes. Explicit release is required.
          </p>
        </div>
      </div>

      {/* Class Selector Switcher */}
      {assignments.length > 1 && (
        <div className="bg-white p-4 rounded-2xl border border-[#FAD7A0]/60 shadow-xs space-y-2">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Select Class:</p>
          <div className="flex flex-wrap gap-2">
            {assignments.map((a) => {
              const isSelected = a.id === selectedAssignmentId;
              return (
                <button
                  key={a.id}
                  onClick={() => handleSelectClass(a.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? 'bg-[#2C3E50] text-[#FAD7A0] shadow-sm'
                      : 'bg-[#FFF8F0] text-gray-700 hover:bg-[#FAD7A0]/40 border border-[#FAD7A0]'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>
                    {a.branch} • Sem {a.semester} • Sec {a.section}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Release Success Notification */}
      {releaseSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{releaseSuccessMsg}</span>
        </div>
      )}

      {/* Release Error Notification */}
      {releaseErrorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{releaseErrorMsg}</span>
        </div>
      )}

      {/* Current vs Next Module Status Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: CURRENT MODULE */}
        <div className="bg-white p-6 rounded-2xl border border-[#FAD7A0] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
              Current Active Module
            </span>
            <span className="text-xs text-gray-500 font-mono font-bold">
              {currentModule.code}
            </span>
          </div>

          <div>
            <h3 className="text-lg font-extrabold font-serif text-[#2C3E50]">
              Module {currentModuleIndex + 1}: {currentModule.title}
            </h3>
            <p className="text-xs text-gray-600 mt-1">{currentModule.shortDesc}</p>
          </div>

          <div className="space-y-3 bg-[#FFF8F0] p-4 rounded-xl border border-[#FAD7A0]/60">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-gray-600">Class Completion Progress</span>
              <span className="font-extrabold text-[#D35400]">{completionPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#D35400] to-[#E67E22] rounded-full"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div>
                <span className="text-gray-500 text-[11px]">Students Completed:</span>
                <p className="font-bold text-[#2C3E50]">
                  {completedStudentsCount} / {totalClassStudents}
                </p>
              </div>
              <div>
                <span className="text-gray-500 text-[11px]">Students Ready:</span>
                <p className="font-bold text-emerald-700">{completedStudentsCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: NEXT MODULE RELEASE CONTROL */}
        <div className="bg-white p-6 rounded-2xl border border-[#FAD7A0] shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                Next Module Status
              </span>
              {nextModule && releasedModuleIds.includes(nextModule.id) ? (
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-bold">
                  RELEASED TO CLASS ✓
                </span>
              ) : nextModule && !adminReleasedIds.includes(nextModule.id) && nextModule.id !== 'pronunciation' ? (
                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-md text-[10px] font-extrabold flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-700" />
                  LOCKED BY ADMIN
                </span>
              ) : (
                <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-[10px] font-bold">
                  ADMIN APPROVED • READY TO RELEASE
                </span>
              )}
            </div>

            {nextModule ? (
              <div className="mt-3 space-y-2">
                <h3 className="text-lg font-extrabold font-serif text-[#2C3E50]">
                  Module {currentModuleIndex + 2}: {nextModule.title}
                </h3>
                <p className="text-xs text-gray-600">{nextModule.shortDesc}</p>

                {!adminReleasedIds.includes(nextModule.id) && nextModule.id !== 'pronunciation' ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-xs text-amber-900 mt-3">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Lock className="w-4 h-4 text-amber-700" />
                      <span>Awaiting Administrator Release</span>
                    </div>
                    <p className="text-[11px] text-gray-600">
                      This module is currently locked by the Administrator. Once the Administrator unlocks it, you can release it to your assigned students.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1 text-xs text-emerald-900 mt-3">
                    <div className="flex items-center gap-1.5 font-bold">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>Admin Approved for Class Release</span>
                    </div>
                    <p className="text-[11px] text-gray-600">
                      Administrator has approved this module. Click below to release it immediately to your assigned students.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-3 space-y-2 text-center py-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm text-[#2C3E50]">All Curriculum Modules Released</h4>
                <p className="text-xs text-gray-500">
                  All published SAILL R26 learning modules are unlocked for this class.
                </p>
              </div>
            )}
          </div>

          {nextModule && (
            <div className="pt-4 border-t border-gray-100">
              {releasedModuleIds.includes(nextModule.id) ? (
                <button
                  disabled
                  className="w-full py-3 bg-gray-100 text-gray-500 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <Unlock className="w-4 h-4 text-emerald-600" />
                  <span>Module Already Released to Class</span>
                </button>
              ) : !adminReleasedIds.includes(nextModule.id) && nextModule.id !== 'pronunciation' ? (
                <button
                  disabled
                  className="w-full py-3 bg-gray-100 text-gray-400 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-not-allowed border border-gray-200"
                >
                  <Lock className="w-4 h-4 text-gray-400" />
                  <span>Awaiting Admin Release (Locked)</span>
                </button>
              ) : (
                <button
                  onClick={() =>
                    setConfirmModalModule({
                      id: nextModule.id,
                      title: nextModule.title,
                      index: currentModuleIndex + 2
                    })
                  }
                  className="w-full py-3 bg-[#D35400] hover:bg-[#E67E22] text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Unlock className="w-4 h-4" />
                  <span>RELEASE MODULE {currentModuleIndex + 2} TO CLASS</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Full Module Curriculum Release Status Table */}
      <div className="bg-white p-6 rounded-2xl border border-[#FAD7A0]/70 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-[#2C3E50] font-serif border-b border-gray-100 pb-2">
          Class Curriculum Release Status
        </h3>
        <div className="space-y-2">
          {R26_MODULES.map((mod, idx) => {
            const isReleasedToClass = releasedModuleIds.includes(mod.id);
            const isAdminApproved = mod.id === 'pronunciation' || adminReleasedIds.includes(mod.id);

            return (
              <div
                key={mod.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 transition ${
                  isReleasedToClass
                    ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                    : isAdminApproved
                    ? 'bg-blue-50/40 border-blue-200 text-blue-950'
                    : 'bg-gray-50 border-gray-200 text-gray-500 opacity-80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 ${
                      isReleasedToClass
                        ? 'bg-emerald-600 text-white'
                        : isAdminApproved
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-300 text-gray-700'
                    }`}
                  >
                    M{idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#2C3E50]">{mod.title}</h4>
                    <p className="text-[11px] text-gray-500">{mod.category}</p>
                  </div>
                </div>

                <div>
                  {isReleasedToClass ? (
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md text-[10px] font-extrabold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Released to Class</span>
                    </span>
                  ) : isAdminApproved ? (
                    <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-md text-[10px] font-extrabold flex items-center gap-1">
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Admin Approved (Ready)</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-md text-[10px] font-bold flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Locked by Admin</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Safety Check Confirmation Modal (Requirement 10) */}
      {confirmModalModule && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#FAD7A0] space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-3 text-[#D35400] pb-2 border-b border-gray-100">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="font-bold text-base text-[#2C3E50]">Safety Check Confirmation</h3>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-bold text-[#2C3E50]">
                Release {confirmModalModule.title} to{' '}
                <span className="text-[#D35400]">
                  {selectedAssignment
                    ? `${selectedAssignment.branch} — Semester ${selectedAssignment.semester} — Section ${selectedAssignment.section}`
                    : 'Class'}
                </span>
                ?
              </p>

              <div className="p-3.5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Students completed current module:</span>
                  <span className="font-bold text-emerald-700">
                    {completedStudentsCount} / {totalClassStudents}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Students pending current module:</span>
                  <span className="font-bold text-rose-700">{studentsNotCompletedCount}</span>
                </div>
              </div>

              <p className="text-[11px] text-gray-500">
                Are you sure you want to release this module? Assigned students in this class will be able to access the learning materials immediately.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmModalModule(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRelease}
                className="px-4 py-2 bg-[#D35400] hover:bg-[#E67E22] text-white font-bold text-xs rounded-xl transition shadow-sm cursor-pointer"
              >
                Release {confirmModalModule.title}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

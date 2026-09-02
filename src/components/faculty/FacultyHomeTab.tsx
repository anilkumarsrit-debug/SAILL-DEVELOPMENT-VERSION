import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import { FacultyAssignment } from '../../types/academic';
import { FacultyWorkbenchTabKey } from '../../types/faculty';
import { R26_MODULES } from '../../data/modulesData';
import { ModuleReleaseService } from '../../services/ModuleReleaseService';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  GraduationCap,
  Users,
  BookOpen,
  ChevronRight,
  FileCheck,
  Bell,
  Unlock,
  ShieldCheck,
  Award
} from 'lucide-react';

interface FacultyHomeTabProps {
  assignments: FacultyAssignment[];
  assignedStudents: StudentProfile[];
  facultyName: string;
  accountStatus: 'APPROVED' | 'PENDING_APPROVAL' | 'REJECTED' | 'SUSPENDED';
  onSelectTab: (tab: FacultyWorkbenchTabKey) => void;
  onSelectStudent: (student: StudentProfile) => void;
}

export const FacultyHomeTab: React.FC<FacultyHomeTabProps> = ({
  assignments,
  assignedStudents,
  facultyName,
  accountStatus = 'APPROVED',
  onSelectTab,
  onSelectStudent
}) => {
  const totalClasses = assignments.length;
  const totalStudents = assignedStudents.length;

  // Active Class Selection
  const [selectedClassId, setSelectedClassId] = useState<string>(
    assignments[0]?.id || ''
  );

  const activeAssignment = assignments.find((a) => a.id === selectedClassId) || assignments[0] || null;

  // Filter students for active class
  const classStudents = activeAssignment
    ? assignedStudents.filter((st) => {
        const sBranch = (st.branch || st.department || '').toLowerCase();
        const sSem = (st.semester || '').toLowerCase();
        const sSec = (st.section || '').toUpperCase();

        const aBranch = (activeAssignment.branch || '').toLowerCase();
        const aSem = (activeAssignment.semester || '').toLowerCase();
        const aSec = (activeAssignment.section || '').toUpperCase();

        return (
          (!aBranch || sBranch.includes(aBranch) || aBranch.includes(sBranch)) &&
          (!aSem || sSem.includes(aSem) || aSem.includes(sSem)) &&
          (!aSec || sSec === aSec)
        );
      })
    : assignedStudents;

  const totalClassStudents = classStudents.length || (totalClasses > 0 ? totalStudents : 0);

  // Module release state for current active class
  const classKey = activeAssignment ? ModuleReleaseService.getClassKey(activeAssignment) : 'default';
  const releasedModuleIds = ModuleReleaseService.getReleasedModuleIdsForClass(activeAssignment || classKey);

  // Current active module index & object
  const releasedIndices = R26_MODULES.map((m, idx) => (releasedModuleIds.includes(m.id) ? idx : -1)).filter(
    (idx) => idx !== -1
  );
  const currentModuleIndex = Math.max(0, ...releasedIndices);
  const currentModule = totalClasses > 0 ? R26_MODULES[currentModuleIndex] || R26_MODULES[0] : null;
  const nextModule = currentModuleIndex + 1 < R26_MODULES.length ? R26_MODULES[currentModuleIndex + 1] : null;

  // Compute student stats for current module
  let studentsCompletedCount = 0;
  classStudents.forEach((st) => {
    if ((st.overallProgressPercentage || 0) >= 100) {
      studentsCompletedCount++;
    }
  });

  const completionPercent = totalClassStudents > 0 ? Math.round((studentsCompletedCount / totalClassStudents) * 100) : 0;
  const studentsNeedingAttention = Math.max(0, totalClassStudents - studentsCompletedCount);

  // Pending reviews count from real assigned student portfolio submissions
  const pendingReviewsCount = assignedStudents.reduce((acc, st) => {
    const items = st.portfolioItems || [];
    return acc + items.filter((p) => p.status === 'Pending').length;
  }, 0);

  // Status Badge Configuration (Requirement 2)
  const getStatusDisplay = () => {
    switch (accountStatus) {
      case 'APPROVED':
        return {
          badgeText: 'APPROVED ✓',
          badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          message:
            totalClasses > 0
              ? 'Your Faculty Incharge account has been approved by the Administrator.'
              : 'Your Faculty Incharge account is approved, but no class has been assigned yet.'
        };
      case 'PENDING_APPROVAL':
        return {
          badgeText: 'PENDING APPROVAL',
          badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
          message: 'Your Faculty Incharge registration is currently under review by the Administrator.'
        };
      case 'REJECTED':
        return {
          badgeText: 'REJECTED',
          badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
          message: 'Your Faculty Incharge registration was not approved.'
        };
      case 'SUSPENDED':
        return {
          badgeText: 'SUSPENDED',
          badgeClass: 'bg-gray-100 text-gray-800 border-gray-300',
          message: 'Your Faculty Incharge account is currently suspended.'
        };
    }
  };

  const statusConfig = getStatusDisplay();

  return (
    <div className="space-y-6 text-[#2C3E50]">
      {/* 1. TOP FACULTY STATUS AREA (Requirement 2 & 14) */}
      <div className="bg-gradient-to-r from-[#2C3E50] via-[#34495E] to-[#1F2C38] text-white p-6 rounded-2xl border border-[#FAD7A0]/30 shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <p className="text-xs uppercase font-extrabold tracking-wider text-[#FAD7A0]">
              Faculty Incharge Workspace
            </p>
            <h1 className="text-2xl font-extrabold font-serif text-white mt-0.5">
              WELCOME, {facultyName.toUpperCase()}
            </h1>
            <p className="text-xs text-gray-300 mt-0.5 font-medium">Faculty Incharge</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-300">STATUS:</span>
            <span
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold border ${statusConfig.badgeClass}`}
            >
              {statusConfig.badgeText}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#FAD7A0] font-semibold pt-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusConfig.message}</span>
        </div>
      </div>

      {/* OPERATIONAL DASHBOARD GUARD (Requirement 2):
          If status is NOT approved, hide operational dashboard components */}
      {accountStatus !== 'APPROVED' ? (
        <div className="bg-white p-10 rounded-2xl border border-[#FAD7A0] text-center space-y-3">
          <Clock className="w-12 h-12 text-amber-500 mx-auto" />
          <h3 className="font-bold text-lg text-[#2C3E50]">Account Pending Administrative Approval</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Operational dashboard controls will be enabled automatically once an Administrator approves your account registration.
          </p>
        </div>
      ) : (
        <>
          {/* 2. FACULTY DASHBOARD SUMMARY ROW (Requirement 5) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: My Classes */}
            <div className="bg-white p-5 rounded-2xl border border-[#FAD7A0]/70 shadow-xs flex items-center gap-4 hover:border-[#D35400] transition-all">
              <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                  My Classes
                </p>
                <p className="text-2xl font-extrabold text-[#2C3E50]">{totalClasses}</p>
                <p className="text-[11px] text-blue-600 font-semibold mt-0.5">
                  Assigned Classes
                </p>
              </div>
            </div>

            {/* Card 2: My Students */}
            <div className="bg-white p-5 rounded-2xl border border-[#FAD7A0]/70 shadow-xs flex items-center gap-4 hover:border-[#D35400] transition-all">
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                  My Students
                </p>
                <p className="text-2xl font-extrabold text-[#2C3E50]">{totalStudents}</p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                  Assigned Roster
                </p>
              </div>
            </div>

            {/* Card 3: Current Module */}
            <div className="bg-white p-5 rounded-2xl border border-[#FAD7A0]/70 shadow-xs flex items-center gap-4 hover:border-[#D35400] transition-all">
              <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                  Current Module
                </p>
                <p className="text-sm font-extrabold text-[#2C3E50] truncate max-w-[170px]">
                  {currentModule ? `Module ${currentModuleIndex + 1}` : 'Not Started'}
                </p>
                <p className="text-[11px] text-amber-700 font-semibold mt-0.5 truncate max-w-[170px]">
                  {currentModule ? currentModule.title : 'No Module Released'}
                </p>
              </div>
            </div>

            {/* Card 4: Students Ready */}
            <div className="bg-white p-5 rounded-2xl border border-[#FAD7A0]/70 shadow-xs flex items-center gap-4 hover:border-[#D35400] transition-all">
              <div className="p-3 bg-purple-50 text-purple-700 rounded-xl">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                  Students Ready
                </p>
                <p className="text-2xl font-extrabold text-[#2C3E50]">
                  {studentsCompletedCount}
                </p>
                <p className="text-[11px] text-purple-600 font-semibold mt-0.5">
                  Ready for Next Module
                </p>
              </div>
            </div>
          </div>

          {/* 3. MY CLASSES CARD-BASED VIEW (Requirement 3 & 11) */}
          <div className="bg-white p-6 rounded-2xl border border-[#FAD7A0]/70 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#D35400]" />
                <h2 className="text-base font-extrabold font-serif text-[#2C3E50]">My Classes</h2>
              </div>
              <button
                onClick={() => onSelectTab('classes')}
                className="text-xs text-[#D35400] font-bold hover:underline"
              >
                View All Classes &rarr;
              </button>
            </div>

            {assignments.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <p className="text-xs text-gray-500 font-medium">
                  Your Faculty Incharge account is approved, but no class has been assigned yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assignments.map((assignment) => {
                  const classSts = assignedStudents.filter((st) => {
                    const sBranch = (st.branch || st.department || '').toLowerCase();
                    const sSem = (st.semester || '').toLowerCase();
                    const sSec = (st.section || '').toUpperCase();

                    const aBranch = (assignment.branch || '').toLowerCase();
                    const aSem = (assignment.semester || '').toLowerCase();
                    const aSec = (assignment.section || '').toUpperCase();

                    return (
                      (!aBranch || sBranch.includes(aBranch) || aBranch.includes(sBranch)) &&
                      (!aSem || sSem.includes(aSem) || aSem.includes(sSem)) &&
                      (!aSec || sSec === aSec)
                    );
                  });

                  const count = classSts.length;

                  return (
                    <div
                      key={assignment.id}
                      className="bg-[#FFF8F0]/40 p-4 rounded-xl border border-[#FAD7A0]/70 hover:border-[#D35400] transition space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md">
                          {assignment.semester} • Section {assignment.section}
                        </span>
                        <h3 className="font-extrabold text-sm text-[#2C3E50] font-serif">
                          {assignment.branch}
                        </h3>
                        <p className="text-xs text-gray-500">
                          Students: <span className="font-bold text-[#D35400]">{count}</span>
                        </p>
                      </div>

                      <button
                        onClick={() => onSelectTab('classes')}
                        className="w-full py-2 bg-[#D35400] hover:bg-[#E67E22] text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>View Class</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 4. MODULE PROGRESS & RELEASE NEXT MODULE (Requirement 8 & 9) */}
          {totalClasses > 0 && currentModule && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Module Progress Section */}
              <div className="bg-white p-6 rounded-2xl border border-[#FAD7A0]/70 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#D35400]" />
                    <h3 className="text-base font-extrabold font-serif text-[#2C3E50]">
                      Module Progress
                    </h3>
                  </div>
                  <button
                    onClick={() => onSelectTab('progress-monitor')}
                    className="text-xs text-[#D35400] font-bold hover:underline"
                  >
                    View Details &rarr;
                  </button>
                </div>

                <div className="space-y-3 bg-[#FFF8F0] p-4 rounded-xl border border-[#FAD7A0]/60">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#2C3E50]">
                      Module {currentModuleIndex + 1}: {currentModule.title}
                    </span>
                    <span className="font-extrabold text-[#D35400]">{completionPercent}%</span>
                  </div>

                  <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#D35400] to-[#E67E22] rounded-full"
                      style={{ width: `${completionPercent}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2">
                    <div className="p-2 bg-white rounded-lg border border-[#FAD7A0]/50">
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Students Completed</p>
                      <p className="font-extrabold text-[#2C3E50] text-sm">
                        {studentsCompletedCount} / {totalClassStudents}
                      </p>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-[#FAD7A0]/50">
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Students Ready</p>
                      <p className="font-extrabold text-emerald-700 text-sm">{studentsCompletedCount}</p>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-[#FAD7A0]/50">
                      <p className="text-[10px] text-gray-500 uppercase font-bold">Needs Attention</p>
                      <p className="font-extrabold text-rose-700 text-sm">{studentsNeedingAttention}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Release Next Module Section */}
              <div className="bg-white p-6 rounded-2xl border border-[#FAD7A0]/70 shadow-xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Unlock className="w-5 h-5 text-[#D35400]" />
                      <h3 className="text-base font-extrabold font-serif text-[#2C3E50]">
                        Release Next Module
                      </h3>
                    </div>
                    <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-md text-[10px] font-bold">
                      EXPLICIT RELEASE
                    </span>
                  </div>

                  {nextModule ? (
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500">
                        Current Module: <span className="font-bold text-[#2C3E50]">{currentModule.title}</span> ({completionPercent}% completed)
                      </p>
                      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                        <p className="font-bold text-xs text-amber-900">
                          Next Module: Module {currentModuleIndex + 2} — {nextModule.title}
                        </p>
                        <p className="text-[11px] text-gray-600">{nextModule.shortDesc}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>All modules have been released for this class.</span>
                    </div>
                  )}
                </div>

                {nextModule && (
                  <button
                    onClick={() => onSelectTab('release-modules')}
                    className="w-full py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer mt-3"
                  >
                    <span>Go to Module Release Control</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 5. FACULTY SCORING & PENDING REVIEWS (Requirement 12 & 13) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Faculty Module Scoring Quick Action */}
            <div className="bg-white p-6 rounded-2xl border border-[#FAD7A0]/70 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#D35400]" />
                  <h3 className="font-extrabold text-sm font-serif text-[#2C3E50]">
                    Module Scoring (1–10)
                  </h3>
                </div>
                <button
                  onClick={() => onSelectTab('module-scoring')}
                  className="text-xs text-[#D35400] font-bold hover:underline cursor-pointer"
                >
                  Score &rarr;
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <p className="text-gray-600">
                  Directly evaluate student lab performance across released modules on an official 1–10 scale.
                </p>
                <button
                  onClick={() => onSelectTab('module-scoring')}
                  className="w-full py-2 bg-[#FFF8F0] hover:bg-[#FAD7A0]/40 text-[#D35400] border border-[#FAD7A0] font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Open Scoring Workbench</span>
                </button>
              </div>
            </div>

            {/* Pending Reviews */}
            <div className="bg-white p-6 rounded-2xl border border-[#FAD7A0]/70 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-[#D35400]" />
                  <h3 className="font-extrabold text-sm font-serif text-[#2C3E50]">
                    AI Audio Reviews
                  </h3>
                </div>
                <button
                  onClick={() => onSelectTab('assessments')}
                  className="text-xs text-[#D35400] font-bold hover:underline"
                >
                  Review All &rarr;
                </button>
              </div>

              {pendingReviewsCount === 0 ? (
                <p className="text-xs text-gray-500 py-3">No pending audio reviews.</p>
              ) : (
                <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1 text-xs">
                  <p className="font-bold text-amber-900">
                    {pendingReviewsCount} student submission{pendingReviewsCount === 1 ? '' : 's'} awaiting review
                  </p>
                  <p className="text-[11px] text-gray-600">
                    Students have submitted practice tasks requiring faculty feedback.
                  </p>
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="bg-white p-6 rounded-2xl border border-[#FAD7A0]/70 shadow-xs space-y-3">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
                <Bell className="w-5 h-5 text-[#D35400]" />
                <h3 className="font-extrabold text-sm font-serif text-[#2C3E50]">
                  Faculty Notifications
                </h3>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-[11px] font-medium">Faculty Incharge account approved.</span>
                </div>
                {totalClasses > 0 && (
                  <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-2 text-blue-900">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="text-[11px] font-medium">
                      Assigned to {assignments.map((a) => `${a.branch} (${a.section})`).join(', ')}.
                    </span>
                  </div>
                )}
                {totalStudents > 0 && (
                  <div className="p-2.5 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-2 text-amber-900">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="text-[11px] font-medium">
                      {totalStudents} student{totalStudents === 1 ? '' : 's'} assigned to your workspace.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

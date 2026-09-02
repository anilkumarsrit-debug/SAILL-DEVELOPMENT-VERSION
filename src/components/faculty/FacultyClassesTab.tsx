import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import { FacultyAssignment } from '../../types/academic';
import { R26_MODULES } from '../../data/modulesData';
import { ModuleReleaseService } from '../../services/ModuleReleaseService';
import {
  GraduationCap,
  Users,
  BookOpen,
  ChevronRight,
  TrendingUp,
  Award,
  ArrowLeft,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface FacultyClassesTabProps {
  assignments: FacultyAssignment[];
  assignedStudents: StudentProfile[];
  facultyName: string;
  onSelectStudent: (student: StudentProfile) => void;
  onSelectTab: (tabKey: any) => void;
}

export const FacultyClassesTab: React.FC<FacultyClassesTabProps> = ({
  assignments,
  assignedStudents,
  facultyName,
  onSelectStudent,
  onSelectTab
}) => {
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);

  const selectedAssignment = assignments.find((a) => a.id === selectedAssignmentId) || null;

  // Filter students for a given assignment
  const getStudentsForAssignment = (assignment: FacultyAssignment) => {
    return assignedStudents.filter((st) => {
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
  };

  if (assignments.length === 0) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-[#FAD7A0] text-center space-y-3">
        <GraduationCap className="w-12 h-12 text-gray-300 mx-auto" />
        <h3 className="font-bold text-lg text-[#2C3E50]">No Classes Assigned</h3>
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          Your Faculty Incharge account is approved, but no class has been assigned yet.
        </p>
      </div>
    );
  }

  // Selected Class Overview View
  if (selectedAssignment) {
    const classStudents = getStudentsForAssignment(selectedAssignment);
    const totalCount = classStudents.length || 0;

    const classKey = ModuleReleaseService.getClassKey(selectedAssignment);
    const releasedIds = ModuleReleaseService.getReleasedModuleIdsForClass(selectedAssignment);
    const currentModule = R26_MODULES.find((m) => releasedIds.includes(m.id)) || R26_MODULES[0];

    // Compute aggregate completion
    let completionSum = 0;
    classStudents.forEach((st) => {
      completionSum += st.overallProgressPercentage || st.overallScore || 0;
    });
    const avgClassCompletion = totalCount > 0 ? Math.round(completionSum / totalCount) : 0;

    return (
      <div className="space-y-6 text-[#2C3E50]">
        {/* Back Button & Class Overview Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedAssignmentId(null)}
            className="px-3.5 py-2 bg-white border border-[#FAD7A0] hover:bg-[#FFF8F0] text-[#D35400] font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Classes</span>
          </button>
        </div>

        {/* CLASS OVERVIEW BANNER (Requirement 7) */}
        <div className="bg-gradient-to-r from-[#2C3E50] via-[#34495E] to-[#1F2C38] text-white p-6 rounded-2xl border border-[#FAD7A0]/30 shadow-md space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="px-3 py-1 bg-[#D35400] text-white rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                Class Overview
              </span>
              <h2 className="text-2xl font-extrabold font-serif text-[#FAD7A0] mt-1">
                {selectedAssignment.branch}
              </h2>
              <p className="text-xs text-gray-200 mt-0.5">
                {selectedAssignment.semester} • Section {selectedAssignment.section} • Academic Year {selectedAssignment.academicYear || '2026–27'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-gray-300">Faculty Incharge</p>
              <p className="font-bold text-sm text-[#FAD7A0]">{facultyName}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-1">
            <div className="bg-white/10 p-3 rounded-xl border border-white/10">
              <span className="text-gray-300 text-[11px]">Total Students:</span>
              <p className="text-lg font-extrabold text-white">{totalCount}</p>
            </div>
            <div className="bg-white/10 p-3 rounded-xl border border-white/10">
              <span className="text-gray-300 text-[11px]">Current Module:</span>
              <p className="text-sm font-bold text-[#FAD7A0] truncate">{currentModule.title}</p>
            </div>
            <div className="bg-white/10 p-3 rounded-xl border border-white/10">
              <span className="text-gray-300 text-[11px]">Class Completion:</span>
              <p className="text-lg font-extrabold text-emerald-400">{avgClassCompletion}%</p>
            </div>
            <div className="bg-white/10 p-3 rounded-xl border border-white/10 flex items-center justify-center">
              <button
                onClick={() => onSelectTab('release-modules')}
                className="px-3.5 py-2 bg-[#D35400] hover:bg-[#E67E22] text-white font-bold text-xs rounded-xl transition shadow-sm cursor-pointer w-full"
              >
                Release Module &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Student List in Class */}
        <div className="bg-white p-6 rounded-2xl border border-[#FAD7A0]/70 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-bold text-base font-serif text-[#2C3E50]">
              Class Roster ({totalCount} Students)
            </h3>
            <button
              onClick={() => onSelectTab('students')}
              className="text-xs text-[#D35400] font-bold hover:underline"
            >
              View Full Student Roster &rarr;
            </button>
          </div>

          {classStudents.length === 0 ? (
            <p className="text-xs text-gray-500 py-6 text-center">
              No students have been assigned to this class yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {classStudents.map((st) => {
                const progress = st.overallProgressPercentage || st.overallScore || 0;
                return (
                  <div
                    key={st.rollNo}
                    onClick={() => onSelectStudent(st)}
                    className="p-4 bg-[#FFF8F0]/60 hover:bg-[#FFF8F0] border border-[#FAD7A0]/60 hover:border-[#D35400] rounded-2xl cursor-pointer transition space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#2C3E50] text-[#FAD7A0] font-extrabold text-sm flex items-center justify-center shrink-0">
                        {st.name.charAt(0) || 'S'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs text-[#2C3E50] truncate">{st.name}</h4>
                        <p className="text-[11px] font-mono text-gray-500">{st.rollNo}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-gray-600 font-medium">Progress</span>
                        <span className="font-bold text-[#D35400]">{progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#D35400] rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // All Assigned Classes Grid View
  return (
    <div className="space-y-6 text-[#2C3E50]">
      {/* Title Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#FAD7A0]/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-[11px] font-bold mb-1">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Assigned Classes</span>
          </div>
          <h2 className="text-xl font-extrabold font-serif text-[#2C3E50]">My Classes</h2>
          <p className="text-xs text-gray-500">
            You are currently responsible for {assignments.length} class{assignments.length === 1 ? '' : 'es'}.
          </p>
        </div>
      </div>

      {/* Class Cards Grid (Requirement 3) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {assignments.map((assignment) => {
          const classStudents = getStudentsForAssignment(assignment);
          const studentCount = classStudents.length;

          return (
            <div
              key={assignment.id}
              className="bg-white p-6 rounded-2xl border border-[#FAD7A0]/80 hover:border-[#D35400] shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-3">
                  <div>
                    <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 font-bold text-[10px] rounded-md border border-blue-100">
                      {assignment.semester}
                    </span>
                    <h3 className="font-extrabold text-base text-[#2C3E50] font-serif mt-1 group-hover:text-[#D35400] transition">
                      {assignment.branch}
                    </h3>
                  </div>
                  <span className="px-3 py-1 bg-[#2C3E50] text-[#FAD7A0] font-bold text-xs rounded-xl">
                    Section {assignment.section}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-gray-600 bg-[#FFF8F0] p-3.5 rounded-xl border border-[#FAD7A0]/50">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-500">Academic Year:</span>
                    <span className="font-bold text-[#2C3E50]">{assignment.academicYear || '2026–27'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-500">Students Assigned:</span>
                    <span className="font-bold text-[#D35400]">{studentCount} Students</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSelectedAssignmentId(assignment.id)}
                  className="w-full py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>View Class</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

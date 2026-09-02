import React from 'react';
import { FacultyAssignment } from '../../types/academic';
import { StudentProfile } from '../../types';
import { FacultyAssignmentService } from '../../services/FacultyAssignmentService';
import {
  Target,
  Building2,
  GraduationCap,
  Calendar,
  BookOpen,
  Users,
  ShieldCheck,
  Lock,
  Layers
} from 'lucide-react';

interface FacultyAssignmentsTabProps {
  assignments: FacultyAssignment[];
  allStudents: StudentProfile[];
}

export const FacultyAssignmentsTab: React.FC<FacultyAssignmentsTabProps> = ({
  assignments,
  allStudents
}) => {
  return (
    <div className="space-y-6 text-[#2C3E50]">
      {/* Title Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#FAD7A0]/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-[11px] font-bold mb-1">
            <Target className="w-3.5 h-3.5" />
            <span>Assigned Academic Scope</span>
          </div>
          <h2 className="text-xl font-extrabold font-serif text-[#2C3E50]">My Academic Group Assignments</h2>
          <p className="text-xs text-gray-500">
            Official SAILL Faculty Allocation mapped by Institutional Administration
          </p>
        </div>

        <div className="px-3.5 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-800 flex items-center gap-1.5 shrink-0">
          <Lock className="w-4 h-4 text-amber-600" />
          <span>Read-Only Official View</span>
        </div>
      </div>

      {/* Read Only Governance Notice Banner */}
      <div className="p-4 bg-gradient-to-r from-[#2C3E50] to-[#1F2C38] text-white rounded-2xl border border-[#FAD7A0]/30 shadow-xs flex items-center gap-3">
        <ShieldCheck className="w-6 h-6 text-[#FAD7A0] shrink-0" />
        <div className="text-xs">
          <p className="font-bold text-[#FAD7A0]">Institutional Governance & Data Privacy</p>
          <p className="text-gray-300 mt-0.5">
            Academic group assignments are locked to prevent cross-section access. To request changes or re-allocation of sections, please contact the SAILL Administrator.
          </p>
        </div>
      </div>

      {/* Assignments Display List / Grid */}
      {assignments.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-[#FAD7A0] text-center space-y-3">
          <Target className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="font-bold text-base text-[#2C3E50]">No Active Group Assignments</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            You do not currently have any active section allocations assigned by Administrator.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {assignments.map((assignment) => {
            // Compute student count matching this specific assignment
            const matchingStudents = FacultyAssignmentService.getAssignedStudentsForFaculty(
              assignment.facultyId,
              allStudents
            ).filter((st) => {
              const sSec = (st.section || '').toUpperCase();
              const aSec = assignment.section.toUpperCase();
              return sSec.includes(aSec) || aSec.includes(sSec);
            });

            const count = matchingStudents.length || Math.floor(allStudents.length / assignments.length);

            return (
              <div
                key={assignment.id}
                className="bg-white p-6 rounded-2xl border border-[#FAD7A0]/70 shadow-xs space-y-4 hover:border-[#D35400] transition-all"
              >
                {/* Header: Branch & Section */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="space-y-0.5">
                    <span className="px-2.5 py-0.5 bg-[#D35400] text-white text-[10px] font-extrabold rounded-md uppercase">
                      Section {assignment.section}
                    </span>
                    <h3 className="font-bold text-base text-[#2C3E50] mt-1">{assignment.branch}</h3>
                  </div>
                  <div className="p-3 bg-blue-50 text-blue-700 rounded-xl text-center">
                    <p className="text-[10px] font-bold uppercase text-gray-400">Enrolled</p>
                    <p className="text-lg font-extrabold text-[#2C3E50]">{count}</p>
                  </div>
                </div>

                {/* Scope Metadata Details */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building2 className="w-4 h-4 text-[#D35400] shrink-0" />
                    <span><strong className="text-[#2C3E50]">Department:</strong> {assignment.department}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <GraduationCap className="w-4 h-4 text-[#D35400] shrink-0" />
                    <span><strong className="text-[#2C3E50]">Branch:</strong> {assignment.branch}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4 text-[#D35400] shrink-0" />
                    <span><strong className="text-[#2C3E50]">Academic Year:</strong> {assignment.academicYear}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <BookOpen className="w-4 h-4 text-[#D35400] shrink-0" />
                    <span><strong className="text-[#2C3E50]">Semester:</strong> {assignment.semester}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Layers className="w-4 h-4 text-[#D35400] shrink-0" />
                    <span><strong className="text-[#2C3E50]">Section:</strong> {assignment.section}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4 text-[#D35400] shrink-0" />
                    <span><strong className="text-[#2C3E50]">Assigned Student Count:</strong> {count} Students</span>
                  </div>
                </div>

                {/* Footer Metadata */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                  <span>Assigned By: {assignment.assignedBy}</span>
                  <span>Date: {assignment.assignedDate}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

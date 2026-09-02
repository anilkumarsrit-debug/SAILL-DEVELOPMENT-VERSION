import React, { useState } from 'react';
import {
  GraduationCap,
  Search,
  Filter,
  UserCheck,
  UserPlus,
  KeyRound,
  Trash2,
  Building2,
  Layers,
  Award,
  TrendingUp,
  BookOpen,
  Sparkles,
  XCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { StudentProfile, FacultyAccount } from '../../types';
import { FacultyAssignment } from '../../types/academic';
import { dbStorage } from '../../lib/db';
import { FacultyAssignmentService } from '../../services/FacultyAssignmentService';

interface StudentCardsTabProps {
  studentsList: StudentProfile[];
  facultyList: FacultyAccount[];
  assignmentsList: FacultyAssignment[];
  onResetPassword?: (rollNo: string, name: string) => void;
  onDeleteStudent?: (rollNo: string, name: string) => void;
  onRefreshData?: () => void;
}

export const StudentCardsTab: React.FC<StudentCardsTabProps> = ({
  studentsList,
  facultyList,
  assignmentsList,
  onResetPassword,
  onDeleteStudent,
  onRefreshData
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [sectionFilter, setSectionFilter] = useState('ALL');

  // Allocation Modal State
  const [assignModal, setAssignModal] = useState<{
    isOpen: boolean;
    student: StudentProfile | null;
    selectedFacultyId: string;
    filterMode: 'RECOMMENDED' | 'ALL';
    searchQuery: string;
  }>({
    isOpen: false,
    student: null,
    selectedFacultyId: '',
    filterMode: 'RECOMMENDED',
    searchQuery: ''
  });

  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleOpenAssignModal = (student: StudentProfile) => {
    const activeFaculty = facultyList.filter(
      (f) => (f.status as string)?.toLowerCase() === 'active' || (f.status as string)?.toLowerCase() === 'approved'
    );

    let initialSelectedId = '';
    if (student.assignedFacultyId) {
      const existing = activeFaculty.find(
        (f) => f.employeeId.toUpperCase() === student.assignedFacultyId?.toUpperCase()
      );
      if (existing) initialSelectedId = existing.employeeId;
    }

    setAssignModal({
      isOpen: true,
      student,
      selectedFacultyId: initialSelectedId,
      filterMode: 'RECOMMENDED',
      searchQuery: ''
    });
  };

  const handleSaveStudentFacultyAssignment = async () => {
    if (!assignModal.student || !assignModal.selectedFacultyId) return;

    try {
      const selectedFac = facultyList.find(
        (f) => f.employeeId.toUpperCase() === assignModal.selectedFacultyId.toUpperCase()
      );

      if (!selectedFac) {
        alert('Selected Faculty Incharge not found.');
        return;
      }

      await dbStorage.assignFacultyToStudent(
        assignModal.student.rollNo,
        selectedFac.employeeId,
        'Administrator'
      );

      const studentBranch = assignModal.student.branch || assignModal.student.department || 'CIV';
      const studentSec = assignModal.student.section || 'A';
      const studentYear = assignModal.student.academicYear || '2026–2027';
      const studentSem = assignModal.student.semester || 'Semester II';

      try {
        await FacultyAssignmentService.createAssignment(
          {
            facultyId: selectedFac.employeeId,
            facultyName: selectedFac.fullName,
            department: selectedFac.department || 'Civil Engineering',
            branch: studentBranch,
            academicYear: studentYear,
            semester: studentSem,
            section: studentSec,
            isOverride: true
          },
          'Administrator'
        );
      } catch {
        // Duplicate override expected
      }

      showToast(`Faculty Incharge '${selectedFac.fullName}' assigned to ${assignModal.student.name} (${assignModal.student.rollNo}).`);
      setAssignModal({
        isOpen: false,
        student: null,
        selectedFacultyId: '',
        filterMode: 'RECOMMENDED',
        searchQuery: ''
      });

      if (onRefreshData) {
        onRefreshData();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to assign Faculty Incharge.');
    }
  };

  // Helper to resolve Faculty Incharge for a student
  const getFacultyIncharge = (student: StudentProfile) => {
    if (student.assignedFacultyName && !student.assignedFacultyName.includes('No Faculty') && !student.assignedFacultyName.includes('Not Assigned')) {
      return student.assignedFacultyName;
    }

    const studentBranch = student.branch || student.department || '';
    const studentSec = student.section || 'A';

    const assignment = assignmentsList.find(
      (a) =>
        a.status === 'ACTIVE' &&
        (a.branch.includes(studentBranch) || studentBranch.includes(a.branch)) &&
        a.section === studentSec
    );

    if (assignment) {
      return assignment.facultyName;
    }

    // Fallback search
    const matchedFac = facultyList.find((f) => f.department.includes(studentBranch));
    return matchedFac ? matchedFac.fullName : 'Not Assigned';
  };

  // Unique branches & sections
  const branches = Array.from(new Set(studentsList.map((s) => s.branch || s.department))).filter(Boolean);
  const sections = Array.from(new Set(studentsList.map((s) => s.section))).filter(Boolean);

  // Filter students
  const filteredStudents = studentsList.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());

    const studentBranch = s.branch || s.department || '';
    const matchesBranch = branchFilter === 'ALL' || studentBranch.includes(branchFilter);
    const matchesSection = sectionFilter === 'ALL' || s.section === sectionFilter;

    return matchesSearch && matchesBranch && matchesSection;
  });

  return (
    <div className="space-y-6 text-[#2C3E50]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D35400]">
            Student Academic Records
          </span>
          <h2 className="text-xl font-black text-[#2C3E50]">Enrolled Student Profiles</h2>
          <p className="text-xs text-[#5D6D7E] mt-0.5">
            View student cards, mapped faculty incharges, R26 lab competency progress, and credentials.
          </p>
        </div>

        <div className="px-3 py-1.5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-xs font-bold text-[#D35400] shrink-0">
          Total Enrolled: {studentsList.length} Students
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student by name, roll no, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs font-bold text-[#5D6D7E]">Program:</span>
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
            >
              <option value="ALL">All Programs</option>
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#5D6D7E]">Section:</span>
            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
            >
              <option value="ALL">All Sections</option>
              {sections.map((sec) => (
                <option key={sec} value={sec}>
                  Section {sec}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* STUDENT CARDS GRID */}
      {filteredStudents.length === 0 ? (
        <div className="p-8 bg-white rounded-2xl border border-gray-200 text-center text-gray-500 font-medium">
          No student profiles found matching your search or filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student) => {
            const facultyName = getFacultyIncharge(student);
            const isPending = student.status === 'PENDING_APPROVAL' || (student.status as string) === 'pending';
            const isRejected = student.status === 'REJECTED' || (student.status as string) === 'rejected';
            const isActive = !isPending && !isRejected;

            const isAssigned =
              facultyName &&
              !facultyName.includes('No Faculty') &&
              !facultyName.includes('Not Assigned');

            // Progress from real XP
            const progress = student.xp ? Math.min(100, Math.round((student.xp / 1000) * 100)) : 0;

            const initials = student.name
              .split(' ')
              .filter(Boolean)
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase();

            return (
              <div
                key={student.rollNo}
                className="bg-white rounded-2xl border border-gray-200 shadow-2xs hover:shadow-md transition p-5 flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                {/* Header with Photo Placeholder */}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1F2C38] to-[#27AE60] text-white flex items-center justify-center font-black text-sm shadow-md border-2 border-white shrink-0">
                    {initials || 'ST'}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-bold text-sm text-[#2C3E50] truncate">{student.name}</h3>
                      {isPending ? (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 font-extrabold text-[9px] rounded-md shrink-0">
                          PENDING
                        </span>
                      ) : isRejected ? (
                        <span className="px-2 py-0.5 bg-rose-100 text-rose-800 border border-rose-300 font-extrabold text-[9px] rounded-md shrink-0">
                          REJECTED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold text-[9px] rounded-md shrink-0">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-mono font-bold text-[#D35400] mt-0.5">
                      Roll: {student.rollNo}
                    </div>
                    <p className="text-[11px] font-medium text-gray-500 mt-0.5 truncate">{student.email}</p>
                  </div>
                </div>

                {/* Branch, Section & Faculty Incharge */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-[10px] font-extrabold uppercase text-[#5D6D7E]">Branch & Section</span>
                    <span className="font-bold text-[#2C3E50]">
                      {student.branch || student.department} • Sec {student.section || 'A'}
                    </span>
                  </div>

                  <div className="p-3 bg-[#FFF8F0] rounded-xl border border-[#FAD7A0] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase text-[#D35400]">Faculty Incharge</span>
                      <span className="font-bold text-[#2C3E50] truncate max-w-[150px]">
                        {isPending ? 'Not Assigned' : (isAssigned ? facultyName : 'Not Assigned')}
                      </span>
                    </div>

                    {isPending ? (
                      <div className="pt-1.5 border-t border-[#FAD7A0]/60 text-[10px] font-semibold text-amber-800 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Approve the student before assigning a Faculty Incharge.</span>
                      </div>
                    ) : (
                      <div className="pt-2 border-t border-[#FAD7A0]/60">
                        <button
                          type="button"
                          onClick={() => handleOpenAssignModal(student)}
                          className={`w-full py-1.5 px-3 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                            isAssigned
                              ? 'bg-white border border-[#FAD7A0] text-[#D35400] hover:bg-[#FAD7A0]/40'
                              : 'bg-[#D35400] hover:bg-[#E67E22] text-white shadow-2xs'
                          }`}
                        >
                          {isAssigned ? <UserCheck className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                          <span>{isAssigned ? 'Change Faculty' : 'Assign Faculty'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Overall Progress Indicator */}
                <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                    <span className="flex items-center gap-1 text-[11px]">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                      R26 Lab Progress
                    </span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-emerald-200/80 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onResetPassword?.(student.rollNo, student.name)}
                    className="flex-1 py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-[11px] rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Reset Pass</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteStudent?.(student.rollNo, student.name)}
                    className="py-1.5 px-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-[11px] rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                    title="Remove Profile"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Toast Banner */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-600 text-white font-bold text-xs rounded-2xl shadow-2xl flex items-center gap-3 animate-slideUp">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toast}</span>
        </div>
      )}

      {/* Assign Faculty Allocation Modal */}
      {assignModal.isOpen && assignModal.student && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-3xl border-2 border-[#FAD7A0] shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#FFF8F0] text-[#D35400] rounded-xl border border-[#FAD7A0]">
                  <UserPlus className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#2C3E50]">
                    {assignModal.student.assignedFacultyName && !assignModal.student.assignedFacultyName.includes('No Faculty') && !assignModal.student.assignedFacultyName.includes('Not Assigned')
                      ? 'Change Faculty Incharge'
                      : 'Assign Faculty Incharge'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Assign an approved Faculty Incharge to this student
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAssignModal({ isOpen: false, student: null, selectedFacultyId: '', filterMode: 'RECOMMENDED', searchQuery: '' })}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Target Student Academic Context Summary */}
            <div className="bg-[#FFF8F0] p-4 rounded-xl border border-[#FAD7A0] space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-[#2C3E50]">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#D35400]" />
                  <span className="text-sm font-extrabold">{assignModal.student.name}</span>
                  <span className="font-mono text-[#D35400]">({assignModal.student.rollNo})</span>
                </div>
                <span className="px-2.5 py-0.5 bg-white border border-[#FAD7A0] rounded-md text-[10px] font-extrabold text-[#D35400]">
                  {assignModal.student.branch || assignModal.student.department || 'CSE'} • Section {assignModal.student.section || 'A'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-[#FAD7A0]/60 text-[11px] text-gray-700">
                <div>
                  <span className="text-gray-500 block text-[10px] font-bold uppercase">Academic Year</span>
                  <span className="font-bold">{assignModal.student.year || assignModal.student.academicYear || 'I Year'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] font-bold uppercase">Semester</span>
                  <span className="font-bold">{assignModal.student.semester || 'Semester I'}</span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-gray-500 block text-[10px] font-bold uppercase">Current Faculty Incharge</span>
                  <span className="font-bold text-[#2C3E50]">
                    {assignModal.student.assignedFacultyName && !assignModal.student.assignedFacultyName.includes('No Faculty') && !assignModal.student.assignedFacultyName.includes('Not Assigned')
                      ? assignModal.student.assignedFacultyName
                      : 'Not Assigned'}
                  </span>
                </div>
              </div>
            </div>

            {/* Faculty Selection Section */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                <label className="text-xs font-extrabold text-[#2C3E50] uppercase tracking-wider flex items-center gap-1">
                  <span>Select Active Faculty Incharge</span>
                  <span className="text-rose-500">*</span>
                </label>

                {/* Filter Mode Toggle */}
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setAssignModal((prev) => ({ ...prev, filterMode: 'RECOMMENDED' }))}
                    className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                      assignModal.filterMode === 'RECOMMENDED'
                        ? 'bg-white text-[#D35400] shadow-xs'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    Recommended Scope Matches
                  </button>
                  <button
                    type="button"
                    onClick={() => setAssignModal((prev) => ({ ...prev, filterMode: 'ALL' }))}
                    className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                      assignModal.filterMode === 'ALL'
                        ? 'bg-white text-[#D35400] shadow-xs'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    All Active Faculty
                  </button>
                </div>
              </div>

              {/* Search Faculty */}
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search faculty name, employee ID, or department..."
                  value={assignModal.searchQuery}
                  onChange={(e) => setAssignModal((prev) => ({ ...prev, searchQuery: e.target.value }))}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#D35400] outline-none"
                />
              </div>

              {/* Faculty List Options */}
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1 border border-gray-100 p-2 rounded-xl bg-gray-50/50">
                {(() => {
                  const activeFacultyList = facultyList.filter(
                    (f) => (f.status as string)?.toLowerCase() === 'active' || (f.status as string)?.toLowerCase() === 'approved'
                  );

                  if (activeFacultyList.length === 0) {
                    return (
                      <div className="p-6 text-center text-xs text-gray-400">
                        No active/approved Faculty Incharges found in the system.
                      </div>
                    );
                  }

                  const studentBranch = (assignModal.student.branch || assignModal.student.department || '').toLowerCase();
                  const studentSec = (assignModal.student.section || 'A').toUpperCase();

                  const filtered = activeFacultyList.filter((f) => {
                    const matchesSearch =
                      f.fullName.toLowerCase().includes(assignModal.searchQuery.toLowerCase()) ||
                      f.employeeId.toLowerCase().includes(assignModal.searchQuery.toLowerCase()) ||
                      f.department.toLowerCase().includes(assignModal.searchQuery.toLowerCase());

                    if (!matchesSearch) return false;

                    if (assignModal.filterMode === 'RECOMMENDED') {
                      const facAssignments = FacultyAssignmentService.getAssignmentsForFaculty(f.employeeId);
                      const deptMatch = f.department.toLowerCase().includes(studentBranch) || studentBranch.includes(f.department.toLowerCase());
                      const scopeMatch = facAssignments.some((a) => {
                        const bMatch = a.branch.toLowerCase().includes(studentBranch) || studentBranch.includes(a.branch.toLowerCase());
                        const sMatch = a.section.toUpperCase().includes(studentSec);
                        return bMatch || sMatch;
                      });
                      return deptMatch || scopeMatch || facAssignments.length === 0;
                    }

                    return true;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="p-6 text-center text-xs text-gray-400">
                        No faculty members match the filter criteria. Switch to "All Active Faculty" to view all active incharges.
                      </div>
                    );
                  }

                  return filtered.map((f) => {
                    const facAssignments = FacultyAssignmentService.getAssignmentsForFaculty(f.employeeId);
                    const isSelected = assignModal.selectedFacultyId.toUpperCase() === f.employeeId.toUpperCase();

                    const isRecommended =
                      f.department.toLowerCase().includes(studentBranch) ||
                      studentBranch.includes(f.department.toLowerCase()) ||
                      facAssignments.some((a) => a.branch.toLowerCase().includes(studentBranch) && a.section.toUpperCase().includes(studentSec));

                    return (
                      <div
                        key={f.employeeId}
                        onClick={() => setAssignModal((prev) => ({ ...prev, selectedFacultyId: f.employeeId }))}
                        className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-amber-50/80 border-[#D35400] ring-1 ring-[#D35400]'
                            : 'bg-white border-gray-200 hover:border-[#FAD7A0] hover:bg-gray-50'
                        }`}
                      >
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#2C3E50]">{f.fullName}</span>
                            <span className="font-mono text-[10px] text-gray-500">({f.employeeId})</span>
                            {isRecommended && (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full text-[9px] font-extrabold flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-emerald-600" />
                                Recommended Scope Match
                              </span>
                            )}
                          </div>

                          <div className="text-[11px] text-gray-600 font-medium">
                            {f.department} • {f.designation || 'Faculty Incharge'}
                          </div>
                        </div>

                        <div className="shrink-0">
                          <input
                            type="radio"
                            name="selectedFaculty"
                            checked={isSelected}
                            onChange={() => setAssignModal((prev) => ({ ...prev, selectedFacultyId: f.employeeId }))}
                            className="w-4 h-4 text-[#D35400] focus:ring-[#D35400]"
                          />
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setAssignModal({ isOpen: false, student: null, selectedFacultyId: '', filterMode: 'RECOMMENDED', searchQuery: '' })}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!assignModal.selectedFacultyId}
                onClick={handleSaveStudentFacultyAssignment}
                className="px-5 py-2 bg-[#D35400] hover:bg-[#E67E22] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Faculty Assignment</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

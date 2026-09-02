import React, { useState, useEffect } from 'react';
import {
  X,
  UserCheck,
  Building2,
  Mail,
  Phone,
  Calendar,
  Layers,
  BookOpen,
  Users,
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Plus,
  Trash2,
  Power,
  Shield,
  ShieldCheck,
  History,
  Sparkles,
  Search,
  ChevronRight,
  GitBranch,
  RefreshCw
} from 'lucide-react';
import { FacultyAccount, StudentProfile, AuditLogRecord } from '../../types';
import { FacultyAssignment, FacultyAssignmentPayload } from '../../types/academic';
import { FacultyAssignmentService } from '../../services/FacultyAssignmentService';
import { AcademicStructureService } from '../../services/AcademicStructureService';
import { AuthService } from '../../services/AuthService';
import { dbStorage } from '../../lib/db';

interface FacultyAllocationDrawerProps {
  isOpen: boolean;
  faculty: FacultyAccount | null;
  allStudents: StudentProfile[];
  assignmentsList: FacultyAssignment[];
  onClose: () => void;
  onAllocationUpdated: () => void;
}

export const FacultyAllocationDrawer: React.FC<FacultyAllocationDrawerProps> = ({
  isOpen,
  faculty,
  allStudents,
  assignmentsList,
  onClose,
  onAllocationUpdated
}) => {
  if (!isOpen || !faculty) return null;

  const currentUser = AuthService.getCurrentUser();
  const isBootstrapAdmin =
    currentUser?.role === 'BOOTSTRAP_ADMIN' ||
    currentUser?.username === 'BOOTSTRAP_ADMIN' ||
    currentUser?.role === 'ADMINISTRATOR';

  // Active drawer tab
  const [activeDrawerTab, setActiveDrawerTab] = useState<'allocation' | 'students' | 'modules' | 'audit'>('allocation');

  // Academic structure options
  const [departments, setDepartments] = useState<string[]>([]);
  const [branches, setBranches] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [semesters, setSemesters] = useState<string[]>([]);
  const [availableSections, setAvailableSections] = useState<string[]>([]);

  // Form state
  const [selectedDept, setSelectedDept] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [isOverride, setIsOverride] = useState<boolean>(false);

  // Status feedback
  const [formError, setFormError] = useState<string>('');
  const [formSuccess, setFormSuccess] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Student search inside drawer
  const [studentQuery, setStudentQuery] = useState<string>('');

  // Audit logs state
  const [facultyAuditLogs, setFacultyAuditLogs] = useState<AuditLogRecord[]>([]);

  // Load structure dropdowns & faculty data on mount
  useEffect(() => {
    loadStructureOptions();
    loadAuditLogs();
  }, [faculty.employeeId]);

  const loadStructureOptions = () => {
    const depts = AcademicStructureService.getDepartments().map((d) => d.name);
    const brs = AcademicStructureService.getBranches().map((b) => b.name);
    const yrs = AcademicStructureService.getAcademicYears().map((y) => y.yearName);
    const sems = AcademicStructureService.getSemesters().map((s) => s.semesterName);
    const secs = ['Section A', 'Section B', 'Section C', 'Section D'];

    const defaultDepts = depts.length
      ? depts
      : ['Humanities & Sciences (English)', 'Computer Science & Engineering (CSE)'];
    const defaultBrs = brs.length
      ? brs
      : [
          'Computer Science & Engineering (CSE)',
          'Electronics & Communication Engineering (ECE)',
          'Electrical & Electronics Engineering (EEE)',
          'Mechanical Engineering (ME)',
          'Civil Engineering (CE)'
        ];
    const defaultYrs = yrs.length ? yrs : ['First Year (2026–2027)', 'Second Year (2025–2026)', 'Third Year (2024–2025)'];
    const defaultSems = sems.length ? sems : ['Semester I', 'Semester II'];

    setDepartments(defaultDepts);
    setBranches(defaultBrs);
    setYears(defaultYrs);
    setSemesters(defaultSems);
    setAvailableSections(secs);

    setSelectedDept(faculty.department || defaultDepts[0]);
    setSelectedBranch(defaultBrs[0]);
    setSelectedYear(defaultYrs[0]);
    setSelectedSemester(defaultSems[0]);
    setSelectedSections(['Section A']);
  };

  const loadAuditLogs = async () => {
    try {
      const logs = await dbStorage.getAuditLogs();
      const filtered = logs.filter(
        (log) =>
          log.details.includes(faculty.employeeId) ||
          log.details.includes(faculty.fullName) ||
          log.userName === faculty.fullName ||
          log.userId === faculty.employeeId
      );
      setFacultyAuditLogs(filtered);
    } catch {
      // Fallback
    }
  };

  // Filter current active assignments for this faculty
  const currentFacultyAssignments = assignmentsList.filter(
    (a) => a.facultyId.toUpperCase() === faculty.employeeId.toUpperCase() && a.status === 'ACTIVE'
  );

  // Filter assigned students mapped to this faculty
  const mappedStudents = FacultyAssignmentService.getAssignedStudentsForFaculty(
    faculty.employeeId,
    allStudents
  );

  // Workload Summary metrics
  const workload = FacultyAssignmentService.getFacultyWorkload(faculty.employeeId, allStudents);

  // Toggle multi-section selection
  const handleToggleSection = (sec: string) => {
    setFormError('');
    if (selectedSections.includes(sec)) {
      if (selectedSections.length === 1) return; // Must keep at least 1 section
      setSelectedSections(selectedSections.filter((s) => s !== sec));
    } else {
      setSelectedSections([...selectedSections, sec]);
    }
  };

  // Check if any selected section is already assigned to a DIFFERENT faculty
  const getSectionConflictInfo = (secName: string) => {
    const conflict = assignmentsList.find(
      (a) =>
        a.facultyId.toUpperCase() !== faculty.employeeId.toUpperCase() &&
        a.status === 'ACTIVE' &&
        a.branch.toLowerCase().includes(selectedBranch.toLowerCase().split(' ')[0]) &&
        a.section.toLowerCase().includes(secName.toLowerCase().replace('section ', ''))
    );
    return conflict;
  };

  // Handle Save Allocation
  const handleSaveAllocation = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (selectedSections.length === 0) {
      setFormError('Please select at least one section for this allocation.');
      return;
    }

    setIsSaving(true);
    try {
      // Create multi-section allocation records
      await FacultyAssignmentService.saveMultiSectionAllocation(
        {
          facultyId: faculty.employeeId,
          facultyName: faculty.fullName,
          department: selectedDept,
          branch: selectedBranch,
          academicYear: selectedYear,
          semester: selectedSemester,
          sections: selectedSections,
          isOverride: isOverride
        },
        currentUser?.name || 'Bootstrap Administrator'
      );

      setFormSuccess(
        `Academic Allocation saved successfully! Generated Allocation ID for ${faculty.fullName} (${selectedSections.join(', ')}).`
      );

      // Trigger app-wide sync
      onAllocationUpdated();
      loadAuditLogs();

      setTimeout(() => {
        setFormSuccess('');
      }, 3000);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save academic allocation.');
    } finally {
      setIsSaving(false);
    }
  };

  // Remove/deactivate allocation
  const handleRemoveAllocation = (id: string, branchSec: string) => {
    if (!confirm(`Are you sure you want to remove assignment for ${branchSec}?`)) return;
    FacultyAssignmentService.deleteAssignment(id);
    onAllocationUpdated();
    loadAuditLogs();
  };

  // Toggle individual assignment status
  const handleToggleAllocationStatus = (id: string) => {
    FacultyAssignmentService.toggleAssignmentStatus(id);
    onAllocationUpdated();
    loadAuditLogs();
  };

  // Filtered mapped students for student search tab
  const filteredMappedStudents = mappedStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(studentQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(studentQuery.toLowerCase()) ||
      (s.section && s.section.toLowerCase().includes(studentQuery.toLowerCase()))
  );

  // Curriculum Modules list
  const saillModules = [
    { id: 'MOD-01', name: 'Module 1: Phonetics & Vowel / Consonant Sounds', code: 'ENGLISH-LAB-101' },
    { id: 'MOD-02', name: 'Module 2: Listening Comprehension & Auditory Focus', code: 'ENGLISH-LAB-102' },
    { id: 'MOD-03', name: 'Module 3: Vocabulary Enrichment & Contextual Usage', code: 'ENGLISH-LAB-103' },
    { id: 'MOD-04', name: 'Module 4: Professional Speaking & Public Pitching', code: 'ENGLISH-LAB-104' },
    { id: 'MOD-05', name: 'Module 5: Syllable Stress & Sentence Intonation', code: 'ENGLISH-LAB-105' },
    { id: 'MOD-06', name: 'Module 6: Academic Reading & Speed Comprehension', code: 'ENGLISH-LAB-106' },
    { id: 'MOD-07', name: 'Module 7: Technical & Business Writing Skills', code: 'ENGLISH-LAB-107' },
    { id: 'MOD-08', name: 'Module 8: Group Discussion & Debating Mechanics', code: 'ENGLISH-LAB-108' },
    { id: 'MOD-09', name: 'Module 9: Interview Preparedness & Body Language', code: 'ENGLISH-LAB-109' },
    { id: 'MOD-10', name: 'Module 10: Capstone Conversational AI Evaluation', code: 'ENGLISH-LAB-110' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end transition-opacity duration-300">
      <div className="relative w-full max-w-3xl bg-white h-full shadow-2xl border-l border-gray-200 flex flex-col overflow-hidden text-[#2C3E50]">
        
        {/* DRAWER TOP BAR */}
        <div className="px-6 py-4 bg-[#2C3E50] text-white flex items-center justify-between border-b border-gray-700 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#D35400] text-white rounded-xl shadow-xs">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-extrabold text-[#FAD7A0] uppercase tracking-wider block">
                Faculty Allocation Engine (FAE)
              </span>
              <h2 className="text-base font-black text-white font-serif">
                Faculty Profile & Academic Scope
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition cursor-pointer"
            title="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* DRAWER HEADER: FACULTY PROFILE SUMMARY */}
        <div className="p-6 bg-gradient-to-r from-gray-50 via-[#FFF8F0]/40 to-gray-50 border-b border-gray-200 shrink-0 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Photo / Initials Avatar */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2C3E50] to-[#D35400] text-[#FAD7A0] flex items-center justify-center font-black text-lg shadow-md border-2 border-white shrink-0">
                {faculty.fullName
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase() || 'FC'}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-[#2C3E50]">{faculty.fullName}</h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                      faculty.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {faculty.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs">
                  <span className="font-mono font-bold text-[#D35400] bg-[#FFF8F0] px-2 py-0.5 rounded border border-[#FAD7A0]">
                    ID: {faculty.employeeId}
                  </span>
                  <span className="text-gray-600 font-semibold">{faculty.designation || 'Assistant Professor'}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">{faculty.department}</span>
                </div>
              </div>
            </div>

            <div className="text-right text-xs text-gray-500 hidden sm:block">
              <div>
                Registered:{' '}
                <span className="font-bold text-[#2C3E50]">
                  {faculty.createdAt ? new Date(faculty.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5">{faculty.email}</div>
            </div>
          </div>

          {/* WORKLOAD SUMMARY KPI GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2">
            <div className="p-2.5 bg-white rounded-xl border border-gray-200 shadow-2xs text-center">
              <span className="text-[9px] font-extrabold uppercase text-[#D35400] block">Assigned Sections</span>
              <span className="text-base font-black text-[#2C3E50]">{workload.totalSections}</span>
            </div>

            <div className="p-2.5 bg-white rounded-xl border border-gray-200 shadow-2xs text-center">
              <span className="text-[9px] font-extrabold uppercase text-blue-700 block">Total Students</span>
              <span className="text-base font-black text-blue-900">{workload.totalStudents}</span>
            </div>

            <div className="p-2.5 bg-white rounded-xl border border-gray-200 shadow-2xs text-center">
              <span className="text-[9px] font-extrabold uppercase text-purple-700 block">Total Modules</span>
              <span className="text-base font-black text-purple-900">{workload.totalModules}</span>
            </div>

            <div className="p-2.5 bg-white rounded-xl border border-gray-200 shadow-2xs text-center">
              <span className="text-[9px] font-extrabold uppercase text-emerald-700 block">Avg Progress</span>
              <span className="text-base font-black text-emerald-800">{workload.averageProgress}%</span>
            </div>

            <div className="p-2.5 bg-white rounded-xl border border-gray-200 shadow-2xs text-center col-span-2 sm:col-span-1">
              <span className="text-[9px] font-extrabold uppercase text-amber-700 block">Pending Reviews</span>
              <span className="text-base font-black text-amber-900">{workload.pendingReviews}</span>
            </div>
          </div>
        </div>

        {/* DRAWER TAB NAVIGATION */}
        <div className="flex border-b border-gray-200 bg-gray-50 px-6 pt-2 shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setActiveDrawerTab('allocation')}
            className={`px-4 py-2.5 border-b-2 font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
              activeDrawerTab === 'allocation'
                ? 'border-[#D35400] text-[#D35400] bg-white rounded-t-xl'
                : 'border-transparent text-[#5D6D7E] hover:text-[#2C3E50]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Academic Allocation ({currentFacultyAssignments.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveDrawerTab('students')}
            className={`px-4 py-2.5 border-b-2 font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
              activeDrawerTab === 'students'
                ? 'border-[#D35400] text-[#D35400] bg-white rounded-t-xl'
                : 'border-transparent text-[#5D6D7E] hover:text-[#2C3E50]'
            }`}
          >
            <Users className="w-4 h-4 text-blue-600" />
            <span>Mapped Students ({mappedStudents.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveDrawerTab('modules')}
            className={`px-4 py-2.5 border-b-2 font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
              activeDrawerTab === 'modules'
                ? 'border-[#D35400] text-[#D35400] bg-white rounded-t-xl'
                : 'border-transparent text-[#5D6D7E] hover:text-[#2C3E50]'
            }`}
          >
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span>Assigned Modules (10)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveDrawerTab('audit')}
            className={`px-4 py-2.5 border-b-2 font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
              activeDrawerTab === 'audit'
                ? 'border-[#D35400] text-[#D35400] bg-white rounded-t-xl'
                : 'border-transparent text-[#5D6D7E] hover:text-[#2C3E50]'
            }`}
          >
            <History className="w-4 h-4 text-emerald-600" />
            <span>Audit Trail</span>
          </button>
        </div>

        {/* DRAWER SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
          
          {/* TAB 1: ACADEMIC ALLOCATION FORM & ACTIVE SCOPES */}
          {activeDrawerTab === 'allocation' && (
            <div className="space-y-6">
              
              {/* ALLOCATION FORM BOX */}
              <div className="p-5 bg-[#FFF8F0]/60 rounded-2xl border border-[#FAD7A0] space-y-4 shadow-2xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#FAD7A0]/60">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D35400]" />
                    <h4 className="font-bold text-sm text-[#2C3E50]">Assign New Academic Scope & Sections</h4>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase text-[#D35400] bg-white px-2.5 py-0.5 rounded-full border border-[#FAD7A0]">
                    Administrator Control
                  </span>
                </div>

                {formError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {formSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{formSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleSaveAllocation} className="space-y-4">
                  {/* Dept & Branch Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase mb-1">
                        Department
                      </label>
                      <select
                        value={selectedDept}
                        onChange={(e) => setSelectedDept(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
                      >
                        {departments.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase mb-1">
                        Academic Branch
                      </label>
                      <select
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
                      >
                        {branches.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Year & Semester Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase mb-1">
                        Academic Year Session
                      </label>
                      <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
                      >
                        {years.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase mb-1">
                        Semester
                      </label>
                      <select
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
                      >
                        {semesters.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Multiple Sections Selection */}
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase mb-1.5">
                      Assign Sections (Multi-Section Support) *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {availableSections.map((sec) => {
                        const isSelected = selectedSections.includes(sec);
                        const conflict = getSectionConflictInfo(sec);

                        return (
                          <button
                            key={sec}
                            type="button"
                            onClick={() => handleToggleSection(sec)}
                            className={`p-2.5 rounded-xl border text-xs font-extrabold flex flex-col items-center gap-1 transition cursor-pointer relative ${
                              isSelected
                                ? 'bg-[#D35400] text-white border-[#D35400] shadow-xs'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <span>{sec}</span>
                            {conflict && (
                              <span className="text-[9px] font-normal text-amber-200 underline">
                                Assigned ({conflict.facultyName.split(' ')[0]})
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">
                      Click sections to select/deselect. Selected sections will be mapped to {faculty.fullName}.
                    </p>
                  </div>

                  {/* Override Warning & Checkbox */}
                  {selectedSections.some((sec) => getSectionConflictInfo(sec)) && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                      <div className="flex items-start gap-2 text-xs font-semibold text-amber-900">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">Section Conflict Notice:</span> One or more selected sections are currently assigned to another faculty member.
                        </div>
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={isOverride}
                          onChange={(e) => setIsOverride(e.target.checked)}
                          className="w-4 h-4 text-[#D35400] rounded focus:ring-[#D35400]"
                        />
                        <span className="text-xs font-bold text-amber-900">
                          Override & Reassign Sections (Bootstrap Administrator Authorization)
                        </span>
                      </label>
                    </div>
                  )}

                  {/* Form Action */}
                  <div className="pt-2 flex items-center justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-5 py-2.5 bg-[#D35400] hover:bg-[#E67E22] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Layers className="w-4 h-4" />
                      <span>{isSaving ? 'Saving Allocation...' : 'Save & Synchronize Scope'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* CURRENT ACTIVE ASSIGNMENTS LIST */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-[#2C3E50]">Currently Active Assigned Academic Scopes</h4>
                  <span className="text-xs font-bold text-gray-500">{currentFacultyAssignments.length} Active Records</span>
                </div>

                {currentFacultyAssignments.length === 0 ? (
                  <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 text-center text-xs text-gray-500">
                    No active academic scope assigned to {faculty.fullName} yet. Use the form above to assign sections.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {currentFacultyAssignments.map((a) => (
                      <div
                        key={a.id}
                        className="p-4 bg-white rounded-xl border border-gray-200 shadow-2xs hover:border-gray-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-[#2C3E50]">{a.branch}</span>
                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-extrabold text-[11px] rounded border border-indigo-200">
                              Section {a.section}
                            </span>
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-extrabold text-[10px] rounded border border-emerald-200 uppercase">
                              {a.status}
                            </span>
                          </div>

                          <div className="text-xs text-gray-600 font-medium flex flex-wrap items-center gap-x-3">
                            <span>{a.academicYear}</span>
                            <span>•</span>
                            <span>{a.semester}</span>
                            <span>•</span>
                            <span>{a.department}</span>
                          </div>

                          <div className="text-[10px] text-gray-400 font-mono">
                            Allocation ID: {a.allocationId || a.id} • Timestamp:{' '}
                            {a.allocationTimestamp
                              ? new Date(a.allocationTimestamp).toLocaleString()
                              : a.assignedDate}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => handleToggleAllocationStatus(a.id)}
                            className="p-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded-lg text-xs font-bold transition cursor-pointer"
                            title="Toggle Status"
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveAllocation(a.id, `${a.branch} - ${a.section}`)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-lg text-xs font-bold transition cursor-pointer"
                            title="Remove Scope"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: MAPPED STUDENTS */}
          {activeDrawerTab === 'students' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-200">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search mapped students..."
                    value={studentQuery}
                    onChange={(e) => setStudentQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#D35400] focus:outline-none"
                  />
                </div>

                <div className="text-xs font-bold text-[#5D6D7E]">
                  Total Mapped Students: <span className="text-[#2C3E50]">{filteredMappedStudents.length}</span>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#2C3E50] text-white uppercase font-extrabold text-[10px] tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Roll Number</th>
                      <th className="px-4 py-3">Student Name</th>
                      <th className="px-4 py-3">Branch & Section</th>
                      <th className="px-4 py-3">Academic Year</th>
                      <th className="px-4 py-3 text-right">Progress</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {filteredMappedStudents.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                          No students mapped to active sections for this faculty member.
                        </td>
                      </tr>
                    ) : (
                      filteredMappedStudents.map((s) => (
                        <tr key={s.rollNo} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3 font-mono font-bold text-[#D35400]">{s.rollNo}</td>
                          <td className="px-4 py-3 font-bold text-[#2C3E50]">{s.name}</td>
                          <td className="px-4 py-3">
                            <span className="font-semibold">{s.branch || s.department}</span>
                            <span className="ml-2 px-1.5 py-0.5 bg-blue-50 text-blue-700 font-extrabold rounded text-[10px]">
                              Sec {s.section}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-600">{s.year || s.academicYear}</td>
                          <td className="px-4 py-3 text-right">
                            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                              {s.overallScore || s.averageScore || s.overallProgressPercentage || 0}%
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ASSIGNED MODULES */}
          {activeDrawerTab === 'modules' && (
            <div className="space-y-3">
              <p className="text-xs text-gray-600">
                The following 10 SAILL R26 Communicative English Lab Modules are assigned and manageable by {faculty.fullName} for their allocated academic sections:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {saillModules.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs space-y-1 hover:border-[#FAD7A0] transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-extrabold text-[#D35400]">{m.code}</span>
                      <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[9px] font-black rounded uppercase">
                        Active Lab Module
                      </span>
                    </div>
                    <div className="font-bold text-xs text-[#2C3E50]">{m.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: AUDIT TRAIL */}
          {activeDrawerTab === 'audit' && (
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-[#2C3E50]">Faculty Allocation Audit History</h4>
              
              {facultyAuditLogs.length === 0 ? (
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 text-center text-xs text-gray-500">
                  No allocation change logs recorded for this faculty member yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {facultyAuditLogs.map((log) => (
                    <div key={log.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-[#2C3E50]">
                        <span className="text-[#D35400] font-mono">{log.action}</span>
                        <span className="text-[10px] text-gray-400">{log.timestamp}</span>
                      </div>
                      <p className="text-gray-700 font-medium">{log.details}</p>
                      <div className="text-[10px] text-gray-500">Recorded By: {log.performedBy || log.username}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* DRAWER FOOTER */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-gray-500 font-medium">
            SAILL Faculty Allocation Engine • {faculty.fullName}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#2C3E50] hover:bg-[#34495E] text-white font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Close Profile
          </button>
        </div>

      </div>
    </div>
  );
};

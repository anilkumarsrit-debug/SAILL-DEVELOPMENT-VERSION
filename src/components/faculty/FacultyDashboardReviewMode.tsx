import React, { useState } from 'react';
import {
  Eye,
  LogOut,
  GraduationCap,
  Users,
  BookOpen,
  CheckCircle2,
  Lock,
  FileCheck,
  FileSpreadsheet,
  Settings,
  Clock,
  Home,
  BarChart3,
  ShieldCheck,
  ChevronRight,
  AlertCircle,
  Building2,
  Calendar
} from 'lucide-react';

interface FacultyDashboardReviewModeProps {
  onExitReviewMode: () => void;
}

type PreviewTabKey =
  | 'home'
  | 'classes'
  | 'students'
  | 'progress-monitor'
  | 'release-modules'
  | 'assessments'
  | 'reports'
  | 'settings';

export const FacultyDashboardReviewMode: React.FC<FacultyDashboardReviewModeProps> = ({
  onExitReviewMode
}) => {
  const [activeTab, setActiveTab] = useState<PreviewTabKey>('home');
  const [selectedClassView, setSelectedClassView] = useState<boolean>(false);

  // Preview Profile Data (FDRM-01)
  const facultyProfile = {
    name: 'Demo Faculty — Preview',
    role: 'Faculty Incharge',
    status: 'APPROVED — PREVIEW',
    program: 'Civil Engineering',
    academicYear: '2026–27',
    semester: 'II',
    section: 'A',
    studentCount: 0
  };

  const navItems: { key: PreviewTabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'home', label: 'DASHBOARD', icon: <Home className="w-4 h-4" /> },
    { key: 'classes', label: 'MY CLASSES', icon: <GraduationCap className="w-4 h-4" /> },
    { key: 'students', label: 'MY STUDENTS', icon: <Users className="w-4 h-4" /> },
    { key: 'progress-monitor', label: 'MODULE PROGRESS', icon: <BarChart3 className="w-4 h-4" /> },
    { key: 'release-modules', label: 'RELEASE MODULES', icon: <BookOpen className="w-4 h-4" /> },
    { key: 'assessments', label: 'PENDING REVIEWS', icon: <FileCheck className="w-4 h-4" /> },
    { key: 'reports', label: 'REPORTS', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { key: 'settings', label: 'PROFILE', icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-6 text-[#2C3E50]">
      {/* 1. PERSISTENT REVIEW MODE BANNER (Req 1 & 14) */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white p-4 sm:p-5 rounded-2xl border-2 border-amber-300/40 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/10 rounded-xl border border-white/20 shrink-0">
            <Eye className="w-6 h-6 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-amber-200 text-amber-950 font-black text-[10px] uppercase tracking-wider rounded">
                REVIEW MODE
              </span>
              <span className="text-xs text-amber-100 font-semibold hidden md:inline">
                FDRM-01 Non-Authenticated Faculty UI Preview
              </span>
            </div>
            <h2 className="text-base font-black text-white font-serif mt-0.5">
              FACULTY DASHBOARD — REVIEW MODE
            </h2>
            <p className="text-xs text-amber-100 font-medium">
              Preview only. No real faculty account or institutional data is being accessed.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onExitReviewMode}
          className="px-4 py-2.5 bg-white text-amber-950 hover:bg-amber-50 font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer shrink-0 border border-amber-200"
        >
          <LogOut className="w-4 h-4 text-amber-800" />
          <span>Exit Review Mode</span>
        </button>
      </div>

      {/* WORKBENCH LAYOUT WITH SIDEBAR + MAIN PREVIEW */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* PREVIEW SIDEBAR */}
        <aside className="w-full lg:w-64 bg-[#2C3E50] text-white rounded-2xl p-4 shadow-xl border border-[#FAD7A0]/20 flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            {/* Faculty Profile Card (Req 2) */}
            <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 backdrop-blur-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#D35400] to-[#E67E22] flex items-center justify-center font-bold text-white text-base shadow-sm shrink-0">
                D
              </div>
              <div className="overflow-hidden min-w-0">
                <h3 className="font-bold text-sm text-[#FAD7A0] truncate">
                  {facultyProfile.name}
                </h3>
                <p className="text-[11px] text-gray-300 truncate font-mono">
                  {facultyProfile.role}
                </p>
                <p className="text-[10px] text-emerald-300 font-bold mt-0.5 truncate">
                  {facultyProfile.status}
                </p>
              </div>
            </div>

            {/* Navigation Items (Req 4) */}
            <nav className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                Faculty Workbench Preview
              </div>
              {navItems.map((item) => {
                const isActive = activeTab === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.key);
                      setSelectedClassView(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all duration-150 text-left cursor-pointer ${
                      isActive
                        ? 'bg-[#D35400] text-white font-bold shadow-md translate-x-1'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className={isActive ? 'text-white' : 'text-gray-400'}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 p-2.5 bg-[#1F2C38] rounded-xl text-[11px] text-amber-200/90 border border-amber-500/20">
              <GraduationCap className="w-4 h-4 text-[#E67E22] shrink-0" />
              <div className="leading-tight">
                <p className="font-bold text-[10px] text-[#FAD7A0]">Review Mode Active</p>
                <p className="text-[10px] text-gray-400">Mock Data Store</p>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN PREVIEW CONTENT AREA */}
        <div className="flex-1 w-full min-w-0 space-y-6">
          {/* TOP APPROVAL STATUS & ACADEMIC SCOPE AREA (Req 2, 3, 10) */}
          <div className="bg-gradient-to-r from-[#2C3E50] via-[#34495E] to-[#1F2C38] text-white p-6 rounded-2xl border border-[#FAD7A0]/30 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <p className="text-xs uppercase font-extrabold tracking-wider text-[#FAD7A0]">
                  Faculty Incharge Workspace (Preview)
                </p>
                <h1 className="text-2xl font-extrabold font-serif text-white mt-0.5">
                  WELCOME, {facultyProfile.name.toUpperCase()}
                </h1>
                <p className="text-xs text-gray-300 mt-0.5 font-medium">
                  Role: {facultyProfile.role}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-300">
                  Faculty Registration:
                </span>
                <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold border bg-emerald-100 text-emerald-800 border-emerald-300">
                  {facultyProfile.status}
                </span>
              </div>
            </div>

            {/* Approval Message (Req 10) */}
            <div className="flex items-center gap-2 text-xs text-[#FAD7A0] font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Your Faculty Incharge account has been approved.</span>
            </div>

            {/* Academic Responsibility Scope Card (Req 3) */}
            <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#FAD7A0] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#E67E22]" />
                  Academic Responsibility Scope (Preview Placeholder)
                </span>
                <span className="text-[10px] text-gray-300 italic">
                  Preview placeholders only
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
                <div className="p-2 bg-black/20 rounded-lg">
                  <p className="text-[10px] text-gray-400 font-bold">Program</p>
                  <p className="font-extrabold text-white text-xs">{facultyProfile.program}</p>
                </div>
                <div className="p-2 bg-black/20 rounded-lg">
                  <p className="text-[10px] text-gray-400 font-bold">Academic Year</p>
                  <p className="font-extrabold text-white text-xs">{facultyProfile.academicYear}</p>
                </div>
                <div className="p-2 bg-black/20 rounded-lg">
                  <p className="text-[10px] text-gray-400 font-bold">Semester</p>
                  <p className="font-extrabold text-white text-xs">Semester {facultyProfile.semester}</p>
                </div>
                <div className="p-2 bg-black/20 rounded-lg">
                  <p className="text-[10px] text-gray-400 font-bold">Section</p>
                  <p className="font-extrabold text-white text-xs">Section {facultyProfile.section}</p>
                </div>
                <div className="p-2 bg-black/20 rounded-lg">
                  <p className="text-[10px] text-gray-400 font-bold">Students Assigned</p>
                  <p className="font-extrabold text-[#FAD7A0] text-xs">{facultyProfile.studentCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* TAB CONTENT: HOME / DASHBOARD */}
          {activeTab === 'home' && (
            <div className="space-y-6">
              {/* Summary Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-[#FAD7A0]/70 shadow-xs flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                      My Classes
                    </p>
                    <p className="text-2xl font-extrabold text-[#2C3E50]">1</p>
                    <p className="text-[11px] text-blue-600 font-semibold mt-0.5">
                      Civil Engineering (Sec A)
                    </p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#FAD7A0]/70 shadow-xs flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                      My Students
                    </p>
                    <p className="text-2xl font-extrabold text-[#2C3E50]">0</p>
                    <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                      Empty Roster
                    </p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#FAD7A0]/70 shadow-xs flex items-center gap-4">
                  <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                      Current Module
                    </p>
                    <p className="text-sm font-extrabold text-[#2C3E50] truncate">
                      Module 1
                    </p>
                    <p className="text-[11px] text-amber-700 font-semibold mt-0.5 truncate">
                      Foundation & Orientation
                    </p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#FAD7A0]/70 shadow-xs flex items-center gap-4">
                  <div className="p-3 bg-purple-50 text-purple-700 rounded-xl">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                      Students Ready
                    </p>
                    <p className="text-2xl font-extrabold text-[#2C3E50]">0</p>
                    <p className="text-[11px] text-purple-600 font-semibold mt-0.5">
                      Ready for Next
                    </p>
                  </div>
                </div>
              </div>

              {/* MY CLASSES SECTION (Req 5) */}
              <div className="bg-white p-6 rounded-2xl border border-[#FAD7A0]/70 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-[#D35400]" />
                    <h2 className="text-base font-extrabold font-serif text-[#2C3E50]">
                      My Classes
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('classes')}
                    className="text-xs text-[#D35400] font-bold hover:underline"
                  >
                    View All Classes &rarr;
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Single Preview Class Card (Req 5) */}
                  <div className="bg-[#FFF8F0]/40 p-4 rounded-xl border border-[#FAD7A0]/70 hover:border-[#D35400] transition space-y-3 flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md">
                        Semester II • Section A
                      </span>
                      <h3 className="font-extrabold text-sm text-[#2C3E50] font-serif mt-1">
                        Civil Engineering
                      </h3>
                      <p className="text-xs text-gray-500">
                        Students: <span className="font-bold text-[#D35400]">0</span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('classes')}
                      className="w-full py-2 bg-[#D35400] hover:bg-[#E67E22] text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>View Class</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-gray-400 italic pt-1">
                  No additional classes assigned.
                </p>
              </div>

              {/* MODULE PROGRESS & RELEASE NEXT MODULE GRID (Req 7 & 8) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Module Progress Section (Req 7) */}
                <div className="bg-white p-6 rounded-2xl border border-[#FAD7A0]/70 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-[#D35400]" />
                      <h3 className="text-base font-extrabold font-serif text-[#2C3E50]">
                        Module Progress
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-3 bg-[#FFF8F0] p-4 rounded-xl border border-[#FAD7A0]/60">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[#2C3E50]">
                        Current Module: Module 1 — Foundation & Orientation
                      </span>
                      <span className="font-extrabold text-[#D35400]">0%</span>
                    </div>

                    <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gray-300 w-0" />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center text-xs pt-2">
                      <div className="p-2 bg-white rounded-lg border border-[#FAD7A0]/50">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Class Completion</p>
                        <p className="font-extrabold text-[#2C3E50] text-sm">0%</p>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-[#FAD7A0]/50">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Students Ready</p>
                        <p className="font-extrabold text-emerald-700 text-sm">0</p>
                      </div>
                    </div>

                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 font-medium flex items-center gap-2 mt-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>No student progress is available in Review Mode.</span>
                    </div>
                  </div>
                </div>

                {/* Release Modules Section (Req 8) */}
                <div className="bg-white p-6 rounded-2xl border border-[#FAD7A0]/70 shadow-xs space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div className="flex items-center gap-2">
                        <Lock className="w-5 h-5 text-[#D35400]" />
                        <h3 className="text-base font-extrabold font-serif text-[#2C3E50]">
                          Release Modules
                        </h3>
                      </div>
                      <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 rounded-md text-[10px] font-bold">
                        LOCKED — REVIEW MODE
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="text-[10px] text-gray-400 font-bold uppercase">CURRENT MODULE</p>
                        <p className="font-extrabold text-[#2C3E50]">Module 1 — Foundation & Orientation</p>
                      </div>

                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                        <p className="text-[10px] text-amber-800 font-bold uppercase">NEXT MODULE</p>
                        <p className="font-extrabold text-amber-900">Module 2 — Vocabulary Development</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mt-3">
                    <button
                      type="button"
                      disabled={true}
                      title="Module release is disabled in Review Mode."
                      className="w-full py-2.5 bg-gray-300 text-gray-500 font-bold text-xs rounded-xl cursor-not-allowed flex items-center justify-center gap-2 opacity-70"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Release Next Module</span>
                    </button>
                    <p className="text-[11px] text-amber-700 text-center font-semibold">
                      Module release is disabled in Review Mode.
                    </p>
                  </div>
                </div>
              </div>

              {/* MY STUDENTS & PENDING REVIEWS ROW (Req 6 & 9) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* My Students Empty State Preview (Req 6) */}
                <div className="bg-white p-6 rounded-2xl border border-[#FAD7A0]/70 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#D35400]" />
                      <h3 className="font-extrabold text-sm font-serif text-[#2C3E50]">
                        MY STUDENTS
                      </h3>
                    </div>
                  </div>

                  <div className="p-6 text-center space-y-2 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <Users className="w-8 h-8 text-gray-400 mx-auto" />
                    <p className="text-xs text-gray-600 font-bold">
                      No students have been assigned to this class yet.
                    </p>
                  </div>
                </div>

                {/* Pending Reviews Empty State (Req 9) */}
                <div className="bg-white p-6 rounded-2xl border border-[#FAD7A0]/70 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-5 h-5 text-[#D35400]" />
                      <h3 className="font-extrabold text-sm font-serif text-[#2C3E50]">
                        PENDING REVIEWS
                      </h3>
                    </div>
                  </div>

                  <div className="p-6 text-center space-y-2 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <FileCheck className="w-8 h-8 text-gray-400 mx-auto" />
                    <p className="text-xs text-gray-600 font-bold">
                      No pending reviews.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: MY CLASSES */}
          {activeTab === 'classes' && (
            <div className="bg-white p-6 rounded-2xl border border-[#FAD7A0]/70 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#D35400]" />
                  <h2 className="text-lg font-extrabold font-serif text-[#2C3E50]">
                    My Classes Overview
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-[#FFF8F0]/50 rounded-xl border-2 border-[#FAD7A0] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-md">
                      Semester II • Section A
                    </span>
                    <span className="text-xs font-bold text-gray-500">
                      Students: 0
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-[#2C3E50] font-serif">
                      Civil Engineering
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Academic Year 2026–27 • Department of Humanities & Sciences
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedClassView(!selectedClassView)}
                    className="w-full py-2 bg-[#D35400] hover:bg-[#E67E22] text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>{selectedClassView ? 'Hide Roster Details' : 'View Class'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {selectedClassView && (
                <div className="p-5 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2">
                  <p className="text-xs font-bold text-amber-900">
                    Class Roster: Civil Engineering — Semester II (Section A)
                  </p>
                  <p className="text-xs text-gray-600">
                    No students have been assigned to this class yet.
                  </p>
                </div>
              )}

              <p className="text-xs text-gray-400 italic">
                No additional classes assigned.
              </p>
            </div>
          )}

          {/* TAB CONTENT: MY STUDENTS */}
          {activeTab === 'students' && (
            <div className="bg-white p-6 rounded-2xl border border-[#FAD7A0]/70 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#D35400]" />
                  <h2 className="text-lg font-extrabold font-serif text-[#2C3E50]">
                    MY STUDENTS
                  </h2>
                </div>
              </div>

              <div className="p-10 text-center space-y-3 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <Users className="w-12 h-12 text-gray-300 mx-auto" />
                <h3 className="text-base font-bold text-[#2C3E50]">No Students Assigned</h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  No students have been assigned to this class yet.
                </p>
              </div>
            </div>
          )}

          {/* TAB CONTENT: MODULE PROGRESS */}
          {activeTab === 'progress-monitor' && (
            <div className="bg-white p-6 rounded-2xl border border-[#FAD7A0]/70 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#D35400]" />
                  <h2 className="text-lg font-extrabold font-serif text-[#2C3E50]">
                    MODULE PROGRESS
                  </h2>
                </div>
              </div>

              <div className="p-5 bg-[#FFF8F0] rounded-xl border border-[#FAD7A0] space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#2C3E50]">
                    Current Module: Module 1 — Foundation & Orientation
                  </span>
                  <span className="font-extrabold text-[#D35400]">0%</span>
                </div>

                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-300 w-0" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center text-xs pt-2">
                  <div className="p-3 bg-white rounded-lg border border-[#FAD7A0]/50">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Class Completion</p>
                    <p className="font-extrabold text-[#2C3E50] text-base">0%</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-[#FAD7A0]/50">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Students Ready</p>
                    <p className="font-extrabold text-emerald-700 text-base">0</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-[#FAD7A0]/50">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Total Assigned</p>
                    <p className="font-extrabold text-gray-700 text-base">0</p>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>No student progress is available in Review Mode.</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: RELEASE MODULES */}
          {activeTab === 'release-modules' && (
            <div className="bg-white p-6 rounded-2xl border border-[#FAD7A0]/70 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#D35400]" />
                  <h2 className="text-lg font-extrabold font-serif text-[#2C3E50]">
                    RELEASE MODULES
                  </h2>
                </div>
                <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-md text-xs font-bold">
                  LOCKED — REVIEW MODE
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">CURRENT MODULE</p>
                  <p className="font-extrabold text-sm text-[#2C3E50]">Module 1 — Foundation & Orientation</p>
                  <p className="text-gray-500">Status: Active for Civil Engineering (Sec A)</p>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                  <p className="text-[10px] font-bold text-amber-800 uppercase">NEXT MODULE</p>
                  <p className="font-extrabold text-sm text-amber-900">Module 2 — Vocabulary Development</p>
                  <p className="text-amber-800">Status: Ready for release control</p>
                </div>
              </div>

              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs space-y-3">
                <div className="flex items-center gap-2 font-bold text-rose-900">
                  <Lock className="w-4 h-4 text-rose-600" />
                  <span>Module Release Disabled</span>
                </div>
                <p className="text-gray-600">
                  Module release is disabled in Review Mode. No real module release operation may occur.
                </p>

                <button
                  type="button"
                  disabled={true}
                  title="Module release is disabled in Review Mode."
                  className="px-5 py-2.5 bg-gray-300 text-gray-500 font-bold rounded-xl cursor-not-allowed opacity-60 flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Release Next Module</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB CONTENT: PENDING REVIEWS */}
          {activeTab === 'assessments' && (
            <div className="bg-white p-6 rounded-2xl border border-[#FAD7A0]/70 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-[#D35400]" />
                  <h2 className="text-lg font-extrabold font-serif text-[#2C3E50]">
                    PENDING REVIEWS
                  </h2>
                </div>
              </div>

              <div className="p-10 text-center space-y-3 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <FileCheck className="w-12 h-12 text-gray-300 mx-auto" />
                <h3 className="text-base font-bold text-[#2C3E50]">No Pending Reviews</h3>
                <p className="text-xs text-gray-500">
                  No pending reviews.
                </p>
              </div>
            </div>
          )}

          {/* TAB CONTENT: REPORTS */}
          {activeTab === 'reports' && (
            <div className="bg-white p-6 rounded-2xl border border-[#FAD7A0]/70 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-[#D35400]" />
                  <h2 className="text-lg font-extrabold font-serif text-[#2C3E50]">
                    REPORTS
                  </h2>
                </div>
              </div>

              <div className="p-8 text-center space-y-2 bg-gray-50 rounded-2xl border border-gray-200 text-xs">
                <p className="font-bold text-[#2C3E50]">
                  Civil Engineering — Semester II (Section A)
                </p>
                <p className="text-gray-500">
                  No student progress is available in Review Mode.
                </p>
              </div>
            </div>
          )}

          {/* TAB CONTENT: PROFILE / SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white p-6 rounded-2xl border border-[#FAD7A0]/70 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[#D35400]" />
                  <h2 className="text-lg font-extrabold font-serif text-[#2C3E50]">
                    PROFILE & SETTINGS
                  </h2>
                </div>
              </div>

              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 font-bold uppercase text-[10px]">Faculty Name</label>
                    <p className="font-extrabold text-[#2C3E50] text-sm">{facultyProfile.name}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 font-bold uppercase text-[10px]">Role</label>
                    <p className="font-extrabold text-[#2C3E50] text-sm">{facultyProfile.role}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 font-bold uppercase text-[10px]">Account Status</label>
                    <p className="font-extrabold text-emerald-700 text-sm">{facultyProfile.status}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 font-bold uppercase text-[10px]">Department</label>
                    <p className="font-extrabold text-[#2C3E50] text-sm">{facultyProfile.program}</p>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
                  Profile modifications are disabled in Review Mode.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { R26_MODULES } from '../../data/modulesData';
import {
  Eye,
  LogOut,
  BookOpen,
  GraduationCap,
  CheckCircle2,
  Lock,
  Unlock,
  BarChart3,
  FileCheck,
  FolderKanban,
  User,
  Settings,
  Bell,
  AlertCircle,
  Building2,
  Clock,
  ChevronRight,
  ShieldAlert,
  Play
} from 'lucide-react';

interface StudentDashboardReviewModeProps {
  onExitReviewMode: () => void;
}

type StudentTabKey =
  | 'dashboard'
  | 'learning'
  | 'progress'
  | 'assessments'
  | 'portfolio'
  | 'profile'
  | 'settings';

type PreviewSimulationState = 'initial' | 'm1_completed' | 'm2_released';
type RegistrationAccountState = 'ACTIVE' | 'UNASSIGNED_FACULTY' | 'PENDING_APPROVAL';

export const StudentDashboardReviewMode: React.FC<StudentDashboardReviewModeProps> = ({
  onExitReviewMode
}) => {
  const [activeTab, setActiveTab] = useState<StudentTabKey>('dashboard');
  const [simulationState, setSimulationState] = useState<PreviewSimulationState>('initial');
  const [accountState, setAccountState] = useState<RegistrationAccountState>('ACTIVE');

  // Student Profile Preview Data (SDRM-01)
  const studentProfile = {
    name: 'Demo Student — Preview',
    rollNo: 'PREVIEW001',
    status: accountState === 'PENDING_APPROVAL' ? 'PENDING APPROVAL — PREVIEW' : 'ACTIVE — PREVIEW',
    program: 'Civil Engineering',
    academicYear: '2026–27',
    semester: 'II',
    section: 'A',
    facultyIncharge:
      accountState === 'UNASSIGNED_FACULTY'
        ? 'Not Assigned'
        : 'Demo Faculty — Preview'
  };

  const navItems: { key: StudentTabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: <BookOpen className="w-4 h-4" /> },
    { key: 'learning', label: 'My Learning', icon: <GraduationCap className="w-4 h-4" /> },
    { key: 'progress', label: 'My Progress', icon: <BarChart3 className="w-4 h-4" /> },
    { key: 'assessments', label: 'My Assessments', icon: <FileCheck className="w-4 h-4" /> },
    { key: 'portfolio', label: 'My Portfolio', icon: <FolderKanban className="w-4 h-4" /> },
    { key: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { key: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  // Derive module state based on simulation state
  const getModuleStatus = (index: number) => {
    if (simulationState === 'initial') {
      return index === 0 ? 'AVAILABLE' : 'LOCKED';
    } else if (simulationState === 'm1_completed') {
      if (index === 0) return 'COMPLETED';
      return 'LOCKED';
    } else if (simulationState === 'm2_released') {
      if (index === 0) return 'COMPLETED';
      if (index === 1) return 'AVAILABLE';
      return 'LOCKED';
    }
    return index === 0 ? 'AVAILABLE' : 'LOCKED';
  };

  const overallProgressPercent =
    simulationState === 'initial' ? 0 : simulationState === 'm1_completed' ? 14 : 28;
  const completedModulesCount =
    simulationState === 'initial' ? 0 : simulationState === 'm1_completed' ? 1 : 1;
  const currentModuleTitle =
    simulationState === 'm2_released'
      ? R26_MODULES[1]?.title || 'Vocabulary Development'
      : R26_MODULES[0]?.title || 'Foundation & Orientation';

  return (
    <div className="space-y-6 text-[#2C3E50]">
      {/* 1. PERSISTENT REVIEW MODE BANNER (Req 1 & 14) */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 text-white p-4 sm:p-5 rounded-2xl border-2 border-blue-300/40 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/10 rounded-xl border border-white/20 shrink-0">
            <Eye className="w-6 h-6 text-blue-200" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 bg-blue-200 text-blue-950 font-black text-[10px] uppercase tracking-wider rounded">
                REVIEW MODE
              </span>
              <span className="text-xs text-blue-100 font-semibold hidden md:inline">
                SDRM-01 Non-Authenticated Student UI Preview
              </span>
            </div>
            <h2 className="text-base font-black text-white font-serif mt-0.5">
              STUDENT DASHBOARD — REVIEW MODE
            </h2>
            <p className="text-xs text-blue-100 font-medium">
              Preview only. No real student account or institutional data is being accessed.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onExitReviewMode}
          className="px-4 py-2.5 bg-white text-blue-950 hover:bg-blue-50 font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer shrink-0 border border-blue-200"
        >
          <LogOut className="w-4 h-4 text-blue-800" />
          <span>Exit Review Mode</span>
        </button>
      </div>

      {/* REVIEW MODE STATE SIMULATOR BAR (Requirement 8, 13, 14, 17, 18) */}
      <div className="bg-white p-3.5 rounded-2xl border border-blue-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-[#D35400] uppercase text-[10px] tracking-wider bg-amber-50 px-2 py-1 rounded border border-amber-200">
            Preview Interactive Simulator
          </span>
          <span className="text-gray-500 hidden lg:inline">
            Test visual states without modifying database records
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Account state options */}
          <select
            value={accountState}
            onChange={(e) => setAccountState(e.target.value as RegistrationAccountState)}
            className="px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold text-[#2C3E50] cursor-pointer"
          >
            <option value="ACTIVE">Account: Active Student</option>
            <option value="UNASSIGNED_FACULTY">Faculty: Not Assigned</option>
            <option value="PENDING_APPROVAL">Account: Pending Approval</option>
          </select>

          {/* Module simulation options */}
          {accountState !== 'PENDING_APPROVAL' && (
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setSimulationState('initial')}
                className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition ${
                  simulationState === 'initial'
                    ? 'bg-white text-blue-900 shadow-xs'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                Module 1 Available
              </button>
              <button
                type="button"
                onClick={() => setSimulationState('m1_completed')}
                className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition ${
                  simulationState === 'm1_completed'
                    ? 'bg-white text-blue-900 shadow-xs'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                Module 1 Completed
              </button>
              <button
                type="button"
                onClick={() => setSimulationState('m2_released')}
                className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition ${
                  simulationState === 'm2_released'
                    ? 'bg-white text-blue-900 shadow-xs'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                Module 2 Released
              </button>
            </div>
          )}
        </div>
      </div>

      {/* WORKBENCH LAYOUT WITH SIDEBAR + MAIN CONTENT */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* PREVIEW SIDEBAR */}
        <aside className="w-full lg:w-64 bg-[#2C3E50] text-white rounded-2xl p-4 shadow-xl border border-[#FAD7A0]/20 flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            {/* Student Profile Card (Req 2) */}
            <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 backdrop-blur-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-base shadow-sm shrink-0">
                S
              </div>
              <div className="overflow-hidden min-w-0">
                <h3 className="font-bold text-sm text-[#FAD7A0] truncate">
                  {studentProfile.name}
                </h3>
                <p className="text-[11px] text-gray-300 truncate font-mono">
                  Roll: {studentProfile.rollNo}
                </p>
                <p
                  className={`text-[10px] font-bold mt-0.5 truncate ${
                    accountState === 'PENDING_APPROVAL' ? 'text-amber-300' : 'text-emerald-300'
                  }`}
                >
                  {studentProfile.status}
                </p>
              </div>
            </div>

            {/* Navigation Items (Req 16) */}
            <nav className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                Student Portal Navigation
              </div>
              {navItems.map((item) => {
                const isActive = activeTab === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setActiveTab(item.key)}
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
            <div className="flex items-center gap-2 p-2.5 bg-[#1F2C38] rounded-xl text-[11px] text-blue-200/90 border border-blue-500/20">
              <GraduationCap className="w-4 h-4 text-blue-400 shrink-0" />
              <div className="leading-tight">
                <p className="font-bold text-[10px] text-[#FAD7A0]">Student Review Active</p>
                <p className="text-[10px] text-gray-400">Isolated Mock State</p>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 w-full min-w-0 space-y-6">
          {/* PENDING APPROVAL GUARD (Requirement 18) */}
          {accountState === 'PENDING_APPROVAL' ? (
            <div className="bg-white p-8 rounded-2xl border-2 border-amber-300 shadow-lg text-center space-y-4">
              <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8" />
              </div>
              <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-black uppercase tracking-wider">
                REGISTRATION UNDER REVIEW
              </span>
              <h2 className="text-xl font-extrabold text-[#2C3E50] font-serif">
                Registration Under Review
              </h2>
              <p className="text-xs text-gray-600 max-w-lg mx-auto leading-relaxed">
                Your registration has been submitted successfully and is currently being reviewed by the Platform Administrator.
              </p>
              <p className="text-[11px] text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200 max-w-md mx-auto">
                Learning modules will become accessible once your registration is officially approved by the Platform Administrator.
              </p>
            </div>
          ) : (
            <>
              {/* 3. MY ACADEMIC DETAILS COMPACT BANNER (Requirement 3) */}
              <div className="bg-gradient-to-r from-[#2C3E50] via-[#34495E] to-[#1F2C38] text-white p-5 rounded-2xl border border-[#FAD7A0]/30 shadow-md space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#FAD7A0]">
                      MY ACADEMIC DETAILS
                    </span>
                    <h1 className="text-xl font-extrabold font-serif text-white mt-0.5">
                      WELCOME, DEMO STUDENT
                    </h1>
                    <p className="text-xs text-gray-300 mt-0.5 font-medium">
                      Continue your learning journey and complete each module in sequence.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-bold">
                      {studentProfile.status}
                    </span>
                  </div>
                </div>

                {/* Compact Academic Scope Grid (Req 3 & 17) */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1 text-xs">
                  <div className="p-2 bg-black/25 rounded-xl border border-white/5">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Program</p>
                    <p className="font-extrabold text-white truncate">{studentProfile.program}</p>
                  </div>
                  <div className="p-2 bg-black/25 rounded-xl border border-white/5">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Academic Year</p>
                    <p className="font-extrabold text-white truncate">{studentProfile.academicYear}</p>
                  </div>
                  <div className="p-2 bg-black/25 rounded-xl border border-white/5">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Semester</p>
                    <p className="font-extrabold text-white truncate">Semester {studentProfile.semester}</p>
                  </div>
                  <div className="p-2 bg-black/25 rounded-xl border border-white/5">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Section</p>
                    <p className="font-extrabold text-white truncate">Section {studentProfile.section}</p>
                  </div>
                  <div className="p-2 bg-black/25 rounded-xl border border-white/5">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Faculty Incharge</p>
                    <p
                      className={`font-extrabold truncate ${
                        accountState === 'UNASSIGNED_FACULTY' ? 'text-amber-300' : 'text-[#FAD7A0]'
                      }`}
                    >
                      {studentProfile.facultyIncharge}
                    </p>
                  </div>
                </div>

                {/* Unassigned Faculty Warning Message (Req 17) */}
                {accountState === 'UNASSIGNED_FACULTY' && (
                  <div className="p-2.5 bg-amber-500/20 border border-amber-400/40 rounded-xl text-xs text-amber-200 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-300 shrink-0" />
                    <span>Your Faculty Incharge has not been assigned yet.</span>
                  </div>
                )}
              </div>

              {/* NOTIFICATIONS BAR (Req 15) */}
              <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-2xl flex items-center gap-3 text-xs text-blue-900 shadow-xs">
                <Bell className="w-5 h-5 text-blue-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold">Student Notification</p>
                  <p className="text-blue-800 text-[11px]">
                    {simulationState === 'm2_released'
                      ? 'Module 2 has been released. You can now begin your next learning module.'
                      : 'Module 1 is available for your class. Complete each module in sequence.'}
                  </p>
                </div>
              </div>

              {/* TAB CONTENT: DASHBOARD / MY LEARNING */}
              {(activeTab === 'dashboard' || activeTab === 'learning') && (
                <div className="space-y-6">
                  {/* 11. STUDENT PROGRESS SUMMARY CARDS (Requirement 11) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-[#FAD7A0]/70 shadow-xs flex items-center gap-4">
                      <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
                        <BarChart3 className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wide">
                          OVERALL PROGRESS
                        </p>
                        <p className="text-2xl font-extrabold text-[#2C3E50]">
                          {overallProgressPercent}%
                        </p>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-[#FAD7A0]/70 shadow-xs flex items-center gap-4">
                      <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wide">
                          CURRENT MODULE
                        </p>
                        <p className="text-sm font-extrabold text-[#2C3E50] truncate">
                          {simulationState === 'm2_released' ? 'Module 2' : 'Module 1'}
                        </p>
                        <p className="text-[11px] text-amber-700 font-semibold truncate mt-0.5">
                          {currentModuleTitle}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-[#FAD7A0]/70 shadow-xs flex items-center gap-4">
                      <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wide">
                          COMPLETED MODULES
                        </p>
                        <p className="text-2xl font-extrabold text-[#2C3E50]">
                          {completedModulesCount}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 12. PROMINENT CURRENT MODULE CARD (Requirement 12) */}
                  <div className="bg-gradient-to-br from-[#FFF8F0] to-white p-6 rounded-2xl border-2 border-[#D35400]/30 shadow-md space-y-4">
                    <div className="flex items-center justify-between border-b border-[#FAD7A0]/80 pb-3">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-[#D35400]" />
                        <h2 className="text-base font-extrabold font-serif text-[#2C3E50]">
                          CURRENT MODULE
                        </h2>
                      </div>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full border border-emerald-300">
                        🔓 AVAILABLE
                      </span>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-bold text-[#D35400] uppercase tracking-wider">
                        Module {simulationState === 'm2_released' ? '2' : '1'}
                      </p>
                      <h3 className="text-lg font-extrabold text-[#2C3E50] font-serif">
                        {currentModuleTitle}
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {simulationState === 'm2_released'
                          ? R26_MODULES[1]?.shortDesc
                          : R26_MODULES[0]?.shortDesc}
                      </p>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                      <div className="space-y-1 min-w-[200px]">
                        <div className="flex justify-between text-xs font-bold text-gray-600">
                          <span>Progress</span>
                          <span>{simulationState === 'm2_released' ? '0%' : '0%'}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-[#D35400] w-0" />
                        </div>
                      </div>

                      <div className="space-y-1 text-right">
                        <button
                          type="button"
                          disabled={true}
                          title="Action disabled in Review Mode."
                          className="w-full sm:w-auto px-6 py-2.5 bg-gray-300 text-gray-500 font-bold text-xs rounded-xl cursor-not-allowed opacity-70 flex items-center justify-center gap-2"
                        >
                          <Play className="w-4 h-4 fill-current" />
                          <span>START MODULE</span>
                        </button>
                        <p className="text-[10px] text-gray-400 font-medium">
                          Action disabled in Review Mode.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 5. MY LEARNING JOURNEY — CENTRAL FEATURE (Requirement 5, 6, 7, 8, 22) */}
                  <div className="bg-white p-6 rounded-2xl border border-[#FAD7A0]/70 shadow-xs space-y-5">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div>
                        <h2 className="text-lg font-extrabold font-serif text-[#2C3E50]">
                          MY LEARNING JOURNEY
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Complete each module in sequence. Your Faculty Incharge releases subsequent modules upon review.
                        </p>
                      </div>
                    </div>

                    {/* MODULE LIST */}
                    <div className="space-y-4">
                      {R26_MODULES.map((module, index) => {
                        const status = getModuleStatus(index);
                        const isAvailable = status === 'AVAILABLE';
                        const isCompleted = status === 'COMPLETED';
                        const isLocked = status === 'LOCKED';

                        return (
                          <div
                            key={module.id}
                            className={`p-5 rounded-2xl border transition-all space-y-3 ${
                              isCompleted
                                ? 'bg-emerald-50/50 border-emerald-300'
                                : isAvailable
                                ? 'bg-[#FFF8F0]/60 border-[#D35400]/40 shadow-xs'
                                : 'bg-gray-50/80 border-gray-200 opacity-80'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="space-y-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="px-2 py-0.5 bg-[#2C3E50] text-[#FAD7A0] text-[10px] font-extrabold rounded-md uppercase tracking-wider">
                                    MODULE {index + 1}
                                  </span>
                                  <span className="text-xs font-mono text-gray-400">
                                    {module.code}
                                  </span>

                                  {/* STATUS BADGES (Req 13, 14, 22) */}
                                  {isCompleted && (
                                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-md flex items-center gap-1 border border-emerald-300">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                      <span>✓ COMPLETED</span>
                                    </span>
                                  )}
                                  {isAvailable && (
                                    <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-black rounded-md flex items-center gap-1 border border-blue-300">
                                      <Unlock className="w-3.5 h-3.5 text-blue-600" />
                                      <span>🔓 AVAILABLE</span>
                                    </span>
                                  )}
                                  {isLocked && (
                                    <span className="px-2.5 py-0.5 bg-gray-200 text-gray-700 text-[10px] font-black rounded-md flex items-center gap-1 border border-gray-300">
                                      <Lock className="w-3.5 h-3.5 text-gray-500" />
                                      <span>🔒 LOCKED</span>
                                    </span>
                                  )}
                                </div>

                                <h3 className="font-extrabold text-base text-[#2C3E50] font-serif pt-0.5">
                                  {module.title}
                                </h3>
                                <p className="text-xs text-gray-600 max-w-2xl">
                                  {module.shortDesc}
                                </p>
                              </div>

                              {/* BUTTON & ACTION AREA (Req 20) */}
                              <div className="shrink-0 flex flex-col items-end gap-1">
                                {isAvailable && (
                                  <button
                                    type="button"
                                    disabled={true}
                                    title="Action disabled in Review Mode."
                                    className="px-5 py-2 bg-gray-300 text-gray-500 text-xs font-bold rounded-xl cursor-not-allowed opacity-70 flex items-center gap-1.5"
                                  >
                                    <Play className="w-3.5 h-3.5 fill-current" />
                                    <span>START MODULE</span>
                                  </button>
                                )}

                                {isCompleted && (
                                  <button
                                    type="button"
                                    disabled={true}
                                    title="Action disabled in Review Mode."
                                    className="px-5 py-2 bg-emerald-200 text-emerald-800 text-xs font-bold rounded-xl cursor-not-allowed opacity-80 flex items-center gap-1.5"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>REVIEW MODULE</span>
                                  </button>
                                )}

                                {isLocked && (
                                  <button
                                    type="button"
                                    disabled={true}
                                    title="Complete the current module and wait for Faculty release."
                                    className="px-5 py-2 bg-gray-200 text-gray-400 text-xs font-bold rounded-xl cursor-not-allowed flex items-center gap-1.5"
                                  >
                                    <Lock className="w-3.5 h-3.5" />
                                    <span>LOCKED</span>
                                  </button>
                                )}

                                <p className="text-[10px] text-gray-400">
                                  {isAvailable ? 'Action disabled in Review Mode.' : ''}
                                </p>
                              </div>
                            </div>

                            {/* LOCK RELEASE MESSAGES (Req 7, 10, 23) */}
                            {isLocked && (
                              <div className="p-3 bg-gray-100 rounded-xl text-xs text-gray-600 border border-gray-200 flex items-center gap-2">
                                <Lock className="w-4 h-4 text-gray-400 shrink-0" />
                                <span>
                                  Complete the current module first. Your Faculty Incharge will release the next module after reviewing your class progress.
                                </span>
                              </div>
                            )}

                            {isCompleted && (
                              <div className="p-3 bg-emerald-100/70 rounded-xl text-xs text-emerald-900 border border-emerald-200 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>
                                  Completed ✓ — Waiting for Faculty Incharge to release the next module.
                                </span>
                              </div>
                            )}

                            {isAvailable && simulationState === 'm2_released' && index === 1 && (
                              <div className="p-3 bg-blue-100/70 rounded-xl text-xs text-blue-900 border border-blue-200 flex items-center gap-2">
                                <Unlock className="w-4 h-4 text-blue-600 shrink-0" />
                                <span>
                                  Module 2 has been released by your Faculty Incharge.
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: MY PROGRESS */}
              {activeTab === 'progress' && (
                <div className="bg-white p-6 rounded-2xl border border-[#FAD7A0]/70 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-[#D35400]" />
                      <h2 className="text-lg font-extrabold font-serif text-[#2C3E50]">
                        MY PROGRESS
                      </h2>
                    </div>
                  </div>

                  <div className="p-5 bg-[#FFF8F0] rounded-xl border border-[#FAD7A0] space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs">
                      <div className="p-3 bg-white rounded-lg border border-[#FAD7A0]/50">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Overall Completion</p>
                        <p className="font-extrabold text-[#2C3E50] text-base">{overallProgressPercent}%</p>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-[#FAD7A0]/50">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Completed Modules</p>
                        <p className="font-extrabold text-emerald-700 text-base">{completedModulesCount}</p>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-[#FAD7A0]/50">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Current Module</p>
                        <p className="font-extrabold text-amber-800 text-base">Module {simulationState === 'm2_released' ? '2' : '1'}</p>
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>No student progress is available in Review Mode.</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: MY ASSESSMENTS */}
              {activeTab === 'assessments' && (
                <div className="bg-white p-6 rounded-2xl border border-[#FAD7A0]/70 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-5 h-5 text-[#D35400]" />
                      <h2 className="text-lg font-extrabold font-serif text-[#2C3E50]">
                        MY ASSESSMENTS
                      </h2>
                    </div>
                  </div>

                  <div className="p-10 text-center space-y-3 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <FileCheck className="w-12 h-12 text-gray-300 mx-auto" />
                    <h3 className="text-base font-bold text-[#2C3E50]">No Pending Assessments</h3>
                    <p className="text-xs text-gray-500">
                      No pending assessments in Review Mode.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: MY PORTFOLIO */}
              {activeTab === 'portfolio' && (
                <div className="bg-white p-6 rounded-2xl border border-[#FAD7A0]/70 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2">
                      <FolderKanban className="w-5 h-5 text-[#D35400]" />
                      <h2 className="text-lg font-extrabold font-serif text-[#2C3E50]">
                        MY PORTFOLIO
                      </h2>
                    </div>
                  </div>

                  <div className="p-10 text-center space-y-3 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <FolderKanban className="w-12 h-12 text-gray-300 mx-auto" />
                    <h3 className="text-base font-bold text-[#2C3E50]">No Portfolio Submissions</h3>
                    <p className="text-xs text-gray-500">
                      No portfolio items uploaded in Review Mode.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: PROFILE */}
              {activeTab === 'profile' && (
                <div className="bg-white p-6 rounded-2xl border border-[#FAD7A0]/70 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-[#D35400]" />
                      <h2 className="text-lg font-extrabold font-serif text-[#2C3E50]">
                        STUDENT PROFILE PREVIEW
                      </h2>
                    </div>
                  </div>

                  <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-gray-400 font-bold uppercase text-[10px]">Student Name</label>
                        <p className="font-extrabold text-[#2C3E50] text-sm">{studentProfile.name}</p>
                      </div>
                      <div>
                        <label className="text-gray-400 font-bold uppercase text-[10px]">Roll Number</label>
                        <p className="font-extrabold text-[#2C3E50] text-sm font-mono">{studentProfile.rollNo}</p>
                      </div>
                      <div>
                        <label className="text-gray-400 font-bold uppercase text-[10px]">Status</label>
                        <p className="font-extrabold text-emerald-700 text-sm">{studentProfile.status}</p>
                      </div>
                      <div>
                        <label className="text-gray-400 font-bold uppercase text-[10px]">Program</label>
                        <p className="font-extrabold text-[#2C3E50] text-sm">{studentProfile.program}</p>
                      </div>
                      <div>
                        <label className="text-gray-400 font-bold uppercase text-[10px]">Academic Year & Semester</label>
                        <p className="font-extrabold text-[#2C3E50] text-sm">{studentProfile.academicYear} • Semester {studentProfile.semester} ({studentProfile.section})</p>
                      </div>
                      <div>
                        <label className="text-gray-400 font-bold uppercase text-[10px]">Faculty Incharge</label>
                        <p className="font-extrabold text-[#2C3E50] text-sm">{studentProfile.facultyIncharge}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs">
                      Profile modifications are disabled in Review Mode.
                    </div>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: SETTINGS */}
              {activeTab === 'settings' && (
                <div className="bg-white p-6 rounded-2xl border border-[#FAD7A0]/70 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-[#D35400]" />
                      <h2 className="text-lg font-extrabold font-serif text-[#2C3E50]">
                        SETTINGS
                      </h2>
                    </div>
                  </div>

                  <div className="p-6 text-center space-y-2 bg-gray-50 rounded-2xl border border-gray-200 text-xs">
                    <Settings className="w-8 h-8 text-gray-400 mx-auto" />
                    <p className="font-bold text-[#2C3E50]">
                      Student Preferences & Settings
                    </p>
                    <p className="text-gray-500">
                      Settings modification disabled in Review Mode.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

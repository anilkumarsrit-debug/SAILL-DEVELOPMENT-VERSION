import React from 'react';
import { FacultyWorkbenchTabKey } from '../../types/faculty';
import {
  Home,
  Users,
  BookOpen,
  Target,
  BarChart3,
  Bot,
  FileCheck,
  FolderGit2,
  FileSpreadsheet,
  Settings,
  ShieldAlert,
  GraduationCap,
  Award
} from 'lucide-react';

interface FacultySidebarProps {
  activeTab: FacultyWorkbenchTabKey;
  onSelectTab: (tab: FacultyWorkbenchTabKey) => void;
  facultyName: string;
  employeeId: string;
  department: string;
  assignedCount: number;
}

export const FacultySidebar: React.FC<FacultySidebarProps> = ({
  activeTab,
  onSelectTab,
  facultyName,
  employeeId,
  department,
  assignedCount
}) => {
  const navItems: { key: FacultyWorkbenchTabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'home', label: 'Dashboard', icon: <Home className="w-4 h-4" /> },
    { key: 'classes', label: 'My Classes', icon: <GraduationCap className="w-4 h-4" /> },
    { key: 'students', label: 'My Students', icon: <Users className="w-4 h-4" /> },
    { key: 'progress-monitor', label: 'Module Progress', icon: <BarChart3 className="w-4 h-4" /> },
    { key: 'module-scoring', label: 'Module Scoring (1–10)', icon: <Award className="w-4 h-4" /> },
    { key: 'release-modules', label: 'Release Modules', icon: <BookOpen className="w-4 h-4" /> },
    { key: 'assessments', label: 'AI Audio Reviews', icon: <FileCheck className="w-4 h-4" /> },
    { key: 'reports', label: 'Reports', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { key: 'settings', label: 'Profile & Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <aside className="w-full lg:w-64 bg-[#2C3E50] text-white rounded-2xl p-4 shadow-xl border border-[#FAD7A0]/20 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        {/* Faculty Profile Card Header */}
        <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 backdrop-blur-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#D35400] to-[#E67E22] flex items-center justify-center font-bold text-white text-base shadow-sm shrink-0">
            {facultyName.charAt(0) || 'F'}
          </div>
          <div className="overflow-hidden min-w-0">
            <h3 className="font-bold text-sm text-[#FAD7A0] truncate">{facultyName}</h3>
            <p className="text-[11px] text-gray-300 truncate font-mono">{employeeId}</p>
            <p className="text-[10px] text-emerald-300 font-semibold mt-0.5 truncate">
              {assignedCount} Assigned Students
            </p>
          </div>
        </div>

        {/* Navigation Menu List */}
        <nav className="space-y-1">
          <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
            Faculty Workbench
          </div>
          {navItems.map((item) => {
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onSelectTab(item.key)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all duration-150 text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#D35400] text-white font-bold shadow-md translate-x-1'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-gray-400'}>{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Faculty Workspace Footer Badge */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 p-2.5 bg-[#1F2C38] rounded-xl text-[11px] text-amber-200/90 border border-amber-500/20">
          <GraduationCap className="w-4 h-4 text-[#E67E22] shrink-0" />
          <div className="leading-tight">
            <p className="font-bold text-[10px] text-[#FAD7A0]">Faculty Workspace</p>
            <p className="text-[10px] text-gray-400">SAILL Learning Platform</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

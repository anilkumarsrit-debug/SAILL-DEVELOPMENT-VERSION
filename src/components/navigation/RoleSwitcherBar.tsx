import React from 'react';
import { UserRole, Page } from '../../types';
import { ShieldCheck, UserCheck, BookOpen, GraduationCap, Eye, ChevronRight } from 'lucide-react';

interface RoleSwitcherBarProps {
  activeRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onNavigatePage: (page: Page) => void;
}

const ROLES_CONFIG: { role: UserRole; title: string; icon: React.FC<{ className?: string }>; color: string; defaultPage: Page; desc: string }[] = [
  {
    role: 'STUDENT',
    title: 'Student',
    icon: GraduationCap,
    color: 'bg-[#27AE60] text-white border-[#1E8449]',
    defaultPage: 'dashboard',
    desc: 'Interactive lab modules & AI practice'
  },
  {
    role: 'FACULTY_INCHARGE',
    title: 'Faculty Incharge',
    icon: UserCheck,
    color: 'bg-indigo-700 text-white border-indigo-800',
    defaultPage: 'faculty-dashboard',
    desc: 'Scoped batch oversight, attendance & reports'
  },
  {
    role: 'ADMINISTRATOR',
    title: 'Administrator',
    icon: ShieldCheck,
    color: 'bg-purple-700 text-white border-purple-800',
    defaultPage: 'admin-control',
    desc: 'Approvals, RBAC, scope allocation & audit logs'
  }
];

export const RoleSwitcherBar: React.FC<RoleSwitcherBarProps> = ({
  activeRole,
  onSelectRole,
  onNavigatePage
}) => {
  const currentRoleObj = ROLES_CONFIG.find((r) => r.role === activeRole) || ROLES_CONFIG[2];

  const handleSwitch = (role: UserRole, targetPage: Page) => {
    onSelectRole(role);
    onNavigatePage(targetPage);
  };

  return (
    <div className="bg-[#2C3E50] text-white text-xs py-2 px-4 shadow-md border-b border-[#34495E]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#FAD7A0] uppercase tracking-wider text-[10px]">Active Role Perspective:</span>
          <div className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 shadow-xs ${currentRoleObj.color}`}>
            <currentRoleObj.icon className="w-3.5 h-3.5" />
            <span>{currentRoleObj.title}</span>
          </div>
          <span className="hidden md:inline text-gray-300 text-[11px]">— {currentRoleObj.desc}</span>
        </div>

        <div className="flex items-center gap-1 flex-wrap justify-center">
          <span className="text-[10px] text-gray-400 mr-1">Switch Role:</span>
          {ROLES_CONFIG.map((item) => {
            const isActive = item.role === activeRole;
            const Icon = item.icon;
            return (
              <button
                key={item.role}
                onClick={() => handleSwitch(item.role, item.defaultPage)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition flex items-center gap-1 border ${
                  isActive
                    ? 'bg-[#E67E22] text-white border-[#D35400] font-bold shadow-xs'
                    : 'bg-[#34495E] text-gray-200 border-gray-600 hover:bg-[#415B76] hover:text-white'
                }`}
                title={item.desc}
              >
                <Icon className="w-3 h-3" />
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

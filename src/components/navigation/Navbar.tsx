import React from 'react';
import { Page, StudentProfile, UserRole } from '../../types';
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  Menu
} from 'lucide-react';
import { NotificationBell } from '../notifications/NotificationBell';
import { GlobalSearch } from './GlobalSearch';
import { UserProfileMenu } from './UserProfileMenu';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  profile: StudentProfile;
  activeRole: UserRole;
  onRoleChange?: (role: UserRole) => void;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onOpenHelp?: () => void;
  onLogout?: () => void;
}

const ROLES_LIST: { role: string; title: string; icon: React.FC<{ className?: string }>; color: string }[] = [
  { role: 'STUDENT', title: 'Student', icon: GraduationCap, color: 'text-[#27AE60]' },
  { role: 'FACULTY_INCHARGE', title: 'Faculty Incharge', icon: UserCheck, color: 'text-indigo-600' },
  { role: 'ADMINISTRATOR', title: 'Administrator', icon: ShieldCheck, color: 'text-purple-600' }
];

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  profile,
  activeRole,
  isSidebarCollapsed,
  onToggleSidebar,
  onOpenHelp,
  onLogout
}) => {
  const roleUpper = (activeRole || 'STUDENT').toString().toUpperCase();
  const currentRoleObj =
    ROLES_LIST.find(
      (r) =>
        r.role === roleUpper ||
        (r.role === 'FACULTY_INCHARGE' && roleUpper === 'FACULTY')
    ) || ROLES_LIST[0];

  const handleHomeClick = () => {
    if (roleUpper.includes('ADMIN')) {
      onNavigate('admin-control');
    } else if (roleUpper.includes('FACULTY')) {
      onNavigate('faculty-dashboard');
    } else {
      onNavigate('dashboard');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-white/95 backdrop-blur-md border-b border-[#FAD7A0] shadow-xs select-none">
      <div className="w-full h-full px-4 sm:px-6 flex items-center justify-between gap-3 sm:gap-4">
        
        {/* LEFT SECTION */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Sidebar Toggle Trigger Button */}
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-gray-600 hover:bg-[#FFF8F0] hover:text-[#D35400] transition border border-gray-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D35400]"
            title={isSidebarCollapsed ? 'Expand Navigation Sidebar' : 'Collapse Navigation Sidebar'}
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Brand Logo & Title */}
          <div
            onClick={handleHomeClick}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#D35400] text-white p-0.5 shadow-md group-hover:bg-[#E67E22] transition flex items-center justify-center font-black">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-[#D35400] tracking-tight font-serif leading-none">
                  SAILL
                </span>
                <span className="text-[10px] font-bold bg-[#FFF8F0] text-[#D35400] border border-[#FAD7A0] px-1.5 py-0.5 rounded-xs hidden sm:inline-block">
                  R26
                </span>
              </div>
              <p className="text-[11px] font-semibold text-gray-600 tracking-wide leading-tight hidden xl:block">
                SRIT AI Language Laboratory
              </p>
            </div>
          </div>
        </div>

        {/* CENTER SECTION - Global Search Placeholder Component */}
        <div className="hidden md:flex flex-1 items-center justify-center max-w-md mx-auto">
          <GlobalSearch />
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Notifications Widget */}
          <NotificationBell onNavigate={onNavigate} />

          {/* Role Indicator Badge */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-xl text-xs font-bold text-[#2C3E50] shadow-2xs select-none"
            title={`Authenticated Role: ${currentRoleObj.title}`}
          >
            <currentRoleObj.icon className={`w-3.5 h-3.5 ${currentRoleObj.color}`} />
            <span className="truncate max-w-[110px] text-[#D35400] font-extrabold">{currentRoleObj.title}</span>
          </div>

          {/* User Profile Dropdown Menu Component */}
          <UserProfileMenu
            profile={profile}
            activeRole={activeRole}
            onNavigate={onNavigate}
            onOpenHelp={onOpenHelp}
            onLogout={onLogout || (() => {})}
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;

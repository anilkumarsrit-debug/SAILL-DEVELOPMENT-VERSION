import React from 'react';
import { Page, UserRole } from '../../types';
import {
  LayoutDashboard,
  BookOpen,
  Sparkles,
  PenTool,
  FolderCheck,
  BarChart3,
  Megaphone,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  ClipboardList,
  Calculator,
  TrendingUp,
  FileSpreadsheet,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  activeRole: UserRole;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenHelp: () => void;
  onLogout: () => void;
  onMobileClose?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.FC<{ className?: string }>;
  page?: Page;
  action?: () => void;
  isCustomAction?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  activeRole,
  isCollapsed,
  onToggleCollapse,
  onOpenHelp,
  onLogout,
  onMobileClose
}) => {
  const roleUpper = (activeRole || 'STUDENT').toString().toUpperCase();
  const isFacultyIncharge = roleUpper === 'FACULTY_INCHARGE' || roleUpper === 'FACULTY';
  const isAdmin = roleUpper === 'ADMINISTRATOR';

  // Primary Menu Items
  const primaryMenuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      page: isFacultyIncharge ? 'faculty-dashboard' : isAdmin ? 'admin-control' : 'dashboard'
    },
    {
      id: 'modules',
      label: 'Lab Modules',
      icon: BookOpen,
      page: 'modules'
    },
    {
      id: 'ai-engine',
      label: 'AI Engine',
      icon: Sparkles,
      page: 'ai-engine'
    },
    {
      id: 'practice',
      label: 'Practice Centre',
      icon: PenTool,
      page: 'practice'
    },
    {
      id: 'portfolio',
      label: 'Portfolio',
      icon: FolderCheck,
      page: 'portfolio'
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: BarChart3,
      page: 'progress'
    },
    {
      id: 'notices',
      label: 'Notices',
      icon: Megaphone,
      page: 'announcements'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      page: 'profile'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      page: 'settings'
    },
    {
      id: 'help',
      label: 'Help',
      icon: HelpCircle,
      action: onOpenHelp,
      isCustomAction: true
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: LogOut,
      action: onLogout,
      isCustomAction: true
    }
  ];

  // Faculty & Admin sub-items when in academic management roles
  const facultyMenuItems: { id: Page; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'attendance', label: 'Attendance', icon: UserCheck },
    { id: 'rubrics', label: 'Rubrics', icon: ClipboardList },
    { id: 'internal-marks', label: 'CIA Marks', icon: Calculator },
    { id: 'analytics', label: 'Analytics & CO-PO', icon: TrendingUp },
    { id: 'reports', label: 'Reports Export', icon: FileSpreadsheet },
    { id: 'faculty-assistant', label: 'AI Assistant', icon: Sparkles },
    { id: 'admin-control', label: 'Admin Control', icon: ShieldCheck },
    { id: 'production-certification', label: 'V1.0 Certification', icon: ShieldCheck }
  ];

  const handleItemClick = (item: MenuItem) => {
    if (onMobileClose) onMobileClose();
    if (item.isCustomAction && item.action) {
      item.action();
    } else if (item.page) {
      onNavigate(item.page);
    }
  };

  const handleSubItemClick = (page: Page) => {
    if (onMobileClose) onMobileClose();
    onNavigate(page);
  };

  return (
    <aside
      aria-label="Portal Navigation Sidebar"
      className={`fixed top-16 left-0 bottom-0 z-30 bg-[#2C3E50] text-white border-r border-[#34495E] transition-all duration-300 flex flex-col justify-between select-none ${
        isCollapsed ? 'w-[72px]' : 'w-[280px]'
      }`}
    >
      {/* Sidebar Top / Brand Banner */}
      <div className="flex flex-col flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
        {/* Institutional Header inside Sidebar */}
        <div className="flex items-center justify-between pb-3 border-b border-[#34495E]">
          {!isCollapsed ? (
            <div className="flex items-center gap-2.5 px-1">
              <div className="w-8 h-8 rounded-lg bg-[#D35400] text-white flex items-center justify-center font-black shadow-sm">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif font-extrabold text-sm text-[#FAD7A0] tracking-wide block">
                  SAILL Navigation
                </span>
                <span className="text-[10px] text-gray-300 uppercase tracking-wider font-semibold block">
                  {activeRole} View
                </span>
              </div>
            </div>
          ) : (
            <div className="mx-auto w-9 h-9 rounded-lg bg-[#D35400] text-white flex items-center justify-center font-black shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
          )}

          {/* Collapse Toggle Button */}
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg bg-[#34495E] hover:bg-[#D35400] text-gray-200 hover:text-white transition shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FAD7A0]"
            title={isCollapsed ? 'Expand Sidebar (280px)' : 'Collapse Sidebar (72px)'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Primary Menu Links */}
        <nav className="space-y-1">
          {primaryMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.page && currentPage === item.page;

            return (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => handleItemClick(item)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FAD7A0] ${
                    isActive
                      ? 'bg-[#D35400] text-white shadow-md font-bold'
                      : item.id === 'logout'
                      ? 'text-red-300 hover:bg-red-900/30 hover:text-red-200'
                      : 'text-gray-200 hover:bg-[#34495E] hover:text-[#FAD7A0]'
                  } ${isCollapsed ? 'justify-center px-0' : ''}`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition ${
                      isActive
                        ? 'text-white'
                        : item.id === 'logout'
                        ? 'text-red-400 group-hover:scale-110'
                        : 'text-[#FAD7A0] group-hover:scale-110'
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="truncate tracking-wide">{item.label}</span>
                  )}
                </button>

                {/* Tooltip Mode in Collapsed Desktop Sidebar */}
                {isCollapsed && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1 bg-[#2C3E50] border-2 border-[#FAD7A0] text-[#FFF8F0] text-xs font-extrabold rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    {item.label}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Extra Academic Tools section for Faculty Incharge / Admin */}
        {(isFacultyIncharge || isAdmin) && (
          <div className="pt-3 border-t border-[#34495E] space-y-2">
            {!isCollapsed && (
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FAD7A0] px-3 block">
                Academic Management
              </span>
            )}
            <div className="space-y-1">
              {facultyMenuItems
                .filter((item) => (item.id === 'admin-control' ? isAdmin : true))
                .map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <div key={item.id} className="relative group">
                      <button
                        onClick={() => handleSubItemClick(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FAD7A0] ${
                          isActive
                            ? 'bg-[#E67E22] text-white font-bold shadow-xs'
                            : 'text-gray-300 hover:bg-[#34495E] hover:text-white'
                        } ${isCollapsed ? 'justify-center px-0' : ''}`}
                      >
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-[#F8C471]'}`} />
                        {!isCollapsed && <span className="truncate">{item.label}</span>}
                      </button>

                      {/* Tooltip in Collapsed State */}
                      {isCollapsed && (
                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1 bg-[#2C3E50] border-2 border-[#FAD7A0] text-[#FFF8F0] text-xs font-extrabold rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                          {item.label}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {/* Sidebar Footer info */}
      {!isCollapsed && (
        <div className="p-3 border-t border-[#34495E] bg-[#22313F] text-[10px] text-gray-400 text-center space-y-0.5">
          <p className="font-extrabold text-[#FAD7A0] font-serif">SAILL R26 System</p>
          <p>SRIT Autonomous • AP, India</p>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;

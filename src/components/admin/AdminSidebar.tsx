import React from 'react';
import {
  LayoutDashboard,
  Users,
  Building2,
  BookOpen,
  UserCheck,
  GraduationCap,
  Bot,
  BarChart3,
  Settings,
  Clock,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  Terminal,
  Award
} from 'lucide-react';

export type AdminTabKey =
  | 'dashboard'
  | 'monitoring'
  | 'users'
  | 'academic'
  | 'modules'
  | 'faculty'
  | 'students'
  | 'ai-monitoring'
  | 'reports'
  | 'settings'
  | 'activity-logs'
  | 'developer-console';

interface SidebarItem {
  key: AdminTabKey;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
}

interface AdminSidebarProps {
  activeTab: AdminTabKey;
  onSelectTab: (tab: AdminTabKey) => void;
  pendingCount?: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  pendingCount = 0,
  collapsed,
  onToggleCollapse
}) => {
  interface NavGroup {
    groupTitle?: string;
    items: SidebarItem[];
  }

  const navGroups: NavGroup[] = [
    {
      groupTitle: 'SUPERVISION & GOVERNANCE',
      items: [
        { key: 'dashboard', label: 'Supervision Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      groupTitle: 'INSTITUTION & SETUP',
      items: [
        { key: 'academic', label: 'Academic Setup & Programs', icon: Building2 },
        { key: 'modules', label: 'Module Management', icon: BookOpen }
      ]
    },
    {
      groupTitle: 'PEOPLE & APPROVALS',
      items: [
        { key: 'users', label: 'Account Approvals', icon: Users, badge: pendingCount > 0 ? pendingCount : undefined },
        { key: 'faculty', label: 'Faculty Incharges & Scope', icon: UserCheck },
        { key: 'students', label: 'Student Roster', icon: GraduationCap }
      ]
    },
    {
      groupTitle: 'MONITORING & REPORTS',
      items: [
        { key: 'monitoring', label: 'Evaluation Monitoring', icon: Award },
        { key: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
        { key: 'ai-monitoring', label: 'AI Voice & Speech Log', icon: Bot },
        { key: 'activity-logs', label: 'Activity Logs', icon: Clock }
      ]
    },
    {
      groupTitle: 'SYSTEM & TOOLS',
      items: [
        { key: 'developer-console', label: 'Developer Console', icon: Terminal },
        { key: 'settings', label: 'Platform Settings', icon: Settings }
      ]
    }
  ];

  return (
    <aside
      className={`bg-[#2C3E50] text-white flex flex-col justify-between transition-all duration-300 shrink-0 border-r border-[#34495E] shadow-xl relative ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand & Header */}
      <div>
        <div className="p-4 border-b border-[#34495E] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2.5 bg-gradient-to-br from-[#D35400] to-[#E67E22] rounded-xl text-white shadow-md shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#FAD7A0]" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <h1 className="text-sm font-black tracking-wider text-[#FAD7A0] font-serif uppercase truncate">
                  SAILL Command
                </h1>
                <p className="text-[10px] text-gray-300 font-semibold truncate">
                  SRIT Administrator Portal
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg bg-[#34495E]/80 hover:bg-[#34495E] text-gray-300 hover:text-white transition cursor-pointer shrink-0"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Menu List */}
        <nav className="p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              {!collapsed && group.groupTitle && (
                <div className="px-3 pt-2 pb-1 text-[10px] font-black uppercase tracking-wider text-[#FAD7A0]/70 font-mono">
                  {group.groupTitle}
                </div>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.key;

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => onSelectTab(item.key)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer group relative ${
                      isActive
                        ? 'bg-gradient-to-r from-[#D35400] to-[#E67E22] text-white shadow-md border border-[#FAD7A0]/30'
                        : 'text-gray-300 hover:text-white hover:bg-[#34495E]/60'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-[#FAD7A0]'
                      }`}
                    />

                    {!collapsed && (
                      <span className="truncate flex-1 text-left font-sans">{item.label}</span>
                    )}

                    {!collapsed && item.badge !== undefined && (
                      <span className="px-2 py-0.5 rounded-full bg-[#D35400] text-white text-[10px] font-extrabold animate-pulse border border-[#FAD7A0]">
                        {item.badge}
                      </span>
                    )}

                    {/* Collapsed Badge Dot */}
                    {collapsed && item.badge !== undefined && (
                      <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#D35400] border border-white animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer Info / Badge */}
      <div className="p-3 border-t border-[#34495E]">
        {!collapsed ? (
          <div className="p-3 bg-[#1F2C38] rounded-xl border border-[#34495E] space-y-1">
            <div className="flex items-center gap-2 text-[11px] font-bold text-[#FAD7A0]">
              <Sparkles className="w-3.5 h-3.5 text-[#D35400]" />
              <span>SRIT R26 System v3.2</span>
            </div>
            <p className="text-[10px] text-gray-400">Communicative English Lab</p>
          </div>
        ) : (
          <div className="flex justify-center py-2" title="SRIT R26 System">
            <Sparkles className="w-4 h-4 text-[#FAD7A0]" />
          </div>
        )}
      </div>
    </aside>
  );
};

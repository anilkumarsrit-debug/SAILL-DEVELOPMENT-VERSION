import React from 'react';
import { Page, UserRole } from '../../types';
import {
  Home,
  BookOpen,
  Bot,
  Bell,
  User,
  LayoutDashboard,
  UserCheck,
  ClipboardList,
  Calculator,
  FolderCheck,
  ShieldCheck,
  Megaphone
} from 'lucide-react';

interface MobileNavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  activeRole?: UserRole;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentPage,
  onNavigate,
  activeRole = 'student'
}) => {
  const getMobileItems = (): { id: Page; label: string; icon: React.FC<{ className?: string }> }[] => {
    const normalizedRole = String(activeRole).toUpperCase();
    if (normalizedRole.includes('FACULTY')) {
      return [
        { id: 'faculty-dashboard', label: 'Faculty', icon: LayoutDashboard },
        { id: 'attendance', label: 'Attendance', icon: UserCheck },
        { id: 'rubrics', label: 'Rubrics', icon: ClipboardList },
        { id: 'internal-marks', label: 'CIA Marks', icon: Calculator },
        { id: 'portfolio-review', label: 'Portfolios', icon: FolderCheck }
      ];
    } else if (normalizedRole.includes('ADMIN')) {
      return [
        { id: 'admin-control', label: 'Admin', icon: ShieldCheck },
        { id: 'faculty-dashboard', label: 'Faculty', icon: LayoutDashboard },
        { id: 'announcements', label: 'Notices', icon: Megaphone }
      ];
    } else {
      return [
        { id: 'dashboard', label: 'Home', icon: Home },
        { id: 'modules', label: 'Modules', icon: BookOpen },
        { id: 'ai-engine', label: 'AI Coach', icon: Bot },
        { id: 'announcements', label: 'Notices', icon: Bell },
        { id: 'profile', label: 'Profile', icon: User }
      ];
    }
  };

  const mobileItems = getMobileItems();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#FAD7A0] py-1.5 px-1 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {mobileItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] px-2 py-1 rounded-xl transition-all cursor-pointer ${
                isActive ? 'text-[#D35400] font-bold bg-[#FFF8F0] shadow-2xs' : 'text-gray-500 hover:text-[#D35400]'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-[#D35400]' : ''}`} />
              <span className="text-[10px] font-medium tracking-tight mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};


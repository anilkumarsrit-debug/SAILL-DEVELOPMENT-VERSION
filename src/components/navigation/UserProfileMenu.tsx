/**
 * SAILL - SRIT AI Language Laboratory
 * User Profile Dropdown Menu
 *
 * @version 1.0.0
 * @description Accessible user profile avatar button with dropdown menu containing Profile, Settings, Help, and Logout.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Page, StudentProfile, UserRole } from '../../types';
import {
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  ShieldCheck,
  UserCheck,
  GraduationCap
} from 'lucide-react';
import { getRoleDisplayName } from '../../types/auth';
import { AuthService } from '../../services/AuthService';

export interface UserProfileMenuProps {
  profile: StudentProfile;
  activeRole: UserRole;
  onNavigate: (page: Page) => void;
  onOpenHelp?: () => void;
  onLogout: () => void;
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
  profile,
  activeRole,
  onNavigate,
  onOpenHelp,
  onLogout
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (action: () => void) => {
    setIsOpen(false);
    action();
  };

  const sessionUser = AuthService.getCurrentUser();

  const displayName = sessionUser?.name || profile?.name || 'User';
  const displayEmail = sessionUser?.email || profile?.email || '';
  const displayRole = sessionUser?.role ? getRoleDisplayName(sessionUser.role) : getRoleDisplayName(activeRole);
  const displaySubtext = sessionUser?.rollNo || sessionUser?.employeeId || sessionUser?.username || profile?.rollNo || displayRole;
  const avatarUrl = sessionUser?.avatarUrl || profile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

  const getRoleIcon = () => {
    const roleUpper = String(sessionUser?.role || activeRole).toUpperCase();
    if (roleUpper.includes('ADMIN')) return <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />;
    if (roleUpper.includes('FACULTY')) return <UserCheck className="w-3.5 h-3.5 text-indigo-600" />;
    return <GraduationCap className="w-3.5 h-3.5 text-[#27AE60]" />;
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Avatar Button Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User profile menu"
        className="flex items-center gap-2 bg-gray-50 hover:bg-[#FFF8F0] border border-gray-200 hover:border-[#D35400] px-2.5 py-1 rounded-xl cursor-pointer transition shadow-2xs group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D35400]"
      >
        <img
          src={avatarUrl}
          alt={displayName}
          className="w-7 h-7 rounded-full object-cover border border-[#D35400] group-hover:scale-105 transition-transform"
        />
        <div className="text-left hidden lg:block">
          <span className="text-[11px] font-extrabold text-[#2C3E50] block leading-tight truncate max-w-[120px]">
            {displayName}
          </span>
          <span className="text-[9px] text-gray-500 block leading-tight font-medium uppercase truncate max-w-[120px]">
            {displaySubtext}
          </span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-gray-400 group-hover:text-[#D35400] transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#D35400]' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border-2 border-[#FAD7A0] shadow-xl py-2 z-50 text-[#2C3E50] animate-in fade-in zoom-in-95 duration-150"
        >
          {/* User Info Header in Dropdown */}
          <div className="px-4 py-2.5 border-b border-[#FAD7A0]/60 bg-[#FFF8F0]/60">
            <p className="text-xs font-extrabold text-[#2C3E50] truncate">{displayName}</p>
            {displayEmail && <p className="text-[10px] text-gray-500 truncate">{displayEmail}</p>}
            <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-[#FAD7A0] rounded-md text-[10px] font-bold">
              {getRoleIcon()}
              <span className="text-[#D35400]">{displayRole}</span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              role="menuitem"
              onClick={() => handleItemClick(() => onNavigate('profile'))}
              className="w-full text-left px-4 py-2 text-xs font-semibold text-[#2C3E50] hover:bg-[#FFF8F0] hover:text-[#D35400] flex items-center gap-2.5 transition cursor-pointer"
            >
              <User className="w-4 h-4 text-gray-400 group-hover:text-[#D35400]" />
              <span>Profile</span>
            </button>

            <button
              role="menuitem"
              onClick={() => handleItemClick(() => onNavigate('settings'))}
              className="w-full text-left px-4 py-2 text-xs font-semibold text-[#2C3E50] hover:bg-[#FFF8F0] hover:text-[#D35400] flex items-center gap-2.5 transition cursor-pointer"
            >
              <Settings className="w-4 h-4 text-gray-400 group-hover:text-[#D35400]" />
              <span>Settings</span>
            </button>

            {onOpenHelp && (
              <button
                role="menuitem"
                onClick={() => handleItemClick(onOpenHelp)}
                className="w-full text-left px-4 py-2 text-xs font-semibold text-[#2C3E50] hover:bg-[#FFF8F0] hover:text-[#D35400] flex items-center gap-2.5 transition cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-gray-400 group-hover:text-[#D35400]" />
                <span>Help & Support</span>
              </button>
            )}
          </div>

          {/* Logout Action */}
          <div className="pt-1 border-t border-[#FAD7A0]/60 mt-1">
            <button
              role="menuitem"
              onClick={() => handleItemClick(onLogout)}
              className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileMenu;

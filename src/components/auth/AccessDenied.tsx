import React from 'react';
import { ShieldAlert, ArrowLeft, GraduationCap, UserCheck, ShieldCheck } from 'lucide-react';
import { Page } from '../../types';
import { UserRole, getRoleDisplayName } from '../../types/auth';

interface AccessDeniedProps {
  userRole?: UserRole | string | null;
  onReturnToDashboard: (targetPage: Page) => void;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({
  userRole = 'STUDENT',
  onReturnToDashboard
}) => {
  const roleDisplay = getRoleDisplayName(userRole || 'STUDENT');

  let defaultDashboard: Page = 'dashboard';
  if (userRole === 'FACULTY_INCHARGE' || userRole === 'faculty_incharge' || userRole === 'faculty') {
    defaultDashboard = 'faculty-dashboard';
  } else if (userRole === 'ADMINISTRATOR' || userRole === 'administrator') {
    defaultDashboard = 'admin-control';
  }

  const getRoleIcon = () => {
    if (userRole === 'ADMINISTRATOR' || userRole === 'administrator') {
      return <ShieldCheck className="w-5 h-5 text-purple-600" />;
    }
    if (userRole === 'FACULTY_INCHARGE' || userRole === 'faculty_incharge' || userRole === 'faculty') {
      return <UserCheck className="w-5 h-5 text-indigo-600" />;
    }
    return <GraduationCap className="w-5 h-5 text-[#27AE60]" />;
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border-2 border-[#FAD7A0] rounded-3xl p-8 shadow-2xl text-center space-y-6">
        {/* Shield Alert Header */}
        <div className="w-20 h-20 rounded-full bg-red-50 border-2 border-red-200 text-red-600 flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-10 h-10 animate-bounce" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-[#2C3E50] font-serif tracking-tight">
            Access Denied
          </h2>
          <p className="text-sm font-semibold text-red-600 bg-red-50 py-2.5 px-4 rounded-xl border border-red-100">
            Access Denied. You do not have permission to view this page.
          </p>
        </div>

        {/* User Role Information - Read-Only */}
        <div className="bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl p-4 text-left space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D35400] block">
            Current Authenticated Role (Read-Only)
          </span>
          <div className="flex items-center gap-2 text-xs font-bold text-[#2C3E50]">
            {getRoleIcon()}
            <span>Role: <strong className="text-[#D35400] font-extrabold">{roleDisplay}</strong></span>
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Your current institutional role level does not authorize access to this section. Contact the Administrator if you believe your access scope requires updating.
          </p>
        </div>

        {/* Action Button */}
        <div>
          <button
            onClick={() => onReturnToDashboard(defaultDashboard)}
            className="w-full py-3.5 px-6 bg-[#D35400] hover:bg-[#E67E22] text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
            <span>Return to My Authorized Dashboard</span>
          </button>
        </div>

        <div className="text-[10px] text-gray-400 font-medium pt-2 border-t border-gray-100">
          SRIT AI Language Laboratory • Enterprise Role-Based Access Control
        </div>
      </div>
    </div>
  );
};

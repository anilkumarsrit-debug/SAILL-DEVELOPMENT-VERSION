import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Page } from '../types';
import { AuthService } from '../services/AuthService';
import {
  Clock,
  ShieldAlert,
  GraduationCap,
  Mail,
  Building2,
  RefreshCw,
  LogOut,
  ArrowLeft,
  CheckCircle2,
  Phone,
  UserCheck
} from 'lucide-react';

interface PendingApprovalPageProps {
  onNavigate: (page: Page) => void;
  onLogout?: () => void;
}

export const PendingApprovalPage: React.FC<PendingApprovalPageProps> = ({
  onNavigate,
  onLogout
}) => {
  const [checking, setChecking] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string>('');

  const currentUser = AuthService.getCurrentUser();

  const handleCheckStatus = async () => {
    setChecking(true);
    setStatusMsg('');
    setTimeout(() => {
      setChecking(false);
      setStatusMsg('Your account is currently under review by the SAILL Administrator. Please allow up to 24 hours or contact the Department Head.');
    }, 800);
  };

  const handleLogoutClick = async () => {
    if (onLogout) {
      onLogout();
    } else {
      await AuthService.logout();
      onNavigate('landing');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FFF8F0] via-white to-[#FFF8F0]">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#FAD7A0] shadow-xl space-y-6 text-center"
      >
        {/* Status Icon */}
        <div className="relative inline-block">
          <div className="w-16 h-16 bg-[#FFF8F0] border-2 border-[#E67E22] text-[#D35400] rounded-3xl flex items-center justify-center mx-auto shadow-md">
            <Clock className="w-9 h-9 animate-pulse" />
          </div>
          <span className="absolute -bottom-1 -right-1 bg-[#E67E22] text-white p-1 rounded-full text-xs">
            <ShieldAlert className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Status Badge & Title */}
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF8F0] text-[#D35400] border border-[#FAD7A0] rounded-full text-xs font-black uppercase font-mono tracking-wider">
            Pending Administrator Approval
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#2C3E50] font-heading">
            Account Under Review
          </h2>
          <p className="text-xs sm:text-sm text-[#5D6D7E] max-w-md mx-auto leading-relaxed">
            Thank you for registering with the SAILL Platform at SRIT Autonomous. Your registration details have been submitted to the System Administrator for verification.
          </p>
        </div>

        {/* Registered User Info Box */}
        {currentUser && (
          <div className="p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl text-left space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-[#FAD7A0]/60 pb-2">
              <span className="font-extrabold text-[#2C3E50] uppercase text-[10px] tracking-wider">Submitted Credentials</span>
              <span className="px-2 py-0.5 bg-[#2C3E50] text-[#FAD7A0] font-mono font-bold rounded-md text-[10px]">
                {currentUser.role}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[#5D6D7E]">
              <div>
                <strong className="text-[#2C3E50] block">Full Name:</strong>
                <span>{currentUser.name}</span>
              </div>
              <div>
                <strong className="text-[#2C3E50] block">Identifier:</strong>
                <span className="font-mono">{currentUser.employeeId || currentUser.rollNo || currentUser.id}</span>
              </div>
              <div>
                <strong className="text-[#2C3E50] block">Official Email:</strong>
                <span>{currentUser.email}</span>
              </div>
              <div>
                <strong className="text-[#2C3E50] block">Department:</strong>
                <span>{currentUser.department || 'Humanities & Sciences'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Status Alert Message */}
        {statusMsg && (
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-2xl flex items-center gap-2 text-left">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Support & Institutional Contact Info */}
        <div className="p-4 bg-white border border-[#FAD7A0] rounded-2xl space-y-2 text-xs text-left">
          <h4 className="font-extrabold text-[#2C3E50] flex items-center gap-1.5 text-xs">
            <Building2 className="w-4 h-4 text-[#D35400]" />
            <span>Need Immediate Access Approval?</span>
          </h4>
          <p className="text-[#5D6D7E] leading-relaxed">
            Contact the System Administrator or Department Head with your Employee ID / Roll Number:
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 font-semibold text-[#2C3E50]">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#D35400]" />
              <span>admin@srit.ac.in</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#E67E22]" />
              <span>Dept of H&S, SRIT Ananthapuramu</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handleCheckStatus}
            disabled={checking}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#FFF8F0] border-2 border-[#D35400] text-[#D35400] hover:bg-[#D35400] hover:text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
            <span>Re-check Approval Status</span>
          </button>

          <button
            onClick={handleLogoutClick}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#2C3E50] text-[#FAD7A0] hover:bg-[#1A252F] font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out & Return to Home</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PendingApprovalPage;

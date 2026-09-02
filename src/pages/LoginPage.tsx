import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Page, StudentProfile } from '../types';
import { dbStorage } from '../lib/db';
import { AuthService } from '../services/AuthService';
import { UserRole, getRoleDisplayName } from '../types/auth';
import {
  GraduationCap,
  LogIn,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Building2,
  HelpCircle,
  Shield
} from 'lucide-react';

interface LoginPageProps {
  onNavigate: (page: Page) => void;
  onProfileUpdate?: (profile: StudentProfile) => void;
  onLoginSuccess?: (userRole: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigate,
  onProfileUpdate,
  onLoginSuccess
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('STUDENT');
  const [loginData, setLoginData] = useState({
    emailOrId: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Forgot Password Modal State
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState<boolean>(false);
  const [forgotData, setForgotData] = useState({ rollNoOrEmail: '', newPassword: '', confirmPassword: '' });
  const [forgotMsg, setForgotMsg] = useState<string>('');
  const [forgotError, setForgotError] = useState<string>('');
  const [isForgotSubmitting, setIsForgotSubmitting] = useState<boolean>(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      if (!loginData.emailOrId.trim()) {
        throw new Error(`Please enter your ${selectedRole === 'STUDENT' ? 'Roll Number / Email' : selectedRole === 'FACULTY_INCHARGE' ? 'Employee ID / Email' : 'Username / Email'}.`);
      }
      if (!loginData.password) {
        throw new Error('Please enter your Password.');
      }

      // Explicit authentication for the user-selected role
      const authUser = await AuthService.loginWithRole({
        emailOrId: loginData.emailOrId.trim(),
        password: loginData.password
      }, selectedRole);

      if (authUser.role === 'STUDENT' && onProfileUpdate) {
        const student = await dbStorage.getProfileByRollNo(authUser.rollNo || authUser.id);
        if (student) {
          onProfileUpdate(student);
        }
      }

      const redirectPage = AuthService.getRedirectPage(authUser.role);
      const roleName = getRoleDisplayName(authUser.role);

      setSuccessMsg(`Welcome back, ${authUser.name}! Authenticated as ${roleName}. Directing to workspace...`);

      if (onLoginSuccess) {
        onLoginSuccess(authUser.role);
      }

      setTimeout(() => {
        onNavigate(redirectPage);
      }, 700);
    } catch (err: unknown) {
      if (err instanceof Error) {
        const msg = err.message;
        if (
          msg.includes('awaiting') ||
          msg.includes('under review') ||
          msg.includes('PENDING_APPROVAL') ||
          msg.includes('pending')
        ) {
          setErrorMsg(
            'Your account is currently under review.\n\nPlease wait until the Platform Administrator approves your registration.'
          );
          return;
        }
        setErrorMsg(msg);
      } else {
        setErrorMsg('Authentication failed. Please verify your credentials and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotMsg('');
    setIsForgotSubmitting(true);

    try {
      if (!forgotData.rollNoOrEmail.trim()) {
        throw new Error('Please enter your Roll Number or Email Address.');
      }
      if (!forgotData.newPassword || forgotData.newPassword.length < 6) {
        throw new Error('New Password must be at least 6 characters long.');
      }
      if (forgotData.newPassword !== forgotData.confirmPassword) {
        throw new Error('New Password and Confirm Password do not match.');
      }

      // Check if student
      await dbStorage.resetPassword(forgotData.rollNoOrEmail.trim(), forgotData.rollNoOrEmail.trim(), forgotData.newPassword);
      setForgotMsg('Password successfully updated! You can now log in with your new password.');
      setTimeout(() => {
        setIsForgotPasswordOpen(false);
        setLoginData({ emailOrId: forgotData.rollNoOrEmail, password: '' });
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setForgotError(err.message);
      } else {
        setForgotError('Failed to reset password. Please check your details or contact the Administrator.');
      }
    } finally {
      setIsForgotSubmitting(false);
    }
  };

  const getIdentifierLabel = () => {
    switch (selectedRole) {
      case 'STUDENT':
        return 'Student Roll Number / Email';
      case 'FACULTY_INCHARGE':
        return 'Faculty Employee ID / Email';
      case 'ADMINISTRATOR':
        return 'Administrator Username / Email';
      default:
        return 'Email Address / User Identifier';
    }
  };

  const getIdentifierPlaceholder = () => {
    switch (selectedRole) {
      case 'STUDENT':
        return 'e.g., 264G1A0501 or student.cse26@srit.ac.in';
      case 'FACULTY_INCHARGE':
        return 'e.g., EMP-ENG-101 or faculty.english@srit.ac.in';
      case 'ADMINISTRATOR':
        return 'e.g., ADMIN01 or admin@srit.ac.in';
      default:
        return 'Enter your user identifier';
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FFF8F0] via-white to-[#FFF8F0]">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-6 bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#FAD7A0] shadow-xl relative"
      >
        {/* Back Link */}
        <button
          onClick={() => onNavigate('landing')}
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#5D6D7E] hover:text-[#D35400] transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        {/* Institutional Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-gradient-to-br from-[#D35400] to-[#E67E22] text-white rounded-2xl flex items-center justify-center mx-auto shadow-md font-black">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#2C3E50] font-heading tracking-tight">
              SAILL Portal Login
            </h2>
            <p className="text-xs text-[#5D6D7E] font-medium mt-1">
              Srinivasa Ramanujan Institute of Technology (Autonomous)
            </p>
          </div>
        </div>

        {/* Role Selection Tabs */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-black text-[#2C3E50] uppercase tracking-wider text-center">
            Select Your Role
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setSelectedRole('STUDENT');
                setErrorMsg('');
              }}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 cursor-pointer ${
                selectedRole === 'STUDENT'
                  ? 'bg-[#D35400] text-white shadow-md'
                  : 'text-gray-600 hover:text-[#2C3E50] hover:bg-white/80'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedRole('FACULTY_INCHARGE');
                setErrorMsg('');
              }}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 cursor-pointer ${
                selectedRole === 'FACULTY_INCHARGE'
                  ? 'bg-[#D35400] text-white shadow-md'
                  : 'text-gray-600 hover:text-[#2C3E50] hover:bg-white/80'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Faculty</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedRole('ADMINISTRATOR');
                setErrorMsg('');
              }}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 cursor-pointer ${
                selectedRole === 'ADMINISTRATOR' || selectedRole === 'BOOTSTRAP_ADMIN'
                  ? 'bg-[#D35400] text-white shadow-md'
                  : 'text-gray-600 hover:text-[#2C3E50] hover:bg-white/80'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Status Alerts */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span className="font-semibold leading-relaxed whitespace-pre-line">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="font-semibold leading-relaxed">{successMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-[#2C3E50] uppercase tracking-wider mb-1.5">
              {getIdentifierLabel()}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#D35400] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={loginData.emailOrId}
                onChange={(e) => setLoginData({ ...loginData, emailOrId: e.target.value })}
                placeholder={getIdentifierPlaceholder()}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FFF8F0]/50 border border-[#FAD7A0] rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:bg-white focus:outline-none transition placeholder:text-gray-400"
              />
            </div>
            <p className="text-[10px] text-gray-600 mt-1">
              {selectedRole === 'STUDENT' && 'Use your SRIT student Roll Number or institutional email.'}
              {selectedRole === 'FACULTY_INCHARGE' && 'Use your assigned Faculty Employee ID or institutional email.'}
              {selectedRole === 'ADMINISTRATOR' && 'Use your Administrator username or registered email address.'}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-black text-[#2C3E50] uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => onNavigate('forgot-password')}
                className="text-[11px] font-bold text-[#D35400] hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#D35400] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                placeholder="Enter your security password"
                className="w-full pl-10 pr-10 py-2.5 bg-[#FFF8F0]/50 border border-[#FAD7A0] rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:bg-white focus:outline-none transition placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#D35400] transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#D35400] to-[#E67E22] hover:from-[#E67E22] hover:to-[#D35400] text-white font-extrabold text-xs rounded-xl shadow-md transition transform active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Authenticate & Access {selectedRole === 'STUDENT' ? 'Student Workspace' : selectedRole === 'FACULTY_INCHARGE' ? 'Faculty Workbench' : 'Admin Console'}</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Link to Registration Choice */}
        <div className="pt-4 border-t border-[#FAD7A0] text-center text-xs">
          <p className="text-gray-600">
            Don&apos;t have an account yet?{' '}
            <button
              onClick={() => onNavigate('register-choice')}
              className="font-extrabold text-[#D35400] hover:underline cursor-pointer"
            >
              Register here
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;

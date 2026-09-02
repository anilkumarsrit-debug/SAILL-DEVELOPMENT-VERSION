import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Page } from '../types';
import { dbStorage } from '../lib/db';
import {
  UserCheck,
  User,
  Hash,
  Mail,
  Phone,
  Building2,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Send
} from 'lucide-react';

interface FacultyRegisterPageProps {
  onNavigate: (page: Page) => void;
}

const DEPARTMENTS = [
  'Humanities & Sciences (Academic Owner — English / Communicative English)',
  'Humanities & Sciences',
  'Computer Science & Engineering (CSE)',
  'Electronics & Communication Engineering (ECE)',
  'Electrical & Electronics Engineering (EEE)',
  'Mechanical Engineering (ME)',
  'Civil Engineering (CE)'
];

const DESIGNATIONS = [
  'Professor & Lab In-charge',
  'Associate Professor',
  'Assistant Professor',
  'Senior Faculty & Batch Incharge',
  'Laboratory Assistant'
];

export const FacultyRegisterPage: React.FC<FacultyRegisterPageProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    employeeId: '',
    email: '',
    mobile: '',
    department: 'Humanities & Sciences (English)',
    designation: 'Assistant Professor',
    role: 'faculty_incharge' as 'faculty' | 'faculty_incharge',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      if (!formData.fullName.trim()) throw new Error('Please enter your Full Name.');
      if (!formData.employeeId.trim()) throw new Error('Please enter your Employee ID (e.g., EMP-ENG-102).');
      if (!formData.email.trim() || !formData.email.includes('@')) throw new Error('Please enter a valid Official Email Address.');
      if (!formData.mobile.trim() || formData.mobile.length < 10) throw new Error('Please enter a valid 10-digit Mobile Number.');
      if (!formData.password || formData.password.length < 6) throw new Error('Password must be at least 6 characters long.');
      if (formData.password !== formData.confirmPassword) throw new Error('Password and Confirm Password do not match.');
      if (!formData.acceptTerms) throw new Error('You must accept the institutional terms.');

      // Check duplicate Employee ID & Email
      const isEmpDup = await dbStorage.checkDuplicateEmployeeId(formData.employeeId);
      if (isEmpDup) throw new Error(`Employee ID '${formData.employeeId.toUpperCase()}' is already registered.`);

      const isEmailDup = await dbStorage.checkDuplicateEmail(formData.email);
      if (isEmailDup) throw new Error(`Email Address '${formData.email}' is already associated with another account.`);

      // Register Faculty -> Creates status = 'pending' in database
      await dbStorage.registerFaculty({
        fullName: formData.fullName,
        employeeId: formData.employeeId,
        email: formData.email,
        mobile: formData.mobile,
        department: formData.department,
        designation: formData.designation,
        role: formData.role,
        password: formData.password
      });

      // Navigate to Pending Approval Page
      onNavigate('pending-approval');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Registration failed. Please check your inputs and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FFF8F0] via-white to-[#FFF8F0]">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#FAD7A0] shadow-xl space-y-6"
      >
        {/* Header Actions */}
        <div className="flex items-center justify-between border-b border-[#FAD7A0] pb-4">
          <button
            onClick={() => onNavigate('register-choice')}
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#5D6D7E] hover:text-[#2C3E50] transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Category Choice</span>
          </button>
          <span className="text-[10px] font-extrabold uppercase bg-[#FFF8F0] text-[#2C3E50] px-2.5 py-1 rounded-md border border-[#FAD7A0]">
            Faculty Incharge Registration
          </span>
        </div>

        {/* Title */}
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 bg-[#2C3E50] text-white rounded-2xl flex items-center justify-center mx-auto shadow-md font-black">
            <UserCheck className="w-7 h-7 text-[#FAD7A0]" />
          </div>
          <h2 className="text-2xl font-black text-[#2C3E50] font-heading">
            Faculty Incharge Registration
          </h2>
          <p className="text-xs text-[#5D6D7E]">
            Requires System Administrator Approval prior to workspace activation
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span className="font-semibold leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {/* Notice Banner */}
        <div className="p-3.5 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl text-xs text-[#5D6D7E] flex items-center gap-3">
          <Clock className="w-5 h-5 text-[#D35400] shrink-0" />
          <span>
            Faculty registrations undergo verification by the SAILL Administrator. Upon submission, your account will enter <strong>Pending Approval</strong> state.
          </span>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-extrabold text-[#2C3E50] mb-1">
                Full Name (with Title) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#2C3E50] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Dr. V. Lakshmi"
                  className="w-full pl-9 pr-3 py-2 bg-[#FFF8F0]/50 border border-[#FAD7A0] rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2C3E50]"
                />
              </div>
            </div>

            {/* Employee ID */}
            <div>
              <label className="block text-xs font-extrabold text-[#2C3E50] mb-1">
                Employee ID <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 text-[#2C3E50] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value.toUpperCase() })}
                  placeholder="e.g. EMP-ENG-102"
                  className="w-full pl-9 pr-3 py-2 bg-[#FFF8F0]/50 border border-[#FAD7A0] rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#2C3E50]"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-extrabold text-[#2C3E50] mb-1">
                Official SRIT Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#2C3E50] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. dr.lakshmi@srit.ac.in"
                  className="w-full pl-9 pr-3 py-2 bg-[#FFF8F0]/50 border border-[#FAD7A0] rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2C3E50]"
                />
              </div>
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-xs font-extrabold text-[#2C3E50] mb-1">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#2C3E50] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="10-digit Mobile Number"
                  className="w-full pl-9 pr-3 py-2 bg-[#FFF8F0]/50 border border-[#FAD7A0] rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2C3E50]"
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-extrabold text-[#2C3E50] mb-1">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 bg-[#FFF8F0]/50 border border-[#FAD7A0] rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2C3E50]"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Designation */}
            <div>
              <label className="block text-xs font-extrabold text-[#2C3E50] mb-1">
                Designation <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3 py-2 bg-[#FFF8F0]/50 border border-[#FAD7A0] rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2C3E50]"
              >
                {DESIGNATIONS.map((des) => (
                  <option key={des} value={des}>{des}</option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-extrabold text-[#2C3E50] mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#2C3E50] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="At least 6 characters"
                  className="w-full pl-9 pr-9 py-2 bg-[#FFF8F0]/50 border border-[#FAD7A0] rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2C3E50]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#2C3E50]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-extrabold text-[#2C3E50] mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#2C3E50] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Re-enter password"
                  className="w-full pl-9 pr-9 py-2 bg-[#FFF8F0]/50 border border-[#FAD7A0] rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2C3E50]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#2C3E50]"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-2 pt-2">
            <input
              type="checkbox"
              id="faculty-terms"
              required
              checked={formData.acceptTerms}
              onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
              className="mt-0.5 rounded text-[#2C3E50] focus:ring-[#2C3E50]"
            />
            <label htmlFor="faculty-terms" className="text-[11px] text-[#5D6D7E] leading-tight cursor-pointer">
              I certify that I am an authorized faculty member at SRIT Autonomous and agree to manage student evaluations according to institutional quality guidelines.
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-[#2C3E50] hover:bg-[#1A252F] text-[#FAD7A0] font-extrabold text-xs rounded-xl shadow-md transition transform active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-[#FAD7A0] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Registration for Administrator Approval</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Existing Account Footer */}
        <div className="pt-3 border-t border-[#FAD7A0] text-center text-xs">
          <p className="text-gray-600">
            Already registered as Faculty?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="font-extrabold text-[#2C3E50] hover:underline cursor-pointer"
            >
              Sign in here
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default FacultyRegisterPage;

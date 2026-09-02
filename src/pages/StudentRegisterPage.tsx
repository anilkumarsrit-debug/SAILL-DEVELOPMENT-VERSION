import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Page, StudentProfile } from '../types';
import { dbStorage } from '../lib/db';
import { AcademicStructureService } from '../services/AcademicStructureService';
import {
  GraduationCap,
  User,
  Hash,
  Mail,
  Phone,
  Building2,
  BookOpen,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  UserPlus
} from 'lucide-react';

interface StudentRegisterPageProps {
  onNavigate: (page: Page) => void;
  onProfileUpdate?: (profile: StudentProfile) => void;
}

export const StudentRegisterPage: React.FC<StudentRegisterPageProps> = ({
  onNavigate,
  onProfileUpdate
}) => {
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    email: '',
    mobile: '',
    college: 'Srinivasa Ramanujan Institute of Technology (Autonomous)',
    programme: 'B.Tech',
    department: '',
    year: 'I Year B.Tech (R26 Regulations)',
    semester: 'Semester I',
    section: '',
    academicYear: '2026–2027',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  const [activeBranches, setActiveBranches] = useState<Array<{ name: string; code: string }>>([]);
  const [activeSections, setActiveSections] = useState<Array<{ sectionName: string; branch: string }>>([]);
  const [activeYears, setActiveYears] = useState<Array<{ yearName: string; isCurrent: boolean }>>([]);
  const [activeSemesters, setActiveSemesters] = useState<Array<{ semesterName: string }>>([]);
  const [hasActiveBatch, setHasActiveBatch] = useState<boolean>(true);
  const [isLoadingOptions, setIsLoadingOptions] = useState<boolean>(true);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  useEffect(() => {
    const loadAcademicOptions = async () => {
      setIsLoadingOptions(true);
      try {
        await AcademicStructureService.syncWithIndexedDB();
        let activeBatches = await dbStorage.syncBatchesWithAcademicStructure();
        if (activeBatches.length === 0) {
          const allBatches = await dbStorage.getAllBatches();
          activeBatches = allBatches.filter((b) => b.status === 'active');
        }

        if (activeBatches.length === 0) {
          setHasActiveBatch(false);
          setErrorMsg("No active academic batch has been configured yet. Please contact the Administrator.");
          setIsLoadingOptions(false);
          return;
        }

        setHasActiveBatch(true);
        setErrorMsg('');

        // Build list of active branches from active batches
        const branchList: Array<{ name: string; code: string }> = [];
        activeBatches.forEach((b) => {
          const bBranch = b.branch || b.department;
          if (bBranch && !branchList.some((item) => item.name.toLowerCase() === bBranch.toLowerCase())) {
            branchList.push({
              name: bBranch,
              code: bBranch.replace(/[^a-zA-Z]/g, '').substring(0, 4).toUpperCase()
            });
          }
        });

        // Build list of active sections from active batches
        const secList: Array<{ sectionName: string; branch: string }> = [];
        activeBatches.forEach((b) => {
          const bBranch = b.branch || b.department;
          if (b.section && !secList.some((item) => item.sectionName === b.section && item.branch.toLowerCase() === bBranch.toLowerCase())) {
            secList.push({ sectionName: b.section, branch: bBranch });
          }
        });

        // Build list of active academic years from active batches
        const yearList: Array<{ yearName: string; isCurrent: boolean }> = [];
        activeBatches.forEach((b) => {
          if (b.academicYear && !yearList.some((item) => item.yearName === b.academicYear)) {
            yearList.push({ yearName: b.academicYear, isCurrent: true });
          }
        });

        // Build list of active semesters from active batches
        const semList: Array<{ semesterName: string }> = [];
        activeBatches.forEach((b) => {
          if (b.semester && !semList.some((item) => item.semesterName === b.semester)) {
            semList.push({ semesterName: b.semester });
          }
        });

        setActiveBranches(branchList);
        setActiveSections(secList);
        setActiveYears(yearList);
        setActiveSemesters(semList);

        const firstBatch = activeBatches[0];
        const defaultProg = firstBatch?.programme || 'B.Tech';
        const defaultBranch = firstBatch?.branch || firstBatch?.department || branchList[0]?.name || '';
        const defaultYear = firstBatch?.academicYear || yearList[0]?.yearName || '2026–2027';
        const defaultSem = firstBatch?.semester || semList[0]?.semesterName || 'Semester II';
        const defaultSec = firstBatch?.section || secList[0]?.sectionName || 'A';

        setFormData((prev) => ({
          ...prev,
          programme: defaultProg,
          department: defaultBranch,
          section: defaultSec,
          academicYear: defaultYear,
          semester: defaultSem,
          year: `${defaultProg} (${defaultBranch})`
        }));
      } catch (err) {
        console.error('[StudentRegisterPage] Error loading academic options:', err);
        setHasActiveBatch(false);
        setErrorMsg("No active academic batch has been configured yet. Please contact the Administrator.");
      } finally {
        setIsLoadingOptions(false);
      }
    };

    loadAcademicOptions();
  }, []);

  const handleDepartmentChange = (newDept: string) => {
    const matchingSecs = activeSections.filter((s) => {
      if (!s.branch) return true;
      const cleanDept = newDept.toLowerCase();
      const cleanBranch = s.branch.toLowerCase();
      return cleanDept === cleanBranch || cleanDept.includes(cleanBranch) || cleanBranch.includes(cleanDept);
    });
    const newSec = matchingSecs[0]?.sectionName || activeSections[0]?.sectionName || '';

    setFormData((prev) => ({
      ...prev,
      department: newDept,
      section: newSec,
      year: `${prev.programme || 'B.Tech'} (${newDept})`
    }));
  };

  const filteredSections = activeSections.filter((s) => {
    if (!s.branch || !formData.department) return true;
    const cleanDept = formData.department.toLowerCase();
    const cleanBranch = s.branch.toLowerCase();
    return cleanDept === cleanBranch || cleanDept.includes(cleanBranch) || cleanBranch.includes(cleanDept);
  });

  const availableSections = filteredSections.length > 0 ? filteredSections : activeSections;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      if (!formData.name.trim()) throw new Error('Please enter your Full Name.');
      if (!formData.rollNo.trim()) throw new Error('Please enter your Roll Number (e.g., 264G1A0501).');
      if (!formData.email.trim() || !formData.email.includes('@')) throw new Error('Please enter a valid Email Address.');
      if (!formData.mobile.trim() || formData.mobile.length < 10) throw new Error('Please enter a valid 10-digit Mobile Number.');
      if (!formData.password || formData.password.length < 6) throw new Error('Password must be at least 6 characters long.');
      if (formData.password !== formData.confirmPassword) throw new Error('Password and Confirm Password do not match.');
      if (!formData.acceptTerms) throw new Error('You must accept the enrollment terms.');

      // Check duplicates first
      const isRollDup = await dbStorage.checkDuplicateRollNo(formData.rollNo);
      if (isRollDup) throw new Error(`Roll Number '${formData.rollNo.toUpperCase()}' is already registered in the system.`);

      const isEmailDup = await dbStorage.checkDuplicateEmail(formData.email);
      if (isEmailDup) throw new Error(`Email Address '${formData.email}' is already registered in the system.`);

      // Register Student & Match Batch
      await dbStorage.registerStudent(
        {
          name: formData.name,
          rollNo: formData.rollNo,
          email: formData.email,
          mobile: formData.mobile,
          college: formData.college,
          department: formData.department,
          year: formData.year,
          section: formData.section,
          programme: formData.programme,
          semester: formData.semester,
          academicYear: formData.academicYear
        },
        formData.password
      );

      setIsSubmitted(true);
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

  if (isSubmitted) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FFF8F0] via-white to-[#FFF8F0]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#FAD7A0] shadow-xl text-center space-y-6"
        >
          <div className="w-16 h-16 bg-amber-100 text-[#D35400] rounded-full flex items-center justify-center mx-auto shadow-sm">
            <ShieldCheck className="w-9 h-9" />
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-black text-[#2C3E50] font-heading">
              Registration submitted successfully.
            </h2>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-[#2C3E50] text-sm space-y-2 text-left leading-relaxed">
              <p className="font-semibold text-amber-900">
                Your account is currently under review.
              </p>
              <p className="text-xs text-amber-800">
                Please wait for approval from the Platform Administrator.
              </p>
              <p className="text-xs text-amber-800 pt-1 border-t border-amber-200/60">
                After approval, please log in using your registered Email Address and Password.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('login')}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#D35400] to-[#E67E22] hover:from-[#E67E22] hover:to-[#D35400] text-white font-extrabold text-xs rounded-xl shadow-md transition transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Login</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

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
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#5D6D7E] hover:text-[#D35400] transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Category Choice</span>
          </button>
          <span className="text-[10px] font-extrabold uppercase bg-[#FFF8F0] text-[#D35400] px-2.5 py-1 rounded-md border border-[#FAD7A0]">
            B.Tech Student Registration
          </span>
        </div>

        {/* Title */}
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 bg-[#D35400] text-white rounded-2xl flex items-center justify-center mx-auto shadow-md font-black">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-black text-[#2C3E50] font-heading">
            Student Enrollment Form
          </h2>
          <p className="text-xs text-[#5D6D7E]">
            SAILL R26 Communicative English Laboratory — Autonomous Academic Batch Enrollment
          </p>
        </div>

        {/* Error / Success Alerts */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span className="font-semibold leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="font-semibold leading-relaxed">{successMsg}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-extrabold text-[#2C3E50] mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#D35400] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Anil Kumar D"
                  className="w-full pl-9 pr-3 py-2 bg-[#FFF8F0]/50 border border-[#FAD7A0] rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#D35400]"
                />
              </div>
            </div>

            {/* Roll Number */}
            <div>
              <label className="block text-xs font-extrabold text-[#2C3E50] mb-1">
                Roll Number (HT No) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 text-[#D35400] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.rollNo}
                  onChange={(e) => setFormData({ ...formData, rollNo: e.target.value.toUpperCase() })}
                  placeholder="e.g. 264G1A0501"
                  className="w-full pl-9 pr-3 py-2 bg-[#FFF8F0]/50 border border-[#FAD7A0] rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#D35400]"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-extrabold text-[#2C3E50] mb-1">
                Student Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#D35400] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. student.cse26@srit.ac.in"
                  className="w-full pl-9 pr-3 py-2 bg-[#FFF8F0]/50 border border-[#FAD7A0] rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#D35400]"
                />
              </div>
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-xs font-extrabold text-[#2C3E50] mb-1">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#D35400] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="10-digit Mobile Number"
                  className="w-full pl-9 pr-3 py-2 bg-[#FFF8F0]/50 border border-[#FAD7A0] rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#D35400]"
                />
              </div>
            </div>

            {/* Program */}
            <div>
              <label className="block text-xs font-extrabold text-[#2C3E50] mb-1">
                Program <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.department}
                onChange={(e) => handleDepartmentChange(e.target.value)}
                disabled={!hasActiveBatch || isLoadingOptions}
                className="w-full px-3 py-2 bg-[#FFF8F0]/50 border border-[#FAD7A0] rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#D35400] disabled:opacity-50"
              >
                {activeBranches.map((b) => (
                  <option key={b.name} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* Academic Year */}
            <div>
              <label className="block text-xs font-extrabold text-[#2C3E50] mb-1">
                Academic Year <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                disabled={!hasActiveBatch || isLoadingOptions}
                className="w-full px-3 py-2 bg-[#FFF8F0]/50 border border-[#FAD7A0] rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#D35400] disabled:opacity-50"
              >
                {activeYears.map((y) => (
                  <option key={y.yearName} value={y.yearName}>{y.yearName}</option>
                ))}
              </select>
            </div>

            {/* Semester */}
            <div>
              <label className="block text-xs font-extrabold text-[#2C3E50] mb-1">
                Semester <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                disabled={!hasActiveBatch || isLoadingOptions}
                className="w-full px-3 py-2 bg-[#FFF8F0]/50 border border-[#FAD7A0] rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#D35400] disabled:opacity-50"
              >
                {activeSemesters.map((s) => (
                  <option key={s.semesterName} value={s.semesterName}>{s.semesterName}</option>
                ))}
              </select>
            </div>

            {/* Section */}
            <div>
              <label className="block text-xs font-extrabold text-[#2C3E50] mb-1">
                Section <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                disabled={!hasActiveBatch || isLoadingOptions}
                className="w-full px-3 py-2 bg-[#FFF8F0]/50 border border-[#FAD7A0] rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#D35400] disabled:opacity-50"
              >
                {availableSections.map((sec) => (
                  <option key={sec.sectionName} value={sec.sectionName}>{sec.sectionName}</option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-extrabold text-[#2C3E50] mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#D35400] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="At least 6 characters"
                  className="w-full pl-9 pr-9 py-2 bg-[#FFF8F0]/50 border border-[#FAD7A0] rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#D35400]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#D35400]"
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
                <Lock className="w-4 h-4 text-[#D35400] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Re-enter password"
                  className="w-full pl-9 pr-9 py-2 bg-[#FFF8F0]/50 border border-[#FAD7A0] rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#D35400]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#D35400]"
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
              id="student-terms"
              required
              checked={formData.acceptTerms}
              onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
              className="mt-0.5 rounded text-[#D35400] focus:ring-[#D35400]"
            />
            <label htmlFor="student-terms" className="text-[11px] text-[#5D6D7E] leading-tight cursor-pointer">
              I certify that I am a registered First-Year B.Tech student at SRIT and agree to adhere to the SAILL Laboratory Code of Conduct and Autonomous Evaluation Regulations.
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !hasActiveBatch || isLoadingOptions}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#D35400] to-[#E67E22] hover:from-[#E67E22] hover:to-[#D35400] text-white font-extrabold text-xs rounded-xl shadow-md transition transform active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Submit Enrollment & Open Dashboard</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Existing Account Footer */}
        <div className="pt-3 border-t border-[#FAD7A0] text-center text-xs">
          <p className="text-gray-600">
            Already enrolled?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="font-extrabold text-[#D35400] hover:underline cursor-pointer"
            >
              Sign in to your account
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentRegisterPage;

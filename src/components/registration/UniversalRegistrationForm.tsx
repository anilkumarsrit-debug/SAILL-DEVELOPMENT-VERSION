import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  UserCheck,
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
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { RegistrationType, StudentRegistrationPayload, FacultyInchargeRegistrationPayload } from '../../types/registration';
import { RegistrationService } from '../../services/RegistrationService';
import { AcademicStructureService } from '../../services/AcademicStructureService';
import { dbStorage } from '../../lib/db';

interface UniversalRegistrationFormProps {
  onSuccessReturnToLogin?: () => void;
  onCancel?: () => void;
  isModal?: boolean;
}

const DEPARTMENTS = [
  'Humanities & Sciences (English)',
  'Computer Science & Engineering (CSE)',
  'Electronics & Communication Engineering (ECE)',
  'Electrical & Electronics Engineering (EEE)',
  'Mechanical Engineering (ME)',
  'Civil Engineering (CE)',
  'Artificial Intelligence & Machine Learning (CSE-AIML)',
  'Data Science (CSE-DS)',
  'Cyber Security (CSE-CS)'
];

const SECTIONS = [
  'CSE-A', 'CSE-B', 'CSE-C', 'CSE-D',
  'ECE-A', 'ECE-B', 'ECE-C',
  'EEE-A', 'ME-A', 'CE-A',
  'AIML-A', 'DS-A'
];

const DESIGNATIONS = [
  'Professor & Lab In-charge',
  'Associate Professor',
  'Assistant Professor',
  'Senior Faculty & Batch Incharge',
  'Laboratory Assistant'
];

export const UniversalRegistrationForm: React.FC<UniversalRegistrationFormProps> = ({
  onSuccessReturnToLogin,
  onCancel,
  isModal = false
}) => {
  // Registration Flow Stages: 'card-select' | 'form' | 'submitted-pending'
  const [stage, setStage] = useState<'card-select' | 'form' | 'submitted-pending'>('card-select');
  const [selectedType, setSelectedType] = useState<RegistrationType | null>(null);

  // Toggle Password Visibilities
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  // Loading & Error States
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Submitted Details for Confirmation View
  const [submittedUser, setSubmittedUser] = useState<{
    fullName: string;
    email: string;
    userID: string;
    type: RegistrationType;
  } | null>(null);

  // Student Form State
  const [studentForm, setStudentForm] = useState<StudentRegistrationPayload>({
    fullName: '',
    rollNo: '',
    email: '',
    mobile: '',
    branch: '',
    year: 'I Year B.Tech (R26 Regulations)',
    semester: 'Semester I',
    section: '',
    password: '',
    confirmPassword: ''
  });

  const [activeBranches, setActiveBranches] = useState<Array<{ name: string; code: string }>>([]);
  const [activeSections, setActiveSections] = useState<Array<{ sectionName: string; branch: string }>>([]);
  const [hasActiveBatch, setHasActiveBatch] = useState<boolean>(true);

  useEffect(() => {
    const loadAcademicOptions = async () => {
      try {
        const allBatches = await dbStorage.getAllBatches();
        const activeBatches = allBatches.filter((b) => b.status === 'active');

        if (activeBatches.length === 0) {
          setHasActiveBatch(false);
          setErrorMsg("No active academic batch has been configured yet. Please contact the Administrator.");
          return;
        }

        setHasActiveBatch(true);
        setErrorMsg('');

        const branchList: Array<{ name: string; code: string }> = [];
        activeBatches.forEach((b) => {
          const bBranch = b.branch || b.department;
          if (!branchList.some((item) => item.name === bBranch)) {
            branchList.push({ name: bBranch, code: bBranch.replace(/[^a-zA-Z]/g, '').substring(0, 4) });
          }
        });

        const secList: Array<{ sectionName: string; branch: string }> = [];
        activeBatches.forEach((b) => {
          const bBranch = b.branch || b.department;
          if (!secList.some((item) => item.sectionName === b.section && item.branch === bBranch)) {
            secList.push({ sectionName: b.section, branch: bBranch });
          }
        });

        setActiveBranches(branchList);
        setActiveSections(secList);

        const defaultBranch = branchList[0]?.name || '';
        const matchingSecs = secList.filter((s) => !s.branch || s.branch === defaultBranch || defaultBranch.includes(s.branch) || s.branch.includes(defaultBranch));
        const defaultSec = matchingSecs[0]?.sectionName || secList[0]?.sectionName || '';

        setStudentForm((prev) => ({
          ...prev,
          branch: defaultBranch,
          section: defaultSec
        }));
      } catch {
        setHasActiveBatch(false);
        setErrorMsg("No active academic batch has been configured yet. Please contact the Administrator.");
      }
    };

    loadAcademicOptions();
  }, []);

  const handleBranchChange = (newBranch: string) => {
    const matchingSecs = activeSections.filter((s) => {
      if (!s.branch) return true;
      const cleanDept = newBranch.toLowerCase();
      const cleanBranch = s.branch.toLowerCase();
      return cleanDept === cleanBranch || cleanDept.includes(cleanBranch) || cleanBranch.includes(cleanDept);
    });
    const newSec = matchingSecs[0]?.sectionName || activeSections[0]?.sectionName || '';

    setStudentForm((prev) => ({
      ...prev,
      branch: newBranch,
      section: newSec
    }));
  };

  const filteredSections = activeSections.filter((s) => {
    if (!s.branch || !studentForm.branch) return true;
    const cleanDept = studentForm.branch.toLowerCase();
    const cleanBranch = s.branch.toLowerCase();
    return cleanDept === cleanBranch || cleanDept.includes(cleanBranch) || cleanBranch.includes(cleanDept);
  });

  const availableSections = filteredSections.length > 0 ? filteredSections : activeSections;

  // Faculty Form State
  const [facultyForm, setFacultyForm] = useState<FacultyInchargeRegistrationPayload>({
    fullName: '',
    employeeId: '',
    email: '',
    mobile: '',
    department: 'Humanities & Sciences (English)',
    designation: 'Assistant Professor',
    password: '',
    confirmPassword: ''
  });

  const handleSelectCard = (type: RegistrationType) => {
    setSelectedType(type);
    setErrorMsg('');
    setStage('form');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      if (selectedType === 'STUDENT') {
        const record = await RegistrationService.registerStudent(studentForm);
        setSubmittedUser({
          fullName: record.fullName,
          email: record.email,
          userID: record.userID,
          type: 'STUDENT'
        });
      } else if (selectedType === 'FACULTY_INCHARGE') {
        const record = await RegistrationService.registerFacultyIncharge(facultyForm);
        setSubmittedUser({
          fullName: record.fullName,
          email: record.email,
          userID: record.userID,
          type: 'FACULTY_INCHARGE'
        });
      }
      setStage('submitted-pending');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Registration failed. Please verify your details and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`w-full ${isModal ? '' : 'max-w-2xl mx-auto'}`}>
      <AnimatePresence mode="wait">
        {/* STAGE 1: REGISTRATION TYPE SELECTION CARDS */}
        {stage === 'card-select' && (
          <motion.div
            key="card-select"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Universal Academic Portal
              </span>
              <h2 className="text-2xl font-black text-[#2C3E50] tracking-tight">
                Select Registration Type
              </h2>
              <p className="text-xs text-[#5D6D7E] max-w-md mx-auto">
                Choose your registration category to request institutional laboratory access at SRIT.
              </p>
            </div>

            {/* TWO REGISTRATION CARDS ONLY (Student and Faculty Incharge) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* CARD 1: STUDENT REGISTRATION */}
              <button
                type="button"
                onClick={() => handleSelectCard('STUDENT')}
                className="group relative text-left p-6 bg-white border-2 border-[#EAEDED] hover:border-[#27AE60] rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden"
              >
                <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#27AE60]/5 rounded-full group-hover:scale-125 transition-transform duration-500" />
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#27AE60]/10 border border-[#27AE60]/20 text-[#27AE60] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#27AE60] bg-[#27AE60]/10 px-2.5 py-0.5 rounded-full inline-block mb-2">
                    Student Enrollment
                  </span>
                  <h3 className="text-lg font-bold text-[#2C3E50] group-hover:text-[#27AE60] transition-colors">
                    Student Registration
                  </h3>
                  <p className="text-xs text-[#5D6D7E] mt-2 leading-relaxed">
                    For B.Tech students enrolled in the R26 Communicative English Laboratory syllabus.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#27AE60]">
                  <span>Begin Student Form</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* CARD 2: FACULTY INCHARGE REGISTRATION */}
              <button
                type="button"
                onClick={() => handleSelectCard('FACULTY_INCHARGE')}
                className="group relative text-left p-6 bg-white border-2 border-[#EAEDED] hover:border-[#D35400] rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden"
              >
                <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#D35400]/5 rounded-full group-hover:scale-125 transition-transform duration-500" />
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#D35400]/10 border border-[#D35400]/20 text-[#D35400] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D35400] bg-[#D35400]/10 px-2.5 py-0.5 rounded-full inline-block mb-2">
                    Faculty Access
                  </span>
                  <h3 className="text-lg font-bold text-[#2C3E50] group-hover:text-[#D35400] transition-colors">
                    Faculty Incharge Registration
                  </h3>
                  <p className="text-xs text-[#5D6D7E] mt-2 leading-relaxed">
                    For SRIT Faculty members overseeing batches, attendance, and lab assessments.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#D35400]">
                  <span>Begin Faculty Form</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {/* STAGE 2: REGISTRATION FORM */}
        {stage === 'form' && selectedType && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-5"
          >
            {/* Header & Back Action */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStage('card-select')}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#2C3E50] transition cursor-pointer"
                  title="Back to Registration Type Selection"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D35400]">
                    {selectedType === 'STUDENT' ? 'Student Registration' : 'Faculty Incharge Registration'}
                  </span>
                  <h3 className="text-lg font-black text-[#2C3E50]">
                    Complete Account Details
                  </h3>
                </div>
              </div>

              <span className="text-[11px] font-bold text-[#5D6D7E] bg-[#FFF8F0] border border-[#FAD7A0] px-3 py-1 rounded-full">
                Status: Pending Approval
              </span>
            </div>

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700 flex items-start gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{errorMsg}</div>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* STUDENT FORM FIELDS */}
              {selectedType === 'STUDENT' && (
                <>
                  {/* Full Name */}
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Anil Kumar D"
                        value={studentForm.fullName}
                        onChange={(e) => setStudentForm({ ...studentForm, fullName: e.target.value })}
                        className="w-full pl-10 pr-3 py-2.5 bg-[#FFF8F0]/80 border border-[#FAD7A0] rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Roll No & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase tracking-wider mb-1">
                        Roll Number *
                      </label>
                      <div className="relative">
                        <Hash className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. 264G1A0501"
                          value={studentForm.rollNo}
                          onChange={(e) => setStudentForm({ ...studentForm, rollNo: e.target.value.toUpperCase() })}
                          className="w-full pl-10 pr-3 py-2.5 bg-[#FFF8F0]/80 border border-[#FAD7A0] rounded-xl text-xs font-bold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none uppercase"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase tracking-wider mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          placeholder="student@srit.ac.in"
                          value={studentForm.email}
                          onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                          className="w-full pl-10 pr-3 py-2.5 bg-[#FFF8F0]/80 border border-[#FAD7A0] rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mobile & Branch */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase tracking-wider mb-1">
                        Mobile Number *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          placeholder="10-digit Mobile No."
                          value={studentForm.mobile}
                          onChange={(e) => setStudentForm({ ...studentForm, mobile: e.target.value })}
                          className="w-full pl-10 pr-3 py-2.5 bg-[#FFF8F0]/80 border border-[#FAD7A0] rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase tracking-wider mb-1">
                        Branch / Department *
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <select
                          value={studentForm.branch}
                          onChange={(e) => handleBranchChange(e.target.value)}
                          className="w-full pl-10 pr-3 py-2.5 bg-[#FFF8F0]/80 border border-[#FAD7A0] rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
                        >
                          {activeBranches.map((b) => (
                            <option key={b.name} value={b.name}>
                              {b.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Year, Semester & Section */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase tracking-wider mb-1">
                        Year *
                      </label>
                      <select
                        value={studentForm.year}
                        onChange={(e) => setStudentForm({ ...studentForm, year: e.target.value })}
                        className="w-full px-3 py-2.5 bg-[#FFF8F0]/80 border border-[#FAD7A0] rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
                      >
                        <option value="I Year B.Tech (R26 Regulations)">I Year B.Tech (R26)</option>
                        <option value="II Year B.Tech">II Year B.Tech</option>
                        <option value="III Year B.Tech">III Year B.Tech</option>
                        <option value="IV Year B.Tech">IV Year B.Tech</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase tracking-wider mb-1">
                        Semester *
                      </label>
                      <select
                        value={studentForm.semester}
                        onChange={(e) => setStudentForm({ ...studentForm, semester: e.target.value })}
                        className="w-full px-3 py-2.5 bg-[#FFF8F0]/80 border border-[#FAD7A0] rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
                      >
                        <option value="Semester I">Semester I</option>
                        <option value="Semester II">Semester II</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase tracking-wider mb-1">
                        Section *
                      </label>
                      <select
                        value={studentForm.section}
                        onChange={(e) => setStudentForm({ ...studentForm, section: e.target.value })}
                        className="w-full px-3 py-2.5 bg-[#FFF8F0]/80 border border-[#FAD7A0] rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
                      >
                        {availableSections.map((sec) => (
                          <option key={sec.sectionName} value={sec.sectionName}>
                            {sec.sectionName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Password & Confirm Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase tracking-wider mb-1">
                        Password (min 8 chars) *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          value={studentForm.password}
                          onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                          className="w-full pl-10 pr-10 py-2.5 bg-[#FFF8F0]/80 border border-[#FAD7A0] rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase tracking-wider mb-1">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          value={studentForm.confirmPassword}
                          onChange={(e) => setStudentForm({ ...studentForm, confirmPassword: e.target.value })}
                          className="w-full pl-10 pr-10 py-2.5 bg-[#FFF8F0]/80 border border-[#FAD7A0] rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* FACULTY INCHARGE FORM FIELDS */}
              {selectedType === 'FACULTY_INCHARGE' && (
                <>
                  {/* Full Name */}
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dr. V. Lakshmi"
                        value={facultyForm.fullName}
                        onChange={(e) => setFacultyForm({ ...facultyForm, fullName: e.target.value })}
                        className="w-full pl-10 pr-3 py-2.5 bg-[#FFF8F0]/80 border border-[#FAD7A0] rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Employee ID & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase tracking-wider mb-1">
                        Employee ID *
                      </label>
                      <div className="relative">
                        <Hash className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. EMP-ENG-101"
                          value={facultyForm.employeeId}
                          onChange={(e) => setFacultyForm({ ...facultyForm, employeeId: e.target.value.toUpperCase() })}
                          className="w-full pl-10 pr-3 py-2.5 bg-[#FFF8F0]/80 border border-[#FAD7A0] rounded-xl text-xs font-bold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none uppercase"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase tracking-wider mb-1">
                        Institutional Email *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          placeholder="faculty@srit.ac.in"
                          value={facultyForm.email}
                          onChange={(e) => setFacultyForm({ ...facultyForm, email: e.target.value })}
                          className="w-full pl-10 pr-3 py-2.5 bg-[#FFF8F0]/80 border border-[#FAD7A0] rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mobile & Department */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase tracking-wider mb-1">
                        Mobile Number *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          placeholder="10-digit Mobile No."
                          value={facultyForm.mobile}
                          onChange={(e) => setFacultyForm({ ...facultyForm, mobile: e.target.value })}
                          className="w-full pl-10 pr-3 py-2.5 bg-[#FFF8F0]/80 border border-[#FAD7A0] rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase tracking-wider mb-1">
                        Department *
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <select
                          value={facultyForm.department}
                          onChange={(e) => setFacultyForm({ ...facultyForm, department: e.target.value })}
                          className="w-full pl-10 pr-3 py-2.5 bg-[#FFF8F0]/80 border border-[#FAD7A0] rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
                        >
                          {DEPARTMENTS.map((dept) => (
                            <option key={dept} value={dept}>
                              {dept}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Designation */}
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase tracking-wider mb-1">
                      Designation *
                    </label>
                    <div className="relative">
                      <BookOpen className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <select
                        value={facultyForm.designation}
                        onChange={(e) => setFacultyForm({ ...facultyForm, designation: e.target.value })}
                        className="w-full pl-10 pr-3 py-2.5 bg-[#FFF8F0]/80 border border-[#FAD7A0] rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
                      >
                        {DESIGNATIONS.map((desig) => (
                          <option key={desig} value={desig}>
                            {desig}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Password & Confirm Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase tracking-wider mb-1">
                        Password (min 8 chars) *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          value={facultyForm.password}
                          onChange={(e) => setFacultyForm({ ...facultyForm, password: e.target.value })}
                          className="w-full pl-10 pr-10 py-2.5 bg-[#FFF8F0]/80 border border-[#FAD7A0] rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-extrabold text-[#2C3E50] uppercase tracking-wider mb-1">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          value={facultyForm.confirmPassword}
                          onChange={(e) => setFacultyForm({ ...facultyForm, confirmPassword: e.target.value })}
                          className="w-full pl-10 pr-10 py-2.5 bg-[#FFF8F0]/80 border border-[#FAD7A0] rounded-xl text-xs font-semibold text-[#2C3E50] focus:ring-2 focus:ring-[#D35400] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Submit Action */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#D35400] hover:bg-[#E67E22] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4 text-[#FAD7A0]" />
                  <span>{isSubmitting ? 'Submitting Registration...' : 'Submit Registration for Approval'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* STAGE 3: PENDING APPROVAL CONFIRMATION VIEW */}
        {stage === 'submitted-pending' && submittedUser && (
          <motion.div
            key="submitted-pending"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center space-y-5 py-4"
          >
            <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
              <Clock className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-[11px] font-black uppercase tracking-widest rounded-full">
                Status: PENDING_APPROVAL
              </span>
              <h3 className="text-xl font-black text-[#2C3E50]">
                Registration Received
              </h3>
              <p className="text-xs text-[#5D6D7E] max-w-md mx-auto leading-relaxed font-medium">
                Your registration has been received and is awaiting Administrator approval.
              </p>
            </div>

            {/* Registration Summary Ticket */}
            <div className="max-w-md mx-auto p-4 bg-[#FFF8F0] border border-[#FAD7A0] rounded-2xl text-left text-xs space-y-2">
              <div className="flex justify-between items-center pb-2 border-b border-[#FAD7A0]/60">
                <span className="text-[#5D6D7E] font-medium">Applicant Name:</span>
                <span className="font-bold text-[#2C3E50]">{submittedUser.fullName}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-[#FAD7A0]/60">
                <span className="text-[#5D6D7E] font-medium">Identifier / User ID:</span>
                <span className="font-mono font-bold text-[#D35400]">{submittedUser.userID}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-[#FAD7A0]/60">
                <span className="text-[#5D6D7E] font-medium">Email Address:</span>
                <span className="font-semibold text-[#2C3E50]">{submittedUser.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#5D6D7E] font-medium">Registration Category:</span>
                <span className="font-bold text-[#27AE60]">
                  {submittedUser.type === 'STUDENT' ? 'Student Registration' : 'Faculty Incharge Registration'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              {onSuccessReturnToLogin && (
                <button
                  type="button"
                  onClick={onSuccessReturnToLogin}
                  className="px-6 py-3 bg-[#D35400] hover:bg-[#E67E22] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer shadow-md"
                >
                  Return to Log In
                </button>
              )}
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-[#2C3E50] font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer"
                >
                  Close Window
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

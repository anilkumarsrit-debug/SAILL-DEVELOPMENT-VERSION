import React from 'react';
import { motion } from 'motion/react';
import { Page } from '../types';
import {
  GraduationCap,
  UserCheck,
  UserPlus,
  ArrowLeft,
  BookOpen,
  Users,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Building2
} from 'lucide-react';

interface RegisterChoicePageProps {
  onNavigate: (page: Page) => void;
}

export const RegisterChoicePage: React.FC<RegisterChoicePageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FFF8F0] via-white to-[#FFF8F0]">
      <div className="w-full max-w-4xl space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => onNavigate('landing')}
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#5D6D7E] hover:text-[#D35400] transition cursor-pointer self-start"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-600 font-medium">Already have an account?</span>
            <button
              onClick={() => onNavigate('login')}
              className="font-extrabold text-[#D35400] hover:underline cursor-pointer"
            >
              Sign In Here
            </button>
          </div>
        </div>

        {/* Page Title */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="w-14 h-14 bg-gradient-to-br from-[#D35400] to-[#E67E22] text-white rounded-2xl flex items-center justify-center mx-auto shadow-md font-black">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#2C3E50] font-heading tracking-tight">
            Select Your Registration Category
          </h2>
          <p className="text-xs sm:text-sm text-[#5D6D7E] font-medium leading-relaxed">
            SAILL R26 Communicative English Laboratory serves both First-Year Engineering Undergraduates and Faculty Incharges. Choose your institutional account type below.
          </p>
        </div>

        {/* Registration Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Card 1: Student Registration */}
          <motion.div
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            onClick={() => onNavigate('register-student')}
            className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#FAD7A0] hover:border-[#D35400] shadow-lg hover:shadow-xl transition group cursor-pointer flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-[#FFF8F0] border-b border-l border-[#FAD7A0] px-3 py-1 rounded-bl-2xl text-[10px] font-extrabold text-[#D35400] uppercase font-mono">
              Student Enrollment
            </div>

            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] text-[#D35400] flex items-center justify-center group-hover:bg-[#D35400] group-hover:text-white transition">
                <GraduationCap className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-xl font-black text-[#2C3E50] font-heading group-hover:text-[#D35400] transition flex items-center gap-2">
                  <span>Student Registration</span>
                  <ChevronRight className="w-5 h-5 text-[#D35400] opacity-0 group-hover:opacity-100 transition -translate-x-2 group-hover:translate-x-0" />
                </h3>
                <p className="text-xs text-[#5D6D7E] mt-1.5 leading-relaxed">
                  For B.Tech first-year engineering students enrolling in the SAILL R26 Communicative English Laboratory.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-gray-600 pt-2 border-t border-[#FAD7A0]/60">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D35400] shrink-0" />
                  <span>Automatic Batch & Academic Section Assignment</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D35400] shrink-0" />
                  <span>Instant access to 12 AI Speech & Phonetic Modules</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D35400] shrink-0" />
                  <span>Personal IndexedDB Digital Learning Portfolio</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <button
                type="button"
                className="w-full py-3 px-4 bg-[#FFF8F0] border-2 border-[#D35400] text-[#D35400] group-hover:bg-[#D35400] group-hover:text-white font-black text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Complete Student Enrollment</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Card 2: Faculty Incharge Registration */}
          <motion.div
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            onClick={() => onNavigate('register-faculty')}
            className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#FAD7A0] hover:border-[#2C3E50] shadow-lg hover:shadow-xl transition group cursor-pointer flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-[#FFF8F0] border-b border-l border-[#FAD7A0] px-3 py-1 rounded-bl-2xl text-[10px] font-extrabold text-[#2C3E50] uppercase font-mono">
              Faculty Access
            </div>

            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] text-[#2C3E50] flex items-center justify-center group-hover:bg-[#2C3E50] group-hover:text-white transition">
                <UserCheck className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-xl font-black text-[#2C3E50] font-heading group-hover:text-[#2C3E50] transition flex items-center gap-2">
                  <span>Faculty Incharge Registration</span>
                  <ChevronRight className="w-5 h-5 text-[#2C3E50] opacity-0 group-hover:opacity-100 transition -translate-x-2 group-hover:translate-x-0" />
                </h3>
                <p className="text-xs text-[#5D6D7E] mt-1.5 leading-relaxed">
                  For faculty members and batch incharges managing student batches, continuous evaluations, and digital attendance.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-gray-600 pt-2 border-t border-[#FAD7A0]/60">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2C3E50] shrink-0" />
                  <span>Submitted for Administrator Verification & Approval</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2C3E50] shrink-0" />
                  <span>Batch Scope, CO-PO Analytics & Mark Calculation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2C3E50] shrink-0" />
                  <span>Digital Attendance & Student Portfolio Review</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <button
                type="button"
                className="w-full py-3 px-4 bg-[#FFF8F0] border-2 border-[#2C3E50] text-[#2C3E50] group-hover:bg-[#2C3E50] group-hover:text-white font-black text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Register as Faculty Incharge</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Institutional Assurance */}
        <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#FAD7A0] flex items-center justify-between text-xs text-[#5D6D7E]">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#D35400] shrink-0" />
            <span className="font-semibold">Department of Humanities & Sciences (English), SRIT Autonomous</span>
          </div>
          <span className="font-bold text-[#D35400] hidden sm:block">R26 Regulations</span>
        </div>
      </div>
    </div>
  );
};

export default RegisterChoicePage;
